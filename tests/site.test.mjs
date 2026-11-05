import test from "node:test";
import assert from "node:assert/strict";
import {readFile,stat,readdir} from "node:fs/promises";
import {resolveLink,routeForSource,buildRouteIndex,renderMarkdown,renderCsv,parseCsv} from "../scripts/site-content.mjs";
import {getPublicIssueFeed} from "../api/issues.js";

const read=path=>readFile(path,"utf8");
async function pages(dir="dist"){
 let paths=[];
 for(const item of await readdir(dir,{withFileTypes:true})){
  const name=dir+"/"+item.name;
  if(item.isDirectory())paths.push(...await pages(name));
  else if(item.isFile()&&name.endsWith(".html"))paths.push(name);
 }
 return paths;
}
test("homepage provides internal first-party navigation and source-derived data",async()=>{
 const home=await read("dist/index.html");
 assert.match(home,/<html lang="en">/);
 assert.match(home,/rel="canonical" href="https:\/\/human-prosperity-initiative.vercel.app\/"/);
 assert.match(home,/<main id="main">/);
 assert.match(home,/<nav aria-label="Main navigation">/);
 assert.match(home,/<a class="skip"/);
 assert.equal((home.match(/<h1\b/g)||[]).length,1);
 for(const id of ["mission","research","roadmap","participate","updates"])assert.ok(home.includes('id="'+id+'"'));
 for(const route of ["/mission","/research","/roadmap","/contribute","/governance","/library","/activity"])
  assert.ok(home.includes('href="'+route+'"'),"Missing internal link "+route);
 assert.doesNotMatch(home,/github\.com\/saver1991\/human-prosperity-initiative\/blob\/main\//);
 assert.doesNotMatch(home,/\{\{HPI_/);
 assert.match(home,/not yet a systematic review/i);
 assert.match(home,/not yet a registered foundation/i);
 assert.doesNotMatch(home,/<form|google-analytics|googletagmanager|facebook\.com\/tr/i);
});
test("every canonical route exists and sitemap covers dynamically published documents",async()=>{
 const doc=JSON.parse(await read("dist/publication.json"));
 assert.equal(doc.status,"published_from_git");
 assert.ok(doc.sourceFileCount>=15);
 assert.ok(doc.routeCount>doc.sourceFileCount);
 for(const source of doc.sourcePaths){
  const route=routeForSource(source);
  assert.ok(route,"Missing doc route "+source);
  await stat("dist"+route+".html");
 }
 for(const route of ["/mission","/mission/it","/roadmap","/governance","/research",
   "/research/evidence-ledger","/research/f0-02-opportunity-assessment",
   "/contribute","/library","/activity"])await stat("dist"+route+".html");
 const map=await read("dist/sitemap.xml");
 assert.match(map,/<urlset/);assert.match(map,/\/research\/evidence-ledger/);
 assert.match(map,/\/roadmap/);assert.match(map,/\/activity/);
 const robots=await read("dist/robots.txt");
 assert.match(robots,/Sitemap: https:\/\/human-prosperity-initiative\.vercel\.app\/sitemap\.xml/);
});
test("on-site document body is built directly from authoritative source",async()=>{
 const src=await read("docs/roadmap.md");
 const html=await read("dist/roadmap.html");
 assert.match(src,/Continuity from original roadmap V0\.1/);
 assert.match(html,/Continuity from original roadmap V0\.1/);
 assert.match(html,/F0-02/);
 assert.match(html,/href="\/research\/f0-02-opportunity-assessment"/);
 const research=await read("dist/research.html");
 const listed=(await readdir("research")).filter(x=>/\.(md|csv)$/.test(x));
 for(const name of listed)assert.ok(research.includes(routeForSource("research/"+name)));
});
test("all internal links resolve to generated local pages, including cross-document links",async()=>{
 for(const file of await pages()){
  const html=await read(file);
  const hrefs=[...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(m=>m[1]);
  for(const href of hrefs){
   if(!href.startsWith("/")||href.startsWith("//"))continue;
   const route=href.split(/[?#]/)[0];
   const page=route==="/"? "dist/index.html":"dist"+route+".html";
   await assert.doesNotReject(()=>stat(page),"Broken internal link "+href+" on "+file);
  }
 }
});
test("adding any new markdown or CSV file automatically creates an on-site route",()=>{
 const paths=["docs/review/new-statement.md","research/new-evidence-map.md",
  "research/sources-2027.csv","docs/charter.en.md"];
 const mapping=buildRouteIndex(paths);
 assert.equal(mapping.get(paths[0]),"/library/docs/review/new-statement");
 assert.equal(mapping.get(paths[1]),"/research/new-evidence-map");
 assert.equal(mapping.get(paths[2]),"/research/sources-2027");
 assert.equal(mapping.get(paths[3]),"/mission");
 assert.throws(()=>buildRouteIndex(["docs/My File.md","docs/my-file.md"]),/Route collision/);
});
test("renderer sends repository file references to internal pages, not GitHub",()=>{
 const routes=buildRouteIndex(["docs/roadmap.md","docs/charter.en.md","research/evidence-ledger.csv"]);
 const md="# Example\n\n[Roadmap](roadmap.md) and [Evidence](../research/evidence-ledger.csv). "+
  "[Charter](https://github.com/saver1991/human-prosperity-initiative/blob/main/docs/charter.en.md)\n\n"+
  "<script>alert(1)</script>";
 const html=renderMarkdown(md,"docs/example.md",routes);
 assert.match(html,/href="\/roadmap"/);
 assert.match(html,/href="\/research\/evidence-ledger"/);
 assert.match(html,/href="\/mission"/);
 assert.doesNotMatch(html,/<script>/);
 assert.match(html,/&lt;script&gt;/);
 const outside=renderMarkdown("[Read official study](https://doi.org/10.1126/science.1260799)",
  "docs/example.md",routes);
 assert.match(outside,/target="_blank" rel="noopener noreferrer"/);
});
test("CSV tables escape untrusted values and reject malformed source",()=>{
 const csv='id,title,url\n"E01","<img src=x onerror=alert(1)>","https://example.org"\n';
 const html=renderCsv(csv);
 assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img/);
 assert.match(html,/External source/);
 assert.equal(parseCsv(csv).length,2);
 assert.throws(()=>parseCsv('a,b\n"x","y","z"\n'),/Irregular CSV/);
});
test("live issue feed is narrowly scoped and never exposes issue body",async()=>{
 const feed=await getPublicIssueFeed(async (url,options)=>{
  assert.match(url,/api.github.com\/repos\/saver1991\/human-prosperity-initiative\/issues/);
  assert.equal(options.method,"GET");
  assert.equal(options.redirect,"error");
  assert.equal(options.headers.authorization,undefined);
  return Response.json([
   {number:11,title:"Draft reviewed",state:"open",updated_at:"2026-11-05T11:00:00Z",
    body:"Sensitive synthetic text that must not be reflected"},
   {number:12,title:"PR not an issue",state:"open",updated_at:"2026-11-05T11:00:00Z",
    pull_request:{url:"https://api.github.com/example"}}
  ]);
 });
 assert.equal(feed.issues.length,1);
 assert.equal(feed.issues[0].number,11);
 assert.equal(JSON.stringify(feed).includes("Sensitive synthetic text"),false);
 await assert.rejects(()=>getPublicIssueFeed(async()=>new Response("unavailable",{status:429})),/unavailable/);
});
test("Vercel fails publishing when validations fail, only local scripts are executed",async()=>{
 const cfg=JSON.parse(await read("vercel.json"));
 assert.equal(cfg.outputDirectory,"dist");
 assert.equal(cfg.buildCommand,"npm run check");
 const csp=cfg.headers[0].headers.find(h=>h.key==="Content-Security-Policy").value;
 assert.match(csp,/script-src 'self'/);
 assert.match(csp,/connect-src 'self'/);
 assert.match(csp,/frame-ancestors 'none'/);
 const ci=await read(".circleci/config.yml");
 assert.match(ci,/npm run check/);
 assert.doesNotMatch(ci,/github-actions|uses:\s*actions\//i);
 const activity=await read("dist/activity.js");
 assert.match(activity,/textContent/);
 assert.doesNotMatch(activity,/innerHTML|document\.write/);
});
