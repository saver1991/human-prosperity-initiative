# Agent instructions — Human Prosperity Initiative

## Mandatory Hub Lean Development Standard — 2026-11-09

All development agents must consult [HubOS GOV-01](https://github.com/svtmzt/the-hub-os/issues/142) and the [canonical HubOS instructions](https://github.com/svtmzt/the-hub-os/blob/main/AGENTS.md), preserving any stronger non-profit governance, privacy and security requirements.

- Keep one canonical `main` for the stable public HPI site, plus a short-lived Preview branch only for real QA. Do not confuse public informational pages with making internal dashboards or beneficiary data public.
- Don't create duplicate Vercel, Neon or CircleCI resources. Prefer existing isolated synthetic QA, with a tracked temporary environment only when necessary.
- Record the owner, linked issue/PR, purpose, creation date, expected cleanup/review date (normally 7 days), costs/quotas and rollback for each temporary resource. Remove only after checking real dependencies and data/restore safety.
- Existing CircleCI website-quality, browser-accessibility, Vercel and other required checks **must not be bypassed** to save credits. No new paid API, subscription, upgrade or heavy cloud build without explicit approval.
- The Vercel ignored build step is restricted to commits changing **only root AGENTS.md**. Site/research/website content, accessibility, API, security, deployment configuration and dependencies must continue to run applicable tests and builds.
- Never use real beneficiary/customer data in QA or repurpose production authentication/storage for tests. At Done, record actual test evidence, production/preview state and safe cleanup, or a documented blocker.

**Governance**: this is an agent-operating rule; it does not replace HPI's product, legal, research or fundraising decisions.
