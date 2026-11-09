import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const read = path => readFile(path,"utf8");
const m = JSON.parse(await read("research/F0-03-1-review-readiness-v0.2.json"));
const dwp = JSON.parse(await read("research/NEW-02-dwp-newham-local-official-facts-v0.2.json"));

test("F0-03.1 updated 2026-11-09 source is exact and distinct from research cohort outcomes",()=>{
 assert.equal(m.schemaVersion,"0.2");
 assert.equal(m.initiative,"F0-03.1");
 assert.equal(m.geographicalAggregateContext.sourceSha256,dwp.sourceSha256);
 assert.equal(m.geographicalAggregateContext.newhamModelledHouseholds,dwp.caseload.allEligibleModelledHouseholds);
 assert.equal(m.geographicalAggregateContext.newhamModelledInReceipt,dwp.caseload.receivingHouseholds);
 assert.equal(m.geographicalAggregateContext.newhamModelledPotentialNonreceivers,dwp.caseload.potentiallyEligibleNotReceivingHouseholds);
 assert.equal(m.geographicalAggregateContext.newhamModelledReceiptPct,78);
 assert.equal(m.geographicalAggregateContext.expenditureReceiptPct,86);
 assert.equal(m.geographicalAggregateContext.notHpiParticipantOutcomes,true);
 assert.equal(m.geographicalAggregateContext.notComparableWithGbFye2025NationalRate,true);
 assert.equal(m.methodology.verifiedStudyEligibleDenominator,null);
 assert.equal(m.methodology.confirmedFirstPaidAwardNumerator,null);
 assert.equal(m.methodology.causalEffect,null);
 assert.equal(m.methodology.sampleSize,null);
 assert.equal(m.methodology.statisticalPower,null);
 assert.equal(m.methodology.compositeProsperityIndexApproved,false);
});

test("F0-03.1 has exactly 15 unvalidated candidate measures including HPI-B-01",async()=>{
 const csv=await read("research/F0-03-indicator-catalog-v0.1.csv");
 const rows=csv.trim().split("\n");
 assert.equal(rows.length-1,15);
 assert.equal(m.methodology.candidateIndicatorCount,15);
 assert.equal(rows.filter(row=>row.startsWith('"HPI-B-01"')).length,1);
 for(const r of rows.slice(1))assert.match(r,/"proposed_not_validated"$/);
});

test("F0-03.1 no fabricated reviewers, ethics, community, authorisation, sign-off or impact",()=>{
 const g=m.reviewGates;
 assert.equal(g.independentMethodsReview,"not_obtained");
 assert.equal(g.communityReview,"not_obtained");
 for(const key of ["qualifiedIndependentReviewersAppointed","protectedCommunityConsultations","reviewsActuallyReceived"])assert.equal(g[key],0);
 for(const key of ["ethicsApproval","approvedDataController","statutoryPartnerAppointed","safeguardingChannelVerified","verifiedDataAccessRights","fieldStudyAuthorised","scientificVersion1Ratified"])assert.equal(g[key],false);
 assert.deepEqual(m.independentReviewEvidence,[]);
 assert.deepEqual(m.actualReviewerDispositionRecords,[]);
 assert.equal(m.negativeFeasibility.result,"NO_GO_FIELD");
});

test("F0-03.1 public-review challenge matrix is complete but no independent scores invented",()=>{
 assert.equal(m.reviewChallenges.length,12);
 assert.deepEqual(m.reviewChallenges.map(r=>r.id),Array.from({length:12},(_,i)=>"IR-"+String(i+1).padStart(2,"0")));
 for(const row of m.reviewChallenges){
  assert.equal(row.status,"awaiting_actual_independent_review");
  assert.equal(row.reviewerReference,null);
  assert.equal(row.disposition,null);
  assert.equal(row.signoff,null);
  assert.ok(row.question.length>30&&row.requiredEvidence.length>20);
 }
});

test("F0-03.1 first-party public dossier and protocol actually render; JSON strictly matches source",async()=>{
 const dossier=await read("dist/research/f0-03-1-newham-independent-review-readiness-v0-2.html");
 const protocol=await read("dist/research/f0-03-1-external-review-protocol-v0-2.html");
 const main=await read("dist/research.html");
 const statusPage=await read("dist/research/newham-prepilot.html");
 const initiative=await read("dist/initiatives/f0-03-1.html");
 const fact=JSON.parse(await read("dist/research-independent-review-readiness.json"));
 assert.deepEqual(fact,m);
 for(const x of ["11,300","8,800","2,500","78%","86%","62%","IR-01","NO-GO","NOT RATIFIED"])assert.ok(dossier.includes(x),"missing dossier guard: "+x);
 for(const x of ["INDEPENDENT","no","GitHub","review","participant"])assert.ok(protocol.toLowerCase().includes(x.toLowerCase()));
 assert.ok(main.includes("/research/f0-03-1-newham-independent-review-readiness-v0-2"));
 assert.ok(statusPage.includes("/research-independent-review-readiness.json"));
 assert.ok(initiative.includes("/research/f0-03-1-newham-independent-review-readiness-v0-2"));
 assert.match(await read("dist/research/f0-03-1-newham-independent-review-challenge-pack-v0-1.html"),/Historical note/);
});

test("F0-03.1 external review remains open in canonical editorial roadmap",async()=>{
 const j=JSON.parse(await read("portfolio/public-roadmap.json"));
 const m=j.initiatives.find(x=>x.id==="F0-03.1");
 assert.ok(m.deliverables.some(x=>x.url==="/research/f0-03-1-newham-independent-review-readiness-v0-2"));
 assert.ok(m.deliverables.some(x=>x.url==="/research/f0-03-1-external-review-protocol-v0-2"));
 assert.match(m.gate,/NOT OBTAINED/);
 assert.match(m.gate,/NOT RATIFIED/);
 const pending=m.epics.flatMap(e=>e.tasks).filter(t=>/Obtain .*qualified|Obtain .*community|Record evidence-based response/.test(t.title));
 assert.equal(pending.length,3);
 for(const p of pending)assert.equal(p.status,"planned");
 assert.match(await read("docs/roadmap.md"),/F0-03.1 research reviewer readiness V0.2/);
});
