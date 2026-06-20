import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";
import CarbonReport from "@/models/CarbonReport";
import User from "@/models/User";
import { calculateCarbonFootprint } from "@/lib/carbon-calculator";
import { updateAchievementProgress } from "@/lib/achievement-helpers";
import { calculateSchema } from "@/lib/validations";
import { parseAndValidate } from "@/lib/request-utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidate(req, calculateSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { habitEntryId } = validation.data;
    await connectDB();

    const habitEntry = await HabitEntry.findById(habitEntryId).lean();
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

    // Award 10 XP for submitting a report
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: 10 },
      $set: { lastActiveDate: new Date() },
    });

    // Update achievements concurrently
    const reportCount = await CarbonReport.countDocuments({ userId: session.user.id });

    const achievementUpdates: Promise<void>[] = [
      updateAchievementProgress(session.user.id, "first_report", 1, 1),
      updateAchievementProgress(session.user.id, "report_veteran", 1, reportCount),
    ];

    if (carbonScore <= 20) {
      achievementUpdates.push(
        updateAchievementProgress(session.user.id, "eco_champion", 1, 1)
      );
    }

    // Carbon cutter check — only if there are previous reports
    if (reportCount > 1) {
      const firstReport = await CarbonReport.findOne({ userId: session.user.id })
        .sort({ date: 1 })
        .select("emissions.total")
        .lean();

      if (firstReport && firstReport.emissions.total > 0) {
        const reduction =
          (firstReport.emissions.total - report.emissions.total) /
          firstReport.emissions.total;
        if (reduction >= 0.2) {
          achievementUpdates.push(
            updateAchievementProgress(session.user.id, "carbon_cutter", 1, 1)
          );
        }
      }
    }

    await Promise.all(achievementUpdates);

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: unknown) {
    console.error("Calculate emissions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
