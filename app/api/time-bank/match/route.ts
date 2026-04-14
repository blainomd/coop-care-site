import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// GET /api/time-bank/match?request_id=xxx  — find helpers for a match request
// POST /api/time-bank/match                — admin: assign a helper to a request
//
// MVP: manual admin matching. In Phase 2, this becomes automated via the match engine
// that weights time bank reputation score + proximity + availability.
//
// This endpoint requires the ADMIN_SECRET env var to be set.
// See db/TIME-BANK-README.md for configuration.

const ADMIN_SECRET = process.env.TIME_BANK_ADMIN_SECRET || "change-me-in-env";

function requireAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_SECRET}`;
}

interface MatchRequest {
  id: string;
  requester_user_id: string | null;
  service_type: string;
  urgency: string;
  description: string;
  estimated_hours: number;
  status: string;
  matched_helper_id: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface HelperProfile {
  user_id: string;
  display_name: string;
  services_offered: string[];
  availability: { days: string[]; times: string[] };
  location_zip: string;
  max_travel_miles: number;
  verification_status: string;
  needs_background_check: boolean;
}

interface AssignPayload {
  request_id: string;
  helper_user_id: string;
  admin_notes?: string;
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

// GET: find potential helpers for a match request
export async function GET(request: NextRequest) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("request_id");

    const matchRequests = await readJSON<MatchRequest[]>(
      path.join(process.cwd(), "time-bank-match-requests.json"),
      []
    );
    const helperOffers = await readJSON<HelperProfile[]>(
      path.join(process.cwd(), "time-bank-offers.json"),
      []
    );

    if (requestId) {
      const matchRequest = matchRequests.find((r) => r.id === requestId);
      if (!matchRequest) {
        return NextResponse.json({ error: "Match request not found." }, { status: 404 });
      }

      // Find helpers offering this service type (simple string match for MVP)
      const eligibleHelpers = helperOffers.filter((h) => {
        const serviceMatch = h.services_offered.some((s) =>
          s.toLowerCase().includes(matchRequest.service_type.toLowerCase()) ||
          matchRequest.service_type.toLowerCase().includes(s.toLowerCase())
        );
        const verified = h.verification_status === "unverified" ||
          h.verification_status === "verified";
        return serviceMatch && verified;
      });

      return NextResponse.json({
        match_request: matchRequest,
        eligible_helpers: eligibleHelpers,
        count: eligibleHelpers.length,
      });
    }

    // Return all open requests
    const openRequests = matchRequests.filter((r) => r.status === "open");
    return NextResponse.json({
      open_requests: openRequests,
      count: openRequests.length,
    });
  } catch (err) {
    console.error("GET /api/time-bank/match error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// POST: admin assigns a helper to a match request
export async function POST(request: NextRequest) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body: AssignPayload = await request.json();

    if (!body.request_id || !body.helper_user_id) {
      return NextResponse.json({ error: "request_id and helper_user_id required." }, { status: 400 });
    }

    const requestsPath = path.join(process.cwd(), "time-bank-match-requests.json");
    const matchRequests = await readJSON<MatchRequest[]>(requestsPath, []);

    const reqIndex = matchRequests.findIndex((r) => r.id === body.request_id);
    if (reqIndex === -1) {
      return NextResponse.json({ error: "Match request not found." }, { status: 404 });
    }

    if (matchRequests[reqIndex].status !== "open") {
      return NextResponse.json({ error: "Match request is not open." }, { status: 409 });
    }

    matchRequests[reqIndex].matched_helper_id = body.helper_user_id;
    matchRequests[reqIndex].status = "matched";
    matchRequests[reqIndex].admin_notes = body.admin_notes || null;

    await writeJSON(requestsPath, matchRequests);

    return NextResponse.json({
      success: true,
      request_id: body.request_id,
      helper_user_id: body.helper_user_id,
      status: "matched",
    });
  } catch (err) {
    console.error("POST /api/time-bank/match error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
