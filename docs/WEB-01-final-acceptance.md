# WEB-01 — Release, cost and assistive-technology acceptance matrix

**Date:** 6 November 2026 · **Status:** *partially implementable*. **WEB-01 remains OPEN** until actual provider configuration and human acceptance are evidenced. This is a publication/operations assurance plan, not proof of a completed independent accessibility audit or deployed automated release hold.

## 1. Exact-commit deployment preflight (implemented as a code-only checker)

Use the read-only, credential-free script only when a deployment **candidate** is accessible via its Vercel URL:

```sh
node scripts/release-preflight.mjs <40-character-merged-SHA> https://<candidate-deployment>.vercel.app
```

It checks the **latest** GitHub combined commit-status contexts and the actual candidate's `publication.json` revision, refusing mismatches, missing, failed or pending checks. Passing means **safe for a responsible human to consider promotion**, not that promotion happened. The script never calls any provider write API, never injects secrets and never bypasses CI.

The existing GitHub repository requires these PR contexts: `ci/circleci: website-quality`, `ci/circleci: browser-accessibility` and `Vercel`, and Vercel builds run `npm run check`. This protects merges but **does not itself withhold the production alias after merge**.

**Blocker for unattended release safety:** In Vercel, configure project **Settings → Build and Deployment → Deployment Checks → Add Checks**, selecting the required source checks (where provider plan/integration supports their actual CircleCI GitHub commit-status contexts). Observe a **new** merged SHA remain **not publicly promoted** until its post-merge CircleCI browser context changes from pending to success; observe a failure not promoted. Alternative: approved staged production build and explicit promotion workflow, with ownership and credentials, only if the official checks feature cannot use the CircleCI contexts.

**Do NOT blindly set `github.autoAlias: false`** as a workaround: that removes automatic release behaviour and would leave the live site frozen until a reliable approved promoter is configured. **Do not mark this gate complete** from passing PR checks, preflight logic, Vercel READY or a dashboard setting alone.

Provider reference: [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks).

## 2. Real provider billing and quota monitoring (partial technical tooling only)

The public operations watcher currently exposes public commit-velocity as a **proxy**, never a billed charge. Vercel's authenticated FOCUS charge API can return team-wide records, but the API result is a **bounded sample**. Some records include `Tags.ProjectId`; others are shared/team costs without project attribution. A team amount is **not an HPI spend figure**.

The new **local-only** `scripts/focus-cost-audit.mjs` accepts FOCUS JSON or CSV exports. For JSON, supply a complete **trusted** envelope `{"exportComplete":true,"records":[...]}`. A bare JSON array is automatically **incomplete** and never proves a total. For CSV, only a declared complete export can validate full-period totals; otherwise the script treats it as partial and exits non-zero. Example:

```sh
node scripts/focus-cost-audit.mjs private-complete-focus-export.json prj_qJNfyJL17JNpEiuNlafJPZZKYkMN 5
```

It reports an attributable **known HPI subtotal**, separately counts untagged team charges, refuses unknown currencies and incomplete sources, and warns against a local threshold. It **does not** persist or upload provider financial data; do not commit private exports to GitHub. This is **not** a recurring provider monitor, and a tagged export may not include all resource costs or cover the full billing period: financial review is still required.

**Blocker for real recurring billed-cost/quota alerts:** owner-authorised complete export/API with complete project attribution, a private credential-safe schedule and notification path, an agreed threshold and validation against the provider dashboard and billing period. The team shares billing with unrelated projects. Neon/CircleCI consumption and actual quotas require separate verified provider data and must **never** be inferred from Vercel totals or commit count. Do not install paid add-ons or tokens in Git.

## 3. Human assistive technology acceptance (not delegated to automation)

**Current automated checks:** real Playwright Chromium at multiple viewport widths, axe WCAG checks, text zoom-equivalent and typography resizing, ARIA snapshots, keyboard traversal, CI artifacts. This is **not** actual screen-reader speech or OS browser zoom.

**Required human-assisted matrix** (record real tester, consent to share the observation only, date, SHA, device/browser/AT versions and route):
- Screen reader: **VoiceOver + Safari** on iOS or macOS; optionally NVDA + Firefox/Chrome on Windows, or TalkBack + Chrome on Android.
- Routes: `/`, `/roadmap`, `/initiatives/web-01`, `/research`, `/library` and `/contribute`.
- Workflows: start reading at heading, use skip link, traverse navigation, jump through headings and landmark regions, open first-party links, read research metadata and table headings, encounter error/unavailable source states, reach and identify focus order.
- Native browser zoom: 200% and 400% where available; verify text remains understandable, reflow does not hide controls or force both-direction scrolling except justified data tables.
- Screen-reader observations: correct spoken labels, meaningful headings and link purpose, no duplicate confusing title, distinguish pending scientific research from approved outcomes, and reading order consistent with visible layout.
- Record **PASS / FAIL / BLOCKED / NOT TESTED** per check and the evidence of an actual environment session. Synthetic ariaSnapshot outputs alone are **not** acceptance.

**Blocker:** an operator with real assistive technologies must perform and record a session. A qualified independent accessibility review is recommended for a genuinely external sign-off; none is claimed.

## 4. Go/no-go and sequenced roadmap

| Requirement | Technical evidence available | Pending acceptance |
|---|---|---|
| Protected PR checks, exact SHA, Vercel build | Yes (historically enforced, verify new SHA) | Per-release checks still required |
| Source/site post-merge preflight | Script and tests available | Actual promotion hold and positive/negative demonstration |
| Daily read-only monitor and configured alert path | Yes (CircleCI scheduled watcher, historically verified email) | Continuous uptime not claimed |
| Project billed/quota alerting | Offline FOCUS parser; unassigned costs disclosed | Complete provider data, private recurrence and alerts |
| Automated accessibility | Browser CI and artifacts | Actual human AT/OS-zoom test evidence |
| International privacy/science safeguards | Governance rules for public only | Independent field research ethics is separate, not WEB-01 |

**No automatic re-scoping** of the three open core gates as completed. If the founder later wants to close WEB-01 as *technical-only*, that requires an explicit narrowed acceptance and new independently tracked operational gates. Until then, do not close WEB-01 merely because new scripts/tests are shipped.
