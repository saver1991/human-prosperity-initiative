import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
import {validateResearchGovernance,assessResearchPublication,governanceStatus}
 from "../research-tools/research-governance.mjs";
export async function verifyResearchGovernance({read=readFile,root="dist"}={}){
 const raw=await read("research/research-governance-gates.json","utf8");
 const p=validateResearchGovernance(JSON.parse(raw));
 const live=JSON.parse(await read(root+"/research-governance-status.json","utf8"));
 if(JSON.stringify(governanceStatus(p))!==JSON.stringify(live))
  throw Error("Published research governance claims drifted from source policy");
 const [source,sim,manifest,citations,licence,docs]=await Promise.all([
  read(root+"/research-source-catalog.json","utf8"),
  read(root+"/research-pipeline-report.json","utf8"),
  read(root+"/research-pipeline-manifest.json","utf8"),
  read(root+"/research-citation-manifest.json","utf8"),
  read("LICENSE","utf8"),read("LICENSE-DOCS.md","utf8")
 ]);
 const a=JSON.parse(source),b=JSON.parse(sim),m=JSON.parse(manifest),c=JSON.parse(citations);
 if(!licence.startsWith("MIT License")||!docs.includes("Creative Commons Attribution 4.0"))
  throw Error("Repository licence declarations differ from policy");
 if(a.scope!=="metadata_only_no_retrieved_datasets"||a.records.some(x=>
   x.dataIngested!==false||x.metadataOnly!==true))
  throw Error("Unapproved source payload found in public catalogue");
 if(b.caveats?.participantDataProcessed!==false||
   b.caveats?.fieldwork!==false||b.caveats?.scientificSignoff!==false||
   b.caveats?.realWorldImpactMeasured!==false||
   b.syntheticResult?.causalInterpretation!=="NOT_SUPPORTED")
  throw Error("Research report overstates field evidence or claims");
 if(m.promises?.realParticipantRecordsUsed!==false||
    m.promises?.independentlyValidated!==false||
    m.promises?.thirdPartyMaterialsRedistributed!==false)
  throw Error("Research manifest contradicts research privacy/rights gates");
 if(c.citations?.some(x=>x.fullTextRedistributed!==false||
     x.independentSourceVerification!==false)||
   c.sourceCount!==a.records.length)
  throw Error("Unreviewed citation or publisher material redistribution");
 for(const obj of [
  {class:"public_reference_metadata",origin:"publisher_metadata",scenarioType:"none",
   hasPersonalRows:false,hasThirdPartyPayload:false,licenseReview:"metadata_only",
   reidentificationReview:"not_applicable",purpose:"publish minimal public source metadata"},
  {class:"synthetic",origin:"synthetic",scenarioType:"synthetic",
   hasPersonalRows:false,hasThirdPartyPayload:false,licenseReview:"not_applicable",
   reidentificationReview:"not_applicable",purpose:"demonstrate fictional two-arm outcome comparison"}
 ]){
  if(assessResearchPublication(p,obj).decision!=="ALLOW_METADATA_OR_SYNTHETIC_ONLY")
   throw Error("Existing safe public tool not in policy scope");
 }
 return {status:"PASS",policyStatus:"technical_only",
  sourceDatasetRecords:a.records.length,checkCitations:c.sourceCount,
  publicPersonalDataApproved:false,actualHumanStudyApproved:false,
  screenReaderSignoff:false,externalLicenseReviewComplete:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{console.log(JSON.stringify(await verifyResearchGovernance(),null,2))}
 catch(e){console.error("Research governance failed: "+e.message);process.exitCode=1}
}
