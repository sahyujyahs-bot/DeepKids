/* ---------- Library ---------- */

function viewLibrary() {
  const t = ui.lt || "topics",
    inv = S.inv || [];
  let h = `<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">Library</h1>${blob("var(--gum)", 7, "happy", "", 'width="50" height="50"')}</div><div class="seg">${LIBT.map(([k, n]) => `<button aria-pressed="${t === k}" data-act="lt" data-t="${k}">${n}</button>`).join("")}</div><p class="xs muted segdesc">${esc((LIBT.find((x) => x[0] === t) || LIBT[0])[2])}</p></section>`;
  if (t === "topics") h += topicsTab();
  if (t === "science") h += scienceTab();
  if (t === "have") {
    const seen = new Set(inv.map((i) => i.name.toLowerCase())),
      kw = new Set(),
      doneTasks = preppedTasks();
    PREP_KW.forEach((k) => {
      if (doneTasks.some((x) => x.toLowerCase().includes(k.toLowerCase())) && !seen.has(k.toLowerCase())) kw.add(k);
    });
    h += `<section class="sec">${invCard()}${Object.keys(CATS)
      .map((c) => {
        const L = inv.filter((i) => i.cat === c);
        return L.length
          ? `<div class="card" style="gap:0"><div class="sech"><h3 style="font-size:18px">${CATS[c]}</h3><span class="pill">${L.length}</span></div>${L.map(invItem).join("")}</div>`
          : "";
      })
      .join("")}
     ${kw.size ? `<div class="card r-you tint"><span class="eyebrow">From your lesson prep</span><p class="sm">You gathered these for lessons. Add them to your home shelf?</p><div class="row">${[...kw].map((k) => `<button class="chip" data-act="invadd" data-n="${esc(k)}" data-c="equipment">${icon("plus")}${esc(k)}</button>`).join("")}</div></div>` : ""}
     <details class="card"><summary class="link" style="cursor:pointer">Add one thing by hand</summary><div class="row" style="flex-wrap:nowrap;margin-top:10px"><input class="inp" id="invName" maxlength="60" placeholder="Add something you have"><select class="inp" id="invCat" style="width:auto">${Object.entries(
       CATS,
     )
       .map(([k, n]) => `<option value="${k}">${n}</option>`)
       .join(
         "",
       )}</select></div><button class="btn sm" data-act="invnew" style="justify-self:start;margin-top:8px">Add</button></details></section>`;
  }
  if (t === "suggest") {
    const have = new Set(inv.map((i) => i.name.toLowerCase()));
    h += `<section class="sec"><p class="sm muted">Picked for ${esc(S.child || "your child")}'s age and syllabus. Links go to the shop or maker; check the price there.</p>${Object.keys(
      CATS,
    )
      .map((c) => {
        const L = LIB.suggest.filter((x) => x[0] === c);
        return L.length
          ? `<div class="sech"><h3 style="font-size:18px">${CATS[c]}</h3></div><div class="grid2">${L.map(([cat, n, by, why, url], i) => `<div class="libcard" style="--c:${PAL[i % PAL.length]}"><span class="eyebrow">${esc(by)}</span><b>${esc(n)}</b><p class="sm">${esc(why)}</p><div class="row"><a class="btn xs" href="${esc(url)}" target="_blank" rel="noopener">See it ↗</a>${have.has(n.toLowerCase()) ? `<span class="pill completed">We have it</span>` : `<button class="btn xs soft" data-act="invadd" data-n="${esc(n)}" data-c="${cat}">We have it</button>`}</div></div>`).join("")}</div>`
          : "";
      })
      .join("")}</section>`;
  }
  if (t === "read")
    h += `<section class="sec">${[
      ["parents", "For you"],
      ["kids", "For " + esc(S.child || "kids")],
    ]
      .map(
        ([k, n]) =>
          `<div class="sech"><h3 style="font-size:18px">${n}</h3></div><div class="card" style="gap:0">${LIB.read[k].map(([ti, d, u]) => `<a class="res" href="${esc(u)}" target="_blank" rel="noopener"><b style="font:600 16px var(--display)">${esc(ti)} ↗</b><span class="sm muted">${esc(d)}</span></a>`).join("")}</div>`,
      )
      .join("")}</section>`;
  if (t === "watch")
    h += `<section class="sec">${[
      ["parents", "For you"],
      ["kids", "For " + esc(S.child || "kids")],
      ["family", "Family watch"],
    ]
      .map(
        ([k, n]) =>
          `<div class="sech"><h3 style="font-size:18px">${n}</h3></div><div class="grid2">${LIB.watch[k].map(([ti, d, u], i) => `<a class="libcard" style="--c:${PAL[(i + 2) % PAL.length]};text-decoration:none;color:inherit" href="${esc(u)}" target="_blank" rel="noopener">${icon("play")}<b>${esc(ti)}</b><span class="sm">${esc(d)}</span></a>`).join("")}</div>`,
      )
      .join("")}</section>`;
  return h;
}
