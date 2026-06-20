import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CarbonReport from "@/models/CarbonReport";
import { paginationSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const page = parsed.success ? parsed.data.page : 1;
    const limit = parsed.success ? parsed.data.limit : 20;
    const skip = (page - 1) * limit;

    const [totalUsers, users] = await Promise.all([
      User.countDocuments(),
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    // Batch-fetch latest reports for all users in one aggregation (fix N+1 query)
    const userIds = users.map((u) => u._id);
    const latestReports = await CarbonReport.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$userId",
          carbonScore: { $first: "$carbonScore" },
          scoreCategory: { $first: "$scoreCategory" },
        },
      },
    ]);

    const reportMap = new Map(
      latestReports.map((r) => [r._id.toString(), r])
    );

    const usersWithScore = users.map((user) => {
      const report = reportMap.get(user._id.toString());
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        lastActiveDate: user.lastActiveDate,
        createdAt: user.createdAt,
        carbonScore: report?.carbonScore ?? null,
        scoreCategory: report?.scoreCategory ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithScore,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
      },
    });
  } catch (error: unknown) {
    console.error("Admin users list error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
