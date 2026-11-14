import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const events={},els={'#app':{innerHTML:''},'#overlay-root':{innerHTML:''}},store=new Map();
const doc={body:{classList:{toggle(){}},appendChild(){}},querySelector(s){return els[s]||null},addEventListener(t,f){events[t]=f},createElement(){return {remove(){},setAttribute(){}}}};
const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const win={scrollTo(){}};
const ctx=vm.createContext({document:doc,window:win,localStorage,console,Date,Math,Intl,Number,JSON,Array,Object,String,Set,RegExp,URL,Blob,FormData,confirm:()=>false,setTimeout:()=>{}});
for(const path of ['../src/staff/staff-os.js','../src/agency/agency-os.js','../app.js'])vm.runInContext(fs.readFileSync(new URL(path,import.meta.url),'utf8'),ctx,{filename:path});
let n=0;
for(const role of ['management','staff','client']){
 events.change({target:{id:'role-select',value:role}});
 for(const [route] of win.AmplifyAgency.catalog){
  if(role==='client'&&!['agency-channels','agency-ooh','agency-creatives','agency-tracking','agency-email','agency-search'].includes(route))continue;
  events.click({target:{closest:()=>({dataset:{action:'nav',id:route}})}});
  assert.ok(els['#app'].innerHTML.includes('<main'),role+':'+route);n++;
 }
}
const mod=win.AmplifyAgency,h={state:{role:'management',account:'all'},data:{accounts:[{id:'a',name:'Test'}]},accountName:x=>x,notify(){},render(){}};
const x=mod.debug().ooh[0];mod.action('agency-select-ooh',x.id,h);
mod.action('agency-book',x.id,h);assert.notEqual(mod.debug().form,'agency-book');
mod.submit('agency-permission',{permissionRef:'PERMISSION-TEST'},h);
mod.action('agency-budget',x.id,h);
mod.submit('agency-creative',{creativeRef:'ART-TEST'},h);
mod.action('agency-capacity',x.id,h);
mod.action('agency-test-link',x.id,h);
mod.action('agency-book',x.id,h);assert.equal(mod.debug().form,'agency-book');
mod.submit('agency-book',{bookingRef:'BOOK-TEST'},h);assert.equal(x.status,'Booked');
mod.action('agency-proof',x.id,h);mod.submit('agency-proof',{proofRef:'INSTALL-TEST'},h);assert.equal(x.status,'Live');
mod.action('agency-inspect',x.id,h);mod.submit('agency-inspect',{lastCheck:'Checked'},h);
mod.action('agency-close-flight',x.id,h);mod.submit('agency-close-flight',{removalRef:'REMOVAL-TEST'},h);assert.equal(x.status,'Closed');
console.log('PASS '+n+' omnichannel role/page renders and gated OOH booking-to-closeout demonstration');
