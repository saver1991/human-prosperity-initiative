# F0-03.1 — Critical methodological pre-review of prosperity measurement V0.1

**Date:** 5 November 2026. **Review type:** internal AI-assisted/public-source **desk critique** for independent reviewers. **NOT independent peer review, empirical validation, community consultation, an adopted framework or permission to collect participant data.** Document owner: current open-source repository maintainer. No external reviewer has signed this document.

## Materials checked

- [Candidate framework V0.1](F0-03-prosperity-measurement-framework-v0.1.md) — five dimensions, causal measurement guidance, three example packages, no universal index.
- [15 proposed indicator catalogue](F0-03-indicator-catalog-v0.1.csv) — draft operational definitions, data sensitivity and unvalidated roles.
- [F0-02 exploratory assessment](F0-02-opportunity-assessment.md) — **not** a systematic search, not an approved pilot.
- [Founding charter V0.4 candidate](../docs/founding-charter-ratification-candidate-v0.4.md) and [governance V0.2](../GOVERNANCE.md) — provisional, not ratified or incorporated.

## Overall desk verdict

**Promising and reviewable architecture, scientifically unvalidated and not study-ready.** Strong points: no invented composite index; differentiation of reach versus true benefit; explicitly considers nonparticipant harms, equity, negative evidence, costs and duration. Weak points: no identified study population/context, no validated country-specific instruments, no justified statistical design or access to authorised administrative data, no real community input or independent reviewer. It would be unsafe to describe this V0.1 as a measured improvement or an approved outcome framework.

### Review findings and actions

| ID | Priority | Finding | Required action / reviewer challenge | Gate |
| --- | --- | --- | --- | --- |
| M01 | High | V0.1 referenced a 2025 UNDP MPI source even though the **2026 MPI** is now published; different survey vintages and country coverage must be explicit. | Update context reference to [UNDP/OPHI MPI 2026](https://hdr.undp.org/content/2026-global-multidimensional-poverty-index); record 108-country coverage, 3 dimensions/10 indicators and household data requirements. Do not infer local individual intervention impacts from national MPI. | Reference correction in proposal; external validity still open |
| M02 | High | The three `candidate_primary_*` indicators are proposed before a population, comparator, mechanism or legally accessible data source has been selected. | For each future study require selection of **one** primary endpoint/estimand with unit, denominator, direction, time, missingness and defensible sample-size/precision, avoiding selection after outcomes are observed. | F0-02/F0-05 context and independent method sign-off |
| M03 | High | Administrative entitlement receipt can be delayed, partial, disputed or recorded after varying eligibility-assessment dates. | Define eligibility ascertainment, actual payment/benefit receipt, observation window, treatment vs control comparability, attrition and safeguards against advice causing benefits loss. Applications are process metrics. | Partner law/data access and pre-specification |
| M04 | High | Energy-cost burden ratio may move when income changes without any direct reduction in fuel hardship, and weather/tenure/tariff confound comparisons. | Compare appropriate time/price/season baselines; add material-hardship and tenant-versus-landlord outcomes; distinguish true household welfare from installed measures or calculated savings. | Context-specific validation |
| M05 | High | Sustained earnings can mask unsafe jobs, displacement or losses for comparable nonparticipants. | Predefine net real earnings, job-quality protections, exposure/follow-up, market boundaries and spillovers; do not publish causal claims from placement or enrollment alone. | Context-specific review and equity safeguards |
| M06 | High | `HPI-E-03` proposes cost per incremental outcome but ratio is unstable or misleading if effect is zero/negative or uncertain. | Report cost perspective, uncertainty and net incremental benefit separately; use cost-effectiveness ratios **only when interpretable**. Include adverse effects and participant time burdens; state not estimable where appropriate. | Economic evaluation reviewer |
| M07 | High | The draft catalogue refers to consented surveys/records, which **does not establish** the data controller's UK GDPR/local lawful basis or an appropriate special-category condition. | Separate study informed consent from lawful basis, data minimisation, ethical review, retention, small-cell suppression, safeguarding and independent access agreements. No identifying respondent records in public Git. [ICO research guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/the-research-provisions/principles-and-grounds-for-processing/). | Legal/ethics review |
| M08 | Medium | Subjective autonomy and hardship instruments may not preserve meaning across languages, cultures or disability access needs. | Demonstrate instrument validity/reliability, translation, measurement invariance and burdens in the actual community; do not mechanically transplant OECD national surveys. | Real community/instrument review |
| M09 | Medium | Multiple domains, overlapping outcomes and subgroup comparisons increase double-counting and selective reporting risk. | Specify primary family, multiplicity strategy, exploratory labels, subgroup power/uncertainty, relevant nonparticipants and no unconditional aggregation. | Analysis protocol reviewer |
| M10 | Medium | The draft lacks an operational response-to-review register, external reviewer independence verification and versioned sign-off. | Use the [independent review form](F0-03-independent-review-form.md), record each factual correction/objection, conflicting interpretations and actual COI disclosures. No V1.0 on the strength of a CI merge. | F0-03.1 #19 |

**Severity is a prioritisation of missing methods/safeguards**, not a claim of observed harm. No participant data have been inspected.

## Standards for an authorised future study

1. Publish population/country and a defensible, falsifiable question, not a global score.
2. Record an appropriate causal design/estimand and confounding/spillover assumptions with a decision on when randomisation is ethical (never withhold lawful entitlements).
3. Describe one selected primary participant outcome and a short secondaries/harms/cost set before data collection; specify data rights, comparator, uncertainty, attrition and follow-up.
4. Require independent methods and safeguarding sign-off; ethics and law are local and cannot be supplied by an open-source PR alone.
5. Publicly preserve negative or null evidence and deviations; never treat sample recruitment or website use as impact.

## Existing external frameworks and their limits (checked November 2026)

- [World Bank June 2025 global poverty line update](https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines): US$3/day at **2021 PPP**, a global *monetary poverty* benchmark. It does not measure full prosperity; local and temporal comparability need care.
- [UNDP Global MPI 2026](https://hdr.undp.org/content/2026-global-multidimensional-poverty-index) and [FAQs](https://hdr.undp.org/mpi-2026-faqs): household microdata across **health, education and living standards** (10 indicators), 108 countries. Country dashboards are not individual-level causal estimates.
- [OECD How's Life?](https://www.oecd.org/en/publications/how-s-life_23089679.html): wider well-being/inequality/future resources context. National frameworks do not prove any HPI intervention works or supply validated local scales automatically.
- [PRISMA 2020 reporting standard](https://www.prisma-statement.org/prisma-2020-checklist): useful when a future genuine systematic evidence review is conducted; HPI F0-02 has **not** earned that description.
- [ICO research provisions](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/the-research-provisions/principles-and-grounds-for-processing/): study participation consent and legal bases for data processing are distinct.

## Independent review protocol and disposition

- Publish this pre-review plus original source CSV and the [review form](F0-03-independent-review-form.md); invite methods/statistics, implementation/ethics, and affected-community critique. **Do not invent named experts, external review timestamps or endorsement.**
- For each independent submission, check actual reviewer role/conflict; link a public method-only response or securely record sensitive issues outside public GitHub with proper safeguards.
- Record `accept / revise / reject` with rationale, commit and unresolved dissent, including negative or inconsistent evidence.
- Only after country/population selection and independently documented validity/ethics decisions should V1.0 and an actual study protocol be considered. **No independent sign-off has occurred.**

**Release gate: F0-03.1 #19 REMAINS OPEN.** Internal editorial improvements can be merged safely; the scientific validation gate cannot be passed by the author of the draft or an AI assistant reviewing its own work.
