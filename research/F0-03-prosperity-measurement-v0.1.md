# F0-03 — Measuring human prosperity: outcome framework v0.1

**Status:** Draft for independent scientific and community review — 5 November 2026. **Not validated**, not a proposed universal ranking or single HPI prosperity score. Related: [founding charter](../docs/charter.en.md), [roadmap](../docs/roadmap.md), [F0-02 assessment](F0-02-opportunity-assessment.md), [GitHub issue #5](https://github.com/saver1991/human-prosperity-initiative/issues/5).

## Purpose and decision boundaries

HPI needs outcomes that tell us whether a specific intervention improved real lives **without shifting harms or costs onto other people**. We will compare the intervention against a defensible counterfactual wherever ethically and practically possible, instead of treating programme activity or website usage as proof of prosperity.

**We will not publish a universal HPI Prosperity Index at this stage.** The following five working dimensions identify potential measures, not an empirically validated scale. Their relative importance may vary by affected communities, jurisdiction and intervention. No numerical weights are proposed.

### Established frameworks and how HPI should use them

| Framework | What it measures | Why useful | Important boundary |
| --- | --- | --- | --- |
| World Bank monetary poverty | Living below an international or national consumption/income poverty line; the World Bank updated the global extreme-poverty line to **US$3 per person per day at 2021 PPP** in June 2025. | Comparable monetary deprivation and trend baselines in the relevant coverage and reference period. | An international poverty line is not a threshold for full prosperity, a measure of self-determination or a substitute for local thresholds. PPP vintage, sampling and reporting matter. |
| UNDP/OPHI Global MPI 2026 | Acute deprivations across **health, education and living standards** through ten household indicators; the 2026 statistical update covers **108 countries**. | Recognises jointly experienced non-monetary deprivation and subgroup gaps. | Global MPI needs relevant household microdata, has its own weights and eligibility definitions and is not designed to estimate individual programme causal effects by itself. Do not reuse its weights for HPI. |
| OECD Well-being Framework / How's Life? | **11 dimensions of current well-being**, together with future well-being resources, inequality and deprivation perspectives. | Expands the lens to job quality, safety, social connections, autonomy-related outcomes and environmental sustainability. | OECD national dashboard indicators are contextual benchmarks, not an HPI-validated causal impact score or necessarily available for every prospective study community. |
| Local official or community-informed outcomes | Intervention- and context-specific measurements that can be collected lawfully and reliably. | Captures what affected people consider meaningful and what a plausible intervention can change. | Measure definitions, consent, cultural adaptation, accessibility and local data quality must be reviewed before use. |

Verified methodological starting points: [World Bank June 2025 poverty lines](https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines); [UNDP Global MPI 2026](https://hdr.undp.org/content/2026-global-multidimensional-poverty-index); [MPI 2026 FAQs](https://hdr.undp.org/mpi-2026-faqs); [OECD Well-being data explorer](https://data-explorer.oecd.org/vis?df%5Bag%5D=OECD.WISE.WDP&df%5Bds%5D=dsDisseminateFinalDMZ&df%5Bid%5D=DSD_HSL%40DF_HSL_CWB&dq=.2_3.._T._T._T.&pd=2020%2C&to%5BTIME_PERIOD%5D=false); [OECD subjective well-being guidelines (2025)](https://www.oecd.org/en/publications/oecd-guidelines-on-measuring-subjective-well-being-2025-update_9203632a-en.html).

## Working dimensions and measurable hypotheses

**D1 — Economic security and resilience.** Relevant outcomes may include real household resources, income volatility, financial shocks and the ability to meet an unexpected essential expense. Compare within a locally justified reference system; do not conflate higher nominal income with higher purchasing power.

**D2 — Adequate essentials and access.** Examine confirmed lawful benefit *receipt* (not just application), energy and housing cost burden, food insecurity, safe water or other critical local services. For benefit programmes, an increase in completed applications is a process measure, while confirmed receipt over a specified period can be an outcome.

**D3 — Health and learning.** Use validated, age-appropriate and jurisdictionally appropriate measures of health, access to care, school attendance or achieved learning when relevant. Diagnoses and medical records require a distinct high-sensitivity data/ethics plan and should not be collected merely to fill a dashboard.

**D4 — Economic and social opportunity.** Consider sustained real earnings, employment stability, decent working conditions, access to productive opportunities and barriers to inclusion. Training signups are participation counts, not demonstrated livelihood improvement.

**D5 — Autonomy, safety and sustainability.** Consider freely expressed decision-making ability, safety, freedom from coercion, and resource impacts on future generations. Subjective instruments require linguistic/cultural validation; environmental costs must be tracked without automatically treating them as equivalent to income gains.

These categories overlap. **Never add all measures together to imply independent gains**: a benefit payment may change income, consumption and perceived security simultaneously.

## Candidate outcomes for the three F0-02 pathways

The [candidate indicator registry](outcomes-candidate-registry.csv) gives research questions, units, possible data-collection methods and cautions. Its designation `candidate_primary` means a **possible** primary outcome for a future study, not one that HPI has selected or pre-registered.

| F0-02 candidate pathway | Possible primary endpoint | Critical secondary endpoints / checks | Never substitute |
| --- | --- | --- | --- |
| A — Benefit and service take-up | **Confirmed receipt** of a precisely defined eligible benefit, with eligibility and observation window verified through lawful procedures. | Time to receipt, total transfers received, administrative burden, retention, exclusion, erroneous advice or loss of support. | Website visitors, messages sent, applications started or claim approvals with no evidence of actual receipt. |
| B — Essential-cost affordability | Change in essential cost burden using a context-defined and price-adjusted measure; assess household conditions as well. | Thermal comfort, housing quality, health, carbon impact, provider and household costs, unintended rebound or rent effects. | Number of subsidies created or retrofits installed without household-level outcomes. |
| C — Economic opportunity | Sustained **real** earnings or employment quality at a prespecified follow-up, compared with an appropriate control. | Earnings variability, job retention, working conditions, displacement, household resilience, programme costs. | Course enrolments, training hours, job-placement promises or transient earnings changes. |

## Minimum study measurement contract (before data collection)

1. **Select one primary endpoint per study** (or explicitly justified co-primary endpoints with multiplicity control) tied to a falsifiable theory of change, target population and policy decision. Specify numerator, denominator, units, baseline, observation window, comparators and expected direction.
2. **Predefine analysis**: attribution strategy, confounders, eligibility, sample-size/power assumptions, treatment of missing values, attrition, clustering, spillovers, and any planned subgroup analyses. Where appropriate, publicly register the protocol before examining outcomes.
3. **Report both reach and demonstrated benefit**, separately: invitations, contacted people, eligible people, enrolled participants and individuals experiencing an outcome change are different denominators.
4. **Protect equity and dignity**: consider subgroup differences by context-appropriate characteristics only when lawfully collected with risk safeguards. Suppress potentially identifying small cells, evaluate language/disability/digital inclusion and record burdens imposed on nonparticipants.
5. **Account for cost and possible harm**: delivery and participant time/cost, adverse events, displacement of services/jobs, environmental burden and opportunity costs. No invented cost-effectiveness ratio before measured costs and outcomes.
6. **Establish duration**: primary and follow-up measurement windows (e.g. baseline, post-intervention, longer-run), chosen from a causal theory rather than reused automatically across programmes.
7. **Community and independent review**: measurement priorities must be challenged by people with relevant lived experience and qualified researchers, using appropriate consent and independent protections. No sensitive data or recruitment before legal, partner and ethics gates.
8. **Publish reproducible interpretation**: source definitions, a clean de-identified methods summary where lawful, uncertainty intervals, negative/null results, limitations and transferability boundaries; do not release private household records.

## Data architecture and governance

- `research/outcomes-candidate-registry.csv` is **public metadata**: no person records, respondent identifiers, dates of birth or household microdata. Published automatically by the HPI website.
- **HPI GitHub** remains the primary source of definitions, version decisions and registered outcomes. **Neon HPI** may eventually support reviewed research metadata, not sensitive respondent data by default.
- HubOS records tasks and risk decisions; SolOS can assist with approved public-source analyses. Neither system gains permission to collect participant information or conduct field experiments by virtue of this framework.
- Upstream OECD/UNDP/World Bank data use, reuse licences and attribution must be reviewed before copying or transforming third-party datasets. Only original definitions and links are included here.

## Open methodological questions / acceptance for F0-03

- [ ] Independent review of selected frameworks, local transferability and strengths/limitations.
- [ ] Community consultation on dimensions and outcomes using a safely designed process.
- [ ] Agree an explicit primary outcome, comparator and time horizon **after** an F0-02 problem is selected.
- [ ] Validate or replace measurement instruments and confirm legal access to any administrative datasets.
- [ ] Define a reporting template for negative impacts, distributional consequences and cost-effectiveness.
- [ ] Revise to framework **v1.0 only after documented review**, not because this draft was published.

**Current verdict:** The measurement architecture is a draft menu of possible outcomes. No validated composite index, real-world improvement, intervention efficacy, cost-effectiveness or participant data collection has been established.
