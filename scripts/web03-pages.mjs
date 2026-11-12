/**
 * WEB-03 first-party editorial destinations.
 * No data collection, client-side persistence, analytics or third-party scripts.
 * Tool UIs themselves remain RT-02's separately scoped work.
 */
const feature=(eyebrow,title,url,description,foot)=>`<article class="feature-card"><span class="feature-kicker">${eyebrow}</span><h2><a href="${url}">${title}</a></h2><p>${description}</p><span class="feature-foot">${foot}</span></article>`;
const featureGrid=items=>'<div class="feature-grid">'+items.map(i=>feature(...i)).join('')+'</div>';
export async function publishWeb03Pages({publish,shell}){
 await publish("/projects",shell({
  title:"Projects",section:"Public-interest projects",route:"/projects",
  description:"Public-source project research, evidence limits, and transparent approval gates. This is not a benefits application or a field study.",
  breadcrumb:'<a href="/">Home</a> / Projects',
  body:`<div class="index-content project-landing"><section class="editorial-intro"><span class="eyebrow-dark">EARLY-STAGE PUBLIC RESEARCH</span><h2>Start with a question, not a promise.</h2><p>HPI investigates barriers to economic security. We make sources, counter-evidence and unresolved decisions visible so everyone can evaluate the work.</p><p class="status-note"><strong>Desk research only.</strong> No HPI participants, completed field trials, verified poverty reduction, incorporated foundation or funding awarded.</p></section>`+
  featureGrid([
   ["01 · NEWHAM / UNITED KINGDOM","Pension Credit research readiness","/projects/newham","What published statistics tell us—and what only an ethical independent study could establish.","Source-verified desk study · Fieldwork NO-GO"],
   ["02 · RESEARCH METHODS","Research and evidence","/research","Review methods, primary sources, uncertainties and independent-review requirements.","Scientific V1.0 remains unratified"],
   ["03 · OPEN RESEARCH","Working research tools","/tools","Find the existing source catalogue, synthetic lab, reproducibility pipeline and responsible-tools guidance.","Technical instruments · Not personal advice"]
  ])+`<p>Looking for original materials? <a href="/library">Browse the complete source archive</a> or <a href="/roadmap">read the public roadmap</a>.</p></div>`
 }));
 await publish("/projects/newham",shell({
  title:"Newham: Pension Credit research",section:"Projects / Newham",route:"/projects/newham",
  description:"Historical Newham public statistics and the unanswered question of whether an independent future study could add value beyond existing support.",
  breadcrumb:'<a href="/">Home</a> / <a href="/projects">Projects</a> / Newham',
  body:`<div class="index-content project-detail">
   <p class="status-note"><strong>NO-GO FOR FIELDWORK.</strong> This is a public-source feasibility assessment, not an approved pilot, an individual eligibility checker or a benefits service. Existing council programmes are not operated by HPI.</p>
   <div class="fact-strip"><div><strong>2023/24</strong><span>Period of DWP model</span></div><div><strong>78%</strong><span>Modelled local household receipt, not HPI impact</span></div><div><strong>Unknown</strong><span>Verified HPI outcomes</span></div></div>
   <h2>Why examine this problem?</h2><p>Newham has substantial older-age income deprivation. That does not itself establish individual Pension Credit eligibility. A future study would need lawful data access, independent review and genuine additionality over the existing Our Newham Money service.</p>
   <h2>What is actually known?</h2><p>The DWP 2023/24 administrative model estimates <strong>11,300</strong> potentially eligible Newham households, <strong>8,800</strong> in receipt, and <strong>2,500</strong> potentially not in receipt: a <strong>78%</strong> rounded caseload receipt estimate. A separate <strong>86%</strong> is an expenditure rate. The <strong>62%</strong> Great Britain take-up estimate comes from a different survey series and period. These figures must not be pooled or presented as HPI results.</p>
   <p class="source-note"><a href="/research/new-02-newham-source-reconciliation-additionality-v0-2">Verified NEW-02 source reconciliation</a> · <a href="/research-newham-dwp-official-facts.json">Download primary-source provenance</a></p>
   <h2>Decisions and protections</h2><ol class="project-steps"><li><strong>Completed:</strong> public-source reconciliation and reproducible extraction.</li><li><strong>Completed:</strong> proposed study concept and internal methodological challenge.</li><li><strong>Not completed:</strong> actual independent reviewers, lawful sponsor, safeguarding, field permissions and verified HPI beneficiary outcomes.</li></ol>
   <p><a href="/research/newham-prepilot">Current pre-pilot NO-GO decision</a> · <a href="/research/newham-pension-credit">Earlier F0-03 desk report, now contextualised</a> · <a href="/research-integrity">Corrections and integrity</a></p></div>`
 }));
 await publish("/tools",shell({
  title:"Research tools",section:"Open research tools",route:"/tools",
  description:"Find four existing public-source and synthetic research utilities, their safe inputs and methodological limits. Full tool UX improvements are separately planned under RT-02.",
  breadcrumb:'<a href="/">Home</a> / Tools',
  body:`<div class="index-content"><section class="editorial-intro"><span class="eyebrow-dark">PUBLIC SOURCES + SYNTHETIC MODELS</span><h2>Explore the evidence. Challenge the method.</h2><p>These are existing technical research utilities, not individual benefit eligibility checks. Do not submit personal, financial, welfare or health records. Data rights and independent scientific approval remain separate gates.</p></section>`+
  featureGrid([
   ["01 · METADATA ONLY","Source Catalogue","/research/source-catalog","Search 39 research references and three candidate public datasets; examine incomplete rights and provenance.","References, not imported datasets"],
   ["02 · SYNTHETIC ONLY","Outcome Lab","/research/outcome-lab","Explore hypothetical scenarios and uncertainty without presenting simulated changes as measured impact.","No personal data or real interventions"],
   ["03 · REPRODUCIBILITY","Research Pipeline","/research/reproducibility","Inspect versioned commands, SHA-256 provenance, artefact manifests and an optional notebook.","Open methods; source rights still matter"],
   ["04 · TRUST & SAFETY","Responsible Tools","/research/responsible-tools","Understand privacy-by-default, licences, independent review and research authorisation boundaries.","External approval remains pending"]
  ])+`<p class="status-note">RT-02 will improve usability and individual tools separately. This WEB-03 hub is a discoverability layer, not a scientific certification.</p></div>`
 }));
 await publish("/updates",shell({
  title:"Editorial updates & corrections",section:"Publication transparency",route:"/updates",
  description:"Dated HPI website changes, research corrections, translation scope and document stewardship—not a claim of human impact.",
  breadcrumb:'<a href="/">Home</a> / Editorial updates',
  body:`<div class="index-content"><p class="status-note"><strong>Website updates are not human outcomes.</strong> These entries describe changes to publicly available material, not field interventions.</p>
  <ol class="update-timeline">
   <li><time datetime="2026-11-12">12 November 2026</time><h2>WEB-03 navigation and evidence discovery</h2><p>First-party Projects and Tools discovery pages, source chronology, responsive menu and content orientation. Release details are documented in the <a href="/library/docs/web-03-7-editorial-maintenance-language-policy-v0-1">editorial policy</a>.</p></li>
   <li><time datetime="2026-11-12">12 November 2026</time><h2>Help, legal and trust information</h2><p>Eleven source-backed public pages were published. Real controller, hosting retention, secure human contact and qualified legal review are still missing.</p></li>
   <li><time datetime="2026-11-09">9 November 2026</time><h2>Newham official-source reconciliation</h2><p>Verified historical 2023/24 DWP model extract and provenance. This does not establish an actual participant outcome. <a href="/research/new-02-newham-source-reconciliation-additionality-v0-2">Read the source reconciliation</a>.</p></li>
  </ol>
  <h2>How to request a correction</h2><p>Report non-sensitive evidence disagreements with a dated source, affected claim and reasoning through <a href="/contribute">public contribution guidance</a>. A permanent correction retains the previous version and discloses what changed. Do not post personal welfare or medical details in public channels; no secure private beneficiary reporting service is operational.</p>
  <p><a href="/status">Check the published Git revision</a> · <a href="/library/docs/web-03-7-editorial-maintenance-language-policy-v0-1">Editorial, language and supersession policy</a></p></div>`
 }));
}
