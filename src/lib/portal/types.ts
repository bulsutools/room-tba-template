/** Loose portal class payload before normalization. */
export type PortalClassRow = Record<string, unknown>;

export type PortalFetchOptions = {
  termId: number;
  bearerToken: string;
  sessionId?: string;
  /** Rows per portal page (default 10000). */
  pageSize?: number;
  /** Delay between page requests in ms (default 400). */
  pageDelayMs?: number;
};

export type NormalizedPortalClass = {
  courseCode: string;
  section: string;
  type: string | null;
  courseTitle: string;
  schedule: string[];
  termId: number;
  facilityCode: string | null;
  /** portal college code, e.g. "CAS" (#846). */
  acadGroup: string | null;
  /** portal PeopleSoft department code, e.g. "LBICS" (#846). */
  acadOrg: string | null;
};
