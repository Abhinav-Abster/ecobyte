import { CHALLENGE_TEMPLATES, getDailyChallenges } from "./challenges-data";
import type { ChallengeCategory } from "@/types";

// ===========================================================================
// Challenge Templates – Data Integrity
// ===========================================================================
describe("Challenge Templates – Structure", () => {
  it("has at least 10 challenge templates", () => {
    expect(CHALLENGE_TEMPLATES.length).toBeGreaterThanOrEqual(10);
  });

  it("each template has all required fields", () => {
    CHALLENGE_TEMPLATES.forEach((t) => {
      expect(typeof t.title).toBe("string");
      expect(t.title.length).toBeGreaterThan(0);
      expect(typeof t.description).toBe("string");
      expect(t.description.length).toBeGreaterThan(0);
      expect(typeof t.category).toBe("string");
      expect(typeof t.xpReward).toBe("number");
      expect(t.xpReward).toBeGreaterThan(0);
    });
  });

  it("every title is unique", () => {
    const titles = CHALLENGE_TEMPLATES.map((t) => t.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  const validCategories: ChallengeCategory[] = [
    "streaming",
    "gaming",
    "ai",
    "cloud",
    "video",
    "email",
    "device",
  ];

  it("each category is a valid ChallengeCategory", () => {
    CHALLENGE_TEMPLATES.forEach((t) => {
      expect(validCategories).toContain(t.category);
    });
  });

  it("covers at least 5 distinct categories", () => {
    const unique = new Set(CHALLENGE_TEMPLATES.map((t) => t.category));
    expect(unique.size).toBeGreaterThanOrEqual(5);
  });
});

// ===========================================================================
// getDailyChallenges – Selection Logic
// ===========================================================================
describe("getDailyChallenges", () => {
  it("always returns exactly 3 challenges", () => {
    // run multiple times because of randomness
    for (let i = 0; i < 20; i++) {
      const result = getDailyChallenges();
      expect(result).toHaveLength(3);
    }
  });

  it("returns valid ChallengeTemplate objects", () => {
    const result = getDailyChallenges();
    result.forEach((c) => {
      expect(c).toHaveProperty("title");
      expect(c).toHaveProperty("description");
      expect(c).toHaveProperty("category");
      expect(c).toHaveProperty("xpReward");
    });
  });

  it("prefers unique categories when possible", () => {
    // Run several trials — category diversity should be ≥ 2 on average
    let diverseCount = 0;
    const trials = 50;
    for (let i = 0; i < trials; i++) {
      const result = getDailyChallenges();
      const uniqueCats = new Set(result.map((c) => c.category));
      if (uniqueCats.size >= 2) diverseCount++;
    }
    // At least 80 % of runs should have diverse categories
    expect(diverseCount / trials).toBeGreaterThanOrEqual(0.8);
  });

  it("selected challenges exist in the template pool", () => {
    const result = getDailyChallenges();
    const allTitles = CHALLENGE_TEMPLATES.map((t) => t.title);
    result.forEach((c) => {
      expect(allTitles).toContain(c.title);
    });
  });
});
