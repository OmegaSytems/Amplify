/**
 * Omega Amplify OOH API foundation (Node 20+).
 * No production secrets in the repository. Do not expose this without staging RLS review.
 * The write RPC must exist in a dedicated Amplify Supabase project.
 */
import {createServer} from "node:http";
import {validateFlightDraft,nextOOH,mayWrite} from "../domain/ooh-workflow.mjs";

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BODY=16*1024;
class HttpError extends Error{constructor(status,message){super(message);this.status=status}}
function send(res,code,obj){
 res.statusCode=code;
 res.setHeader("Content-Type","application/json; charset=utf-8");
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 res.setHeader("Referrer-Policy","no-referrer");
 res.end(JSON.stringify(obj));
}
function validUUID(s){if(!UUID.test(s||""))throw new HttpError(400,"Valid UUID required");return s}
function inputMoney(v){if(!Number.isSafeInteger(v)||v<=0)throw new HttpError(400,"Valid positive budget required");return v}
async function bodyJSON(req){
 if(req.headers["content-type"]?.split(";")[0]?.trim()!=="application/json")throw new HttpError(415,"application/json required");
 let total=0,parts=[];
 for await(const chunk of req){total+=chunk.length;if(total>MAX_BODY)throw new HttpError(413,"Request too large");parts.push(chunk)}
 let value;try{value=JSON.parse(Buffer.concat(parts).toString("utf8"))}catch{throw new HttpError(400,"Invalid JSON")}
 if(!value||typeof value!=="object"||Array.isArray(value))throw new HttpError(400,"JSON object required");
 return value;
}
export function createHandler({env=process.env,fetcher=fetch}={}){
 const base=env.SUPABASE_URL?.replace(/\/+$/,"");
 const publishable=env.SUPABASE_PUBLISHABLE_KEY;
 const secret=env.SUPABASE_SERVER_KEY;
 const configured=!!(base&&/^https:\/\//.test(base)&&publishable&&secret);
 const allowOrigin=env.AMPLIFY_ALLOWED_ORIGIN||"";
 async function remote(path,options={}){
  const key=options.auth?"publishable":"secret";
  const credential=key==="publishable"?publishable:secret;
  const headers={"apikey":credential,"Accept":"application/json","Content-Type":"application/json"};
  if(key==="secret"&&credential.split(".").length===3)headers.Authorization="Bearer "+credential;
  if(options.auth)headers.Authorization="Bearer "+options.auth;
  if(options.returning)headers.Prefer="return=representation";
  const response=await fetcher(base+path,{method:options.method||"GET",headers,body:options.body===undefined?undefined:JSON.stringify(options.body)});
  const text=await response.text();let data=null;
  try{data=text?JSON.parse(text):null}catch{throw new HttpError(502,"Upstream returned invalid JSON")}
  if(!response.ok){
    const status=response.status===401||response.status===403?403:response.status===409?409:502;
    throw new HttpError(status,status===409?"Update conflict":"Upstream service unavailable or access denied");
  }
  return data;
 }
 async function caller(req){
  const header=req.headers.authorization||"";
  if(!/^Bearer [^\s]{12,8192}$/.test(header))throw new HttpError(401,"Sign-in required");
  const token=header.slice(7);
  const user=await remote("/auth/v1/user",{auth:token});
  if(!user||!UUID.test(user.id||""))throw new HttpError(401,"Invalid login session");
  return {id:user.id};
 }
 async function member(userId,orgId){
  const qs=new URLSearchParams({select:"organisation_id,role",user_id:"eq."+userId,organisation_id:"eq."+orgId,limit:"1"});
  const items=await remote("/rest/v1/memberships?"+qs.toString());
  const role=Array.isArray(items)?items[0]?.role:null;
  if(!["owner","manager","staff","client"].includes(role))throw new HttpError(403,"Organisation access denied");
  return role;
 }
 async function doRequest(req,res){
  const origin=req.headers.origin;
  if(origin){
    const host=req.headers.host;
    const sameHost=origin==="https://"+host||origin==="http://"+host;
    if(origin!==allowOrigin&&!sameHost)throw new HttpError(403,"Origin not permitted");
    res.setHeader("Access-Control-Allow-Origin",origin);
    res.setHeader("Vary","Origin");
    res.setHeader("Access-Control-Allow-Headers","Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");
  }
  if(req.method==="OPTIONS"){res.statusCode=204;res.end();return}
  const path=new URL(req.url,"http://localhost");
  if(path.pathname==="/health"&&req.method==="GET"){send(res,configured?200:503,{status:configured?"configured":"needs_configuration"});return}
  if(!configured)throw new HttpError(503,"Amplify Supabase is not configured");
  const user=await caller(req);
  if(path.pathname==="/api/me"&&req.method==="GET"){
   const qs=new URLSearchParams({select:"organisation_id,role",user_id:"eq."+user.id});
   const memberships=await remote("/rest/v1/memberships?"+qs.toString());
   send(res,200,{user_id:user.id,memberships:Array.isArray(memberships)?memberships:[]});return;
  }
  if(path.pathname==="/api/ooh"&&req.method==="GET"){
   const orgId=validUUID(path.searchParams.get("organisation_id"));
   const role=await member(user.id,orgId);
   const name=role==="client"?"client_ooh_updates":"ooh_flights";
   const qs=new URLSearchParams({select:"*",organisation_id:"eq."+orgId,order:"updated_at.desc",limit:"100"});
   const rows=await remote("/rest/v1/"+name+"?"+qs.toString());
   send(res,200,{items:rows||[]});return;
  }
  if(path.pathname==="/api/ooh"&&req.method==="POST"){
   const input=await bodyJSON(req),orgId=validUUID(input.organisation_id);
   const role=await member(user.id,orgId);
   if(!mayWrite(role,"permission"))throw new HttpError(403,"Staff permission required");
   const draft={
    name:input.name,site:input.site,supplier:input.supplier,format:input.format,
    starts_on:input.starts_on,ends_on:input.ends_on,total_budget_cents:inputMoney(input.total_budget_cents)
   };
   try{validateFlightDraft(draft)}catch(e){throw new HttpError(400,e.message)}
   const result=await remote("/rest/v1/ooh_flights",{method:"POST",body:{organisation_id:orgId,...draft},returning:true});
   send(res,201,{flight:Array.isArray(result)?result[0]:result});return;
  }
  const match=path.pathname.match(/^\/api\/ooh\/([0-9a-f-]{36})\/actions$/i);
  if(match&&req.method==="POST"){
   const flightId=validUUID(match[1]);
   const input=await bodyJSON(req);
   if(!Number.isSafeInteger(input.expected_version)||input.expected_version<0)throw new HttpError(400,"Expected version required");
   const qs=new URLSearchParams({select:"*",id:"eq."+flightId,limit:"1"});
   const rows=await remote("/rest/v1/ooh_flights?"+qs.toString());
   const flight=Array.isArray(rows)?rows[0]:null;
   if(!flight)throw new HttpError(404,"Flight not found");
   const role=await member(user.id,flight.organisation_id);
   if(!mayWrite(role,input.action))throw new HttpError(403,"Staff action denied");
   if(input.expected_version!==flight.version)throw new HttpError(409,"Stale flight version");
   try{nextOOH(flight,input.action,input.payload||{},role)}catch(e){throw new HttpError(400,e.message)}
   const updated=await remote("/rest/v1/rpc/progress_ooh_flight",{method:"POST",body:{
    p_flight_id:flightId,p_expected_version:input.expected_version,p_action:input.action,p_payload:input.payload||{},p_actor_id:user.id
   }});
   send(res,200,{flight:updated});return;
  }
  throw new HttpError(404,"Endpoint not found");
 }
 return async function handler(req,res){
  try{await doRequest(req,res)}
  catch(e){if(res.writableEnded)return;const code=e instanceof HttpError?e.status:500;send(res,code,{error:e instanceof HttpError?e.message:"Internal server error"})}
 };
}
export function startServer({env=process.env,fetcher=fetch}={}){
 const port=Number(env.PORT||8788);
 const server=createServer(createHandler({env,fetcher}));
 return server.listen(port, "127.0.0.1");
}
