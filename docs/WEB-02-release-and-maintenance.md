# WEB-02.6 — Roadmap launch, accessibility and maintenance playbook

**Revision:** 6 November 2026. **Operational owner:** current founding repository maintainer until a real appointed human operations or science-governance owner accepts responsibility. **Scope:** first-party public roadmap and initiative/task pages; this is an engineering release runbook, **not** scientific impact evidence or a guarantee of 24/7 human support.

## Architecture and source authority

- Public home: [HPI roadmap](/roadmap), [WEB-02 detail](/initiatives/web-02), [public activity](/activity), [publication freshness](/status), and [roadmap source](/library/docs/roadmap-source).
- Canonical repository: [HPI GitHub](https://github.com/saver1991/human-prosperity-initiative) `main`; HPI scientific/task authority. Source descriptors: `portfolio/project.json` + `portfolio/public-roadmap.json`; Node contract `scripts/roadmap-model.mjs`.
- Documentation and HTML are built reproducibly using `npm run check` (generate `dist`, run `node --test tests/*.test.mjs`), with allowlisted Markdown source links resolved to first-party HPI pages.
- **Issue state:** same-origin public `GET /api/issues` shows live-ish GitHub issue status on page load, cached by the provider; `site/progress-policy.js` enforces strict schema and a **15-minute** freshness window. The visible editorial project/epic/task snapshot has its own reviewed date and release SHA. An open or closed ticket does **not** change scientific study approval, charter ratification, participant outcomes or independently validated impact.
- [SolOS HPI project profile](https://solos-autonomous-poc.vercel.app/projects/human-prosperity-initiative) has a verified, cached read-only summary of the public HPI source; it may require an authorised Vercel login due to Deployment Protection. It has **no** HPI/HubOS database credentials and cannot edit HPI tasks or issue agent commands.
- HubOS governance store contains one HPI public-interest programme, one WEB-02 project and six epics/31 bounded work items; this is a **portfolio mirror**, not a second HPI science source or continuous task synchronisation.

## Exact release process — required per update

1. Make a focussed GitHub feature branch and PR with issue IDs and real acceptance evidence. **Do not write private respondent records, donor data, API tokens or unsupported impact claims.**
2. On the **exact current PR head SHA**, verify three required status contexts are **success**:
   - `ci/circleci: website-quality` — exact SHA fetch + `npm run check`;
   - `ci/circleci: browser-accessibility` — real Chromium Playwright + axe WCAG 2.2 AA, routes, responsive layout, keyboard, error/outage simulation, ARIA semantics and screenshots;
   - `Vercel` — Preview READY, no production bypass.
3. Read any failure logs, fix and re-run on the **new** head SHA. GitHub main branch protection requires an up-to-date PR, status checks and resolved conversations. No GitHub Actions or paid monitoring vendor is used.
4. Merge only after required statuses PASS. Confirm the **new merged SHA**, Vercel production READY on exactly that SHA, and production `/publication.json` revision matches the GitHub `main` commit. Verify `/roadmap`, `/initiatives/web-02`, a research initiative, `/public-roadmap.json`, `/activity` and `/status` respond with expected content and correct states.
5. Verify `main` CircleCI website-quality **and** browser-accessibility on the merged SHA, not merely the pre-merge PR SHA, before declaring post-merge browser QA accepted. Note **WEB-01 limitation:** Vercel Git integration can still put the site live before post-merge CircleCI finishes. True Vercel Deployment Checks/staged promotion are **not** configured; [WEB-01 #9](https://github.com/saver1991/human-prosperity-initiative/issues/9) tracks this independently.
6. Save a release evidence trail: accepted HPI issue, PR, SHA, CircleCI tests/artifacts, production deployment and exact public source. HubOS mirror changes require their own review, duplicate checks, concurrency guard, backup and verification; never imply automatic sync.

## Browser/accessibility coverage and limits

The pinned CircleCI browser job runs Playwright 1.64.1 + axe-core 4.14.0 against the generated static site; it checks desktop 1440px, tablet 768px, phones 390px and 320px, **all currently registered initiative routes**, homepage, research, library, status, governance and activity. It checks HTTP 200, exactly one page heading, semantic `main` and named navigation, absence of JS errors and document-level horizontal overflow, canonical URLs, relevant accessible names, first-party navigation and keyboard focus. Axe tests WCAG 2.2 AA-tagged rules on desktop and mobile, including all initiative details. The script also performs 640px/320px **200%/400% reflow-equivalent simulations**, 200% text-size stress, keyboard focus traversal and screenshot artifacts.

**What automation cannot prove:** actual NVDA/VoiceOver/TalkBack spoken-output usability, real OS zoom/browser setting combinations, comprehension by people with disabilities, and all WCAG 2.2 AA criteria. Those require an actual competent tester with device/AT, specific page, findings and exact build revision; retain this as a **separate human acceptance gate under WEB-01 #9**. Do not claim that zero axe findings means all accessibility barriers are resolved.

No search/filter UI was added to the small 11-initiative public catalogue: Now/Next/Later sections and independent science/platform groupings provide navigability without client-side filter state. Revisit filtering only if real content size or usability evidence warrants it.

## Operational monitoring, cadence, incident handling

- A daily read-only CircleCI `public-operations-watch` checks public routes, deployment SHA and required status contexts; it does **not** run every minute or create subscriptions. The site's `/status` and `/api/freshness` provide an on-demand comparison. Daily CI failure emails have been observed, but neither 24/7 response nor guaranteed future notification delivery is claimed.
- Recheck issue state on page load (provider caches about five minutes); if GitHub gives malformed/partial/stale/unavailable data, the UI explicitly says status cannot be verified and retains the dated editorial snapshot without converting unknown statuses into 'done'.
- Review the dated editorial snapshot against actual accepted work/PRs on meaningful HPI changes and at least every seven days while actively publishing; do not present SolOS's cached read-only snapshot as real-time. A stale SolOS source fails closed and hides counts.
- Review source contract/version changes with unit tests. Keep HubOS task mirror in line via **explicit, reversible change**; record difference and do not silently delete or overwrite other project states.
- For wrong publication revision or a broken route: inspect `/publication.json`, public GitHub main, CircleCI and Vercel logs; open an issue, revert offending PR through protected GitHub workflow. A Vercel rollback or staged promote requires explicit authority and verified project/team; may temporarily suspend auto-assignment and must not be used just to conceal a failed post-merge check. Document the rollback reason and deployment ID. Restore the most recently approved good revision and rerun smoke tests.
- For untrusted source/XSS, missing evidence/PR, privacy disclosure or unsafe participant info in issues: stop public processing of that content, record a redacted incident, preserve evidence without publishing sensitive records, and follow the provisional [HPI governance policy](/governance). **No staffed private safeguarding inbox or approved study recruitment is asserted.**

## Real acceptance and outstanding unrelated gates

This playbook and regression test suite are maintained under [WEB-02.6 #35](https://github.com/saver1991/human-prosperity-initiative/issues/35). Closing that technical epic requires reproducible CI + browser evidence and accurate publication revision checks. Independent scientific approval and measurable human welfare improvements are **not** part of a website release.

Separate WEB-01 operational gaps remain: genuinely enforced post-merge Vercel Deployment Checks or staged promotion, provider-attributed spend alerts, verified human screen reader acceptance and legal/ethical participant safeguards. These are not silently marked complete by closing WEB-02.
