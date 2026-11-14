import {test} from "node:test";
import assert from "node:assert/strict";
import {createPrimeOperatorClient} from "../src/integrations/prime-operator.mjs";
const customer="11111111-1111-4111-8111-111111111111";
const grant="22222222-2222-4222-8222-222222222222";
const staff="33333333-3333-4333-8333-333333333333";
function setup(fetcher){
 return createPrimeOperatorClient({primeUrl:"https://prime-project.supabase.co",
   publishableKey:"public-test-key",getAccessToken:async()=> "user-session-for-testing-only",fetcher});
}
test("assigned accounts list uses Prime user token, not a server secret",async()=>{
 const calls=[];
 const api=setup(async(url,opts)=>{
   calls.push({url,opts});
   return new Response(JSON.stringify(url.includes("prime_operator_grants")?[{id:grant,customer_org_id:customer,scopes:["marketing:social"],revoked_at:null}]:[{id:customer,name:"Example Business"}]),
     {status:200,headers:{"Content-Type":"application/json"}});
 });
 const a=await api.listAssignedAccounts();
 assert.equal(a[0].customer_name,"Example Business");
 assert.equal(calls.length,2);
 for(const c of calls){assert.equal(c.opts.headers.Authorization,"Bearer user-session-for-testing-only");assert.equal(c.opts.headers.apikey,"public-test-key");}
});
test("no access grants never enumerates customer records",async()=>{
 let calls=0;
 const a=await setup(async()=>{calls++;return new Response("[]",{status:200});}).listAssignedAccounts();
 assert.deepEqual(a,[]);assert.equal(calls,1);
});
test("Prime database denials are surfaced rather than bypassed",async()=>{
 const api=setup(async()=>new Response('{"message":"denied"}',{status:403}));
 await assert.rejects(api.listDrafts(customer),/Not authorised/);
});
test("staff cannot approve or publish and requires expected update version",async()=>{
 const api=setup(async()=>{throw new Error("unexpected network request")});
 await assert.rejects(api.updateDraft(grant,"2026-11-14T00:00:00Z",{status:"approved"}),/cannot approve/);
 await assert.rejects(api.createDraft(customer,"unapproved","Example"),/Unknown marketing channel/);
 await assert.rejects(api.updateDraft(grant,"bad",{title:"New draft"}),/Expected record update time/);
});
test("staff assignment passes only requested identifiers to protected RPC",async()=>{
 let body;
 const api=setup(async(url,opts)=>{
   assert.match(url,/rpc\/prime_assign_operator_staff/);
   body=JSON.parse(opts.body);return new Response(null,{status:204});
 });
 await api.assignStaff(grant,staff);
 assert.deepEqual(body,{p_grant_id:grant,p_staff_user_id:staff});
});
