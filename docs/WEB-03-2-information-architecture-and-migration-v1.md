# WEB-03.2 — Information architecture, canonical sitemap and transition contract V1.0

**Date:** 12 November 2026 · **Delivery:** canonical public IA and migration *design completed*. The broader website redesign WEB-03.3/03.4 and full human testing WEB-03.5 are **not** included or implied. This contract does not claim independent human usability research, legal sign-off, measured outcomes, research field approval or incorporated organisational identity.

**Authority:** [WEB-03 #85](https://github.com/svtmzt/human-prosperity-initiative/issues/85), [WEB-03.2 #91](https://github.com/svtmzt/human-prosperity-initiative/issues/91), [WEB-03.1 audit](WEB-03-1-website-ia-and-experience-audit-v0.1.md), [RT-02 tools inventory](RT-02-1-public-research-tools-product-inventory-v0.1.md), [WEB-03.6 trust/help](WEB-03-6-trust-legal-help-pages-register-v0.1.md).

## 1. Decisions: who the public experience is for

1. **People exploring HPI for the first time** must understand the two connected horizons, see what HPI *has and has not accomplished* and find credible evidence; avoid engineering jargon at entry.
2. **Researchers, journalists and critical reviewers** need source-led project pages, period/geography/population denominators, disconfirming evidence, uncertainty, dated historical versions and clear independent-review state.
3. **Users of HPI tools** must find a safe instrument within a few decisions, see permitted data inputs, outputs and limitations (especially **synthetic only**) and reach a method and download.
4. **Potential community, design or scientific contributors** need practical participation instructions, open issues and non-sensitive source-correction routes; public GitHub must never be misrepresented as a confidential hardship report or staffed safeguarding service.

These are **design hypotheses with task-based acceptance criteria**, not results of real user interviews. Human usability and assistive technology review remain separately open.

## 2. Six-area primary taxonomy (canonical target after WEB-03.4)

| Label | Canonical route | What belongs here | What does NOT belong here | Status 12 Nov 2026 |
| --- | --- | --- | --- | --- |
| **Mission** | [Mission](https://human-prosperity-initiative.vercel.app/mission) | Accessible explanation of aims, two horizons, values, working charter and its V0.4 candidate/ratification status | Unratified charter advertised as constitution; programmatic issue codes in the introduction | Live existing; narrative refresh later |
| **Projects** | `/projects` | Project directory and `/projects/newham` case-study landing with evidence state, source/date, problem, existing services, risks, next decision | A public benefit application, individual eligibility checker, HPI causal impact claims | **Planned** WEB-03.4; existing case `/research/newham-prepilot` remains live |
| **Research** | [Research](https://human-prosperity-initiative.vercel.app/research) | Research programmes/themes, methods, studies, current findings and independent criticisms | Flat technical source index as the only explanation; unverified causal claims | Live source index; restructure planned |
| **Tools** | `/tools` | **Source Catalogue, Synthetic Outcome Lab, Reproducibility, Responsible Tools**: purpose, permitted input classification, example, output, limits, citations | Personal case upload, unwarranted dataset reuse, access to unbuilt Prosperity Data Explorer | **Planned** RT-02.2/WEB-03.4; all four /research/* existing tools remain live |
| **Get involved** | [Get involved](https://human-prosperity-initiative.vercel.app/contribute) | Contributor roles, public scientific comments, corrections, accessible routes, conduct | Unstaffed confidential reports, recruited study participants or fund-raising promises | Live; simplify when actual contact governance ready |
| **About & Governance** | [About](https://human-prosperity-initiative.vercel.app/about) | Unincorporated status, purpose, verifiable roles and operating boundaries; [Governance](https://human-prosperity-initiative.vercel.app/governance) and [Roadmap](https://human-prosperity-initiative.vercel.app/roadmap) | Fictitious board, charity, registered address, scientific certification | **About becomes live with WEB-03.6**; institutional validation still pending |

**Primary nav migration:** retain current `Mission · Research · Roadmap · Library · Get involved` until **WEB-03.4**, then change to six above only after `/projects` and `/tools` exist and tests succeed. Never deploy broken links or pretend planned hubs are already functional. `Roadmap`, `Library`, `Activity`, `Status` remain first-party, accessible secondary/footer destinations.

## 3. Secondary navigational hierarchy and trust/help

```text
Home (/)
├─ Mission (/mission, /mission/it as existing translation)
│  ├─ Our principles / current charter candidate
│  └─ Historical drafts / source amendments (Library, not source of ratification)
├─ Projects (/projects, future hub)
│  └─ Newham (/projects/newham, future editorial case study)
│     ├─ Current results → /research/newham-prepilot
│     ├─ Official source verification → /research/new-02-newham-source-reconciliation-additionality-v0-2
│     └─ Earlier desk report → /research/newham-pension-credit [HISTORICAL, superseded where necessary]
├─ Research (/research, editorial overview to be refined)
│  ├─ Problems and research questions
│  ├─ Methods, proposed HPI-B-01 indicators & conflicting evidence
│  └─ Sources, critiques and reproducibility
├─ Tools (/tools, future discovery hub)
│  ├─ Source catalogue → /research/source-catalog [LIVE]
│  ├─ Synthetic outcome lab → /research/outcome-lab [LIVE]
│  ├─ Reproducibility → /research/reproducibility [LIVE]
│  └─ Responsible tools → /research/responsible-tools [LIVE]
├─ Get involved (/contribute)
│  ├─ Public contribution / review instructions
│  └─ Non-sensitive source corrections → /research-integrity [LIVE disclosure, real secure channel not provided]
└─ About & Governance (/about [LIVE], /governance [LIVE])
   └─ Roadmap (/roadmap) → initiatives → tasks → evidence/issue

SECONDARY NAV / SITE FOOTER
├─ Help (/help) · Contact (/contact) · Accessibility (/accessibility)
├─ Privacy (/privacy) · Cookies (/cookies) · Terms (/terms)
├─ Legal/publisher (/legal) · Copyright & licences (/copyright)
├─ Research integrity (/research-integrity) · Human sitemap (/site-map)
├─ Roadmap (/roadmap) · Knowledge library (/library) · Activity (/activity) · Status (/status)
└─ Conditional future routes: /cookie-settings (only for non-exempt storage),
   /safeguarding (only if a real confidential human-owned process exists)
```

**Do not create a consent-management UI to celebrate planning; implement if real storage/access-technology review finds non-exempt technology.** Publishing first-party policy/help pages now is a narrow trust-content improvement, not the visual/navigation redesign.

## 4. Canonical routes, legacy URL transitions, change control

| Current route or source | Target / treatment | Action now | WEB-03.4 future |
| --- | --- | --- | --- |
| `/` | home, accessible programme summary | Preserve | Revise hierarchy/CTAs, not base URL |
| `/research` | research area + current-case entry with full archive access | Preserve | Reorganise content cards with editorial titles |
| `/library`, `/library/docs/*`, `/research/*` source slug pages | **Stable permanent archival sources** | Preserve all deep links, dates, issued publications and source identities | Add canonical current/draft/superseded badges and contextual next-reading; do not delete citations |
| `/research/newham-pension-credit` | historical 2023/24-source pre-reconciliation context | Do not erase historical statements or falsify its original date | Add prominent **superseded by NEW-02 V0.2** banner and current source link, correct summaries without altering original source record |
| `/research/newham-prepilot` | current public-source prepilot summary | Preserve | Link via future `/projects/newham` |
| `/research/source-catalog`, `/research/outcome-lab`, `/research/reproducibility` | existing canonical tool runtime paths | Preserve | Future `/tools` cards link to these; no forced path migration or broken bookmarks |
| `/mission` | current public explanation, charter still unratified | Preserve | Show latest version separately from historic V0.3 |
| `/roadmap`, `/initiatives/*`, `/activity`, `/status` | unchanged source-linked transparency | Preserve | Accessible secondary and contextual paths |
| `/privacy`, `/cookies`, `/terms`, `/legal`, `/copyright`, `/accessibility`, `/help`, `/contact`, `/about`, `/research-integrity`, `/site-map` | new human-facing trust/help/legal content | **Implement with WEB-03.6**; surface globally from footer; disclose pending human data/legal approvals | Expand content when validated contact/controller/rights become available |
| Historical `github.com/saver1991/human-prosperity-initiative/*` links | current GitHub `svtmzt/human-prosperity-initiative`; preserve immutable history link identity | Use canonical new links for new content; don't infer old link is first-party | Scoped link audit and redirects; stable technical artifact source identifiers |
| `/privacy-policy`, `/cookie-policy`, `/terms-of-use`, `/accessibility-statement`, `/faq` | canonical short routes above | Do not silently claim existing aliases | Add 301/308 redirects only with verified route mapping when required for real inbound traffic |

**SEO/canonical contract:** 1 permanent canonical per human-facing route; 200 + one H1 + main + skip-link + link-title clarity; no placeholder 200 for non-existent pages; maintain XML sitemap and robots first-party; schema and historic sources declare publication versus review metadata; no impact claims in snippets. Use no JS-only route barrier for legal/help.

## 5. Four task flows and formal acceptance criteria

| Journey | User problem, first step and destination | Proposed measurable acceptance (requires future real testing) |
| --- | --- | --- |
| Visitor | Home → Mission → Projects → current Newham findings → independent review NO-GO | Finds purpose and status without reading GitHub, identifies HPI is **not incorporated** and has **no measured human impact** |
| Research reviewer | Research → Newham → current NEW-02 ODS → source period/denominator → methods/corrections | Can distinguish Newham **11,300** modelled households and **78%** 2023/24 admin estimate from **86% expenditure** or GB **62%** survey measure; HPI participant denominator/numerator **NULL** |
| Tool user | Home → Tools → Source Catalogue or Outcome Lab → safe example/result → method/limitations | Reaches a working tool in no more than **3 navigational decisions** (future target); recognises **39 references + 3 dataset candidates**, and SYNTHETIC outcome data, not beneficiary files |
| Contributor / community | Home → Get involved → Help or Research Integrity → public non-sensitive correction OR clear non-availability of secure channel | Does not post private beneficiary/health/financial data on GitHub; can identify real versus missing contact and reporting options |

Navigation decision targets must be tested with users in WEB-03.5; they are **not** observed performance metrics.

## 6. Page-type and content model (schema for WEB-03.3/03.4)

- **Home**: headline, whom it helps, 2 research horizons, project teaser, source/limitation, 3 task-based links, progress/governance.
- **Project**: title, territory and population scope, question, official source/date, *published* findings, counter-evidence, effect vs estimate, what next, review gate, reference list and archive.
- **Research topic**: plain-language claim, evidence confidence/status, source taxonomy, methods, uncertainty, corrections, contributors (if verified).
- **Tool**: name, audience, purpose, accepted data input (public/synthetic only), real vs modelled, demo, output, download, validation status, accessible guidance and code/source lineage.
- **Public policy/legal/help**: plain-language TL;DR, reviewed/unknown facts, date, actual owner/feedback path if verified, disclosure/rights, safe outward links, version history, no fictitious organisational authority.
- **Governance/roadmap**: traceable code IDs allowed in detail, but summaries must explain real-world aims and pending decisions.
- **Archive/source**: original filename, original date, superseded/experimental markers, canonically current replacement if real, full traceability; never silently overwrite cited historical data.

**Content status vocabulary:** `current_public_source`, `historical`, `superseded`, `candidate_unvalidated`, `synthetic_example`, `draft_pending_legal_review`, `needs_actual_human_authorisation`. These labels refer to content reality, not a broad technical success/CI label.

## 7. Decisions, dependencies and handoff

- **Accepted within WEB-03.2:** single source-backed sitemap, exact current/planned paths, full canonical/legacy strategy, 4 auditable journeys, content/template and versioning contracts, migration order, JSON machine-readable source and published public report. No duplicate project or legal entity.
- **WEB-03.3:** founder design direction/visual wireframes (not invented participant preferences).
- **WEB-03.4 / RT-02.2:** actual `/projects`, `/tools`, changed primary nav, UI templates and design system; retain all existing deep routes.
- **WEB-03.5:** independent manual assistive technology and honest user research, keyboard, mobile, 200%/400% checks.
- **WEB-03.6:** publication of safe trust/legal/help pages, visible footer, no unowned contact or fictional privacy-law signoff; legal and safeguarding approvals must remain separately **pending** until real.
- **RT-GATE-01 / F0-03.1 / F0-05:** scientific/privacy/field NO-GO remains unchanged.

**Implementation guard:** if a route or data claim exists only in this plan, label it `planned`. Engineering tests and CI prove published code and route integrity, **not** independent legal conformance, community consent, research validity or human outcome.
