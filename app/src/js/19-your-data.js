/* ---------- your data: save a full copy (plan, progress, answers, photos) and bring it into another device or the website ---------- */
function dataBox() {
  const P = ui.dx;
  return `<p class="xs muted">One file with everything: your plan, progress, answers, routines and photos. Use it to keep a backup, or to move to the DeepKids website.</p>
  <div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn soft sm" data-act="dexport" ${P ? "disabled" : ""}>${P?.what === "out" ? esc(P.msg) : "Save a copy"}</button><label class="btn line sm" style="cursor:pointer">${P?.what === "in" ? esc(P.msg) : "Bring in a copy"}<input type="file" id="importFile" accept=".zip,.json,application/zip,application/json" hidden ${P ? "disabled" : ""}></label></div>`;
}
async function dataExport() {
  ui.dx = { what: "out", msg: "Packing…" };
  renderSheet();
  const files = [
    {
      name: "deepkids-data.json",
      data: JSON.stringify({ app: "DeepKids", v: 1, exported: new Date().toISOString(), state: S }, null, 1),
    },
  ];
  let miss = 0,
    i = 0;
  const W = S.work || [];
  for (const w of W) {
    i++;
    ui.dx.msg = `Adding photos (${i} of ${W.length})…`;
    renderSheet();
    try {
      const r = await fetch("/_blob/" + encodeURIComponent(w.id));
      if (!r.ok) throw 0;
      files.push({ name: "photos/" + encodeURIComponent(w.id), data: await r.blob() });
    } catch (e) {
      miss++;
    }
  }
  try {
    const blob = await makeZip(files),
      name = `DeepKids ${fsafe(S.child || "family")} ${today}.zip`;
    ui.dx = null;
    renderSheet();
    await saveDoc(blob, name);
    if (miss) toast(`${miss} photo${miss > 1 ? "s" : ""} couldn't be added`);
  } catch (e) {
    ui.dx = null;
    renderSheet();
    toast("Couldn't make the file");
  }
}
function readZip(buf) {
  const u = new Uint8Array(buf),
    dv = new DataView(buf),
    out = {},
    dec = new TextDecoder();
  let e = u.length - 22;
  while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error("not a zip");
  const n = dv.getUint16(e + 10, true);
  let p = dv.getUint32(e + 16, true);
  for (let k = 0; k < n; k++) {
    const method = dv.getUint16(p + 10, true),
      size = dv.getUint32(p + 20, true),
      nl = dv.getUint16(p + 28, true),
      xl = dv.getUint16(p + 30, true),
      cl = dv.getUint16(p + 32, true),
      lo = dv.getUint32(p + 42, true),
      name = dec.decode(u.subarray(p + 46, p + 46 + nl));
    if (method === 0) {
      const lnl = dv.getUint16(lo + 26, true),
        lxl = dv.getUint16(lo + 28, true),
        st = lo + 30 + lnl + lxl;
      out[name] = u.slice(st, st + size);
    }
    p += 46 + nl + xl + cl;
  }
  return out;
}
async function dataImport(file) {
  let data = null,
    photos = {};
  try {
    if (/\.zip$/i.test(file.name) || file.type.includes("zip")) {
      const Z = readZip(await file.arrayBuffer());
      data = JSON.parse(new TextDecoder().decode(Z["deepkids-data.json"]));
      for (const k in Z) if (k.startsWith("photos/")) photos[decodeURIComponent(k.slice(7))] = Z[k];
    } else data = JSON.parse(await file.text());
  } catch (e) {
    toast("That isn't a DeepKids file");
    return;
  }
  const st = data?.state;
  if (!st || st.setup === undefined) {
    toast("That isn't a DeepKids file");
    return;
  }
  if (
    !confirm(
      `Bring in ${st.child || "this family"}'s data? It replaces what's on this device now. Your current data is kept as a backup file first.`,
    )
  )
    return;
  try {
    const bk = JSON.stringify({ app: "DeepKids", v: 1, exported: new Date().toISOString(), state: S });
    lsSet("dk-backup-" + (ACC || "guest"), bk);
  } catch (e) {}
  ui.dx = { what: "in", msg: "Bringing it in…" };
  renderSheet();
  const W = st.work || [],
    ids = Object.keys(photos);
  let i = 0,
    miss = 0;
  if (ids.length && ASSETS) {
    for (const w of W) {
      const b = photos[w.id];
      if (!b) {
        continue;
      }
      i++;
      ui.dx.msg = `Photos (${i} of ${ids.length})…`;
      renderSheet();
      try {
        const r = await ASSETS.upload(new Blob([b], { type: w.type || "image/jpeg" }));
        w.id = r.id;
      } catch (e) {
        miss++;
      }
    }
  } else if (ids.length) miss = ids.length;
  S = { ...fresh(), ...st, acct: S.acct };
  ui.dx = null;
  sfx("win");
  toast(miss ? `Brought in. ${miss} photo${miss > 1 ? "s" : ""} couldn't be added here.` : "All brought in");
  commit();
}

/* Today always opens on today: leaving the tab, or the app, resets a day you browsed to */
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hiddenAt = Date.now();
    return;
  }
  if (hiddenAt && Date.now() - hiddenAt > 20000 && ui.tday) {
    ui.tday = null;
    render();
  }
  hiddenAt = 0;
});
