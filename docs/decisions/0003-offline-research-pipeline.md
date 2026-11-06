# ADR 0003 — Offline, content-addressed research publishing via existing HPI infrastructure

**Status:** Accepted for bounded RT-01.3 technical implementation, 6 November 2026.
**Decision scope:** software, source provenance and reproducibility only. Does **not** authorise research on people, acceptance of external source licences, methodological peer review, new cloud spending, data protection controller status or institutional incorporation.

## Context

The initial HPI research register includes 39 bibliographic references, 34 abstract/summary extraction entries, three candidate public datasets whose files are **not imported**, and an F0-03 draft indicator catalogue. RT-01.1 and RT-01.2 already provide deterministic source metadata checks and a fictional outcome comparator. The missing capability was a single reproducible path from those **versioned** inputs to a public result, citations and provenance, with no separate undocumented calculations.

## Decision

1. Adopt a **Node.js 22 standard-library pipeline**, consuming only explicitly allowlisted repository files, not URLs, opaque remote connectors, private databases or participant rows. Run it alongside `npm run build`; `npm run research:pipeline:verify` regenerates exact output bytes, and `npm run research:pipeline:archive` writes only safe canonical reports to the existing CI artifact directory.
2. Publish content-hash manifests (SHA-256 of original input bytes and output UTF-8 bytes), descriptive source citation metadata, an explicit data dictionary, synthetic comparison results and a dated append-only correction record. A content hash is proof of **identity**, not scientific credibility, legal rights, third-party provenance authentication or immutable remote retention.
3. Reuse **CircleCI website-quality** for deterministic verification and test artifacts. Its dependent **Playwright Chromium/axe** job continues accessibility checks. **Vercel** publishes the static first-party /research/reproducibility page and JSON artifacts; GitHub history remains the canonical version archive. No GitHub Actions or new CI, storage or paid API.
4. Keep HPI research and its source provenance **authoritative in this public repository**. SolOS receives only a read-only phase/roadmap projection; HubOS retains portfolio monitoring. Neither system executes research or overrides ethical approval.
5. Include an **optional Jupyter notebook** delegating to the same CLI with no cached results or provider fetches. The notebook is instructional, not a second independent or CI-executed statistics implementation.

## Alternatives considered

- Hosted notebook infrastructure, paid ETL/datawarehouse, hosted research suites — **deferred**, higher cost/privacy complexity without verified demand or research need.
- GitHub Actions — **not used**, existing CircleCI is an explicit project constraint.
- Manual upload of PDF charts, unversioned spreadsheets and freeform reports — **rejected**, encourages silent source drift and broken source-to-output integrity.
- Read external data automatically on each website build — **rejected**, third-party licences, availability, consent, availability and cost remain unverified.
- Put study execution and source data inside SolOS/HubOS — **rejected**, duplicates source authority and adds unnecessary access.

## Review gates and risks

- A green CI checks **software determinism**, not causal identification, risk of bias, human participant safety, data stewardship or a legally valid charitable purpose.
- Reference labels and publicly linked DOI patterns require independent full-text/source verification; no third-party article or personal data are republished.
- Correction log entries must be **appended via PR** with links to the prior release, a dated explanation and independent review where required. Git history is currently the versioned archive, not a DOI, durable external repository or signed audit trail.
- Reproducibility depends on consistent Node.js major version and identical source bytes. Validate future upgrades and version differences before claiming byte-level parity.
- Human screen reader testing remains within WEB-01; RT-01.4 still owns broader privacy, access control, software/third-party licensing and ethical research requirements.

## Technical acceptance evidence

HPI [RT-01.3 PR #65](https://github.com/saver1991/human-prosperity-initiative/pull/65) carries the code, runbook, tests and CI integration. Publication should be considered accepted **only** after CircleCI quality and browser checks pass on the reviewed SHA and Vercel Production is READY for the merged `main` SHA.

**Parent epic:** [RT-01 #55](https://github.com/saver1991/human-prosperity-initiative/issues/55), child [RT-01.3 #58](https://github.com/saver1991/human-prosperity-initiative/issues/58). F0-03 independent methodology review and F0-04 legal/funding gates remain unchanged.
