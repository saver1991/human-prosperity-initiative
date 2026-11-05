# WEB-02.1 — Public roadmap data contract V1.0

**Status:** Engineering contract for the HPI website, 5 November 2026. This is **not** scientific-review V1.0, a live task database, an incorporated institution or an impact finding.

## Existing system inventory and duplication audit

| Source | Authority | Current behaviour | Risk | Public display approach |
| --- | --- | --- | --- | --- |
| `docs/roadmap.md` | HPI GitHub | Narrative stages, scientific gates, Now/Next/Later; published as a source-derived page | Hard to navigate, narrative may lag issue state | Narrative remains a first-party readable source; dashboard is a presentation of the same roadmap |
| `portfolio/project.json` | HPI GitHub | Stable workstream IDs, owners as **roles only**, provisional stage/horizon/issue number | Limited task detail and occasional planned statuses despite published drafts | Canonical **ID, title, phase, priority and editorial status** for the website |
| `portfolio/public-roadmap.json` | HPI GitHub | **New** reviewable public enrichment: summary, gate, deliverables, epic/task *snapshot* | Can become stale without verification; must not be mistaken for live GitHub state | Include prominent snapshot date, public data provenance and no invented completion percentages |
| GitHub Issues | HPI GitHub | Actual open/closed state, comments, checklists and source discussion | Closing an issue does not itself prove scientific/ethics approval | Authoritative source and action links. A future dynamic status overlay must fail closed, never reinterpret a closed issue as validated impact |
| `/activity` and `/api/issues` | Public site | Cached, on-demand public issue feed (separate existing implementation) | Rate limits and partial top-100 feed; requires staleness handling | Keep source link; WEB-02.4 will add bounded reconciliation, **not** implemented by this epic |
| SolOS HPI profile | SolOS versioned project catalogue | Explicit read-only, possibly older snapshot; no task-sync API | Stale data or false implication of automatic status sync | SolOS displays pinned snapshot with age/revision, not source authority |
| HubOS | Portfolio governance | HPI programme authority, technical ownership and broader tracking | Duplicates when a GitHub issue is mistaken for a new portfolio DB record | HubOS carries governance; never silently write an HPI/HubOS/SolOS database |
| Scientific documents | HPI GitHub | F0-01 V0.4 candidate, F0-03 V0.1 candidate, F0-03.1 internal pre-review | A published paper/webpage can be mistaken for independently validated research | Display review gates, nonparticipants' harms and absence of measured impact explicitly |

## Public schema and data provenance

The audited programme tree is **Programme → Initiative → Epic → Task**. Stable HPI keys such as `WEB-02`, `WEB-02.1` and `WEB-02.1-T01` are preserved across website pages and issue links. The public model is produced by `buildPublicRoadmap(project,details,{revision})` in `scripts/roadmap-model.mjs` from versioned JSON:
- IDs, phase and editorial workstream state come from `portfolio/project.json`.
- Detailed summaries, ethical/research gates, first-party public documents, epic/task descriptions and **dated editorial status snapshots** come from `portfolio/public-roadmap.json`.
- Tasks carry optional public GitHub issue links. A task can be `documented` only with a public PR proof; *documented is not independent scientific approval*.
- `sourceKind=versioned_public_editorial_snapshot`, `reviewedAt=2026-11-05`, exact build revision, `issueSync=not_live` and `validatedHumanImpact=false` are included in the generated model.
- No percentages derived from the number of open issues; no fake owner names, recruitment counts, beneficiaries, study results, future deadlines or hidden data.
- Only hard-coded public Markdown/CSV document paths and exact HPI GitHub Issues/PR URL shapes are permitted in the projection. Unknown keys, duplicate IDs, unlinked/renumbered epic tasks, invalid statuses and count mismatches are rejected at build. New public pages render all source text as escaped HTML.
- `publicIssueSignal` is a **pure, not networked** compatibility contract for future optional live overlays: missing provider → `unavailable`, old provider → `stale`, invalid status/missing issue → `unknown`. Closed issues never imply scientific or human impact approval.

### Status vocabulary

- `planned` — defined but not implemented.
- `in_progress` — an actual stream is underway.
- `review` — published proposal awaiting review/ratification or external sign-off.
- `documented` — public deliverable/accepted documentation exists; not a validated intervention.
- `complete` — technical acceptance verified and stated in the canonical issue. **Not used to infer independent research approval.**
- `blocked`, `unknown` — clear problem/no trustworthy source.
- `aspirational`, `long_term` — research horizons, not funded promises.

## Decision and implementation sequence

1. WEB-02.1: **delivered** public model, test fixtures, provenance and source matrix ([PR #37](https://github.com/saver1991/human-prosperity-initiative/pull/37)).
2. WEB-02.2: **delivered** accessible [/roadmap](/roadmap) dashboard with Now/Next/Later, thematic separation, first-party documentation and honest snapshot banner ([PR #38](https://github.com/saver1991/human-prosperity-initiative/pull/38)).
3. WEB-02.3: **delivered** 11 stable [/initiatives/web-02](/initiatives/web-02) and sibling initiative detail pages with nested epic/task lists and first-party sources ([PR #39](https://github.com/saver1991/human-prosperity-initiative/pull/39)).
4. WEB-02.4 (**not authorised in current iteration**): reconcile live issue event/status feed with source SHA and staleness, improving evidence-based progress reporting.
5. WEB-02.5 (**deferred**): permission-gated SolOS read-only projection and actual HubOS registration after duplicate-check.
6. WEB-02.6 (**deferred**): comprehensive release QA/maintenance work; existing CircleCI, Playwright and Vercel gates still apply during each stage.

## Security and science boundaries

Project metadata is not study data. No model permission, funding, outreach, participant recruitment, private case record, cross-service database read/write or unapproved API billing is introduced. HPI remains a **working name** and **not incorporated**. F0-03.1 is an **internal preliminary review**, not independent scientific endorsement. Web delivery, issue closure and document publication are not causal measurements of improved human prosperity.

**Acceptance:** `npm run check` and exact-SHA CircleCI website-quality/Chromium checks; source snapshot validation; no passwords or personal identifiers in the projection; explicit user-facing caveats. Future changes to source schema require a reviewed PR with tests. [WEB-02.1 #30](https://github.com/saver1991/human-prosperity-initiative/issues/30).
