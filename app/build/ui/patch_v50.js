/* ---------- Student profile: level and depth per subject, adjusting itself from answers ---------- */
const PLV=["gentle","core","stretch"],PLN={gentle:"Gentle",core:"Core",stretch:"Stretch"},PDN={explore:"Explore",deep:"Deep",challenge:"Challenge"};
const PLD={gentle:"More pictures, fewer words, one step at a time",core:"Right for the class: practice and a little thinking",stretch:"Harder puzzles, more writing and reasoning"};
const PDD={explore:"Hands-on and playful first",deep:"A balance of doing and thinking",challenge:"Lots of big questions and design tasks"};
const defLvl=s=>{const l=S.levels?.[s]||1;return l<=2?"gentle":l>=5?"stretch":"core"};
function profOf(s){const p=(S.prof||{})[s]||{};return {lvl:p.lvl||defLvl(s),depth:p.depth||"deep",auto:p.auto!==false,why:p.why||"",at:p.at||""}}
/* recent answers in a subject: raise the level when it's easy, lower it when it's hard (at most once a week) */
function profAuto(){if(!S.setup)return;const M=Object.values(lastAnswers()).filter(x=>x.d);let ch=false;
  S.subjects.forEach(s=>{const p=profOf(s);if(!p.auto||(p.at&&(parse(today)-parse(p.at))/864e5<7))return;const A=M.filter(x=>unitByK(x.k)?.subj===s).sort((a,b)=>a.d<b.d?1:-1).slice(0,20);if(A.length<8)return;
    const acc=A.filter(x=>x.r).length/A.length,i=PLV.indexOf(p.lvl);let to=null,why="";
    if(acc>=0.85&&A.length>=10&&i<2){to=PLV[i+1];why=`${Math.round(acc*100)}% right in the last ${A.length} answers`}else if(acc<=0.5&&i>0){to=PLV[i-1];why=`${Math.round(acc*100)}% right in the last ${A.length} answers`}
    if(to){S.prof={...(S.prof||{}),[s]:{...((S.prof||{})[s]||{}),lvl:to,why,at:today}};ch=true}});if(ch)save()}
function profCard(){return `<section class="sec"><div class="sech"><h3>Learning profile</h3><span class="xs muted">${esc(S.child||"Your child")}'s level and depth in each subject</span></div>
  ${S.subjects.map(s=>{const p=profOf(s);return `<div class="card ${SC(s)}" style="gap:6px"><div class="sech"><b style="font:600 16px var(--display)">${SUBJ[s]}</b><label class="xs"><input type="checkbox" data-pauto="${s}" ${p.auto?"checked":""}> Adjust by itself</label></div>
   <div class="seg">${PLV.map(l=>`<button aria-pressed="${p.lvl===l}" data-act="plv" data-s="${s}" data-v="${l}">${PLN[l]}</button>`).join("")}</div><p class="xs muted">${PLD[p.lvl]}${p.why?` · changed on ${esc(fmt(p.at))}: ${esc(p.why)}`:""}</p>
   <div class="seg">${Object.keys(PDN).map(d=>`<button aria-pressed="${p.depth===d}" data-act="pdep" data-s="${s}" data-v="${d}">${PDN[d]}</button>`).join("")}</div><p class="xs muted">${PDD[p.depth]}</p></div>`}).join("")}</section>`}
/* ---------- Worksheets belong to topics, shared by every chapter on that topic in every board ---------- */
const TWN=()=>DATA.wtopics||{};
function topicsOf(u){const T=[];Object.entries(TWN()).forEach(([id,t])=>{if((t.chapters||[]).includes(u.k))T.push(id)});(DATA.rconcepts||[]).forEach(c=>{if(c.chapters.includes(u.k)&&TWN()[c.id]&&!T.includes(c.id))T.push(c.id)});return T}
function wsOf(u){return topicsOf(u).flatMap(t=>((DATA.tws||{})[t]||[]).map(w=>({...w,topic:t})))}
function wsRank(u){const p=profOf(u.subj==="dk"?"dks":u.subj),L=wsOf(u),di=PLV.indexOf(p.lvl),pref={explore:["play","make","game","think"],deep:["make","play","think","game"],challenge:["think","make","game","play"]}[p.depth];
  return L.map((w,i)=>({w,i,score:Math.abs(PLV.indexOf(w.lvl||"core")-di)*10+pref.indexOf(w.kind)})).sort((a,b)=>a.score-b.score||a.i-b.i)}
function printSheets(u){const R=wsRank(u),C=wsCur(u);if(!R.length&&!C.length)return "";const p=profOf(u.subj==="dk"?"dks":u.subj),mine=R.filter(x=>(x.w.lvl||"core")===p.lvl),rest=R.filter(x=>(x.w.lvl||"core")!==p.lvl);
  const row=x=>`<div class="pws"><div style="min-width:0;flex:1"><span class="eyebrow">${PLN[x.w.lvl||"core"]} · ${esc(WSKIND[x.w.kind]||"Worksheet")} · ≈ ${x.w.mins||20} min</span><b>${esc(x.w.title)}</b><p class="xs muted">${esc(x.w.blurb||"")}</p></div><div class="col" style="gap:6px"><button class="btn sm accent" data-act="wsprint" data-k="${u.k}" data-i="${x.i}">Print</button><button class="link xs" data-act="wsview" data-k="${u.k}" data-i="${x.i}">Preview</button></div></div>`;
  const topics=[...new Set(R.map(x=>x.w.topic))].map(t=>TWN()[t]?.title).filter(Boolean);
  return `<section class="card"><div class="sech"><b style="font:600 17px var(--display)">🖨️ Printable worksheets</b><span class="pill">${R.length}</span></div><p class="xs muted">About ${esc(topics.join(", "))}. No textbook needed. Each prints on A4 with an answer page for you.</p>
   ${mine.length?`<span class="eyebrow">Best for ${esc(S.child||"your child")} · ${PLN[p.lvl]} · ${PDN[p.depth]}</span>${mine.map(row).join("")}`:""}
   ${rest.length?`<details${mine.length?"":" open"}><summary class="sm"><b>Other levels (${rest.length})</b></summary>${rest.map(row).join("")}</details>`:""}
   ${C.length?`<span class="eyebrow" style="margin-top:6px">Also from official sources</span>${C.map(c=>`<div class="pws"><div style="min-width:0;flex:1"><b>${esc(c.title)}</b><p class="xs muted">${esc(c.src)}</p></div><a class="btn sm soft" href="${esc(c.url)}" target="_blank" rel="noopener">Open</a></div>`).join("")}`:""}</section>`}
const wsCur=u=>(DATA.cws||{})[u.k]||[];
/* re-check the profile once a day */
const renderP=render;render=function(){if(ui.profDay!==today){ui.profDay=today;try{profAuto()}catch(e){}}return renderP.apply(this,arguments)};
document.addEventListener("change",e=>{const s=e.target.dataset?.pauto;if(!s)return;S.prof={...(S.prof||{}),[s]:{...((S.prof||{})[s]||{}),auto:e.target.checked}};save();render()});
