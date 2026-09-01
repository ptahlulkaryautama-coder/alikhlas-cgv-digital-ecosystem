# Supabase Shared Content Execution Guide

Status: applied to Supabase on 2026-08-02 through the SQL Editor; read-only. No browser mutation route exists.

## Deployment verification

- Five expected tables exist.
- RLS is enabled on all five tables.
- `anon` and `authenticated` can select through RLS policies.
- `anon` write privileges are blocked.
- `authenticated` write privileges are blocked.
- The online verification result was: `5 | true | true | true` for table count, all-RLS, anon-write-blocked, and authenticated-write-blocked.
- Local `.env.local` now selects `VITE_DATA_SOURCE=supabase` and remains ignored by Git.

## What this phase connects

- Public Web and Dashboard share `content_programs` and `content_agenda`.
- The TPQ dashboard reads only `tpq_public_schedule`, `tpq_public_agenda`, and `tpq_public_learning_focus`.
- If Supabase is unavailable or the tables are empty, the application keeps using its approved local fallback.

## Privacy boundary

The TPQ tables may contain schedules, general learning focus, public event information, room labels, audience labels, and generic teacher-role labels. They must never contain student, guardian, teacher identity, contact, attendance, grade, payment, report, or honorarium data.

## Safe activation sequence

1. Run `202608020001_shared_content_read_foundation.sql` in the project SQL editor. Completed 2026-08-02.
2. Verify all five tables have RLS enabled.
3. Keep every table empty until DKM approves the source records.
4. Set local `VITE_DATA_SOURCE=supabase` for a connection trial.
5. Confirm an empty table causes local fallback, not an empty or broken page.
6. Import only approved public-safe records with `source_verified=false` until the owner verifies them.
7. Set `source_verified=true` only with an identified DKM/TPQ source owner.

There are intentionally no frontend create, update, archive, or delete controls in this phase.
