/** HPI real-Chromium QA: responsive, keyboard, accessibility and internal navigation.
 * Runs on a locally generated static build; never accesses credentials or writes project data.
 */
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {resolve,extname,sep} from "node:path";
import {chromium} from "playwright";
import AxeBuilder from "@axe-core/playwright";

const output=resolve("qa-artifacts");
await mkdir(output,{recursive:true});
const mime={
 ".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",
 ".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",
 ".json":"application/json; charset=utf-8",".xml":"application/xml"
};
const fixture={source:"github_public_issues",fetchedAt:new Date().toISOString(),limitedToRecent:false,
 issues:[{number:9,title:"WEB-01 — Public website quality",state:"open",updatedAt:"2026-11-05T14:00:00Z"}]};
const distRoot=resolve("dist");
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url||"/","http://127.0.0.1");
  if(url.pathname==="/api/freshness"){
   const publicInfo=JSON.parse(await readFile(resolve(distRoot,"publication.json"),"utf8"));
   res.writeHead(200,{"content-type":"application/json; charset=utf-8"});
   res.end(JSON.stringify({source:"public_hpi_github_main_and_production",status:"current",checkedLive:true,
    latestMainRevision:publicInfo.revision,publishedRevision:publicInfo.revision,
    checkedAt:new Date().toISOString(),note:"Local test fixture confirms public provenance shape."}));
   return;
  }
  if(url.pathname==="/api/issues"){
   res.writeHead(200,{"content-type":"application/json; charset=utf-8"});
   res.end(JSON.stringify(fixture));return;
  }
  const normalized=decodeURIComponent(url.pathname);
  if(normalized.includes("\0")||normalized.includes("\\"))throw new Error("bad path");
  const filename=normalized==="/"?"/index.html":normalized.replace(/\/$/,"")+
   (extname(normalized)?"":".html");
  const full=resolve(distRoot,"."+filename);
  if(!full.startsWith(distRoot+sep))throw new Error("outside static root");
  const body=await readFile(full);
  res.writeHead(200,{"content-type":mime[extname(full)]||"application/octet-stream"});
  res.end(body);
 }catch{
  res.writeHead(404,{"content-type":"text/plain"});res.end("Not found");
 }
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port;
const widths=[
 {name:"mobile-small",width:320,height:720},
 {name:"mobile",width:390,height:844},
 {name:"tablet",width:768,height:1024},
 {name:"desktop",width:1440,height:900}
];
const routes=["/","/mission","/roadmap","/research","/research/evidence-ledger",
 "/library","/activity","/status","/contribute","/governance",
 "/initiatives/web-02","/initiatives/f0-02","/initiatives/f0-03-1","/initiatives/web-01"];
const report={source:"local-generated-site",browser:"chromium",viewports:widths,
 checkedRoutes:routes,checks:[],violations:[],screenshots:[],status:"in_progress",
 automationScope:"Chromium axe WCAG 2.2 AA; zoom-equivalent reflow; CSS text-resize stress; ARIA snapshots; keyboard traversal. Not a real screen reader or OS zoom audit."};
let browser;
let failures=[];
function record(name,result,detail=""){
 report.checks.push({name,result,detail});
 if(!result)failures.push(name+(detail?" — "+detail:""));
}
try{
 browser=await chromium.launch({headless:true});
 for(const viewport of widths){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},
   reducedMotion:"reduce",deviceScaleFactor:1});
  for(const route of routes){
   const page=await context.newPage();
   const errors=[];
   page.on("pageerror",err=>errors.push(err.message));
   const response=await page.goto(base+route,{waitUntil:"networkidle",timeout:20000});
   record(viewport.name+" "+route+" HTTP 200",response?.status()===200,
    "status="+response?.status());
   const layout=await page.evaluate(()=>({
    docWidth:document.documentElement.scrollWidth,viewportWidth:window.innerWidth,
    h1:document.querySelectorAll("main h1").length,
    main:!!document.querySelector("main"),
    nav:!!document.querySelector('nav[aria-label="Main navigation"]')
   }));
   record(viewport.name+" "+route+" semantic landmarks",
    layout.h1===1&&layout.main&&layout.nav,JSON.stringify(layout));
   record(viewport.name+" "+route+" no horizontal document overflow",
    layout.docWidth<=layout.viewportWidth+2,JSON.stringify(layout));
   record(viewport.name+" "+route+" no JS errors",!errors.length,errors.join(" | "));
   if(["mobile","desktop"].includes(viewport.name)&&["/","/research","/roadmap","/activity","/initiatives/web-02"].includes(route)){
    const screenshot=viewport.name+"-"+(route==="/"? "home":route.slice(1).replaceAll("/","-"))+".png";
    await page.screenshot({path:resolve(output,screenshot),fullPage:true});
    report.screenshots.push(screenshot);
   }
   if((viewport.name==="desktop"||viewport.name==="mobile")&&
      ["/","/mission","/research","/roadmap","/research/evidence-ledger","/library","/activity","/status","/initiatives/web-02","/initiatives/f0-03-1"].includes(route)){
    const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
    const serious=result.violations;
    for(const violation of result.violations){
     report.violations.push({viewport:viewport.name,route,
      id:violation.id,impact:violation.impact,description:violation.description,
      nodes:violation.nodes.length,
      snippets:violation.nodes.slice(0,40).map(n=>n.target.join(" "))});
    }
    record(viewport.name+" "+route+" axe WCAG 2.2 AA all reported violations",serious.length===0,
     serious.map(v=>v.id+"("+v.nodes.length+")").join(", "));
   }
   await page.close();
  }
  if(viewport.name==="desktop"){
   const page=await context.newPage();
   await page.goto(base+"/");
   await page.keyboard.press("Tab");
   record("keyboard skip-link reachable",await page.evaluate(()=>document.activeElement?.classList.contains("skip")));
   await page.keyboard.press("Enter");
   record("keyboard skip-link target",new URL(page.url()).hash==="#main");
   await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Research"}).click();
   record("on-site primary navigation",new URL(page.url()).pathname==="/research");
   await page.goto(base+"/status");
   await page.waitForFunction(()=>document.getElementById("freshness-status")?.classList.contains("is-current"),{timeout:10000});
   record("on-site publication freshness rendering",await page.locator("#freshness-source").textContent()!=="not verified");
   await page.goto(base+"/activity");
   await page.locator("#issue-list .issue-row").first().waitFor({timeout:10000});
   record("on-site public task feed",await page.locator("#issue-list .issue-row").count()===1);
   const href=await page.locator("#issue-list .issue-row a.issue-discuss").first().getAttribute("href");
   record("external discussion clearly linked",href==="https://github.com/saver1991/human-prosperity-initiative/issues/9");
   const local=await page.locator("#issue-list .issue-row a.issue-local").first().getAttribute("href");
   record("on-site issue to initiative navigation",local==="/initiatives/web-01");
   await page.goto(base+"/roadmap",{waitUntil:"networkidle"});
   record("read-only public issue feed status visible",
    (await page.locator("[data-feed-health]").textContent()).includes("Public issue feed available"));
   const sample={source:"github_public_issues",fetchedAt:new Date().toISOString(),limitedToRecent:false,
    issues:[
     {number:29,state:"open",title:"WEB-02 initiative",updatedAt:new Date().toISOString()},
     {number:33,state:"closed",title:"WEB-02.4 epic",updatedAt:new Date().toISOString()}
    ]};
   await page.route("**/api/issues",route=>route.fulfill({
    status:200,contentType:"application/json",body:JSON.stringify(sample)
   }));
   await page.goto(base+"/initiatives/web-02",{waitUntil:"networkidle"});
   record("closed issue does not silently approve a pending epic",
    await page.locator('[data-public-issue="33"]').getAttribute("data-issue-drift")==="true");
   record("closed issue explicitly says independent science not approved",
    (await page.locator('[data-public-issue="33"]').textContent()).includes("not an independent science approval"));
   await page.unroute("**/api/issues");
   await page.route("**/api/issues",route=>route.fulfill({
    status:503,contentType:"application/json",body:'{"error":"provider_unavailable"}'
   }));
   await page.goto(base+"/initiatives/web-02",{waitUntil:"networkidle"});
   record("provider outage displays unknown source, never false completion",
    (await page.locator("[data-feed-health]").textContent()).includes("unavailable")&&
    await page.locator('[data-public-issue="29"]').getAttribute("data-issue-signal")==="unavailable");
   await page.unroute("**/api/issues");
   await page.route("**/api/issues",route=>route.fulfill({
    status:200,contentType:"application/json",
    body:JSON.stringify({...sample,fetchedAt:new Date(Date.now()-3600000).toISOString()})
   }));
   await page.goto(base+"/roadmap",{waitUntil:"networkidle"});
   record("stale GitHub feed clearly labeled and not accepted",
    (await page.locator("[data-feed-health]").textContent()).includes("stale"));
   await page.unroute("**/api/issues");
   await page.close();
  }
  await context.close();
 }

 // WCAG 1.4.10 reflow: 1280 CSS-pixel desktop at 200%/400% browser zoom
 // corresponds approximately to 640/320 CSS-pixel layout viewports.
 // This is an automated layout-equivalence test, NOT an actual OS browser-zoom
 // or screen-reader acceptance test.
 for(const scenario of [
  {name:"200pct-zoom-equivalent",width:640},
  {name:"400pct-zoom-equivalent",width:320}
 ]){
  const context=await browser.newContext({
   viewport:{width:scenario.width,height:900},reducedMotion:"reduce",deviceScaleFactor:1
  });
  for(const route of ["/","/mission","/research","/research/evidence-ledger",
   "/library","/activity","/status","/contribute","/governance","/initiatives/web-02"]){
   const page=await context.newPage();
   const response=await page.goto(base+route,{waitUntil:"networkidle",timeout:20000});
   record(scenario.name+" "+route+" HTTP 200",response?.status()===200);
   const layout=await page.evaluate(()=>({
    width:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth,
    headings:document.querySelectorAll("main h1").length,
    main:!!document.querySelector("main"),
    navigation:!!document.querySelector('nav[aria-label="Main navigation"]')
   }));
   record(scenario.name+" "+route+" reflow without document-level horizontal overflow",
    layout.width<=layout.viewport+2,JSON.stringify(layout));
   record(scenario.name+" "+route+" accessible landmarks",
    layout.headings===1&&layout.main&&layout.navigation,JSON.stringify(layout));
   const navSnapshot=await page.getByRole("navigation",{name:"Main navigation"}).ariaSnapshot();
   const labels=["Mission","Research","Roadmap","Library","Get involved"];
   record(scenario.name+" "+route+" navigation accessible names",
    labels.every(label=>navSnapshot.includes('link "'+label+'"')),
    navSnapshot.slice(0,420));
   if(["/","/research"].includes(route)){
    const suffix=route==="/"?"home":"research";
    const screenshot=scenario.name+"-"+suffix+".png";
    await page.screenshot({path:resolve(output,screenshot),fullPage:true});
    report.screenshots.push(screenshot);
   }
   await page.close();
  }
  await context.close();
 }

 // WCAG 1.4.4 text-resize stress test: multiply computed typographic sizes
 // without changing content or using external services. This is a browser
 // DOM/CSS simulation; OS browser/text zoom and real AT remain distinct.
 const textContext=await browser.newContext({viewport:{width:1280,height:900},
  reducedMotion:"reduce",deviceScaleFactor:1});
 for(const route of ["/","/research","/library","/status"]){
  const page=await textContext.newPage();
  await page.goto(base+route,{waitUntil:"networkidle",timeout:20000});
  const before=await page.evaluate(()=>({
   text:document.querySelector("main h1")?.textContent?.trim()||"",
   viewport:document.documentElement.clientWidth
  }));
  await page.evaluate(()=>{
   const nodes=[...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,small,a,button,label")];
   const sizes=nodes.map(el=>[el,Number.parseFloat(getComputedStyle(el).fontSize)]);
   for(const [el,original] of sizes)
    if(Number.isFinite(original))el.style.setProperty("font-size",original*2+"px","important");
  });
  const after=await page.evaluate(()=>({
   scroll:document.documentElement.scrollWidth,
   viewport:document.documentElement.clientWidth,
   h1:document.querySelector("main h1")?.textContent?.trim()||"",
   visibleMain:!!document.querySelector("main")?.getClientRects().length
  }));
  record("200pct-text-resize "+route+" semantic content preserved",
   !!before.text&&before.text===after.h1&&after.visibleMain,JSON.stringify(after));
  record("200pct-text-resize "+route+" no document overflow",
   after.scroll<=after.viewport+2,JSON.stringify(after));
  if(route==="/"){
   const screenshot="text-resize-200pct-home.png";
   await page.screenshot({path:resolve(output,screenshot),fullPage:true});
   report.screenshots.push(screenshot);
  }
  await page.close();
 }
 await textContext.close();

 // Accessible-name and tab-order inspection approximates an assistive
 // technology's semantic tree. It is not NVDA/VoiceOver speech validation.
 const keyboardContext=await browser.newContext({viewport:{width:1440,height:900},
  reducedMotion:"reduce",deviceScaleFactor:1});
 for(const route of ["/","/research","/status","/initiatives/web-02"]){
  const page=await keyboardContext.newPage();
  await page.goto(base+route,{waitUntil:"networkidle",timeout:20000});
  const mainSnapshot=await page.locator("main").ariaSnapshot();
  record("assistive-semantics "+route+" heading exposed",
   /heading ".+" \[level=1\]/.test(mainSnapshot),mainSnapshot.slice(0,400));
  const navSnapshot=await page.getByRole("navigation",{name:"Main navigation"}).ariaSnapshot();
  record("assistive-semantics "+route+" named navigation",
   navSnapshot.includes('link "Research"')&&navSnapshot.includes('link "Roadmap"'),
   navSnapshot.slice(0,350));
  const focus=[];
  for(let i=0;i<12;i++){
   await page.keyboard.press("Tab");
   focus.push(await page.evaluate(()=>{
    const el=document.activeElement;
    const rect=el?.getBoundingClientRect();
    const cs=el?getComputedStyle(el):null;
    return {tag:el?.tagName||"",name:el?.getAttribute("aria-label")||el?.textContent?.trim().slice(0,70)||"",
     visible:!!rect&&rect.width>0&&rect.height>0&&cs?.visibility!=="hidden"&&cs?.display!=="none",
     focusable:!!el?.matches('a[href],button,input,textarea,select,[tabindex]:not([tabindex="-1"])')};
   }));
  }
  record("keyboard "+route+" 12 sequential visible focus targets",
   focus.every(f=>f.visible&&f.focusable),JSON.stringify(focus));
  await page.close();
 }
 await keyboardContext.close();
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 report.status=failures.length?"failed":"passed";
 report.failures=failures;
 report.checkedAt=new Date().toISOString();
 await writeFile(resolve(output,"browser-report.json"),JSON.stringify(report,null,2)+"\n");
 console.log("Browser QA:",report.status,report.checks.filter(x=>x.result).length+
  "/"+report.checks.length+" checks; axe violations "+report.violations.length);
 if(failures.length)console.error("FAILED CHECKS:\n"+failures.join("\n"));
}
assert.equal(failures.length,0,"Browser QA must pass; review qa-artifacts/browser-report.json");
