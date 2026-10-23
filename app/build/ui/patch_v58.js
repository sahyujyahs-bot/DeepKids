/* ---------- Combined rows: a short badge, what they cover, and text that wraps on phones ---------- */
const topicRowC=topicRow;
topicRow=function(u){if(u.board!=="combined")return topicRowC(u);const B=(u.c?.boards||[]).map(x=>`${BNAME[x.b]||x.b} ${x.ref}`).join(", ");
  return `<div class="topic ${SC(u.subj)}"><button class="plain trow" data-act="chapter" data-k="${u.k}"><span class="no">✦</span><span style="min-width:0;flex:1;overflow-wrap:anywhere"><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · Class ${u.level} · Covers ${esc(B||u.c?.topic||"")}</span></span>${pillS(coverage(u))}</button></div>`};
