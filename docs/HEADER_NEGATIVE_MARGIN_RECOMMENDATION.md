# Header Negative-Margin Recommendation

Documentation only; no header code was changed in Phase 0.

- Selector: `.site-header`
- File: `src/styles/home.css`
- Current declaration: `margin-bottom: -80px`
- Routes affected: every public route rendering the shared `Header`, including `/`, `/live`, `/program`, `/agenda`, `/kabar`, `/kabar/:slug`, `/donasi`, `/kontak`, and `/transparansi`.
- Expected effect: the following page content is pulled upward by 80 px, allowing the navigation capsule to overlay the Hero/page hero. It does not itself disable `position: sticky`, but it can make Hero content appear covered when banner/header height or breakpoints change.

## Separate recommended patch

Candidate patch: remove only `margin-bottom: -80px` from `.site-header`, then adjust Hero/page-hero spacing only if visual testing proves necessary. Do not combine this with security work.

Acceptance verification must cover 375, 430, 768, 1024, and 1440 px: Live banner scrolls away; capsule remains at viewport top; Hero heading/actions are unobscured; no unexpected blank gap appears; and the mobile drawer opens, closes, and remains above content. The removal should not be merged until those checks pass.

