import test from "node:test";
import assert from "node:assert/strict";
import {once} from "node:events";
import {createPreviewServer} from "../src/server/preview.mjs";
test("local website and portal preview routes are served without leaking other files",async()=>{
 const server=createPreviewServer();
 server.listen(0,"127.0.0.1");await once(server,"listening");
 const port=server.address().port;
 try{
  for(const route of ["/","/app","/site.css","/app.js","/src/staff/staff-os.js","/src/agency/agency-os.js"]){
   const response=await fetch("http://127.0.0.1:"+port+route);
   assert.equal(response.status,200,route);
   assert.equal(response.headers.get("x-content-type-options"),"nosniff");
   assert.ok((await response.text()).length>0,route);
  }
  const missing=await fetch("http://127.0.0.1:"+port+"/.env");
  assert.equal(missing.status,404);
  const privateSql=await fetch("http://127.0.0.1:"+port+"/supabase/drafts/amplify_marketing_and_ooh.sql");
  assert.equal(privateSql.status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
