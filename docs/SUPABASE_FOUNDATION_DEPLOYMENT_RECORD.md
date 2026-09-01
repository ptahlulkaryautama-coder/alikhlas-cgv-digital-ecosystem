# Supabase Foundation Deployment Record

## Deployment identity

- Applied: 2026-08-02 (Asia/Jakarta)
- Project reference: `ialwxioqkylyacpvtxwz`
- Project URL: `https://ialwxioqkylyacpvtxwz.supabase.co`
- Region observed: `ap-southeast-2` (Sydney)
- Migration source: `supabase/migrations/202608010001_auth_permissions_audit_foundation.sql`
- Apply method: authenticated Supabase SQL Editor
- Database status before apply: healthy; no project migration history was shown
- Result: `Success. No rows returned.`

No database password, secret key, service-role key, access token, or user credential is recorded here.

## Post-apply verification

| Check | Result |
|---|---:|
| Foundation tables | 4 |
| Tables with RLS enabled | 4 |
| Foundation policies | 6 |
| Seeded roles | 8 |
| Seeded permissions | 29 |
| `has_role(app_role)` | Present |
| `has_permission(text)` | Present |
| Authenticated direct privilege on `audit_events` | `SELECT` only |
| Anonymous read of `profiles` | Denied (`401`) |
| Anonymous read of `user_roles` | Denied (`401`) |
| Anonymous read of `role_permissions` | Denied (`401`) |
| Anonymous read of `audit_events` | Denied (`401`) |

## Auth configuration verified

- Email provider: enabled.
- Confirm email: enabled.
- Public self-signup: disabled.
- Anonymous sign-in: disabled.
- No application Auth users existed when the foundation was applied.

## Migration-history reconciliation

Applying SQL through SQL Editor creates the database objects but does not register the local filename in Supabase CLI migration history. Before the first future `supabase db push`:

1. Link the CLI to this exact project using an authenticated local CLI session.
2. Inspect remote migration history.
3. Mark `202608010001` as applied using the supported CLI migration-repair workflow.
4. Run a dry-run/diff and confirm that the CLI does not attempt to recreate the foundation objects.
5. Do not edit the applied migration. Corrections must use a new timestamped migration.

## Remaining gates

- First Auth user created through the Dashboard's controlled **Create new user** flow.
- Exactly one approved profile bootstrapped as `active` with role `super_admin` on 2026-08-02.
- Bootstrap verification returned 10 effective permissions and exactly one audit event.
- User email and Auth UID were matched inside the guarded transaction but are intentionally not recorded in repository documentation.
- Test active, invited, suspended, unauthorized, and anonymous access.
- Configure Site URL and approved redirect URLs before application login rollout.
- Establish backup/restore and incident-response procedures.
- Program schema and write RPCs remain unimplemented.
- Finance and TPQ personal data remain out of scope.
