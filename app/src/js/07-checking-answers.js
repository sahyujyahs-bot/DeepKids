/* ---------- Checking answers: force diagrams checked by the app (no AI); drawings and paper sheets checked by AI, on request ---------- */
const FDIR = { up: "↑", down: "↓", left: "←", right: "→" };
function forceSvg(obj, fs) {
  const L = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] },
    c = [150, 95];
  return `<svg viewBox="-20 -24 340 240" class="fdiag" role="img" aria-label="Force diagram of ${esc(obj)}"><rect x="115" y="70" width="70" height="50" rx="10" fill="var(--sunk)" stroke="var(--ink)" stroke-width="2.5"/><text x="150" y="100" text-anchor="middle" font-size="11" fill="var(--ink)">${esc(obj.length > 16 ? obj.slice(0, 15) + "…" : obj)}</text>
   ${fs
     .map((f, i) => {
       const [dx, dy] = L[f.dir] || [0, 0],
         n = fs.slice(0, i).filter((g) => g.dir === f.dir).length,
         o = (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 16,
         sx = c[0] + dx * (dy ? 0 : 35) + (dy ? o : 0),
         sy = c[1] + dy * (dx ? 0 : 25) + (dx ? o : 0),
         ex = sx + dx * 70,
         ey = sy + dy * 55;
       return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="var(--tang,#e0533d)" stroke-width="4" marker-end="url(#fa)"/><text x="${ex + dx * 6}" y="${ey + dy * 12 + (dx ? 4 : 0)}" text-anchor="${dx > 0 ? "start" : dx < 0 ? "end" : "middle"}" font-size="11" fill="var(--ink)">${esc(f.name)}</text>`;
     })
     .join("")}
   <defs><marker id="fa" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--tang,#e0533d)"/></marker></defs></svg>`;
}
function forcesCheck(it, fs) {
  const key = (f) => f.name + "|" + f.dir,
    want = new Set(it.a.map(key));
  const right = fs.filter((f) => want.has(key(f))),
    wrongDir = fs.filter((f) => !want.has(key(f)) && it.a.some((a) => a.name === f.name)),
    extra = fs.filter((f) => !it.a.some((a) => a.name === f.name)),
    missing = it.a.filter((a) => !fs.some((f) => f.name === a.name));
  return { ok: right.length === it.a.length && fs.length === it.a.length, right, wrongDir, extra, missing };
}

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset?.fsel) {
    ui.fsel = { ...(ui.fsel || {}), [t.dataset.fk + t.dataset.fid]: t.value };
    renderSheet();
  }
});
/* answer key text for the AI checker */
function keyText(it) {
  return it.t === "mcq"
    ? it.opts[it.a]
    : it.t === "fill"
      ? it.a.join(" / ")
      : it.t === "match"
        ? it.pairs.map((p) => p.join(" → ")).join("; ")
        : it.t === "forces"
          ? it.a.map((f) => f.name + " " + f.dir).join(", ")
          : it.t === "sort"
            ? "sorted into: " + it.cats.join(", ")
            : "open answer: judge the reasoning";
}
async function aiCheckPhoto(k, files) {
  if (!SAMPLE || !files.length) return;
  const [uk, wid] = k.split("#"),
    u = unitBy(uk),
    pw = u?.c?.p?.worksheets?.find((w) => w.id === wid);
  if (!pw) return;
  const qs = pw.sections
    .flatMap((s) => s[1])
    .map((it, i) => `${i + 1}. [${it.t}] ${it.p} — expected: ${keyText(it)}`)
    .join("\n");
  ui.aiws = { k, busy: true };
  renderSheet();
  try {
    const r = await SAMPLE.json(
      `You are checking a child's worksheet (age ${S.age || 8}, ${SUBJ[u.subj]}, "${pw.title}"). The photo shows the child's handwritten answers on the printed sheet. For each question below, read what the child wrote or drew and judge it kindly and honestly against the expected answer. Open questions have no single right answer: judge whether the reasoning makes sense. Return JSON {"results":[{"n":1,"verdict":"right"|"partly"|"not yet"|"can't read","note":"one short, warm sentence for the parent"}],"summary":"two sentences for the parent: what the child understands and one thing to talk about"}.\n\nQuestions:\n${qs}`,
      { images: files, purpose: "Check the photo of your child's worksheet against our answers." },
    );
    ui.aiws = { k, res: r };
  } catch (e) {
    ui.aiws = { k, err: e.code === "cancelled" ? "" : e.message || "Couldn't check just now." };
  }
  renderSheet();
}
async function aiCheckDraw(k, id) {
  if (!SAMPLE) return;
  const c = document.querySelector(`canvas[data-pad="${k}|${id}"]`);
  if (!c) return;
  const [uk, wid] = k.split("#"),
    u = unitBy(uk),
    pw = u?.c?.p?.worksheets?.find((w) => w.id === wid),
    [si, ii] = id.split("-").map(Number),
    it = pw?.sections?.[si]?.[1]?.[ii];
  const blob = await new Promise((r) => c.toBlob(r, "image/png"));
  ui.aires = { ...(ui.aires || {}), [k + id]: "Checking…" };
  renderSheet();
  try {
    const r = await SAMPLE.json(
      `A child (age ${S.age || 8}) drew this for the task: "${it?.p || "a drawing"}" in a lesson on "${u?.title || ""}". Say kindly and honestly whether the drawing shows the idea, what is right in it, and one thing to add or fix. Return JSON {"verdict":"shows it"|"partly"|"not yet","note":"two short warm sentences"}.`,
      { images: [blob], purpose: "Check your child's drawing." },
    );
    ui.aires[k + id] = `${r.verdict === "shows it" ? "✓" : r.verdict === "partly" ? "◐" : "…"} ${r.note || ""}`;
  } catch (e) {
    ui.aires[k + id] = e.code === "cancelled" ? "" : "Couldn't check just now.";
  }
  renderSheet();
}

document.addEventListener("change", (e) => {
  if (e.target.id === "wsPhoto") {
    aiCheckPhoto(e.target.dataset.k, [...e.target.files].slice(0, 4));
  }
});

/* ---------- Combined rows: a short badge, what they cover, and text that wraps on phones ---------- */
