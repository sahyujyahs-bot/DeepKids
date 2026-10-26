/* ---------- persistence: one private document per viewer; the newer copy wins ---------- */
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
    work:
      Array.isArray(a.work) || Array.isArray(b.work)
        ? (() => {
            const m = new Map();
            [...(Array.isArray(b.work) ? b.work : []), ...(Array.isArray(a.work) ? a.work : [])].forEach(
              (w) => w && w.id && m.set(w.id, { ...(m.get(w.id) || {}), ...w }),
            );
            return [...m.values()];
          })()
        : a.work,
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
addEventListener("pagehide", () => {
  if (store && saveTimer) {
    clearTimeout(saveTimer);
    writeNow();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && store) {
    clearTimeout(saveTimer);
    writeNow();
  }
});
const commit = () => {
  S.updatedAt = Date.now();
  save();
  render();
};
