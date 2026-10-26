/* ================= UI ================= */
const IC = {
  grid: '<rect x="4" y="4" width="7" height="7" rx="2.5"/><rect x="13" y="4" width="7" height="7" rx="2.5"/><rect x="4" y="13" width="7" height="7" rx="2.5"/><circle cx="16.5" cy="16.5" r="3.5"/>',
  today:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  week: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M16 14h.5"/>',
  library: '<path d="M4 4.5h4.5v15H4zM10 4.5h4.5v15H10zM16 5.5l3.8-1 3 14.2-3.8 1z" transform="translate(-1 0)"/>',
  tasks:
    '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="M3.5 6.5l1.6 1.6 2.7-2.9M3.5 12l1.6 1.6 2.7-2.9M3.5 17.5l1.6 1.6 2.7-2.9"/>',
  journey: '<path d="M3 20l6.5-11 4.5 7 2.5-3.5L21 20z"/><path d="M9.5 9V3.5l4 1.5-4 1.5"/>',
  read: '<path d="M3.5 5.5c0-.8.7-1.5 1.5-1.5h6v16H5a1.5 1.5 0 0 1-1.5-1.5zM20.5 5.5c0-.8-.7-1.5-1.5-1.5h-6v16h6c.8 0 1.5-.7 1.5-1.5z"/>',
  learn:
    '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  ws: '<path d="M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"/>',
  exp: '<path d="M9 3h6M10 3v6l-5.2 9.1A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.9L14 9V3M7.2 15h9.6"/>',
  act: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  game: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01" stroke-width="3"/>',
  proj: '<path d="M14 3.5l6.5 6.5-3 3L11 6.5zM11.5 7l-8 8 4 4 8-8"/>',
  prep: '<path d="M9 3.5h6v3H9zM7 5H5v16h14V5h-2M8.5 13l2.5 2.5 4.5-5"/>',
  event: '<path d="M5 21V4h11.5l-2.2 4 2.2 4H5"/>',
  warm: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01" stroke-width="2.2"/>',
  brk: '<path d="M5 9h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10.5h1.5a2 2 0 0 1 0 4H16M8.5 3.5v2.5M12 3.5v2.5"/>',
  exps: '<path d="M12 21v-8M12 13c0-4-3-6.5-7.5-6.5 0 4.2 3 6.5 7.5 6.5zM12 11c0-3.5 2.4-6.5 7-6.5 0 3.5-2.4 6.5-7 6.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.4"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  sound: '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM17 9.5l4.5 5M21.5 9.5L17 14.5"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  pause: '<path d="M9 5.5v13M15 5.5v13" stroke-width="2.4"/>',
  spark: '<path d="M12 3l2.2 6.3L20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.7z"/>',
};
const icon = (n, c = "") => `<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || IC.spark}</svg>`;
const KL = {
  read: "Read together",
  learn: "Learn & think",
  ws: "Worksheet",
  exp: "Experiment",
  act: "Activity",
  game: "Game",
  proj: "Project",
  step: "Step",
};
const ROLE = { you: "For you", both: "Together", kid: "Child goes", out: "Outing", free: "Break" };
const pillS = (s) => `<span class="pill ${s}">${STATUS[s]}</span>`;
const SC = (s) => "s-" + s;
const stepKey = (it) => (it.bonus ? "x" : "") + it.u.k + "|" + it.n;
const longDate = () => new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

/* step bodies used by the lesson player */
const taskLine = (u, id, text) => {
  if (WKID(id)) return workCtl(u, id, text);
  const d = taskDone(u.k, id);
  return `<button class="tline ${d ? "done" : ""}" data-act="task" data-k="${u.k}" data-id="${id}"><span class="ck">${icon("check")}</span><span>${esc(text)}</span></button>`;
};
function stepBody(u, name) {
  const c = u.c,
    x = c.x,
    k = KIND(name)[0],
    L = (a) => `<ul>${a.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  if (k === "read")
    return `<p>Read <b>${esc(u.book)}, ${chNo(u)}</b> together. Let your child read parts aloud.</p><div class="ask"><span class="eyebrow">Stop and ask</span>${esc(x.deep[0].q)}</div>`;
  if (k === "learn")
    return `${L(x.learn)}<button class="btn soft sm" data-act="chapter" data-k="${u.k}" data-t="questions">Open the big questions</button>`;
  if (k === "ws")
    return `<p>${x.wsd.length} sections and ${x.wsd.reduce((a, s) => a + s[1].length, 0)} questions: drawing, tables, sorting, matching and thinking.</p><div class="row"><button class="btn accent sm" data-act="ws" data-k="${u.k}">Open the worksheet</button></div><div class="tasks-inline">${taskLine(u, "ws", "Worksheet finished")}</div>`;
  if (k === "exp")
    return `<p class="sm muted">Tick each one when it's done.</p><div class="tasks-inline">${c.exp.map((e, i) => taskLine(u, "exp" + i, e)).join("")}</div>`;
  if (k === "act")
    return `<p class="sm muted">Tick each one when it's done.</p><div class="tasks-inline">${c.act.map((e, i) => taskLine(u, "act" + i, e)).join("")}</div>`;
  if (k === "game")
    return `<p><b>${esc(c.game[0])}.</b> ${esc(c.game[1])}</p><div class="tasks-inline">${taskLine(u, "game", "We played it")}</div>`;
  if (k === "proj")
    return `<p><b>${esc(c.proj[0])}.</b> ${esc(c.proj[1])}</p><p class="sm muted">You end up with: ${esc(c.proj[2])}.</p><div class="row"><button class="btn soft sm" data-act="startexp" data-title="${esc(c.proj[0])}" data-topic="${esc(u.title)}">Track as an ongoing project</button></div><div class="tasks-inline">${taskLine(u, "proj", "Project finished")}</div>`;
  return "";
}

/* kolam: one dot per thing in the day; a loop is drawn round each one done */
