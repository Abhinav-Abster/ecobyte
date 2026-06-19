// =============================================================================
// EcoByte - Challenge Templates
// Daily green challenges for gamification
// =============================================================================

import type { ChallengeTemplate } from "@/types";

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // Streaming
  {
    title: "Stream in 720p Today",
    description: "Watch all your streaming content in 720p or lower today. You won't notice the difference on your phone!",
    category: "streaming",
    xpReward: 20,
  },
  {
    title: "Screen-Free Hour",
    description: "Take a one-hour break from all streaming services today. Read a book, go for a walk, or try a new hobby.",
    category: "streaming",
    xpReward: 25,
  },
  {
    title: "Download Instead of Stream",
    description: "Download content over WiFi instead of streaming repeatedly. This reduces data transfer emissions.",
    category: "streaming",
    xpReward: 15,
  },

  // Gaming
  {
    title: "Limit Gaming to 2 Hours",
    description: "Cap your gaming session at 2 hours today. Use a timer to stay on track!",
    category: "gaming",
    xpReward: 20,
  },
  {
    title: "Eco Gaming Mode",
    description: "Lower your game graphics settings to reduce GPU power consumption while gaming today.",
    category: "gaming",
    xpReward: 15,
  },

  // AI
  {
    title: "AI-Free Afternoon",
    description: "Avoid using AI chatbots and image generators for the entire afternoon. Use search engines or your own knowledge instead.",
    category: "ai",
    xpReward: 30,
  },
  {
    title: "Batch Your AI Prompts",
    description: "Instead of sending multiple small prompts, combine your questions into fewer, detailed queries.",
    category: "ai",
    xpReward: 15,
  },
  {
    title: "Skip Image Generation",
    description: "Don't generate any AI images today. Use existing stock photos or create simple graphics manually.",
    category: "ai",
    xpReward: 25,
  },

  // Cloud Storage
  {
    title: "Cloud Cleanup",
    description: "Delete at least 1 GB of unused files from your cloud storage. Old backups, duplicate photos, and forgotten downloads.",
    category: "cloud",
    xpReward: 30,
  },
  {
    title: "Unsubscribe Spree",
    description: "Unsubscribe from at least 5 email newsletters you never read. Fewer emails = less server processing.",
    category: "cloud",
    xpReward: 20,
  },

  // Video Meetings
  {
    title: "Camera-Off Meeting",
    description: "Join at least one video meeting today with your camera off. Audio-only uses 96% less data.",
    category: "video",
    xpReward: 15,
  },
  {
    title: "Walking Meeting",
    description: "Convert one video meeting into a phone call you can take while walking outside.",
    category: "video",
    xpReward: 25,
  },

  // Email
  {
    title: "Inbox Zero Sprint",
    description: "Delete or archive all unnecessary emails in your inbox. Clear storage = lower carbon footprint.",
    category: "email",
    xpReward: 20,
  },
  {
    title: "Attachment-Free Day",
    description: "Share files via links instead of email attachments today. Links use far less server resources.",
    category: "email",
    xpReward: 15,
  },

  // Devices
  {
    title: "Dark Mode Everything",
    description: "Switch all your devices and apps to dark mode for the day. OLED screens use less power in dark mode.",
    category: "device",
    xpReward: 10,
  },
  {
    title: "Power Down Unused Devices",
    description: "Turn off all devices you're not actively using instead of leaving them on standby.",
    category: "device",
    xpReward: 20,
  },
  {
    title: "Smartphone-Only Evening",
    description: "Use only your smartphone (lowest energy device) for all digital activities this evening.",
    category: "device",
    xpReward: 25,
  },
];

/**
 * Get 3 random challenges for the day
 */
export function getDailyChallenges(): ChallengeTemplate[] {
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  // Ensure variety by picking from different categories
  const categories = new Set<string>();
  const selected: ChallengeTemplate[] = [];

  for (const challenge of shuffled) {
    if (selected.length >= 3) break;
    if (!categories.has(challenge.category)) {
      categories.add(challenge.category);
      selected.push(challenge);
    }
  }

  // Fill remaining slots if needed
  while (selected.length < 3) {
    const remaining = shuffled.find((c) => !selected.includes(c));
    if (remaining) selected.push(remaining);
    else break;
  }

  return selected;
}
