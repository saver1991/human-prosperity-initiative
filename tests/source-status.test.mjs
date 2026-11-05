import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {checkSourceParity} from "../api/source-status.js";
const HEAD="a".repeat(40),PUBLISHED="b".repeat(40);
function mock(head,published){
 return async(url,options)=>{
  assert.equal(options.method,"GET");assert.equal(options.redirect,"error");
  assert.equal(options.headers.Authorization,undefined);
  return Response.json(String(url).endsWith("/commits/main")?{sha:head}:
   {status:"published_from_git",revision:published,generatedAt:"2026-11-05T18:00:00.000Z"});
 };
}
test("source parity requires exact SHA agreement",async()=>{
 assert.equal((await checkSourceParity(mock(HEAD,HEAD))).status,"current");
 const lag=await checkSourceParity(mock(HEAD,PUBLISHED));
 assert.equal(lag.status,"awaiting_publication");
 assert.equal(lag.githubRevision,HEAD);
 assert.equal(lag.publishedRevision,PUBLISHED);
});
test("invalid metadata or upstream failure never claims current",async()=>{
 await assert.rejects(()=>checkSourceParity(mock("wrong",PUBLISHED)),/Unverifiable/);
 await assert.rejects(()=>checkSourceParity(mock(HEAD,"invalid")),/Unverifiable/);
 await assert.rejects(()=>checkSourceParity(async()=>new Response("rate limited",{status:429})),/not available/);
});
test("publication-status UI is on-site and text-only",async()=>{
 const page=await readFile("dist/status.html","utf8");
 assert.match(page,/id="source-status"/);
 assert.match(page,/id="status-details"/);
 assert.match(page,/\/status.js/);
 const js=await readFile("dist/status.js","utf8");
 assert.match(js,/textContent/);
 assert.doesNotMatch(js,/innerHTML|document\.write|Authorization/);
});
