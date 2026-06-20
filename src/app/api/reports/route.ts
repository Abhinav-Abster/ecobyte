import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import CarbonReport from "@/models/CarbonReport";
import { reportQuerySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const parsed = reportQuerySchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
      period: searchParams.get("period") ?? undefined,
    });

    const limit = parsed.success ? parsed.data.limit : 50;
    const period = parsed.success ? parsed.data.period : undefined;

    const query: Record<string, unknown> = { userId: session.user.id };
    if (period) {
      query.period = period;
    }

    const reports = await CarbonReport.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: reports });
  } catch (error: unknown) {
    console.error("GET reports error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
