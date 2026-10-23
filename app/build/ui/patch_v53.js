/* ---------- Stories, big ideas and open questions ---------- */
const storyHtml=st=>`<article class="story"><h2>${esc(st.title)}</h2>${st.text.map((p,i)=>`<p${i?"":' class="first"'}>${esc(p)}</p>`).join("")}<div class="storyask"><b>Talk about it</b><ol>${st.ask.map(q=>`<li>${esc(q)}</li>`).join("")}</ol></div></article>`;
const bookBlockS=bookBlock;
bookBlock=function(b,seed,i){if(b.type==="story")return {h:`<div class="wstory"><div class="wstoryhd">A story to read aloud</div><h2>${esc(b.title)}</h2>${b.text.map((p,j)=>`<p${j?"":' class="first"'}>${esc(p)}</p>`).join("")}<div class="wstoryask"><b>Talk about it</b><ol>${b.ask.map(q=>`<li>${esc(q)}</li>`).join("")}</ol></div></div>`,k:"",bare:1};return bookBlockS(b,seed,i)};
const combTabS=combTab;
combTab=function(u,t){const P=u.c.p;if(!P?.big)return "";
  if(t==="story")return P.story?`<section class="card">${storyHtml(P.story)}</section><details class="card"><summary class="sm"><b>For you: the idea hidden in this story</b></summary><p class="sm">${esc(P.story.epiphany)}</p></details>`:"";
  if(t==="think")return `${P.ideas?.length?`<section class="card"><span class="eyebrow">Big ideas</span>${P.ideas.map(x=>`<p class="sm"><b>${esc(x.idea)}</b> ${esc(x.more)}</p>`).join("")}</section>`:""}${P.unknowns?.length?`<section class="card"><span class="eyebrow">Nobody knows yet</span>${P.unknowns.map(q=>`<p class="sm">❓ ${esc(q)}</p>`).join("")}<p class="xs muted">Science isn't finished. Maybe your child will answer one of these.</p></section>`:""}`+combTabS(u,t);
  return combTabS(u,t)};
