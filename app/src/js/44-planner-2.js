/* ---------- Planner ---------- */
const PV = { year: "Year", month: "Month", week: "Week", day: "Day" };
function firstDates() {
  const m = {};
  S.subjects.forEach((s) =>
    schedule(s, 400).forEach((x) => {
      if (!m[x.u.k]) m[x.u.k] = x.date;
    }),
  );
  S.log.forEach((l) => {
    if (!m[l.key] || l.date < m[l.key]) m[l.key] = l.date;
  });
  return m;
}
function yearOrbit() {
  const W = 360,
    c = 180,
    fd = firstDates(),
    st0 = parse([S.start, ...S.log.map((l) => l.date)].sort()[0] || today);
  const m0 = new Date(st0.getFullYear(), st0.getMonth(), 1);
  const ang = (ds) => {
    const d = parse(ds);
    return (
      (((d.getFullYear() - m0.getFullYear()) * 12 + d.getMonth() - m0.getMonth() + (d.getDate() - 1) / 31) / 12) *
        Math.PI *
        2 -
      Math.PI / 2
    );
  };
  const pt = (a, r) => [c + Math.cos(a) * r, c + Math.sin(a) * r];
  let o = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2,
      [x, y] = pt(a + Math.PI / 12, 166),
      [x1, y1] = pt(a, 52),
      [x2, y2] = pt(a, 156),
      md = new Date(m0.getFullYear(), m0.getMonth() + i, 1);
    o += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="2 5"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="11" font-weight="600" fill="var(--muted)">${md.toLocaleDateString(undefined, { month: "short" })}</text>`;
  }
  S.subjects.forEach((s, i) => {
    const r = 66 + i * 24;
    o += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="color-mix(in srgb,${SUBJ_BLOB[s][0]} 35%,transparent)" stroke-width="10"/>`;
    plannedUnits(s).forEach((u) => {
      const d = fd[u.k];
      if (!d) return;
      const a = ang(d);
      if (a > Math.PI * 1.5) return;
      const [x, y] = pt(a, r),
        cs = coverage(u),
        dn = rank[cs] >= 2,
        lr = cs === "learning";
      o += `<g class="${SC(s)} bead ${lr ? "pulse" : ""}" data-act="chapter" data-k="${u.k}" role="button" aria-label="${esc(u.title)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${lr ? 7.5 : 6}" fill="${dn || lr ? "var(--c)" : "var(--surface)"}" stroke="var(--c)" stroke-width="2.5"/>${dn ? `<path d="M${(x - 3).toFixed(1)} ${y.toFixed(1)}l2 2 4-4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>` : ""}</g>`;
    });
  });
  const [nx, ny] = pt(ang(today), 158);
  o += `<line x1="${c}" y1="${c}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="var(--tang)" stroke-width="2.5" stroke-linecap="round"/><circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="5" fill="var(--tang)"/>`;
  return `<div class="orbit"><svg viewBox="0 0 ${W} ${W}" role="img" aria-label="The year's plan as orbits">${o}${kidBlob("bob", "happy", `x="${c - 26}" y="${c - 26}" width="52" height="52"`)}</svg></div><div class="row" style="justify-content:center">${S.subjects.map((s) => `<span class="chip ${SC(s)}"><span class="dotc"></span>${SUBJ[s]}</span>`).join("")}<span class="chip"><span class="dotc" style="--c:var(--tang)"></span>Today</span></div><p class="xs muted" style="text-align:center">Each ring is a subject; each bead is a chapter, placed in the month it starts. Filled beads are done; the glowing one is in progress. Tap a bead to open it.</p>`;
}
function sessMap() {
  const by = {};
  S.subjects.forEach((s) =>
    schedule(s, 120).forEach((x) => (by[x.date] = by[x.date] || []).push({ s: x.subj, t: x.u.title })),
  );
  S.log.forEach((l) => {
    if (l.date <= today) (by[l.date] = by[l.date] || []).push({ s: l.subj, t: l.title, done: 1 });
  });
  return by;
}
function monthView() {
  const by = sessMap(),
    b = new Date(parse(today));
  b.setDate(1);
  b.setMonth(b.getMonth() + (ui.pm || 0));
  const m = b.getMonth(),
    start = new Date(b);
  start.setDate(1 - ((b.getDay() + 6) % 7));
  let rows = "";
  for (let w = 0; w < 6; w++) {
    let cells = "";
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7 + i);
      const ds = iso(d),
        inM = d.getMonth() === m,
        L = by[ds] || [],
        ev = eventsOn(ds).length;
      cells += `<button class="mday ${inM ? "" : "out"} ${ds === today ? "today" : ""}" data-act="pday" data-d="${ds}"><b>${d.getDate()}</b><span class="beads">${L.map((x) => `<i class="${SC(x.s)} ${x.done ? "ok" : ""}"></i>`).join("")}${ev ? `<i class="ev"></i>` : ""}</span></button>`;
    }
    rows += `<div class="mrow">${cells}</div>`;
    if (new Date(start.getFullYear(), start.getMonth(), start.getDate() + (w + 1) * 7).getMonth() !== m && w >= 3)
      break;
  }
  return `<div class="pager"><button class="iconbtn" data-act="pmon" data-d="-1" aria-label="Previous month">${icon("back")}</button><h3 style="font-size:20px">${b.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3><button class="iconbtn" data-act="pmon" data-d="1" aria-label="Next month">${icon("next")}</button></div><div class="mhead">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => `<span>${x}</span>`).join("")}</div><div class="month">${rows}</div><p class="xs muted">Each bead is a lesson in that subject's colour; a pink diamond is a class or outing. Tap a day to see it.</p>`;
}
function weekView() {
  const by = sessMap(),
    m = parse(monday());
  m.setDate(m.getDate() + 7 * (ui.week || 0));
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(m);
    d.setDate(m.getDate() + i);
    return iso(d);
  });
  return `<div class="pager"><button class="iconbtn" data-act="wk2" data-d="-1" aria-label="Previous week">${icon("back")}</button><h3 style="font-size:20px">${ui.week ? "Week of " + fmt(days[0]) : "This week"}</h3><button class="iconbtn" data-act="wk2" data-d="1" aria-label="Next week">${icon("next")}</button></div><div class="hs pebbles">${days
    .map((d, i) => {
      const L = by[d] || [],
        ev = eventsOn(d),
        td = todosOn(d).filter((x) => !x.done);
      return `<button class="pebble ${d === today ? "today" : ""}" style="--c:${PAL[i % PAL.length]}" data-act="pday" data-d="${d}"><span class="eyebrow">${DAYN[parse(d).getDay()]}</span><b>${parse(d).getDate()}</b>${L.map((x) => `<span class="pchip ${SC(x.s)} ${x.done ? "ok" : ""}">${esc(x.t)}</span>`).join("")}${ev.map((e) => `<span class="pchip r-out">${clock(hm(e.start))} ${esc(e.title)}</span>`).join("")}${td.map((x) => `<span class="pchip r-you">${esc(x.title)}</span>`).join("")}${!L.length && !ev.length && !td.length ? `<span class="xs muted">Free day</span>` : ""}</button>`;
    })
    .join("")}</div>`;
}
function dayView() {
  const d = ui.pday || today;
  return `<div class="pager"><button class="iconbtn" data-act="pdd" data-d="-1" aria-label="Previous day">${icon("back")}</button><h3 style="font-size:20px">${d === today ? "Today" : fmt(d)}</h3><button class="iconbtn" data-act="pdd" data-d="1" aria-label="Next day">${icon("next")}</button></div>${timeline(d)}`;
}
function askList() {
  const Q = [];
  if (!S.parent?.name) Q.push(["What should we call you?", "parent"]);
  if (!(S.events || []).some((e) => e.kind === "class" || e.kind === "online"))
    Q.push([
      `Does ${esc(S.child || "your child")} go to any classes or tuitions? Tell us the days and times.`,
      "say:Classes and tuitions: ",
    ]);
  if (!(S.alarm || {}).time) Q.push(["When do you usually wake up?", "parent"]);
  Q.push(["Any holidays, trips or family events coming up this month?", "say:Coming up this month: "]);
  if (boardsOn().includes("nios"))
    Q.push(["Are you planning to register for NIOS exams this year?", "say:About exams: "]);
  Q.push([`What does ${esc(S.child || "your child")} love doing these days?`, "say:These days they love: "]);
  return Q.slice(0, 3);
}
function dumpCard() {
  const D_ = ui.dump || {},
    n = (S.events || []).length + (S.todos || []).filter((t) => !t.done).length + (S.notes || []).length,
    empty = !D_.text && !D_.items && !D_.files?.length;
  return `<section class="card dump"><div class="row" style="flex-wrap:nowrap;gap:12px;align-items:center">${blob("var(--aqua)", 3, "wow", "", 'width="44" height="44"')}<div><h3 style="font-size:19px">Tell DeepKids anything</h3><p class="xs muted">Classes, trips, rest times, to-dos, things you own. Type, use your keyboard's mic, or send a photo.</p></div></div>
   ${D_.chat?.length || D_.items ? `<div class="chat">${D_.text ? `<div class="bub me">${esc(D_.text.split("\n")[0].slice(0, 200))}${D_.text.includes("\n") ? "…" : ""}</div>` : ""}</div>` : ""}
   ${D_.items ? `<div class="col" style="gap:8px"><span class="xs muted">Here's what we found. Untick anything that's wrong.</span>${D_.items.map((it, i) => `<div class="parsed ${it.keep ? "" : "off"}"><button class="ck ${it.keep ? "on" : ""}" data-act="dkeep" data-i="${i}" aria-label="Keep">${icon("check")}</button><div><b style="font:600 16px var(--display)">${esc(it.title)}</b><p class="xs muted">${esc(parsedLine(it))}</p></div><button class="pill" data-act="dwho" data-i="${i}">${it.type === "have" ? "We have it" : ROLE[it.who] || "For you"}</button></div>`).join("")}${dumpChat(D_)}<div class="row"><button class="btn green" data-act="dadd">${icon("check")}Add ${D_.items.filter((x) => x.keep).length} to my plan</button><button class="btn line sm" data-act="dclear">Clear</button></div></div>` : dumpChat(D_)}
   ${D_.err ? `<p class="sm" style="color:var(--bad)">${esc(D_.err)}</p>` : ""}
   ${needAICard(D_)}
   ${D_.files?.length ? `<div class="row" style="gap:6px"><span class="chip" style="pointer-events:none">${icon("plus")}${D_.files.length} photo${D_.files.length > 1 ? "s" : ""} attached</span><button class="link xs" data-act="dnofiles">Remove</button></div>` : ""}
   <div class="composer ${D_.busy ? "busy" : ""}">${IMGOK && SAMPLE ? `<label class="cbtn" aria-label="Add a photo or screenshot">📷<input type="file" id="dumpImg" accept="image/*" multiple hidden></label>` : lockBtn("photo", "cbtn", "📷")}<textarea class="inp" id="dumpText" rows="1" placeholder="${D_.items || D_.chat?.length ? "Add more…" : "Type or speak a plan…"}">${esc(D_.items ? "" : D_.text || "")}</textarea><button class="send" data-act="dump" aria-label="Sort it into my plan" ${D_.busy ? "disabled" : ""}>${D_.busy ? `<span class="dots"><i></i><i></i><i></i></span>` : icon("next")}</button></div>
   ${D_.busy ? `<p class="xs muted">Reading it and putting it on your plan…</p>` : ""}
   ${empty ? `<div class="dex">${DEX.map(([l, t]) => `<button class="chip" data-act="dex" data-t="${esc(t)}">${esc(l)}</button>`).join("")}</div>` : ""}
   ${SAMPLE ? "" : `<p class="xs muted">Read on this phone: classes, times, days, dates, rest and to-dos. Photos 📷 and longer messages are part of DeepKids Plus.</p>`}
   <div class="row dfoot"><button class="link sm" data-act="told">What you've told us · ${n}</button><button class="link sm" data-act="dhand" aria-expanded="${!!ui.dhand}">${ui.dhand ? "Hide add by hand" : "Add by hand"}</button></div>
   ${ui.dhand ? `<div class="handbox">${quickAdd(ui.pday || today)}</div>` : ""}</section>`;
}
function parsedLine(it) {
  if (it.type === "have") return "Library · " + (it.category || "other");
  if (it.type === "update") {
    const e = (S.events || []).find((z) => z.id === it.id);
    return (
      "Change" +
      (e ? ` “${e.title}”` : "") +
      ": " +
      [
        it.days?.length ? dayList(it.days) : "",
        it.start ? clock(hm(it.start)) + (it.end ? "–" + clock(hm(it.end)) : "") : "",
      ]
        .filter(Boolean)
        .join(" · ")
    );
  }
  const when = it.days && it.days.length ? dayList(it.days) : it.date ? fmt(it.date) : "Today";
  return [
    it.type === "tuition" ? "class" : it.type,
    when,
    it.start
      ? clock(hm(it.start)) + (it.end ? "–" + clock(hm(it.end)) : "")
      : it.type === "todo" || it.type === "note"
        ? ""
        : "time not set",
    it.note,
  ]
    .filter(Boolean)
    .join(" · ");
}
function viewPlannerV0() {
  const k = seg("week"),
    v = ui.pv || "week";
  initDrag();
  let h = pageHead("Plan") + segBar("week") + `</section>`;
  if (k === "tell") {
    const Q = askList();
    h +=
      `<section class="sec">${dumpCard()}</section>` +
      (Q.length ? plPart("asks") : "") +
      (ui.sheet?.mode === "told" ? "" : `<section class="sec">${toldView()}</section>`) +
      `<div id="paceSec">${dayTimesCard()}${subjCard()}${profCard()}${plPart("pace")}${rfCard()}</div>`;
  } else if (k === "cal")
    h += `<section class="sec"><div class="seg">${Object.entries(PV)
      .map(([kk, nm]) => `<button aria-pressed="${v === kk}" data-act="pv" data-v="${kk}">${nm}</button>`)
      .join("")}</div>${{ year: yearOrbit, month: monthView, week: weekView, day: dayView }[v]()}</section>`;
  else if (k === "todo") h += todoTab();
  else if (k === "queue")
    h +=
      combinedNote() +
      fxCoverageNote() +
      fxWeekList() +
      queuesView() +
      ((WT[ui.tq] ? ui.tq : "les") === "les"
        ? `<section class="sec"><button class="link" data-act="pacego" style="justify-self:start">Pace: hours, days and class for each subject → Tell DeepKids</button></section>`
        : "");
  else if (k === "pending") h += newView();
  else h += goingView();
  return h;
}
function viewPlannerV1() {
  if (seg("week") !== "refresh") return viewPlannerV0.apply(this, arguments);
  return pageHead("Plan") + segBar("week") + `</section><section class="sec">${fxRefHtml()}</section>`;
}
function viewPlanner() {
  const k = seg("week"),
    go = (x) => {
      const N = SEGS.week;
      SEGS.week = FXOLDW;
      ui.seg.week = x;
      const h = viewPlannerV1();
      ui.seg.week = k;
      SEGS.week = N;
      return h;
    },
    body = (h) => h.replace(/^[\s\S]*?<\/section>/, "");
  const head = pageHead("Plan") + segBar("week") + `</section>`;
  if (k === "cal") {
    ui.pv = ui.pv || "week";
    return (
      head +
      body(go("cal")) +
      `<details class="sec fxfold"><summary><b>Your to-dos and things to get ready</b></summary>${body(go("todo"))}</details>`
    );
  }
  if (k === "next") {
    const L = body(go("queue")),
      i = L.indexOf('<div class="seg qtypes"'),
      j = L.lastIndexOf("<section", i);
    return (
      head +
      (j > 0
        ? `<details class="sec fxfold"><summary><b>The year at a glance</b> <span class="xs muted">· on track? · this week\'s shopping</span></summary>${L.slice(0, j)}</details>` +
          L.slice(j)
        : L)
    );
  }
  if (k === "finish") {
    const a = body(go("ongoing")),
      b = body(go("pending"));
    const r = fxPractiseAll();
    return (
      head +
      `<h3 class="fxsh">Started</h3>${a}<h3 class="fxsh">Done, but parts left</h3>${b}<h3 class="fxsh">Practise again</h3>${r}`
    );
  }
  return head + body(go("tell"));
}
async function runDump() {
  const ta = document.getElementById("dumpText"),
    D_ = (ui.dump = ui.dump || {}),
    typed = (ta?.value || "").trim(),
    text = (
      D_.items && typed && D_.text && !D_.text.includes(typed) ? D_.text + "\n" + typed : typed || D_.text || ""
    ).trim();
  D_.text = text;
  if (!SAMPLE) {
    if (!text) {
      D_.err = "Type something first.";
      sfx("no");
      return render();
    }
    localDump(text);
    return;
  }
  if (!text && !D_.files?.length) {
    D_.err = "Type something or add a photo first.";
    sfx("no");
    return render();
  }
  D_.busy = true;
  D_.err = "";
  render();
  const prompt = `You are the planning helper inside DeepKids, a homeschool planner used by a parent in India. Today is ${new Date().toLocaleDateString("en-IN", { weekday: "long" })} ${today}. The child is ${S.child || "the child"}, age ${S.age}. The day's lessons start at ${D().start}; lunch is at ${D().lunch}.
Routines and classes already in the plan:
${routinesText()}
The parent wrote the message below${D_.files?.length ? " and attached photos (they may be WhatsApp screenshots, notes, timetables or receipts)" : ""}${D_.chat?.length ? ". It ends with their answers to your earlier questions" : ""}.
Pull out every class, tuition, online class, outing, rest or nap, meal, chore, to-do, exam, reminder, and every learning item the family owns (books, games, electronics, equipment, tools).
Rules:
- Anything that repeats ("every day", "weekdays", "on Mondays") is weekly, with "days" as numbers, 0 = Sunday to 6 = Saturday. "Every day" is [0,1,2,3,4,5,6]; "weekdays" is [1,2,3,4,5]. Never make a repeating thing a todo.
- Rest, naps, sleep and meals are type "rest" or "meal" with a start and end. A time given relative to something ("1 hour rest after tuition") gets real times worked out from that thing's end time, on the same days.
- Times are 24-hour HH:MM. "4pm-5pm" is 16:00–17:00. If only a length is given, set end from it.
- If an item is already in the list above, leave it out. If the message changes one (new time, new days), return {"type":"update","id":"<its id>", with the new fields}.
- "who" is "you" (the parent alone), "kid" (the child alone, parent free), or "both".
- Resolve dates like "tomorrow" or "next Friday" to YYYY-MM-DD.
- A "todo" is a one-off task with no fixed time. A "note" is only for facts that can't go on a calendar.
- Ask a question only when a needed time or day is really missing and can't be worked out. Never ask about something already in the list above. One short question per gap, at most 3.
- Never invent details.
Reply with only JSON: {"items":[{"type":"class|tuition|online|outing|rest|meal|chore|todo|exam|reminder|have|note|update","id":null,"title":"short title","who":"you|kid|both","date":null,"days":null,"start":null,"end":null,"note":"","category":"book|game|electronics|equipment|tool|other"}],"questions":["..."]}
Message:
"""${text.slice(0, 6000)}"""`;
  try {
    const opt = { modelTier: "default", cache: false };
    if (D_.files?.length) opt.images = D_.files;
    const r = await SAMPLE.json(prompt, opt);
    D_.items = (Array.isArray(r?.items) ? r.items : [])
      .filter((x) => x && (x.title || x.type === "update"))
      .map((x) => ({
        ...x,
        title: x.title || (S.events || []).find((e) => e.id === x.id)?.title || "Change",
        who: ["you", "kid", "both"].includes(x.who) ? x.who : x.type === "rest" ? "kid" : "you",
        keep: true,
      }))
      .map(fixItem);
    D_.questions = Array.isArray(r?.questions) ? r.questions.filter((q) => typeof q === "string").slice(0, 3) : [];
    if (D_.items.length) clearIn("dumpText");
    if (!D_.items.length && !D_.questions.length) D_.err = "We couldn't find plans in that. Try adding days and times.";
    sfx(D_.items.length ? "ok" : "no");
  } catch (e) {
    D_.err =
      {
        not_granted: "Claude wasn't allowed for this page, so we can't sort it. Use quick add below.",
        rate_limited: "Too many requests just now. Try again in a minute.",
        image_rejected: "That photo couldn't be read. Try a different one.",
        invalid_json: "We couldn't read the answer. Try again.",
        images_unavailable: "Photos can't be sent from this view. Type it instead.",
      }[e?.code] || "Something went wrong. Try again.";
    sfx("no");
  }
  D_.busy = false;
  render();
}
function addParsed() {
  clearIn("dumpText");
  const D_ = ui.dump;
  if (!D_?.items) return;
  let n = 0;
  const got = [];
  D_.items
    .filter((x) => x.keep)
    .forEach((x) => {
      n++;
      const id = Math.random().toString(36).slice(2, 9);
      got.push(x.title + " · " + parsedLine(x));
      if (x.type === "have") {
        S.inv = [...(S.inv || []), { id, name: x.title, cat: x.category || "other", note: x.note || "", from: "told" }];
        return;
      }
      if (x.type === "note") {
        S.notes = [...(S.notes || []), { id, text: x.title + (x.note ? ": " + x.note : ""), date: today }];
        return;
      }
      if (x.type === "update") {
        const e = (S.events || []).find((z) => z.id === x.id);
        if (e) {
          if (x.start) e.start = x.start;
          if (x.end) e.end = x.end;
          if (x.days?.length) {
            e.days = x.days;
            e.rep = "weekly";
            e.date = null;
          }
          if (x.date && !x.days?.length) {
            e.date = x.date;
          }
          if (x.title && x.title !== "Change") e.title = x.title;
        }
        return;
      }
      const kind =
          { class: "class", tuition: "class", online: "online", outing: "outing", rest: "rest", meal: "meal" }[
            x.type
          ] || "other",
        rep = x.days?.length ? "weekly" : "once";
      if (x.start || rep === "weekly" || kind !== "other") {
        const end = x.start ? (x.end && hm(x.end) > hm(x.start) ? x.end : clock24(hm(x.start) + 60)) : null;
        S.events = [
          ...(S.events || []),
          {
            id,
            title: x.title,
            kind,
            who: x.who,
            start: x.start || null,
            end,
            rep,
            date: rep === "weekly" ? null : x.date || today,
            days: x.days || [],
            from: today,
            note: x.note || "",
          },
        ];
      } else
        S.todos = [
          ...(S.todos || []),
          { id, title: x.title, who: x.who, date: x.date || today, note: x.note || "", done: false },
        ];
    });
  S.said = [
    ...(S.said || []),
    {
      id: Math.random().toString(36).slice(2, 9),
      at: Date.now(),
      date: today,
      text: (D_.text || "").slice(0, 2000),
      chat: D_.chat || [],
      added: got,
    },
  ].slice(-300);
  ui.dump = {};
  sfx("win");
  toast(`Added ${n} to your plan · see What you've told us`);
  commit();
}
const clock24 = (m) => String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
