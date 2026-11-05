# Website publishing — GitHub is the source of truth

**Operating principle (5 November 2026):** The HPI public website is the **reading experience**; the GitHub repository is the canonical edit/review history and collaboration workspace. Visitors should be able to read research, the charter, roadmap, and governance without being sent off-site.

## Automatic publishing

- Vercel is connected to `saver1991/human-prosperity-initiative` `main` and builds from that exact checkout using `npm run check` (build **and** tests). CircleCI runs the same check on commits.
- `scripts/build.mjs` discovers every Markdown and CSV file under `docs/` and `research/`, plus public root documents such as `README.md`, `GOVERNANCE.md` and `CONTRIBUTING.md`.
- The generator renders a corresponding on-site page for every discovered document, generates research and library indexes, reads `portfolio/project.json` and `research/evidence-ledger.csv` to populate homepage counts, and builds a complete sitemap.
- A changed document automatically changes its generated page **on the next successful deployment**; a newly added document automatically gets its own internal route and appears in the library, without manually updating website components.
- The `/publication.json` endpoint identifies the actual source commit, build timestamp, number of source files and published routes.
- CI checks every generated internal link and prevents a build from passing when a required source link or page is missing.
- GitHub issue changes do **not** create repository commits. The separate `/activity` page reads a bounded, public GitHub Issues summary via an on-site Vercel function `/api/issues` with a short cache (about 5 minutes), so task state can change without redeploying. If GitHub is down or rate-limited, it fails explicitly rather than inventing stale current issues.

## Navigation rules

- The primary navigation, content and research citations point to HPI internal pages wherever HPI hosts that material.
- Relative Markdown links and links to HPI GitHub files are resolved to their corresponding on-site pages at build time.
- Links to HPI issue discussions link to `/activity#issue-N`; each issue includes a clearly marked external GitHub action for participation.
- External journal articles, DOI links and GitHub contribution actions remain external, and open clearly in a new tab. The site does not copy third-party copyrighted research.
- Do not host credentials, unpublished datasets, participant information, email lists or personally identifying research records in a public source file.

## Guarantees and limitations

**This is not instantaneous live file synchronisation.** GitHub changes are reflected when the main-branch Vercel build finishes successfully. A failed or delayed deployment leaves the last working version in service; the public `publication.json` stamp should be compared with the repository SHA before claiming the site is current. An issue status can also be up to five minutes behind owing to caching and may be unavailable during provider outages.

The editor/reviewer must still review scientific claims and their ethical implications. Automated publication is a distribution mechanism, **not scientific peer review**. SolOS's separate pinned evidence snapshot does not automatically follow new HPI commits and must be deliberately revised after review.

## Implementation and QA

- Static site output: `dist/`
- Source-rendering engine: `scripts/site-content.mjs`
- Static site builder: `scripts/build.mjs`
- Live issue API: `api/issues.js` (public GET only, no token; limited to 100 recent issues)
- Security: HTML escaping, URL protocol allowlist, same-origin JS/CSP, no external scripts, and no source data echoed as HTML in client-side rendering.
- Continuous integration: CircleCI `npm run check`, followed by Vercel build/test gate on every linked deployment.

When a GitHub PR is merged, verify CircleCI, Vercel deployment READY, the actual public source commit and representative research and task routes before announcing completion.


## Public source-parity inspection and accessibility release gate

- The [publication-status page](https://human-prosperity-initiative.vercel.app/status) uses a public, read-only Vercel API that compares the **latest GitHub main SHA** to the **current Vercel production publication SHA**, with a five-minute CDN cache.
- It reports *current*, *awaiting publication*, or *unverified*. Provider outages and malformed upstream metadata are reported as **unverified**, never silently shown as current. It does not trigger or approve deployments.
- The page displays timestamps and short revision IDs for transparent human review. Main-branch changes are still published only after a successful Vercel build; the status page detects a gap but does not itself fix one.
- **Browser QA:** CircleCI runs real Chromium desktop and mobile checks in a separate job after source/build tests. The checks cover keyboard skip link, first-party navigation, viewport overflow, issue-title escaping and automated axe-core WCAG 2.2 AA checks on high-traffic pages. Failures retain screenshots and traces. This is **automated accessibility checking, not manual screen-reader certification**.
- **Current release caveat:** Vercel Git deployments are independent of CircleCI status. The Vercel build runs the same Node source tests, but the Chromium browser checks are not yet configured as a hard deployment-protection gate. Work on a Vercel deployment check and rollback/alert ownership remains part of WEB-01. Never claim that passing CircleCI is a prerequisite for automatic Vercel promotion until explicitly verified.
- Browser QA dependencies are pinned within CircleCI, not shipped to the public client. No browser audit credentials, API keys or participant data are needed.
