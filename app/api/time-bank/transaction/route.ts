import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

// POST /api/time-bank/transaction
// Creates a pending transaction (match request or direct transaction).
// MVP: writes to local JSON. Replace with Supabase insert once env vars are set.
// Safety: Tier 2 (hands-on) services are rejected at this layer.

const TIER1_SERVICE_IDS = [
  "companionship",
  "transportation",
  "meals",
  "errands",
  "tech",
  "housekeeping",
  "reading",
  // Full service names also accepted
  "Companionship visit",
  "Transportation",
  "Meal preparation",
  "Grocery shopping / errands",
  "Technology assistance",
  "Light housekeeping",
  "Reading / correspondence",
];

const TIER2_SERVICE_IDS = [
  "personal_care",
  "bathing",
  "transfers",
  "medication",
  "wound_care",
  "Personal care (bathing)",
  "Personal care (transfers)",
  "Medication reminders",
  "Wound care",
];

interface MatchRequestPayload {
  action: "match_request";
  service_type: string;
  urgency: "today" | "this_week" | "this_month";
  description: string;
  estimated_hours: number;
  requester_user_id?: string;
}

interface DirectTransactionPayload {
  action: "direct";
  from_user_id: string;
  to_user_id: string;
  service_type: string;
  hours: number;
  notes?: string;
  scheduled_for?: string;
}

type TransactionPayload = MatchRequestPayload | DirectTransactionPayload;

export async function POST(request: NextRequest) {
  try {
    const body: TransactionPayload = await request.json();

    // Safety check: reject Tier 2 services at API layer
    const serviceType = body.action === "match_request"
      ? (body as MatchRequestPayload).service_type
      : (body as DirectTransactionPayload).service_type;

    if (TIER2_SERVICE_IDS.some((s) => serviceType.toLowerCase().includes(s.toLowerCase()))) {
      return NextResponse.json({
        error: "Hands-on personal care services are not available through the Care Hours time bank. These services require co-op.care licensed caregivers. Please start a free assessment at /assess to be matched with a licensed caregiver.",
        tier2_blocked: true,
      }, { status: 422 });
    }

    if (!TIER1_SERVICE_IDS.some((s) => serviceType.toLowerCase().includes(s.toLowerCase()))) {
      return NextResponse.json({
        error: "Service type not recognized. Please select from the available Tier 1 services.",
      }, { status: 400 });
    }

    if (body.action === "match_request") {
      const payload = body as MatchRequestPayload;

      if (!payload.description || payload.description.trim().length < 10) {
        return NextResponse.json({ error: "Description must be at least 10 characters." }, { status: 400 });
      }
      if (!["today", "this_week", "this_month"].includes(payload.urgency)) {
        return NextResponse.json({ error: "Invalid urgency value." }, { status: 400 });
      }
      if (payload.estimated_hours <= 0 || payload.estimated_hours > 24) {
        return NextResponse.json({ error: "Estimated hours must be between 0.5 and 24." }, { status: 400 });
      }

      const matchRequestId = randomUUID();
      const record = {
        id: matchRequestId,
        action: "match_request",
        requester_user_id: payload.requester_user_id || null,
        service_type: payload.service_type,
        urgency: payload.urgency,
        description: payload.description.trim(),
        estimated_hours: payload.estimated_hours,
        status: "open",
        admin_notes: null,
        matched_helper_id: null,
        transaction_id: null,
        created_at: new Date().toISOString(),
      };

      const filePath = path.join(process.cwd(), "time-bank-match-requests.json");
      let requests: typeof record[] = [];
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        requests = JSON.parse(raw);
      } catch {
        // File doesn't exist yet
      }
      requests.push(record);
      await fs.writeFile(filePath, JSON.stringify(requests, null, 2));

      return NextResponse.json({ success: true, matchRequestId }, { status: 201 });
    }

    if (body.action === "direct") {
      const payload = body as DirectTransactionPayload;

      if (!payload.from_user_id || !payload.to_user_id) {
        return NextResponse.json({ error: "from_user_id and to_user_id required." }, { status: 400 });
      }
      if (payload.from_user_id === payload.to_user_id) {
        return NextResponse.json({ error: "You cannot create a transaction with yourself." }, { status: 400 });
      }
      if (!payload.hours || payload.hours <= 0 || payload.hours > 24) {
        return NextResponse.json({ error: "Hours must be between 0.5 and 24." }, { status: 400 });
      }

      // Velocity check: flag single transaction > 4 hours
      const adminFlag = payload.hours > 4;

      const txId = randomUUID();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      const transaction = {
        id: txId,
        from_user_id: payload.from_user_id,
        to_user_id: payload.to_user_id,
        service_type: payload.service_type,
        hours: payload.hours,
        status: "pending",
        helper_confirmed: false,
        receiver_confirmed: false,
        notes: payload.notes || null,
        scheduled_for: payload.scheduled_for || null,
        admin_flagged: adminFlag,
        admin_flag_reason: adminFlag ? "single_transaction_over_4hrs" : null,
        created_at: new Date().toISOString(),
        expires_at: expiresAt,
      };

      const filePath = path.join(process.cwd(), "time-bank-transactions.json");
      let transactions: typeof transaction[] = [];
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        transactions = JSON.parse(raw);
      } catch {
        // File doesn't exist yet
      }
      transactions.push(transaction);
      await fs.writeFile(filePath, JSON.stringify(transactions, null, 2));

      return NextResponse.json({ success: true, transactionId: txId }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    console.error("POST /api/time-bank/transaction error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const status = searchParams.get("status");

    const filePath = path.join(process.cwd(), "time-bank-transactions.json");
    let transactions: Record<string, unknown>[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      transactions = JSON.parse(raw);
    } catch {
      return NextResponse.json({ transactions: [] });
    }

    if (userId) {
      transactions = transactions.filter(
        (t) => t.from_user_id === userId || t.to_user_id === userId
      );
    }
    if (status) {
      transactions = transactions.filter((t) => t.status === status);
    }

    return NextResponse.json({ transactions });
  } catch (err) {
    console.error("GET /api/time-bank/transaction error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
