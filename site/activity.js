/* Untrusted public issue data is always inserted via textContent, not HTML.
 * The roadmap issue→initiative index is a dated public snapshot: links only,
 * never evidence that live GitHub issue closure = research approval.
 */
(function(){
 const status=document.getElementById("issue-status"),target=document.getElementById("issue-list");
 if(!status||!target)return;
 function text(tag,content,cls){
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  node.textContent=String(content);
  return node;
 }
 function sourceLinks(snapshot){
  const mapped=new Map();
  if(!snapshot||snapshot.sourceKind!=="versioned_public_editorial_snapshot"||!Array.isArray(snapshot.initiatives))return mapped;
  for(const item of snapshot.initiatives){
   if(!/^[A-Z][A-Z0-9.-]{1,30}$/.test(item.id||""))continue;
   const path="/initiatives/"+item.id.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
   if(Number.isSafeInteger(item.issue)&&item.issue>0)mapped.set(item.issue,path);
   if(!Array.isArray(item.epics))continue;
   for(const epic of item.epics){
    if(Number.isSafeInteger(epic.issue)&&epic.issue>0&&!mapped.has(epic.issue))mapped.set(epic.issue,path);
   }
  }
  return mapped;
 }
 function addIssue(issue,mapped){
  const item=text("article","","issue-row");
  item.id="issue-"+issue.number;
  const top=text("div","","issue-top");
  top.append(text("span","#"+issue.number));
  top.append(text("span",issue.state, "issue-state "+issue.state));
  const date=new Date(issue.updatedAt);
  top.append(text("time",Number.isNaN(date.valueOf())?"Date not verified":"Updated "+date.toLocaleDateString("en-GB")));
  const title=text("h2",issue.title);
  const actions=text("div","","issue-actions");
  const path=mapped.get(issue.number);
  if(path){
   const first=text("a","Read initiative on HPI ↗","issue-local");
   first.href=path;actions.append(first);
  }
  const discuss=text("a","Discuss or edit on GitHub (external) ↗","issue-discuss");
  discuss.href="https://github.com/saver1991/human-prosperity-initiative/issues/"+issue.number;
  discuss.target="_blank";discuss.rel="noopener noreferrer";
  actions.append(discuss);
  item.append(top,title,actions);target.append(item);
 }
 const issues=fetch("/api/issues",{method:"GET",cache:"default"})
  .then(response=>{if(!response.ok)throw new Error("feed unavailable");return response.json();});
 const roadmap=fetch("/public-roadmap.json",{method:"GET",cache:"default"})
  .then(response=>{if(!response.ok)throw new Error("projection unavailable");return response.json();})
  .catch(()=>null);
 Promise.all([issues,roadmap])
  .then(([data,snapshot])=>{
   if(!data||!Array.isArray(data.issues)||data.source!=="github_public_issues")throw Error("invalid feed");
   const mapped=sourceLinks(snapshot);
   target.replaceChildren();
   const open=data.issues.filter(x=>x.state==="open");
   const closed=data.issues.filter(x=>x.state==="closed");
   for(const issue of [...open,...closed])addIssue(issue,mapped);
   status.textContent=data.issues.length+" public issues shown"+
    (data.limitedToRecent?" (most recently updated 100 only)":"")+
    ". Live issue states come from GitHub with a short cache. Initiative links use a dated roadmap snapshot; no task status was modified.";
   const anchor=window.location.hash.slice(1);
   if(/^issue-[0-9]+$/.test(anchor))document.getElementById(anchor)?.scrollIntoView({block:"start"});
  }).catch(()=>{
   status.textContent="The current public issue list is temporarily unavailable. Research documents and roadmap remain accessible here.";
   const a=text("a","Read the roadmap on HPI ↗");
   a.href="/roadmap";target.append(a);
  });
})();
