# Accessibility statement — current evidence and limitations

**Last updated: 12 November 2026. Status: not yet independently assessed for full conformance.**

HPI wants the public research site to be usable by people with different devices, abilities, languages and access needs. Our current **engineering target is WCAG 2.2 Level AA**, but we **do not claim full conformance**.

## What has been checked

The site uses semantic `main`, headings, labelled primary navigation, a skip-to-content link, keyboard-visible focus styles and responsive layouts. Automated CI runs Playwright/Chromium checks and axe accessibility assertions on published pages, including responsive widths and keyboard travel. These checks have succeeded for recent technical releases. They cannot establish that every real user with assistive technology can use the site.

## Known gaps and unverified experience

- **No accepted manual testing** has been recorded with real users using VoiceOver, TalkBack, NVDA or other assistive technologies.
- A comprehensive human screen-reader and plain-language comprehension review is pending.
- Some deep research and data tables are highly technical and may require additional readability/reflow work.
- The existing English-first experience and partial Italian translations do not constitute a full multilingual access programme.
- We cannot guarantee that third-party destinations (including GitHub) meet the same accessibility standards as this site.

## Improving access

The [WEB-03 accessibility improvement plan](https://github.com/svtmzt/human-prosperity-initiative/issues/85) and [public roadmap](https://human-prosperity-initiative.vercel.app/roadmap) track proposed remediation. We will record real testing and known exceptions rather than issue a blanket compliance badge.

You can access the [text-based documentation](https://human-prosperity-initiative.vercel.app/library), [plain-language Help](https://human-prosperity-initiative.vercel.app/help) and [current tools guidance](https://human-prosperity-initiative.vercel.app/research/responsible-tools). If you encounter a barrier, read [Contact & feedback](https://human-prosperity-initiative.vercel.app/contact): **a verified private accessibility inbox is not yet established**. Non-sensitive source/technical issues may be raised publicly only if you accept GitHub's visibility. Do not share personal disability or medical details.

**Reference:** [W3C — developing an accessibility statement](https://www.w3.org/WAI/planning/statements/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/). This statement's review status will change only after real evidence and accountable acceptance.
