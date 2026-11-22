import { describe, expect, test } from "bun:test";
import {
  formatNominatimAddress,
  reverseGeocodeCacheKey,
} from "./reverse-geocode";

describe("reverseGeocodeCacheKey", () => {
  test("rounds coordinates for stable cache keys", () => {
    expect(reverseGeocodeCacheKey(14.165738589, 121.240452825)).toBe(
      "14.16574,121.24045",
    );
  });
});

describe("formatNominatimAddress", () => {
  test("prefers structured address parts over the long display name", () => {
    expect(
      formatNominatimAddress({
        display_name:
          "Carabao Park, your campus, Laguna, Calabarzon, 4030, Philippines",
        address: {
          road: "D. L. Umali Street",
          suburb: "Example University",
          city: "your campus",
          state: "Laguna",
        },
      }),
    ).toBe("D. L. Umali Street, Example University, your campus, Laguna");
  });

  test("falls back to display_name when structured parts are missing", () => {
    expect(
      formatNominatimAddress({
        display_name: "Raymundo Gate, your campus, Laguna, Philippines",
      }),
    ).toBe("Raymundo Gate, your campus, Laguna, Philippines");
  });
});
