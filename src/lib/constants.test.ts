import { APP_NAME, APP_DESCRIPTION, NAV_ITEMS, ADMIN_NAV_ITEMS, SCORE_BADGES } from "./constants";

// ===========================================================================
// Constants – App Metadata
// ===========================================================================
describe("App Constants", () => {
  it("APP_NAME is EcoByte", () => {
    expect(APP_NAME).toBe("EcoByte");
  });

  it("APP_DESCRIPTION is non-empty", () => {
    expect(APP_DESCRIPTION.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// NAV_ITEMS
// ===========================================================================
describe("NAV_ITEMS", () => {
  it("has at least 5 navigation items", () => {
    expect(NAV_ITEMS.length).toBeGreaterThanOrEqual(5);
  });

  it("every nav item has label, href, and icon", () => {
    NAV_ITEMS.forEach((item) => {
      expect(typeof item.label).toBe("string");
      expect(item.label.length).toBeGreaterThan(0);
      expect(typeof item.href).toBe("string");
      expect(item.href.startsWith("/")).toBe(true);
      expect(typeof item.icon).toBe("string");
    });
  });

  it("all hrefs are unique", () => {
    const hrefs = NAV_ITEMS.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("includes the Dashboard route", () => {
    expect(NAV_ITEMS.some((i) => i.href === "/dashboard")).toBe(true);
  });

  it("includes the Track Habits route", () => {
    expect(NAV_ITEMS.some((i) => i.href === "/track")).toBe(true);
  });

  it("includes the AI Coach route", () => {
    expect(NAV_ITEMS.some((i) => i.href === "/coach")).toBe(true);
  });
});

// ===========================================================================
// ADMIN_NAV_ITEMS
// ===========================================================================
describe("ADMIN_NAV_ITEMS", () => {
  it("has exactly 1 admin navigation item", () => {
    expect(ADMIN_NAV_ITEMS).toHaveLength(1);
  });

  it("admin route starts with /admin", () => {
    expect(ADMIN_NAV_ITEMS[0].href).toBe("/admin");
  });
});

// ===========================================================================
// SCORE_BADGES
// ===========================================================================
describe("SCORE_BADGES", () => {
  const expectedCategories = [
    "Eco Champion",
    "Green User",
    "Average User",
    "Heavy Digital Consumer",
    "Carbon Intensive User",
  ] as const;

  it("has all five score categories", () => {
    expectedCategories.forEach((cat) => {
      expect(SCORE_BADGES).toHaveProperty(cat);
    });
  });

  it("each badge has an emoji and color CSS classes", () => {
    Object.values(SCORE_BADGES).forEach((badge) => {
      expect(typeof badge.emoji).toBe("string");
      expect(badge.emoji.length).toBeGreaterThan(0);
      expect(typeof badge.color).toBe("string");
      expect(badge.color.length).toBeGreaterThan(0);
    });
  });
});
