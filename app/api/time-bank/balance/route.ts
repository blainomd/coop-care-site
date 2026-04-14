import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// GET /api/time-bank/balance?user_id=xxx
// Returns current balance, lifetime earned/spent, and monthly redemption used.
// MVP: reads from local JSON. Replace with Supabase query once env vars are set.

interface Account {
  id: string;
  user_id: string;
  balance: number;
  tier: string;
  lifetime_earned: number;
  lifetime_spent: number;
  balance_cap: number;
  monthly_redemption_cap: number;
  suspended: boolean;
  created_at: string;
}

interface Transaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  service_type: string;
  hours: number;
  status: string;
  created_at: string;
}

interface Redemption {
  user_id: string;
  ch_redeemed: number;
  month_applied: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id query parameter required." }, { status: 400 });
    }

    // Load accounts
    let account: Account | null = null;
    try {
      const raw = await fs.readFile(path.join(process.cwd(), "time-bank-accounts.json"), "utf-8");
      const accounts: Account[] = JSON.parse(raw);
      account = accounts.find((a) => a.user_id === userId) || null;
    } catch {
      // No accounts file yet
    }

    if (!account) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    if (account.suspended) {
      return NextResponse.json({
        error: "Account is suspended. Please contact co-op.care support.",
        suspended: true,
      }, { status: 403 });
    }

    // Load recent transactions for this user
    let recentTransactions: Transaction[] = [];
    try {
      const raw = await fs.readFile(path.join(process.cwd(), "time-bank-transactions.json"), "utf-8");
      const all: Transaction[] = JSON.parse(raw);
      recentTransactions = all
        .filter((t) => (t.from_user_id === userId || t.to_user_id === userId) && t.status === "confirmed")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
    } catch {
      // No transactions yet
    }

    // Monthly redemption used
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    let monthlyRedemptionUsed = 0;
    try {
      const raw = await fs.readFile(path.join(process.cwd(), "time-bank-redemptions.json"), "utf-8");
      const redemptions: Redemption[] = JSON.parse(raw);
      monthlyRedemptionUsed = redemptions
        .filter((r) => r.user_id === userId && r.month_applied === currentMonth)
        .reduce((sum, r) => sum + r.ch_redeemed, 0);
    } catch {
      // No redemptions yet
    }

    return NextResponse.json({
      user_id: userId,
      balance: account.balance,
      tier: account.tier,
      lifetime_earned: account.lifetime_earned,
      lifetime_spent: account.lifetime_spent,
      balance_cap: account.balance_cap,
      monthly_redemption_remaining: Math.max(0, account.monthly_redemption_cap - monthlyRedemptionUsed),
      recent_transactions: recentTransactions,
    });
  } catch (err) {
    console.error("GET /api/time-bank/balance error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
