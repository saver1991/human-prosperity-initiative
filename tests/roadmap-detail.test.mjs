import test from "node:test";
import assert from "node:assert/strict";
import {readFile,stat} from "node:fs/promises";
import {slug,escapeHtml} from "../scripts/site-content.mjs";
import {buildPublicRoadmap} from "../scripts/roadmap-model.mjs";
import {renderInitiativeDetail,renderRoadmapOverview} from "../scripts/roadmap-pages.mjs";

const project=JSON.parse(await readFile("portfolio/project.json","utf8"));
const data=JSON.parse(await readFile("portfolio/public-roadmap.json","utf8"));
const model=buildPublicRoadmap(project,data,{revision:"a".repeat(40)});
test("every HPI initiative is navigable as a canonical first-party page",async()=>{
 const map=await readFile("dist/sitemap.xml","utf8");
 const overview=await readFile("dist/roadmap.html","utf8");
 assert.equal(model.initiatives.length,11);
 for(const item of model.initiatives){
  const route="/initiatives/"+slug(item.id);
  await stat("dist"+route+".html");
  assert.ok(map.includes(route),"sitemap missing "+route);
  assert.ok(overview.includes('href="'+route+'"'),"dashboard missing "+route);
  const html=await readFile("dist"+route+".html","utf8");
  assert.ok(html.includes('href="/roadmap"'),"no breadcrumb/back link "+route);
  assert.ok(html.includes('href="/roadmap.css"'),"missing UI stylesheet "+route);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,"main heading count "+route);
  assert.ok(html.includes(escapeHtml(item.name)),"initiative title not reflected "+route);
  assert.ok(html.includes("No measured, independently established population impact"),"scientific integrity missing "+route);
 }
});
test("WEB-02 contains ordered epics and all 31 task IDs with explicit proof where accepted",()=>{
 const web=model.initiatives.find(x=>x.id==="WEB-02");
 const html=renderInitiativeDetail(web,model);
 assert.equal(web.epics.length,6);
 assert.equal(web.epics.flatMap(x=>x.tasks).length,31);
 for(const epic of web.epics){
  assert.ok(html.includes('id="epic-'+slug(epic.id)+'"'));
  for(const t of epic.tasks)assert.ok(html.includes(t.id),"missing "+t.id);
 }
 assert.ok(html.includes("View acceptance evidence on GitHub"));
 assert.ok(html.includes("Issue checklists and discussion remain authoritative"));
 assert.ok(html.includes('href="/activity#issue-29"'));
 assert.ok(!html.includes("<strong>100% impact</strong>"));
 assert.ok(html.includes("No measured, independently established population impact"));
});
test("all public source documents are first party by default; contribution history remains clearly external",()=>{
 const item=model.initiatives.find(x=>x.id==="F0-03.1");
 const html=renderInitiativeDetail(item,model);
 assert.ok(html.includes('href="/research/f0-03-methodological-pre-review-2026-11-05"'));
 assert.ok(html.includes('href="/research/f0-03-independent-review-form"'));
 assert.ok(html.includes('href="/activity#issue-19"'));
 assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'));
 assert.ok(html.includes("not a live GitHub issue synchronisation"));
});
test("unknown aspirational horizons clearly do not have approved tasks or measured impact",()=>{
 const item=model.initiatives.find(x=>x.id==="F1");
 const html=renderInitiativeDetail(item,model);
 assert.ok(html.includes("no authorised epics"));
 assert.ok(html.includes("No measured, independently established"));
 assert.ok(html.includes("Not verified"));
});
test("untrusted content is escaped in nested labels and tasks",()=>{
 const v=structuredClone(model);
 v.initiatives[0].epics[0].tasks[0].title='<svg onload=alert(1)>';
 const html=renderInitiativeDetail(v.initiatives[0],v);
 assert.ok(html.includes("&lt;svg onload=alert(1)&gt;"));
 assert.ok(!html.includes("<svg onload"));
});
test("first party activity links are a static mapping, never an authenticated mutation",async()=>{
 const client=await readFile("dist/activity.js","utf8");
 assert.ok(client.includes("/public-roadmap.json"));
 assert.ok(client.includes("Read initiative on HPI"));
 assert.ok(client.includes("issue-local"));
 assert.ok(client.includes("issue-discuss"));
 assert.ok(client.includes("textContent"));
 assert.ok(!client.includes("innerHTML"));
 assert.ok(!client.includes('method:"POST"'));
});
