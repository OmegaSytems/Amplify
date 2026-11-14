import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import * as policy from "../src/domain/staff-operations.mjs";
function setup(){
 const script=fs.readFileSync(new URL("../src/operations/operations-os.js",import.meta.url),"utf8");
 const records=new Map(),window={localStorage:{getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)}};
 vm.runInNewContext(script,{window,Date,Math,JSON,Array,String,Object,Number},{filename:"operations-os.js"});
 window.AmplifyOperations.configure(policy);
 return window.AmplifyOperations;
}
function host(role="management",account="all"){
 const messages=[];
 return {state:{role,account},messages,data:{accounts:[{id:"a"},{id:"b"},{id:"c"}]},
 esc:String,button:(l,a,id)=>'<button>'+l+'</button>',pill:s=>s,topHeader:(t,d)=>'<h1>'+t+'</h1><p>'+d+'</p>',money:x=>"$"+x,accountName:x=>x,valueCard:(a,b)=>a+b,render(){},notify:s=>messages.push(s)};
}
test("seven staff pages render; clients cannot see internal records",()=>{
 const mod=setup();
 for(const [page] of mod.catalog){
  assert.match(mod.render(page,host()),/<h1>/);
  assert.match(mod.render(page,host("staff")),/<h1>/);
  assert.match(mod.render(page,host("client")),/Staff only/);
 }
});
test("staff qualification requires stage evidence",()=>{
 const mod=setup(),h=host("staff");
 mod.submit("advance-deal",{id:"sd1",to:"Qualified",buyer:"Owner",need:"More clients"},h);
 assert.equal(mod.inspect().deals[0].stage,"Qualified");
 mod.submit("advance-deal",{id:"sd1",to:"Meeting booked",meetingRef:"DEMO-MEETING",nextAction:"Prepare scope"},h);
 assert.equal(mod.inspect().deals[0].stage,"Meeting booked");
});
test("outreach requires manager authorisation",()=>{
 const mod=setup(),staff=host("staff");
 const v={id:"out1",scopeRef:"SOW",scriptVersion:"v1",sender:"Omega",channel:"Email",contactBasis:"Documented",suppressionRef:"DEMO-SUP",jurisdictionReviewRef:"DEMO-JUR"};
 mod.submit("authorise-outreach",v,staff);assert.equal(mod.inspect().outreach[0].status,"draft");
 mod.submit("authorise-outreach",v,host("management"));assert.equal(mod.inspect().outreach[0].status,"authorised");
});
test("independent QA blocks creator approval",()=>{
 const mod=setup();
 mod.submit("qa-submit",{id:"qa1",evidenceRef:"DEMO-EVIDENCE"},host("staff"));
 mod.submit("qa-approve",{id:"qa1",reviewRef:"DEMO-REVIEW"},host("staff"));
 assert.equal(mod.inspect().quality[0].status,"awaiting_review");
 mod.submit("qa-approve",{id:"qa1",reviewRef:"DEMO-REVIEW"},host("management"));
 assert.equal(mod.inspect().quality[0].status,"approved");
});
test("staff cannot modify finance",()=>{
 const mod=setup(),v={id:"f1",agencyFee:"5000",mediaSpend:"2000",labour:"1000",tools:"100",dataCost:"50"};
 mod.submit("finance-update",v,host("staff"));assert.equal(mod.inspect().finance[0].agencyFee,3000);
 mod.submit("finance-update",v,host("management"));assert.equal(mod.inspect().finance[0].agencyFee,5000);
});
