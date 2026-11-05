# WEB-01 — Release security, operations and evidence-publication runbook

**Initial operating baseline:** 5 November 2026. **Maintainer:** founding repository administrator until governance and an incident-response owner are delegated. This is a public technical runbook, **not** a guarantee of continuous uptime, an approved scientific study or a claim that monitoring automatically sends alerts.

## Production and source of truth

- Canonical public website: https://human-prosperity-initiative.vercel.app
- GitHub source: `saver1991/human-prosperity-initiative`, `main`.
- Vercel: team `hub-ai-workflows`, project `human-prosperity-initiative`, ID `prj_qJNfyJL17JNpEiuNlafJPZZKYkMN`.
- CircleCI: `gh/saver1991/human-prosperity-initiative`. **Do not add GitHub Actions.**
- The website generates `dist` from repository documents via `npm run check` (`npm run build && npm test`); the production Vercel build executes this command. No production browser secrets or private respondent data belong in the static site.
- The published `/publication.json` includes the Git revision. `/status` and `/api/freshness` compare the public `main` revision to the published revision with explicit unknown/error states and a short cache.

## Release gates: what is enforced, and what is not

**GitHub `main` protection enabled 5 November 2026:**
- A pull request is required; 0 third-party approval reviews required while the project has only its founding maintainer.
- All three commit status contexts **must succeed**: `ci/circleci: website-quality`, `ci/circleci: browser-accessibility`, `Vercel`.
- Strict up-to-date branch checks, conversation resolution and administrator enforcement are on; force pushes and branch deletion are off.
- Never substitute a green check on another SHA for the proposed merge SHA. Wait for all current checks before merging. If a contributor changes a CircleCI job name, update protection in the same controlled change, and verify the actual reported status context first.

**Remaining limitation:** Vercel Git-linked production may still publish a newly merged commit before **post-merge** CircleCI browser checks on that exact merge commit finish. The Vercel build itself fails closed if `npm run check` fails; this is not the same as a fully independent **Vercel Deployment Check** awaiting CircleCI after merge. Investigate that additional feature/plan compatibility and test it before stating release promotion is gated on post-merge browser QA. Never install GitHub Actions as a workaround. An alternative is an explicitly reviewed CircleCI-built staged production deployment + smoke test + promote pipeline, but do not introduce tokens, deploy modes or increased billed build minutes without approval.

## Browser/accessibility coverage

CircleCI has two jobs:
1. `website-quality`: exact GitHub SHA fetch, source build, document/link checks and Node tests.
2. `browser-accessibility`: same SHA, Playwright Chromium on 320/390/768/1440 CSS-pixel viewports and WCAG 2.2 AA axe checks on key routes. It also checks semantic landmarks, horizontal overflow, JavaScript errors, keyboard skip link, first-party navigation, public activity and publication status.

The merged [PR #18](https://github.com/saver1991/human-prosperity-initiative/pull/18) hardened accessibility; its deployed commit `59cadc3` had both required CircleCI status contexts `success` and a successful Vercel status at the 5 November audit. The older consolidated QA baseline recorded 178/178 checks with zero axe violations; **do not transfer that exact count to future revisions without a new report**.

**Playwright extension (PR #21):** the real Chromium job now tests 640/320 CSS-pixel *zoom-equivalent* reflow for the main public routes (a 1280px layout viewed at nominal 200%/400%), the accessible main heading and named navigation via Playwright `ariaSnapshot()`, keyboard traversal across 12 consecutive focus targets on representative pages, and controlled 200% typographic-resize stress. Screenshots and `qa-artifacts/browser-report.json` are stored for auditing. These are automated checks for layout/semantics, **not actual browser UI zoom or spoken output from NVDA/VoiceOver**. Only mark them accepted after an exact-SHA CircleCI PASS.

Remaining qualitative/accessibility acceptance: representative OS/browser zoom and screen reader observations (NVDA, VoiceOver, TalkBack, or equivalent) by a suitable tester, with browser/OS, assistive technology, route, finding and tested commit recorded. The automated layout-equivalence and ARIA checks substantially reduce manual coverage but **do not prove usability in a real screen reader**. If a suitable environment cannot be accessed, label that narrow part as independently unverified rather than blocking unrelated automated improvements.

## Safe operational inspection

For every production incident or planned release, check:
1. Vercel deployment state and aliases: exact team/project, `READY` and `production` on the expected commit; confirm the canonical hostname is attached.
2. GitHub main SHA vs `/publication.json` revision; use `/status` for the public comparison. Allow transient propagation. A persistent mismatch after release should be investigated, not automatically force-deployed.
3. Vercel build logs and `npm run check`; CircleCI latest commit statuses on the same SHA. Missing checks must be called `unknown`/unverified, not `passed`.
4. Public GET smoke: `/`, `/mission`, `/research`, `/library`, `/roadmap`, `/status`, `/publication.json`. No cookie, personal data, auth or third-party private API should be necessary to read research.
5. Vercel runtime errors for server-side read-only endpoints, with sensitive log fields excluded. Vercel deployment `READY` alone is not an uptime test.

**Operational triggers for human attention:** non-READY current production, canonical alias absent, broken public routes, required CI failure/missing checks on a changed release, persistent revision mismatch, severe new accessibility violations, unexpected billable spikes. **Alerts are not automatically configured by this document.** The founding maintainer currently owns triage until a delegated, privacy-respecting monitoring channel is operational.

## Triage and rollback

1. Record incident time (UTC), affected routes, production deployment ID, expected SHA, actual SHA, CircleCI/Vercel status links and sanitized error symptoms in a public issue if no security/privacy risk; keep sensitive details in private reporting channels.
2. For a content or accessibility regression: prefer fix on a PR with all checks. Do not bypass required checks to hurry publication.
3. For a serious production outage: inspect the last known-good **production** deployment in the same Vercel project and consider provider rollback only after confirming the deployment ID, original commit, site behaviour and authorization. **Do not roll back databases or Neon data**: the current frontend is static.
4. A Vercel production rollback may stop automatic alias updates. Restore standard publication with a reviewed new production deployment/promotion only after the cause is understood. Confirm canonical hostname, correct SHA and public smoke afterward.
5. Publish a concise incident note with mitigation, root cause (if known), prevention, and unresolved risks. Never post secrets, private logs, participant data, access tokens or browser auth state.

## Costs and provider limits

- GitHub public repository, Vercel team, CircleCI and Neon have distinct quotas and billing scopes. The **Vercel team is shared across other projects**: team charges are **not an HPI-specific total** without verified resource attribution.
- Review Vercel billing usage at the team/resource level and build-minute spikes; review CircleCI build minutes/workflows and Neon free-tier limits separately. Keep alerts/limits in provider settings if included in the existing plan, without opting into a paid monitoring product.
- No new subscription, paid API, external monitoring account, database access token or scheduled paid deployment is authorised by this runbook.

## Future read-only evidence API: publication decision

**Not live.** Today's public Markdown/CSV files are versioned in Git, statically rendered in /research and /library, and are preferable to a new runtime database API while the dataset is small. Publish curated, non-personal research metadata through a reviewed static JSON/CSV export in Git before evaluating Neon-backed access.

If a future live API is justified:
1. Define a **public-data allowlist** (study IDs, links, public licensing, retrieval dates, non-sensitive summary fields), review third-party redistribution rights and disallow participant microdata, private consent records, unpublished external datasets and free-form user input.
2. Add a separate **server-only, read-only database role** granted SELECT on a tightly controlled publication view, not on raw research tables. Avoid exposing connection strings in the browser, GitHub or build artifacts.
3. Use a reviewable publication workflow: source record → independent citation/license check → public approved view/export → schema validation → static/signed build provenance → deployment QA → rollback capability. Never treat data appearing in Neon as automatically approved for public release.
4. Enforce query bounding, projection/schema validation, least privilege, caching, budget limits, safe error responses, and provenance; test rejection of unapproved columns and privacy-bearing content.
5. Obtain a separate governance/security sign-off and quantify operating costs before enabling the API.

## Deferred, nonblocking items

- A verified custom domain if/when one is owned (the Vercel URL remains canonical meanwhile).
- Optional multilingual site navigation and privacy-preserving aggregated analytics with explicit justification; no tracking by default.
- Independent manual accessibility review and independently gated post-merge production promotion.
- Event-driven uptime/CI alerts using existing free/approved tooling; current `/status` is an **on-demand** check, not an alerting service.

Keep this public file synchronized with the actual settings and evidence. Do not mark any deferred item complete merely because it is described here.
