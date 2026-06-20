import { NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CarbonReport from "@/models/CarbonReport";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const [totalUsers, totalReports] = await Promise.all([
      User.countDocuments(),
      CarbonReport.countDocuments(),
    ]);

    // Aggregate to get average of the latest report for each user
    const avgResult = await CarbonReport.aggregate([
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
    ]);
    const averageFootprint = avgResult[0]?.avgTotal
      ? Math.round(avgResult[0].avgTotal * 100) / 100
      : 0;

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
  } catch (error: unknown) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
