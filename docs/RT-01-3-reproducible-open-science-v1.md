# RT-01.3 — Reproducible open-science research pipeline V1.0

**Status:** Technical pipeline implemented for existing **public evidence metadata and synthetic examples**. It is **not** an approved study, a third-party data redistribution licence, a validated causal model or a tested international field intervention. HPI remains an unincorporated initiative.

The [research pipeline architecture decision](decisions/0003-offline-research-pipeline.md) records the reason for keeping workflows in Node.js 22, CircleCI and Vercel rather than introducing paid platforms, GitHub Actions or duplicate SolOS research storage.

## Purpose and first-party outputs

The pipeline makes our previous work independently auditable as **code and sources**, not merely published prose. It transforms versioned HPI source files into content-addressed reports and public reproducibility metadata with **no credentials, network requests, new paid APIs or participant records**.

| Artifact | First-party link | Use |
|---|---|---|
| Human-facing reproducibility overview | [Open science pipeline](https://human-prosperity-initiative.vercel.app/research/reproducibility) | Explain data lineage, explicit limits and status |
| Deterministic research report | [JSON report](https://human-prosperity-initiative.vercel.app/research-pipeline-report.json) | Existing evidence counts, study family caveats and fictional evaluation summary |
| Source and artifact hashes | [SHA-256 manifest](https://human-prosperity-initiative.vercel.app/research-pipeline-manifest.json) | Verify exact UTF-8 bytes of nine allowlisted source inputs and four deterministic outputs |
| Metadata-only citation register | [Citation manifest](https://human-prosperity-initiative.vercel.app/research-citation-manifest.json) | Source URLs and licence status for each existing reference, without republishing full texts |
| Data dictionary | [JSON schema dictionary](https://human-prosperity-initiative.vercel.app/research-data-dictionary.json) | Input/output descriptions, unreviewed studies and data policy |
| Public correction record | [Revision history](https://human-prosperity-initiative.vercel.app/research-revision-log.json) | Append-only reviewed source correction and supersession entries |
| Executable tutorial notebook | [Jupyter notebook](https://human-prosperity-initiative.vercel.app/research-reproducibility-notebook.ipynb) | Optional Python-standard-library notebook that delegates to the identical pinned Node CLI |

The public website is built from the **canonical GitHub repository**; it provides a [current Git revision](https://human-prosperity-initiative.vercel.app/publication.json) separately from reproducible content hashes. The pipeline's source and artifact SHA-256 digests establish **byte identity only**, not the authenticity, scientific validity or trustworthiness of external source content.

## End-to-end workflow

\`\`\`sh
node --version                       # Node.js 22 major, matching CircleCI cimg/node:22.11
npm run check                        # build + verify exact published bytes + test suite
npm run research:verify              # source integrity & hypothetical receipt comparison
npm run research:evaluate            # F0-03 draft indicator + hypothetical uncertainty/simulation
npm run research:pipeline:verify     # compare exactly regenerated artifacts with dist
npm run research:pipeline:archive    # copies safe JSON reports into qa-artifacts/research-pipeline
\`\`\`

The CLI and website share the **same research modules**. There is no second independent formula to drift. Source inputs are read from an explicit allowlist in \`research-tools/research-pipeline.mjs\`. A corrupt or missing source, unexpected schema, invented licence declaration, changed F0-03 draft indicator status, participant data type or unlabelled synthetic example **fails closed** rather than publishing an apparently valid report.

The \`research:pipeline:verify\` command regenerates each artifact in process using **the current source files**, checks byte-for-byte equality with published \`dist\` outputs and independently checks the digest values in the manifest. A changed report, incorrect source hash, missing artifact or altered citation entry fails. The \`--archive\` variant stores exactly the vetted five JSON artifacts in the existing CircleCI artifact system; no new cloud storage, token or billable service is provisioned. An archive is **not** a signed attestation: an authoritative merged Git commit and independently verified provenance still matter.

## Documented provenance and licensing

- **Scientific input:** existing HPI evidence ledger (39 references), abstract-level structured extraction (34 records), a 3-entry public-dataset *candidate registry* and 15 proposed F0-03 indicators. A study entry can overlap a previously reviewed experiment; we do not count records as independent trials or infer a formal risk of bias.
- **Demonstration:** \`research/synthetic-outcome-scenario-v1.json\` is an entirely fictional example with no beneficiary data. The pipeline reproduces conditional Wilson/Newcombe uncertainty and a seeded simulation. These calculations do not establish randomisation, credible counterfactuals, cost-effectiveness or a beneficial causal effect.
- **Licence:** HPI source code is MIT under [software licence](https://human-prosperity-initiative.vercel.app/library/software-license); HPI-authored documents are CC BY 4.0 under [documentation licence](https://human-prosperity-initiative.vercel.app/library/documentation-license). **Neither licence grants rights over third-party datasets, journal articles or other external publications.**
- **Citations:** a citation URL or DOI syntax is not live resolution, retraction verification, complete bibliographic metadata or licence clearance. Unknown rights remain unknown. Do not publish copyrighted full texts or participant-level information in the research bundle.

## Scientific checks and uncertainty

All results are deliberately classified:
- \`source_schema_and_integrity\` — pass/fail **technical schema and byte integrity**.
- \`source_rights_and_citation_metadata\` — **metadata only**; actual reuse approval is a human legal/source review.
- \`draft_F0_03_descriptive_synthetic_outcomes\` — **synthetic only**, not representative observed outcome data, real human impact or an independently approved estimator.
- \`content_addressed_publication\` — bundle is ready when tests pass and site deploys; premerge checks alone do not make a research claim true.

The independent F0-03 methodological review, F0-02 source evidence evaluation and international ethics/compliance remain external human decisions. A successful pipeline does not authorise study participants, grant applications, contracting or public policy claims.

## Correction policy and archival discipline

The source-controlled \`research/revision-log.json\` contains a strictly schema-validated, dated history of the pipeline itself. Its initial entry describes only the **technical** release. A new correction entry must be appended through a reviewed PR, state the prior \`release\` identifier, describe the correction, and not falsify earlier history. The JSON manifest includes the **correction-history source SHA** and the published history artifact hash.

Git history remains the **source-of-truth long-term archive**. The public site and CircleCI artifacts provide copies for convenient reproducibility, not an immutable external archive or DOI registration. Evidence contradictions, source retractions and adverse results must remain visible through independent follow-on correction workflows; no automatic removal of inconvenient results.

## Notebook, CI and product integration

The optional \`research/notebooks/rt01-public-source-workflow.ipynb\` has a few simple, *output-free* cells that use only Python standard library and the existing Node scripts. It requires Node 22 and Python 3; Python/Jupyter execution is not part of CircleCI and **no notebook execution result is claimed**. The Node CLI is the fully tested primary workflow.

CircleCI \`website-quality\` checks \`npm run check\` and saves the deterministic research bundle as another artifact under its existing \`resource_class: small\` job. Its dependent \`browser-accessibility\` job runs Playwright Chromium/axe on the public reproducibility page. Vercel publishes the first-party route and fixed content-hash files; it does **not** independently verify research outcomes.

**SolOS** should mirror the RT-01.3 epic status and link to HPI read-only, without taking over task authority, running research or copying source records. **HubOS** retains portfolio coordination only. F0-04 legal/funding readiness and WEB-01 human accessibility/release-monitoring gates are unchanged.

## Completion boundaries

RT-01.3's four **technical workflow, documentation, publication and integration** tasks can be accepted on a passing CI+merged production SHA. There is still **no externally certified science**, source ownership verification, permanent independent archival service, real-world trial, or signed participant consent. These are separate programme gates and RT-01.4 responsibilities.
