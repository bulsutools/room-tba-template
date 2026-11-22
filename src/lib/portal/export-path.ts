/** Local-only portal cache path for a CRS term_id (gitignored). */
export function defaultPortalExportPath(termId: number): string {
  const label =
    termId === 1251
      ? "1st-sem"
      : termId === 1252
        ? "2nd-sem"
        : termId === 1253
          ? "midyear"
          : `term-${termId}`;
  return `data/portal-${label}-${termId}.json`;
}
