import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {parseCsv} from "../scripts/site-content.mjs";

test("F0-02.3 research shortlist has two provisional options and one documented reserve, not an approved field study",async()=>{
 const md=await readFile("research/F0-02-3-jurisdiction-population-shortlist-2026-11-06.md","utf8");
 const raw=await readFile("research/F0-02-3-geographic-comparison-2026-11-06.csv","utf8");
 const table=parseCsv(raw);assert.equal(table.length,4);
 const records=table.slice(1).map(row=>Object.fromEntries(table[0].map((k,i)=>[k,row[i]])));
 assert.equal(records.filter(r=>r.shortlist_status==="provisional_discussion").length,2);
 assert.equal(records.filter(r=>r.shortlist_status==="reserve_discussion").length,1);
 assert.deepEqual(records.map(r=>r.jurisdiction_id),["UK-NEWHAM","BR-RECIFE","IT-NAPLES"]);
 for(const r of records){
  for(const name of ["territory","candidate_population","hypothetical_primary_endpoint","major_unresolved_gate","need_source","existing_delivery_source","administrative_data_source"]){
   assert.ok(r[name]&&r[name].trim(),r.jurisdiction_id+" missing "+name);
  }
  assert.match(r.need_source,/^https:\/\//);
  assert.match(r.administrative_data_source,/^https:\/\//);
 }
 assert.match(md,/NOT APPROVED/);
 assert.match(md,/not a city poverty/i);
 assert.match(md,/not a Newham rate/i);
 assert.match(md,/not guarantee/i);
 assert.match(md,/No named partner/i);
 assert.match(md,/F0-02\.5/);
 assert.match(md,/No final founder approval/);
});
