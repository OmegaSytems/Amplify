/* Omega Amplify — omnichannel marketing operations demo. No live integrations. */
(function (global) {
"use strict";
const KEY="omega-amplify-agency-demo-v1";
const channels=[
 ["Google Search","Search","PPC and intent-based search","Digital"],
 ["Google Display & YouTube","Display & Video","Display, remarketing and YouTube","Digital"],
 ["Meta (Facebook / Instagram)","Paid Social","Feed, Reels and lead ads","Digital"],
 ["TikTok Ads","Paid Social","Vertical creative and video ads","Digital"],
 ["LinkedIn Ads","B2B Paid Social","Account and decision-maker targeting","Digital"],
 ["Reddit Ads","Community Ads","Community and contextual advertising","Digital"],
 ["Pinterest Ads","Visual Search","Shoppable and visual discovery","Digital"],
 ["X Ads","Social Advertising","Conversation-led campaigns","Digital"],
 ["Quora Ads","Question Intent","Topic and question targeting","Digital"],
 ["AI / LLM Ads","Emerging Placement","Provider-specific AI answer/search advertising","Digital"],
 ["Programmatic / DSP","Programmatic","Cross-publisher audience buys","Digital"],
 ["Retail Media","Retail Media","Marketplace and in-store digital media","Digital"],
 ["Spotify & Podcast Ads","Audio","Streaming and host-read placements","Audio"],
 ["Radio","Broadcast","Live/recorded radio campaigns","Traditional"],
 ["TV / CTV / OTT","Video","Linear and connected television","Video"],
 ["Cinema","Cinema","Pre-show and venue-screen campaigns","OOH"],
 ["Billboards & Digital OOH","Out of Home","Roadside, screens and static formats","OOH"],
 ["Transit & Street Furniture","Out of Home","Bus, rail, shelter and street placements","OOH"],
 ["Venue & Retail Media","Out of Home","Gyms, centres, venues, POS and workplaces","OOH"],
 ["Events & Sponsorship","Field Marketing","Exhibitions, sampling and partnerships","OOH"],
 ["Print & Direct Mail","Print","Flyers, mail, magazines and local press","Traditional"],
 ["SEO / AEO / GEO","Organic Search","Search, answer engines and local discovery","Organic"],
 ["Email & Newsletters","Owned Media","Lifecycle, newsletter and nurture flows","Owned"],
 ["SMS / CRM Nurture","Owned Media","Consent-based follow-ups and reminders","Owned"],
 ["Influencers / Creators","Creator","Creator partnerships and usage rights","Partnership"],
 ["Affiliate & Referral","Partner","Performance-based partner referrals","Partnership"],
 ["Substack / Publications","Organic Publishing","Authority, editorial and newsletters","Organic"],
 ["Community & Organic Social","Organic Social","Reddit, social communities and engagement","Organic"]
];
const catalog=[
 ["agency-channels","Channel catalogue","layers","CAMPAIGN OPERATIONS","all"],
 ["agency-ooh","OOH campaigns","megaphone","PHYSICAL MEDIA","all"],
 ["agency-placements","Placement inventory","target","PHYSICAL MEDIA","staff"],
 ["agency-ops","OOH field operations","checkcircle","PHYSICAL MEDIA","staff"],
 ["agency-creatives","Creative studio","pen","CAMPAIGN OPERATIONS","all"],
 ["agency-media-plans","Media plans & budgets","wallet","CAMPAIGN OPERATIONS","staff"],
 ["agency-tracking","Attribution & tracking","chart","CAMPAIGN OPERATIONS","all"],
 ["agency-audiences","Audiences & research","users","CAMPAIGN OPERATIONS","staff"],
 ["agency-tests","Experiments & optimisation","spark","CAMPAIGN OPERATIONS","staff"],
 ["agency-email","Email & lifecycle","messages","CONTENT & GROWTH","all"],
 ["agency-search","SEO, AEO & GEO","search","CONTENT & GROWTH","all"],
 ["agency-publish","Publishing & distribution","calendar","CONTENT & GROWTH","staff"],
 ["agency-acquisition","Prosposals & offers","briefcase","CLIENT SUCCESS","staff"],
 ["agency-onboarding","Client onboarding","checkcircle","CLIENT SUCCESS","staff"],
 ["agency-success","Client success & renewals","users","CLIENT SUCCESS","staff"],
 ["agency-sla","SLAs & service quality","clock","CLIENT SUCCESS","staff"],
 ["agency-vendors","Media suppliers & partners","briefcase","FINANCE & COMPLIANCE","staff"],
 ["agency-spend","Budget approvals","wallet","FINANCE & COMPLIANCE","staff"],
 ["agency-compliance","Consent & compliance","shield","FINANCE & COMPLIANCE","staff"],
 ["agency-connect","Integrations status","settings","FINANCE & COMPLIANCE","staff"]
];
const d0=()=>({
 ooh:[
  {id:"o1",account:"a",name:"Western Sydney Dental Awareness",format:"Venue & Retail Media",location:"Example shopping centre, Western Sydney",supplier:"Example Media Partner",start:"2026-11-22",end:"2026-12-15",totalBudget:1400,approvedBudget:1400,spend:0,status:"Draft",target:"Local families",objective:"Qualified dental enquiries",cta:"Scan for information",tracking:"https://example.invalid/dental?utm_source=ooh",permissionRef:"",creativeRef:"",creativeApproved:false,capacityConfirmed:false,trackingTested:false,bookingRef:"",proofRef:"",lastCheck:"",removalRef:"",responseCount:0,qualified:0,notes:"Fictional placement, not booked."},
  {id:"o2",account:"c",name:"Commercial Fit-Out Partner Signage",format:"Event & Sponsorship",location:"Example trade event, Sydney",supplier:"Example Event Organiser",start:"2026-12-01",end:"2026-12-02",totalBudget:900,approvedBudget:0,spend:0,status:"Draft",target:"B2B procurement",objective:"Qualified quote requests",cta:"Book a consultation",tracking:"https://example.invalid/fitout?utm_source=event",permissionRef:"",creativeRef:"",creativeApproved:false,capacityConfirmed:false,trackingTested:false,bookingRef:"",proofRef:"",lastCheck:"",removalRef:"",responseCount:0,qualified:0,notes:"Fictional placement, not booked."}
 ],
 placements:[
  {id:"pl1",name:"Sample centre noticeboard",format:"Poster",area:"Sydney – North West",owner:"Example venue",price:90,leadDays:7,status:"Unverified",contact:"Demo-only supplier"},
  {id:"pl2",name:"Sample roadside digital screen",format:"DOOH",area:"Western Sydney",owner:"Example media owner",price:1300,leadDays:21,status:"Unverified",contact:"Demo-only supplier"},
  {id:"pl3",name:"Sample trade expo booth",format:"Event",area:"Sydney",owner:"Example organiser",price:850,leadDays:30,status:"Unverified",contact:"Demo-only supplier"}
 ],
 creatives:[
  {id:"cr1",account:"a",title:"Dental neighbourhood awareness",format:"Poster / DOOH",status:"Draft",owner:"Avery",claimsChecked:false,rightsChecked:false,clientApproved:false},
  {id:"cr2",account:"b",title:"Trainer spotlight vertical cut",format:"Short video",status:"Review",owner:"Avery",claimsChecked:true,rightsChecked:true,clientApproved:false}
 ],
 mediaPlans:[
  {id:"mp1",account:"a",name:"December acquisition mix",channel:"Google Search",budget:2000,approved:1500,spent:650,objective:"Enquiries",status:"Review"},
  {id:"mp2",account:"c",name:"Commercial trade outreach",channel:"Billboards & Digital OOH",budget:1400,approved:0,spent:0,objective:"Quote requests",status:"Draft"}
 ],
 tracking:[
  {id:"tr1",account:"a",campaign:"Dental awareness",medium:"OOH",code:"DENTAL-OFFLINE",destination:"https://example.invalid/dental",status:"Needs test",conversions:0},
  {id:"tr2",account:"b",campaign:"Fitness newsletter",medium:"Email",code:"FIT-EMAIL",destination:"https://example.invalid/fitness",status:"Needs test",conversions:0}
 ],
 audiences:[
  {id:"au1",account:"a",segment:"Families in service catchment",channel:"Paid + OOH",definition:"North-west suburbs; relevant service catchment",exclusion:"Outside service area",status:"Draft"},
  {id:"au2",account:"c",segment:"Commercial fit-out decision-makers",channel:"OOH + LinkedIn",definition:"Facilities and procurement buyers",exclusion:"Residential only",status:"Review"}
 ],
 tests:[{id:"ab1",account:"a",title:"CTA scan vs consultation",channel:"OOH",hypothesis:"Direct consultation CTA will drive more qualified leads",metric:"Qualified enquiries per placement",status:"Planning",winner:""}],
 email:[{id:"em1",account:"b",name:"New member welcome",channel:"Email",stage:"Draft",audience:"Opted-in members",consent:"Not verified",sends:0,opens:0}],
 search:[{id:"se1",account:"a",name:"Local landing page optimisation",type:"SEO",status:"In progress",owner:"Avery",target:"Local search discovery"},{id:"se2",account:"d",name:"FAQ and answer engine audit",type:"AEO",status:"Research",owner:"Avery",target:"Source-backed answers"}],
 publications:[{id:"pu1",account:"b",title:"Trainer spotlight",channel:"TikTok",status:"Awaiting approval",day:"2026-11-20"},{id:"pu2",account:"a",title:"Dental FAQ newsletter",channel:"Substack",status:"Draft",day:"2026-11-25"}],
 proposals:[{id:"pr1",account:"c",name:"Full-funnel proposal",amount:4300,stage:"Draft",scope:"Paid + Leads + Closing",expiry:"2026-12-10"}],
 onboarding:[{id:"ob1",account:"a",name:"Campaign account onboarding",owner:"Oliver",status:"In progress",contract:true,access:false,assets:true,baseline:false,kickoff:true}],
 success:[{id:"cs1",account:"a",manager:"Oliver",health:"At risk",nextReview:"2026-11-21",renewal:"2027-01-15",concern:"Creative approval turnaround",plan:"Review creative queue"}],
 sla:[{id:"sl1",account:"a",service:"Paid",promise:"Weekly campaign update",cadence:"Weekly",last:"2026-11-09",next:"2026-11-16",status:"Due soon"}],
 vendors:[{id:"ve1",name:"Example media supplier",category:"OOH",contact:"Sample only",terms:"Written permission required",status:"Unverified"}],
 approvals:[{id:"ap1",account:"a",title:"OOH media placement budget",type:"Media",amount:1400,status:"Pending",owner:"Oliver"}],
 compliance:[{id:"co1",account:"a",type:"Creative claims",resource:"OOH poster",owner:"Oliver",status:"Review",notes:"Proof and approvals required before release"}],
 integrations:[
  {name:"Supabase Auth + database",category:"Core",status:"Not configured",scope:"Server-side sessions and RLS"},
  {name:"Stripe Billing",category:"Finance",status:"Not configured",scope:"Subscriptions, invoices, webhooks"},
  {name:"Google Ads",category:"Paid",status:"Not configured",scope:"Campaign reporting"},
  {name:"Meta Ads",category:"Paid",status:"Not configured",scope:"Campaign reporting"},
  {name:"TikTok / LinkedIn / Reddit / Pinterest / X / Quora Ads",category:"Paid",status:"Not configured",scope:"Per-provider API access"},
  {name:"GA4 / Search Console",category:"Analytics",status:"Not configured",scope:"Attribution and search reporting"},
  {name:"Social publishing",category:"Organic",status:"Not configured",scope:"Accounts and publishing approval"},
  {name:"Email and SMS providers",category:"CRM",status:"Not configured",scope:"Consent-based messaging"},
  {name:"OOH supplier booking / proof",category:"Field",status:"Not configured",scope:"Bookings, site permissions, evidence"},
  {name:"Google Calendar / Zoom",category:"Operations",status:"Not configured",scope:"Meetings and appointments"}
 ],
 activity:[],selected:"",form:"",filter:"All"
});
let s;try{s=JSON.parse(localStorage.getItem(KEY)||"null");if(!s||!Array.isArray(s.ooh))s=d0();}catch{s=d0();}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}}
function createId(){return "ag"+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function allowed(role,page){const info=catalog.find(x=>x[0]===page);return !!info && (info[4]==="all"||role!=="client");}
function scope(records,h){return h.state.role==="client"?records.filter(x=>x.account===h.state.account):h.state.account==="all"?records:records.filter(x=>x.account===h.state.account);}
function render(page,h){
 const {esc:e,icon,button:btn,topHeader:head,panel,valueCard,tabular,td,pill,accountName,money,state}=h;
 if(!allowed(state.role,page))return head("Not available","This workspace is not part of your client account.");
 const manager=state.role==="management";
 const action=(label,cmd,id="",sty="small ghost")=>btn(label,cmd,id,sty);
 const box=(title,content,extra="")=>panel(title,content,extra);
 const row=(...parts)=>"<tr>"+parts.map(td).join("")+"</tr>";
 const tbl=(cols,rows)=>'<section class="panel">'+tabular(cols,rows)+'</section>';
 const empty='<p class="muted small">No records in this account.</p>';
 const stat=(label,num,detail,ico)=>valueCard(label,num,detail,ico);
 const toolbar=(title,subtitle,form,other)=>head(title,subtitle,(state.role==="client"||!form?"":action("＋ New "+form.replace("new-","").replace(/-/g," "),"agency-form",form,"primary"))+(other||""));
 const options=(arr)=>arr.map(x=>"<option>"+e(x)+"</option>").join("");
 const client=(id)=>e(accountName(id));
 const check=(ok,label)=>'<span class="pill '+(ok?"green":"yellow")+'">'+e(label)+": "+(ok?"Ready":"Pending")+"</span>";
 const ooh=s.ooh.filter(x=>state.role==="client"?x.account===state.account:state.account==="all"||x.account===state.account);
 const form=s.form?formUI(s.form,h):"";
 if(page==="agency-channels"){
  const types=[...new Set(channels.map(x=>x[3]))];
  return toolbar("Advertising channel hub","A single service catalogue for digital, physical, owned and partner media.",null)
    +'<div class="metric-grid">'+stat("Channels",channels.length,"Planning catalogue","layers")+stat("Physical media",channels.filter(x=>x[3]==="OOH").length,"OOH / place-based","target")+stat("Digital",channels.filter(x=>x[3]==="Digital").length,"Platform-dependent","megaphone")+stat("Connected APIs","0","No live providers","alert")+'</div>'
    +'<div class="agency-chiprow">'+types.map(x=>action(x,"agency-filter",x,s.filter===x?"primary":"small ghost")).join("")+action("All","agency-filter","All",s.filter==="All"?"primary":"small ghost")+'</div>'
    +'<div class="agency-grid">'+channels.filter(x=>s.filter==="All"||x[3]===s.filter).map(x=>'<div class="panel panel-pad"><span class="pill">'+e(x[3])+'</span><h3 class="agency-card-title">'+e(x[0])+'</h3><p class="small muted">'+e(x[2])+'</p><div class="spread">'+(state.role==="client"?"":action("Create plan","agency-form","new-plan"))+'<span class="tiny muted">API not connected</span></div></div>').join("")+'</div>'+form;
 }
 if(page==="agency-ooh"){
  const ready=ooh.filter(x=>x.status==="Live").length,spend=ooh.reduce((n,x)=>n+Number(x.spend||0),0),qual=ooh.reduce((n,x)=>n+Number(x.qualified||0),0);
  return toolbar("Out-of-home campaigns","Plan place-based media from brief to verified installation, monitoring and close-out.","new-ooh",action("Placement register","nav","agency-placements"))
  +'<div class="agency-notice">Demonstration: all sites and media owners are fictional. Booking, permission, proof and spend require verified external records before real campaigns can run.</div>'
  +'<div class="metric-grid">'+stat("Placement plans",ooh.length,"OOH in this scope","target")+stat("Live placements",ready,"Documented demo status","megaphone")+stat("Recorded spend",money(spend),"Example costs","wallet")+stat("Qualified outcomes",qual,"Unverified demo attribution","chart")+'</div>'
  +'<div class="agency-grid">'+ooh.map(x=>'<section class="panel panel-pad"><div class="spread">'+pill(x.format)+pill(x.status)+'</div><h3 class="agency-card-title">'+e(x.name)+'</h3><p class="small muted">'+client(x.account)+' · '+e(x.location)+'</p>'+(state.role==="client"?"":'<div class="agency-checks">'+check(!!x.permissionRef,"Site permission")+check(x.approvedBudget>=x.totalBudget&&x.totalBudget>0,"Budget")+check(x.creativeApproved&&!!x.creativeRef,"Creative")+check(x.capacityConfirmed,"Operations")+check(x.trackingTested,"Tracking")+'</div>')+'<div class="agency-dl"><span>Dates</span><b>'+e(x.start)+' — '+e(x.end)+'</b>'+(state.role==="client"?"":'<span>Budget</span><b>'+money(x.totalBudget)+'</b><span>Supplier</span><b>'+e(x.supplier)+'</b>')+'<span>Responses</span><b>'+e(x.responseCount)+'</b></div><div class="agency-actions">'+action(state.role==="client"?"View flight":"Manage flight","agency-select-ooh",x.id,"primary")+'</div></section>').join("")+'</div>'
  +(s.selected?oohDetail(s.selected,h):"")+form;
 }
 if(page==="agency-placements"){
  return toolbar("Placement inventory","Compare site formats, catchments, suppliers, lead times and quoted rates.","new-placement")
   +'<div class="agency-notice">Rates are illustrative placeholders, not live media inventory or verified prices.</div>'
   +tbl(["PLACEMENT","FORMAT","CATCHMENT","MEDIA OWNER","RATE (DEMO)","LEAD TIME","STATUS"],s.placements.map(x=>row("<b>"+e(x.name)+"</b>",e(x.format),e(x.area),e(x.owner),money(x.price),e(x.leadDays)+" days",pill(x.status))))+form;
 }
 if(page==="agency-ops"){
  const checks=[["Pre-installation","Written site permission, approved brief, artwork specs, CTA URL, budget and supplier confirmation"],["Installation","Dated evidence of exact site, visibility, correct orientation, creative and live tracking"],["Live checks","Damage, vandalism, offers, QR destinations, lighting, expiry and operational capacity"],["Close-out","Removal confirmation, supplier invoice reconciliation, lead quality and attribution review"]];
  return toolbar("OOH field operations","Permission-led field execution, QA and incident response.",null)
  +'<div class="agency-grid">'+checks.map(([a,b],i)=>'<section class="panel panel-pad"><span class="agency-stage">'+(i+1)+'</span><h3 class="agency-card-title">'+e(a)+'</h3><p class="small muted">'+e(b)+'</p></section>').join("")+'</div>'
  +box("Campaign field queue",ooh.map(x=>'<div class="agency-line"><div><b>'+e(x.name)+'</b><p class="tiny muted">'+e(x.location)+' · '+e(x.start)+'</p></div><div>'+pill(x.status)+' '+action("Open","agency-select-ooh",x.id)+'</div></div>').join("")||empty)
  +(s.selected?oohDetail(s.selected,h):"")+form;
 }
 if(page==="agency-creatives"){
  return toolbar("Creative studio","Concepts, claims checks, source rights, client approvals and release readiness.","new-creative")
   +'<div class="agency-grid">'+scope(s.creatives,h).map(x=>'<section class="panel panel-pad"><div class="spread">'+pill(x.format)+pill(x.status)+'</div><h3 class="agency-card-title">'+e(x.title)+'</h3><p class="small muted">'+client(x.account)+' · '+e(x.owner)+'</p><div class="agency-checks">'+check(x.claimsChecked,"Claims")+check(x.rightsChecked,"Rights")+check(x.clientApproved,"Client approval")+'</div>'+(state.role==="client"?'':action("Next QA step","agency-creative-step",x.id))+'</section>').join("")+'</div>'+form;
 }
 if(page==="agency-media-plans"){
  const rows=scope(s.mediaPlans,h);
  return toolbar("Media plans & budgets","Channel mix, media spend, client approvals and pacing.","new-plan")
   +'<div class="metric-grid">'+stat("Planned",money(rows.reduce((n,x)=>n+x.budget,0)),"Example budget","wallet")+stat("Approved",money(rows.reduce((n,x)=>n+x.approved,0)),"Management sign-off","checkcircle")+stat("Spent",money(rows.reduce((n,x)=>n+x.spent,0)),"Illustrative spend","chart")+stat("Plans",rows.length,"Current scope","file")+'</div>'
   +tbl(["PLAN","ACCOUNT","CHANNEL","PLANNED","APPROVED","SPENT","STATUS",""],rows.map(x=>row(e(x.name),client(x.account),e(x.channel),money(x.budget),money(x.approved),money(x.spent),pill(x.status),manager?action("Approve budget","agency-approve-plan",x.id):"—")))+form;
 }
 if(page==="agency-tracking"){
  return toolbar("Attribution & tracking","QR codes, campaign URLs, call codes and conversion source quality.","new-tracking")
   +'<div class="agency-notice">A link marked as tested requires a real independent check. Demo statuses do not verify destination availability or true attribution.</div>'
   +tbl(["SOURCE / CAMPAIGN","CLIENT","MEDIUM","CODE","DESTINATION","STATUS","OUTCOMES"],scope(s.tracking,h).map(x=>row(e(x.campaign),client(x.account),e(x.medium),e(x.code),e(x.destination),pill(x.status),String(x.conversions))))+form;
 }
 if(page==="agency-audiences"){
  return toolbar("Audience research","Catchments, buyer intent, exclusions and channel suitability.","new-audience")
   +'<div class="agency-grid">'+scope(s.audiences,h).map(x=>'<section class="panel panel-pad"><span class="pill">'+e(x.channel)+'</span><h3 class="agency-card-title">'+e(x.segment)+'</h3><p class="small muted">'+client(x.account)+'</p><p><b>Include:</b> '+e(x.definition)+'</p><p><b>Exclude:</b> '+e(x.exclusion)+'</p>'+pill(x.status)+'</section>').join("")+'</div>'+form;
 }
 if(page==="agency-tests"){
  return toolbar("Experiments & optimisation","Hypotheses, success metrics and evidence-led test outcomes.","new-test")
   +tbl(["TEST","CLIENT","CHANNEL","HYPOTHESIS","PRIMARY METRIC","STATUS"],scope(s.tests,h).map(x=>row(e(x.title),client(x.account),e(x.channel),e(x.hypothesis),e(x.metric),pill(x.status))))+form;
 }
 if(page==="agency-email"){
  return toolbar("Email & lifecycle","Consent-led newsletters, CRM nurture and retention journeys.","new-email")
   +'<div class="agency-notice">No sending service is connected. Consent must be independently verified before outbound email or SMS.</div>'
   +tbl(["FLOW","ACCOUNT","CHANNEL","AUDIENCE","CONSENT","STATUS"],scope(s.email,h).map(x=>row(e(x.name),client(x.account),e(x.channel),e(x.audience),pill(x.consent),pill(x.stage))))+form;
 }
 if(page==="agency-search"){
  return toolbar("SEO, AEO & GEO","Technical audits, local visibility, answer optimisation and evidence-led publishing.","new-search")
   +tbl(["WORKSTREAM","CLIENT","TYPE","GOAL","OWNER","STATUS"],scope(s.search,h).map(x=>row(e(x.name),client(x.account),pill(x.type),e(x.target),e(x.owner),pill(x.status))))+form;
 }
 if(page==="agency-publish"){
  return toolbar("Publishing & distribution","Content scheduling and channel delivery queue.","new-publish")
   +tbl(["CONTENT","CLIENT","CHANNEL","DATE","STATUS",""],scope(s.publications,h).map(x=>row(e(x.title),client(x.account),e(x.channel),e(x.day),pill(x.status),action("Advance","agency-advance-publish",x.id))))+form;
 }
 if(page==="agency-acquisition"){
  return toolbar("Proposals & offers","Client opportunities, scoped service proposals and expiry tracking.","new-proposal")
   +tbl(["PROPOSAL","CLIENT","SCOPE","VALUE","STAGE","EXPIRY",""],scope(s.proposals,h).map(x=>row(e(x.name),client(x.account),e(x.scope),money(x.amount),pill(x.stage),e(x.expiry),action("Next stage","agency-advance-proposal",x.id))))+form;
 }
 if(page==="agency-onboarding"){
  return toolbar("Client onboarding","CRM → agreed scope → access & assets → baseline → kickoff → launch.","new-onboarding")
   +'<div class="agency-grid">'+scope(s.onboarding,h).map(x=>'<section class="panel panel-pad"><h3 class="agency-card-title">'+e(x.name)+'</h3><p class="small muted">'+client(x.account)+' · '+e(x.owner)+'</p><div class="agency-checks">'+check(x.contract,"Scope")+check(x.access,"Access")+check(x.assets,"Brand assets")+check(x.baseline,"Baseline")+check(x.kickoff,"Kickoff")+'</div><div style="margin-top:14px">'+action("Advance checklist","agency-onboarding-step",x.id)+'</div></section>').join("")+'</div>'+form;
 }
 if(page==="agency-success"){
  return toolbar("Client success & renewals","Account health, scheduled business reviews, risks and expansion opportunities.","new-success")
   +tbl(["CLIENT","MANAGER","HEALTH","NEXT REVIEW","RENEWAL","RISK","PLAN"],scope(s.success,h).map(x=>row(client(x.account),e(x.manager),pill(x.health),e(x.nextReview),e(x.renewal),e(x.concern),e(x.plan))))+form;
 }
 if(page==="agency-sla"){
  return toolbar("SLAs & service quality","Client delivery commitments and response cadence.","new-sla")
   +tbl(["CLIENT","SERVICE","COMMITMENT","CADENCE","LAST","NEXT","STATUS"],scope(s.sla,h).map(x=>row(client(x.account),e(x.service),e(x.promise),e(x.cadence),e(x.last),e(x.next),pill(x.status))))+form;
 }
 if(page==="agency-vendors"){
  return toolbar("Media suppliers & partners","Supplier records, placement terms, approvals and reliable contacts.","new-vendor")
   +tbl(["SUPPLIER","TYPE","CONTACT","TERMS","VERIFIED"],s.vendors.map(x=>row(e(x.name),e(x.category),e(x.contact),e(x.terms),pill(x.status))))+form;
 }
 if(page==="agency-spend"){
  return toolbar("Budget approvals","Spend controls separate from operational campaign editing.","new-spend")
   +tbl(["REQUEST","CLIENT","TYPE","AMOUNT","OWNER","STATUS",""],scope(s.approvals,h).map(x=>row(e(x.title),client(x.account),e(x.type),money(x.amount),e(x.owner),pill(x.status),manager?action("Approve","agency-approve-spend",x.id):"Manager only")))+form;
 }
 if(page==="agency-compliance"){
  return toolbar("Consent & compliance","Claims, usage rights, permissions, outreach consent and incident escalation.","new-compliance")
   +tbl(["CHECK","CLIENT","RESOURCE","OWNER","STATUS","NOTES"],scope(s.compliance,h).map(x=>row(e(x.type),client(x.account),e(x.resource),e(x.owner),pill(x.status),e(x.notes))))+form;
 }
 if(page==="agency-connect"){
  return toolbar("Integrations status","Track verified connector readiness; no provider is currently connected.",null)
   +'<div class="agency-notice">These statuses are explicit: this repository does not have real credentials, OAuth tokens or verified provider APIs.</div>'
   +tbl(["INTEGRATION","CATEGORY","SCOPE","STATUS"],s.integrations.map(x=>row(e(x.name),e(x.category),e(x.scope),pill(x.status))));
 }
 return toolbar("Marketing operations","No workspace configured.",null);
}
function oohDetail(id,h){
 const x=s.ooh.find(v=>v.id===id);if(!x)return "";
 if(h.state.role==="client"&&x.account!==h.state.account)return "";
 const e=h.esc,b=h.button,client=h.state.role==="client";
 const canBook=!!(x.permissionRef&&x.creativeApproved&&x.creativeRef&&x.capacityConfirmed&&x.trackingTested&&x.approvedBudget>=x.totalBudget&&x.totalBudget>0);
 const ctl=(label,action)=>b(label,action,x.id,"small ghost");
 const checklist=[
  ["Site permission",!!x.permissionRef],["Budget approval",x.approvedBudget>=x.totalBudget&&x.totalBudget>0],
  ["Creative and approval",!!x.creativeRef&&x.creativeApproved],["Service capacity",x.capacityConfirmed],
  ["Tracking check",x.trackingTested],["Supplier booking",!!x.bookingRef],
  ["Installation evidence",!!x.proofRef],["Live check",!!x.lastCheck],["Removal",!!x.removalRef]
 ];
 const statusLabel=label=>'<span class="pill '+(label[1]?"green":"yellow")+'">'+e(label[0])+" · "+(label[1]?"Yes":"No")+"</span>";
 const actions=client?"":[
  ctl("Record site permission","agency-permission"),ctl("Approve budget","agency-budget"),
  ctl("Creative approved","agency-creative"),ctl("Confirm capacity","agency-capacity"),
  ctl("Tracking check","agency-test-link"),ctl("Book placement","agency-book"),
  ctl("Record installation","agency-proof"),ctl("Live inspection","agency-inspect"),
  ctl("Record outcome","agency-outcome"),ctl("Close flight","agency-close-flight")
 ].join("");
 return '<section class="panel panel-pad agency-detail"><div class="spread"><div><h2>'+e(x.name)+'</h2><p class="small muted">'+e(x.location)+' · '+e(x.format)+' · '+e(x.status)+'</p></div>'+ctl("Close details","agency-close-detail")+'</div>'
 +'<div class="agency-notice">Physical media requires written permissions, approved creative and spend, appropriate service capacity, verified tracking and installation evidence. Demo references are not proof of real approval.</div>'
 +(client?"":'<div class="agency-checks">'+checklist.map(statusLabel).join("")+'</div>')
 +'<p class="small muted">Audience: '+e(x.target)+' · Objective: '+e(x.objective)+' · CTA: '+e(x.cta)+(client?"":" · Tracking: "+e(x.tracking))+'</p>'
 +'<div class="agency-actions">'+actions+'</div>'
 +(client?"":'<div class="small muted" style="margin-top:16px">Booking readiness: '+(canBook?"Ready for a recorded demo booking":"Missing required gates")+'. Installation reference: '+e(x.proofRef||"Not recorded")+'. Last check: '+e(x.lastCheck||"Not recorded")+'.</div>')
 +'</section>';
}
const forms={
 "new-ooh":[["name","Campaign title","text"],["account","Client","account"],["format","Format","select:Billboard|DOOH|Transit|Poster|Venue & Retail Media|Event & Sponsorship|Cinema|Street furniture|Print"],["location","Location / site","text"],["supplier","Media supplier","text"],["target","Audience","text"],["objective","Conversion objective","text"],["cta","Single CTA","text"],["tracking","Trackable URL","url"],["start","Start date","date"],["end","End date","date"],["totalBudget","Total all-in budget (AUD)","number"]],
 "new-placement":[["name","Placement name","text"],["format","Format","text"],["area","Catchment","text"],["owner","Media owner","text"],["price","Indicative AUD rate","number"],["leadDays","Booking lead time (days)","number"],["contact","Contact reference","text"]],
 "new-creative":[["title","Creative title","text"],["account","Client","account"],["format","Asset format","text"],["owner","Owner","text"]],
 "new-plan":[["name","Plan title","text"],["account","Client","account"],["channel","Channel","select:Google Search|Meta Ads|TikTok Ads|LinkedIn Ads|Reddit Ads|OOH|Podcast|Cinema|Email|Organic"],["budget","Budget (AUD)","number"],["objective","Objective","text"]],
 "new-tracking":[["campaign","Campaign name","text"],["account","Client","account"],["medium","Medium","text"],["code","Attribution code","text"],["destination","Landing destination","url"]],
 "new-audience":[["segment","Audience","text"],["account","Client","account"],["channel","Channel","text"],["definition","Include","textarea"],["exclusion","Exclude","textarea"]],
 "new-test":[["title","Test name","text"],["account","Client","account"],["channel","Channel","text"],["hypothesis","Hypothesis","textarea"],["metric","Success metric","text"]],
 "new-email":[["name","Flow name","text"],["account","Client","account"],["channel","Channel","select:Email|SMS|Newsletter"],["audience","Audience","text"]],
 "new-search":[["name","Workstream","text"],["account","Client","account"],["type","Category","select:SEO|AEO|GEO|Local SEO"],["target","Goal","text"]],
 "new-publish":[["title","Content title","text"],["account","Client","account"],["channel","Channel","text"],["day","Publish date","date"]],
 "new-proposal":[["name","Proposal title","text"],["account","Client","account"],["amount","Value (AUD)","number"],["scope","Included services","text"],["expiry","Expiry","date"]],
 "new-onboarding":[["name","Onboarding programme","text"],["account","Client","account"],["owner","Account owner","text"]],
 "new-success":[["account","Client","account"],["manager","Account manager","text"],["nextReview","Review date","date"],["renewal","Renewal date","date"],["concern","Primary risk","text"],["plan","Improvement plan","textarea"]],
 "new-sla":[["account","Client","account"],["service","Service","text"],["promise","Commitment","text"],["cadence","Frequency","select:Daily|Weekly|Fortnightly|Monthly"],["next","Next due","date"]],
 "new-vendor":[["name","Supplier","text"],["category","Type","text"],["contact","Contact","text"],["terms","Terms","textarea"]],
 "new-spend":[["title","Request title","text"],["account","Client","account"],["type","Spend category","select:Media|Production|Software|Freelancer|Other"],["amount","Amount (AUD)","number"],["owner","Request owner","text"]],
 "new-compliance":[["account","Client","account"],["type","Check type","select:Creative claims|Copyright|Site permission|Outreach consent|Privacy|Other"],["resource","Resource","text"],["owner","Owner","text"],["notes","Notes","textarea"]],
 "agency-permission":[["permissionRef","Written permission evidence reference","text"]],
 "agency-creative":[["creativeRef","Approved artwork reference","text"]],
 "agency-book":[["bookingRef","Supplier booking confirmation reference","text"]],
 "agency-proof":[["proofRef","Dated installation proof reference","text"]],
 "agency-inspect":[["lastCheck","Field inspection findings","textarea"]],
 "agency-outcome":[["responseCount","Responses","number"],["qualified","Qualified outcomes","number"],["spend","Actual spend (AUD)","number"]],
 "agency-close-flight":[["removalRef","Removal / close-out evidence reference","text"]]
};
function formUI(kind,h){
 const e=h.esc,icon=h.icon;
 let fields=forms[kind];if(!fields)return "";
 const field=([name,label,kind])=>{
  let ctl="";
  if(kind==="account"){
   const accounts=h.state.role==="client"?h.data.accounts.filter(x=>x.id===h.state.account):h.data.accounts;
   ctl='<select class="field-select" name="'+name+'" required>'+accounts.map(a=>'<option value="'+e(a.id)+'">'+e(a.name)+'</option>').join("")+'</select>';
  }else if(kind.startsWith("select:"))ctl='<select class="field-select" name="'+name+'" required>'+kind.slice(7).split("|").map(x=>'<option>'+e(x)+'</option>').join("")+'</select>';
  else if(kind==="textarea")ctl='<textarea class="field-textarea" name="'+name+'" required maxlength="1500"></textarea>';
  else ctl='<input class="field" type="'+kind+'" name="'+name+'" required '+(kind==="number"?'min="0" step="1"':"")+'>';
  return '<label class="agency-label">'+e(label)+ctl+'</label>';
 };
 return '<section class="panel panel-pad agency-form"><div class="spread"><h2>'+e(kind.replace(/-/g," "))+'</h2><button class="btn small ghost" data-action="agency-close-form">Cancel</button></div><form id="agency-form" data-agency-form="'+e(kind)+'" class="agency-form-grid">'+fields.map(field).join("")+'<div class="agency-form-actions"><button class="btn primary" type="submit">'+icon("check",14)+' Save demo record</button></div></form></section>';
}
function action(cmd,val,h){
 if(!cmd.startsWith("agency-"))return false;
 const manager=h.state.role==="management",staff=h.state.role!=="client";const record=s.ooh.find(x=>x.id===s.selected);
 const msg=x=>h.notify?.(x);const finish=x=>{persist();h.render();msg(x||"Saved to demo workspace.");};
 const deny=()=>{msg("This action is not available to client preview roles.");return true;};
 const demand=()=>{msg("Complete earlier approvals or booking gates first.");return true;};
 const select=()=>{if(!record)return false;return staff};
 if(cmd==="agency-filter"){s.filter=val;h.render();return true}
 if(cmd==="agency-select-ooh"){const rec=s.ooh.find(x=>x.id===val);if(rec&&(staff||rec.account===h.state.account)){s.selected=val;h.render();}return true}
 if(cmd==="agency-close-detail"){s.selected="";h.render();return true}
 if(cmd==="agency-close-form"){s.form="";h.render();return true}
 if(cmd==="agency-form"){if(!staff)return deny();s.form=val;h.render();return true}
 if(!staff)return deny();
 if(cmd==="agency-approve-plan"){if(!manager)return deny();const x=s.mediaPlans.find(x=>x.id===val);if(x){x.approved=x.budget;x.status="Approved";finish("Media plan budget approved in demo.");}return true;}
 if(cmd==="agency-approve-spend"){if(!manager)return deny();const x=s.approvals.find(x=>x.id===val);if(x){x.status="Approved";finish("Spend request approved in demo.");}return true;}
 if(cmd==="agency-creative-step"){const x=s.creatives.find(x=>x.id===val);if(x){if(!x.claimsChecked)x.claimsChecked=true;else if(!x.rightsChecked)x.rightsChecked=true;else if(!x.clientApproved){msg("Client approval must come from an authenticated client workflow.");return true;}x.status=x.claimsChecked&&x.rightsChecked?"Review":"Draft";finish("Internal creative QA updated.");}return true;}
 if(cmd==="agency-advance-publish"){const x=s.publications.find(x=>x.id===val);if(x){const order=["Draft","Awaiting approval","Approved","Scheduled","Published"];const idx=order.indexOf(x.status);if(idx>=1&&idx<=2){msg("Client approval and publishing verification are required before advancing this item.");return true;}x.status=order[Math.min(idx+1,1)];finish("Publishing draft moved forward.");}return true;}
 if(cmd==="agency-advance-proposal"){const x=s.proposals.find(x=>x.id===val);if(x){const order=["Draft","Internal review","Sent","Accepted"];const idx=order.indexOf(x.stage);if(idx>=1){msg("Sending, agreement acceptance and signatures require real workflows.");return true;}x.stage="Internal review";finish("Proposal moved to review.");}return true;}
 if(cmd==="agency-onboarding-step"){const x=s.onboarding.find(x=>x.id===val);if(x){const keys=["contract","access","assets","baseline","kickoff"];const next=keys.find(k=>!x[k]);if(next){x[next]=true;finish("Onboarding checklist updated in demo.");}else msg("All checklist items are marked complete.");}return true;}
 if(!record)return true;
 if(cmd==="agency-permission"){s.form=cmd;h.render();return true}
 if(cmd==="agency-budget"){if(!manager){msg("Manager budget approval required.");return true;}if(record.totalBudget<=0)return demand();record.approvedBudget=record.totalBudget;finish("Budget approved in demo.");return true}
 if(cmd==="agency-creative"){s.form=cmd;h.render();return true}
 if(cmd==="agency-capacity"){record.capacityConfirmed=true;finish("Operations readiness noted in demo.");return true}
 if(cmd==="agency-test-link"){if(!/^https:\/\//i.test(record.tracking)){msg("Tracking must use a HTTPS URL. Real tests are still required.");return true;}record.trackingTested=true;finish("Tracking check recorded in demo; live destination not verified.");return true}
 if(cmd==="agency-book"){const ok=!!(record.permissionRef&&record.creativeRef&&record.creativeApproved&&record.capacityConfirmed&&record.trackingTested&&record.totalBudget>0&&record.approvedBudget>=record.totalBudget);if(!ok)return demand();s.form=cmd;h.render();return true}
 if(cmd==="agency-proof"){if(!record.bookingRef)return demand();s.form=cmd;h.render();return true}
 if(cmd==="agency-inspect"){if(!record.proofRef)return demand();s.form=cmd;h.render();return true}
 if(cmd==="agency-outcome"){if(!record.proofRef)return demand();s.form=cmd;h.render();return true}
 if(cmd==="agency-close-flight"){if(!record.proofRef||!record.lastCheck)return demand();s.form=cmd;h.render();return true}
 return true;
}
function submit(kind,v,h){
 const staff=h.state.role!=="client",manager=h.state.role==="management";
 if(!forms[kind])return false;if(!staff)return true;
 const err=m=>{h.notify?.(m);return true};const account=v.account||h.state.account;
 const numeric=k=>Number(v[k]||0);
 const put=(table,item)=>s[table].unshift({id:createId(),account,...item});
 const record=s.ooh.find(x=>x.id===s.selected);
 if(kind==="new-ooh"){
  if(v.end<v.start||numeric("totalBudget")<=0)return err("Check dates and total budget.");
  put("ooh",{...v,totalBudget:numeric("totalBudget"),approvedBudget:0,spend:0,status:"Draft",permissionRef:"",creativeRef:"",creativeApproved:false,capacityConfirmed:false,trackingTested:false,bookingRef:"",proofRef:"",lastCheck:"",removalRef:"",responseCount:0,qualified:0,notes:"Demo-only, not booked."});
 }else if(kind==="new-placement")put("placements",{...v,price:numeric("price"),leadDays:numeric("leadDays"),status:"Unverified"});
 else if(kind==="new-creative")put("creatives",{...v,claimsChecked:false,rightsChecked:false,clientApproved:false,status:"Draft"});
 else if(kind==="new-plan")put("mediaPlans",{...v,budget:numeric("budget"),approved:0,spent:0,status:"Draft"});
 else if(kind==="new-tracking")put("tracking",{...v,status:"Needs test",conversions:0});
 else if(kind==="new-audience")put("audiences",{...v,status:"Draft"});
 else if(kind==="new-test")put("tests",{...v,status:"Planning",winner:""});
 else if(kind==="new-email")put("email",{...v,stage:"Draft",consent:"Not verified",sends:0,opens:0});
 else if(kind==="new-search")put("search",{...v,status:"Research",owner:"Avery"});
 else if(kind==="new-publish")put("publications",{...v,status:"Draft"});
 else if(kind==="new-proposal")put("proposals",{...v,amount:numeric("amount"),stage:"Draft"});
 else if(kind==="new-onboarding")put("onboarding",{...v,status:"In progress",contract:false,access:false,assets:false,baseline:false,kickoff:false});
 else if(kind==="new-success")put("success",{...v,health:"Needs review"});
 else if(kind==="new-sla")put("sla",{...v,last:"",status:"Draft"});
 else if(kind==="new-vendor")put("vendors",{...v,status:"Unverified"});
 else if(kind==="new-spend")put("approvals",{...v,amount:numeric("amount"),status:"Pending"});
 else if(kind==="new-compliance")put("compliance",{...v,status:"Review"});
 else {
  if(!record)return err("Select an OOH campaign first.");
  if(kind==="agency-permission")record.permissionRef=v.permissionRef;
  if(kind==="agency-creative"){record.creativeRef=v.creativeRef;record.creativeApproved=true;}
  if(kind==="agency-book"){if(!record.permissionRef||record.approvedBudget<record.totalBudget||!record.creativeApproved||!record.capacityConfirmed||!record.trackingTested)return err("Not ready to book.");record.bookingRef=v.bookingRef;record.status="Booked";}
  if(kind==="agency-proof"){if(record.status!=="Booked")return err("A booking is required before installation.");record.proofRef=v.proofRef;record.status="Live";}
  if(kind==="agency-inspect"){if(record.status!=="Live")return err("Only live placements can be inspected.");record.lastCheck=v.lastCheck;}
  if(kind==="agency-outcome"){if(!record.proofRef)return err("Installation evidence required.");record.responseCount=numeric("responseCount");record.qualified=numeric("qualified");record.spend=numeric("spend");}
  if(kind==="agency-close-flight"){if(record.status!=="Live"||!record.lastCheck)return err("Complete live checks first.");record.removalRef=v.removalRef;record.status="Closed";}
 }
 s.activity.unshift({id:createId(),kind,at:new Date().toISOString(),role:h.state.role});
 s.form="";persist();h.render();h.notify?.("Saved in demonstration data only.");return true;
}
function reset(){s=d0();persist()}
global.AmplifyAgency={channels,catalog,render,action,submit,reset,debug:()=>s};
})(window);
