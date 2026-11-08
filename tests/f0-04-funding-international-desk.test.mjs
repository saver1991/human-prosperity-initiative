import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {parseCsv,routeForSource} from "../scripts/site-content.mjs";

const p="docs/governance/";
const read=(name)=>readFile(p+name,"utf8");
const rows=async(name)=>{
 const [header,...body]=parseCsv(await read(name));
 return body.map(row=>Object.fromEntries(header.map((key,i)=>[key,row[i]])));
};
const registry="F0-04-5-funder-prospect-register-v0.1.csv";
const partners="F0-04-5-institutional-research-landscape-v0.1.csv";
const country="F0-04-6-country-readiness-controls-v0.1.csv";
const fundraisingDoc="F0-04-5-funding-and-institutional-prospecting-v0.1.md";
const internationalDoc="F0-04-6-international-operations-and-partner-controls-v0.1.md";

test("F0-04.5 real primary sources; no fabricated eligible grants or contacted partners",async()=>{
 const funders=await rows(registry);
 assert.equal(funders.length,7);
 assert.equal(new Set(funders.map(row=>row.id)).size,funders.length);
 assert.ok(funders.some(x=>x.id==="LOTTERY-AFA-ENG"));
 assert.ok(funders.some(x=>x.id==="UKRI-ESRC-ROUTE"));
 assert.ok(funders.some(x=>x.id==="UNGM"));
 for(const lead of funders){
  assert.equal(lead.checked_utc,"2026-11-08");
  assert.equal(lead.current_submission_authorised,"FALSE");
  assert.ok(["NOT_ELIGIBLE_NOW","DISCOVERY_ONLY"].includes(lead.lead_status));
  assert.match(lead.source_url,/^https:\/\//);
  assert.notEqual(lead.programme_window_asof,"AWARDED");
 }
 const groups=await rows(partners);
 assert.equal(groups.length,3);
 for(const candidate of groups){
  assert.equal(candidate.hosting_verified,"FALSE");
  assert.equal(candidate.eligible_grant_lead_for_HPI,"FALSE");
  assert.equal(candidate.contacted,"FALSE");
  assert.match(candidate.source_url,/^https:\/\//);
 }
 const doc=await read(fundraisingDoc);
 assert.match(doc,/NOT ELIGIBLE NOW/);
 assert.match(doc,/NO applications/);
 assert.match(doc,/What would unlock/);
 assert.match(doc,/UNGM/);
 assert.match(doc,/case for support/i);
 assert.match(doc,/£0 authorised/);
});

test("F0-04.6 every foreign-country implementation remains prohibited until human gates",async()=>{
 const countryRows=await rows(country);
 assert.deepEqual(countryRows.map(x=>x.country_id),["UK","BR","IT"]);
 assert.deepEqual(countryRows.map(x=>x.field_status),Array(3).fill("NO_GO_FIELD"));
 const hardStops=[
  "legal_entity_authorised","local_permission_verified","real_partner_verified",
  "grants_bank_control","tax_payroll_verified","safeguarding_human_owner",
  "ethics_and_data_rights","cross_border_transfer_permission",
  "sanctions_procurement_approved","fx_and_reconciliation_active"
 ];
 for(const row of countryRows){
  assert.equal(row.research_desk_allowed,"TRUE");
  assert.equal(row.checked_utc,"2026-11-08");
  assert.match(row.source_url,/^https:\/\//);
  for(const key of hardStops)assert.equal(row[key],"FALSE",row.country_id+" unexpected approval: "+key);
 }
 const doc=await read(internationalDoc);
 for(const term of ["G01","G13","Brazil","Italy","NO-GO","ANPD","Charity Commission","end-use"])
  assert.ok(doc.includes(term), "Missing safety control "+term);
 assert.match(doc,/international.*data/i);
 assert.match(doc,/NO site selection/);
});

test("F0-04.5/6 publicly routable on-site document and CSV pages",async()=>{
 const mapping=[
  [fundraisingDoc,"/library/docs/governance/f0-04-5-funding-and-institutional-prospecting-v0-1"],
  [registry,"/library/docs/governance/f0-04-5-funder-prospect-register-v0-1"],
  [partners,"/library/docs/governance/f0-04-5-institutional-research-landscape-v0-1"],
  [internationalDoc,"/library/docs/governance/f0-04-6-international-operations-and-partner-controls-v0-1"],
  [country,"/library/docs/governance/f0-04-6-country-readiness-controls-v0-1"]
 ];
 for(const [filename,route] of mapping){
  assert.equal(routeForSource(p+filename),route);
  const html=await readFile("dist"+route+".html","utf8");
  assert.match(html,/<main id="main"/);
  assert.match(html,/not a registered foundation/i);
  assert.match(html,/Published source/);
 }
 const html=await readFile("dist"+mapping[0][1]+".html","utf8");
 assert.match(html,/href="\/library\/docs\/governance\/f0-04-5-funder-prospect-register-v0-1"/);
 assert.match(html,/href="\/library\/docs\/governance\/f0-04-6-international-operations-and-partner-controls-v0-1"/);
});
