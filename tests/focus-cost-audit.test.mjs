import test from "node:test";
import assert from "node:assert/strict";
import {auditProjectCosts,parseQuotedCsv} from "../scripts/focus-cost-audit.mjs";
const P="prj_qJNfyJL17JNpEiuNlafJPZZKYkMN",OTHER="prj_12345abcde";
const r=(cost,project)=>({BillingCurrency:"USD",BilledCost:cost,ServiceName:"Build CPU Minutes",
 Tags:project?{ProjectId:project}:{}});
test("FOCUS auditor attributes verified project ID charges and never assigns shared-team charges",()=>{
 const result=auditProjectCosts([r(2.5,P),r(4,OTHER),r(7,null)],{projectId:P,completeExport:true,warnUsd:3});
 assert.equal(result.status,"partial_or_unverified");
 assert.equal(result.knownProjectBilledSubtotal,2.5);
 assert.equal(result.unallocatedTeamBilledSubtotal,7);
 assert.equal(result.taggedOtherProjectsSubtotal,4);
 assert.equal(result.projectTotalProven,false);
});
test("FOCUS auditor does not mistake sampled API records for complete provider bill",()=>{
 const result=auditProjectCosts([r(0,P)],{projectId:P,completeExport:false});
 assert.equal(result.status,"partial_or_unverified");
 assert.equal(result.projectTotalProven,false);
});
test("FOCUS auditor supports complete all-tagged exports with explicit project-specific thresholds",()=>{
 const result=auditProjectCosts([r(3.2,P),r(2.8,P),r(4,OTHER)],{
  projectId:P,completeExport:true,warnUsd:5,limitUsd:5.5});
 assert.equal(result.status,"fully_attributed");
 assert.equal(result.projectTotalProven,true);
 assert.equal(result.knownProjectBilledSubtotal,6);
 assert.equal(result.limitExceededKnownSubtotal,true);
 assert.match(result.warning,/above_warning_threshold/);
});
test("FOCUS auditor robustly parses quoted CSV with JSON tags",()=>{
 const csv='BillingCurrency,BilledCost,ServiceName,Tags\nUSD,2.5,"Build, CPU","{""ProjectId"":""'+P+'""}"\n';
 const data=parseQuotedCsv(csv);
 assert.equal(data[0].ServiceName,"Build, CPU");
 assert.equal(auditProjectCosts(data,{projectId:P,completeExport:true}).knownProjectBilledSubtotal,2.5);
});
test("FOCUS auditor rejects mixed currency, negative amount, malformed tags and missing sources",()=>{
 assert.throws(()=>auditProjectCosts([],{projectId:P}),/Missing/);
 assert.throws(()=>auditProjectCosts([r(-1,P)],{projectId:P}),/invalid/);
 assert.throws(()=>auditProjectCosts([{...r(1,P),BillingCurrency:"GBP"}],{projectId:P}),/currencies/);
 assert.throws(()=>auditProjectCosts([{...r(1,P),Tags:"not-json"}],{projectId:P}),/Malformed/);
 assert.throws(()=>auditProjectCosts([r(1,P)],{projectId:"bad"}),/project ID/);
 assert.throws(()=>parseQuotedCsv('A,B\n"a,b\n'),/Unclosed/);
});
