# Cookies & device storage — current public information

**Last updated: 12 November 2026. Status: source-checked disclosure with hosting runtime inventory and privacy review still pending.** This is **not** a statement that no cookies exist.

## What we have checked

HPI's versioned public browser code (`site/*.js`, the homepage and build configuration) currently does **not deliberately set cookies, localStorage, sessionStorage, advertising tags, analytics beacons or fingerprinting scripts**. The Source Catalogue and Synthetic Outcome Lab are designed to process public metadata or fictional inputs within the browser. Activity and Status call only HPI's own read-only endpoints.

## What is not yet established

The site is hosted by **Vercel**. Hosting, security mechanisms, deployment-protection previews, edge infrastructure, browser intermediaries or third-party sites opened voluntarily may use cookies or similar storage independently of our own site JavaScript. We have **not completed an all-browser, all-region production storage inventory** or confirmed provider log/retention settings. We therefore cannot guarantee that no storage/access technology is in use.

## Cookie consent and settings

Our present public site does **not include a cookie preference banner** because no HPI-specific non-essential cookie/advertising/analytics function has been identified in the source code. **That is a provisional design decision, not proof of a PECR exemption.** If actual runtime testing identifies non-exempt storage or tracking, the responsible operator must stop non-essential storage until appropriate information and valid choice controls are in place. A real preferences page would then be provided; **there is no functional /cookie-settings panel at present.**

Browser settings may allow you to inspect, clear or restrict cookies for this site, although blocking essential site/security features can sometimes affect functionality. External providers such as GitHub control their own websites; see their published information for those domains.

## How to verify or challenge

- Inspect browser developer tools under Storage/Application for this domain and review cookies and network requests. This is user guidance, not a completed HPI audit.
- For what HPI may process when delivering pages, see [Privacy & data handling](https://human-prosperity-initiative.vercel.app/privacy).
- The live storage/provider inventory, independent legal assessment and conditional preference controls remain in [WEB-03.6 issue #89](https://github.com/svtmzt/human-prosperity-initiative/issues/89).

**Reference:** [ICO final guidance on storage and access technologies, 29 April 2026](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/). Some exempt purposes do not require consent, but the applicable exceptions must be assessed against the real technology and purpose. Do not substitute a decorative banner for actual choices.
