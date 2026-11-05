/** No secrets and no GitHub write permissions. Vercel's cache bounds anonymous API usage. */
const PUBLIC_ISSUES="https://api.github.com/repos/saver1991/human-prosperity-initiative/issues?state=all&sort=updated&direction=desc&per_page=100";
export async function getPublicIssueFeed(fetcher=fetch){
 const response=await fetcher(PUBLIC_ISSUES,{method:"GET",redirect:"error",headers:{
  accept:"application/vnd.github+json","x-github-api-version":"2022-11-28",
  "user-agent":"HPI-Public-Website/1.0"
 },signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw new Error("Public issue feed unavailable: "+response.status);
 const data=await response.json();
 if(!Array.isArray(data)||data.length>100)throw new Error("Unexpected issues payload");
 const issues=data.filter(v=>v&&typeof v==="object"&&!v.pull_request).map(row=>{
  if(!Number.isInteger(row.number)||row.number<1||
     typeof row.title!=="string"||typeof row.updated_at!=="string"||
     !["open","closed"].includes(row.state))throw new Error("Invalid issue record");
  return {number:row.number,title:row.title.slice(0,200),state:row.state,
   updatedAt:row.updated_at};
 });
 return {source:"github_public_issues",fetchedAt:new Date().toISOString(),limitedToRecent:data.length===100,
  issues};
}
export default async function handler(req,res){
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({error:"method_not_allowed"})}
 try{
  const data=await getPublicIssueFeed();
  res.setHeader("Cache-Control","public, s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json(data);
 }catch{
  res.setHeader("Cache-Control","no-store");
  return res.status(503).json({error:"public_issues_temporarily_unavailable"});
 }
}
