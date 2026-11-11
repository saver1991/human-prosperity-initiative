/** Public, read-only publication freshness verification.
 * Compares the currently served production snapshot with public GitHub main.
 * No token, database, private account access, or background polling.
 */
const SOURCE_URL="https://api.github.com/repos/svtmzt/human-prosperity-initiative/commits/main";
const PRODUCTION_URL="https://human-prosperity-initiative.vercel.app/publication.json";
const sha40=/^[0-9a-f]{40}$/;

export async function getPublicationFreshness(fetcher=fetch,clock=()=>new Date()){
 const options={
  method:"GET",redirect:"error",
  headers:{accept:"application/json","user-agent":"HPI-Publication-Freshness/1.0"},
  signal:AbortSignal.timeout(8000)
 };
 const [publicResponse,githubResponse]=await Promise.all([
  fetcher(PRODUCTION_URL,options),
  fetcher(SOURCE_URL,{...options,headers:{...options.headers,
   accept:"application/vnd.github+json","x-github-api-version":"2022-11-28"}})
 ]);
 if(!publicResponse.ok||!githubResponse.ok)throw new Error("One public source is unavailable");
 const [publication,github]=await Promise.all([publicResponse.json(),githubResponse.json()]);
 if(!publication||publication.status!=="published_from_git"||
    !sha40.test(String(publication.revision))||
    !Number.isInteger(publication.sourceFileCount)||publication.sourceFileCount<1||
    !Number.isInteger(publication.routeCount)||publication.routeCount<1||
    !Number.isFinite(Date.parse(publication.generatedAt))||
    !github||!sha40.test(String(github.sha)))throw new Error("Unexpected publication provenance");
 const observedAt=clock().toISOString();
 if(!Number.isFinite(Date.parse(observedAt)))throw new Error("Clock unavailable");
 const match=publication.revision===github.sha;
 return {
  source:"public_hpi_github_main_and_production",
  status:match?"current":"revision_mismatch",
  publishedRevision:publication.revision,
  latestMainRevision:github.sha,
  publishedAt:publication.generatedAt,
  checkedAt:observedAt,
  sourceFileCount:publication.sourceFileCount,
  routeCount:publication.routeCount,
  note:match?"The public website build matches the current GitHub main revision.":
   "The current public build differs from GitHub main. A build or release may be pending or blocked. No loss of content is inferred.",
  checkedLive:true
 };
}
export default async function handler(req,res){
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="GET"){
  res.setHeader("Allow","GET");
  return res.status(405).json({error:"method_not_allowed"});
 }
 try{
  const result=await getPublicationFreshness();
  res.setHeader("Cache-Control","public, s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json(result);
 }catch{
  res.setHeader("Cache-Control","no-store");
  return res.status(503).json({status:"unknown",checkedLive:false,
   note:"Publication freshness could not be verified. No inference about publication status is possible."});
 }
}
