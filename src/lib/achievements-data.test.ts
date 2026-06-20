import { ACHIEVEMENT_DEFINITIONS } from "./achievements-data";

// ===========================================================================
// Achievement Definitions – Data Integrity
// ===========================================================================
describe("Achievement Definitions – Structure", () => {
  it("has at least 8 achievement definitions", () => {
    expect(ACHIEVEMENT_DEFINITIONS.length).toBeGreaterThanOrEqual(8);
  });

  it("every definition has all required fields", () => {
    ACHIEVEMENT_DEFINITIONS.forEach((a) => {
      expect(typeof a.id).toBe("string");
      expect(a.id.length).toBeGreaterThan(0);
      expect(typeof a.title).toBe("string");
      expect(a.title.length).toBeGreaterThan(0);
      expect(typeof a.description).toBe("string");
      expect(a.description.length).toBeGreaterThan(0);
      expect(typeof a.icon).toBe("string");
      expect(a.icon.length).toBeGreaterThan(0);
      expect(typeof a.target).toBe("number");
      expect(a.target).toBeGreaterThan(0);
    });
  });

  it("every id is unique", () => {
    const ids = ACHIEVEMENT_DEFINITIONS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every title is unique", () => {
    const titles = ACHIEVEMENT_DEFINITIONS.map((a) => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

// ===========================================================================
// Achievement Definitions – Specific Achievements Exist
// ===========================================================================
describe("Achievement Definitions – Expected Entries", () => {
  const expectedIds = [
    "first_report",
    "streak_7",
    "eco_champion",
    "cloud_cleaner",
    "streaming_saver",
    "ai_mindful",
    "challenge_master",
    "carbon_cutter",
    "report_veteran",
    "xp_500",
  ];

  it.each(expectedIds)("contains achievement id '%s'", (id) => {
    const found = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    expect(found).toBeDefined();
  });

  it("first_report achievement has target of 1", () => {
    const a = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === "first_report")!;
    expect(a.target).toBe(1);
  });

  it("streak_7 achievement has target of 7", () => {
    const a = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === "streak_7")!;
    expect(a.target).toBe(7);
  });

  it("challenge_master achievement has target of 25", () => {
    const a = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === "challenge_master")!;
    expect(a.target).toBe(25);
  });

  it("xp_500 achievement has target of 500", () => {
    const a = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === "xp_500")!;
    expect(a.target).toBe(500);
  });
});
