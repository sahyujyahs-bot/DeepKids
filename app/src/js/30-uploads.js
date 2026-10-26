/* ---------- uploads: drop everything in, DeepKids files it ---------- */
const UPK = ["worksheet", "drawing", "notebook", "experiment", "craft", "outing", "reading", "certificate", "other"];
async function shrink(f, max = 900) {
  try {
    const b = await createImageBitmap(f),
      s = Math.min(1, max / Math.max(b.width, b.height)),
      c = document.createElement("canvas");
    c.width = Math.round(b.width * s);
    c.height = Math.round(b.height * s);
    c.getContext("2d").drawImage(b, 0, 0, c.width, c.height);
    return await new Promise((r) => c.toBlob(r, "image/jpeg", 0.8));
  } catch (e) {
    return null;
  }
}
function upCands(date) {
  const near = new Set();
  S.log.forEach((l) => {
    if (l.date >= addDays(date, -3) && l.date <= addDays(date, 1)) near.add(l.key);
  });
  S.subjects.forEach((s) => {
    const nx = nextUp(s);
    if (nx) near.add(nx.u.k);
  });
  return [...near]
    .map(unitByK)
    .filter(Boolean)
    .map((u) => {
      const ls = S.log.filter((l) => l.key === u.k && l.date >= addDays(date, -3) && l.date <= addDays(date, 1));
      return { u, ls };
    })
    .sort((a, b) => b.ls.length - a.ls.length);
}
function upGuess(x) {
  const C = upCands(x.date),
    same = C.filter((c) => c.ls.some((l) => l.date === x.date));
  return same.length === 1
    ? same[0].u.k
    : C.filter((c) => c.ls.length).length === 1
      ? C.find((c) => c.ls.length).u.k
      : "";
}
async function upTag(items) {
  items.forEach((x) => {
    x.k = upGuess(x);
  });
  if (!SAMPLE) return;
  for (let i = 0; i < items.length; i += 4) {
    const B = items.slice(i, i + 4),
      imgs = [];
    const lines = [];
    for (const [j, x] of B.entries()) {
      const C = upCands(x.date);
      let im = null;
      if (IMGOK && x.type.startsWith("image/") && x._f) {
        im = await shrink(x._f);
        if (im) imgs.push(im);
      }
      lines.push(
        `Item ${j + 1}: file "${x.name}", dated ${fmt(x.date)}${im ? `, image ${imgs.length} attached` : " (no image; use the name and date)"}. Candidate chapters:\n${
          C.slice(0, 8)
            .map(
              (c) =>
                `  - ${c.u.k} = ${SUBJ[c.u.subj]}, ${chT(c.u)}${c.ls.length ? `; studied ${c.ls.map((l) => fmt(l.date) + (l.n ? " (Part " + l.n + (c.u.c?.p ? ": " + pkDay(c.u, l.n).title : "") + ")" : "")).join(", ")}` : "; the chapter in progress"}`,
            )
            .join("\n") || "  (none)"
        }`,
      );
    }
    const prompt = `You file a homeschooling family's photos and files (child ${S.age || ""} in India). For each item, pick the chapter it belongs to from that item's candidates, judged from what the image shows and the date. Use "" if none fits. Then say what it is.
${lines.join("\n")}
Return JSON only: {"items":[{"i":1,"k":"<candidate key or empty>","kind":"${UPK.join("|")}","title":"what it shows, 3 to 8 words","tags":["2 to 4 short topic words"]}]}`;
    try {
      const r = await SAMPLE.json(prompt, {
        modelTier: "default",
        cache: false,
        ...(imgs.length ? { images: imgs } : {}),
      });
      (r?.items || []).forEach((o) => {
        const x = B[(+o.i || 0) - 1];
        if (!x) return;
        const ok = new Set(upCands(x.date).map((c) => c.u.k));
        if (o.k && ok.has(o.k)) x.k = o.k;
        if (UPK.includes(o.kind)) x.kind = o.kind;
        if (o.title) x.title = String(o.title).slice(0, 70);
        if (Array.isArray(o.tags)) x.tags = o.tags.slice(0, 4).map((t) => String(t).slice(0, 24));
      });
    } catch (e) {}
  }
}
async function upFiles(files) {
  if (!ASSETS) {
    toast("Files can be saved when DeepKids is open in claude.ai.");
    return;
  }
  ui.up = { n: files.length, i: 0, fail: 0, step: "save" };
  render();
  const added = [];
  for (const f of files) {
    ui.up.i++;
    render();
    try {
      const r = await ASSETS.upload(f);
      const d = iso(f.lastModified || Date.now());
      added.push({
        id: r.id,
        name: f.name,
        type: f.type || "",
        date: d > today ? today : d,
        k: "",
        title: f.name.replace(/\.[^.]+$/, "").slice(0, 60),
        kind: "",
        tags: [],
        src: "up",
        at: Date.now(),
        _f: f,
      });
    } catch (e) {
      ui.up.fail++;
      ui.up.err = e?.code;
    }
  }
  if (added.length) {
    ui.up.step = "tag";
    render();
    await upTag(added);
  }
  added.forEach((x) => {
    delete x._f;
    x.title = x.title || x.name;
  });
  const fail = ui.up.fail,
    code = ui.up.err;
  S.work = [...(S.work || []), ...added];
  ui.up = null;
  if (added.length) {
    sfx("win");
    toast(
      `Filed ${added.length}${added.filter((x) => x.k).length < added.length ? ` · ${added.length - added.filter((x) => x.k).length} need a chapter` : ""}`,
    );
  }
  if (fail)
    toast(
      code === "too_large"
        ? `${fail} file${fail > 1 ? "s were" : " was"} too big (20 MB max)`
        : `${fail} couldn't be saved`,
    );
  commit();
}
const isImg = (w) => !w.type || w.type.startsWith("image/");
function upCard(w, i) {
  const u = w.k && unitByK(w.k),
    C = upCands(w.date);
  return `<div class="upc">${isImg(w) ? `<img src="/_blob/${esc(w.id)}" alt="${esc(w.title || "Upload")}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph',textContent:'Photo'}))">` : `<a class="ph" href="/_blob/${esc(w.id)}" target="_blank" rel="noopener">${esc((w.name || "file").split(".").pop().toUpperCase())}</a>`}
    <div class="col" style="gap:4px;min-width:0"><b class="sm">${esc(w.title || w.name || "Upload")}</b><span class="xs muted">${esc(fmt(w.date))}${w.kind ? " · " + esc(w.kind) : ""}${(w.tags || []).length ? " · " + w.tags.map(esc).join(", ") : ""}</span>
    <select class="inp" style="height:36px;font-size:13px" data-upk="${esc(w.id)}" aria-label="Chapter"><option value="">${u ? "" : "Which chapter? "}Not linked to a chapter</option>${[...new Map([...(u ? [[u.k, u]] : []), ...C.map((c) => [c.u.k, c.u])]).values()].map((x) => `<option value="${esc(x.k)}" ${x.k === w.k ? "selected" : ""}>${esc(SUBJ[x.subj])} · ${esc(chT(x))}</option>`).join("")}</select></div></div>`;
}
function uploadsView() {
  document.getElementById("sheetTitle").textContent = "Uploads";
  const U = (S.work || []).slice().sort((a, b) => ((b.date || "") < (a.date || "") ? -1 : 1)),
    P = ui.up;
  let h = `<label class="drop ${P ? "busy" : ""}">${blob("var(--leaf)", 5, "wow", "", 'width="48" height="48"')}<b>${P ? (P.step === "tag" ? "Reading and filing…" : `Saving ${P.i} of ${P.n}…`) : "Add photos and files"}</b><span class="xs muted">${P ? "Keep this open for a moment." : "Pick as many as you like: worksheets, drawings, notebook pages, experiments, outings. DeepKids matches each to the day and chapter. Nothing to fill in."}</span><input type="file" id="upFiles" multiple accept="image/*,application/pdf,video/*,.doc,.docx,.ppt,.pptx" hidden ${P ? "disabled" : ""}></label>
  ${ASSETS ? "" : `<p class="xs muted">Saving files works when DeepKids is open in claude.ai.</p>`}`;
  const need = U.filter((w) => !w.k);
  if (need.length)
    h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">Need a chapter</h3><span class="pill">${need.length}</span></div><p class="xs muted">Pick one, or leave it as a general memory.</p><div class="col" style="gap:8px">${need.map(upCard).join("")}</div></section>`;
  const by = {};
  U.filter((w) => w.k).forEach((w) => {
    const m = (w.date || "").slice(0, 7);
    (by[m] = by[m] || []).push(w);
  });
  Object.keys(by)
    .sort()
    .reverse()
    .forEach((m) => {
      h += `<section class="sec"><div class="sech"><h3 style="font-size:18px">${parse(m + "-01").toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3><span class="pill">${by[m].length}</span></div><div class="col" style="gap:8px">${by[m].map(upCard).join("")}</div></section>`;
    });
  if (!U.length) h += `<p class="note">Nothing uploaded yet.</p>`;
  return h;
}
