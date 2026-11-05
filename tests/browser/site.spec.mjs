import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const coreRoutes=["/","/mission","/mission/it","/roadmap","/research","/research/evidence-ledger","/library","/governance","/contribute","/activity","/status"];
for(const route of coreRoutes){
 test("meaningful page and keyboard landmarks "+route,async({page})=>{
  if(route==="/status")await page.route("**/api/source-status",r=>r.fulfill({json:{status:"current",githubRevision:"a".repeat(40),publishedRevision:"a".repeat(40),publishedAt:"2026-11-05T18:00:00Z",checkedAt:"2026-11-05T18:00:00Z"}}));
  if(route==="/activity"){
   await page.route("**/api/issues",async routing=>routing.fulfill({json:{
    source:"github_public_issues",fetchedAt:"2026-11-05T18:00:00Z",limitedToRecent:false,
    issues:[{number:9,title:"WEB-01 public access",state:"open",updatedAt:"2026-11-05T18:00:00Z"}]
   }}));
  }
  await page.goto(route,{waitUntil:"domcontentloaded"});
  await expect(page.locator("main#main")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("nav[aria-label='Main navigation']")).toBeVisible();
  const sizing=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  expect(sizing.width,{message:"Unexpected horizontal page overflow on "+route}).toBeLessThanOrEqual(sizing.viewport+2);
  for(const navLink of await page.locator("nav[aria-label='Main navigation'] a").all()){
   const href=await navLink.getAttribute("href");
   expect(href).toMatch(/^\/[a-z/-]*$/);
  }
 });
}

for(const route of ["/","/roadmap","/research/evidence-ledger","/library","/activity","/status"]){
 test("WCAG accessibility audit "+route,async({page})=>{
  if(route==="/activity")await page.route("**/api/issues",r=>r.fulfill({json:{source:"github_public_issues",fetchedAt:"2026-11-05T18:00:00Z",limitedToRecent:false,issues:[]}}));
  if(route==="/status")await page.route("**/api/source-status",r=>r.fulfill({json:{status:"current",githubRevision:"a".repeat(40),publishedRevision:"a".repeat(40),publishedAt:"2026-11-05T18:00:00Z",checkedAt:"2026-11-05T18:00:00Z"}}));
  await page.goto(route);
  const audit=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
  expect(audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 });
}
test("first keyboard focus is a usable skip link",async({page})=>{
 await page.goto("/");
 await page.keyboard.press("Tab");
 const selected=page.locator(":focus");
 await expect(selected).toHaveText("Skip to main content");
 await page.keyboard.press("Enter");
 await expect(page).toHaveURL(/#main$/);
});
test("first-party research and contribution navigation",async({page})=>{
 await page.goto("/");
 await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Research"}).click();
 await expect(page).toHaveURL(/\/research$/);
 await page.getByRole("link",{name:/evidence ledger/i}).first().click();
 await expect(page).toHaveURL(/\/research\/evidence-ledger$/);
 await expect(page.locator("table")).toBeVisible();
 await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Get involved"}).click();
 await expect(page).toHaveURL(/\/contribute$/);
});
test("untrusted activity titles remain text and GitHub actions are explicit",async({page})=>{
 await page.route("**/api/issues",r=>r.fulfill({json:{
  source:"github_public_issues",fetchedAt:"2026-11-05T18:00:00Z",limitedToRecent:false,
  issues:[{number:9,title:"<img src=x onerror=alert(1)>",state:"open",updatedAt:"2026-11-05T18:00:00Z"}]
 }}));
 await page.goto("/activity");
 await expect(page.locator("#issue-9 h2")).toContainText("<img src=x");
 await expect(page.locator("#issue-9 img")).toHaveCount(0);
 const external=page.locator("#issue-9 a");
 await expect(external).toHaveAttribute("href","https://github.com/saver1991/human-prosperity-initiative/issues/9");
 await expect(external).toHaveAttribute("rel","noopener noreferrer");
});
