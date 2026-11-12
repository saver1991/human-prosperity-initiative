# WEB-03.5 — Accessibility, comprehension and real-user testing acceptance register

**Date:** 12 November 2026. This is an **acceptance protocol** and honest status record, not a legal conformance statement.

## Automated source and browser checks (run by CI on exact commit)

- Valid semantic page structure, skip-to-main, native mobile menu, six-area desktop navigation, tab/keyboard disclosure, no missing focus target.
- Real Chromium rendering and axe-core rule checks at 320px, 390px, 768px, 1440px, 200%/400% zoom-equivalent and text resize; no horizontal body overflow.
- /projects, /projects/newham, /tools, /updates, /research and trust/help pages: source chronology, correct canonical/metadata, working internal links, 1 H1, accessible controls.
- No synthetic number presented as human impact, no false cookie settings/reporting form, no unreviewed personal case data inputs or third-party tracking.

**Status:** exact post-merge CI evidence must be attached before declaring automated phase PASS. CI is necessary but not sufficient.

## Human acceptance (NOT COMPLETE)

- Real **VoiceOver** on Safari/macOS or iOS, **NVDA** with Windows browser and **TalkBack** on Android: navigation order, menu expanded/collapsed announcements, source warnings and understandable headings. Record device/browser/AT/version/commit/date, obstacles and fixes. No such real sessions have been claimed.
- Native zoom (200% and 400%) on real OS/browser rather than only viewport approximation, and visual contrast inspection for focus/links.
- Qualified user-research participants if appropriate, using actual representative journeys (visitor, independent researcher, tools user, prospective contributor); capture comprehension of NO-GO and modelled vs real outcomes. Do **not** recruit vulnerable residents or collect case data without safeguarding/ethics.
- Qualified professional review of privacy, legal identity, actual cookies/storage and confidential contact (WEB-03.6).

## Decision

**Automated engineering may close its technical tasks following exact-sha CI**, but WEB-03.5 human acceptance and qualified WCAG conformance claims remain OPEN until actual non-fabricated evidence exists. The public accessibility statement must continue to disclose these gaps. See [WEB-01 #9](https://github.com/svtmzt/human-prosperity-initiative/issues/9) and [WEB-03 #85](https://github.com/svtmzt/human-prosperity-initiative/issues/85).
