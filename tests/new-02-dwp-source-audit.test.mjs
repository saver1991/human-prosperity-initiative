import test from "node:test";
import assert from "node:assert/strict";
import {readFile,stat} from "node:fs/promises";

const read=path=>readFile(path,"utf8");
const audited=JSON.parse(await read("research/NEW-02-dwp-newham-local-official-facts-v0.2.json"));

test("NEW-02 official source and geography are source and byte pinned",()=>{
 assert.equal(audited.schemaVersion,"0.2");
 assert.equal(audited.publisher,"Department for Work and Pensions");
 assert.equal(audited.releaseDate,"2025-10-30");
 assert.equal(audited.referenceFinancialYear,"2023/24");
 assert.equal(audited.sourceBytes,135855);
 assert.equal(audited.sourceSha256,"89f5a5fa831f21c4661d6e73ccb76878959e6ea721fb459b43aa3d9bcd96765c");
 assert.match(audited.sourceUrl,/^https:\/\/assets\.publishing\.service\.gov\.uk\/media\//);
 assert.equal(audited.localAuthority.onsGssCode,"E09000025");
 assert.equal(audited.localAuthority.onsCodePresentInDwpWorkbook,false);
});

test("NEW-02 DWP 3a exact physical row and model-only arithmetic",()=>{
 const m=audited.caseload;
 assert.equal(m.worksheet,"3a");assert.equal(m.physicalRow,109);
 assert.deepEqual(m.columns,{A:"London",B:"Newham",C:"11,300",D:"2,500",E:"8,800",F:"78%"});
 assert.equal(m.receivingHouseholds+m.potentiallyEligibleNotReceivingHouseholds,m.allEligibleModelledHouseholds);
 assert.equal(Math.round(100*m.receivingHouseholds/m.allEligibleModelledHouseholds),m.administrativeCaseloadReceiptPct);
 assert.equal(m.administrativeCaseloadReceiptPct,78);
 assert.match(m.statisticClass,/administrative model/);
 assert.match(m.unit,/households/);
});

test("NEW-02 3b expenditure is not silently interpreted as pounds or claimed impact",()=>{
 const m=audited.expenditure;
 assert.equal(m.worksheet,"3b");assert.equal(m.physicalRow,110);
 assert.deepEqual(m.columns,{A:"London",B:"Newham",C:"8,328,000",D:"51,337,000",E:"86%"});
 assert.equal(m.estimatedExpenditureReceiptPct,86);
 assert.equal(m.unitsOfAmountsIndependentlyReconciled,false);
 assert.equal(m.usableForHpiCostOrImpact,false);
 assert.match(m.sourceHeaderAnomaly,/£m/);
});

test("NEW-02 never derives HPI-B-01 recipient/eligible participant outcome from ecological data",()=>{
 const m=audited.hpiB01;
 assert.equal(m.status,"candidate_primary_unmeasurable");
 assert.equal(m.eligibleParticipantDenominator,null);
 assert.equal(m.confirmedFirstPaidAwardNumerator,null);
 assert.equal(m.validatedOutcomeReceiptPct,null);
 assert.equal(m.causalImpact,null);
 assert.equal(audited.noFieldWork,true);
 assert.equal(audited.noPersonalDataCollected,true);
 assert.equal(audited.noPartnerContact,true);
 assert.equal(audited.independentEthicsApproved,false);
 assert.equal(audited.additionality.verifiedIndependentIncrementalEffect,null);
 assert.equal(audited.contrasts.find(x=>x.geo==="Great Britain").comparableWithLocalModel,false);
 assert.equal(audited.contrasts.find(x=>x.geo==="Great Britain").pct,62);
});

test("NEW-02 first-party pages publish pinned row and do not authorise fieldwork",async()=>{
 const html=await read("dist/research/new-02-newham-source-reconciliation-additionality-v0-2.html");
 for(const term of ["11,300","8,800","2,500","78%","86%","NO-GO","HPI-B-01","source"])
  assert.ok(html.includes(term),"Missing evidence / boundary "+term);
 assert.match(html,/href="\/research-newham-dwp-official-facts.json"/);
 const published=JSON.parse(await read("dist/research-newham-dwp-official-facts.json"));
 assert.deepEqual(published,audited);
 const older=await read("dist/research/new-02-newham-source-reconciliation-additionality-v0-1.html");
 assert.match(older,/Superseded on 9 November 2026/);
 const dashboard=await read("dist/research/newham-prepilot.html");
 for(const term of ["11,300","8,800","2,500","78%","NO-GO: FIELDWORK"])
  assert.ok(dashboard.includes(term));
 assert.match(dashboard,/href="\/research\/new-02-newham-source-reconciliation-additionality-v0-2"/);
 await stat("scripts/verify_newham_dwp_ods.py");
});

test("NEW-02 dated public roadmap declares local source verification but true cohort missing",async()=>{
 const snapshot=JSON.parse(await read("portfolio/public-roadmap.json"));
 const f0=snapshot.initiatives.find(x=>x.id==="F0-02");
 assert.ok(f0.deliverables.some(d=>d.url==="/research/new-02-newham-source-reconciliation-additionality-v0-2"));
 assert.match(f0.gate,/NO_GO_FIELD/);
 assert.match(f0.gate,/HPI-B-01 denominator/);
 assert.match(f0.gate,/78%/);
 assert.match(await read("docs/roadmap.md"),/NEW-02: exact DWP Newham data extracted/);
});
