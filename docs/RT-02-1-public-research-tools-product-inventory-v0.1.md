# RT-02.1 — HPI usable research tools: Phase 1 source and product inventory V0.1

**Date:** 11 November 2026. **Scope:** read-only public pages and versioned JS/CLI contracts. **Technical inventory: COMPLETED.** This is **not** a human task study, data-rights legal clearance, scientific acceptance of an estimator, API uptime SLO, independent accessibility assessment or evidence of benefit to real people.

**Canonical work:** [RT-02 #86](https://github.com/svtmzt/human-prosperity-initiative/issues/86), [RT-02.1 #88](https://github.com/svtmzt/human-prosperity-initiative/issues/88), linked [WEB-03 #85](https://github.com/svtmzt/human-prosperity-initiative/issues/85), [HubOS portfolio #150](https://github.com/svtmzt/the-hub-os/issues/150). The earlier [RT-01 tools implementation](RT-01-research-tools-and-open-infrastructure.md) completed 16/16 *scoped technical tasks*, not usability research or scientific validation.

## 1. Existing tool products: the actual UI and behaviour

The following **four public first-party tool/help experiences are HTTP 200** in the 11 Nov production-route check; they are accessed as individual /research/* destinations. **No top-level Tools hub or primary-nav entry exists.**

| Tool and route | Intended user job | Live interface / user inputs | Outputs and supporting code | Reality / scientific and legal boundary |
| --- | --- | --- | --- | --- |
| **Source Catalogue** — [open](https://human-prosperity-initiative.vercel.app/research/source-catalog) | Discover public research references, their rights and provenance | Search input over study/source/geography/DOI; source type drop-down. Observed 39 evidence references + 3 **dataset candidates** = 42 **metadata records**, not 42 validated downloadable data files | Browser filters `site/research-catalog.js`; `research-tools/source-catalog.mjs`; first-party `/research-source-catalog.json` and `/research-source-catalog.csv`; external publisher links and method document | Most licence/retraction statuses remain `unknown / not_reviewed / not_checked`. No third-party full datasets imported; source URLs ≠ redistribution rights |
| **Synthetic Outcome Lab** — [open](https://human-prosperity-initiative.vercel.app/research/outcome-lab) | Test draft benefit-receipt estimators and sensitivity to missing follow-up | Two synthetic groups (reference/comparison); **6 numerical inputs:** eligible, observed receipts, missing follow-up per group; `Calculate synthetic comparison`, `Run seeded hypothetical simulation` | Browser `site/outcome-lab.js`, `research-tools/outcome-evaluation.mjs`; derived hypothetical fractions/percentage-point comparison, Wilson / Newcombe-Wilson conditional uncertainty, missingness bounds, seeded simulations; `/research-synthetic-outcome-template.json` sample | **SYNTHETIC ONLY**. Form states browser-only calculations, not transmitted/retained; verified only from code/markup, NOT network/browser instrumentation. Draft indicator HPI-B-01 `proposed_not_validated`. Synthetic contrast **not causal HPI impact** |
| **Reproducibility Pipeline** — [open](https://human-prosperity-initiative.vercel.app/research/reproducibility) | Audit how a report was generated and reproduce calculations | Static technical report with source hashes and artifact links; **no editable in-page controls** in observed HTML | `research-tools/research-pipeline.mjs` and reproducibility scripts; output report, SHA-256 manifest, source citation/rights manifest, data dictionary, correction/revision log, optional Jupyter notebook. Pipeline public example describes 39 references, **34 abstract-level records**, 3 dataset candidates and fictional 5pp effect | Byte/revision repeatability is not independently reviewed research quality; unreviewed redistribution rights and source data remain gated; `5pp` is theoretical not an observed improvement |
| **Responsible Research Tools** — [open](https://human-prosperity-initiative.vercel.app/research/responsible-tools) | Understand privacy/ethics/rights constraints and find suitable public-safe tools | Static English guidance, dedicated [Italian route](https://human-prosperity-initiative.vercel.app/research/responsible-tools/it), offline English text and links to governance status | `research-tools/research-governance.mjs`, `/research-governance-status.json`, research policy files, eight independent review gates | **NOT** a signed ethics opinion, controller/privacy notice, support hotline or accessibility certification. Gate statuses pending. No participant data authorised |

**Related case-study experience, not classified as a reusable calculator:** [Newham prepilot](https://human-prosperity-initiative.vercel.app/research/newham-prepilot) and [desk validation](https://human-prosperity-initiative.vercel.app/research/newham-pension-credit). These demonstrate source-sensitive interpretation, not a real personalised Pension Credit eligibility checker or a production benefits-advice service. It is unsafe to position them as such.

## 2. Source-level developer tooling, distinct from interactive public pages

| Capability | Source and interface | Purpose / constraints |
| --- | --- | --- |
| Typed indicator contract | `research-tools/indicator-contract.mjs` and `research/F0-03-indicator-catalog-v0.1.csv` | Parse 15 **candidate** indicators, not a scientifically approved instrument |
| Aggregate evaluation primitives | `research-tools/outcome-evaluation.mjs` and `research-tools/aggregate-outcomes.mjs` | Prescribed public/synthetic counts, uncertainty, attrition, defensible null/adverse outcomes; not person-level evaluation |
| Source rights and metadata | `research-tools/source-catalog.mjs`, `research-tools/evidence-provenance.mjs` | Validate source IDs, provenance, licences/unknowns and avoid inventing full-text use rights |
| Open-science pipeline | `research-tools/research-pipeline.mjs`, `research-tools/structured-evidence.mjs` | Deterministic manifests, source checks, abstract-level evidence and correction log; not web-scale crawler |
| Newham desk method | `research-tools/newham-desk-validation.mjs`, `research-tools/newham-prepilot-gate.mjs`, `scripts/verify_newham_dwp_ods.py` | DWP source byte/hash and row provenance; study participant HPI-B-01 outcome numerator/denominator **remain NULL** |
| Research governance | `research-tools/research-governance.mjs`, `scripts/rt01-governance-check.mjs` | Safety guards and explicit pending independent privacy, ethics, accessibility and data rights |
| Reproducible CI and samples | `npm run check`, `npm run research:verify`, `npm run research:pipeline:verify`, `npm run research:governance:verify`, `npm run newham:verify`, `npm run newham:prepilot:verify`; `research/notebooks/rt01-public-source-workflow.ipynb` | Development verification. CircleCI + Vercel; no GitHub Actions replacement. No automatically approved beneficiary study |

**Hosting and resource model:** static browser JS (Outcome Lab and Catalogue), published JSON/CSV/Markdown/Notebook artifacts, CI-generated static site and limited read-only issue/revision APIs for the HPI site. `vercel.json` CSP limits `connect-src` to self and `script-src` to self; the Source Catalogue script explicitly avoids analytics/cookies/API calls. A genuine cookies/storage audit must still inspect actual deployment responses, provider configuration and runtime browser storage before any claim of compliance. User personal records are **not** a valid input to any current tool.

## 3. Product gaps and priorities (from public markup and code, not a usability experiment)

| ID | Priority | Observed issue / product opportunity | Safe acceptance contract |
| --- | --- | --- | --- |
| TOOL-01 | **P0** | No discoverable Tools entry or tools homepage in global nav; four instruments buried under Research | A first-party `/tools` hub with accessible cards that explain who each is for, what data are allowed, output and review status; ≤3 navigation steps from home in designed journey |
| TOOL-02 | **P0** | Research and Library list many raw source filenames and versions near tools | Clear link between concept, tool, source, reproducible method and current case study; keep technical docs as expandable detail |
| TOOL-03 | **P0** | Synthetic Outcome Lab is functional but easily misinterpreted by novices | Keep **Synthetic only** visible before and after a calculation/export; never accept/upload personal records or label output as real HPI welfare impact |
| TOOL-04 | **P0** | Catalog has 42 metadata rows, but 3 are unimported dataset candidates, unknown rights and source review | Separate `Evidence references`, `Dataset candidates`, `Reviewed/reusable source` and explicit rights checks. Never suggest 42 verified datasets |
| TOOL-05 | **P1** | Source Catalogue supports only keyword and broad type filtering | Optional provenance, geography, date, rights, status and study type filters, with accessible no-results/correction affordance, grounded in actual metadata only |
| TOOL-06 | **P1** | Lab has numeric inputs and textual conditional uncertainty but no user-friendly guided interpretation | Visual comparison and accessible table/text alternatives, explicit assumptions, adverse/null results, human readable errors, non-suggestive labels |
| TOOL-07 | **P1** | Reproducibility shows hashes, manifests and notebook but no task-oriented tutorial | Plain-language overview, version-pinned copyable commands and sample artifact-to-source lineage; no claims that a notebook is an independently validated study |
| TOOL-08 | **P1** | English/Italian responsibility guidance exists but no coherent language controls and glossary across instruments | Tool-level glossary, version/freshness metadata, reviewed translations with fallback |
| TOOL-09 | **P1** | No source-backed explanation of why people should trust a specific result close to tool UI | `Data status`, `Source`, `Method`, `Reviewed?`, `Uncertainty`, `Limitations` standardized info panel per tool |
| TOOL-10 | **P1** | No confirmed actual screen-reader or low-bandwidth user-run acceptance evidence | Human VoiceOver/TalkBack/NVDA, keyboard/zoom and focus/description checks. Automated tests cannot satisfy WEB-01 external review |
| TOOL-11 | **P2** | No evidenced, licenced programme datasets for an international Prosperity Data Explorer | Conduct data-rights, audience value and public-source feasibility discovery **before** scheduling feature build |
| TOOL-12 | **P2** | No safe verified contact/Help route to explain use or report errors without using public GitHub | Link to forthcoming WEB-03.6 Help/Corrections, cautioning GitHub is public and not a confidential reporting channel |

## 4. Product boundaries and acceptance for next epics

| Epic | Suggested priority | Product delivery, after Phase 1 |
| --- | --- | --- |
| **RT-02.1** | **P0 complete** | This 4-UI + 1 case-study and developer tooling inventory, real HTML/JS I/O, source/data-state matrix, gap register and first-party publication with CI |
| RT-02.2 | P0 | UX-integrated `/tools` hub with `Research` → `Tools` clear link, no duplicated source store, responsive and keyboard-tested |
| RT-02.3 | P1 | Source Catalogue improvements, rights status and metadata-only provenance; refuse unlicensed dataset claims |
| RT-02.4 | P1 | Synthetic Outcome Lab usable plots, text alternatives, error/empty states, and guarded JSON/CSV export only if scientifically safe |
| RT-02.5 | P1 | Reproducibility tutorials, accurate source-to-output lineage, versioned downloadable artifacts and correction workflow |
| RT-02.6 | P1/P2 discovery | Potential Poverty/Prosperity Data Explorer public-source feasibility; **no paid APIs or person-level access preauthorised** |
| RT-02.7 | P0 continuous | CI, cross-browser, accessibility *and real human tester* acceptance, no participant claims or private data path |

### Example future Tools hub card data model

`title`; `oneSentenceUse`; `audience`; `dataClassification`; `currentValidation`; `whatItCanAndCannotDo`; `launchRoute`; `inputExample`; `outputExample`; `methodAndRights`; `freshness`; `accessibilityHelp`.

This is a design specification, **not** the actual new Tools homepage or implemented runtime features.

## 5. Data integrity and scientific non-negotiables

The [DWP Newham 2023/24 local model](../research/NEW-02-newham-source-reconciliation-additionality-v0.2.md) verified 11,300 modelled eligible households, 8,800 modelled recipients, 2,500 potentially eligible nonrecipients and **78% administrative modelled household receipt**; **86%** is a separate *expenditure* proportion; **62%** is a different official GB FYE2025 survey-based benefit-unit rate. None gives actual verified HPI participant eligibility, first paid award or causal impact. HPI-B-01 remains `proposed_not_validated` and actual cohort denominator/numerator NULL.

Never present a synthetic sample as a real HPI recipient, infer an individual benefit entitlement, claim a charity/partner identity, import sensitive records to GitHub or ChatGPT, or say source link = permission to redistribute source data. All future real study uses remain **NO-GO FIELD** pending independent scientific, community, safeguarding, privacy and sponsor approvals.

**Execution source:** [HPI RT-02 #86](https://github.com/svtmzt/human-prosperity-initiative/issues/86). **Portfolio projection:** [HubOS #150](https://github.com/svtmzt/the-hub-os/issues/150), no duplicate actual HPI entity or auto-sync assertion.
