/**
 * RT-01.3 exact artifact verification: the same source files must generate
 * exactly the same canonical bytes, citation manifest and correction history.
 * Optional --archive saves only these safe reports to CircleCI artifact store;
 * never writes participant data, network or deployment/portfolio state.
 */
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
import path from "node:path";
import {generateResearchArtifacts,PUBLIC_OUTPUTS,sha256}
 from "../research-tools/research-pipeline.mjs";
export async function verifyPublishedResearchArtifacts({
 read=readFile,write=writeFile,createDir=mkdir,archive=false,
 root="dist",archiveRoot="qa-artifacts/research-pipeline"
}={}){
 const bundle=await generateResearchArtifacts({load:source=>read(source,"utf8")});
 for(const [key,filename] of Object.entries(PUBLIC_OUTPUTS)){
  const output=bundle.outputs[key];
  if(typeof output!=="string")throw Error("Unknown artifact "+key);
  const published=await read(path.posix.join(root,filename),"utf8");
  if(published!==output)
   throw Error("Published artifact bytes changed or stale: "+filename);
 }
 const expected=new Map(bundle.manifest.artifacts.map(a=>[a.path,a.sha256]));
 for(const [key,filename] of Object.entries(PUBLIC_OUTPUTS)){
  if(key==="manifest")continue;
  if(sha256(bundle.outputs[key])!==expected.get(filename))
   throw Error("Artifact hash mismatch "+filename);
 }
 if(archive){
  await createDir(archiveRoot,{recursive:true});
  for(const [key,filename] of Object.entries(PUBLIC_OUTPUTS))
   await write(path.posix.join(archiveRoot,filename),bundle.outputs[key],"utf8");
 }
 return {
  status:"PASS",
  verifiedArtifacts:Object.keys(PUBLIC_OUTPUTS).length,
  publicSourceInputCount:bundle.manifest.sourceInputs.length,
  hashedOutputsCount:bundle.manifest.artifacts.length,
  root,
  exactSourceDigestCount:bundle.manifest.sourceInputs.length,
  archiveRequested:archive,
  syntheticOnly:true,
  independentlyValidatedScientificClaims:false,
  causeOrPopulationImpactMeasured:false
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const args=process.argv.slice(2);
 if(args.some(a=>a!=="--archive"))throw Error("Only --archive is supported");
 try{
  console.log(JSON.stringify(await verifyPublishedResearchArtifacts({archive:args.includes("--archive")}),null,2));
 }catch(error){console.error("RT-01.3 reproducibility verification FAILED: "+error.message);process.exitCode=1}
}
