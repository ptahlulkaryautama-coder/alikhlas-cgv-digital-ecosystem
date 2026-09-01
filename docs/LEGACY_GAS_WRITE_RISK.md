# Legacy GAS Write Risk

Status: critical inherited risk; documentation only. `Legacy/scripts/Code_v1_7.gs` was not modified.

## Capability found

The source implements `doPost`, parses an arbitrary JSON body, selects any entry in `SHEET_CONFIG`, and passes the payload to a generic handler (`Legacy/scripts/Code_v1_7.gs:140-161`). The handler supports:

- `create`: inserts a row and writes client-provided fields (`:228-243`);
- `update`: finds a numeric ID and replaces the configured row fields (`:211-225`);
- `delete`: calls `sheet.deleteRow`, permanently removing the row (`:201-209`).

Because the write path uses the same `SHEET_CONFIG`, it can target the production-named `02_Keuangan`, `01_Program_Kajian`, and `09_Agenda_Kalender` sheets (`:34-53`). Comments claiming Finance is read-only are not enforced by `doPost`.

## Why it is unsafe

- No authentication, signed session, authorization, role, or trusted actor identity.
- No separation between test and production sheet names or deployments.
- No command/field schema, size limits, enum validation, formula-injection defense, or privacy boundary.
- Client-controlled numeric IDs and mutable row lookup; no opaque stable IDs.
- No version/compare-and-set check, idempotency, rate limiting, or serialization lock.
- No append-only audit trail, reversible archive, or rollback protocol.
- Hard deletion is directly available.
- Errors may disclose implementation details through `String(err)`.

URL secrecy is not authentication. URLs appear in browser history, source files, logs, analytics, referrers, screenshots, and shared messages. Anyone who learns a public web-app URL can replay requests unless the deployed handler independently verifies identity and authorization.

## Deployment status

The repository proves only that the unsafe source exists. It does not prove which revision is currently deployed, whether its Execute-as/access settings expose `doPost`, or whether the deployment URL still points to this code. Phase 0 performs no request to that handler and no write probe, so deployed write capability remains unconfirmed.

## Required manual containment

An authorized Google Apps Script owner must:

1. Open the Apps Script project associated with the production spreadsheet and inspect **Deploy → Manage deployments**.
2. Record the active deployment ID, version, execution identity, and access scope without sharing the URL in tickets or UI.
3. Immediately disable/revoke any public deployment that contains this generic `doPost`, or deploy a read-only revision in which production `doPost` is absent/rejects every request.
4. Rotate/revoke any exposed deployment URL and review Apps Script execution logs and spreadsheet revision history for unexpected mutations.
5. Keep the future test writer in a separate Apps Script project/deployment and spreadsheet with least privilege.
6. Do not enable production writes until the authenticated server boundary, test allowlist, schema, versioning, idempotency, audit, archive, rate limits, backup, and rollback gates pass.

Removing or obscuring the URL alone is insufficient; authorization must be enforced on every server-side command.

## Required deployment separation before Phase 1

The owner must confirm, with private evidence, that the active production deployment is read-only and that the legacy generic `doPost` is disabled, replaced with an unconditional rejection, or inaccessible. Then create a separate test-only project/deployment bound only to the separate test spreadsheet. Production and test must not share deployment IDs, spreadsheet IDs, writer credentials, or audit logs.

Phase 1 must not begin until the active deployment inspection, legacy containment, read-only production replacement, test-only deployment separation, log/revision-history review, and owner/security sign-off are recorded. Repository inspection alone cannot confirm containment; current deployed write risk remains **unknown and uncontained** until those manual checks are complete.
