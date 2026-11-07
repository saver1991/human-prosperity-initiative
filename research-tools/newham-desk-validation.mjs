/**
 * F0-03 Newham desk validation: explicit source-level research measurement
 * feasibility. This does NOT estimate causal effects, impute eligible families
 * or approve person-level welfare case files. Strict and dependency-free.
 */
import {createHash} from "node:crypto";
import {parseCsv} from "../scripts/site-content.mjs";
const SHA=raw=>createHash("sha256").update(raw,"utf8").digest("hex");
const SCOPES=new Set(["official_area_context","national_official_context","local_service_self_report"]);
const STATUS=new Set(["not_measured","context_only_not_indicator","candidate_primary_unmeasurable","not_in_scope","blocked_ethics_and_denominator"]);
const ids=["MHCLG-IOD25-NEWHAM-INCOME","DWP-PC-FYE2025-GB-TAKEUP",
 "NEWHAM-PC-SUPPORTED-FYE2025","NEWHAM-PC-REPORTED-INCOME-FYE2025"];
const values=[39,62,220,748590];
const urls=[
 "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025/english-indices-of-deprivation-2025-statistical-release",
 "https://www.gov.uk/government/statistics/income-related-benefits-estimates-of-take-up-financial-year-ending-2025/income-related-benefits-estimates-of-take-up-financial-year-ending-2025",
 "https://www.newham.gov.uk/downloads/file/9654/2024-25-you-said-together-we-did-5-"
];
function check(condition,message){if(!condition)throw Error("F0-03 Newham desk validation: "+message)}
export function validateNewhamDeskSources(raw,rawMap,indicatorCsv){
 check(typeof raw==="string"&&raw.length<100_000&&raw.length>100,"missing or oversized public source audit");
 check(typeof rawMap==="string"&&rawMap.length<70_000,"missing or oversized indicator mapping");
 const d=JSON.parse(raw);
 check(d.schemaVersion==="0.2"&&d.caseId==="F0-03-NEWHAM-PC"&&
  d.location?.geoCode==="E09000025"&&d.location?.name==="London Borough of Newham"&&
  d.decisionScope==="FOUNDER_ACCEPTED_PUBLIC_DESK_VALIDATION_ONLY","unsafe geography or case type");
 check(d.fieldStudyAuthorised===false&&d.personalRecordsAccessAuthorised===false&&
  d.independentScientificApproval===false&&d.eligibleHouseholdsMeasured===false&&
  d.followUpMeasured===false&&d.negativeOutcomeReviewComplete===false,"unapproved study or sign-off");
 check(d.primaryNumerator===null&&d.primaryDenominator===null&&
  d.verifiedLocalReceiptRate===null&&d.measuredCausalEffect===null,
  "invented local eligible denominator, actual receipt rate or causal effect");
 check(d.candidatePrimaryIndicator==="HPI-B-01"&&d.candidatePrimaryStatus==="proposed_not_validated",
  "incorrect primary candidate or scientific status");
 check(Array.isArray(d.sourceItems)&&d.sourceItems.length===4,"exactly four bounded metadata facts");
 const sourceIds=new Set();
 for(let i=0;i<d.sourceItems.length;i++){
  const s=d.sourceItems[i];
  check(s.id===ids[i]&&!sourceIds.has(s.id),"duplicate or unexpected source ID");
  sourceIds.add(s.id);
  check(s.value===values[i]&&Number.isFinite(s.value)&&s.value>=0,
    "published source fact changed without reviewed provenance");
  check(s.denominatorValidatedForBenefitReceipt===false,
   "unapproved entitlement denominator");
  check(SCOPES.has(s.sourceClass),"unapproved source class");
  check(urls.includes(s.sourceUrl)&&typeof s.originLicense==="string"&&s.originLicense.length>15,
    "unreviewed source link or rights metadata");
  check(s.geography===(i===1?"Great Britain":"Newham"),
    "source geography mismatch / national take-up misattributed to Newham");
  check(s.unit===["percent","percent","residents","GBP_reported_total"][i],
    "invalid metric units");
  check(typeof s.limitations==="string"&&s.limitations.length>75,
    "missing uncertainty and scope limitations");
 }
 check(d.sourceItems[2].sourceClass==="local_service_self_report"&&
  d.sourceItems[3].sourceClass==="local_service_self_report"&&
  d.sourceItems[2].period===d.sourceItems[3].period,
  "existing council service attribution mischaracterised");
 check(d.notExtractedSource?.value===null&&
  d.notExtractedSource.sourceUrl==="https://www.gov.uk/government/statistics/households-potentially-eligible-for-pension-credit-2023-to-2024"&&
  /not comparable/i.test(d.notExtractedSource.whyDifferent),
  "distinct DWP local receipt series was silently merged with national take-up");
 check(Array.isArray(d.mandatoryGates)&&d.mandatoryGates.length>=6,
  "insufficient independent scientific or safeguarding gates");
 const source=parseCsv(indicatorCsv),rows=parseCsv(rawMap);
 check(source.length===16&&rows.length===16,"catalogue/mapping must each contain all 15 proposed indicators");
 check(rows[0].join(",")==="indicator_id,newham_measurement_status,constraint_code,explanation",
  "inconsistent audit map schema");
 const known=new Map(source.slice(1).map(x=>[x[0],x]));
 const mapped=new Set();
 for(let i=1;i<rows.length;i++){
  const [id,status,reason,explanation]=rows[i];
  check(known.has(id)&&!mapped.has(id),"unknown/duplicated proposed indicator");
  mapped.add(id);
  check(known.get(id)[12]==="proposed_not_validated","real scientifically approved status cannot be inferred");
  check(STATUS.has(status)&&/^[a-z0-9_]+$/.test(reason)&&
    explanation.length>48,"unexplained or unsupported measurement status");
  check(!/measured|verified_real_world|approved|causal_validated/.test(status)||
    STATUS.has(status),"unsupported outcome certification");
 }
 check(rows.slice(1).filter(x=>x[0]==="HPI-B-01").length===1&&
  rows.find(x=>x[0]==="HPI-B-01")?.[1]==="candidate_primary_unmeasurable",
  "cannot claim verified receipt without eligible denominator/award linkage");
 check(rows.find(x=>x[0]==="HPI-A-03")?.[1]==="context_only_not_indicator",
  "local income deprivation mistaken for local household poverty gap");
 check(rows.find(x=>x[0]==="HPI-E-03")?.[1]==="not_measured",
  "council-reported benefit value mistaken for audited implementation cost");
 const statuses=rows.slice(1).reduce((s,row)=>(s[row[1]]=(s[row[1]]||0)+1,s),{});
 return {
  schemaVersion:"0.2",kind:"hpi_newham_measurement_readiness_desk_test",
  id:d.caseId,location:d.location,deskStudyStatus:"COMPLETED_TECHNICAL_SOURCE_VALIDATION",
  founderTerritoryChoice:"NEW_HAM_PUBLIC_DESK_TEST_ONLY",
  targetPopulation:d.workingPopulation,
  prospectiveQuestion:d.researchQuestion,
  contextFacts:d.sourceItems.map(x=>({
   id:x.id,metric:x.metric,value:x.value,unit:x.unit,geography:x.geography,
   period:x.period,publisher:x.publisher,sourceClass:x.sourceClass,
   sourceUrl:x.sourceUrl,denominatorValidatedForBenefitReceipt:false,
   limitations:x.limitations
  })),
  publishedButNotExtractedLocalModel:d.notExtractedSource,
  indicatorReadiness:{candidateCount:15,primaryIndicator:"HPI-B-01",
   localPrimaryValue:null,locallyMeasuredWithApprovedDefinition:0,
   statuses},
  inputs:{publicFactAuditSha256:SHA(raw),indicatorMapSha256:SHA(rawMap),candidateCatalogSha256:SHA(indicatorCsv)},
  publicDataOnly:true,thirdPartyDatasetDownloaded:false,individualRecordsProcessed:false,
  independentScientificApproval:false,fieldworkAuthorised:false,
  costEffectivenessEstablished:false,measuredBeneficiaryImpact:false,
  outcomeValidForCausalInference:false,
  method:"Exact bounded metadata/indicator feasibility audit. No pooling of incompatible geographies, denominators, time windows or overlapping council programme figures.",
  additionalityWarning:"Existing council programme is substantial. No evidence yet that HPI would add benefit versus current services; do not duplicate outreach.",
  gates:d.mandatoryGates
 };
}
