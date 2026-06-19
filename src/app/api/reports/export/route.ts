import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import CarbonReport from "@/models/CarbonReport";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const reports = await CarbonReport.find({ userId: session.user.id }).sort({ date: 1 });

    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error("Export reports error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
