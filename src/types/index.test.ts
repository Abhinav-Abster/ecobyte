import type {
  HabitEntryData,
  EmissionsBreakdown,
  CarbonReportData,
  ScoreCategory,
  StreamingQuality,
  GamingPlatform,
  ChallengeDifficulty,
  ChallengeCategory,
  UserRole,
  ReportPeriod,
  AchievementDefinition,
  ChallengeTemplate,
  ApiResponse,
} from "./index";

// ===========================================================================
// Type Sanity – Ensure interfaces can be instantiated correctly at runtime
// ===========================================================================
describe("Types – Runtime Shape Validation", () => {
  it("HabitEntryData can be created with valid shape", () => {
    const data: HabitEntryData = {
      streaming: { hoursPerDay: 2, quality: "1080p" },
      gaming: { hoursPerDay: 1, platform: "pc" },
      aiUsage: { promptsPerDay: 5, imageGensPerDay: 1, codingHours: 2 },
      cloudStorage: { storageGB: 50 },
      videoMeetings: { hoursPerWeek: 3 },
      emails: { sentPerDay: 15 },
      devices: { laptopHours: 6, desktopHours: 0, smartphoneHours: 3 },
    };

    expect(data.streaming.quality).toBe("1080p");
    expect(data.gaming.platform).toBe("pc");
    expect(data.aiUsage.promptsPerDay).toBe(5);
  });

  it("EmissionsBreakdown has all seven categories plus total", () => {
    const breakdown: EmissionsBreakdown = {
      streaming: 1,
      gaming: 2,
      aiUsage: 3,
      cloudStorage: 4,
      videoCalls: 5,
      emails: 6,
      devices: 7,
      total: 28,
    };

    expect(Object.keys(breakdown)).toHaveLength(8);
    expect(breakdown.total).toBe(28);
  });

  it("CarbonReportData has emissions, score, and category", () => {
    const report: CarbonReportData = {
      emissions: {
        streaming: 0,
        gaming: 0,
        aiUsage: 0,
        cloudStorage: 0,
        videoCalls: 0,
        emails: 0,
        devices: 0,
        total: 0,
      },
      carbonScore: 0,
      scoreCategory: "Eco Champion",
    };

    expect(report.scoreCategory).toBe("Eco Champion");
    expect(report.carbonScore).toBe(0);
  });

  it("AchievementDefinition has correct shape", () => {
    const achievement: AchievementDefinition = {
      id: "test",
      title: "Test Achievement",
      description: "A test",
      icon: "🎯",
      target: 1,
    };

    expect(achievement.id).toBe("test");
    expect(achievement.target).toBe(1);
  });

  it("ChallengeTemplate has correct shape", () => {
    const challenge: ChallengeTemplate = {
      title: "Test Challenge",
      description: "Do something green",
      category: "streaming",
      xpReward: 20,
    };

    expect(challenge.xpReward).toBe(20);
    expect(challenge.category).toBe("streaming");
  });

  it("ApiResponse generic type works with data", () => {
    const response: ApiResponse<{ name: string }> = {
      success: true,
      data: { name: "test" },
    };

    expect(response.success).toBe(true);
    expect(response.data?.name).toBe("test");
  });

  it("ApiResponse error variant works", () => {
    const errorResponse: ApiResponse = {
      success: false,
      error: "Something went wrong",
    };

    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBe("Something went wrong");
  });
});

// ===========================================================================
// Union Type Values – Verify enum-like unions match expected values
// ===========================================================================
describe("Types – Union Type Values", () => {
  it("StreamingQuality covers expected values", () => {
    const qualities: StreamingQuality[] = ["480p", "720p", "1080p", "4K"];
    qualities.forEach((q) => {
      expect(typeof q).toBe("string");
    });
    expect(qualities).toHaveLength(4);
  });

  it("GamingPlatform covers expected values", () => {
    const platforms: GamingPlatform[] = ["pc", "console", "cloud"];
    expect(platforms).toHaveLength(3);
  });

  it("ScoreCategory covers all five tiers", () => {
    const categories: ScoreCategory[] = [
      "Eco Champion",
      "Green User",
      "Average User",
      "Heavy Digital Consumer",
      "Carbon Intensive User",
    ];
    expect(categories).toHaveLength(5);
  });

  it("ChallengeDifficulty covers easy, medium, hard", () => {
    const difficulties: ChallengeDifficulty[] = ["easy", "medium", "hard"];
    expect(difficulties).toHaveLength(3);
  });

  it("ChallengeCategory covers all seven categories", () => {
    const categories: ChallengeCategory[] = [
      "streaming",
      "gaming",
      "ai",
      "cloud",
      "video",
      "email",
      "device",
    ];
    expect(categories).toHaveLength(7);
  });

  it("UserRole covers user and admin", () => {
    const roles: UserRole[] = ["user", "admin"];
    expect(roles).toHaveLength(2);
  });

  it("ReportPeriod covers daily, weekly, monthly", () => {
    const periods: ReportPeriod[] = ["daily", "weekly", "monthly"];
    expect(periods).toHaveLength(3);
  });
});
