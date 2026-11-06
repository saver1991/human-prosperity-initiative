import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {auditEvidenceMetadata} from "../research-tools/evidence-provenance.mjs";
import {compareAggregateOutcomes} from "../research-tools/aggregate-outcomes.mjs";
import {runAudit} from "../scripts/rt01-repro-check.mjs";
import {auditStructuredEvidence} from "../research-tools/structured-evidence.mjs";
test("RT-01 source integrity validates current public ledger without declaring scientific quality",async()=>{
 const source=await readFile("research/evidence-ledger.csv","utf8");
 const a=auditEvidenceMetadata(source),b=auditEvidenceMetadata(source);
 assert.deepEqual(a,b);
 assert.ok(a.recordCount>=30);
 assert.equal(a.uniqueRecordIds,a.recordCount);
 assert.match(a.sourceSha256,/^[a-f0-9]{64}$/);
 assert.equal(a.extractionQuality,"not_independently_assessed");
 assert.equal(a.completeSystematicReview,false);
 assert.equal(a.verifiedImpact,false);
 assert.equal(a.personalRecordAccess,false);
 assert.ok(Object.keys(a.byDomain).length>=3);
});
test("RT-01 source integrity refuses invalid IDs, duplicate IDs, unsafe sources and malformed CSV",()=>{
 const hdr="id,year,geography,domain,source_type,key_finding,limitations,url\n";
 const row="E99,2025,Example,benefit_access,RCT,Unknown,Nonportable,https://example.org/study\n";
 assert.equal(auditEvidenceMetadata(hdr+row).recordCount,1);
 assert.throws(()=>auditEvidenceMetadata(hdr+row+row),/Duplicate/);
 assert.throws(()=>auditEvidenceMetadata(hdr+row.replace("https:","http:")),/Non-HTTPS/);
 assert.throws(()=>auditEvidenceMetadata(hdr+row.replace("2025","nope")),/Bad study year/);
 assert.throws(()=>auditEvidenceMetadata("garbage"),/empty|schema/i);
});

test("RT-01 distinguishes abstract-level evidence records from distinct study families",async()=>{
 const raw=await readFile("research/F0-02-structured-evidence-2026-11-06.csv","utf8");
 const summary=auditStructuredEvidence(raw);
 assert.equal(summary.recordCount,34);
 assert.equal(summary.formallyRiskOfBiasAssessed,0);
 assert.equal(summary.abstractsOrSummariesOnly,summary.recordCount);
 assert.ok(summary.candidateStudyFamilyCount<=summary.recordCount);
 assert.equal(summary.byDomain.benefit_access,10);
 assert.equal(summary.byDomain.essential_costs,12);
 assert.equal(summary.byDomain.economic_opportunity,12);
 assert.equal(summary.scientificReviewCompleted,false);
 assert.equal(summary.verifiedTreatmentEffects,false);
 assert.throws(()=>auditStructuredEvidence(raw.replace("not_assessed","low_risk")),/Formal risk of bias/);
});

const scenario=(c={eligible:100,received:6,missingFollowup:0},t={eligible:100,received:11,missingFollowup:0})=>({
 name:"Synthetic welfare outreach example",sourceType:"synthetic",metric:"Award receipt",
 followupDescription:"Fixed synthetic follow-up; no real study",control:c,comparison:t
});
test("RT-01 tool compares real denominators and expressly rejects causal inference",()=>{
 const result=compareAggregateOutcomes(scenario());
 assert.ok(Math.abs(result.absolutePercentagePointDifference-5)<1e-10);
 assert.equal(result.control.observedRate,0.06);
 assert.equal(result.comparison.observedRate,0.11);
 assert.equal(result.causalInterpretation,"NOT_SUPPORTED");
 assert.equal(result.independentMethodValidation,false);
 assert.equal(result.confidenceInterval,null);
});
test("RT-01 tool reports attrition and zero-baseline ratio safely",()=>{
 const s=compareAggregateOutcomes(scenario({eligible:100,received:0,missingFollowup:20},{eligible:100,received:40,missingFollowup:20}));
 assert.equal(s.control.observed,80);
 assert.equal(s.attritionControlPct,20);
 assert.equal(s.relativeRiskRatio,null);
 assert.equal(s.absolutePercentagePointDifference,50);
});
test("RT-01 synthetic module fails closed for raw records, invalid outcomes and unlabeled data",()=>{
 assert.throws(()=>compareAggregateOutcomes({...scenario(),sourceType:"private_person_level"}),/synthetic/);
 assert.throws(()=>compareAggregateOutcomes({...scenario(),recipientEmail:"secret@example.com"}),/unsupported field/);
 assert.throws(()=>compareAggregateOutcomes(scenario({eligible:10,received:11},{eligible:10,received:1})),/counts inconsistent/);
 assert.throws(()=>compareAggregateOutcomes(scenario({eligible:0,received:0},{eligible:10,received:1})),/counts inconsistent/);
 assert.throws(()=>compareAggregateOutcomes(scenario({eligible:10,received:1,missingFollowup:10},{eligible:10,received:1})),/counts inconsistent/);
});
test("RT-01 offline entrypoint yields provenance and synthetic comparison only",async()=>{
 const report=await runAudit();
 assert.equal(report.kind,"hpi-rt01-local-reproducibility-report-v0.1");
 assert.equal(report.generatedWith,"node-standard-library-no-network");
 assert.equal(report.realWorldImpactMeasured,false);
 assert.equal(report.independentScientificReview,false);
 assert.equal(report.participantRecordsUsed,false);
 assert.equal(report.synthetic.sourceType,"synthetic");
 assert.ok(report.evidence.recordCount>=30);
 assert.equal(report.structuredEvidence.recordCount,34);
 assert.equal(report.structuredEvidence.formallyRiskOfBiasAssessed,0);
});
