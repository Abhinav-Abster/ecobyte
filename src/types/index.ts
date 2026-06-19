// =============================================================================
// EcoByte - TypeScript Type Definitions
// =============================================================================

// ---- Habit Entry Types ----

export type StreamingQuality = "480p" | "720p" | "1080p" | "4K";
export type GamingPlatform = "pc" | "console" | "cloud";
export type ScoreCategory =
  | "Eco Champion"
  | "Green User"
  | "Average User"
  | "Heavy Digital Consumer"
  | "Carbon Intensive User";
export type ReportPeriod = "daily" | "weekly" | "monthly";
export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeCategory =
  | "streaming"
  | "gaming"
  | "ai"
  | "cloud"
  | "video"
  | "email"
  | "device";
export type UserRole = "user" | "admin";

export interface StreamingHabits {
  hoursPerDay: number;
  quality: StreamingQuality;
}

export interface GamingHabits {
  hoursPerDay: number;
  platform: GamingPlatform;
}

export interface AIUsageHabits {
  promptsPerDay: number;
  imageGensPerDay: number;
  codingHours: number;
}

export interface CloudStorageHabits {
  storageGB: number;
}

export interface VideoMeetingHabits {
  hoursPerWeek: number;
}

export interface EmailHabits {
  sentPerDay: number;
}

export interface DeviceHabits {
  laptopHours: number;
  desktopHours: number;
  smartphoneHours: number;
}

export interface HabitEntryData {
  streaming: StreamingHabits;
  gaming: GamingHabits;
  aiUsage: AIUsageHabits;
  cloudStorage: CloudStorageHabits;
  videoMeetings: VideoMeetingHabits;
  emails: EmailHabits;
  devices: DeviceHabits;
}

// ---- Carbon Emissions Types ----

export interface EmissionsBreakdown {
  streaming: number;
  gaming: number;
  aiUsage: number;
  cloudStorage: number;
  videoCalls: number;
  emails: number;
  devices: number;
  total: number;
}

export interface CarbonReportData {
  emissions: EmissionsBreakdown;
  carbonScore: number;
  scoreCategory: ScoreCategory;
}

// ---- Emission Factors Types ----

export interface EmissionFactors {
  streaming: Record<StreamingQuality, number>;
  gaming: Record<GamingPlatform, number>;
  ai: {
    textPrompt: number;
    imageGeneration: number;
    codingAssistant: number;
  };
  cloudStorage: number;
  videoMeetings: number;
  emails: number;
  devices: {
    laptop: number;
    desktop: number;
    smartphone: number;
  };
}

// ---- AI Recommendation Types ----

export interface AIRecommendation {
  title: string;
  description: string;
  estimatedReduction: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
}

export interface AICoachResponse {
  summary: string;
  biggestSource: string;
  recommendations: AIRecommendation[];
  estimatedTotalReduction: string;
}

// ---- Simulation Types ----

export interface SimulationPoint {
  month: string;
  current: number;
  improved: number;
}

export interface SimulationResult {
  timeline: SimulationPoint[];
  totalCurrentEmissions: number;
  totalImprovedEmissions: number;
  totalSavings: number;
  percentageReduction: number;
}

// ---- Challenge Types ----

export interface ChallengeTemplate {
  title: string;
  description: string;
  category: ChallengeCategory;
  xpReward: number;
}

export interface ChallengeData {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  xpReward: number;
  isCompleted: boolean;
  completedAt?: Date;
  assignedDate: Date;
}

// ---- Achievement Types ----

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
}

export interface AchievementData {
  _id: string;
  userId: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
}

// ---- Dashboard Types ----

export interface KPIData {
  totalFootprint: number;
  weeklyFootprint: number;
  monthlyFootprint: number;
  carbonScore: number;
  scoreCategory: ScoreCategory;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}

// ---- Admin Types ----

export interface AdminStats {
  totalUsers: number;
  averageFootprint: number;
  totalReports: number;
  activeUsersThisWeek: number;
}

// ---- API Response Types ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
