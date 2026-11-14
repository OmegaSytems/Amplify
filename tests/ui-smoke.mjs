import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const handlers={}, elements={'#app':{innerHTML:''},'#overlay-root':{innerHTML:''}};
const document={body:{classList:{toggle(){}}},querySelector(sel){return elements[sel]||null;},addEventListener(type,cb){handlers[type]=cb;}};
const storage={getItem(){return null;},setItem(){}};
const context=vm.createContext({document,localStorage:storage,window:{scrollTo(){}},confirm(){return false;},console,Intl,Date,Math,Set,Array,Object,String,Number,JSON,RegExp,Map,Error,URL,Blob,setTimeout(){}});
vm.runInContext(code,context,{filename:'app.js'});
assert.ok(elements['#app'].innerHTML.includes('Amplify'));
const pages={
  management:['overview','clients','crm','projects','calendar','paid','organic','leads','closing','approvals','tasks','assets','messages','reports','billing','team','support','settings'],
  staff:['overview','tasks','calendar','clients','paid','organic','leads','closing','approvals','projects','assets','messages','reports','support','settings'],
  client:['overview','services','projects','approvals','paid','organic','leads','closing','calendar','reports','tasks','assets','messages','billing','support','settings']
};
let checked=0;
for(const [role,views] of Object.entries(pages)){
 handlers.change({target:{id:'role-select',value:role}});
 for(const page of views){
  handlers.click({target:{closest(){return {dataset:{action:'nav',id:page}};}}});
  assert.ok(elements['#app'].innerHTML.includes('<main'),role+' / '+page);
  checked++;
 }
}
assert.ok(elements['#app'].innerHTML.includes('Demonstration only'));
console.log('UI smoke passed: '+checked+' role/page renders; demo notice present.');
