# co-op.care Time Bank — Database & Setup Guide

## What this is

The co-op.care Time Bank is a community currency layer running alongside the $59/month cash subscription. Members earn Care Hours (CH) by helping neighbors with Tier 1 services (companionship, transportation, meals, errands, tech assistance). They spend Care Hours to receive help, or apply them toward their monthly membership.

**Legal status:** This system requires attorney review of IRS tax treatment (barter exchange rules vs. time bank precedent) and Colorado home care licensing (Class B license boundary) before any public launch. See `/Projects/01 - Family Care Coop/Current/Time-Bank-Strategy-April2026.md` for the full legal analysis.

---

## Schema overview

Five primary tables plus supporting tables:

| Table | Purpose |
|---|---|
| `care_hours_accounts` | One row per member — balance, tier, lifetime stats |
| `care_hours_transactions` | Every exchange — pending → confirmed via dual confirmation |
| `care_hours_services` | Lookup: service names, Tier 1 vs Tier 2, background check requirement |
| `time_bank_profiles` | Helper profiles: services offered, availability, verification |
| `care_hours_redemptions` | When a member redeems CH toward their $59/mo subscription |
| `care_hours_subscription_bonus` | Monthly 5 CH bonus for paying subscribers |
| `time_bank_match_requests` | Families request help → admin reviews and matches for MVP |
| `care_hours_velocity_flags` | Auto-flagged transactions for admin review |

---

## How to run the schema

### Option 1: Supabase SQL Editor (fastest for MVP)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Paste the contents of `db/time-bank-schema.sql`
4. Run — all tables, RLS policies, indexes, and the `confirm_care_hours_transaction()` function will be created

### Option 2: Supabase CLI

```bash
# From the coop-care-site directory
supabase db push
# Or for a one-off migration:
supabase migration new time_bank
# Paste schema into migrations/[timestamp]_time_bank.sql
supabase db push
```

---

## Environment variables

Add these to your `.env.local` (and Vercel environment variables):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # API routes only, never client-side

# Time Bank admin panel password
TIME_BANK_ADMIN_SECRET=your-strong-password-here
```

---

## Wiring Supabase into the API routes

The MVP API routes (`/app/api/time-bank/`) currently write to local JSON files (`.json` files in the project root). This lets the UI work without a database during development.

To wire Supabase, replace the file I/O blocks with Supabase client calls. Each route has a comment indicating the equivalent Supabase operation.

### Install the Supabase client

```bash
npm install @supabase/supabase-js
```

### Example: Replace file I/O in `/api/time-bank/account/route.ts`

```typescript
// Before (file I/O)
const filePath = path.join(process.cwd(), "time-bank-accounts.json");
let accounts = [];
const raw = await fs.readFile(filePath, "utf-8");
accounts = JSON.parse(raw);

// After (Supabase)
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const { data: account } = await supabase
  .from("care_hours_accounts")
  .select("*")
  .eq("user_id", userId)
  .single();
```

### Confirm transaction (use the stored function)

The `confirm_care_hours_transaction()` PostgreSQL function handles the atomic balance transfer. Call it via RPC:

```typescript
const { data, error } = await supabase.rpc("confirm_care_hours_transaction", {
  p_transaction_id: transactionId,
  p_confirming_user_id: confirmingUserId,
});
```

---

## Care Hours rules (from the strategy brief)

| Rule | Value |
|---|---|
| Exchange rate | 1 hour = 1 Care Hour (no weighting by service type) |
| Balance cap | 100 CH maximum per member |
| Monthly redemption cap | 6 CH per month against $59/mo subscription |
| Internal conversion rate | 1 CH = $10 (NOT public-facing) |
| Expiry | CH expire after 18 months of account inactivity |
| Dual confirmation window | Both parties must confirm within 48 hours |
| Velocity flag threshold | Single transaction > 4 hours, or > 30 CH in one week |
| Paying member bonus | 5 CH credited monthly to $59/mo subscribers |

---

## Tier 1 vs Tier 2 services

**Tier 1 (MVP-enabled through time bank):**
- Companionship visit
- Transportation
- Meal preparation
- Grocery shopping / errands
- Technology assistance
- Light housekeeping
- Reading / correspondence

**Tier 2 (DISABLED — must route through licensed co-op.care caregivers):**
- Personal care (bathing, transfers, toileting)
- Medication reminders
- Wound care

The API layer enforces this at `POST /api/time-bank/transaction`. Tier 2 requests return HTTP 422 with an explanation directing the family to the licensed caregiver matching flow.

---

## Background check policy (from Colorado requirements)

| Service | Check required |
|---|---|
| Digital contributions | No |
| Group / community activities | References only |
| Companionship visits with elder members | CBI + CAPS |
| Transportation for elder members | CBI + CAPS + MVR |
| Hands-on personal care | Not available through time bank |

The `time_bank_profiles.needs_background_check` flag is set automatically based on services offered. Background check clearance is enforced in the admin panel before Phase 1 in-person exchanges begin.

---

## Admin panel

URL: `/admin/time-bank`

Password: set `TIME_BANK_ADMIN_SECRET` in `.env.local`

Capabilities:
- View all accounts, balances, suspension status
- View all transactions, filter by pending/flagged
- Admin-confirm transactions when both parties have verbally confirmed
- View open match requests
- Manually assign a helper to a match request
- View helper roster with verification and background check status

---

## Phase 2: Moving to automated matching

For MVP, all matching is manual via the admin panel. In Phase 2 (50+ members), the match engine should:

1. Query `time_bank_profiles` for helpers offering the requested service
2. Filter by `location_zip` proximity (use PostGIS or a ZIP-to-coordinates lookup)
3. Check `availability` JSON for day/time overlap with the request
4. Rank by `avg_rating DESC`, `total_hours_given DESC`
5. Notify the top 3 matches via Twilio SMS
6. First to accept gets the match

---

## Known gaps before production

- [ ] Supabase auth integration (replace `user_id` mock with `auth.uid()`)
- [ ] Twilio SMS notifications for match confirmations
- [ ] Monthly subscription bonus cron job (5 CH for active $59/mo subscribers)
- [ ] CH expiry cron job (mark inactive balances, send warning 30 days before)
- [ ] Stripe credit note creation when CH are redeemed against subscription
- [ ] Attorney opinion on IRS tax treatment of Care Hour redemptions
- [ ] Attorney review of participant agreement language
- [ ] Colorado Class B license application
- [ ] Volunteer accident insurance policy (covers time bank contributors)
