/** Internal Amplify operations. Pure transitions; demo only until server-enforced. */
export const STAGES=["Prospect","Qualified","Meeting booked","Proposal","Won","Lost","Handover accepted"];
export const ALLOWED={
 Prospect:["Qualified","Lost"],Qualified:["Meeting booked","Lost"],
 "Meeting booked":["Proposal","Lost"],Proposal:["Won","Lost"],Won:["Handover accepted"],
 Lost:[],"Handover accepted":[]
};
export const SEVERITIES=["Low","Medium","High","Critical"];
export const APPROVALS=["draft","submitted","approved","changes_requested"];
const fail=s=>{throw new Error(s)};
const text=(v,max=500)=>{const s=String(v??"").trim();if(!s||s.length>max)fail("Required text is missing or too long");return s};
const number=(v)=>{const n=Number(v);if(!Number.isFinite(n)||n<0)fail("Invalid non-negative number");return n};
const copy=x=>JSON.parse(JSON.stringify(x));
function guard(x,actor,version,roles=["management","staff"]){
 if(!actor||!roles.includes(actor.role))fail("Role not authorised");
 if(!Number.isInteger(version)||x.version!==version)fail("Stale record: refresh before acting");
 if(actor.role==="staff"&&x.assignee&&x.assignee!==actor.person)fail("Not assigned to this record");
}
function audit(x,actor,action,note){x.version++;x.history=[...(x.history||[]),{at:new Date().toISOString(),by:actor.person||actor.role,action,note}]}
export function advanceDeal(deal,to,fields,actor,version){
 guard(deal,actor,version);
 if(!ALLOWED[deal.stage]?.includes(to))fail("Invalid pipeline transition");
 const next=copy(deal),f=fields||{};
 if(to==="Qualified"&&(!next.source||!text(f.buyer,120)||!text(f.need,300)))fail("Qualification evidence required");
 if(to==="Meeting booked"&&(!text(f.meetingRef,120)||!text(f.nextAction,200)))fail("Meeting and next action required");
 if(to==="Proposal"&&(!text(f.proposalRef,120)||!text(f.pricingBasis,120)))fail("Proposal version and pricing basis required");
 if(to==="Won"){
  if(actor.role!=="management")fail("Manager must approve deal won");
  if(!text(f.signedScopeRef,160)||!text(f.priceApprovalRef,160))fail("Signed scope and pricing authority required");
 }
 if(to==="Lost"&&!text(f.lossReason,250))fail("Loss reason required");
 if(to==="Handover accepted"){
  if(actor.role!=="management")fail("BM acceptance required");
  if(!next.signedScopeRef||!text(f.deliveryOwner,120)||!text(f.handoffRef,120))fail("Signed scope, owner and handoff required");
 }
 Object.assign(next,Object.fromEntries(Object.entries(f).map(([k,v])=>[k,String(v).trim()])));
 next.stage=to;audit(next,actor,"pipeline:"+to,fields?.nextAction||"");
 return next;
}
export function assessOutreach(item,action,details,actor,version){
 guard(item,actor,version);
 const n=copy(item),d=details||{};
 if(action==="authorise"){
  if(actor.role!=="management")fail("Manager authorisation required");
  for(const key of ["scopeRef","scriptVersion","sender","channel","contactBasis","suppressionRef","jurisdictionReviewRef"])
   text(d[key],160);
  if(n.status!=="draft")fail("Only draft outreach may be authorised");
  Object.assign(n,d,{status:"authorised"});
 }else if(action==="log_attempt"){
  if(n.status!=="authorised")fail("Outreach not authorised");
  if(n.suppressed)fail("Suppressed contact");
  text(d.outcome,200);text(d.evidenceRef,160);
  n.attempts=[...(n.attempts||[]),{at:new Date().toISOString(),outcome:d.outcome,evidenceRef:d.evidenceRef}];
 }else if(action==="suppress"){
  text(d.reason,250);n.suppressed=true;n.status="stopped";n.stopReason=d.reason;
 }else fail("Unknown outreach action");
 audit(n,actor,action,d.reason||d.outcome||"");
 return n;
}
export function reviewQuality(item,action,details,actor,version){
 guard(item,actor,version,["management","staff"]);
 const n=copy(item),d=details||{};
 if(action==="submit"){
  if(n.status!=="draft"&&n.status!=="rework")fail("Item not ready for submission");
  text(d.evidenceRef,160);n.evidenceRef=d.evidenceRef;n.status="awaiting_review";
 }else if(action==="approve"||action==="reject"){
  if(n.status!=="awaiting_review")fail("Not awaiting review");
  if(actor.person===n.creator)fail("Independent reviewer required");
  text(d.reviewRef,160);
  n.reviewRef=d.reviewRef;n.reviewer=actor.person;
  n.status=action==="approve"?"approved":"rework";
  if(action==="reject")n.findings=text(d.findings,500);
 }else if(action==="open_incident"){
  if(!SEVERITIES.includes(d.severity))fail("Invalid severity");
  n.incident={severity:d.severity,rootCause:text(d.rootCause,500),correctiveAction:text(d.correctiveAction,500),status:"open"};
  n.status="blocked";
 }else if(action==="retest"){
  if(n.status!=="blocked"||!n.incident)fail("No blocked incident");
  if(actor.person===n.creator)fail("Independent retest required");
  text(d.retestEvidence,160);n.incident.status="closed";n.incident.retestEvidence=d.retestEvidence;n.status="rework";
 }else fail("Unknown QA action");
 audit(n,actor,action,d.reviewRef||d.evidenceRef||d.rootCause||"");
 return n;
}
export function calculateMargin(finance){
 const fee=number(finance.agencyFee),media=number(finance.mediaSpend),labour=number(finance.labour),tools=number(finance.tools),data=number(finance.dataCost);
 // Pass-through media excluded from agency revenue and delivery margin.
 const cost=labour+tools+data;
 return {agencyRevenue:fee,passThroughMedia:media,deliveryCost:cost,grossMargin:fee-cost,marginPercent:fee?Math.round(10000*(fee-cost)/fee)/100:null};
}
export function commissionEligible(record){
 return !!(record.signedScopeRef&&record.triggerEvidenceRef&&record.clientAcceptanceRef&&record.financeApprovalRef&&record.status==="approved"&&!record.disputed);
}
export function capacity(staff){
 const allocated=staff.allocations.reduce((a,b)=>a+number(b.hours),0);
 const available=number(staff.weeklyHours);
 return {allocated,available,remaining:available-allocated,overloaded:allocated>available};
}
export function clientHealth(account){
 const flags=[];
 if(account.openCritical>0)flags.push("Critical incident");
 if(account.overdueApprovals>0)flags.push("Overdue approvals");
 if(account.deliveryBlocked)flags.push("Delivery blocked");
 if(account.renewalDays<=30)flags.push("Renewal due");
 return {status:flags.some(x=>x==="Critical incident"||x==="Delivery blocked")?"At risk":flags.length?"Watch":"Healthy",flags};
}
