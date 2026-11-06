/**
 * RT-01.1 — metadata-only, version-pinned research-source catalogue.
 * No provider API calls, full-text copying, personal data or assertions that
 * third-party sources are licensed unless a curator records actual evidence.
 */
import {createHash} from "node:crypto";
import {parseCsv} from "../scripts/site-content.mjs";
import {auditEvidenceMetadata} from "./evidence-provenance.mjs";
import {auditStructuredEvidence} from "./structured-evidence.mjs";

const sha256=s=>createHash("sha256").update(s).digest("hex");
const hex=/^[a-f0-9]{64}$/;
const shortId=/^[A-Za-z0-9][A-Za-z0-9-]{1,55}$/;
const safeUrl=value=>{
 let u;try{u=new URL(value)}catch{throw Error("Invalid source URL")}
 if(u.protocol!=="https:"||u.username||u.password||u.hostname.length<3)
  throw Error("Source URL must be HTTPS without credentials");
 return u.href;
};
const keys=(obj,accepted,context)=>{
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw Error(context+" must be an object");
 for(const k of Object.keys(obj))if(!accepted.includes(k))
  throw Error(context+" unsupported field "+k);
};
const checkText=(v,context,max=300)=>{
 if(typeof v!=="string"||!v.trim()||v.length>max||/[\u0000-\u001f]/.test(v))
  throw Error(context+" missing, oversized or control-bearing");
 return v;
};
const datasetKeys=["id","name","publisher","url","geography","year","doi","format",
 "licenseStatus","licenseEvidenceUrl","rightsReviewStatus","retrievedAt",
 "expectedDataSha256","availability","retraction","notes"];
export function validateSourceRegistry(registry){
 keys(registry,["schemaVersion","reviewedAt","scope","datasets"],"registry");
 if(registry.schemaVersion!=="1.0"||!/^\d{4}-\d\d-\d\d$/.test(registry.reviewedAt)||
  registry.scope!=="public_source_metadata_only_no_data_ingested"||
  !Array.isArray(registry.datasets)||!registry.datasets.length||registry.datasets.length>300)
  throw Error("Invalid source registry/version/scope");
 const ids=new Set();
 return registry.datasets.map(d=>{
  keys(d,datasetKeys,"dataset");
  if(!shortId.test(d.id)||ids.has(d.id))throw Error("Malformed or duplicate dataset ID");
  ids.add(d.id);
  for(const x of ["name","publisher","geography","year","format","availability","notes"])
   checkText(d[x],"dataset "+d.id+" "+x,600);
  safeUrl(d.url);
  if(d.doi!==null){
   if(typeof d.doi!=="string"||!/^10\.\d{4,9}\/\S+$/.test(d.doi))
    throw Error("Bad dataset DOI");
  }
  if(!["verified_cc_by_4_0","unknown","restricted"].includes(d.licenseStatus))
   throw Error("Unrecognised dataset licence");
  if(!["metadata_review_only","not_reviewed","approved_for_aggregate_processing"].includes(d.rightsReviewStatus))
   throw Error("Unknown rights-review status");
  if(d.licenseStatus==="verified_cc_by_4_0"&&
     (d.licenseEvidenceUrl===null||!safeUrl(d.licenseEvidenceUrl)))
   throw Error("Verified licence must have evidence URL");
  if(d.licenseEvidenceUrl!==null)safeUrl(d.licenseEvidenceUrl);
  if(d.retrievedAt!==null&&!/^\d{4}-\d\d-\d\d$/.test(d.retrievedAt))
   throw Error("Bad retrieval date");
  if(d.expectedDataSha256!==null&&!hex.test(d.expectedDataSha256))
   throw Error("Missing pinned dataset SHA");
  if(d.rightsReviewStatus==="approved_for_aggregate_processing"&&
     (d.licenseStatus==="unknown"||!d.retrievedAt||!d.expectedDataSha256))
   throw Error("Aggregate processing approval lacks data and rights evidence");
  if(!["not_checked","retracted","disputed","confirmed_current"].includes(d.retraction))
   throw Error("Invalid retraction state");
  return {...d,sourceUrl:safeUrl(d.url),
   dataIngested:false,
   safeToRedistributeData:d.rightsReviewStatus==="approved_for_aggregate_processing"&&
    d.licenseStatus==="verified_cc_by_4_0"&&d.retraction==="confirmed_current"};
 });
}
export function buildSourceCatalog({ledgerCsv,structuredCsv,registry}){
 const provenance=auditEvidenceMetadata(ledgerCsv);
 const research=auditStructuredEvidence(structuredCsv);
 const datasets=validateSourceRegistry(registry);
 const structuredRows=parseCsv(structuredCsv);
 const structuredById=new Map(structuredRows.slice(1).filter(r=>r.some(Boolean))
  .map(r=>[r[0],{family:r[11],extractionDepth:r[12],biasReview:r[13]}]));
 const evidence=parseCsv(ledgerCsv).slice(1).filter(r=>r.some(Boolean)).map(r=>{
  const [id,year,geography,domain,studyType,,,url]=r;
  const p=structuredById.get(id)||null;
  const normalized=safeUrl(url);
  let doi=null;
  if(new URL(normalized).hostname==="doi.org"){
   const candidate=decodeURIComponent(new URL(normalized).pathname.slice(1));
   if(/^10\.\d{4,9}\/[^\s]+$/.test(candidate))doi=candidate;
  }
  return {
   id,kind:"evidence_reference",year,geography,domain,
   titleOrType:studyType,sourceUrl:normalized,doi,
   studyFamily:p?.family||null,extractionDepth:p?.extractionDepth||"not_reviewed",
   formalRiskOfBias:"not_assessed",licenseStatus:"unknown",
   rightsReviewStatus:"not_reviewed",retrievedAt:null,
   retraction:"not_checked",dataIngested:false,metadataOnly:true
  };
 }).sort((a,b)=>a.id.localeCompare(b.id));
 const records=[
  ...evidence,
  ...datasets.map(d=>({
   id:d.id,kind:"public_dataset_candidate",year:d.year,geography:d.geography,
   domain:"multidimensional_prosperity",titleOrType:d.name,
   sourceUrl:d.sourceUrl,doi:d.doi,studyFamily:null,extractionDepth:"catalogue_page_only",
   formalRiskOfBias:"not_applicable",licenseStatus:d.licenseStatus,
   licenseEvidenceUrl:d.licenseEvidenceUrl,rightsReviewStatus:d.rightsReviewStatus,
   retrievedAt:d.retrievedAt,retraction:d.retraction,dataIngested:false,metadataOnly:true
  }))
 ].sort((a,b)=>a.id.localeCompare(b.id));
 const duplicateIds=new Set();
 for(const record of records){
  if(duplicateIds.has(record.id))throw Error("Duplicated ID between source registries: "+record.id);
  duplicateIds.add(record.id);
 }
 const catalog={
  schemaVersion:"1.0",kind:"hpi-rt01-source-catalogue",
  scope:"metadata_only_no_retrieved_datasets",
  sourceFiles:{
   evidenceLedger:{path:"research/evidence-ledger.csv",sha256:provenance.sourceSha256,records:provenance.recordCount},
   structuredEvidence:{path:"research/F0-02-structured-evidence-2026-11-06.csv",sha256:research.sourceSha256,records:research.recordCount},
   curatedDatasets:{path:"research/public-dataset-registry.json",reviewedAt:registry.reviewedAt,
    sha256:sha256(JSON.stringify(registry)),records:datasets.length}
  },
  totals:{evidenceReferences:evidence.length,datasetCandidates:datasets.length,all:records.length,
   blockedRetrievalOrLicence:records.filter(x=>x.licenseStatus==="unknown"||x.retraction==="retracted"||x.retraction==="disputed").length},
  records,
  limitations:[
   "No third-party dataset payloads, primary paper full texts or respondent records were ingested.",
   "DOI syntax is parsed from source links but DOI resolution, source existence and retraction are not independently verified.",
   "Study-family labels and citation reuse are not independent research quality or bias judgements.",
   "Metadata entry in this catalogue does not authorise bulk downloading or redistribution."
  ]
 };
 return catalog;
}
export function searchSourceCatalog(catalog,{query="",kind="all",limit=50}={}){
 if(!catalog||catalog.schemaVersion!=="1.0"||!Array.isArray(catalog.records))
  throw Error("Invalid catalogue");
 if(typeof query!=="string"||query.length>120||!["all","public_dataset_candidate","evidence_reference"].includes(kind)||
   !Number.isSafeInteger(limit)||limit<1||limit>500)
  throw Error("Invalid search parameters");
 const q=query.trim().toLocaleLowerCase("en");
 return catalog.records.filter(r=>(kind==="all"||r.kind===kind)&&
  (!q||[r.id,r.titleOrType,r.geography,r.domain,r.doi||""].some(s=>String(s).toLocaleLowerCase("en").includes(q))))
  .slice(0,limit);
}
const quote=s=>{
 let v=String(s??"");
 if(/^[=+\-@\t\r\n]/.test(v))v="'"+v;
 return '"'+v.replaceAll('"','""')+'"';
};
export function catalogCsvExport(catalog){
 if(catalog?.schemaVersion!=="1.0"||!Array.isArray(catalog.records))
  throw Error("Cannot export unvalidated source catalogue");
 const cols=["id","kind","year","geography","domain","titleOrType","sourceUrl","doi",
  "studyFamily","licenseStatus","rightsReviewStatus","retrievedAt","retraction"];
 return [cols.join(","),...catalog.records.map(r=>cols.map(c=>quote(r[c])).join(","))].join("\n")+"\n";
}
export function ingestPinnedAggregateCsv(csv,{registry,sourceId,sourceKind="public_aggregate",
 expectedSha256}={}){
 // Generic HPI-normalised aggregate contract, not a provider-specific PIP/DWP adapter.
 if(typeof csv!=="string"||csv.length===0||csv.length>500_000)
  throw Error("Malformed or oversized aggregate CSV");
 const hash=sha256(csv);
 if(!hex.test(expectedSha256||"")||hash!==expectedSha256)
  throw Error("Aggregate ingestion requires exact pinned SHA-256");
 const sources=validateSourceRegistry(registry);
 if(sourceKind!=="synthetic_fixture"&&sourceKind!=="public_aggregate")
  throw Error("No personal or unverified source types permitted");
 if(sourceKind==="public_aggregate"){
  const source=sources.find(x=>x.id===sourceId);
  if(!source||!source.safeToRedistributeData||source.expectedDataSha256!==hash)
   throw Error("Public aggregate file lacks independently verified rights and revision approval");
 }else if(sourceId!=="SYNTHETIC-TEST-FIXTURE")
  throw Error("Synthetic fixture ID required");
 const rows=parseCsv(csv);
 if(rows[0].join(",")!=="geography,period,numerator,denominator"||rows.length>5000)
  throw Error("Aggregate schema or bound mismatch");
 const seen=new Map();
 for(const row of rows.slice(1)){
  if(row.length!==4||!/^[A-Za-z][A-Za-z0-9 _/.-]{0,80}$/.test(row[0])||
    !/^\d{4}$/.test(row[1]))
   throw Error("Unsafe or invalid aggregate dimensional metadata");
  const [region,period,n,d]=row,key=region+"|"+period;
  const missing=n===""&&d==="";
  if(!missing&&(!/^\d+$/.test(n)||!/^\d+$/.test(d)||
     !Number.isSafeInteger(Number(n))||!Number.isSafeInteger(Number(d))||
     Number(d)<=0||Number(n)>Number(d)))
   throw Error("Invalid aggregate numerator/denominator");
  if(!missing&&sourceKind==="public_aggregate"&&Number(n)>0&&Number(n)<20)
   throw Error("Small public cell requires disclosure review/suppression");
  const entry={geography:region,period,numerator:missing?null:Number(n),
   denominator:missing?null:Number(d),value:missing?null:Number(n)/Number(d),
   missingReason:missing?"not_provided":null};
  if(seen.has(key)){
   if(JSON.stringify(seen.get(key))!==JSON.stringify(entry))
    throw Error("Conflicting duplicate aggregate dimensions");
   continue;
  }
  seen.set(key,entry);
 }
 return {
  schemaVersion:"1.0",kind:"hpi-normalised-aggregate",
  sourceId,sourceKind,sourceSha256:hash,
  records:[...seen.values()].sort((a,b)=>a.geography.localeCompare(b.geography)||a.period.localeCompare(b.period)),
  duplicateIdenticalRowsRemoved:rows.length-1-seen.size,
  causalInterpretation:"NOT_SUPPORTED",
  participantRecordsUsed:false,
  note:"Aggregate normalisation only; dataset licensing, source sampling, missingness and scientific interpretation require qualified human review."
 };
}
