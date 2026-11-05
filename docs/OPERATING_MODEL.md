# HPI operating model — participation, governance and execution

**Status:** draft V0.3, 5 November 2026. **Working name:** Human Prosperity Initiative. No foundation has been incorporated.

## Standard hierarchy

**Programme (HPI) → Strategic horizon (A / B) → Initiative (F0-01 … F3) → Epic / workstream (e.g. F0-02.1) → GitHub issue / task.**

Milestones, scientific decisions, risk logs, ethics approvals and research outcomes are recorded separately, not mistaken for completed issues.

The machine-readable version is [`portfolio/project.json`](../portfolio/project.json). It contains only public metadata and links. Do not add participant data, credentials or unreviewed private organisational details.

## Who owns what?

| System | Authority |
|---|---|
| **HPI GitHub** | Public science: charter, roadmap, evidence, protocols, issues, contributions, version history |
| **HubOS** | Portfolio governance and product/initiative tracking, registered HPI programme and task status (production Neon snapshot verified 5 Nov 2026; authenticated UI acceptance remains open) |
| **SolOS** | Research-oriented workflows and approved execution, not governance or automatic publication |
| **Neon HPI** | HPI-only research metadata, with independent access policy; not a shared HubOS/SolOS database |
| **Vercel HPI** | Public website publishing; not evidence of intervention success |
| **CircleCI HPI** | Tested code/website builds; not a peer review of scientific claims |

SolOS includes a read-only HPI project profile; its roadmap statuses are an explicitly dated snapshot and link back to this repository. A separately permission-free, **read-only pinned evidence inventory** in SolOS verifies a published GitHub blob and exposes counts/provenance only. It is **not live status synchronisation, scientific peer review or authorised autonomous research execution.**

## Progress discipline

1. Each initiative has a hypothesis/problem, outcomes, risks, decision gate, source of evidence and next issue(s).
2. Mark tasks complete only after verifying artifacts and acceptance conditions.
3. Treat published designs or proposed experiments as plans, not field validation.
4. Publish research limitations and adverse/null findings.
5. Use Now / Next / Later for planning; the 1–3 year and 5–20+ year horizons are aspirations.
6. Escalate participant recruitment, sensitive data, ethics, funding commitments and outreach to separately authorised reviews.

## Suggested current focus

**F0-02** remains the research priority, with F0-01 charter review and F0-03 measurement as enabling work. SolOS should not reuse business-market validation scores to claim scientific efficacy for poverty interventions.

## Cross-system implementation tracking

- [HubOS #125 — register HPI as a distinct public-interest programme](https://github.com/saver1991/the-hub-os/issues/125). **Production database registered:** one public-interest programme, eight initiatives, five epics, eleven tasks, with an additive CAS update, backup and full old-record preservation. Authenticated browser/UI acceptance remains open.
- [SolOS PR #74 — public HPI project catalogue](https://github.com/saver1991/solOS-core/pull/74). **Merged:** dated read-only profile.
- [SolOS PR #78 — pinned evidence inventory](https://github.com/saver1991/solOS-core/pull/78). **Merged:** read-only GitHub source count/provenance API, no external actions.
- [SolOS #75 — optional approved research integration](https://github.com/saver1991/solOS-core/issues/75). **Open:** scientific methodology review, browser acceptance and future autonomy approval remain required.

SolOS's production console currently uses Vercel SSO protection. The independently hosted HPI website and GitHub repository remain public.

Public roadmap: [Roadmap V0.3](roadmap.md).
