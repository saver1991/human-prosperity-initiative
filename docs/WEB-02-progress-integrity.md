# WEB-02.4 — Public progress integrity and issue-source policy

**Engineering implementation, 5 November 2026.** HPI remains a non-incorporated open research initiative. This document governs the **public status UI**, not independent ethics approval, research protocol sign-off or the measurement of poverty.

## Three strictly separate meanings

1. **Engineering/document delivery:** a specific accepted task can be counted only when its versioned task state is `complete` or `documented` and it includes a public HPI pull-request URL as acceptance evidence. The denominator is exactly the separately defined task list in `portfolio/public-roadmap.json`; no arithmetic based on unrelated issues or unsourced percentages.
2. **Research or governance validation:** independent methodology/community review, a duly recorded charter ratification, legal registration and ethics oversight require their own human and jurisdiction-specific decision records. A closed GitHub issue, successful CI workflow, published draft or this website **never** substitutes for them.
3. **Measured human prosperity outcome:** none independently established. The static public API explicitly states `validatedHumanImpact: false`; the interface shows `Not verified`. Count of completed engineering tasks or page visitors is not a beneficiary count.

## Canonical sources and operational reconciliation

- The versioned HPI descriptor defines initiative IDs/priority/horizon and which epics are considered accepted. The public enriched snapshot declares its reviewed date and lists PR-backed task acceptance.
- Public HPI GitHub Issues are authoritative for **issue open/closed state**. The existing token-free, same-origin `GET /api/issues` endpoint returns a safe public subset: number, title, open/closed state and updated timestamp; up to the 100 most recently updated records. It does **not** return issue bodies or private data.
- A tiny browser-only, read-only module `site/progress.js` requests that endpoint when visitors open `/roadmap` or an `/initiatives/{id}` page. Only textContent is used, never untrusted HTML, automatic edits, scripts from GitHub or database writes.
- `site/progress-policy.js` is the pure public source policy, used both in browser and Node tests. Require recognised source, well-formed unique records and times, a full/partial-feed flag, no contradictory duplicate IDs and freshness **no older than 15 minutes**. The endpoint uses a cache up to approximately 5 minutes with a short stale-while-revalidate window.
- On source outage or invalid data the interface reports **unavailable**; on source age beyond 15 minutes it reports **stale**; when the endpoint is limited to 100 items and an issue is absent, it reports **not in recent feed**. It never presents missing information as success. A full-feed absent issue is explicitly **not found**, not `closed`.
- If a GitHub issue is closed while the editorial snapshot says `planned`, `review`, `in_progress` or `blocked`, the UI flags **source disagreement / review needed** without silently overwriting either source. A closed issue never sets `independentlyApproved` or `humanImpactVerified` to true.
- Source publication provenance comes from the build's exact Git revision (`/publication.json`) and the snapshot's `reviewedAt`. Latest feed fetch time is shown in UTC; do not call the editorial snapshot live synchronisation.
- Invalid source shapes, missing evidence, duplicate task IDs, non-first-party document links and conflicting acceptance sets fail the build; front-end errors fall back to static non-sensitive content.

## Deferred external/ethical gates

- Do **not** ingest participant microdata, welfare case records or any private HPI/SolOS/HubOS table.
- Independent expert scientific review, community participation and actual welfare or distributional outcomes are separate F0 initiatives with unfilled real-world gates.
- This architecture does not provide automated PR-to-task closure, donor analytics, external monitoring, an appointed safeguarding function or Vercel Deployment Checks. Those are separate explicitly tracked issues.

## Operator test matrix

1. GitHub source available, fresh open issue, fresh closed issue.
2. Closed issue conflicting with a candidate science or planned technical epic.
3. Public endpoint failing (503), invalid record, duplicate number, unsupported state.
4. Old cache, missing issue in a partial 100-record feed and missing issue in a complete feed.
5. Accepted technical task without public PR evidence excluded from numerator.
6. Unsafe issue text rendered literally with DOM text APIs rather than HTML.
7. Real Chromium keyboard/assistive names, axe WCAG 2.2 AA and screenshots of first-party pages on mobile and desktop.

**Acceptance:** [WEB-02.4 #33](https://github.com/saver1991/human-prosperity-initiative/issues/33). Final implementation status must be recorded only after real CI, preview and merge checks pass.
