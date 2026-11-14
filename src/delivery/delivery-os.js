/* Amplify delivery journeys — interactive FICTIONAL browser demo only.
 * Not authentication, verified signatures, secure storage or live lead fulfilment.
 */
(function(global){
"use strict";
const KEY="omega-amplify-delivery-demo-v1";
const catalog=[
 ["delivery-scopes","Scopes & launch gates","shield","DELIVERY CONTROL"],
 ["delivery-onboarding","Onboarding inputs","tasks","DELIVERY CONTROL"],
 ["delivery-handoffs","Commercial handoffs","briefcase","DELIVERY CONTROL"],
 ["delivery-batches","Lead batches & acceptance","target","DELIVERY CONTROL"],
 ["delivery-changes","Scope changes","file","DELIVERY CONTROL"]
];
const inputLabels={business_brief:"Business and outcome brief",brand_assets:"Brand references and approved claims",account_access:"Account and analytics access",offer_details:"Offer, price and eligibility",sales_capacity:"Sales and fulfilment capacity"};
const gateLabels={signed_scope:"Signed and versioned scope",commercials_approved:"Commercials approved",billing_ready:"Payment and billing readiness",delivery_owner:"Named delivery owner",client_approver:"Client decision-maker",client_access:"Client access reviewed",client_assets:"Client assets available",measurement_ready:"Measurement plan ready",qa_ready:"Release QA complete",budget_approved:"Media budget approved",tracking_tested:"Conversion tracking tested",creative_approved:"Creative approved",publishing_authorised:"Publishing authority",content_plan_approved:"Editorial plan approved",icp_approved:"ICP and geography accepted",data_standard_approved:"Data/verification rules",replacement_rules_agreed:"Rejection and replacement rules",outreach_authorised:"Outreach and sender authorised",suppression_checked:"Suppression and contact-basis QA",script_approved:"Script/version approved",handoff_destination:"Closing handoff and stopping point"};
let policy,db;
function configure(p){policy=p}
const E=(h,v)=>h.esc(v);
const B=(h,title,action,value,cls="small ghost")=>h.button(title,action,value,cls);
const fmt=(s)=>String(s||"").replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase());
const stamp=()=>new Date().toLocaleDateString("en-AU");
function seedWork(id,account,offer,mode,active){
 const g={};for(const key of policy.requiredGates({offer,mode}))g[key]=active;
 if(!active){g.signed_scope=true;g.delivery_owner=true;g.client_approver=true;g.commercials_approved=true}
 const inputs={};for(const key of policy.ONBOARDING_INPUTS)inputs[key]={status:active?"verified":"needed"};
 if(!active)inputs.business_brief={status:"submitted",note:"Fictional brief supplied",evidence:null};
 return {id,account,offer,mode,title:offer==="lead_engine"?(mode==="leads_only"?"Verified lead research":"Lead research and appointments"):offer==="paid"?"Acquisition campaigns":"Content and discovery",scopeVersion:"DEMO-SOW-2026-v1",status:active?"active":"pending",gates:g,inputs,handoff:{status:active?"accepted":"pending"},version:0,history:[]};
}
function seed(){return{
 workstreams:[seedWork("dw-a-p","a","paid",null,false),seedWork("dw-a-l","a","lead_engine","leads_only",true),seedWork("dw-b-o","b","organic",null,true),seedWork("dw-b-c","b","lead_engine","leads_closing",false),seedWork("dw-c-l","c","lead_engine","leads_only",false),seedWork("dw-d-o","d","organic",null,false)],
 batches:[
 {id:"db-a-1",workstream:"dw-a-l",account:"a",title:"Demo Sydney B2B research — batch A",status:"delivered",version:0,items:[
 {id:"db-a-1-1",business:"Example Building Group",source:"Public company website",verifiedOn:"2026-11-13",deduplicated:true,qaPassed:true},
 {id:"db-a-1-2",business:"Example Clinic Network",source:"Public business directory",verifiedOn:"2026-11-13",deduplicated:true,qaPassed:true}
 ],history:[]},
 {id:"db-a-2",workstream:"dw-a-l",account:"a",title:"Demo Sydney B2B research — batch B",status:"draft",version:0,items:[
 {id:"db-a-2-1",business:"Sample Facilities Pty Ltd",source:"Official business page",verifiedOn:"2026-11-14",deduplicated:true,qaPassed:true}
 ],history:[]}
 ],
 changes:[]
 }}
function load(){
 if(db)return db;
 let saved;try{saved=JSON.parse(global.localStorage?.getItem(KEY)||"null")}catch{}
 db=saved&&Array.isArray(saved.workstreams)&&Array.isArray(saved.batches)&&Array.isArray(saved.changes)?saved:seed();
 return db;
}
function persist(){try{global.localStorage?.setItem(KEY,JSON.stringify(db))}catch{}}
function visible(h){
 const x=load().workstreams;
 if(h.state.role==="client")return x.filter(w=>w.account===h.state.account&&hasOffer(w,h));
 if(h.state.account!=="all")return x.filter(w=>w.account===h.state.account);
 return x;
}
function hasOffer(w,h){
 const account=h.data.accounts.find(a=>a.id===w.account);
 const key=w.offer==="lead_engine"?(w.mode==="leads_only"?"leads":"closing"):w.offer;
 return !!account?.services?.includes(key);
}
function work(id){return load().workstreams.find(x=>x.id===id)}
function batch(id){return load().batches.find(x=>x.id===id)}
function replace(table,obj){const rows=load()[table],index=rows.findIndex(x=>x.id===obj.id);if(index<0)throw new Error("Record not found");rows[index]=obj}
function actor(h){return {role:h.state.role,account:h.state.role==="client"?h.state.account:null}}
function scopedWork(id,h){const x=work(id);if(!x||!visible(h).some(v=>v.id===id))throw new Error("Workstream not in selected client");return x}
function scopedBatch(id,h){const x=batch(id);if(!x||!visible(h).some(w=>w.id===x.workstream))throw new Error("Lead batch not in selected client");return x}
function alert(h,message){h.notify(message)}
function mutate(h,fn){
 try{fn();persist();h.render();alert(h,"Saved to fictional demo records only.")}
 catch(err){alert(h,err.message||"Action could not be completed")}
}
function status(h,v){return h.pill(fmt(v))}
function offerLabel(w){return w.offer==="lead_engine"?(w.mode==="leads_only"?"Lead Engine · Leads Only":"Lead Engine · Leads + Closing"):(w.offer==="paid"?"Amplify Paid":"Amplify Organic")}
function cardHead(w,h){return '<div class="spread"><div><span class="tiny muted">'+E(h,h.accountName(w.account))+' · '+E(h,offerLabel(w))+'</span><h2 class="delivery-title">'+E(h,w.title)+'</h2><span class="small muted">Scope: '+E(h,w.scopeVersion)+' · v'+E(h,w.version)+'</span></div>'+status(h,w.status)+'</div>'}
function actionsForGates(w,h){
 const ready=policy.evaluateLaunch(w);
 const visibleGates=h.state.role==="client"?["signed_scope","client_approver","client_access","client_assets","measurement_ready"]:policy.requiredGates(w);
 const rows=visibleGates.map(g=>{
  const yes=w.gates?.[g]===true;
  const icon=yes?"✓":"!";
  const control=h.state.role==="client"||w.status==="active"?"":yes
   ?B(h,"Reopen","delivery-revoke-gate",w.id+"~"+g)
   :'<form class="delivery-inline" data-delivery-form="gate"><input type="hidden" name="workstream" value="'+E(h,w.id)+'"><input type="hidden" name="gate" value="'+E(h,g)+'"><label class="sr-only" for="gate-'+E(h,w.id)+"-"+E(h,g)+'">Evidence reference</label><input class="field delivery-field" id="gate-'+E(h,w.id)+"-"+E(h,g)+'" name="evidence" placeholder="Demo evidence ref" required minlength="6" maxlength="120">'+submitButton("Record")+'</form>';
  return '<li class="delivery-gate"><span class="delivery-flag '+(yes?"pass":"block")+'">'+icon+'</span><span>'+E(h,gateLabels[g]||fmt(g))+'</span>'+control+'</li>'
 }).join("");
 const blockers=ready.missing;
 return '<div class="delivery-summary">'+(ready.ready?status(h,"Ready for launch"):'<span class="pill yellow">'+blockers.length+' prerequisite(s) incomplete</span>')+'</div>'
  +'<ul class="delivery-gates">'+rows+'</ul>'
  +'<div class="delivery-actionrow">'+(h.state.role==="management"
   ? (w.handoff?.status!=="accepted"?B(h,"Accept handoff","delivery-accept-handoff",w.id,"small primary"):"")
    +(w.status==="pending"?B(h,"Activate demo workstream","delivery-launch",w.id,"small primary"):w.status==="active"?B(h,"Pause delivery","delivery-pause",w.id):B(h,"Resume delivery","delivery-resume",w.id))
   :"")+'</div>';
}
function submitButton(label){return '<button type="submit" class="btn small primary">'+label+'</button>'}
function scopes(h){
 const ws=visible(h);
 return h.topHeader("Scopes & launch gates","Contract scope, client responsibilities, handoff and measurable readiness before any real launch.")
 +'<p class="small muted">Gate references below are simulated. A signed agreement, verified payment and authenticated approver cannot be created by this preview.</p>'
 +'<div class="delivery-layout">'+ws.map(w=>'<section class="panel panel-pad">'+cardHead(w,h)+actionsForGates(w,h)+'</section>').join("")+'</div>';
}
function onboarding(h){
 const ws=visible(h);
 return h.topHeader("Client onboarding","Collect client inputs, then have staff independently verify prerequisites.")
 +'<div class="delivery-layout">'+ws.map(w=>'<section class="panel panel-pad">'+cardHead(w,h)+'<div class="delivery-input-list">'+policy.ONBOARDING_INPUTS.map(key=>{
 const entry=w.inputs?.[key]||{status:"needed"};
 let control="";
 if(h.state.role==="client"&&w.status!=="active")control='<form data-delivery-form="client-input" class="delivery-input-form"><input type="hidden" name="workstream" value="'+E(h,w.id)+'"><input type="hidden" name="input" value="'+E(h,key)+'"><label for="input-'+E(h,w.id)+E(h,key)+'" class="sr-only">Input note</label><textarea id="input-'+E(h,w.id)+E(h,key)+'" name="note" rows="2" maxlength="600" required placeholder="Reference or details — fictional examples only"></textarea>'+submitButton(entry.status==="verified"?"Resubmit for review":"Submit input")+'</form>';
 else if(entry.status==="submitted")control='<form data-delivery-form="verify-input" class="delivery-inline"><input type="hidden" name="workstream" value="'+E(h,w.id)+'"><input type="hidden" name="input" value="'+E(h,key)+'"><input class="field delivery-field" name="evidence" placeholder="Staff verification ref" minlength="6" maxlength="120" required>'+submitButton("Verify")+'</form>';
 return '<div class="delivery-input"><div class="spread"><strong>'+E(h,inputLabels[key])+'</strong>'+status(h,entry.status)+'</div>'+(entry.note?'<p class="small muted">'+E(h,entry.note)+'</p>':"")+control+'</div>';
 }).join("")+'</div></section>').join("")+'</div>';
}
function handoffs(h){
 if(h.state.role==="client")return h.topHeader("Commercial handoffs","Staff workspace only.");
 const ws=visible(h);
 return h.topHeader("Commercial handoffs","Sales → BM → delivery: accept only a documented scope, owner and handoff.")
 +'<div class="panel">'+h.tabular(["CLIENT","SERVICE","SCOPE VERSION","STATUS","HANDOFF","NEXT ACTION"],ws.map(w=>'<tr>'
 +h.td(E(h,h.accountName(w.account)))+h.td(E(h,offerLabel(w)))+h.td(E(h,w.scopeVersion))
 +h.td(status(h,w.status))+h.td(status(h,w.handoff?.status||"pending"))
 +h.td(w.handoff?.status==="accepted"?"Accepted":h.state.role==="management"?B(h,"Accept documented handoff","delivery-accept-handoff",w.id,"small primary"):"BM review required")+'</tr>'))+'</div>';
}
function batches(h){
 const ws=visible(h).filter(w=>w.offer==="lead_engine");
 const allowed=new Set(ws.map(w=>w.id));
 const rows=load().batches.filter(b=>allowed.has(b.workstream));
 let html=h.topHeader("Lead batches & acceptance","Traceable research → QA → delivery → client acceptance, rejection and replacement review.");
 html+='<p class="small muted">Fictional business examples only. No real leads, approved CSV exports, source verification or live replacement credits.</p>';
 if(h.state.role!=="client")html+='<section class="panel panel-pad"><h2>Create a draft research batch</h2><form class="delivery-form" data-delivery-form="new-batch"><label>Lead Engine workstream<select name="workstream" class="field-select" required>'+ws.map(w=>'<option value="'+E(h,w.id)+'">'+E(h,h.accountName(w.account))+' · '+E(h,offerLabel(w))+'</option>').join("")+'</select></label><label>Batch name<input class="field" name="title" required maxlength="120"></label><label>Fictional business<input class="field" name="business" required maxlength="120"></label><label>Source reference<input class="field" name="source" required maxlength="200"></label><label>Verification date<input class="field" type="date" name="verifiedOn" required></label><label><input type="checkbox" name="deduplicated" required> Deduplication check complete (demo)</label><label><input type="checkbox" name="qaPassed" required> Record QA evidence verified (demo)</label>'+submitButton("Create draft")+'</form></section>';
 html+='<div class="delivery-layout">'+rows.map(b=>{
 const w=work(b.workstream);
 let controls="";
 if(h.state.role!=="client")controls=(b.status==="draft"?B(h,"Release after QA","delivery-qa-batch",b.id,"small primary"):b.status==="qa_passed"?B(h,"Deliver batch","delivery-deliver-batch",b.id,"small primary"):"");
 const leads=b.items.map(item=>{
 const decision=item.decision?status(h,item.decision):"<span class='muted small'>Awaiting review</span>";
 let review="";
 if(h.state.role==="client"&&!item.decision&&["delivered","partially_reviewed"].includes(b.status)){
  review='<div class="delivery-actionrow">'+B(h,"Accept","delivery-accept-lead",b.id+"~"+item.id,"small primary")
    +'<form class="delivery-inline" data-delivery-form="reject-lead"><input type="hidden" name="batch" value="'+E(h,b.id)+'"><input type="hidden" name="lead" value="'+E(h,item.id)+'"><input class="field delivery-field" name="reason" maxlength="300" required placeholder="Contractual rejection reason">'+submitButton("Reject")+'</form></div>';
 }
 return '<div class="delivery-lead"><div class="spread"><strong>'+E(h,item.business)+'</strong>'+decision+'</div><p class="tiny muted">Source: '+E(h,item.source)+' · Verified: '+E(h,item.verifiedOn)+'</p>'+(item.feedback?'<p class="small muted">Client feedback: '+E(h,item.feedback)+'</p>':"")+review+'</div>';
 }).join("");
 return '<section class="panel panel-pad"><div class="spread"><h2>'+E(h,b.title)+'</h2>'+status(h,b.status)+'</div><p class="small muted">'+E(h,h.accountName(b.account))+' · '+E(h,offerLabel(w))+' · '+b.items.length+' records · v'+E(h,b.version)+'</p>'+leads+'<div class="delivery-actionrow">'+controls+'</div></section>';
 }).join("")+'</div>';
 return html;
}
function changes(h){
 const ws=visible(h),allowed=new Set(ws.map(x=>x.id));
 const requests=load().changes.filter(x=>allowed.has(x.workstream));
 const form='<section class="panel panel-pad"><h2>Request a scoped change</h2><p class="small muted">Requesting a change never automatically expands the contract.</p><form class="delivery-form" data-delivery-form="new-change"><label>Workstream<select class="field-select" name="workstream" required>'+ws.map(w=>'<option value="'+E(h,w.id)+'">'+E(h,h.accountName(w.account))+' · '+E(h,offerLabel(w))+'</option>').join("")+'</select></label><label>Proposed change<textarea name="note" rows="3" required maxlength="800" placeholder="Channel, geography, audience, workload or closing authority..."></textarea></label>'+submitButton("Request assessment")+'</form></section>';
 return h.topHeader("Scope change requests","New channel, volume or closing authority requires a fresh commercial and capacity assessment.")
 +form+'<div class="delivery-layout">'+requests.map(r=>'<section class="panel panel-pad"><div class="spread"><h2>'+E(h,work(r.workstream)?.title||"Workstream")+'</h2>'+status(h,r.status)+'</div><p class="small muted">'+E(h,r.note)+'</p><p class="tiny muted">Created '+E(h,r.at)+' by '+E(h,r.by)+'</p><div class="delivery-actionrow">'+(h.state.role==="client"?"":r.status==="requested"?B(h,"Reviewed — new SOW required","delivery-prepare-change",r.id,"small primary"):"")+'</div></section>').join("")+'</div>';
}
function render(page,h){
 if(!policy)return h.topHeader("Delivery unavailable","The shared workflow policy did not load.");
 if(page==="delivery-scopes")return scopes(h);
 if(page==="delivery-onboarding")return onboarding(h);
 if(page==="delivery-handoffs")return handoffs(h);
 if(page==="delivery-batches")return batches(h);
 if(page==="delivery-changes")return changes(h);
 return "";
}
function click(action,value,h){
 if(!action.startsWith("delivery-"))return false;
 mutate(h,()=>{
  const [id,extra]=String(value||"").split("~");
  let w,b;
  if(["delivery-accept-handoff","delivery-launch","delivery-pause","delivery-resume","delivery-revoke-gate"].includes(action)){
   w=scopedWork(id,h);
   const act={"delivery-accept-handoff":"accept_handoff","delivery-launch":"launch","delivery-pause":"pause","delivery-resume":"resume","delivery-revoke-gate":"set_gate"}[action];
   replace("workstreams",policy.transitionWorkstream(w,act,act==="set_gate"?{gate:extra,value:false}:{},actor(h),w.version));
  }else if(action==="delivery-qa-batch"||action==="delivery-deliver-batch"){
   b=scopedBatch(id,h);w=scopedWork(b.workstream,h);
   replace("batches",policy.checkBatch(b,w,action==="delivery-qa-batch"?"qa":"deliver",actor(h),b.version));
  }else if(action==="delivery-accept-lead"){
   b=scopedBatch(id,h);
   replace("batches",policy.reviewLead(b,extra,"accepted","",actor(h),b.version));
  }else if(action==="delivery-prepare-change"){
   if(h.state.role!=="management"&&h.state.role!=="staff")throw new Error("Staff role required");
   const change=load().changes.find(r=>r.id===id);
   if(!change||!visible(h).some(w=>w.id===change.workstream))throw new Error("Change not found");
   if(change.status!=="requested")throw new Error("Change already assessed");
   change.status="new_sow_required";
  }else throw new Error("Unknown delivery action");
 });
 return true;
}
function submit(kind,values,h){
 mutate(h,()=>{
  const w=values.workstream?scopedWork(values.workstream,h):null;
  if(kind==="client-input"){
   replace("workstreams",policy.submitClientInput(w,values.input,values.note,actor(h),w.version));
  }else if(kind==="verify-input"){
   replace("workstreams",policy.transitionWorkstream(w,"verify_input",{input:values.input,evidence:values.evidence},actor(h),w.version));
  }else if(kind==="gate"){
   replace("workstreams",policy.transitionWorkstream(w,"set_gate",{gate:values.gate,value:true,evidence:values.evidence},actor(h),w.version));
  }else if(kind==="new-batch"){
   if(h.state.role==="client")throw new Error("Client cannot create research batches");
   if(w.offer!=="lead_engine")throw new Error("Lead Engine scope required");
   const rid="demo-"+Math.random().toString(36).slice(2,12);
   load().batches.unshift({id:rid,workstream:w.id,account:w.account,title:String(values.title).trim(),version:0,status:"draft",items:[{id:rid+"-1",business:String(values.business).trim(),source:String(values.source).trim(),verifiedOn:values.verifiedOn,deduplicated:values.deduplicated==="on",qaPassed:values.qaPassed==="on"}],history:[]});
  }else if(kind==="reject-lead"){
   const b=scopedBatch(values.batch,h);
   replace("batches",policy.reviewLead(b,values.lead,"rejected",values.reason,actor(h),b.version));
  }else if(kind==="new-change"){
   if(!String(values.note||"").trim())throw new Error("Describe the proposed change");
   load().changes.unshift({id:"change-"+Math.random().toString(36).slice(2,12),workstream:w.id,account:w.account,status:"requested",note:String(values.note).trim(),at:stamp(),by:h.state.role});
  }else throw new Error("Unknown delivery form");
 });
}
global.AmplifyDelivery={catalog,configure,render,click,submit,inspect:()=>JSON.parse(JSON.stringify(load()))};
})(window);
