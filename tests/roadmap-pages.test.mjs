import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {buildPublicRoadmap} from "../scripts/roadmap-model.mjs";
import {renderRoadmapOverview} from "../scripts/roadmap-pages.mjs";

const project=JSON.parse(await readFile("portfolio/project.json","utf8"));
const detail=JSON.parse(await readFile("portfolio/public-roadmap.json","utf8"));
const model=buildPublicRoadmap(project,detail,{revision:"a".repeat(40)});

test("roadmap renders three navigable horizons with separate scientific and platform tracks",()=>{
 const html=renderRoadmapOverview(model);
 assert.ok(html.includes('id="stage-now"'));
 assert.ok(html.includes('id="stage-next"'));
 assert.ok(html.includes('id="stage-later"'));
 assert.ok(html.includes("Scientific programme"));
 assert.ok(html.includes("Public website &amp; operations"));
 assert.ok(html.includes("12</strong><span>Tracked initiatives"));
 assert.ok(html.includes("31</strong><span>WEB-02 defined tasks"));
 assert.ok(html.includes('href="/library/docs/roadmap-source"'));
 assert.ok(html.includes('href="/library/docs/web-02-public-roadmap-data-contract"'));
});
test("landing view links only to existing first-party pages before initiative details ship",()=>{
 const html=renderRoadmapOverview(model);
 assert.ok(html.includes('href="/library/docs/founding-charter-ratification-candidate-v0-4"'));
 assert.ok(html.includes('href="/research/research-protocol"'));
 assert.ok(html.includes('href="/library/docs/web-01-release-and-operations"'));
 assert.ok(!html.includes('href="/initiatives/'));
 assert.ok(!html.includes('target="_blank"'));
});
test("overview never conflates completed engineering with scientific validity",()=>{
 const html=renderRoadmapOverview(model);
 assert.ok(html.includes("not evidence of improved human prosperity"));
 assert.ok(html.includes("Independent research approval"));
 assert.ok(html.includes("not established"));
 assert.ok(!html.includes("100%"));
 assert.ok(!html.includes("participants helped"));
});
test("all untrusted model text is escaped in the rendered HTML",()=>{
 const copy=structuredClone(model);copy.initiatives[0].summary='<img src=x onerror=alert(1)>';
 const html=renderRoadmapOverview(copy);
 assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt;"));
 assert.ok(!html.includes("<img src=x"));
});
test("built site has an accessible public roadmap, versioned source and valid projection",async()=>{
 const html=await readFile("dist/roadmap.html","utf8");
 const source=await readFile("dist/library/docs/roadmap-source.html","utf8");
 const published=JSON.parse(await readFile("dist/public-roadmap.json","utf8"));
 assert.ok(html.includes('<main id="main"'));
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.ok(html.includes('aria-label="Roadmap stages"'));
 assert.ok(html.includes('<link rel="canonical" href="https://human-prosperity-initiative.vercel.app/roadmap">'));
 assert.ok(html.includes('href="/roadmap.css"'));
 assert.ok(source.includes("Canonical programme plan"));
 assert.equal(published.initiatives.length,12);
 assert.equal(published.issueSync,"not_live");
 assert.equal(published.validatedHumanImpact,false);
});
