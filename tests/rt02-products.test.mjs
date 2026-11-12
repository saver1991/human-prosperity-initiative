import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const read=p=>readFile(p,"utf8");
const json=async p=>JSON.parse(await read(p));
test("RT-02 routes: task guidance and glossary are first party, safe and indexed",async()=>{
 const tools=await read("dist/tools.html"),gloss=await read("dist/tools/glossary.html");
 assert.match(tools,/Choose your task/);assert.match(tools,/SYNTHETIC ONLY/);
 assert.match(tools,/href="\/research\/source-catalog"/);
 assert.match(tools,/href="\/tools\/glossary"/);
 assert.match(gloss,/Dataset candidate/);assert.match(gloss,/Synthetic only/);
 assert.match(await read("dist/sitemap.xml"),/\/tools\/glossary<\/loc>/);
});
test("RT-02 catalogue: real metadata fields, 42 records, filters and no invented dataset rights",async()=>{
 const x=await read("dist/research/source-catalog.html");
 for(const name of ["source-filter","source-kind","source-geography","source-year","source-rights","source-review","source-family","source-no-results"])assert.ok(x.includes('id="'+name+'"'),name);
 assert.equal((x.match(/data-source-record/g)||[]).length,42);
 assert.match(x,/No third-party datasets have been imported/);
 assert.match(x,/not_reviewed/);
 const model=await json("dist/research-source-catalog.json");
 assert.equal(model.totals.all,42);assert.equal(model.totals.datasetCandidates,3);
 assert.ok(model.records.every(r=>r.dataIngested===false&&r.metadataOnly===true));
 const code=await read("site/research-catalog.js");
 assert.doesNotMatch(code,/fetch\s*\(|localStorage|sessionStorage|document\.cookie|XMLHttpRequest/i);
});
test("RT-02 synthetic lab: accessible visual/table, browser export and no personalised claims",async()=>{
 const html=await read("dist/research/outcome-lab.html");
 for(const name of ["synthetic-comparison-visual","export-synthetic-csv","synthetic-ref-meter","synthetic-cmp-meter","outcome-demo-result"])assert.ok(html.includes('id="'+name+'"'),name);
 assert.match(html,/SYNTHETIC ONLY/);
 const code=await read("site/outcome-lab.js");
 assert.match(code,/SYNTHETIC_ONLY/);
 assert.doesNotMatch(code,/fetch\s*\(|localStorage|sessionStorage|document\.cookie|XMLHttpRequest/i);
});
test("RT-02 source lineage and conditional explorer gate do not claim approvals",async()=>{
 const page=await read("dist/research/reproducibility.html");
 assert.match(page,/rt02-reproduce-commands/);
 assert.match(page,/research:pipeline:verify/);
 assert.match(page,/research-pipeline-manifest.json/);
 const policy=await read("docs/RT-02-6-data-explorer-discovery-v0.1.md");
 assert.match(policy,/NO-GO BUILD/);
 const status=await json("portfolio/rt-02-technical-acceptance.json");
 assert.equal(status.researchBoundaries.fieldworkAuthorised,false);
 assert.equal(status.researchBoundaries.explorerBuildAuthorised,false);
 assert.equal(status.humanAcceptance.manualNVDA,false);
 assert.equal(status.productionAccepted,false);
});
