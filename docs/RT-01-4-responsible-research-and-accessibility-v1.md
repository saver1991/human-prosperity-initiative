# RT-01.4 — Responsible research tools, privacy, accessibility and licence governance V1.0

**Status:** engineering-level research safety framework, not certification of legal compliance, ethics, scientific validity, any third-party licence, anonymity, or real accessibility. HPI is not yet an incorporated organisation. **Date:** 6 November 2026.

## Public access, accountability and hard exclusions

The <https://human-prosperity-initiative.vercel.app/research/responsible-tools> trust portal and <https://human-prosperity-initiative.vercel.app/research/responsible-tools/it> Italian translation are static, first-party, multilingual pages. An offline copy is available through the browser's save/print facility; no account, mobile app, JavaScript, tracking, pop-up, online participation, internet-connected research subject, external data upload, provider token or paid service is required.

**Allowed in the current public repository:** original software, public research *metadata* with provenance and explicit unknown rights, and synthetic examples marked fictional. The toolchain may describe prospective public aggregates, but **cannot publish real aggregates at present** until independently reviewed data rights, identifiability, jurisdiction, population-risk and scientific review approvals are available.

**Never permitted in this public HPI toolkit:** names and contacts of individual beneficiaries, household-level claims or entitlement decisions, pseudonymised personal data, sensitive records, case narratives identifying people, participant recruitment, unchecked small-cell releases, copied copyrighted papers or redistributable datasets of unknown provenance. **Pseudonymised data is still personal data.** Even a statistically aggregated dataset can become identifying through linkage and small populations; its lawful anonymisation is **not proven by a technical file check**.

The current machine-readable policy `research/research-governance-gates.json` and pure validator `research-tools/research-governance.mjs` are **deny by default**. The build and CI run `npm run research:governance:verify`, which checks the public artefacts and their explicit absence of field study, validated scientific outcomes, personal data import, third-party file redistribution or true accessibility certification. Deliberately impossible-to-certify gates remain `pending`.

## Human approval matrix before real-world research

| Gate | Actual approval still required | Current status |
|---|---|---|
| G-01 | Independent contextual re-identification risk assessment of aggregate outputs | **Not approved** |
| G-02 | Controller/processor roles, legal basis, data rights, privacy notices and DPIA where necessary | **Not approved** |
| G-03 | Third-party source rights and compatibility of software/data/document licensing | **Not approved** |
| G-04 | Independent research ethics, safeguarding, informed involvement and risk/harm escalation | **Not approved** |
| G-05 | Qualified independent F0-03 methodology, bias and causal claims review | **Not approved** |
| G-06 | Actual VoiceOver/NVDA/TalkBack and native browser zoom acceptance with users, not just axe | **Not tested** |
| G-07 | Each operating jurisdiction's local privacy, labour, consent and partner laws | **Not approved** |
| G-08 | Authorised legal institution, trustees or equivalent responsible decision rights | **Not established** |

No automatic CircleCI/Playwright result can clear these gates. Sensitive case studies require a **different protected system and a lawful controller**; storing them in this public GitHub repository, SolOS or HubOS is forbidden under the current architecture.

## Licence and contribution policy

- MIT `LICENSE` applies to HPI-owned original **software source** only. This does not prove copyright ownership of unknown third-party contributions.
- CC BY 4.0 `LICENSE-DOCS.md` applies to original **HPI-authored documents** only. Reuse calls for attribution and linking to the licence, and indicating modifications when required.
- Third-party research text, journal articles, tables, data extracts, imagery and vendor components **keep their separate copyright and licences**. A source catalogue entry, DOI or open URL is not permission to duplicate it. The publisher must be checked per source, and restrictions documented before any data transfer or public distribution.
- Contributors should use [the contribution process](https://human-prosperity-initiative.vercel.app/contribute) and provide: a summary of original work/third-party components, explicit licence origin, reproducibility command, source/revision SHA, absence of participant and private data, risks/adverse outcomes, and whether any claim needs qualified scientific review.
- Funding interests, organisational affiliations, conflicts of interest, the right to publish negative results and methods transparency must be recorded for substantive scientific changes. An investigator cannot approve their own effect claim as independent review.
- Correction/retraction reports should be append-only with source, date, prior version, transparent explanation and review, under the existing `research/revision-log.json` process. Do not silently erase critical or adverse findings.

## Accessibility, international inclusion and offline support

Current technical UI: English and Italian **human-authored static pages**, `lang="en"` / `lang="it"` on their respective documents, semantic heading navigation, links with visible text, plain tables, responsive layout and safe first-party downloads. Content should not depend on JavaScript, third-party fonts, external analytics or high-bandwidth media; the source text can be printed or downloaded. Local translation review is necessary before using instructions with affected communities.

The website's CircleCI Playwright Chromium/axe automation tests keyboard and structural accessibility, **not** a real spoken screen-reader session or native OS zoom; those remain WEB-01 acceptance and must not be claimed as passed. No citizen, participant or person experiencing poverty should be expected to own a smartphone, provide digital identity or use an online app to benefit from any eventual field intervention.

## Separation of evidence types

| Stage | Can be claimed today? | Basis |
|---|---|---|
| Software developed | **Yes** | Public MIT source, PRs and versioned CI |
| Technical tests passed | **Yes, for verified SHA** | CircleCI, Playwright/axe and Vercel status |
| Evidence source and statistical methods independently validated | **No** | F0-02/F0-03 external review is pending |
| Simulated outcomes | **Yes, as fictional demonstration only** | Pinned synthetic fixture and repeatable calculations |
| Observed beneficiary outcomes and measured causal effects | **No** | No approved field study or participant dataset |

**Neither the name "Human Prosperity Initiative" nor source-controlled privacy documentation creates a legal entity, scientific peer review, registered charity, consent, entitlement adjudication, grant eligibility or jurisdictional compliance.**

## Grounding and maintenance

Reviewing data sensitivity, anonymity and safeguards depends on context and changing law. This V1 policy is a technical baseline, not legal advice. Primary authorities include the [UK ICO guidance on anonymisation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/about-this-guidance), [ICO research safeguards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/the-research-provisions/what-are-the-appropriate-safeguards/), [W3C WCAG language of page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html) and [Creative Commons CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Future actual research requires advice relevant to the relevant country and an approved independent methods and ethics review. The cited ICO guidance states it is under review after UK legislation changes; it must be rechecked before legal implementation.

**Technical acceptance for RT-01.4:** code/policy, multilingual documentation, safe-publication and attribution controls, tests and first-party portal. **Not** legal compliance certification, screen-reader testing, data controller designation, actual clinical or social research authorisation.
