import {analyzeOutcomeScenario,simulateSyntheticOutcomes} from "/research-outcome-evaluation.js";
/* Real working browser calculator for synthetic group counts only.
 * No user accounts, external API, cookies, analytics or sensitive inputs.
 */
const form=document.querySelector("#outcome-demo");
const status=document.querySelector("#outcome-demo-result");
const indicator={id:"HPI-B-01",unit:"share",domain:"Benefits",status:"proposed_not_validated"};
const pct=n=>Number(n).toFixed(2)+"%";
const value=id=>{
 const raw=document.getElementById(id)?.value;
 if(raw===""||raw===undefined)throw Error("Please enter all synthetic group counts");
 const num=Number(raw);
 if(!Number.isSafeInteger(num)||num<0||num>50000)
  throw Error("Use nonnegative whole numbers in the allowed range");
 return num;
};
function evaluate(){
 try{
  const scenario={
   scenarioId:"HPI_BROWSER_SYNTHETIC",sourceType:"synthetic",
   indicatorId:"HPI-B-01",timeframe:"Illustrative nine-month follow-up",
   currency:"GBP",independentBinomialAssumption:true,
   reference:{eligible:value("ref-eligible"),received:value("ref-received"),
    missingFollowup:value("ref-missing"),harmsReported:0,costMinorUnits:0},
   comparison:{eligible:value("comp-eligible"),received:value("comp-received"),
    missingFollowup:value("comp-missing"),harmsReported:0,costMinorUnits:0}
  };
  const r=analyzeOutcomeScenario(scenario,indicator);
  const ci=r.uncertainty.difference;
  status.textContent="SYNTHETIC ONLY — reference "+pct(r.reference.observedRate*100)+
   ", comparison "+pct(r.comparison.observedRate*100)+
   ". Observed difference "+(r.observedDifferencePercentagePoints>=0?"+":"")+
   pct(r.observedDifferencePercentagePoints)+
   ". Conditional Newcombe-Wilson interval ["+pct(ci.lower*100)+", "+pct(ci.upper*100)+
   "] under an assumed independent binomial sample. Worst/best missingness difference ["+
   pct(r.missingnessSensitivity.differencePercentagePoints.lower)+", "+
   pct(r.missingnessSensitivity.differencePercentagePoints.upper)+
   "]. No causal effectiveness or scientific validation is established.";
 }catch(error){
  status.textContent="Cannot evaluate synthetic example: "+error.message+
   ". No data were sent to a server.";
 }
}
if(form&&status){form.addEventListener("submit",event=>{event.preventDefault();evaluate()});evaluate()}
const simulationButton=document.querySelector("#run-synthetic-simulation");
const simulationStatus=document.querySelector("#simulation-result");
simulationButton?.addEventListener("click",()=>{
 try{
  const x=simulateSyntheticOutcomes({
   seed:17,iterations:1000,
   reference:{eligible:100,receiptProbability:0.06,missingProbability:0.05},
   comparison:{eligible:100,receiptProbability:0.11,missingProbability:0.05}
  });
  simulationStatus.textContent="Hypothetical simulation (fixed seed 17, 1,000 draws): "+
   "median "+pct(x.simulatedVariationPercentiles.median)+
   ", central 95% simulated variation ["+pct(x.simulatedVariationPercentiles.p025)+
   ", "+pct(x.simulatedVariationPercentiles.p975)+
   "]. These are NOT a confidence interval for a real-world effect.";
 }catch(error){simulationStatus.textContent="Synthetic simulation unavailable: "+error.message}
});
