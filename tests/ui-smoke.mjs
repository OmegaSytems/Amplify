import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const staff=fs.readFileSync(new URL('../src/staff/staff-os.js',import.meta.url),'utf8');
const delivery=fs.readFileSync(new URL('../src/delivery/delivery-os.js',import.meta.url),'utf8');
const domain=fs.readFileSync(new URL('../src/domain/delivery-workflows.mjs',import.meta.url),'utf8');
const operations=fs.readFileSync(new URL('../src/operations/operations-os.js',import.meta.url),'utf8');
const staffPolicy=fs.readFileSync(new URL('../src/domain/staff-operations.mjs',import.meta.url),'utf8');
const staffPolicyScript=staffPolicy.replace(/^export /gm,'')+'\n;globalThis.staffPolicy={STAGES,ALLOWED,SEVERITIES,APPROVALS,advanceDeal,assessOutreach,reviewQuality,calculateMargin,commissionEligible,capacity,clientHealth}';
const domainScript=domain.replace(/^export /gm,'')+'\n;globalThis.deliveryPolicy={normaliseOffer,requiredGates,evaluateLaunch,transitionWorkstream,submitClientInput,checkBatch,reviewLead,ONBOARDING_INPUTS}';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const handlers={},els={'#app':{innerHTML:''},'#overlay-root':{innerHTML:''}};
const document={body:{classList:{toggle(){}},appendChild(){}},querySelector(s){return els[s]||null},addEventListener(t,fn){handlers[t]=fn},createElement(){return {setAttribute(){},remove(){}}}};
const vals=new Map(),localStorage={getItem(k){return vals.get(k)||null},setItem(k,v){vals.set(k,v)}};
const window={scrollTo(){},localStorage};
const context=vm.createContext({document,window,localStorage,confirm(){return false},setTimeout(){},console,Date,Math,Intl,Number,JSON,Array,Set,Object,String,URL,Blob,FormData});
vm.runInContext(staff,context,{filename:'staff-os.js'});
vm.runInContext(delivery,context,{filename:'delivery-os.js'});
vm.runInContext(operations,context,{filename:'operations-os.js'});
vm.runInContext(staffPolicyScript,context,{filename:'staff-operations.mjs'});
vm.runInContext(domainScript,context,{filename:'delivery-workflows.mjs'});
vm.runInContext(app.replace(/^import .*$/gm,''),context,{filename:'app.js'});
const views={
 management:['overview','clients','crm','projects','calendar','paid','organic','leads','closing','approvals','tasks','assets','messages','reports','billing','team','support','settings'],
 staff:['overview','tasks','calendar','clients','paid','organic','leads','closing','approvals','projects','assets','messages','reports','support','settings'],
 client:['overview','services','projects','approvals','paid','organic','leads','closing','calendar','reports','tasks','assets','messages','billing','support','settings']
};
let count=0;
for(const [role,pages] of Object.entries(views)){
 handlers.change({target:{id:'role-select',value:role}});
 for(const page of pages){handlers.click({target:{closest(){return {dataset:{action:'nav',id:page}}}}});assert.ok(els['#app'].innerHTML.includes('<main'),role+':'+page);count++;}
}
for(const role of ['management','staff']){
 handlers.change({target:{id:'role-select',value:role}});
 for(const [page] of window.AmplifyStaff.catalog){
  if(role==='staff'&&['staff-recruitment','staff-approvals','staff-people-reports','staff-access'].includes(page))continue;
  handlers.click({target:{closest(){return {dataset:{action:'nav',id:page}}}}});
  assert.ok(els['#app'].innerHTML.includes('<main'),role+':'+page);count++;
 }
}
handlers.change({target:{id:'role-select',value:'client'}});
assert.ok(!els['#app'].innerHTML.includes('data-id="staff-hub"'));
const os=window.AmplifyStaff,staffCtx={state:{role:'staff'},data:{tasks:[{id:'t3',title:'Write captions',account:'b',assignee:'Avery',status:'In progress'}]},goto(){},render(){},notify(){}};
os.click('staff-start','',staffCtx);assert.ok(os.debug().timer);
os.click('staff-stop','',staffCtx);const shift=os.debug().shifts[0];assert.equal(shift.status,'Needs summary');
os.click('staff-complete-shift',shift.id,staffCtx);
os.submit('shift-completion',{summary:'Done',remaining:'QA',blockers:'None',questions:'Next?',selfRating:'4'},staffCtx);
assert.equal(os.debug().shifts[0].status,'Submitted');
const manager={...staffCtx,state:{role:'management'}};
os.click('staff-review-shift',shift.id,manager);
os.submit('shift-review',{managerRating:'5',reviewNote:'Good'},manager);
assert.equal(os.debug().shifts[0].status,'Approved');
console.log('PASS '+count+' role/page renders and task-linked shift review');
