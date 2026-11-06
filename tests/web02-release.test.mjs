import test from "node:test";
import assert from "node:assert/strict";
import {readFile,stat} from "node:fs/promises";
import {slug} from "../scripts/site-content.mjs";
import {buildPublicRoadmap} from "../scripts/roadmap-model.mjs";
import {acceptedTechnicalTasks} from "../site/progress-policy.js";

const p=JSON.parse(await readFile("portfolio/project.json","utf8"));
const data=JSON.parse(await readFile("portfolio/public-roadmap.json","utf8"));
const model=buildPublicRoadmap(p,data,{revision:"a".repeat(40)});

test("all public initiative routes have canonical metadata and first-party page links",async()=>{
 const sitemap=await readFile("dist/sitemap.xml","utf8");
 const overview=await readFile("dist/roadmap.html","utf8");
 for(const entry of model.initiatives){
  const route="/initiatives/"+slug(entry.id);
  await stat("dist"+route+".html");
  const html=await readFile("dist"+route+".html","utf8");
  assert.ok(sitemap.includes("https://human-prosperity-initiative.vercel.app"+route));
  assert.ok(overview.includes('href="'+route+'"'));
  assert.ok(html.includes('rel="canonical" href="https://human-prosperity-initiative.vercel.app'+route+'"'));
  assert.ok(html.includes('href="/roadmap"'));
  assert.equal((html.match(/<main\b/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.doesNotMatch(html,/href="javascript:|<script[^>]+src="https?:\/\//i);
 }
});
test("task acceptance denominator never includes missing evidence or scientific impact",()=>{
 const web=model.initiatives.find(x=>x.id==="WEB-02");
 const result=acceptedTechnicalTasks(web);
 assert.equal(result.total,31);
 assert.equal(result.accepted,31);
 assert.equal(result.evidenceMissing,0);
 assert.equal(result.impactVerified,false);
 assert.equal(model.validatedHumanImpact,false);
 const remaining=web.epics.find(x=>x.id==="WEB-02.6");
 assert.ok(remaining.tasks.every(t=>t.status==="complete"&&t.evidence));
});
test("roadmap read-only source and safe outage states are linked from the live website",async()=>{
 const home=await readFile("dist/roadmap.html","utf8");
 const detail=await readFile("dist/initiatives/web-02.html","utf8");
 const module=await readFile("dist/progress.js","utf8");
 const policy=await readFile("dist/progress-policy.js","utf8");
 assert.ok(home.includes('type="module"'));
 assert.ok(detail.includes('data-feed-health'));
 assert.ok(detail.includes('data-public-issue="29"'));
 assert.ok(module.includes('credentials:"omit"'));
 assert.ok(module.includes("Public issue feed unavailable"));
 assert.ok(policy.includes("not_in_recent_feed"));
 assert.doesNotMatch(module,/innerHTML|document\.write|localStorage|method:"POST"/);
});
test("the existing CircleCI release gate and independent operational watch remain intact",async()=>{
 const ci=await readFile(".circleci/config.yml","utf8");
 const cfg=JSON.parse(await readFile("vercel.json","utf8"));
 assert.ok(ci.includes("website-quality:"));
 assert.ok(ci.includes("browser-accessibility:"));
 assert.ok(ci.includes("public-operations-watch:"));
 assert.ok(ci.includes("npm run check"));
 assert.ok(ci.includes("scripts/browser-qa.mjs"));
 assert.ok(ci.includes("scripts/ops-watch.mjs"));
 assert.doesNotMatch(ci,/uses:\s*actions\/|github-actions/i);
 assert.equal(cfg.buildCommand,"npm run check");
 const source=await readFile("scripts/ops-watch.mjs","utf8");
 assert.ok(source.includes('"/initiatives/web-02"'));
 assert.ok(source.includes('"/initiatives/f0-03-1"'));
});
test("a public runbook states the human accessibility and post-merge release limits",async()=>{
 const doc=await readFile("docs/WEB-02-release-and-maintenance.md","utf8");
 assert.ok(doc.includes("NVDA/VoiceOver/TalkBack"));
 assert.ok(doc.includes("post-merge"));
 assert.ok(doc.includes("not"));
 assert.ok(doc.includes("No GitHub Actions"));
 assert.ok(doc.includes("15-minute"));
 assert.ok(doc.includes("rollback"));
 assert.ok(doc.includes("source"));
});
