import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import CarbonReport from "@/models/CarbonReport";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const period = searchParams.get("period");

    const query: any = { userId: session.user.id };
    if (period) {
      query.period = period;
    }

    const reports = await CarbonReport.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error("GET reports error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
