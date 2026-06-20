import { auth } from "@/../auth";
import { getDailyChallenges } from "@/lib/challenges-data";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await connectDB();

    // Get today's start date in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    let challenges = await Challenge.find({
      userId,
      assignedDate: todayStart,
    }).lean();

    // Generate new ones if none found for today
    if (challenges.length === 0) {
      const templates = getDailyChallenges();
      challenges = await Promise.all(
        templates.map((t) =>
          Challenge.create({
            userId,
            title: t.title,
            description: t.description,
            category: t.category,
            xpReward: t.xpReward,
            assignedDate: todayStart,
            isCompleted: false,
          })
        )
      );
    }

    const user = await User.findById(userId).select("streak xp").lean();

    return NextResponse.json({
      success: true,
      data: challenges,
      streak: user?.streak ?? 0,
      xp: user?.xp ?? 0,
    });
  } catch (error: unknown) {
    console.error("GET challenges error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
