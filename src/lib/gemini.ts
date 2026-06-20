// =============================================================================
// EcoByte - Gemini AI Client
// Provides AI-powered sustainability recommendations and simulations
// =============================================================================

import { GoogleGenAI } from "@google/genai";
import type {
  HabitEntryData,
  EmissionsBreakdown,
  AICoachResponse,
  SimulationResult,
} from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-2.0-flash" as const;

/**
 * Safely parse a JSON string, returning null on failure instead of throwing.
 */
function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Generate personalized sustainability recommendations based on user habits
 */
export async function getRecommendations(
  habits: HabitEntryData,
  emissions: EmissionsBreakdown
): Promise<AICoachResponse> {
  const prompt = `You are EcoByte, an expert digital sustainability coach. Analyze this user's digital habits and carbon emissions, then provide actionable recommendations.

User's Digital Habits:
- Streaming: ${habits.streaming.hoursPerDay} hours/day at ${habits.streaming.quality}
- Gaming: ${habits.gaming.hoursPerDay} hours/day on ${habits.gaming.platform}
- AI Usage: ${habits.aiUsage.promptsPerDay} prompts/day, ${habits.aiUsage.imageGensPerDay} image generations/day, ${habits.aiUsage.codingHours} hours coding assistant/day
- Cloud Storage: ${habits.cloudStorage.storageGB} GB
- Video Meetings: ${habits.videoMeetings.hoursPerWeek} hours/week
- Emails: ${habits.emails.sentPerDay} sent/day
- Devices: Laptop ${habits.devices.laptopHours}h, Desktop ${habits.devices.desktopHours}h, Smartphone ${habits.devices.smartphoneHours}h daily

Monthly Emissions (kg CO₂):
- Streaming: ${emissions.streaming}
- Gaming: ${emissions.gaming}
- AI Usage: ${emissions.aiUsage}
- Cloud Storage: ${emissions.cloudStorage}
- Video Calls: ${emissions.videoCalls}
- Emails: ${emissions.emails}
- Devices: ${emissions.devices}
- TOTAL: ${emissions.total}

Respond with a JSON object containing:
1. "summary": A 2-3 sentence overview of their digital carbon footprint
2. "biggestSource": The category name with highest emissions
3. "recommendations": Array of 4-5 recommendations, each with:
   - "title": Short action title
   - "description": Detailed actionable advice (2-3 sentences)
   - "estimatedReduction": Estimated savings like "~3 kg CO₂/month"
   - "difficulty": "easy", "medium", or "hard"
   - "category": One of "streaming", "gaming", "ai", "cloud", "video", "email", "device"
4. "estimatedTotalReduction": Total potential monthly reduction if all recommendations followed`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "";
    const parsed = safeJsonParse<AICoachResponse>(text);
    if (!parsed) {
      console.warn("Gemini returned malformed JSON, using fallback recommendations");
      return getFallbackRecommendations(emissions);
    }
    return parsed;
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackRecommendations(emissions);
  }
}

/**
 * Generate future impact simulation data
 */
export async function simulateFutureImpact(
  emissions: EmissionsBreakdown,
  months: number
): Promise<SimulationResult> {
  const prompt = `You are EcoByte, a digital sustainability analyst. Given these monthly digital carbon emissions, simulate a ${months}-month projection showing two trajectories:

Current Monthly Emissions (kg CO₂):
- Streaming: ${emissions.streaming}
- Gaming: ${emissions.gaming}
- AI Usage: ${emissions.aiUsage}
- Cloud Storage: ${emissions.cloudStorage}
- Video Calls: ${emissions.videoCalls}
- Emails: ${emissions.emails}
- Devices: ${emissions.devices}
- TOTAL: ${emissions.total}

Create a JSON response with:
1. "timeline": Array of ${months} objects, each with:
   - "month": "Month 1", "Month 2", etc.
   - "current": Projected cumulative emissions WITHOUT changes (slight natural increase of 2-5% over time)
   - "improved": Projected cumulative emissions WITH sustainability improvements (gradually improving by 15-30% over the period)
2. "totalCurrentEmissions": Total emissions over ${months} months on current trajectory
3. "totalImprovedEmissions": Total emissions over ${months} months on improved trajectory
4. "totalSavings": Difference in kg CO₂
5. "percentageReduction": Overall percentage reduction

Make the projections realistic and gradual. The improved trajectory should show steady month-over-month improvement.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "";
    const parsed = safeJsonParse<SimulationResult>(text);
    if (!parsed) {
      console.warn("Gemini returned malformed JSON, using fallback simulation");
      return getFallbackSimulation(emissions, months);
    }
    return parsed;
  } catch (error) {
    console.error("Gemini simulation error:", error);
    return getFallbackSimulation(emissions, months);
  }
}

/**
 * Fallback recommendations when Gemini API is unavailable
 */
function getFallbackRecommendations(
  emissions: EmissionsBreakdown
): AICoachResponse {
  const entries = Object.entries(emissions).filter(([key]) => key !== "total");
  const sorted = entries.sort(([, a], [, b]) => b - a);
  const biggest = sorted[0][0];

  return {
    summary: `Your total monthly digital carbon footprint is ${emissions.total} kg CO₂. This is generated across ${entries.length} categories of digital activity.`,
    biggestSource: biggest,
    recommendations: [
      {
        title: "Reduce Streaming Quality",
        description:
          "Switch from 4K/1080p to 720p when not watching on a large screen. The visual difference on phones and laptops is minimal, but the carbon savings are significant.",
        estimatedReduction: "~2-5 kg CO₂/month",
        difficulty: "easy",
        category: "streaming",
      },
      {
        title: "Optimize AI Usage",
        description:
          "Batch your AI prompts into fewer, more detailed queries instead of many small ones. Reduce image generation to only essential needs.",
        estimatedReduction: "~1-3 kg CO₂/month",
        difficulty: "medium",
        category: "ai",
      },
      {
        title: "Clean Cloud Storage",
        description:
          "Delete unused files, old backups, and duplicate photos from cloud storage. Less stored data means less energy for maintaining servers.",
        estimatedReduction: "~0.5-1 kg CO₂/month",
        difficulty: "easy",
        category: "cloud",
      },
      {
        title: "Use Camera Wisely in Meetings",
        description:
          "Turn off your camera during meetings where video isn't necessary. Audio-only calls use 96% less energy than HD video calls.",
        estimatedReduction: "~1-2 kg CO₂/month",
        difficulty: "easy",
        category: "video",
      },
    ],
    estimatedTotalReduction: "~5-11 kg CO₂/month",
  };
}

/**
 * Fallback simulation when Gemini API is unavailable
 */
function getFallbackSimulation(
  emissions: EmissionsBreakdown,
  months: number
): SimulationResult {
  const timeline = [];
  let cumulativeCurrent = 0;
  let cumulativeImproved = 0;
  const floor = emissions.total * 0.5;

  for (let i = 1; i <= months; i++) {
    // Current trajectory: slight 2% monthly increase
    const currentMonth = emissions.total * (1 + 0.02 * (i - 1));
    // Improved trajectory: 3% monthly improvement
    const improvedMonth = Math.max(emissions.total * (1 - 0.03 * i), floor);
    cumulativeCurrent += currentMonth;
    cumulativeImproved += improvedMonth;

    timeline.push({
      month: `Month ${i}`,
      current: Math.round(cumulativeCurrent * 100) / 100,
      improved: Math.round(cumulativeImproved * 100) / 100,
    });
  }

  const totalSavings = cumulativeCurrent - cumulativeImproved;
  const percentageReduction = cumulativeCurrent > 0
    ? Math.round((totalSavings / cumulativeCurrent) * 10000) / 100
    : 0;

  return {
    timeline,
    totalCurrentEmissions: Math.round(cumulativeCurrent * 100) / 100,
    totalImprovedEmissions: Math.round(cumulativeImproved * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    percentageReduction,
  };
}
