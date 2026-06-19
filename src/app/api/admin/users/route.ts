import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CarbonReport from "@/models/CarbonReport";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const usersWithScore = await Promise.all(
      users.map(async (user) => {
        const latestReport = await CarbonReport.findOne({ userId: user._id })
          .sort({ date: -1 })
          .select("carbonScore scoreCategory");

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
          carbonScore: latestReport ? latestReport.carbonScore : null,
          scoreCategory: latestReport ? latestReport.scoreCategory : null,
        };
      })
    );

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
  } catch (error: any) {
    console.error("Admin users list error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
