import test from "node:test";
import assert from "node:assert/strict";
import {inspectRelease,validateCandidateUrl,currentCommitStatuses} from "../scripts/release-preflight.mjs";
const SHA="a".repeat(40);
const ORIGIN="https://human-prosperity-initiative-abc-hub-ai-workflows.vercel.app";
const success=[
 {context:"ci/circleci: website-quality",state:"success"},
 {context:"ci/circleci: browser-accessibility",state:"success"},
 {context:"Vercel",state:"success"}
];
const mock=(statuses=success,revision=SHA,observedSha=SHA)=>async url=>({
 status:200,json:async()=>url.includes("/publication.json")?{revision}:{
  sha:observedSha,statuses}
});
test("WEB-01 preview release preflight requires exact verified merged SHA and candidate manifest",async()=>{
 const report=await inspectRelease({sha:SHA,candidateOrigin:ORIGIN,fetchImpl:mock()});
 assert.equal(report.readyForHumanPromotion,true);
 assert.equal(report.scope,"preflight_only_no_promotion");
 assert.equal(report.manifestRevision,SHA);
 assert.deepEqual(Object.values(report.statuses),["success","success","success"]);
});
test("WEB-01 release preflight never accepts missing, pending or failed post-merge CI",async()=>{
 for(const statuses of [
  success.slice(0,2),
  success.map(x=>x.context==="ci/circleci: browser-accessibility"?{...x,state:"pending"}:x),
  success.map(x=>x.context==="Vercel"?{...x,state:"failure"}:x)
 ]){
  const result=await inspectRelease({sha:SHA,candidateOrigin:ORIGIN,fetchImpl:mock(statuses)});
  assert.equal(result.readyForHumanPromotion,false);
  assert.ok(result.reasons.length);
 }
});
test("WEB-01 release preflight rejects older success when newest context is pending",()=>{
 const states=currentCommitStatuses([
  {context:"Vercel",state:"pending"},{context:"Vercel",state:"success"}]);
 assert.equal(states.get("Vercel"),"pending");
});
test("WEB-01 release preflight rejects mismatched SHA and forged deployment hosts",async()=>{
 assert.throws(()=>validateCandidateUrl("http://human-prosperity-initiative.vercel.app"));
 assert.throws(()=>validateCandidateUrl("https://human-prosperity-initiative.vercel.app.attacker.test"));
 assert.throws(()=>validateCandidateUrl("https://bad-user:pw@human-prosperity-initiative.vercel.app"));
 assert.throws(()=>validateCandidateUrl("https://human-prosperity-initiative.vercel.app/malicious"));
 assert.equal((await inspectRelease({sha:"invalid",candidateOrigin:ORIGIN,fetchImpl:mock()})).readyForHumanPromotion,false);
 assert.equal((await inspectRelease({sha:SHA,candidateOrigin:ORIGIN,fetchImpl:mock(success,SHA,"b".repeat(40))})).readyForHumanPromotion,false);
 assert.equal((await inspectRelease({sha:SHA,candidateOrigin:ORIGIN,fetchImpl:mock(success,"b".repeat(40))})).readyForHumanPromotion,false);
});
test("WEB-01 release preflight fails closed when remote site or GitHub status unavailable",async()=>{
 const result=await inspectRelease({sha:SHA,candidateOrigin:ORIGIN,fetchImpl:async()=>{throw Error("offline")}});
 assert.equal(result.readyForHumanPromotion,false);
 assert.equal(result.reasons.length,2);
});
