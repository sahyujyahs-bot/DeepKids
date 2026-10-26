/* ---------- jokes & games ---------- */
function wordGame(u) {
  const x = u.c.x,
    word = x.words[dayNo % x.words.length],
    g = G(),
    won = g.g.includes(word),
    over = won || g.g.length >= 6,
    keys = {};
  g.g.forEach((w) =>
    [...w].forEach((ch, i) => {
      const c = ch === word[i] ? "hit" : word.includes(ch) ? "near" : "miss";
      if (keys[ch] !== "hit" && !(keys[ch] === "near" && c === "miss")) keys[ch] = c;
    }),
  );
  const rows = [...Array(6)]
    .map((_, r) => {
      const w = g.g[r] || (r === g.g.length && !over ? g.cur || "" : "");
      return `<div class="wrow">${[4]
        .map((i) => {
          const ch = w[i] || "";
          let c = ch ? "f" : "";
          if (g.g[r]) c = ch === word[i] ? "hit" : word.includes(ch) ? "near" : "miss";
          return `<span class="wt ${c}" style="animation-delay:${i * 0.07}s">${esc(ch)}</span>`;
        })
        .join("")}</div>`;
    })
    .join("");
  return `<p class="sm muted" style="text-align:center">A five-letter word from “${esc(u.title)}”. Green is the right place, yellow is in the word.</p><div class="wgrid">${rows}</div>${over ? `<p style="text-align:center;font:600 18px var(--display)">${won ? "You got it: " : "The word was "}${word}</p>` : `<div class="kb">${["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((r, i) => `<div>${i === 2 ? `<button class="w" data-act="wk" data-key="ENTER">Enter</button>` : ""}${[...r].map((c) => `<button class="${keys[c] || ""}" data-act="wk" data-key="${c}">${c}</button>`).join("")}${i === 2 ? `<button class="w" data-act="wk" data-key="DEL" aria-label="Delete">Del</button>` : ""}</div>`).join("")}</div>`}`;
}
function tfGame(u) {
  const g = G(),
    q = u.c.x.quiz,
    i = q.findIndex((_, k) => g.tf[k] === undefined),
    right = (k) => (g.tf[k] === 1) === q[k][1],
    sc = q.filter((_, k) => g.tf[k] !== undefined && right(k)).length;
  const dots = `<div class="dots">${q.map((_, k) => `<i class="${g.tf[k] === undefined ? (k === i ? "on" : "") : right(k) ? "ok" : "no"}"></i>`).join("")}</div>`;
  if (i < 0)
    return `${dots}<div class="score">${sc}/${q.length}</div><div class="col">${q.map((x) => `<div class="card" style="padding:14px"><span class="eyebrow">${x[1] ? "True" : "False"}</span><b style="font-weight:500">${esc(x[0])}</b><span class="sm muted">${esc(x[2])}</span></div>`).join("")}</div>`;
  const p = i > 0 ? q[i - 1] : null;
  return `${dots}${p ? `<p class="sm" style="text-align:center;color:${right(i - 1) ? "var(--good)" : "var(--bad)"}">${right(i - 1) ? "Right." : "Not quite."} ${esc(p[2])}</p>` : `<p class="sm muted" style="text-align:center">Some of these sound true and aren't.</p>`}<div class="tfq">${esc(q[i][0])}</div><div class="tfrow"><button class="btn yes" data-act="tf" data-i="${i}" data-v="1">True</button><button class="btn no" data-act="tf" data-i="${i}" data-v="0">False</button></div>`;
}
function oddGame(u) {
  const g = G(),
    o = u.c.x.odd[dayNo % u.c.x.odd.length];
  return `<p class="sm muted" style="text-align:center">Which one doesn't belong? There may be more than one good answer. Can you defend yours?</p><div class="oddgrid">${o[0].map((w) => `<button class="${g.odd ? (w === o[1] ? "right" : w === g.odd ? "wrong" : "") : ""}" data-act="odd" data-w="${esc(w)}" ${g.odd ? "disabled" : ""}>${esc(w)}</button>`).join("")}</div>${g.odd ? `<p style="text-align:center">${g.odd === o[1] ? "Yes. " : "We picked " + esc(o[1]) + ". "}${esc(o[2])}</p>` : ""}`;
}
function gamesViewV0() {
  const u = dailyUnit();
  document.getElementById("sheetTitle").textContent = "Jokes and games";
  if (!u) return `<p class="note">Games come from the science chapter you're on. Add EVS / Science to see them.</p>`;
  const T = { word: ["Word of the Day", wordGame], tf: ["True or False", tfGame], odd: ["Odd One Out", oddGame] };
  return `<div class="hs">${u.c.x.jokes
    .map((j, i) => {
      const [q, a] = splitJoke(j),
        k = today + i;
      return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke ${i + 1}</span><span class="q">${esc(q)}</span>${ui.jokes[k] ? `<span class="a">${esc(a)}</span>` : `<span class="tap">Tap for the answer</span>`}</button>`;
    })
    .join("")}</div>
   <div class="seg">${Object.entries(T)
     .map(([k, [n]]) => `<button aria-pressed="${ui.game === k}" data-act="gtab" data-g="${k}">${n}</button>`)
     .join("")}</div><section class="col">${T[ui.game][1](u)}</section>
   <button class="btn ${S.tl[today + "|warm"] ? "soft" : "accent"}" data-act="tlcheck" data-id="warm" data-date="${today}">${S.tl[today + "|warm"] ? "Warm-up done ✓" : "Warm-up done"}</button>`;
}
function gamesView() {
  const id = fxWarmUnit(today),
    I = id && DATA.units[id];
  if (!I || !I.jokes?.length) return gamesViewV0();
  const J = I.jokes,
    k0 = (Math.floor(parse(today) / 864e5) * 3) % J.length,
    pick = [0, 1, 2].map((i) => J[(k0 + i) % J.length]).filter((j, i, a) => a.indexOf(j) === i);
  const sg = Object.values(DATA.songs || {}).find(
    (x) => (x.units || []).includes(id) || x.topic_level === I.song?.topic_level,
  );
  const jokes = `<p class="xs muted">From today's lesson: ${esc(I.title)}</p><div class="hs">${pick
    .map((j, i) => {
      const k = today + "u" + i;
      return `<button class="joke" data-act="joke" data-j="${k}"><span class="eyebrow">Joke ${i + 1}</span><span class="q">${esc(j[0])}</span>${ui.jokes[k] ? `<span class="a">${esc(j[1])}</span>` : `<span class="tap">Tap for the answer</span>`}</button>`;
    })
    .join("")}</div>`;
  const song = sg
    ? `<section class="card">${fxSongHtml(sg)}</section>`
    : `<p class="xs muted">🎵 Song: ${esc(I.song?.title || "")} (being written)</p>`;
  const rest = dailyUnit() ? gamesViewV0().replace(/^<div class="hs">[\s\S]*?<\/button><\/div>/, "") : "";
  return jokes + song + rest;
}

/* ---------- settings ---------- */
function settingsView() {
  const grp = (id, t, sub, body, open) =>
    `<details class="card sgrp" ${open || ui.sopen === id ? "open" : ""}><summary><b>${t}</b><span class="xs muted">${sub}</span></summary><div class="sgbody">${body}</div></details>`;
  const R = S.rem || {},
    out = `${accountCard()}
  ${grp(
    "you",
    "You and your child",
    `${pname() ? esc(pname()) : "Your profile"} · ${esc(S.child || "child")}, ${S.age || ""}`,
    `<section class="card r-you tint"><div class="row" style="flex-wrap:nowrap;gap:12px">${youBlob("", "happy", 'width="48" height="48"')}<div><b style="font:600 17px var(--display)">${pname() ? esc(pname()) : "Your profile"}</b><p class="xs muted">${S.parent?.saved || S.parent?.name ? `Wakes ${clock(hm((S.alarm || {}).time || "06:30"))} · prep ${clock(hm(D().prepAt))} and ${clock(hm(D().eveAt))}` : "Not set up yet"}</p></div></div><button class="btn soft sm" data-act="parent" style="justify-self:start">Edit my profile</button></section>
    <div class="field"><label for="sName">Child's name</label><input class="inp" id="sName" maxlength="40" value="${esc(S.child)}"></div><div class="field"><label for="sStart">Plan starts on</label><input class="inp" id="sStart" type="date" value="${S.start}"></div><button class="btn sm" data-act="saveset" style="justify-self:start">Save</button>`,
  )}
  ${grp(
    "learn",
    "Syllabus and how you learn",
    `${S.board === "none" ? "DeepKids Plus" : S.board === "combined" ? "NCERT, Cambridge and NIOS" : BOARDS[S.board]} · ${esc(MODES[modeOf()][0])}`,
    `<span class="eyebrow">How you learn</span><select class="inp" id="sMode">${Object.entries(MODES)
      .map(([k, [n]]) => `<option value="${k}" ${modeOf() === k ? "selected" : ""}>${n}</option>`)
      .join(
        "",
      )}</select><p class="xs muted">${esc(MODES[modeOf()][1])}</p><label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="sExam" ${S.exam ? "checked" : ""}><span><b style="font:600 16px var(--display)">Exam track</b><br><span class="xs muted">Every syllabus chapter comes first, in a sensible order, so nothing is missed before exams.</span></span></label><button class="btn sm" data-act="saveset" style="justify-self:start">Save</button>
    <span class="eyebrow" style="margin-top:8px">Syllabus</span><p class="sm">${S.board === "none" ? "DeepKids Plus only" : S.board === "combined" ? "NCERT, Cambridge and NIOS" : BOARDS[S.board]}${S.plus && S.board !== "none" ? " + DeepKids Plus" : ""} · ${S.subjects.map((s) => SUBJ[s]).join(", ")}</p><button class="btn line sm" data-act="redo" style="justify-self:start">Change syllabus or subjects</button>`,
  )}
  ${grp("day", "Your day", `Lessons from ${clock(hm(D().start))} · lunch ${clock(hm(D().lunch))}`, plPart("day"))}
  ${grp("cal", "Calendar link", S.cal?.on ? "Google Calendar linked" : "Not linked", calendarCard())}
  ${grp("rem", "Reminders", R.time ? `Daily at ${clock(hm(R.time))}` : "Free-time nudges on Today", remView())}
  ${grp("data", "Your data", "Save a copy, or bring one in from another device", dataBox())}
  ${grp("sound", "Sound and reading aloud", `${soundOn ? "Sounds on" : "Sounds off"} · ${S.autoRead ? "reads each step aloud" : "read aloud on tap"}`, `<label class="zrow"><input type="checkbox" data-act="sndtoggle" ${soundOn ? "checked" : ""}><span><b class="sm">Sounds</b><br><span class="xs muted">Little chimes when things are done</span></span></label><label class="zrow"><input type="checkbox" data-act="autoread" ${S.autoRead ? "checked" : ""}><span><b class="sm">Read each lesson step aloud</b><br><span class="xs muted">Or tap 🔊 on any screen to hear it</span></span></label>`)}
  <p class="xs muted">${syncMode === "account" ? `Everything is saved privately to your claude.ai account${lastSaved ? " · last saved " + new Date(lastSaved).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""}. It follows you to any device where you're signed in.` : store ? "Couldn't reach your account just now. Saved on this device; it will retry." : "Saved in this browser only."}</p>`;
  document.getElementById("sheetTitle").textContent = "Settings";
  return out;
}

/* ---------- Week ---------- */

function lanes(date) {
  const items = dayPlan(date),
    d = D();
  if (!items.length) return `<p class="note">Nothing on the clock this day.</p>`;
  const t0 = Math.floor((Math.min(hm(d.prepAt), ...items.map((i) => i.at)) - 20) / 60) * 60,
    t1 = Math.ceil((Math.max(...items.map((i) => i.at + i.dur)) + 20) / 60) * 60,
    ppm = 1.2;
  const hrs = [];
  for (let h = t0; h < t1; h += 60)
    hrs.push(`<div class="hr" style="top:${(h - t0) * ppm}px">${clock(h).replace(":00", "")}</div>`);
  const b = (i) => {
    const lane =
      i.who === "you"
        ? "left:0;width:calc(50% - 3px)"
        : i.who === "kid"
          ? "right:0;width:calc(50% - 3px)"
          : "left:0;right:0";
    const col = i.kind === "lesson" ? SC(i.s) : "r-" + i.who;
    return `<div class="blk ${col} ${i.done ? "ok" : ""}" style="top:${(i.at - t0) * ppm + 1}px;height:${Math.max(20, i.dur * ppm - 3)}px;${lane}">${clock(i.at)} · ${esc(i.kind === "lesson" ? SUBJ[i.s] + ": " + i.u.title : i.title)}</div>`;
  };
  return `<div class="calhead"><span></span><span>${youBlob()}You</span><span>${kidBlob()}${esc(S.child || "Child")}</span></div><div class="cal" style="height:${(t1 - t0) * ppm}px">${hrs.join("")}<div class="lanes">${items.map(b).join("")}</div></div><p class="xs muted">Full-width blocks are things you do together.</p>`;
}
