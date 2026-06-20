import {
  calculateCarbonFootprint,
  getScoreColor,
} from "./carbon-calculator";
import { HabitEntryData } from "@/types";
import { EMISSION_FACTORS } from "./emission-factors";

// ---------------------------------------------------------------------------
// Helper — builds a HabitEntryData from partial overrides
// ---------------------------------------------------------------------------
function makeHabits(overrides: Partial<HabitEntryData> = {}): HabitEntryData {
  return {
    streaming: { hoursPerDay: 0, quality: "1080p" },
    gaming: { hoursPerDay: 0, platform: "pc" },
    aiUsage: { promptsPerDay: 0, imageGensPerDay: 0, codingHours: 0 },
    cloudStorage: { storageGB: 0 },
    videoMeetings: { hoursPerWeek: 0 },
    emails: { sentPerDay: 0 },
    devices: { laptopHours: 0, desktopHours: 0, smartphoneHours: 0 },
    ...overrides,
  };
}

const DAYS = 30;
const WEEKS = 4.33;

// ===========================================================================
// 1. Zero-input baseline
// ===========================================================================
describe("Carbon Calculator – Zero Input", () => {
  const report = calculateCarbonFootprint(makeHabits());

  it("returns zero for every emission category", () => {
    expect(report.emissions.streaming).toBe(0);
    expect(report.emissions.gaming).toBe(0);
    expect(report.emissions.aiUsage).toBe(0);
    expect(report.emissions.cloudStorage).toBe(0);
    expect(report.emissions.videoCalls).toBe(0);
    expect(report.emissions.emails).toBe(0);
    expect(report.emissions.devices).toBe(0);
    expect(report.emissions.total).toBe(0);
  });

  it("returns score 0 and Eco Champion for zero emissions", () => {
    expect(report.carbonScore).toBe(0);
    expect(report.scoreCategory).toBe("Eco Champion");
  });
});

// ===========================================================================
// 2. Individual category math verification
// ===========================================================================
describe("Carbon Calculator – Streaming Emissions", () => {
  it.each([
    ["480p", EMISSION_FACTORS.streaming["480p"]],
    ["720p", EMISSION_FACTORS.streaming["720p"]],
    ["1080p", EMISSION_FACTORS.streaming["1080p"]],
    ["4K", EMISSION_FACTORS.streaming["4K"]],
  ] as const)("computes correct monthly kg for %s quality", (quality, gPerHour) => {
    const hours = 3;
    const report = calculateCarbonFootprint(
      makeHabits({ streaming: { hoursPerDay: hours, quality } })
    );
    const expected = Math.round(((hours * gPerHour * DAYS) / 1000) * 100) / 100;
    expect(report.emissions.streaming).toBe(expected);
  });
});

describe("Carbon Calculator – Gaming Emissions", () => {
  it.each(["pc", "console", "cloud"] as const)(
    "computes correct monthly kg for %s platform",
    (platform) => {
      const hours = 2;
      const gPerHour = EMISSION_FACTORS.gaming[platform];
      const report = calculateCarbonFootprint(
        makeHabits({ gaming: { hoursPerDay: hours, platform } })
      );
      const expected = Math.round(((hours * gPerHour * DAYS) / 1000) * 100) / 100;
      expect(report.emissions.gaming).toBe(expected);
    }
  );
});

describe("Carbon Calculator – AI Emissions", () => {
  it("computes correct monthly kg combining prompts, images and coding", () => {
    const prompts = 20;
    const images = 5;
    const coding = 4;
    const report = calculateCarbonFootprint(
      makeHabits({ aiUsage: { promptsPerDay: prompts, imageGensPerDay: images, codingHours: coding } })
    );
    const promptG = prompts * EMISSION_FACTORS.ai.textPrompt * DAYS;
    const imageG = images * EMISSION_FACTORS.ai.imageGeneration * DAYS;
    const codingG = coding * EMISSION_FACTORS.ai.codingAssistant * DAYS;
    const expected = Math.round(((promptG + imageG + codingG) / 1000) * 100) / 100;
    expect(report.emissions.aiUsage).toBe(expected);
  });
});

describe("Carbon Calculator – Cloud Storage Emissions", () => {
  it("computes correct monthly kg for given GB", () => {
    const gb = 500;
    const report = calculateCarbonFootprint(makeHabits({ cloudStorage: { storageGB: gb } }));
    const expected = Math.round(((gb * EMISSION_FACTORS.cloudStorage) / 1000) * 100) / 100;
    expect(report.emissions.cloudStorage).toBe(expected);
  });
});

describe("Carbon Calculator – Video Call Emissions", () => {
  it("computes correct monthly kg for weekly meeting hours", () => {
    const hoursPerWeek = 10;
    const report = calculateCarbonFootprint(
      makeHabits({ videoMeetings: { hoursPerWeek } })
    );
    const expected = Math.round(((hoursPerWeek * WEEKS * EMISSION_FACTORS.videoMeetings) / 1000) * 100) / 100;
    expect(report.emissions.videoCalls).toBe(expected);
  });
});

describe("Carbon Calculator – Email Emissions", () => {
  it("computes correct monthly kg for daily emails", () => {
    const sentPerDay = 30;
    const report = calculateCarbonFootprint(makeHabits({ emails: { sentPerDay } }));
    const expected = Math.round(((sentPerDay * EMISSION_FACTORS.emails * DAYS) / 1000) * 100) / 100;
    expect(report.emissions.emails).toBe(expected);
  });
});

describe("Carbon Calculator – Device Emissions", () => {
  it("computes correct monthly kg for all three device types", () => {
    const laptop = 8;
    const desktop = 4;
    const smartphone = 6;
    const report = calculateCarbonFootprint(
      makeHabits({ devices: { laptopHours: laptop, desktopHours: desktop, smartphoneHours: smartphone } })
    );
    const laptopG = laptop * EMISSION_FACTORS.devices.laptop * DAYS;
    const desktopG = desktop * EMISSION_FACTORS.devices.desktop * DAYS;
    const smartphoneG = smartphone * EMISSION_FACTORS.devices.smartphone * DAYS;
    const expected = Math.round(((laptopG + desktopG + smartphoneG) / 1000) * 100) / 100;
    expect(report.emissions.devices).toBe(expected);
  });
});

// ===========================================================================
// 3. Total emission is the sum of all categories
// ===========================================================================
describe("Carbon Calculator – Total Aggregation", () => {
  it("total equals sum of all individual categories", () => {
    const report = calculateCarbonFootprint(
      makeHabits({
        streaming: { hoursPerDay: 2, quality: "1080p" },
        gaming: { hoursPerDay: 1, platform: "console" },
        aiUsage: { promptsPerDay: 10, imageGensPerDay: 1, codingHours: 1 },
        cloudStorage: { storageGB: 100 },
        videoMeetings: { hoursPerWeek: 5 },
        emails: { sentPerDay: 10 },
        devices: { laptopHours: 4, desktopHours: 0, smartphoneHours: 3 },
      })
    );

    const categorySum =
      report.emissions.streaming +
      report.emissions.gaming +
      report.emissions.aiUsage +
      report.emissions.cloudStorage +
      report.emissions.videoCalls +
      report.emissions.emails +
      report.emissions.devices;

    expect(report.emissions.total).toBe(Math.round(categorySum * 100) / 100);
  });
});

// ===========================================================================
// 4. Carbon score boundaries and category mapping
// ===========================================================================
describe("Carbon Calculator – Score & Categories", () => {
  it("score is clamped to 0–100", () => {
    const extreme = calculateCarbonFootprint(
      makeHabits({
        streaming: { hoursPerDay: 24, quality: "4K" },
        gaming: { hoursPerDay: 24, platform: "cloud" },
        devices: { laptopHours: 24, desktopHours: 24, smartphoneHours: 24 },
      })
    );
    expect(extreme.carbonScore).toBeLessThanOrEqual(100);
    expect(extreme.carbonScore).toBeGreaterThanOrEqual(0);
  });

  it("maps to Eco Champion for score ≤ 20", () => {
    const r = calculateCarbonFootprint(makeHabits());
    expect(r.scoreCategory).toBe("Eco Champion");
  });

  it("maps to Carbon Intensive User for high score", () => {
    const r = calculateCarbonFootprint(
      makeHabits({
        streaming: { hoursPerDay: 20, quality: "4K" },
        gaming: { hoursPerDay: 20, platform: "cloud" },
      })
    );
    expect(r.scoreCategory).toBe("Carbon Intensive User");
  });

  it("values are rounded to 2 decimal places", () => {
    const r = calculateCarbonFootprint(
      makeHabits({
        aiUsage: { promptsPerDay: 7, imageGensPerDay: 3, codingHours: 2 },
      })
    );
    const decimals = (n: number) => (n.toString().split(".")[1] || "").length;
    expect(decimals(r.emissions.aiUsage)).toBeLessThanOrEqual(2);
    expect(decimals(r.emissions.total)).toBeLessThanOrEqual(2);
  });
});

// ===========================================================================
// 5. getScoreColor
// ===========================================================================
describe("getScoreColor", () => {
  it("returns emerald for score ≤ 20", () => {
    expect(getScoreColor(0)).toBe("#10b981");
    expect(getScoreColor(20)).toBe("#10b981");
  });

  it("returns green for score 21–40", () => {
    expect(getScoreColor(21)).toBe("#22c55e");
    expect(getScoreColor(40)).toBe("#22c55e");
  });

  it("returns amber for score 41–60", () => {
    expect(getScoreColor(41)).toBe("#f59e0b");
    expect(getScoreColor(60)).toBe("#f59e0b");
  });

  it("returns orange for score 61–80", () => {
    expect(getScoreColor(61)).toBe("#f97316");
    expect(getScoreColor(80)).toBe("#f97316");
  });

  it("returns red for score > 80", () => {
    expect(getScoreColor(81)).toBe("#ef4444");
    expect(getScoreColor(100)).toBe("#ef4444");
  });
});
