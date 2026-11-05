import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {buildPublicRoadmap,publicIssueSignal} from "../scripts/roadmap-model.mjs";
const project=JSON.parse(await readFile("portfolio/project.json","utf8"));
const details=JSON.parse(await readFile("portfolio/public-roadmap.json","utf8"));
const copy=v=>structuredClone(v);
test("public source contract has one stable ID per roadmap initiative, epic and task",()=>{
 const data=buildPublicRoadmap(project,details,{revision:"a".repeat(40)});
 assert.equal(data.schemaVersion,"1.0");
 assert.equal(data.issueSync,"not_live");
 assert.equal(data.validatedHumanImpact,false);
 assert.equal(data.legalStatus,"not_incorporated");
 assert.equal(data.initiatives.length,project.initiatives.length);
 assert.ok(["WEB-01","WEB-02","F0-01","F0-02","F0-03","F0-03.1","F0-04"].every(id=>
  data.initiatives.some(x=>x.id===id)));
 const web=data.initiatives.find(x=>x.id==="WEB-02");
 assert.equal(web.epics.length,6);
 assert.equal(web.epics.flatMap(x=>x.tasks).length,31);
 assert.ok(web.epics.find(x=>x.id==="WEB-02.1").tasks.every(t=>t.status==="complete"&&t.evidence));
 assert.ok(web.epics.find(x=>x.id==="WEB-02.2").tasks.every(t=>t.status==="planned"));
 assert.ok(web.epics.filter(x=>["WEB-02.3","WEB-02.4","WEB-02.5","WEB-02.6"].includes(x.id)).every(x=>x.tasks.every(t=>t.status==="planned")));
 assert.ok(data.initiatives.flatMap(x=>x.epics).every(x=>x.tasks.every(t=>t.sourceIssue===null||t.sourceIssue.startsWith("https://github.com/saver1991/human-prosperity-initiative/issues/"))));
});
test("sensitive or unrecognised keys cannot be published",()=>{
 const v=copy(details);v.initiatives[0].secretToken="should-not-leak";
 assert.throws(()=>buildPublicRoadmap(project,v),/disallowed field/);
});
test("untrusted deliverable links are rejected",()=>{
 const v=copy(details);v.initiatives[0].deliverables[0].url="javascript:alert(1)";
 assert.throws(()=>buildPublicRoadmap(project,v),/requires a first-party HPI path/);
});
test("documented tasks require concrete public evidence",()=>{
 const v=copy(details);const t=v.initiatives.find(x=>x.id==="WEB-02").epics[0].tasks[0];
 t.status="documented";delete t.evidence;
 assert.throws(()=>buildPublicRoadmap(project,v),/needs public acceptance evidence/);
});
test("planned task counts cannot be fabricated or inflated",()=>{
 const v=copy(details);v.initiatives.find(x=>x.id==="WEB-02").epics[0].tasks.pop();
 assert.throws(()=>buildPublicRoadmap(project,v),/planned task count differs/);
});
test("unknown and duplicate initiatives fail closed",()=>{
 const v=copy(details);v.initiatives[0].id="MISSING-ID";
 assert.throws(()=>buildPublicRoadmap(project,v),/must match canonical project descriptor/);
 const q=copy(details);q.initiatives.push(q.initiatives[0]);
 assert.throws(()=>buildPublicRoadmap(project,q),/duplicate/);
});
test("stale or missing public issue feed never becomes a completed task",()=>{
 assert.deepEqual(publicIssueSignal(null,29),{state:"unavailable",live:false});
 const feed={source:"github_public_issues",fetchedAt:"2026-11-01T12:00:00Z",issues:[{number:29,state:"closed"}]};
 assert.deepEqual(publicIssueSignal(feed,29,new Date("2026-11-05T12:00:00Z")),{state:"stale",live:false});
});
test("live closed issue cannot be confused with research or participant impact approval",()=>{
 const feed={source:"github_public_issues",fetchedAt:"2026-11-05T12:00:00Z",issues:[{number:29,state:"closed"}]};
 const result=publicIssueSignal(feed,29,new Date("2026-11-05T12:01:00Z"));
 assert.equal(result.state,"closed");
 assert.equal(result.scientificApproval,false);
 const model=buildPublicRoadmap(project,details);
 assert.equal(model.initiatives.find(x=>x.id==="F0-03.1").status,"review");
 assert.equal(model.validatedHumanImpact,false);
});
test("invalid feed and malformed issue states never imply closure",()=>{
 const now=new Date("2026-11-05T12:01:00Z");
 assert.equal(publicIssueSignal({source:"untrusted",issues:[],fetchedAt:"2026-11-05T12:00:00Z"},29,now).state,"unavailable");
 assert.equal(publicIssueSignal({source:"github_public_issues",issues:[{number:29,state:"done"}],fetchedAt:"2026-11-05T12:00:00Z"},29,now).state,"unknown");
});
