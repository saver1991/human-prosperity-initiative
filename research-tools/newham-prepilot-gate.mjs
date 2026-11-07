/**
 * F0-02.5A + F0-05.1A: bounded, deterministic public-source feasibility gate.
 * Not a scientific trial protocol, ranking, legal or ethics sign-off.
 */
import {createHash} from "node:crypto";
const expectedIds=["NEED","EVIDENCE","FEASIBILITY","ETHICS","ADDITIONALITY","MEASURABLE_LEARNING"];
const weights=[20,20,20,15,15,10];
const facts=["NEWHAM_OLDER_DEPRIVATION_2025","NEWHAM_ALL_AGE_DEPRIVATION_2025",
 "GB_PENSION_CREDIT_TAKEUP_FYE_2025","NEWHAM_COUNCIL_SUPPORTED_2024_25"];
const values=[46.7,39,62,220],areas=["Newham","Newham","Great Britain","Newham"];
const age=["60+","all ages","pensioner families estimated eligible","older programme users"];
const gateIds=["LEGAL_ENTITY","DATA_RIGHTS","INDEPENDENT_METHODS","ETHICS","COMMUNITY","LOCAL_PARTNER","BUDGET"];
const sha256=v=>createHash("sha256").update(v).digest("hex");
const check=(truth,msg)=>{if(!truth)throw Error("HPI Newham prepilot: "+msg)};
export function evaluatePrepilotDecision(raw){
 check(typeof raw==="string"&&raw.length>200&&raw.length<80_000,"missing or oversized decision record");
 const data=JSON.parse(raw);
 check(data.schemaVersion==="0.1"&&data.id==="NEWHAM-RESEARCH-PRE-PILOT"&&
  data.founderDecision==="NEWHAM_SELECTED_AS_PUBLIC_DESK_VALIDATION_ONLY"&&
  data.territory?.geoCode==="E09000025","unreviewed case or location");
 check(data.populationStatus==="working_hypothesis_not_eligible_person_list"&&
  data.deskDecision==="GO_DESK_ONLY"&&
  data.fieldDecision==="NO_GO_UNTIL_INDEPENDENT_GATES","unsupported consent or field study decision");
 check(data.scoreTotal===null&&data.ranking===null&&
  data.independentCommunityScoringCompleted===false,"fabricated independent ranking or scores");
 check(Array.isArray(data.criteria)&&data.criteria.length===6,"six rubric criteria required");
 for(let i=0;i<6;i++){
  const c=data.criteria[i];
  check(c.id===expectedIds[i]&&c.weightPercent===weights[i]&&
   c.reviewScore===null&&typeof c.deskEvidence==="string"&&c.deskEvidence.length>=55&&
   typeof c.gate==="string"&&c.gate.length>30,"invented or underspecified weighted score");
 }
 check(data.criteria.reduce((a,x)=>a+x.weightPercent,0)===100,"rubric weights do not total 100");
 check(Array.isArray(data.sourceContext)&&data.sourceContext.length===4,"missing public source provenance");
 for(let i=0;i<4;i++){
  const item=data.sourceContext[i];
  check(item.id===facts[i]&&item.value===values[i]&&item.geography===areas[i]&&
   item.age===age[i]&&item.url.startsWith("https://")&&item.source.length>25,
   "mismatched metric, geography, age group or official source");
 }
 check(data.sourceContext[0].kind==="area_context_not_pension_credit_eligibility"&&
  data.sourceContext[2].kind==="national_survey_caseload_not_newham_rate"&&
  data.sourceContext[3].kind==="service_delivery_not_verified_receipt",
  "borough deprivation, national take-up or council service claim misused as verified receipt");
 check(Array.isArray(data.alternatives)&&data.alternatives.length===3&&
  data.alternatives[0].place==="Newham"&&
  data.alternatives[0].status==="selected_for_public_desk_test"&&
  data.alternatives.every(x=>x.fieldStudyApproved===false),"fabricated international research approval");
 check(Array.isArray(data.fieldGates)&&data.fieldGates.length===7&&
  data.fieldGates.every((x,i)=>x.id===gateIds[i]&&x.status==="not_approved"&&x.why?.length>15),
  "an independent legal, scientific, ethical or funding gate was cleared without evidence");
 const decisions=data.decisions;
 const flags=["actualBeneficiariesContacted","personalRecordsCollected","thirdPartyDatasetImported",
  "interventionDelivered","causalEffectMeasured","fieldAuthorised","externalReviewSigned"];
 check(flags.every(k=>decisions?.[k]===false),"fabricated fieldwork, consent, payment or science");
 check(data.publicationClassification==="public_metadata_no_personal_data",
  "public study source cannot contain participant data");
 return {
  schemaVersion:"0.1",kind:"newham_f0_02_5a_desk_priority_gate",
  location:data.territory,decision:data.deskDecision,fieldDecision:data.fieldDecision,
  officialContext:data.sourceContext.map(x=>({id:x.id,value:x.value,geography:x.geography,age:x.age,
   period:x.source,url:x.url,interpretation:x.kind})),
  criterionStatus:data.criteria.map(x=>({id:x.id,weightPercent:x.weightPercent,
   independentlyAssignedScore:x.reviewScore,deskStrength:x.deskStrength,gate:x.gate})),
  independentNumericScore:null,finalPilotRank:null,
  criticalGates:data.fieldGates.map(x=>({id:x.id,status:x.status})),
  localVerifiedReceiptRate:null,observedHumanBenefit:null,
  sourceSha256:sha256(raw),reportedHpiImpact:false,fieldStudyAuthorised:false,
  independentMethodologyApproved:false,
  warning:"Newham is selected for a public desk test only; its 46.7% older-age deprivation and the GB 62% Pension Credit rate cannot estimate Newham entitlement or an intervention effect."
 };
}
