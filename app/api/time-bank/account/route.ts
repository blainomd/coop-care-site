import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

// MVP: writes to local JSON files until Supabase is wired.
// Replace the file I/O blocks with Supabase client calls once env vars are set.
// See db/TIME-BANK-README.md for Supabase setup instructions.

interface OfferProfilePayload {
  action: "offer_profile";
  services_offered: string[];
  availability: { days: string[]; times: string[] };
  location_zip: string;
  max_travel_miles: number;
  bio?: string;
}

interface CreateAccountPayload {
  action: "create";
  user_id?: string;
  display_name: string;
  email?: string;
}

type AccountPayload = OfferProfilePayload | CreateAccountPayload;

export async function POST(request: NextRequest) {
  try {
    const body: AccountPayload = await request.json();

    if (body.action === "offer_profile") {
      const payload = body as OfferProfilePayload;

      if (!payload.services_offered || payload.services_offered.length === 0) {
        return NextResponse.json({ error: "At least one service must be selected." }, { status: 400 });
      }
      if (!payload.location_zip || payload.location_zip.length < 5) {
        return NextResponse.json({ error: "Valid ZIP code required." }, { status: 400 });
      }

      const profileId = randomUUID();
      const record = {
        id: profileId,
        action: "offer_profile",
        submittedAt: new Date().toISOString(),
        services_offered: payload.services_offered,
        availability: payload.availability,
        location_zip: payload.location_zip,
        max_travel_miles: payload.max_travel_miles,
        bio: payload.bio || "",
        verification_status: "unverified",
        // Needs background check if offering companionship or transportation
        needs_background_check: payload.services_offered.some((s) =>
          ["companionship", "transportation"].includes(s)
        ),
      };

      const filePath = path.join(process.cwd(), "time-bank-offers.json");
      let offers: typeof record[] = [];
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        offers = JSON.parse(raw);
      } catch {
        // File doesn't exist yet — start fresh
      }
      offers.push(record);
      await fs.writeFile(filePath, JSON.stringify(offers, null, 2));

      return NextResponse.json({ success: true, profileId }, { status: 201 });
    }

    if (body.action === "create") {
      const payload = body as CreateAccountPayload;

      if (!payload.display_name) {
        return NextResponse.json({ error: "Display name required." }, { status: 400 });
      }

      const accountId = randomUUID();
      const account = {
        id: accountId,
        user_id: payload.user_id || randomUUID(),
        display_name: payload.display_name,
        email: payload.email || null,
        balance: 0,
        tier: "standard",
        lifetime_earned: 0,
        lifetime_spent: 0,
        balance_cap: 100,
        monthly_redemption_cap: 6,
        suspended: false,
        created_at: new Date().toISOString(),
      };

      const filePath = path.join(process.cwd(), "time-bank-accounts.json");
      let accounts: typeof account[] = [];
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        accounts = JSON.parse(raw);
      } catch {
        // File doesn't exist yet
      }
      accounts.push(account);
      await fs.writeFile(filePath, JSON.stringify(accounts, null, 2));

      return NextResponse.json({ success: true, accountId }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    console.error("POST /api/time-bank/account error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    const filePath = path.join(process.cwd(), "time-bank-accounts.json");
    let accounts: Record<string, unknown>[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      accounts = JSON.parse(raw);
    } catch {
      return NextResponse.json({ accounts: [] });
    }

    if (userId) {
      const account = accounts.find((a) => a.user_id === userId);
      if (!account) {
        return NextResponse.json({ error: "Account not found." }, { status: 404 });
      }
      return NextResponse.json({ account });
    }

    return NextResponse.json({ accounts });
  } catch (err) {
    console.error("GET /api/time-bank/account error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
