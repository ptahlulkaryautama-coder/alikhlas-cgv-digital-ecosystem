# TPQ Public Projection Contract

## Purpose

`src/data/tpqPublicProjection.js` is the only public-safe model derived from the protected TPQ prototype. Public code must access it through `tpqRepository`; it must never import `tpqData.js` or legacy/localStorage data directly.

## Allowed output

- Class/program name, learning level, day, time, room, and general description without rosters.
- Public agenda title, date, time, mosque/TPQ location, category, and publication status.
- General learning-focus descriptions and targets.
- Public Kabar records already approved by the Kabar editorial filter.
- Aggregate display state only when accompanied by `isVerified`; current aggregate values are explicitly unverified.
- `sourceVerified` / source-status metadata.

Public methods are `getPublicSchedule()`, `getPublicAgenda()`, `getPublicLearningFocus()`, and `getPublicNews()`.

## Prohibited output

Student names or rosters, guardian details, phone numbers, home addresses, grades, evaluation notes, individual attendance, SPP/payment data, report cards, teacher honorarium, staff PII, personal photographs, or legacy localStorage records.

## Protected projection

`/app/tpq` may consume the aggregate/config prototype through `tpqRepository.getAll()`. This remains prototype navigation behind client-side PIN gating, not server-authorized private data access. Individual records must not be added until server authentication, authorization, encryption, audit, retention, and consent policies exist.

## Verification and deployment

The source label is `Protected prototype data` with `verified:false` and `Integrasi belum diverifikasi`. Changes currently require rebuild and deployment. No mutation path exists.
