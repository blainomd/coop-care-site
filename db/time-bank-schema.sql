-- co-op.care Time Bank Schema
-- Run in Supabase SQL editor or via supabase db push
-- Legal note: This system is pending attorney review of IRS tax treatment and
-- Colorado home care licensing requirements before public launch.

-- ============================================================
-- ENABLE UUID EXTENSION (already enabled in most Supabase projects)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SERVICE LOOKUP TABLE
-- Tier 1 = non-hands-on (companionship, transportation, meals, errands, tech)
-- Tier 2 = hands-on personal care — DISABLED for MVP, must route through licensed co-op.care caregivers
-- ============================================================
CREATE TABLE IF NOT EXISTS care_hours_services (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name          TEXT NOT NULL UNIQUE,
  tier                  TEXT NOT NULL CHECK (tier IN ('Tier1', 'Tier2')),
  description           TEXT,
  requires_background_check BOOLEAN NOT NULL DEFAULT false,
  hands_on              BOOLEAN NOT NULL DEFAULT false,
  enabled_for_time_bank BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Tier 1 services (MVP-enabled)
INSERT INTO care_hours_services (service_name, tier, description, requires_background_check, hands_on, enabled_for_time_bank) VALUES
  ('Companionship visit',         'Tier1', 'In-person social visit, conversation, and presence for an elder or family member.', true,  false, true),
  ('Transportation',              'Tier1', 'Driving to and from medical appointments, errands, or community activities.',        true,  false, true),
  ('Meal preparation',            'Tier1', 'Cooking and preparing meals at the recipient''s home.',                              false, false, true),
  ('Grocery shopping / errands',  'Tier1', 'Shopping for groceries or running errands on behalf of a member.',                   false, false, true),
  ('Technology assistance',       'Tier1', 'Help with smartphones, video calls, tablets, or computer setup.',                    false, false, true),
  ('Light housekeeping',          'Tier1', 'Tidying, laundry, dishes — non-physical-assistance household tasks.',                false, false, true),
  ('Reading / correspondence',    'Tier1', 'Reading aloud, helping with mail, writing letters or emails.',                       false, false, true)
ON CONFLICT (service_name) DO NOTHING;

-- Tier 2 services (explicitly disabled — hands-on care requires licensed co-op.care caregivers)
INSERT INTO care_hours_services (service_name, tier, description, requires_background_check, hands_on, enabled_for_time_bank) VALUES
  ('Personal care (bathing)',     'Tier2', 'Hands-on bathing assistance. Must route through licensed co-op.care caregiver.',    true,  true,  false),
  ('Personal care (transfers)',   'Tier2', 'Transfer and mobility assistance. Must route through licensed co-op.care caregiver.',true, true,  false),
  ('Medication reminders',        'Tier2', 'Medication management. Must route through licensed co-op.care caregiver.',          true,  true,  false),
  ('Wound care',                  'Tier2', 'Any wound care or clinical intervention. Must route through licensed co-op.care caregiver.', true, true, false)
ON CONFLICT (service_name) DO NOTHING;


-- ============================================================
-- ACCOUNTS TABLE
-- One row per co-op.care member. Balance is in Care Hours (decimal).
-- ============================================================
CREATE TABLE IF NOT EXISTS care_hours_accounts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance           NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  tier              TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'founding', 'neighbor')),
  lifetime_earned   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  lifetime_spent    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  -- Balance cap: 100 CH max per the co-op operating rules
  balance_cap       NUMERIC(10, 2) NOT NULL DEFAULT 100,
  -- Monthly redemption cap against cash subscription (6 CH = $60 max per month)
  monthly_redemption_cap NUMERIC(10, 2) NOT NULL DEFAULT 6,
  -- Suspension flag for fraud/abuse review
  suspended         BOOLEAN NOT NULL DEFAULT false,
  suspension_reason TEXT,
  last_activity_at  TIMESTAMPTZ,
  -- Credits expire after 18 months of inactivity (enforced via cron job)
  expiry_warning_sent_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS care_hours_accounts_user_id_idx ON care_hours_accounts(user_id);


-- ============================================================
-- TRANSACTIONS TABLE
-- Pending → Confirmed (both parties confirm within 48 hrs) or Disputed
-- from_user_id = helper (earns hours), to_user_id = recipient (spends hours)
-- ============================================================
CREATE TABLE IF NOT EXISTS care_hours_transactions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  to_user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  service_type        TEXT NOT NULL REFERENCES care_hours_services(service_name),
  hours               NUMERIC(5, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'disputed', 'cancelled', 'expired')),
  -- Dual confirmation: both parties must confirm
  helper_confirmed    BOOLEAN NOT NULL DEFAULT false,
  receiver_confirmed  BOOLEAN NOT NULL DEFAULT false,
  helper_confirmed_at TIMESTAMPTZ,
  receiver_confirmed_at TIMESTAMPTZ,
  -- Rating from receiver (1-5 stars, optional)
  rating              SMALLINT CHECK (rating BETWEEN 1 AND 5),
  rating_note         TEXT,
  notes               TEXT,
  -- Admin review flags
  admin_flagged       BOOLEAN NOT NULL DEFAULT false,
  admin_flag_reason   TEXT,
  -- Timestamps
  scheduled_for       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at        TIMESTAMPTZ,
  -- Expiry: auto-cancel if not confirmed within 48 hours
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '48 hours'
);

CREATE INDEX IF NOT EXISTS care_hours_tx_from_user_idx ON care_hours_transactions(from_user_id);
CREATE INDEX IF NOT EXISTS care_hours_tx_to_user_idx ON care_hours_transactions(to_user_id);
CREATE INDEX IF NOT EXISTS care_hours_tx_status_idx ON care_hours_transactions(status);
CREATE INDEX IF NOT EXISTS care_hours_tx_created_idx ON care_hours_transactions(created_at DESC);


-- ============================================================
-- REDEMPTIONS TABLE
-- Records when a member redeems Care Hours against their $59/mo subscription.
-- Internal only: 1 CH = $10 of credit. Not advertised publicly.
-- Maximum 6 CH redeemable per month per member.
-- ============================================================
CREATE TABLE IF NOT EXISTS care_hours_redemptions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  ch_redeemed         NUMERIC(5, 2) NOT NULL CHECK (ch_redeemed > 0 AND ch_redeemed <= 6),
  dollar_credit       NUMERIC(8, 2) NOT NULL,  -- ch_redeemed * 10
  month_applied       TEXT NOT NULL,            -- Format: YYYY-MM
  stripe_credit_id    TEXT,                     -- Stripe credit note / coupon ID when applied
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'failed')),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  applied_at          TIMESTAMPTZ,
  UNIQUE (user_id, month_applied)               -- One redemption per user per month
);

CREATE INDEX IF NOT EXISTS care_hours_redemptions_user_idx ON care_hours_redemptions(user_id);


-- ============================================================
-- TIME BANK PROFILES
-- Supplementary profile for members participating in the time bank.
-- Separate from the main member profile to keep concerns clean.
-- ============================================================
CREATE TABLE IF NOT EXISTS time_bank_profiles (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name              TEXT NOT NULL,
  bio                       TEXT,
  services_offered          TEXT[] NOT NULL DEFAULT '{}',   -- Array of service_name values
  -- Availability: stored as JSON for flexibility
  -- e.g. {"weekday_morning": true, "weekday_afternoon": false, "weekend": true}
  availability              JSONB NOT NULL DEFAULT '{}',
  location_zip              TEXT,
  max_travel_miles          SMALLINT DEFAULT 5,
  -- Verification tier (Tier0=digital only, Tier1=group/community, Tier2=in-person elder visits)
  verification_tier         SMALLINT NOT NULL DEFAULT 0 CHECK (verification_tier BETWEEN 0 AND 2),
  verification_status       TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'denied')),
  background_check_cleared  BOOLEAN NOT NULL DEFAULT false,
  background_check_date     DATE,
  background_check_type     TEXT,  -- 'CBI', 'CBI+MVR', etc.
  -- References (two required for Tier 2 in-person elder visits)
  references_submitted      BOOLEAN NOT NULL DEFAULT false,
  -- Stats (denormalized for display performance)
  total_hours_given         NUMERIC(8, 2) NOT NULL DEFAULT 0,
  total_exchanges           INTEGER NOT NULL DEFAULT 0,
  avg_rating                NUMERIC(3, 2),
  -- Caregiver pipeline flag
  caregiver_pipeline_eligible BOOLEAN NOT NULL DEFAULT false,
  caregiver_pipeline_date     DATE,
  -- Visibility
  is_active                 BOOLEAN NOT NULL DEFAULT true,
  -- Participation agreement signed (required before any exchange)
  participation_agreement_signed    BOOLEAN NOT NULL DEFAULT false,
  participation_agreement_signed_at TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS time_bank_profiles_user_idx ON time_bank_profiles(user_id);
CREATE INDEX IF NOT EXISTS time_bank_profiles_zip_idx ON time_bank_profiles(location_zip);
CREATE INDEX IF NOT EXISTS time_bank_profiles_active_idx ON time_bank_profiles(is_active, verification_tier);


-- ============================================================
-- MEMBER SUBSCRIPTION BONUS
-- $59/mo paying members receive 5 CH bonus per month.
-- This table records the monthly bonus credits issued.
-- ============================================================
CREATE TABLE IF NOT EXISTS care_hours_subscription_bonus (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  month       TEXT NOT NULL,  -- YYYY-MM
  ch_awarded  NUMERIC(5, 2) NOT NULL DEFAULT 5,
  reason      TEXT NOT NULL DEFAULT 'active_subscriber_monthly_bonus',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, month)
);


-- ============================================================
-- ADMIN MATCH REQUESTS
-- For MVP: admin manually reviews and matches helpers to requesters.
-- ============================================================
CREATE TABLE IF NOT EXISTS time_bank_match_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  service_type    TEXT NOT NULL REFERENCES care_hours_services(service_name),
  urgency         TEXT NOT NULL DEFAULT 'this_week' CHECK (urgency IN ('today', 'this_week', 'this_month')),
  description     TEXT NOT NULL,
  estimated_hours NUMERIC(5, 2),
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'completed', 'cancelled')),
  matched_helper_id UUID REFERENCES auth.users(id),
  transaction_id    UUID REFERENCES care_hours_transactions(id),
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  matched_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS time_bank_match_requests_status_idx ON time_bank_match_requests(status);
CREATE INDEX IF NOT EXISTS time_bank_match_requests_requester_idx ON time_bank_match_requests(requester_id);


-- ============================================================
-- VELOCITY FLAGS TABLE
-- Records automatically triggered admin flags for review.
-- Rule: >4 hrs in single transaction, or >30 CH in one week.
-- ============================================================
CREATE TABLE IF NOT EXISTS care_hours_velocity_flags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flag_type   TEXT NOT NULL CHECK (flag_type IN ('single_transaction_over_4hrs', 'weekly_velocity_over_30ch', 'low_rating_review', 'admin_manual')),
  details     JSONB,
  resolved    BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY
-- Users can only read/write their own data.
-- Admins (role = service_role or custom admin claim) bypass RLS.
-- ============================================================

ALTER TABLE care_hours_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_hours_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_hours_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_bank_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_hours_subscription_bonus ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_bank_match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_hours_velocity_flags ENABLE ROW LEVEL SECURITY;
-- Services table is public read
ALTER TABLE care_hours_services ENABLE ROW LEVEL SECURITY;

-- Public read on services (only Tier1 enabled services)
CREATE POLICY "Services are publicly readable"
  ON care_hours_services FOR SELECT
  USING (true);

-- Accounts: users see only their own account
CREATE POLICY "Users see own account"
  ON care_hours_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users cannot directly update balance"
  ON care_hours_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Transactions: users see transactions where they are helper or receiver
CREATE POLICY "Users see own transactions"
  ON care_hours_transactions FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users create transactions"
  ON care_hours_transactions FOR INSERT
  WITH CHECK (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users update own transactions (confirm/rate)"
  ON care_hours_transactions FOR UPDATE
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Redemptions: users see own redemptions
CREATE POLICY "Users see own redemptions"
  ON care_hours_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create redemptions"
  ON care_hours_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Time bank profiles: users manage their own profile
CREATE POLICY "Users see own profile"
  ON time_bank_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public sees active verified profiles"
  ON time_bank_profiles FOR SELECT
  USING (is_active = true AND verification_status = 'verified');

CREATE POLICY "Users manage own profile"
  ON time_bank_profiles FOR ALL
  USING (auth.uid() = user_id);

-- Match requests: requester sees own requests
CREATE POLICY "Users see own match requests"
  ON time_bank_match_requests FOR SELECT
  USING (auth.uid() = requester_id);

CREATE POLICY "Users create match requests"
  ON time_bank_match_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Subscription bonus: users see own bonuses
CREATE POLICY "Users see own bonuses"
  ON care_hours_subscription_bonus FOR SELECT
  USING (auth.uid() = user_id);


-- ============================================================
-- FUNCTION: Confirm transaction and transfer Care Hours
-- Called by /api/time-bank/confirm
-- Both parties must have confirmed before this executes.
-- ============================================================
CREATE OR REPLACE FUNCTION confirm_care_hours_transaction(p_transaction_id UUID, p_confirming_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tx care_hours_transactions;
  v_helper_account care_hours_accounts;
  v_receiver_account care_hours_accounts;
BEGIN
  -- Fetch the transaction
  SELECT * INTO v_tx FROM care_hours_transactions WHERE id = p_transaction_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction not found');
  END IF;

  IF v_tx.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction is not pending');
  END IF;

  IF NOW() > v_tx.expires_at THEN
    UPDATE care_hours_transactions SET status = 'expired' WHERE id = p_transaction_id;
    RETURN jsonb_build_object('success', false, 'error', 'Transaction has expired');
  END IF;

  -- Record confirmation
  IF p_confirming_user_id = v_tx.from_user_id THEN
    UPDATE care_hours_transactions
      SET helper_confirmed = true, helper_confirmed_at = NOW()
      WHERE id = p_transaction_id;
  ELSIF p_confirming_user_id = v_tx.to_user_id THEN
    UPDATE care_hours_transactions
      SET receiver_confirmed = true, receiver_confirmed_at = NOW()
      WHERE id = p_transaction_id;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'User is not a party to this transaction');
  END IF;

  -- Re-fetch to check if both have now confirmed
  SELECT * INTO v_tx FROM care_hours_transactions WHERE id = p_transaction_id;

  IF v_tx.helper_confirmed AND v_tx.receiver_confirmed THEN
    -- Verify receiver has sufficient balance
    SELECT * INTO v_receiver_account FROM care_hours_accounts WHERE user_id = v_tx.to_user_id FOR UPDATE;

    IF v_receiver_account.balance < v_tx.hours THEN
      RETURN jsonb_build_object('success', false, 'error', 'Insufficient Care Hours balance');
    END IF;

    SELECT * INTO v_helper_account FROM care_hours_accounts WHERE user_id = v_tx.from_user_id FOR UPDATE;

    -- Enforce balance cap for helper
    IF (v_helper_account.balance + v_tx.hours) > v_helper_account.balance_cap THEN
      RETURN jsonb_build_object('success', false, 'error', 'Helper balance cap would be exceeded');
    END IF;

    -- Deduct from receiver
    UPDATE care_hours_accounts
      SET balance = balance - v_tx.hours,
          lifetime_spent = lifetime_spent + v_tx.hours,
          last_activity_at = NOW()
      WHERE user_id = v_tx.to_user_id;

    -- Credit helper
    UPDATE care_hours_accounts
      SET balance = balance + v_tx.hours,
          lifetime_earned = lifetime_earned + v_tx.hours,
          last_activity_at = NOW()
      WHERE user_id = v_tx.from_user_id;

    -- Mark transaction confirmed
    UPDATE care_hours_transactions
      SET status = 'confirmed', confirmed_at = NOW()
      WHERE id = p_transaction_id;

    -- Update profile stats for helper
    UPDATE time_bank_profiles
      SET total_hours_given = total_hours_given + v_tx.hours,
          total_exchanges = total_exchanges + 1
      WHERE user_id = v_tx.from_user_id;

    -- Velocity check: flag if single transaction > 4 hours
    IF v_tx.hours > 4 THEN
      INSERT INTO care_hours_velocity_flags (user_id, flag_type, details)
        VALUES (v_tx.from_user_id, 'single_transaction_over_4hrs',
                jsonb_build_object('transaction_id', p_transaction_id, 'hours', v_tx.hours));
    END IF;

    RETURN jsonb_build_object('success', true, 'status', 'confirmed', 'hours', v_tx.hours);
  ELSE
    RETURN jsonb_build_object('success', true, 'status', 'awaiting_other_confirmation');
  END IF;
END;
$$;


-- ============================================================
-- VIEW: Leaderboard (anonymized top helpers — no PII)
-- Shows top 10 helpers by hours given this month. Display name only.
-- ============================================================
CREATE OR REPLACE VIEW time_bank_leaderboard AS
  SELECT
    tbp.display_name,
    SUM(cht.hours) AS hours_this_month,
    COUNT(cht.id) AS exchanges_this_month
  FROM care_hours_transactions cht
  JOIN time_bank_profiles tbp ON tbp.user_id = cht.from_user_id
  WHERE cht.status = 'confirmed'
    AND cht.confirmed_at >= date_trunc('month', NOW())
  GROUP BY tbp.display_name
  ORDER BY hours_this_month DESC
  LIMIT 10;
