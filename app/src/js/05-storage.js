/* Saving and loading, accounts, export and import */
let ACC = null,
  DBR = null,
  UIDR = null,
  unsub = null;
const LSK = () => "dk-state-" + (ACC || "guest");
const lsGet = (k) => {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  },
  lsSet = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  },
  lsDel = (k) => {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  };
async function boot() {
  ACC = lsGet("dk-acct");
  if (ACC) {
    try {
      const ls = lsGet(LSK());
      if (ls) S = { ...fresh(), ...JSON.parse(ls) };
    } catch (e) {}
  }
  if (!ACC || S.setup) render();
  try {
    const [db, user] = await Promise.all([window.claude?.use?.("db"), window.claude?.use?.("user")]);
    UIDR = db && user ? await user.id() : null;
    DBR = UIDR ? db : null;
  } catch (e) {
    DBR = null;
  }
  if (DBR && !ACC) {
    try {
      const s = await DBR.doc("data/users/" + UIDR + "/session").get();
      if (s.exists && s.data().acct) {
        ACC = String(s.data().acct);
        lsSet("dk-acct", ACC);
      }
    } catch (e) {}
  }
  if (ACC) await openAccount(ACC);
  else render();
}
async function openAccount(acct, name) {
  ACC = acct;
  lsSet("dk-acct", acct);
  if (unsub) {
    try {
      unsub();
    } catch (e) {}
    unsub = null;
  }
  store = null;
  let local = null;
  try {
    const ls = lsGet(LSK());
    if (ls) local = JSON.parse(ls);
  } catch (e) {}
  if (!local) {
    const v2 = lsGet("dk-state-v2");
    if (v2 && !lsGet("dk-v2-migrated")) {
      try {
        local = JSON.parse(v2);
      } catch (e) {}
      lsSet("dk-v2-migrated", "1");
    }
  }
  S = { ...fresh(), ...(local || {}) };
  ob = null;
  if (S.setup || !DBR) render();
  if (DBR) {
    ui.acctLoading = !S.setup; // until the saved family arrives, don't show set-up
    try {
      store = DBR.doc("data/users/" + UIDR + "/acct_" + acct);
      const snap = await store.get();
      const remote = snap.exists ? snap.data() : null;
      const ks = await DBR.doc("data/users/" + UIDR + "/session")
          .get()
          .catch(() => null),
        known = (ks && ks.exists && ks.data()) || {};
      let legacy = null;
      if (!known.migrated) {
        const old = await DBR.doc("data/users/" + UIDR + "/planner")
          .get()
          .catch(() => null);
        if (old && old.exists) legacy = old.data();
      }
      const cands = [local, remote, legacy]
        .filter((x) => x && x.setup !== undefined)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      if (cands.length) {
        let m = cands[0];
        cands.slice(1).forEach((c) => (m = mergeIn(m, c)));
        S = { ...fresh(), ...m };
        ob = null;
      }
      if (name && !S.parent?.name) S.parent = { ...(S.parent || {}), name };
      S.acct = acct;
      S.updatedAt = Math.max(S.updatedAt || 0, 1);
      await store.set(JSON.parse(JSON.stringify(S)));
      await DBR.doc("data/users/" + UIDR + "/session").set({ acct, at: Date.now(), migrated: true });
      lsSet(LSK(), JSON.stringify(S));
      syncMode = "account";
      lastSaved = Date.now();
      unsub = store.onSnapshot(
        (s) => {
          const r = s.exists ? s.data() : null;
          if (r && r.setup !== undefined && (r.updatedAt || 0) > (S.updatedAt || 0)) {
            S = { ...fresh(), ...r };
            lsSet(LSK(), JSON.stringify(S));
            render();
          }
        },
        () => {},
      );
    } catch (e) {
      console.warn("account sync failed", e);
      store = null;
      syncMode = "device";
    }
    ui.acctLoading = false;
  } else {
    if (name && !S.parent?.name) S.parent = { ...(S.parent || {}), name };
    S.acct = acct;
    lsSet(LSK(), JSON.stringify(S));
  }
  const k = JSON.parse(lsGet("dk-known") || "[]").filter((x) => x.acct !== acct);
  k.unshift({ acct, name: S.parent?.name || name || "", child: S.child || "" });
  lsSet("dk-known", JSON.stringify(k.slice(0, 5)));
  render();
}
// two copies of a list of records with ids (work photos, moments): every record, the newer copy's fields winning
function mergeById(a, b) {
  if (!Array.isArray(a) && !Array.isArray(b)) return a;
  const m = new Map();
  [...(Array.isArray(b) ? b : []), ...(Array.isArray(a) ? a : [])].forEach(
    (w) => w && w.id && m.set(w.id, { ...(m.get(w.id) || {}), ...w }),
  );
  return [...m.values()];
}
function mergeIn(a, b) {
  const key = (l) => l.date + "|" + l.key + "|" + l.kind,
    seen = new Set((a.log || []).map(key));
  const log = [...(a.log || []), ...(b.log || []).filter((l) => !seen.has(key(l)))]
    .sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0))
    .slice(0, 3000);
  const progress = { ...(b.progress || {}), ...(a.progress || {}) };
  Object.entries(b.progress || {}).forEach(([k, q]) => {
    const p = (a.progress || {})[k];
    if (p && (q.sessions || 0) > (p.sessions || 0))
      progress[k] = { ...p, sessions: q.sessions, status: rank[q.status] > rank[p.status] ? q.status : p.status };
  });
  const keep = (o) => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v !== "" && v != null));
  return {
    ...a,
    log,
    progress,
    steps: { ...(b.steps || {}), ...(a.steps || {}) },
    prep: { ...(b.prep || {}), ...(a.prep || {}) },
    tasks: { ...(b.tasks || {}), ...(a.tasks || {}) },
    ans: { ...(b.ans || {}), ...(a.ans || {}) },
    games: { ...(b.games || {}), ...(a.games || {}) },
    wk: { ...(b.wk || {}), ...(a.wk || {}) },
    quiz: { ...(b.quiz || {}), ...(a.quiz || {}) },
    work: mergeById(a.work, b.work),
    moments: mergeById(a.moments, b.moments),
    mins: (() => {
      const m = { ...(b.mins || {}) };
      Object.entries(a.mins || {}).forEach(([k, v]) => {
        m[k] = Math.max(v, m[k] || 0);
      });
      return m;
    })(),
    cal: (a.cal?.at || 0) >= (b.cal?.at || 0) ? a.cal : b.cal,
    school: { ...(b.school || {}), ...(a.school || {}) },
    evlog: { ...(b.evlog || {}), ...(a.evlog || {}) },
    evoff: { ...(b.evoff || {}), ...(a.evoff || {}) },
    snz: { ...(b.snz || {}), ...(a.snz || {}) },
    rem: { ...(b.rem || {}), ...(a.rem || {}) },
    parent: { ...keep(b.parent), ...keep(a.parent) },
  };
}
async function logout() {
  if (store) {
    clearTimeout(saveTimer);
    await writeNow().catch(() => {});
  }
  if (unsub) {
    try {
      unsub();
    } catch (e) {}
    unsub = null;
  }
  if (DBR) {
    try {
      await DBR.doc("data/users/" + UIDR + "/session").set({ acct: null, at: Date.now(), migrated: true });
    } catch (e) {}
  }
  lsDel("dk-acct");
  ACC = null;
  store = null;
  S = fresh();
  ob = null;
  render();
}
let lastSaved = 0;
function writeNow() {
  const body = JSON.parse(JSON.stringify(S));
  const p = saving
    .then(() => store.set(body))
    .then(
      () => {
        syncMode = "account";
        lastSaved = Date.now();
        return true;
      },
      () => {
        syncMode = "device";
        return false;
      },
    );
  saving = p.then(() => {});
  return p;
}
function save() {
  if (!ACC) return;
  lsSet(LSK(), JSON.stringify(S));
  if (!store) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(writeNow, 600);
}
async function saveNow() {
  if (!ACC) return false;
  lsSet(LSK(), JSON.stringify(S));
  if (!store) return false;
  clearTimeout(saveTimer);
  return writeNow();
}
const commit = () => {
  S.updatedAt = Date.now();
  save();
  render();
};
/* Science is one subject again: a family's old "DeepKids Science" subject (dks) moves into Science, once */
function sciMerge() {
  if (!S || !S.setup || S.sciMerged) return;
  S.sciMerged = 1;
  const had = S.subjects.includes("dks");
  S.subjects = S.subjects.filter((s) => s !== "dks");
  if (had && !S.subjects.includes("sci")) S.subjects = [...S.subjects, "sci"];
  const mv = (o) => {
    if (!o?.dks) return o;
    const { dks, ...rest } = o;
    return { ...rest, sci: [...new Set([...(rest.sci || []), ...dks])] };
  };
  S.extra = mv(S.extra);
  S.next = mv(S.next);
  S.later = mv(S.later);
  if (S.levels?.dks) {
    const { dks, ...rest } = S.levels;
    S.levels = { sci: dks, ...rest };
  }
  (S.log || []).forEach((l) => {
    if (l.subj === "dks") l.subj = "sci";
  });
  save();
}
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
let DBH = null,
  UID = null,
  _all = null,
  ACCT = "";
