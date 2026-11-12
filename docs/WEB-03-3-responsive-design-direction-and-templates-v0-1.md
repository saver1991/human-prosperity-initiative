# WEB-03.3 — Public experience: responsive design direction and template system V0.1

**Date:** 12 November 2026 · **State:** engineering direction chosen for implementation; **actual founder visual review and independent user testing remain outstanding**. This record is an accountable proposed design decision, not observed usability or a formal human acceptance.

## Alternatives considered

1. **Continuity-first evidence-led (selected for technical implementation).** Preserve HPI navy, lime and sage; modernise navigation, readable source-first project cards, no visual claims of measurable impact, semantic responsive templates. Lowest source breakage and maintenance cost.
2. **Research newsroom.** Strong editorial hierarchy and longitudinal research comparisons, but a large content rewrite risks presenting provisional science as mature and requires extensive copy editing.
3. **Live impact dashboard.** Strong visual impact, **rejected** for now: no valid HPI outcome numerator/denominator, independent review or field study; impact KPI imagery would be misleading.

The selected *implementation default* is continuity-first, without declaring founder signoff based solely on general development permission.

## Responsive components and content order

- **Global shell:** skip link, single landmark main, one H1, clear six-area primary navigation, native HTML `details/summary` menu on small screens and a secondary trust/help/footer; no JavaScript dependency for site navigation.
- **Home:** mission without false impact statistics, role-based paths, current Newham project summary with explicit **2023/24 historical model** label, research horizons, transparency and contribution.
- **Projects:** candid current status and a genuine evidence-first case detail. Real HPI project outcomes explicitly **unknown**.
- **Research:** readable questions and limitations before the full source archive; historic documents remain accessible with dated supersession guidance.
- **Tools:** four available *existing* research utilities exposed at one first-party directory. Detailed improvements remain RT-02.
- **About/Help/Legal:** dated Markdown source, correct provisional institutional and privacy facts, prominent missing human approval.
- **Updates:** editorial chronology and a source-controlled correction/supersession path, not invented real-time analytics or impact.

## Engineering tokens and accessibility constraints

Continue original `--navy: #101c29`, `--lime: #d1ef79`, ink, sage and paper; high-contrast focus rings and link underlines; minimum 44px mobile menu targets; no remote fonts, images or third-party trackers. Adaptive 320px, 390px, 768px and desktop layouts, 200%/400% approximated reflow, user-reduced motion, correct focus targets, keyboard disclosure. Do not call machine tests a WCAG 2.2 AA certification.

Review **before founder visual acceptance**: mobile menu position, screen reader landmark/navigation naming, contrast and native zoom, source chronology, all CTA routes, editorial readability and honest uncertainty. Affected-community testing may be ethically inappropriate until safeguarded and authorised.

**Evidence:** [WEB-03 #85](https://github.com/svtmzt/human-prosperity-initiative/issues/85), [IA V1](WEB-03-2-information-architecture-and-migration-v1.md), [technical acceptance snapshot](https://human-prosperity-initiative.vercel.app/site-web-03-technical-acceptance.json).
