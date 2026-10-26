/* Edit any text (the owner's in-app editor) */
/* An edit replaces one piece of text (matched exactly, spaces ignored) wherever it appears. Stored in the website's
   content_edits table (or the artifact's shared db), cached on this device so the first screen already shows it. */
let EDITS = {},
  CANEDIT = false,
  EDITING = false,
  EDBH = null;
const ekey = (s) =>
  String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
function fnv(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
const EDB = {
  P: () => window.DK_PLATFORM?.edits,
  async list() {
    if (EDB.P()) return EDB.P().list();
    if (!EDBH) return null;
    const sn = await EDBH.collection("content_edits").limit(5000).get();
    return sn.docs.map((d) => d.data());
  },
  async put(k, t) {
    if (EDB.P()) return EDB.P().put(k, t);
    if (!EDBH) throw new Error("no db");
    return EDBH.collection("content_edits").doc(fnv(k)).set({ k, t });
  },
  async del(k) {
    if (EDB.P()) return EDB.P().del(k);
    if (!EDBH) throw new Error("no db");
    return EDBH.collection("content_edits").doc(fnv(k)).set({ k, t: null });
  },
};
function editsCache() {
  try {
    localStorage.setItem("dk-edits", JSON.stringify(EDITS));
  } catch (e) {}
}
function applyEdits(root) {
  if (!root || (!EDITING && !Object.keys(EDITS).length)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const p = n.parentNode;
    if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName) || p.closest?.("#dkEditDlg")) continue;
    const o = n.__dko ?? n.nodeValue,
      k = ekey(o);
    if (k && EDITS[k] != null) {
      n.__dko = o;
      const m = o.match(/^(\s*)[\s\S]*?(\s*)$/);
      const v = m[1] + EDITS[k] + m[2];
      if (n.nodeValue !== v) n.nodeValue = v;
    }
  }
}
const applyAll = () => applyEdits(document.body);
function editBtn() {
  if (!CANEDIT) return;
  if (!document.getElementById("dkEditBtn")) {
    const b = document.createElement("button");
    b.id = "dkEditBtn";
    b.className = "dkedb";
    b.type = "button";
    document.body.appendChild(b);
  }
  const ex = document.getElementById("sheetExtra");
  if (ex && !ex.querySelector(".dkedb")) {
    const b = document.createElement("button");
    b.className = "dkedb readbtn";
    b.type = "button";
    ex.prepend(b);
  }
  document.querySelectorAll(".dkedb").forEach((b) => {
    b.textContent = EDITING ? "✓ Done editing" : "✏️";
    b.title = EDITING ? "Stop editing text" : "Edit text";
    b.setAttribute("aria-pressed", EDITING);
  });
  document.body.classList.toggle("dk-editing", EDITING);
}
async function editsInit() {
  try {
    EDBH = window.DK_PLATFORM ? null : (await window.claude?.use?.("db")) || null;
  } catch (e) {}
  try {
    CANEDIT = EDB.P() ? await EDB.P().canEdit() : !!(await (await window.claude?.use?.("user"))?.isOwner?.());
  } catch (e) {
    CANEDIT = false;
  }
  try {
    const L = await EDB.list();
    if (L) {
      const N = {};
      L.forEach((r) => {
        if (r && r.k && r.t != null) N[ekey(r.k)] = r.t;
      });
      const ch = JSON.stringify(N) !== JSON.stringify(EDITS);
      EDITS = N;
      editsCache();
      if (ch) {
        render();
        if (ui.sheet) renderSheet();
      }
    }
  } catch (e) {
    console.warn("edits", e);
  }
  editBtn();
}
function textAt(x, y, el) {
  let n = null;
  try {
    if (document.caretRangeFromPoint) {
      const r = document.caretRangeFromPoint(x, y);
      n = r && r.startContainer;
    } else if (document.caretPositionFromPoint) {
      const q = document.caretPositionFromPoint(x, y);
      n = q && q.offsetNode;
    }
  } catch (e) {}
  if (n && n.nodeType === 3 && n.nodeValue.trim() && el.contains(n)) return n;
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let t;
  while ((t = w.nextNode())) if (t.nodeValue.trim()) return t;
  return null;
}
function editPlaces(k) {
  let c = 0;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) if (ekey(n.__dko ?? n.nodeValue) === k) c++;
  return c;
}
function openEditor(node) {
  const k = ekey(node.__dko ?? node.nodeValue),
    cur = EDITS[k] ?? k,
    edited = EDITS[k] != null,
    d = document.createElement("dialog");
  d.id = "dkEditDlg";
  d.innerHTML = `<form method="dialog" class="dked"><b>Edit this text</b><textarea rows="${Math.min(14, Math.max(3, Math.ceil(cur.length / 38)))}"></textarea>
    <p class="xs muted">Changes it everywhere it appears in the app, for every family${editPlaces(k) > 1 ? ` (${editPlaces(k)} places on this screen)` : ""}.</p>${edited ? `<details><summary class="xs">Original text</summary><p class="xs">${esc(k)}</p></details>` : ""}
    <div class="row" style="justify-content:flex-end;gap:8px;flex-wrap:wrap">${edited ? `<button value="reset" class="btn soft sm">Back to original</button>` : ""}<button value="cancel" class="btn line sm">Cancel</button><button value="save" class="btn accent sm">Save</button></div>
    <button value="all" class="link xs" style="justify-self:start">All my edits (${Object.keys(EDITS).length}) · download</button></form>`;
  d.querySelector("textarea").value = cur;
  document.body.appendChild(d);
  d.showModal();
  d.querySelector("textarea").focus();
  d.addEventListener("close", async () => {
    const v = d.returnValue,
      t = d.querySelector("textarea").value.trim();
    d.remove();
    if (v === "all") {
      saveDoc(
        JSON.stringify(
          Object.entries(EDITS).map(([k, t]) => ({ k, t })),
          null,
          1,
        ),
        "deepkids-text-edits.json",
      );
      return;
    }
    if (v !== "save" && v !== "reset") return;
    const del = v === "reset" || !t || t === k;
    if (del) delete EDITS[k];
    else EDITS[k] = t;
    editsCache();
    render();
    if (ui.sheet) renderSheet();
    try {
      if (del) await EDB.del(k);
      else await EDB.put(k, t);
      toast(del ? "Back to the original, for everyone" : "Saved for everyone");
    } catch (e) {
      toast("Saved on this device only: couldn't reach the database");
    }
  });
}
