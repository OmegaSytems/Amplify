/**
 * Pure OOH workflow rules shared by server and tests.
 * Never use caller-supplied UI role alone to authorise actual mutations.
 * The server must resolve role from verified organisation membership.
 */
const allowedRoles = new Set(["owner","manager","staff","client"]);
const allowedActions = new Set(["permission","budget","creative","capacity","tracking","book","install","inspect","outcome","close","cancel"]);
function required(value,name){
 if(typeof value!=="string"||!value.trim()||value.length>512)throw new Error(name+" requires a short evidence reference");
 return value.trim();
}
function amount(v,name){
 if(!Number.isSafeInteger(v)||v<0)throw new Error("Invalid "+name);
 return v;
}
export function validateFlightDraft(f){
 if(!f||typeof f!=="object")throw new Error("Flight required");
 required(f.name,"name");required(f.site,"site");required(f.supplier,"supplier");required(f.format,"format");
 if(!/^\d{4}-\d{2}-\d{2}$/.test(f.starts_on)||!/^\d{4}-\d{2}-\d{2}$/.test(f.ends_on)||f.ends_on<f.starts_on)throw new Error("Invalid flight dates");
 amount(f.total_budget_cents,"total budget");
 if(f.total_budget_cents<=0)throw new Error("Nonzero media budget required");
 return true;
}
export function canSee(role){return allowedRoles.has(role)}
export function mayWrite(role,action){
 if(!allowedRoles.has(role)||!allowedActions.has(action))return false;
 if(role==="client")return false;
 if(["budget","cancel"].includes(action))return role==="manager"||role==="owner";
 return ["staff","manager","owner"].includes(role);
}
export function nextOOH(f,action,payload={},role){
 if(!mayWrite(role,action))throw new Error("Insufficient staff permissions");
 if(!f||typeof f!=="object")throw new Error("Missing flight");
 if(!["Draft","Booked","Live","Closed","Cancelled"].includes(f.status))throw new Error("Unknown flight status");
 const n={...f},draft=()=>{if(n.status!=="Draft")throw new Error("Action requires Draft status")};
 if(action==="permission"){draft();n.permission_ref=required(payload.ref,"permission");}
 if(action==="budget"){draft();if(role!=="owner"&&role!=="manager")throw new Error("Manager budget approval required");n.budget_approval_ref=required(payload.ref,"budget approval");n.approved_budget_cents=amount(payload.amount_cents,"approved budget");}
 if(action==="creative"){draft();n.creative_ref=required(payload.ref,"approved artwork");}
 if(action==="capacity"){draft();n.capacity_ref=required(payload.ref,"fulfilment verification");}
 if(action==="tracking"){
  draft();n.tracking_ref=required(payload.ref,"independent tracking verification");
  if(typeof payload.url!=="string"||!/^https:\/\//.test(payload.url))throw new Error("HTTPS tracking destination required");
  n.tracking_url=payload.url;
 }
 if(action==="book"){
  draft();
  for(const key of ["permission_ref","budget_approval_ref","creative_ref","capacity_ref","tracking_ref"])
    if(!n[key])throw new Error("Booking gate missing: "+key);
  if(amount(n.approved_budget_cents,"approved budget")<amount(n.total_budget_cents,"planned budget"))throw new Error("Over-budget booking denied");
  n.booking_ref=required(payload.ref,"supplier booking");n.status="Booked";
 }
 if(action==="install"){
  if(n.status!=="Booked")throw new Error("Installation requires booking");
  n.install_proof_ref=required(payload.ref,"dated installation proof");n.status="Live";
 }
 if(action==="inspect"){
  if(n.status!=="Live")throw new Error("Inspection requires live flight");
  n.inspection_ref=required(payload.ref,"inspection findings");
 }
 if(action==="outcome"){
  if(!["Live","Closed"].includes(n.status))throw new Error("Outcomes require live or closed flight");
  n.response_count=amount(payload.responses,"responses");n.qualified_count=amount(payload.qualified,"qualified outcomes");
  n.spend_cents=amount(payload.spend_cents,"spent amount");
  if(n.qualified_count>n.response_count)throw new Error("Qualified outcomes cannot exceed responses");
 }
 if(action==="close"){
  if(n.status!=="Live")throw new Error("Close-out requires live flight");
  if(!n.inspection_ref)throw new Error("Live inspection missing");
  n.removal_ref=required(payload.ref,"removal or close-out evidence");n.status="Closed";
 }
 if(action==="cancel"){
  if(!["Draft","Booked"].includes(n.status))throw new Error("Cancelled campaigns must be draft or booked");
  n.cancel_reason=required(payload.ref,"cancellation reason");n.status="Cancelled";
 }
 return n;
}
