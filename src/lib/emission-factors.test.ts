import { EMISSION_FACTORS, SCORE_THRESHOLDS, CATEGORY_CONFIG } from "./emission-factors";

// ===========================================================================
// Emission Factors – Data Integrity Tests
// ===========================================================================
describe("Emission Factors – Streaming", () => {
  it("has all four quality tiers", () => {
    expect(EMISSION_FACTORS.streaming).toHaveProperty("480p");
    expect(EMISSION_FACTORS.streaming).toHaveProperty("720p");
    expect(EMISSION_FACTORS.streaming).toHaveProperty("1080p");
    expect(EMISSION_FACTORS.streaming).toHaveProperty("4K");
  });

  it("values increase with quality", () => {
    expect(EMISSION_FACTORS.streaming["480p"]).toBeLessThan(EMISSION_FACTORS.streaming["720p"]);
    expect(EMISSION_FACTORS.streaming["720p"]).toBeLessThan(EMISSION_FACTORS.streaming["1080p"]);
    expect(EMISSION_FACTORS.streaming["1080p"]).toBeLessThan(EMISSION_FACTORS.streaming["4K"]);
  });

  it("all values are positive numbers", () => {
    Object.values(EMISSION_FACTORS.streaming).forEach((v) => {
      expect(v).toBeGreaterThan(0);
    });
  });
});

describe("Emission Factors – Gaming", () => {
  it("has pc, console, and cloud platforms", () => {
    expect(EMISSION_FACTORS.gaming).toHaveProperty("pc");
    expect(EMISSION_FACTORS.gaming).toHaveProperty("console");
    expect(EMISSION_FACTORS.gaming).toHaveProperty("cloud");
  });

  it("all values are positive", () => {
    Object.values(EMISSION_FACTORS.gaming).forEach((v) => {
      expect(v).toBeGreaterThan(0);
    });
  });

  it("cloud gaming has the highest emission factor", () => {
    expect(EMISSION_FACTORS.gaming.cloud).toBeGreaterThan(EMISSION_FACTORS.gaming.pc);
    expect(EMISSION_FACTORS.gaming.cloud).toBeGreaterThan(EMISSION_FACTORS.gaming.console);
  });
});

describe("Emission Factors – AI", () => {
  it("has textPrompt, imageGeneration, and codingAssistant", () => {
    expect(EMISSION_FACTORS.ai.textPrompt).toBeDefined();
    expect(EMISSION_FACTORS.ai.imageGeneration).toBeDefined();
    expect(EMISSION_FACTORS.ai.codingAssistant).toBeDefined();
  });

  it("image generation has higher factor than text prompt", () => {
    expect(EMISSION_FACTORS.ai.imageGeneration).toBeGreaterThan(EMISSION_FACTORS.ai.textPrompt);
  });

  it("all AI factors are positive", () => {
    expect(EMISSION_FACTORS.ai.textPrompt).toBeGreaterThan(0);
    expect(EMISSION_FACTORS.ai.imageGeneration).toBeGreaterThan(0);
    expect(EMISSION_FACTORS.ai.codingAssistant).toBeGreaterThan(0);
  });
});

describe("Emission Factors – Scalar Values", () => {
  it("cloud storage factor is positive", () => {
    expect(EMISSION_FACTORS.cloudStorage).toBeGreaterThan(0);
  });

  it("video meetings factor is positive", () => {
    expect(EMISSION_FACTORS.videoMeetings).toBeGreaterThan(0);
  });

  it("email factor is positive", () => {
    expect(EMISSION_FACTORS.emails).toBeGreaterThan(0);
  });
});

describe("Emission Factors – Devices", () => {
  it("has laptop, desktop, and smartphone", () => {
    expect(EMISSION_FACTORS.devices.laptop).toBeDefined();
    expect(EMISSION_FACTORS.devices.desktop).toBeDefined();
    expect(EMISSION_FACTORS.devices.smartphone).toBeDefined();
  });

  it("desktop has higher factor than laptop", () => {
    expect(EMISSION_FACTORS.devices.desktop).toBeGreaterThan(EMISSION_FACTORS.devices.laptop);
  });

  it("smartphone has the lowest factor", () => {
    expect(EMISSION_FACTORS.devices.smartphone).toBeLessThan(EMISSION_FACTORS.devices.laptop);
  });
});

// ===========================================================================
// Score Thresholds
// ===========================================================================
describe("Score Thresholds", () => {
  it("thresholds are in ascending order", () => {
    expect(SCORE_THRESHOLDS.ecoChampion).toBeLessThan(SCORE_THRESHOLDS.greenUser);
    expect(SCORE_THRESHOLDS.greenUser).toBeLessThan(SCORE_THRESHOLDS.averageUser);
    expect(SCORE_THRESHOLDS.averageUser).toBeLessThan(SCORE_THRESHOLDS.heavyConsumer);
  });

  it("all threshold values are positive", () => {
    Object.values(SCORE_THRESHOLDS).forEach((v) => {
      expect(v).toBeGreaterThan(0);
    });
  });
});

// ===========================================================================
// Category Config
// ===========================================================================
describe("Category Config", () => {
  const expectedCategories = [
    "streaming",
    "gaming",
    "aiUsage",
    "cloudStorage",
    "videoCalls",
    "emails",
    "devices",
  ];

  it("has all seven emission categories", () => {
    expectedCategories.forEach((cat) => {
      expect(CATEGORY_CONFIG).toHaveProperty(cat);
    });
  });

  it("each category has a non-empty label", () => {
    Object.values(CATEGORY_CONFIG).forEach((cfg) => {
      expect(typeof cfg.label).toBe("string");
      expect(cfg.label.length).toBeGreaterThan(0);
    });
  });

  it("each category has a hex color string", () => {
    Object.values(CATEGORY_CONFIG).forEach((cfg) => {
      expect(cfg.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
