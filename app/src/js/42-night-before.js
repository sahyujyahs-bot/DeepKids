/* ---------- night before ---------- */
function nightView() {
  const tm = tomorrow(),
    its = nightItems(),
    dn = its.filter((p) => S.prep[p.id]).length,
    tp = dayPlan(tm).filter((i) => i.kind !== "brk"),
    d = Dd(tm),
    al = S.alarm || { on: false, time: "06:30" };
  document.getElementById("sheetTitle").textContent = "Tomorrow · " + fmt(tm);
  return `<section class="card r-you tint"><div class="sech"><h3>Things to get ready</h3><span class="pill">${dn} of ${its.length}</span></div>${its.length ? `<div class="col" style="gap:0">${its.map((p) => `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Ready: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:800">${esc(p.task)}</b><p class="xs muted">${SUBJ[p.x.subj]} · ${esc(p.x.u.title)} · from ${esc(p.where)}</p></div></div>`).join("")}</div>` : `<p class="sm muted">Nothing to get ready tonight.</p>`}</section>
   <section class="card"><h3 style="font-size:19px">Tomorrow's plan</h3>${tp.length ? tp.map((i) => `<div class="row sm ${i.kind === "lesson" ? SC(i.s) : "r-" + i.who}" style="flex-wrap:nowrap;font-weight:700"><span class="dotc"></span><span class="muted num" style="min-width:64px">${i.anytime ? "Any time" : clock(i.at)}</span><span>${esc(i.kind === "lesson" ? SUBJ[i.s] + ": " + i.u.title : i.title)}</span></div>`).join("") : `<p class="sm muted">Nothing planned yet.</p>`}</section>
   <section class="card"><h3 style="font-size:19px">Your morning</h3><div class="fgrid"><div class="field"><label for="nWake">I'll wake up at</label><input class="inp" id="nWake" type="time" value="${al.time}" data-alarm="time"></div><div class="field"><label for="nStart">Start learning with ${esc(S.child || "my child")} at</label><input class="inp" id="nStart" type="time" value="${d.start}" data-over="${tm}"></div></div>
     <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="nAlarm" ${al.on ? "checked" : ""} data-alarm="on"><span><b style="font:600 16px var(--display)">Wake-up alarm</b><br><span class="xs muted">Rings only while DeepKids is open on this phone. For a sure wake-up, also set your phone's alarm for ${clock(hm(al.time))}.</span></span></label></section>
   <section class="card"><h3 style="font-size:19px">Any other plans tomorrow?</h3>${quickAdd(tm)}</section>
   <button class="btn green" data-act="nightdone">${icon("check")}${(S.night || {})[today] ? "Tomorrow is ready" : "All set for tomorrow"}</button>`;
}
function quickAdd(date) {
  const Q = ui.qdraft || {},
    w = ui.qwho || "you",
    r = ui.qrep || "once",
    kd = ui.qkind || "other",
    days = ui.qdays || [],
    todo = kd === "todo";
  return `<div class="col" style="gap:10px"><input class="inp" id="qa-t" maxlength="80" value="${esc(Q.t || "")}" placeholder="${kd === "class" ? "Science tuition, swimming, tabla" : kd === "rest" ? "Nap, lunch, quiet time" : kd === "outing" ? "Zoo trip, park, grandma's house" : todo ? "Buy chart paper, call the coach" : "Dentist, cousin's birthday"}">
   <div class="row chips">${QKIND.map(([k, n]) => `<button type="button" class="chip" aria-pressed="${kd === k}" data-act="qkind" data-k="${k}">${n}</button>`).join("")}</div>
   <div class="whos">${[
     ["you", "Mine"],
     ["kid", S.child ? esc(S.child) + "'s" : "Child's"],
     ["both", "Together"],
   ]
     .map(([k, n]) => `<button type="button" aria-pressed="${w === k}" data-act="qwho" data-w="${k}">${n}</button>`)
     .join("")}</div>
   ${todo ? "" : `<div class="row" style="align-items:center"><label class="sm">From <input class="inp" id="qa-s" type="time" value="${Q.s || ""}" style="width:auto"></label><label class="sm">to <input class="inp" id="qa-e" type="time" value="${Q.e || ""}" style="width:auto"></label></div>`}
   <div class="row chips">${Object.entries(QREP)
     .filter(([k]) => !todo || k === "once")
     .map(
       ([k, [n]]) =>
         `<button type="button" class="chip" aria-pressed="${r === k || (todo && k === "once")}" data-act="qrep" data-r="${k}">${n}</button>`,
     )
     .join("")}</div>
   ${!todo && r === "pick" ? `<div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button type="button" aria-pressed="${days.includes(d)}" data-act="qday" data-d="${d}">${DAYN[d]}</button>`).join("")}</div>` : ""}
   <label class="sm">${!todo && r !== "once" ? "Starting" : "On"} <input class="inp" id="qa-d" type="date" value="${Q.d || date}" style="width:auto"></label>
   <button class="btn sm" data-act="qaddq" style="justify-self:start">Add</button><p class="xs muted">${todo ? "A to-do shows on that day's list and in Plan → To do." : r === "once" ? "Leave the time empty for a to-do any time that day." : "Repeats every week on those days. Change or remove it any time under “What you've told us”."}</p></div>`;
}

/* ---------- parent profile ---------- */
function parentView() {
  const p = S.parent || {},
    al = S.alarm || { on: false, time: "06:30" },
    d = D();
  document.getElementById("sheetTitle").textContent = "About you";
  return `<section class="card r-you tint" style="text-align:center;justify-items:center">${youBlob("bob", "happy", 'width="90" height="90"')}<h2 style="font-size:24px">DeepKids is your planning partner</h2><p class="sm muted">It plans your mornings, evenings and the lessons in between. A few things about you help it plan better.</p></section>
   <section class="card"><div class="field"><label for="pName">What should we call you?</label><input class="inp" id="pName" maxlength="40" value="${esc(p.name || pname())}" placeholder="Your name"></div>
   <div class="fgrid"><div class="field"><label for="pWake">You usually wake up at</label><input class="inp" id="pWake" type="time" value="${al.time}"></div><div class="field"><label for="pPrep">Morning prep time</label><input class="inp" id="pPrep" type="time" value="${d.prepAt}"></div><div class="field"><label for="pStart">Learning starts at</label><input class="inp" id="pStart" type="time" value="${d.start}"></div><div class="field"><label for="pEve">Evening prep time</label><input class="inp" id="pEve" type="time" value="${d.eveAt}"></div></div>
   <label class="toggle" style="box-shadow:none;padding:0"><input type="checkbox" id="pAlarm" ${al.on ? "checked" : ""}><span><b style="font:600 16px var(--display)">Wake-up alarm</b><br><span class="xs muted">Rings only while the app is open on this phone.</span></span></label>
   <div class="field"><span>Subjects you'd like more help teaching</span><div class="whos">${S.subjects.map((s) => `<button type="button" aria-pressed="${ui.phelp ? ui.phelp.has(s) : (p.help || []).includes(s)}" data-act="phelp" data-s="${s}">${SUBJ[s]}</button>`).join("")}</div></div>
   <div class="field"><label for="pLang">Languages spoken at home</label><input class="inp" id="pLang" maxlength="80" value="${esc(p.langs || "")}" placeholder="Tamil, English"></div>
   <button class="btn" data-act="psave">Save</button></section>`;
}
