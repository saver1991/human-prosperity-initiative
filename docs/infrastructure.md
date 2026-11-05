# HPI — public infrastructure

**Verified production URL:** https://human-prosperity-initiative.vercel.app/ (Vercel production READY, HTTP 200 on 5 November 2026). **Database:** Neon project noisy-credit-27738761, region aws-eu-west-2, database hpi. **CircleCI:** gh/saver1991/human-prosperity-initiative, public-site build and tests. No database connection is needed by the current static frontend.


**Implementation:** November 2026. GitHub is the canonical source for documents, research, code, backlog and contributions. See the [WEB-01 production runbook](WEB-01-release-and-operations.md) for current release protections, operating checks, incident response and future evidence-data publication.

## Architecture
- GitHub: public repository, Issues, Discussions and pull requests.
- Vercel: static public website sourced from GitHub; a dependency-free Node.js generator copies site assets to dist. No app-side analytics, cookies, forms, personal data processing or third-party API calls. Provider access logs may still exist.
- CircleCI: workflow in .circleci/config.yml runs npm run check. No GitHub Actions.
- Neon: London PostgreSQL project human-prosperity-initiative, database hpi, schema for research sources and research questions only. The website deliberately **does not connect** to Neon yet. Never ship credentials to public browser code.
- No paid third-party APIs or npm runtime dependencies.

## Publish
Changes go to GitHub via pull requests. The `main` branch is protected (5 November 2026): required successful `ci/circleci: website-quality`, `ci/circleci: browser-accessibility` and `Vercel` checks, strict up-to-date branches, conversation resolution and administrator enforcement. Force pushes and deletion are disabled. CircleCI builds/tests including a real Chromium/axe WCAG 2.2 AA job. Vercel Git integration handles production and preview deployments; its production build runs `npm run check`. **A separate post-merge Vercel Deployment Check is not yet verified/configured**: a merge-time gate is not equivalent to holding a live deployment until CircleCI's post-merge browser job finishes. See [runbook](WEB-01-release-and-operations.md). No production database migrations run during web builds.

## Security and future work
A future data API requires server-side secrets, least-privilege Postgres roles, reviewed data publication and privacy safeguards. This metadata schema is not for participant records.
Chromium responsive, keyboard and axe WCAG 2.2 AA checks are in CircleCI. Representative manual screen-reader and browser-zoom testing remain open. Develop a secure community reporting channel before collecting any personal information. The canonical Vercel domain, robots.txt and sitemap.xml have already been published. Public `/status` and `/publication.json` support on-demand release provenance; automatic uptime alerts remain unconfigured.
