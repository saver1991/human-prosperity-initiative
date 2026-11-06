import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {
 validateSourceRegistry,buildSourceCatalog,searchSourceCatalog,catalogCsvExport,
 ingestPinnedAggregateCsv
} from "../research-tools/source-catalog.mjs";
import {parseCsv} from "../scripts/site-content.mjs";
const read=path=>readFile(path,"utf8");
const fixture=async()=>{
 const [ledgerCsv,structuredCsv,raw]=await Promise.all([
  read("research/evidence-ledger.csv"),
  read("research/F0-02-structured-evidence-2026-11-06.csv"),
  read("research/public-dataset-registry.json")
 ]);
 return {ledgerCsv,structuredCsv,registry:JSON.parse(raw)};
};
const digest=value=>createHash("sha256").update(value).digest("hex");
test("RT-01.1 data source rights registry tracks real candidate datasets without asserting ingestion",async()=>{
 const data=await fixture();
 const sources=validateSourceRegistry(data.registry);
 assert.equal(sources.length,3);
 assert.deepEqual(sources.map(s=>s.id),["WB-PIP","UNDP-MPI-2026","DWP-PC-2023-24-LA"]);
 assert.ok(sources.every(s=>s.dataIngested===false&&s.safeToRedistributeData===false));
 assert.ok(sources.filter(s=>s.licenseStatus==="unknown").length>=2);
 assert.ok(sources.some(s=>s.licenseStatus==="verified_cc_by_4_0"&&s.licenseEvidenceUrl));
});
test("RT-01.1 catalogue creates 39 evidence references and 3 dataset candidates with provenance pins",async()=>{
 const c=buildSourceCatalog(await fixture());
 assert.equal(c.totals.evidenceReferences,39);
 assert.equal(c.totals.datasetCandidates,3);
 assert.equal(c.totals.all,42);
 assert.equal(c.records.length,42);
 assert.match(c.sourceFiles.evidenceLedger.sha256,/^[a-f0-9]{64}$/);
 assert.match(c.sourceFiles.structuredEvidence.sha256,/^[a-f0-9]{64}$/);
 assert.match(c.sourceFiles.curatedDatasets.sha256,/^[a-f0-9]{64}$/);
 assert.ok(c.records.every(r=>r.metadataOnly&&r.dataIngested===false));
 assert.ok(c.records.every(r=>r.retrievedAt===null));
 assert.ok(c.records.some(r=>r.doi?.startsWith("10.")));
 assert.ok(c.records.some(r=>r.studyFamily));
 assert.deepEqual(c,buildSourceCatalog(await fixture()));
});
test("RT-01.1 deterministic metadata search and secure CSV export are bounded",async()=>{
 const c=buildSourceCatalog(await fixture());
 const found=searchSourceCatalog(c,{kind:"public_dataset_candidate",query:"pension"});
 assert.equal(found.length,1);
 assert.equal(found[0].id,"DWP-PC-2023-24-LA");
 assert.equal(searchSourceCatalog(c,{kind:"all",query:"nonexistent"}).length,0);
 const csv=catalogCsvExport(c);
 assert.equal(parseCsv(csv).length,43);
 assert.ok(!csv.includes("participant_contact"));
 assert.throws(()=>searchSourceCatalog(c,{limit:1000}),/Invalid search/);
 const bad={...c,records:[{...c.records[0],id:"=CALL.EXE()"}]};
 const safe=catalogCsvExport(bad);
 assert.ok(safe.includes("'=CALL.EXE()"));
});
test("RT-01.1 malformed rights, false licenses, duplicate IDs and unknown keys fail closed",async()=>{
 const {registry,...inputs}=await fixture();
 const clone=()=>structuredClone(registry);
 const bad=clone();bad.datasets[0].licenseEvidenceUrl=null;
 assert.throws(()=>validateSourceRegistry(bad),/Verified licence/);
 const fake=clone();fake.datasets[0].dataWasVerified=true;
 assert.throws(()=>validateSourceRegistry(fake),/unsupported field/);
 const dup=clone();dup.datasets[1].id=dup.datasets[0].id;
 assert.throws(()=>validateSourceRegistry(dup),/duplicate dataset/);
 const url=clone();url.datasets[1].url="http://untrusted.test/data";
 assert.throws(()=>validateSourceRegistry(url),/HTTPS/);
 const inflated=clone();inflated.datasets[1].rightsReviewStatus="approved_for_aggregate_processing";
 assert.throws(()=>validateSourceRegistry(inflated),/lacks data and rights evidence/);
 assert.throws(()=>buildSourceCatalog({...inputs,registry:{...registry,datasets:[...registry.datasets,registry.datasets[0]]}}),/duplicate dataset/);
});
test("RT-01.1 pinned aggregate fixture adapter deduplicates exact matches and preserves missing values",async()=>{
 const {registry}=await fixture();
 const csv="geography,period,numerator,denominator\nExample Region,2025,6,100\nExample Region,2025,6,100\nAnother Region,2025,,\n";
 const result=ingestPinnedAggregateCsv(csv,{
  registry,sourceId:"SYNTHETIC-TEST-FIXTURE",sourceKind:"synthetic_fixture",
  expectedSha256:digest(csv)
 });
 assert.equal(result.records.length,2);
 assert.equal(result.duplicateIdenticalRowsRemoved,1);
 assert.equal(result.records[0].missingReason,"not_provided");
 assert.equal(result.records[1].value,0.06);
 assert.equal(result.causalInterpretation,"NOT_SUPPORTED");
 assert.equal(result.participantRecordsUsed,false);
});
test("RT-01.1 refuses silent data revision drift, contradictory rows, unsafe cells and unreviewed rights",async()=>{
 const {registry}=await fixture();
 const csv="geography,period,numerator,denominator\nUK,2025,1,100\n";
 const args={registry,sourceId:"SYNTHETIC-TEST-FIXTURE",sourceKind:"synthetic_fixture",expectedSha256:digest(csv)};
 assert.throws(()=>ingestPinnedAggregateCsv(csv,{...args,expectedSha256:digest("other")}),/pinned SHA/);
 assert.throws(()=>ingestPinnedAggregateCsv(csv,{...args,sourceKind:"public_aggregate",sourceId:"UNDP-MPI-2026"}),/rights/);
 const bad="geography,period,numerator,denominator\nUK,2025,1,100\nUK,2025,2,100\n";
 assert.throws(()=>ingestPinnedAggregateCsv(bad,{...args,expectedSha256:digest(bad)}),/Conflicting duplicate/);
 const injection="geography,period,numerator,denominator\n=FORMULA,2025,1,100\n";
 assert.throws(()=>ingestPinnedAggregateCsv(injection,{...args,expectedSha256:digest(injection)}),/Unsafe/);
 const unknown="geography,period,numerator,denominator\nUK,2025,5,0\n";
 assert.throws(()=>ingestPinnedAggregateCsv(unknown,{...args,expectedSha256:digest(unknown)}),/numerator/);
});
test("RT-01.1 complete project build publishes first-party accessible catalog and metadata exports",async()=>{
 const html=await read("dist/research/source-catalog.html");
 const json=JSON.parse(await read("dist/research-source-catalog.json"));
 const csv=await read("dist/research-source-catalog.csv");
 const map=await read("dist/sitemap.xml");
 assert.ok(html.includes('role="search"'));
 assert.ok(html.includes('aria-label="Searchable public source metadata"'));
 assert.ok(html.includes('href="/research-source-catalog.json"'));
 assert.ok(html.includes('href="/research-source-catalog.csv"'));
 assert.ok(!html.includes("<script>"));
 assert.equal(json.records.length,42);
 assert.equal(parseCsv(csv).length,43);
 assert.ok(map.includes("/research/source-catalog"));
});
