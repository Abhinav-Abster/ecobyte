import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import CarbonReport from "@/models/CarbonReport";
import HabitEntry from "@/models/HabitEntry";
import { getRecommendations } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json().catch(() => ({}));
    const { habitEntryId } = body;
    let habitEntry = null;
    let report = null;

    if (habitEntryId) {
      [habitEntry, report] = await Promise.all([
        HabitEntry.findById(habitEntryId).lean(),
        CarbonReport.findOne({ habitEntryId }).lean(),
      ]);
    } else {
      report = await CarbonReport.findOne({ userId: session.user.id })
        .sort({ date: -1 })
        .lean();
      if (report) {
        habitEntry = await HabitEntry.findById(report.habitEntryId).lean();
      }
    }

    if (!habitEntry || !report) {
      return NextResponse.json(
        { error: "No carbon reports found. Please track your habits first." },
        { status: 400 }
      );
    }

    const recommendations = await getRecommendations(habitEntry, report.emissions);

    return NextResponse.json({ success: true, data: recommendations });
  } catch (error: unknown) {
    console.error("AI recommendations API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
