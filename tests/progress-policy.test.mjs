import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {inspectPublicIssueFeed,reconcilePublicIssue,acceptedTechnicalTasks} from "../site/progress-policy.js";
const now=new Date("2026-11-05T23:40:00Z");
const feed=(records,opts={})=>({source:"github_public_issues",fetchedAt:"2026-11-05T23:35:00Z",
 limitedToRecent:false,issues:records.map(([number,state])=>({number,state,title:"Synthetic issue",updatedAt:"2026-11-05T23:30:00Z"})),...opts});
test("fresh public issue metadata reports open/closed as operational signals only",()=>{
 const v=inspectPublicIssueFeed(feed([[29,"open"],[30,"closed"]]),now);
 assert.equal(v.state,"current");
 assert.equal(v.ageMinutes,5);
 assert.equal(reconcilePublicIssue(v,29,"in_progress").state,"open");
 const closed=reconcilePublicIssue(v,30,"complete");
 assert.equal(closed.state,"closed");
 assert.equal(closed.independentlyApproved,false);
 assert.equal(closed.humanImpactVerified,false);
});
test("closure that contradicts pending scientific/ethics review requires visible challenge",()=>{
 const v=inspectPublicIssueFeed(feed([[19,"closed"]]),now);
 const result=reconcilePublicIssue(v,19,"review");
 assert.equal(result.state,"closed");
 assert.equal(result.disagreement,true);
 assert.equal(result.independentlyApproved,false);
});
test("missing, stale, invalid and outage data never imply completed work",()=>{
 assert.equal(inspectPublicIssueFeed(null,now).state,"unavailable");
 assert.equal(inspectPublicIssueFeed(feed([[29,"closed"]],{fetchedAt:"2026-11-05T22:30:00Z"}),now).state,"stale");
 assert.equal(inspectPublicIssueFeed(feed([[29,"open"],[29,"closed"]]),now).state,"unavailable");
 assert.equal(inspectPublicIssueFeed(feed([[29,"done"]]),now).state,"unavailable");
 assert.equal(inspectPublicIssueFeed(feed([[29,"closed"]],{source:"unknown"}),now).state,"unavailable");
 assert.equal(reconcilePublicIssue(inspectPublicIssueFeed(null,now),29,"complete").state,"unavailable");
});
test("partial GitHub results do not imply absent issues are not completed",()=>{
 const partial=inspectPublicIssueFeed(feed([[9,"open"]],{limitedToRecent:true}),now);
 assert.equal(partial.partial,true);
 assert.equal(reconcilePublicIssue(partial,500,"planned").state,"not_in_recent_feed");
 const full=inspectPublicIssueFeed(feed([[9,"open"]]),now);
 assert.equal(reconcilePublicIssue(full,500,"planned").state,"not_found");
});
test("only technically accepted tasks with HPI PR evidence enter the numerator",()=>{
 const initiative={epics:[{tasks:[
  {id:"A",status:"complete",evidence:"https://github.com/saver1991/human-prosperity-initiative/pull/37"},
  {id:"B",status:"complete"}, {id:"C",status:"planned"},
  {id:"D",status:"review",evidence:"https://github.com/saver1991/human-prosperity-initiative/pull/41"}]}]};
 assert.deepEqual(acceptedTechnicalTasks(initiative),{
  total:4,accepted:1,evidenceMissing:1,impactVerified:false,
  interpretation:"Technical tasks with repository PR evidence, not validated research or beneficiary outcomes."
 });
});
test("published WEB-02 counts have bounded nonduplicate denominators and no verified impact",async()=>{
 const raw=JSON.parse(await readFile("portfolio/public-roadmap.json","utf8"));
 const w=raw.initiatives.find(i=>i.id==="WEB-02");
 const result=acceptedTechnicalTasks(w);
 assert.equal(result.total,31);
 assert.equal(result.accepted,31);
 assert.equal(result.evidenceMissing,0);
 assert.equal(result.impactVerified,false);
});
test("web browser script uses same-origin read-only GET and textContent, not dynamic HTML",async()=>{
 const client=await readFile("site/progress.js","utf8");
 assert.match(client,/fetch\("\/api\/issues"/);
 assert.match(client,/credentials:"omit"/);
 assert.match(client,/method:"GET"/);
 assert.match(client,/textContent/);
 assert.doesNotMatch(client,/\.innerHTML|document\.write|method:"POST"|localStorage/);
});
