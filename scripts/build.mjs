import {cp,mkdir,readFile,readdir,rm,writeFile} from "node:fs/promises";
import path from "node:path";
import {ORIGIN,STATIC_ROUTES,buildRouteIndex,escapeHtml,slug,renderMarkdown,renderCsv,parseCsv,sourceTitle} from "./site-content.mjs";
import {buildPublicRoadmap} from "./roadmap-model.mjs";
import {renderRoadmapOverview,renderInitiativeDetail} from "./roadmap-pages.mjs";
import {buildSourceCatalog,catalogCsvExport} from "../research-tools/source-catalog.mjs";
import {getCandidateIndicator} from "../research-tools/indicator-contract.mjs";
import {generateResearchArtifacts,PUBLIC_OUTPUTS} from "../research-tools/research-pipeline.mjs";

const ROOT="dist";
const publishedAt=new Date().toISOString();
const revision=(process.env.VERCEL_GIT_COMMIT_SHA || process.env.CIRCLE_SHA1 || "local-build").slice(0,40);
async function walk(dir){
 const out=[];
 for(const item of await readdir(dir,{withFileTypes:true})){
  if(item.name.startsWith("."))continue;
  const name=path.posix.join(dir,item.name);
  if(item.isDirectory())out.push(...await walk(name));
  else if(item.isFile() && /\.(md|csv)$/.test(item.name))out.push(name);
 }
 return out.sort();
}
const sources=[
 "README.md","GOVERNANCE.md","CONTRIBUTING.md","CODE_OF_CONDUCT.md",
 "LICENSE-DOCS.md","LICENSE",
 ...await walk("docs"),...await walk("research")
];
const routes=buildRouteIndex(sources);
if(routes.size!==sources.length)throw new Error("A public document has no generated route.");
const content=new Map(await Promise.all(sources.map(async source=>[source,await readFile(source,"utf8")])));
const descriptor=JSON.parse(await readFile("portfolio/project.json","utf8"));
if(descriptor.id!=="human-prosperity-initiative"||descriptor.visibility!=="public")throw new Error("Invalid public project manifest");
const publicRoadmap=buildPublicRoadmap(descriptor,JSON.parse(await readFile("portfolio/public-roadmap.json","utf8")),{revision});
const evidence=parseCsv(content.get("research/evidence-ledger.csv"));
const outcomeIndicator=getCandidateIndicator(content.get("research/F0-03-indicator-catalog-v0.1.csv"),"HPI-B-01");
if(outcomeIndicator.status!=="proposed_not_validated"||outcomeIndicator.unit!=="share")
 throw Error("Synthetic outcome lab cannot claim validated or non-share indicator");
const sourceRegistry=JSON.parse(await readFile("research/public-dataset-registry.json","utf8"));
const sourceCatalog=buildSourceCatalog({
 ledgerCsv:content.get("research/evidence-ledger.csv"),
 structuredCsv:content.get("research/F0-02-structured-evidence-2026-11-06.csv"),
 registry:sourceRegistry
});
const assessment=content.get("research/F0-02-opportunity-assessment.md");
const researchTopics=[...assessment.matchAll(/^### ([A-Z])\.\s+(.+)$/gm)]
 .map(match=>({letter:match[1],title:match[2],anchor:slug(match[1]+". "+match[2])}));
if(!researchTopics.length)throw new Error("No source-derived research areas found");
const docLinks=[...routes].map(([source,url])=>({source,url,title:sourceTitle(source,content.get(source))}));
const safe=escapeHtml;
const stamp='Published from GitHub '+safe(revision==="local-build"?"working tree":revision.slice(0,9))+" · "+safe(publishedAt.slice(0,16).replace("T"," "))+" UTC";
const nav='<nav aria-label="Main navigation"><a href="/mission">Mission</a><a href="/research">Research</a><a href="/roadmap">Roadmap</a><a href="/library">Library</a><a href="/contribute">Get involved</a></nav>';
function shell({title,description,section,body,route,lang="en",script="",stylesheet="",breadcrumb=""}){
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width, initial-scale=1">'+
  '<meta name="theme-color" content="#101c29">'+
  '<meta name="description" content="'+safe(description)+'">'+
  '<link rel="canonical" href="'+ORIGIN+route+'">'+
  '<meta property="og:title" content="'+safe(title)+' — Human Prosperity Initiative">'+
  '<meta property="og:url" content="'+ORIGIN+route+'">'+
  '<title>'+safe(title)+' — Human Prosperity Initiative</title>'+
  '<link rel="stylesheet" href="/styles.css">'+(stylesheet?'<link rel="stylesheet" href="'+safe(stylesheet)+'">':"")+'<link rel="icon" type="image/svg+xml" href="/favicon.svg">'+
  (script?'<script src="'+safe(script)+'" '+(["/progress.js","/outcome-lab.js"].includes(script)?'type="module"':"defer")+'></script>':"")+
  '</head><body><a class="skip" href="#main">Skip to main content</a>'+
  '<header class="header"><div class="wrap head-inner"><a class="logo" href="/" aria-label="HPI. Human Prosperity Initiative home"><span class="symbol" aria-hidden="true">✳</span> HPI<span class="lime">.</span><small>Human Prosperity<br>Initiative</small></a>'+
  nav+'<a class="nav-cta" href="/activity">Live progress ↗</a></div></header>'+
  '<main id="main" class="content-page"><section class="content-hero"><div class="wrap">'+
  '<div class="content-breadcrumb">'+(breadcrumb||'<a href="/">Home</a> / <a href="/library">Knowledge library</a> / '+safe(section))+'</div>'+
  '<span class="section-label">'+safe(section)+'</span><h1>'+safe(title)+'</h1>'+
  '<p class="content-lede">'+safe(description)+'</p></div></section>'+
  '<div class="wrap content-layout">'+body+'</div></main>'+
  '<footer class="footer"><div class="wrap footer-bottom"><span>© 2026 HPI contributors · Working name, not a registered foundation</span>'+
  '<span><a href="/library">Knowledge library</a> · <a href="/activity">Activity</a> · <a href="/status">Publication status</a> · '+stamp+'</span></div></footer>'+
  '</body></html>';
}
async function publish(route,html){
 const target=path.posix.join(ROOT,route==="/"?"/index.html":route+".html");
 await mkdir(path.posix.dirname(target),{recursive:true});
 await writeFile(target,html,"utf8");
}
await rm(ROOT,{recursive:true,force:true});await mkdir(ROOT,{recursive:true});
await cp("site/styles.css","dist/styles.css");
await cp("site/roadmap.css","dist/roadmap.css");
await cp("site/favicon.svg","dist/favicon.svg");
await cp("site/activity.js","dist/activity.js");
await cp("site/freshness.js","dist/freshness.js");
await cp("site/progress.js","dist/progress.js");
await cp("site/progress-policy.js","dist/progress-policy.js");
await cp("site/research-catalog.js","dist/research-catalog.js");
await cp("site/outcome-lab.js","dist/outcome-lab.js");
await cp("research-tools/outcome-evaluation.mjs","dist/research-outcome-evaluation.js");
await cp("research/synthetic-outcome-scenario-v1.json","dist/research-synthetic-outcome-template.json");
await cp("research/notebooks/rt01-public-source-workflow.ipynb","dist/research-reproducibility-notebook.ipynb");
const researchBundle=await generateResearchArtifacts({load:source=>readFile(source,"utf8")});
for(const [name,filename] of Object.entries(PUBLIC_OUTPUTS))
 await writeFile(ROOT+"/"+filename,researchBundle.outputs[name],"utf8");
await writeFile(ROOT+"/research-source-catalog.json",JSON.stringify(sourceCatalog,null,2)+"\n");
await writeFile(ROOT+"/research-source-catalog.csv",catalogCsvExport(sourceCatalog));
const sectionFor=source=>source.startsWith("research/")?"Research":
 source.startsWith("docs/")?"Documentation":"Community and governance";
for(const entry of docLinks){
 const text=content.get(entry.source);
 const rendered=entry.source.endsWith(".csv")?renderCsv(text):
  entry.source==="LICENSE"?'<pre class="doc-code">'+safe(text)+'</pre>':
  renderMarkdown(text,entry.source,routes,{skipFirstHeading:true});
 const description="Canonical HPI "+(entry.source.endsWith(".csv")?"data table":"document")+
  " · Automatically published from the public GitHub source. Research findings and plans are provisional unless explicitly reviewed.";
 const article='<article class="doc-content">'+rendered+'</article>'+
  '<aside class="doc-side"><div class="doc-side-card"><strong>Published source</strong><p>'+safe(entry.source)+'</p>'+
  '<p>This page is generated directly from the public repository. It is not a separate copy to maintain.</p>'+
  '<a href="/library">Browse all documents ↗</a>'+
  '<a href="https://github.com/saver1991/human-prosperity-initiative/blob/main/'+encodeURI(entry.source)+'" target="_blank" rel="noopener noreferrer">View or propose edits on GitHub ↗</a>'+
  '</div></aside>';
 await publish(entry.url,shell({title:entry.title,description,section:sectionFor(entry.source),
  body:article,route:entry.url,lang:entry.source==="docs/charter.it.md"?"it":"en"}));
}
// Preserve a readable, first-party copy of the authored Markdown source when
// /roadmap becomes the navigable dashboard. GitHub remains the edit/history path.
await publish("/library/docs/roadmap-source",shell({
 title:"Roadmap source & decisions",section:"Canonical programme plan",
 description:"Read the complete source-based HPI programme roadmap, scientific stages and planning boundaries on this website.",
 route:"/library/docs/roadmap-source",
 body:'<article class="doc-content">'+renderMarkdown(content.get("docs/roadmap.md"),"docs/roadmap.md",routes,{skipFirstHeading:true})+'</article>'+
 '<aside class="doc-side"><div class="doc-side-card"><strong>Canonical source</strong><p>docs/roadmap.md · versioned public repository</p>'+
 '<a href="/roadmap">Return to the visual roadmap ↗</a>'+
 '<a href="https://github.com/saver1991/human-prosperity-initiative/blob/main/docs/roadmap.md" target="_blank" rel="noopener noreferrer">Edit or inspect source on GitHub ↗</a></div></aside>'
}));
await publish("/roadmap",shell({
 title:"Our public roadmap",section:"Project roadmap",
 description:"Explore HPI's scientific and website initiatives, current stages, open decision gates and published work, without leaving the website.",
 route:"/roadmap",stylesheet:"/roadmap.css",script:"/progress.js",
 breadcrumb:'<a href="/">Home</a> / Roadmap',
 body:renderRoadmapOverview(publicRoadmap,{detailsEnabled:true})
}));
await writeFile(ROOT+"/public-roadmap.json",JSON.stringify(publicRoadmap,null,2)+"\n");
// Every published initiative has its own canonical, read-only status page.
// The science/ethics gates remain editorial snapshots, not live approvals.
for(const initiative of publicRoadmap.initiatives){
 const detailRoute="/initiatives/"+slug(initiative.id);
 await publish(detailRoute,shell({
  title:initiative.name,section:"Initiative "+initiative.id,
  description:initiative.summary,route:detailRoute,stylesheet:"/roadmap.css",script:"/progress.js",
  breadcrumb:'<a href="/">Home</a> / <a href="/roadmap">Roadmap</a> / '+safe(initiative.id),
  body:renderInitiativeDetail(initiative,publicRoadmap)
 }));
}


function cards(items){
 return '<div class="catalog-grid">'+items.map(doc=>
  '<a class="catalog-card" href="'+doc.url+'"><span class="catalog-type">'+safe(sectionFor(doc.source))+'</span>'+
  '<h2>'+safe(doc.title)+'</h2><p>'+safe(doc.source)+'</p><span class="catalog-open">Read on HPI ↗</span></a>'
 ).join("")+"</div>";
}
await publish("/research",shell({
 title:"Research & evidence",section:"Research library",
 description:"Explore every published HPI research document, study note, evidence register and reproducible protocol. New source files appear here automatically on deployment.",
 route:"/research",body:'<div class="index-content"><p class="doc-count">'+
 docLinks.filter(x=>x.source.startsWith("research/")).length+" research resources · "+
 (evidence.length-1)+" evidence ledger entries</p>"+
 '<p class="status-note">F0-02 remains preliminary. No systematic review or field experiment has been completed.</p>'+
 '<p><a href="/research/source-catalog">Browse the source catalogue and licence status ↗</a> · <a href="/research/outcome-lab">Try the synthetic outcome lab ↗</a> · <a href="/research/reproducibility">Inspect reproducible open science ↗</a></p>'+
 cards(docLinks.filter(x=>x.source.startsWith("research/")))+
 '<p><a href="/roadmap">See how this work fits into the roadmap ↗</a></p></div>'
}));
const sourceRows=sourceCatalog.records.map(item=>{
 const searchable=[item.id,item.kind,item.titleOrType,item.geography,item.domain,item.doi||""].join(" ");
 return '<tr data-source-record data-source-kind="'+safe(item.kind)+
  '" data-source-search="'+safe(searchable)+'">'+
  '<td><strong>'+safe(item.id)+'</strong></td>'+
  '<td>'+safe(item.kind==="evidence_reference"?"Research reference":"Dataset candidate")+'</td>'+
  '<td>'+safe(item.titleOrType)+'</td>'+
  '<td>'+safe(item.geography)+'</td>'+
  '<td>'+safe(item.licenseStatus)+'<small> / '+safe(item.rightsReviewStatus)+'</small></td>'+
  '<td>'+safe(item.retraction)+'</td>'+
  '<td><a href="'+safe(item.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Publisher ↗</a></td></tr>';
}).join("");
await publish("/research/source-catalog",shell({
 title:"Source catalogue & data rights",section:"Research instruments",
 description:"Search versioned research references and candidate public datasets. The catalogue includes sources and licence uncertainty, not downloaded personal records or validated impact.",
 route:"/research/source-catalog",script:"/research-catalog.js",
 breadcrumb:'<a href="/">Home</a> / <a href="/research">Research</a> / Source catalogue',
 body:'<div class="index-content"><p class="status-note">Metadata only. '+safe(String(sourceCatalog.totals.evidenceReferences))+
  ' evidence references + '+safe(String(sourceCatalog.totals.datasetCandidates))+
  ' source candidates. <strong>No third-party datasets have been imported, and source licences/retractions are not universally verified.</strong></p>'+
  '<p>Source snapshot: <a href="/research-source-catalog.json">Download JSON metadata</a> · '+
  '<a href="/research-source-catalog.csv">Download safe CSV metadata</a> · '+
  '<a href="/library/docs/rt-01-1-source-catalog-method-v1">Read the method and limits</a></p>'+
  '<form role="search" aria-label="Find research sources" class="source-search">'+
  '<label for="source-filter">Search metadata</label> '+
  '<input id="source-filter" type="search" maxlength="120" placeholder="Study, source, country or DOI"> '+
  '<label for="source-kind">Source type</label> '+
  '<select id="source-kind"><option value="all">All sources</option><option value="evidence_reference">Evidence references</option>'+
  '<option value="public_dataset_candidate">Dataset candidates</option></select></form>'+
  '<p id="source-count" role="status" aria-live="polite">'+sourceCatalog.records.length+
  ' source records available (not impact validations)</p>'+
  '<div class="doc-table-wrap" role="region" tabindex="0" aria-label="Searchable public source metadata">'+
  '<table><thead><tr><th scope="col">ID</th><th scope="col">Type</th><th scope="col">Source</th>'+
  '<th scope="col">Geography</th><th scope="col">Licence / Review</th>'+
  '<th scope="col">Retraction check</th><th scope="col">Publisher</th></tr></thead><tbody>'+
  sourceRows+'</tbody></table></div>'+
  '<p>Publishing a reference is not redistribution permission, peer review, full-text verification or proof of effectiveness.</p></div>'
}));
await publish("/research/outcome-lab",shell({
 title:"Synthetic outcomes & uncertainty lab",section:"Research instruments",
 description:"Explore draft F0-03 benefit-receipt measures, observed rates, missing follow-up and conditional uncertainty on entirely fictional group counts.",
 route:"/research/outcome-lab",script:"/outcome-lab.js",
 breadcrumb:'<a href="/">Home</a> / <a href="/research">Research</a> / Synthetic outcome lab',
 body:'<div class="index-content">'+
  '<p class="status-note"><strong>SYNTHETIC ONLY. No HPI participant data, programme effectiveness, causal estimate or independently validated indicator.</strong></p>'+
  '<p>The example uses draft indicator <strong>'+safe(outcomeIndicator.id)+
  '</strong> (verified receipt; status: <strong>'+safe(outcomeIndicator.status)+
  '</strong>). This lab runs in the browser only; submitted counts are not transmitted or retained.</p>'+
  '<form id="outcome-demo" aria-label="Synthetic outcome comparison">'+
  '<fieldset><legend>Fictional reference group</legend>'+
  '<p><label for="ref-eligible">Eligible (synthetic)</label> <input id="ref-eligible" type="number" min="1" max="50000" value="100" required></p>'+
  '<p><label for="ref-received">Observed receipts</label> <input id="ref-received" type="number" min="0" max="50000" value="6" required></p>'+
  '<p><label for="ref-missing">Missing follow-up</label> <input id="ref-missing" type="number" min="0" max="50000" value="0" required></p>'+
  '</fieldset>'+
  '<fieldset><legend>Fictional comparison group</legend>'+
  '<p><label for="comp-eligible">Eligible (synthetic)</label> <input id="comp-eligible" type="number" min="1" max="50000" value="100" required></p>'+
  '<p><label for="comp-received">Observed receipts</label> <input id="comp-received" type="number" min="0" max="50000" value="11" required></p>'+
  '<p><label for="comp-missing">Missing follow-up</label> <input id="comp-missing" type="number" min="0" max="50000" value="0" required></p>'+
  '</fieldset>'+
  '<button type="submit">Calculate synthetic comparison</button></form>'+
  '<p id="outcome-demo-result" role="status" aria-live="polite">Example loads with JavaScript; no real data are processed.</p>'+
  '<p><button id="run-synthetic-simulation" type="button">Run seeded hypothetical simulation</button></p>'+
  '<p id="simulation-result" role="status" aria-live="polite">Simulation not yet requested.</p>'+
  '<details><summary>Methodology, uncertainty and limits</summary>'+
  '<p>Wilson intervals describe conditional binomial sampling uncertainty, and the Newcombe-Wilson interval compares two independently sampled proportions under that assumption. They do not correct selection, nonrandom assignment, missing outcomes, weak source rights or research design. Missingness bounds are worst/best case sensitivity checks, not confidence intervals. A seeded simulation demonstrates hypothetical model variability, not observed policy impact.</p>'+
  '</details>'+
  '<p><a href="/research-synthetic-outcome-template.json">Synthetic example JSON</a> · '+
  '<a href="/library/docs/rt-01-2-outcome-evaluation-method-v1">Evaluation method and review gates</a> · '+
  '<a href="/research/source-catalog">Source provenance catalogue</a></p></div>'
}));
const manifestRows=researchBundle.manifest.sourceInputs.map(source=>
 '<tr><td>'+safe(source.path)+'</td><td><code>'+
 safe(source.sha256.slice(0,16))+'…</code></td><td>'+safe(String(source.bytes))+'</td></tr>').join("");
await publish("/research/reproducibility",shell({
 title:"Reproducible open-science pipeline",section:"Research instruments",
 description:"Inspect source-to-output lineage, citations, synthetic calculations and research limitations with byte-addressable, versioned JSON artifacts.",
 route:"/research/reproducibility",
 breadcrumb:'<a href="/">Home</a> / <a href="/research">Research</a> / Reproducibility',
 body:'<div class="index-content">'+
  '<p class="status-note"><strong>Technical reproducibility only.</strong> All public-source evidence is metadata and the outcome example is fictional. No independently reviewed treatment effect, legal permission to redistribute external datasets or human participant study is claimed.</p>'+
  '<h2>Research pipeline checks</h2>'+
  '<p>Existing public references: <strong>'+safe(String(researchBundle.report.sourceAudit.publicReferenceCount))+'</strong>. Abstract-level research records: <strong>'+
  safe(String(researchBundle.report.sourceAudit.structuredAbstractOrSummaryCount))+'</strong>. Dataset candidates (not downloaded): <strong>'+
  safe(String(researchBundle.report.sourceAudit.curatedDatasetCandidateCount))+'</strong>.</p>'+
  '<p>Illustrative benefit-receipt comparison: <strong>'+safe(String(researchBundle.report.syntheticResult.observedDifferencePercentagePoints))+
  ' percentage points</strong>; causal interpretation: <strong>'+safe(researchBundle.report.syntheticResult.causalInterpretation)+
  '</strong>. The simulation is theoretical and can neither validate an outcome measure nor determine policy effectiveness.</p>'+
  '<h2>Versioned, auditable artifacts</h2><ul>'+
  '<li><a href="/research-pipeline-report.json">Pipeline report (JSON)</a></li>'+
  '<li><a href="/research-pipeline-manifest.json">Source and output SHA-256 manifest (JSON)</a></li>'+
  '<li><a href="/research-citation-manifest.json">Citation and source-rights manifest (JSON)</a></li>'+
  '<li><a href="/research-data-dictionary.json">Data dictionary (JSON)</a></li>'+
  '<li><a href="/research-revision-log.json">Correction and supersession history (JSON)</a></li>'+
  '<li><a href="/research-reproducibility-notebook.ipynb">Optional example notebook (Jupyter format)</a></li>'+
  '</ul>'+
  '<h2>Public input provenance</h2><div class="doc-table-wrap" role="region" tabindex="0" aria-label="Content hashes for research pipeline inputs"><table>'+
  '<thead><tr><th scope="col">Source</th><th scope="col">SHA-256 prefix</th><th scope="col">UTF-8 bytes</th></tr></thead><tbody>'+
  manifestRows+'</tbody></table></div>'+
  '<p>Full hashes and exact byte lengths are in the JSON manifest. Source code uses Node.js 22 standard-library utilities, CircleCI and the existing Git repository; no separate paid data pipeline or GitHub Actions are required.</p>'+
  '<h2>Reuse and independent review</h2><p>Software is MIT; original HPI-authored documentation is CC BY 4.0. These licences <strong>do not cover third-party research or datasets</strong>. Source rights, scientific methods, human research consent and real-world impact still require separate review.</p>'+
  '<p><a href="/library/docs/rt-01-3-reproducible-open-science-v1">Full method, reproduction and correction rules</a> · <a href="/research/source-catalog">Source catalogue</a> · <a href="/research/outcome-lab">Hypothetical outcomes lab</a> · <a href="/status">Published Git revision</a></p></div>'
}));
await publish("/library",shell({
 title:"Open knowledge library",section:"Published documents",
 description:"Browse research, the founding charter, governance and all public documents. Newly added Markdown and CSV files are automatically included.",
 route:"/library",body:'<div class="index-content"><p class="doc-count">'+docLinks.length+
 ' public source files · Automatically generated at deployment</p>'+
 '<h2>Research</h2>'+cards(docLinks.filter(x=>x.source.startsWith("research/")))+
 '<h2>Foundations, governance and operations</h2>'+cards(docLinks.filter(x=>!x.source.startsWith("research/")))+
 '</div>'
}));
await publish("/activity",shell({
 title:"Public roadmap activity",section:"Current work",
 description:"Live public GitHub issues are displayed here without leaving HPI. The list updates when this page is opened; collaboration still happens on GitHub.",
 route:"/activity",script:"/activity.js",
 body:'<div class="index-content"><p class="status-note">Issue statuses are loaded on demand from the public project board and cached briefly. Research progress is not a measure of participant impact.</p>'+
 '<p><a href="/roadmap">Read the full roadmap ↗</a> · <a href="/contribute">How to contribute ↗</a></p>'+
 '<p id="issue-status" role="status" aria-live="polite">Loading current public tasks…</p>'+
 '<section id="issue-list" class="issue-list" aria-label="Current public issues"></section>'+
 '<noscript><p>Enable JavaScript for the latest issue statuses, or visit the public GitHub issue tracker.</p></noscript></div>'
}));
await publish("/status",shell({
 title:"Publication freshness",section:"Transparency and release status",
 description:"Verify whether the currently published HPI website matches the latest public GitHub main revision, with clear uncertainty during provider outages.",
 route:"/status",script:"/freshness.js",
 body:'<div class="index-content freshness-layout">'+
 '<p class="status-note">HPI knowledge pages are built from the public repository. Publication may briefly lag a merge, or remain on the last working version if a build fails. This check compares two public sources with a short cache.</p>'+
 '<div class="freshness-panel"><span class="section-label">LIVE PUBLICATION COMPARISON</span>'+
 '<h2 id="freshness-status" role="status" aria-live="polite" class="freshness-state">Checking the public revision…</h2>'+
 '<p id="freshness-detail">Reading the public site and canonical GitHub branch.</p>'+
 '<div class="freshness-versions"><div><small>GitHub main</small><strong id="freshness-source">Checking…</strong></div>'+
 '<div><small>Published website</small><strong id="freshness-published">Checking…</strong></div>'+
 '<div><small>Last checked</small><strong id="freshness-checked">Checking…</strong></div></div></div>'+
 '<p>The status check is not an uptime guarantee or scientific peer review. It updates on demand and is cached for approximately five minutes. No subscriber information, user identifiers or credentials are collected by this feature.</p>'+
 '<p><a href="/publication.json">Inspect the exact public build provenance ↗</a> · <a href="/library/docs/website-publishing">Read the monitoring method ↗</a></p>'+
 '</div>'
}));

let homepage=await readFile("site/index.html","utf8");
const topicsHtml='<div class="topics">'+researchTopics.map((topic,index)=>
 '<a href="/research/f0-02-opportunity-assessment#'+topic.anchor+'"><span>'+String(index+1).padStart(2,"0")+
 '</span><div><strong>'+safe(topic.title)+'</strong><small>Read the source-based research assessment</small></div><span>↗</span></a>'
).join("")+"</div>";
const program=descriptor.initiatives||[];
const summary=["Now","Next","Later"].map(horizon=>{
 const item=program.find(x=>x.horizon===horizon && (horizon!=="Now"||x.id===descriptor.currentInitiative))||
 program.find(x=>x.horizon===horizon);
 if(!item)throw new Error("Missing roadmap stage "+horizon);
 return '<article><small>'+safe(horizon.toUpperCase()+" / "+item.id)+'</small><h3>'+
 safe(item.name)+'</h3><p>'+safe("Current planning status: "+item.status.replace(/_/g," ")+
 ". Read the full roadmap for dependencies, evidence and decision gates.")+'</p></article>';
}).join("");
const topicsSource=researchTopics.length;
const substitutions=new Map([
 ["{{HPI_HORIZONS}}",String((descriptor.programmes||[]).length)],
 ["{{HPI_INITIATIVES}}",String(program.length)],
 ["{{HPI_RESEARCH_TOPICS_COUNT}}",String(topicsSource).padStart(2,"0")],
 ["{{HPI_EVIDENCE_COUNT}}",String(evidence.length-1).padStart(2,"0")],
 ["{{HPI_TOPICS}}",topicsHtml],
 ["{{HPI_TIMELINE}}",summary],
 ["{{HPI_CURRENT_INITIATIVE}}",safe(descriptor.currentInitiative)],
 ["{{HPI_BUILD_STAMP}}",stamp]
]);
for(const [placeholder,replacement] of substitutions){
 if(!homepage.includes(placeholder))throw new Error("Homepage placeholder missing: "+placeholder);
 homepage=homepage.replaceAll(placeholder,replacement);
}
await publish("/",homepage);
const allRoutes=[...new Set([...STATIC_ROUTES,...routes.values(),"/library/docs/roadmap-source","/research/source-catalog","/research/outcome-lab","/research/reproducibility",...publicRoadmap.initiatives.map(x=>"/initiatives/"+slug(x.id))])].sort();
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+
 allRoutes.map(route=>'<url><loc>'+ORIGIN+(route==="/"?"/":route)+'</loc></url>').join("")+
 '</urlset>\n';
await writeFile(ROOT+"/sitemap.xml",xml);
await writeFile(ROOT+"/robots.txt","User-agent: *\nAllow: /\nSitemap: "+ORIGIN+"/sitemap.xml\n");
await writeFile(ROOT+"/publication.json",JSON.stringify({
 status:"published_from_git",revision,generatedAt:publishedAt,
 sourceFileCount:docLinks.length,sourcePaths:docLinks.map(x=>x.source),
 routeCount:allRoutes.length,ledgerEntryCount:evidence.length-1,sourceCatalogEntryCount:sourceCatalog.totals.all,researchPipelineVersion:researchBundle.manifest.pipelineVersion,activeInitiative:descriptor.currentInitiative
},null,2)+"\n");
console.log("HPI published: "+docLinks.length+" document routes, "+allRoutes.length+
 " total routes, "+(evidence.length-1)+" evidence entries; revision "+revision);
