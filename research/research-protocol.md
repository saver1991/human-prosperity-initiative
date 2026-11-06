# F0-02.1 — Reproducible evidence search and screening protocol (desk review V1.0)

**Version/date:** 1.0 / 6 November 2026. **Scope:** public-source, AI-assisted *rapid evidence mapping* for HPI F0-02. This is a fully specified **desk-search workflow**, **not** a registered or completed systematic review. A qualified independent research team must approve any future protocol registration, full-text risk-of-bias grades, GRADE assessment, or primary research.

## Questions, domains and primary outcomes
For materially deprived or economically insecure people and households, which evaluated interventions (A) increase **verified successful benefit/service receipt**, (B) improve **realised affordability and access to essential household energy/housing needs**, or (C) improve **durable real earnings, job quality or resilience** relative to an explicit comparator? Record effects, costs, harms, who benefits and external validity. No preselection of a winning country or programme.

| Domain | Population | Included interventions | Preferred primary outcomes | Proxies not interchangeable |
|---|---|---|---|---|
| benefit_access | Income-eligible or likely-eligible nonparticipants, disadvantaged claimants | Outreach; reminders; applications help; simplification; enrolment process | Official approval; actual receipt; sustained retention and net financial gain | Website clicks, expressed interest, applications, referrals |
| essential_costs | Households with high essential energy/housing burden, underheating or financial insecurity | Social tariffs; targeted assistance; retrofit; home energy coaching | Real bills as share of disposable income; sufficient warmth/comfort; health and debt | Modelled kWh, programme take-up, policy counts, carbon savings alone |
| economic_opportunity | Low-income workers, jobseekers and livelihood-constrained households | Skills; jobs matching; wage subsidies; productive grants; entrepreneurship and graduation | Real income/earnings, job stability/quality, poverty and consumption after intervention | Training enrolment, business registrations, assets without consumption |

## Eligibility (PICOS) and separate evidence lanes
- **Population:** Directly eligible low-income/economically vulnerable people, or a clearly relevant subgroup; context and eligibility definition extracted without assuming generalisability.
- **Intervention:** A/B/C above. Exclude interventions unrelated to household economic security or where outcome cannot be linked to the study population; log uncertain cases as 'pending', not silently exclude.
- **Comparator:** RCT control/usual services, matched comparison or credible RD/DiD/ITS counterfactual for **causal lane**. A systematic review of these is an **evidence synthesis lane**. Descriptive policy reports and correlational/qualitative research remain in a distinct **context lane**, not counted as causal proof.
- **Outcomes:** report exact measured endpoint, numerical effect **and units**, uncertainty interval/p-value when in checked source, follow-up and costs. Use 'not reported in checked abstract' instead of inventing values.
- **Study design:** RCTs; defensible natural/quasi-experiments; rigorous systematic reviews/meta-analyses. Include null/negative studies and follow-up papers, labeling shared experiments so they are not counted as independent replications.
- **Date:** no arbitrary lower publication cutoff; include studies available by **2026-11-06**, record publication and version date. **Languages:** English and Italian for desk verification; record language bias and translation needs. **Geography:** global; do not transfer impact estimates across jurisdictions without assessing institutions and population. **Material:** public article abstracts/publisher records and institutional primary summaries; use lawful accessible full text only, never claim full-text verification if not performed.

## Source-specific repeatable searches
Search in this order, recording **actual execution** versus planned sources:
1. Public indexed web, targeting original publisher/DOI, J-PAL/IPA/NBER/World Bank/3ie/IEA, and qualified research-institution repositories. Use these exact portable queries with the chosen date and quotation marks preserved; refine by domain and source if necessary and log each refinement.
2. 3ie Development Evidence Portal; J-PAL evaluations; World Bank Open Knowledge/Research; Cochrane/Campbell for applicable reviews; OECD/IEA for relevant economic and energy outcomes; publication indexes (Crossref/Scholar) and trial registries where accessible.
3. Citation chasing (backward references and forward citations), with a separate dated log row and link to parent study.

**Canonical seed queries for public indexed web and metadata databases** (transcribe into the provider's supported search syntax; never describe an unexecuted provider search as complete):

| Domain | Query IDs / exact seed expressions |
|---|---|
| benefit_access | A1: `"benefit take-up" randomized experiment applications receipt`; A2: `"SNAP" administrative burden randomized enrollment`; A3: `"tax credit" nudges experiment take-up null`; A4: `"minimum income" benefit outreach trial approvals`; A5: `"health insurance" enrollment intervention systematic review` |
| essential_costs | B1: `"fuel poverty" intervention systematic review health comfort`; B2: `"weatherization" experimental evaluation energy savings costs`; B3: `"social electricity tariff" regression discontinuity affordability`; B4: `"electricity" subsidy difference in differences energy poverty`; B5: `"energy coaching" quasi experiment household bills comfort` |
| economic_opportunity | C1: `"graduation programme" randomized trial consumption earnings`; C2: `"vocational training" experiment youth employment Uganda`; C3: `"microenterprise" cash grant randomized Uganda earnings`; C4: `"apprenticeship" field experiment Ghana earnings`; C5: `"active labor market" systematic review developing countries` |

The dated executed-query log is [search-log-2026-11-06.csv](search-log-2026-11-06.csv) (and [5 November pilot log](search-log-2026-11-05.csv)); provider, query, filters, records examined and source decisions can be reconstructed. Search hits/exports **unknown** where providers did not expose counts, rather than fabricated as zero. This is purposive citation tracing, not exhaustive retrieval. The 15 canonical queries are specified **for replication**; actual queries run and variations appear in the execution log. Coverage of 3ie/Cochrane/Scholar/registries is a later formal-review task unless a row attests execution.

## Screening, deduplication and PRISMA readiness
1. Record every search session using `date_utc,domain,provider,search_query,filters,reported_hits,records_exported,searcher,notes`; record unavailable counts as blank. Record study DOI (normalise lowercase and remove URL prefix) or stable primary URL.
2. Deduplicate by DOI, then by title/authors/year. Retain *review versus primary study*, *working paper versus published version* and *later follow-up of the same trial* links; avoid counting these as independent causal experiments.
3. Screen titles/abstracts against PICOS; inclusion tags `causal-primary`, `causal-synthesis`, `context-only`, `uncertain`, `excluded`. Explicit exclusion reasons: wrong population/intervention/outcome; no comparator for causal lane; duplicate version; inaccessible verification; publication after search cutoff. Record language and access limitations.
4. Read publisher abstracts/institutional summaries first; extract only what is supported in the accessed material. Record the **researcher type and access depth** (AI-assisted abstract/summary versus full-text reviewed).
5. If commissioned as a *formal systematic review*, freeze a registered protocol (e.g. OSF/PROSPERO only where actually eligible), have **two independent human screeners**, resolve disagreements with an adjudicator, archive lawful search exports, track PRISMA 2020 flow and run design-specific methods. **None of this has happened in V1.0.**

## Data extraction and appraisal
Populate [extraction-template.csv](extraction-template.csv) with source, DOI/URL, year, country, population, intervention/comparator, design, outcome, exact estimate/CI/period, costs, harms, risk-of-bias, transferability, reviewer and evidence gap. For the 6 November rapid map use [F0-02-structured-evidence-2026-11-06.csv](F0-02-structured-evidence-2026-11-06.csv), which records an *abstract-level preliminary limitation flag*, NOT a formal RoB score. Save URLs to primary sources; never republish copyrighted text.

For subsequent independent full-text screening use **RoB 2** for randomised studies, **ROBINS-I** for nonrandomised causal estimates, **AMSTAR 2/ROBIS** where appropriate for reviews, and GRADE only after outcome-by-outcome assessment. Check selective reporting, baseline balance, attrition, interference/spillovers, power, measurement, funding and durability. Separate **positive, null, mixed and adverse** results; report CIs and precise baseline where available; avoid cross-domain meta-analysis or unlicensed effect-size averaging.

## Quality checks and guardrails
- Every included record must have source URL, year, domain, design, population, endpoint, finding, limitation, and an honest evidence-depth note; flag unknown cost/CI/follow-up.
- Summarise **causal vs descriptive** evidence separately; do not treat reviews and their component studies as independent evidence counts. Avoid counting multi-country sites as separate publications.
- Extraction and evidence ledger are a **nonexhaustive purposive catalogue**; 10 entries per area do not constitute methodological saturation or proof of generalisability.
- Missing data, contradictions, programme ineligibility, nonparticipants' harms, cost displacement and possible digital exclusion should appear in any synthesis.
- Never contact at-risk populations, access administrative case files, recommend eligibility determinations, claim partner participation, announce a pilot or select a territory during F0-02.1/02.2.
- F0-02.3 geography/population shortlisting, F0-02.4 community consultation, F0-02.5 scoring and F0-05 pilot design **remain separate approval and ethics gates**.

## Status and handoff
**F0-02.1 desk protocol delivered**: an executable source/query/screen/extract/deduplication protocol and audit templates, with dated example executions. **Not delivered**: exhaustively completed bibliographic search, independent screening, formal study-quality ratings, registration or meta-analysis. These are distinct prerequisites if HPI commissions a formal review. This document is intentionally auditable rather than claiming systematic-review certification.
