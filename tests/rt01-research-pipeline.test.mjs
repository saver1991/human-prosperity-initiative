import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {generateResearchArtifacts,INPUTS,PUBLIC_OUTPUTS,sha256}
 from "../research-tools/research-pipeline.mjs";
import {verifyPublishedResearchArtifacts}
 from "../scripts/rt01-pipeline-verify.mjs";

const read=path=>readFile(path,"utf8");
const sourceValues=Object.fromEntries(await Promise.all(
 Object.values(INPUTS).map(async p=>[p,await read(p)])));
const load=async name=>{
 if(!Object.hasOwn(sourceValues,name))throw Error("Unlisted source");
 return sourceValues[name];
};
test("RT-01.3 all nine allowlisted sources yield deterministic exact-byte open science reports",async()=>{
 const a=await generateResearchArtifacts({load});
 const b=await generateResearchArtifacts({load});
 assert.deepEqual(a,b);
 assert.equal(a.report.sourceAudit.publicReferenceCount,39);
 assert.equal(a.report.sourceAudit.structuredAbstractOrSummaryCount,34);
 assert.equal(a.report.sourceAudit.curatedDatasetCandidateCount,3);
 assert.equal(a.report.sourceAudit.formallyBiasReviewedCount,0);
 assert.ok(Math.abs(a.report.syntheticResult.observedDifferencePercentagePoints-5)<1e-10);
 assert.equal(a.report.syntheticResult.causalInterpretation,"NOT_SUPPORTED");
 assert.equal(a.report.caveats.realWorldImpactMeasured,false);
 assert.equal(a.report.caveats.participantDataProcessed,false);
 assert.equal(a.report.caveats.scientificSignoff,false);
 assert.equal(a.manifest.sourceInputs.length,9);
 assert.equal(a.manifest.artifacts.length,4);
 assert.equal(a.manifest.promises.independentlyValidated,false);
 assert.equal(a.manifest.publicationCommit,"see_publication_json_revision");
 assert.ok(!JSON.stringify(a.manifest).includes("generatedAt"));
 for(const [name,path] of Object.entries(PUBLIC_OUTPUTS)){
  assert.ok(a.outputs[name].endsWith("\n"),path);
  if(name!=="manifest"){
   const att=a.manifest.artifacts.find(v=>v.path===path);
   assert.ok(att,path);
   assert.equal(att.sha256,sha256(a.outputs[name]));
   assert.equal(att.bytes,Buffer.byteLength(a.outputs[name]));
  }
 }
});
test("RT-01.3 citation manifest never republishes a study or asserts independent source verification",async()=>{
 const {outputs}=await generateResearchArtifacts({load});
 const c=JSON.parse(outputs.citations);
 assert.equal(c.sourceCount,42);
 assert.equal(c.citations.length,42);
 assert.ok(c.citations.every(x=>x.fullTextRedistributed===false));
 assert.ok(c.citations.every(x=>x.independentSourceVerification===false));
 assert.ok(c.citations.some(x=>x.licenceStatus==="unknown"));
 assert.ok(c.citations.every(x=>x.sourceUrl.startsWith("https://")));
 const d=JSON.parse(outputs.dictionary);
 assert.ok(d.suppressedSourceClasses.includes("participant_microdata"));
 assert.equal(d.independentResearchValidation,false);
 assert.ok(d.inputSets.some(s=>s.name==="synthetic_outcome_fixture"));
});
test("RT-01.3 source hashes change when public metadata changes; stale dist must fail",async()=>{
 const b=await generateResearchArtifacts({load});
 const changed=await generateResearchArtifacts({
  load:async path=>path===INPUTS.protocol?sourceValues[path]+"\n":load(path)
 });
 assert.notEqual(changed.manifest.sourceInputs.find(x=>x.path===INPUTS.protocol)?.sha256,
  b.manifest.sourceInputs.find(x=>x.path===INPUTS.protocol)?.sha256);
 assert.notEqual(changed.outputs.manifest,b.outputs.manifest);
 const verified=await verifyPublishedResearchArtifacts();
 assert.equal(verified.status,"PASS");
 assert.equal(verified.verifiedArtifacts,5);
 assert.equal(verified.publicSourceInputCount,9);
 assert.equal(verified.syntheticOnly,true);
 assert.equal(verified.independentlyValidatedScientificClaims,false);
 await assert.rejects(
  verifyPublishedResearchArtifacts({read:async path=>{
   if(path==="dist/research-citation-manifest.json")return b.outputs.citations+"tampered";
   return read(path);
  }}),/Published artifact bytes changed or stale/);
 await assert.rejects(
  verifyPublishedResearchArtifacts({read:async path=>{
   if(path==="dist/research-pipeline-report.json")throw Error("missing report");
   return read(path);
  }}),/missing report/);
});
test("RT-01.3 archive copies only the five allowed canonical public JSON artifacts",async()=>{
 const calls=[],dirs=[];
 const res=await verifyPublishedResearchArtifacts({
  read,archive:true,
  createDir:async(dir)=>{dirs.push(dir)},
  write:async(path,data)=>{calls.push({path,data})}
 });
 assert.equal(res.archiveRequested,true);
 assert.equal(calls.length,5);
 assert.deepEqual(dirs,["qa-artifacts/research-pipeline"]);
 assert.ok(calls.every(x=>x.path.startsWith("qa-artifacts/research-pipeline/")&&x.path.endsWith(".json")));
 assert.ok(calls.some(x=>x.path.endsWith(PUBLIC_OUTPUTS.manifest)));
 assert.ok(calls.every(x=>!x.data.includes("authorization: Bearer ")));
});
test("RT-01.3 invalid sources and claims cannot masquerade as a scientific report",async()=>{
 const wrongLicence=async p=>p===INPUTS.softwareLicense?"Proprietary licence":load(p);
 await assert.rejects(generateResearchArtifacts({load:wrongLicence}),/licence declarations changed/);
 const wrongFixture=async p=>p===INPUTS.fixture?JSON.stringify({
  ...JSON.parse(sourceValues[p]),statement:"REAL PARTICIPANT DATA"}):load(p);
 await assert.rejects(generateResearchArtifacts({load:wrongFixture}),/only permits labelled synthetic/);
 const wrongIndicator=async p=>p===INPUTS.indicators?
  sourceValues[p].replace("proposed_not_validated","validated"):load(p);
 await assert.rejects(generateResearchArtifacts({load:wrongIndicator}),/independently unvalidated/);
 const truncated=async p=>p===INPUTS.ledger?"":load(p);
 await assert.rejects(generateResearchArtifacts({load:truncated}),/Missing or oversized source input/);
});
test("RT-01.3 correction history refuses backward dates, fabricated revisions and supersession",async()=>{
 const raw=JSON.parse(sourceValues[INPUTS.corrections]);
 const testHistory=async h=>generateResearchArtifacts({
  load:async p=>p===INPUTS.corrections?JSON.stringify(h):load(p)
 });
 const dup=structuredClone(raw);dup.entries.push({...dup.entries[0]});
 await assert.rejects(testHistory(dup),/Non-monotonic|duplicate/);
 const invalid=structuredClone(raw);
 invalid.entries.push({release:"rt01-3-v2",date:"2026-10-01",changeType:"correction",
  supersedes:"rt01-3-v1",description:"A valid-length corrected entry describing a source error."});
 await assert.rejects(testHistory(invalid),/Non-monotonic/);
 const noPrior=structuredClone(raw);
 noPrior.entries.push({release:"rt01-3-v2",date:"2026-11-07",changeType:"correction",
  supersedes:"nonexisting",description:"A valid-length corrected entry describing a source error."});
 await assert.rejects(testHistory(noPrior),/must point to a preceding release/);
 const valid=structuredClone(raw);
 valid.entries.push({release:"rt01-3-v2",date:"2026-11-07",changeType:"correction",
  supersedes:"rt01-3-v1",description:"Future hypothetical revision demonstrates append-only provenance."});
 const future=await testHistory(valid);
 assert.equal(future.manifest.correctionHistoryRelease,"rt01-3-v2");
});
test("RT-01.3 optional notebook is reproducible and does not claim a pre-executed analysis",async()=>{
 const nb=JSON.parse(await read("research/notebooks/rt01-public-source-workflow.ipynb"));
 assert.equal(nb.nbformat,4);
 assert.equal(nb.metadata.kernelspec.name,"python3");
 assert.ok(nb.cells.some(x=>x.cell_type==="code"));
 assert.ok(nb.cells.filter(x=>x.cell_type==="code").every(x=>
  x.execution_count===null&&Array.isArray(x.outputs)&&x.outputs.length===0));
 const code=nb.cells.filter(x=>x.cell_type==="code").map(c=>c.source.join("")).join("\n");
 assert.match(code,/rt01-pipeline-verify\.mjs/);
 assert.doesNotMatch(code,/(requests\.|urllib\.|pip install|subprocess\.run\(\[\s*['"]curl)/);
 assert.ok(code.includes("independentlyValidatedResearch")===false);
 const published=await read("dist/research-reproducibility-notebook.ipynb");
 assert.equal(published,await read("research/notebooks/rt01-public-source-workflow.ipynb"));
});
test("RT-01.3 public first-party site provides accessible sources and no fake impact",async()=>{
 const html=await read("dist/research/reproducibility.html");
 assert.match(html,/Reproducible open-science pipeline/);
 assert.match(html,/Technical reproducibility only/);
 assert.match(html,/NOT_SUPPORTED/);
 assert.match(html,/aria-label="Content hashes for research pipeline inputs"/);
 for(const path of Object.values(PUBLIC_OUTPUTS))
  assert.ok(html.includes('href="/'+path+'"'),"Missing first-party artifact "+path);
 assert.match(html,/href="\/research-reproducibility-notebook.ipynb"/);
 const siteMap=await read("dist/sitemap.xml");
 assert.ok(siteMap.includes("/research/reproducibility"));
 const publication=JSON.parse(await read("dist/publication.json"));
 assert.equal(publication.researchPipelineVersion,"1.0.0");
});
