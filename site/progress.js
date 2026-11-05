/* Public issue metadata overlay. All values come from own-origin GET /api/issues.
 * Never mutate editorial work states; never present closed issues as science approval.
 */
import {inspectPublicIssueFeed,reconcilePublicIssue} from "/progress-policy.js";
const elements=[...document.querySelectorAll("[data-public-issue]")];
const health=document.querySelector("[data-feed-health]");
const checked=document.querySelector("[data-feed-fetched]");
const note=document.querySelector("[data-feed-disclaimer]");
function setText(element,value){if(element)element.textContent=value}
function applyState(source){
 if(source.state==="current"){
  const qualifier=source.partial?" (the most recent 100 GitHub records only)":"";
  setText(health,"Public issue feed available"+qualifier);
  const time=new Date(source.checkedAt);
  setText(checked,Number.isFinite(time.getTime())?
   "GitHub issue data checked "+time.toLocaleString("en-GB",{timeZone:"UTC",dateStyle:"medium",timeStyle:"short"})+" UTC":
   "Issue fetch time not verified");
  setText(note,"Closed issues are workflow events, not independent research, ethics or impact approval.");
 }else{
  setText(health,source.state==="stale"?"Public issue feed stale":"Public issue feed unavailable");
  setText(checked,"No current issue state can be verified; showing the dated published roadmap.");
  setText(note,source.reason||"The public issue source could not be verified.");
 }
 for(const element of elements){
  const number=Number(element.dataset.publicIssue);
  const editorial=element.dataset.editorialStatus||"unknown";
  const signal=reconcilePublicIssue(source,number,editorial);
  const label="#"+number+": ";
  if(signal.state==="open"||signal.state==="closed"){
   setText(element,label+"GitHub issue "+signal.state+
    (signal.disagreement?" · editorial status differs; review needed":"")+
    (signal.state==="closed"?" · not an independent science approval":""));
  }else if(signal.state==="not_in_recent_feed"){
   setText(element,label+"not among the latest 100 issue records · status unverified");
  }else if(signal.state==="not_found"){
   setText(element,label+"issue not found in public feed · status unverified");
  }else{
   setText(element,label+"issue state not verified ("+signal.state.replaceAll("_"," ")+")");
  }
  element.dataset.issueSignal=signal.state;
  element.dataset.issueDrift=String(Boolean(signal.disagreement));
 }
}
if(elements.length||health){
 try{
  const response=await fetch("/api/issues",{method:"GET",credentials:"omit",redirect:"error",cache:"default"});
  if(!response.ok)throw new Error("public issue source returned HTTP "+response.status);
  const data=await response.json();
  applyState(inspectPublicIssueFeed(data));
 }catch{
  applyState(inspectPublicIssueFeed(null));
 }
}
