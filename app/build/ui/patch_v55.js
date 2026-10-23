/* ---------- The free library covers every subject: science, maths, English, Hindi, thinking, coding ---------- */
(DATA.resources||[]).forEach(r=>{r.concepts=r.concepts||[];r.strands=r.strands||[];r.subj=[].concat(r.subj||"sci")});
const LSUBJ={sci:"Science",math:"Maths",eng:"English",hin:"Hindi",think:"Thinking",code:"Coding",all:"Textbooks"};
const STRN={number:"Numbers and place value",operations:"Adding, subtracting, multiplying, dividing",fractions:"Fractions",measurement:"Measuring",["time-money"]:"Time and money",shapes:"Shapes and space",patterns:"Patterns",data:"Data and graphs",reasoning:"Puzzles and reasoning",["all-maths"]:"All of maths",phonics:"Phonics",reading:"Reading",stories:"Stories",vocabulary:"Words",grammar:"Grammar",writing:"Writing",speaking:"Speaking",["all-english"]:"All of English",varnamala:"वर्णमाला",poems:"Poems",["all-hindi"]:"All of Hindi",thinking:"Thinking routines",philosophy:"Philosophy",coding:"Coding",unplugged:"Unplugged",["all-science"]:"All of science",textbooks:"Textbooks",["all-subjects"]:"All subjects"};
const rOverlap=(r,l)=>r.ages[0]<=l+6&&r.ages[1]>=l+5;
const resourcesForP=resourcesFor;
resourcesFor=function(u){const L=resourcesForP(u);if(u.subj==="sci"||u.subj==="dks"||!LSUBJ[u.subj])return L;const seen=new Set(L.map(r=>r.url));return [...L,...(DATA.resources||[]).filter(r=>r.subj.includes(u.subj)&&rOverlap(r,u.level||1)&&!seen.has(r.url))]};
function scienceTab(){const R=DATA.resources||[],sj=ui.rsj||"sci",C=DATA.rconcepts||[],cn=ui.rc||"",ty=ui.rt||"all",fit=ui.rfit!==false;
  const inS=R.filter(r=>r.subj.includes(sj)),tags=r=>sj==="sci"?r.concepts.concat(r.strands):r.strands;
  let L=inS.filter(r=>(!cn||tags(r).includes(cn))&&(ty==="all"||r.type===ty)&&(!fit||rFits(r)));
  const counts={};inS.forEach(r=>tags(r).forEach(c=>counts[c]=(counts[c]||0)+1));
  const opts=sj==="sci"?[...C.map(c=>[c.id,c.concept]),["all-science",STRN["all-science"]]]:Object.keys(counts).map(k=>[k,STRN[k]||k]);
  return `<section class="sec"><p class="sm muted">${R.length} free and low-cost resources from trusted sites: NASA, Cambridge's NRICH, Harvard's Project Zero, Stanford's youcubed, Khan Academy, PhET, Oak National Academy, StoryWeaver, NCERT and many more. Each one is described and tagged so you can find the right one fast.</p>
   <div class="seg">${Object.entries(LSUBJ).filter(([k])=>R.some(r=>r.subj.includes(k))).map(([k,n])=>`<button aria-pressed="${sj===k}" data-act="rsj" data-v="${k}">${n} (${R.filter(r=>r.subj.includes(k)).length})</button>`).join("")}</div>
   <div class="field"><label for="rcSel">${sj==="sci"?"Idea":"Area"}</label><select class="inp" id="rcSel"><option value="">Everything</option>${opts.filter(([k])=>counts[k]).map(([k,n])=>`<option value="${esc(k)}" ${cn===k?"selected":""}>${esc(n)} (${counts[k]})</option>`).join("")}</select></div>
   <div class="row" style="flex-wrap:wrap;gap:6px">${[["all","All"],...Object.entries(RTYPE)].filter(([k])=>k==="all"||inS.some(r=>r.type===k)).map(([k,n])=>`<button class="chip" aria-pressed="${ty===k}" data-act="rt" data-t="${k}">${n}</button>`).join("")}</div>
   ${S.age?`<button class="chip" aria-pressed="${fit}" data-act="rfit" style="justify-self:start">Suits age ${S.age}</button>`:""}
   <p class="xs muted">${L.length} shown</p><div class="grid2">${resSort(L).slice(0,ui.rmore||40).map(resCard).join("")}</div>${L.length>(ui.rmore||40)?`<button class="btn line sm" data-act="rmore">Show more</button>`:""}</section>`}
