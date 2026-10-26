/* ---------- a zip folder for the school, shared any way they like ---------- */
const CRCT = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (u) => {
  let c = 0xffffffff;
  for (let i = 0; i < u.length; i++) c = CRCT[(c ^ u[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
async function makeZip(files) {
  const enc = new TextEncoder(),
    parts = [],
    cen = [],
    d = new Date(),
    dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
    tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  let off = 0;
  for (const f of files) {
    const data =
        typeof f.data === "string"
          ? enc.encode(f.data)
          : f.data instanceof Blob
            ? new Uint8Array(await f.data.arrayBuffer())
            : f.data,
      nm = enc.encode(f.name),
      crc = crc32(data),
      L = new DataView(new ArrayBuffer(30)),
      C = new DataView(new ArrayBuffer(46));
    [
      [0, 0x04034b50, 4],
      [4, 20, 2],
      [6, 0x0800, 2],
      [8, 0, 2],
      [10, tm, 2],
      [12, dt, 2],
      [14, crc, 4],
      [18, data.length, 4],
      [22, data.length, 4],
      [26, nm.length, 2],
      [28, 0, 2],
    ].forEach(([o, v, w]) => (w === 4 ? L.setUint32(o, v, true) : L.setUint16(o, v, true)));
    [
      [0, 0x02014b50, 4],
      [4, 20, 2],
      [6, 20, 2],
      [8, 0x0800, 2],
      [10, 0, 2],
      [12, tm, 2],
      [14, dt, 2],
      [16, crc, 4],
      [20, data.length, 4],
      [24, data.length, 4],
      [28, nm.length, 2],
      [30, 0, 2],
      [32, 0, 2],
      [34, 0, 2],
      [36, 0, 2],
      [38, 0, 4],
      [42, off, 4],
    ].forEach(([o, v, w]) => (w === 4 ? C.setUint32(o, v, true) : C.setUint16(o, v, true)));
    parts.push(new Uint8Array(L.buffer), nm, data);
    cen.push(new Uint8Array(C.buffer), nm);
    off += 30 + nm.length + data.length;
  }
  const cs = cen.reduce((a, u) => a + u.length, 0),
    E = new DataView(new ArrayBuffer(22));
  E.setUint32(0, 0x06054b50, true);
  E.setUint16(8, files.length, true);
  E.setUint16(10, files.length, true);
  E.setUint32(12, cs, true);
  E.setUint32(16, off, true);
  return new Blob([...parts, ...cen, new Uint8Array(E.buffer)], { type: "application/zip" });
}
const fsafe = (s) =>
  String(s || "")
    .replace(/[\\/:*?"<>|#%]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60) || "file";
function zipSel() {
  if (ui.zs) return ui.zs;
  const t = curTest(),
    F = folderData();
  ui.zs = {
    docs: new Set(["transcript", "work", ...(t ? ["paper"] : []), ...(tDone(t) ? ["cert", "key", "sheet"] : [])]),
    ws: new Set(F.flatMap((c) => c.ws.filter((w) => w.fin).map((w) => w.k))),
    up: new Set((S.work || []).filter((w) => w.k).map((w) => w.id)),
  };
  return ui.zs;
}
function bundleSection() {
  const Z = zipSel(),
    t = curTest(),
    fin = tDone(t),
    F = folderData(),
    W = F.flatMap((c) => c.ws.map((w) => ({ ...w, u: c.u }))),
    U = S.work || [],
    P = ui.zip;
  const ck = (grp, id, label, sub, dis) =>
    `<label class="zrow ${dis ? "off" : ""}"><input type="checkbox" data-zip="${grp}" value="${esc(id)}" ${Z[grp].has(id) && !dis ? "checked" : ""} ${dis ? "disabled" : ""}><span><b class="sm">${label}</b>${sub ? `<br><span class="xs muted">${sub}</span>` : ""}</span></label>`;
  let h = `<section class="card"><span class="eyebrow">For the school</span><h3 style="font-size:20px">Make one folder to send</h3><p class="sm">Tick what to include. DeepKids puts it all in one .zip folder you can save, then send by WhatsApp, email or anything else.</p>
  <div class="col" style="gap:6px">${ck("docs", "transcript", "Transcript", "Coverage by board and level, chapters, scores, attendance")}${ck("docs", "cert", "Score certificate", fin ? "" : "After the test is finished", !fin)}${ck("docs", "paper", "Question paper", t ? "" : "Make a paper first", !t)}${ck("docs", "key", "Answer key and marking", fin ? "" : "After the test is finished", !fin)}${ck("docs", "sheet", "Marked answer sheet", fin ? "" : "After the test is finished", !fin)}${ck("docs", "work", "Projects and experiments list", "With start and finish dates")}</div>`;
  if (W.length)
    h += `<details style="margin-top:8px"><summary class="link sm" style="cursor:pointer">Worksheets with answers · ${Z.ws.size} of ${W.length} ticked</summary><div class="col" style="gap:6px;margin-top:6px"><div class="row"><button class="link xs" data-act="zall" data-g="ws" data-v="1">Tick all</button><button class="link xs" data-act="zall" data-g="ws" data-v="0">Untick all</button></div>${W.map((w) => ck("ws", w.k, esc(w.title), `${esc(chT(w.u))} · ${w.fin ? "finished " + esc(fmt(w.fin)) : w.ans + " of " + w.tot + " answered"}`)).join("")}</div></details>`;
  if (U.length)
    h += `<details style="margin-top:8px"><summary class="link sm" style="cursor:pointer">Photos and files · ${[...Z.up].filter((id) => U.some((w) => w.id === id)).length} of ${U.length} ticked</summary><div class="col" style="gap:6px;margin-top:6px"><div class="row"><button class="link xs" data-act="zall" data-g="up" data-v="1">Tick all</button><button class="link xs" data-act="zall" data-g="up" data-v="0">Untick all</button></div>${U.map((w) => ck("up", w.id, esc(w.title || w.name || "Upload"), `${esc(fmt(w.date))}${w.k && unitByK(w.k) ? " · " + esc(chT(unitByK(w.k))) : ""}`)).join("")}</div></details>`;
  h += `<div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px"><button class="btn accent sm" data-act="zmake" ${P?.busy ? "disabled" : ""}>${P?.busy ? esc(P.busy) : "Make the folder"}</button></div>`;
  if (P?.blob) {
    const sh = !!(
      navigator.canShare && navigator.canShare({ files: [new File([P.blob], P.name, { type: "application/zip" })] })
    );
    h += `<div class="pk"><b>${esc(P.name)}</b><p class="xs muted">${P.count} files · ${(P.blob.size / 1048576).toFixed(1)} MB${P.miss ? ` · ${P.miss} photo${P.miss > 1 ? "s" : ""} couldn't be added` : ""}</p><div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn green sm" data-act="zsave">Save the folder</button>${sh ? `<button class="btn soft sm" data-act="zshare">Share…</button>` : ""}<a class="btn soft sm" href="https://wa.me/?text=${encodeURIComponent(zipMsg())}" target="_blank" rel="noopener">WhatsApp</a><a class="btn soft sm" href="mailto:?subject=${encodeURIComponent((S.child || "Student") + " – home education records")}&body=${encodeURIComponent(zipMsg() + "\n\n(The folder is attached.)")}" target="_blank" rel="noopener">Email</a></div><p class="xs muted">${sh ? "Share… sends the folder straight to WhatsApp, email or any app. " : ""}For WhatsApp or email: save the folder first, then attach it from your Downloads.</p></div>`;
  }
  return h + `</section>`;
}
const zipMsg = () => {
  const t = curTest(),
    sc = tDone(t) && tScore(t);
  return `Dear Sir/Madam,\nPlease find attached ${S.child || "my child"}'s home education records for admission${t ? ` to Class ${t.cls}` : S.school?.cls ? ` to ${S.school.cls}` : ""}: transcript${sc ? `, entrance test certificate (${sc.pct}%, grade ${sc.grade}), question paper, answer key and marked answer sheet` : ""}, and samples of work.\nRegards,\n${S.parent?.name || ""}`;
};
async function zipBuild() {
  const Z = zipSel(),
    t = curTest(),
    fin = tDone(t),
    kid = fsafe(S.child || "Student"),
    files = [];
  ui.zip = { busy: "Making the folder…" };
  render();
  const D = Z.docs;
  if (D.has("transcript")) files.push({ name: "01 Transcript.html", data: transcriptDoc() });
  if (fin && D.has("cert")) files.push({ name: "02 Score certificate.html", data: certDoc(t) });
  if (t && D.has("paper")) files.push({ name: "03 Question paper.html", data: paperDoc(t) });
  if (fin && D.has("key")) files.push({ name: "04 Answer key and marking.html", data: keyDoc(t) });
  if (fin && D.has("sheet")) files.push({ name: "05 Marked answer sheet.html", data: sheetDoc(t) });
  if (Z.ws.size) {
    const F = folderData()
      .map((c) => ({ ...c, ws: c.ws.filter((w) => Z.ws.has(w.k)), qz: c.qz, pj: D.has("work") ? c.pj : [] }))
      .filter((c) => c.ws.length || c.qz.length || c.pj.length);
    if (F.length) files.push({ name: "06 Worksheets and answers.html", data: folderDoc(F) });
  } else if (D.has("work")) {
    const F = folderData()
      .map((c) => ({ ...c, ws: [], qz: [] }))
      .filter((c) => c.pj.length);
    if (F.length) files.push({ name: "06 Projects and experiments.html", data: folderDoc(F) });
  }
  const ups = (S.work || []).filter((w) => Z.up.has(w.id));
  let miss = 0,
    i = 0;
  for (const w of ups) {
    i++;
    ui.zip.busy = `Adding photos (${i} of ${ups.length})…`;
    render();
    try {
      const r = await fetch("/_blob/" + encodeURIComponent(w.id));
      if (!r.ok) throw 0;
      const bl = await r.blob(),
        ext = (w.name && /\.\w{2,5}$/.test(w.name) ? w.name.split(".").pop() : bl.type.split("/")[1] || "bin").replace(
          "jpeg",
          "jpg",
        );
      const u = w.k && unitByK(w.k);
      files.push({
        name: `Work samples/${w.date || ""} ${u ? fsafe(SUBJ[u.subj] + " " + chT(u)) + " - " : ""}${fsafe(w.title || w.name)}.${ext}`,
        data: bl,
      });
    } catch (e) {
      miss++;
    }
  }
  const names = new Set();
  files.forEach((f) => {
    let n = f.name,
      k = 2;
    while (names.has(n)) n = f.name.replace(/(\.\w+)$/, ` (${k++})$1`);
    names.add(n);
    f.name = n;
  });
  try {
    const blob = await makeZip(files);
    ui.zip = { blob, name: `${kid} school folder ${today}.zip`, count: files.length, miss };
    sfx("win");
  } catch (e) {
    ui.zip = null;
    toast("Couldn't make the folder");
  }
  render();
}
async function zipSave() {
  const P = ui.zip;
  if (!P?.blob) return;
  try {
    const dl = await window.claude?.use?.("downloads");
    if (dl) {
      await dl.save({ filename: P.name, data: P.blob });
      toast("Saved");
      return;
    }
  } catch (e) {
    if (e?.code === "declined") return;
  }
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(P.blob);
    a.download = P.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Saved");
  } catch (e) {
    toast("Couldn't save here");
  }
}
async function zipShare() {
  const P = ui.zip;
  if (!P?.blob) return;
  try {
    await navigator.share({
      files: [new File([P.blob], P.name, { type: "application/zip" })],
      title: P.name,
      text: zipMsg(),
    });
  } catch (e) {
    if (e?.name !== "AbortError") toast("Sharing isn't available here. Save the folder, then send it.");
  }
}
function tdlDoc(d) {
  const t = curTest();
  if (!t) return;
  const kid = fsafe(S.child || "Student"),
    M = {
      paper: [paperDoc, "question paper"],
      key: [keyDoc, "answer key"],
      sheet: [sheetDoc, "marked answer sheet"],
      cert: [certDoc, "score certificate"],
    }[d];
  if (M) saveDoc(M[0](t), `${kid} ${M[1]} ${t.date}.html`);
}
