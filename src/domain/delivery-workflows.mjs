/** Amplify delivery policy. Pure logic shared with the demo.
 * Production must separately enforce authenticated identity, evidence, RLS and tenant roles.
 */
export const OFFER_FAMILIES=["paid","organic","lead_engine"];
export const LEAD_MODES=["leads_only","leads_closing"];
export const ONBOARDING_INPUTS=["business_brief","brand_assets","account_access","offer_details","sales_capacity"];
export const BASE_GATES=["signed_scope","commercials_approved","billing_ready","delivery_owner","client_approver","client_access","client_assets","measurement_ready","qa_ready"];
export const OFFER_GATES={
 paid:["budget_approved","tracking_tested","creative_approved"],
 organic:["publishing_authorised","content_plan_approved"],
 leads_only:["icp_approved","data_standard_approved","replacement_rules_agreed"],
 leads_closing:["icp_approved","data_standard_approved","replacement_rules_agreed","outreach_authorised","suppression_checked","script_approved","handoff_destination"]
};
function deny(msg){throw new Error(msg)}
function role(actor,roles){if(!actor||!roles.includes(actor.role))deny("Actor role is not authorised")}
function version(x,n){if(!Number.isSafeInteger(n)||n<0||n!==x.version)deny("Stale record version")}
function clientOwns(x,actor){if(actor.role==="client"&&(!actor.account||x.account!==actor.account))deny("Client account mismatch")}
function clone(x){return JSON.parse(JSON.stringify(x))}
function log(x,action,actor,meta){x.history=Array.isArray(x.history)?x.history:[];x.history.push({action,actor:actor.role,at:new Date().toISOString(),meta});x.version++}
export function normaliseOffer(offer,mode){
 if(!OFFER_FAMILIES.includes(offer))deny("Unknown offer family");
 if(offer==="lead_engine"&&!LEAD_MODES.includes(mode))deny("Lead Engine requires a contracted mode");
 if(offer!=="lead_engine"&&mode!==null&&mode!==undefined&&mode!=="")deny("Only Lead Engine has a mode");
 return {offer,mode:offer==="lead_engine"?mode:null};
}
export function requiredGates(w){
 const o=normaliseOffer(w.offer,w.mode);
 return [...BASE_GATES,...OFFER_GATES[o.offer==="lead_engine"?o.mode:o.offer]];
}
export function evaluateLaunch(w){
 let missing=[];
 try{for(const g of requiredGates(w))if(w.gates?.[g]!==true)missing.push(g)}
 catch{return {ready:false,missing:["invalid_offer"]}}
 if(!String(w.scopeVersion||"").trim())missing.push("scope_version");
 if(w.handoff?.status!=="accepted")missing.push("bm_handoff");
 for(const g of ONBOARDING_INPUTS)if(w.inputs?.[g]?.status!=="verified")missing.push("input_"+g);
 if(!["pending","active","paused"].includes(w.status))missing.push("valid_status");
 return {ready:missing.length===0,missing};
}
export function transitionWorkstream(w,command,payload,actor,expectedVersion){
 version(w,expectedVersion);role(actor,["management","staff"]);
 const p=payload||{},next=clone(w);
 if(command==="set_gate"){
  if(next.status==="active")deny("Pause delivery before changing launch evidence");
  if(!requiredGates(next).includes(p.gate))deny("Invalid launch gate");
  if(typeof p.value!=="boolean")deny("Gate requires boolean");
  if(p.value===true&&String(p.evidence||"").trim().length<6)deny("Evidence reference required");
  next.gates={...next.gates,[p.gate]:p.value};
  next.gateEvidence={...next.gateEvidence,[p.gate]:p.value?String(p.evidence).trim():null};
 }else if(command==="accept_handoff"){
  role(actor,["management"]);
  if(next.status!=="pending")deny("Handoffs are accepted before launch");
  if(next.handoff?.status==="accepted")deny("Already accepted");
  if(next.gates?.signed_scope!==true||next.gates?.delivery_owner!==true||!next.scopeVersion)deny("Signed scope and named owner required");
  next.handoff={status:"accepted",by:actor.role,at:new Date().toISOString()};
 }else if(command==="verify_input"){
  if(next.status==="active")deny("Pause delivery before re-verifying onboarding");
  if(!ONBOARDING_INPUTS.includes(p.input))deny("Unknown client input");
  if(next.inputs?.[p.input]?.status!=="submitted")deny("Input not submitted");
  if(String(p.evidence||"").trim().length<6)deny("Verification evidence required");
  next.inputs[p.input]={...next.inputs[p.input],status:"verified",evidence:String(p.evidence).trim()};
 }else if(command==="launch"||command==="resume"){
  role(actor,["management"]);
  if(next.status!==(command==="launch"?"pending":"paused"))deny("Invalid state for "+command);
  const assessment=evaluateLaunch(next);
  if(!assessment.ready)deny("Launch blocked: "+assessment.missing.join(", "));
  next.status="active";
 }else if(command==="pause"){
  role(actor,["management"]);
  if(next.status!=="active")deny("Only active workstreams can pause");
  next.status="paused";
 }else deny("Unrecognised action");
 log(next,command,actor,p);
 return next;
}
export function submitClientInput(w,input,note,actor,expectedVersion){
 version(w,expectedVersion);role(actor,["client"]);clientOwns(w,actor);
 if(!ONBOARDING_INPUTS.includes(input))deny("Unknown client input");
 if(!String(note||"").trim())deny("Description or reference required");
 if(!["pending","paused"].includes(w.status))deny("Onboarding updates require pending or paused delivery; request a scope change");
 if(String(note).trim().length>600)deny("Input note is too long");
 const next=clone(w);
 next.inputs={...next.inputs,[input]:{status:"submitted",note:String(note).trim(),evidence:null}};
 log(next,"client_input_submitted",actor,{input});
 return next;
}
export function checkBatch(batch,workstream,command,actor,expectedVersion){
 version(batch,expectedVersion);role(actor,["management","staff"]);
 if(batch.account!==workstream.account)deny("Batch account mismatch");
 if(workstream.offer!=="lead_engine"||!LEAD_MODES.includes(workstream.mode))deny("Lead Engine workstream required");
 if(!Array.isArray(batch.items)||!batch.items.length)deny("Batch needs leads");
 const next=clone(batch);
 if(command==="qa"){
  if(next.status!=="draft")deny("Only draft batches can pass QA");
  if(next.items.some(x=>!x.id||!x.business||!x.source||!x.verifiedOn||x.deduplicated!==true||x.qaPassed!==true))deny("Provenance, verification, deduplication and QA required");
  next.status="qa_passed";
 }else if(command==="deliver"){
  if(next.status!=="qa_passed")deny("Batch must pass QA before delivery");
  if(workstream.status!=="active")deny("Workstream must be active");
  next.status="delivered";
 }else deny("Unrecognised batch action");
 log(next,command,actor,{workstream:workstream.id});
 return next;
}
export function reviewLead(batch,leadId,decision,reason,actor,expectedVersion){
 version(batch,expectedVersion);role(actor,["client"]);clientOwns(batch,actor);
 if(!["delivered","partially_reviewed"].includes(batch.status))deny("Batch has not been delivered");
 if(!["accepted","rejected"].includes(decision))deny("Invalid decision");
 if(decision==="rejected"&&!String(reason||"").trim())deny("Rejection requires reason");
 if(String(reason||"").length>300)deny("Feedback is too long");
 const next=clone(batch),item=next.items.find(x=>x.id===leadId);
 if(!item)deny("Lead not found");
 if(item.decision)deny("Already reviewed");
 item.decision=decision;
 item.feedback=decision==="rejected"?String(reason).trim():"";
 next.status=next.items.every(x=>x.decision)?"reviewed":"partially_reviewed";
 log(next,"client_lead_reviewed",actor,{leadId,decision});
 return next;
}
