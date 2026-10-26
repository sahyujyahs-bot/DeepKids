/* ---------- worksheet (one section per page) ---------- */
function wsItemV0(k, id, it, qn) {
  const v = A(k, id);
  let b = "";
  if (it.t === "mcq")
    b = `<div class="col" style="gap:8px">${it.opts.map((o, oi) => `<button class="opt ${v === undefined ? "" : oi === it.a ? "right" : oi === v ? "wrong" : ""}" data-act="mcq" data-k="${k}" data-id="${id}" data-o="${oi}" data-a="${it.a}" ${v !== undefined ? "disabled" : ""}>${esc(o)}</button>`).join("")}</div>${v !== undefined ? `<div class="row sm"><span>${v === it.a ? "Right." : "The green one is our answer. Talk about why."}</span><button class="link sm" data-act="mcqreset" data-k="${k}" data-id="${id}">Try again</button></div>` : ""}`;
  else if (it.t === "fill")
    b = `<div class="col" style="gap:8px">${it.a.map((_, bi) => `<input class="inp" id="f-${k}-${id}-${bi}" data-ans="${k}|${id}|${bi}" placeholder="Blank ${bi + 1}" value="${esc((v || [])[bi] || "")}">`).join("")}</div><div class="row"><button class="btn xs" data-act="checkfill" data-k="${k}" data-id="${id}" data-a="${esc(JSON.stringify(it.a))}">Check</button><button class="link sm" data-act="showfill" data-a="${esc(it.a.join(" · "))}">Show answers</button></div>`;
  else if (it.t === "write")
    b = `<textarea class="inp" id="w-${k}-${id}" data-ans="${k}|${id}" rows="${it.lines || 3}" placeholder="Write here">${esc(v || "")}</textarea>`;
  else if (it.t === "table") {
    const vv = v || {};
    b = `<div class="grid"><table><tr>${it.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>${Array.from({ length: it.rows }, (_, r) => `<tr>${it.cols.map((_, ci) => `<td><input id="t-${k}-${id}-${r}-${ci}" data-ans="${k}|${id}|${r}.${ci}" value="${esc(vv[r + "." + ci] ?? (ci === 0 && it.prefill ? it.prefill[r] || "" : ""))}" aria-label="${esc(it.cols[ci])}, row ${r + 1}"></td>`).join("")}</tr>`).join("")}</table></div>`;
  } else if (it.t === "draw")
    b = `<canvas class="pad" data-pad="${k}|${id}"></canvas><div class="row"><button class="link sm" data-act="clearpad" data-pad="${k}|${id}">Clear</button><button class="btn xs ${v ? "soft" : ""}" data-act="drew" data-k="${k}" data-id="${id}">${v ? "Drawn ✓" : "Drawn on paper"}</button></div>`;
  else if (it.t === "sort") {
    const vv = v || {},
      sel = ui.sel[k + id];
    b = `<div class="pool">${
      it.items
        .filter((z) => vv[z] === undefined)
        .map(
          (z) =>
            `<button class="token ${sel === z ? "sel" : ""}" data-act="tok" data-k="${k}" data-id="${id}" data-x="${esc(z)}">${esc(z)}</button>`,
        )
        .join("") || `<span class="sm">All sorted. Could any go in two boxes?</span>`
    }</div><div class="buckets">${it.cats
      .map(
        (c, ci) =>
          `<div class="bucket" data-act="bucket" data-k="${k}" data-id="${id}" data-c="${ci}"><b>${esc(c)}</b>${it.items
            .filter((z) => vv[z] === ci)
            .map(
              (z) =>
                `<button class="token" data-act="untok" data-k="${k}" data-id="${id}" data-x="${esc(z)}">${esc(z)} ×</button>`,
            )
            .join("")}</div>`,
      )
      .join(
        "",
      )}</div><p class="xs muted">${sel ? `Now tap a box for “${esc(sel)}”.` : "Tap a word, then tap its box."}</p>`;
  } else if (it.t === "match") {
    const vv = v || {},
      sel = ui.sel[k + id],
      rights = it.pairs
        .map((p) => p[1])
        .slice()
        .sort();
    b = `<div class="match"><div class="col" style="gap:6px">${it.pairs.map(([l]) => `<button class="mitem ${vv[l] !== undefined ? "paired" : sel === l ? "sel" : ""}" data-act="mleft" data-k="${k}" data-id="${id}" data-x="${esc(l)}">${esc(l)}${vv[l] !== undefined ? " → " + esc(vv[l]) : ""}</button>`).join("")}</div><div class="col" style="gap:6px">${rights.map((r) => `<button class="mitem ${Object.values(vv).includes(r) ? "paired" : ""}" data-act="mright" data-k="${k}" data-id="${id}" data-x="${esc(r)}">${esc(r)}</button>`).join("")}</div></div>${Object.keys(vv).length === it.pairs.length ? `<div class="row sm"><span>${it.pairs.filter(([l, r]) => vv[l] === r).length} of ${it.pairs.length} match ours.</span><button class="link sm" data-act="mreset" data-k="${k}" data-id="${id}">Try again</button></div>` : `<p class="xs muted">Tap a word on the left, then its match.</p>`}`;
  }
  return `<div class="wq"><div class="p">${qn}. ${esc(it.p)}</div>${b}</div>`;
}
function wsItem(k, id, it, qn) {
  if (it.t !== "forces") {
    let h = wsItemV0(k, id, it, qn);
    if (it.t === "draw" && SAMPLE)
      h = h.replace(
        /<\/div>\s*$/,
        `<button class="link sm" data-act="aidraw" data-k="${k}" data-id="${id}">✦ Check my drawing (uses AI)</button>${ui.aires?.[k + id] ? `<p class="sm note">${esc(ui.aires[k + id])}</p>` : ""}</div>`,
      );
    return h;
  }
  const v = A(k, id) || { fs: [] },
    fs = v.fs || [],
    sel = ui.fsel?.[k + id] || it.options[0],
    res = v.checked ? forcesCheck(it, fs) : null;
  return `<div class="wsq"><span class="eyebrow">Question ${qn} · force diagram</span><p><b>${esc(it.p)}</b></p>${forceSvg(it.obj, fs)}
   <div class="row" style="flex-wrap:wrap;gap:6px"><select class="inp" style="width:auto" data-fsel="1" data-fk="${k}" data-fid="${id}">${it.options.map((o) => `<option ${o === sel ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>${Object.entries(
     FDIR,
   )
     .map(
       ([d, a]) =>
         `<button class="btn xs soft" aria-label="${esc(sel)} ${d}" data-act="fadd" data-k="${k}" data-id="${id}" data-dir="${d}">${a}</button>`,
     )
     .join("")}</div>
   ${fs.length ? `<div class="row chips" style="flex-wrap:wrap">${fs.map((f, i) => `<button class="chip" data-act="fdel" data-k="${k}" data-id="${id}" data-i="${i}">${esc(f.name)} ${FDIR[f.dir]} ✕</button>`).join("")}</div>` : `<p class="xs muted">Choose a force, then tap the way it pushes or pulls. Add every force you think acts on it.</p>`}
   <div class="row"><button class="btn xs" data-act="fcheck" data-k="${k}" data-id="${id}" ${fs.length ? "" : "disabled"}>Check</button>${v.checked && !res.ok ? `<button class="link sm" data-act="fshow" data-k="${k}" data-id="${id}">Show our answer</button>` : ""}</div>
   ${res ? `<div class="sm ${res.ok ? "good" : "note"}">${res.ok ? "All right! Every force and direction matches." : [res.right.length ? `✓ Right: ${res.right.map((f) => f.name).join(", ")}.` : "", res.wrongDir.length ? `↺ Right force, wrong direction: ${res.wrongDir.map((f) => f.name).join(", ")}.` : "", res.extra.length ? `✕ Not acting here: ${res.extra.map((f) => f.name).join(", ")}.` : "", res.missing.length ? `… ${res.missing.length} force${res.missing.length > 1 ? "s" : ""} still missing.` : ""].filter(Boolean).join(" ")}</div>` : ""}
   ${v.shown ? `<p class="xs"><b>Our answer:</b> ${it.a.map((f) => `${esc(f.name)} ${FDIR[f.dir]}`).join(", ")}</p>` : ""}</div>`;
}
function wsViewV0() {
  const u = unitBy(ui.sheet.k);
  if (!u) return "";
  const wid = ui.sheet.w,
    pw = wid && u.c?.p?.worksheets?.find((w) => w.id === wid),
    W = pw ? pw.sections : u.c.x.wsd,
    k = pw ? u.k + "#" + wid : u.k,
    si = Math.min(ui.wsec[k] || 0, W.length - 1);
  document.getElementById("sheetTitle").textContent = (pw ? pw.title : "Worksheet") + " · " + u.title;
  let qn = W.slice(0, si).reduce((a, s) => a + s[1].length, 0);
  const [title, items] = W[si];
  return `<div class="segs ${SC(u.subj)}">${W.map((_, i) => `<i class="${i < si ? "ok" : i === si ? "on" : ""}"></i>`).join("")}</div><section class="card"><span class="eyebrow">${pw ? TIER[pw.tier] + " · " : ""}Section ${si + 1} of ${W.length}</span><h2 style="font-size:22px">${esc(title.replace(/^[A-Z]\. /, ""))}</h2>${items.map((it, ii) => wsItem(k, si + "-" + ii, it, ++qn)).join("")}</section>
   <div class="pager"><button class="btn line" data-act="wsec" data-k="${k}" data-d="-1" ${si === 0 ? "disabled" : ""}>${icon("back")}Back</button>${si < W.length - 1 ? `<button class="btn accent wide" data-act="wsec" data-k="${k}" data-d="1">Next section${icon("next")}</button>` : `<button class="btn accent wide" data-act="wsdone" data-k="${k}">${taskDone(k, "ws") ? "Finished ✓" : "Finish the worksheet"}</button>`}</div><p class="xs muted">Many questions have no single right answer. The thinking is the point.</p>`;
}
function wsView() {
  let h = wsViewV0();
  const k = ui.sheet.w ? ui.sheet.k + "#" + ui.sheet.w : "";
  if (!k) return h;
  const st = ui.aiws?.k === k ? ui.aiws : null;
  const box = `<section class="card"><span class="eyebrow">Did it on paper?</span><p class="sm">Take a photo of the printed sheet and DeepKids AI will check it against our answers, question by question. ${SAMPLE ? "" : "(Needs DeepKids Plus.)"}</p>${SAMPLE ? `<label class="btn sm soft" style="justify-self:start">📷 Check a photo of the paper sheet (uses AI)<input type="file" accept="image/*" capture="environment" multiple id="wsPhoto" data-k="${k}" hidden></label>` : ""}
   ${st?.busy ? `<p class="sm">Checking…</p>` : ""}${st?.err ? `<p class="sm note">${esc(st.err)}</p>` : ""}
   ${st?.res ? `<div class="col" style="gap:4px">${(st.res.results || []).map((r) => `<div class="sm">${r.verdict === "right" ? "✓" : r.verdict === "partly" ? "◐" : r.verdict === "not yet" ? "✕" : "?"} <b>Q${r.n}</b> ${esc(r.note || "")}</div>`).join("")}<p class="sm"><b>${esc(st.res.summary || "")}</b></p><p class="xs muted">Checked by AI: it can misread handwriting, so look over anything surprising.</p></div>` : ""}</section>`;
  return h + box;
}
function initPads() {
  document.querySelectorAll("canvas.pad").forEach((c) => {
    if (c._ok) return;
    const r = c.getBoundingClientRect();
    if (!r.width) return;
    c._ok = 1;
    c.width = r.width * devicePixelRatio;
    c.height = r.height * devicePixelRatio;
    const x = c.getContext("2d");
    x.scale(devicePixelRatio, devicePixelRatio);
    x.lineWidth = 3;
    x.lineCap = "round";
    x.lineJoin = "round";
    x.strokeStyle = getComputedStyle(document.body).color;
    let d = false,
      drew = false;
    const key = padKey(c.dataset.pad),
      old = lsGet(key);
    if (old) {
      const im = new Image();
      im.onload = () => x.drawImage(im, 0, 0, r.width, r.height);
      im.src = old;
    }
    const pt = (e) => {
      const b = c.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    c.onpointerdown = (e) => {
      d = true;
      drew = true;
      c.setPointerCapture(e.pointerId);
      x.beginPath();
      x.moveTo(...pt(e));
    };
    c.onpointermove = (e) => {
      if (d) {
        x.lineTo(...pt(e));
        x.stroke();
      }
    };
    c.onpointerup = () => {
      d = false;
      if (!drew) return;
      try {
        const s = document.createElement("canvas");
        s.width = Math.min(480, c.width);
        s.height = Math.round((s.width * c.height) / c.width);
        const g = s.getContext("2d");
        g.fillStyle = "#fff";
        g.fillRect(0, 0, s.width, s.height);
        g.drawImage(c, 0, 0, s.width, s.height);
        lsSet(key, s.toDataURL("image/jpeg", 0.7));
      } catch (e) {}
      const [k, id] = c.dataset.pad.split(/\|(?=[^|]*$)/);
      if (!A(k, id)) {
        setA(k, id, today);
        save();
      }
    };
  });
}

/* ---------- prep checklist ---------- */
function prepView() {
  const { date, when } = ui.sheet,
    its = prepBlock(date, when);
  document.getElementById("sheetTitle").textContent =
    (when === "am" ? "Morning prep" : "Prep for tomorrow") + " · " + fmt(date);
  if (!its.length) return `<p class="note">Nothing to prepare. Enjoy the calm.</p>`;
  const dn = its.filter((p) => S.prep[p.id]).length;
  const groups = [];
  its.forEach((p) => {
    let g = groups.find((g) => g.x === p.x);
    if (!g) groups.push((g = { x: p.x, items: [] }));
    g.items.push(p);
  });
  return (
    `<section class="card r-you"><div class="sech"><h3>${dn} of ${its.length} ready</h3><span class="xs muted">about ${prepMins(its)} min</span></div><div class="bar"><span style="width:${(dn / its.length) * 100}%;background:var(--marigold)"></span></div><p class="xs muted">Set a daily phone alarm for ${clock(hm(D()[when === "am" ? "prepAt" : "eveAt"]))}. The app can't send reminders itself.</p></section>` +
    groups
      .map(({ x, items }) => {
        const u = x.u,
          g = u.c?.p?.summary || u.c?.x?.guide || (u.board !== "dk" ? DATA.prepgen.guide[u.subj] : u.topic?.summary);
        return `<section class="card ${SC(x.subj)}" style="gap:0"><div class="row" style="gap:8px;margin-bottom:4px"><span class="dotc"></span><span class="eyebrow">${SUBJ[x.subj]} · ${fmt(x.date)} · Part ${x.n} of ${x.tot}</span></div><h3 style="font-size:19px;margin-bottom:8px">${esc(u.title)}</h3>
   ${g ? `<details style="margin-bottom:6px" ${items.some((p) => p.kind === "guide") ? "open" : ""}><summary style="cursor:pointer;font-weight:500;color:var(--plum)">Parent guide</summary><p class="sm" style="margin-top:6px">${esc(g)}</p></details>` : ""}
   ${items.map((p) => `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:500">${esc(p.task)}</b>${p.early ? ` <span class="pill learning">start early for ${fmt(x.date)}</span>` : ""}<p class="xs muted" style="margin-top:3px">From: ${esc(p.where)}</p></div></div>`).join("")}
   <div class="row" style="margin-top:8px">${u.c?.x ? `<button class="btn xs soft" data-act="chapter" data-k="${u.k}" data-t="questions">Big questions</button><button class="btn xs soft" data-act="ws" data-k="${u.k}">Worksheet</button>` : ""}<button class="btn xs soft" data-act="chapter" data-k="${u.k}">Chapter</button></div></section>`;
      })
      .join("")
  );
}
