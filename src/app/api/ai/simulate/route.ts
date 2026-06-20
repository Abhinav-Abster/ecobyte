import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import CarbonReport from "@/models/CarbonReport";
import { simulateFutureImpact } from "@/lib/gemini";
import { simulationSchema } from "@/lib/validations";
import { parseAndValidate } from "@/lib/request-utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidate(req, simulationSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { months } = validation.data;
    await connectDB();

    const report = await CarbonReport.findOne({ userId: session.user.id })
      .sort({ date: -1 })
      .lean();
    if (!report) {
      return NextResponse.json(
        { error: "No carbon reports found. Please track your habits first." },
        { status: 400 }
      );
    }

    const simulation = await simulateFutureImpact(report.emissions, months);

    return NextResponse.json({ success: true, data: simulation });
  } catch (error: unknown) {
    console.error("AI simulation API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
