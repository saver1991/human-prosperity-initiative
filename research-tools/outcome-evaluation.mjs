/**
 * RT-01.2 — bounded, aggregate/synthetic outcome description and scenario lab.
 * Statistical intervals are CONDITIONAL calculations, never causal effects,
 * universal poverty metrics, licence approval, individual eligibility or policy.
 * Dependency-free and safe for Node.js/browser read-only use.
 */
const Z95=1.959963984540054;
const exactKeys=(obj,names,label)=>{
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw Error(label+" must be a record");
 for(const key of Object.keys(obj))if(!names.includes(key))
  throw Error(label+" unsupported field "+key);
};
const string=(value,label,max=160)=>{
 if(typeof value!=="string"||!value.trim()||value.length>max||
  /[\u0000-\u001f]/.test(value))throw Error(label+" missing or malformed");
 return value;
};
const nonnegative=(value,label)=>{
 if(!Number.isSafeInteger(value)||value<0)throw Error(label+" must be nonnegative integer");
 return value;
};
const counts=(input,label,publicData)=>{
 exactKeys(input,["eligible","received","missingFollowup"],label);
 const eligible=nonnegative(input.eligible,label+" eligible");
 const received=nonnegative(input.received,label+" received");
 const missingFollowup=nonnegative(input.missingFollowup??0,label+" missingFollowup");
 if(eligible===0||received+missingFollowup>eligible)throw Error(label+" inconsistent counts");
 if(publicData&&(eligible<20||Math.min(received,eligible-received)<10))
  throw Error(label+" public aggregate cell requires suppression or human disclosure review");
 return {eligible,received,missingFollowup,observed:eligible-missingFollowup};
};
const group=(input,label,publicData)=>{
 exactKeys(input,["eligible","received","missingFollowup","harmsReported","costMinorUnits",
  "baseline","strata"],label);
 const main=counts({eligible:input.eligible,received:input.received,
  missingFollowup:input.missingFollowup},label,publicData);
 if(main.observed===0)throw Error(label+" has no observed follow-up");
 const harmsReported=nonnegative(input.harmsReported??0,label+" harmsReported");
 if(harmsReported>main.observed)throw Error(label+" harms exceed observed follow-up");
 const costMinorUnits=nonnegative(input.costMinorUnits??0,label+" costMinorUnits");
 if(costMinorUnits>1_000_000_000_000)throw Error(label+" unrealistic cost input");
 const baseline=input.baseline===undefined?null:counts(input.baseline,label+" baseline",publicData);
 if(input.strata!==undefined&&(!Array.isArray(input.strata)||!input.strata.length||
  input.strata.length>20))throw Error(label+" strata need bounded array");
 const seen=new Set();
 const strata=(input.strata||[]).map(s=>{
  exactKeys(s,["category","eligible","received","missingFollowup"],label+" stratum");
  const category=string(s.category,label+" stratum category",72);
  if(!/^[\p{L}\p{N} _./-]+$/u.test(category)||seen.has(category))
   throw Error(label+" duplicate or unsafe strata label");
  seen.add(category);
  const c=counts({eligible:s.eligible,received:s.received,
   missingFollowup:s.missingFollowup},label+" stratum "+category,publicData);
  return {category,...c,observedRate:c.observed?c.received/c.observed:null};
 });
 if(strata.length&&
   (strata.reduce((n,s)=>n+s.eligible,0)!==main.eligible||
    strata.reduce((n,s)=>n+s.received,0)!==main.received||
    strata.reduce((n,s)=>n+s.missingFollowup,0)!==main.missingFollowup))
   throw Error(label+" strata cannot be reconciled with arm totals");
 return {...main,harmsReported,costMinorUnits,baseline,strata};
};
export function wilson95(successes,observations){
 if(!Number.isSafeInteger(successes)||!Number.isSafeInteger(observations)||
  observations<1||successes<0||successes>observations)
  throw Error("Wilson calculation requires valid observed binomial counts");
 const p=successes/observations,z2=Z95*Z95,denom=1+z2/observations;
 const mid=(p+z2/(2*observations))/denom;
 const width=Z95*Math.sqrt((p*(1-p)+z2/(4*observations))/observations)/denom;
 return {lower:Math.max(0,mid-width),upper:Math.min(1,mid+width),
  coverage:"95%",method:"Wilson score (conditional independent Bernoulli sample)"};
}
export function newcombeDifference95(reference,comparison){
 exactKeys(reference,["received","observed"],"reference counts");
 exactKeys(comparison,["received","observed"],"comparison counts");
 const w0=wilson95(reference.received,reference.observed);
 const w1=wilson95(comparison.received,comparison.observed);
 const p0=reference.received/reference.observed,p1=comparison.received/comparison.observed;
 const delta=p1-p0;
 return {
  lower:Math.max(-1,delta-Math.hypot(p1-w1.lower,w0.upper-p0)),
  upper:Math.min(1,delta+Math.hypot(w1.upper-p1,p0-w0.lower)),
  method:"Newcombe-Wilson score difference (independent binomial groups, conditional)",
  coverage:"95%",
  assumptionsVerified:false
 };
}
export function analyzeOutcomeScenario(spec,indicator){
 exactKeys(spec,["scenarioId","sourceType","indicatorId","timeframe","currency",
  "reference","comparison","independentBinomialAssumption","sourceProvenance"],
 "scenario");
 exactKeys(indicator,["id","unit","status","domain"],"indicator catalogue record");
 string(spec.scenarioId,"scenarioId",100);
 if(!/^[A-Za-z0-9_-]+$/.test(spec.scenarioId))throw Error("Unsafe scenario ID");
 if(!["synthetic","public_aggregate"].includes(spec.sourceType))
  throw Error("Raw/individual outcome records not permitted");
 if(spec.indicatorId!==indicator.id||indicator.status!=="proposed_not_validated"||
   !/^HPI-[A-Z]-\d\d$/.test(indicator.id)||
   indicator.unit!=="share")
  throw Error("Outcome metric not an aligned, explicitly unvalidated F0-03 share indicator");
 string(indicator.domain,"indicator domain");
 string(spec.timeframe,"timeframe");
 if(!/^[A-Z]{3}$/.test(spec.currency||""))throw Error("Explicit ISO currency required");
 if(typeof spec.independentBinomialAssumption!=="boolean")
  throw Error("Sampling assumption must be explicit");
 if(spec.sourceType==="public_aggregate"){
  const s=spec.sourceProvenance;
  exactKeys(s,["kind","schemaVersion","sourceKind","sourceId","sourceSha256",
    "participantRecordsUsed"],"source provenance");
  if(s.kind!=="hpi-normalised-aggregate"||s.schemaVersion!=="1.0"||
   s.sourceKind!=="public_aggregate"||s.participantRecordsUsed!==false||
   !/^[a-f0-9]{64}$/.test(s.sourceSha256)||!s.sourceId)
   throw Error("Public aggregation must originate in an approved pinned RT-01.1 contract");
 }else if(spec.sourceProvenance!==undefined&&spec.sourceProvenance!==null)
  throw Error("Synthetic scenario cannot masquerade as imported data");
 const publicData=spec.sourceType==="public_aggregate";
 const c=group(spec.reference,"reference",publicData);
 const t=group(spec.comparison,"comparison",publicData);
 const p0=c.received/c.observed,p1=t.received/t.observed;
 const diff=p1-p0;
 const r0={...c,observedRate:p0,attritionPct:c.missingFollowup/c.eligible*100,
  harmedObservedRate:c.harmsReported/c.observed,
  observedCostPerReceiptMinor:c.received===0?null:c.costMinorUnits/c.received};
 const r1={...t,observedRate:p1,attritionPct:t.missingFollowup/t.eligible*100,
  harmedObservedRate:t.harmsReported/t.observed,
  observedCostPerReceiptMinor:t.received===0?null:t.costMinorUnits/t.received};
 const missingBounds=x=>({lower:x.received/x.eligible,
  upper:(x.received+x.missingFollowup)/x.eligible});
 const bounds0=missingBounds(c),bounds1=missingBounds(t);
 if(c.strata.length!==t.strata.length||
   c.strata.some(x=>!t.strata.some(y=>y.category===x.category)))
  throw Error("Equity strata categories must match across groups");
 const equityComparisons=c.strata.map(x=>{
  const y=t.strata.find(z=>z.category===x.category);
  return {category:x.category,referenceObservedRate:x.observedRate,
   comparisonObservedRate:y.observedRate,
   descriptiveDifferencePercentagePoints:x.observedRate===null||y.observedRate===null?
    null:(y.observedRate-x.observedRate)*100,
   causalInterpretation:"NOT_SUPPORTED"};
 });

 const interval=spec.independentBinomialAssumption?{
  reference:wilson95(c.received,c.observed),
  comparison:wilson95(t.received,t.observed),
  difference:newcombeDifference95(c,t)
 }:null;
 return {
  schemaVersion:"1.0",kind:"hpi-descriptive-outcome-audit",
  scenarioId:spec.scenarioId,sourceType:spec.sourceType,
  indicator:{id:indicator.id,status:indicator.status,unit:indicator.unit,domain:indicator.domain},
  timeframe:spec.timeframe,currency:spec.currency,
  reference:r0,comparison:r1,
  observedDifferencePercentagePoints:diff*100,
  equityComparisons,
  observedRiskRatio:p0===0?null:p1/p0,
  missingnessSensitivity:{
   reference:bounds0,comparison:bounds1,
   differencePercentagePoints:{lower:(bounds1.lower-bounds0.upper)*100,
    upper:(bounds1.upper-bounds0.lower)*100},
   method:"Worst/best case bounds if every missing follow-up is a non-receipt/receipt"
  },
  uncertainty:interval||{method:"Not calculated: independent-binomial sampling assumption not asserted",
   conditionalIntervals:null},
  independentBinomialAssumptionDeclared:spec.independentBinomialAssumption,
  causalInterpretation:"NOT_SUPPORTED",
  confidenceInCausalEffect:"NOT_ASSESSED",
  independentlyValidated:false,
  costEffectivenessEstablished:false,
  measuredPopulationImpact:false,
  sourceProvenance:spec.sourceType==="public_aggregate"?
   {id:spec.sourceProvenance.sourceId,sha256:spec.sourceProvenance.sourceSha256}:null,
  warnings:[
   "Indicators are draft F0-03 candidates; a human methodological review and approved study design are pending.",
   "Difference describes observed groups and is not an intervention effect; selection, confounding and attrition remain unaddressed.",
   "Wilson/Newcombe intervals, if calculated, condition on assumed independent binomial sampling and exclude design/bias uncertainty.",
   "Costs per observed receipt, harm counts and equity strata are descriptive only and not causal cost-effectiveness.",
   "Missingness bounds explore attrition, not statistical confidence or reliable counterfactual impact."
  ]
 };
}
// Pure synthetic simulations of binomial receipts, never a confidence interval
// for real-world research. A seed ensures repeatability across runtimes.
export function simulateSyntheticOutcomes(spec){
 exactKeys(spec,["seed","iterations","reference","comparison"],"simulation");
 const seed=spec.seed,iterations=spec.iterations;
 if(!Number.isSafeInteger(seed)||seed<1||seed>0xffffffff||
    !Number.isSafeInteger(iterations)||iterations<100||iterations>3000)
  throw Error("Simulation requires bounded reproducible seed and iterations");
 const checkArm=(a,label)=>{
  exactKeys(a,["eligible","receiptProbability","missingProbability"],label);
  if(!Number.isSafeInteger(a.eligible)||a.eligible<20||a.eligible>5000||
     typeof a.receiptProbability!=="number"||a.receiptProbability<0||
     a.receiptProbability>1||!Number.isFinite(a.receiptProbability)||
     typeof a.missingProbability!=="number"||a.missingProbability<0||
     a.missingProbability>=1||!Number.isFinite(a.missingProbability))
   throw Error("Invalid synthetic arm probability/sample size");
  return a;
 };
 const a=checkArm(spec.reference,"reference"),b=checkArm(spec.comparison,"comparison");
 if((a.eligible+b.eligible)*iterations>2_000_000)
  throw Error("Synthetic simulation would exceed sampling work budget");
 let state=seed>>>0;
 const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 const values=[];
 for(let i=0;i<iterations;i++){
  const sample=x=>{
   let observed=0,receipt=0;
   for(let j=0;j<x.eligible;j++){
    if(rand()<x.missingProbability)continue;
    observed++;if(rand()<x.receiptProbability)receipt++;
   }
   return observed?receipt/observed:null;
  };
  const p0=sample(a),p1=sample(b);
  if(p0!==null&&p1!==null)values.push((p1-p0)*100);
 }
 if(values.length<iterations*0.9)throw Error("Excessive synthetic follow-up loss");
 values.sort((a,b)=>a-b);
 const quantile=p=>{
  const x=(values.length-1)*p,lo=Math.floor(x),hi=Math.ceil(x);
  return values[lo]+(values[hi]-values[lo])*(x-lo);
 };
 return {
  kind:"hpi-synthetic-binomial-simulation",seed,iterations,validDraws:values.length,
  theoreticalDifferencePercentagePoints:(b.receiptProbability-a.receiptProbability)*100,
  simulatedVariationPercentiles:{p025:quantile(0.025),median:quantile(0.5),p975:quantile(0.975)},
  notARealWorldConfidenceInterval:true,causalInterpretation:"NOT_SUPPORTED",
  measuredPopulationImpact:false,
  note:"Simulation quantiles show variability of a hypothetical model under specified probabilities; they are not a confidence interval or validation of any real intervention."
 };
}
