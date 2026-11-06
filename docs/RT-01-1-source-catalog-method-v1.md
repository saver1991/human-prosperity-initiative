# RT-01.1 — Public-source catalogue, rights and provenance V1.0

**Delivery scope:** technical acceptance of RT-01.1. This is an **open metadata and source-normalisation tool**, not independent scientific review, access to all source datasets, permission to redistribute third-party tables, a new person-level database or a licence opinion.

## Outputs

- [First-party, searchable source catalogue](https://human-prosperity-initiative.vercel.app/research/source-catalog) — accessible text search and source type filter, no analytics or accounts.
- [JSON metadata export](https://human-prosperity-initiative.vercel.app/research-source-catalog.json) and [CSV metadata export](https://human-prosperity-initiative.vercel.app/research-source-catalog.csv). Both automatically regenerate with the public GitHub source revision; the catalogue includes SHA-256 of the original public ledgers.
- `research/public-dataset-registry.json` — a curated *candidate index* for the World Bank PIP, UNDP MPI 2026 and DWP local-authority Pension Credit publication. **No dataset payloads are included.**
- `research-tools/source-catalog.mjs` — strict registry validation, DOI extraction from existing primary DOI links, descriptive metadata search, safe CSV export, sorted deterministic record generation and a pin-checked generic aggregate CSV adapter.
- Existing `research/evidence-ledger.csv` and `research/F0-02-structured-evidence-2026-11-06.csv` remain the scientific source inputs: catalogue creation does not add new studies, resolve DOIs, assess bias or independently check external data.

The generated catalogue contains **39 existing public research references** and **3 curated public-dataset candidates**. The structured review still has **34 abstract/summary-level records**, not 34 necessarily independent experiments. External live-source verification, licensing and retraction status must remain distinct from published metadata.

## Source and licence policy

A source may be **listed as metadata** before its data licence or latest version is independently confirmed; being referenced does *not* establish permission to download, republish or analyse its data. States are explicit:

| Property | Meaning |
|---|---|
| `licenseStatus` | `verified_cc_by_4_0`, `unknown` or `restricted`; a verified claim requires a publisher link |
| `rightsReviewStatus` | `not_reviewed`, `metadata_review_only`, or `approved_for_aggregate_processing` |
| `retrievedAt` | Null until an actual dated source-file retrieval has happened |
| `expectedDataSha256` | Null until actual bytes have been legally retrieved, reviewed and pinned |
| `retraction` | `not_checked`, `retracted`, `disputed`, `confirmed_current`; unknown must not appear as verified |
| `dataIngested` | Always false for catalogue entries in the current release |

The World Bank official PIP data-catalogue page identifies the dataset as CC BY 4.0; this **does not** mean we have copied its contents or reviewed every derivative-use condition. UNDP MPI and DWP licence permissions are unverified here and intentionally labelled `unknown`. HPI must separately check table-level permissions, source method, provenance and retraction before importing and redistributing anything.

Official source pages: [World Bank PIP](https://datacatalog.worldbank.org/search/dataset/0038020/poverty-and-equity-database-poverty-and-inequality-platform), [UNDP MPI 2026](https://hdr.undp.org/content/2026-global-multidimensional-poverty-index), [DWP Pension Credit local-authority analysis](https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024/analysis-of-households-potentially-eligible-for-pension-credit-and-eligible-households-in-receipt-of-pension-credit-2023-to-2024).

## Ingestion and normalisation contract (safe by default)

`ingestPinnedAggregateCsv()` accepts a bounded, **HPI-normalised** four-field aggregate file:
```csv
geography,period,numerator,denominator
Example Region,2025,6,100
Another Region,2025,,
```

The only currently accepted example ingestion uses `sourceKind:"synthetic_fixture"` and `sourceId:"SYNTHETIC-TEST-FIXTURE"`, with its **exact content SHA-256** passed in. This is a contract fixture, not a claimed real World Bank or DWP API adapter. For actual `public_aggregate` data, the tool **fails closed** until an individually documented record contains human-reviewed rights permission, a verified current status, actual retrieval date and exact approved SHA. It rejects personally identifying columns, invalid/small public cells, unsafe identifiers, contradictory duplicate rows and unpinned or silently modified bytes.

No automated crawling, external API request, credentials, participant data, copyrighted full texts, personal welfare entitlements or downstream policy decisions are part of this release.

## Scientific and accessibility limitations

Data quality is not inferred from a source URL, publisher brand, DOI format, a successful HTTPS response or a raw correlation. The HPI research ledgers remain abstract-level and need independent full-text review and risk-of-bias appraisal. Licence clearance is not source credibility. The page provides static HTML and text labels that remain accessible without JavaScript; interactive filtering is a progressive enhancement. It is covered by the existing Playwright Chromium/axe CI, but actual screen-reader sign-off remains an independent WEB-01 task.

## Reproduction and quality gates

```sh
npm run check
npm run research:verify
```

`npm run check` now builds both source exports and the first-party catalogue page, tests content integrity, unsafe registry and API samples, missingness, source revision mismatch, retraction states and browser accessibility. Search and JSON/CSV exports are read-only. There is no new paid database or cloud dependency.

**Deliverable boundary:** RT-01.1's four *technical* tasks can be accepted for the metadata catalogue / synthetic adapter. Wider live provider adapter integrations, legal data rights clearance, qualified independent scientific reviews and use of original microdata are separate work and cannot be inferred from this completion.
