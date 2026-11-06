import test from "node:test";
import assert from "node:assert/strict";
import {inspect,latestStates,BASE,REPO} from "../scripts/ops-watch.mjs";

const SHA="a".repeat(40);
const OLD_SHA="b".repeat(40);
const NOW=new Date("2026-11-05T19:00:00Z");
function fixture({published=SHA,status="success",generatedAt="2026-11-05T18:00:00Z",mainCommittedAt=null,missingRoute=null}={}){
 return async url=>{
  const path=new URL(url).pathname;
  if(missingRoute&&path===missingRoute)return new Response("Not found",{status:404});
  if(url.startsWith(BASE)){
   if(path==="/publication.json")return new Response(JSON.stringify({revision:published,generatedAt}),{status:200});
   return new Response("<!doctype html><main id=\"main\"><h1>HPI</h1></main>",{status:200});
  }
  if(path.endsWith("/commits/main"))
   return new Response(JSON.stringify({sha:SHA,commit:{committer:{date:mainCommittedAt||generatedAt}}}),{status:200});
  if(path.endsWith("/commits/"+SHA+"/status"))
   return new Response(JSON.stringify({statuses:[
    {context:"ci/circleci: website-quality",state:"success"},
    {context:"ci/circleci: browser-accessibility",state:status},
    {context:"Vercel",state:"success"}
   ]}),{status:200});
  if(url.startsWith(REPO+"/commits?"))
   return new Response(JSON.stringify([{sha:SHA}]),{status:200});
  return new Response("Unexpected request",{status:404});
 };
}
test("latest status wins if GitHub returns historical pending entries",()=>{
 const data=latestStates([
  {context:"ci/circleci: website-quality",state:"success"},
  {context:"ci/circleci: website-quality",state:"pending"}
 ]);
 assert.equal(data.get("ci/circleci: website-quality"),"success");
});
test("daily public probe validates website, provenance, CI and estimates public commit velocity",async()=>{
 const report=await inspect({fetchImpl:fixture(),now:NOW});
 assert.equal(report.result,"passed");
 assert.equal(report.routes.length,9);
 assert.ok(report.routes.some(x=>x.path==="/initiatives/web-02"));
 assert.ok(report.routes.some(x=>x.path==="/initiatives/f0-03-1"));
 assert.equal(report.ci["ci/circleci: browser-accessibility"],"success");
 assert.equal(report.resourceSignals.publicMainCommitsLast7Days,1);
 assert.equal(report.resourceSignals.providerBilledCost,null);
 assert.equal(report.issues.length,0);
});
test("stale publication SHA is a real failed health check",async()=>{
 const report=await inspect({fetchImpl:fixture({published:OLD_SHA}),now:NOW});
 assert.equal(report.result,"failed");
 assert.ok(report.issues.some(x=>x.includes("Published SHA differs")));
});
test("new commit within propagation window is warning only",async()=>{
 const report=await inspect({fetchImpl:fixture({published:OLD_SHA,generatedAt:"2026-11-05T18:55:00Z"}),now:NOW});
 assert.equal(report.result,"passed");
 assert.ok(report.warnings.some(x=>x.includes("propagation")));
});
test("a required browser job failure is a failed health check",async()=>{
 const report=await inspect({fetchImpl:fixture({status:"failure"}),now:NOW});
 assert.equal(report.result,"failed");
 assert.ok(report.issues.some(x=>x.includes("browser-accessibility")));
});
test("broken public routes fail rather than silently reporting healthy",async()=>{
 const report=await inspect({fetchImpl:fixture({missingRoute:"/research"}),now:NOW});
 assert.equal(report.result,"failed");
 assert.ok(report.issues.some(x=>x.includes("/research")));
});

test("fresh pending CircleCI on the just-merged SHA is a warning, not an outage",async()=>{
 const report=await inspect({fetchImpl:fixture({status:"pending",mainCommittedAt:"2026-11-05T18:55:00Z"}),now:NOW});
 assert.equal(report.result,"passed");
 assert.ok(report.warnings.some(x=>x.includes("CI grace window")));
});
test("CircleCI still pending beyond propagation window must fail",async()=>{
 const report=await inspect({fetchImpl:fixture({status:"pending",mainCommittedAt:"2026-11-05T18:00:00Z"}),now:NOW});
 assert.equal(report.result,"failed");
 assert.ok(report.issues.some(x=>x.includes("browser-accessibility")));
});
test("recent GitHub change permits temporary publication lag even if published build is older",async()=>{
 const report=await inspect({fetchImpl:fixture({published:OLD_SHA,generatedAt:"2026-11-01T00:00:00Z",mainCommittedAt:"2026-11-05T18:55:00Z"}),now:NOW});
 assert.equal(report.result,"passed");
 assert.ok(report.warnings.some(x=>x.includes("deploy propagation")));
});
