// =============================================================================
// EcoByte - Achievement Definitions
// =============================================================================

import type { AchievementDefinition } from "@/types";

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: "first_report",
    title: "First Carbon Report",
    description: "Submit your first digital habit report and see your carbon footprint.",
    icon: "📊",
    target: 1,
  },
  {
    id: "streak_7",
    title: "7-Day Streak",
    description: "Complete challenges for 7 consecutive days.",
    icon: "🔥",
    target: 7,
  },
  {
    id: "eco_champion",
    title: "Eco Champion",
    description: "Achieve a carbon score of 20 or below. You're making a real difference!",
    icon: "🌿",
    target: 1,
  },
  {
    id: "cloud_cleaner",
    title: "Cloud Cleaner",
    description: "Complete 5 cloud storage cleanup challenges.",
    icon: "☁️",
    target: 5,
  },
  {
    id: "streaming_saver",
    title: "Streaming Saver",
    description: "Complete 5 streaming-related challenges.",
    icon: "📺",
    target: 5,
  },
  {
    id: "ai_mindful",
    title: "AI Mindful",
    description: "Complete 5 AI usage reduction challenges.",
    icon: "🤖",
    target: 5,
  },
  {
    id: "challenge_master",
    title: "Challenge Master",
    description: "Complete 25 total challenges.",
    icon: "🏆",
    target: 25,
  },
  {
    id: "carbon_cutter",
    title: "Carbon Cutter",
    description: "Reduce your monthly footprint by 20% compared to your first report.",
    icon: "✂️",
    target: 1,
  },
  {
    id: "report_veteran",
    title: "Report Veteran",
    description: "Submit 10 carbon footprint reports.",
    icon: "📋",
    target: 10,
  },
  {
    id: "xp_500",
    title: "XP Hunter",
    description: "Earn 500 total XP from completing challenges.",
    icon: "⭐",
    target: 500,
  },
];
