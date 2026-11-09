# F0-03.1 — Newham independent scientific review readiness V0.2

**9 November 2026 · INTERNAL AI-ASSISTED METHODS CRITIQUE / EXTERNAL REVIEW PREPARATION.** This document is **not** an independent review, a signed or ratified measurement framework, an approved protocol, a community consultation, legal advice or permission to recruit. No actual reviewer, institution, data controller, participant or partner has contributed or been contacted by this preparation.

## 1. Review decision, scope and version control

**Decision: GO for transparent methodological critique of the evidence; NO-GO for real intervention or causal measurement.** F0-03 V0.1 remains an *unvalidated candidate framework* and proposed HPI-B-01 cannot currently be measured in an HPI cohort. A modelled public-source administrative area rate does not change the human, ethical or data-access gates.

Review packet:
- [15 candidate HPI measures](F0-03-indicator-catalog-v0.1.csv), [original framework V0.1](F0-03-prosperity-measurement-framework-v0.1.md), [pre-review M01–M10](F0-03-methodological-pre-review-2026-11-05.md), [original reviewer form](F0-03-independent-review-form.md), [disposition register](F0-03-review-disposition-v0.1.csv).
- [Newham desk measurement V0.2](F0-03-newham-pension-credit-desk-validation-v0.2.md) and [F0-05 first-study concept V0.1](F0-05-newham-pension-credit-first-study-concept-v0.1.md).
- [NEW-02 independently reproducible source extraction V0.2](NEW-02-newham-source-reconciliation-additionality-v0.2.md), [publisher-source minimal extract](https://human-prosperity-initiative.vercel.app/research-newham-dwp-official-facts.json), [reproducer source](https://github.com/saver1991/human-prosperity-initiative/blob/main/scripts/verify_newham_dwp_ods.py).
- [HPI public-source reproducibility methods](../docs/RT-01-research-tools-and-open-infrastructure.md), [NO-GO ethical gates](../docs/governance/F0-04-6-international-operations-and-partner-controls-v0.1.md).

## 2. Updated source reconciliation — challenge without swapping units

NEW-02 resolved the **technical data-file extraction**, not the science question:

| Official source | Values in original source | Unit and year | What this does NOT prove |
| --- | --- | --- | --- |
| [DWP local ad-hoc ODS 2023/24](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024) | Newham worksheet 3a row 109: **11,300 modelled eligible**, **8,800 modelled recipients**, **2,500 potentially eligible nonrecipients**, **78% receipt rate** | **Household**, 2023/24 admin model; rounded counts, SHA-256 source pinned in NEW-02 | Does **not** identify real eligible participants, current unclaimed entitlements, the individual first payment, study success or additionality |
| Same DWP file | Newham worksheet 3b row 110: **86% estimated expenditure receipt rate** | Expenditure, distinct statistic; accompanying raw claimed amount's column header has unit ambiguity | Not a causal or financial effect of HPI; do not combine 86% and 78%, or infer cost effectiveness |
| [DWP FYE2025 national official take-up](https://www.gov.uk/government/statistics/income-related-benefits-estimates-of-take-up-financial-year-ending-2025/income-related-benefits-estimates-of-take-up-financial-year-ending-2025) | **62%** | **Great Britain benefit units**, survey/simulation method, different period | **Not** Newham, **not** change from 78%, incompatible denominator |
| [Newham Council service report](https://www.newham.gov.uk/downloads/file/9654/2024-25-you-said-together-we-did-5-) | **220 supported to claim**, council-reported **£748,590 attributed income** | Council activity report, 2024/25 | Not 220 verified unique first paid awards, no denominator/independent counterfactual, possible overlap with other council publicity |
| [MHCLG IoD 2025](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025/english-indices-of-deprivation-2025-statistical-release) | **46.7% age 60+**, **39% all ages** income deprivation in Newham | Area deprivation measures | Not individual Pension Credit eligibility or nonreceipt |

**Methods objection IR-01:** 78% is an *ecological, administratively modelled household receipt estimate*. The draft HPI-B-01 is **a benefit-unit/participant first-paid outcome**. This mismatch invalidates direct substitution. The published DWP workbook does not hold a consented cohort nor confirm any designated individual's first payment. Its model does not fully observe savings/housing-cost eligibility, and rounding masks precision. The locally modelled 2,500 potential nonrecipients must never become a recruitment target or an asserted unclaimed-rights count.

## 3. Testable study design: alternatives, not a selected trial

**Candidate question** (awaiting independent rejection/revision): can an independently assessed *addition* to existing Newham support improve **confirmed first paid Pension Credit** among *already legally eligible, verified baseline nonreceivers*, relative to existing services? A supplementary service cannot withhold statutory entitlements or displace existing necessary support.

| Design option | Estimand possible **only if** | Main threats | Current decision |
| --- | --- | --- | --- |
| **Descriptive service audit** | Legal access to de-duplicated process and payment/eligibility records with a defined period; process-quality endpoints | Referral selection, missingness, changing rules and service overlap; **no causal contrast** | **Unapproved; methodological fallback only** |
| **Prospective addition-to-usual-care comparison** | Verified baseline cohort, allocation/assignment rationale, equal entitlement access, recorded offer, follow-up, interference and independent ethics | Selection, noncompliance, spillovers, balancing support, incomplete outcomes | **Unapproved** |
| **Quasi-experimental evaluation** | Credible exogenous timing/assignment, comparison trend, no concurrent confounding; falsification/negative controls | Calendar effects, pretrend failure, programme variation, overlapping council programmes | **Unapproved** |
| **Stop / no new field intervention** | Unable to establish independent value or lawful meaningful outcome / unacceptable burden | No impact estimated by HPI; avoid misleading people | **Default until gates passed** |

**Provisional estimand for reviewers, not pre-registration:** between-group difference (percentage points) in the probability of **verified first paid award** by prespecified follow-up among an eligibility-confirmed baseline nonrecipient benefit-unit cohort, contrasting additional support **offer** with accessible existing support. The estimand (ITT vs receipt of service), cluster/individual unit, outcome windows, censoring and eligibility changes remain **not finalised**. Offer vs actual exposure, awards vs paid benefits, first vs durable payments must be separated. A hazard/time-to-award analysis is a possible alternative only if dates/records and risk-set definition are approved. No effect size, minimum clinically/socially meaningful difference, sample size, power, p-value or confidence interval can currently be justified.

## 4. Specific review questions and falsification requirements

Use the [machine-readable challenge matrix](F0-03-1-review-readiness-v0.2.json). The following are **questions to actual independent reviewers**, not self-scored PASS:

1. **Construct / target population:** Is a household an acceptable unit for statutory Pension Credit eligibility, or must each actual benefit unit be verified separately? What is the lawful, complete eligible baseline sampling frame?
2. **Primary outcome:** Can first **paid** award be verified, timestamped and de-duplicated for each enrolled, eligible, consenting/otherwise lawfully included unit? Handling of pending/denied/reassessment, late payments and eligibility changes?
3. **Additionality:** Is Our Newham Money/LIFT already providing and evaluating equivalent support? Identify a genuine incremental scientific question without displacing or duplicating proven services.
4. **Comparator / estimand:** Are existing services assured to everyone? Is a truly fair and safe comparator feasible? Which assignment mechanism supports the causal estimand; how will spillover/crossovers be managed?
5. **Missingness / precision:** Are records complete and legally accessible, and what bounds/sensitivity analyses will be pre-specified for selective attrition and lost follow-up? Do not fill unknowns with 11,300 or 78%.
6. **Bias / falsification:** Identify plausible calendar/concurrent-policy confounders, pretrend or negative control opportunities, measurement drift and outcome switching.
7. **Equity and nonparticipants:** Which language, disability, literacy, digital exclusion and age-related barriers and harms should be monitored without unsafe subgroup disclosure? How would community input be secured?
8. **Cost, burden and harms:** Is HPI-E-03 interpretable with audited implementation costs, actual claimant burden, administrative expenses and no ratio when the incremental effect is zero/negative? Include harm/complaint/incident stop rules.
9. **Instrument transferability:** Are HPI-E-01, A-02 and other subjective measures culturally/linguistically valid or should they be excluded or revalidated for the local context?
10. **Uncertainty / multiplicity:** Who specifies one primary estimand, secondary hierarchy, minimum important difference, follow-up and sample/power rationale before any data are observed?
11. **Privacy and independence:** Who has legal controller/processor and study sponsor accountability? What actual lawful basis, data agreement, appropriate Article 9 condition (if needed), security, DPIA, ethics and independent governance apply? No basis or sign-off is assumed.
12. **Stop decision:** Would the most ethical/scientifically useful outcome be a published negative feasibility finding rather than a new intervention? Record this as a legitimate answer.

## 5. What an independent reviewer must be able to return

For every challenge, receive **specific item ID + source/version + objection + counterevidence + materiality + requested correction + reasoned go/revise/no-go**, alongside real expertise and a conflict/independence disclosure. Reviewer identity or chosen public attribution must be consented. Raw hardship case histories, identifiable resident/claimant data, health or benefit documentation are **not** appropriate for GitHub review. Reviewers should critique public methodology only via a public PR/issue. A protected steward must be appointed before sensitive/community consultation; none exists currently.

Maintain separately: **internal editorial response**, **actual qualified external method review**, **safeguarded affected-community consultation**, **independent ethics/privacy permissions**, and **founder/institutional decision**. An automated CI pass or an AI-generated review counts *only* towards technical document quality. Absence of actual reviewers is recorded as `not_obtained`; never substitute hypothetical reviewer data.

**Rights note:** The [ICO research-processing guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/the-research-provisions/principles-and-grounds-for-processing/) explains that study participation consent is distinct from UK GDPR processing lawful basis and that research does not confer an automatic lawful basis. The ICO flags parts of its guidance as under review after legislative updates, so any real protocol requires contemporaneous qualified verification. The [HRA approval decision guidance](https://www.hra.nhs.uk/approvals-amendments/what-approvals-do-i-need/) is useful to determine whether *applicable health/social-care research* requires HRA/NHS permissions; it does **not** mean that every poverty/benefits study automatically falls under HRA or that HPI has HRA approval. Appropriate independent local review remains mandatory before participants.

## 6. Publication and gates

- This V0.2 **preparation package** can be published as transparent open research. The existing [general review form](F0-03-independent-review-form.md) and its questions R1–R11 remain an unfilled external instrument.
- [Public review invitation and safe protocol](F0-03-1-external-review-protocol-v0.2.md) describes non-sensitive method review only. No invitations sent and no actual appointments or community interviews occurred.
- [M01–M10 legacy dispositions](F0-03-review-disposition-v0.1.csv) still record `independent_validation_status=not_performed`; the current source reconciliation does not change any of them into scientific approval.
- HPI-B-01 from the 15-indicator catalogue remains **candidate_primary_unmeasurable** for actual Newham participants. Neither 78% nor 86% is a valid substitution.
- The machine-readable gate requires `independentMethodsReview=not_obtained`, `communityReview=not_obtained`, `ethicsApproval=false`, `verifiedStudyEligibleDenominator=null`, `fieldStudyAuthorised=false`; fail closed on unknown.
- **F0-03.1 #19 remains OPEN**. F0-03 scientific V1.0 is **NOT RATIFIED**. **F0-05 #11**, **RT-GATE #67**, **F0-04.1 safeguarding #26** and **F0-04.7 #51** remain blockers.

**Next decision after this bounded preparation:** secure a real qualified independent methods review and independently safeguarded community input *only through an authorised human-led route*; otherwise maintain the **NO-GO** and consider alternate study questions. No future step should publish a claimed intervention effect without independently verified outcomes and a valid comparator.
