// Display verified public metadata; no tokens, HTML insertion, or write actions.
(function(){
 const status=document.getElementById("source-status");
 const details=document.getElementById("status-details");
 if(!status||!details)return;
 fetch("/api/source-status",{method:"GET"}).then(r=>{
  if(!r.ok)throw Error("Not verified");return r.json();
 }).then(data=>{
  if(!["current","awaiting_publication"].includes(data.status)||
     !/^[0-9a-f]{40}$/.test(data.githubRevision||"")||
     !/^[0-9a-f]{40}$/.test(data.publishedRevision||""))throw Error("Not verified");
  status.textContent=data.status==="current"?
   "The website and public GitHub main currently have the same published revision.":
   "A newer repository revision has not yet been confirmed on the public site. The last published site remains available.";
  details.replaceChildren();
  for(const [name,value] of [
   ["GitHub main",data.githubRevision.slice(0,12)],
   ["Published site",data.publishedRevision.slice(0,12)],
   ["Published (UTC)",new Date(data.publishedAt).toUTCString()],
   ["Checked (UTC)",new Date(data.checkedAt).toUTCString()]
  ]){
   const item=document.createElement("div");
   const term=document.createElement("dt"),description=document.createElement("dd");
   term.textContent=name;description.textContent=value;
   item.append(term,description);details.append(item);
  }
 }).catch(()=>{
  status.textContent="Source comparison is temporarily unavailable; this does not prove the website is up to date.";
  details.replaceChildren();
 });
})();
