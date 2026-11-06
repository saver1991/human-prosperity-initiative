import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateResearchGovernance,assessResearchPublication,governanceStatus}
 from "../research-tools/research-governance.mjs";
import {verifyResearchGovernance}
 from "../scripts/rt01-governance-check.mjs";
const raw=await readFile("research/research-governance-gates.json","utf8");
const source=JSON.parse(raw);
const clone=()=>structuredClone(source);
const safeSynthetic={class:"synthetic",origin:"synthetic",scenarioType:"synthetic",
 hasPersonalRows:false,hasThirdPartyPayload:false,licenseReview:"not_applicable",
 reidentificationReview:"not_applicable",purpose:"fictional demonstration of aggregate outcomes"};
const safeMetadata={class:"public_reference_metadata",origin:"publisher_metadata",
 scenarioType:"none",hasPersonalRows:false,hasThirdPartyPayload:false,
 licenseReview:"metadata_only",reidentificationReview:"not_applicable",
 purpose:"source metadata and external attribution only"};
test("RT-01.4 governance policy lists eight human gates, no false professional approval",()=>{
 const p=validateResearchGovernance(source);
 assert.equal(p.publicationPolicy,"deny_by_default");
 assert.equal(p.prohibitedClasses.length,6);
 assert.equal(p.decisionGates.length,8);
 assert.ok(p.decisionGates.every(g=>g.state==="pending"));
 const r=governanceStatus(p);
 assert.equal(r.categories.independentScience,"pending");
 assert.equal(r.categories.realScreenReader,"not_tested");
 assert.equal(r.participantRecruitmentAuthorised,false);
 assert.equal(r.externalDatasetRedistributionAuthorised,false);
 assert.equal(r.dataProtectionComplianceCertified,false);
 assert.equal(r.independentScientificValidation,false);
 assert.equal(r.realWorldImpactMeasured,false);
 assert.equal(r.approvedPublicAssetPaths.length,3);
});
test("RT-01.4 allowlist admits only clearly synthetic or source metadata without real people",()=>{
 const synth=assessResearchPublication(source,safeSynthetic);
 const cite=assessResearchPublication(source,safeMetadata);
 assert.equal(synth.decision,"ALLOW_METADATA_OR_SYNTHETIC_ONLY");
 assert.equal(cite.decision,"ALLOW_METADATA_OR_SYNTHETIC_ONLY");
 assert.equal(synth.beneficiaryImpactMeasured,false);
 assert.equal(cite.scientificValidation,false);
});
test("RT-01.4 rejects pseudonymised rows, sensitive data, person-level effects and unknown papers",()=>{
 for(const input of [
  {...safeSynthetic,class:"pseudonymised_personal_data"},
  {...safeMetadata,class:"direct_identifiers"},
  {...safeMetadata,class:"sensitive_person_level"},
  {...safeMetadata,hasPersonalRows:true},
  {...safeMetadata,hasThirdPartyPayload:true},
  {...safeSynthetic,scenarioType:"real"},
  {...safeSynthetic,origin:"external_microdata"},
  {...safeMetadata,licenseReview:"independently_approved"},
  {...safeMetadata,purpose:""},
  {...safeMetadata,purpose:"x".repeat(201)}
 ]){
  const r=assessResearchPublication(source,input);
  assert.equal(r.decision,"DENY");
  assert.ok(r.reasons.length>=1);
 }
});
test("RT-01.4 public aggregates must be rejected until genuine human licensing and reidentification approval",()=>{
 const example={...safeMetadata,class:"approved_public_aggregate",
  origin:"source_controlled_public_aggregate",
  licenseReview:"independently_approved",
  reidentificationReview:"independently_approved",
  sourceDigest:"a".repeat(64)};
 const result=assessResearchPublication(source,example);
 assert.equal(result.decision,"DENY");
 assert.ok(result.reasons.includes("aggregate_external_approvals_not_recorded"));
});
test("RT-01.4 no self-declared science, real screen-reader or legal approval can be accepted",()=>{
 for(const [section,key] of [
  ["science","peerReviewCompleted"],["science","causalClaimsApproved"],
  ["science","measuredBeneficiaryImpact"],["privacy","lawfulBasisApproved"],
  ["privacy","dpiaCompleted"],["safeguarding","independentEthicsReview"],
  ["fundingAndInstitution","registeredLegalEntity"],
  ["accessibility","realScreenReaderVerified"]]){
  const p=clone();p[section][key]=true;
  assert.throws(()=>validateResearchGovernance(p),/self-certified/);
 }
 const q=clone();q.decisionGates[0].state="approved";
 assert.throws(()=>validateResearchGovernance(q),/pending/);
 const extra=clone();extra.unreviewedSecret="credential";
 assert.throws(()=>validateResearchGovernance(extra),/unexpected field/);
 const third=clone();third.publicAssets.push({id:"private",path:"/private",class:"synthetic",impactStage:"technical_tests_passed"});
 assert.throws(()=>validateResearchGovernance(third),/asset/);
});
test("RT-01.4 CI governance guard validates public artifacts and fails closed on falsified claims",async()=>{
 const result=await verifyResearchGovernance();
 assert.equal(result.status,"PASS");
 assert.equal(result.checkCitations,42);
 assert.equal(result.publicPersonalDataApproved,false);
 assert.equal(result.actualHumanStudyApproved,false);
 const read=async path=>{
  const raw=await readFile(path,"utf8");
  if(path.endsWith("research-pipeline-report.json")){
   const report=JSON.parse(raw);
   report.caveats.scientificSignoff=true;
   return JSON.stringify(report);
  }
  return raw;
 };
 await assert.rejects(()=>verifyResearchGovernance({read}),/overstates/);
 const read2=async path=>{
  const raw=await readFile(path,"utf8");
  if(path.endsWith("research-source-catalog.json")){
   const catalog=JSON.parse(raw);
   catalog.records[0].dataIngested=true;
   return JSON.stringify(catalog);
  }
  return raw;
 };
 await assert.rejects(()=>verifyResearchGovernance({read:read2}),/Unapproved source payload/);
 const read3=async path=>{
  if(path.endsWith("research-governance-status.json"))return "{}";
  return readFile(path,"utf8");
 };
 await assert.rejects(()=>verifyResearchGovernance({read:read3}),/drifted/);
});
test("RT-01.4 English and Italian pages work with no JS, lang tags and plain-text offline copies",async()=>{
 const en=await readFile("dist/research/responsible-tools.html","utf8");
 const it=await readFile("dist/research/responsible-tools/it.html","utf8");
 assert.match(en,/<html lang="en">/);
 assert.match(it,/<html lang="it">/);
 assert.match(en,/hreflang="it"/);
 assert.match(it,/hreflang="en"/);
 assert.match(en,/aria-label="External governance gates still pending"/);
 assert.match(it,/aria-label="Verifiche esterne in sospeso"/);
 assert.match(en,/No real participants/);
 assert.match(it,/Soltanto metadati pubblici/);
 assert.match(en,/href="\/research-governance-status.json"/);
 assert.match(it,/href="\/responsible-tools.it.txt"/);
 assert.doesNotMatch(en,/<script/);
 assert.doesNotMatch(it,/<script/);
 assert.ok((await readFile("dist/responsible-tools.en.txt","utf8")).includes("fictional"));
 assert.ok((await readFile("dist/responsible-tools.it.txt","utf8")).includes("pseudonimizzate"));
 const map=await readFile("dist/sitemap.xml","utf8");
 assert.match(map,/\/research\/responsible-tools/);
 assert.match(map,/\/research\/responsible-tools\/it/);
});
