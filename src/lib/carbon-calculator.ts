// =============================================================================
// EcoByte - Carbon Footprint Calculation Engine
// Modular service that computes emissions from digital habits
// =============================================================================

import { EMISSION_FACTORS } from "./emission-factors";
import type {
  HabitEntryData,
  EmissionsBreakdown,
  CarbonReportData,
  ScoreCategory,
} from "@/types";

const DAYS_PER_MONTH = 30;
const WEEKS_PER_MONTH = 4.33;
const GRAMS_TO_KG = 1000;

/**
 * Calculate monthly streaming emissions in kg CO₂
 */
function calculateStreamingEmissions(
  hoursPerDay: number,
  quality: keyof typeof EMISSION_FACTORS.streaming
): number {
  const gramsPerHour = EMISSION_FACTORS.streaming[quality];
  return (hoursPerDay * gramsPerHour * DAYS_PER_MONTH) / GRAMS_TO_KG;
}

/**
 * Calculate monthly gaming emissions in kg CO₂
 */
function calculateGamingEmissions(
  hoursPerDay: number,
  platform: keyof typeof EMISSION_FACTORS.gaming
): number {
  const gramsPerHour = EMISSION_FACTORS.gaming[platform];
  return (hoursPerDay * gramsPerHour * DAYS_PER_MONTH) / GRAMS_TO_KG;
}

/**
 * Calculate monthly AI usage emissions in kg CO₂
 */
function calculateAIEmissions(
  promptsPerDay: number,
  imageGensPerDay: number,
  codingHours: number
): number {
  const promptEmissions =
    promptsPerDay * EMISSION_FACTORS.ai.textPrompt * DAYS_PER_MONTH;
  const imageEmissions =
    imageGensPerDay * EMISSION_FACTORS.ai.imageGeneration * DAYS_PER_MONTH;
  const codingEmissions =
    codingHours * EMISSION_FACTORS.ai.codingAssistant * DAYS_PER_MONTH;
  return (promptEmissions + imageEmissions + codingEmissions) / GRAMS_TO_KG;
}

/**
 * Calculate monthly cloud storage emissions in kg CO₂
 */
function calculateCloudStorageEmissions(storageGB: number): number {
  return (storageGB * EMISSION_FACTORS.cloudStorage) / GRAMS_TO_KG;
}

/**
 * Calculate monthly video meeting emissions in kg CO₂
 */
function calculateVideoCallEmissions(hoursPerWeek: number): number {
  const monthlyHours = hoursPerWeek * WEEKS_PER_MONTH;
  return (monthlyHours * EMISSION_FACTORS.videoMeetings) / GRAMS_TO_KG;
}

/**
 * Calculate monthly email emissions in kg CO₂
 */
function calculateEmailEmissions(sentPerDay: number): number {
  return (sentPerDay * EMISSION_FACTORS.emails * DAYS_PER_MONTH) / GRAMS_TO_KG;
}

/**
 * Calculate monthly device usage emissions in kg CO₂
 */
function calculateDeviceEmissions(
  laptopHours: number,
  desktopHours: number,
  smartphoneHours: number
): number {
  const laptop =
    laptopHours * EMISSION_FACTORS.devices.laptop * DAYS_PER_MONTH;
  const desktop =
    desktopHours * EMISSION_FACTORS.devices.desktop * DAYS_PER_MONTH;
  const smartphone =
    smartphoneHours * EMISSION_FACTORS.devices.smartphone * DAYS_PER_MONTH;
  return (laptop + desktop + smartphone) / GRAMS_TO_KG;
}

/**
 * Calculate carbon score (0-100) based on total monthly emissions
 * Lower emissions = lower score = better
 */
function calculateCarbonScore(totalKg: number): number {
  // Scale: 0 kg → score 0, 100+ kg → score 100
  const score = Math.min(100, Math.round((totalKg / 100) * 100));
  return Math.max(0, score);
}

/**
 * Get score category label based on score
 */
function getScoreCategory(score: number): ScoreCategory {
  if (score <= 20) return "Eco Champion";
  if (score <= 40) return "Green User";
  if (score <= 60) return "Average User";
  if (score <= 80) return "Heavy Digital Consumer";
  return "Carbon Intensive User";
}

/**
 * Get badge color for the score category
 */
export function getScoreColor(score: number): string {
  if (score <= 20) return "#10b981"; // emerald
  if (score <= 40) return "#22c55e"; // green
  if (score <= 60) return "#f59e0b"; // amber
  if (score <= 80) return "#f97316"; // orange
  return "#ef4444"; // red
}

/**
 * Main calculation function - takes habit data and returns full carbon report
 */
export function calculateCarbonFootprint(
  habits: HabitEntryData
): CarbonReportData {
  const emissions: EmissionsBreakdown = {
    streaming: calculateStreamingEmissions(
      habits.streaming.hoursPerDay,
      habits.streaming.quality
    ),
    gaming: calculateGamingEmissions(
      habits.gaming.hoursPerDay,
      habits.gaming.platform
    ),
    aiUsage: calculateAIEmissions(
      habits.aiUsage.promptsPerDay,
      habits.aiUsage.imageGensPerDay,
      habits.aiUsage.codingHours
    ),
    cloudStorage: calculateCloudStorageEmissions(
      habits.cloudStorage.storageGB
    ),
    videoCalls: calculateVideoCallEmissions(
      habits.videoMeetings.hoursPerWeek
    ),
    emails: calculateEmailEmissions(habits.emails.sentPerDay),
    devices: calculateDeviceEmissions(
      habits.devices.laptopHours,
      habits.devices.desktopHours,
      habits.devices.smartphoneHours
    ),
    total: 0,
  };

  // Round all values to 2 decimal places
  emissions.streaming = Math.round(emissions.streaming * 100) / 100;
  emissions.gaming = Math.round(emissions.gaming * 100) / 100;
  emissions.aiUsage = Math.round(emissions.aiUsage * 100) / 100;
  emissions.cloudStorage = Math.round(emissions.cloudStorage * 100) / 100;
  emissions.videoCalls = Math.round(emissions.videoCalls * 100) / 100;
  emissions.emails = Math.round(emissions.emails * 100) / 100;
  emissions.devices = Math.round(emissions.devices * 100) / 100;

  emissions.total =
    Math.round(
      (emissions.streaming +
        emissions.gaming +
        emissions.aiUsage +
        emissions.cloudStorage +
        emissions.videoCalls +
        emissions.emails +
        emissions.devices) *
        100
    ) / 100;

  const carbonScore = calculateCarbonScore(emissions.total);
  const scoreCategory = getScoreCategory(carbonScore);

  return {
    emissions,
    carbonScore,
    scoreCategory,
  };
}
