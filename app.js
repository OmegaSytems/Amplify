
/* Omega Amplify — full UI/UX demonstration. Not a security boundary or live client portal. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(Number(n)||0);
const date = value => new Date(value).toLocaleDateString('en-AU',{day:'numeric',month:'short'});
const today = () => new Date().toISOString().slice(0,10);
const daysFromNow = n => new Date(Date.now()+n*86400000).toISOString().slice(0,10);
const id = () => 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
const icons = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  spark:'<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  megaphone:'<path d="m3 11 18-6v14L3 13Zm4 3 2 7h4l-3-8"/>',
  pen:'<path d="m13 7 4 4M4 20l4-.8L20 7a2 2 0 0 0-3-3L5 16l-1 4Z"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.8 9.7a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',tasks:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="m7 10 2 2 3-4M14 10h4M7 17h11"/>',
  messages:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 21l1.7-5A8.5 8.5 0 1 1 21 11.5Z"/>',
  chart:'<path d="M3 3v18h18M7 16l4-5 3 3 5-7"/>',
  wallet:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M16 14h2"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 0 0 .4 2.2l-2.6 2.6a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.6h-3.6A2 2 0 0 0 9 19.4a2 2 0 0 0-2.2.4l-2.6-2.6a2 2 0 0 0 .4-2.2A2 2 0 0 0 3 13.8v-3.6A2 2 0 0 0 4.6 9a2 2 0 0 0-.4-2.2l2.6-2.6A2 2 0 0 0 9 4.6 2 2 0 0 0 10.2 3h3.6A2 2 0 0 0 15 4.6a2 2 0 0 0 2.2-.4l2.6 2.6a2 2 0 0 0-.4 2.2 2 2 0 0 0 1.6 1.2v3.6A2 2 0 0 0 19.4 15Z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  plus:'<path d="M12 4v16M4 12h16"/>',chevron:'<path d="m9 18 6-6-6-6"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
  filter:'<path d="M4 7h16M7 12h10M10 17h4"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z"/>',
  close:'<path d="M5 5l14 14M19 5 5 19"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  shield:'<path d="m12 2 9 4v6c0 5-3 8-9 10-6-2-9-5-9-10V6l9-4Z"/><path d="m9 12 2 2 4-4"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  star:'<path d="m12 2 3.1 6.4 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1Z"/>',
  file:'<path d="M5 2h9l5 5v15H5Zm9 0v5h5M8 12h8M8 16h8"/>',
  support:'<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5M12 18h.01"/>',
  lock:'<rect x="4" y="11" width="16" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  moon:'<path d="M20 16A8 8 0 0 1 8 4a8 8 0 1 0 12 12Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 9a7 7 0 0 1 12-3l3 6M4 12l3 6a7 7 0 0 0 12-3"/>',
  checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  alert:'<path d="m12 3 10 18H2L12 3Zm0 7v4m0 4h.01"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"/>'
};
function icon(name, size=17) { return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[name]||icons.grid)+'</svg>'; }
const services = {
  paid: {name:'Amplify Paid',desc:'Paid advertising, conversion and attribution',icon:'megaphone'},
  organic:{name:'Amplify Organic',desc:'Social, SEO, AEO and editorial production',icon:'pen'},
  leads:{name:'Lead Engine — Leads Only',desc:'Prospecting, verification and lead delivery',icon:'target'},
  closing:{name:'Lead Engine — Leads + Closing',desc:'Outreach, appointments and closed deals',icon:'phone'}
};
const initial = () => ({
  accounts:[
    {id:'a',name:'Evergreen Dental',industry:'Healthcare',contact:'Mia Brooks',email:'mia@example.invalid',services:['paid','organic','leads'],status:'Active',owner:'Oliver',joined:daysFromNow(-48),value:3400,progress:86},
    {id:'b',name:'Northside Fitness',industry:'Fitness',contact:'Daniel Webb',email:'daniel@example.invalid',services:['organic','closing'],status:'Active',owner:'Avery',joined:daysFromNow(-63),value:2450,progress:61},
    {id:'c',name:'Bluewater Construction',industry:'Construction',contact:'Sophie Hart',email:'sophie@example.invalid',services:['paid','leads','closing'],status:'Onboarding',owner:'Oliver',joined:daysFromNow(-9),value:4300,progress:35},
    {id:'d',name:'Luna Interiors',industry:'Home & design',contact:'Luca Reid',email:'luca@example.invalid',services:['organic'],status:'Active',owner:'Avery',joined:daysFromNow(-24),value:980,progress:79}
  ],
  campaigns:[
    {id:'c1',account:'a',name:'New Patient Acquisition',channel:'Google Ads',budget:2200,spend:1670,leads:46,status:'Active',roas:3.7},
    {id:'c2',account:'a',name:'Local Awareness',channel:'Meta Ads',budget:850,spend:612,leads:19,status:'Active',roas:2.9},
    {id:'c3',account:'c',name:'Commercial Fit-Out Search',channel:'Google Ads',budget:3000,spend:1190,leads:22,status:'Active',roas:3.1},
    {id:'c4',account:'d',name:'Spring Promotion',channel:'Meta Ads',budget:850,spend:0,leads:0,status:'Draft',roas:0}
  ],
  leads:[
    {id:'l1',account:'a',name:'Jordan Miles',company:'Local resident',source:'Google Ads',stage:'New',value:950,owner:'Avery'},
    {id:'l2',account:'a',name:'Taylor Ross',company:'Local resident',source:'Landing page',stage:'Contacted',value:1200,owner:'Oliver'},
    {id:'l3',account:'a',name:'Sam Carter',company:'Local resident',source:'Meta Ads',stage:'Qualified',value:820,owner:'Oliver'},
    {id:'l4',account:'b',name:'Riley Scott',company:'Peak Gym',source:'Referral',stage:'Contacted',value:2500,owner:'Avery'},
    {id:'l5',account:'c',name:'Morgan Smith',company:'Sydney Build Co',source:'Outbound',stage:'New',value:6500,owner:'Oliver'},
    {id:'l6',account:'c',name:'Casey Reed',company:'Harbour Group',source:'Google Ads',stage:'Qualified',value:9100,owner:'Oliver'},
    {id:'l7',account:'c',name:'Jamie Lee',company:'Westside Offices',source:'Outbound',stage:'Won',value:5400,owner:'Avery'}
  ],
  deals:[
    {id:'d1',account:'b',name:'Corporate Wellness Package',company:'Peak Gym',stage:'Qualified',amount:2800,owner:'Avery'},
    {id:'d2',account:'c',name:'Office Renovation Contract',company:'Harbour Group',stage:'Proposal',amount:9200,owner:'Oliver'},
    {id:'d3',account:'c',name:'Retail Fit-out',company:'Westside Offices',stage:'Negotiation',amount:6600,owner:'Oliver'},
    {id:'d4',account:'b',name:'Annual Partnership',company:'Health Partners',stage:'Won',amount:4200,owner:'Avery'}
  ],
  posts:[
    {id:'p1',account:'a',title:'Five signs you need a dental check-up',channel:'Instagram',kind:'Carousel',day:daysFromNow(1),status:'Scheduled'},
    {id:'p2',account:'b',title:'Trainer spotlight: strength series',channel:'TikTok',kind:'Short video',day:daysFromNow(2),status:'Review'},
    {id:'p3',account:'a',title:'Local dental care — expert FAQ',channel:'Substack',kind:'Article',day:daysFromNow(3),status:'Draft'},
    {id:'p4',account:'d',title:'Before & after: studio redesign',channel:'Instagram',kind:'Reel',day:daysFromNow(4),status:'Approved'},
    {id:'p5',account:'b',title:'November mobility tips',channel:'Blog',kind:'SEO article',day:daysFromNow(5),status:'Scheduled'},
    {id:'p6',account:'d',title:'Space planning essentials',channel:'Pinterest',kind:'Carousel',day:daysFromNow(6),status:'Review'}
  ],
  approvals:[
    {id:'ap1',account:'a',title:'Google Ads — Search headlines',kind:'Ad creative',status:'Awaiting review',due:daysFromNow(1),version:'v2'},
    {id:'ap2',account:'b',title:'Trainer spotlight social video',kind:'Social video',status:'Awaiting review',due:daysFromNow(2),version:'v1'},
    {id:'ap3',account:'c',title:'Construction landing page',kind:'Landing page',status:'Awaiting review',due:daysFromNow(3),version:'v3'},
    {id:'ap4',account:'d',title:'November editorial plan',kind:'Content calendar',status:'Approved',due:daysFromNow(-2),version:'v1'}
  ],
  tasks:[
    {id:'t1',account:'a',title:'QA Google Ads conversion tracking',type:'Paid',priority:'High',status:'In progress',assignee:'Oliver',due:daysFromNow(1)},
    {id:'t2',account:'a',title:'Approve creative round two',type:'Approval',priority:'High',status:'Review',assignee:'Mia',due:daysFromNow(2)},
    {id:'t3',account:'b',title:'Write trainer spotlight captions',type:'Organic',priority:'Medium',status:'In progress',assignee:'Avery',due:daysFromNow(2)},
    {id:'t4',account:'c',title:'Validate new contractor lead batch',type:'Leads',priority:'High',status:'To do',assignee:'Oliver',due:daysFromNow(3)},
    {id:'t5',account:'c',title:'Prepare appointment setter script',type:'Closing',priority:'Medium',status:'Review',assignee:'Avery',due:daysFromNow(4)},
    {id:'t6',account:'d',title:'Schedule Pinterest assets',type:'Organic',priority:'Low',status:'Done',assignee:'Avery',due:daysFromNow(-1)}
  ],
  messages:[
    {id:'m1',account:'a',from:'Staff',text:'Your November campaign review is ready.',at:'09:20'},
    {id:'m2',account:'a',from:'Client',text:'Thanks — could we review the new headlines?',at:'10:05'},
    {id:'m3',account:'b',from:'Staff',text:'The trainer video is ready for your approval.',at:'11:15'},
    {id:'m4',account:'c',from:'Client',text:'Please prioritise commercial enquiries.',at:'12:10'},
    {id:'m5',account:'d',from:'Staff',text:'We have added the latest content calendar.',at:'13:35'}
  ],
  invoices:[
    {id:'i1',account:'a',number:'AMP-1041',description:'Monthly services — November',amount:3400,status:'Paid',due:daysFromNow(10)},
    {id:'i2',account:'b',number:'AMP-1042',description:'Monthly services — November',amount:2450,status:'Pending',due:daysFromNow(10)},
    {id:'i3',account:'c',number:'AMP-1043',description:'Onboarding and campaign setup',amount:4300,status:'Draft',due:daysFromNow(14)},
    {id:'i4',account:'d',number:'AMP-1044',description:'Organic growth retainer',amount:980,status:'Paid',due:daysFromNow(12)}
  ],
  tickets:[
    {id:'s1',account:'a',title:'Update opening hours on campaign page',priority:'Normal',status:'Open',created:daysFromNow(-1)},
    {id:'s2',account:'c',title:'Upload revised brand guidelines',priority:'Normal',status:'In progress',created:daysFromNow(-2)}
  ],
  crm:[
    {id:'r1',name:'Brightside Plumbing',contact:'Alex Morgan',value:2300,stage:'Discovery',owner:'Oliver'},
    {id:'r2',name:'Horizon Realty',contact:'Jordan Park',value:3200,stage:'Proposal',owner:'Avery'},
    {id:'r3',name:'Arc Manufacturing',contact:'Taylor Hill',value:4500,stage:'Negotiation',owner:'Oliver'},
    {id:'r4',name:'Hills Studio',contact:'Jamie Wells',value:1200,stage:'Won',owner:'Avery'}
  ],
  activities:[
    {id:'ac1',text:'Google Ads creative submitted for approval',account:'a',when:'12 min ago',icon:'pen'},
    {id:'ac2',text:'New qualified lead — Harbour Group',account:'c',when:'1 hour ago',icon:'target'},
    {id:'ac3',text:'Content plan updated',account:'b',when:'3 hours ago',icon:'calendar'},
    {id:'ac4',text:'Invoice AMP-1041 marked paid',account:'a',when:'Yesterday',icon:'wallet'},
    {id:'ac5',text:'New project onboarding started',account:'c',when:'2 days ago',icon:'briefcase'}
  ]
});
const storageKey = 'omega-amplify-ui-demo-v3';
let data;
try { const stored = JSON.parse(localStorage.getItem(storageKey) || 'null'); data = stored && Array.isArray(stored.accounts) ? stored : initial(); }
catch { data = initial(); }
let state = {role:'management',account:'all',page:'overview',query:'',filter:'All',board:'board',sidebar:false,modal:'',notification:false,command:false,theme:localStorage.getItem('omega-amplify-theme')||'dark'};
function save(){try{localStorage.setItem(storageKey,JSON.stringify(data));}catch{}}
function setTheme(){document.body.classList.toggle('light',state.theme==='light');try{localStorage.setItem('omega-amplify-theme',state.theme);}catch{}}
setTheme();
function accountName(accountId){return data.accounts.find(x=>x.id===accountId)?.name || 'Unknown account';}
function scoped(arr){if(state.role==='client')return arr.filter(x=>x.account===state.account);if(state.account!=='all')return arr.filter(x=>x.account===state.account);return arr;}
function subscribed(key){return state.role!=='client' || data.accounts.find(x=>x.id===state.account)?.services.includes(key);}
function roleLabel(){return {management:'Management',staff:'Staff',client:'Client'}[state.role];}
const sections = {
 management:[['WORKSPACE',[['overview','Overview','grid'],['clients','Clients','users'],['crm','Agency CRM','target'],['projects','Projects','layers'],['calendar','Calendar','calendar']]],['DELIVERY',[['paid','Paid advertising','megaphone'],['organic','Organic studio','pen'],['leads','Lead engine','target'],['closing','Closing pipeline','phone'],['approvals','Approvals','checkcircle'],['tasks','Task centre','tasks']]],['OPERATIONS',[['messages','Messages','messages'],['reports','Analytics','chart'],['billing','Billing','wallet'],['team','Team','briefcase'],['support','Support','support'],['settings','Settings','settings']]]],
 staff:[['MY WORK',[['overview','Overview','grid'],['tasks','My tasks','tasks'],['calendar','Calendar','calendar'],['clients','Assigned clients','users']]],['DELIVERY',[['paid','Paid advertising','megaphone'],['organic','Organic studio','pen'],['leads','Lead engine','target'],['closing','Closing pipeline','phone'],['approvals','Approvals','checkcircle'],['projects','Projects','layers']]],['TOOLS',[['messages','Messages','messages'],['reports','Reports','chart'],['support','Support','support'],['settings','Settings','settings']]]],
 client:[['MY WORKSPACE',[['overview','Overview','grid'],['services','My services','layers'],['projects','Projects','briefcase'],['approvals','Approvals','checkcircle']]],['MY RESULTS',[['paid','Paid advertising','megaphone'],['organic','Organic growth','pen'],['leads','My leads','target'],['closing','Sales pipeline','phone'],['calendar','Content calendar','calendar'],['reports','Reports','chart']]],['COLLABORATION',[['tasks','Tasks','tasks'],['messages','Messages','messages'],['billing','Billing','wallet'],['support','Support','support'],['settings','Settings','settings']]]]
};
const navItems=()=>sections[state.role].map(([heading,items])=>[heading,items.filter(([key])=>!({paid:'paid',organic:'organic',leads:'leads',closing:'closing'}[key])||subscribed(key))]).filter(([,items])=>items.length);
const pageTitle = () => (navItems().flatMap(x=>x[1]).find(x=>x[0]===state.page)||['','Workspace'])[1];
const pill=(s)=>{const v=String(s||'');const cls=/^(active|approved|paid|won|done|published|scheduled|qualified)$/i.test(v)?'green':/^(pending|review|awaiting|onboarding|proposal|draft|in progress|submitted|medium)$/i.test(v)?'yellow':/^(overdue|lost|cancelled|high|changes requested)$/i.test(v)?'red':'purple';return '<span class="pill '+cls+'">'+esc(v)+'</span>';};
const button=(label,action,value='',className='')=>'<button class="btn '+className+'" data-action="'+esc(action)+'" data-id="'+esc(value)+'">'+label+'</button>';
const panel=(title,content,action='')=>'<section class="panel panel-pad"><div class="panel-head"><h2>'+esc(title)+'</h2>'+action+'</div>'+content+'</section>';
const miniAvatar=(name)=>'<span class="mini-avatar" aria-hidden="true">'+esc(String(name).split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())+'</span>';
function tabular(headers,rows){return '<div class="table-scroll"><table class="data-table"><thead><tr>'+headers.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>';}
const td=s=>'<td>'+s+'</td>';
const linked=(text,action,idValue)=>'<button class="table-link" data-action="'+action+'" data-id="'+esc(idValue)+'">'+esc(text)+'</button>';
function empty(message){return '<div class="empty">'+icon('folder',35)+'<h3>Nothing here yet</h3><p>'+esc(message)+'</p></div>';}
function topHeader(title,subtitle,controls){return '<div class="page-header"><div><div class="eyebrow">OMEGA AMPLIFY / '+esc(roleLabel())+'</div><h1>'+esc(title)+'</h1><p>'+esc(subtitle)+'</p></div><div class="page-actions">'+(controls||'')+'</div></div>';}
function valueCard(label,value,foot,ico){return '<div class="panel metric-card"><div class="metric-label"><span class="stat-icon">'+icon(ico)+'</span>'+esc(label)+'</div><div class="metric-value">'+esc(value)+'</div><div class="metric-foot">'+foot+'</div></div>';}
function lineChart(values){const min=0,max=Math.max(...values,1)*1.15;const w=640,h=190;let points=values.map((v,i)=>(20+i*(600/Math.max(1,values.length-1)))+','+(170-(v-min)/max*138)).join(' ');return '<svg class="chart-svg" viewBox="0 0 640 190" preserveAspectRatio="none" role="img" aria-label="Demo trend chart"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4ebfc3" stop-opacity=".26"/><stop offset="100%" stop-color="#4ebfc3" stop-opacity="0"/></linearGradient></defs><path d="M20 30H620M20 77H620M20 124H620M20 170H620" stroke="currentColor" opacity=".10"/><polygon points="20,170 '+points+' 620,170" fill="url(#chartFill)"/><polyline points="'+points+'" stroke="#4cc6cb" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>';}
function activities(items){const rows=items.map(a=>'<div class="activity-item"><div class="activity-icon">'+icon(a.icon||'check',14)+'</div><div><p>'+esc(a.text)+'</p><small>'+esc(accountName(a.account))+' · '+esc(a.when)+'</small></div></div>').join('');return rows||empty('Activity will appear as you work.');}
function overview(){
 const accounts=state.role==='client'?data.accounts.filter(x=>x.id===state.account):state.account==='all'?data.accounts:data.accounts.filter(x=>x.id===state.account);
 const campaigns=scoped(data.campaigns),leads=scoped(data.leads),tasks=scoped(data.tasks),approval=scoped(data.approvals),invoice=scoped(data.invoices);
 const outstanding=approval.filter(x=>x.status==='Awaiting review').length;
 const arr=state.role==='client'?['Welcome back, '+(accounts[0]?.contact?.split(' ')[0]||'there')+'.','Your projects, results and decisions — all in one place.']:['Your agency, at a glance.','Keep delivery moving and clients informed across every service.'];
 const metrics=state.role==='client'?[['Campaigns',campaigns.filter(x=>x.status==='Active').length,'Currently active','megaphone'],['Leads generated',leads.length,'Illustrative demo records','target'],['Needs approval',outstanding,'Awaiting your decision','checkcircle'],['Open tasks',tasks.filter(x=>x.status!=='Done').length,'Across your services','tasks']]:[['Active accounts',accounts.filter(x=>x.status==='Active').length,'Agency portfolio','users'],['Monthly value',money(accounts.reduce((a,c)=>a+c.value,0)),'Example account retainers','wallet'],['Open leads',leads.filter(x=>x.stage!=='Won').length,'Across client campaigns','target'],['Pending approvals',outstanding,'Review queue','checkcircle']];
 const serviceCards=Object.entries(services).filter(([k])=>subscribed(k)).map(([k,s])=>'<div class="panel service-card"><span class="service-glyph">'+icon(s.icon,20)+'</span><h3>'+s.name+'</h3><p>'+s.desc+'</p><div class="footer">'+pill(state.role==='client'?'Included':'Workspace')+' '+button(icon('arrow',14),'nav',k,'ghost small')+'</div></div>').join('');
 return topHeader('Overview',state.role==='client'?'Monitor your growth and approve deliverables.':'A unified command centre for your agency.',button(icon('plus',15)+' New task','new-task','','primary'))
  +'<section class="hero"><div><div class="eyebrow">YOUR WORKSPACE</div><h2>'+esc(arr[0])+'</h2><p>'+esc(arr[1])+'</p><div class="inline" style="margin-top:17px">'+button('Review approvals '+icon('arrow',14),'nav','approvals','primary')+button('View reports','nav','reports','ghost')+'</div></div><div class="hero-visual"><div class="strong small">Delivery health · demo</div>'+[['Campaign performance',83],['Content delivery',71],['Client actions',58]].map(([label,v])=>'<div class="progress-line"><span style="width:124px">'+label+'</span><div class="progress-track"><div class="progress-fill" style="width:'+v+'%"></div></div><b>'+v+'%</b></div>').join('')+'</div></section>'
  +'<div class="metric-grid">'+metrics.map(x=>valueCard(...x)).join('')+'</div>'
  +'<div class="two-col"><div class="panel panel-pad"><div class="panel-head"><h2>Performance snapshot</h2>'+pill('Demo data')+'</div><div class="spread small muted"><span>Lead activity · last 8 weeks</span><span class="up">Sample trend</span></div><div class="chart-area">'+lineChart([18,24,22,29,31,38,35,49])+'</div><div class="chart-caption"><span><i class="legend-dot"></i>Lead activity</span><span>Illustrative — not synced</span></div></div>'+panel('Recent activity',activities(scoped(data.activities).slice(0,5)))+'</div>'
  +'<div class="panel-head" style="margin-top:28px"><h2>Service workspaces</h2><span class="small muted">Select to manage delivery</span></div><div class="four-col">'+serviceCards+'</div>';
}
function servicesPage(){
 const acct=data.accounts.find(x=>x.id===state.account);
 return topHeader('My services','Everything your organisation has access to in one place.')
 +'<div class="three-col">'+Object.entries(services).map(([k,s])=>'<div class="panel service-card"><span class="service-glyph">'+icon(s.icon,20)+'</span><h3>'+s.name+'</h3><p>'+s.desc+'</p>'+pill(acct.services.includes(k)?'Active subscription':'Not included')+'<div style="margin-top:16px">'+(acct.services.includes(k)?button('Open workspace '+icon('arrow',14),'nav',k,'primary'):button('Contact your account manager','nav','messages'))+'</div></div>').join('')+'</div>';
}
function clientsPage(){
 let items=data.accounts.filter(x=>(state.query+'')===''||[x.name,x.industry,x.contact].join(' ').toLowerCase().includes(state.query.toLowerCase()));
 return topHeader(state.role==='staff'?'Assigned clients':'Client accounts','Accounts, subscriptions, ownership and onboarding status.',button(icon('plus',15)+' Add client','new-client','','primary'))
 +'<div class="metric-grid">'+valueCard('Total accounts',items.length,'Illustrative portfolio','users')+valueCard('Active clients',items.filter(x=>x.status==='Active').length,'On active retainers','checkcircle')+valueCard('Onboarding',items.filter(x=>x.status==='Onboarding').length,'Needs setup','clock')+valueCard('Monthly retainers',money(items.reduce((s,x)=>s+x.value,0)),'Illustrative value','wallet')+'</div>'
 +'<div class="panel">'+filterBar('Search accounts','All',['All','Active','Onboarding'])+tabular(['CLIENT','SERVICES','CONTACT','OWNER','STATUS','MONTHLY',''],items.filter(x=>state.filter==='All'||x.status===state.filter).map(x=>'<tr>'+td('<span class="client-name">'+miniAvatar(x.name)+linked(x.name,'open-client',x.id)+'</span>')+td(x.services.map(k=>'<span class="pill" style="margin:2px">'+esc(services[k]?.name.split(' —')[0])+'</span>').join(''))+td(esc(x.contact))+td(esc(x.owner))+td(pill(x.status))+td(money(x.value))+td(button(icon('chevron',14),'open-client',x.id,'ghost small'))+'</tr>'))+'</div>';
}
function filterBar(placeholder,selected,options){return '<div class="toolbar" style="padding:14px 17px;margin:0"><div class="toolbar-left"><input class="field search-field" id="page-search" aria-label="Search records" placeholder="'+esc(placeholder)+'" value="'+esc(state.query)+'"><select class="field-select" id="page-filter" aria-label="Filter records">'+options.map(x=>'<option '+(state.filter===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div><span class="small muted">Demo workspace</span></div>';}
function clientDetail(accountId){
 const a=data.accounts.find(x=>x.id===accountId);if(!a)return overview();
 const ts=data.tasks.filter(x=>x.account===a.id), lead=data.leads.filter(x=>x.account===a.id);
 return topHeader(a.name,'Account profile and service delivery overview.',button(icon('arrow',15)+' Back to clients','nav','clients')+button('Open client workspace','switch-client',a.id,'primary'))
 +'<div class="metric-grid">'+valueCard('Monthly value',money(a.value),'Demo amount','wallet')+valueCard('Services',a.services.length,'Subscribed offers','layers')+valueCard('Lead records',lead.length,'In current demo','target')+valueCard('Open tasks',ts.filter(t=>t.status!=='Done').length,'Delivery queue','tasks')+'</div>'
 +'<div class="two-col"><div class="stack">'+panel('Account information','<div class="step-list">'+[['Primary contact',a.contact],['Email',a.email],['Industry',a.industry],['Account owner',a.owner],['Status',a.status]].map(([k,v])=>'<div class="spread"><span class="muted">'+esc(k)+'</span><b>'+esc(v)+'</b></div>').join('')+'</div>')+panel('Service subscriptions',a.services.map(k=>'<div class="spread" style="padding:10px 0">'+icon(services[k].icon)+' <b>'+esc(services[k].name)+'</b> '+pill('Active')+'</div>').join(''))+'</div>'
 +'<div class="stack">'+panel('Onboarding checklist','<div class="step-list">'+[['Service agreement',true],['Brand assets collected',true],['Tracking confirmed',a.progress>50],['First campaign approved',a.progress>75],['Reporting review booked',false]].map(([k,v],i)=>'<div class="step-row"><span class="step-dot '+(v?'done':'')+'">'+(v?icon('check',13):i+1)+'</span>'+esc(k)+'</div>').join('')+'</div>')+panel('Open work',ts.map(t=>'<div class="activity-item">'+icon('tasks')+'<div><p>'+esc(t.title)+'</p>'+pill(t.status)+'</div></div>').join('')||empty('No outstanding work.'))+'</div></div>';
}
function agencyCRM(){
 const stages=['Discovery','Proposal','Negotiation','Won'];return topHeader('Agency CRM','New business opportunities from first touch to signed agreement.',button(icon('plus',15)+' Add opportunity','new-opportunity','','primary'))
 +'<div class="metric-grid">'+valueCard('Opportunities',data.crm.length,'Active pipeline','target')+valueCard('Pipeline value',money(data.crm.reduce((s,x)=>s+x.value,0)),'Illustrative value','wallet')+valueCard('In proposal',data.crm.filter(x=>x.stage==='Proposal').length,'Follow-up required','file')+valueCard('Won',data.crm.filter(x=>x.stage==='Won').length,'Sales closed','checkcircle')+'</div>'
 +board(stages,data.crm,(x)=>x.stage,(x)=>'<div class="small muted">'+esc(x.contact)+'</div><strong>'+esc(x.name)+'</strong><div class="spread"><b>'+money(x.value)+'</b>'+pill(x.owner)+'</div><div class="inline">'+button('Move forward '+icon('arrow',12),'next-crm',x.id,'small ghost')+'</div>');
}
function board(stages,items,stageOf,renderCard){return '<div class="kanban">'+stages.map(stage=>{let cards=items.filter(x=>stageOf(x)===stage);return '<section class="kanban-col"><h3><span>'+esc(stage)+'</span>'+pill(cards.length)+'</h3>'+cards.map(x=>'<div class="kanban-card">'+renderCard(x)+'</div>').join('')+(cards.length?'':'<div class="small muted">No items</div>')+'</section>';}).join('')+'</div>';}
function projectsPage(){
 const groups=scoped(data.accounts.map(a=>({id:a.id,account:a.id,name:a.name,status:a.status,progress:a.progress,services:a.services})));
 return topHeader('Projects','Track onboarding and delivery for every client.',button(icon('plus',15)+' New task','new-task','','primary'))
 +'<div class="three-col">'+groups.map(x=>'<div class="panel panel-pad"><div class="spread">'+miniAvatar(x.name)+pill(x.status)+'</div><h2 style="margin:13px 0 5px">'+esc(x.name)+'</h2><div class="small muted">'+x.services.map(k=>services[k].name.split(' —')[0]).join(' · ')+'</div><div class="progress-mini"><i style="width:'+x.progress+'%"></i></div><div class="spread small muted"><span>Delivery progress</span><b>'+x.progress+'%</b></div><div style="margin-top:16px">'+button('View project '+icon('arrow',13),'open-client',x.account,'ghost small')+'</div></div>').join('')+'</div>';
}
function campaignsPage(){
 const items=scoped(data.campaigns).filter(x=>state.filter==='All'||x.status===state.filter).filter(x=>x.name.toLowerCase().includes(state.query.toLowerCase()));
 const spend=items.reduce((a,x)=>a+x.spend,0), lead=items.reduce((a,x)=>a+x.leads,0);
 return topHeader('Paid advertising','Campaign delivery, budgets, performance and approval checkpoints.',state.role==='client'?'':button(icon('plus',15)+' New campaign','new-campaign','','primary'))
 +'<div class="metric-grid">'+valueCard('Media spend',money(spend),'Recorded demo spend','wallet')+valueCard('Ad leads',lead,'Attributed demo leads','users')+valueCard('Cost per lead',lead?money(spend/lead):'—','Spend / recorded leads','target')+valueCard('Live campaigns',items.filter(x=>x.status==='Active').length,'Currently active','megaphone')+'</div>'
 +'<div class="two-col"><div class="panel panel-pad"><div class="panel-head"><h2>Campaign performance</h2>'+pill('Example only')+'</div><div class="chart-area">'+lineChart([7,12,10,19,25,21,31,39])+'</div><span class="small muted">Demo weekly lead trend</span></div>'+panel('Launch checklist','<div class="step-list">'+[['Tracking configured',true],['Creative submitted',true],['Client approval',false],['Campaign launch review',false]].map(([n,v],i)=>'<div class="step-row"><span class="step-dot '+(v?'done':'')+'">'+(v?icon('check',13):i+1)+'</span>'+n+'</div>').join('')+'</div>')+'</div>'
 +'<div class="panel">'+filterBar('Search campaigns','All',['All','Active','Draft','Paused'])+tabular(['CAMPAIGN','CLIENT','CHANNEL','SPEND','LEADS','ROAS','STATUS'],items.map(x=>'<tr>'+td('<b>'+esc(x.name)+'</b>')+td(esc(accountName(x.account)))+td(esc(x.channel))+td(money(x.spend))+td(esc(x.leads))+td(x.roas?'×'+x.roas:'—')+td(pill(x.status))+'</tr>'))+'</div>';
}
function organicPage(){
 const posts=scoped(data.posts).filter(x=>state.filter==='All'||x.status===state.filter).filter(x=>x.title.toLowerCase().includes(state.query.toLowerCase()));
 return topHeader('Organic studio','Plan, produce, review and schedule content across channels.',state.role==='client'?'':button(icon('plus',15)+' New content','new-post','','primary'))
 +'<div class="metric-grid">'+valueCard('Content items',scoped(data.posts).length,'In editorial pipeline','pen')+valueCard('Scheduled',scoped(data.posts).filter(x=>x.status==='Scheduled').length,'Upcoming content','calendar')+valueCard('Awaiting review',scoped(data.posts).filter(x=>x.status==='Review').length,'Editorial approvals','checkcircle')+valueCard('Channels',new Set(scoped(data.posts).map(x=>x.channel)).size,'Social, blog and Substack','layers')+'</div>'
 +'<div class="panel panel-pad"><div class="panel-head"><h2>Editorial production</h2>'+button('Open calendar '+icon('arrow',14),'nav','calendar','ghost small')+'</div><div class="toolbar-left" style="margin-bottom:18px"><input class="field search-field" id="page-search" placeholder="Search content" value="'+esc(state.query)+'"><select class="field-select" id="page-filter">'+['All','Draft','Review','Approved','Scheduled'].map(x=>'<option '+(x===state.filter?'selected':'')+'>'+x+'</option>').join('')+'</select></div><div class="three-col">'+posts.map((p,i)=>'<article class="board-card"><div class="spread"><span class="pill">'+esc(p.channel)+'</span>'+pill(p.status)+'</div><div class="preview-image '+(['','orange','green'][i%3])+'">'+icon('pen',27)+'<span style="margin-left:12px">'+esc(p.kind)+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(accountName(p.account))+' · '+date(p.day)+'</p><div class="inline" style="margin-top:14px">'+(state.role==='client'?'':button('Next step '+icon('arrow',12),'next-post',p.id,'small'))+button('Details','post-detail',p.id,'small ghost')+'</div></article>').join('')+'</div>'+(!posts.length?empty('No content matches your filters.'):'')+'</div>';
}
function calendarPage(){
 const first=new Date();first.setDate(first.getDate()-first.getDay()+1);
 const days=Array.from({length:14},(_,i)=>{let d=new Date(first);d.setDate(first.getDate()+i);return d;});
 return topHeader('Content calendar','Two-week editorial schedule across connected service workspaces.',state.role==='client'?'':button(icon('plus',15)+' Add content','new-post','','primary'))
 +'<div class="panel panel-pad"><div class="panel-head"><h2>Upcoming fortnight</h2>'+pill('Demo schedule')+'</div><div class="calendar-head">'+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>'<span>'+x+'</span>').join('')+'</div><div class="calendar-grid">'+days.map(d=>{let day=d.toISOString().slice(0,10);return '<div class="calendar-cell"><div class="date">'+d.toLocaleDateString('en-AU',{day:'numeric',month:'short'})+'</div>'+scoped(data.posts).filter(p=>p.day===day).map(p=>'<div class="calendar-event" title="'+esc(p.title)+'">'+esc(p.channel)+' · '+esc(p.title)+'</div>').join('')+'</div>';}).join('')+'</div></div>';
}
const leadStages=['New','Contacted','Qualified','Won'];
function leadsPage(){
 const items=scoped(data.leads).filter(x=>[x.name,x.company,x.source].join(' ').toLowerCase().includes(state.query.toLowerCase()));
 return topHeader('Lead engine','Prospect discovery, qualification and verified delivery.',button(icon('download',15)+' Export CSV','export-leads')+(state.role==='client'?'':button(icon('plus',15)+' Add lead','new-lead','','primary')))
 +'<div class="metric-grid">'+valueCard('Lead records',items.length,'Example pipeline','target')+valueCard('Qualified',items.filter(x=>x.stage==='Qualified').length,'Ready to act','checkcircle')+valueCard('Contacted',items.filter(x=>x.stage==='Contacted').length,'Contact in progress','messages')+valueCard('Pipeline value',money(items.reduce((s,x)=>s+x.value,0)),'Illustrative value','wallet')+'</div>'
 +'<div class="toolbar"><div class="toolbar-left"><input class="field search-field" placeholder="Search leads" id="page-search" value="'+esc(state.query)+'"></div>'+pill('Demo lead records')+'</div>'
 +board(leadStages,items,x=>x.stage,x=>'<div class="spread">'+pill(x.source)+'<span class="tiny muted">'+esc(x.owner)+'</span></div><strong>'+esc(x.name)+'</strong><p>'+esc(x.company)+' · '+esc(accountName(x.account))+'</p><b>'+money(x.value)+'</b><div class="inline">'+(state.role==='client'?'':button('Advance '+icon('arrow',13),'next-lead',x.id,'small ghost'))+'</div>');
}
const dealStages=['Qualified','Proposal','Negotiation','Won'];
function closingPage(){
 const items=scoped(data.deals);
 return topHeader('Closing pipeline','Appointments, proposals and revenue outcomes in one pipeline.',state.role==='client'?'':button(icon('plus',15)+' New deal','new-deal','','primary'))
 +'<div class="metric-grid">'+valueCard('Open deals',items.filter(x=>x.stage!=='Won').length,'In active pipeline','briefcase')+valueCard('Pipeline',money(items.reduce((s,x)=>s+x.amount,0)),'Indicative deal value','wallet')+valueCard('Proposals',items.filter(x=>x.stage==='Proposal').length,'Under consideration','file')+valueCard('Closed won',money(items.filter(x=>x.stage==='Won').reduce((s,x)=>s+x.amount,0)),'Illustrative revenue','checkcircle')+'</div>'
 +board(dealStages,items,x=>x.stage,x=>'<div class="small muted">'+esc(x.company)+'</div><strong>'+esc(x.name)+'</strong><b>'+money(x.amount)+'</b><p>'+esc(accountName(x.account))+'</p>'+(state.role==='client'?'':button('Advance '+icon('arrow',13),'next-deal',x.id,'small ghost')));
}
function approvalsPage(){
 const list=scoped(data.approvals);
 return topHeader('Approvals','Review deliverables, share feedback and keep production moving.',state.role==='client'?'':button(icon('plus',15)+' Submit deliverable','new-approval','','primary'))
 +'<div class="metric-grid">'+valueCard('Awaiting review',list.filter(x=>x.status==='Awaiting review').length,'Needs a decision','clock')+valueCard('Approved',list.filter(x=>x.status==='Approved').length,'Ready for delivery','checkcircle')+valueCard('Changes requested',list.filter(x=>x.status==='Changes requested').length,'Needs revision','pen')+valueCard('Total items',list.length,'Approval history','file')+'</div>'
 +'<div class="three-col">'+list.map((x,i)=>'<article class="panel panel-pad"><div class="spread">'+pill(x.kind)+pill(x.status)+'</div><div class="preview-image '+(['','orange','green'][i%3])+'">'+icon('file',33)+'</div><h3>'+esc(x.title)+'</h3><div class="small muted">'+esc(accountName(x.account))+' · '+esc(x.version)+' · Due '+date(x.due)+'</div><div class="divider"></div><div class="inline">'+(x.status==='Awaiting review'?button(icon('check',13)+' Approve','approve',x.id,'small success')+button('Request changes','request',x.id,'small'):'')+button('View details','approval-detail',x.id,'small ghost')+'</div></article>').join('')+'</div>';
}
const taskStages=['To do','In progress','Review','Done'];
function tasksPage(){
 const tasks=scoped(data.tasks).filter(x=>[x.title,x.assignee,x.type].join(' ').toLowerCase().includes(state.query.toLowerCase()));
 return topHeader(state.role==='staff'?'My tasks':'Task centre','Assign, prioritise and track every delivery milestone.',state.role==='client'?'':button(icon('plus',15)+' New task','new-task','','primary'))
 +'<div class="metric-grid">'+valueCard('Open tasks',tasks.filter(x=>x.status!=='Done').length,'Across workspaces','tasks')+valueCard('Due soon',tasks.filter(x=>x.due<=daysFromNow(3)&&x.status!=='Done').length,'Within three days','clock')+valueCard('High priority',tasks.filter(x=>x.priority==='High'&&x.status!=='Done').length,'Needs attention','alert')+valueCard('Completed',tasks.filter(x=>x.status==='Done').length,'Current demo records','checkcircle')+'</div>'
 +'<div class="toolbar"><input id="page-search" class="field search-field" placeholder="Search tasks" value="'+esc(state.query)+'"><span class="small muted">Move cards using the next-stage action</span></div>'
 +board(taskStages,tasks,x=>x.status,x=>'<div class="spread">'+pill(x.priority)+'<span class="tiny muted">'+esc(x.type)+'</span></div><strong>'+esc(x.title)+'</strong><p>'+esc(accountName(x.account))+'</p><div class="spread small muted"><span>'+icon('clock',13)+' '+date(x.due)+'</span><span>'+esc(x.assignee)+'</span></div><div class="inline">'+(state.role==='client'?'':button('Move forward '+icon('arrow',12),'next-task',x.id,'small ghost'))+'</div>');
}
function messagesPage(){
 const current=state.account==='all'?'a':state.account;
 const groups=(state.role==='client'?data.accounts.filter(x=>x.id===state.account):data.accounts);
 return topHeader('Messages','Keep every client conversation connected to its account.')
 +'<section class="panel chat-layout"><div class="thread-list"><h3 class="small muted">CONVERSATIONS</h3>'+groups.map(a=>'<button class="thread-button '+(a.id===current?'active':'')+'" data-action="select-account" data-id="'+a.id+'"><span class="client-name">'+miniAvatar(a.name)+'<span><b>'+esc(a.name)+'</b><br><span class="tiny muted">Account chat</span></span></span></button>').join('')+'</div><div class="chat-area"><div class="spread"><h2>'+esc(accountName(current))+'</h2>'+pill('Demo conversation')+'</div><div class="messages-list" role="log" aria-label="Conversation messages">'+data.messages.filter(x=>x.account===current).map(m=>'<div class="bubble '+(m.from===(state.role==='client'?'Client':'Staff')?'mine':'')+'"><span class="strong">'+esc(m.from)+'</span><div>'+esc(m.text)+'</div><div class="tiny muted">'+esc(m.at)+'</div></div>').join('')+'</div><form id="message-form" class="composer"><input class="field" id="message-input" maxlength="10000" placeholder="Type a message…" required aria-label="New message"><button class="btn primary" type="submit">'+icon('arrow',15)+' Send</button></form></div></section>';
}
function reportsPage(){
 const campaigns=scoped(data.campaigns),leads=scoped(data.leads),accounts=state.account==='all'?data.accounts:data.accounts.filter(x=>x.id===state.account);
 let spend=campaigns.reduce((x,c)=>x+c.spend,0);
 return topHeader('Reports & analytics','Multi-channel insights with clear attribution and review.',button(icon('download',15)+' Export CSV','export-report'))
 +'<div class="banner">'+icon('alert',15)+' These figures are illustrative demonstration values, not connected to advertising platforms.</div>'
 +'<div class="metric-grid">'+valueCard('Total spend',money(spend),'Recorded example spend','wallet')+valueCard('Tracked leads',leads.length,'Illustrative records','target')+valueCard('Cost per lead',leads.length?money(spend/leads.length):'—','Illustrative ratio','chart')+valueCard('Subscribed offers',accounts.reduce((n,c)=>n+c.services.length,0),'Account subscriptions','layers')+'</div>'
 +'<div class="two-col">'+panel('Growth trend','<div class="chart-caption"><span><i class="legend-dot"></i>New leads</span><span>8-week sample</span></div><div class="chart-area">'+lineChart([19,26,21,36,29,40,45,52])+'</div>')+panel('Channel mix','<div class="step-list">'+[['Google Ads',54],['Meta Ads',26],['Organic',14],['Outbound',6]].map(([s,v])=>'<div><div class="spread small"><span>'+s+'</span><b>'+v+'%</b></div><div class="progress-mini"><i style="width:'+v+'%"></i></div></div>').join('')+'</div>')+'</div>'
 +panel('Campaign breakdown',tabular(['CAMPAIGN','CHANNEL','SPEND','LEADS','ROAS'],campaigns.map(c=>'<tr>'+td('<b>'+esc(c.name)+'</b>')+td(esc(c.channel))+td(money(c.spend))+td(String(c.leads))+td(c.roas?'×'+c.roas:'—')+'</tr>')));
}
function billingPage(){
 const rows=scoped(data.invoices),total=rows.reduce((s,x)=>s+x.amount,0);
 return topHeader('Billing','Invoices and payment status in your account workspace.',state.role==='client'?'':button(icon('plus',15)+' New invoice','new-invoice','','primary'))
 +'<div class="metric-grid">'+valueCard('Invoiced',money(total),'Example total','wallet')+valueCard('Paid',money(rows.filter(x=>x.status==='Paid').reduce((s,x)=>s+x.amount,0)),'Recorded payments','checkcircle')+valueCard('Pending',money(rows.filter(x=>x.status==='Pending').reduce((s,x)=>s+x.amount,0)),'Awaiting payment','clock')+valueCard('Invoices',rows.length,'Demo account records','file')+'</div>'
 +'<div class="panel">'+tabular(['INVOICE','ACCOUNT','DESCRIPTION','DUE','AMOUNT','STATUS'],rows.map(x=>'<tr>'+td('<b>'+esc(x.number)+'</b>')+td(esc(accountName(x.account)))+td(esc(x.description))+td(date(x.due))+td('<b>'+money(x.amount)+'</b>')+td(pill(x.status))+'</tr>'))+'</div><p class="small muted" style="margin-top:15px">Payments are not processed in this demo. Stripe integration is not configured.</p>';
}
function teamPage(){
 const team=[['Oliver','Account delivery','Management'],['Avery','Organic and lead delivery','Staff'],['Taylor','Campaign operations','Staff'],['Morgan','Client success','Staff']];
 return topHeader('Team','Roles, availability and delivery ownership.',button(icon('plus',15)+' Add task','new-task','','primary'))+'<div class="three-col">'+team.map(x=>'<article class="panel panel-pad"><div class="spread">'+miniAvatar(x[0])+pill(x[2])+'</div><h3 style="margin:16px 0 4px">'+x[0]+'</h3><p class="small muted">'+x[1]+'</p><div class="divider"></div><div class="spread small"><span>Assigned tasks</span><b>'+data.tasks.filter(t=>t.assignee===x[0]).length+'</b></div></article>').join('')+'</div>';
}
function supportPage(){
 const rows=scoped(data.tickets);
 return topHeader('Support centre','Raise requests, track status and stay informed.',button(icon('plus',15)+' New request','new-ticket','','primary'))
 +'<div class="metric-grid">'+valueCard('Open requests',rows.filter(x=>x.status==='Open').length,'Awaiting action','support')+valueCard('In progress',rows.filter(x=>x.status==='In progress').length,'Being handled','clock')+valueCard('Resolved',rows.filter(x=>x.status==='Resolved').length,'Completed requests','checkcircle')+valueCard('Total requests',rows.length,'Current tickets','file')+'</div>'
 +'<div class="panel">'+tabular(['REQUEST','ACCOUNT','CREATED','PRIORITY','STATUS',''],rows.map(x=>'<tr>'+td('<b>'+esc(x.title)+'</b>')+td(esc(accountName(x.account)))+td(date(x.created))+td(pill(x.priority))+td(pill(x.status))+td(state.role==='client'?'':button(x.status==='Resolved'?'Resolved':'Resolve','resolve-ticket',x.id,'small'))+'</tr>'))+'</div>';
}
function settingsPage(){
 return topHeader('Workspace settings','Preferences and access information for this demonstration.')
 +'<div class="two-col">'+panel('Appearance & accessibility','<p class="muted small">Choose an interface theme. The layout also adapts to smaller screens and keyboard navigation.</p><div class="inline">'+button(icon(state.theme==='light'?'moon':'sun',14)+' Switch to '+(state.theme==='light'?'dark':'light')+' mode','toggle-theme')+'</div><div class="divider"></div><h3>Keyboard shortcuts</h3><p class="small muted">⌘ K / Ctrl K — Search workspaces<br>Escape — Close dialog</p>')+panel('Access & privacy','<div class="banner">'+icon('lock',16)+' Demo role switching is not authentication.</div><p class="small muted">This static demonstration uses sample records stored locally in your browser. The production system must use verified login sessions, database tenant controls and audited permissions.</p>'+button(icon('refresh',14)+' Reset demonstration data','reset-demo'))+'</div>'
 +panel('Release readiness','<div class="step-list">'+[['Responsive UI navigation',true],['Service delivery screens',true],['Demo workflows and approvals',true],['Real authentication',false],['Supabase tenant security validated',false],['Stripe and ad platform integration',false],['Production deployment and end-to-end QA',false]].map(([text,done],i)=>'<div class="step-row"><span class="step-dot '+(done?'done':'')+'">'+(done?icon('check',12):i+1)+'</span>'+text+'</div>').join('')+'</div>');
}
const renderers={overview,services:servicesPage,clients:clientsPage,crm:agencyCRM,projects:projectsPage,calendar:calendarPage,paid:campaignsPage,organic:organicPage,leads:leadsPage,closing:closingPage,approvals:approvalsPage,tasks:tasksPage,messages:messagesPage,reports:reportsPage,billing:billingPage,team:teamPage,support:supportPage,settings:settingsPage};
function render(){
 const currentPage=state.page==='client-detail'?'Client profile':pageTitle();
 const sidebar='<aside class="sidebar '+(state.sidebar?'open':'')+'" id="sidebar" aria-label="Workspace navigation"><div class="brand"><span class="brand-symbol">Ω</span><div><div class="brand-title">Amplify</div><div class="brand-sub">OMEGA SYSTEMS</div></div></div>'+navItems().map(([heading,items])=>'<div class="menu-block"><div class="menu-label">'+esc(heading)+'</div>'+items.map(([k,label,ico])=>'<button class="side-link '+(state.page===k?'active':'')+'" data-action="nav" data-id="'+k+'" '+(state.page===k?'aria-current="page"':'')+'>'+icon(ico,17)+' '+esc(label)+'</button>').join('')+'</div>').join('')+'<div class="sidebar-bottom"><div class="side-profile"><div class="avatar">Ω</div><div class="profile-meta"><b>Amplify workspace</b><small>'+esc(roleLabel())+' · Demo</small></div></div></div></aside>';
 const bar='<header class="topbar"><div class="breadcrumbs"><span>Omega Group</span>'+icon('chevron',12)+'<span>Amplify</span>'+icon('chevron',12)+'<span class="crumb-current">'+esc(currentPage)+'</span></div><button class="icon-btn mobile-only" data-action="toggle-menu" aria-label="Open menu">'+icon('menu',20)+'</button><div class="top-actions"><button class="command" data-action="command">'+icon('search',15)+'<span>Search workspaces</span><kbd class="kbd">⌘ K</kbd></button><select id="role-select" class="selector role-switch" aria-label="Preview workspace role">'+[['management','Management'],['staff','Staff'],['client','Client']].map(([k,v])=>'<option value="'+k+'" '+(state.role===k?'selected':'')+'>'+v+'</option>').join('')+'</select><select id="account-select" class="selector" aria-label="Select demo account">'+(state.role==='client'?'': '<option value="all" '+(state.account==='all'?'selected':'')+'>All accounts</option>')+data.accounts.map(a=>'<option value="'+esc(a.id)+'" '+(a.id===state.account?'selected':'')+'>'+esc(a.name)+'</option>').join('')+'</select><button class="icon-btn" data-action="toggle-notifications" aria-label="Notifications">'+icon('bell',18)+'<span class="dot"></span></button><button class="icon-btn" data-action="toggle-theme" aria-label="Toggle theme">'+icon(state.theme==='dark'?'moon':'sun',18)+'</button></div></header>';
 let view=(state.page==='client-detail' ? clientDetail(state.selectedClient) : (renderers[state.page]||overview)());
 const notice='<div class="banner">'+icon('alert',15)+' Demonstration only — sample records, local browser storage and preview roles. No live data or authentication.</div>';
 $('#app').innerHTML='<div class="shell">'+sidebar+'<div class="workspace">'+bar+'<main class="content">'+notice+view+'<footer class="footer-note">© Omega Amplify · Internal UI prototype · No live client data · AUD</footer></main></div></div>';
 if(state.notification)$('#overlay-root').innerHTML='<div class="notification-pop"><div class="spread"><h3>Notifications</h3>'+button(icon('close',12),'toggle-notifications','','small ghost')+'</div>'+activities(scoped(data.activities).slice(0,3))+'</div>';
 else if(!state.modal&&!state.command)$('#overlay-root').innerHTML='';
 if(state.modal)renderModal();
 if(state.command)renderCommand();
}
function goto(page){state.page=page;state.query='';state.filter='All';state.sidebar=false;state.notification=false;state.modal='';state.command=false;render();window.scrollTo(0,0);}
function notify(message){$('#toast')?.remove();const el=document.createElement('div');el.className='toast';el.id='toast';el.setAttribute('role','status');el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),3500);}
function advance(items,idVal,stages,field='stage'){const x=items.find(x=>x.id===idVal);if(!x)return;const i=stages.indexOf(x[field]);if(i===-1||i===stages.length-1){notify('This item is already at the final stage.');return;}x[field]=stages[i+1];save();render();notify('Moved to '+x[field]);}
function csv(rows,filename){if(!rows.length){notify('No rows to export.');return;}const cols=Object.keys(rows[0]);const safe=v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};const str=[cols.map(safe).join(','),...rows.map(x=>cols.map(c=>safe(x[c])).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([str],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}
const forms={
 'new-client':{title:'Add client account',desc:'Create a fictional demo client for testing the workspace.',fields:[['name','Client name','text',true],['contact','Primary contact','text',true],['industry','Industry','text',true],['email','Contact email','email',true],['value','Monthly retainer (AUD)','number',true]]},
 'new-task':{title:'Create task',desc:'Assign a delivery task to an account.',fields:[['title','Task title','text',true],['account','Client account','account',true],['assignee','Assignee','text',true],['priority','Priority','choice:Low|Medium|High',true],['due','Due date','date',true]]},
 'new-lead':{title:'Add lead',desc:'Create a new prospect in the demo lead pipeline.',fields:[['name','Contact name','text',true],['company','Organisation','text',true],['account','Client account','account',true],['source','Lead source','choice:Google Ads|Meta Ads|Outbound|Referral|Landing page',true],['value','Potential value (AUD)','number',true]]},
 'new-deal':{title:'New sales opportunity',desc:'Track a qualified opportunity through closing.',fields:[['name','Deal name','text',true],['company','Company','text',true],['account','Client account','account',true],['amount','Potential value (AUD)','number',true]]},
 'new-opportunity':{title:'New agency opportunity',desc:'Create a prospect for Omega Amplify services.',fields:[['name','Business name','text',true],['contact','Primary contact','text',true],['value','Monthly value (AUD)','number',true]]},
 'new-campaign':{title:'New advertising campaign',desc:'Plan a paid campaign for a client account.',fields:[['name','Campaign name','text',true],['account','Client account','account',true],['channel','Ad channel','choice:Google Ads|Meta Ads|TikTok Ads',true],['budget','Planned budget (AUD)','number',true]]},
 'new-post':{title:'Add editorial content',desc:'Create a draft for the content calendar.',fields:[['title','Content title','text',true],['account','Client account','account',true],['channel','Channel','choice:Instagram|TikTok|Substack|Blog|Pinterest|LinkedIn',true],['kind','Format','choice:Reel|Carousel|Article|Short video',true],['day','Publish date','date',true]]},
 'new-approval':{title:'Submit for approval',desc:'Create a deliverable for client review.',fields:[['title','Deliverable name','text',true],['account','Client account','account',true],['kind','Type','choice:Ad creative|Social video|Landing page|Content calendar',true],['due','Due date','date',true]]},
 'new-invoice':{title:'Add invoice record',desc:'Demo record only. No payment is charged.',fields:[['account','Client account','account',true],['description','Description','text',true],['amount','Amount (AUD)','number',true],['due','Due date','date',true]]},
 'new-ticket':{title:'New support request',desc:'Describe an issue or change you need.',fields:[['title','Request title','text',true],['priority','Priority','choice:Normal|Urgent',true]]},
 'request':{title:'Request changes',desc:'Tell the team what needs revision.',fields:[['note','Revision notes','textarea',true]]}
};
function formInput(field){
 const [name,label,kind,required]=field;const req=required?' required':'';
 let html='';
 if(kind==='account')html='<select class="field-select" name="'+name+'"'+req+'>'+data.accounts.filter(a=>state.role!=='client'||a.id===state.account).map(a=>'<option value="'+esc(a.id)+'" '+(a.id===state.account?'selected':'')+'>'+esc(a.name)+'</option>').join('')+'</select>';
 else if(kind.startsWith('choice:'))html='<select class="field-select" name="'+name+'"'+req+'>'+kind.slice(7).split('|').map(v=>'<option>'+esc(v)+'</option>').join('')+'</select>';
 else if(kind==='textarea')html='<textarea class="field-textarea" name="'+name+'"'+req+'></textarea>';
 else html='<input class="field" name="'+name+'" type="'+kind+'" '+(kind==='number'?'min="0" step="1"':'')+(kind==='date'?'value="'+daysFromNow(3)+'"':'')+req+'>';
 return '<label for="field-'+name+'">'+esc(label)+'</label>'+html;
}
function renderModal(){
 const info=forms[state.modal], details=state.modal==='approval-detail'?data.approvals.find(x=>x.id===state.modalId):state.modal==='post-detail'?data.posts.find(x=>x.id===state.modalId):null;
 if(!info&&!details)return;
 let inner='';
 if(info)inner='<div class="modal-header"><div><h2>'+esc(info.title)+'</h2><p class="muted small">'+esc(info.desc)+'</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Close">'+icon('close')+'</button></div><form id="modal-form" data-kind="'+esc(state.modal)+'">'+(state.modal==='request'?'':'')+info.fields.map(formInput).join('')+'<div class="modal-actions">'+button('Cancel','close-dialog','','ghost')+'<button class="btn primary" type="submit">Save '+icon('arrow',14)+'</button></div></form>';
 else inner='<div class="modal-header"><div><h2>'+esc(details.title)+'</h2><p class="small muted">'+esc(accountName(details.account))+' · '+esc(details.kind)+' · '+esc(details.status)+'</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Close">'+icon('close')+'</button></div><p class="muted">This is a demonstration record. File previews, comments and version history will be attached to live project files when the backend is connected.</p><div class="preview-image">'+icon('file',32)+'</div>'+button('Close','close-dialog');
 $('#overlay-root').innerHTML='<div class="overlay" data-backdrop="true"><div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(info?.title||details.title)+'">'+inner+'</div></div>';
 const field=$('#modal-form input,#modal-form select');if(field)field.focus();
}
function renderCommand(){
 const options=navItems().flatMap(s=>s[1]);
 const q=(state.commandQuery||'').toLowerCase();
 $('#overlay-root').innerHTML='<div class="overlay command-overlay" data-backdrop="true"><section class="modal command-modal" role="dialog" aria-modal="true" aria-label="Search workspaces"><div class="spread"><b>Go to workspace</b>'+button('Esc','close-dialog','','small ghost')+'</div><input id="command-input" class="field" style="width:100%;margin-top:16px" placeholder="Search pages…" aria-label="Search pages" value="'+esc(state.commandQuery||'')+'"><div style="margin-top:12px">'+options.filter(x=>x[1].toLowerCase().includes(q)).map(x=>'<button class="command-result" data-action="nav" data-id="'+x[0]+'">'+icon(x[2],17)+' '+esc(x[1])+'</button>').join('')+'</div></section></div>';
 $('#command-input')?.focus();
}
function createFromForm(kind,values){
 const account=values.account||((state.account==='all')?'a':state.account);
 const base={id:id(),account};
 if(kind==='new-client'){
  data.accounts.push({id:id(),name:values.name,contact:values.contact,industry:values.industry,email:values.email,services:['organic'],status:'Onboarding',owner:'Oliver',joined:today(),value:Number(values.value),progress:10});goto('clients');
 }else if(kind==='new-task'){data.tasks.unshift({...base,title:values.title,assignee:values.assignee,priority:values.priority,due:values.due,type:'General',status:'To do'});goto('tasks');}
 else if(kind==='new-lead'){data.leads.unshift({...base,name:values.name,company:values.company,source:values.source,value:Number(values.value),owner:'Oliver',stage:'New'});goto('leads');}
 else if(kind==='new-deal'){data.deals.unshift({...base,name:values.name,company:values.company,amount:Number(values.amount),owner:'Oliver',stage:'Qualified'});goto('closing');}
 else if(kind==='new-opportunity'){data.crm.unshift({id:id(),name:values.name,contact:values.contact,value:Number(values.value),owner:'Oliver',stage:'Discovery'});goto('crm');}
 else if(kind==='new-campaign'){data.campaigns.unshift({...base,name:values.name,channel:values.channel,budget:Number(values.budget),spend:0,leads:0,roas:0,status:'Draft'});goto('paid');}
 else if(kind==='new-post'){data.posts.unshift({...base,title:values.title,channel:values.channel,kind:values.kind,day:values.day,status:'Draft'});goto('organic');}
 else if(kind==='new-approval'){data.approvals.unshift({...base,title:values.title,kind:values.kind,status:'Awaiting review',due:values.due,version:'v1'});goto('approvals');}
 else if(kind==='new-invoice'){data.invoices.unshift({...base,number:'AMP-'+(1100+data.invoices.length),description:values.description,amount:Number(values.amount),status:'Draft',due:values.due});goto('billing');}
 else if(kind==='new-ticket'){data.tickets.unshift({...base,title:values.title,priority:values.priority,status:'Open',created:today()});goto('support');}
 else if(kind==='request'){const entry=data.approvals.find(x=>x.id===state.modalId);if(entry){entry.status='Changes requested';entry.feedback=values.note;}goto('approvals');}
 save();state.modal='';render();notify('Saved to this browser’s demo workspace.');
}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el){
  if(e.target?.dataset?.backdrop){state.modal='';state.command=false;render();}return;
 }
 const action=el.dataset.action, value=el.dataset.id;
 if(action==='nav'){goto(value);return;}
 if(action==='toggle-menu'){state.sidebar=!state.sidebar;render();return;}
 if(action==='switch-client'){state.role='client';state.account=value;goto('overview');return;}
 if(action==='open-client'){state.selectedClient=value;state.page='client-detail';render();return;}
 if(action==='select-account'){state.account=value;render();return;}
 if(action==='toggle-theme'){state.theme=state.theme==='dark'?'light':'dark';setTheme();render();return;}
 if(action==='toggle-notifications'){state.notification=!state.notification;state.modal='';render();return;}
 if(action==='command'){state.command=true;state.commandQuery='';renderCommand();return;}
 if(action==='close-dialog'){state.modal='';state.command=false;state.modalId=null;render();return;}
 if(action==='reset-demo'){if(confirm('Reset demo data stored in this browser?')){data=initial();save();goto('overview');notify('Demo data reset.');}return;}
 if(action==='export-leads'){csv(scoped(data.leads).map(x=>({Name:x.name,Company:x.company,Client:accountName(x.account),Source:x.source,Stage:x.stage,Value:x.value})),'amplify-demo-leads.csv');return;}
 if(action==='export-report'){csv(scoped(data.campaigns).map(x=>({Campaign:x.name,Client:accountName(x.account),Channel:x.channel,Spend:x.spend,Leads:x.leads,ROAS:x.roas})),'amplify-demo-report.csv');return;}
 if(action==='next-lead'){if(state.role!=='client')advance(data.leads,value,leadStages);return;}
 if(action==='next-deal'){if(state.role!=='client')advance(data.deals,value,dealStages);return;}
 if(action==='next-crm'){advance(data.crm,value,['Discovery','Proposal','Negotiation','Won']);return;}
 if(action==='next-task'){if(state.role!=='client')advance(data.tasks,value,taskStages,'status');return;}
 if(action==='next-post'){if(state.role!=='client')advance(data.posts,value,['Draft','Review','Approved','Scheduled','Published'],'status');return;}
 if(action==='approve'){const a=data.approvals.find(x=>x.id===value);if(a&&a.status==='Awaiting review'){a.status='Approved';save();render();notify('Approval recorded in demo data.');}return;}
 if(action==='request'){state.modal='request';state.modalId=value;renderModal();return;}
 if(action==='resolve-ticket'){if(state.role!=='client'){const t=data.tickets.find(x=>x.id===value);if(t)t.status='Resolved';save();render();notify('Ticket resolved in demo.');}return;}
 if(action==='approval-detail'||action==='post-detail'){state.modal=action;state.modalId=value;renderModal();return;}
 if(forms[action]){state.modal=action;state.modalId=value;renderModal();return;}
});
document.addEventListener('change',e=>{
 if(e.target.id==='role-select'){state.role=e.target.value;if(state.role==='client'&&state.account==='all')state.account=data.accounts[0]?.id||'a';state.page='overview';state.query='';state.filter='All';render();}
 if(e.target.id==='account-select'){state.account=e.target.value;state.page='overview';state.query='';render();}
 if(e.target.id==='page-filter'){state.filter=e.target.value;render();}
});
document.addEventListener('input',e=>{
 if(e.target.id==='page-search'){const value=e.target.value;const start=e.target.selectionStart;state.query=value;render();const field=$('#page-search');field?.focus();field?.setSelectionRange(start,start);}
 if(e.target.id==='command-input'){state.commandQuery=e.target.value;renderCommand();$('#command-input')?.setSelectionRange(state.commandQuery.length,state.commandQuery.length);}
});
document.addEventListener('submit',e=>{
 if(e.target.id==='modal-form'){e.preventDefault();const kind=e.target.dataset.kind;const values=Object.fromEntries(new FormData(e.target).entries());createFromForm(kind,values);}
 if(e.target.id==='message-form'){e.preventDefault();const text=$('#message-input')?.value?.trim();if(!text)return;const account=state.account==='all'?'a':state.account;data.messages.push({id:id(),account,from:state.role==='client'?'Client':'Staff',text,at:new Date().toLocaleTimeString('en-AU',{hour:'2-digit',minute:'2-digit'})});save();render();notify('Message saved to demo conversation.');}
});
document.addEventListener('keydown',e=>{
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();state.command=true;state.commandQuery='';renderCommand();}
 if(e.key==='Escape'&&(state.command||state.modal||state.notification||state.sidebar)){state.command=false;state.modal='';state.notification=false;state.sidebar=false;render();}
});
render();
