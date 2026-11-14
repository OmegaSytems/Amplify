import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

const ROOT=resolve(fileURLToPath(new URL("../../",import.meta.url)));
const files=new Map([
 ["/",["public/index.html","text/html; charset=utf-8"]],
 ["/site.css",["public/site.css","text/css; charset=utf-8"]],
 ["/site.js",["public/site.js","text/javascript; charset=utf-8"]],
 ["/app",["index.html","text/html; charset=utf-8"]],
 ["/app.js",["app.js","text/javascript; charset=utf-8"]],
 ["/styles.css",["styles.css","text/css; charset=utf-8"]],
 ["/src/staff/staff-os.js",["src/staff/staff-os.js","text/javascript; charset=utf-8"]],
 ["/src/staff/staff-os.css",["src/staff/staff-os.css","text/css; charset=utf-8"]],
 ["/src/agency/agency-os.js",["src/agency/agency-os.js","text/javascript; charset=utf-8"]],
 ["/src/agency/agency-os.css",["src/agency/agency-os.css","text/css; charset=utf-8"]]
]);
/**
 * Local-only browser preview. Never publish this server publicly:
 * /app is an intentionally unauthenticated demonstration with role switching.
 */
export function createPreviewServer(){
 return createServer(async(req,res)=>{
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("X-Frame-Options","DENY");
  res.setHeader("Referrer-Policy","no-referrer");
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Security-Policy","default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; form-action 'self'; base-uri 'none'; object-src 'none'");
  if(!["GET","HEAD"].includes(req.method)){res.statusCode=405;res.setHeader("Allow","GET, HEAD");res.end("Method not allowed");return}
  let pathname;try{pathname=new URL(req.url,"http://127.0.0.1").pathname}catch{res.statusCode=400;res.end("Invalid path");return}
  const item=files.get(pathname);
  if(!item){res.statusCode=404;res.end("Not found");return}
  try{
   const body=await readFile(resolve(ROOT,item[0]));
   res.statusCode=200;res.setHeader("Content-Type",item[1]);
   if(req.method==="HEAD")res.end();else res.end(body);
  }catch{res.statusCode=500;res.end("Preview asset unavailable")}
 });
}
export function startPreview(){
 const port=Number(process.env.PREVIEW_PORT||8790);
 const server=createPreviewServer();
 return server.listen(port,"127.0.0.1",()=>{
  console.info("Omega Amplify LOCAL preview: http://127.0.0.1:"+port);
  console.info("Staff/client demo: http://127.0.0.1:"+port+"/app");
 });
}
