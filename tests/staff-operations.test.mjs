import test from "node:test";import assert from "node:assert/strict";
import {advanceDeal,assessOutreach,reviewQuality,calculateMargin,commissionEligible,capacity,clientHealth} from "../src/domain/staff-operations.mjs";
const manager={role:"management",person:"Oliver"},staff={role:"staff",person:"Avery"};
const deal=()=>({id:"d",stage:"Prospect",source:"Website",assignee:"Avery",version:0,history:[]});
test("CRM requires stage evidence and manager signoff",()=>{
 const d=deal();assert.throws(()=>advanceDeal(d,"Won",{},staff,0),/Invalid/);
 let q=advanceDeal(d,"Qualified",{buyer:"Owner",need:"New clients"},staff,0);
 q=advanceDeal(q,"Meeting booked",{meetingRef:"DEMO-MEETING",nextAction:"Send proposal"},staff,1);
 q=advanceDeal(q,"Proposal",{proposalRef:"DEMO-P1",pricingBasis:"Retainer"},staff,2);
 assert.throws(()=>advanceDeal(q,"Won",{signedScopeRef:"SOW1",priceApprovalRef:"APP1"},staff,3),/Manager/);
 const w=advanceDeal(q,"Won",{signedScopeRef:"SOW1",priceApprovalRef:"APP1"},manager,3);
 assert.equal(w.stage,"Won");assert.equal(d.stage,"Prospect");
 assert.throws(()=>advanceDeal(w,"Handover accepted",{deliveryOwner:"Oliver",handoffRef:"BM1"},manager,3),/Stale/);
 assert.equal(advanceDeal(w,"Handover accepted",{deliveryOwner:"Oliver",handoffRef:"BM1"},manager,4).stage,"Handover accepted");
});
test("outreach blocked until authorisation and suppression wins",()=>{
 const x={id:"o",status:"draft",assignee:"Avery",version:0};
 assert.throws(()=>assessOutreach(x,"log_attempt",{outcome:"Call",evidenceRef:"LOG1"},staff,0),/authorised/);
 const fields=Object.fromEntries(["scopeRef","scriptVersion","sender","channel","contactBasis","suppressionRef","jurisdictionReviewRef"].map(k=>[k,"DEMO-"+k]));
 assert.throws(()=>assessOutreach(x,"authorise",fields,staff,0),/Manager/);
 let a=assessOutreach(x,"authorise",fields,manager,0);
 a=assessOutreach(a,"suppress",{reason:"Opt out"},staff,1);
 assert.throws(()=>assessOutreach(a,"log_attempt",{outcome:"Called",evidenceRef:"EVIDENCE"},staff,2),/authorised/);
});
test("independent QA and incident retest",()=>{
 let q={id:"q",status:"draft",creator:"Avery",assignee:"Avery",version:0};
 q=reviewQuality(q,"submit",{evidenceRef:"DEMO-EVIDENCE"},staff,0);
 assert.throws(()=>reviewQuality(q,"approve",{reviewRef:"DEMO-REVIEW"},staff,1),/Independent/);
 q=reviewQuality(q,"open_incident",{severity:"Critical",rootCause:"Tracking mismatch",correctiveAction:"Rebuild tracking"},manager,1);
 assert.equal(q.status,"blocked");
 assert.throws(()=>reviewQuality(q,"retest",{retestEvidence:"DEMO-RETEST"},staff,2),/Independent/);
 assert.equal(reviewQuality(q,"retest",{retestEvidence:"DEMO-RETEST"},manager,2).status,"rework");
});
test("finance excludes pass-through media",()=>{
 const m=calculateMargin({agencyFee:3000,mediaSpend:2000,labour:900,tools:100,dataCost:50});
 assert.equal(m.grossMargin,1950);assert.equal(m.passThroughMedia,2000);assert.equal(m.agencyRevenue,3000);
 assert.equal(commissionEligible({signedScopeRef:"SOW",triggerEvidenceRef:"T",clientAcceptanceRef:"A",financeApprovalRef:"F",status:"approved",disputed:false}),true);
 assert.equal(commissionEligible({status:"draft"}),false);
});
test("capacity and client health exceptions",()=>{
 assert.equal(capacity({weeklyHours:30,allocations:[{hours:20},{hours:15}]}).overloaded,true);
 assert.equal(clientHealth({openCritical:1,overdueApprovals:0,deliveryBlocked:false,renewalDays:90}).status,"At risk");
});
