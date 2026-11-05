# F0-02 Research Evidence Protocol — version 0.2

**Date:** 5 November 2026. **Status:** Draft structured search and screening plan. Not preregistered, not yet applied exhaustively, and **not** a completed systematic review. Confirm dates, access and reviewer team before starting formal screening.

## Research objective

For people experiencing poverty or economic insecurity, what rigorous evidence exists that interventions improve (A) receipt of eligible benefits or essential services, (B) affordability and lived conditions associated with essential costs, or (C) durable earnings and economic opportunities? Which groups benefit, at what cost, with what adverse consequences and in which settings?

The objective is **mapping evidence and gaps**, not assuming a preferred intervention or claiming causality from a descriptive review.

## Eligibility and extraction — PICOS

- **Population:** Individuals or households facing material deprivation, low income, vulnerability to shocks or exclusion from essential services. Record original study eligibility and demographic restrictions; do not generalise to entire populations.
- **Interventions:** (A) administrative simplification, outreach, navigation, reminders or benefit eligibility support; (B) energy-cost assistance, housing affordability and energy efficiency; (C) economic inclusion, employment services, skills, livelihood support and direct economic opportunity.
- **Comparators:** control, usual practice, alternate intervention or defensible quasi-experimental counterfactual. Descriptive reports without comparators may enter background contextual evidence but **not** the causal impact evidence section.
- **Outcomes:** distinguish forms started from confirmed successful benefit receipt; energy programme participation from affordability, thermal comfort and wellbeing; training participation from employment, earnings and quality of work. Record outcome units, measurement period, cost and possible adverse/displacement effects.
- **Study designs:** systematic reviews; meta-analyses; randomised evaluations; credible difference-in-differences, regression discontinuity, interrupted time series or other well-justified designs. Keep qualitative and administrative studies in a separate contextual stream.

## Search sources and search expressions

Sources to search: [3ie Development Evidence Portal](https://developmentevidence.3ieimpact.org/), [J-PAL](https://www.povertyactionlab.org/), World Bank Research, [UNDP](https://hdr.undp.org/), [OECD](https://www.oecd.org/), [IEA](https://www.iea.org/), relevant trial registries, Google Scholar or scholarly databases when access is lawful, reference lists and relevant grey literature. Do not claim that sources were searched unless the actual query and date appear in the log.

Example seed expressions (adapt syntax to each provider and document adapted form in the log):

**A. Benefit receipt:**
- ("benefit take-up" OR "benefit non-take-up" OR "welfare take up") AND (randomized OR experiment OR evaluation)
- ("administrative burden" OR "simplification") AND (social protection OR benefits) AND (impact OR receipt)
- ("application assistance" OR "benefit navigation") AND (benefit receipt OR coverage)

**B. Essential costs:**
- ("energy poverty" OR "fuel poverty") AND (subsidy OR "energy efficiency" OR retrofit) AND (evaluation OR trial)
- ("housing affordability" OR "rent burden") AND (policy OR assistance) AND (impact evaluation)
- ("thermal comfort" OR "energy burden") AND (randomized OR quasi-experimental)

**C. Economic opportunity:**
- ("economic inclusion" OR "graduation programme") AND (randomized OR "impact evaluation")
- ("employment services" OR "skills training") AND (earnings OR employment) AND (evaluation)
- (livelihoods OR "income generation") AND (causal OR experimental) AND poverty

Dates: **no arbitrary exclusion by publication date** during preliminary mapping; record year, recency and relevance. Languages: English and Italian initially because those can currently be assessed reliably; translations in other languages are welcome with source-language verification. Record resulting language and database coverage bias. Country scope: worldwide, but document limits of cross-country transferability.

## Search log and screening reproducibility

Use [search-log-template.csv](search-log-template.csv) as the audit trail; one row per query per source, timestamp UTC, raw query, filters, hits reported, exported count, screen decision and operator. Capture DOI/URL, source record identifiers and duplications; for inaccessible full texts, record reason. Preserve saved search exports only if licences permit.

For formal reviews, establish two independent screeners and adjudication rules; record title/abstract and full-text exclusion reasons, study flow and how disagreements were resolved. Follow [PRISMA 2020](https://www.prisma-statement.org/prisma-2020) reporting guidance if a systematic review is commissioned; an evidence gap map is **not automatically** a policy recommendation ([3ie methods](https://www.3ieimpact.org/evidence-hub/evidence-gap-maps)).

## Evidence quality and synthesis

Use a suitable risk-of-bias process by design, e.g., Cochrane RoB 2 for randomised studies and ROBINS-I for non-randomised intervention studies, with trained reviewers and transparent judgements. Predefine relevant confounders. Record study population, outcome estimate and uncertainty, follow-up, costs, conflicts of interest, potential harms and external validity. Separate the number of people reached from demonstrated participant benefit.

Do not calculate pooled effects across incomparable interventions. Narrative synthesis must describe disagreements, missing evidence and study limitations. The initial [evidence ledger](evidence-ledger.csv) is a source inventory, not a quality-assessed dataset; use [extraction-template.csv](extraction-template.csv) only after formal screening.

## Quality gates and open questions

- [ ] Agree precise question and eligible target settings.
- [ ] Record reproducible searches in all selected sources.
- [ ] Screen all results using independent checks where available.
- [ ] Complete study-quality ratings and evidence strength statements.
- [ ] Consult independent experts and representatives of affected communities via ethical, consent-based processes.
- [ ] Confirm lawful data access, safeguarding and partner feasibility **before** proposing a real-world pilot.

**Outcome of this version:** a runnable search protocol and open templates, not a completed evidence review or evidence-backed ranking of the three domains.
