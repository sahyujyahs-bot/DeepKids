/* ---------- Combined lessons use their topic's Mission book and worksheets ---------- */
const topicsOfP=topicsOf;
topicsOf=function(u){const T=topicsOfP(u);if(u.board==="combined"&&TWN()[u.n]&&!T.includes(u.n))T.push(u.n);return T};
const combTabB=combTab;
combTab=function(u,t){let h=combTabB(u,t);const P=u.c.p;if(t==="overview"&&P?.book){const L=wsOf(u),i=L.findIndex(w=>w.id===P.book),w=L[i];
  if(w)h=`<section class="card ${SC(u.subj)}"><span class="eyebrow">This lesson uses a Mission book</span><h3 style="font-size:20px">${esc(w.title)}</h3><p class="sm">${esc(w.blurb||"")}</p><p class="xs muted">The day-by-day steps tell you which station to do. Print it before Day 1.</p><div class="row"><button class="btn sm accent" data-act="wsprint" data-k="${u.k}" data-i="${i}">🖨️ Print the book</button><button class="link sm" data-act="wsview" data-k="${u.k}" data-i="${i}">Preview</button></div></section>`+h}
  return h};
