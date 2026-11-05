import {cp,mkdir,readFile,readdir,rm,writeFile} from "node:fs/promises";
import path from "node:path";
import {ORIGIN,STATIC_ROUTES,buildRouteIndex,escapeHtml,slug,renderMarkdown,renderCsv,parseCsv,sourceTitle} from "./site-content.mjs";

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
const evidence=parseCsv(content.get("research/evidence-ledger.csv"));
const assessment=content.get("research/F0-02-opportunity-assessment.md");
const researchTopics=[...assessment.matchAll(/^### ([A-Z])\.\s+(.+)$/gm)]
 .map(match=>({letter:match[1],title:match[2],anchor:slug(match[1]+". "+match[2])}));
if(!researchTopics.length)throw new Error("No source-derived research areas found");
const docLinks=[...routes].map(([source,url])=>({source,url,title:sourceTitle(source,content.get(source))}));
const safe=escapeHtml;
const stamp='Published from GitHub '+safe(revision==="local-build"?"working tree":revision.slice(0,9))+" · "+safe(publishedAt.slice(0,16).replace("T"," "))+" UTC";
const nav='<nav aria-label="Main navigation"><a href="/mission">Mission</a><a href="/research">Research</a><a href="/roadmap">Roadmap</a><a href="/library">Library</a><a href="/contribute">Get involved</a></nav>';
function shell({title,description,section,body,route,lang="en",script=""}){
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width, initial-scale=1">'+
  '<meta name="theme-color" content="#101c29">'+
  '<meta name="description" content="'+safe(description)+'">'+
  '<link rel="canonical" href="'+ORIGIN+route+'">'+
  '<meta property="og:title" content="'+safe(title)+' — Human Prosperity Initiative">'+
  '<meta property="og:url" content="'+ORIGIN+route+'">'+
  '<title>'+safe(title)+' — Human Prosperity Initiative</title>'+
  '<link rel="stylesheet" href="/styles.css"><link rel="icon" type="image/svg+xml" href="/favicon.svg">'+
  (script?'<script src="'+script+'" defer></script>':"")+
  '</head><body><a class="skip" href="#main">Skip to main content</a>'+
  '<header class="header"><div class="wrap head-inner"><a class="logo" href="/" aria-label="HPI. Human Prosperity Initiative home"><span class="symbol" aria-hidden="true">✳</span> HPI<span class="lime">.</span><small>Human Prosperity<br>Initiative</small></a>'+
  nav+'<a class="nav-cta" href="/activity">Live progress ↗</a></div></header>'+
  '<main id="main" class="content-page"><section class="content-hero"><div class="wrap">'+
  '<div class="content-breadcrumb"><a href="/">Home</a> / <a href="/library">Knowledge library</a> / '+safe(section)+'</div>'+
  '<span class="section-label">'+safe(section)+'</span><h1>'+safe(title)+'</h1>'+
  '<p class="content-lede">'+safe(description)+'</p></div></section>'+
  '<div class="wrap content-layout">'+body+'</div></main>'+
  '<footer class="footer"><div class="wrap footer-bottom"><span>© 2026 HPI contributors · Working name, not a registered foundation</span>'+
  '<span><a href="/library">Knowledge library</a> · <a href="/activity">Activity</a> · '+stamp+'</span></div></footer>'+
  '</body></html>';
}
async function publish(route,html){
 const target=path.posix.join(ROOT,route==="/"?"/index.html":route+".html");
 await mkdir(path.posix.dirname(target),{recursive:true});
 await writeFile(target,html,"utf8");
}
await rm(ROOT,{recursive:true,force:true});await mkdir(ROOT,{recursive:true});
await cp("site/styles.css","dist/styles.css");
await cp("site/favicon.svg","dist/favicon.svg");
await cp("site/activity.js","dist/activity.js");
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
 cards(docLinks.filter(x=>x.source.startsWith("research/")))+
 '<p><a href="/roadmap">See how this work fits into the roadmap ↗</a></p></div>'
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
 '<div id="issue-list" class="issue-list" aria-label="Current public issues"></div>'+
 '<noscript><p>Enable JavaScript for the latest issue statuses, or visit the public GitHub issue tracker.</p></noscript></div>'
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
const allRoutes=[...new Set([...STATIC_ROUTES,...routes.values()])].sort();
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+
 allRoutes.map(route=>'<url><loc>'+ORIGIN+(route==="/"?"/":route)+'</loc></url>').join("")+
 '</urlset>\n';
await writeFile(ROOT+"/sitemap.xml",xml);
await writeFile(ROOT+"/robots.txt","User-agent: *\nAllow: /\nSitemap: "+ORIGIN+"/sitemap.xml\n");
await writeFile(ROOT+"/publication.json",JSON.stringify({
 status:"published_from_git",revision,generatedAt:publishedAt,
 sourceFileCount:docLinks.length,sourcePaths:docLinks.map(x=>x.source),
 routeCount:allRoutes.length,ledgerEntryCount:evidence.length-1,activeInitiative:descriptor.currentInitiative
},null,2)+"\n");
console.log("HPI published: "+docLinks.length+" document routes, "+allRoutes.length+
 " total routes, "+(evidence.length-1)+" evidence entries; revision "+revision);
