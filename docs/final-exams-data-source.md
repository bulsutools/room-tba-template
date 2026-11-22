# Final exams data source (v1 spike)

**Status:** v1 uses volunteer-imported the registrar releases. portal finals endpoint TBD.

## v1 source: the registrar / Office of the Registrar

Near end-of-term, the registrar publishes consolidated final examination schedules (course, section, venue, date, time). Releases are typically PDF or spreadsheet on registrar channels: not part of the portal class list we import for regular schedules.

Room TBA v1 treats the registrar as the authoritative source and loads sanitized JSON via `scripts/import-final-exams.ts`.

## Sample row shape (import JSON)

File: `data/final-exams-{termId}.json` (gitignored). Committed fixture: `data/final-exams-sample.json`.

```json
{
  "term_id": 1252,
  "source": "registrar-2025-2nd-sem",
  "exams": [
    {
      "course_code": "CMSC 130",
      "section": "A-1L",
      "course_title": "Introduction to Computing",
      "room_code": "ICS L105",
      "exam_date": "2026-05-15",
      "starts_at": "08:00",
      "ends_at": "10:00"
    }
  ]
}
```

| Field | Required | Notes |
| ----------------------- | -------- | ----------------------------------------------------------------------- |
| `term_id` | yes | CRS id (`1251` 1st sem, `1252` 2nd sem, `1253` midyear) |
| `source` | yes | Provenance label stored on each row (e.g. `registrar-2025-2nd-sem`) |
| `course_code` | yes | Normalized to uppercase |
| `section` | no | Nullable when the registrar lists course-only |
| `course_title` | no | Denormalized for display |
| `room_code` | no | Matched to `rooms.room_code`; row kept with `room_id` null if unmatched |
| `exam_date` | yes | `YYYY-MM-DD`, Asia/Manila calendar day |
| `starts_at` / `ends_at` | yes | `HH:MM` or `HH:MM:SS`, Asia/Manila local time |

**PII:** Do not import instructor or proctor names (same rule as portal class import).

## portal (TBD)

Authenticated spike still needed: unknown whether `portal.example.edu` exposes per-section final exam slots. If portal adds finals, a future importer could mirror `import-portal-classes.ts`; v1 does not depend on it.

## Ops

```sh
# Edit data/final-exams-1252.json from the registrar release, then:
DATABASE_URL=… bun run import:final-exams -- --term-id 1252 --replace

# Parse only:
bun run import:final-exams -- --term-id 1252 --dry-run
```

Re-import with `, replace` is idempotent for a term (delete + insert in one transaction, refresh `final_exams` sync key).
