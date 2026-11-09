import {inspectPublicIssueFeed,reconcilePublicIssue} from "../site/progress-policy.js";
// Versioned public HPI progress contract. This module never performs network access,
// copies participant records, infers scientific impact or executes issue text.
// Public GitHub issue states remain authoritative; materialized content is a dated editorial snapshot.
const STATUS=new Set(["planned","in_progress","review","documented","complete","aspirational","long_term","unknown","blocked"]);
const LANES=new Set(["Now","Next","Later"]);
const KINDS=new Set(["research","platform"]);
const ISSUE=/^https:\/\/github\.com\/saver1991\/human-prosperity-initiative\/issues\/\d+$/;
const PROOF=/^https:\/\/github\.com\/saver1991\/human-prosperity-initiative\/pull\/\d+$/;
const FIRST_PARTY=/^\/(?:[a-z0-9-]+\/?)*$/;
const ID=/^[A-Z][A-Z0-9-]*(?:\.[0-9]+)*(?:-T[0-9]{2})?$/;
function fail(message){throw new Error("Public roadmap contract: "+message)}
function object(v,name){if(!v||Array.isArray(v)||typeof v!=="object")fail(name+" must be an object");return v;}
function only(v,allowed,name){
 for(const field of Object.keys(object(v,name)))if(!allowed.includes(field))fail(name+" contains disallowed field "+field);
}
function str(v,name,max=700){
 if(typeof v!=="string"||!v.trim()||v.length>max||/[\x00-\x08\x0e-\x1f]/.test(v))fail(name+" invalid public text");
 return v.trim();
}
function issueNumber(v,name){if(!Number.isSafeInteger(v)||v<1||v>10000000)fail(name+" invalid public issue number");return v;}
function docUrl(v,name){
 const url=str(v,name,240);
 if(!FIRST_PARTY.test(url)||url.startsWith("//")||url.includes("..")||url.includes("%"))fail(name+" requires a first-party HPI path");
 return url;
}
function issueUrl(v,name){
 const url=str(v,name,200);
 if(!ISSUE.test(url))fail(name+" requires a public HPI GitHub issue URL");
 return url;
}
function proofUrl(v,name){
 const url=str(v,name,200);
 if(!PROOF.test(url))fail(name+" requires a public reviewed HPI PR URL");
 return url;
}
function id(v,name){if(!ID.test(str(v,name,50)))fail(name+" has malformed ID");return v}
function date(v,name){
 const s=str(v,name,10);
 if(!/^\d{4}-\d\d-\d\d$/.test(s)||new Date(s+"T00:00:00Z").toISOString().slice(0,10)!==s)fail(name+" invalid UTC date");
 return s;
}
function status(v,name){if(!STATUS.has(v))fail(name+" unsupported status");return v}
function uniq(items,name){const set=new Set();for(const item of items){if(set.has(item))fail(name+" duplicate "+item);set.add(item)}}
function checkTask(t,name){
 only(t,["id","title","status","sourceIssue","evidence","assurance"],name);
 id(t.id,name+".id");str(t.title,name+".title",360);status(t.status,name+".status");
 if(t.sourceIssue!==undefined)issueUrl(t.sourceIssue,name+".sourceIssue");
 if(t.evidence!==undefined)proofUrl(t.evidence,name+".evidence");
 if(["documented","complete"].includes(t.status)&&!t.evidence)fail(name+" documented/complete task needs public acceptance evidence");
 if(t.assurance!==undefined){
  only(t.assurance,["independentReview","ratified","operational","fieldAuthorised"],name+".assurance");
  if(t.assurance.independentReview!=="not_verified"||
     t.assurance.ratified!==false||t.assurance.operational!==false||
     t.assurance.fieldAuthorised!==false)
   fail(name+" cannot claim independent ratification, operations or field authorisation without separately approved authority");
 }
 // A closed issue or merged PR never authorises a scientific validity claim.
}
function checkEpic(e,name){
 only(e,["id","title","status","issue","tasks"],name);
 id(e.id,name+".id");str(e.title,name+".title",240);status(e.status,name+".status");
 if(e.issue!==undefined)issueNumber(e.issue,name+".issue");
 if(!Array.isArray(e.tasks)||e.tasks.length>80)fail(name+" invalid tasks");
 e.tasks.forEach((t,i)=>checkTask(t,name+".tasks["+i+"]"));
 uniq(e.tasks.map(t=>t.id),name+".tasks");
 for(const t of e.tasks)if(!t.id.startsWith(e.id+"-T"))fail(name+" task ID must belong to epic");
}
export function buildPublicRoadmap(project,details,{revision="local-build"}={}){
 only(details,["schemaVersion","sourceKind","reviewedAt","statusAuthority","scienceBoundary","legalStatus","governanceAuthority","initiatives"],"snapshot");
 if(details.schemaVersion!=="1.0"||details.sourceKind!=="versioned_public_editorial_snapshot")fail("unsupported schema or data source");
 date(details.reviewedAt,"reviewedAt");
 for(const field of ["statusAuthority","scienceBoundary","governanceAuthority"])str(details[field],field,450);
 if(details.legalStatus!=="not_incorporated")fail("legal status cannot imply registered charity");
 if(!Array.isArray(details.initiatives)||!Array.isArray(project?.initiatives))fail("missing initiative lists");
 if(project.id!=="human-prosperity-initiative"||project.visibility!=="public"||project.legalEntityStatus!=="not_incorporated")fail("unrecognised HPI descriptor");
 const sourceIds=project.initiatives.map(x=>x.id);
 const detailIds=details.initiatives.map(x=>x.id);
 uniq(sourceIds,"project initiatives");uniq(detailIds,"public initiatives");
 if(sourceIds.length!==detailIds.length||sourceIds.some(x=>!detailIds.includes(x)))fail("public initiatives must match canonical project descriptor exactly");
 const byId=new Map(details.initiatives.map(x=>[x.id,x]));
 const result=project.initiatives.map((descriptor,i)=>{
  only(descriptor,["id","name","status","horizon","priority","issue","epics","measurementDraft","plannedTasks","implementationApproved","siteFeatureImplemented","deliveredEpics","pendingFounderApproval"],"project.initiatives["+i+"]");
  const item=byId.get(descriptor.id);
  only(item,["id","kind","summary","gate","deliverables","epics"],"initiatives."+descriptor.id);
  id(item.id,"initiative.id");str(descriptor.name,"initiative.name",240);
  if(!KINDS.has(item.kind))fail("unknown initiative type "+descriptor.id);
  status(descriptor.status,"initiative.status");if(!LANES.has(descriptor.horizon))fail("unsupported horizon "+descriptor.id);
  str(item.summary,"initiative.summary");str(item.gate,"initiative.gate",800);
  if(descriptor.issue!==undefined)issueNumber(descriptor.issue,"initiative.issue");
  if(!Array.isArray(item.deliverables)||item.deliverables.length>15)fail("invalid public deliverables");
  item.deliverables.forEach((d,j)=>{
   only(d,["label","url"],"deliverable");str(d.label,"deliverable.label",120);
   docUrl(d.url,"deliverable.url");
  });
  if(!Array.isArray(item.epics)||item.epics.length>20)fail("invalid epics");
  item.epics.forEach((e,j)=>checkEpic(e,item.id+".epic["+j+"]"));
  uniq(item.epics.map(e=>e.id),item.id+".epics");
  for(const e of item.epics)if(!e.id.startsWith(item.id+"."))fail("epic must be part of its initiative");
  if(Array.isArray(descriptor.epics)){
   const sourceEpicIds=descriptor.epics.map(e=>e.id);
   for(const key of sourceEpicIds)if(!item.epics.some(e=>e.id===key))fail("descriptor epic missing in public snapshot: "+key);
  }
  if(descriptor.deliveredEpics!==undefined||descriptor.pendingFounderApproval!==undefined){
   const done=descriptor.deliveredEpics||[],pending=descriptor.pendingFounderApproval||[];
   if(!Array.isArray(done)||!Array.isArray(pending))fail(item.id+" epic acceptance sets invalid");
   uniq([...done,...pending],item.id+" epic acceptance sets");
   const registered=new Map(item.epics.map(e=>[e.id,e]));
   for(const key of done){
    if(!registered.has(key)||registered.get(key).status!=="complete")fail("delivered epic needs completed source snapshot "+key);
   }
   for(const key of pending){
    if(!registered.has(key)||registered.get(key).status==="complete")fail("pending approval epic cannot be completed "+key);
   }
  }
  if(descriptor.plannedTasks!==undefined){
   const count=item.epics.reduce((n,e)=>n+e.tasks.length,0);
   if(descriptor.plannedTasks!==count)fail(item.id+" planned task count differs from descriptor");
  }
  return {
   id:item.id,name:descriptor.name,kind:item.kind,
   status:descriptor.status,horizon:descriptor.horizon,priority:descriptor.priority||"—",
   issue:descriptor.issue||null,summary:item.summary,gate:item.gate,
   deliverables:item.deliverables.map(d=>({label:d.label,url:d.url})),
   epics:item.epics.map(e=>({
    id:e.id,title:e.title,status:e.status,issue:e.issue||null,
    tasks:e.tasks.map(t=>({id:t.id,title:t.title,status:t.status,
     sourceIssue:t.sourceIssue||null,evidence:t.evidence||null,assurance:t.assurance||null}))
   }))
  };
 });
 uniq(result.flatMap(x=>x.epics.map(e=>e.id)),"all epic IDs");
 uniq(result.flatMap(x=>x.epics.flatMap(e=>e.tasks.map(t=>t.id))),"all task IDs");
 const rev=revision==="local-build"?"local-build":str(revision,"revision",40);
 if(rev!=="local-build"&&!/^[a-f0-9]{7,40}$/.test(rev))fail("invalid source revision");
 return {
  schemaVersion:details.schemaVersion,
  sourceKind:details.sourceKind,
  reviewedAt:details.reviewedAt,
  publishedRevision:rev,
  statusAuthority:details.statusAuthority,
  scienceBoundary:details.scienceBoundary,
  legalStatus:details.legalStatus,
  governanceAuthority:details.governanceAuthority,
  validatedHumanImpact:false,
  issueSync:"not_live",
  initiatives:result
 };
}
// Compatibility interface for original WEB-02.1 callers; source policy is centralised.
export function publicIssueSignal(feed,issue,now=new Date()){
 issueNumber(issue,"issue");
 const source=inspectPublicIssueFeed(feed,now);
 const state=reconcilePublicIssue(source,issue,"unknown");
 if(state.state==="open"||state.state==="closed")
  return {state:state.state,live:true,scientificApproval:false};
 return {state:["unavailable","stale"].includes(state.state)?state.state:"unknown",live:false};
}
