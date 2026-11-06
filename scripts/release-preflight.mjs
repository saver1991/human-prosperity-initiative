/**
 * WEB-01 post-merge release preflight, NEVER a deployment or promotion tool.
 * It fails closed unless exact merged SHA checks and the candidate's publication
 * manifest agree. Promotion still requires an independently configured Vercel
 * Deployment Check or human-authorised staged-release operator.
 */
import {pathToFileURL} from "node:url";
const SHA=/^[0-9a-f]{40}$/;
const DEFAULT_REPO="https://api.github.com/repos/saver1991/human-prosperity-initiative";
export const REQUIRED_CONTEXTS=[
  "ci/circleci: website-quality",
  "ci/circleci: browser-accessibility",
  "Vercel"
];
export function validateCandidateUrl(raw){
  const url=new URL(raw);
  if(url.protocol!=="https:"||url.username||url.password||url.search||url.hash||
     (url.pathname!=="/"&&url.pathname!=="")||
     !(url.hostname==="human-prosperity-initiative.vercel.app"||
       url.hostname.endsWith(".vercel.app")))
    throw new Error("Candidate must be an HTTPS Vercel deployment origin");
  return url.origin;
}
export function currentCommitStatuses(statuses){
  const seen=new Map();
  // GitHub combined-status API returns newest first. Do not let a later
  // stale/older success overwrite the most recent pending/failure.
  for(const entry of statuses)if(!seen.has(entry.context))
    seen.set(entry.context,entry.state);
  return seen;
}
export async function inspectRelease({sha,candidateOrigin,fetchImpl=fetch,repo=DEFAULT_REPO}){
  const summary={
    requestedSha:sha,verifiedSha:null,origin:null,
    statuses:{},manifestRevision:null,readyForHumanPromotion:false,
    reasons:[],scope:"preflight_only_no_promotion"
  };
  if(!SHA.test(String(sha))){summary.reasons.push("Invalid exact Git SHA");return summary}
  try{summary.origin=validateCandidateUrl(candidateOrigin)}
  catch{summary.reasons.push("Candidate origin is not a verified deployment hostname");return summary}
  const readJson=async url=>{
    const response=await fetchImpl(url,{method:"GET",redirect:"error",
      headers:{"Accept":"application/json","User-Agent":"HPI-Release-Preflight"},
      signal:AbortSignal.timeout(12000)});
    if(response.status!==200)throw Error("HTTP "+response.status);
    return response.json();
  };
  try{
    const result=await readJson(repo+"/commits/"+sha+"/status");
    if(result.sha!==sha)throw Error("Combined status SHA mismatch");
    summary.verifiedSha=result.sha;
    const states=currentCommitStatuses(Array.isArray(result.statuses)?result.statuses:[]);
    for(const context of REQUIRED_CONTEXTS){
      const state=states.get(context)||"missing";
      summary.statuses[context]=state;
      if(state!=="success")summary.reasons.push(context+": "+state);
    }
  }catch(e){summary.reasons.push("Cannot verify GitHub statuses: "+e.message)}
  try{
    const candidate=await readJson(summary.origin+"/publication.json");
    summary.manifestRevision=candidate.revision||null;
    if(candidate.revision!==sha)summary.reasons.push("Candidate manifest does not match merged SHA");
  }catch(e){summary.reasons.push("Cannot verify candidate publication: "+e.message)}
  summary.readyForHumanPromotion=summary.reasons.length===0;
  return summary;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const [sha,origin]=process.argv.slice(2);
  const result=await inspectRelease({sha,candidateOrigin:origin});
  console.log(JSON.stringify(result,null,2));
  if(!result.readyForHumanPromotion)process.exitCode=1;
}
