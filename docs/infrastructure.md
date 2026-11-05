# HPI — public infrastructure

**Implementation:** November 2026. GitHub is the canonical source for documents, research, code, backlog and contributions.

## Architecture
- GitHub: public repository, Issues, Discussions and pull requests.
- Vercel: static public website sourced from GitHub; a dependency-free Node.js generator copies site assets to dist. No app-side analytics, cookies, forms, personal data processing or third-party API calls. Provider access logs may still exist.
- CircleCI: workflow in .circleci/config.yml runs npm run check. No GitHub Actions.
- Neon: London PostgreSQL project human-prosperity-initiative, database hpi, schema for research sources and research questions only. The website deliberately **does not connect** to Neon yet. Never ship credentials to public browser code.
- No paid third-party APIs or npm runtime dependencies.

## Publish
Changes go to GitHub; CircleCI builds and tests; Vercel Git integration handles production and preview deployments. These processes are currently independent unless an explicit release protection gate is added and verified. No production database migrations run during web builds.

## Security and future work
A future data API requires server-side secrets, least-privilege Postgres roles, reviewed data publication and privacy safeguards. This metadata schema is not for participant records.
Test mobile accessibility, keyboard interaction and contrast using a real browser; develop a secure community reporting channel before collecting any personal information.
Record canonical domain and sitemap only after the first public deployment is verified.
