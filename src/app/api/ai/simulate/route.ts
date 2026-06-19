import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import CarbonReport from "@/models/CarbonReport";
import { simulateFutureImpact } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json().catch(() => ({}));
    const months = body.months || 6;

    if (months !== 6 && months !== 12) {
      return NextResponse.json({ error: "Months must be 6 or 12" }, { status: 400 });
    }

    const report = await CarbonReport.findOne({ userId: session.user.id }).sort({ date: -1 });
    if (!report) {
      return NextResponse.json(
        { error: "No carbon reports found. Please track your habits first." },
        { status: 400 }
      );
    }

    const simulation = await simulateFutureImpact(report.emissions, months);

    return NextResponse.json({ success: true, data: simulation });
  } catch (error: any) {
    console.error("AI simulation API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
