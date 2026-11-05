import {defineConfig} from "@playwright/test";
import {resolve} from "node:path";

export default defineConfig({
 testDir:".",
 testMatch:"*.spec.mjs",
 fullyParallel:false,
 forbidOnly:true,
 retries:0,
 workers:1,
 timeout:30000,
 reporter:"list",
 outputDir:"../../test-results",
 use:{
  baseURL:"http://127.0.0.1:4173",
  browserName:"chromium",
  headless:true,
  screenshot:"only-on-failure",
  trace:"retain-on-failure",
  actionTimeout:10000
 },
 projects:[
  {name:"desktop-chromium",use:{viewport:{width:1440,height:900}}},
  {name:"mobile-chromium",use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}}
 ],
 webServer:{
  command:"node tests/browser/serve.mjs",
  cwd:resolve(import.meta.dirname,"../.."),
  url:"http://127.0.0.1:4173/",
  reuseExistingServer:false,
  timeout:30000
 }
});
