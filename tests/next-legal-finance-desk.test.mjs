import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {parseCsv,routeForSource} from "../scripts/site-content.mjs";

const read=path=>readFile(path,"utf8");
const budgetPath="docs/governance/F0-04-4-operating-budget-scenarios-v0.1.csv";
const reportPath="docs/governance/F0-04-4-operating-budget-and-sustainability-v0.1.md";
const legalPath="docs/governance/F0-04-2-legal-structure-and-international-objects-v0.1.md";
const newhamPath="research/NEW-02-newham-source-reconciliation-additionality-v0.1.md";

test("F0-04.4 financial scenarios recompute correctly from transparent input columns",async()=>{
 const [headers,...body]=parseCsv(await read(budgetPath));
 assert.equal(body.length,3);
 const rows=body.map(values=>Object.fromEntries(headers.map((h,i)=>[h,values[i]])));
 const categories=[
  "personnel_coordination_gbp_month","research_methods_evaluation_gbp_month",
  "legal_finance_governance_gbp_month","cloud_software_security_gbp_month",
  "community_accessibility_safeguarding_gbp_month",
  "admin_insurance_communications_gbp_month","international_partner_diligence_gbp_month"
 ];
 const expected={Lean:[1250,20900,16500,37400,4125,8525],
  Base:[8000,124200,110400,234600,27600,41400],
  Expanded:[26000,416400,374400,790800,93600,135600]};
 for(const row of rows){
  assert.equal(row.model_type,"ILLUSTRATIVE_NOT_QUOTED");
  const monthly=categories.reduce((sum,k)=>sum+Number(row[k]),0);
  const setup=Number(row.setup_once_gbp),rate=Number(row.contingency_rate);
  const first=Math.round((12*monthly+setup)*(1+rate));
  const second=Math.round(12*monthly*(1+rate));
  const twentyFour=first+second;
  const buffer=Math.round(3*monthly*(1+rate));
  const opening=Math.round((setup+3*monthly)*(1+rate));
  assert.deepEqual([monthly,first,second,twentyFour,buffer,opening],expected[row.scenario]);
  assert.deepEqual(
   ["monthly_total_gbp","first_year_gbp","second_year_gbp","twenty_four_month_gbp",
    "three_month_unrestricted_reserve_illustration_gbp","opening_liquidity_screen_gbp"]
   .map(k=>Number(row[k])),expected[row.scenario]);
 }
 const memo=await read(reportPath);
 assert.match(memo,/not.*grant.*offer|NOT vendor quotations/i);
 assert.match(memo,/Zero-funding scenario/i);
 assert.match(memo,/Restricted programme grant/);
 assert.match(memo,/do not add the 3-month reserve again/i);
 assert.match(memo,/Newham.*experiment/i);
});

test("NEW-02 never fabricates Newham DWP ODS row or licensed individual benefit outcome",async()=>{
 const s=await read(newhamPath);
 assert.match(s,/EXACT NEWHAM DWP ODS ROW \*\*NOT VERIFIED\*\*/i);
 assert.match(s,/2023\/24/);
 assert.match(s,/2025/);
 assert.match(s,/62%/);
 assert.match(s,/E09000025/);
 assert.match(s,/ods_binary_sha256=null/);
 assert.match(s,/newham_row_extracted=false/);
 assert.match(s,/local_receipt_rate=null/);
 assert.match(s,/NO-GO/);
 assert.match(s,/Our Newham Money/);
 assert.match(s,/not comparable/i);
});

test("F0-04.2 keeps UK charitable structure, fiscal hosting, independent review and field authorisation separate",async()=>{
 const s=await read(legalPath);
 for(const term of ["Foundation CIO","Association CIO","Charitable company","Fiscal hosting","CIC"])
  assert.ok(s.includes(term),"Missing alternative "+term);
 assert.match(s,/COUNSEL-REVIEW ONLY, NOT FOR FILING/);
 assert.match(s,/NO founder decision|No founder decision/i);
 assert.match(s,/worldwide charitable objects/i);
 assert.match(s,/separate research ethics/i);
 assert.match(s,/not a substitute for charity registration/i);
});

test("new dossiers and budget CSV are served as internal HPI library pages",async()=>{
 const mapping=[
  [newhamPath,"/research/new-02-newham-source-reconciliation-additionality-v0-1"],
  [legalPath,"/library/docs/governance/f0-04-2-legal-structure-and-international-objects-v0-1"],
  [reportPath,"/library/docs/governance/f0-04-4-operating-budget-and-sustainability-v0-1"],
  [budgetPath,"/library/docs/governance/f0-04-4-operating-budget-scenarios-v0-1"]
 ];
 for(const [src,route] of mapping){
  assert.equal(routeForSource(src),route);
  const html=await read("dist"+route+".html");
  assert.match(html,/<main id="main"/);
  assert.match(html,/not a registered foundation/i);
  assert.ok(!html.includes("href=\"https://github.com/saver1991/human-prosperity-initiative/issues/"));
 }
 const budget=await read("dist"+mapping[2][1]+".html");
 assert.match(budget,/href="\/library\/docs\/governance\/f0-04-4-operating-budget-scenarios-v0-1"/);
});
