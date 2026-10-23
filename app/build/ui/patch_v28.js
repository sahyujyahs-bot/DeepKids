const estTxt=(u,n,tot)=>`≈ ${hmin(estMins(u,n,tot).m)}`;
function dayRing(){const it=dayPlan(today).filter(i=>i.kind!=="brk"&&OURS(i)),n=it.length,dn=it.filter(i=>i.done).length;if(!n)return "";const C=2*Math.PI*16,p=dn/n,prev=ui.ringP??p;ui.ringP=p;setTimeout(animRings,40);
  if(p===1&&prev<1&&Date.now()-lastTap<5000&&!(S.cel||{})[today]){S.cel={[today]:1};setTimeout(()=>{sfx("win");confetti();toast(`All done for today! ${S.child||""} did great.`.replace(" !","!"))},500);setTimeout(save,0)}
  return `<span class="dring ${p===1?"full":""}" title="${dn} of ${n} DeepKids items done today"><svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="16" class="rbg"/><circle cx="20" cy="20" r="16" class="rfg" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-prev)}" data-to="${C*(1-p)}"/></svg><b>${p===1?"✓":dn+"/"+n}</b></span>`}
SFX.chime=()=>{tone(988,0,.1,"sine",.07);tone(1319,.07,.16,"sine",.05)};
const MTIPS=["Tap Start when you're both ready. No rush.","Did it already? Tap the tick and choose.","Busy day? Later today moves it out of the way.","Photos of work go in Add photos.","Tell me plans in the Planner, like a message.","Small steps every day add up.","Need a break? That's part of learning too."];
document.addEventListener("click",e=>{const m=e.target.closest?.(".mascot");if(!m||e.target.closest("button,a"))return;m.classList.remove("wig");void m.getBoundingClientRect();m.classList.add("wig");sfx("chime");const r=m.getBoundingClientRect();burst(r.left+r.width/2,r.top,MTIPS[Math.floor(Math.random()*MTIPS.length)])});
document.addEventListener("click",e=>{const b=e.target.closest?.("[data-act]");if(!b)return;const a=b.dataset.act;if((a==="wkst"&&b.dataset.to==="done")||(a==="qz"&&b.dataset.r==="1")||a==="evsave"||a==="iofin"||a==="iodone"||a==="drew")setTimeout(()=>sfx("chime"),120)},true);

let lastTap=0;
document.addEventListener("click",()=>{lastTap=Date.now()},true);
