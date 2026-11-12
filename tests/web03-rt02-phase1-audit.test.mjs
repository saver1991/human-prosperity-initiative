import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {getPublicIssueFeed} from "../api/issues.js";
import {getPublicationFreshness} from "../api/freshness.js";

const read=path=>readFile(path,"utf8");
const ia=JSON.parse(await read("portfolio/web-03-1-ia-audit.json"));
const tools=JSON.parse(await read("portfolio/rt-02-1-tool-inventory.json"));
const policies=JSON.parse(await read("portfolio/web-03-6-legal-help-page-register.json"));
const project=JSON.parse(await read("portfolio/project.json"));
const publicRoadmap=JSON.parse(await read("portfolio/public-roadmap.json"));

test("WEB-03.1 audit covers real navigation, source conflicts, missing policies and broken GitHub issue APIs",()=>{
 assert.equal(ia.auditedOn,"2026-11-11");
 assert.equal(ia.initiative,"WEB-03.1");
 assert.equal(ia.canonicalRepository,"svtmzt/human-prosperity-initiative");
 assert.deepEqual(ia.observedGlobalNavigation,["Mission","Research","Roadmap","Library","Get involved"]);
 assert.ok(ia.presentRoutes.includes("/research/outcome-lab"));
 assert.ok(ia.presentRoutes.includes("/research/source-catalog"));
 for(const p of ["/privacy","/cookies","/terms","/legal","/accessibility","/help","/contact","/about"]) assert.ok(ia.testedMissingCandidateRoutes.includes(p),p);
 assert.ok(ia.findings.some(x=>x.id==="IA-04"&&x.priority==="P0"));
 assert.ok(ia.findings.some(x=>x.id==="IA-13"&&x.priority==="P0"));
 assert.equal(ia.observedApiFailuresBeforeFix.length,2);
 assert.equal(ia.targetJourneys.length,4);
 assert.equal(ia.verification.actualHumanUsabilityTesting,false);
 assert.equal(ia.verification.humanAssistiveTechnologyTesting,false);
 assert.equal(ia.verification.browserCookieStorageRuntimeAudit,false);
 assert.equal(ia.verification.privacyCookieTermsPagesPublished,false);
 assert.equal(ia.verification.redesignImplemented,false);
});

test("RT-02.1 captures four actual public instrument experiences and forbids false validity",()=>{
 assert.equal(tools.schemaVersion,"0.1");
 assert.equal(tools.publicToolProducts.length,4);
 assert.deepEqual(tools.publicToolProducts.map(x=>x.id),["source-catalog","synthetic-outcome-lab","reproducibility","responsible-tools"]);
 assert.ok(tools.publicToolProducts.every(x=>x.httpObserved===200));
 const c=tools.publicToolProducts[0];
 assert.equal(c.recordCount,42);
 assert.equal(c.evidenceReferences,39);
 assert.equal(c.unimportedDatasetCandidates,3);
 assert.equal(c.scientificallyValidated,false);
 assert.equal(c.legalRightsIndependentlyApproved,false);
 const sim=tools.publicToolProducts[1];
 assert.equal(sim.userInput.length,8);
 assert.match(sim.dataType,/synthetic/);
 assert.equal(sim.realBenefitOutcomeVerified,false);
 assert.equal(tools.relatedResearchCaseStudy.realParticipantCohortEligibilityDenominator,null);
 assert.equal(tools.relatedResearchCaseStudy.firstPaidAwardNumerator,null);
 assert.equal(tools.verification.realParticipantsEnrolled,false);
 assert.equal(tools.verification.humanUsabilitySessions,false);
 assert.equal(tools.verification.fullThirdPartyDataRightsVerified,false);
 assert.equal(tools.verification.toolsHubImplemented,false);
});

test("WEB-03.6 identifies conditional legal and support content but never publishes fictitious approval",()=>{
 assert.equal(policies.initiative,"WEB-03.6");
 assert.equal(policies.publisherLegalEntityStatus,"not_incorporated");
 assert.equal(policies.complianceApproved,false);
 assert.equal(policies.legalAdviceObtained,false);
 assert.equal(policies.formalPrivacyNoticeRequiresRealDataInventory,true);
 assert.equal(policies.confidentialSafeguardingChannelPresent,false);
 assert.equal(policies.independentManualAccessibilityApproval,false);
 const ids=policies.proposedPages.map(p=>p.id);
 for(const id of ["privacy","cookies","terms","legal","copyright-licenses","accessibility","help","contact","about"])assert.ok(ids.includes(id));
 assert.equal(policies.complianceApproved,false);
 assert.equal(policies.actualPrivacyControllerNamed,false);
 assert.equal(policies.actualPrivateContactChannel,false);
 assert.equal(policies.fullProviderStorageAuditPassed,false);
 assert.equal(policies.technicalPagesCreated,11);
 assert.equal(policies.proposedPages.filter(x=>x.implementationStatus==="published_interim_source_based").length,11);
 assert.equal(policies.proposedPages.filter(x=>x.id==="safeguarding"||x.id==="cookie-settings").every(x=>x.implementationStatus==="deferred_until_real_need_and_authorisation"),true);
 assert.equal(policies.proposedPages.find(x=>x.id==="cookie-settings").observedStatus,"conditional");
 assert.equal(policies.proposedPages.find(x=>x.id==="safeguarding").observedStatus,"conditional");
});

test("canonical HPI model registers bounded completed WEB-03.1 / RT-02.1 and future policy changes as planned",async()=>{
 const p=new Map(project.initiatives.map(x=>[x.id,x]));
 const r=new Map(publicRoadmap.initiatives.map(x=>[x.id,x]));
 assert.equal(p.size,14);
 assert.equal(p.get("WEB-03").issue,85);
 assert.equal(p.get("RT-02").issue,86);
 for(const [parent,first,doc,issue] of [
  ["WEB-03","WEB-03.1","/library/docs/web-03-1-website-ia-and-experience-audit-v0-1",87],
  ["RT-02","RT-02.1","/library/docs/rt-02-1-public-research-tools-product-inventory-v0-1",88]
 ]){
  const x=r.get(parent);
  assert.ok(x.deliverables.some(d=>d.url===doc));
  assert.equal(x.epics.length,7);
  const e=x.epics.find(ep=>ep.id===first);
  assert.equal(e.issue,issue);
  assert.equal(e.status,"complete");
  assert.equal(e.tasks.length,5);
  for(const t of e.tasks){assert.equal(t.status,"complete");assert.equal(t.evidence,"https://github.com/svtmzt/human-prosperity-initiative/pull/90")}
  if(parent==="RT-02"){
   assert.ok(x.epics.filter(ep=>ep.id!==first).every(ep=>ep.status==="planned"&&ep.tasks.every(t=>t.status==="planned")));
  }else{
   const statuses=new Map(x.epics.map(ep=>[ep.id,ep.status]));
   assert.equal(statuses.get("WEB-03.2"),"complete");
   assert.equal(statuses.get("WEB-03.3"),"in_progress");
   assert.equal(statuses.get("WEB-03.4"),"complete");
   assert.equal(statuses.get("WEB-03.5"),"in_progress");
   assert.equal(statuses.get("WEB-03.6"),"in_progress");
   assert.equal(statuses.get("WEB-03.7"),"complete");
   const human=x.epics.find(ep=>ep.id==="WEB-03.5");
   assert.equal(human.tasks.find(t=>t.id==="WEB-03.5-T02").status,"planned");
   assert.equal(human.tasks.find(t=>t.id==="WEB-03.5-T03").status,"planned");
  }
 }
 const legal=r.get("WEB-03").epics.find(x=>x.id==="WEB-03.6");
 assert.equal(legal.issue,89);
 assert.equal(legal.status,"in_progress");
 assert.equal(legal.tasks.length,6);
 assert.equal(project.legalEntityStatus,"not_incorporated");
 assert.match(r.get("WEB-03").gate,/Projects\/Tools public navigation implemented/i);
 assert.match(r.get("RT-02").gate,/SYNTHETIC ONLY/);
 assert.equal(publicRoadmap.reviewedAt,"2026-11-12");
 assert.match(await read("docs/roadmap.md"),/public experience and usable tools roadmap/);
});

test("Phase1 first-party Markdown outputs and roadmap deep-links exist",async()=>{
 const docs=[
 "dist/library/docs/web-03-1-website-ia-and-experience-audit-v0-1.html",
 "dist/library/docs/rt-02-1-public-research-tools-product-inventory-v0-1.html",
 "dist/library/docs/web-03-6-trust-legal-help-pages-register-v0-1.html"
 ];
 for(const file of docs){const t=await read(file);assert.match(t,/<main/);assert.match(t,/Phase 1|Phase-1|page register/);}
 const home=await read("dist/roadmap.html");
 assert.match(home,/WEB-03/);assert.match(home,/RT-02/);
 const web=await read("dist/initiatives/web-03.html");
 const rt=await read("dist/initiatives/rt-02.html");
 assert.match(web,/WEB-03.6/);assert.match(web,/WEB-03.1/);assert.match(rt,/RT-02.1/);
 assert.match(web,/Not|Planned|Review|Legal/i);
});

test("restored read-only GitHub APIs and monitor pin canonical owner rather than redirected owner",async()=>{
 const host="https://api.github.com/repos/svtmzt/human-prosperity-initiative";
 const issueSource=await read("api/issues.js");
 const freshnessSource=await read("api/freshness.js");
 const watchSource=await read("scripts/ops-watch.mjs");
 assert.ok(issueSource.includes(host+"/issues?"));
 assert.ok(freshnessSource.includes(host+"/commits/main"));
 assert.ok(watchSource.includes('export const REPO="'+host+'"'));
 assert.doesNotMatch(issueSource,/api.github.com\/repos\/saver1991/);
 assert.doesNotMatch(freshnessSource,/api.github.com\/repos\/saver1991/);
 assert.doesNotMatch(watchSource,/api.github.com\/repos\/saver1991/);
 const now="2026-11-11T12:00:00Z";
 let issueUrl="";
 const x=await getPublicIssueFeed(async url=>{issueUrl=url;return{ok:true,json:async()=>[{number:85,title:"WEB-03",state:"open",updated_at:now},{number:90,title:"PR",state:"open",updated_at:now,pull_request:{url:"ignored"}}]}});
 assert.ok(issueUrl.startsWith(host+"/issues?"));
 assert.deepEqual(x.issues.map(y=>y.number),[85]);
 let endpoints=[];
 const sha="a".repeat(40);
 const result=await getPublicationFreshness(async url=>{endpoints.push(url);return{ok:true,json:async()=>url.includes("publication.json")?{status:"published_from_git",revision:sha,sourceFileCount:4,routeCount:9,generatedAt:now}:{sha}}},()=>new Date(now));
 assert.ok(endpoints.includes(host+"/commits/main"));
 assert.equal(result.status,"current");
 assert.equal(result.checkedLive,true);
});
