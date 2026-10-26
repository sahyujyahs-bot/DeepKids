/* ---------- classes and tuitions: no "done" before they start; cancel; a short check-in after ---------- */
function dedupeEv() {
  const seen = new Set(),
    E = S.events || [],
    F = E.filter((e) => {
      const k = [
        String(e.title || "").toLowerCase(),
        e.start,
        e.end,
        e.rep,
        (e.days || []).slice().sort().join(),
        e.date || "",
      ].join("|");
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  if (F.length !== E.length) S.events = F;
}
const evShort = (e) =>
  e.who === "kid"
    ? `${S.child || "Child"} ${e.kind === "rest" ? "rests" : "goes"}`
    : e.who === "both"
      ? "Together"
      : "You";
const evAsk = (e) => ["class", "online", "outing"].includes(e.kind) || /tuition|class|coaching|lesson/i.test(e.title);
function evGate(it, date) {
  const e = it.ev;
  if (!e || it.done) return false;
  if (date > today || (date === today && !it.anytime && nowMin() < it.at)) {
    openSheet({ mode: "evpre", date, id: e.id });
    return true;
  }
  if (evAsk(e)) {
    ui.evf = {};
    openSheet({ mode: "evdone", date, id: e.id });
    return true;
  }
  return false;
}
const evFind = (id) => [...(S.events || []), ...(S.cal?.ev || [])].find((e) => e.id === id);
function evpreView() {
  const { date, id } = ui.sheet,
    e = evFind(id);
  document.getElementById("sheetTitle").textContent = e ? e.title : "Plan";
  if (!e) return "";
  const day = date === today ? "today" : fmt(date);
  return `<div class="exdone">${kidBlob("mascot")}<h2 style="font-size:22px">${esc(e.title)}</h2><p>${e.start ? `Starts at <b>${clock(hm(e.start))}</b> ${esc(day)}.` : ""} You can mark it done once it has started.</p><div class="col" style="gap:10px;width:100%"><button class="btn line" data-act="evcancel" data-id="${esc(id)}" data-date="${date}">Cancel it for ${esc(day)}</button><button class="btn" data-act="texit">Keep it</button></div><p class="xs muted">Cancelling frees the time for lessons that day. You can undo it.</p></div>`;
}
const MOODS = [
  ["great", "Went well"],
  ["ok", "Okay"],
  ["hard", "Was hard"],
];
function evdoneView() {
  const { date, id } = ui.sheet,
    e = evFind(id),
    F = ui.evf || (ui.evf = {});
  document.getElementById("sheetTitle").textContent = e ? e.title : "Check-in";
  if (!e) return "";
  const kid = esc(S.child || "your child");
  return `<p class="sm muted">${esc(fmt(date))}${e.start ? " · " + clock(hm(e.start)) + (e.end ? "–" + clock(hm(e.end)) : "") : ""}. A few quick questions so DeepKids knows what happened. Skip any.</p>
  <div class="chat"><div class="bub cl">Did ${kid} go?</div><div class="row" style="gap:8px"><button class="chip" aria-pressed="${F.went !== false}" data-act="evf" data-k="went" data-v="1">Yes, went</button><button class="chip" aria-pressed="${F.went === false}" data-act="evf" data-k="went" data-v="0">Missed it</button></div>
  ${
    F.went === false
      ? `<div class="bub cl">What happened?</div><div class="qa"><input class="inp" id="evf-note" placeholder="Unwell, teacher on leave, holiday…" value="${esc(F.note || "")}"></div>`
      : `<div class="bub cl">What did they cover?</div><div class="qa"><textarea class="inp" id="evf-covered" rows="2" placeholder="e.g. Plants: parts of a flower, did a worksheet">${esc(F.covered || "")}</textarea></div>
  <div class="bub cl">How did it go?</div><div class="row" style="gap:8px">${MOODS.map(([k, l]) => `<button class="chip" aria-pressed="${F.mood === k}" data-act="evf" data-k="mood" data-v="${k}">${l}</button>`).join("")}</div>
  <div class="bub cl">Any homework?</div><div class="qa"><input class="inp" id="evf-hw" placeholder="Leave empty if none" value="${esc(F.hw || "")}"></div>
  <div class="bub cl">Anything the teacher said, or to follow up?</div><div class="qa"><input class="inp" id="evf-note" placeholder="Optional" value="${esc(F.note || "")}"></div>`
  }</div>
  <div class="row" style="gap:10px;margin-top:10px"><button class="btn green" data-act="evsave">Save</button><button class="link sm" data-act="evsave" data-quick="1">Just mark it done</button></div>`;
}
function evSave(quick) {
  const { date, id } = ui.sheet,
    e = evFind(id),
    F = ui.evf || {},
    v = (k) => (document.getElementById("evf-" + k)?.value || "").trim();
  if (!e) return;
  const rec = quick
    ? { went: true, at: Date.now() }
    : {
        went: F.went !== false,
        covered: v("covered"),
        mood: F.mood || "",
        hw: v("hw"),
        note: v("note"),
        at: Date.now(),
      };
  S.evlog = { ...(S.evlog || {}), [date + "|" + id]: rec };
  S.tl[date + "|e-" + id] = Date.now();
  if (rec.hw)
    S.todos = [
      ...(S.todos || []),
      {
        id: Math.random().toString(36).slice(2, 9),
        title: `${e.title} homework: ${rec.hw}`.slice(0, 120),
        who: "kid",
        date: addDays(date, 1),
        note: "From " + fmt(date),
        done: false,
      },
    ];
  ui.evf = null;
  sfx(rec.went ? "ok" : "flip");
  toast(rec.went ? (rec.hw ? "Saved · homework added for tomorrow" : "Saved") : "Marked as missed");
  goBack();
  commit();
}
function cancelNote(d) {
  const C = [...(S.events || []), ...(S.cal?.ev || [])].filter((e) => S.evoff?.[d + "|" + e.id]);
  return C.length
    ? `<p class="xs muted" style="margin:6px 0 0">Cancelled ${d === today ? "today" : "this day"}: ${C.map((e) => `${esc(e.title)} <button class="link xs" data-act="evundo" data-id="${esc(e.id)}" data-date="${d}">Undo</button>`).join(" · ")}</p>`
    : "";
}
function evLogLine(x) {
  const r = x.r;
  return `<li>${esc(x.title)}: ${r.went ? `${r.covered ? esc(r.covered) : "went"}${r.mood ? ` <span class="xs muted">(${esc(MOODS.find((m) => m[0] === r.mood)?.[1] || "")})</span>` : ""}${r.hw ? ` · homework: ${esc(r.hw)}` : ""}${r.note ? ` · ${esc(r.note)}` : ""}` : `missed${r.note ? " (" + esc(r.note) + ")" : ""}`}</li>`;
}
