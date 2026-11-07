import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
import {evaluatePrepilotDecision} from "../research-tools/newham-prepilot-gate.mjs";
export async function verifyPrepilotDecision({read=readFile,root="dist"}={}){
 const raw=await read("research/newham-prepilot-decision-register-v0.1.json","utf8");
 const expected=JSON.stringify(evaluatePrepilotDecision(raw),null,2)+"\n";
 const published=await read(root+"/research-newham-prepilot-decision.json","utf8");
 if(published!==expected)throw Error("Prepilot research evidence mismatch between reviewed source and public artifact");
 const page=await read(root+"/research/newham-prepilot.html","utf8");
 for(const term of ["46.7%","39.0%","62%","NO-GO: FIELDWORK","Not assessed",
  "F0-05.1A","F0-03.1A","Unscored F0-02.5 criterion audit"])
  if(!page.includes(term))throw Error("Missing source/ethics distinction in Newham prepilot page: "+term);
 const map=await read(root+"/sitemap.xml","utf8");
 if(!map.includes("/research/newham-prepilot"))throw Error("Newham prepilot is not discoverable in first-party sitemap");
 const outcome=JSON.parse(published);
 if(outcome.fieldStudyAuthorised!==false||outcome.reportedHpiImpact!==false||
    outcome.criterionStatus.some(x=>x.independentlyAssignedScore!==null))
  throw Error("Prepilot fieldwork or numerical independent review falsely approved");
 return {status:"PASS",deskDecision:outcome.decision,fieldDecision:outcome.fieldDecision,
  sixWeightedCriteria:outcome.criterionStatus.length,independentlyReviewedScores:0,
  unresolvedBlockingExternalGates:outcome.criticalGates.length,recordedRealImpact:0};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{console.log(JSON.stringify(await verifyPrepilotDecision(),null,2))}
 catch(e){console.error("Newham prepilot decision guard FAILED: "+e.message);process.exitCode=1}
}
