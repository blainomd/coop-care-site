import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

interface AssessmentPayload {
  careName?: string;
  relationship?: string;
  ageRange?: string;
  challenges?: string[];
  additionalContext?: string;
  livingSituation?: string;
  city?: string;
  state?: string;
  hasPCP?: string;
  yourName?: string;
  email?: string;
  phone?: string;
  bestTime?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AssessmentPayload = await request.json();

    // Basic validation
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }
    if (!body.yourName) {
      return NextResponse.json(
        { error: "Name required" },
        { status: 400 }
      );
    }

    const assessmentId = randomUUID();
    const submission = {
      assessmentId,
      submittedAt: new Date().toISOString(),
      ...body,
    };

    // Log to file (replace with DB write in production)
    const filePath = path.join(process.cwd(), "assessments.json");
    let assessments: typeof submission[] = [];
    try {
      const data = await fs.readFile(filePath, "utf-8");
      assessments = JSON.parse(data);
    } catch {
      // File doesn't exist yet — start fresh
    }
    assessments.push(submission);
    await fs.writeFile(filePath, JSON.stringify(assessments, null, 2));

    console.log(
      `[assess] New submission — id:${assessmentId} name:${body.yourName} email:${body.email}`
    );

    return NextResponse.json({ success: true, assessmentId });
  } catch (err) {
    console.error("[assess] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
