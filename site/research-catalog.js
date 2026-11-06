/* Accessible local filtering of already published, source-reviewed metadata.
 * No API calls, cookies, analytics, or research participant data.
 */
(()=>{
 const form=document.querySelector("form.source-search");
 form?.addEventListener("submit",event=>event.preventDefault());
 const input=document.querySelector("#source-filter");
 const type=document.querySelector("#source-kind");
 const status=document.querySelector("#source-count");
 const rows=[...document.querySelectorAll("[data-source-record]")];
 if(!input||!type||!status)return;
 const filter=()=>{
  const query=input.value.trim().toLocaleLowerCase("en").slice(0,120),kind=type.value;
  let visible=0;
  for(const row of rows){
   const match=(kind==="all"||row.dataset.sourceKind===kind)&&
    (!query||(row.dataset.sourceSearch||"").toLocaleLowerCase("en").includes(query));
   row.hidden=!match;if(match)visible++;
  }
  status.textContent=visible+" of "+rows.length+" public metadata records shown (not research validation)";
 };
 input.addEventListener("input",filter);type.addEventListener("change",filter);filter();
})();