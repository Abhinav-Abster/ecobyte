import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CarbonReport from "@/models/CarbonReport";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalReports = await CarbonReport.countDocuments();

    // Aggregate to get average of the latest report for each user
    const latestReportsPipeline: any[] = [
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$userId",
          latestTotal: { $first: "$emissions.total" },
        },
      },
      {
        $group: {
          _id: null,
          avgTotal: { $avg: "$latestTotal" },
        },
      },
    ];

    const avgResult = await CarbonReport.aggregate(latestReportsPipeline);
    const averageFootprint = avgResult[0]?.avgTotal ? Math.round(avgResult[0].avgTotal * 100) / 100 : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsersThisWeek = await User.countDocuments({
      lastActiveDate: { $gte: sevenDaysAgo },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        averageFootprint,
        totalReports,
        activeUsersThisWeek,
      },
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
