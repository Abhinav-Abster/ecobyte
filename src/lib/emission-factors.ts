// =============================================================================
// EcoByte - Emission Factors Configuration
// Research-backed emission factors from IEA, The Shift Project, Carbon Trust
// All values in grams CO₂ equivalent per unit
// =============================================================================

import type { EmissionFactors } from "@/types";

export const EMISSION_FACTORS: EmissionFactors = {
  // grams CO₂ per hour of streaming
  streaming: {
    "480p": 36,
    "720p": 56,
    "1080p": 100,
    "4K": 250,
  },

  // grams CO₂ per hour of gaming
  gaming: {
    pc: 175,
    console: 100,
    cloud: 250,
  },

  // AI-related emissions
  ai: {
    textPrompt: 4.32, // grams CO₂ per prompt
    imageGeneration: 12, // grams CO₂ per image
    codingAssistant: 3, // grams CO₂ per hour
  },

  // grams CO₂ per GB per month
  cloudStorage: 0.2,

  // grams CO₂ per hour of video meetings
  videoMeetings: 175,

  // grams CO₂ per email sent
  emails: 4,

  // grams CO₂ per hour of device usage
  devices: {
    laptop: 20,
    desktop: 80,
    smartphone: 5,
  },
};

// Score thresholds (monthly kg CO₂)
export const SCORE_THRESHOLDS = {
  ecoChampion: 10, // 0-10 kg/month
  greenUser: 25, // 10-25 kg/month
  averageUser: 50, // 25-50 kg/month
  heavyConsumer: 80, // 50-80 kg/month
  // Above 80 = Carbon Intensive User
};

// Category labels and colors for charts
export const CATEGORY_CONFIG = {
  streaming: { label: "Streaming", color: "#10b981" },
  gaming: { label: "Gaming", color: "#3b82f6" },
  aiUsage: { label: "AI Usage", color: "#8b5cf6" },
  cloudStorage: { label: "Cloud Storage", color: "#f59e0b" },
  videoCalls: { label: "Video Calls", color: "#ef4444" },
  emails: { label: "Emails", color: "#06b6d4" },
  devices: { label: "Devices", color: "#ec4899" },
} as const;
