# RT-02.6 — Prosperity Data Explorer: feasibility and explicit NO-GO decision V0.1

**Date:** 12 November 2026. **Status:** desk discovery delivered; build **NO-GO** pending licensing, comparable metrics and evidence of user demand. No new provider, ingestion, personal data, outreach or paid service was authorised.

## Product hypothesis
Could an international public-aggregate explorer improve understanding of poverty, receipt and access to opportunity without implying that inconsistent datasets measure the same population or outcomes?

**Candidate users (hypotheses, not user research):** (a) policy analysts comparing published definitions, (b) independent researchers auditing assumptions, (c) community organisations seeking responsible aggregate context. These have not yet been tested with real users.

## Source/rights shortlist — public entry points, not approved feeds

| Candidate | Geography/unit | Source | Known published reuse signal | Unresolved gate |
| --- | --- | --- | --- | --- |
| DWP ad hoc Pension Credit 2023/24 tables | UK local-authority modelled household receipt, NOT national survey take-up | [DWP ad hoc release](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024/analysis-of-households-potentially-eligible-for-pension-credit-and-eligible-households-in-receipt-of-pension-credit-2023-to-2024) | Publicly published official tables; HPI already tested source-specific Newham extraction | Confirm per-table licence and update policy, exact version/hash, caveats for savings/housing-cost omissions; may not be comparable to national survey |
| DWP national take-up series FYE2024 | GB benefit units/families, survey-based national estimate | [Official DWP take-up release](https://www.gov.uk/government/statistics/income-related-benefits-estimates-of-take-up-financial-year-ending-2024/income-related-benefits-estimates-of-take-up-financial-year-ending-2024) | Official publication; defines caseload and expenditure rates separately | **Do not combine** its 62% GB national caseload with Newham's local modelled 78% household receipt as the same metric |
| ONS open statistics | UK geographies, multiple indicator definitions | [ONS licences](https://www.ons.gov.uk/methodology/geography/licences/) | OGL reuse often available with attribution | Specific data/underlying map geometry may carry third-party rights; audit each asset and its geography/version |
| World Bank PIP poverty/equity catalogue | Country-level welfare/poverty series | [World Bank Poverty & Equity dataset](https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform) | Data catalogue identifies public classification and CC BY 4.0 | Verify API terms, indicator/year comparability, methodology changes and country coverage before any automated collection |

## Decision gate
- **NO-GO BUILD** now. The existing public research catalogue and Newham source dossier offer a safer baseline than an unsupported international comparison.
- Product value: seek independent **voluntary**, safeguarded feedback from qualified users only when a staffed private feedback mechanism and appropriate institutional policy exist; do not recruit participants in the current HPI project.
- Data rights: per-file licence, attribution, API policy, timestamps, reproducible source hash, withdrawal mechanism and third-party rights, reviewed by a qualified person before ingestion.
- Measurement: record country, geography type, denominator, period, household/person/benefit-unit distinctions, survey vs administrative method, uncertainty and missingness; disallow misleading pooled scores.
- Privacy: only suitably licensed **public aggregate** data, no individuals, small-cell or linkage exposures, and independent privacy gate.
- Budget: target existing GitHub + CircleCI + Vercel static infrastructure, no extra paid APIs. Actual build/request, storage, delivery and review cost remains **unestimated** until the source sample and update frequency are fixed.
- Launch: conditional after documented real user purpose, source licences, methodology crosswalk, external science/ethics where relevant, accessible design and full CI/browser checks.

**No implementation of a real-data explorer is authorised by this desk decision.** This is a legitimate completed discovery decision with an outstanding future build gate, not evidence of a working international data product.
