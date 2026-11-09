import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const read=path=>readFile(path,"utf8");
const a=JSON.parse(await read("research/F0-02-4-ethical-consultation-gates-v0.1.json"));

test("F0-02.4 design documents T01–T04 without inventing implementation",async()=>{
 assert.equal(a.schemaVersion,"0.1");
 assert.equal(a.initiative,"F0-02.4");
 assert.equal(a.reviewType,"internal_AI_assisted");
 assert.equal(a.independenceStatus,"author_related_not_independent");
 assert.deepEqual(a.workstreams.map(t=>t.id),["F0-02.4-T01","F0-02.4-T02","F0-02.4-T03","F0-02.4-T04"]);
 for(const t of a.workstreams)assert.equal(t.designStatus,"documented_unratified");
 assert.equal(a.decision.documentation,"ready_for_technical_acceptance");
 assert.equal(a.decision.externalConsultations,"not_started");
 assert.equal(a.decision.realResearch,"NO_GO_FIELD");
});

test("all 13 distinct real-world permissions fail closed",()=>{
 const g=a.humanGates;
 assert.equal(Object.keys(g).length,13);
 for(const [key,value] of Object.entries(g))assert.equal(value,false,key+" must not be inferred from a completed plan");
 assert.equal(a.territories.length,3);
 assert.ok(a.territories.every(t=>t.status==="NO_GO_FIELD"));
 assert.equal(a.dataScope.controller,null);
 assert.equal(a.dataScope.lawfulBasisForRealParticipantStudy,null);
 assert.ok(a.dataScope.prohibited.includes("private_personal_data_in_github_or_chat"));
 assert.equal(a.ethicalConsultationExecutionIssue,82);
});

test("adversarial AI critique cannot be counted as independent validation, reviewer or HPI result",async()=>{
 const document=await read("research/F0-03-1-adversarial-internal-science-critique-v0.3.md");
 for(const term of ["NOT independent peer review","AI-IR-01","AI-IR-10","8,800/11,300","NO-GO","Internal recommendation"])
  assert.ok(document.includes(term),"missing internal scientific caveat: "+term);
 const state=JSON.parse(await read("research/F0-03-1-review-readiness-v0.2.json"));
 assert.equal(state.reviewGates.independentMethodsReview,"not_obtained");
 assert.equal(state.reviewGates.qualifiedIndependentReviewersAppointed,0);
 assert.equal(state.reviewGates.communityReview,"not_obtained");
 assert.equal(state.reviewGates.fieldStudyAuthorised,false);
 assert.equal(state.methodology.actualHpiOutcomeNumerator,undefined);
 assert.equal(state.methodology.verifiedStudyEligibleDenominator,null);
});

test("first-party portal publishes safe consultation design and hard-stop status",async()=>{
 const doc=await read("dist/research/f0-02-4-ethical-partner-community-consultation-plan-v0-1.html");
 const peer=await read("dist/research/f0-03-1-adversarial-internal-science-critique-v0-3.html");
 const page=await read("dist/research/newham-prepilot.html");
 const main=await read("dist/research.html");
 const facts=JSON.parse(await read("dist/research-ethical-consultation-gates.json"));
 assert.deepEqual(facts,a);
 for(const marker of ["T01","T02","T03","T04","NO-GO","Our Newham Money","independent"]) assert.ok(doc.includes(marker),"missing F0-02.4 "+marker);
 assert.match(peer,/NOT independent peer review/);
 assert.match(main,/href="\/research\/f0-02-4-ethical-partner-community-consultation-plan-v0-1"/);
 assert.match(page,/href="\/research-ethical-consultation-gates.json"/);
});

test("public roadmap preserves formal, actually unsatisfied human approval gates",async()=>{
 const j=JSON.parse(await read("portfolio/public-roadmap.json"));
 const f=j.initiatives.find(i=>i.id==="F0-02");
 const work=f.epics.find(i=>i.id==="F0-02.4");
 assert.ok(work);
 assert.ok(f.deliverables.some(d=>d.url==="/research/f0-02-4-ethical-partner-community-consultation-plan-v0-1"));
 assert.match(f.gate,/NO_GO_FIELD/);
 for(const t of work.tasks) assert.ok(["documented","planned"].includes(t.status));
 const f03=j.initiatives.find(i=>i.id==="F0-03.1");
 assert.match(f03.gate,/NOT OBTAINED/);
 assert.match(await read("docs/roadmap.md"),/F0-02.4 ethical consultation DESIGN/);
});
