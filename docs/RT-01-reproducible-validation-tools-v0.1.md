# RT-01 — Reproducible research validation tools V0.1

**Status:** provisional public-source tooling MVP, **not** an approved scientific instrument, independently reviewed study or deployment of an autonomous evaluation agent. **Date:** 6 November 2026.

## Purpose

Provide actual reusable, dependency-free **Node.js research instruments** alongside HPI's public papers and roadmap. These tools should make HPI's evidence quality limits visible, make calculations repeatable and prevent accidental causal-impact claims.

## V0.1 modules

| Module | Command / import | What is measured | What is **not** measured |
|---|---|---|---|
| Evidence metadata provenance — `research-tools/evidence-provenance.mjs` | `auditEvidenceMetadata(csvText)` | Public ledger record count, SHA-256 of exactly supplied source, domain/source categories, duplicate public URLs, missing limitations and source integrity | Whether referenced studies are genuine, unbiased, independently assessed or causal |
| Structured evidence family audit — `research-tools/structured-evidence.mjs` | `auditStructuredEvidence(csvText)` | Source family labels, overlap, 10/12/12 evidence domains, abstract-only extraction depth and missing formal bias review | Proof that 34 records are 34 independent experiments, externally reviewed papers or validated causal outcomes |
| Outcome aggregate comparison — `research-tools/aggregate-outcomes.mjs` | `compareAggregateOutcomes({sourceType,control,comparison,...})` | Aggregate observed denominator, receipt rate, percentage-point difference, follow-up attrition and zero-rate-safe relative ratio | Randomisation, confounding adjustment, participant eligibility, generalisability, statistical uncertainty or causal effects |
| Offline reproducibility CLI — `scripts/rt01-repro-check.mjs` | `node scripts/rt01-repro-check.mjs` | Current source SHA256 and a clearly **synthetic** example of 6% vs 11% observed receipt | Real participant results, policy effectiveness or independent scientific endorsement |

No external API calls, commercial products, tokens, new Neon read roles, personal records or unlicensed paper copies are needed. **Public evidence metadata is not proof that data sources may legally be redistributed**. Never upload participant-linked data or financial hardship stories to HPI GitHub.

## Reproducible protocol

1. Pin a Git commit, source CSV version and Node.js major version.
2. Run `npm test` (new automated security/methodology fixtures).
3. Run `npm run research:verify` from the repository root; the JSON output is deterministic from a fixed source file and synthetic fixture, apart from normal formatting.
4. For comparisons, specify `sourceType: "synthetic"` or `"public_aggregate"`; the module refuses unknown fields such as person identifiers. The output is **descriptive only** and explicitly reports that causal inference is **NOT_SUPPORTED**.
5. For any real dataset, independently establish rights, suppression thresholds, permitted aggregation, denominators, comparators, missingness and science review first. The current module is not a safe personal-data parser and is **not** intended for private rows.

The sample illustration is **not from an HPI field experiment**: one hundred fictional eligible records per arm with six observed receipts in the baseline and eleven in the comparison. The observed difference is five percentage points and by itself **does not prove an intervention caused any change**.

## Scope and quality boundaries

- The current source auditor checks syntactic provenance, not independent DOI resolution, copyright licensing, paper full texts or risk of bias. These remain F0-02/F0-03 research gates.
- Percentage-point differences are among **observed** records; group selection and differential loss to follow-up may change the meaning. No 95% confidence intervals are reported because no defensible estimator/covariates/design have been selected.
- An aggregate module accepts only counts and a few short labels; this is not adequate for treatment-effect claims or welfare entitlement decisions. Real-world use would need qualified statistical review and safeguards.
- RT-01.1 through RT-01.4 still require broader dataset adapters, external source validation, licensing/rights review, accessibility assessment and independent methodology review.
- F0-04 institutional readiness remains P0. **WEB-01's Vercel release hold, actual cost alerts and human screen-reader acceptance remain independent unresolved gates**, even if these CLI modules and browser tests pass.

## Subsequent V1.0 tools

The original offline V0.1 prototype has now been extended by [RT-01.1 source catalogue V1](RT-01-1-source-catalog-method-v1.md), including first-party source/rights metadata and SHA-pinned safe dataset handling, and [RT-01.2 outcomes V1](RT-01-2-outcome-evaluation-method-v1.md), including conditional Wilson/Newcombe uncertainty and a hypothetical browser simulation. These technical extensions do **not** retrofit causal validity or license/ethics approvals into the original evidence map.

The current toolchain also includes [RT-01.3 reproducible open science V1.0](RT-01-3-reproducible-open-science-v1.md): a deterministic content-addressed public report, cited source metadata, data dictionary, append-only corrections and the same-commit CircleCI artifact archive. All outputs are technical/synthetic until independent research review.

## Next tool milestones

- Add a **source-license ledger**, explicit retrieval date and study-family duplicate metadata with schema provenance before presenting source data as reusable.
- Add independently justified uncertainty estimation and explicit model validation before any statistical study claim; no arbitrary confidence intervals.
- Extend to accessible, low-bandwidth on-site public read-only views only after user feedback and scope review.
- Preserve open-source licensing and paper copyright permissions, using the existing GitHub source and CircleCI test harness.

**Status decision:** development of a limited research **tool MVP** is real technical progress, but **RT-01 is not completed** and real-world prosperity remains unmeasured.
