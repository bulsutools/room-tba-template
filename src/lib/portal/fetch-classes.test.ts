import { describe, expect, it } from "bun:test";
import { readPortalPageMeta } from "@lib/portal/fetch-classes";

describe("readPortalPageMeta", () => {
  it("reads nested classes pagination fields", () => {
    expect(
      readPortalPageMeta(
        {
          classes: {
            total: 12228,
            last_page: 13,
            to: 1000,
            data: [],
          },
        },
        1,
      ),
    ).toEqual({ total: 12228, lastPage: 13 });
  });

  it("treats a full final page as the last page", () => {
    expect(
      readPortalPageMeta(
        {
          classes: {
            total: 12228,
            last_page: 13,
            to: 12228,
            data: [],
          },
        },
        13,
      ),
    ).toEqual({ total: 12228, lastPage: 13 });
  });

  it("falls back to the current page when metadata is missing", () => {
    expect(readPortalPageMeta({ classes: { data: [{}] } }, 1)).toEqual({
      total: null,
      lastPage: 1,
    });
  });
});
