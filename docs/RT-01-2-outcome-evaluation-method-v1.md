# RT-01.2 — Reproducible outcomes, uncertainty and synthetic simulations V1.0

**Status:** technical methods toolkit, scoped to bounded public aggregates and fictional examples. **NOT** a validated human-prosperity outcome instrument, a causal estimator, a policy recommendation or an eligible-benefits decision engine.

## Delivered research instruments

- [HPI synthetic outcomes lab](https://human-prosperity-initiative.vercel.app/research/outcome-lab) — accessible browser calculator. Visitors can edit fictional eligible/receipt/missing counts in two groups, receive observed rates, the **descriptive** difference, conditional interval and missingness bounds. Nothing is transmitted to the server.
- `research-tools/outcome-evaluation.mjs` — reusable, dependency-free and safe in a browser or Node.js.
- `research-tools/indicator-contract.mjs` — binds any candidate measure to the **15 public F0-03 V0.1 indicators**; unsupported units and anything described as independently approved are rejected.
- `research/synthetic-outcome-scenario-v1.json` — versioned, completely **fictional** counts plus baseline, harms, local currency cost units and equity strata.
- `scripts/rt01-outcome-check.mjs` and `npm run research:evaluate` — offline, deterministic JSON report containing source SHA-256, two-group comparison and a fixed-seed fictional simulation.
- Playwright + CircleCI regression tests include zero, negative and missing outcomes, adverse harms, costs, data-leak protection, smaller public aggregate cells and repeated simulation seeds.

## Data contract

```json
{
  "scenarioId":"SYNTHETIC_EXAMPLE",
  "sourceType":"synthetic",
  "indicatorId":"HPI-B-01",
  "timeframe":"Illustrative nine-month follow-up",
  "currency":"GBP",
  "independentBinomialAssumption":true,
  "reference":{"eligible":100,"received":6,"missingFollowup":0,"harmsReported":2,"costMinorUnits":4000},
  "comparison":{"eligible":100,"received":11,"missingFollowup":0,"harmsReported":1,"costMinorUnits":6000}
}
```

`baseline` and one **mutually exclusive, reconciled partition** of `strata` may be provided to each arm; differences in strata are also descriptive. Cost minor units are explicitly denominated by the source local currency code; no fake PPP or FX conversion and **no causal cost-effectiveness conclusion** are generated. Small published-aggregate cells are rejected by conservative defaults but suppression thresholds must be re-evaluated with legitimate data controllers for each jurisdiction.

## Calculations and methodological assumptions

1. **Observed receipt**: successful receipt ÷ participants observed in that group's follow-up. This is different from the number initially eligible because missing follow-up is reported separately.
2. **Difference in percentage points**: `100 × (comparison observed rate − reference observed rate)`; observed data do not imply the groups are exchangeable.
3. **Missingness sensitivity**: for each arm, lower = receipts/eligible; upper = (receipts + missing follow-up)/eligible. The difference range compares the most adverse and most favourable combinations of these bounds; it is **not a statistical confidence interval**.
4. **Optional 95% Wilson score intervals** for individual observed binary proportions. **Newcombe-Wilson** combines these to produce a conditional interval for the observed proportion difference. They are reported **only when an explicit independent-binomial assumption is provided**. Even then, the code does not independently verify sampling, clustering, random assignment or stable eligibility, and therefore the intervals do not account for selection bias, policy effects, complex surveys or harms. References: [UK Public Health Data Science technical guidance](https://fingertips.phe.org.uk/static-reports/public-health-technical-guidance/Basic_statistics/Proportions.html) and [Newcombe, 1998 — independent proportions](https://pubmed.ncbi.nlm.nih.gov/9595617/).
5. **Synthetic seeded Monte Carlo** generates fictional missingness and receipts from fixed input probabilities. Its percentile range depicts the output variation of that **hypothetical model**, **not** a 95% confidence interval for real-world programme effects.
6. **Harms, costs and equity** are carried into the report, never treated as residual noise or proof of net beneficial impact. A negative outcome is not filtered out.

## How to reproduce

```sh
npm run check
npm run research:verify
npm run research:evaluate
```

The browser demonstration imports the **same pure calculation module** used by Node.js tests and does not use a separate, drifting formula. The output JSON includes a report of source hashes. `npm run check` remains under CircleCI website-quality, and Playwright Chromium/axe checks the interactive page on supported viewports. No independent screen-reader operator has signed off WEB-01.

## What remains outside this delivery

- The independent scientific F0-03.1 methodological appraisal of outcome definitions, causal study identification and suitable sample/error designs.
- Any human participant recruitment, official benefit-award data access, linkage/consent, privacy disclosure approval, real funds or actual pilot.
- Unsupported inferential methods: cluster/survey design variance, causal identification, real cost-benefit outcomes, unobserved confounding sensitivity and preregistration.
- A numerically estimated confidence interval **cannot** replace those requirements. A source licence and the authenticity of public aggregate inputs must be established upstream through RT-01.1 before legitimate reuse.

**RT-01.2 acceptance applies to its four research-safe technical development tasks only.** Research and social-impact validity remain independently pending.
