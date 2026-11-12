import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {buildPublicRoadmap} from "../scripts/roadmap-model.mjs";
import {routeForSource,resolveLink} from "../scripts/site-content.mjs";

const read=p=>readFile(p,"utf8");
const ia=JSON.parse(await read("portfolio/web-03-2-information-architecture.json"));
const legal=JSON.parse(await read("portfolio/web-03-6-legal-help-page-register.json"));
const project=JSON.parse(await read("portfolio/project.json"));
const details=JSON.parse(await read("portfolio/public-roadmap.json"));
const map=buildPublicRoadmap(project,details,{revision:"a".repeat(40)});
const live=["privacy","cookies","terms","legal","copyright","accessibility","help","contact","about","research-integrity","site-map"];

test("WEB-03.2 canonical six-area IA preserves existing paths and does not advertise planned hubs as live",async()=>{
 assert.equal(ia.issue,91);
 assert.equal(ia.schemaVersion,"1.0");
 assert.deepEqual(ia.targetPrimaryNavigation.map(x=>x.label),["Mission","Projects","Research","Tools","Get involved","About & Governance"]);
 assert.equal(ia.targetPrimaryNavigation.find(x=>x.id==="projects").state,"planned_WEB-03.4");
 assert.equal(ia.targetPrimaryNavigation.find(x=>x.id==="tools").state,"planned_RT-02.2");
 assert.equal(ia.journeys.length,4);
 assert.ok(ia.journeys.every(x=>x.observedByUsers===false));
 assert.equal(ia.contentIntegrityGates.realHpiOutcomeNumerator,null);
 assert.equal(ia.contentIntegrityGates.realHpiOutcomeDenominator,null);
 assert.equal(ia.contentIntegrityGates.fieldStudyAuthorised,false);
 assert.equal(ia.humanAcceptance.userJourneyStudy,false);
 const js=JSON.parse(await read("dist/site-information-architecture.json"));
 assert.deepEqual(js,ia);
 const siteMap=await read("dist/site-map.html");
 assert.match(siteMap,/Current status/i);
 assert.match(siteMap,/href="\/projects"/);
 assert.match(siteMap,/href="\/tools"/);
 const sitemap=await read("dist/sitemap.xml");
 assert.match(sitemap,/<loc>https:\/\/human-prosperity-initiative.vercel.app\/projects<\/loc>/);
 assert.match(sitemap,/<loc>https:\/\/human-prosperity-initiative.vercel.app\/tools<\/loc>/);
});

test("WEB-03.6 publishes all 11 useful first-party human trust pages and canonical routes",async()=>{
 assert.equal(legal.technicalPagesCreated,11);
 assert.equal(legal.complianceApproved,false);
 assert.equal(legal.actualPrivacyControllerNamed,false);
 assert.equal(legal.actualPrivateContactChannel,false);
 assert.equal(legal.fullProviderStorageAuditPassed,false);
 const sitemap=await read("dist/sitemap.xml");
 const home=await read("dist/index.html");
 const research=await read("dist/research.html");
 for(const name of live){
  assert.equal(routeForSource("docs/site-pages/"+name+".md"),"/"+name);
  const html=await read("dist/"+name+".html");
  assert.match(html,/<!doctype html>/i,name);
  assert.match(html,/<main id="main" tabindex="-1"/,name);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,name);
  assert.match(html,new RegExp('rel="canonical" href="https:\\/\\/human-prosperity-initiative\\.vercel\\.app\\/'+name+'"'),name);
  assert.match(html,/aria-label="Help, trust and legal information"/,name);
  assert.ok(sitemap.includes("<loc>https://human-prosperity-initiative.vercel.app/"+name+"</loc>"),name);
  assert.ok(home.includes('href="/'+name+'"'),name);
  assert.ok(research.includes('href="/'+name+'"'),name);
 }
 assert.ok(!home.includes('href="/cookie-settings"'));
 assert.ok(!home.includes('href="/safeguarding"'));
 assert.deepEqual(JSON.parse(await read("dist/site-trust-page-status.json")),legal);
});

test("privacy, cookie and accessibility disclosures never invent approved legal controller, consent, operator or real tests",async()=>{
 const privacy=await read("dist/privacy.html");
 const cookies=await read("dist/cookies.html");
 const access=await read("dist/accessibility.html");
 const contact=await read("dist/contact.html");
 const legalPage=await read("dist/legal.html");
 const help=await read("dist/help.html");
 const copyright=await read("dist/copyright.html");
 const integrity=await read("dist/research-integrity.html");
 for(const marker of ["interim","Vercel","GitHub","lawful basis","retention","not yet","controller"]){
  assert.ok(privacy.toLowerCase().includes(marker.toLowerCase()),"privacy "+marker);
 }
 for(const marker of ["no cookies","host","not yet","consent","a statement that no cookies exist"]){
  assert.ok(cookies.toLowerCase().includes(marker.toLowerCase()),"cookie "+marker);
 }
 assert.match(cookies,/29 April 2026/);
 assert.match(access,/not yet independently assessed/);
 assert.match(access,/VoiceOver/);
 assert.match(contact,/no email address/i);
 assert.match(contact,/a private inbox/i);
 assert.match(legalPage,/not incorporated/);
 assert.match(help,/not.*government service/i);
 assert.match(copyright,/MIT licence/);
 assert.match(copyright,/CC BY 4.0/);
 assert.match(integrity,/78%/);
 assert.match(integrity,/86%/);
 assert.match(integrity,/62%/);
 assert.match(integrity,/NULL/);
 assert.doesNotMatch(privacy,/we are certified|fully compliant/i);
 assert.doesNotMatch(cookies,/<form/i);
});

test("WEB-03.2 design task technically accepted; WEB-03.6 legal human requirements remain OPEN",async()=>{
 const web=map.initiatives.find(x=>x.id==="WEB-03");
 assert.equal(web.epics.length,7);
 assert.equal(project.reviewedAt,"2026-11-12");
 assert.equal(details.reviewedAt,"2026-11-12");
 const e2=web.epics.find(x=>x.id==="WEB-03.2");
 const e6=web.epics.find(x=>x.id==="WEB-03.6");
 assert.equal(e2.issue,91);
 assert.equal(e2.status,"complete");
 assert.ok(e2.tasks.every(x=>x.status==="complete"&&x.evidence==="https://github.com/svtmzt/human-prosperity-initiative/pull/92"));
 assert.equal(e6.issue,89);
 assert.equal(e6.status,"in_progress");
 assert.equal(e6.tasks.filter(x=>x.status==="complete").length,4);
 assert.equal(e6.tasks.filter(x=>x.status==="planned").length,2);
 assert.ok(web.deliverables.some(x=>x.url==="/privacy"));
 assert.ok(web.deliverables.some(x=>x.url==="/help"));
 assert.equal(legal.complianceApproved,false);
 assert.match(web.gate,/NO_GO_FIELD/);
 assert.match(await read("docs/roadmap.md"),/WEB-03.2 IA design delivered/);
});

test("old and new canonical GitHub source links both resolve to first-party documents",()=>{
 const routes=new Map([["docs/charter.en.md","/mission"]]);
 for(const owner of ["saver1991","svtmzt"]){
  const a=resolveLink("https://github.com/"+owner+"/human-prosperity-initiative/blob/main/docs/charter.en.md","docs/start.md",routes);
  assert.deepEqual(a,{href:"/mission",external:false});
 }
 const x=resolveLink("https://github.com/svtmzt/human-prosperity-initiative/issues/91","docs/start.md",routes);
 assert.equal(x.href,"/activity#issue-91");
});

test("published browser scripts do not knowingly add third-party tracking or browser storage; edge audit still pending",async()=>{
 for(const name of ["site/activity.js","site/freshness.js","site/progress.js","site/research-catalog.js","site/outcome-lab.js","site/index.html"]){
  const source=await read(name);
  assert.doesNotMatch(source,/document\.cookie|localStorage\s*\.|sessionStorage\s*\.|indexedDB\s*\.|navigator\.sendBeacon|googletagmanager|gtag\s*\(|fbq\s*\(/i,"site-owned storage: "+name);
 }
 assert.equal(legal.sourceAudit.fullProviderRetentionAndTransferReview,false);
 assert.equal(legal.fullProviderStorageAuditPassed,false);
 assert.equal(legal.proposedPages.find(x=>x.id==="cookie-settings").implementationStatus,"deferred_until_real_need_and_authorisation");
 assert.equal(legal.proposedPages.find(x=>x.id==="safeguarding").implementationStatus,"deferred_until_real_need_and_authorisation");
});


test("every CircleCI job checks out the current canonical repository without old-owner redirects",async()=>{
 const config=await read(".circleci/config.yml");
 const current="https://github.com/svtmzt/human-prosperity-initiative.git";
 assert.equal(config.split(current).length-1,3);
 assert.ok(!config.includes("https://github.com/saver1991/human-prosperity-initiative.git"));
});

test("WEB-03.4 added audience-led project and tool discovery, with safe Newham chronology",async()=>{
 const home=await read("dist/index.html");
 const projects=await read("dist/projects.html");
 const newham=await read("dist/projects/newham.html");
 const tools=await read("dist/tools.html");
 const updates=await read("dist/updates.html");
 const archive=await read("dist/research/newham-pension-credit.html");
 const research=await read("dist/research.html");
 const status=JSON.parse(await read("dist/site-web-03-technical-acceptance.json"));
 for(const route of ["/projects","/projects/newham","/tools","/updates"]){
  assert.ok(home.includes('href="'+(route==="/projects/newham"?"/projects":route)+'"')||route==="/projects/newham",route);
  assert.ok((await read("dist/sitemap.xml")).includes("<loc>https://human-prosperity-initiative.vercel.app"+route+"</loc>"),route);
 }
 assert.match(home,/aria-label="Mobile navigation"/);
 assert.match(home,/class="mobile-menu"/);
 assert.match(home,/href="\/projects"/);
 assert.match(home,/href="\/tools"/);
 assert.match(projects,/NO-GO|no.*field/i);
 assert.match(newham,/11,300/);
 assert.match(newham,/8,800/);
 assert.match(newham,/78%/);
 assert.match(newham,/86%/);
 assert.match(newham,/62%/);
 assert.match(newham,/not.*HPI impact|not.*HPI results/i);
 assert.match(tools,/SYNTHETIC ONLY/);
 assert.match(research,/Evidence before claims/);
 assert.match(archive,/Supersession, 9 November 2026/);
 assert.match(updates,/Website updates are not human outcomes/);
 assert.equal(status.humanSignoffs.manualScreenReader,false);
 assert.equal(status.humanSignoffs.professionalLegal,false);
 assert.equal(status.dataControls.analyticsInstalled,false);
});
