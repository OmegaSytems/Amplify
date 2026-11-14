const form=document.getElementById("brief-form");
const result=document.getElementById("brief-result");
const preview=document.getElementById("brief-text");
form?.addEventListener("submit",event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 const values=Object.fromEntries(new FormData(form));
 const name=String(values.business||"").trim(),service=String(values.service||"").trim(),goal=String(values.goal||"").trim();
 if(!name||!service||!goal)return;
 preview.textContent=["Omega Amplify — enquiry brief","Business: "+name,"Service focus: "+service,"Goal / challenge: "+goal,"","Prepared locally. Not yet submitted."].join("\n");
 result.hidden=false;
 result.scrollIntoView({block:"nearest",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
});
document.getElementById("copy-brief")?.addEventListener("click",async()=>{
 const el=document.getElementById("copy-result");
 try{
  await navigator.clipboard.writeText(preview.textContent);
  el.textContent="Brief copied. It has not been sent.";
 }catch{
  el.textContent="Automatic copy is unavailable. Select and copy the brief text above.";
 }
});
