import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (!file && !text) {
      return NextResponse.json(
        { error: "Please provide a file or text to interpret" },
        { status: 400 }
      );
    }

    const userContent: Array<Record<string, unknown>> = [];

    if (file) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type;

      if (mimeType.startsWith("image/")) {
        userContent.push({
          type: "image",
          source: { type: "base64", media_type: mimeType, data: base64 },
        });
      } else if (mimeType === "application/pdf") {
        userContent.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 },
        });
      } else {
        const decoder = new TextDecoder();
        userContent.push({
          type: "text",
          text: `Document content:\n\n${decoder.decode(bytes)}`,
        });
      }
    }

    if (text) {
      userContent.push({ type: "text", text: `Medical document text:\n\n${text}` });
    }

    userContent.push({
      type: "text",
      text: `You are Sage, the AI care assistant for co-op.care — a worker-owned home care cooperative in Boulder, CO.

A family member has uploaded a medical document. Interpret it for them in plain, warm language — like a trusted neighbor who happens to have medical training.

CRITICAL SAFETY CHECK FIRST:
If this document or description contains ANY of the following, your FIRST response must be:
- Chest pain, difficulty breathing, stroke symptoms, severe bleeding, loss of consciousness, suicidal ideation, poisoning, allergic reaction with swelling/breathing difficulty
→ Start with: "This sounds like it could be an emergency. Please call 911 or go to your nearest emergency room immediately. [Specific reason]. Everything else can wait."

For non-emergency documents, provide:

1. **What is this?** — Name the document type in plain language (e.g., "This is an MRI report of your knee")

2. **What it says** — Walk through the key findings like you're sitting at their kitchen table explaining it. No jargon without translation. Use "your" not "the patient's."

3. **What matters most** — The 1-2 findings that are most clinically significant. Be honest but not alarming. If something is normal, say so clearly.

4. **What to ask your doctor** — 3-5 specific questions tailored to these exact findings. Not generic — tied to what this document actually says.

5. **What happens next** — Typical next steps for findings like these. Be concrete.

6. **How co-op.care can help** — Based on these findings, mention relevant cooperative services:
   - If ongoing monitoring needed → companion care visits
   - If mobility/rehab → backyard yoga, fall prevention
   - If medication management → caregiver medication reminders
   - If advance planning → CareGoals advance directive
   - If financial concern → HSA/FSA eligibility through ComfortCard
   - If they need a specialist → SurgeonValue physician network

Close with: "This is Sage's best reading — not a diagnosis. Please share this with your doctor at your next visit. If anything feels urgent, trust your instincts and call 911."`,
    });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ error: "Failed to interpret document" }, { status: 500 });
    }

    const data = await response.json();
    const interpretation = data.content?.[0]?.type === "text" ? data.content[0].text : "";

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error("Interpret error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
