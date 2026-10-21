const RTYPE={sim:"Simulation",worksheet:"Worksheet",experiment:"Experiment",activity:"Activity",video:"Video",game:"Game",reading:"Reading",lesson:"Lesson",tool:"Tool","citizen-science":"Citizen science"};
const RACC={free:"Free","free-account":"Free sign-up",freemium:"Partly free",paid:"Paid"};
const RCON=Object.fromEntries((DATA.rconcepts||[]).map(c=>[c.id,c]));
const rFits=r=>!S.age||(r.ages[0]<=S.age&&S.age<=r.ages[1]);
function resourcesFor(u){const k=u.k;return (DATA.resources||[]).filter(r=>(r.chapters||[]).includes(k)||r.concepts.some(c=>(RCON[c]?.chapters||[]).includes(k)))}
const resSort=L=>[...L].sort((a,b)=>(rFits(b)-rFits(a))||((a.access==="free"?0:1)-(b.access==="free"?0:1)));
const resCard=(r,i)=>`<a class="libcard rescard" style="--c:${PAL[i%PAL.length]};text-decoration:none;color:inherit" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">${RTYPE[r.type]||esc(r.type)}</span><span class="xs muted">Ages ${r.ages[0]}–${r.ages[1]} · ${RACC[r.access]||""}${(r.lang||[]).filter(l=>l!=="en").length?" · "+r.lang.map(l=>l.toUpperCase()).join(", "):""}</span></span><b>${esc(r.title)} ↗</b><span class="xs muted">${esc(r.source)}</span><span class="sm">${esc(r.desc)}</span>${r.how?`<span class="xs"><b>How to use:</b> ${esc(r.how)}</span>`:""}</a>`;
function resTab(u){const L=resSort(resourcesFor(u));if(!L.length)return `<p class="note">No outside resources tagged to this chapter yet.</p>`;const ty=ui.rtc||"all",T=[...new Set(L.map(r=>r.type))],F=ty==="all"?L:L.filter(r=>r.type===ty);
  return `<p class="sm muted">${L.length} free and low-cost resources from trusted sites, matched to this chapter's ideas.${S.age?` Ones that suit age ${S.age} come first.`:""}</p><div class="row" style="flex-wrap:wrap;gap:6px">${[["all","All"],...T.map(t=>[t,RTYPE[t]||t])].map(([k,n])=>`<button class="chip" aria-pressed="${ty===k}" data-act="rtc" data-t="${k}">${n}</button>`).join("")}</div><div class="grid2">${F.map(resCard).join("")}</div>`}
function scienceTab(){const R=DATA.resources||[],C=DATA.rconcepts||[],cn=ui.rc||"",ty=ui.rt||"all",fit=ui.rfit!==false;
  let L=R.filter(r=>(!cn||r.concepts.includes(cn))&&(ty==="all"||r.type===ty)&&(!fit||rFits(r)));
  const counts={};R.forEach(r=>r.concepts.forEach(c=>counts[c]=(counts[c]||0)+1));
  return `<section class="sec"><p class="sm muted">${R.length} free and low-cost science resources (simulations, experiments, worksheets, videos and more) from trusted sites, each tagged to the ideas and chapters it fits.</p>
   <div class="field"><label for="rcSel">Idea</label><select class="inp" id="rcSel"><option value="">All ideas</option>${C.filter(c=>counts[c.id]).map(c=>`<option value="${esc(c.id)}" ${cn===c.id?"selected":""}>${esc(c.concept)} (${counts[c.id]})</option>`).join("")}</select></div>
   <div class="row" style="flex-wrap:wrap;gap:6px">${[["all","All"],...Object.entries(RTYPE)].filter(([k])=>k==="all"||R.some(r=>r.type===k)).map(([k,n])=>`<button class="chip" aria-pressed="${ty===k}" data-act="rt" data-t="${k}">${n}</button>`).join("")}</div>
   ${S.age?`<button class="chip" aria-pressed="${fit}" data-act="rfit" style="justify-self:start">Suits age ${S.age}</button>`:""}
   <p class="xs muted">${L.length} shown</p><div class="grid2">${resSort(L).slice(0,ui.rmore||40).map(resCard).join("")}</div>${L.length>(ui.rmore||40)?`<button class="btn line sm" data-act="rmore">Show more</button>`:""}</section>`}
document.addEventListener("change",e=>{if(e.target.id==="rcSel"){ui.rc=e.target.value;ui.rmore=40;delete e.target.dataset.dirty;render()}});
const greetBar=sub=>`<section class="greetbar"><b>${greetWord()}${pname()?", "+esc(pname()):""}!</b><span class="xs muted">${sub}</span></section>`;
function calHead(d){const lab=d===today?"Today":d===addDays(today,1)?"Tomorrow":d===addDays(today,-1)?"Yesterday":parse(d).toLocaleDateString(undefined,{weekday:"long"}),sub=parse(d).toLocaleDateString(undefined,{weekday:d===today||Math.abs(parse(d)-parse(today))<2*864e5?"short":undefined,day:"numeric",month:"short"});
  return `<div class="calhead"><button class="iconbtn sm" data-act="tday" data-d="-1" aria-label="Previous day">${icon("back")}</button><div class="calt"><b>${lab}</b><span class="xs muted">${sub}</span></div><button class="iconbtn sm" data-act="tday" data-d="1" aria-label="Next day">${icon("next")}</button>${d!==today?`<button class="link xs" data-act="tday" data-d="0" style="margin-left:auto">Back to today</button>`:`<button class="link xs" data-act="quick" style="margin-left:auto">+ Add</button>`}</div>`}
function viewToday(){const items=dayPlan(today),real=items.filter(i=>i.kind!=="brk"),dn=real.filter(i=>i.done).length,f=focusOf(items,today);
  const lessons=real.filter(i=>i.kind==="lesson"),lessonsDone=lessons.length>0&&lessons.every(i=>i.done),left=real.filter(i=>!i.done&&i!==f),doneL=real.filter(i=>i.done);
  let h=greetBar(`${longDate()} · ${real.length?(f?`${real.length-dn} thing${real.length-dn===1?"":"s"} left`:"all done"):"nothing planned"}`);
  if(S.setup&&!S.parent?.saved&&!S.parent?.name)h+=`<button class="nudge" data-act="parent">${youBlob("","happy",'width="36" height="36"')}<span>${pname()?"Set your wake-up and prep times":"Tell us your name and wake-up time"}</span>${icon("next")}</button>`;
  if(ui.tday&&ui.tday!==today)return h+otherDay(ui.tday);
  h+=`<section class="sec cal">${calHead(today)}`;
  if(f)h+=nowCard(f);
  if(lessonsDone||!real.length)h+=`<section class="donecard">${blob("var(--sun)",4,"happy","mascot bob")}<h2>${lessons.length?"Lessons done! Keep going?":"Want to start something?"}</h2>${offerList()}</section>`;
  if(left.length)h+=`<div class="sech" style="margin-top:12px"><h3>Later today</h3></div><div class="tt compact">${left.map(i=>tRow(i,today,null)).join("")}</div>`;
  if(doneL.length)h+=`<button class="link" data-act="showdone" style="justify-self:start;margin-top:8px">${ui.showDone?"Hide":"Show"} ${doneL.length} done</button>${ui.showDone?`<div class="tt compact">${doneL.map(i=>tRow(i,today,null)).join("")}</div>`:""}`;
  h+=`</section><button class="morebtn" data-act="moresheet">${icon("grid")}<span>More for today</span><span class="xs muted">jokes, games, experiments, your reading</span></button>`;
  return h}
function otherDay(d){const items=dayPlan(d).filter(i=>i.kind!=="brk"),past=d<today,dn=items.filter(i=>i.done).length;
  return `<section class="sec cal">${calHead(d)}<p class="xs muted">${past?`${dn} of ${items.length} done that day`:`${items.length} thing${items.length===1?"":"s"} planned`}</p>
   ${items.length?`<div class="tt compact">${items.map(i=>tRow(i,d,null)).join("")}</div>`:`<p class="note">${past?"Nothing was recorded that day.":"Nothing planned yet."}</p>`}
   ${past?"":`<button class="btn soft sm" data-act="quickday" data-d="${d}" style="margin-top:12px">+ Add a plan for this day</button>`}</section>`}
const navSnap=()=>({tab,lt:ui.lt,pv:ui.pv,pday:ui.pday,tday:ui.tday,sheet:ui.sheet?JSON.parse(JSON.stringify(ui.sheet)):null,ctab:ui.sheet?.k?ui.ctab[ui.sheet.k]:undefined,y:scrollY});
let navHist=[],navRestoring=false;
function navPush(){if(navRestoring)return;navHist.push(navSnap());if(navHist.length>40)navHist.shift();try{history.pushState({dk:navHist.length},"")}catch(e){}updBack()}
function navBack(){if(!navHist.length)return;const s=navHist.pop();navRestoring=true;tab=s.tab;ui.lt=s.lt;ui.pv=s.pv;ui.pday=s.pday;ui.tday=s.tday;
  if(s.sheet){if(s.sheet.k){if(s.ctab)ui.ctab[s.sheet.k]=s.ctab;else delete ui.ctab[s.sheet.k]}ui.sheet=s.sheet;if(!sheet.open)sheet.showModal();renderSheet(true);render()}else{if(sheet.open)sheet.close();else render()}
  requestAnimationFrame(()=>scrollTo(0,s.y||0));navRestoring=false;updBack()}
function goBack(){if(!navHist.length){if(sheet.open)sheet.close();return}sfx("tap");try{history.back()}catch(e){navBack()}}
function updBack(){const b=document.getElementById("backTop");if(b)b.hidden=!navHist.length||!ACC;const c=document.getElementById("sheetClose"),top=navHist[navHist.length-1];if(c&&sheet.open){const bk=!!top?.sheet;c.innerHTML=bk?icon("back"):icon("close");c.setAttribute("aria-label",bk?"Back":"Close")}}
function openSheet(o){navPush();ui.sheet=o;if(!sheet.open)sheet.showModal();renderSheet(true);updBack()}
addEventListener("popstate",()=>navBack());
document.querySelector("header.top .wrap").insertAdjacentHTML("afterbegin",`<button class="iconbtn" id="backTop" aria-label="Back" hidden>${icon("back")}</button>`);
document.getElementById("backTop").onclick=goBack;
