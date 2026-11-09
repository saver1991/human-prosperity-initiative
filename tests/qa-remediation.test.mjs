import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {buildPublicRoadmap} from "../scripts/roadmap-model.mjs";
const read=path=>readFile(path,"utf8");
const details=JSON.parse(await read("portfolio/public-roadmap.json"));
const project=JSON.parse(await read("portfolio/project.json"));

test("WEB-01-A11Y anchors really focusable main in home and canonical shell",async()=>{
 for(const file of ["dist/index.html","dist/roadmap.html","dist/initiatives/f0-04.html"]){
  const html=await read(file);
  assert.match(html,/<main\b[^>]*id="main"[^>]*tabindex="-1"/);
  assert.match(html,/href="#main"/);
 }
 const browser=await read("scripts/browser-qa.mjs");
 assert.match(browser,/actually moves focus into main/);
});

test("F0-04 tracks documented vs technically complete; prevents inferred institutional sign-off",async()=>{
 const model=buildPublicRoadmap(project,details,{revision:"a".repeat(40)});
 const item=model.initiatives.find(i=>i.id==="F0-04");
 assert.equal(item.epics.length,8);
 const tasks=item.epics.flatMap(e=>e.tasks);
 assert.equal(tasks.length,31);
 assert.equal(tasks.filter(t=>t.status==="documented").length,21);
 assert.equal(tasks.filter(t=>t.status==="complete").length,0);
 for(const task of tasks){
  assert.deepEqual(task.assurance,{independentReview:"not_verified",ratified:false,operational:false,fieldAuthorised:false});
 }
 const html=await read("dist/initiatives/f0-04.html");
 for(const term of ["DOCUMENTED DRAFTS","21 / 31","TECHNICALLY COMPLETE","OTHER TASKS",
  "Independent review:","Ratified:","Operational:","Fieldwork authorised:"])
  assert.ok(html.includes(term),"Missing F0-04 explicit scope layer: "+term);
 assert.doesNotMatch(html,/<span>TECHNICAL ACCEPTANCE<\/span><strong>0 \/ 31<\/strong>/);
 const modified=structuredClone(details);
 modified.initiatives.find(i=>i.id==="F0-04").epics[1].tasks[0].assurance.ratified=true;
 assert.throws(()=>buildPublicRoadmap(project,modified),/cannot claim independent ratification/);
});

test("RT-01-EXPORT downloads JSON rather than misleading browser preview",async()=>{
 const html=await read("dist/research/source-catalog.html");
 assert.match(html,/href="\/research-source-catalog.json" download="hpi-research-source-catalog.json"/);
 const records=JSON.parse(await read("dist/research-source-catalog.json"));
 assert.ok(records&&typeof records==="object");
 assert.match(await read("scripts/browser-qa.mjs"),/JSON metadata initiates a real browser download/);
});

test("F0-04.6-UX surfaces all three jurisdictions and immutable NO-GO flags",async()=>{
 const html=await read("dist/library/docs/governance/f0-04-6-international-operations-and-partner-controls-v0-1.html");
 for(const term of ["Newham","Recife","Napoli / Naples","NO-GO FIELD","country readiness"])
  assert.ok(html.includes(term),"Country overview incomplete: "+term);
 assert.match(html,/href="\/library\/docs\/governance\/f0-04-6-country-readiness-controls-v0-1"/);
});

test("RT-01-METHOD-UI shows the descriptive denominator without inventing causal validity",async()=>{
 const html=await read("dist/research/outcome-lab.html");
 const js=await read("dist/outcome-lab.js");
 assert.match(html,/id="outcome-method-detail"/);
 assert.match(html,/denominator is eligible minus missing follow-up/);
 assert.match(js,/\.observed/);
 assert.match(js,/No causal inference/);
 assert.match(js,/Cannot show a calculation breakdown for invalid synthetic counts/);
});

test("WEB-01-NET enforces browser HAR, HTTP failures and fail-closed provider responses",async()=>{
 const qa=await read("scripts/browser-qa.mjs");
 for(const term of ["recordHar:","network-hpi.har","network-report.json",
  "synthetic calculation sends no network requests",
  "no unexpected HTTP 4xx/5xx or failed requests",
  "network 503 GitHub feed displays fail-closed fallback",
  "network 503 freshness displays unknown"])
  assert.ok(qa.includes(term),"Missing real browser network verification: "+term);
});
