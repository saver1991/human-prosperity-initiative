# F0-03 / NEW-01 — Newham Pension Credit measurement case study V0.2

**Date:** 7 November 2026. **Scope decision:** Founder selected **London Borough of Newham** for a serious **public-source desk validation** of HPI's measurement framework. The earlier candidate population is **low-income pension-age households who may be entitled to Pension Credit**, not every person experiencing poverty in the borough. **This is not a field pilot, external scientific review, existing partner relationship, lawful claimant data access or measured HPI impact.** No one has been contacted or recruited.

**Verdict:** **Desk feasibility and technical data-integrity audit COMPLETE; exact local participant receipt outcome NOT MEASURABLE from the currently verified material.** The measurement framework V0.1 can be adapted to this concrete context as a **reviewable V0.2 context application**, but cannot truthfully become a scientifically validated F0-03 V1.0 without real independent methods, ethics, stakeholder and statutory-data reviews.

## 1. Problem and pre-specified research direction

**Prospective falsifiable question:** *Among Newham pension-age households with independently established Pension Credit entitlement, would an ethically approved improvement over **existing** support lead to a higher proportion of people with confirmed payments at a specified follow-up, without increasing financial harm, administrative burden or inequitable exclusions?*

There is already local delivery. [Newham's 2024/25 Ageing Well progress report](https://www.newham.gov.uk/downloads/file/9654/2024-25-you-said-together-we-did-5-) reports that **Our Newham Money supported 220 residents to claim Pension Credit**, with **£748,590 in additional income** attributed by the council to that work. These are **self-reported service outputs**, not an independent experiment, not a unique verified eligible denominator, and **not HPI outcomes**. The council's [December 2024 story](https://www.newham.gov.uk/news/article/1379/newham-council-helps-155-pensioners-claim-a-total-of-over-600000-in-unclaimed-pension-credit) references 155 supported pensioners and over £600,000, and may overlap the 2024/25 report: **we do not sum these figures**. A further HPI outreach campaign without demonstrable additionality would risk duplicating existing services and burdening residents.

**HPI's possible research additionality, not yet demonstrated:** interoperable methods and source provenance for the evaluation of *confirmed receipt* and the distribution of successful access, missingness, stigma, disability and language barriers, adverse outcomes and full programme/claimant costs. A partner may reasonably determine that their existing evaluation makes HPI's involvement unnecessary; **NO-GO is an acceptable result**.

## 2. Dated public-source observations, with incompatible universes kept separate

| Record | Observation | Correct population, place and period | Method/source warning |
| --- | --- | --- | --- |
| MHCLG 2025 deprivation | **39.0%** income deprivation score | **Newham, all-ages population**, IoD 2025 | Not 39% of pensioners; does not estimate Pension Credit eligibility, local benefit receipt or individual poverty status |
| DWP FYE 2025 Pension Credit take-up | **62%** | **Great Britain, estimated entitled pensioner families/benefit units**, 2024/25 | **NOT the Newham Pension Credit rate**. The denominator and methodology do not match local-administrative potential eligibility statistics |
| Newham Ageing Well 2024/25 | **220 residents supported to claim Pension Credit** | **Newham service users**, 2024/25 | A service delivery output, **not** count of independent confirmed awards nor estimated unclaimed claimant population |
| Newham Ageing Well 2024/25 | **£748,590 council-reported additional income** | Same local service programme, 2024/25 | Not audited HPI impact or total net benefit. No verified intervention cost, currency price basis, independent counterfactual or reliable per-person causal gain |
| DWP ad hoc local authority Pension Credit modelling | **Numeric Newham figure NOT EXTRACTED** | Local authorities, **2023/24** | Underlying [DWP 2023/24 tables](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024) are published as ODS, but specific Newham values have not been pinned in this exercise. They report **potential** administrative-data receipt, not official national take-up. Model lacks some savings and housing costs information; **do not directly compare** the series with the DWP 62% national estimate |

**Official source links and use:** [MHCLG English Indices of Deprivation 2025](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025/english-indices-of-deprivation-2025-statistical-release) (statistical release, Open Government Licence v3.0; publisher cautions it cannot identify deprived individuals or directly measure absolute change), [DWP Pension Credit take-up FYE 2025](https://www.gov.uk/government/statistics/income-related-benefits-estimates-of-take-up-financial-year-ending-2025/income-related-benefits-estimates-of-take-up-financial-year-ending-2025) (updated 28 October 2026; national 62%), [DWP local administrative potential eligibility 2023/24](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024/analysis-of-households-potentially-eligible-for-pension-credit-and-eligible-households-in-receipt-of-pension-credit-2023-to-2024) (published 30 October 2025), [Newham Council Ageing Well report](https://www.newham.gov.uk/downloads/file/9654/2024-25-you-said-together-we-did-5-). Source URLs are references only; no copyrighted full report or third-party data table is re-hosted. Council rights for reproduction remain separately unreviewed.

**Important socioeconomic limitation:** Newham's income deprivation and the [DWP 2024/25 child poverty rate of 44.9% after housing costs](https://www.gov.uk/government/statistics/children-in-low-income-families-local-area-statistics-2022-to-2025/children-in-low-income-families-local-area-statistics-financial-year-ending-2025) are compelling context for social need, but **neither value estimates deprivation among Pension Credit eligible households**. We do not feed the child poverty statistic into the older-age indicator model.

## 3. Executed F0-03 V0.1 → Newham V0.2 measurement readiness

The [15 original draft indicators](F0-03-indicator-catalog-v0.1.csv) were evaluated **one by one**, with machine-readable results at [Newham feasibility CSV](F0-03-newham-indicator-feasibility-v0.2.csv) and a source-locked [fact audit JSON](https://human-prosperity-initiative.vercel.app/research-newham-source-audit.json). The production [measurement readiness JSON](https://human-prosperity-initiative.vercel.app/research-newham-validation.json) is generated reproducibly from those files.

- **HPI-B-01, proposed primary:** **NOT MEASURABLE NOW.** The appropriate future endpoint is *share of independently established eligible participating households with confirmed Pension Credit receipt* during a prespecified follow-up, verified with a lawful partner or appropriately assessed source. The **local eligible denominator** and **confirmed receipt numerator** are both missing. Council claim-support counts are *not* that numerator.
- **HPI-B-02, secondary:** claimant time, out-of-pocket expense and processing delays not measured. Any collection needs independently approved accessible instruments and personal data governance.
- **HPI-A-01/A-02/A-03:** real household resources, difficulty affording essentials and monetary poverty gap not observed. The 39% IMD income deprivation snapshot is **not** a direct measure of any of these participant outcomes.
- **HPI-E-01/E-02/E-03:** agency/stigma, equity by prespecified lawful groups and **actual** implementation plus claimant costs remain unmeasured. Council-reported additional benefit value cannot substitute for programme expenditure or demonstrate cost-effectiveness.
- Other dimensions (energy, health, education, livelihoods) remain *outside this narrowly chosen case* unless a qualified independent reviewer and affected people justify them.

**Total:** 15 indicators audited, **0** directly measured with the proposed HPI participant-level definition, **1** candidate primary, **0** scientifically validated, **0** causal estimates and **0** HPI beneficiaries established. This is a **successful test of the measurement safeguards and data-gap discovery**, not a successful intervention test.

## 4. Pre-protocol for a possible future independent study — not an approved pilot

| Protocol element | Prespecification to be reviewed | Status |
| --- | --- | --- |
| Target | Newham pension-age households, potential low-income Pension Credit entitlement; full lawful eligibility determination and exclusions **not yet set** | Open |
| Unit and denominator | Benefit unit/household (decide before registration), eligibility independently assessed at a defined index date; prevent denominator leakage across household vs benefit unit | Open |
| Primary | Proportion with **actual verified receipt** in specified interval; record delayed/partial awards, prior recipients, changed eligibility and unknown outcomes | Candidate only |
| Duration | Illustrative 3- and 6-month checkpoints; exact duration and exposure chosen with partner/independent reviewers, not assumed fitted to observed figures | Open |
| Comparator | Independently approved standard existing service / business-as-usual, with genuine non-denial of statutory benefits; **not** automatically compare against uncontacted people or use national 62% as a control | Open |
| Causal identification | Prospectively assess ethical randomised additional service capacity, if defensible, or a suitably controlled observational alternative; define confounding, spillovers, contamination and interference | Open |
| Sample and power | Determine after local eligible denominator, feasible sample, clustering/attrition and meaningful outcome thresholds are documented; **no invented sample size** | Open |
| Equity | Language, digital exclusion, disability access, geography and resources may affect eligibility/uptake; **no sensitive personal characteristics collected or disclosed** without a lawful, independently reviewed design and small-cell suppression | Open |
| Harms | Incorrect advice, adverse benefit reassessment, privacy leakage, distress/stigma, burden on council services and exclusion of non-digital groups | Open |
| Costs | Separate council/partner support costs, pensioner time/cost, administrative changes and incremental entitlement transfers; avoid an unstable cost/effect ratio if effects are unknown or negative | Open |
| Data rights | DWP and council agreements, actual processing legal basis, ethics committee, accountable controller/processor, access control, retention, deletion and reproducibility sans identifiers | Not authorised |

**Non-negotiable:** do **not** randomly withhold a legally owed benefit, contact vulnerable residents, claim to be Newham Council, send welfare applications or access restricted DWP records under this workstream. No fieldwork, transactions or requests to local partners were initiated.

## 5. Evidence quality, bias and possible falsification

1. **Ecological fallacy:** Newham borough-wide 39% income deprivation does not mean 39% Pension Credit eligible people. **Fail** any code that substitutes that percentage for the HPI-B-01 denominator.
2. **Incomparable rate designs:** 62% GB survey-based take-up in FYE 2025 cannot be compared with an ad-hoc DWP local potential-receipt rate in 2023/24 or with a council's 220 help-to-claim count. **Fail** any pooled calculation.
3. **Selection and prior activities:** existing Newham LIFT/Our Newham Money assistance predates HPI; improvement cannot be attributed to HPI without credible counterfactual.
4. **Missing and adverse outcomes:** distinguish supported → applied → awarded → payment verified → sustained, with reversals and attrition explicit. No silent reclassification of pending claims as approved or zero missingness as an assumption.
5. **Reporting bias:** the council's £748,590 is an attributed programme figure, not an independent public account audit or net cost-effectiveness. Do not add the £600,000 December 2024 report because cohorts may overlap.
6. **Review independence:** code/CI checks reproduce inputs only. An actual qualified reviewer, community perspective and governance permission remain **unavailable**.

### What would refute the proposed research need?

- A verified independent evaluation already answers the exact receipt/equity question with sufficiently robust methods; then **do not duplicate it**.
- An additional service produces applications but no new verified awards, or an offsetting worsening in claimants' security; **do not call this successful**.
- The partner lacks legal authority to share reliable denominators/outcomes or protect older people; **stop**.
- Clear additionality cannot be demonstrated over existing Newham support; **NO-GO or redesign**.

## 6. Decisions, deliverables and next gates

- **Founder-selected:** Newham as the **sole immediate public desk validation territory**; Recife and Naples remain documented comparators/reserve, not cancelled or approved study areas.
- **Founding research priority:** a narrow Pension Credit measurement feasibility use case, not a national/general reduction-in-poverty claim and **no HPI intervention authorisation**.
- **Delivery now:** Versioned source fact audit, 15-indicator mapping, runnable strict validation command, tests for fabricated denominators, swapped geography, local–national metric confusion, and an HPI first-party result page.
- **Still blocked:** qualified independent F0-03.1 methodology/community review [#19](https://github.com/saver1991/human-prosperity-initiative/issues/19), source-specific local rate extraction/rights checks, F0-04 legal/institutional readiness, RT-GATE-01 external approvals [#67](https://github.com/saver1991/human-prosperity-initiative/issues/67), ethical community consultation and formal F0-02.5/F0-05 study go/no-go.

**Decision at this point:** **GO for public-source methodology testing; NO-GO for human research or impact claims.** The distinction is substantive: F0-03 **desk application V0.2 completed**, F0-03 **scientific instrument V1.0 NOT complete and cannot be signed off by HPI/AI acting alone**.
