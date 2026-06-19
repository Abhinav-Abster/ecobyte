import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";
import CarbonReport from "@/models/CarbonReport";
import Achievement from "@/models/Achievement";
import User from "@/models/User";
import { calculateCarbonFootprint } from "@/lib/carbon-calculator";
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

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { habitEntryId } = body;

    if (!habitEntryId) {
      return NextResponse.json({ error: "habitEntryId is required" }, { status: 400 });
    }

    const habitEntry = await HabitEntry.findById(habitEntryId);
    if (!habitEntry) {
      return NextResponse.json({ error: "Habit entry not found" }, { status: 404 });
    }

    if (habitEntry.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate emissions
    const { emissions, carbonScore, scoreCategory } = calculateCarbonFootprint(habitEntry);

    // Save report
    const report = await CarbonReport.create({
      userId: session.user.id,
      habitEntryId,
      date: habitEntry.date || new Date(),
      emissions,
      carbonScore,
      scoreCategory,
      period: "monthly",
    });

    // Update user xp for generating report
    const user = await User.findById(session.user.id);
    if (user) {
      user.xp += 10; // 10 XP for submitting a report
      user.lastActiveDate = new Date();
      await user.save();
    }

    // 1. First Report Achievement
    await updateAchievementProgress(session.user.id, "first_report", 1, 1);

    // 2. Report Veteran Achievement
    const reportCount = await CarbonReport.countDocuments({ userId: session.user.id });
    await updateAchievementProgress(session.user.id, "report_veteran", 1, reportCount);

    // 3. Eco Champion Achievement (Score <= 20)
    if (carbonScore <= 20) {
      await updateAchievementProgress(session.user.id, "eco_champion", 1, 1);
    }

    // 4. Carbon Cutter Achievement (20% reduction from first report)
    if (reportCount > 1) {
      const firstReport = await CarbonReport.findOne({ userId: session.user.id }).sort({ date: 1 });
      if (firstReport && firstReport.emissions.total > 0) {
        const reductionRatio = (firstReport.emissions.total - report.emissions.total) / firstReport.emissions.total;
        if (reductionRatio >= 0.2) {
          await updateAchievementProgress(session.user.id, "carbon_cutter", 1, 1);
        }
      }
    }

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: any) {
    console.error("Calculate emissions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
