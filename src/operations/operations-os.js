/* Amplify internal operations — fictional demo records, not Nexus Prime. */
(function(global){
"use strict";
const KEY="omega-amplify-internal-ops-v1";
const catalog=[
 ["ops-control","Agency control centre","grid"],
 ["ops-sales","Sales qualification","target"],
 ["ops-outreach","SDR authorisations","phone"],
 ["ops-qa","Independent QA & incidents","shield"],
 ["ops-finance","Agency finance & margin","wallet"],
 ["ops-capacity","Team capacity","clock"],
 ["ops-retention","Account health & renewals","chart"]
];
let rules,store;
function configure(p){rules=p}
function initial(){return{
 deals:[
 {id:"sd1",title:"Sample commercial fit-out enquiry",account:"c",stage:"Prospect",source:"Website",assignee:"Avery",nextAction:"Qualify buyer",version:0,history:[]},
 {id:"sd2",title:"Sample health services proposal",account:"a",stage:"Proposal",source:"Referral",assignee:"Avery",proposalRef:"DEMO-P1",pricingBasis:"Monthly",nextAction:"Confirm scope",version:0,history:[]}
 ],
 outreach:[{id:"out1",title:"Sample outbound sequence",account:"c",status:"draft",assignee:"Avery",suppressed:false,version:0,history:[],attempts:[]}],
 quality:[{id:"qa1",title:"Sample lead verification batch",account:"c",creator:"Avery",assignee:"Avery",status:"draft",version:0,history:[]},
 {id:"qa2",title:"Sample conversion tracking",account:"a",creator:"Avery",assignee:"Avery",status:"awaiting_review",evidenceRef:"DEMO-TRACKING",version:0,history:[]}],
 finance:[{id:"f1",account:"a",agencyFee:3000,mediaSpend:2200,labour:900,tools:100,dataCost:80,status:"draft",signedScopeRef:"",triggerEvidenceRef:"",clientAcceptanceRef:"",financeApprovalRef:"",disputed:false}],
 team:[{id:"t1",name:"Avery",weeklyHours:30,allocations:[{account:"a",hours:12},{account:"c",hours:22}]},{id:"t2",name:"Oliver",weeklyHours:40,allocations:[{account:"a",hours:10},{account:"b",hours:14}]}],
 health:[{id:"a",openCritical:0,overdueApprovals:1,deliveryBlocked:false,renewalDays:24},{id:"b",openCritical:0,overdueApprovals:0,deliveryBlocked:false,renewalDays:60},{id:"c",openCritical:1,overdueApprovals:0,deliveryBlocked:true,renewalDays:18}],
 activity:[]
}}
function db(){if(store)return store;let value;try{value=JSON.parse(global.localStorage?.getItem(KEY)||"null")}catch{}store=value&&Array.isArray(value.deals)&&Array.isArray(value.quality)?value:initial();return store}
function save(){try{global.localStorage?.setItem(KEY,JSON.stringify(store))}catch{}}
function visible(list,h){return list.filter(x=>h.state.account==="all"||x.account===h.state.account||!x.account)}
function e(h,x){return h.esc(x??"")}
function button(h,label,action,value,cls="small ghost"){return h.button(label,action,value,cls)}
function panel(h,title,body){return '<section class="panel panel-pad"><h2>'+e(h,title)+'</h2>'+body+'</section>'}
function header(h,title,desc){return h.topHeader(title,desc)+'<p class="small muted">Fictional internal agency records. Role selector is not authentication; no real messages, approvals, payroll or client data.</p>'}
function form(h,kind,fields,hidden={}){return '<form class="ops-form" data-ops-form="'+e(h,kind)+'">'+Object.entries(hidden).map(([k,v])=>'<input type="hidden" name="'+e(h,k)+'" value="'+e(h,v)+'">').join("")+fields.map(f=>{
 const [key,label,kind,options]=f;
 if(kind==="select")return '<label>'+e(h,label)+'<select name="'+e(h,key)+'" class="field-select" required>'+options.map(x=>'<option value="'+e(h,x)+'">'+e(h,x)+'</option>').join("")+'</select></label>';
 return '<label>'+e(h,label)+'<input class="field" name="'+e(h,key)+'" type="'+(kind||"text")+'" '+(kind==="number"?'min="0" step="0.01"':'')+' required maxlength="300"></label>';
 }).join("")+'<button class="btn primary small" type="submit">Record</button></form>'}
const input=(k,label)=>[k,label,"text"];
function find(kind,id,h){const record=db()[kind].find(x=>x.id===id);if(!record||!visible([record],h).length)throw Error("Record outside selected account");return record}
function replace(kind,record){const rows=db()[kind],i=rows.findIndex(x=>x.id===record.id);if(i<0)throw Error("Record missing");rows[i]=record}
function actor(h){return {role:h.state.role,person:h.state.role==="management"?"Oliver":"Avery"}}
function log(kind,title,h){db().activity.unshift({kind,title,by:actor(h).person,at:new Date().toISOString()});db().activity=db().activity.slice(0,100)}
function run(h,fn){try{fn();save();h.render();h.notify("Fictional agency record updated.")}catch(err){h.notify(err.message||"Action rejected")}}
function sales(h){return header(h,"Sales qualification & handover","Stage-gated prospect qualification, proposal and BM acceptance.")
 +'<div class="ops-grid">'+visible(db().deals,h).map(d=>{
 const steps=rules.ALLOWED[d.stage]||[];
 return panel(h,d.title,'<p>'+h.pill(d.stage)+' <span class="small muted">· '+e(h,h.accountName(d.account))+' · '+e(h,d.assignee)+' · v'+d.version+'</span></p><p class="small muted">Source: '+e(h,d.source)+' · Next: '+e(h,d.nextAction||"Not set")+'</p>'
 +steps.map(to=>form(h,"advance-deal",[
 ["buyer","Buyer / decision maker"],["need","Need / qualification"],
 ["meetingRef","Meeting reference"],["nextAction","Next action"],
 ["proposalRef","Proposal version"],["pricingBasis","Pricing basis"],
 ["signedScopeRef","Signed SOW reference"],["priceApprovalRef","Pricing approval"],
 ["deliveryOwner","Delivery owner"],["handoffRef","BM handoff reference"],["lossReason","Loss reason"]
 ].filter(x=>({Qualified:["buyer","need"],"Meeting booked":["meetingRef","nextAction"],Proposal:["proposalRef","pricingBasis"],Won:["signedScopeRef","priceApprovalRef"],Lost:["lossReason"],"Handover accepted":["deliveryOwner","handoffRef"]}[to]||[]).includes(x[0])),{id:d.id,to}) ).join(""));
 }).join("")+'</div>'}
function outreach(h){return header(h,"SDR authorisations & suppression","Approval is required before logging outreach. Opt-outs stop subsequent attempts.")
 +'<div class="ops-grid">'+visible(db().outreach,h).map(o=>panel(h,o.title,'<p>'+h.pill(o.status)+' · '+e(h,h.accountName(o.account))+'</p><p class="small muted">'+(o.attempts?.length||0)+' logged attempts</p>'
 +(o.status==="draft"&&h.state.role==="management"?form(h,"authorise-outreach",[
 input("scopeRef","Contracted scope"),input("scriptVersion","Script version"),input("sender","Authorised sender"),input("channel","Channel"),
 input("contactBasis","Contact basis"),input("suppressionRef","Suppression check"),input("jurisdictionReviewRef","Jurisdictional compliance review")
 ],{id:o.id}):"")
 +(o.status==="authorised"?form(h,"attempt-outreach",[input("outcome","Attempt outcome"),input("evidenceRef","Call/message evidence reference")],{id:o.id}):"")
 +(o.status!=="stopped"?form(h,"stop-outreach",[input("reason","Opt-out / stop reason")],{id:o.id}):"")
 )) .join("")+'</div>'}
function quality(h){return header(h,"Independent QA & incidents","Separate creator and reviewer. Critical issues block release until independently retested.")
 +'<div class="ops-grid">'+visible(db().quality,h).map(q=>panel(h,q.title,'<p>'+h.pill(q.status)+' · '+e(h,h.accountName(q.account))+' · Created by '+e(h,q.creator)+'</p>'
 +(q.incident?'<p class="small muted">Incident: '+e(h,q.incident.severity)+' · '+e(h,q.incident.rootCause)+'</p>':"")
 +(q.status==="draft"||q.status==="rework"?form(h,"qa-submit",[input("evidenceRef","Submission evidence")],{id:q.id}):"")
 +(q.status==="awaiting_review"?form(h,"qa-approve",[input("reviewRef","Independent review evidence")],{id:q.id})+form(h,"qa-reject",[input("reviewRef","Review evidence"),input("findings","Required corrections")],{id:q.id}):"")
 +(q.status!=="blocked"&&q.status!=="approved"?form(h,"qa-incident",[["severity","Severity","select",rules.SEVERITIES],input("rootCause","Root cause"),input("correctiveAction","Corrective action")],{id:q.id}):"")
 +(q.status==="blocked"?form(h,"qa-retest",[input("retestEvidence","Independent retest evidence")],{id:q.id}):"")
 )).join("")+'</div>'}
function finance(h){return header(h,"Agency finance & RevOps","Service fees and pass-through media spend are reported separately.")
 +'<div class="ops-grid">'+visible(db().finance,h).map(f=>{
 const m=rules.calculateMargin(f);
 return panel(h,h.accountName(f.account),'<div class="ops-stats"><div><b>'+h.money(m.agencyRevenue)+'</b><small>Agency fees</small></div><div><b>'+h.money(m.passThroughMedia)+'</b><small>Pass-through media</small></div><div><b>'+h.money(m.grossMargin)+'</b><small>Delivery margin</small></div><div><b>'+e(h,m.marginPercent===null?"N/A":m.marginPercent+"%")+'</b><small>Margin %</small></div></div>'
 +'<p class="small muted">Commission eligible: '+(rules.commissionEligible(f)?"Yes":"No — evidence/approval incomplete")+'</p>'
 +(h.state.role==="management"?form(h,"finance-update",[
 ["agencyFee","Agency fees (AUD)","number"],["mediaSpend","Media spend (AUD)","number"],["labour","Labour (AUD)","number"],["tools","Tools (AUD)","number"],["dataCost","Data (AUD)","number"]
 ],{id:f.id}):""));
 }).join("")+'</div>'}
function capacity(h){return header(h,"Team capacity","Staff hours allocated against available weekly capacity.")
 +'<div class="ops-grid">'+db().team.map(s=>{
 const c=rules.capacity(s);
 return panel(h,s.name,'<p>'+h.pill(c.overloaded?"Overloaded":"Within capacity")+' · '+c.allocated+'/'+c.available+' hours · '+c.remaining+' remaining</p>'
 +'<div class="ops-meter"><span style="width:'+Math.min(100,c.available?c.allocated/c.available*100:100)+'%"></span></div>'
 +s.allocations.map(a=>'<p class="small muted">'+e(h,h.accountName(a.account))+' · '+e(h,a.hours)+' h</p>').join("")
 +(h.state.role==="management"?form(h,"allocate",[["account","Account","select",h.data.accounts.map(a=>a.id)],["hours","Hours","number"]],{id:s.id}):"")
 );
 }).join("")+'</div>'}
function retention(h){return header(h,"Account health & renewals","Flag incidents, blocked delivery, overdue approvals and upcoming renewals.")
 +'<div class="ops-grid">'+visible(db().health,h).map(x=>{
 const health=rules.clientHealth(x);
 return panel(h,h.accountName(x.id),'<p>'+h.pill(health.status)+' · Renewal in '+e(h,x.renewalDays)+' days</p><p class="small muted">'+e(h,health.flags.join(" · ")||"No exceptions")+'</p>'
 +(h.state.role==="management"?form(h,"health-update",[
 ["openCritical","Open critical incidents","number"],["overdueApprovals","Overdue approvals","number"],["renewalDays","Days to renewal","number"],["deliveryBlocked","Delivery blocked?","select",["No","Yes"]]
 ],{id:x.id}):"")
 );
 }).join("")+'</div>'}
function control(h){
 const deals=visible(db().deals,h),qa=visible(db().quality,h),out=visible(db().outreach,h),health=visible(db().health,h);
 const risks=health.filter(x=>rules.clientHealth(x).status!=="Healthy");
 return header(h,"Agency control centre","Staff-only exceptions across sales, outreach, QA, margins and retention.")
 +'<div class="metric-grid">'+h.valueCard("Open opportunities",deals.filter(x=>!["Lost","Handover accepted"].includes(x.stage)).length,"Stage-gated sales","target")
 +h.valueCard("Outreach pending",out.filter(x=>x.status==="draft").length,"Authorisation required","phone")
 +h.valueCard("QA blocked",qa.filter(x=>x.status==="blocked").length,"Independent release lock","shield")
 +h.valueCard("Accounts to review",risks.length,"Retention and delivery risks","chart")+'</div>'
 +panel(h,"Operational exceptions",risks.map(x=>'<p>'+e(h,h.accountName(x.id))+' · '+e(h,rules.clientHealth(x).flags.join(", "))+'</p>').join("")||"<p>No current demo exceptions.</p>")
 +panel(h,"Activity history",db().activity.slice(0,12).map(x=>'<p class="small muted">'+e(h,x.at)+' · '+e(h,x.by)+' · '+e(h,x.title)+'</p>').join("")||"<p>No demo changes yet.</p>");
}
function render(page,h){
 if(h.state.role==="client")return h.topHeader("Staff only","Amplify internal operations are not part of the client interface.");
 if(!rules)return h.topHeader("Unavailable","Workflow rules missing.");
 const screens={"ops-control":control,"ops-sales":sales,"ops-outreach":outreach,"ops-qa":quality,"ops-finance":finance,"ops-capacity":capacity,"ops-retention":retention};
 return screens[page]?.(h)||"";
}
function submit(kind,values,h){
 run(h,()=>{
 if(h.state.role==="client")throw Error("Staff only");
 const a=actor(h),v=values;
 if(kind==="advance-deal"){const d=find("deals",v.id,h);const f={...v};delete f.id;delete f.to;replace("deals",rules.advanceDeal(d,v.to,f,a,d.version));log(kind,v.to+": "+d.title,h)}
 else if(["authorise-outreach","attempt-outreach","stop-outreach"].includes(kind)){
  const o=find("outreach",v.id,h);
  const cmd={"authorise-outreach":"authorise","attempt-outreach":"log_attempt","stop-outreach":"suppress"}[kind];
  replace("outreach",rules.assessOutreach(o,cmd,v,a,o.version));log(kind,o.title,h);
 }else if(kind.startsWith("qa-")){
  const q=find("quality",v.id,h),cmd={"qa-submit":"submit","qa-approve":"approve","qa-reject":"reject","qa-incident":"open_incident","qa-retest":"retest"}[kind];
  replace("quality",rules.reviewQuality(q,cmd,v,a,q.version));log(kind,q.title,h);
 }else if(kind==="finance-update"){
  if(a.role!=="management")throw Error("Finance management role required");
  const f=find("finance",v.id,h);
  const next={...f};for(const key of ["agencyFee","mediaSpend","labour","tools","dataCost"])next[key]=Number(v[key]);
  rules.calculateMargin(next);replace("finance",next);log(kind,f.account,h);
 }else if(kind==="allocate"){
  if(a.role!=="management")throw Error("Manager required");
  const t=db().team.find(x=>x.id===v.id);if(!t)throw Error("Staff member not found");
  const hours=Number(v.hours);if(!Number.isFinite(hours)||hours<0||hours>168)throw Error("Invalid hours");
  if(!h.data.accounts.some(x=>x.id===v.account))throw Error("Unknown account");
  t.allocations.push({account:v.account,hours});log(kind,t.name,h);
 }else if(kind==="health-update"){
  if(a.role!=="management")throw Error("Manager required");
  const x=db().health.find(y=>y.id===v.id);if(!x||!visible([x],h).length)throw Error("Account not found");
  for(const key of ["openCritical","overdueApprovals","renewalDays"]){const n=Number(v[key]);if(!Number.isInteger(n)||n<0)throw Error("Invalid health value");x[key]=n}
  x.deliveryBlocked=v.deliveryBlocked==="Yes";log(kind,x.id,h);
 }else throw Error("Unknown form");
 });
}
global.AmplifyOperations={catalog,configure,render,submit,inspect:()=>JSON.parse(JSON.stringify(db()))};
})(window);
