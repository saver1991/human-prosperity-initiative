/* Untrusted public issue data is always inserted via textContent, not HTML. */
(function(){
 const status=document.getElementById("issue-status"),target=document.getElementById("issue-list");
 if(!status||!target)return;
 function text(tag,content,cls){
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  node.textContent=String(content);
  return node;
 }
 function addIssue(issue){
  const item=text("article","","issue-row");
  item.id="issue-"+issue.number;
  const top=text("div","","issue-top");
  top.append(text("span","#"+issue.number));
  top.append(text("span",issue.state, "issue-state "+issue.state));
  const date=new Date(issue.updatedAt);
  top.append(text("time",Number.isNaN(date.valueOf())?"Date not verified":"Updated "+date.toLocaleDateString("en-GB")));
  const title=text("h2",issue.title);
  const action=text("a","Discuss or contribute on GitHub ↗");
  action.href="https://github.com/saver1991/human-prosperity-initiative/issues/"+issue.number;
  action.target="_blank";action.rel="noopener noreferrer";
  item.append(top,title,action);target.append(item);
 }
 fetch("/api/issues",{method:"GET",cache:"default"})
  .then(response=>{if(!response.ok)throw new Error("feed unavailable");return response.json()})
  .then(data=>{
   if(!data||!Array.isArray(data.issues)||data.source!=="github_public_issues")throw Error("invalid feed");
   target.replaceChildren();
   const open=data.issues.filter(x=>x.state==="open");
   const closed=data.issues.filter(x=>x.state==="closed");
   for(const issue of [...open,...closed])addIssue(issue);
   status.textContent=data.issues.length+" public issues shown"+
    (data.limitedToRecent?" (most recently updated 100 only)":"")+
    ". Statuses update from GitHub with a short cache. No project tasks were modified.";
   const anchor=window.location.hash.slice(1);
   if(/^issue-[0-9]+$/.test(anchor))document.getElementById(anchor)?.scrollIntoView({block:"start"});
  }).catch(()=>{
   status.textContent="The current public issue list is temporarily unavailable. The research documents and roadmap remain accessible here.";
   const a=text("a","Open the issue tracker on GitHub ↗");
   a.href="https://github.com/saver1991/human-prosperity-initiative/issues";
   a.target="_blank";a.rel="noopener noreferrer";target.append(a);
  });
})();
