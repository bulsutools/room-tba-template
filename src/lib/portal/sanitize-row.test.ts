import { describe, expect, it } from "bun:test";
import {
  portalExportContainsInstructorPii,
  sanitizePortalRow,
} from "@lib/portal/sanitize-row";

describe("sanitizePortalRow", () => {
  it("removes nested faculty user names", () => {
    const sanitized = sanitizePortalRow({
      course_code: "CMSC 123",
      section: "A",
      class_dates: [
        {
          date: "MW",
          start_time: "07:00 AM",
          end_time: "08:00 AM",
          faculty: {
            faculty_id: 2535,
            user: {
              first_name: "ARIEL",
              last_name: "BOMBIO",
              formatted_name: "BOMBIO, ARIEL MANOPLA.",
            },
          },
        },
      ],
    });

    expect(JSON.stringify(sanitized)).not.toContain("BOMBIO");
    expect(JSON.stringify(sanitized)).not.toContain("formatted_name");
    expect(sanitized.class_dates?.[0]).toEqual({
      date: "MW",
      start_time: "07:00 AM",
      end_time: "08:00 AM",
    });
  });

  it("keeps schedule and facility fields", () => {
    const sanitized = sanitizePortalRow({
      course_code: "HK 12",
      section: "AB",
      facility_id: "HALL A",
      course: { title: "Physical Education" },
    });

    expect(sanitized).toEqual({
      course_code: "HK 12",
      section: "AB",
      facility_id: "HALL A",
      course: { title: "Physical Education" },
    });
  });
});

describe("portalExportContainsInstructorPii", () => {
  it("detects unsanitized exports", () => {
    expect(
      portalExportContainsInstructorPii({
        classes: [{ faculty: { user: { first_name: "A" } } }],
      }),
    ).toBe(true);
    expect(
      portalExportContainsInstructorPii({
        classes: [{ course_code: "CMSC 123", last_name: "DOE" }],
      }),
    ).toBe(true);
    expect(
      portalExportContainsInstructorPii({
        classes: [{ course_code: "CMSC 123" }],
      }),
    ).toBe(false);
  });
});
