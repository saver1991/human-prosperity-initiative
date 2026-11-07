import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
import {validateNewhamDeskSources} from "../research-tools/newham-desk-validation.mjs";
export async function verifyNewhamDesk({read=readFile,root="dist"}={}){
 const [audit,mapping,indicators,published,source]=await Promise.all([
  read("research/newham-pension-credit-desk-source-audit-v0.2.json","utf8"),
  read("research/F0-03-newham-indicator-feasibility-v0.2.csv","utf8"),
  read("research/F0-03-indicator-catalog-v0.1.csv","utf8"),
  read(root+"/research-newham-validation.json","utf8"),
  read(root+"/research-newham-source-audit.json","utf8")
 ]);
 const result=validateNewhamDeskSources(audit,mapping,indicators);
 if(published!==JSON.stringify(result,null,2)+"\n"||source!==audit)
  throw Error("Newham public artifact stale or source input tampered");
 const html=await read(root+"/research/newham-pension-credit.html","utf8");
 for(const token of ["F0-03 Newham desk validation","39.0%","62%","220 residents",
   "Not measured","2024/25","No HPI intervention"])
  if(!html.includes(token))throw Error("Newham site missing required caveat "+token);
 if(!html.includes("/research-newham-validation.json")||
   !html.includes("href=\"/research/f0-03-newham-pension-credit-desk-validation-v0-2\""))
  throw Error("Newham first-party evidence/method links absent");
 return {
  status:"PASS",caseId:result.id,territory:result.location.name,
  sourceFacts:result.contextFacts.length,indicatorCandidates:result.indicatorReadiness.candidateCount,
  primaryLocalOutcomeMeasured:result.indicatorReadiness.locallyMeasuredWithApprovedDefinition,
  scientificApproval:false,personalData:false,impactMeasured:false,
  publishedDataMatchesPinnedSource:true
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{console.log(JSON.stringify(await verifyNewhamDesk(),null,2))}
 catch(e){console.error("Newham desk audit FAILED: "+e.message);process.exitCode=1}
}
