import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {evaluatePrepilotDecision} from "../research-tools/newham-prepilot-gate.mjs";
import {verifyPrepilotDecision} from "../scripts/newham-prepilot-check.mjs";
const raw=await readFile("research/newham-prepilot-decision-register-v0.1.json","utf8");
const copy=()=>JSON.parse(raw),run=x=>evaluatePrepilotDecision(JSON.stringify(x));
test("F0-02.5A desk priority uses six correct rubric weights and no invented external ratings",()=>{
 const d=run(copy());
 assert.equal(d.location.geoCode,"E09000025");
 assert.equal(d.criterionStatus.length,6);
 assert.deepEqual(d.criterionStatus.map(x=>x.weightPercent),[20,20,20,15,15,10]);
 assert.equal(d.criterionStatus.reduce((a,b)=>a+b.weightPercent,0),100);
 assert.ok(d.criterionStatus.every(x=>x.independentlyAssignedScore===null));
 assert.equal(d.independentNumericScore,null);
 assert.equal(d.finalPilotRank,null);
 assert.equal(d.decision,"GO_DESK_ONLY");
 assert.equal(d.fieldDecision,"NO_GO_UNTIL_INDEPENDENT_GATES");
 assert.equal(d.fieldStudyAuthorised,false);
 assert.equal(d.reportedHpiImpact,false);
 assert.equal(d.criticalGates.length,7);
 assert.ok(d.criticalGates.every(x=>x.status==="not_approved"));
});
test("2025 MHCLG 60+ Newham rate is not conflated with all ages or GB Pension Credit",()=>{
 const d=run(copy());
 assert.deepEqual(d.officialContext.map(x=>x.value),[46.7,39,62,220]);
 assert.deepEqual(d.officialContext.map(x=>x.geography),["Newham","Newham","Great Britain","Newham"]);
 assert.ok(d.officialContext[0].interpretation.includes("not_pension_credit_eligibility"));
 assert.ok(d.officialContext[2].interpretation.includes("not_newham_rate"));
 for(const [idx,value] of [[0,62],[1,46.7],[2,46.7],[3,748590]]){
  const z=copy();z.sourceContext[idx].value=value;
  assert.throws(()=>run(z),/metric, geography, age group/);
 }
 const z=copy();z.sourceContext[2].geography="Newham";
 assert.throws(()=>run(z),/metric, geography, age group/);
});
test("Ethics, legal, partner, community, independent methodology and budget cannot be falsely marked complete",()=>{
 for(const [index,val] of [[0,"approved"],[1,"confirmed"],[4,"approved"]]){
  const z=copy();z.fieldGates[index].status=val;
  assert.throws(()=>run(z),/gate was cleared/);
 }
 const z=copy();z.fieldDecision="GO_FIELD_NOW";
 assert.throws(()=>run(z),/field study decision/);
 const x=copy();x.independentCommunityScoringCompleted=true;
 assert.throws(()=>run(x),/independent ranking or scores/);
 const y=copy();y.criteria[0].reviewScore=5;
 assert.throws(()=>run(y),/independent ranking or scores|invented or underspecified/);
 const a=copy();a.decisions.personalRecordsCollected=true;
 assert.throws(()=>run(a),/fabricated fieldwork/);
 const b=copy();b.decisions.externalReviewSigned=true;
 assert.throws(()=>run(b),/fabricated fieldwork/);
});
test("F0-05 and F0-03.1 bounded docs exist, with explicit no-false-review and no actual participant data",async()=>{
 const concept=await readFile("research/F0-05-newham-pension-credit-first-study-concept-v0.1.md","utf8");
 const reviewer=await readFile("research/F0-03-1-newham-independent-review-challenge-pack-v0.1.md","utf8");
 const decision=await readFile("research/F0-02-5-newham-prioritisation-desk-gate-v0.1.md","utf8");
 for(const doc of [concept,reviewer,decision]){
  assert.match(doc,/NO-GO|not an approved|NOT APPROVED|not approved/i);
  assert.match(doc,/46\.7%/);
  assert.match(doc,/Pension Credit/);
 }
 assert.match(concept,/Null hypothesis/);
 assert.match(concept,/comparator|comparison/);
 assert.match(concept,/No sample-size\/power calculation/);
 assert.match(concept,/F0-05 #11/);
 assert.match(reviewer,/no genuine independent reviewer/);
 assert.match(reviewer,/denominator/i);
 assert.match(reviewer,/F0-03\.1 #19/);
 assert.match(decision,/six criteria|Six criteria/);
 assert.match(decision,/NO-GO/);
});
test("CI/public portal regenerates byte-identical metadata and preserves no-field conclusions",async()=>{
 const d=await verifyPrepilotDecision();
 assert.equal(d.status,"PASS");
 assert.equal(d.sixWeightedCriteria,6);
 assert.equal(d.independentlyReviewedScores,0);
 assert.equal(d.unresolvedBlockingExternalGates,7);
 assert.equal(d.recordedRealImpact,0);
 const html=await readFile("dist/research/newham-prepilot.html","utf8");
 assert.match(html,/href="\/research\/f0-05-newham-pension-credit-first-study-concept-v0-1"/);
 assert.match(html,/href="\/research\/f0-03-1-newham-independent-review-challenge-pack-v0-1"/);
 assert.match(html,/Unscored F0-02.5 criterion audit/);
 assert.doesNotMatch(html,/approved field study/);
});
test("Tampered published decision JSON always fails against reviewed source",async()=>{
 const read=async path=>{
  let text=await readFile(path,"utf8");
  if(path==="dist/research-newham-prepilot-decision.json"){
   const m=JSON.parse(text);
   m.fieldStudyAuthorised=true;
   text=JSON.stringify(m)+"\n";
  }
  return text;
 };
 await assert.rejects(()=>verifyPrepilotDecision({read}),/evidence mismatch/);
});
