import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import * as policy from "../src/domain/delivery-workflows.mjs";

function loadDemo(){
 const code=fs.readFileSync(new URL("../src/delivery/delivery-os.js",import.meta.url),"utf8");
 const store=new Map();
 const storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 const window={localStorage:storage};
 vm.runInNewContext(code,{window,Date,Math,JSON,String,Array,Object,Set},{filename:"delivery-os.js"});
 window.AmplifyDelivery.configure(policy);
 return window.AmplifyDelivery;
}
function host(role,account="a"){
 const messages=[];
 return {
  state:{role,account},messages,
  data:{accounts:[
   {id:"a",name:"Evergreen Dental",services:["paid","organic","leads"]},
   {id:"b",name:"Northside Fitness",services:["organic","closing"]}
  ]},
  esc:x=>String(x).replace(/</g,"&lt;").replace(/>/g,"&gt;"),
  button:(title,action,value)=>'<button data-action="'+action+'" data-id="'+value+'">'+title+'</button>',
  pill:x=>'<span>'+x+'</span>',
  topHeader:(title,desc)=>'<h1>'+title+'</h1><p>'+desc+'</p>',
  tabular:(headers,rows)=>'<table>'+rows.join("")+'</table>',
  td:x=>"<td>"+x+"</td>",
  accountName:id=>id,render(){},notify:s=>messages.push(s)
 };
}
test("all delivery pages render for management and staff; no staff handoffs for clients",()=>{
 const mod=loadDemo();
 for(const role of ["management","staff","client"]){
  const h=host(role);
  for(const [page] of mod.catalog){
   if(role==="client"&&page==="delivery-handoffs")continue;
   const html=mod.render(page,h);
   assert.ok(html.includes("<h1>"),role+":"+page);
  }
 }
 const clientHtml=mod.render("delivery-scopes",host("client"));
 assert.ok(!clientHtml.includes("Commercials approved"));
});
test("QA and delivery cannot be performed by clients; lead acceptance is scoped",()=>{
 const mod=loadDemo(),staff=host("staff"),client=host("client");
 mod.click("delivery-qa-batch","db-a-2",client);
 assert.equal(mod.inspect().batches.find(x=>x.id==="db-a-2").status,"draft");
 mod.click("delivery-qa-batch","db-a-2",staff);
 assert.equal(mod.inspect().batches.find(x=>x.id==="db-a-2").status,"qa_passed");
 mod.click("delivery-deliver-batch","db-a-2",staff);
 assert.equal(mod.inspect().batches.find(x=>x.id==="db-a-2").status,"delivered");
 mod.click("delivery-accept-lead","db-a-1~db-a-1-1",host("client","b"));
 assert.ok(!mod.inspect().batches.find(x=>x.id==="db-a-1").items[0].decision);
 mod.click("delivery-accept-lead","db-a-1~db-a-1-1",client);
 assert.equal(mod.inspect().batches.find(x=>x.id==="db-a-1").items[0].decision,"accepted");
});
test("active contracts require a scoped change instead of reopening onboarding",()=>{
 const mod=loadDemo(),client=host("client");
 mod.submit("client-input",{workstream:"dw-a-l",input:"brand_assets",note:"Changed image"},client);
 assert.equal(mod.inspect().workstreams.find(x=>x.id==="dw-a-l").inputs.brand_assets.status,"verified");
 assert.match(client.messages.at(-1),/Onboarding updates require/);
 mod.submit("new-change",{workstream:"dw-a-l",note:"Please expand to another geography"},client);
 assert.equal(mod.inspect().changes[0].status,"requested");
});
