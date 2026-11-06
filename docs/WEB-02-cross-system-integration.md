# WEB-02.5 — Cross-system public roadmap integration

**Verified 6 November 2026 · public governance summary.** This is a technical delivery and source-of-truth contract, not an incorporated institution, independent research approval or human prosperity impact.

## Authoritative responsibilities

| Service | Actual role | Permitted data | Explicit exclusions |
| --- | --- | --- | --- |
| **HPI GitHub and HPI website** | Authoritative initiative/epic/task definitions, issue acceptance, documents and scientific review gates | Public `portfolio/project.json`, `portfolio/public-roadmap.json`, approved Markdown/CSV files, public issue metadata | No private participant/case/eligibility records, no automatic assertion that closing a ticket validates science |
| **SolOS** | Read-only public roadmap summary within its existing HPI project profile | Strict allowlist of public source SHA, editorial reviewed date, WEB-02 six epic IDs/titles/statuses and aggregate 31 task counts | No agent grants, database reads or writes across products, untrusted issue-body ingestion, real study execution or autonomous outreach |
| **HubOS** | Governance/portfolio tracking under the existing HPI public-interest programme | One distinct WEB-02 programme-workstream record, its six epic and 31 bounded task mirrors, canonical GitHub links and known technical acceptance | Not the scientific/evidence authority; not a second HPI company, commercial fundraising or duplicate ownership |
| **CircleCI and Vercel** | Technical build/test and website delivery evidence | Build and browser checks, public release revision | Not an institutional science review or an actual beneficiary-outcome evaluator |

## SolOS validation and visibility

[SolOS PR #90](https://github.com/saver1991/solOS-core/pull/90) merged after [CircleCI #159](https://circleci.com/gh/saver1991/solOS-core/159) and Vercel Preview. The protected SolOS deployment is marked production READY; users may need an authorised Vercel session to see its UI. The existing SolOS HPI profile reads **only** `https://human-prosperity-initiative.vercel.app/public-roadmap.json` over HTTPS with no secrets. It verifies the schema, exact Git source revision, 7-day editorial date, non-incorporation and zero validated human impact, six unique WEB-02 epics, 31 bounded tasks and PR evidence behind accepted technical items. Refresh is requested approximately every five minutes; stale, missing or invalid data display no counts. SolOS is **not** an editable replica of GitHub Issues, and has no write-back endpoint from this feature.

## HubOS deduplication and verification

Before registering WEB-02, the **production** HubOS Neon store already contained a single `human-prosperity-initiative` company with public-interest classification and existing F0 research workstreams. No `hpi-web-02` project or matching epic/task rows existed. A guarded additive registration then introduced:
- **1** distinct `hpi-web-02` project under the **existing** HPI company.
- **6** workstream epics reflecting WEB-02.1–WEB-02.6 and canonical HPI GitHub issues #30–#35.
- **31** task mirrors using the public HPI work breakdown, deterministic unique IDs and P1 scope. At registration, 21 technical tasks from WEB-02.1–WEB-02.4 were marked accepted, with PR #37/#38/#39/#41 as public evidence; remaining tasks were not marked complete.
- A prior-state rollback backup under `hpi-web-02-20261105-v1` and optimistic store revision guard.

**Actual post-write query:** one HPI programme, one WEB-02 project, six WEB-02 epics and 31 WEB-02 tasks. The version then advanced to 123; future unrelated updates may increase it. [HubOS governance ticket #129](https://github.com/saver1991/the-hub-os/issues/129) was closed only after verification. No shared connection string, direct participant record, external provider payment or new HPI legal entity was created.

## Status integrity and known limitations

- The HPI public website is a **dated editorial snapshot** backed by public repo commits; [WEB-02.4 progress policy](WEB-02-progress-integrity.md) displays current GitHub issue metadata separately, with 15-minute freshness and conservative unavailable/contradiction handling.
- The SolOS side is a cached read-only projection, **not** a continuously synchronised or bidirectional issue editing system. HubOS maintains an independent governance mirror and requires explicit reconciliation for future issue-state changes.
- A successful technical PR/CI merge does **not** confer independent ethics approval, measurable poverty reduction or a valid research instrument.
- SolOS Vercel Deployment Protection may prevent anonymous public access to its dashboard; this policy is deliberately not disabled to simplify QA.
- No new paid plan, shared database, key, webhook, automation, GitHub Actions workflow or agent task execution was introduced.

**Acceptance tracking:** [WEB-02.5 #34](https://github.com/saver1991/human-prosperity-initiative/issues/34), [SolOS #87](https://github.com/saver1991/solOS-core/issues/87) and [HubOS #129](https://github.com/saver1991/the-hub-os/issues/129). Full cross-system endpoint and accessibility regression belongs to WEB-02.6.
