# RT-01 — Open Research Tools & Infrastructure

**Status:** P1 · NEXT · IN PROGRESS — RT-01.1, RT-01.2 and RT-01.3 technically delivered; no participant-linked tools, independent science approval, deployed autonomous engine or real outcomes implied. **Date:** 6 November 2026.
**Source:** [RT-01 parent issue #55](https://github.com/saver1991/human-prosperity-initiative/issues/55). HPI is an international public-interest research initiative, not currently a legal nonprofit, foundation or company.

## Why research also needs tools

Evidence synthesis and economic modelling become more useful when a wider research community can **repeat searches, inspect source provenance, reproduce calculations, challenge assumptions and reuse software**. HPI therefore needs **research-enabling instruments**, not just publications and a public website.

The following are proposed products/platform capabilities, NOT validated scientific instruments or proof of impact:

| Epic | Reusable capability to plan | Primary quality gate |
|---|---|---|
| **RT-01.1** [#56](https://github.com/saver1991/human-prosperity-initiative/issues/56) | Source catalogue, public aggregate datasets, research evidence metadata, versioned links and provenance | Source legitimacy, licence rights, source duplication/retraction and data minimisation |
| **RT-01.2** [#57](https://github.com/saver1991/human-prosperity-initiative/issues/57) | Outcome definitions, reproducible evaluation estimators, transparent simulations and uncertainty/harms reporting | F0-03 scientific review; separate observations, model projections and causal effects |
| **RT-01.3** [#58](https://github.com/saver1991/human-prosperity-initiative/issues/58) | Reproducible scripts/notebooks, deterministic CI fixtures, artifact versioning and accessible open publishing | Test reproducibility, protect human participant data, never duplicate SolOS's private systems |
| **RT-01.4** [#59](https://github.com/saver1991/human-prosperity-initiative/issues/59) | Data safeguards, open-source/licence/attribution checks, accessibility and independent reporting | External ethical/legal approval before real participant data or fieldwork |

**Task status:** three technical epics delivered (12 of 16 scoped tasks, PRs #63/#64/#65); RT-01.4 remains open. This does not mean 12 scientific results or validated external studies.

## V0.1 offline implementation (6 November 2026)

The [RT-01 reproducible validation tools V0.1](RT-01-reproducible-validation-tools-v0.1.md) describe **implemented source-level tooling** proposed through [PR #62](https://github.com/saver1991/human-prosperity-initiative/pull/62):

- Metadata-only SHA-256 and schema/provenance checks for the existing public source ledger (`research-tools/evidence-provenance.mjs`).
- Aggregate descriptive-rate and missing-follow-up comparison with explicit noncausal result labels (`research-tools/aggregate-outcomes.mjs`).
- A local, offline `npm run research:verify` reproducibility command using **synthetic fixtures** and the public Git source ledger.
- Unit tests for malformed source, unsafe primary URLs, duplicate IDs, bad counts, forbidden person-level fields, negative results and missing observations.

**Software implementation does not validate an intervention or scientific method.** Broader RT-01 tasks — licences and source rights, complete data catalogues/adapters, independently justified uncertainty models, accessible hosted research tools, and actual methodological review — remain open. No personal data, external partner, funding, research protocol approval or causal effect has been introduced.

## Three technically delivered research-tools epics (6 November 2026)

- **RT-01.1** — source catalogue, source rights metadata, provenance, bounded synthetic/public aggregate ingestion contract, searchable first-party [source catalogue](https://human-prosperity-initiative.vercel.app/research/source-catalog), [method and review gates](RT-01-1-source-catalog-method-v1.md); accepted source PR [#63](https://github.com/saver1991/human-prosperity-initiative/pull/63).
- **RT-01.2** — F0-03-aligned *draft* indicators, baseline and follow-up, attrition sensitivity, harms/cost/equity summaries, conditional binomial uncertainty, deterministic hypothetical simulation, interactive [synthetic outcome lab](https://human-prosperity-initiative.vercel.app/research/outcome-lab), [method and review gates](RT-01-2-outcome-evaluation-method-v1.md); accepted source PR [#64](https://github.com/saver1991/human-prosperity-initiative/pull/64).

- **RT-01.3** — byte-reproducible open-science CLI/CI workflows, content-addressed JSON reporting, safe source citations and data dictionary, reviewed correction log, optional notebook and [first-party public reproducibility portal](https://human-prosperity-initiative.vercel.app/research/reproducibility); [method and limits](RT-01-3-reproducible-open-science-v1.md) and accepted [PR #65](https://github.com/saver1991/human-prosperity-initiative/pull/65).

These are technically implemented **research-enabling instruments**, not validated statistical estimators for real interventions, source redistribution permission, a completed peer review, real observed outcomes or approved causal conclusions. The RT-01 parent is **IN PROGRESS**, with **RT-01.4 still open** for fuller privacy, licence compliance, accessibility and governance, and independent research review outstanding.

## Existing reusable foundations — already built, not counted again
- Versioned [F0-02 search protocol](../research/research-protocol.md), [evidence ledger](../research/evidence-ledger.csv) and source-linked critical synthesis, with explicit limitations of abstract-level extraction.
- [F0-03 measurement framework V0.1](../research/F0-03-prosperity-measurement-framework-v0.1.md) and proposed indicators. The independent review [F0-03.1 #19](https://github.com/saver1991/human-prosperity-initiative/issues/19) is still required; no universal validated score.
- First-party HPI roadmap and public documentation, PR/CI provenance, and versioned SolOS **read-only** project projection. These are **publication/tracking foundations**, not proof of a delivered data ingestion, statistics or research-execution platform.
- CircleCI and Vercel are existing technical delivery infrastructure. No GitHub Actions or new paid external APIs are part of this proposal.

## Proposed architecture & boundaries

1. **Public open repository** holds permissibly redistributable metadata, methods, synthetic tests and source code, published via HPI first-party pages.
2. **Data adapters** must enforce licence, timestamp, source reliability, versioning, aggregate-only public use and missing-data abstention; do not harvest private case files or copyrighted full texts.
3. **Evaluation utilities** have explicit synthetic, descriptive, associational and causal modes, and no automatic adjudication of social entitlements or external outreach.
4. **Independent scientific and community review** remains a hard gate before describing an estimator, model or metric as validated.
5. **SolOS** may expose a strictly permission-gated, versioned read-only HPI projection (per existing design); it is not an autonomous authority to spend, recruit or approve methods. **HubOS** remains portfolio governance.

## Sequence
- **P0 NOW:** F0-04 responsible organisational, legal and financial foundations (must not be confused with a mandatory condition to write open-source prototype code).
- **P1 NEXT, currently delivering:** RT-01.1/.2/.3 tool implementations are source-reviewed; RT-01.4 privacy and external scientific/ethical review gates are next.
- **P1 later implementation:** build small audited public-source prototypes after scoped approval; synthetic data only until permissions.
- **After independent approvals:** optional partner-led studies and lawful sensitive-data integrations, governed separately under F0-02/F0-03/F0-05.

## Link to business model
Possible paid hosted tools or institutional services are an **unapproved commercial hypothesis**, registered separately in [F0-04.8 business-model alternatives](governance/F0-04-business-model-options-2026-11-06.md). Open research infrastructure can be built whether HPI eventually chooses charity, Ltd, CIC or hybrid; funding/ownership/IP rules must be settled before commercialisation.
