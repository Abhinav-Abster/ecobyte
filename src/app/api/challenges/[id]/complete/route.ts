import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import Achievement from "@/models/Achievement";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements-data";

async function updateAchievementProgress(userId: string, id: string, increment: number, forceValue?: number) {
  const definition = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
  if (!definition) return;

  const achievement = await Achievement.findOne({ userId, achievementId: id });

  if (!achievement) {
    const progress = forceValue !== undefined ? forceValue : increment;
    const unlockedAt = progress >= definition.target ? new Date() : undefined;
    await Achievement.create({
      userId,
      achievementId: id,
      title: definition.title,
      description: definition.description,
      icon: definition.icon,
      progress,
      target: definition.target,
      unlockedAt,
    });
  } else if (!achievement.unlockedAt) {
    if (forceValue !== undefined) {
      achievement.progress = forceValue;
    } else {
      achievement.progress += increment;
    }

    if (achievement.progress >= achievement.target) {
      achievement.progress = achievement.target;
      achievement.unlockedAt = new Date();
    }

    await achievement.save();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
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
    const otherCompletedToday = await Challenge.findOne({
      userId: session.user.id,
      isCompleted: true,
      assignedDate: challenge.assignedDate,
      _id: { $ne: challenge._id },
    });

    // If this is the first challenge completed today, update streak
    if (!otherCompletedToday) {
      const yesterdayStart = new Date(challenge.assignedDate);
      yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);

      const completedYesterday = await Challenge.findOne({
        userId: session.user.id,
        isCompleted: true,
        assignedDate: yesterdayStart,
      });

      if (completedYesterday) {
        user.streak += 1;
      } else {
        // If they had no challenges completed yesterday, streak starts at 1
        user.streak = 1;
      }
    }

    // Award XP
    user.xp += challenge.xpReward;
    user.lastActiveDate = new Date();
    await user.save();

    // Check achievement progress
    // 1. Streak 7
    await updateAchievementProgress(session.user.id, "streak_7", 1, user.streak);

    // 2. Challenge Master (25 total completed challenges)
    const totalCompleted = await Challenge.countDocuments({
      userId: session.user.id,
      isCompleted: true,
    });
    await updateAchievementProgress(session.user.id, "challenge_master", 1, totalCompleted);

    // 3. XP Hunter (500 total XP)
    await updateAchievementProgress(session.user.id, "xp_500", 1, user.xp);

    // 4. Category specific challenges completed
    const categoryCount = await Challenge.countDocuments({
      userId: session.user.id,
      isCompleted: true,
      category: challenge.category,
    });

    if (challenge.category === "cloud") {
      await updateAchievementProgress(session.user.id, "cloud_cleaner", 1, categoryCount);
    } else if (challenge.category === "streaming") {
      await updateAchievementProgress(session.user.id, "streaming_saver", 1, categoryCount);
    } else if (challenge.category === "ai") {
      await updateAchievementProgress(session.user.id, "ai_mindful", 1, categoryCount);
    }

    return NextResponse.json({
      success: true,
      data: {
        challenge,
        user: {
          xp: user.xp,
          streak: user.streak,
        },
      },
    });
  } catch (error: any) {
    console.error("Complete challenge error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
