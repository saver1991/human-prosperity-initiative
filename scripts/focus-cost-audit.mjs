/**
 * WEB-01 local FOCUS v1.3 cost evidence auditor. Reads only a COMPLETE
 * authenticated provider export supplied separately by an authorised operator;
 * never calls provider APIs, uploads cost data or claims an API sample is complete.
 * Monetary totals are project-ID-attributed subtotals, not a team invoice.
 */
import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
const PROJECT=/^prj_[a-zA-Z0-9]+$/;
const amount=v=>{
 const value=typeof v==="number"?v:Number(v);
 if(v===null||v===undefined||v===""||!Number.isFinite(value)||value<0)
  throw Error("Charge has invalid nonnegative billed cost");
 return value;
};
export function parseQuotedCsv(raw){
 const rows=[];let row=[],field="",inQuote=false;
 for(let i=0;i<raw.length;i++){
  const c=raw[i];
  if(inQuote){
   if(c==='"'&&raw[i+1]==='"'){field+='"';i++}
   else if(c==='"')inQuote=false;
   else field+=c;
  }else if(c==='"'){if(field!=="")throw Error("Bad CSV quote");inQuote=true}
  else if(c===","||c==="\n"){row.push(field);field="";if(c==="\n"){rows.push(row);row=[]}}
  else if(c!=="\r")field+=c;
 }
 if(inQuote)throw Error("Unclosed CSV quote");
 if(field!==""||row.length){row.push(field);rows.push(row)}
 if(rows.length<2)throw Error("Missing FOCUS data rows");
 const headers=rows.shift();
 if(new Set(headers).size!==headers.length)throw Error("Duplicate CSV columns");
 return rows.filter(r=>r.some(Boolean)).map(row=>{
  if(row.length!==headers.length)throw Error("Malformed CSV row");
  return Object.fromEntries(headers.map((h,i)=>[h,row[i]]));
 });
}
function tagsOf(r){
 if(r.Tags===undefined||r.Tags===null||r.Tags==="")return {};
 if(typeof r.Tags==="object"&&!Array.isArray(r.Tags))return r.Tags;
 try{const tags=JSON.parse(r.Tags);if(tags&&typeof tags==="object"&&!Array.isArray(tags))return tags}
 catch{}
 throw Error("Malformed FOCUS Tags");
}
export function auditProjectCosts(records,{projectId,currency="USD",completeExport=false,warnUsd=0,limitUsd=null}={}){
 if(!PROJECT.test(projectId||""))throw Error("Explicit Vercel project ID required");
 if(!Array.isArray(records)||!records.length||records.length>250000)
  throw Error("Missing or oversized FOCUS records");
 if(currency!=="USD")throw Error("USD-only audit; no fabricated FX conversion");
 if(!Number.isFinite(warnUsd)||warnUsd<0||
   (limitUsd!==null&&(!Number.isFinite(limitUsd)||limitUsd<0)))
  throw Error("Invalid warning or budget threshold");
 let projectCost=0,unknownAttribution=0,taggedOtherCost=0,matching=0;
 const services={};
 for(const r of records){
  if(typeof r!=="object"||r===null)throw Error("Invalid FOCUS record");
  if(r.BillingCurrency!==currency)throw Error("Mixed/unknown billing currencies");
  const cost=amount(r.BilledCost),tags=tagsOf(r);
  const taggedId=tags.ProjectId||null;
  if(taggedId!==null&&!PROJECT.test(taggedId))throw Error("Malformed project tag");
  if(taggedId===projectId){
   projectCost+=cost;matching++;
   const key=String(r.ServiceName||"Unclassified").slice(0,120);
   services[key]=(services[key]||0)+cost;
  }else if(taggedId===null)unknownAttribution+=cost;
  else taggedOtherCost+=cost;
 }
 // A partial API sample can never be used to claim a project bill of zero.
 const fullyAttributable=completeExport===true&&unknownAttribution===0;
 const limitExceeded=limitUsd!==null&&projectCost>limitUsd;
 const warning=projectCost>warnUsd;
 return {
  status:fullyAttributable?"fully_attributed":"partial_or_unverified",
  sourceCompletenessDeclared:completeExport===true,
  matchedRecordCount:matching,scannedRecordCount:records.length,
  currency,projectId,knownProjectBilledSubtotal:projectCost,
  unallocatedTeamBilledSubtotal:unknownAttribution,
  taggedOtherProjectsSubtotal:taggedOtherCost,
  services,warning:warning?"known_project_subtotal_above_warning_threshold":"none",
  limit:limitUsd,limitExceededKnownSubtotal:limitExceeded,
  projectTotalProven:fullyAttributable,
  note:fullyAttributable?
    "Complete export declared and all records have project tags; validate billing period and coverage independently.":
    "Project bill cannot be proven from incomplete or partly unallocated charges; never infer zero or a safety margin."
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [filepath,projectId,warn]=process.argv.slice(2);
 if(!filepath||!projectId)throw Error("Usage: node scripts/focus-cost-audit.mjs <complete-FOCUS.json-or.csv> <project-id> [warning-USD]");
 const raw=await readFile(filepath,"utf8");
 const parsed=filepath.endsWith(".csv")?parseQuotedCsv(raw):JSON.parse(raw);
 const records=Array.isArray(parsed)?parsed:parsed?.records;
 const declaredComplete=Array.isArray(parsed)?false:parsed?.exportComplete===true;
 const report=auditProjectCosts(records,{projectId,completeExport:declaredComplete,warnUsd:warn===undefined?0:Number(warn)});
 console.log(JSON.stringify(report,null,2));
 if(!report.projectTotalProven||report.warning!=="none")process.exitCode=2;
}
