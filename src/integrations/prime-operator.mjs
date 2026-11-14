/**
 * Omega Systems (Nexus Prime module) -> Omega Amplify delegated staff integration.
 * Use only the signed-in user's OMEGA SYSTEMS Auth token. NEVER a service-role key.
 * All customer access, including revocation and per-channel permissions, is enforced by Omega Systems RLS.
 * No token persistence and no automatic access to customer marketing accounts.
 */
const UUID=/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
const CHANNELS=new Set(["social","organic","paid","ooh"]);
function uuid(s){if(typeof s!=="string"||!UUID.test(s))throw new TypeError("Valid UUID required");return s}
function text(value){
 if(typeof value!=="string"||value.trim().length<1||value.length>200)throw new TypeError("Title must be 1–200 characters");
 return value.trim();
}
export function createPrimeOperatorClient({systemsUrl,systemsPublishableKey,getSystemsAccessToken,fetcher=fetch}={}){
 if(typeof systemsUrl!=="string"||(!/^https:\/\//.test(systemsUrl)&&!/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(systemsUrl)))
   throw new TypeError("Omega Systems backend HTTPS URL required");
 if(typeof systemsPublishableKey!=="string"||!systemsPublishableKey||typeof getSystemsAccessToken!=="function")
   throw new TypeError("Omega Systems public key and signed-in user's access-token supplier required");
 const url=systemsUrl.replace(/\/+$/,"");
 async function call(path,{method="GET",body,returning=false}={}){
   const token=await getSystemsAccessToken();
   if(typeof token!=="string"||token.length<12)throw new Error("Omega Systems sign-in required");
   const response=await fetcher(url+path,{
     method,headers:{"apikey":systemsPublishableKey,"Authorization":"Bearer "+token,
       "Content-Type":"application/json","Accept":"application/json",
       ...(returning?{"Prefer":"return=representation"}:{})},
     body:body===undefined?undefined:JSON.stringify(body)
   });
   const raw=await response.text();let parsed=null;
   try{parsed=raw?JSON.parse(raw):null}catch{throw new Error("Omega Systems returned invalid JSON")}
   if(!response.ok){
     if(response.status===401||response.status===403)throw new Error("Not authorised for this Nexus Prime customer in Omega Systems");
     if(response.status===409)throw new Error("Record changed; refresh and retry");
     throw new Error("Omega Systems request failed ("+response.status+")");
   }
   return parsed;
 }
 async function listAssignedAccounts(){
   // A manager can see the operator's grants; only individually assigned staff can
   // read customer marketing records. Server RLS re-evaluates every request.
   const grants=await call("/rest/v1/prime_operator_grants?select=id,customer_org_id,operator_org_id,scopes,expires_at,revoked_at&revoked_at=is.null");
   if(!Array.isArray(grants)||!grants.length)return [];
   const active=grants.filter(g=>!g.expires_at||Date.parse(g.expires_at)>Date.now());
   if(!active.length)return [];
   const ids=[...new Set(active.map(g=>uuid(g.customer_org_id)))];
   const orgs=await call("/rest/v1/prime_organisations?select=id,name&id=in.("+ids.join(",")+")");
   const map=new Map((Array.isArray(orgs)?orgs:[]).map(o=>[o.id,o.name]));
   return active.map(g=>({...g,customer_name:map.get(g.customer_org_id)||"Customer access pending assignment"}));
 }
 async function listDrafts(customerOrgId){
   return call("/rest/v1/prime_marketing_records?select=id,customer_org_id,channel,title,status,updated_at&customer_org_id=eq."+
     encodeURIComponent(uuid(customerOrgId))+"&order=updated_at.desc&limit=100");
 }
 async function createDraft(customerOrgId,channel,title){
   if(!CHANNELS.has(channel))throw new TypeError("Unknown marketing channel");
   return call("/rest/v1/prime_marketing_records",{method:"POST",returning:true,
     body:{customer_org_id:uuid(customerOrgId),channel,title:text(title),status:"draft"}});
 }
 async function updateDraft(id,expectedUpdatedAt,{title,status}){
   const values={};
   if(title!==undefined)values.title=text(title);
   if(status!==undefined){if(!["draft","submitted"].includes(status))throw new TypeError("Staff cannot approve or publish");values.status=status;}
   if(!Object.keys(values).length)throw new TypeError("No draft changes provided");
   if(typeof expectedUpdatedAt!=="string"||!Number.isFinite(Date.parse(expectedUpdatedAt)))throw new TypeError("Expected record update time required");
   const query=new URLSearchParams({id:"eq."+uuid(id),updated_at:"eq."+expectedUpdatedAt});
   const updated=await call("/rest/v1/prime_marketing_records?"+query.toString(),{method:"PATCH",body:values,returning:true});
   if(!Array.isArray(updated)||updated.length!==1)throw new Error("Record changed or access revoked; refresh and retry");
   return updated[0];
 }
 async function assignStaff(grantId,staffUserId){
   return call("/rest/v1/rpc/prime_assign_operator_staff",{method:"POST",body:{p_grant_id:uuid(grantId),p_staff_user_id:uuid(staffUserId)}});
 }
 async function unassignStaff(grantId,staffUserId){
   return call("/rest/v1/rpc/prime_unassign_operator_staff",{method:"POST",body:{p_grant_id:uuid(grantId),p_staff_user_id:uuid(staffUserId)}});
 }
 return {listAssignedAccounts,listDrafts,createDraft,updateDraft,assignStaff,unassignStaff};
}
