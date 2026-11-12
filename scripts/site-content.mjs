import path from "node:path";

export const ORIGIN = "https://human-prosperity-initiative.vercel.app";
const HPI_REPO = "svtmzt/human-prosperity-initiative";
const HPI_PREVIOUS_REPO = "saver1991/human-prosperity-initiative";
const ROOT_PAGES = new Map([
 ["docs/charter.en.md","/mission"], ["docs/charter.it.md","/mission/it"],
 ["docs/roadmap.md","/roadmap"], ["GOVERNANCE.md","/governance"],
 ["CONTRIBUTING.md","/contribute"], ["README.md","/library/readme"],
 ["CODE_OF_CONDUCT.md","/library/code-of-conduct"],
 ["LICENSE-DOCS.md","/library/documentation-license"],["LICENSE","/library/software-license"],
 ...["privacy","cookies","terms","legal","copyright","accessibility","help","contact","about","research-integrity","site-map"].map(name=>["docs/site-pages/"+name+".md","/"+name])
]);
export const STATIC_ROUTES = ["/","/mission","/roadmap","/research","/governance","/contribute","/library","/activity","/status"];
export const escapeHtml = value => String(value).replace(/[&<>"']/g, ch=>({
 "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
})[ch]);
export const slug = value => String(value).toLowerCase().normalize("NFKD")
 .replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,95) || "untitled";
export const routeForSource = input => {
 const src=input.replace(/\\/g,"/");
 if(ROOT_PAGES.has(src))return ROOT_PAGES.get(src);
 if(src.startsWith("docs/")&&/\.(md|csv)$/.test(src))
  return "/library/docs/"+src.slice(5).replace(/\.(md|csv)$/,"").split("/").map(slug).join("/");
 if(src.startsWith("research/")&&/\.(md|csv)$/.test(src))
  return "/research/"+slug(src.slice(9).replace(/\.(md|csv)$/,""));
 return null;
};
export function buildRouteIndex(paths){
 const routes=new Map(),used=new Map();
 for(const source of paths){
  const route=routeForSource(source);
  if(!route)continue;
  if(used.has(route))throw new Error("Route collision: "+source+" and "+used.get(route));
  routes.set(source,route);used.set(route,source);
 }
 return routes;
}
const splitFragment = raw => {
 const i=raw.indexOf("#");
 return [i<0?raw:raw.slice(0,i), i<0?"":raw.slice(i)];
};
export function resolveLink(destination,source,routes){
 const raw=String(destination).trim();
 if(!raw)return {href:"#",external:false};
 if(raw.startsWith("#"))return {href:/^#[A-Za-z0-9_.:-]+$/.test(raw)?raw:"#",external:false};
 const [base,fragment]=splitFragment(raw), frag=/^#[A-Za-z0-9_.:-]+$/.test(fragment)?fragment:"";
 if(/^(\.\.\/)*issues(?:\/|$)/.test(base))
  return {href:"/activity"+frag,external:false};
 if(/^(\.\.\/)*discussions(?:\/|$)/.test(base))
  return {href:"https://github.com/"+HPI_REPO+"/discussions",external:true};
 if(/^https?:\/\//i.test(base)){
  let url;try{url=new URL(raw)}catch{return {href:"#",external:false}}
  if(url.protocol==="https:"&&url.hostname==="human-prosperity-initiative.vercel.app"&&
     !url.username&&!url.password)
   return {href:url.pathname+url.search+url.hash,external:false};
  const repoOwner=[HPI_REPO,HPI_PREVIOUS_REPO].find(repo=>url.pathname.startsWith("/"+repo+"/"));
  if(url.hostname==="github.com"&&repoOwner){
   const rest=url.pathname.slice(("/"+repoOwner+"/").length);
   if(rest.startsWith("blob/main/")){
    const sourcePath=decodeURIComponent(rest.slice("blob/main/".length));
    if(routes.has(sourcePath))return {href:routes.get(sourcePath)+frag,external:false};
   }
   if(rest==="issues")return {href:"/activity"+frag,external:false};
   const issue=rest.match(/^issues\/([0-9]+)$/);
   if(issue)return {href:"/activity#issue-"+issue[1],external:false};
   if(rest==="tree/main/research")return {href:"/research",external:false};
  }
  return url.protocol==="https:"?{href:url.href,external:true}:{href:"#",external:false};
 }
 if(/^([a-z]+:|\/\/)/i.test(base))return {href:"#",external:false};
 const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(source),base.replace(/^\.\//,"")));
 if(routes.has(resolved))return {href:routes.get(resolved)+frag,external:false};
 if(/\.(md|csv)$/.test(base))throw new Error("Unresolved internal document: "+source+" -> "+raw);
 return {href:"#",external:false};
}
function inlineText(raw,source,routes){
 const links=[];
 let masked=String(raw).replace(/(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(_,label,dest)=>{
  const r=resolveLink(dest,source,routes), token="HPI_LINK_TOKEN_"+links.length+"_END";
  links.push('<a href="'+escapeHtml(r.href)+'"'+(r.external?' target="_blank" rel="noopener noreferrer"':"")+">"+escapeHtml(label)+"</a>");
  return token;
 });
 const codes=[];
 masked=masked.replace(/\x60([^\x60\n]+)\x60/g,(_,code)=>{
  const token="HPI_CODE_TOKEN_"+codes.length+"_END";
  codes.push("<code>"+escapeHtml(code)+"</code>");return token;
 });
 let html=escapeHtml(masked);
 html=html.replace(/\*\*([^*\n]+)\*\*/g,"<strong>$1</strong>")
  .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,"<em>$1</em>")
  .replace(/~~([^~\n]+)~~/g,"<del>$1</del>");
 codes.forEach((code,i)=>html=html.replace("HPI_CODE_TOKEN_"+i+"_END",code));
 links.forEach((link,i)=>html=html.replace("HPI_LINK_TOKEN_"+i+"_END",link));
 return html;
}
export function firstHeading(markdown,fallback){
 const match=markdown.match(/^#\s+(.+)$/m);
 return match?match[1].trim():fallback;
}
function splitTableRow(raw){
 return raw.trim().replace(/^\|/,"").replace(/\|$/,"").split(/(?<!\\)\|/).map(s=>s.replace(/\\\|/g,"|").trim());
}
const isSeparator=raw=>/^\s*\|?\s*:?-{3,}:?(?:\s*\|\s*:?-{3,}:?)*\s*\|?\s*$/.test(raw);
export function renderMarkdown(markdown,source,routes,{skipFirstHeading=false}={}){
 const lines=markdown.replace(/\r\n/g,"\n").split("\n"), result=[];
 let i=0,list=null,headingSkipped=false;
 const close=()=>{if(list){result.push("</"+list+">");list=null}};
 const inline=s=>inlineText(s,source,routes);
 const fence=String.fromCharCode(96).repeat(3);
 while(i<lines.length){
  let raw=lines[i],trim=raw.trim();
  if(!trim){close();i++;continue}
  if(trim.startsWith(fence)){
   close();const lang=trim.slice(3).trim().replace(/[^a-zA-Z0-9-]/g,"");
   const block=[];i++;
   while(i<lines.length&&!lines[i].trim().startsWith(fence))block.push(lines[i++]);
   if(i<lines.length)i++;
   result.push('<pre class="doc-code"><code'+(lang?' data-language="'+escapeHtml(lang)+'"':"")+">"+escapeHtml(block.join("\n"))+"</code></pre>");
   continue;
  }
  if(/^#{1,6}\s+/.test(trim)){
   close();const level=trim.match(/^#+/)[0].length,head=trim.replace(/^#{1,6}\s+/,"").replace(/\s+#+\s*$/,"");
   if(!(skipFirstHeading&&level===1&&!headingSkipped))
    result.push("<h"+level+' id="'+slug(head.replace(/[*_\x60]/g,""))+'">'+inline(head)+"</h"+level+">");
   if(level===1)headingSkipped=true;i++;continue;
  }
  if(i+1<lines.length&&trim.includes("|")&&isSeparator(lines[i+1])){
   close();const headings=splitTableRow(trim),rows=[];i+=2;
   while(i<lines.length&&lines[i].trim().includes("|")){rows.push(splitTableRow(lines[i]));i++}
   result.push('<div class="doc-table-wrap" role="region" aria-label="Scrollable data table" tabindex="0"><table><thead><tr>'+
    headings.map(v=>"<th>"+inline(v)+"</th>").join("")+"</tr></thead><tbody>"+
    rows.map(row=>"<tr>"+headings.map((_,j)=>"<td>"+inline(row[j]||"")+"</td>").join("")+"</tr>").join("")+
    "</tbody></table></div>");
   continue;
  }
  if(/^(---+|\*\*\*+|___+)$/.test(trim)){close();result.push("<hr>");i++;continue}
  if(/^>\s?/.test(trim)){
   close();const arr=[];
   while(i<lines.length&&/^>\s?/.test(lines[i].trim()))arr.push(lines[i++].trim().replace(/^>\s?/,""));
   result.push("<blockquote><p>"+inline(arr.join(" "))+"</p></blockquote>");continue;
  }
  const bullet=trim.match(/^([-+*]|\d+\.)\s+(.+)$/);
  if(bullet){
   const typ=/^\d+\./.test(bullet[1])?"ol":"ul";
   if(list!==typ){close();result.push("<"+typ+">");list=typ}
   result.push("<li>"+inline(bullet[2])+"</li>");i++;continue;
  }
  close();const paragraph=[trim];i++;
  while(i<lines.length){
   const next=lines[i].trim();
   if(!next||/^([#>]|[-+*] |\d+\. |---+$)/.test(next)||next.startsWith(fence)||
      next.includes("|")&&i+1<lines.length&&isSeparator(lines[i+1]))break;
   paragraph.push(next);i++;
  }
  result.push("<p>"+inline(paragraph.join(" "))+"</p>");
 }
 close();return result.join("\n");
}
export function parseCsv(csv){
 const rows=[];let row=[],cell="",inQuote=false,closed=false;
 for(let i=0;i<csv.length;i++){
  const c=csv[i];
  if(inQuote){
   if(c==='"'){if(csv[i+1]==='"'){cell+='"';i++}else{inQuote=false;closed=true}}else cell+=c;
  }else if(c==='"'){
   if(cell||closed)throw new Error("Malformed CSV quote");
   inQuote=true;
  }else if(c===","||c==="\n"){
   row.push(cell);cell="";closed=false;
   if(c==="\n"){rows.push(row);row=[]}
  }else if(c==="\r"){
   if(csv[i+1]!=="\n")throw new Error("Malformed CSV carriage return");
  }else {if(closed)throw new Error("Malformed CSV after quote");cell+=c}
 }
 if(inQuote)throw new Error("Unclosed CSV quote");
 if(row.length||cell){row.push(cell);rows.push(row)}
 if(!rows.length)throw new Error("Empty CSV");
 if(rows.some(r=>r.length!==rows[0].length))throw new Error("Irregular CSV columns");
 return rows;
}
export function renderCsv(csv){
 const rows=parseCsv(csv),head=rows[0],body=rows.slice(1);
 return '<p>This is a published source inventory, not an independently reviewed impact assessment.</p>'+
 '<p class="doc-count">'+body.length+" data rows · "+head.length+" fields</p>"+
 '<div class="doc-table-wrap" role="region" aria-label="Scrollable data table" tabindex="0"><table><thead><tr>'+
 head.map(v=>"<th>"+escapeHtml(v.replace(/_/g," ")).toUpperCase()+"</th>").join("")+
 '</tr></thead><tbody>'+body.map(row=>"<tr>"+row.map((cell,i)=>{
  if(head[i]==="url"&&/^https:\/\//.test(cell)){
   let url="#";try{const parsed=new URL(cell);if(parsed.protocol==="https:")url=parsed.href}catch{}
   return '<td><a href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">External source ↗</a></td>';
  }return "<td>"+escapeHtml(cell)+"</td>";
 }).join("")+"</tr>").join("")+"</tbody></table></div>";
}
export function sourceTitle(source,content){
 if(source.endsWith(".md"))return firstHeading(content,path.posix.basename(source,".md"));
 if(source.endsWith(".csv"))return path.posix.basename(source,".csv").replace(/[-_]/g," ");
 return path.posix.basename(source);
}
