/** Operator-facing exit codes for `import-portal-classes` (#318). */
export const PORTAL_IMPORT_EXIT = {
  OK: 0,
  USAGE: 1,
  CI_FETCH_BLOCKED: 2,
  MISSING_DATABASE_URL: 3,
  MISSING_EXPORT: 4,
  NO_NORMALIZED_ROWS: 5,
  AUTH_EXPIRED: 10,
  FORBIDDEN: 11,
  RATE_LIMIT: 12,
  SCHEMA_MISMATCH: 13,
  PORTAL_UNAVAILABLE: 14,
  UNKNOWN: 99,
} as const;

export type PortalImportErrorCode = keyof typeof PORTAL_IMPORT_EXIT;

export class PortalImportError extends Error {
  readonly code: PortalImportErrorCode;

  constructor(code: PortalImportErrorCode, message: string) {
    super(message);
    this.name = "PortalImportError";
    this.code = code;
  }
}

export function portalImportExitCode(code: PortalImportErrorCode): number {
  return PORTAL_IMPORT_EXIT[code];
}

export function classifyPortalHttpStatus(status: number): PortalImportErrorCode {
  if (status === 401) return "AUTH_EXPIRED";
  if (status === 403) return "FORBIDDEN";
  if (status === 429) return "RATE_LIMIT";
  if (status >= 500) return "PORTAL_UNAVAILABLE";
  return "UNKNOWN";
}

export function operatorHintForCode(code: PortalImportErrorCode): string {
  switch (code) {
    case "AUTH_EXPIRED":
      return "Paste a fresh portal bearer token, or import cached JSON with --from-json.";
    case "FORBIDDEN":
      return "portal blocked the request. Stop live fetch; use cached JSON and import to Supabase.";
    case "RATE_LIMIT":
      return "Wait and retry --fetch, or import from the last saved JSON export.";
    case "SCHEMA_MISMATCH":
      return "portal response shape changed. Fix the parser or use a manual JSON export.";
    case "PORTAL_UNAVAILABLE":
      return "portal is down. Import from cached JSON; users keep last Supabase/PGlite data.";
    case "MISSING_EXPORT":
      return "Run once with --fetch while the token is valid, or pass --from-json.";
    default:
      return "See docs/portal-contingency-runbook.md.";
  }
}
