/* What every tap does (onAct) and the event dialog */
function playItem(it, toExperiment) {
  // a DeepKids-track unit opens as the unit itself, where the family left off (or at its first experiment)
  if (it.u.board === "unit") return toExperiment ? fxOpenExperiment(it.u.c.unit) : fxOpen(it.u.c.unit);
  setTimeout(autoRead, 100);
  const st = stepState(it),
    exp = st.findIndex((x) => x.sec === "lab" && x.kind === "exp"),
    lab = exp >= 0 ? exp : st.findIndex((x) => x.sec === "lab");
  openSheet({
    mode: "player",
    s: it.s,
    k: it.u.k,
    n: it.n,
    tot: it.tot,
    bonus: it.bonus,
    i:
      toExperiment && lab >= 0
        ? lab
        : Math.max(
            0,
            st.findIndex((x) => !x.ok),
          ),
  });
}
// logging out: on the website it signs out of Google; in the app it forgets the log-in on this device. The family's
// plan stays with its account
function logOutNow() {
  sheet.close();
  if (window.DK_PLATFORM?.signOut) {
    writeNow()
      .catch(() => {})
      .then(() => window.DK_PLATFORM.signOut());
    return;
  }
  logout().then(() => {
    ui.saved = null;
    toast("Logged out");
  });
}
function onAct(e) {
  if (ob) {
    const d = ob.d,
      t = e.target.closest(
        "[data-ob],button[data-age],button[data-cls],button[data-b],button.choice[data-s],button[data-mode]",
      );
    if (!t) return;
    sfx("tap");
    if (t.dataset.ob === "next") return obNext();
    if (t.dataset.ob === "back") {
      ob.step--;
      return render();
    }
    if (t.dataset.age) {
      d.child = document.getElementById("obName").value;
      d.age = +t.dataset.age;
    }
    if (t.dataset.cls) {
      d.child = document.getElementById("obName").value;
      d.cls = +t.dataset.cls;
    }
    if (t.dataset.b) {
      const was = d.board;
      d.board = t.dataset.b;
      if (d.board === "none") d.plus = true;
      if (d.board === "waldorf") {
        d.mode = "books";
        d.subjects = ["wml", "hin", "wart", "sci"];
        d.days = { ...DEF_DAYS, ...(d.days || {}), hin: [1, 2, 3, 4, 5] };
      } else if (was === "waldorf") {
        d.subjects = ["math", "eng", "hin", "sci"];
        d.mode = "booksplus";
      } else d.subjects = d.subjects.filter((s) => !WFS.includes(s));
    }
    if (t.dataset.mode) d.mode = t.dataset.mode;
    if (t.dataset.s) {
      const s = t.dataset.s;
      d.subjects = d.subjects.includes(s)
        ? d.subjects.filter((x) => x !== s)
        : [...d.subjects, s].sort((a, b) => SUBJ_KEYS.indexOf(a) - SUBJ_KEYS.indexOf(b));
    }
    return render();
  }
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const a = b.dataset.act,
    k = b.dataset.k;
  ACT[a]?.(b, e, a, k);
}
/* What each button does, by its data-act name. The click handler above calls ACT[name](button, event, name, b.dataset.k). */
const ACT = {
  topen(b, e, a, k) {
    const id = b.dataset.id,
      cur = !!ui.open[id];
    ui.open[id] = !cur;
    sfx(cur ? "tap" : "flip");
    render();
  },
  play(b, e, a, k) {
    const it = findItem(b.dataset.id);
    if (it) {
      sfx("flip");
      playItem(it);
    }
  },
  pstep(b, e, a, k) {
    ui.sheet.i = Math.max(0, ui.sheet.i + +b.dataset.d);
    sfx("tap");
    renderSheet(true);
    autoRead();
  },
  readnow(b, e, a, k) {
    readNow();
  },
  autoread(b, e, a, k) {
    S.autoRead = !S.autoRead;
    save();
    toast(S.autoRead ? "Each step will be read aloud as you go." : "Steps won't be read automatically.");
    renderSheet();
  },
  pdone(b, e, a, k) {
    const P = ui.sheet,
      it = { u: unitBy(P.k), n: P.n, tot: P.tot, bonus: P.bonus },
      x = stepState(it)[P.i],
      key = stepKey(it),
      set = new Set(S.steps[key] || []);
    if (x) {
      const sec = Math.round(stepSecs());
      if (sec >= 3) {
        S.pace = (S.pace || [])
          .concat([
            {
              k: P.k,
              sec: x.sec || "book",
              kind: x.kind,
              est: Math.round(x.mins * 60),
              took: Math.round((sec / 60) * 10) / 10,
              date: today,
            },
          ])
          .slice(-3000);
        addMins(unitByK(String(P.k || "").replace(/^x/, ""))?.subj, sec);
      }
      stepT = null;
    }
    if (x && !x.ok) {
      set.add(sid(x));
      S.steps[key] = [...set];
      sfx("tick");
    } else sfx("tap");
    P.i++;
    S.updatedAt = Date.now();
    save();
    renderSheet(true);
    autoRead();
  },
  finish(b, e, a, k) {
    const P = ui.sheet,
      u = unitBy(P.k);
    if (!u) return;
    const it = { u, n: P.n, tot: P.tot, bonus: P.bonus },
      open = stepState(it).filter((x) => !x.ok);
    S.carry = S.carry || {};
    S.carry[u.k] =
      open.length && P.n < P.tot
        ? open.map((x) => ({
            kind: x.kind,
            label: x.label,
            title: x.title.replace(/^From last time: /, ""),
            mins: x.mins,
            name: x.name,
            forN: P.n + 1,
          }))
        : [];
    logSession(u, P.bonus ? "more" : "plan");
    ui.more[P.s] = false;
    sheet.close();
    sfx("win");
    confetti();
    toast(
      open.length && P.n < P.tot
        ? `Done. ${open.length} open step${open.length > 1 ? "s" : ""} moved to next time`
        : P.bonus
          ? "Extra lesson done"
          : "Lesson done. Well done!",
    );
    commit();
    scrollTo({ top: 0, behavior: "smooth" });
  },
  more(b, e, a, k) {
    const s = b.dataset.s;
    ui.more[s] = true;
    sfx("tick");
    _sess = null;
    const it = dayPlan(today).find((i) => i.kind === "lesson" && i.s === s && !i.done);
    render();
    if (it) playItem(it);
  },
  less(b, e, a, k) {
    ui.more[b.dataset.s] = false;
    sfx("flip");
    render();
  },
  skip(b, e, a, k) {
    S.skips[today + "|" + b.dataset.s] = true;
    sfx("flip");
    toast("Moved to the next lesson day");
    commit();
  },
  swap(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "swap", s: b.dataset.s });
  },
  lvq(b, e, a, k) {
    ui.lvq = lvqNew(b.dataset.s, S.levels[b.dataset.s] || 3);
    ui.lvqDone = null;
    sfx("flip");
    renderSheet(true);
  },
  lvqa(b, e, a, k) {
    if (b.dataset.v === "stop") ui.lvq = null;
    else {
      const lvl = lvqStep(ui.lvq, b.dataset.v === "1");
      if (lvl) {
        ui.lvqDone = { s: ui.lvq.s, lvl };
        ui.lvq = null;
      }
    }
    sfx("tap");
    renderSheet(true);
  },
  lvqset(b, e, a, k) {
    S.levels = { ...S.levels, [b.dataset.s]: +b.dataset.l };
    ui.lvqDone = null;
    _sess = null;
    sfx("ok");
    toast(`${SUBJ[b.dataset.s]} now plans from Class ${b.dataset.l}`);
    commit();
    renderSheet();
  },
  catchup(b, e, a, k) {
    const s = b.dataset.s,
      ks = b.dataset.ks.split("~");
    S.next = { ...(S.next || {}), [s]: [...ks, ...((S.next || {})[s] || []).filter((x) => !ks.includes(x))] };
    sfx("ok");
    toast(ks.length > 1 ? `${ks.length} topics moved to the front of ${SUBJ[s]}` : "That's up next");
    commit();
  },
  pin(b, e, a, k) {
    const s = b.dataset.s;
    S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
    sfx("ok");
    toast("That's up next");
    sheet.close();
    commit();
  },
  tday(b, e, a, k) {
    // the day changes in place: the day header stays where it was on the screen, only the list below it changes
    const d = b.dataset.d,
      top = document.querySelector(".calhead")?.getBoundingClientRect().top;
    ui.tday = d === "0" ? null : addDays(ui.tday || today, +d);
    if (ui.tday === today) ui.tday = null;
    sfx("tap");
    render();
    const el = document.querySelector(".calhead");
    if (el && top != null) scrollBy(0, el.getBoundingClientRect().top - top);
  },
  quickday(b, e, a, k) {
    navPush();
    ui.pday = b.dataset.d;
    ui.pv = "day";
    tab = "week";
    render();
    scrollTo(0, 0);
  },
  login(b, e, a, k) {
    const ph = (document.getElementById("lgPhone").value || "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, ""),
      nm = (document.getElementById("lgName").value || "").trim();
    if (
      ph.length !== 10 ||
      !/^[6-9]/.test(ph) ||
      /^(\d)\1{9}$/.test(ph) ||
      "01234567890".includes(ph) ||
      "98765432109".includes(ph)
    ) {
      ui.lgErr = "Enter a real 10-digit mobile number. Indian mobile numbers start with 6, 7, 8 or 9.";
      sfx("no");
      render();
      return;
    }
    ui.lgErr = "";
    ui.lgBusy = true;
    render();
    openAccount("91" + ph, nm).then(() => {
      ui.lgBusy = false;
      tab = "today";
      ui.tday = null;
      sfx("win");
      toast(S.setup ? "Welcome back" + (pname() ? ", " + pname() : "") + "!" : "Logged in. Let's set up your year.");
      render();
    });
  },
  loginas(b, e, a, k) {
    ui.lgBusy = true;
    openAccount(b.dataset.a).then(() => {
      ui.lgBusy = false;
      tab = "today";
      ui.tday = null;
      sfx("win");
      toast("Welcome back" + (pname() ? ", " + pname() : "") + "!");
      render();
    });
  },
  logout(b, e, a, k) {
    logOutNow();
  },
  delprofileno(b, e, a, k) {
    ui.delAsk = a === "delprofile";
    renderSheet();
  },
  delprofileyes(b, e, a, k) {
    ui.delAsk = false;
    deleteProfile().then(logOutNow);
  },
  checksaved(b, e, a, k) {
    if (!store) {
      ui.saved = { err: "This view isn't connected to your account, so data is only on this device." };
      renderSheet();
      return;
    }
    ui.savedBusy = true;
    renderSheet();
    store
      .get()
      .then((sn) => {
        ui.saved = sn.exists ? { v: sn.data(), at: Date.now() } : { err: "Nothing saved yet for this number." };
      })
      .catch(() => {
        ui.saved = { err: "Couldn't read the database just now. Try again." };
      })
      .finally(() => {
        ui.savedBusy = false;
        renderSheet();
      });
  },
  nowmore(b, e, a, k) {
    const k2 = "now|" + b.dataset.id;
    ui.open[k2] = !ui.open[k2];
    sfx("tap");
    render();
  },
  showdone(b, e, a, k) {
    ui.showDone = !ui.showDone;
    sfx("tap");
    render();
  },
  moresheet(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "more" });
  },
  plsheet(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "pl", p: b.dataset.p });
  },
  jrsheet(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "jr", p: b.dataset.p });
  },
  learn(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "learn" });
  },
  ppick(b, e, a, k) {
    S.planPick = { ...(S.planPick || {}), [k]: { full: b.dataset.o } };
    sfx("ok");
    toast("Plan chosen");
    commit();
  },
  tfind(b, e, a, k) {
    ui.libq = document.getElementById("tq")?.value || "";
    ui.terr = "";
    sfx("tap");
    render();
  },
  tsearch(b, e, a, k) {
    ui.libq = b.dataset.q;
    ui.lt = "topics";
    tab = "library";
    if (sheet.open) sheet.close();
    render();
    scrollTo(0, 0);
  },
  tgen(b, e, a, k) {
    sfx("tap");
    genTopic();
  },
  qsub(b, e, a, k) {
    ui.qs = b.dataset.s;
    sfx("tap");
    render();
  },
  shuffle(b, e, a, k) {
    const s = b.dataset.s;
    S.shuffle = { ...(S.shuffle || {}), [s]: !(S.shuffle || {})[s] };
    S.seed = { ...(S.seed || {}), [s]: Math.floor(Math.random() * 9999) };
    sfx("flip");
    commit();
  },
  reshuffle(b, e, a, k) {
    const s = b.dataset.s;
    S.seed = { ...(S.seed || {}), [s]: Math.floor(Math.random() * 9999) };
    sfx("flip");
    commit();
  },
  exam(b, e, a, k) {
    S.exam = !S.exam;
    sfx("tick");
    toast(S.exam ? "Exam track on: syllabus first" : "Exam track off");
    commit();
  },
  qnext(b, e, a, k) {
    const s = b.dataset.s;
    S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
    S.later = { ...(S.later || {}), [s]: ((S.later || {})[s] || []).filter((x) => x !== k) };
    sfx("ok");
    commit();
    toast(nextMsg(s, k), 5000);
    if (sheet.open) renderSheet();
  },
  qlater(b, e, a, k) {
    const s = b.dataset.s;
    S.later = { ...(S.later || {}), [s]: [...((S.later || {})[s] || []).filter((x) => x !== k), k] };
    S.next = { ...(S.next || {}), [s]: ((S.next || {})[s] || []).filter((x) => x !== k) };
    sfx("flip");
    toast("Moved to later");
    commit();
  },
  qrem(b, e, a, k) {
    const s = b.dataset.s;
    S.extra = { ...(S.extra || {}), [s]: ((S.extra || {})[s] || []).filter((x) => x !== k) };
    S.next = { ...(S.next || {}), [s]: ((S.next || {})[s] || []).filter((x) => x !== k) };
    sfx("flip");
    commit();
  },
  qadd(b, e, a, k) {
    ui.flash = k;
    setTimeout(() => {
      ui.flash = null;
    }, 2500);
    setTimeout(() => document.querySelector(".flash")?.scrollIntoView({ block: "center", behavior: "smooth" }), 120);
    const s = b.dataset.s;
    S.extra = { ...(S.extra || {}), [s]: [...new Set([...((S.extra || {})[s] || []), k])] };
    sfx("ok");
    commit();
    toast(`Added to the ${SUBJ[s]} queue as no. ${qPos(unitBy(k)) || "–"}. Find it in Plan → Lesson plan.`, 5000);
    if (sheet.open) renderSheet();
  },
  lt2(b, e, a, k) {
    ui.lt = "topics";
    tab = "library";
    render();
    scrollTo(0, 0);
  },
  quickplan(b, e, a, k) {
    tab = "week";
    render();
    scrollTo(0, 0);
  },
  free(b, e, a, k) {
    openPicker();
  },
  chapter(b, e, a, k) {
    sfx("flip");
    if (b.dataset.t) ui.ctab[k] = b.dataset.t;
    openSheet({ mode: "chapter", k });
  },
  ctab(b, e, a, k) {
    navPush();
    ui.ctab[k] = b.dataset.t;
    sfx("tap");
    renderSheet(true);
  },
  qi(b, e, a, k) {
    ui.qi[k] = Math.max(0, (ui.qi[k] || 0) + +b.dataset.d);
    sfx("flip");
    renderSheet(true);
  },
  ws(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "ws", k, w: b.dataset.w });
  },
  wsec(b, e, a, k) {
    ui.wsec[k] = Math.max(0, (ui.wsec[k] || 0) + +b.dataset.d);
    sfx("flip");
    renderSheet(true);
  },
  wsdone(b, e, a, k) {
    S.tasks[k] = S.tasks[k] || {};
    S.tasks[k].ws = S.tasks[k].ws || today;
    sfx("win");
    confetti();
    toast("Worksheet finished! Taking you back…", 1400);
    commit();
    setTimeout(() => {
      if (ui.sheet?.mode === "ws") goBack();
    }, 1400);
  },
  games(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "games" });
  },
  night(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "night" });
  },
  nightdone(b, e, a, k) {
    S.night = { ...(S.night || {}), [today]: 1 };
    sfx("win");
    toast("All set. Sleep well!");
    sheet.close();
    commit();
  },
  parent(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "parent" });
  },
  phelp(b, e, a, k) {
    ui.phelp = ui.phelp || new Set((S.parent || {}).help || []);
    ui.phelp.has(b.dataset.s) ? ui.phelp.delete(b.dataset.s) : ui.phelp.add(b.dataset.s);
    b.setAttribute("aria-pressed", ui.phelp.has(b.dataset.s));
    sfx("tap");
  },
  psave(b, e, a, k) {
    const g = (id) => document.getElementById(id).value;
    S.parent = {
      ...(S.parent || {}),
      name: g("pName").trim(),
      langs: g("pLang").trim(),
      help: [...(ui.phelp || new Set((S.parent || {}).help || []))],
      saved: Date.now(),
    };
    ui.phelp = null;
    S.alarm = { on: document.getElementById("pAlarm").checked, time: g("pWake") || "06:30" };
    S.day = {
      ...dayDefaults(),
      prepAt: g("pPrep") || dayDefaults().prepAt,
      start: g("pStart") || dayDefaults().start,
      eveAt: g("pEve") || dayDefaults().eveAt,
    };
    sfx("win");
    S.updatedAt = Date.now();
    sheet.close();
    render();
    saveNow().then((ok) =>
      toast(
        ok
          ? S.parent.name
            ? "Saved. Hi, " + S.parent.name + "!"
            : "Saved to your account"
          : store
            ? "Couldn't reach your account. Saved on this phone; it will retry."
            : "Saved",
      ),
    );
  },
  quick(b, e, a, k) {
    sfx("flip");
    ui.qaOpen = !ui.qaOpen;
    render();
    if (ui.qaOpen) setTimeout(() => document.getElementById("qa-t")?.focus(), 80);
  },
  qwho(b, e, a, k) {
    ui.qwho = b.dataset.w;
    b.parentElement.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    sfx("tap");
  },
  qaddq(b, e, a, k) {
    quickSave(b.closest(".addbox"));
  },
  qkind(b, e, a, k) {
    qaKeep(b);
    ui.qkind = b.dataset.k;
    ui.qrep = ui.qwho = null;
    ui.qdays = [];
    sfx("tap");
    render();
    if (sheet.open) renderSheet();
  },
  qrep(b, e, a, k) {
    qaKeep(b);
    ui.qrep = b.dataset.r;
    sfx("tap");
    render();
    if (sheet.open) renderSheet();
  },
  qday(b, e, a, k) {
    qaKeep(b);
    const d = +b.dataset.d,
      days = ui.qdays || [];
    ui.qdays = days.includes(d) ? days.filter((x) => x !== d) : [...days, d];
    sfx("tap");
    render();
    if (sheet.open) renderSheet();
  },
  todomove(b, e, a, k) {
    const x = (S.todos || []).find((z) => z.id === b.dataset.t);
    if (x) {
      x.date = tomorrow();
      sfx("flip");
      toast("Moved to tomorrow");
      commit();
    }
  },
  tododel(b, e, a, k) {
    S.todos = (S.todos || []).filter((z) => z.id !== b.dataset.t);
    sfx("flip");
    commit();
  },
  task(b, e, a, k) {
    const id = b.dataset.id;
    S.tasks[k] = S.tasks[k] || {};
    if (S.tasks[k][id]) {
      delete S.tasks[k][id];
      sfx("flip");
    } else {
      S.tasks[k][id] = today;
      sfx("ok");
    }
    commit();
  },
  startexp(b, e, a, k) {
    addExp(b.dataset.title, b.dataset.topic);
    sfx("ok");
    toast("Started. Tick it once a day under Daily check-ins.");
    commit();
  },
  status(b, e, a, k) {
    const p = S.progress[k] || { sessions: 0 };
    p.status = b.dataset.s;
    p.updated = today;
    S.progress[k] = p;
    sfx(b.dataset.s === "mastered" ? "win" : "tick");
    commit();
  },
  logk(b, e, a, k) {
    const u = unitBy(k);
    if (u) {
      logSession(u, "free");
      sfx("ok");
      toast("Logged for today");
      commit();
    }
  },
  tlcheck(b, e, a, k) {
    const date = b.dataset.date,
      it = dayPlan(date).find((i) => i.id === b.dataset.id);
    if (!it) return;
    if (it.kind === "event" && evGate(it, date)) return;
    if (["lesson", "warm", "refresh"].includes(it.kind) && !it.done) {
      openSheet({ mode: "iopts", date, id: it.id });
      return;
    }
    if (it.kind === "prep") {
      const all = it.prep.every((p) => S.prep[p.id]);
      it.prep.forEach((p) => {
        if (all) delete S.prep[p.id];
        else S.prep[p.id] = today;
      });
      sfx(all ? "flip" : "ok");
    } else if (it.kind === "exps") {
      S.exps
        .filter((x) => !x.closed && x.start <= date)
        .forEach((x) => {
          if (!x.checks.includes(today)) x.checks.push(today);
        });
      sfx("ok");
    } else if (it.kind === "lesson") {
      if (it.done) {
        toast("Already done today");
        return;
      }
      if (date !== today) {
        openSheet({ mode: "chapter", k: it.u.k });
        return;
      }
      return playItem(it);
    } else if (it.kind === "todo") {
      const x = it.td;
      if (x.done && x.doneOn === date) {
        x.done = false;
        delete x.doneOn;
        sfx("flip");
      } else {
        x.done = true;
        x.doneOn = date;
        sfx("ok");
      }
    } else {
      const key = date + "|" + it.id;
      if (S.tl[key]) delete S.tl[key];
      else {
        S.tl[key] = Date.now();
        sfx("ok");
      }
    }
    commit();
  },
  tlopen(b, e, a, k) {
    const date = b.dataset.date,
      it = dayPlan(date).find((i) => i.id === b.dataset.id);
    if (!it) return;
    sfx("tap");
    if (it.kind === "prep") return openSheet({ mode: "prep", date, when: it.id });
    if (it.kind === "lesson") return it.done ? openSheet({ mode: "chapter", k: it.u.k }) : playItem(it);
    if (it.kind === "warm") return openSheet({ mode: "games" });
  },
  prep(b, e, a, k) {
    const id = b.dataset.id;
    if (S.prep[id]) delete S.prep[id];
    else {
      S.prep[id] = today;
      sfx("tick");
    }
    commit();
  },
  delev(b, e, a, k) {
    S.events = (S.events || []).filter((x) => x.id !== b.dataset.e);
    sfx("flip");
    commit();
  },
  pv(b, e, a, k) {
    ui.pv = b.dataset.v;
    sfx("tap");
    render();
  },
  pday(b, e, a, k) {
    ui.pday = b.dataset.d;
    ui.pv = "day";
    sfx("tap");
    render();
  },
  pdd(b, e, a, k) {
    ui.pday = addDays(ui.pday || today, +b.dataset.d);
    sfx("tap");
    render();
  },
  pmon(b, e, a, k) {
    ui.pm = (ui.pm || 0) + +b.dataset.d;
    sfx("tap");
    render();
  },
  wk2(b, e, a, k) {
    ui.week = (ui.week || 0) + +b.dataset.d;
    sfx("tap");
    render();
  },
  dump(b, e, a, k) {
    sfx("tap");
    runDump();
  },
  dkeep(b, e, a, k) {
    const it = ui.dump.items[+b.dataset.i];
    it.keep = !it.keep;
    sfx("tap");
    render();
  },
  dwho(b, e, a, k) {
    const it = ui.dump.items[+b.dataset.i];
    if (it.type !== "have") {
      it.who = { you: "kid", kid: "both", both: "you" }[it.who] || "you";
      sfx("tap");
      render();
    }
  },
  dadd(b, e, a, k) {
    addParsed();
  },
  dclear(b, e, a, k) {
    ui.dump = {};
    render();
  },
  askq(b, e, a, k) {
    const v = b.dataset.a;
    if (v === "parent") return openSheet({ mode: "parent" });
    if (sheet.open) sheet.close();
    const ta = document.getElementById("dumpText");
    if (ta) {
      ta.value = (ta.value ? ta.value + "\n" : "") + v.slice(4);
      ta.focus();
      ta.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },
  jsub(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "jsub", s: b.dataset.s });
  },
  jopen(b, e, a, k) {
    ui.jopen = ui.jopen === k ? null : k;
    sfx("tap");
    renderSheet();
  },
  rt(b, e, a, k) {
    ui.rt = b.dataset.t;
    ui.rmore = 40;
    sfx("tap");
    render();
  },
  rsj(b, e, a, k) {
    ui.rsj = b.dataset.v;
    ui.rc = "";
    ui.rt = "all";
    ui.rmore = 40;
    sfx("tap");
    render();
  },
  rfit(b, e, a, k) {
    ui.rfit = ui.rfit === false;
    sfx("tap");
    render();
  },
  rmore(b, e, a, k) {
    ui.rmore = (ui.rmore || 40) + 40;
    render();
  },
  rtc(b, e, a, k) {
    ui.rtc = b.dataset.t;
    sfx("tap");
    renderSheet();
  },
  btrack(b, e, a, k) {
    navPush();
    ui.btrack = b.dataset.v;
    ui.bs = null;
    ui.bl = null;
    sfx("tap");
    render();
  },
  bb(b, e, a, k) {
    navPush();
    ui.bb = b.dataset.b;
    ui.bs = null;
    ui.bl = null;
    sfx("tap");
    render();
  },
  bs(b, e, a, k) {
    ui.bs = b.dataset.s;
    ui.bl = null;
    sfx("tap");
    render();
  },
  bl(b, e, a, k) {
    ui.bl = +b.dataset.l;
    sfx("tap");
    render();
  },
  isort(b, e, a, k) {
    sfx("tap");
    runInvSort();
  },
  ikeep(b, e, a, k) {
    const it = ui.idump.items[+b.dataset.i];
    it.keep = !it.keep;
    sfx("tap");
    render();
  },
  iclear(b, e, a, k) {
    ui.idump = {};
    clearIn("invText");
    render();
  },
  iadd(b, e, a, k) {
    const L = (ui.idump?.items || []).filter((x) => x.keep);
    S.inv = [...(S.inv || []), ...L.map(({ keep, ...x }) => ({ id: newId(), ...x, from: "sorted" }))];
    ui.idump = {};
    clearIn("invText");
    sfx("win");
    toast(`Added ${L.length} to what you have`);
    commit();
  },
  hubres(b, e, a, k) {
    ui.hubres = true;
    renderSheet();
  },
  refresh(b, e, a, k) {
    sfx("flip");
    const date = b.dataset.date || today;
    // today's refresher is built first (a DeepKids unit's questions are loaded), then it opens with its first question
    if (date === today) rfBuild(date).then(() => openSheet({ mode: "refresh", date }));
    else openSheet({ mode: "refresh", date });
  },
  pjump(b, e, a, k) {
    ui.sheet.i = Math.max(0, +b.dataset.i);
    sfx("tap");
    renderSheet(true);
    autoRead();
  },
  wkst(b, e, a, k) {
    const id = b.dataset.id,
      to = b.dataset.to,
      key = k + "|" + id,
      W = weekSt(),
      w = W[key] || {};
    w.title = b.dataset.t || w.title;
    const untask = () => {
      if (S.tasks[k]) delete S.tasks[k][id];
    };
    if (to === "none" || (to === "undo" && !w.started)) {
      const q = w.q;
      delete W[key];
      if (q) W[key] = { q: true, planned: w.planned, title: w.title };
      untask();
      sfx("flip");
    } else if (to === "undo") {
      w.st = "started";
      delete w.done;
      delete w.doneAt;
      untask();
      W[key] = w;
      sfx("flip");
    } else {
      w.st = to;
      w[to] = w[to] || today;
      w[to + "At"] = w[to + "At"] || Date.now();
      if (to === "done") {
        w.started = w.started || today;
        S.tasks[k] = S.tasks[k] || {};
        S.tasks[k][id] = w.done;
        sfx("win");
        toast("Finished · saved to your Work folder");
      } else {
        untask();
        sfx("ok");
        toast(
          to === "planned"
            ? "Added to your pipeline · see To finish"
            : to === "skip"
              ? "Okay, not doing this one"
              : "Marked started · finish it any time",
        );
      }
      W[key] = w;
    }
    commit();
  },
  qz(b, e, a, k) {
    S.quiz = S.quiz || {};
    const q = (S.quiz[k + "|" + b.dataset.n] = S.quiz[k + "|" + b.dataset.n] || {});
    q[b.dataset.i] = { q: b.dataset.q, a: b.dataset.a, r: +b.dataset.r, d: today };
    sfx(+b.dataset.r ? "ok" : "tap");
    commit();
  },
  folder(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "folder" });
  },
  fsave(b, e, a, k) {
    folderSave();
  },
  fprint(b, e, a, k) {
    folderPrint();
  },
  qsend(b, e, a, k) {
    qSend();
  },
  gcsync(b, e, a, k) {
    gcSync(true);
  },
  gcoff(b, e, a, k) {
    S.cal = { on: false };
    sfx("flip");
    toast("Calendar unlinked");
    commit();
  },
  gccal(b, e, a, k) {
    const c = S.cal || {},
      id = b.dataset.id,
      set = new Set(c.cals || []);
    set.has(id) ? set.delete(id) : set.add(id);
    S.cal = { ...c, cals: [...set] };
    gcSync(true);
  },
  uploads(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "uploads" });
  },
  track(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "track" });
  },
  school(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "school" });
  },
  tp(b, e, a, k) {
    ui.tp = b.dataset.v;
    ui.tpo = 0;
    sfx("tap");
    render();
  },
  tpo(b, e, a, k) {
    ui.tpo = Math.min(0, (ui.tpo || 0) + +b.dataset.d);
    sfx("tap");
    render();
  },
  tsave(b, e, a, k) {
    saveDoc(transcriptDoc(), `${(S.child || "Student").replace(/[^\w ]/g, "")} transcript ${today}.html`);
  },
  tprint(b, e, a, k) {
    printDoc(transcriptDoc());
  },
  told(b, e, a, k) {
    sfx("flip");
    ui.ted = "";
    if (tab === "week" && seg("week") === "cal" && !sheet.open) {
      render();
      document
        .querySelector('#main [data-act="ted"]')
        ?.closest("section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    openSheet({ mode: "told" });
    render();
  },
  ted(b, e, a, k) {
    ui.ted = b.dataset.id;
    if (!b.dataset.id) {
      sfx("ok");
      commit();
    } else render();
  },
  evday(b, e, a, k) {
    const ev = (S.events || []).find((x) => x.id === b.dataset.id);
    if (ev) {
      const d = +b.dataset.d,
        set = new Set(ev.rep === "weekly" ? ev.days : []);
      set.has(d) ? set.delete(d) : set.add(d);
      if (set.size) {
        ev.days = [...set];
        ev.rep = "weekly";
        ev.date = null;
      } else {
        ev.rep = "once";
        ev.days = [];
        ev.date = ev.date || today;
      }
      sfx("tap");
      commit();
    }
  },
  evwho(b, e, a, k) {
    const ev = (S.events || []).find((x) => x.id === b.dataset.id);
    if (ev) {
      ev.who = b.dataset.w;
      sfx("tap");
      commit();
    }
  },
  evdel(b, e, a, k) {
    S.events = (S.events || []).filter((x) => x.id !== b.dataset.id);
    ui.ted = "";
    sfx("flip");
    toast("Removed");
    commit();
  },
  tddel(b, e, a, k) {
    S.todos = (S.todos || []).filter((x) => x.id !== b.dataset.id);
    sfx("flip");
    commit();
  },
  notedel(b, e, a, k) {
    S.notes = (S.notes || []).filter((x) => x.id !== b.dataset.id);
    sfx("flip");
    commit();
  },
  tsub(b, e, a, k) {
    const T = tSetup(),
      s = b.dataset.s,
      o = new Set(T.off || []);
    o.has(s) ? o.delete(s) : o.add(s);
    T.off = [...o];
    sfx("tap");
    commit();
  },
  tmake(b, e, a, k) {
    const t = curTest();
    if (
      t &&
      Object.keys(t.ans).length &&
      !tDone(t) &&
      !confirm("Start a new paper? The unfinished test will be kept but not continued.")
    )
      return;
    ui.zs = null;
    makeTest();
  },
  tstart(b, e, a, k) {
    ui.ex = null;
    sfx("flip");
    openSheet({ mode: "exam" });
  },
  tgo(b, e, a, k) {
    const t = curTest(),
      X = t.subjects[ui.ex.si];
    t.start = t.start || {};
    t.start[X.s] = t.start[X.s] || Date.now();
    ui.ex.qi = 0;
    sfx("tap");
    commit();
  },
  tans(b, e, a, k) {
    const t = curTest(),
      X = t.subjects[ui.ex.si];
    if (t.done?.[X.s]) return;
    t.ans[X.s + "|" + ui.ex.qi] = +b.dataset.i;
    sfx("tap");
    commit();
  },
  tmove(b, e, a, k) {
    const t = curTest(),
      n = t.subjects[ui.ex.si].qs.length;
    ui.ex.qi = Math.max(0, Math.min(n - 1, ui.ex.qi + +b.dataset.d));
    sfx("flip");
    render();
    document.getElementById("sheetBody")?.scrollTo?.(0, 0);
  },
  tjump(b, e, a, k) {
    ui.ex.qi = +b.dataset.i;
    sfx("tap");
    render();
  },
  tfin(b, e, a, k) {
    const t = curTest(),
      X = t.subjects[ui.ex.si];
    t.done = t.done || {};
    t.done[X.s] = Date.now();
    ui.ex = { si: t.subjects.findIndex((x) => !t.done[x.s]), qi: -1 };
    ui.zs = null;
    sfx("win");
    if (ui.ex.si < 0) confetti();
    commit();
  },
  texit(b, e, a, k) {
    goBack();
  },
  tdl(b, e, a, k) {
    tdlDoc(b.dataset.d);
  },
  zall(b, e, a, k) {
    const Z = zipSel(),
      g = b.dataset.g;
    if (b.dataset.v === "1") {
      if (g === "ws") folderData().forEach((c) => c.ws.forEach((w) => Z.ws.add(w.k)));
      else (S.work || []).forEach((w) => Z.up.add(w.id));
    } else Z[g].clear();
    ui.zip = null;
    render();
  },
  zmake(b, e, a, k) {
    zipBuild();
  },
  zsave(b, e, a, k) {
    zipSave();
  },
  zshare(b, e, a, k) {
    zipShare();
  },
  evcancel(b, e, a, k) {
    const dk = b.dataset.date + "|" + b.dataset.id;
    S.evoff = { ...(S.evoff || {}), [dk]: Date.now() };
    sfx("flip");
    toast("Cancelled · undo it under the day's date");
    if (ui.sheet?.mode === "evpre") goBack();
    commit();
  },
  evundo(b, e, a, k) {
    const o = { ...(S.evoff || {}) };
    delete o[b.dataset.date + "|" + b.dataset.id];
    S.evoff = o;
    sfx("tap");
    commit();
  },
  evf(b, e, a, k) {
    const F = (ui.evf = ui.evf || {});
    ["covered", "hw", "note"].forEach((k) => {
      const el = document.getElementById("evf-" + k);
      if (el) F[k] = el.value;
    });
    F[b.dataset.k] = b.dataset.k === "went" ? b.dataset.v === "1" : b.dataset.v;
    sfx("tap");
    render();
  },
  lifeadd(b, e, a, k) {
    ui.lf = { kind: "did" };
    openSheet({ mode: "lifeadd" });
  },
  lifekind(b, e, a, k) {
    ui.lf = {
      ...ui.lf,
      kind: b.dataset.k,
      title: document.getElementById("lfTitle")?.value,
      text: document.getElementById("lfText")?.value,
    };
    renderSheet();
  },
  lifesave(b, e, a, k) {
    lifeSave();
  },
  lifeopen(b, e, a, k) {
    openSheet({ mode: "moment", id: b.dataset.id });
  },
  intq(b, e, a, k) {
    const x = intSt().find((y) => y.id === b.dataset.id),
      L = x.links.filter((l) => !x.queued.includes(l.k) && lifeTarget(l.k).u);
    L.forEach((l) => qPut("les", lifeTarget(l.k).u.subj, "les:" + lifeTarget(l.k).u.k, "end"));
    x.queued = [...x.queued, ...L.map((l) => l.k)];
    sfx("ok");
    toast(L.length === 1 ? "Added to the queue" : `${L.length} topics added to the queue`);
    commit();
  },
  intx(b, e, a, k) {
    S.interests = intSt().filter((y) => y.id !== b.dataset.id);
    commit();
  },
  lifeq(b, e, a, k) {
    lifeQueue(b.dataset.id);
  },
  lifex(b, e, a, k) {
    const m = lifeBy(b.dataset.id);
    if (m) m.links.splice(+b.dataset.i, 1);
    commit();
    renderSheet();
  },
  evsave(b, e, a, k) {
    evSave(!!b.dataset.quick);
  },
  toplan(b, e, a, k) {
    const dl = document.getElementById("sheet");
    ui.sheet = null;
    if (dl?.open) dl.close();
    tab = "week";
    ui.seg = { ...(ui.seg || {}), week: "days" };
    render();
    setTimeout(() => {
      const t = document.getElementById("dumpText");
      if (t) {
        t.scrollIntoView({ block: "center" });
        t.focus();
      }
    }, 200);
  },
  iopts(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "iopts", date: b.dataset.date, id: b.dataset.id });
  },
  ioskipday(b, e, a, k) {
    const date = b.dataset.date,
      it = dayPlan(date).find((i) => i.id === b.dataset.id),
      act = b.dataset.act;
    if (!it) return;
    const key = date + "|" + it.id;
    if (act === "iofin") {
      logSession(it.u, "plan");
      sfx("win");
      toast(`Part ${it.n} marked done`);
    } else if (act === "ioskip") {
      logSession(it.u, "skipped");
      sfx("flip");
      toast(`Skipped Part ${it.n}`);
    } else if (act === "iosnz") {
      S.snz = { ...(S.snz || {}), [key]: nowMin() + 60 };
      sfx("flip");
      toast("Okay, later today");
    } else if (act === "iodone") {
      S.tl[key] = Date.now();
      sfx("ok");
    } else {
      S.tl[key] = "skip";
      sfx("flip");
      toast("Skipped " + (date === today ? "today" : "that day"));
    }
    if (ui.sheet?.mode === "iopts") goBack();
    commit();
  },
  evmiss(b, e, a, k) {
    const date = b.dataset.date,
      id = b.dataset.id;
    S.evlog = { ...(S.evlog || {}), [date + "|" + id]: { went: false, at: Date.now() } };
    S.tl[date + "|e-" + id] = "missed";
    sfx("flip");
    toast("Noted: didn't happen");
    commit();
  },
  rem(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "rem" });
  },
  remday(b, e, a, k) {
    const R = REM(),
      d = +b.dataset.d,
      set = new Set(R.days || [1, 2, 3, 4, 5]);
    set.has(d) ? set.delete(d) : set.add(d);
    if (set.size) {
      R.days = [...set];
      sfx("tap");
      commit();
    }
  },
  remics(b, e, a, k) {
    saveIcs();
  },
  wk1done(b, e, a, k) {
    S.wk1 = { ...(S.wk1 || {}), done: { ...(S.wk1?.done || {}), [b.dataset.k]: today } };
    ui.wk1at = null;
    sfx("win");
    toast(
      WEEK1.every(wk1Done)
        ? "Your first week is done. Well done, both of you!"
        : "Lovely. The next one is waiting for tomorrow.",
    );
    commit();
  },
  wk1go(b, e, a, k) {
    ui.wk1at = +b.dataset.i;
    sfx("flip");
    render();
  },
  shopr(b, e, a, k) {
    ui.shopr = b.dataset.r;
    sfx("tap");
    render();
  },
  shoptick(b, e, a, k) {
    const ids = b.dataset.ids.split("~"),
      got = b.getAttribute("aria-pressed") === "true";
    S.prep = { ...S.prep, ...Object.fromEntries(ids.map((id) => [id, got ? 0 : today])) };
    sfx(got ? "tap" : "tick");
    commit();
  },
  shopcopy(b, e, a, k) {
    const L = shopItems(b.dataset.r).filter((g) => !g.got),
      txt = `${SHOPR[b.dataset.r][0]}, for ${S.child || "our"} lessons:\n` + L.map((g) => "• " + g.name).join("\n");
    navigator.clipboard?.writeText(txt).then(
      () => toast("Copied. Paste it anywhere."),
      () => toast("Couldn't copy here"),
    );
  },
  wk1exp(b, e, a, k) {
    wk1Experiment();
  },
  qgame(b, e, a, k) {
    openSheet({ mode: "qgame", u: b.dataset.u, g: b.dataset.g });
  },
  gameopen(b, e, a, k) {
    gameOpen(b.dataset.u, b.dataset.g);
  },
  pzstart(b, e, a, k) {
    pzStart(b.dataset.k, +(b.dataset.skip || 0));
  },
  pzflip(b, e, a, k) {
    pzFlip(+b.dataset.i);
  },
  pzcell(b, e, a, k) {
    pzCell(+b.dataset.i);
  },
  wk1unit(b, e, a, k) {
    fxOpen(wk1Unit().c.unit);
  },
  wk1ws(b, e, a, k) {
    // the first lesson with something to print: a DeepKids unit opens at its first worksheet, a DeepKids
    // lesson at its own worksheet, a board chapter at its topic's worksheets
    const u = wk1Unit() || wk1Lessons().find((x) => x.c?.p?.worksheets?.length || wsOf(x).length);
    if (u?.board === "unit")
      fxOpen(u.c.unit).then(() => {
        const i = (FXALL?.sections || []).findIndex((x) => x.id.startsWith("ws-"));
        if (i >= 0) fxGo(i, 0);
      });
    else if (u?.c?.p?.worksheets?.length) openSheet({ mode: "ws", k: u.k, w: u.c.p.worksheets[0].id });
    else if (u) openSheet({ mode: "wsv", k: u.k, i: 0 });
    else {
      tab = "library";
      ui.lt = "science";
      render();
    }
  },
  wk1iam(b, e, a, k) {
    document.getElementById("fxFab")?.click();
  },
  paper(b, e, a, k) {
    sfx("flip");
    if (ui.sheet?.mode === "paper") {
      ui.sheet = { mode: "paper", p: b.dataset.p, i: 0 };
      renderSheet(true);
    } else openSheet({ mode: "paper", p: b.dataset.p, i: 0 });
  },
  rsgo(b, e, a, k) {
    ui.sheet.i = Math.max(0, +b.dataset.i);
    sfx("flip");
    renderSheet(true);
  },
  rsf(b, e, a, k) {
    ui.rsf = b.dataset.f;
    sfx("tap");
    render();
  },
  rsq(b, e, a, k) {
    const L = rsUnits(rsBy(b.dataset.p));
    L.forEach((u) => qPut("les", u.subj, "les:" + u.k, "end"));
    rsSt().queued = { ...(rsSt().queued || {}), [b.dataset.p]: today };
    sfx("ok");
    toast(L.length === 1 ? "Added to the queue" : `${L.length} topics added to the queue`);
    commit();
    renderSheet();
  },
  rsdone(b, e, a, k) {
    const st = rsSt(),
      id = b.dataset.p;
    if (b.dataset.act === "rslike") st.like[id] = st.like[id] ? 0 : 1;
    else if (!st.read[id]) {
      st.read[id] = today;
      celebrate();
      toast("Lovely. Your next one will be ready next week.");
    }
    if (b.dataset.act === "rslike") sfx(st.like[id] ? "ok" : "tap");
    commit();
    if (ui.sheet) renderSheet();
  },
  wk1off(b, e, a, k) {
    S.wk1 = { ...(S.wk1 || {}), off: true };
    sfx("flip");
    toast("Hidden. You can find every feature from the menu.");
    commit();
  },
  nudgeoff(b, e, a, k) {
    S.nudgeOff = { ...(S.nudgeOff || {}), [today]: Date.now() + 2 * 36e5 };
    sfx("flip");
    toast("Okay. We'll check again later.");
    commit();
  },
  addmode(b, e, a, k) {
    ui.addmode = b.dataset.m;
    sfx("tap");
    render();
  },
  dnofiles(b, e, a, k) {
    if (ui.dump) ui.dump.files = [];
    sfx("flip");
    render();
  },
  seg(b, e, a, k) {
    navPush();
    ui.seg = { ...(ui.seg || {}), [b.dataset.k]: b.dataset.v };
    sfx("tap");
    render();
    scrollTo(0, 0);
  },
  gotab(b, e, a, k) {
    navPush();
    if (b.dataset.qs) {
      ui.qs = b.dataset.qs;
      ui.tq = "les";
    }
    const dl = document.getElementById("sheet");
    if (dl?.open) {
      ui.sheet = null;
      dl.close();
    }
    tab = b.dataset.tab;
    if (b.dataset.seg) ui.seg = { ...(ui.seg || {}), [tab]: b.dataset.seg };
    sfx("flip");
    render();
    scrollTo(0, 0);
    // a "Show me" can point at one box on that screen
    const f = b.dataset.focus && document.getElementById(b.dataset.focus);
    if (f) {
      f.scrollIntoView({ block: "center" });
      f.focus({ preventScroll: true });
    }
  },
  mbmake(b, e, a, k) {
    myBooksMake();
  },
  mbplan(b, e, a, k) {
    myBookPlan(b.dataset.k);
  },
  mbdel(b, e, a, k) {
    myBookRemove(b.dataset.id);
  },
  guidetoggle(b, e, a, k) {
    guideToggle(b.checked);
    renderSheet();
  },
  sndtoggle(b, e, a, k) {
    document.getElementById("snd")?.click();
    setTimeout(() => {
      if (ui.sheet) renderSheet();
    }, 50);
  },
  dexport(b, e, a, k) {
    dataExport();
  },
  plus(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "plus", r: b.dataset.r || "" });
  },
  plusgo(b, e, a, k) {
    plusGo();
  },
  todo(b, e, a, k) {
    navPush();
    const dl = document.getElementById("sheet");
    if (dl?.open) {
      ui.sheet = null;
      dl.close();
    }
    tab = "week";
    ui.seg = { ...(ui.seg || {}), week: "finish" };
    sfx("flip");
    render();
    scrollTo(0, 0);
  },
  qpick(b, e, a, k) {
    ui.qpick = b.dataset.r || null;
    sfx("tap");
    render();
    if (sheet.open) renderSheet();
  },
  qput(b, e, a, k) {
    const ty = b.dataset.ty,
      r = b.dataset.r,
      n = qPut(ty, b.dataset.s, r, b.dataset.w);
    ui.qpick = null;
    ui.flash = r;
    setTimeout(() => {
      ui.flash = null;
    }, 2500);
    sfx("ok");
    toast(
      `${b.dataset.w === "first" ? "Put first" : "Added at the end"}: no. ${n} in the ${ty === "les" ? SUBJ[b.dataset.s] : WORK_TYPES[ty][0].toLowerCase()} queue. See Plan → Queue.`,
      4500,
    );
    render();
    if (sheet.open) renderSheet();
  },
  qmv(b, e, a, k) {
    const ty = b.dataset.ty,
      s = b.dataset.s,
      L = qItems(ty, s).map((x) => x.ref),
      i = L.indexOf(b.dataset.r),
      j = i + +b.dataset.d;
    if (i < 0 || j < 0 || j >= L.length) return;
    [L[i], L[j]] = [L[j], L[i]];
    ui.flash = b.dataset.r;
    setTimeout(() => {
      ui.flash = null;
    }, 1500);
    sfx("tap");
    setOrder(ty, s, L);
  },
  qshuf(b, e, a, k) {
    const ty = b.dataset.ty,
      s = b.dataset.s;
    if (ty === "les") {
      S.next = { ...(S.next || {}), [s]: [] };
      S.shuffle = { ...(S.shuffle || {}), [s]: true };
      S.seed = { ...(S.seed || {}), [s]: Math.floor(Math.random() * 9999) };
      sfx("flip");
      commit();
      toast("Shuffled. Each topic still comes after what it needs first.");
    } else {
      const L = qItems(ty, s).map((x) => x.ref);
      for (let i = L.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [L[i], L[j]] = [L[j], L[i]];
      }
      sfx("flip");
      setOrder(ty, s, L);
      toast("Shuffled");
    }
  },
  qx(b, e, a, k) {
    const ty = b.dataset.ty,
      r = b.dataset.r,
      key = r.slice(r.indexOf(":") + 1);
    if (ty !== "les" && b.dataset.how !== "skip") {
      unQueue(ty, key);
      sfx("flip");
      commit();
      if (sheet.open) renderSheet();
      toast("Taken out of the queue");
      return;
    }
    if (ty === "les") {
      const s = b.dataset.s;
      S.extra = { ...(S.extra || {}), [s]: ((S.extra || {})[s] || []).filter((x) => x !== key) };
      S.next = { ...(S.next || {}), [s]: ((S.next || {})[s] || []).filter((x) => x !== key) };
    } else {
      const W = weekSt();
      W[key] = { ...(W[key] || {}), st: "skip" };
      workQueue()[ty] = (workQueue()[ty] || []).filter((x) => x !== r);
    }
    sfx("flip");
    commit();
    toast("Taken out. You can bring it back from its chapter.");
  },
  hty(b, e, a, k) {
    ui.hty = b.dataset.t;
    ui.hn = 25;
    sfx("tap");
    render();
  },
  hs(b, e, a, k) {
    ui.hs = b.dataset.s;
    ui.hn = 25;
    sfx("tap");
    render();
  },
  hmore(b, e, a, k) {
    ui.hn = (ui.hn || 25) + 25;
    render();
  },
  morejg(b, e, a, k) {
    ui.jg = (ui.jg || 0) + 1;
    sfx("flip");
    renderSheet();
  },
  tdtick(b, e, a, k) {
    const x = (S.todos || []).find((z) => z.id === b.dataset.t);
    if (x) {
      x.done = !x.done;
      x.doneOn = x.done ? today : null;
      sfx(x.done ? "tick" : "flip");
      commit();
    }
  },
  subtog(b, e, a, k) {
    const s = b.dataset.s,
      on = S.subjects.includes(s);
    if (on && S.subjects.length < 2) {
      sfx("no");
      toast("Keep at least one subject");
      return;
    }
    S.subjects = on ? S.subjects.filter((x) => x !== s) : SUBJ_KEYS.filter((x) => x === s || S.subjects.includes(x));
    if (!on) {
      S.levels = { ...S.levels, [s]: S.levels?.[s] || S.levels?.sci || 1 };
    }
    sfx(on ? "flip" : "ok");
    commit();
    toast(on ? `${SUBJ[s]} left out. Its progress is kept.` : `${SUBJ[s]} added. It's in Today and the Queue now.`);
  },
  pacego(b, e, a, k) {
    navPush();
    ui.seg = { ...(ui.seg || {}), week: "family" };
    sfx("flip");
    render();
    setTimeout(() => document.getElementById("paceSec")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  },
  ist(b, e, a, k) {
    const key = k + "|" + b.dataset.id,
      W = weekSt(),
      w = W[key] || {},
      to = b.dataset.to;
    if (to === "none") {
      if (w.st !== "planned") delete w.st;
      W[key] = w;
    } else if (to === "skip") W[key] = { ...w, st: "skip" };
    else if (to === "undo") {
      if (S.tasks[k + "#" + b.dataset.id]) delete S.tasks[k + "#" + b.dataset.id].ws;
      delete w.st;
      W[key] = w;
    }
    sfx("flip");
    commit();
    if (sheet.open) renderSheet();
    toast(to === "skip" ? "Marked not doing" : to === "undo" ? "Back to not finished" : "Done");
  },
  quizgo(b, e, a, k) {
    sfx("flip");
    ui.qrun = null;
    ui.qzv = null;
    openSheet({ mode: "quizz" });
  },
  qall(b, e, a, k) {
    ui.qall = !ui.qall;
    sfx("tap");
    render();
  },
  tofinish(b, e, a, k) {
    navPush();
    tab = "week";
    ui.seg = { ...(ui.seg || {}), week: "finish" };
    sfx("flip");
    render();
    scrollTo(0, 0);
  },
  qzresume(b, e, a, k) {
    sfx("flip");
    ui.qrun = { ...S.qzopen.run, i: S.qzopen.run.res.length, cur: null };
    ui.qzv = null;
    openSheet({ mode: "quizz" });
  },
  rfset(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "rfset" });
  },
  qzset(b, e, a, k) {
    const Z = (ui.qz = ui.qz || {}),
      v = b.dataset.v;
    Z[b.dataset.key] = /^\d+$/.test(v) ? +v : v;
    sfx("tap");
    renderSheet();
  },
  qzstart(b, e, a, k) {
    const Z = ui.qz,
      N = Z.by === "n" ? Z.n : Z.m * 2,
      P = quizPool(Z.s, Z.focus);
    if (!P.length) return;
    const head = Z.focus === "mix" ? P.slice(0, Math.ceil(N / 2)) : [],
      rest = P.filter((q) => !head.includes(q));
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    const qs = [...head, ...rest].slice(0, N);
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    ui.qrun = { s: Z.s, by: Z.by, qs, i: 0, res: [], end: Z.by === "m" ? Date.now() + Z.m * 60000 : null };
    clearInterval(ui.qtick);
    if (ui.qrun.end)
      ui.qtick = setInterval(() => {
        const R = ui.qrun;
        if (!R || ui.sheet?.mode !== "quizz" || R.saved) {
          clearInterval(ui.qtick);
          return;
        }
        const e = document.getElementById("qzleft"),
          l = Math.max(0, Math.round((R.end - Date.now()) / 1000));
        if (e) e.textContent = Math.floor(l / 60) + ":" + String(l % 60).padStart(2, "0");
        if (!l) renderSheet();
      }, 1000);
    sfx("ok");
    renderSheet();
  },
  qans(b, e, a, k) {
    const q = (window._qmap || {})[b.dataset.id];
    if (!q) return;
    const c = b.dataset.c != null ? +b.dataset.c : null,
      r = c != null ? c === q.ans : b.dataset.r === "1";
    qRecord(q, r);
    if (ui.sheet?.mode === "refresh") rfRecord(q, r);
    sfx(r ? "ok" : "flip");
    if (ui.sheet?.mode === "quizz" && ui.qrun) {
      const R = ui.qrun;
      if (R.cur?.id !== q.id) {
        R.cur = { id: q.id, r, c };
        R.res.push({ q, r, c });
      }
      qzKeep();
    } else {
      const d = ui.sheet?.date || today;
      S.rfa = { ...(S.rfa || {}), [d]: { ...((S.rfa || {})[d] || {}), [q.id]: { r, c } } };
    }
    commit();
    renderSheet();
  },
  qznext(b, e, a, k) {
    const R = ui.qrun;
    if (R) {
      R.i++;
      R.cur = null;
      qzKeep();
      save();
    }
    sfx("tap");
    renderSheet();
  },
  qzstop(b, e, a, k) {
    const R = ui.qrun;
    if (R) {
      R.qs = R.qs.slice(0, R.res.length);
      R.i = R.qs.length;
    }
    renderSheet();
  },
  qzagain(b, e, a, k) {
    ui.qrun = null;
    renderSheet();
  },
  qzend(b, e, a, k) {
    ui.qrun = null;
    goBack();
  },
  qzpast(b, e, a, k) {
    ui.qzv = b.dataset.id;
    renderSheet();
  },
  qzback(b, e, a, k) {
    ui.qzv = null;
    renderSheet();
  },
  qgen(b, e, a, k) {
    qGen();
  },
  rfday(b, e, a, k) {
    const R = RFS(),
      d = +b.dataset.d,
      days = R.days.includes(d) ? R.days.filter((x) => x !== d) : [...R.days, d];
    S.rfs = { ...(S.rfs || {}), days };
    delete (S.rfp || {})[today];
    sfx("tap");
    commit();
    renderSheet();
  },
  dts(b, e, a, k) {
    ui.dts = b.dataset.s;
    sfx("tap");
    render();
  },
  dtreset(b, e, a, k) {
    const sc = ui.dts || "all";
    if (sc[0] === "w") {
      const w = { ...(S.dayW || {}) };
      delete w[sc.slice(1)];
      S.dayW = w;
    } else if (sc.startsWith("d:")) {
      const o = { ...(S.dayOver || {}) };
      delete o[sc.slice(2)];
      S.dayOver = o;
    }
    sfx("flip");
    commit();
  },
  wfguide(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "wfguide" });
  },
  wsprint(b, e, a, k) {
    const u = unitByK(k),
      w = wsOf(u)[+b.dataset.i];
    if (w) {
      sfx("ok");
      printDoc(wsPage(w, u));
    }
  },
  wssave(b, e, a, k) {
    const u = unitByK(k),
      w = wsOf(u)[+b.dataset.i];
    if (w) saveDoc(wsPage(w, u), `${w.title.replace(/[^\w ]+/g, "").trim()}.html`);
  },
  wsview(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "wsv", k, i: +b.dataset.i });
  },
  pdep(b, e, a, k) {
    const s = b.dataset.s,
      f = a === "plv" ? "lvl" : "depth";
    S.prof = {
      ...(S.prof || {}),
      [s]: {
        ...((S.prof || {})[s] || {}),
        [f]: b.dataset.v,
        ...(a === "plv" ? { why: "set by you", at: today } : {}),
      },
    };
    sfx("tick");
    save();
    render();
  },
  cgprint(b, e, a, k) {
    const u = unitByK(k);
    if (u?.c?.p?.game) {
      sfx("ok");
      printDoc(wsPage(gameSheet(u), u));
    }
  },
  cgview(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "wsv", k, game: 1 });
  },
  tqt(b, e, a, k) {
    ui.tq = b.dataset.t;
    ui.qpick = null;
    sfx("tap");
    render();
  },
  qzs(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "qzs", k, n: +b.dataset.n });
  },
  lt(b, e, a, k) {
    navPush();
    ui.lt = b.dataset.t;
    sfx("tap");
    render();
  },
  invadd(b, e, a, k) {
    S.inv = [...(S.inv || []), { id: newId(), name: b.dataset.n, cat: b.dataset.c || "other", from: "tap" }];
    sfx("ok");
    toast("Added to what we have");
    commit();
  },
  invnew(b, e, a, k) {
    const n = document.getElementById("invName").value.trim();
    if (!n) return;
    S.inv = [...(S.inv || []), { id: newId(), name: n, cat: document.getElementById("invCat").value }];
    sfx("ok");
    commit();
    clearIn("invName");
  },
  signout(b, e, a, k) {
    window.DK_PLATFORM?.signOut?.();
  },
  invsel(b, e, a, k) {
    ui.invSel = ui.invSel === b.dataset.i ? null : b.dataset.i;
    sfx("tap");
    render();
  },
  invdel(b, e, a, k) {
    S.inv = (S.inv || []).filter((i) => i.id !== b.dataset.i);
    sfx("flip");
    commit();
  },
  lvl(b, e, a, k) {
    const s = b.dataset.s;
    S.levels[s] = Math.min(5, Math.max(1, S.levels[s] + +b.dataset.d));
    sfx("tick");
    commit();
  },
  day(b, e, a, k) {
    const s = b.dataset.s,
      d = +b.dataset.d,
      cur = new Set(daysOf(s));
    cur.has(d) ? cur.delete(d) : cur.add(d);
    if (cur.size) {
      S.days = { ...S.days, [s]: [...cur].sort() };
      sfx("tap");
      commit();
    }
  },
  check(b, e, a, k) {
    const x = S.exps.find((x) => x.id === b.dataset.e);
    if (x && !x.checks.includes(today)) {
      x.checks.push(today);
      sfx("ok");
      commit();
    }
  },
  close(b, e, a, k) {
    const x = S.exps.find((x) => x.id === b.dataset.e);
    if (x) {
      x.closed = true;
      x.end = today;
      sfx("win");
      confetti();
      toast("Finished: " + x.title);
      commit();
    }
  },
  addexp(b, e, a, k) {
    const v = document.getElementById("newExp").value.trim();
    if (v) {
      addExp(v, "Our own experiment");
      sfx("ok");
      commit();
      clearIn("newExp");
    }
  },
  joke(b, e, a, k) {
    ui.jokes[b.dataset.j] = !ui.jokes[b.dataset.j];
    sfx(ui.jokes[b.dataset.j] ? "ok" : "flip");
    sheet.open ? renderSheet() : render();
  },
  gtab(b, e, a, k) {
    ui.game = b.dataset.g;
    sfx("tap");
    renderSheet();
  },
  wk(b, e, a, k) {
    const u = dailyUnit();
    if (!u) return;
    const word = u.c.x.words[dayNo % u.c.x.words.length],
      g = gamesToday();
    g.cur = g.cur || "";
    const key = b.dataset.key;
    if (g.g.includes(word) || g.g.length >= 6) return;
    if (key === "DEL") {
      g.cur = g.cur.slice(0, -1);
      sfx("key");
    } else if (key === "ENTER") {
      if (g.cur.length === 5) {
        g.g.push(g.cur);
        const w = g.cur === word;
        g.cur = "";
        sfx(w ? "win" : g.g.length >= 6 ? "no" : "flip");
        if (w) confetti();
        S.updatedAt = Date.now();
        save();
      } else {
        sfx("no");
        toast("Five letters, please");
      }
    } else if (g.cur.length < 5) {
      g.cur += key;
      sfx("key");
    }
    renderSheet();
  },
  tf(b, e, a, k) {
    const u = dailyUnit(),
      q = u.c.x.quiz[+b.dataset.i];
    gamesToday().tf[b.dataset.i] = +b.dataset.v;
    sfx((+b.dataset.v === 1) === q[1] ? "ok" : "no");
    if (Object.keys(gamesToday().tf).length === u.c.x.quiz.length) setTimeout(() => sfx("win"), 300);
    commit();
  },
  odd(b, e, a, k) {
    const u = dailyUnit(),
      o = u.c.x.odd[dayNo % u.c.x.odd.length],
      g = gamesToday();
    if (!g.odd) {
      g.odd = b.dataset.w;
      sfx(g.odd === o[1] ? "win" : "no");
      if (g.odd === o[1]) confetti();
      commit();
    }
  },
  mcq(b, e, a, k) {
    setA(k, b.dataset.id, +b.dataset.o);
    sfx(+b.dataset.o === +b.dataset.a ? "ok" : "no");
    commit();
  },
  mcqreset(b, e, a, k) {
    delete S.ans[k][b.dataset.id];
    sfx("flip");
    commit();
  },
  checkfill(b, e, a, k) {
    const ans = JSON.parse(b.dataset.a),
      v = answerOf(k, b.dataset.id) || [],
      n = (s) =>
        String(s || "")
          .trim()
          .toLowerCase();
    const good = ans.every((x, i) => {
      const w = n(v[i]);
      return w && (n(x).includes(w) || w.includes(n(x).split(/[ (]/)[0]));
    });
    sfx(good ? "ok" : "no");
    toast(good ? "Looks right" : "Have another look");
  },
  showfill(b, e, a, k) {
    sfx("flip");
    toast(b.dataset.a);
  },
  fadd(b, e, a, k) {
    const v = answerOf(k, b.dataset.id) || { fs: [] },
      sel =
        (ui.fsel || {})[k + b.dataset.id] || document.querySelector(`[data-fsel][data-fid="${b.dataset.id}"]`)?.value;
    if (sel) {
      setA(k, b.dataset.id, { fs: [...(v.fs || []), { name: sel, dir: b.dataset.dir }], checked: false });
      sfx("tap");
      commit();
    }
  },
  fdel(b, e, a, k) {
    const v = answerOf(k, b.dataset.id) || { fs: [] };
    setA(k, b.dataset.id, { fs: (v.fs || []).filter((_, i) => i !== +b.dataset.i), checked: false });
    commit();
  },
  fcheck(b, e, a, k) {
    const v = answerOf(k, b.dataset.id) || { fs: [] };
    setA(k, b.dataset.id, { ...v, checked: true });
    sfx("flip");
    commit();
  },
  fshow(b, e, a, k) {
    const v = answerOf(k, b.dataset.id) || { fs: [] };
    setA(k, b.dataset.id, { ...v, shown: true });
    commit();
  },
  aidraw(b, e, a, k) {
    aiCheckDraw(k, b.dataset.id);
  },
  drew(b, e, a, k) {
    if (answerOf(k, b.dataset.id)) delete S.ans[k][b.dataset.id];
    else {
      setA(k, b.dataset.id, today);
      sfx("ok");
    }
    commit();
  },
  tok(b, e, a, k) {
    const key = k + b.dataset.id;
    ui.sel[key] = ui.sel[key] === b.dataset.x ? undefined : b.dataset.x;
    sfx("tap");
    renderSheet();
  },
  bucket(b, e, a, k) {
    const sel = ui.sel[k + b.dataset.id];
    if (sel === undefined) return;
    const v = { ...(answerOf(k, b.dataset.id) || {}) };
    v[sel] = +b.dataset.c;
    setA(k, b.dataset.id, v);
    ui.sel[k + b.dataset.id] = undefined;
    sfx("tick");
    commit();
  },
  untok(b, e, a, k) {
    const v = { ...(answerOf(k, b.dataset.id) || {}) };
    delete v[b.dataset.x];
    setA(k, b.dataset.id, v);
    sfx("flip");
    commit();
  },
  mleft(b, e, a, k) {
    ui.sel[k + b.dataset.id] = b.dataset.x;
    sfx("tap");
    renderSheet();
  },
  mright(b, e, a, k) {
    const l = ui.sel[k + b.dataset.id];
    if (!l) {
      sfx("no");
      toast("Tap a word on the left first");
      return;
    }
    const v = { ...(answerOf(k, b.dataset.id) || {}) };
    Object.keys(v).forEach((x) => {
      if (v[x] === b.dataset.x) delete v[x];
    });
    v[l] = b.dataset.x;
    setA(k, b.dataset.id, v);
    ui.sel[k + b.dataset.id] = undefined;
    const [si, ii] = b.dataset.id.split("-").map(Number),
      it = unitBy(k).c.x.wsd[si][1][ii];
    sfx(it.pairs.some((p) => p[0] === l && p[1] === b.dataset.x) ? "ok" : "tick");
    commit();
  },
  mreset(b, e, a, k) {
    setA(k, b.dataset.id, {});
    sfx("flip");
    commit();
  },
  clearpad(b, e, a, k) {
    const c = document.querySelector(`canvas[data-pad="${CSS.escape(b.dataset.pad)}"]`);
    if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height);
    sfx("flip");
  },
  saveset(b, e, a, k) {
    S.child = document.getElementById("sName").value.trim();
    const v = document.getElementById("sStart").value;
    if (v) S.start = v;
    sfx("ok");
    S.updatedAt = Date.now();
    render();
    saveNow().then((ok) =>
      toast(ok || !store ? "Saved" : "Couldn't reach your account. Saved on this phone; it will retry."),
    );
  },
  redo(b, e, a, k) {
    sheet.close();
    startOnboarding(1);
  },
};
ACT.delprofile = ACT.delprofileno;
ACT.iofin = ACT.ioskipday;
ACT.ioskip = ACT.ioskipday;
ACT.iosnz = ACT.ioskipday;
ACT.iodone = ACT.ioskipday;
ACT.rslike = ACT.rsdone;
ACT.plv = ACT.pdep;
/* event dialog */
const pick = document.getElementById("pick");
function openPicker() {
  document.getElementById("pickList").replaceChildren(
    htmlToEl(
      everyUnit()
        .map(
          (u) =>
            `<button class="unit ${subjClass(u.subj)}" style="grid-template-columns:44px 1fr" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · Level ${u.level}</span></span></button>`,
        )
        .join(""),
    ),
  );
  sfx("tap");
  pick.showModal();
}
