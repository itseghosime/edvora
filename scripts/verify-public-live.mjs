// Public deployment acceptance only. No credentials, forms or application writes.
import { chromium } from "playwright";
import assert from "node:assert/strict";
const origin = "https://edvora-sage.vercel.app";
const browser = await chromium.launch({headless:true,args:["--no-sandbox"]});
try {
 const page=await browser.newPage();
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 for(const path of ["/","/about","/academics","/admissions","/fees","/school-life","/contact"]){
  await page.goto(origin+path,{waitUntil:"networkidle"});
  assert.equal(await page.locator("main h1").count(),1,path+" heading");
 }
 assert.deepEqual(errors,[],"Deployed public pages must hydrate without client errors in clean Chromium");
 console.log("Live public hydration: all seven routes passed in clean Chromium.");
} finally { await browser.close(); }
