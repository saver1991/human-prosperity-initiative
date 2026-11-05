import {createServer} from "node:http";
import {readFile,stat} from "node:fs/promises";
import {resolve,sep} from "node:path";

const root=resolve("dist");
const port=Number(process.env.HPI_TEST_PORT||4173);
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".json":"application/json; charset=utf-8",".xml":"application/xml; charset=utf-8",".txt":"text/plain; charset=utf-8"};
createServer(async(req,res)=>{
 if(req.method!=="GET"){res.writeHead(405);return res.end("Method not allowed")}
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname)}
 catch{res.writeHead(400);return res.end("Bad path")}
 if(pathname.includes("\0")||pathname.split("/").includes("..")){res.writeHead(400);return res.end("Bad path")}
 const mapped=pathname==="/"?"/index.html":/\.[a-z0-9]+$/i.test(pathname)?pathname:pathname.replace(/\/$/,"")+".html";
 const target=resolve(root,"."+mapped);
 if(!target.startsWith(root+sep)){res.writeHead(403);return res.end("Forbidden")}
 try{
  const meta=await stat(target);
  if(!meta.isFile())throw new Error("Not a file");
  const extension=target.slice(target.lastIndexOf("."));
  res.writeHead(200,{"content-type":mime[extension]||"application/octet-stream","cache-control":"no-store"});
  res.end(await readFile(target));
 }catch{res.writeHead(404,{"content-type":"text/plain; charset=utf-8"});res.end("Not found")}
}).listen(port,"127.0.0.1",()=>console.log("HPI browser QA server on "+port));
