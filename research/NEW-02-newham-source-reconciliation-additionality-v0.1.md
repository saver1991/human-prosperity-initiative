# NEW-02 — Newham Pension Credit source reconciliation & additionality desk audit V0.1

**Date:** 7 November 2026. **Status:** SOURCE/METHOD AUDIT COMPLETE; EXACT NEWHAM DWP ODS ROW **NOT VERIFIED**; full NEW-02 **OPEN / BLOCKED ON SOURCE INGEST**. Scope is public-source desk research only. HPI is not a registered research sponsor or Newham partner and has no legal authority to identify or contact claimants.

## Decision-ready result

**GO:** retain Newham as an *exploratory, publicly sourced measurement case*, define auditable data requirements, and investigate whether independent evaluation could improve on existing council services.

**NO-GO:** estimate a Newham entitlement gap or receipt rate by multiplying the national 62% by Newham pensioner population, assume borough deprivation is Pension Credit eligibility, claim council income figures as causal HPI gains, contact pensioners, recruit, or use personal benefit records. No experimental pilot authorised.

The publicly listed official local-authority dataset was located, but its **ODS binary could not be retrieved and independently inspected in the connected execution environment during this run**. We record the exact verified publishing page and the ODS asset URL, but **not** a fictional row, worksheet, count, percentage, file hash or download result. The missing extraction is an explicit blocker; **NEW-02 must not be closed as data-complete**.

## 1. Three distinct denominators and the sources

| Provenance | Date / scale / unit | What is verified | What it cannot establish |
| --- | --- | --- | --- |
| [DWP official Pension Credit take-up FYE2025](https://www.gov.uk/government/statistics/income-related-benefits-estimates-of-take-up-financial-year-ending-2025/income-related-benefits-estimates-of-take-up-financial-year-ending-2025) | FYE2025, Great Britain, estimated **pensioner benefit units / families** | **62%** caseload take-up, central estimate; published 22 Oct 2026, statistical report updated 28 Oct | **Not Newham**; cannot create a local entitled/non-recipient count or local causal counterfactual |
| [DWP 2023/24 potential Pension Credit local data](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024) and [methodology](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024/analysis-of-households-potentially-eligible-for-pension-credit-and-eligible-households-in-receipt-of-pension-credit-2023-to-2024) | 2023/24, local authority, **households**; modelled administrative potential receipt | Ad hoc release dated **30 Oct 2025** includes local authority tables, not the national official take-up design | Newham-specific cells **not extracted**; not a verified claimant-level eligibility or award list, not comparable with national 62% |
| [Newham Ageing Well council report 2024/25](https://www.newham.gov.uk/downloads/file/9654/2024-25-you-said-together-we-did-5-) | 2024/25, council support programme, supported **residents** | Council reports **220 helped to claim** and **£748,590 attributed additional income** | No proven unique eligible denominator, verified award numerator, net benefit or control group. Not independently audited HPI impact |
| [Newham Council Dec 2024 story](https://www.newham.gov.uk/news/article/1379/newham-council-helps-155-pensioners-claim-a-total-of-over-600000-in-unclaimed-pension-credit) | December 2024, council self-report, supported residents | **155 supported** and **over £600,000** reported | Possible overlap with annual report; **never sum** across stories without cohort reconciliation |
| [MHCLG IoD 2025](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025/english-indices-of-deprivation-2025-statistical-release) | Newham, area income-deprivation population, separate age definitions | **46.7%** aged 60+ income deprivation (IDAOPI) and **39.0%** all ages | Neither is Pension Credit entitlement, non-take-up nor a measured effect on study participants |

### Critical methodology from DWP

The **2023/24 ad hoc local administrative model** estimates Pension Credit receipt and *potential* eligibility **across the financial year** at *household* level, using Winter Fuel Payment, DWP and HMRC administrative sources. It lacks individual savings and certain housing-cost information. Missing savings tends to **overstate potential eligibility and understate local receipt-rate** in some higher-wealth areas; missing housing costs can act in the opposite direction. Its administrative measure is explicitly **not comparable** to the official FYE2025 survey/simulation-based **national** benefit-unit take-up estimate.

The national report measures average receipt / modelled entitlement at benefit-unit scale. Do not trend a 2023/24 local receipt estimate against the national 2024/25 62% or pool the two. The 2023/24 DWP methodology expressly discourages that comparison.

## 2. Required exact Newham-row extraction and traceability

The source page links the **133 KB ODS** titled *Data Tables: Analysis of households potentially eligible for Pension Credit, and eligible households in receipt of Pension Credit, 2023 to 2024*; the asset URL observed at the publisher is:

`https://assets.publishing.service.gov.uk/media/6900969fa6048928d3fc2ae5/households-potentially-eligible-for-pension-credit-2023-to-2024.ods`

**At this run:** dataset metadata/publication verified; **raw ODS data not opened**, so no table/sheet/cell, hash or extracted rate is asserted. This is not a finding of zero potentially eligible households. The specific release may be superseded later; re-check the original publisher before reuse.

Complete the following deterministic extraction ledger *after obtaining the official source binary*:

1. Download from the publisher, record access timestamp, file length, SHA-256, exact source URL, licensing notice and any third-party exceptions; do not re-host the entire corpus.
2. Enumerate ODS sheet names and header rows; identify all relevant LA measures and exact column meanings, denominator definitions, suppression/rounding and whether estimates reflect annual receipt.
3. Find **Newham, LA code E09000025**. Save the sheet, physical row number, header names, raw cell labels and values, geography validation, period and exact units in a versioned **derived, minimal fact extract**.
4. Repeat extraction independently with a second parser/person, validate sample neighbouring LA rows and London totals where aggregation is appropriate, check missing/suppressed cells.
5. Compute *only the release-defined local administrative potential receipt rate* where the source explicitly supplies valid paired numerator/denominator; retain method warning and uncertainty. Do not relabel as an individual's actual eligibility or the national official take-up rate.
6. Preserve machine-readable source hashes and result provenance; fail closed if the publisher replaces the binary or definitions change. Obtain independent source/licensing review before any data redistribution.
7. Do **not** treat a local ecological estimate as the denominator of HPI-B-01. That primary participant outcome still requires lawful, independently established eligibility and confirmed paid awards with prescribed follow-up.

**Evidence ledger:** `source_verified=true`; `newham_row_extracted=false`; `ods_binary_sha256=null`; `sheet=null`; `row=null`; `numerator=null`; `denominator=null`; `local_receipt_rate=null`; `independent_award_verification=false`.

## 3. HPI additionality challenge against existing services

**Incumbent delivery:** Newham's *Our Newham Money* already provides financial/benefits support. DWP also runs Pension Credit awareness campaigns. HPI cannot assume another awareness campaign helps, nor claim local service outcomes as its own.

Potential *research* contribution worth independent testing (not a licensed intervention):

- **Endpoint integrity:** externally verify the path `contact → eligibility assessed → application → award decision → first payment → sustained payment`; distinguish pending/rejected/withdrawn/unknown and never replace payment with 'helped to claim'.
- **Equity / accessibility:** assess barriers for offline, language, disability, caring status, digital exclusion and timing, with community co-design and legal/ethical review; no small identifiable cells published.
- **Counterfactual:** ethically assess *incremental support above existing standard service*, not withholding entitled benefits. Options: service operations descriptive audit, independently reviewed controlled time series or carefully designed supplementary support assignment; causal estimates only with appropriate control, bias, spillover and missingness analysis.
- **Cost and harms:** collect full programme/partner costs, administrative and claimant burden, unintended reassessment, stigma and displacement; report net additional outcomes including null or negative results.
- **Reproducible public-good tooling:** open source audit/provenance and accessible reporting methods, not claimant records or confidential data.

**Falsification / NO-GO tests:** (a) credible existing evaluation already answers the same verified outcome question; (b) partner cannot lawfully access/verify entitlement and payment records; (c) assistance risks harm or worsening inequity; (d) incremental service displaces a more effective local programme; (e) insufficient independent scientific or community challenge. In any of those cases, HPI should **not** launch an intervention.

## 4. Data request specification — draft, UNSENT

If a legally accountable partner and ethics/privacy reviewers later approve a request, ask the relevant authorised controllers **only for the minimum necessary** approved aggregate or appropriately privacy-preserved outputs:

- per-cohort baseline entitlement confirmation **method**, unique unit and indexing period;
- de-duplicated first *paid* awards and maintained payments, withdrawals/denials and missing follow-up;
- existing-service outreach dates, channels and eligibility route needed to evaluate *additionality* rather than duplication;
- permitted subgroup comparisons with minimum disclosure thresholds and voluntary accessible participation;
- direct and indirect costs, adverse events and administrative burden;
- lawfulness, controller/processor responsibilities, data minimisation, DPIA decision, retention and deletion, transfer rights and technical access arrangements.

No data subject, council, DWP or potential sponsor was approached under this task. No person-level data, benefits advice, outreach, recruitment, consent or transactions were performed.

## 5. Decision / handoff

| Gate | Result on 7 Nov 2026 |
| --- | --- |
| Official publication and local methodology identified | **PASS** |
| GB national rate correctly isolated | **PASS** |
| Council reported outcomes separated and overlap warning | **PASS** |
| Newham ODS exact row, sheet, count, binary hash | **BLOCKED — not independently extracted** |
| Local **actual** verified eligible/paid count for HPI-B-01 | **ABSENT** |
| Evidence of additional service effect beyond council delivery | **ABSENT** |
| Ethics, independent methods/community, accountable local partner, lawful personal-data processing | **NOT AUTHORISED** |
| Authorise any Newham field pilot | **NO-GO** |

**Next shortest technical action:** extract and dual-verify the exact DWP ODS Newham row, publish a strictly scoped provenance update; then independent local partner/additionality assessment before any F0-05 field decision. Parent [NEW-02 #70](https://github.com/saver1991/human-prosperity-initiative/issues/70) stays open; [F0-03.1 #19](https://github.com/saver1991/human-prosperity-initiative/issues/19), [RT-GATE-01 #67](https://github.com/saver1991/human-prosperity-initiative/issues/67) and [F0-05 #11](https://github.com/saver1991/human-prosperity-initiative/issues/11) remain blocking.

**Quality boundary:** This version is a defensible desk-source reconciliation and honest extraction-failure report, not a completed primary-data study, independently validated science, government partnership or registered charity.
