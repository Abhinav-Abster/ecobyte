import { calculateCarbonFootprint } from "./carbon-calculator";
import { HabitEntryData } from "@/types";

describe("Carbon Footprint Calculator Engine", () => {
  it("should calculate correct emissions for zero consumption habits", () => {
    const zeroHabits: HabitEntryData = {
      streaming: { hoursPerDay: 0, quality: "1080p" },
      gaming: { hoursPerDay: 0, platform: "pc" },
      aiUsage: { promptsPerDay: 0, imageGensPerDay: 0, codingHours: 0 },
      cloudStorage: { storageGB: 0 },
      videoMeetings: { hoursPerWeek: 0 },
      emails: { sentPerDay: 0 },
      devices: { laptopHours: 0, desktopHours: 0, smartphoneHours: 0 },
    };

    const report = calculateCarbonFootprint(zeroHabits);

    expect(report.emissions.streaming).toBe(0);
    expect(report.emissions.gaming).toBe(0);
    expect(report.emissions.aiUsage).toBe(0);
    expect(report.emissions.cloudStorage).toBe(0);
    expect(report.emissions.videoCalls).toBe(0);
    expect(report.emissions.emails).toBe(0);
    expect(report.emissions.devices).toBe(0);
    expect(report.emissions.total).toBe(0);
    expect(report.carbonScore).toBe(0);
    expect(report.scoreCategory).toBe("Eco Champion");
  });

  it("should calculate correct emissions for average consumption habits", () => {
    const habits: HabitEntryData = {
      streaming: { hoursPerDay: 2, quality: "1080p" },
      gaming: { hoursPerDay: 1, platform: "console" },
      aiUsage: { promptsPerDay: 10, imageGensPerDay: 1, codingHours: 1 },
      cloudStorage: { storageGB: 100 },
      videoMeetings: { hoursPerWeek: 5 },
      emails: { sentPerDay: 10 },
      devices: { laptopHours: 4, desktopHours: 0, smartphoneHours: 3 },
    };

    const report = calculateCarbonFootprint(habits);

    expect(report.emissions.total).toBeGreaterThan(0);
    expect(report.carbonScore).toBeGreaterThanOrEqual(0);
    expect(report.carbonScore).toBeLessThanOrEqual(100);
    expect(typeof report.scoreCategory).toBe("string");
  });
});
