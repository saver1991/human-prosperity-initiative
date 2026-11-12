# WEB-03.6 — Public Help, Legal & Trust pages: implementation and open compliance gates V0.2

**12 November 2026.** Scope: bounded publication of **eleven first-party, source-backed public information/help routes**; **legal/privacy/participant safeguarding compliance and real human reviews are NOT accepted**. Issue: [#89](https://github.com/svtmzt/human-prosperity-initiative/issues/89). Canonical IA: [WEB-03.2](WEB-03-2-information-architecture-and-migration-v1.md). Original requirements: [WEB-03.6 V0.1](WEB-03-6-trust-legal-help-pages-register-v0.1.md).

## Implemented in source and first-party navigation

Each route below is generated from its Markdown file `docs/site-pages/<name>.md` under the site build's first-party canonical path. The **same accessible 3-column Help/Trust/Legal footer** is emitted on the homepage and every generated source/portal page; the primary navigation is intentionally unchanged until WEB-03.4, when `/projects` and `/tools` hubs can be built without broken links.

| Published first-party path | Implementation responsibility / safety status |
| --- | --- |
| [About](/about) | Genuine early-stage mission and unincorporated status; no fictional board |
| [Help & FAQ](/help) | Self-service answers, safe research/tool links, no promised human support |
| [Contact](/contact) | Clear distinction between public non-sensitive GitHub and nonexistent private staffed safeguarding/privacy rights-request channel; does not invent address/email |
| [Privacy](/privacy) | **Interim data-handling transparency only**: Vercel/GitHub, public metadata/fictional browser tools, missing actual controller, per-purpose lawful basis, retention/transfer facts and secure rights contact. **Not an approved comprehensive Article 13/14 notice** |
| [Cookies](/cookies) | HPI-owned browser scripts inspected; no deliberate site-specific ad/analytics/first-party cookie/storage calls identified. **Vercel runtime/edge, provider configuration and consent exceptions not independently fully validated**; no decorative cookie banner, no `/cookie-settings` without real non-exempt storage |
| [Terms](/terms) | Interim safe research usage limits, no binding instrument asserted without real legal operator |
| [Legal/publisher](/legal) | HPI is not a charity/foundation/company; formal publisher contact/identity requirements awaiting actual determination |
| [Copyright](/copyright) | Verified MIT for original code and generally CC BY 4.0 for original HPI docs; third-party rights not granted by links |
| [Accessibility](/accessibility) | WCAG 2.2 AA design target and recent axe/Chromium technical QA; manual assistive technology/user testing outstanding; **NOT certified accessible** |
| [Research integrity](/research-integrity) | Source and version distinctions, NEW-02 2023/24 local model not real HPI human impact, corrections must remain non-sensitive |
| [Human sitemap](/site-map) | Only real published destinations, no false `/projects` or `/tools` claims |

**Not implemented pending real human/technical requirement:** `/cookie-settings` (conditional non-exempt storage) and `/safeguarding` (must have an actual confidential human-owned channel). All other alternative suffixes, such as `/privacy-policy`, are **not claimed live redirects**.

## Real data-processing source inventory, limited technical check

| Component | Source / observed mechanism | Data class | Confidence / missing |
| --- | --- | --- | --- |
| Homepage and versioned documents | Static HTML/CSS on Vercel | Standard technical HTTP requests may expose IP/headers/URL to host | Provider logging/retention/transfer configuration **NOT audited**, Vercel hosting documented; no false retention guarantee |
| HPI proprietary browser scripts | `site/activity.js`, `site/freshness.js`, `site/progress.js`, `site/research-catalog.js`, `site/outcome-lab.js` and source build | Same-origin GET read-only publication/issue data, client-side public source metadata or fictional figures | No site-specific `document.cookie`, local/session storage, pixel/ad/analytics tracker calls identified by direct code inspection. **Not a complete edge/runtime cookie audit** |
| HPI public status API | `api/issues.js`, `api/freshness.js` | Public issues/status snapshots, GitHub upstream via Vercel API functions | No account identities or raw GitHub issue bodies are exposed in the returned feed; hosting platform may process logs |
| External links GitHub and government/ICO/W3C | Browser navigates only if visitor chooses URL | External provider processing under its policies | No first-party guarantee for external websites |
| Public source/test artifacts | Public GitHub, Vercel, CircleCI | Original project files, code, open citations and synthetic fixtures | No legal approval for collection of real participant records; rights status of linked third-party data must be checked per source |

**Source reference:** [Vercel runtime logs](https://vercel.com/docs/logs/runtime) describes standard function and request logs. A site's deployed effective settings, protection, analytics and retention require a responsible human operator to inspect live configuration and any data processor agreements, rather than inferring them from source-code CSP.

## UK 2026 regulatory references and decision register

- **UK GDPR:** [ICO privacy notice guidance](https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/how-to-write-a-privacy-notice-and-what-goes-in-it/) and [specific information requirements](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/). A genuine notice requires an actual controller/contact, purposes, selected lawful basis, recipients, transfers, retention and rights channel. They are not supplied by a fictional site footer.
- **PECR/storage:** **updated final ICO SAT guidance dated 29 April 2026**, [Storage and access technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/), replaces relying solely on the older consultation-era cookies page. PECR exceptions exist but require purpose-specific judgement. A consent banner is mandatory only in the applicable non-exempt cases and must not be misleading.
- **Accessibility:** [W3C guidance](https://www.w3.org/WAI/planning/statements/) asks for actual test results, known limitations and a contact method. Automation is helpful but not a complete manual WCAG 2.2 AA certification.
- **Corporate registration:** UK-company trading disclosures are entity-dependent (for actual incorporated companies); HPI does not currently have a verified registered company number or registered-office address. Avoid inventing them.

## Release acceptance matrix (engineering versus genuine legal completion)

| Acceptance | Technical status | Human / legal status |
| --- | --- | --- |
| Source-backed first-party pages, globally navigable footer, no fictional information | Ready for CI/preview/production verification | No legal approval inferred |
| Privacy page | Accurate **interim disclosure with prominent gaps** | **BLOCKED:** real operator/controller, per-purpose lawful basis, host retention/transfer and rights channel |
| Cookies page | Source inspection and conditional decision documented | **BLOCKED for final compliance claim:** actual browser/provider SAT inventory, PECR exception validation |
| Terms/legal | Real status and conservative reuse terms publicly explained | **BLOCKED for binding terms/completeness:** qualified legal review and accountable publisher |
| Copyright | Linked MIT/CC BY and third-party caution | Specific third-party rights still unverified |
| Accessibility | Design target, known limitations, automated test evidence | **BLOCKED for certification:** real assistive-technology test and verified private feedback method |
| Contact/safeguarding | Public limitation page available | **BLOCKED:** no human-owned private support or safeguarding lead, no SLA |
| Updated IA | 6 target categories, planned routes and present links explicitly separated | Human usability testing belongs to WEB-03.5; visual implementation to WEB-03.4 |
| Page functionality | Require Node, source-link, Cypress/Playwright Chromium, responsive and production HTTP QA | Does not equate to privacy/GDPR legal compliance |

**Acceptance rule:** WEB-03.6 may be marked **technical public-information delivery completed** after green CI and production; the umbrella [#89](https://github.com/svtmzt/human-prosperity-initiative/issues/89) should remain **OPEN as a real-world approval/remediation gate**, with only the human legal/provider/accessibility tasks outstanding. We cannot honestly close it as comprehensive lawful compliance. Technical acceptance evidence and version must be recorded separately.

**No change to study status:** Research/participant privacy, independent scientific review and safeguarding approvals under #19/#26/#67 remain NOT OBTAINED; NO-GO fieldwork.
