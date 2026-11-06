/**
 * RT-01.2 — descriptive aggregate-only outcome comparison.
 * No causal inference, no eligibility adjudication, no data about individuals.
 */
const allowedKeys=(obj,keys,label)=>{
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw Error(label+" requires a record");
 for(const key of Object.keys(obj))if(!keys.includes(key))
  throw Error(label+" has unsupported field "+key);
};
const validateGroup=(group,label)=>{
 allowedKeys(group,["eligible","received","missingFollowup"],label);
 const {eligible,received,missingFollowup=0}=group;
 if(![eligible,received,missingFollowup].every(Number.isSafeInteger)||eligible<=0||
    received<0||missingFollowup<0||received+missingFollowup>eligible)
  throw Error(label+" counts inconsistent");
 return {eligible,received,missingFollowup,observed:eligible-missingFollowup};
};
export function compareAggregateOutcomes(spec){
 allowedKeys(spec,["name","sourceType","metric","control","comparison","followupDescription"],"Scenario");
 const {name,sourceType,metric,followupDescription,control,comparison}=spec;
 if(sourceType!=="synthetic"&&sourceType!=="public_aggregate")
  throw Error("Only synthetic or non-identifying public aggregate scenarios allowed");
 for(const [key,value] of Object.entries({name,metric,followupDescription}))
  if(typeof value!=="string"||!value.trim()||value.length>240)
   throw Error("Missing or oversized "+key);
 const c=validateGroup(control,"control"),t=validateGroup(comparison,"comparison");
 const rate=g=>g.received/g.observed;
 if(!c.observed||!t.observed)throw Error("No follow-up observations");
 const controlRate=rate(c),comparisonRate=rate(t);
 return {
  resultKind:"descriptive_aggregate_comparison_v0.1",
  name,metric,followupDescription,sourceType,
  control:{...c,observedRate:controlRate},
  comparison:{...t,observedRate:comparisonRate},
  absolutePercentagePointDifference:(comparisonRate-controlRate)*100,
  relativeRiskRatio:controlRate===0?null:comparisonRate/controlRate,
  attritionControlPct:c.missingFollowup/c.eligible*100,
  attritionComparisonPct:t.missingFollowup/t.eligible*100,
  causalInterpretation:"NOT_SUPPORTED",
  independentMethodValidation:false,
  confidenceInterval:null,
  warning:"Descriptive rates among observed records only: selection, attrition, confounding, eligibility errors and the absence of a valid counterfactual may dominate any difference."
 };
}
