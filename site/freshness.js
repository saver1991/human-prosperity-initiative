/* A browser-only, same-origin view. Untrusted data is inserted only via textContent. */
(function(){
 const status=document.getElementById("freshness-status");
 const note=document.getElementById("freshness-detail");
 const source=document.getElementById("freshness-source");
 const published=document.getElementById("freshness-published");
 const checked=document.getElementById("freshness-checked");
 if(!status||!note||!source||!published||!checked)return;
 const shortSha=value=>/^[0-9a-f]{40}$/.test(String(value))?value.slice(0,12):"not verified";
 const formatTime=value=>{
  const date=new Date(value);
  return Number.isNaN(date.getTime())?"not verified":date.toLocaleString("en-GB",{timeZone:"UTC",dateStyle:"medium",timeStyle:"short"})+" UTC";
 };
 fetch("/api/freshness",{method:"GET",cache:"default"})
  .then(async response=>{
   if(!response.ok)throw new Error("source unavailable");
   return response.json();
  }).then(data=>{
   if(!data||data.checkedLive!==true||!["current","revision_mismatch"].includes(data.status))throw new Error("invalid");
   status.textContent=data.status==="current"?"Current — published site matches GitHub":
    "Revision mismatch — publication needs checking";
   status.className="freshness-state "+(data.status==="current"?"is-current":"is-mismatch");
   note.textContent=String(data.note);
   source.textContent=shortSha(data.latestMainRevision);
   published.textContent=shortSha(data.publishedRevision);
   checked.textContent=formatTime(data.checkedAt);
  }).catch(()=>{
   status.textContent="Status unknown — verification unavailable";
   status.className="freshness-state is-unknown";
   note.textContent="Unable to compare the live site against the latest GitHub main revision. The last published pages remain available; their freshness is not confirmed.";
   source.textContent="not verified";
   published.textContent="not verified";
   checked.textContent="not verified";
  });
})();
