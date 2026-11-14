/* Omega Amplify Staff OS — local demo workflows only, not authenticated or production-backed. */
(function (global) {
  "use strict";
  const KEY = "omega-amplify-staff-demo-v1";
  const fmtDate = d => new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"});
  const shortDate = d => new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"short"});
  const nowDay = () => new Date().toISOString().slice(0,10);
  const later = n => new Date(Date.now()+n*864e5).toISOString().slice(0,10);
  const makeId = () => "st"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  const staff = [
    {id:"p1",name:"Oliver",role:"Business Manager",team:"Client Success",type:"Management",status:"Active",skills:"Account management, QA, client onboarding"},
    {id:"p2",name:"Avery",role:"Organic Producer",team:"Organic Studio",type:"Delivery",status:"Active",skills:"Social, content, SEO and Substack"},
    {id:"p3",name:"Taylor",role:"Paid Media Specialist",team:"Paid Media",type:"Delivery",status:"Active",skills:"Google Ads, Meta Ads, analytics"},
    {id:"p4",name:"Morgan",role:"Lead Researcher",team:"Lead Engine",type:"Delivery",status:"Active",skills:"Data research, validation, enrichment"},
    {id:"p5",name:"Jordan",role:"Appointment Setter",team:"Closing",type:"Delivery",status:"Active",skills:"Qualification, outreach, scheduling"},
    {id:"p6",name:"Riley",role:"Finance Administrator",team:"Operations",type:"Operations",status:"Active",skills:"Invoices, expenses, compliance"},
    {id:"p7",name:"Casey",role:"Account Manager",team:"Client Success",type:"Delivery",status:"Active",skills:"Client communication, renewals"}
  ];
  const catalog = [
    ["staff-hub","My day","grid","MY WORK"],
    ["work-tracker","Work tracker","clock","MY WORK"],
    ["timesheets","Timesheets & summaries","file","MY WORK"],
    ["staff-roster","Roster & availability","calendar","MY WORK"],
    ["staff-leave","Leave & absences","calendar","MY WORK"],
    ["staff-kpis","KPIs & performance","chart","DEVELOPMENT"],
    ["staff-growth","Growth & feedback","spark","DEVELOPMENT"],
    ["staff-training","Training & competencies","checkcircle","DEVELOPMENT"],
    ["staff-knowledge","SOPs & knowledge","folder","DEVELOPMENT"],
    ["staff-directory","Staff directory","users","TEAM"],
    ["staff-chat","Team chat","messages","TEAM"],
    ["staff-inbox","Inbox & announcements","bell","TEAM"],
    ["staff-meetings","Meetings & outcomes","calendar","TEAM"],
    ["staff-recognition","Recognition","star","TEAM"],
    ["staff-quality","Delivery quality","shield","DELIVERY"],
    ["staff-workflows","Service playbooks","layers","DELIVERY"],
    ["staff-recruitment","Recruitment & onboarding","briefcase","MANAGEMENT"],
    ["staff-approvals","Operational approvals","checkcircle","MANAGEMENT"],
    ["staff-expenses","Expenses & purchases","wallet","MANAGEMENT"],
    ["staff-equipment","Assets & software","folder","MANAGEMENT"],
    ["staff-helpdesk","Internal helpdesk","support","MANAGEMENT"],
    ["staff-people-reports","People reporting","chart","MANAGEMENT"],
    ["staff-access","Roles & permissions","lock","MANAGEMENT"]
  ];
  const seed=()=>({
    people:staff,
    availability:[{person:"Avery",day:"Monday",start:"09:00",end:"17:00"},{person:"Avery",day:"Tuesday",start:"09:00",end:"17:00"},{person:"Oliver",day:"Monday",start:"09:00",end:"18:00"}],
    roster:[{id:"rs1",person:"Avery",day:later(1),start:"09:00",end:"17:00",team:"Organic Studio"},{id:"rs2",person:"Oliver",day:later(1),start:"09:00",end:"17:00",team:"Client Success"},{id:"rs3",person:"Taylor",day:later(2),start:"10:00",end:"16:00",team:"Paid Media"}],
    leave:[{id:"lv1",person:"Avery",type:"Annual",start:later(17),end:later(19),reason:"Personal leave",status:"Pending"}],
    workEntries:[],
    shifts:[{id:"sh1",person:"Avery",day:later(-1),hours:2.5,taskIds:["t3"],status:"Submitted",summary:"Drafted and reviewed social captions; remaining creative QA tomorrow.",remaining:"Schedule approved version",blockers:"Awaiting client review",questions:"Should we prioritise Reels this week?",selfRating:4,managerRating:"",reviewNote:""}],
    timer:null,
    selectedTask:"t3",
    kpis:[{id:"k1",person:"Avery",metric:"Content delivered on schedule",target:95,actual:91,unit:"%",evidence:"6 of 7 posts ready",status:"Needs review"},{id:"k2",person:"Taylor",metric:"Campaign QA completion",target:100,actual:98,unit:"%",evidence:"Tracking checks completed",status:"On track"},{id:"k3",person:"Morgan",metric:"Lead validation quality",target:98,actual:96,unit:"%",evidence:"Sampling log",status:"On track"},{id:"k4",person:"Oliver",metric:"Account update timeliness",target:95,actual:93,unit:"%",evidence:"Weekly review",status:"On track"}],
    goals:[{id:"g1",person:"Avery",title:"Lead the editorial review process",milestone:"Run two content audits independently",privacy:"Shared with manager",progress:60,status:"In progress"}],
    training:[{id:"tr1",name:"Amplify onboarding",team:"All staff",minutes:35,status:"Complete"},{id:"tr2",name:"Client communication & confidentiality",team:"All staff",minutes:25,status:"In progress"},{id:"tr3",name:"Meta and Google Ads QA",team:"Paid Media",minutes:50,status:"Not started"},{id:"tr4",name:"Organic SEO/AEO editorial quality",team:"Organic Studio",minutes:45,status:"Not started"},{id:"tr5",name:"Lead sourcing, accuracy and privacy",team:"Lead Engine",minutes:40,status:"Not started"},{id:"tr6",name:"Appointment setting and consent",team:"Closing",minutes:45,status:"Not started"}],
    sops:[{id:"so1",title:"Client onboarding and handover",area:"Client Success",body:"Receive handover, verify scope and subscription, request assets and access, establish KPIs, approve launch plan."},{id:"so2",title:"Paid advertising launch QA",area:"Paid Media",body:"Verify campaign objectives, audience, consent, tracking, budget, creative sign-off and reporting."},{id:"so3",title:"Content publication workflow",area:"Organic Studio",body:"Brief → draft → editorial QA → client approval → schedule → publish → monitor."},{id:"so4",title:"Lead research and delivery",area:"Lead Engine",body:"Validate source and relevance, check duplicates, verify required fields, sample QA, package batch and record corrections."},{id:"so5",title:"Outbound and booked appointments",area:"Closing",body:"Qualify fit, check applicable outreach rules and consent, record outcome, book handover, update pipeline, follow up."},{id:"so6",title:"Weekly reporting and client updates",area:"Account Management",body:"Collect verified data, compare with targets, explain discrepancies, obtain account manager review and deliver report."}],
    teamChat:[{id:"c1",person:"Oliver",channel:"General",text:"Please link your shift summaries to the Task Centre items worked on.",time:"09:15"},{id:"c2",person:"Taylor",channel:"Paid Media",text:"Campaign QA checklist updated for the next launch.",time:"10:30"}],
    announcements:[{id:"an1",person:"Oliver",title:"Weekly account reviews",text:"Complete your service updates before Friday's account review.",day:nowDay(),status:"Unread"}],
    inbox:[{id:"in1",title:"Review your weekly summary",kind:"Action",status:"Unread",source:"Business Manager"},{id:"in2",title:"Editorial SOP updated",kind:"Information",status:"Read",source:"Organic Studio"}],
    meetings:[{id:"mt1",title:"Campaign handover",person:"Oliver",with:"Taylor",when:later(2),purpose:"Review initial paid campaign setup",outcome:"",status:"Scheduled"}],
    feedback:[{id:"fb1",person:"Avery",by:"Oliver",comment:"Excellent editorial consistency; focus on client turnaround next week.",visibility:"Private to employee and manager"}],
    recognition:[{id:"rec1",person:"Morgan",by:"Oliver",text:"Excellent lead validation effort across new batches.",day:nowDay()}],
    applicants:[{id:"ca1",name:"Sample Candidate A",position:"Paid Media Specialist",stage:"Screening",owner:"Oliver"},{id:"ca2",name:"Sample Candidate B",position:"Appointment Setter",stage:"Assessment",owner:"Oliver"}],
    onboarding:[{id:"on1",name:"Welcome & security induction",done:true},{id:"on2",name:"Employment details and policy acknowledgement",done:true},{id:"on3",name:"Service-specific training assigned",done:false},{id:"on4",name:"First supervised deliverable reviewed",done:false},{id:"on5",name:"30-day performance review booked",done:false}],
    expenses:[{id:"ex1",person:"Avery",category:"Software",detail:"Content editing licence",amount:36,status:"Pending",day:nowDay()}],
    equipment:[{id:"eq1",name:"Creative suite seat",type:"Software",owner:"Avery",renewal:later(30),status:"Assigned"},{id:"eq2",name:"Ads manager access",type:"Access",owner:"Taylor",renewal:later(90),status:"Assigned"},{id:"eq3",name:"Lead research licence",type:"Software",owner:"Morgan",renewal:later(20),status:"Assigned"}],
    helpdesk:[{id:"hi1",person:"Taylor",category:"Access",title:"Request access to analytics",priority:"Normal",status:"Open",day:nowDay()}],
    qa:[{id:"qa1",account:"a",service:"Paid",deliverable:"Conversion tracking verification",reviewer:"Oliver",status:"Awaiting QA",checks:["Tracking","Budget","Policy"],notes:""},{id:"qa2",account:"b",service:"Organic",deliverable:"Trainer spotlight captions",reviewer:"Oliver",status:"Awaiting QA",checks:["Grammar","Brand","Claims"],notes:""},{id:"qa3",account:"c",service:"Leads",deliverable:"Commercial prospect batch",reviewer:"Oliver",status:"Needs changes",checks:["Duplicates","Source","Validation"],notes:""},{id:"qa4",account:"c",service:"Closing",deliverable:"Appointment qualification script",reviewer:"Oliver",status:"Awaiting QA",checks:["Consent","Fit","Handover"],notes:""}],
    audit:[{id:"au1",event:"Staff demo workspace loaded",actor:"System",at:nowDay()}],
    form:"",formTarget:"",selectedChannel:"General"
  });
  let s;try{s=JSON.parse(localStorage.getItem(KEY)||"null")||seed();if(!s.people||!s.workEntries)s=seed();}catch{s=seed();}
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}};
  const actor=role=>role==="management"?"Oliver":"Avery";
  const onlyManagers=role=>role==="management";
  const audit=(event,role)=>{s.audit.unshift({id:makeId(),event,actor:actor(role),at:new Date().toISOString()});s.audit=s.audit.slice(0,100);};
  const render= (page,h) => {
    if(h.state.role==="client")return h.topHeader("Staff only","This workspace is not part of the client interface.");
    const e=h.esc,btn=h.button,icon=h.icon,pill=h.pill,table=h.tabular,td=h.td;
    const manager=onlyManagers(h.state.role),me=actor(h.state.role);
    const header=(title,description,action)=>h.topHeader(title,description,action||"");
    const box=(title,content,action)=>h.panel(title,content,action||"");
    const card=(title,contents)=>'<div class="staff-card"><h3>'+e(title)+'</h3>'+contents+'</div>';
    const status=x=>pill(x);
    const row=(...cells)=>'<tr>'+cells.map(td).join("")+'</tr>';
    const metric=(label,value,subtitle,ico)=>h.valueCard(label,value,subtitle,ico);
    const blank=(text)=>'<div class="staff-empty">'+icon("folder",25)+'<p>'+e(text)+'</p></div>';
    const staffTable=(columns,rows)=>'<section class="panel staff-table-wrap">'+table(columns,rows)+'</section>';
    const actionButton=(label,action,id,style)=>btn(label,action,id,style||"small ghost");
    const pageData=h.data;
    const people=s.people;
    const clock=s.timer;
    const taskById=id=>pageData.tasks.find(x=>x.id===id);
    const taskPicker='<select id="staff-task-select" class="field-select" aria-label="Task Centre task" style="width:100%;max-width:none">'+pageData.tasks.filter(x=>x.status!=="Done").map(x=>'<option value="'+e(x.id)+'" '+(x.id===s.selectedTask?'selected':'')+'>'+e(x.title)+' · '+e(h.accountName(x.account))+'</option>').join("")+'</select>';
    const formAction=(name,label)=>actionButton(label,"staff-form",name,"primary");
    const section= (id,title,description,content)=>header(title,description)+content;
    if(page==="staff-hub"){
      const taskTotal=pageData.tasks.filter(x=>x.status!=="Done").length;
      const openQA=s.qa.filter(x=>x.status!=="Approved").length;
      const pending=s.shifts.filter(x=>x.status==="Submitted"||x.status==="Needs summary").length;
      return header("My day","One place to manage your work, time, team and professional development.",actionButton("Start work","staff-open-work","","primary"))
       +'<div class="metric-grid">'+metric("Open tasks",taskTotal,"Linked to client delivery","tasks")+metric("Active timer",s.timer?"Running":"Stopped","Task-based work tracking","clock")+metric("QA to review",openQA,"Service quality","shield")+metric("Shift summaries",pending,"Awaiting review or submission","file")+'</div>'
       +'<div class="two-col">'+box("Today's priorities",pageData.tasks.filter(x=>x.status!=="Done").slice(0,5).map(t=>'<div class="staff-item"><b>'+e(t.title)+'</b><div class="small muted">'+e(h.accountName(t.account))+' · '+e(t.assignee)+'</div><div style="margin-top:8px">'+status(t.status)+'</div></div>').join("")||blank("No work assigned."),actionButton("Task Centre","nav","tasks"))
       +box("Quick actions",'<div class="staff-quick">'+[
        ["Track time","work-tracker","clock"],["Shift summary","timesheets","file"],["Request leave","staff-leave","calendar"],["Training","staff-training","checkcircle"],["Team chat","staff-chat","messages"],["My performance","staff-kpis","chart"],["Meetings","staff-meetings","calendar"],["Knowledge base","staff-knowledge","folder"]
       ].map(([name,route,ico])=>'<button data-action="nav" data-id="'+route+'" class="staff-quick-link">'+icon(ico,17)+'<span>'+name+'</span>'+icon("chevron",13)+'</button>').join("")+'</div>')+'</div>'
       +'<div class="three-col">'+card("Upcoming meetings",s.meetings.filter(x=>x.status==="Scheduled").slice(0,2).map(x=>'<p>'+e(x.title)+'<br><small>'+shortDate(x.when)+' · '+e(x.with)+'</small></p>').join("")||"No meetings scheduled.")+card("Pending approvals",String(s.leave.filter(x=>x.status==="Pending").length+s.expenses.filter(x=>x.status==="Pending").length)+" leave or expense requests")+card("Development",s.training.filter(x=>x.status!=="Complete").length+" learning modules to complete")+'</div>';
    }
    if(page==="work-tracker"){
      const task=taskById(clock?.taskId||s.selectedTask);
      const duration=clock?Math.max(0,Math.round((Date.now()-Date.parse(clock.startedAt))/60000)):"";
      const rows=s.workEntries.filter(x=>manager||x.person===me).slice(0,12);
      return header("Work tracker","Track actual time against Task Centre tasks and client service delivery.")
       +'<div class="two-col"><section class="panel panel-pad"><h2>Current work session</h2><div class="staff-timer">'+(clock?e(String(Math.floor(duration/60)).padStart(2,"0")+":"+String(duration%60).padStart(2,"0")):"00:00")+'</div><div class="muted small">'+(clock?"Active: "+e(task?.title||"Task")+" — "+e(h.accountName(task?.account)):"Select a Task Centre item to start")+'</div><div style="margin:18px 0">'+taskPicker+'</div><div class="inline">'+(clock?actionButton("Stop & log shift","staff-stop","","primary"):actionButton("Start task timer","staff-start","","primary"))+actionButton("Refresh time","staff-refresh")+'</div></section>'
       +box("Work tracker rules",'<div class="step-list">'+[
        "Choose a real Task Centre item before starting",
        "Time automatically belongs to the associated client and service",
        "Stop the timer to create a shift needing a summary",
        "Submit accomplishments, blockers, next work and questions",
        "A manager can review and rate the summary"
       ].map((v,i)=>'<div class="step-row"><span class="step-dot">'+(i+1)+'</span><span>'+e(v)+'</span></div>').join("")+'</div>')+'</div>'
       +staffTable(["DATE","STAFF","TASK","CLIENT","MINUTES"],rows.map(x=>row(shortDate(x.startedAt),e(x.person),e(taskById(x.taskId)?.title||"Task"),e(h.accountName(x.account)),String(x.minutes))));
    }
    if(page==="timesheets"){
      const records=s.shifts.filter(x=>manager||x.person===me);
      return header("Timesheets & shift summaries","Task-linked hours, self-evaluations and manager approval.",formAction("shift","Add manual shift"))
       +formBox("shift",h)
       +'<div class="metric-grid">'+metric("Shift entries",records.length,"In demo timesheets","file")+metric("Hours logged",records.reduce((n,x)=>n+Number(x.hours||0),0).toFixed(1),"Task-linked when selected","clock")+metric("Awaiting summary",records.filter(x=>x.status==="Needs summary").length,"Staff action required","alert")+metric("Pending review",records.filter(x=>x.status==="Submitted").length,"Manager action","checkcircle")+'</div>'
       +'<section class="panel"><div class="table-scroll"><table class="data-table"><thead><tr><th>STAFF / DATE</th><th>HOURS</th><th>TASK LINKS</th><th>SELF-REVIEW</th><th>STATUS</th><th>MANAGER</th><th></th></tr></thead><tbody>'
       +records.map(x=>'<tr><td><b>'+e(x.person)+'</b><div class="tiny muted">'+shortDate(x.day)+'</div></td><td>'+Number(x.hours||0).toFixed(2)+'</td><td>'+x.taskIds.map(k=>'<div class="tiny">'+e(taskById(k)?.title||"Archived task")+'</div>').join("")+'</td><td><div class="small">'+e(x.summary||"Summary required")+'</div><div class="tiny muted">Self-rating: '+e(x.selfRating||"—")+'/5 · Blockers: '+e(x.blockers||"None")+'</div></td><td>'+status(x.status)+'</td><td class="small">'+e(x.managerRating||"—")+'</td><td>'+actionButton("Review","staff-review-shift",x.id)+'</td></tr>').join("")
       +'</tbody></table></div></section>'+formBox("shift-review",h);
    }
    if(page==="staff-roster"){
      return header("Roster & availability","Manage working patterns, shifts and weekly coverage.",formAction("availability","Set availability"))
       +formBox("availability",h)
       +'<div class="two-col">'+box("Upcoming roster",s.roster.map(x=>'<div class="staff-item"><div class="spread"><b>'+e(x.person)+'</b>'+status(x.team)+'</div><div class="small muted">'+shortDate(x.day)+' · '+e(x.start)+'–'+e(x.end)+'</div></div>').join(""))+box("Weekly availability",s.availability.map(x=>'<div class="staff-item"><b>'+e(x.person)+'</b> · '+e(x.day)+'<div class="muted small">'+e(x.start)+'–'+e(x.end)+'</div></div>').join(""))+'</div>';
    }
    if(page==="staff-leave"){
      return header("Leave & absences","Request time off and check manager decisions.",formAction("leave","New leave request"))
       +formBox("leave",h)
       +staffTable(["EMPLOYEE","TYPE","DATES","REASON","STATUS","ACTION"],s.leave.filter(x=>manager||x.person===me).map(x=>row(e(x.person),e(x.type),shortDate(x.start)+" – "+shortDate(x.end),e(x.reason),status(x.status),manager&&x.status==="Pending"?actionButton("Approve","staff-approve-leave",x.id):"—")));
    }
    if(page==="staff-kpis"){
      const kpis=manager?s.kpis:s.kpis.filter(x=>x.person===me);
      return header("KPIs & performance","Targets, evidence and supportive performance review.",formAction("kpi","Update evidence"))
       +formBox("kpi",h)
       +'<div class="two-col">'+box("Performance scorecards",kpis.map(x=>'<div class="staff-item"><div class="spread"><b>'+e(x.metric)+'</b>'+status(x.status)+'</div><div class="muted small">'+e(x.person)+' · Target '+e(x.target)+e(x.unit)+' · Actual '+e(x.actual)+e(x.unit)+'</div><div class="progress-mini"><i style="width:'+Math.min(100,Math.round(x.actual/x.target*100))+'%"></i></div><div class="tiny muted">Evidence: '+e(x.evidence)+'</div></div>').join(""))+box("Performance approach",'<p class="muted small">Capture evidence against measurable client delivery outcomes. Staff can self-assess; managers review context, quality and blockers before any performance judgement.</p><p class="muted small">Sample indicators: approval turnaround, qualified lead accuracy, campaign QA, content delivery, meeting show rate, retention and client satisfaction.</p>')+'</div>';
    }
    if(page==="staff-growth"){
      return header("Growth & feedback","Employee goals, manager coaching and personal development.",formAction("goal","Add growth goal"))
       +formBox("goal",h)
       +'<div class="two-col">'+box("Growth plans",s.goals.filter(x=>manager||x.person===me).map(x=>'<div class="staff-item"><div class="spread"><b>'+e(x.title)+'</b>'+status(x.status)+'</div><p class="small muted">'+e(x.milestone)+'</p><div class="progress-mini"><i style="width:'+Number(x.progress)+'%"></i></div><span class="tiny muted">'+e(x.privacy)+' · '+e(x.person)+'</span></div>').join(""))+box("Manager feedback",s.feedback.filter(x=>manager||x.person===me).map(x=>'<div class="staff-item"><p>'+e(x.comment)+'</p><div class="small muted">'+e(x.by)+' → '+e(x.person)+'</div></div>').join(""))+'</div>';
    }
    if(page==="staff-training"){
      return header("Training & competencies","Role-specific inductions, assessments and verified progression.")
      +'<div class="metric-grid">'+metric("Total modules",s.training.length,"Company learning catalogue","file")+metric("Completed",s.training.filter(x=>x.status==="Complete").length,"Demo completion status","checkcircle")+metric("In progress",s.training.filter(x=>x.status==="In progress").length,"Continue learning","clock")+metric("Role-specific",s.training.filter(x=>x.team!=="All staff").length,"Specialist paths","layers")+'</div>'
      +'<div class="three-col">'+s.training.map(x=>card(x.name,'<p class="small muted">'+e(x.team)+' · '+e(x.minutes)+' min</p><div class="spread">'+status(x.status)+actionButton(x.status==="Complete"?"Completed":"Mark complete","staff-complete-training",x.id)+'</div>')).join("")+'</div>';
    }
    if(page==="staff-knowledge"){
      return header("SOPs & knowledge","One source for delivery standards, scripts, compliance and handovers.")
       +'<div class="three-col">'+s.sops.map(x=>card(x.title,'<div class="small muted">'+e(x.area)+'</div><p class="small" style="margin-top:12px">'+e(x.body)+'</p>')).join("")+'</div>';
    }
    if(page==="staff-directory"){
      return header("Staff directory","Role, team and skill visibility across Omega Amplify.")
       +staffTable(["STAFF MEMBER","ROLE","TEAM","SKILLS","STATUS"],people.map(x=>row('<b>'+e(x.name)+'</b>',e(x.role),e(x.team),e(x.skills),status(x.status))));
    }
    if(page==="staff-chat"){
      return header("Team chat","Team channels and linked operational conversations.",formAction("chat","New message"))
       +formBox("chat",h)
       +'<div class="staff-channel-list">'+["General","Paid Media","Organic Studio","Lead Engine","Closing","Client Success"].map(x=>actionButton(x,"staff-channel",x,x===s.selectedChannel?"primary":"small ghost")).join("")+'</div>'
       +box(s.selectedChannel+" channel",s.teamChat.filter(x=>x.channel===s.selectedChannel).map(x=>'<div class="staff-message"><b>'+e(x.person)+'</b><span class="tiny muted"> '+e(x.time)+'</span><div>'+e(x.text)+'</div></div>').join("")||blank("No messages in this channel.")); 
    }
    if(page==="staff-inbox"){
      return header("Inbox & announcements","Requests, policy notices, internal updates and action items.",manager?formAction("announcement","Post announcement"):"")
       +formBox("announcement",h)
       +'<div class="two-col">'+box("My inbox",s.inbox.map(x=>'<div class="staff-item"><div class="spread"><b>'+e(x.title)+'</b>'+status(x.status)+'</div><p class="tiny muted">'+e(x.kind)+' · '+e(x.source)+'</p>'+actionButton("Mark read","staff-read-inbox",x.id)+'</div>').join(""))+box("Team announcements",s.announcements.map(x=>'<div class="staff-item"><div class="spread"><b>'+e(x.title)+'</b>'+status(x.status)+'</div><p>'+e(x.text)+'</p><div class="tiny muted">'+e(x.person)+' · '+shortDate(x.day)+'</div></div>').join(""))+'</div>';
    }
    if(page==="staff-meetings"){
      return header("Meetings & outcomes","Schedule staff catch-ups, document outcomes and assign follow-up tasks.",formAction("meeting","Schedule meeting"))
       +formBox("meeting",h)+formBox("meeting-outcome",h)
       +staffTable(["MEETING","PARTICIPANTS","DATE","PURPOSE","STATUS","FOLLOW-UP"],s.meetings.map(x=>row('<b>'+e(x.title)+'</b>',e(x.person)+" + "+e(x.with),shortDate(x.when),e(x.purpose),status(x.status),actionButton(x.status==="Completed"?"View outcome":"Record outcome","staff-outcome",x.id))));
    }
    if(page==="staff-recognition"){
      return header("Recognition","Celebrate measurable contributions and helpful teamwork.",manager?formAction("recognition","Give recognition"):"")
       +formBox("recognition",h)
       +'<div class="three-col">'+s.recognition.map(x=>card("★ "+x.person,'<p>'+e(x.text)+'</p><div class="small muted">Recognised by '+e(x.by)+' · '+shortDate(x.day)+'</div>')).join("")+'</div>';
    }
    if(page==="staff-quality"){
      return header("Delivery quality","Check campaigns, creative, lead batches and outreach before client release.")
       +'<div class="metric-grid">'+metric("Awaiting QA",s.qa.filter(x=>x.status==="Awaiting QA").length,"Pre-delivery reviews","clock")+metric("Needs changes",s.qa.filter(x=>x.status==="Needs changes").length,"Return to production","alert")+metric("Approved",s.qa.filter(x=>x.status==="Approved").length,"Ready for next stage","checkcircle")+metric("Services",4,"Paid · Organic · Leads · Closing","layers")+'</div>'
       +'<div class="three-col">'+s.qa.map(x=>card(x.deliverable,'<div class="spread">'+status(x.service)+status(x.status)+'</div><p class="small muted">'+e(h.accountName(x.account))+' · Reviewer '+e(x.reviewer)+'</p><div class="staff-checks">'+x.checks.map(c=>'<span>'+icon("check",13)+' '+e(c)+'</span>').join("")+'</div><div class="inline" style="margin-top:13px">'+actionButton("Pass QA","staff-pass-qa",x.id,"small success")+actionButton("Request fixes","staff-fail-qa",x.id)+'</div>')).join("")+'</div>';
    }
    if(page==="staff-workflows"){
      const maps=[
        ["Paid advertising","Client brief → access/consent → tracking → creative QA → client approval → launch → pacing → optimisation → report","paid"],
        ["Organic marketing","Strategy → channel brief → draft → editorial QA → client approval → schedule → publish → engage → report","organic"],
        ["Leads Only","Niche brief → research → verify → deduplicate → sample QA → batch packaging → deliver → replacement handling","leads"],
        ["Leads + Closing","Lead brief → outreach eligibility → prospect contact → qualification → appointment → handover → close → attribution","closing"],
        ["Client success","CRM closed won → handover → contract/scope → kickoff → access/assets → assign staff → weekly updates → renewal","projects"]
      ];
      return header("Service playbooks","Consistent workflows for every Amplify offer and client lifecycle.")
       +'<div class="three-col">'+maps.map(([title,steps,route])=>card(title,'<p class="small">'+e(steps)+'</p>'+actionButton("Open workspace","nav",route))).join("")+'</div>';
    }
    if(page==="staff-recruitment"){
      return header("Recruitment & onboarding","Track candidates, assessments, supervised trials and onboarding milestones.",manager?formAction("candidate","Add candidate"):"")
       +formBox("candidate",h)
       +'<div class="two-col">'+box("Applicant pipeline",s.applicants.map(x=>'<div class="staff-item"><div class="spread"><b>'+e(x.name)+'</b>'+status(x.stage)+'</div><p class="small muted">'+e(x.position)+' · '+e(x.owner)+'</p>'+(manager?actionButton("Next stage","staff-next-candidate",x.id):"")+'</div>').join(""))+box("New starter checklist",s.onboarding.map(x=>'<div class="staff-item staff-check-item"><span>'+icon(x.done?"checkcircle":"clock",18)+'</span><span>'+e(x.name)+'</span>'+(manager?actionButton(x.done?"Reopen":"Complete","staff-toggle-onboarding",x.id):"")+'</div>').join(""))+'</div>';
    }
    if(page==="staff-approvals"){
      const leave=s.leave.filter(x=>x.status==="Pending").map(x=>({id:x.id,title:x.person+" — "+x.type+" leave",type:"Leave",status:x.status,action:"staff-approve-leave"}));
      const expense=s.expenses.filter(x=>x.status==="Pending").map(x=>({id:x.id,title:x.person+" — "+x.detail,type:"Expense",status:x.status,action:"staff-approve-expense"}));
      const shifts=s.shifts.filter(x=>x.status==="Submitted").map(x=>({id:x.id,title:x.person+" — "+shortDate(x.day)+" shift",type:"Timesheet",status:x.status,action:"staff-review-shift"}));
      const items=[...leave,...expense,...shifts];
      return header("Operational approvals","One queue for leave, timesheets, expenses and management decisions.")
       +'<div class="metric-grid">'+metric("Pending requests",items.length,"Staff and operations","clock")+metric("Leave",leave.length,"Awaiting decision","calendar")+metric("Expenses",expense.length,"Needs review","wallet")+metric("Timesheets",shifts.length,"Manager reviews","file")+'</div>'
       +staffTable(["REQUEST","TYPE","STATUS","ACTION"],items.map(x=>row(e(x.title),status(x.type),status(x.status),manager?actionButton("Review","staff-approval-action",x.type+"|"+x.id):"View only")));
    }
    if(page==="staff-expenses"){
      const items=manager?s.expenses:s.expenses.filter(x=>x.person===me);
      return header("Expenses & purchases","Receipts, subscriptions, reimbursements and licence requests.",formAction("expense","New expense request"))
       +formBox("expense",h)
       +staffTable(["STAFF","CATEGORY","DETAILS","AMOUNT","STATUS","ACTION"],items.map(x=>row(e(x.person),e(x.category),e(x.detail),h.money(x.amount),status(x.status),manager&&x.status==="Pending"?actionButton("Approve","staff-approve-expense",x.id):"—")));
    }
    if(page==="staff-equipment"){
      return header("Assets & software","Track devices, access, tool seats and subscription renewals.",manager?formAction("equipment","Add asset"):"")
       +formBox("equipment",h)
       +staffTable(["RESOURCE","TYPE","ASSIGNEE","RENEWAL","STATUS"],s.equipment.map(x=>row('<b>'+e(x.name)+'</b>',e(x.type),e(x.owner),shortDate(x.renewal),status(x.status))));
    }
    if(page==="staff-helpdesk"){
      return header("Internal helpdesk","Access issues, incidents and internal service requests.",formAction("helpdesk","Submit request"))
       +formBox("helpdesk",h)
       +staffTable(["REQUEST","EMPLOYEE","CATEGORY","PRIORITY","STATUS","ACTION"],s.helpdesk.filter(x=>manager||x.person===me).map(x=>row(e(x.title),e(x.person),e(x.category),status(x.priority),status(x.status),manager?actionButton("Resolve","staff-resolve-helpdesk",x.id):"—")));
    }
    if(page==="staff-people-reports"){
      return header("People reporting","Operational visibility without exposing private employee feedback to clients.")
       +'<div class="metric-grid">'+metric("Team members",s.people.length,"Demo staff roster","users")+metric("Hours captured",s.shifts.reduce((v,x)=>v+Number(x.hours||0),0).toFixed(1),"Example shift totals","clock")+metric("Training done",s.training.filter(x=>x.status==="Complete").length,"Completed courses","checkcircle")+metric("Pending reviews",s.shifts.filter(x=>x.status==="Submitted").length,"Awaiting manager","file")+'</div>'
       +box("Team workload and activity",s.people.map(p=>'<div class="staff-item spread"><b>'+e(p.name)+'</b><span class="muted small">'+e(p.team)+'</span><span class="small">'+s.shifts.filter(x=>x.person===p.name).reduce((v,x)=>v+Number(x.hours||0),0).toFixed(1)+' h</span></div>').join(""))
       +box("Local demo audit",s.audit.slice(0,18).map(x=>'<div class="staff-item"><b>'+e(x.event)+'</b><div class="small muted">'+e(x.actor)+' · '+e(x.at)+'</div></div>').join(""));
    }
    if(page==="staff-access"){
      return header("Roles & permissions","Role templates and assignment responsibilities. Preview only; no actual access changes.")
       +'<div class="staff-notice">This page documents role design. Real account invitation, revocation and RBAC require authenticated server-side implementation.</div>'
       +staffTable(["ROLE","ACCOUNT VISIBILITY","OPERATIONS","APPROVAL SCOPE"],[
         row("Managing Director","Agency-wide","All business units","Final finance / HR / policy"),
         row("Business Manager","Assigned division / portfolio","Team, clients, operations","Shifts, leave, delivery"),
         row("Account Manager","Assigned clients","Briefs, reporting, handovers","Client deliverables"),
         row("Paid Media Specialist","Assigned campaigns","Ads, tracking and optimisation","Technical QA (not own release)"),
         row("Organic Content Producer","Assigned content","Editorial, SEO/AEO, publication","Internal drafts"),
         row("Lead Researcher","Assigned lead batches","Research, validation, quality","Batch QA (segregated)"),
         row("Appointment Setter / Closer","Assigned prospects","Outreach, appointments, pipeline","Booking handovers"),
         row("Finance / Admin","Financial and admin scope","Expenses, billing, scheduling","Budget-specific")
       ]);
    }
    return header("Staff workspace","This staff page is not yet configured.");
  };
  const formFields={
    shift:[["taskId","Task Centre task","task"],["hours","Hours worked","number"],["summary","Work completed","textarea"],["remaining","Remaining work","textarea"],["blockers","Blockers","textarea"],["questions","Questions for manager","textarea"],["selfRating","Productivity self-rating (1–5)","rating"]],
    "shift-review":[["managerRating","Manager productivity assessment","rating"],["reviewNote","Manager notes","textarea"]],
    availability:[["day","Weekday","select:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday"],["start","Available from","time"],["end","Available until","time"]],
    leave:[["type","Leave type","select:Annual|Sick|Unpaid|Other"],["start","Start date","date"],["end","End date","date"],["reason","Reason","textarea"]],
    kpi:[["metric","KPI","kpi"],["actual","Actual value","number"],["evidence","Evidence and context","textarea"]],
    goal:[["title","Development goal","text"],["milestone","Next measurable milestone","textarea"],["privacy","Visibility","select:Shared with manager|Private to employee"]],
    chat:[["channel","Channel","select:General|Paid Media|Organic Studio|Lead Engine|Closing|Client Success"],["text","Message","textarea"]],
    announcement:[["title","Announcement title","text"],["text","Announcement","textarea"]],
    meeting:[["title","Meeting title","text"],["with","Meet with","person"],["when","Date","date"],["purpose","Agenda or purpose","textarea"]],
    "meeting-outcome":[["outcome","Outcomes and follow-up actions","textarea"]],
    recognition:[["person","Recognise","person"],["text","Contribution","textarea"]],
    candidate:[["name","Candidate name","text"],["position","Role","text"]],
    expense:[["category","Category","select:Travel|Software|Equipment|Client expense|Training|Other"],["detail","Description","text"],["amount","Amount (AUD)","number"]],
    equipment:[["name","Asset or software","text"],["type","Type","select:Software|Device|Access|Equipment"],["owner","Assigned to","person"],["renewal","Renewal or review date","date"]],
    helpdesk:[["category","Category","select:Access|Technology|People|Finance|Security incident|Other"],["title","Issue or request","text"],["priority","Priority","select:Normal|High|Urgent"]]
  };
  function formBox(kind,h){
    if(s.form!==kind)return "";
    const e=h.esc,ic=h.icon;
    const options=(items,value)=>items.map(x=>'<option value="'+e(x[0])+'" '+(x[0]===value?"selected":"")+'>'+e(x[1])+'</option>').join("");
    const tasks=h.data.tasks.filter(x=>x.status!=="Done");
    const controls=(formFields[kind]||[]).map(([key,label,type])=>{
      let markup;
      if(type==="task")markup='<select class="field-select" name="'+key+'" required>'+options(tasks.map(x=>[x.id,x.title+" · "+h.accountName(x.account)]),s.selectedTask)+'</select>';
      else if(type==="kpi")markup='<select class="field-select" name="'+key+'" required>'+options(s.kpis.map(x=>[x.id,x.metric+" · "+x.person]))+'</select>';
      else if(type==="person")markup='<select class="field-select" name="'+key+'" required>'+options(s.people.map(x=>[x.name,x.name+" · "+x.team]))+'</select>';
      else if(type.startsWith("select:"))markup='<select class="field-select" name="'+key+'" required>'+options(type.slice(7).split("|").map(x=>[x,x]))+'</select>';
      else if(type==="rating")markup='<select class="field-select" name="'+key+'" required>'+options([1,2,3,4,5].map(x=>[String(x),String(x)+"/5"]))+'</select>';
      else if(type==="textarea")markup='<textarea class="field-textarea" name="'+key+'" maxlength="2500" required></textarea>';
      else markup='<input class="field" type="'+type+'" name="'+key+'" '+(type==="number"?'min="0" step="0.25"':type==="date"?'value="'+later(1)+'"':"")+' required>';
      return '<label class="staff-label">'+e(label)+markup+'</label>';
    }).join("");
    return '<section class="panel panel-pad staff-form-panel"><div class="spread"><h2>'+e(kind.replace(/-/g," "))+'</h2><button class="btn small ghost" data-action="staff-form-close">Close</button></div><form id="staff-form" data-staff-form="'+e(kind)+'" class="staff-form-grid">'+controls+'<div class="staff-form-actions"><button class="btn primary" type="submit">'+ic("check",14)+' Save demo record</button></div></form></section>';
  }
  function click(action,value,h){
    if(!action.startsWith("staff-"))return false;
    const role=h.state.role,manager=role==="management",me=actor(role);
    const notice=h.notify||(()=>{});const done=(message)=>{persist();h.render();notice(message||"Saved to demo workspace.");};
    const look=(arr)=>arr.find(x=>x.id===value);
    const managerOnly=(fn)=>{if(!manager){notice("This action is restricted to manager preview mode.");return;}fn();};
    if(action==="staff-form"){s.form=value;s.formTarget="";h.render();return true;}
    if(action==="staff-form-close"){s.form="";s.formTarget="";h.render();return true;}
    if(action==="staff-open-work"){h.goto("work-tracker");return true;}
    if(action==="staff-refresh"){h.render();return true;}
    if(action==="staff-start"){
      if(s.timer){notice("Stop the current task first.");return true;}
      const selector=typeof document!=="undefined"&&document.querySelector("#staff-task-select");
      const taskId=selector?.value||s.selectedTask;
      const task=h.data.tasks.find(x=>x.id===taskId);
      if(!task){notice("Choose an existing Task Centre task.");return true;}
      s.selectedTask=taskId;s.timer={id:makeId(),person:me,taskId,account:task.account,startedAt:new Date().toISOString()};audit("Started work on "+task.title,role);done("Task timer started.");return true;
    }
    if(action==="staff-stop"){
      const t=s.timer;if(!t){notice("No active timer.");return true;}
      const ended=new Date();const minutes=Math.max(1,Math.round((ended-Date.parse(t.startedAt))/60000));
      s.workEntries.unshift({...t,endedAt:ended.toISOString(),minutes});
      s.shifts.unshift({id:makeId(),person:t.person,day:nowDay(),hours:Math.round(minutes/60*100)/100,taskIds:[t.taskId],status:"Needs summary",summary:"",remaining:"",blockers:"",questions:"",selfRating:"",managerRating:"",reviewNote:""});
      s.timer=null;audit("Stopped task timer and generated shift",role);done("Work logged. Add a shift summary in Timesheets.");return true;
    }
    if(action==="staff-review-shift"){
      s.form="shift-review";s.formTarget=value;h.goto("timesheets");s.form="shift-review";s.formTarget=value;h.render();return true;
    }
    if(action==="staff-approve-leave"){managerOnly(()=>{const x=look(s.leave);if(x&&x.status==="Pending")x.status="Approved";audit("Approved leave request",role);done("Leave approved in demo.");});return true;}
    if(action==="staff-approve-expense"){managerOnly(()=>{const x=look(s.expenses);if(x&&x.status==="Pending")x.status="Approved";audit("Approved expense",role);done("Expense approved in demo.");});return true;}
    if(action==="staff-approval-action"){
      const [kind,record]=value.split("|");
      if(kind==="Timesheet")return click("staff-review-shift",record,h);
      if(kind==="Leave")return click("staff-approve-leave",record,h);
      if(kind==="Expense")return click("staff-approve-expense",record,h);
      return true;
    }
    if(action==="staff-complete-training"){const t=look(s.training);if(t)t.status="Complete";audit("Completed training "+(t?.name||""),role);done("Training marked complete (demo).");return true;}
    if(action==="staff-channel"){s.selectedChannel=value;h.render();return true;}
    if(action==="staff-read-inbox"){const x=look(s.inbox);if(x)x.status="Read";done("Marked as read.");return true;}
    if(action==="staff-outcome"){s.form="meeting-outcome";s.formTarget=value;h.render();return true;}
    if(action==="staff-next-candidate"){managerOnly(()=>{const x=look(s.applicants);const arr=["Applied","Screening","Assessment","Trial","Offer","Hired"];if(x)x.stage=arr[Math.min(arr.length-1,arr.indexOf(x.stage)+1)];done("Candidate moved to next stage.");});return true;}
    if(action==="staff-toggle-onboarding"){managerOnly(()=>{const x=look(s.onboarding);if(x)x.done=!x.done;done("Onboarding step updated.");});return true;}
    if(action==="staff-pass-qa"){const x=look(s.qa);if(x)x.status="Approved";audit("QA approved: "+(x?.deliverable||""),role);done("QA passed (demo).");return true;}
    if(action==="staff-fail-qa"){const x=look(s.qa);if(x)x.status="Needs changes";audit("QA changes requested",role);done("Changes requested in QA.");return true;}
    if(action==="staff-resolve-helpdesk"){managerOnly(()=>{const x=look(s.helpdesk);if(x)x.status="Resolved";done("Internal request resolved.");});return true;}
    return true;
  }
  function submit(kind,values,h){
    if(!formFields[kind])return false;
    const role=h.state.role,manager=role==="management",me=actor(role);
    const money=Number(values.amount)||0;const uid=makeId();
    const add=(key,item)=>s[key].unshift({id:uid,...item});
    const reject=(message)=>{h.notify(message);return true;};
    if(kind==="shift"){
      if(!values.taskId||Number(values.hours)<0)return reject("Choose a task and valid hours.");
      add("shifts",{person:me,day:nowDay(),hours:Number(values.hours),taskIds:[values.taskId],summary:values.summary,remaining:values.remaining,blockers:values.blockers,questions:values.questions,selfRating:Number(values.selfRating),status:"Submitted",managerRating:"",reviewNote:""});
    }else if(kind==="shift-review"){
      if(!manager)return reject("Only managers can review submitted summaries.");
      const x=s.shifts.find(x=>x.id===s.formTarget);
      if(!x||x.status!=="Submitted")return reject("Select a submitted shift to review.");
      x.managerRating=values.managerRating;x.reviewNote=values.reviewNote;x.status="Approved";
    }else if(kind==="availability"){
      if(values.start>=values.end)return reject("End time must be later than start time.");
      add("availability",{person:me,day:values.day,start:values.start,end:values.end});
    }else if(kind==="leave"){
      if(values.end<values.start)return reject("Leave end date must be on or after the start date.");
      add("leave",{person:me,type:values.type,start:values.start,end:values.end,reason:values.reason,status:"Pending"});
    }else if(kind==="kpi"){
      const x=s.kpis.find(x=>x.id===values.metric);if(!x)return reject("Choose a KPI.");
      if(!manager&&x.person!==me)return reject("You can only edit your own KPI evidence.");
      x.actual=Number(values.actual);x.evidence=values.evidence;x.status="Needs review";
    }else if(kind==="goal"){
      add("goals",{person:me,title:values.title,milestone:values.milestone,privacy:values.privacy,progress:0,status:"In progress"});
    }else if(kind==="chat"){
      add("teamChat",{person:me,channel:values.channel,text:values.text,time:new Date().toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"})});
      s.selectedChannel=values.channel;
    }else if(kind==="announcement"){
      if(!manager)return reject("Only managers can post announcements.");
      add("announcements",{person:me,title:values.title,text:values.text,day:nowDay(),status:"Unread"});
    }else if(kind==="meeting"){
      add("meetings",{title:values.title,person:me,with:values.with,when:values.when,purpose:values.purpose,outcome:"",status:"Scheduled"});
    }else if(kind==="meeting-outcome"){
      const x=s.meetings.find(x=>x.id===s.formTarget);
      if(!x)return reject("Choose an existing meeting.");
      x.outcome=values.outcome;x.status="Completed";
    }else if(kind==="recognition"){
      if(!manager)return reject("Only managers can add recognition.");
      add("recognition",{person:values.person,by:me,text:values.text,day:nowDay()});
    }else if(kind==="candidate"){
      if(!manager)return reject("Only managers can add applicants.");
      add("applicants",{name:values.name,position:values.position,stage:"Applied",owner:me});
    }else if(kind==="expense"){
      if(money<=0)return reject("Enter a valid expense amount.");
      add("expenses",{person:me,category:values.category,detail:values.detail,amount:money,status:"Pending",day:nowDay()});
    }else if(kind==="equipment"){
      if(!manager)return reject("Only managers can add assets.");
      add("equipment",{name:values.name,type:values.type,owner:values.owner,renewal:values.renewal,status:"Assigned"});
    }else if(kind==="helpdesk"){
      add("helpdesk",{person:me,category:values.category,title:values.title,priority:values.priority,status:"Open",day:nowDay()});
    }
    audit("Created or updated "+kind+" record",role);s.form="";s.formTarget="";persist();h.render();h.notify("Saved to local demo data.");return true;
  }
  function reset(){s=seed();persist();}
  global.AmplifyStaff={catalog,render,click,submit,reset,formFields,debug:()=>s};
})(window);
