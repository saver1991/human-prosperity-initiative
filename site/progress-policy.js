/* HPI WEB-02.4: safe, read-only reconciliation of GitHub issue metadata.
 * It NEVER promotes a scientific draft, accepts a PR, or writes task status.
 * The feed originates from HPI's own /api/issues, restricted to public metadata.
 */
export const ISSUE_FEED_MAX_AGE_MS=15*60*1000;
export const PUBLIC_ISSUE_SOURCE="github_public_issues";
const MAX_ISSUE=10000000;
const ISSUE_STATES=new Set(["open","closed"]);
const TECHNICAL_STATES=new Set(["complete","documented"]);

function bad(reason){
 return {state:"unavailable",reason,checkedAt:null,ageMinutes:null,partial:false,records:[]};
}
export function inspectPublicIssueFeed(feed,now=new Date()){
 if(!feed||typeof feed!=="object"||Array.isArray(feed)||feed.source!==PUBLIC_ISSUE_SOURCE)
  return bad("The public GitHub issue source is unavailable or unverified.");
 if(typeof feed.fetchedAt!=="string"||!Number.isFinite(Date.parse(feed.fetchedAt)))
  return bad("The public issue fetch time cannot be verified.");
 const nowMs=now instanceof Date?now.getTime():NaN;
 const age=nowMs-Date.parse(feed.fetchedAt);
 if(!Number.isFinite(age)||age<0||age>ISSUE_FEED_MAX_AGE_MS)
  return {state:"stale",reason:"The issue feed has not been verified recently.",
   checkedAt:feed.fetchedAt,ageMinutes:Number.isFinite(age)?Math.max(0,Math.floor(age/60000)):null,
   partial:feed.limitedToRecent===true,records:[]};
 if(!Array.isArray(feed.issues)||feed.issues.length>100||
    typeof feed.limitedToRecent!=="boolean")return bad("The public issue feed is malformed.");
 const seen=new Set(),records=[];
 for(const row of feed.issues){
  if(!row||typeof row!=="object"||Array.isArray(row)||
     !Number.isSafeInteger(row.number)||row.number<1||row.number>MAX_ISSUE||
     !ISSUE_STATES.has(row.state)||typeof row.title!=="string"||
     typeof row.updatedAt!=="string"||!Number.isFinite(Date.parse(row.updatedAt))||
     seen.has(row.number))return bad("The public issue feed has conflicting or invalid records.");
  seen.add(row.number);
  records.push({number:row.number,state:row.state,updatedAt:row.updatedAt});
 }
 return {state:"current",reason:"Read-only GitHub issue metadata verified through the public HPI endpoint.",
  checkedAt:feed.fetchedAt,ageMinutes:Math.floor(age/60000),
  partial:feed.limitedToRecent,records};
}
export function reconcilePublicIssue(source,issueNumber,editorialStatus){
 if(!Number.isSafeInteger(issueNumber)||issueNumber<1)return {state:"not_tracked",disagreement:false};
 if(source?.state!=="current")return {state:source?.state==="stale"?"stale":"unavailable",disagreement:false};
 const row=source.records.find(x=>x.number===issueNumber);
 if(!row)return {state:source.partial?"not_in_recent_feed":"not_found",disagreement:false};
 const disagreement=row.state==="closed"&&
  ["planned","review","in_progress","blocked"].includes(editorialStatus);
 return {state:row.state,updatedAt:row.updatedAt,disagreement,
  independentlyApproved:false,humanImpactVerified:false};
}
export function acceptedTechnicalTasks(initiative){
 let total=0,accepted=0,evidenceMissing=0;
 for(const epic of initiative?.epics||[]){
  for(const task of epic.tasks||[]){
   total++;
   if(TECHNICAL_STATES.has(task.status)){
    if(typeof task.evidence==="string"&&
       /^https:\/\/github\.com\/saver1991\/human-prosperity-initiative\/pull\/[1-9]\d*$/.test(task.evidence))
       accepted++;
    else evidenceMissing++;
   }
  }
 }
 return {total,accepted,evidenceMissing,impactVerified:false,
  interpretation:"Technical tasks with repository PR evidence, not validated research or beneficiary outcomes."};
}
