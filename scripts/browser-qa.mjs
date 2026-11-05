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
 "/library","/activity","/contribute","/governance"];
const report={source:"local-generated-site",browser:"chromium",viewports:widths,
 checkedRoutes:routes,checks:[],violations:[],screenshots:[],status:"in_progress"};
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
   if(["mobile","desktop"].includes(viewport.name)&&["/","/research","/activity"].includes(route)){
    const screenshot=viewport.name+"-"+(route==="/"? "home":route.slice(1))+".png";
    await page.screenshot({path:resolve(output,screenshot),fullPage:true});
    report.screenshots.push(screenshot);
   }
   if((viewport.name==="desktop"||viewport.name==="mobile")&&
      ["/","/mission","/research","/activity"].includes(route)){
    const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
    const serious=result.violations.filter(v=>["critical","serious"].includes(v.impact));
    for(const violation of result.violations){
     report.violations.push({viewport:viewport.name,route,
      id:violation.id,impact:violation.impact,description:violation.description,
      nodes:violation.nodes.length,
      snippets:violation.nodes.slice(0,40).map(n=>n.target.join(" "))});
    }
    record(viewport.name+" "+route+" axe WCAG 2.1 AA severe violations",serious.length===0,
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
   await page.goto(base+"/activity");
   await page.locator("#issue-list .issue-row").first().waitFor({timeout:10000});
   record("on-site public task feed",await page.locator("#issue-list .issue-row").count()===1);
   const href=await page.locator("#issue-list .issue-row a").first().getAttribute("href");
   record("external discussion clearly linked",href==="https://github.com/saver1991/human-prosperity-initiative/issues/9");
   await page.close();
  }
  await context.close();
 }
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
