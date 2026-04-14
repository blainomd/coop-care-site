import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// POST /api/time-bank/confirm
// Records a party's confirmation of an exchange.
// When both helper and receiver confirm, executes the Care Hours transfer.
// MVP: operates on local JSON files. Replace with Supabase RPC confirm_care_hours_transaction() call.

interface Transaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  service_type: string;
  hours: number;
  status: string;
  helper_confirmed: boolean;
  receiver_confirmed: boolean;
  helper_confirmed_at: string | null;
  receiver_confirmed_at: string | null;
  rating?: number | null;
  rating_note?: string | null;
  confirmed_at: string | null;
  expires_at: string;
  admin_flagged: boolean;
  admin_flag_reason: string | null;
}

interface Account {
  user_id: string;
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  balance_cap: number;
  suspended: boolean;
  last_activity_at?: string;
}

interface ConfirmPayload {
  transaction_id: string;
  confirming_user_id?: string;  // In production this comes from session/JWT
  rating?: number | null;
  rating_note?: string | null;
}

async function readJSON<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmPayload = await request.json();

    if (!body.transaction_id) {
      return NextResponse.json({ error: "transaction_id required." }, { status: 400 });
    }

    const txPath = path.join(process.cwd(), "time-bank-transactions.json");
    const acctPath = path.join(process.cwd(), "time-bank-accounts.json");

    const transactions = await readJSON<Transaction[]>(txPath, []);
    const accounts = await readJSON<Account[]>(acctPath, []);

    const txIndex = transactions.findIndex((t) => t.id === body.transaction_id);
    if (txIndex === -1) {
      return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
    }

    const tx = transactions[txIndex];

    if (tx.status !== "pending") {
      return NextResponse.json({ error: `Transaction is already ${tx.status}.` }, { status: 409 });
    }

    // Check expiry
    if (new Date() > new Date(tx.expires_at)) {
      transactions[txIndex].status = "expired";
      await writeJSON(txPath, transactions);
      return NextResponse.json({ error: "Transaction has expired. Both parties must confirm within 48 hours." }, { status: 410 });
    }

    // In MVP, confirming_user_id comes from payload.
    // In production, derive from Supabase auth session.
    const confirmingUserId = body.confirming_user_id;

    if (!confirmingUserId) {
      // If no user ID provided, we assume both parties confirmed (admin-triggered)
      tx.helper_confirmed = true;
      tx.receiver_confirmed = true;
    } else if (confirmingUserId === tx.from_user_id) {
      tx.helper_confirmed = true;
      tx.helper_confirmed_at = new Date().toISOString();
    } else if (confirmingUserId === tx.to_user_id) {
      tx.receiver_confirmed = true;
      tx.receiver_confirmed_at = new Date().toISOString();
      // Record rating from receiver
      if (body.rating) {
        tx.rating = body.rating;
        tx.rating_note = body.rating_note || null;
      }
    } else {
      return NextResponse.json({ error: "User is not a party to this transaction." }, { status: 403 });
    }

    // Check if both have confirmed
    if (tx.helper_confirmed && tx.receiver_confirmed) {
      // Find accounts
      const helperAcctIndex = accounts.findIndex((a) => a.user_id === tx.from_user_id);
      const receiverAcctIndex = accounts.findIndex((a) => a.user_id === tx.to_user_id);

      if (receiverAcctIndex !== -1) {
        const receiver = accounts[receiverAcctIndex];
        if (receiver.balance < tx.hours) {
          return NextResponse.json({ error: "Insufficient Care Hours balance." }, { status: 409 });
        }
        if (receiver.suspended) {
          return NextResponse.json({ error: "Recipient account is suspended." }, { status: 403 });
        }
        // Deduct from receiver
        accounts[receiverAcctIndex].balance = Math.round((receiver.balance - tx.hours) * 100) / 100;
        accounts[receiverAcctIndex].lifetime_spent = Math.round((receiver.lifetime_spent + tx.hours) * 100) / 100;
        accounts[receiverAcctIndex].last_activity_at = new Date().toISOString();
      }

      if (helperAcctIndex !== -1) {
        const helper = accounts[helperAcctIndex];
        const newBalance = helper.balance + tx.hours;
        if (newBalance > helper.balance_cap) {
          return NextResponse.json({ error: "Helper balance cap (100 CH) would be exceeded." }, { status: 409 });
        }
        // Credit helper
        accounts[helperAcctIndex].balance = Math.round(newBalance * 100) / 100;
        accounts[helperAcctIndex].lifetime_earned = Math.round((helper.lifetime_earned + tx.hours) * 100) / 100;
        accounts[helperAcctIndex].last_activity_at = new Date().toISOString();
      }

      tx.status = "confirmed";
      tx.confirmed_at = new Date().toISOString();

      await writeJSON(acctPath, accounts);
      await writeJSON(txPath, transactions);

      // Low rating flag
      if (tx.rating && tx.rating <= 2) {
        const flagPath = path.join(process.cwd(), "time-bank-flags.json");
        const flags = await readJSON<Record<string, unknown>[]>(flagPath, []);
        flags.push({
          user_id: tx.from_user_id,
          flag_type: "low_rating_review",
          transaction_id: tx.id,
          rating: tx.rating,
          created_at: new Date().toISOString(),
        });
        await writeJSON(flagPath, flags);
      }

      return NextResponse.json({ success: true, status: "confirmed", hours: tx.hours });
    }

    // Only one party confirmed so far
    transactions[txIndex] = tx;
    await writeJSON(txPath, transactions);

    return NextResponse.json({ success: true, status: "awaiting_other_confirmation" });
  } catch (err) {
    console.error("POST /api/time-bank/confirm error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// GET /api/time-bank/confirm?id=xxx — fetch a transaction for confirmation page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required." }, { status: 400 });
    }

    const txPath = path.join(process.cwd(), "time-bank-transactions.json");
    const transactions = await readJSON<Transaction[]>(txPath, []);
    const tx = transactions.find((t) => t.id === id);

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
    }

    // Return sanitized view (no internal flags exposed)
    return NextResponse.json({
      id: tx.id,
      service_type: tx.service_type,
      hours: tx.hours,
      status: tx.status,
      helper_confirmed: tx.helper_confirmed,
      receiver_confirmed: tx.receiver_confirmed,
      expires_at: tx.expires_at,
    });
  } catch (err) {
    console.error("GET /api/time-bank/confirm error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
