import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {parseCsv} from "../scripts/site-content.mjs";
const read=path=>readFile(path,"utf8");
test("F0-03 draft has five dimensions and explicit absence of a validated score",async()=>{
 const doc=await read("research/F0-03-prosperity-measurement-v0.1.md");
 assert.match(doc,/not validated/i);
 assert.match(doc,/not publish a universal HPI Prosperity Index/i);
 for(const id of ["D1","D2","D3","D4","D5"])assert.ok(doc.includes(id+" —"),id);
 for(const name of ["World Bank","UNDP","OECD"])assert.ok(doc.includes(name),name);
 assert.match(doc,/reach and demonstrated benefit/i);
 assert.match(doc,/No sensitive data or recruitment/i);
});
test("public proposed outcomes registry contains only structured definitions and no participant rows",async()=>{
 const data=parseCsv(await read("research/outcomes-candidate-registry.csv"));
 const expected=["indicator_id","dimension","pathway","candidate_role","unit","operational_definition","possible_data_source","main_limitations"];
 assert.deepEqual(data[0],expected);
 assert.ok(data.length>=16);
 const ids=new Set();
 const dimensions=new Set();
 for(const row of data.slice(1)){
  assert.equal(row.length,expected.length);
  assert.match(row[0],/^(D[1-5]-[0-9]{2}|P-[0-9]{2})$/);
  assert.ok(!ids.has(row[0]));ids.add(row[0]);
  dimensions.add(row[1]);
  assert.ok(["candidate_primary","candidate_secondary","process_only","safety_monitor"].includes(row[3]));
  assert.ok(row[5].length>20);
 }
 for(const dim of ["D1","D2","D3","D4","D5","process"])assert.ok(dimensions.has(dim));
});
test("one future domain-specific primary candidate per F0-02 pathway, no index weights",async()=>{
 const data=parseCsv(await read("research/outcomes-candidate-registry.csv"));
 const primary=data.slice(1).filter(r=>r[3]==="candidate_primary");
 assert.deepEqual(primary.map(r=>r[2]).sort(),["benefit_access","economic_opportunity","essential_costs"]);
 const csv=await read("research/outcomes-candidate-registry.csv");
 assert.doesNotMatch(csv,/personal_email|date_of_birth|participant_identifier/i);
});
