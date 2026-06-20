// =============================================================================
// EcoByte - Achievement Progress Utility
// Shared logic for updating user achievement progress across API routes
// =============================================================================

import Achievement from "@/models/Achievement";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements-data";

/**
 * Update or create an achievement progress entry for a user.
 * Handles both incremental updates and forced value overrides.
 *
 * @param userId    - The user's MongoDB ObjectId as a string
 * @param id        - The achievement definition id (e.g. "first_report")
 * @param increment - The amount to increment by (used when forceValue is undefined)
 * @param forceValue - If provided, sets progress to this exact value instead of incrementing
 */
export async function updateAchievementProgress(
  userId: string,
  id: string,
  increment: number,
  forceValue?: number
): Promise<void> {
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
    return;
  }

  // Already unlocked — skip update
  if (achievement.unlockedAt) return;

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
