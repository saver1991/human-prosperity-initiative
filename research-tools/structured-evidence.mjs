/**
 * RT-01.1 / F0-02: distinguish evidence RECORDS from independent study families.
 * Metadata-only. Counts must not be misrepresented as independent trials or
 * formally assessed risk of bias. No clinical/public-policy effectiveness claims.
 */
import {createHash} from "node:crypto";
import {parseCsv} from "../scripts/site-content.mjs";
export const STRUCTURED_HEADERS=[
 "source_id","domain","year","geography","study_title","design",
 "comparator_and_sample","measured_endpoint",
 "finding_verified_from_abstract_or_summary","important_limitation",
 "primary_source_url","study_family","extraction_depth","formal_risk_of_bias",
 "confidence_interval","followup_duration","study_cost","adverse_or_equity_effects"
];
export function auditStructuredEvidence(raw){
 if(typeof raw!=="string"||!raw.trim()||raw.length>1_000_000)
  throw Error("Structured evidence requires bounded CSV source");
 const rows=parseCsv(raw);
 if(!rows.length||rows[0].length!==STRUCTURED_HEADERS.length||
    rows[0].some((k,i)=>k!==STRUCTURED_HEADERS[i]))
  throw Error("Structured evidence schema mismatch");
 const counts=new Map(),families=new Map(),seen=new Set();
 let abstractOnly=0,notAssessed=0;
 for(const [i,row] of rows.slice(1).filter(x=>x.some(Boolean)).entries()){
  if(row.length!==STRUCTURED_HEADERS.length)throw Error("Invalid structured row "+(i+2));
  const [id,domain,year,,title,,,,finding,limitation,url,family,depth,risk]=row;
  if(!/^E[0-9]{2,4}$/.test(id)||seen.has(id))throw Error("Invalid or duplicate structured ID");
  if(!["benefit_access","essential_costs","economic_opportunity"].includes(domain))
   throw Error("Unknown evidence research domain at "+id);
  if(!/^(19|20)[0-9]{2}$/.test(year)||!title?.trim()||!family?.trim()||
     !finding?.trim()||!limitation?.trim())throw Error("Incomplete structured evidence "+id);
  if(!url?.startsWith("https://"))throw Error("Untrusted study source URL "+id);
  if(risk!=="not_assessed")throw Error("Formal risk of bias may not be claimed from unreviewed abstract ledger "+id);
  if(!depth?.includes("abstract")&&!depth?.includes("summary"))
   throw Error("Missing precise extraction limit at "+id);
  abstractOnly++;
  notAssessed++;
  seen.add(id);
  counts.set(domain,(counts.get(domain)||0)+1);
  const familyIds=families.get(family)||[];
  familyIds.push(id);families.set(family,familyIds);
 }
 if(!seen.size)throw Error("Empty structured ledger");
 const overlappingFamilies=[...families].filter(([,ids])=>ids.length>1).map(([name,ids])=>({name,ids})).sort((a,b)=>a.name.localeCompare(b.name));
 return {
  format:"hpi-rt01-structured-evidence-audit-v0.1",
  sourceSha256:createHash("sha256").update(raw).digest("hex"),
  recordCount:seen.size,
  candidateStudyFamilyCount:families.size,
  possibleNonIndependentFamilies:overlappingFamilies,
  byDomain:Object.fromEntries([...counts].sort(([a],[b])=>a.localeCompare(b))),
  abstractsOrSummariesOnly:abstractOnly,
  formallyRiskOfBiasAssessed:seen.size-notAssessed,
  scientificReviewCompleted:false,
  verifiedTreatmentEffects:false,
  warning:"Publication/review/follow-up records overlap; family labels are metadata hypotheses, not proof of independent experiments. No full-text verification or risk-of-bias review."
 };
}
