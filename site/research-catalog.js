/* RT-02.3: local, accessible filtering of safe public source metadata.
 * Never fetches datasets, stores searches, sends analytics or infers rights.
 */
(()=>{
 const form=document.querySelector("form.source-search");
 form?.addEventListener("submit",event=>event.preventDefault());
 const text=document.querySelector("#source-filter");
 const kind=document.querySelector("#source-kind");
 const count=document.querySelector("#source-count");
 const empty=document.querySelector("#source-no-results");
 const fields=[["source-geography","sourceGeography"],["source-year","sourceYear"],
  ["source-rights","sourceRights"],["source-review","sourceReview"],
  ["source-family","sourceFamily"]].map(([id,data])=>({input:document.getElementById(id),data}));
 const rows=[...document.querySelectorAll("[data-source-record]")];
 if(!text||!kind||!count)return;
 function filter(){
  const q=text.value.trim().toLocaleLowerCase("en").slice(0,120);
  let shown=0;
  for(const row of rows){
   const matchingKind=kind.value==="all"||row.dataset.sourceKind===kind.value;
   const matchingText=!q||(row.dataset.sourceSearch||"").toLocaleLowerCase("en").includes(q);
   const matchingFacet=fields.every(({input,data})=>!input||input.value==="all"||row.dataset[data]===input.value);
   row.hidden=!(matchingKind&&matchingText&&matchingFacet);
   if(!row.hidden)shown++;
  }
  count.textContent=shown+" of "+rows.length+" public metadata records shown (not research validation)";
  if(empty)empty.hidden=shown!==0;
 }
 text.addEventListener("input",filter);
 kind.addEventListener("change",filter);
 for(const {input} of fields)input?.addEventListener("change",filter);
 filter();
})();
