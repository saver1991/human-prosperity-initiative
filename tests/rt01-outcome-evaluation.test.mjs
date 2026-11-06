import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {getCandidateIndicator,toOutcomeIndicator} from "../research-tools/indicator-contract.mjs";
import {analyzeOutcomeScenario,simulateSyntheticOutcomes,wilson95,newcombeDifference95}
 from "../research-tools/outcome-evaluation.mjs";
import {verifySyntheticOutcomeScenario} from "../scripts/rt01-outcome-check.mjs";
const raw=await readFile("research/F0-03-indicator-catalog-v0.1.csv","utf8");
const indicator=toOutcomeIndicator(getCandidateIndicator(raw,"HPI-B-01"));
const fixture=JSON.parse(await readFile("research/synthetic-outcome-scenario-v1.json","utf8"));
const fresh=()=>structuredClone(fixture.scenario);
test("RT-01.2 uses an actual F0-03 draft indicator and never asserts scientific signoff",()=>{
 assert.equal(indicator.id,"HPI-B-01");
 assert.equal(indicator.status,"proposed_not_validated");
 assert.equal(indicator.unit,"share");
 assert.throws(()=>getCandidateIndicator(raw,"HPI-Z-99"),/not found/);
 assert.throws(()=>getCandidateIndicator(raw.replace("proposed_not_validated","validated"),"HPI-B-01"),/independently unvalidated/);
 assert.throws(()=>toOutcomeIndicator({...getCandidateIndicator(raw,"HPI-B-01"),scientificSignoff:true}),/Only draft/);
});
test("RT-01.2 Wilson coverage and Newcombe independent-binomial interval are bounded",()=>{
 const w=wilson95(6,100);
 assert.ok(w.lower>0.02&&w.lower<0.035);
 assert.ok(w.upper>0.115&&w.upper<0.13);
 assert.deepEqual(wilson95(0,100).lower,0);
 assert.deepEqual(wilson95(100,100).upper,1);
 const d=newcombeDifference95({received:6,observed:100},{received:11,observed:100});
 assert.ok(d.lower<0&&d.upper>0);
 assert.ok(d.lower>=-1&&d.upper<=1);
 assert.equal(d.assumptionsVerified,false);
});
test("RT-01.2 audits baseline, verified counts, attrition, harms, cost, strata and noncausal labels",()=>{
 const r=analyzeOutcomeScenario(fresh(),indicator);
 assert.ok(Math.abs(r.observedDifferencePercentagePoints-5)<1e-12);
 assert.equal(r.reference.baseline.received,3);
 assert.equal(r.comparison.baseline.received,4);
 assert.equal(r.reference.harmsReported,2);
 assert.equal(r.comparison.harmsReported,1);
 assert.equal(r.reference.observedCostPerReceiptMinor,4000/6);
 assert.equal(r.comparison.observedCostPerReceiptMinor,6000/11);
 assert.equal(r.equityComparisons.length,2);
 assert.equal(r.equityComparisons[0].causalInterpretation,"NOT_SUPPORTED");
 assert.equal(r.missingnessSensitivity.differencePercentagePoints.lower,5);
 assert.equal(r.missingnessSensitivity.differencePercentagePoints.upper,5);
 assert.equal(r.causalInterpretation,"NOT_SUPPORTED");
 assert.equal(r.independentlyValidated,false);
 assert.equal(r.costEffectivenessEstablished,false);
 assert.equal(r.measuredPopulationImpact,false);
 assert.equal(r.indicator.status,"proposed_not_validated");
});
test("RT-01.2 preserves null, negative, zero-baseline results and uncertainty without unsupported inference",()=>{
 const zero=fresh();zero.reference.received=0;zero.reference.strata=[
  {category:"Synthetic stratum A",eligible:50,received:0,missingFollowup:0},
  {category:"Synthetic stratum B",eligible:50,received:0,missingFollowup:0}
 ];
 zero.comparison.received=0;zero.comparison.strata=[
  {category:"Synthetic stratum A",eligible:50,received:0,missingFollowup:0},
  {category:"Synthetic stratum B",eligible:50,received:0,missingFollowup:0}
 ];
 const r=analyzeOutcomeScenario(zero,indicator);
 assert.equal(r.observedRiskRatio,null);
 assert.equal(r.observedDifferencePercentagePoints,0);
 assert.equal(r.reference.observedCostPerReceiptMinor,null);
 const adverse=fresh();adverse.comparison.received=2;
 adverse.comparison.strata[0].received=1;adverse.comparison.strata[1].received=1;
 assert.ok(analyzeOutcomeScenario(adverse,indicator).observedDifferencePercentagePoints<0);
});
test("RT-01.2 nonzero missingness gives transparent worst/best difference bounds",()=>{
 const x=fresh();
 x.reference.missingFollowup=20;x.reference.strata[0].missingFollowup=10;x.reference.strata[1].missingFollowup=10;
 x.comparison.missingFollowup=20;x.comparison.strata[0].missingFollowup=10;x.comparison.strata[1].missingFollowup=10;
 const r=analyzeOutcomeScenario(x,indicator);
 assert.ok(Math.abs(r.reference.observedRate-0.075)<1e-12);
 assert.ok(Math.abs(r.comparison.observedRate-0.1375)<1e-12);
 assert.ok(Math.abs(r.missingnessSensitivity.differencePercentagePoints.lower-(-15))<1e-12);
 assert.ok(Math.abs(r.missingnessSensitivity.differencePercentagePoints.upper-25)<1e-12);
 const noAssumption=fresh();noAssumption.independentBinomialAssumption=false;
 assert.equal(analyzeOutcomeScenario(noAssumption,indicator).uncertainty.conditionalIntervals,null);
});
test("RT-01.2 refuses individual data, misleading metrics, invalid denominators, unsafe strata and privacy-risk public counts",()=>{
 const bad=fresh();bad.reference.respondentEmail="person@example.org";
 assert.throws(()=>analyzeOutcomeScenario(bad,indicator),/unsupported field/);
 const invalid=fresh();invalid.comparison.received=101;
 assert.throws(()=>analyzeOutcomeScenario(invalid,indicator),/inconsistent counts/);
 const tooMany=fresh();tooMany.reference.harmsReported=101;
 assert.throws(()=>analyzeOutcomeScenario(tooMany,indicator),/harms exceed/);
 const misaligned=fresh();misaligned.indicatorId="HPI-A-01";
 assert.throws(()=>analyzeOutcomeScenario(misaligned,indicator),/aligned/);
 const strata=fresh();strata.reference.strata[0].received=3;
 assert.throws(()=>analyzeOutcomeScenario(strata,indicator),/strata cannot be reconciled/);
 const fake=fresh();fake.sourceType="public_aggregate";
 assert.throws(()=>analyzeOutcomeScenario(fake,indicator),/must be a record/);
 const source={kind:"hpi-normalised-aggregate",schemaVersion:"1.0",sourceKind:"public_aggregate",
  sourceId:"WB-PIP",sourceSha256:"a".repeat(64),participantRecordsUsed:false};
 fake.sourceProvenance=source;
 assert.throws(()=>analyzeOutcomeScenario(fake,indicator),/suppression/);
});
test("RT-01.2 synthetic binomial simulations are deterministically reproducible and never causal estimates",()=>{
 const simulation=fixture.simulation;
 const r=simulateSyntheticOutcomes(simulation);
 assert.deepEqual(r,simulateSyntheticOutcomes(simulation));
 assert.equal(r.iterations,1000);
 assert.equal(r.notARealWorldConfidenceInterval,true);
 assert.equal(r.causalInterpretation,"NOT_SUPPORTED");
 assert.ok(r.simulatedVariationPercentiles.p025<r.simulatedVariationPercentiles.median);
 assert.ok(r.simulatedVariationPercentiles.p975>r.simulatedVariationPercentiles.median);
 const change={...simulation,seed:18};
 assert.notDeepEqual(r.simulatedVariationPercentiles,simulateSyntheticOutcomes(change).simulatedVariationPercentiles);
 assert.throws(()=>simulateSyntheticOutcomes({...simulation,iterations:5000}),/bounded/);
 assert.throws(()=>simulateSyntheticOutcomes({...simulation,reference:{...simulation.reference,receiptProbability:1.2}}),/Invalid synthetic/);
});
test("RT-01.2 offline evidence report is pinned, synthetic and disconnected from external data",async()=>{
 const r=await verifySyntheticOutcomeScenario();
 assert.match(r.inputs.indicatorCatalogSha256,/^[a-f0-9]{64}$/);
 assert.match(r.inputs.fixtureSha256,/^[a-f0-9]{64}$/);
 assert.equal(r.outcome.causalInterpretation,"NOT_SUPPORTED");
 assert.equal(r.simulation.measuredPopulationImpact,false);
 assert.equal(r.independentlyValidatedResearch,false);
 assert.equal(r.participantRecordsUsed,false);
});
test("RT-01.2 public lab is a first-party functional module with explicit synthetic/causal warnings",async()=>{
 const html=await readFile("dist/research/outcome-lab.html","utf8");
 const sitemap=await readFile("dist/sitemap.xml","utf8");
 const script=await readFile("dist/outcome-lab.js","utf8");
 assert.ok(html.includes('id="outcome-demo"'));
 assert.ok(html.includes('id="outcome-demo-result" role="status" aria-live="polite"'));
 assert.ok(html.includes('src="/outcome-lab.js" type="module"'));
 assert.ok(html.includes("SYNTHETIC ONLY"));
 assert.ok(sitemap.includes("/research/outcome-lab"));
 assert.ok(script.includes("analyzeOutcomeScenario"));
 assert.ok(!script.includes("fetch("));
});
