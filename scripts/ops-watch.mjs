/**
 * HPI public production watch: no credentials, customer records, paid APIs or changes.
 * CircleCI scheduled pipeline only. Failure becomes a CI failure, not a guarantee
 * that email/SMS/webhook notifications are configured for the maintainer.
 */
import {mkdir,writeFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";

export const BASE="https://human-prosperity-initiative.vercel.app";
export const REPO="https://api.github.com/repos/saver1991/human-prosperity-initiative";
const SHA=/^[0-9a-f]{40}$/;
const ROUTES=["/","/mission","/research","/library","/roadmap","/status","/publication.json"];
const STATUS_CONTEXTS=[
 "ci/circleci: website-quality",
 "ci/circleci: browser-accessibility",
 "Vercel"
];

async function request(url,fetchImpl){
 const response=await fetchImpl(url,{
  method:"GET",
  headers:{"Accept":url.startsWith(REPO)?"application/vnd.github+json":"*/*",
   "User-Agent":"HPI-public-readonly-operations-watch"},
  signal:AbortSignal.timeout(12000),
  redirect:"error"
 });
 if(response.status!==200)throw Error("HTTP "+response.status+" for "+new URL(url).pathname);
 return response;
}

export function latestStates(statuses){
 const observed=new Map();
 for(const item of statuses){
  if(!observed.has(item.context))observed.set(item.context,item.state);
 }
 return observed;
}

export async function inspect({fetchImpl=fetch,now=new Date()}={}){
 const report={
  kind:"public-readonly-web01-watch",checkedAt:now.toISOString(),
  source:"public-site-plus-public-GitHub",
  result:"pending",issues:[],warnings:[],routes:[],ci:{},
  publication:{},
  resourceSignals:{publicMainCommitsLast7Days:null,
   providerBilledCost:null,providerCredits:null,
   meaning:"Commit volume is a public activity proxy, not charge or usage data. No billing credentials are accessed."}
 };
 for(const route of ROUTES){
  try{
   const response=await request(BASE+route,fetchImpl);
   const text=await response.text();
   report.routes.push({path:route,status:200});
   if(route==="/publication.json"){
    const data=JSON.parse(text);
    report.publication={revision:data.revision,generatedAt:data.generatedAt};
    if(!SHA.test(String(data.revision)))report.issues.push("Publication lacks valid 40-char Git SHA");
   }else if(!text.includes("<main"))report.issues.push("Missing main content on "+route);
  }catch(error){report.routes.push({path:route,status:"error"});report.issues.push(route+": "+error.message);}
 }
 let mainSha=null;
 try{
  const latest=await (await request(REPO+"/commits/main",fetchImpl)).json();
  if(!SHA.test(String(latest.sha)))throw Error("Unexpected main SHA");
  mainSha=latest.sha;
  report.publication.githubMainSha=mainSha;
  const deployed=report.publication.revision;
  if(SHA.test(String(deployed))&&mainSha!==deployed){
   const age=Date.parse(now)-Date.parse(report.publication.generatedAt);
   if(Number.isFinite(age)&&age>=0&&age<20*60*1000){
    report.warnings.push("New main commit within 20-minute deploy propagation window");
   }else report.issues.push("Published SHA differs from GitHub main SHA beyond propagation tolerance");
  }
 }catch(error){report.issues.push("GitHub main verification: "+error.message);}
 if(mainSha){
  try{
   const data=await (await request(REPO+"/commits/"+mainSha+"/status",fetchImpl)).json();
   const statuses=latestStates(Array.isArray(data.statuses)?data.statuses:[]);
   for(const context of STATUS_CONTEXTS){
    const status=statuses.get(context)||"missing";
    report.ci[context]=status;
    if(status!=="success")report.issues.push(context+": "+status);
   }
  }catch(error){report.issues.push("GitHub commit status verification: "+error.message);}
  try{
   const since=new Date(now.getTime()-7*86400000).toISOString();
   const url=REPO+"/commits?sha=main&since="+encodeURIComponent(since)+"&per_page=100";
   const commits=await (await request(url,fetchImpl)).json();
   if(!Array.isArray(commits))throw Error("Unexpected commit list");
   report.resourceSignals.publicMainCommitsLast7Days=commits.length;
   if(commits.length===100)report.warnings.push("At least 100 commits in last 7 days; review build usage in provider billing console");
  }catch(error){report.warnings.push("Public release-velocity estimate unavailable: "+error.message);}
 }
 report.result=report.issues.length?"failed":"passed";
 return report;
}

async function main(){
 let result;
 try{result=await inspect();}
 catch(error){result={kind:"public-readonly-web01-watch",result:"failed",issues:[error.message],checkedAt:new Date().toISOString()};}
 await mkdir("qa-artifacts",{recursive:true});
 await writeFile("qa-artifacts/ops-watch-report.json",JSON.stringify(result,null,2)+"\n");
 console.log("HPI public watch",result.result,JSON.stringify({
  publication:result.publication,checks:result.ci,failures:result.issues,warnings:result.warnings,
  costCoverage:"Only public commit-velocity proxy. Vercel/CircleCI/Neon billed charges need separately authorised access."
 }));
 if(result.result!=="passed")process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main();
