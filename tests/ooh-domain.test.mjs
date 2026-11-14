import test from "node:test";
import assert from "node:assert/strict";
import {nextOOH,mayWrite,validateFlightDraft} from "../src/domain/ooh-workflow.mjs";
const example={status:"Draft",name:"Venue trial",site:"Sample site",supplier:"Sample vendor",format:"Poster",starts_on:"2026-12-02",ends_on:"2026-12-03",total_budget_cents:100000,approved_budget_cents:0};
test("draft requirements",()=>{
 assert.equal(validateFlightDraft(example),true);
 assert.throws(()=>validateFlightDraft({...example,ends_on:"2026-11-01"}),/dates/);
 assert.throws(()=>validateFlightDraft({...example,total_budget_cents:-10}),/budget/);
});
test("never permit client writes",()=>{
 for(const action of ["permission","budget","creative","book","install","close"])assert.equal(mayWrite("client",action),false);
 assert.throws(()=>nextOOH(example,"budget",{ref:"ok",amount_cents:100000},"client"),/permissions/);
 assert.throws(()=>nextOOH(example,"budget",{ref:"ok",amount_cents:100000},"staff"),/permissions/);
});
test("booking gates and budget limits",()=>{
 assert.throws(()=>nextOOH(example,"book",{ref:"booking"},"staff"),/Booking gate/);
 let f=nextOOH(example,"permission",{ref:"site-permission"},"staff");
 f=nextOOH(f,"creative",{ref:"approved-artwork"},"staff");
 f=nextOOH(f,"capacity",{ref:"ops-ready"},"staff");
 f=nextOOH(f,"tracking",{ref:"verified-test",url:"https://example.invalid/track"},"staff");
 f=nextOOH(f,"budget",{ref:"approval",amount_cents:50000},"manager");
 assert.throws(()=>nextOOH(f,"book",{ref:"booking"},"staff"),/Over-budget/);
 f=nextOOH(f,"budget",{ref:"approval",amount_cents:100000},"manager");
 f=nextOOH(f,"book",{ref:"booking"},"staff");assert.equal(f.status,"Booked");
 assert.throws(()=>nextOOH(f,"close",{ref:"removal"},"staff"),/live/);
 f=nextOOH(f,"install",{ref:"dated-install-proof"},"staff");
 assert.throws(()=>nextOOH(f,"close",{ref:"removal"},"staff"),/inspection/);
 f=nextOOH(f,"inspect",{ref:"inspection"},"staff");
 assert.throws(()=>nextOOH(f,"outcome",{responses:2,qualified:4,spend_cents:1000},"staff"),/cannot exceed/);
 f=nextOOH(f,"outcome",{responses:8,qualified:3,spend_cents:1000},"staff");
 f=nextOOH(f,"close",{ref:"closeout-proof"},"staff");
 assert.equal(f.status,"Closed");assert.equal(f.qualified_count,3);
 assert.throws(()=>nextOOH(f,"install",{ref:"again"},"staff"),/booking/);
});
