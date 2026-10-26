/* ---------- lesson player ---------- */
function findItem(id) {
  return dayPlan(today).find((i) => i.id === id);
}
function playerView() {
  const P = ui.sheet,
    it = { u: unitBy(P.k), n: P.n, tot: P.tot, bonus: P.bonus };
  if (!it.u) return "";
  const st = stepState(it),
    pct = Math.min(100, (st.filter((x) => x.ok).length / st.length) * 100);
  document.getElementById("sheetTitle").textContent = `${chT(it.u)} · Part ${P.n} of ${P.tot}`;
  let h = `<div class="ptrack"><span style="width:${pct}%"></span>${sblob(P.s, "happy", "rider", `style="left:${Math.max(5, pct)}%"`)}</div>`;
  h += secBar(st, P.i);
  if (P.i >= st.length) {
    const okN = st.filter((x) => x.ok).length,
      all = okN === st.length;
    h += `<section class="stage finish">${sblob(P.s, all ? "happy" : "calm", "bob", 'width="120" height="120"')}<div class="stars">${[0, 1, 2].map((i) => `<svg width="44" height="44" viewBox="0 0 24 24" style="transform:rotate(${(i - 1) * 12}deg)"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="${i < Math.max(1, Math.round((okN / st.length) * 3)) ? "var(--sun)" : "var(--line)"}"/></svg>`).join("")}</div><h2>${all ? "Congrats!" : "Nearly there"}</h2><p class="muted">${esc(chT(it.u))} · ${all ? "every step done." : `${st.length - okN} step${st.length - okN > 1 ? "s" : ""} still open. They move to the next lesson day automatically.`}</p>${photoBtn(P.k, "Add a photo of today's work")}</section>`;
    return (
      h +
      `<details class="card hub"><summary><b>Want more? Everything for this chapter</b></summary><div class="hubb">${chapterHub(it.u)}</div></details><p class="sm muted" style="text-align:center">Looked through everything? Then finish today\'s lesson.</p><div class="row" style="justify-content:center"><button class="btn green" data-act="finish">${icon("check")}Finish the lesson</button><button class="btn soft" data-act="pstep" data-d="-1">Back</button></div>`
    );
  }
  const x = st[P.i];
  h += `<section class="stage"><div class="kind"><span class="k">${icon(x.kind === "step" ? "spark" : x.kind)}</span><span>${SECN[x.sec || "book"]} · step ${P.i + 1} of ${st.length}</span><button class="readbtn" data-act="readnow" aria-label="Read this step aloud">🔊 Read aloud</button></div><h2>${esc(x.title)}</h2>
   <div class="spent"><span class="xs muted">Take your time. Time on this step<br><button class="link xs" data-act="autoread">${S.autoRead ? "✓ Reading each step aloud" : "Read each step aloud as we go"}</button></span><b class="num" id="spent">${mmss(stepSecs())}</b></div>
   <div class="body">${x.html}</div>
   <div class="row"><button class="btn soft" data-act="pstep" data-d="-1" ${P.i === 0 ? "disabled" : ""} aria-label="Previous step">${icon("back")}</button><button class="btn green wide" data-act="pdone">${x.ok ? "Next" : "Done! Next step"}${icon("next")}</button></div></section>`;
  return h;
}
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.round(s % 60))).padStart(2, "0")}`;

const timerKey = () => (ui.sheet ? ui.sheet.k + "|" + ui.sheet.n + "|" + ui.sheet.i : "");
let tick = null;
function timerToggle() {
  const P = ui.sheet,
    it = { u: unitBy(P.k), n: P.n, tot: P.tot, bonus: P.bonus },
    x = stepState(it)[P.i];
  let T = ui.timer;
  if (!T || T.key !== timerKey()) T = ui.timer = { key: timerKey(), total: x.mins * 60, left: x.mins * 60, run: false };
  if (T.run) {
    T.left = Math.max(0, (T.end - Date.now()) / 1000);
    T.run = false;
    clearInterval(tick);
  } else {
    T.end = Date.now() + T.left * 1000;
    T.run = true;
    clearInterval(tick);
    tick = setInterval(paintTimer, 500);
  }
  paintTimer();
}
function paintTimer() {
  const T = ui.timer,
    tt = document.getElementById("tt"),
    r = document.getElementById("tring"),
    b = document.getElementById("tbtn");
  if (!T || !tt || T.key !== timerKey()) {
    clearInterval(tick);
    return;
  }
  const left = T.run ? Math.max(0, (T.end - Date.now()) / 1000) : T.left;
  tt.textContent = mmss(left);
  r.setAttribute("stroke-dasharray", `${(113 * left) / T.total} 113`);
  b.textContent = T.run ? "Pause" : "Start timer";
  if (T.run && left <= 0) {
    T.run = false;
    T.left = 0;
    clearInterval(tick);
    sfx("win");
    toast("Time's up for this step");
    b.textContent = "Done";
  }
}
