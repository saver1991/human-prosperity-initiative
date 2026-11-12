/**
 * RT-02 safe public tool product layer. The existing build is the canonical
 * source for scientific calculations, published data and generated documents.
 * This module only enhances public UX and never reads or retains user records.
 */
import {readFile,writeFile} from "node:fs/promises";
const pathFor=route=>"dist/"+route.slice(1)+".html";
const replaceOnce=(body,marker,value,route)=>{
 if(!body.includes(marker))throw Error("RT-02 expected "+route+" anchor not found");
 return body.replace(marker,value);
};
const option=(safe,value)=>'<option value="'+safe(value)+'">'+safe(value.replaceAll("_"," "))+'</option>';
const unique=(rows,key)=>[...new Set(rows.map(x=>String(x[key]??"unclassified")))].sort((a,b)=>a.localeCompare(b));

export async function enhanceRt02Products({publish,shell,sourceCatalog,revision,safe}){
 const read=async route=>readFile(pathFor(route),"utf8");
 const write=async (route,html)=>writeFile(pathFor(route),html,"utf8");
 let tools=await read("/tools");
 tools=replaceOnce(tools,
  '<p class="status-note">RT-02 will improve usability and individual tools separately. This WEB-03 hub is a discoverability layer, not a scientific certification.</p>',
  '<section class="rt02-guide" aria-labelledby="rt02-choose"><h2 id="rt02-choose">Choose your task</h2>'+
   '<ol class="rt02-steps"><li><strong>Check a source:</strong> use <a href="/research/source-catalog">Source Catalogue</a> for publisher links, licence uncertainty, year and provenance. A citation is not a licensed dataset.</li>'+
   '<li><strong>Explore a hypothetical outcome:</strong> use the <a href="/research/outcome-lab">Synthetic Outcome Lab</a>, which accepts fictional group counts only.</li>'+
   '<li><strong>Reproduce an example:</strong> follow the <a href="/research/reproducibility">version-pinned pipeline steps</a> and verify hashes.</li>'+
   '<li><strong>Understand the limits:</strong> review <a href="/research/responsible-tools">Responsible Tools</a>, <a href="/tools/glossary">glossary</a> and <a href="/help">Help</a>.</li></ol>'+
   '<p class="status-note"><strong>Data status: public citation metadata or synthetic examples only.</strong> No personal benefit, medical, income or case records. All independent science, data-rights, accessibility and fieldwork approvals remain open.</p>'+
   '<p><a href="/library/docs/rt-02-6-data-explorer-discovery-v0-1">Prosperity Data Explorer decision: NO-GO to build until real sources, users, licensing and comparability are verified</a>.</p>'+
   '</section>',"/tools");
 await write("/tools",tools);

 let cat=await read("/research/source-catalog");
 for(const r of sourceCatalog.records){
  const search=[r.id,r.kind,r.titleOrType,r.geography,r.domain,r.doi||""].join(" ");
  const marker='<tr data-source-record data-source-kind="'+safe(r.kind)+'" data-source-search="'+safe(search)+'">';
  const attrs=[
   ["source-geography",r.geography],["source-year",r.year],
   ["source-rights",r.licenseStatus],["source-review",r.rightsReviewStatus],
   ["source-family",r.studyFamily??"unclassified"]
  ].map(([name,value])=>' data-'+name+'="'+safe(String(value))+'"').join("");
  cat=replaceOnce(cat,marker,marker.slice(0,-1)+attrs+'>',"/research/source-catalog "+r.id);
 }
 const records=sourceCatalog.records;
 const select=(id,label,vals)=>'<label for="'+id+'">'+label+'</label> <select id="'+id+'">'+
   '<option value="all">All</option>'+vals.map(v=>option(safe,v)).join("")+'</select>';
 const addControls=select("source-geography","Geography",unique(records,"geography"))+
  select("source-year","Year",unique(records,"year"))+
  select("source-rights","Licence state",unique(records,"licenseStatus"))+
  select("source-review","Rights review",unique(records,"rightsReviewStatus"))+
  select("source-family","Study family",unique(records,"studyFamily").map(x=>x==="null"?"unclassified":x));
 cat=replaceOnce(cat,'</select></form>','</select><div class="rt02-filter-grid">'+addControls+'</div></form>',"/research/source-catalog");
 cat=replaceOnce(cat,'<div class="doc-table-wrap" role="region" tabindex="0" aria-label="Searchable public source metadata">',
  '<p id="source-no-results" class="status-note" role="status" hidden>No matching metadata. Change or clear the filters; no source has been deleted.</p>'+
  '<div class="doc-table-wrap" role="region" tabindex="0" aria-label="Searchable public source metadata">',"/research/source-catalog");
 cat=replaceOnce(cat,'<form role="search" aria-label="Find research sources" class="source-search">',
  '<p class="rt02-source-guidance"><strong>What the catalogue means:</strong> reference metadata and dataset candidates are not imported data. Unknown licences remain unknown; a source link is not redistribution permission. <a href="/tools/glossary">Definitions</a> · <a href="/research-integrity">Corrections</a>.</p>'+
  '<form role="search" aria-label="Find research sources" class="source-search">',"/research/source-catalog");
 await write("/research/source-catalog",cat);

 let outcome=await read("/research/outcome-lab");
 outcome=replaceOnce(outcome,'<section class="status-note" aria-label="Synthetic calculation breakdown">',
  '<section class="rt02-visual" id="synthetic-comparison-visual" aria-labelledby="synthetic-chart-title" hidden>'+
  '<h2 id="synthetic-chart-title">Illustrative observed receipt rates — SYNTHETIC ONLY</h2>'+
  '<p>No real subjects, causal impact or validated indicator is represented in this chart.</p>'+
  '<div class="rt02-meter"><label for="synthetic-ref-meter">Reference group: <strong data-synthetic-rate>0%</strong></label><meter id="synthetic-ref-meter" min="0" max="100" value="0">0%</meter></div>'+
  '<div class="rt02-meter"><label for="synthetic-cmp-meter">Comparison group: <strong data-synthetic-rate>0%</strong></label><meter id="synthetic-cmp-meter" min="0" max="100" value="0">0%</meter></div>'+
  '<div class="doc-table-wrap"><table><caption>Accessible text alternative: fictional denominator details</caption>'+
  '<thead><tr><th scope="col">Fictional group</th><th scope="col">Eligible</th><th scope="col">Missing</th><th scope="col">Observed denominator</th></tr></thead>'+
  '<tbody><tr><th scope="row">Reference</th><td data-synthetic-table></td><td data-synthetic-table></td><td data-synthetic-table></td></tr>'+
  '<tr><th scope="row">Comparison</th><td data-synthetic-table></td><td data-synthetic-table></td><td data-synthetic-table></td></tr></tbody></table></div>'+
  '<p><button id="export-synthetic-csv" type="button" disabled>Download SYNTHETIC ONLY CSV</button> Browser-only export; never use with actual participant records.</p></section>'+
  '<section class="status-note" aria-label="Synthetic calculation breakdown">',"/research/outcome-lab");
 outcome=replaceOnce(outcome,'<details><summary>Methodology, uncertainty and limits</summary>',
  '<p><a href="/tools/glossary">Plain-language explanation of uncertainty and missing follow-up</a> · <a href="/research/reproducibility">How the calculation is reproduced</a>.</p>'+
  '<details><summary>Methodology, uncertainty and limits</summary>',"/research/outcome-lab");
 await write("/research/outcome-lab",outcome);

 let reproducible=await read("/research/reproducibility");
 const pinned=revision==="local-build"?"[use the full SHA from /publication.json]":revision;
 reproducible=replaceOnce(reproducible,'<h2>Research pipeline checks</h2>',
  '<section class="rt02-guide" aria-labelledby="rt02-reproduce"><h2 id="rt02-reproduce">Reproduce a public example in three steps</h2>'+
  '<p><strong>1. Get the exact source revision.</strong> Read <a href="/publication.json">publication.json</a> and check out its Git commit. Node.js 22 or newer is required. This website contains versioned manifests but no independently reviewed real-world outcome.</p>'+
  '<pre id="rt02-reproduce-commands" class="doc-code">git clone https://github.com/svtmzt/human-prosperity-initiative.git\ncd human-prosperity-initiative\ngit checkout '+safe(pinned)+'\nnode --version\nnpm run research:pipeline:verify\nnpm run research:governance:verify</pre>'+
  '<p><strong>2. Trace inputs to artifacts.</strong> Examine the <a href="/research-pipeline-manifest.json">SHA-256 input/output manifest</a>, the <a href="/research-data-dictionary.json">field dictionary</a>, then the <a href="/research-pipeline-report.json">synthetic report</a>. Checksums verify bytes, not scientific truth.</p>'+
  '<p><strong>3. Inspect correction and rights states.</strong> Read the <a href="/research-revision-log.json">revision history</a> and <a href="/research-citation-manifest.json">citation/rights manifest</a>. Unknown or disputed rights remain blocked; outputs do not contain redistributed third-party datasets.</p>'+
  '<p><a href="/research-reproducibility-notebook.ipynb">Optional fictional notebook example</a> · <a href="/tools/glossary">Research glossary</a></p></section>'+
  '<h2>Research pipeline checks</h2>',"/research/reproducibility");
 await write("/research/reproducibility",reproducible);

 let responsible=await read("/research/responsible-tools");
 responsible=replaceOnce(responsible,'<h2>Accessibility and inclusion</h2>',
  '<p class="rt02-source-guidance"><strong>Language availability:</strong> English is the main tool UI; Italian is available for this responsible-tools guidance only. No independently reviewed translations of all tool interfaces are claimed. <a href="/tools/glossary">Read common terms</a> · <a href="/help">Help and safe correction instructions</a>.</p><h2>Accessibility and inclusion</h2>',"/research/responsible-tools");
 await write("/research/responsible-tools",responsible);

 await publish("/tools/glossary",shell({
  title:"Research tools glossary",section:"Open research tools",route:"/tools/glossary",
  description:"Plain-language research and licensing definitions for HPI public metadata and fictional examples. No eligibility advice or scientific certification.",
  breadcrumb:'<a href="/">Home</a> / <a href="/tools">Tools</a> / Glossary',
  body:'<div class="index-content"><p class="status-note">These definitions help you interpret public research examples. They are not an ethics approval or a substitute for expert review.</p>'+
   '<dl class="rt02-glossary"><dt>Evidence reference</dt><dd>A citation or metadata record about a study. A listed reference is not an imported dataset, verified finding or license to reproduce a paper.</dd>'+
   '<dt>Dataset candidate</dt><dd>A possible future data source whose rights, provenance, processing approval or availability may still be unverified.</dd>'+
   '<dt>Rights review</dt><dd>A documented check of who owns source material, its allowed uses, redistribution and attribution. An unknown status means no permission has been established.</dd>'+
   '<dt>Retraction check</dt><dd>A check for notices of withdrawal or dispute. “Not checked” must never be interpreted as current or independently verified.</dd>'+
   '<dt>Synthetic only</dt><dd>Fictional input and results for demonstrating calculations; never real participant outcomes or evidence of poverty reduction.</dd>'+
   '<dt>Observed denominator</dt><dd>In this lab, fictional eligible counts minus missing follow-up; it changes the descriptive percentage and cannot fix selection bias.</dd>'+
   '<dt>Uncertainty interval</dt><dd>A numerical interval under explicit assumptions; it does not measure every error or turn a non-random comparison into causality.</dd>'+
   '<dt>Independent review</dt><dd>Assessment by appropriately qualified people outside the work, separate from automated builds and internal model critiques.</dd>'+
   '<dt>NO-GO for fieldwork</dt><dd>No recruitment, personal data collection, eligibility decisions, intervention or benefit payment is authorised by this website.</dd></dl>'+
   '<p><a href="/tools">Choose a research tool</a> · <a href="/research-integrity">Research integrity and corrections</a> · <a href="/help">Help</a>.</p></div>'
 }));
}
