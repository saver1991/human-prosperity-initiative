# NEW-02 — Newham Pension Credit official row reconciliation V0.2

**Verified:** 9 November 2026. **Scope:** public-source desk audit only. **Disposition:** DWP ODS extraction and model-comparison scope COMPLETE; **HPI-B-01 real outcome infeasible with available open data**; NO-GO for any field study, outreach, claims of impact, or collection of participant data. This supersedes [the 7 November V0.1 extraction-blocked report](NEW-02-newham-source-reconciliation-additionality-v0.1.md), but **not** its legal/ethical warnings.

## 1. A previously missing primary-source row has been verified

The [DWP 30 October 2025 ad-hoc official statistical release](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024) publishes an ODS spreadsheet of **2023/24 administrative model estimates**. We downloaded the **official publisher binary**, verified ZIP integrity and SHA-256, extracted physical worksheet rows with Python standard-library `zipfile` and XML ElementTree, and independently checked the arithmetic implied by the rounded row. The same hash-pinned [reproducer](../scripts/verify_newham_dwp_ods.py) has now completed a real remote `--fetch` run. This is reproducible software verification, **not independent scientific peer review**.

| Evidence | Verified result |
| --- | --- |
| Publisher | Department for Work and Pensions (DWP) |
| Publication date | 30 October 2025; observed data period **2023/24** |
| Asset | [Original DWP 133 KB ODS](https://assets.publishing.service.gov.uk/media/6900969fa6048928d3fc2ae5/households-potentially-eligible-for-pension-credit-2023-to-2024.ods) |
| Original binary length | **135,855 bytes** |
| SHA-256 | `89f5a5fa831f21c4661d6e73ccb76878959e6ea721fb459b43aa3d9bcd96765c` |
| Local authority | **London / Newham**; ONS GSS code **E09000025** from [ONS separately](https://www.ons.gov.uk/explore-local-statistics/areas/E09000025-newham); the ODS row itself does not provide that code |
| Primary table | Worksheet **3a**, physical spreadsheet row **109**, columns A–F |
| Secondary table | Worksheet **3b**, physical spreadsheet row **110**, columns A–E |
| Public reuse notice | [DWP statistical release](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024/analysis-of-households-potentially-eligible-for-pension-credit-and-eligible-households-in-receipt-of-pension-credit-2023-to-2024) states OGL v3.0 except third-party content; no third-party data rights or case-level use has been approved |

### Worksheet 3a — NEW-02 verified local household model

| Column | DWP column label | Newham value |
| --- | --- | ---: |
| A | Region | London |
| B | Local Authority | Newham |
| C | All eligible | **11,300** |
| D | Potentially eligible households | **2,500** |
| E | Eligible households in receipt | **8,800** |
| F | Receipt-rate (caseload) | **78%** |

All counts are DWP **rounded model-based household estimates for the financial year**, not independently confirmed case eligibility. The displayed arithmetic `8,800 / (8,800 + 2,500) = 77.88%` is consistent with the **78%** published rate; precision beyond DWP rounding is unwarranted. **2,500 is not a list of identifiable people or a validated count of genuinely entitled nonrecipients.**

### Worksheet 3b — separate expenditure concept

The **raw** Newham row 110 is `London | Newham | 8,328,000 | 51,337,000 | 86%`, with DWP's named columns `Estimated amount unclaimed (£)`, `Total amount claimed (£m)`, and `Receipt-rate (expenditure)`. The displayed local **expenditure receipt-rate is 86%**. The heading for claimed amounts contains a **unit ambiguity** (`£m` despite the raw displayed `51,337,000`), so HPI does not independently normalise the raw monetary figure into GBP or millions, or use it to claim cost effectiveness. The 86% expenditure share and 78% household caseload share **are different statistics**.

## 2. Source definitions and why these percentages cannot be pooled

The [DWP methodology](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024/analysis-of-households-potentially-eligible-for-pension-credit-and-eligible-households-in-receipt-of-pension-credit-2023-to-2024) warns that administrative local household potential-receipt estimates do **not** directly compare with national take-up statistics. The model lacks individual savings and full housing-cost information. Depending on local circumstances, these missing inputs bias estimated potential eligibility and receipt rates in opposing directions.

| Measure | Year | Geography | Statistical unit | Interpretation |
| --- | --- | --- | --- | --- |
| DWP local **78%** caseload receipt | **2023/24** | **Newham** | **Household**, annual admin model | Estimated proportion of modelled local eligible households in receipt during year; not independently verified eligibility |
| DWP local **86%** expenditure receipt | **2023/24** | **Newham** | Estimated expenditure share | Distinct financial measure; source-unit caveat above |
| DWP official national **62%** take-up | **FYE2025** | **Great Britain** | **Pensioner benefit unit/family**, national survey-based estimate | National take-up benchmark only; **not Newham** and not directly comparable |
| Newham Council **220 assisted claims**, **£748,590 attributed income** | **2024/25** | **Newham** | Council service reporting | Helped-to-claim != uniquely eligible/confirmed paid award. No independent evaluation or HPI attribution |
| MHCLG Newham **46.7% age 60+ income deprivation**, **39% all ages** | **2025** | **Newham** | Area population deprivation | Poverty context, **not** entitlement, receipt or a trial result |

Do not calculate `78%-62%` as a change, treatment effect or performance gap. Do not extrapolate `2,500` to currently entitled households, service demand, recruitment pool or confirmed awards. Newham Council's separate December 2024 publicity also reported 155 helped to claim and more than £600,000; **do not add** those figures to the annual report without verifying cohort overlap.

## 3. Independent HPI-B-01 numerator and denominator: NULL (infeasible with inspected public sources)

The scientific candidate [HPI-B-01](F0-03-indicator-catalog-v0.1.csv) requires a defined set of **independently verified eligible study participants** as denominator and **verified first paid awards at prespecified follow-up** as numerator. The DWP's local ecological estimate provides **neither** for a HPI cohort. DWP Stat-Xplore/claimant series can count recipients by local authority but **cannot** independently establish all local nonclaimant eligibility and link a designated study cohort to actual paid awards through an ethically approved comparison.

As of this dated desk audit, **no suitable lawful, independently verified participant-level denominator or linked first-payment numerator has been obtained from the inspected official public sources**. The machine-readable [minimal fact audit](NEW-02-dwp-newham-local-official-facts-v0.2.json) therefore keeps `eligibleParticipantDenominator=null`, `confirmedFirstPaidAwardNumerator=null`, and `validatedOutcomeReceiptPct=null`. This is a **negative feasibility finding**, not a missing value to fill with DWP's 11,300 or council's 220. No independent controller, ethics approval, participant consent, dataset-sharing agreement or sponsor exists.

## 4. HPI additionality versus established services — NOT ESTABLISHED

Newham already runs **Our Newham Money / LIFT** outreach and assistance; national DWP campaigns also exist. Neither the DWP ODS nor the Newham programme reports is an independent counterfactual test of extra support. HPI has **not demonstrated incremental welfare gains**. Repeating a general awareness campaign risks duplicating public provision. The only defensible near-term HPI contribution is open **research methodology, source validation, negative evidence and reusable provenance tooling**.

For an eventual partner-led study, the scientifically relevant incremental question would require lawful verification of the chain `contact → eligibility assessed → application → award decision → first payment → sustained receipt`, plus ethical comparison with services already offered, burden, costs and harms. No resident or partner has been contacted; no records have been collected.

**NO-GO for applied intervention** if no independent local eligible/paid cohort can be established; if existing services already answer the question; if additional support is duplicative/harmful; or if review, legal accountability and safeguarding are absent. A published 78% model rate does not change these hard stops.

## 5. Reproduction, disclosure and decision register

Reproduce from the pinned publisher asset with `python3 scripts/verify_newham_dwp_ods.py --fetch` (Python stdlib, no external packages). It fails closed on SHA mismatch, ZIP corruption, source header changes, geography/row drift or unexpected figures and emits only minimal Newham cells and method disclaimers. A previously downloaded original ODS may also be passed as the positional file argument. **Do not commit or republish the full DWP dataset.**

Machine extract: [`research/NEW-02-dwp-newham-local-official-facts-v0.2.json`](NEW-02-dwp-newham-local-official-facts-v0.2.json). The recorded ONS code comes from an **independent geography lookup**, not from an ODS field. Publicly available OGL terms do not automatically licence any case-level records, future linkage or human research.

| Scope gate | 9 Nov 2026 result |
| --- | --- |
| Original DWP asset, byte count, SHA-256 and ZIP CRC | **VERIFIED** |
| Exact sheet 3a/3b, physical rows, official headers and Newham numbers | **VERIFIED** |
| Rate computed only within its own model and units | **VERIFIED** |
| GB national/council/area measures kept separate | **VERIFIED** |
| Independent participant HPI-B-01 denominator and confirmed first payment numerator | **ABSENT / NULL — not publicly feasible** |
| HPI incremental service benefit over council provision | **NOT ESTABLISHED** |
| Scientific, community, ethics, data licensing, partner and field approvals | **NOT AUTHORISED** |

**NEW-02 desk-task closure criterion:** identify and validate official local model figures *or transparently record why extraction fails*, and determine whether examined open evidence independently identifies the real study outcome. This case meets the **bounded public-source desk-audit** acceptance criterion now that the ODS source and Newham rows have been verified and the absent actual study denominator has been explicitly recorded. It **does not meet** research field-go or trial-readiness criteria, which remain with [F0-03.1 independent methods/community review #19](https://github.com/saver1991/human-prosperity-initiative/issues/19), [RT-GATE-01 data/privacy/ethics #67](https://github.com/saver1991/human-prosperity-initiative/issues/67), [F0-05 pilot design #11](https://github.com/saver1991/human-prosperity-initiative/issues/11), [F0-04.1 safeguarding #26](https://github.com/saver1991/human-prosperity-initiative/issues/26) and [F0-04.7 institutional decision #51](https://github.com/saver1991/human-prosperity-initiative/issues/51).

**Decision:** NEW-02 source/desk audit **GO — COMPLETE**; HPI Newham participant intervention **NO-GO**; next technical-independent programme step **F0-03.1** scientific review preparation and an independent review route, with F0-05 conditional.
