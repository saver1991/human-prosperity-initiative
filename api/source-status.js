// Public read-only check against the canonical GitHub main and production publication stamp.
const HEAD="https://api.github.com/repos/saver1991/human-prosperity-initiative/commits/main";
const STAMP="https://human-prosperity-initiative.vercel.app/publication.json";
const SHA=/^[a-f0-9]{40}$/;
export async function checkSourceParity(fetcher=fetch){
 const options={method:"GET",redirect:"error",signal:AbortSignal.timeout(8000),
  headers:{"user-agent":"HPI-Publication-Status/1.0",accept:"application/json"}};
 const [headResponse,stampResponse]=await Promise.all([fetcher(HEAD,options),fetcher(STAMP,options)]);
 if(!headResponse.ok||!stampResponse.ok)throw Error("Public source not available");
 const [head,stamp]=await Promise.all([headResponse.json(),stampResponse.json()]);
 if(!SHA.test(head?.sha||"")||!SHA.test(stamp?.revision||"")||
    stamp.status!=="published_from_git"||!Number.isFinite(Date.parse(stamp.generatedAt)))
  throw Error("Unverifiable version metadata");
 return {status:head.sha===stamp.revision?"current":"awaiting_publication",
  githubRevision:head.sha,publishedRevision:stamp.revision,
  publishedAt:stamp.generatedAt,checkedAt:new Date().toISOString()};
}
export default async function handler(req,res){
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({error:"method_not_allowed"})}
 try{
  const status=await checkSourceParity();
  res.setHeader("Cache-Control","public, s-maxage=300");
  return res.status(200).json(status);
 }catch{
  res.setHeader("Cache-Control","no-store");
  return res.status(503).json({status:"unverified",error:"source_parity_unavailable"});
 }
}
