import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), "subscribers.json");
    let subscribers: string[] = [];
    try {
      const data = await fs.readFile(filePath, "utf-8");
      subscribers = JSON.parse(data);
    } catch {}
    if (subscribers.includes(email)) {
      return NextResponse.json({ message: "Already subscribed" });
    }
    subscribers.push(email);
    await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2));
    return NextResponse.json({ message: "Subscribed" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
