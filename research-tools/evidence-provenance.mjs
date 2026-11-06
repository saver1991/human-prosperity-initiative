/**
 * RT-01.1 — reproducible metadata-only audit of public HPI evidence ledger.
 * No scraping, downloading primary papers, personal records or automatic
 * scientific quality/causality judgement. Fail closed on malformed inputs.
 */
import {createHash} from "node:crypto";
import {parseCsv} from "../scripts/site-content.mjs";
export const LEDGER_FIELDS=[
 "id","year","geography","domain","source_type","key_finding","limitations","url"
];
const SAFE_YEAR=/^(19|20)[0-9]{2}$/;
const STUDY=/^E[0-9]{2,4}$/;
const SOURCE_PROTOCOLS=new Set(["https:"]);
export function auditEvidenceMetadata(raw,{sourcePath="research/evidence-ledger.csv"}={}){
 if(typeof raw!=="string"||raw.length===0||raw.length>1_000_000)
  throw Error("Evidence metadata must be a bounded UTF-8 CSV");
 const rows=parseCsv(raw);
 if(rows.length<2)throw Error("Evidence source is empty");
 const headers=rows[0];
 if(headers.length!==LEDGER_FIELDS.length||
    !LEDGER_FIELDS.every((h,i)=>h===headers[i]))
  throw Error("Evidence source schema mismatch");
 const records=rows.slice(1).filter(r=>r.some(Boolean));
 const ids=new Set(),sourceUrls=new Map(),domains=new Map(),sourceKinds=new Map();
 let missingLimitations=0,missingFindings=0;
 for(const [i,r] of records.entries()){
  if(r.length!==LEDGER_FIELDS.length)throw Error("Row "+(i+2)+" column mismatch");
  const [id,year,geography,domain,sourceType,finding,limitations,uri]=r;
  if(!STUDY.test(id)||ids.has(id))throw Error("Duplicate/malformed study ID "+id);
  if(!SAFE_YEAR.test(year))throw Error("Bad study year at "+id);
  if(!geography?.trim()||!domain?.trim()||!sourceType?.trim())throw Error("Missing mandatory source metadata at "+id);
  let url;try{url=new URL(uri)}catch{throw Error("Bad primary URL at "+id)}
  if(!SOURCE_PROTOCOLS.has(url.protocol)||url.username||url.password)throw Error("Non-HTTPS or credentialed primary URL at "+id);
  ids.add(id);
  sourceUrls.set(uri,(sourceUrls.get(uri)||0)+1);
  domains.set(domain,(domains.get(domain)||0)+1);
  sourceKinds.set(sourceType,(sourceKinds.get(sourceType)||0)+1);
  if(!limitations?.trim())missingLimitations++;
  if(!finding?.trim())missingFindings++;
 }
 if(!records.length)throw Error("No evidence records");
 return {
  format:"hpi-rt01-evidence-provenance-v0.1",
  sourcePath,sourceSha256:createHash("sha256").update(raw).digest("hex"),
  recordCount:records.length,uniqueRecordIds:ids.size,
  duplicateSourceUrls:[...sourceUrls].filter(([,n])=>n>1).map(([url,count])=>({url,count})),
  byDomain:Object.fromEntries([...domains].sort(([a],[b])=>a.localeCompare(b))),
  bySourceKind:Object.fromEntries([...sourceKinds].sort(([a],[b])=>a.localeCompare(b))),
  missingLimitations,missingFindings,
  extractionQuality:"not_independently_assessed",
  completeSystematicReview:false,
  verifiedImpact:false,
  personalRecordAccess:false,
  note:"Source metadata/provenance validation only; references and causal quality still need independent methodological review."
 };
}
