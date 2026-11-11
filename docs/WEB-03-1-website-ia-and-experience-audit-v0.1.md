# WEB-03.1 — HPI website experience, navigation and information architecture: Phase 1 audit V0.1

**Date:** 11 November 2026. **Scope:** public-site route/HTML inspection and repository source review before any redesign. **Decision:** Phase 1 structural/content audit COMPLETE; **not** a human usability study, Figma visual critique, automated WCAG certification, actual screen-reader session, security pen-test, full browser storage audit, legal sign-off or approval of a new UI. **Working name:** HPI is unincorporated; no real participant research or confirmed social impact.

**Authority:** [WEB-03 #85](https://github.com/svtmzt/human-prosperity-initiative/issues/85), [WEB-03.1 #87](https://github.com/svtmzt/human-prosperity-initiative/issues/87). Track with [RT-02 #86](https://github.com/svtmzt/human-prosperity-initiative/issues/86) and existing [HubOS HPI portfolio #150](https://github.com/svtmzt/the-hub-os/issues/150). **Do not change the production IA or make a policy claim as part of the audit.**

## 1. Evidence inspected and method

- Public production: [HPI website](https://human-prosperity-initiative.vercel.app/), /mission, /research, /roadmap, /library, /activity, /contribute, /governance, /status; purpose-built /research/outcome-lab, /research/source-catalog, /research/reproducibility, /research/responsible-tools, /research/newham-prepilot and /research/newham-pension-credit. These pages responded **HTTP 200** in the route/HTML check.
- Candidate visitor routes **HTTP 404**: /about, /privacy, /privacy-policy, /cookies, /cookie-policy, /cookie-settings, /terms, /terms-of-use, /legal, /copyright, /accessibility, /accessibility-statement, /help, /help/faq, /faq, /contact. An alternative URL may exist, but these important *expected destinations* do not.
- Repository: `site/index.html`, `site/styles.css`, `scripts/build.mjs`, `scripts/site-content.mjs`, `site/outcome-lab.js`, `site/research-catalog.js`, `site/activity.js`, `portfolio/project.json`, `portfolio/public-roadmap.json`, `docs/WEB-02-*`, `vercel.json`. Public research documentation is generated from Markdown/CSV with the source ID in the published slug.
- Evidence taxonomy: **Observed** = production HTML/HTTP or current versioned source; **Reasoned inference** = probable experience or organisational risk, requiring testing; **Untested** = visual layout, assistive technology, consent/storage runtime or humans. All proposed sitemap destinations except existing routes are **planned**, not implemented.

### Existing global navigation (observed)

**Mission · Research · Roadmap · Library · Get involved**, with a smaller activity/status footer. The general-purpose HTML rendering of Markdown and CSV exposes file identifiers in the navigation titles. The homepage footer contains no explicit visitor privacy/cookies/accessibility/help/contact destinations; global doc-page footers link Library, Activity and Publication Status but not these notices. The home has a skip link to `#main`; static pages have semantic headings and primary-nav labels. This is **positive implementation evidence**, not a claim that screen readers have been used in a human test.

### Existing content map (observed)

| Page/cluster | Role today | Evidence / limitations |
| --- | --- | --- |
| `/` | Mission-led entry point with high-level goals, two horizons and project references | Strong aspirational narrative; limited direct journeys into usable tools or applied project outcomes. No legal/help footer links |
| `/mission` | English charter text published from `docs/charter.en.md` | The page labels itself a **historical V0.3 summary** while charter V0.4 is the published working candidate. No ratified charter V1.0. Distinguish historical vs current |
| `/research` | Flat searchable-by-browser index of research resources | Dozens of document titles include `F0-...`, `NEW-...` and raw filenames; very limited editorial grouping or clear starting path for newcomers. Dedicated tool links occur in prose rather than global navigation |
| `/library` | Flat index of research and foundation/governance source documents | Substantially overlaps `/research`; no clear user-facing definition of when to use Research vs Library, and historical superseded documents appear next to newer versions |
| `/roadmap`, `/initiatives/*`, `/activity` | Source-traced programme status and issue references | Strong programme provenance (WEB-02). Codes and internal process dominate; clarify scientific progress vs site technical status for nontechnical visitors |
| `/research/source-catalog` | Metadata-only source explorer | 39 evidence references + 3 candidate datasets, filters for query/type, JSON/CSV downloads; rights mostly unknown/unreviewed. It is not a library of 42 licenced full datasets |
| `/research/outcome-lab` | Synthetic outcomes calculator and simulated uncertainty | 6 numeric inputs, calculate and seeded simulation. Nothing measures a real HPI effect or verifies an actual beneficiary. Needs task-based guidance and clear interpretation |
| `/research/reproducibility` | Research pipeline manifests, source hashes, JSON, notebook | Valuable for technically fluent reviewers; entry page exposes technical artifact names with limited novice onboarding |
| `/research/responsible-tools` | Ethics, privacy, data rights and tools-gate explanation | Bilingual static accessibility and explicit pending reviews; should be adjacent to tool experiences and governance, not treated as an actual privacy notice |
| `/research/newham-pension-credit`, `/research/newham-prepilot` | Public research case study, feasibility and no-field status | **Content integrity issue:** older Newham desk validation page says DWP's original local Newham row "has not been extracted" while NEW-02 V0.2 subsequently verified row 109 and the newer prepilot page shows the 78% modelled rate. Preserve historical report but label superseded prominently and guide to canonical current findings |
| `/contribute` | Source-based instructions for researchers/contributors | Tells users to go to GitHub; good for developers, intimidating for many non-technical visitors. No live human safeguarding/service contact should be implied |
| `/governance`, `/library/*license*` | Existing governance, software and documentation rights | Relevant policies already exist but not assembled into visitor trust/legal navigation or verified privacy/cookie flows |
| `/status` | GitHub/deployment revision freshness | Technical health ≠ accessible service or scientific validation. Good transparency; keep in secondary/site-status navigation |

## 2. Severity-ranked findings and actionable requirements

| ID | Priority | Finding (evidence class) | User or research risk | Required product correction |
| --- | --- | --- | --- | --- |
| IA-01 | **P0** | The Research/Library source indexes are mostly flat raw technical document listings (Observed) | A visitor may be unable to find the actual research question, latest result or usable tool; duplication increases confusion | Audience-led Research landing with topic/project groupings, primary article/summary, canonical current version, expandable evidence/revision details; Library as secondary exhaustive archive |
| IA-02 | **P0** | The global navigation has no Tools or Projects destination despite working tool pages and Newham case study (Observed) | Discovery and use require knowing `/research/*` paths | New primary Tools and Projects hubs with contextual navigation, task-oriented cards and correct safety labels; preserve all existing URLs |
| IA-03 | **P0** | Privacy/Cookies/Terms/Accessibility/Help/Contact/About candidate paths absent (HTTP 404 observed) | Missing transparency and support affordances; potential regulatory risk conditional on real data/trackers | WEB-03.6 controlled legal/support page register; audit actual data processing and assign verified responsible human before publication/contacts |
| IA-04 | **P0** | The canonical Newham desk page still states DWP local row not extracted, contradicted by the verified NEW-02 V0.2 audit (Observed) | Directly undermines trust in research-source freshness | Add a superseded notice on the historical report and prominent link to NEW-02, avoid silently rewriting dated evidence |
| IA-05 | **P0** | HPI source references and GitHub resolver still hardcode historical `saver1991/human-prosperity-initiative`; canonical connected repo currently `svtmzt/human-prosperity-initiative` (Observed source/repo) | Redirect dependence, misleading attribution, stale issue-source links and future breakage | Single canonical repository config, test correct owner and redirects; retain legitimate historical PR citations while updating current source navigation |
| IA-13 | **P0** | `/api/issues` and `/api/freshness` respond **HTTP 503** after GitHub repo owner changed; `api/issues.js`, `api/freshness.js` and CircleCI `scripts/ops-watch.mjs` still call historical `saver1991` API with `redirect: error` (Observed live + source) | The site's live issue feed, status verification and scheduled operational monitor cannot reliably establish live provenance, while static pages remain available | Small Phase-1 operational repair: use canonical `svtmzt` GitHub REST endpoint; add regression tests and validate HTTP 200/live freshness after deployment. Does not change IA or legal status |
| IA-06 | **P1** | Mission route features a V0.3 historical summary, whereas Charter V0.4 is the current unratified draft (Observed) | New visitors may read historical version as current mission charter | Separate accessible mission overview from canonical current draft, history and explicit ratification status |
| IA-07 | **P1** | Home's visitor pathways are broad narrative plus internal roadmap rather than action-oriented programme/research/tool tasks (Reasoned from markup) | Unclear next step for different audiences | Human-readable 3–4 CTA paths with outcome evidence status and accessibility-first information scent |
| IA-08 | **P1** | Research rights/status are visible only on deep pages, not consistently next to all results (Observed) | A user may mistake metadata, synthetic experiments or models for reviewed datasets or measured impact | Persistent `Synthetic only`, `Candidate data`, `Not independently validated` labels; source/citation/period on cards |
| IA-09 | **P1** | No verified manual VoiceOver/TalkBack/NVDA end-to-end or user comprehension sessions (review gate OPEN) | Automated axe/Chromium does not prove real accessible experience | WEB-03.5 human manual testing and remediation; no invented WCAG certification |
| IA-10 | **P1** | Site is English-first; an Italian Responsible Tools route and Italian charter exist but bilingual navigation is not systematic (Observed) | Inconsistent multilingual expectations; real partner languages unknown | Explicit language policy, document-language metadata, reviewed translation and localized navigation only when supported |
| IA-11 | **P2** | Technical status and source build revision visible but no canonical human-facing Help/Glossary (Observed) | Codes overwhelm public readers | Glossary explaining HPI-B-01, F0, modelling vs measured, result vs pilot, and safe tool guidance |
| IA-12 | **P2** | Source-driven HTML copy is not governed by a current-version index (Reasoned from contradictory pages) | More stale claims accumulate as roadmap grows | Content ownership/version-control rules and contradiction CI checks on scientific claim summaries |

### P0 evidence snapshot — affected read-only endpoints

At 11 November 2026 before remediation, `GET /api/issues` returned **503** with `public_issues_temporarily_unavailable`, and `GET /api/freshness` returned **503** with `status=unknown`. The API clients specifically use `redirect:"error"` to prevent unvalidated redirects; GitHub now redirects the previous `saver1991` owner to canonical `svtmzt`. Repository `api/issues.js`, `api/freshness.js` and `scripts/ops-watch.mjs` have been corrected **on the Phase 1 working branch**; these were actual live production failures observed, not merely potential issues. Confirm repair after merge with current source SHA and exact live status. Do not claim fixing the read-only feed means project scientific validation.

## 3. Four complete target user journeys for next-phase design

1. **First-time visitor**: homepage mission → current problems/projects → what HPI actually knows/doesn't know → credibility/governance → optional involvement. Success: can describe HPI's applied/long-term aims and **knows no real participant results are claimed**, without interpreting issue codes.
2. **Researcher / reviewer**: Research → topic/case (Newham) → current findings → source/period/denominator and independent-review status → full evidence/method → correction/contribution. Success: can distinguish 2023/24 Newham modelled 78% from GB FYE2025 62%, 86% expenditure and HPI-B-01 (still null), and find a citation.
3. **Tool user**: Tools → Source Catalogue or Synthetic Outcome Lab → purpose, input-data classification, example, safe limits → usable tool → export and reproducibility link. Success: reaches an operating instrument in ≤3 site navigation steps from the homepage once redesigned; is not misled into supplying personal case records.
4. **Potential collaborator / community representative**: Get involved → roles + accessible contact/review routes → safeguards and rights → non-sensitive critique or protected consultation **only when a human channel exists**. Success: understands GitHub is public and **not** a confidential welfare/safeguarding channel; no implied appointed partner or recruitment.

Success criteria are **proposed tests** for WEB-03.3–03.5, *not* measured usability results.

## 4. Proposed high-level information architecture (NOT implemented)

```text
Home
├── Mission                     (current work, two research horizons, values, charter version)
├── Projects                    (Newham and future projects; source + outcome validity)
├── Research                    (areas, study findings, methods, independent critiques)
├── Tools                       (Source Catalogue, Outcome Lab, Reproducibility, safe guides)
├── Get involved                (contribute, review, transparent collaboration boundaries)
└── About & Governance          (status, process, team roles, roadmaps)

Persistent/contextual secondary areas:
  Roadmap · Library (archived/full docs) · Activity · Publication Status
  Help & FAQ · Contact (only real channel) · Legal & Trust / Privacy / Cookies
  Terms · Copyright & Licences · Accessibility · Corrections/Research Integrity
```

Avoid a new broad navigation mega-menu before user testing. Use intuitive titles in primary navigation; retain stable technical IDs in details and source links. Maintain route continuity via redirects or canonical aliases during WEB-03.4; do not break existing deep documentation, tests, citations or publishing scripts.

## 5. Priority 0/1 next-phase implementation contracts (no UI redesign done now)

| Phase | Canonical epic | Phase acceptance |
| --- | --- | --- |
| **P0 now** | **WEB-03.1** | This dated route/HTML/source IA audit, 4 journey hypotheses, 13 traceable findings, and proposal; first-party publication plus CI proof |
| P0 next | WEB-03.2 | Final public sitemap, user-defined labels, page-template matrix, current/historical content model, migration/redirect/content SEO table, 4 tested task flows |
| P0 next | WEB-03.3 | Responsive wireframes of Home/Projects/Research/Tools/Help and legal/footer, tested contrast, reduced motion; visual direction approval before major production coding |
| P0 next | WEB-03.4 | Incremental page implementation, semantic headings and keyboard discoverability, structured source statuses, stable deep-links and error states |
| P0 next | WEB-03.5 | Automated QA *and human* screen reader / 200% zoom / 400% reflow / language/accessibility validation; no unconditional pass if real testing unavailable |
| **P0 planned** | **WEB-03.6** | Publish actual verified policies, copyright/license page, accessibility statement, Help/FAQ, About and contact/support with real owner; conditional cookie consent after browser inventory, counsel/privacy signoff where needed |
| P1 later | WEB-03.7 | Ongoing content lifecycle, editorial ownership, stale claim checker, accessible feedback process, translations justified by real readers |

**Safety/privacy source guidance:** [ICO privacy information](https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/how-to-write-a-privacy-notice-and-what-goes-in-it/); [ICO cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/); [W3C evaluating accessibility](https://www.w3.org/WAI/test-evaluate/). The ICO guidance was flagged as subject to 2026 updating; legal completeness must be rechecked before publishing final policy claims. An unregistered research site is not necessarily required to have **all** of these pages as a matter of law, but visitors deserve clear, accurate, traceable information.

## 6. HPI / HubOS and scientific status gates

HPI GitHub [#85](https://github.com/svtmzt/human-prosperity-initiative/issues/85) is the authoritative delivery roadmap, HubOS [#150](https://github.com/svtmzt/the-hub-os/issues/150) is a **read-only portfolio pointer** under the existing HPI programme, not a duplicate legal entity or live task sync. WEB-02 public progress remains a dated editorial snapshot; source GitHub issue closure is separate from governance ratification, independent science, real assistive-tech acceptance or human prosperity measurements.

**Outcome:** Phase 1 product-discovery audit accepted as content/structure analysis only. No page redesign deployed, no legal pages claimed live, no data collection, and no participant recruitment. The narrowly scoped GitHub REST owner repair for two broken public read-only APIs is a distinct urgent operational remediation; treat it as **unverified** until successful CI and actual production /api/issues and /api/freshness checks. Continue with WEB-03.2 and WEB-03.6 only after clear scope, actual content owners and responsible approval.
