import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import { updateAchievementProgress } from "@/lib/achievement-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (challenge.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (challenge.isCompleted) {
      return NextResponse.json({ error: "Challenge already completed" }, { status: 400 });
    }

    // Mark challenge as completed
    challenge.isCompleted = true;
    challenge.completedAt = new Date();
    await challenge.save();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already completed another challenge today
    const otherCompletedToday = await Challenge.exists({
      userId: session.user.id,
      isCompleted: true,
      assignedDate: challenge.assignedDate,
      _id: { $ne: challenge._id },
    });

    // If this is the first challenge completed today, update streak
    if (!otherCompletedToday) {
      const yesterdayStart = new Date(challenge.assignedDate);
      yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);

      const completedYesterday = await Challenge.exists({
        userId: session.user.id,
        isCompleted: true,
        assignedDate: yesterdayStart,
      });

      user.streak = completedYesterday ? user.streak + 1 : 1;
    }

    // Award XP
    user.xp += challenge.xpReward;
    user.lastActiveDate = new Date();
    await user.save();

    // Update achievements concurrently
    const [totalCompleted, categoryCount] = await Promise.all([
      Challenge.countDocuments({ userId: session.user.id, isCompleted: true }),
      Challenge.countDocuments({
        userId: session.user.id,
        isCompleted: true,
        category: challenge.category,
      }),
    ]);

    const achievementUpdates: Promise<void>[] = [
      updateAchievementProgress(session.user.id, "streak_7", 1, user.streak),
      updateAchievementProgress(session.user.id, "challenge_master", 1, totalCompleted),
      updateAchievementProgress(session.user.id, "xp_500", 1, user.xp),
    ];

    // Category-specific achievements
    const categoryAchievementMap: Record<string, string> = {
      cloud: "cloud_cleaner",
      streaming: "streaming_saver",
      ai: "ai_mindful",
    };
    const achievementId = categoryAchievementMap[challenge.category];
    if (achievementId) {
      achievementUpdates.push(
        updateAchievementProgress(session.user.id, achievementId, 1, categoryCount)
      );
    }

    await Promise.all(achievementUpdates);

    return NextResponse.json({
      success: true,
      data: {
        challenge,
        user: { xp: user.xp, streak: user.streak },
      },
    });
  } catch (error: unknown) {
    console.error("Complete challenge error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
