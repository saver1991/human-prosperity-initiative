import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {parseCsv} from "../scripts/site-content.mjs";

const load=async name=>parseCsv(await readFile(name,"utf8"));
const objs=rows=>rows.slice(1).map(row=>Object.fromEntries(rows[0].map((key,i)=>[key,row[i]])));
const source="research/F0-02-structured-evidence-2026-11-06.csv";
const ledger="research/evidence-ledger.csv";
const queries="research/search-log-2026-11-06.csv";

test("F0-02.2 publishes 10+ source records per science domain without invented evidence grades",async()=>{
 const studies=objs(await load(source));
 const counts=Object.fromEntries(["benefit_access","essential_costs","economic_opportunity"].map(d=>[d,studies.filter(x=>x.domain===d).length]));
 for(const [domain,count] of Object.entries(counts))assert.ok(count>=10,domain+" must have >=10 screened source records");
 assert.equal(studies.length,34);
 const ids=studies.map(x=>x.source_id);
 assert.equal(new Set(ids).size,ids.length,"each source ID must be unique");
 for(const study of studies){
  assert.match(study.source_id,/^E[0-9]{2}$/);
  assert.match(study.primary_source_url,/^https:\/\//);
  for(const field of ["year","study_title","geography","design","comparator_and_sample","measured_endpoint","finding_verified_from_abstract_or_summary","important_limitation","study_family","extraction_depth"])assert.ok(study[field]?.trim(),study.source_id+" missing "+field);
  assert.equal(study.formal_risk_of_bias,"not_assessed","no false completed risk-of-bias ratings");
  assert.match(study.extraction_depth,/abstract_only/);
 }
 const all=objs(await load(ledger)),byId=new Map(all.map(x=>[x.id,x]));
 for(const study of studies){assert.ok(byId.has(study.source_id),"record absent from public ledger "+study.source_id);assert.equal(byId.get(study.source_id).url,study.primary_source_url)}
 assert.equal(studies.find(x=>x.study_title.includes("Nine-year")).study_family,studies.find(x=>x.study_title.includes("Generating skilled")).study_family,"follow-up and original must share study family");
});

test("F0-02.1 executed search audit logs real targeted discovery with no fabricated search totals",async()=>{
 const entries=objs(await load(queries));
 assert.equal(entries.length,25);
 const distinct=new Set();
 for(const x of entries){
  assert.equal(x.date_utc,"2026-11-06");
  assert.ok(["benefit_access","essential_costs","economic_opportunity"].includes(x.domain));
  assert.ok(x.search_query.length>=18,"exact query missing");
  assert.equal(x.reported_hits,"","no false search hit counts");
  assert.equal(x.records_exported,"","no false formal export count");
  assert.ok(!distinct.has(x.search_query),"duplicate log query: "+x.search_query);distinct.add(x.search_query);
 }
});
