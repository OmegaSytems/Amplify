import test from "node:test";
import assert from "node:assert/strict";
import {Readable} from "node:stream";
import {createHandler} from "../src/server/ooh-api.mjs";
const U="11111111-1111-4111-8111-111111111111";
const ORG="22222222-2222-4222-8222-222222222222";
const FLIGHT="33333333-3333-4333-8333-333333333333";
const env={SUPABASE_URL:"https://example.invalid",SUPABASE_PUBLISHABLE_KEY:"sb_publishable_test",SUPABASE_SERVER_KEY:"sb_secret_test"};
function request({method="GET",url="/api/me",token="",body}={}){
 const data=body?Buffer.from(JSON.stringify(body)):Buffer.from("");
 const r=Readable.from(data.length?[data]:[]);
 r.method=method;r.url=url;r.headers={authorization:token?"Bearer "+token:"",host:"localhost",...body?{"content-type":"application/json"}:{}};
 return r;
}
function response(){
 let chunks=[],statusCode=200;const headers={};
 return {
  headers, get statusCode(){return statusCode},set statusCode(v){statusCode=v},
  writableEnded:false,setHeader(k,v){headers[k.toLowerCase()]=v;},
  end(x){if(x)chunks.push(x);this.writableEnded=true},
  data(){return JSON.parse(chunks.join("")||"{}")}
 };
}
test("missing configuration fails closed",async()=>{
 const res=response();await createHandler({env:{}})(request(),res);
 assert.equal(res.statusCode,503);
});
test("missing bearer fails closed",async()=>{
 const res=response();await createHandler({env})(request(),res);
 assert.equal(res.statusCode,401);
});
test("cross-organisation access denied before flight read",async()=>{
 const called=[];
 const fetcher=async(url)=>{
  called.push(url);
  if(url.endsWith("/auth/v1/user"))return {ok:true,status:200,text:async()=>JSON.stringify({id:U})};
  if(url.includes("/memberships?"))return {ok:true,status:200,text:async()=>"[]"};
  throw new Error("Forbidden unexpected remote read");
 };
 const res=response();
 await createHandler({env,fetcher})(request({url:"/api/ooh?organisation_id="+ORG,token:"examplevalidtoken123"}),res);
 assert.equal(res.statusCode,403);
 assert.equal(called.some(x=>x.includes("/ooh_flights?")),false);
});
test("client sees safe projection only",async()=>{
 const called=[];
 const fetcher=async(url)=>{
  called.push(url);
  if(url.endsWith("/auth/v1/user"))return {ok:true,status:200,text:async()=>JSON.stringify({id:U})};
  if(url.includes("/memberships?"))return {ok:true,status:200,text:async()=>JSON.stringify([{organisation_id:ORG,role:"client"}])};
  if(url.includes("client_ooh_updates?"))return {ok:true,status:200,text:async()=>JSON.stringify([{flight_id:FLIGHT,status:"Draft"}])};
  throw new Error("Unexpected request");
 };
 const res=response();
 await createHandler({env,fetcher})(request({url:"/api/ooh?organisation_id="+ORG,token:"examplevalidtoken123"}),res);
 assert.equal(res.statusCode,200);
 assert.equal(res.data().items[0].flight_id,FLIGHT);
 assert.equal(called.some(x=>x.includes("/ooh_flights?")),false);
});
test("client cannot create media",async()=>{
 const fetcher=async(url)=>{
  if(url.endsWith("/auth/v1/user"))return {ok:true,status:200,text:async()=>JSON.stringify({id:U})};
  if(url.includes("/memberships?"))return {ok:true,status:200,text:async()=>JSON.stringify([{organisation_id:ORG,role:"client"}])};
  throw new Error("Client write must be stopped");
 };
 const res=response();
 await createHandler({env,fetcher})(request({method:"POST",url:"/api/ooh",token:"examplevalidtoken123",body:{organisation_id:ORG,name:"Test",site:"Site",supplier:"Supplier",format:"Poster",starts_on:"2026-12-01",ends_on:"2026-12-10",total_budget_cents:1000}}),res);
 assert.equal(res.statusCode,403);
});
