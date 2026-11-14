import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
const text=await readFile(fileURLToPath(new URL("../supabase/drafts/amplify_client_approvals_hardening.sql",import.meta.url)),"utf8");
test("draft protects client approval authority and records review",()=>{
 for(const term of ["client_approval_authorities","m.role='client'","a.revoked_at is null","s.status='active'","for update","client_deliverable_reviews","client_deliverable_review","p_note text default null"]){
  assert.ok(text.includes(term),"Missing "+term);
 }
});
test("draft does not grant direct authenticated UPDATE(status)",()=>{
 assert.ok(text.includes("revoke update on public.deliverables from public,anon,authenticated"));
 assert.ok(text.includes("grant update(title,description,due_at,project_id) on public.deliverables to authenticated"));
 assert.ok(!/grant\s+update\s*\(\s*status/i.test(text));
});
test("reviewed-only DB gates remain explicit in draft",()=>{
 assert.match(text,/NOT APPLIED/);
 assert.match(text,/do NOT run on Omega Education/i);
 assert.match(text,/grant execute on function public.review_deliverable\(uuid,text,text\) to authenticated/);
});
