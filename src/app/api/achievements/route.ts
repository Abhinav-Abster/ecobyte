import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements-data";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userAchievements = await Achievement.find({ userId: session.user.id });

    // Map existing achievements by achievementId
    const userAchievementsMap = new Map(
      userAchievements.map((a) => [a.achievementId, a])
    );

    // Merge definitions with user progress
    const mergedAchievements = ACHIEVEMENT_DEFINITIONS.map((def) => {
      const userRecord = userAchievementsMap.get(def.id);
      return {
        achievementId: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        target: def.target,
        progress: userRecord ? userRecord.progress : 0,
        unlockedAt: userRecord ? userRecord.unlockedAt : null,
        isUnlocked: userRecord ? !!userRecord.unlockedAt : false,
      };
    });

    return NextResponse.json({ success: true, data: mergedAchievements });
  } catch (error: any) {
    console.error("GET achievements error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
