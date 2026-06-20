import { cn } from "./utils";

// ===========================================================================
// cn (className merge) – Utility Tests
// ===========================================================================
describe("cn utility", () => {
  it("merges single class strings", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  it("merges multiple class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes (falsy values ignored)", () => {
    expect(cn("bg-red-500", false && "hidden", "text-white")).toBe(
      "bg-red-500 text-white"
    );
  });

  it("handles undefined and null inputs", () => {
    expect(cn("px-4", undefined, null, "py-2")).toBe("px-4 py-2");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles object syntax from clsx", () => {
    const result = cn({ "text-red-500": true, hidden: false });
    expect(result).toBe("text-red-500");
  });

  it("handles array inputs", () => {
    const result = cn(["px-4", "py-2"]);
    expect(result).toBe("px-4 py-2");
  });
});
