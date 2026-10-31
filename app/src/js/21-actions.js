/* What every tap does (onAct) and the event dialog */
function playItem(it) {
  // a DeepKids-track unit opens as the unit itself, where the family left off
  if (it.u.board === "unit") return fxOpen(it.u.c.unit);
  setTimeout(autoRead, 100);
  openSheet({
    mode: "player",
    s: it.s,
    k: it.u.k,
    n: it.n,
    tot: it.tot,
    bonus: it.bonus,
    i: Math.max(
      0,
      stepState(it).findIndex((x) => !x.ok),
    ),
  });
  if (ui.sheet.i < 0) ui.sheet.i = 0;
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
  switch (a) {
    case "topen": {
      const id = b.dataset.id,
        cur = !!ui.open[id];
      ui.open[id] = !cur;
      sfx(cur ? "tap" : "flip");
      render();
      break;
    }
    case "play": {
      const it = findItem(b.dataset.id);
      if (it) {
        sfx("flip");
        playItem(it);
      }
      break;
    }
    case "pstep": {
      ui.sheet.i = Math.max(0, ui.sheet.i + +b.dataset.d);
      sfx("tap");
      renderSheet(true);
      autoRead();
      break;
    }
    case "readnow": {
      readNow();
      break;
    }
    case "autoread": {
      S.autoRead = !S.autoRead;
      save();
      toast(S.autoRead ? "Each step will be read aloud as you go." : "Steps won't be read automatically.");
      renderSheet();
      break;
    }
    case "pdone": {
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
      break;
    }
    case "timer": {
      sfx("tap");
      timerToggle();
      break;
    }
    case "finish": {
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
      break;
    }
    case "more": {
      const s = b.dataset.s;
      ui.more[s] = true;
      sfx("tick");
      _sess = null;
      const it = dayPlan(today).find((i) => i.kind === "lesson" && i.s === s && !i.done);
      render();
      if (it) playItem(it);
      break;
    }
    case "less": {
      ui.more[b.dataset.s] = false;
      sfx("flip");
      render();
      break;
    }
    case "skip": {
      S.skips[today + "|" + b.dataset.s] = true;
      sfx("flip");
      toast("Moved to the next lesson day");
      commit();
      break;
    }
    case "swap": {
      sfx("flip");
      openSheet({ mode: "swap", s: b.dataset.s });
      break;
    }
    case "lvq": {
      ui.lvq = lvqNew(b.dataset.s, S.levels[b.dataset.s] || 3);
      ui.lvqDone = null;
      sfx("flip");
      renderSheet(true);
      break;
    }
    case "lvqa": {
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
      break;
    }
    case "lvqset": {
      S.levels = { ...S.levels, [b.dataset.s]: +b.dataset.l };
      ui.lvqDone = null;
      _sess = null;
      sfx("ok");
      toast(`${SUBJ[b.dataset.s]} now plans from Class ${b.dataset.l}`);
      commit();
      renderSheet();
      break;
    }
    case "catchup": {
      const s = b.dataset.s,
        ks = b.dataset.ks.split("~");
      S.next = { ...(S.next || {}), [s]: [...ks, ...((S.next || {})[s] || []).filter((x) => !ks.includes(x))] };
      sfx("ok");
      toast(ks.length > 1 ? `${ks.length} topics moved to the front of ${SUBJ[s]}` : "That's up next");
      commit();
      break;
    }
    case "pin": {
      const s = b.dataset.s;
      S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
      sfx("ok");
      toast("That's up next");
      sheet.close();
      commit();
      break;
    }
    case "tday": {
      navPush();
      const d = b.dataset.d;
      ui.tday = d === "0" ? null : addDays(ui.tday || today, +d);
      if (ui.tday === today) ui.tday = null;
      sfx("tap");
      render();
      scrollTo(0, 0);
      break;
    }
    case "quickday": {
      navPush();
      ui.pday = b.dataset.d;
      ui.pv = "day";
      tab = "week";
      render();
      scrollTo(0, 0);
      break;
    }
    case "login": {
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
      break;
    }
    case "loginas": {
      ui.lgBusy = true;
      openAccount(b.dataset.a).then(() => {
        ui.lgBusy = false;
        tab = "today";
        ui.tday = null;
        sfx("win");
        toast("Welcome back" + (pname() ? ", " + pname() : "") + "!");
        render();
      });
      break;
    }
    case "logout": {
      sheet.close();
      // on the website, logging out signs out of Google; the family's plan stays with their Google account
      if (window.DK_PLATFORM?.signOut) {
        writeNow()
          .catch(() => {})
          .then(() => window.DK_PLATFORM.signOut());
        break;
      }
      logout().then(() => {
        ui.saved = null;
        toast("Logged out");
      });
      break;
    }
    case "checksaved": {
      if (!store) {
        ui.saved = { err: "This view isn't connected to your account, so data is only on this device." };
        renderSheet();
        break;
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
      break;
    }
    case "nowmore": {
      const k2 = "now|" + b.dataset.id;
      ui.open[k2] = !ui.open[k2];
      sfx("tap");
      render();
      break;
    }
    case "showdone": {
      ui.showDone = !ui.showDone;
      sfx("tap");
      render();
      break;
    }
    case "moresheet": {
      sfx("flip");
      openSheet({ mode: "more" });
      break;
    }
    case "plsheet": {
      sfx("flip");
      openSheet({ mode: "pl", p: b.dataset.p });
      break;
    }
    case "jrsheet": {
      sfx("flip");
      openSheet({ mode: "jr", p: b.dataset.p });
      break;
    }
    case "daytype": {
      S.dayType = { ...(S.dayType || {}), [today]: b.dataset.t };
      sfx("tick");
      toast(b.dataset.t === "busy" ? "Busy day: shorter lessons" : "Full day");
      commit();
      break;
    }
    case "learn": {
      sfx("flip");
      openSheet({ mode: "learn" });
      break;
    }
    case "ptype": {
      ui.ptype = b.dataset.t;
      sfx("tap");
      renderSheet();
      break;
    }
    case "ppick": {
      S.planPick = { ...(S.planPick || {}), [k]: { ...((S.planPick || {})[k] || {}), [b.dataset.t]: b.dataset.o } };
      sfx("ok");
      toast("Plan chosen");
      commit();
      break;
    }
    case "tfind": {
      ui.libq = document.getElementById("tq")?.value || "";
      ui.terr = "";
      sfx("tap");
      render();
      break;
    }
    case "tsearch": {
      ui.libq = b.dataset.q;
      ui.lt = "topics";
      tab = "library";
      if (sheet.open) sheet.close();
      render();
      scrollTo(0, 0);
      break;
    }
    case "tgen": {
      sfx("tap");
      genTopic();
      break;
    }
    case "qsub": {
      ui.qs = b.dataset.s;
      sfx("tap");
      render();
      break;
    }
    case "shuffle": {
      const s = b.dataset.s;
      S.shuffle = { ...(S.shuffle || {}), [s]: !(S.shuffle || {})[s] };
      S.seed = { ...(S.seed || {}), [s]: Math.floor(Math.random() * 9999) };
      sfx("flip");
      commit();
      break;
    }
    case "reshuffle": {
      const s = b.dataset.s;
      S.seed = { ...(S.seed || {}), [s]: Math.floor(Math.random() * 9999) };
      sfx("flip");
      commit();
      break;
    }
    case "exam": {
      S.exam = !S.exam;
      sfx("tick");
      toast(S.exam ? "Exam track on: syllabus first" : "Exam track off");
      commit();
      break;
    }
    case "qnext": {
      const s = b.dataset.s;
      S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
      S.later = { ...(S.later || {}), [s]: ((S.later || {})[s] || []).filter((x) => x !== k) };
      sfx("ok");
      commit();
      toast(nextMsg(s, k), 5000);
      if (sheet.open) renderSheet();
      break;
    }
    case "qlater": {
      const s = b.dataset.s;
      S.later = { ...(S.later || {}), [s]: [...((S.later || {})[s] || []).filter((x) => x !== k), k] };
      S.next = { ...(S.next || {}), [s]: ((S.next || {})[s] || []).filter((x) => x !== k) };
      sfx("flip");
      toast("Moved to later");
      commit();
      break;
    }
    case "qrem": {
      const s = b.dataset.s;
      S.extra = { ...(S.extra || {}), [s]: ((S.extra || {})[s] || []).filter((x) => x !== k) };
      S.next = { ...(S.next || {}), [s]: ((S.next || {})[s] || []).filter((x) => x !== k) };
      sfx("flip");
      commit();
      break;
    }
    case "qadd": {
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
      break;
    }
    case "lt2": {
      ui.lt = "topics";
      tab = "library";
      render();
      scrollTo(0, 0);
      break;
    }
    case "quickplan": {
      tab = "week";
      render();
      scrollTo(0, 0);
      break;
    }
    case "free": {
      openPicker();
      break;
    }
    case "chapter": {
      sfx("flip");
      if (b.dataset.t) ui.ctab[k] = b.dataset.t;
      openSheet({ mode: "chapter", k });
      break;
    }
    case "ctab": {
      navPush();
      ui.ctab[k] = b.dataset.t;
      sfx("tap");
      renderSheet(true);
      break;
    }
    case "qi": {
      ui.qi[k] = Math.max(0, (ui.qi[k] || 0) + +b.dataset.d);
      sfx("flip");
      renderSheet(true);
      break;
    }
    case "ws": {
      sfx("flip");
      openSheet({ mode: "ws", k, w: b.dataset.w });
      break;
    }
    case "wsec": {
      ui.wsec[k] = Math.max(0, (ui.wsec[k] || 0) + +b.dataset.d);
      sfx("flip");
      renderSheet(true);
      break;
    }
    case "wsdone": {
      S.tasks[k] = S.tasks[k] || {};
      S.tasks[k].ws = S.tasks[k].ws || today;
      sfx("win");
      confetti();
      toast("Worksheet finished! Taking you back…", 1400);
      commit();
      setTimeout(() => {
        if (ui.sheet?.mode === "ws") goBack();
      }, 1400);
      break;
    }
    case "games": {
      sfx("flip");
      openSheet({ mode: "games" });
      break;
    }
    case "night": {
      sfx("flip");
      openSheet({ mode: "night" });
      break;
    }
    case "nightdone": {
      S.night = { ...(S.night || {}), [today]: 1 };
      sfx("win");
      toast("All set. Sleep well!");
      sheet.close();
      commit();
      break;
    }
    case "parent": {
      sfx("flip");
      openSheet({ mode: "parent" });
      break;
    }
    case "phelp": {
      ui.phelp = ui.phelp || new Set((S.parent || {}).help || []);
      ui.phelp.has(b.dataset.s) ? ui.phelp.delete(b.dataset.s) : ui.phelp.add(b.dataset.s);
      b.setAttribute("aria-pressed", ui.phelp.has(b.dataset.s));
      sfx("tap");
      break;
    }
    case "psave": {
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
        ...D(),
        prepAt: g("pPrep") || D().prepAt,
        start: g("pStart") || D().start,
        eveAt: g("pEve") || D().eveAt,
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
      break;
    }
    case "quick": {
      sfx("flip");
      ui.qaOpen = !ui.qaOpen;
      render();
      if (ui.qaOpen) setTimeout(() => document.getElementById("qa-t")?.focus(), 80);
      break;
    }
    case "qwho": {
      ui.qwho = b.dataset.w;
      b.parentElement.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      sfx("tap");
      break;
    }
    case "qaddq": {
      const root = b.closest(".col") || b.closest("#sheetBody") || document.getElementById("main"),
        g = (s) => root.querySelector(s)?.value || "",
        t = g("#qa-t").trim(),
        s = g("#qa-s"),
        e = g("#qa-e"),
        d = g("#qa-d") || today,
        w = ui.qwho || "you",
        kd = ui.qkind || "other",
        r = kd === "todo" ? "once" : ui.qrep || "once",
        days = r === "pick" ? ui.qdays || [] : QREP[r][1] || [];
      if (!t) {
        sfx("no");
        toast("Type what the plan is");
        return;
      }
      if (r !== "once" && !s) {
        sfx("no");
        toast("Add a start time for something that repeats");
        return;
      }
      if (r === "pick" && !days.length) {
        sfx("no");
        toast("Pick at least one day");
        return;
      }
      const id = Math.random().toString(36).slice(2, 9);
      if (s && kd !== "todo") {
        const end = e && hm(e) > hm(s) ? e : clock24(hm(s) + 60);
        S.events = [
          ...(S.events || []),
          r === "once"
            ? { id, title: t, kind: kd, who: w, start: s, end, rep: "once", date: d, days: [], from: today, note: "" }
            : {
                id,
                title: t,
                kind: kd,
                who: w,
                start: s,
                end,
                rep: "weekly",
                days: [...days].sort(),
                from: d,
                note: "",
              },
        ];
        toast(
          r === "once"
            ? "Added for " + fmt(d)
            : `Added: ${days.length === 7 ? "every day" : days.map((x) => DAYN[x]).join(", ")}, ${clock(hm(s))}`,
        );
      } else {
        S.todos = [...(S.todos || []), { id, title: t, who: w, date: d, note: "", done: false }];
        toast("To-do added for " + fmt(d));
      }
      sfx("ok");
      ui.qdays = [];
      ui.qdraft = null;
      commit();
      ["qa-t", "qa-s", "qa-e"].forEach(clearIn);
      break;
    }
    case "qkind": {
      const _r = b.closest(".col");
      if (_r)
        ui.qdraft = {
          t: _r.querySelector("#qa-t")?.value,
          s: _r.querySelector("#qa-s")?.value,
          e: _r.querySelector("#qa-e")?.value,
          d: _r.querySelector("#qa-d")?.value,
        };
      ui.qkind = b.dataset.k;
      sfx("tap");
      render();
      if (sheet.open) renderSheet();
      break;
    }
    case "qrep": {
      const _r = b.closest(".col");
      if (_r)
        ui.qdraft = {
          t: _r.querySelector("#qa-t")?.value,
          s: _r.querySelector("#qa-s")?.value,
          e: _r.querySelector("#qa-e")?.value,
          d: _r.querySelector("#qa-d")?.value,
        };
      ui.qrep = b.dataset.r;
      sfx("tap");
      render();
      if (sheet.open) renderSheet();
      break;
    }
    case "qday": {
      const _r = b.closest(".col");
      if (_r)
        ui.qdraft = {
          t: _r.querySelector("#qa-t")?.value,
          s: _r.querySelector("#qa-s")?.value,
          e: _r.querySelector("#qa-e")?.value,
          d: _r.querySelector("#qa-d")?.value,
        };
      const d = +b.dataset.d,
        a = ui.qdays || [];
      ui.qdays = a.includes(d) ? a.filter((x) => x !== d) : [...a, d];
      sfx("tap");
      render();
      if (sheet.open) renderSheet();
      break;
    }
    case "todomove": {
      const x = (S.todos || []).find((z) => z.id === b.dataset.t);
      if (x) {
        x.date = tomorrow();
        sfx("flip");
        toast("Moved to tomorrow");
        commit();
      }
      break;
    }
    case "tododel": {
      S.todos = (S.todos || []).filter((z) => z.id !== b.dataset.t);
      sfx("flip");
      commit();
      break;
    }
    case "goto": {
      const t = document.getElementById(b.dataset.to);
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      break;
    }
    case "task": {
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
      break;
    }
    case "startexp": {
      addExp(b.dataset.title, b.dataset.topic);
      sfx("ok");
      toast("Started. Tick it once a day under Daily check-ins.");
      commit();
      break;
    }
    case "status": {
      const p = S.progress[k] || { sessions: 0 };
      p.status = b.dataset.s;
      p.updated = today;
      S.progress[k] = p;
      sfx(b.dataset.s === "mastered" ? "win" : "tick");
      commit();
      break;
    }
    case "logk": {
      const u = unitBy(k);
      if (u) {
        logSession(u, "free");
        sfx("ok");
        toast("Logged for today");
        commit();
      }
      break;
    }
    case "tlcheck": {
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
      break;
    }
    case "tlopen": {
      const date = b.dataset.date,
        it = dayPlan(date).find((i) => i.id === b.dataset.id);
      if (!it) return;
      sfx("tap");
      if (it.kind === "prep") return openSheet({ mode: "prep", date, when: it.id });
      if (it.kind === "lesson") return it.done ? openSheet({ mode: "chapter", k: it.u.k }) : playItem(it);
      if (it.kind === "warm") return openSheet({ mode: "games" });
      break;
    }
    case "prep": {
      const id = b.dataset.id;
      if (S.prep[id]) delete S.prep[id];
      else {
        S.prep[id] = today;
        sfx("tick");
      }
      commit();
      break;
    }
    case "addev": {
      openEv();
      break;
    }
    case "delev": {
      S.events = (S.events || []).filter((x) => x.id !== b.dataset.e);
      sfx("flip");
      commit();
      break;
    }
    case "pv": {
      ui.pv = b.dataset.v;
      sfx("tap");
      render();
      break;
    }
    case "pday": {
      ui.pday = b.dataset.d;
      ui.pv = "day";
      sfx("tap");
      render();
      break;
    }
    case "pdd": {
      ui.pday = addDays(ui.pday || today, +b.dataset.d);
      sfx("tap");
      render();
      break;
    }
    case "pmon": {
      ui.pm = (ui.pm || 0) + +b.dataset.d;
      sfx("tap");
      render();
      break;
    }
    case "wk2": {
      ui.week = (ui.week || 0) + +b.dataset.d;
      sfx("tap");
      render();
      break;
    }
    case "dump": {
      sfx("tap");
      runDump();
      break;
    }
    case "dkeep": {
      const it = ui.dump.items[+b.dataset.i];
      it.keep = !it.keep;
      sfx("tap");
      render();
      break;
    }
    case "dwho": {
      const it = ui.dump.items[+b.dataset.i];
      if (it.type !== "have") {
        it.who = { you: "kid", kid: "both", both: "you" }[it.who] || "you";
        sfx("tap");
        render();
      }
      break;
    }
    case "dadd": {
      addParsed();
      break;
    }
    case "dclear": {
      ui.dump = {};
      render();
      break;
    }
    case "askq": {
      const v = b.dataset.a;
      if (v === "parent") return openSheet({ mode: "parent" });
      if (sheet.open) sheet.close();
      const ta = document.getElementById("dumpText");
      if (ta) {
        ta.value = (ta.value ? ta.value + "\n" : "") + v.slice(4);
        ta.focus();
        ta.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      break;
    }
    case "jsub": {
      sfx("flip");
      openSheet({ mode: "jsub", s: b.dataset.s });
      break;
    }
    case "jopen": {
      ui.jopen = ui.jopen === k ? null : k;
      sfx("tap");
      renderSheet();
      break;
    }
    case "libcombined": {
      tab = "library";
      ui.lt = "topics";
      ui.bb = "combined";
      ui.bl = S.levels?.sci;
      sfx("flip");
      render();
      window.scrollTo(0, 0);
      break;
    }
    case "rt": {
      ui.rt = b.dataset.t;
      ui.rmore = 40;
      sfx("tap");
      render();
      break;
    }
    case "rsj": {
      ui.rsj = b.dataset.v;
      ui.rc = "";
      ui.rt = "all";
      ui.rmore = 40;
      sfx("tap");
      render();
      break;
    }
    case "rfit": {
      ui.rfit = ui.rfit === false;
      sfx("tap");
      render();
      break;
    }
    case "rmore": {
      ui.rmore = (ui.rmore || 40) + 40;
      render();
      break;
    }
    case "rtc": {
      ui.rtc = b.dataset.t;
      sfx("tap");
      renderSheet();
      break;
    }
    case "btrack": {
      navPush();
      ui.btrack = b.dataset.v;
      ui.bs = null;
      ui.bl = null;
      sfx("tap");
      render();
      break;
    }
    case "bb": {
      navPush();
      ui.bb = b.dataset.b;
      ui.bs = null;
      ui.bl = null;
      sfx("tap");
      render();
      break;
    }
    case "bs": {
      ui.bs = b.dataset.s;
      ui.bl = null;
      sfx("tap");
      render();
      break;
    }
    case "bl": {
      ui.bl = +b.dataset.l;
      sfx("tap");
      render();
      break;
    }
    case "isort": {
      sfx("tap");
      runInvSort();
      break;
    }
    case "ikeep": {
      const it = ui.idump.items[+b.dataset.i];
      it.keep = !it.keep;
      sfx("tap");
      render();
      break;
    }
    case "iclear": {
      ui.idump = {};
      clearIn("invText");
      render();
      break;
    }
    case "iadd": {
      const L = (ui.idump?.items || []).filter((x) => x.keep);
      S.inv = [
        ...(S.inv || []),
        ...L.map(({ keep, ...x }) => ({ id: Math.random().toString(36).slice(2, 9), ...x, from: "sorted" })),
      ];
      ui.idump = {};
      clearIn("invText");
      sfx("win");
      toast(`Added ${L.length} to what you have`);
      commit();
      break;
    }
    case "hubres": {
      ui.hubres = true;
      renderSheet();
      break;
    }
    case "jall": {
      ui.jall = true;
      render();
      break;
    }
    case "refresh": {
      sfx("flip");
      openSheet({ mode: "refresh", date: b.dataset.date || today });
      break;
    }
    case "pjump": {
      ui.sheet.i = Math.max(0, +b.dataset.i);
      sfx("tap");
      renderSheet(true);
      autoRead();
      break;
    }
    case "hist": {
      sfx("flip");
      openSheet({ mode: "hist" });
      break;
    }
    case "wkst": {
      const id = b.dataset.id,
        to = b.dataset.to,
        key = k + "|" + id,
        W = WK(),
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
      break;
    }
    case "qz": {
      S.quiz = S.quiz || {};
      const q = (S.quiz[k + "|" + b.dataset.n] = S.quiz[k + "|" + b.dataset.n] || {});
      q[b.dataset.i] = { q: b.dataset.q, a: b.dataset.a, r: +b.dataset.r, d: today };
      sfx(+b.dataset.r ? "ok" : "tap");
      commit();
      break;
    }
    case "folder": {
      sfx("flip");
      openSheet({ mode: "folder" });
      break;
    }
    case "fsave": {
      folderSave();
      break;
    }
    case "fprint": {
      folderPrint();
      break;
    }
    case "qsend": {
      qSend();
      break;
    }
    case "gcsync": {
      gcSync(true);
      break;
    }
    case "gcoff": {
      S.cal = { on: false };
      sfx("flip");
      toast("Calendar unlinked");
      commit();
      break;
    }
    case "gccal": {
      const c = S.cal || {},
        id = b.dataset.id,
        set = new Set(c.cals || []);
      set.has(id) ? set.delete(id) : set.add(id);
      S.cal = { ...c, cals: [...set] };
      gcSync(true);
      break;
    }
    case "uploads": {
      sfx("flip");
      openSheet({ mode: "uploads" });
      break;
    }
    case "track": {
      sfx("flip");
      openSheet({ mode: "track" });
      break;
    }
    case "school": {
      sfx("flip");
      openSheet({ mode: "school" });
      break;
    }
    case "tp": {
      ui.tp = b.dataset.v;
      ui.tpo = 0;
      sfx("tap");
      render();
      break;
    }
    case "tpo": {
      ui.tpo = Math.min(0, (ui.tpo || 0) + +b.dataset.d);
      sfx("tap");
      render();
      break;
    }
    case "tsave": {
      saveDoc(transcriptDoc(), `${(S.child || "Student").replace(/[^\w ]/g, "")} transcript ${today}.html`);
      break;
    }
    case "tprint": {
      printDoc(transcriptDoc());
      break;
    }
    case "told": {
      sfx("flip");
      ui.ted = "";
      if (tab === "week" && seg("week") === "cal" && !sheet.open) {
        render();
        document
          .querySelector('#main [data-act="ted"]')
          ?.closest("section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      openSheet({ mode: "told" });
      render();
      break;
    }
    case "ted": {
      ui.ted = b.dataset.id;
      if (!b.dataset.id) {
        sfx("ok");
        commit();
      } else render();
      break;
    }
    case "evday": {
      const e = (S.events || []).find((x) => x.id === b.dataset.id);
      if (e) {
        const d = +b.dataset.d,
          set = new Set(e.rep === "weekly" ? e.days : []);
        set.has(d) ? set.delete(d) : set.add(d);
        if (set.size) {
          e.days = [...set];
          e.rep = "weekly";
          e.date = null;
        } else {
          e.rep = "once";
          e.days = [];
          e.date = e.date || today;
        }
        sfx("tap");
        commit();
      }
      break;
    }
    case "evwho": {
      const e = (S.events || []).find((x) => x.id === b.dataset.id);
      if (e) {
        e.who = b.dataset.w;
        sfx("tap");
        commit();
      }
      break;
    }
    case "evdel": {
      S.events = (S.events || []).filter((x) => x.id !== b.dataset.id);
      ui.ted = "";
      sfx("flip");
      toast("Removed");
      commit();
      break;
    }
    case "tddel": {
      S.todos = (S.todos || []).filter((x) => x.id !== b.dataset.id);
      sfx("flip");
      commit();
      break;
    }
    case "notedel": {
      S.notes = (S.notes || []).filter((x) => x.id !== b.dataset.id);
      sfx("flip");
      commit();
      break;
    }
    case "tsub": {
      const T = tSetup(),
        s = b.dataset.s,
        o = new Set(T.off || []);
      o.has(s) ? o.delete(s) : o.add(s);
      T.off = [...o];
      sfx("tap");
      commit();
      break;
    }
    case "tmake": {
      const t = curTest();
      if (
        t &&
        Object.keys(t.ans).length &&
        !tDone(t) &&
        !confirm("Start a new paper? The unfinished test will be kept but not continued.")
      )
        break;
      ui.zs = null;
      makeTest();
      break;
    }
    case "tstart": {
      ui.ex = null;
      sfx("flip");
      openSheet({ mode: "exam" });
      break;
    }
    case "tgo": {
      const t = curTest(),
        X = t.subjects[ui.ex.si];
      t.start = t.start || {};
      t.start[X.s] = t.start[X.s] || Date.now();
      ui.ex.qi = 0;
      sfx("tap");
      commit();
      break;
    }
    case "tans": {
      const t = curTest(),
        X = t.subjects[ui.ex.si];
      if (t.done?.[X.s]) break;
      t.ans[X.s + "|" + ui.ex.qi] = +b.dataset.i;
      sfx("tap");
      commit();
      break;
    }
    case "tmove": {
      const t = curTest(),
        n = t.subjects[ui.ex.si].qs.length;
      ui.ex.qi = Math.max(0, Math.min(n - 1, ui.ex.qi + +b.dataset.d));
      sfx("flip");
      render();
      document.getElementById("sheetBody")?.scrollTo?.(0, 0);
      break;
    }
    case "tjump": {
      ui.ex.qi = +b.dataset.i;
      sfx("tap");
      render();
      break;
    }
    case "tfin": {
      const t = curTest(),
        X = t.subjects[ui.ex.si];
      t.done = t.done || {};
      t.done[X.s] = Date.now();
      ui.ex = { si: t.subjects.findIndex((x) => !t.done[x.s]), qi: -1 };
      ui.zs = null;
      sfx("win");
      if (ui.ex.si < 0) confetti();
      commit();
      break;
    }
    case "texit": {
      goBack();
      break;
    }
    case "tdl": {
      tdlDoc(b.dataset.d);
      break;
    }
    case "zall": {
      const Z = zipSel(),
        g = b.dataset.g;
      if (b.dataset.v === "1") {
        if (g === "ws") folderData().forEach((c) => c.ws.forEach((w) => Z.ws.add(w.k)));
        else (S.work || []).forEach((w) => Z.up.add(w.id));
      } else Z[g].clear();
      ui.zip = null;
      render();
      break;
    }
    case "zmake": {
      zipBuild();
      break;
    }
    case "zsave": {
      zipSave();
      break;
    }
    case "zshare": {
      zipShare();
      break;
    }
    case "evcancel": {
      const k = b.dataset.date + "|" + b.dataset.id;
      S.evoff = { ...(S.evoff || {}), [k]: Date.now() };
      sfx("flip");
      toast("Cancelled · undo it under the day's date");
      if (ui.sheet?.mode === "evpre") goBack();
      commit();
      break;
    }
    case "evundo": {
      const o = { ...(S.evoff || {}) };
      delete o[b.dataset.date + "|" + b.dataset.id];
      S.evoff = o;
      sfx("tap");
      commit();
      break;
    }
    case "evf": {
      const F = (ui.evf = ui.evf || {});
      ["covered", "hw", "note"].forEach((k) => {
        const el = document.getElementById("evf-" + k);
        if (el) F[k] = el.value;
      });
      F[b.dataset.k] = b.dataset.k === "went" ? b.dataset.v === "1" : b.dataset.v;
      sfx("tap");
      render();
      break;
    }
    case "lifeadd":
      ui.lf = { kind: "did" };
      openSheet({ mode: "lifeadd" });
      break;
    case "lifekind":
      ui.lf = {
        ...ui.lf,
        kind: b.dataset.k,
        title: document.getElementById("lfTitle")?.value,
        text: document.getElementById("lfText")?.value,
      };
      renderSheet();
      break;
    case "lifesave":
      lifeSave();
      break;
    case "lifeopen":
      openSheet({ mode: "moment", id: b.dataset.id });
      break;
    case "lifeq":
      lifeQueue(b.dataset.id);
      break;
    case "lifex": {
      const m = lifeBy(b.dataset.id);
      if (m) m.links.splice(+b.dataset.i, 1);
      commit();
      renderSheet();
      break;
    }
    case "evsave": {
      evSave(!!b.dataset.quick);
      break;
    }
    case "toplan": {
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
      break;
    }
    case "iopts": {
      sfx("flip");
      openSheet({ mode: "iopts", date: b.dataset.date, id: b.dataset.id });
      break;
    }
    case "iofin":
    case "ioskip":
    case "iosnz":
    case "iodone":
    case "ioskipday": {
      const date = b.dataset.date,
        it = dayPlan(date).find((i) => i.id === b.dataset.id),
        act = b.dataset.act;
      if (!it) break;
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
      break;
    }
    case "evmiss": {
      const date = b.dataset.date,
        id = b.dataset.id;
      S.evlog = { ...(S.evlog || {}), [date + "|" + id]: { went: false, at: Date.now() } };
      S.tl[date + "|e-" + id] = "missed";
      sfx("flip");
      toast("Noted: didn't happen");
      commit();
      break;
    }
    case "rem": {
      sfx("flip");
      openSheet({ mode: "rem" });
      break;
    }
    case "remday": {
      const R = REM(),
        d = +b.dataset.d,
        set = new Set(R.days || [1, 2, 3, 4, 5]);
      set.has(d) ? set.delete(d) : set.add(d);
      if (set.size) {
        R.days = [...set];
        sfx("tap");
        commit();
      }
      break;
    }
    case "remics": {
      saveIcs();
      break;
    }
    case "wk1done": {
      S.wk1 = { ...(S.wk1 || {}), done: { ...(S.wk1?.done || {}), [b.dataset.k]: today } };
      ui.wk1at = null;
      sfx("win");
      toast(
        WEEK1.every(wk1Done)
          ? "Your first week is done. Well done, both of you!"
          : "Lovely. The next one is waiting for tomorrow.",
      );
      commit();
      break;
    }
    case "wk1go": {
      ui.wk1at = +b.dataset.i;
      sfx("flip");
      render();
      break;
    }
    case "shopr": {
      ui.shopr = b.dataset.r;
      sfx("tap");
      render();
      break;
    }
    case "shoptick": {
      const ids = b.dataset.ids.split("~"),
        got = b.getAttribute("aria-pressed") === "true";
      S.prep = { ...S.prep, ...Object.fromEntries(ids.map((id) => [id, got ? 0 : today])) };
      sfx(got ? "tap" : "tick");
      commit();
      break;
    }
    case "shopcopy": {
      const L = shopItems(b.dataset.r).filter((g) => !g.got),
        txt = `${SHOPR[b.dataset.r][0]}, for ${S.child || "our"} lessons:\n` + L.map((g) => "• " + g.name).join("\n");
      navigator.clipboard?.writeText(txt).then(
        () => toast("Copied. Paste it anywhere."),
        () => toast("Couldn't copy here"),
      );
      break;
    }
    case "wk1exp": {
      const u = wk1Lessons().find((x) => x.subj === "sci");
      if (u?.board === "unit") fxOpen(u.c.unit);
      else if (u) openSheet({ mode: "chapter", k: u.k });
      else {
        tab = "library";
        ui.lt = "topics";
        render();
      }
      break;
    }
    case "wk1unit":
      fxOpen(wk1Unit().c.unit);
      break;
    case "wk1ws": {
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
      break;
    }
    case "wk1iam": {
      document.getElementById("fxFab")?.click();
      break;
    }
    case "paper": {
      sfx("flip");
      if (ui.sheet?.mode === "paper") {
        ui.sheet = { mode: "paper", p: b.dataset.p, i: 0 };
        renderSheet(true);
      } else openSheet({ mode: "paper", p: b.dataset.p, i: 0 });
      break;
    }
    case "rsgo": {
      ui.sheet.i = Math.max(0, +b.dataset.i);
      sfx("flip");
      renderSheet(true);
      break;
    }
    case "rsf": {
      ui.rsf = b.dataset.f;
      sfx("tap");
      render();
      break;
    }
    case "rsq": {
      const L = rsUnits(rsBy(b.dataset.p));
      L.forEach((u) => qPut("les", u.subj, "les:" + u.k, "end"));
      rsSt().queued = { ...(rsSt().queued || {}), [b.dataset.p]: today };
      sfx("ok");
      toast(L.length === 1 ? "Added to the queue" : `${L.length} topics added to the queue`);
      commit();
      renderSheet();
      break;
    }
    case "rslike":
    case "rsdone": {
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
      break;
    }
    case "wk1off": {
      S.wk1 = { ...(S.wk1 || {}), off: true };
      sfx("flip");
      toast("Hidden. You can find every feature from the menu.");
      commit();
      break;
    }
    case "nudgeoff": {
      S.nudgeOff = { ...(S.nudgeOff || {}), [today]: Date.now() + 2 * 36e5 };
      sfx("flip");
      toast("Okay. We'll check again later.");
      commit();
      break;
    }
    case "dex": {
      const t = document.getElementById("dumpText");
      if (t) {
        t.value = b.dataset.t;
        t.dispatchEvent(new Event("input", { bubbles: true }));
        t.focus();
        t.select();
      }
      sfx("tap");
      break;
    }
    case "dhand": {
      ui.dhand = !ui.dhand;
      sfx("tap");
      render();
      break;
    }
    case "dnofiles": {
      if (ui.dump) ui.dump.files = [];
      sfx("flip");
      render();
      break;
    }
    case "seg": {
      navPush();
      ui.seg = { ...(ui.seg || {}), [b.dataset.k]: b.dataset.v };
      sfx("tap");
      render();
      scrollTo(0, 0);
      break;
    }
    case "gotab": {
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
      break;
    }
    case "mbmake": {
      myBooksMake();
      break;
    }
    case "mbplan": {
      myBookPlan(b.dataset.k);
      break;
    }
    case "mbdel": {
      myBookRemove(b.dataset.id);
      break;
    }
    case "guidetoggle": {
      guideToggle(b.checked);
      renderSheet();
      break;
    }
    case "sndtoggle": {
      document.getElementById("snd")?.click();
      setTimeout(() => {
        if (ui.sheet) renderSheet();
      }, 50);
      break;
    }
    case "dexport": {
      dataExport();
      break;
    }
    case "plus": {
      sfx("flip");
      openSheet({ mode: "plus", r: b.dataset.r || "" });
      break;
    }
    case "plusgo": {
      plusGo();
      break;
    }
    case "todo": {
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
      break;
    }
    case "qpick": {
      ui.qpick = b.dataset.r || null;
      sfx("tap");
      render();
      if (sheet.open) renderSheet();
      break;
    }
    case "qput": {
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
        `${b.dataset.w === "first" ? "Put first" : "Added at the end"}: no. ${n} in the ${ty === "les" ? SUBJ[b.dataset.s] : WT[ty][0].toLowerCase()} queue. See Plan → Queue.`,
        4500,
      );
      render();
      if (sheet.open) renderSheet();
      break;
    }
    case "qmv": {
      const ty = b.dataset.ty,
        s = b.dataset.s,
        L = qItems(ty, s).map((x) => x.ref),
        i = L.indexOf(b.dataset.r),
        j = i + +b.dataset.d;
      if (i < 0 || j < 0 || j >= L.length) break;
      [L[i], L[j]] = [L[j], L[i]];
      ui.flash = b.dataset.r;
      setTimeout(() => {
        ui.flash = null;
      }, 1500);
      sfx("tap");
      setOrder(ty, s, L);
      break;
    }
    case "qshuf": {
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
      break;
    }
    case "qx": {
      const ty = b.dataset.ty,
        r = b.dataset.r,
        key = r.slice(r.indexOf(":") + 1);
      if (ty !== "les" && b.dataset.how !== "skip") {
        unQueue(ty, key);
        sfx("flip");
        commit();
        if (sheet.open) renderSheet();
        toast("Taken out of the queue");
        break;
      }
      if (ty === "les") {
        const s = b.dataset.s;
        S.extra = { ...(S.extra || {}), [s]: ((S.extra || {})[s] || []).filter((x) => x !== key) };
        S.next = { ...(S.next || {}), [s]: ((S.next || {})[s] || []).filter((x) => x !== key) };
      } else {
        const W = WK();
        W[key] = { ...(W[key] || {}), st: "skip" };
        WQ()[ty] = (WQ()[ty] || []).filter((x) => x !== r);
      }
      sfx("flip");
      commit();
      toast("Taken out. You can bring it back from its chapter.");
      break;
    }
    case "hty": {
      ui.hty = b.dataset.t;
      ui.hn = 25;
      sfx("tap");
      render();
      break;
    }
    case "hs": {
      ui.hs = b.dataset.s;
      ui.hn = 25;
      sfx("tap");
      render();
      break;
    }
    case "hmore": {
      ui.hn = (ui.hn || 25) + 25;
      render();
      break;
    }
    case "morejg": {
      ui.jg = (ui.jg || 0) + 1;
      sfx("flip");
      renderSheet();
      break;
    }
    case "tdtick": {
      const x = (S.todos || []).find((z) => z.id === b.dataset.t);
      if (x) {
        x.done = !x.done;
        x.doneOn = x.done ? today : null;
        sfx(x.done ? "tick" : "flip");
        commit();
      }
      break;
    }
    case "tdadd": {
      ui.tdAdd = !ui.tdAdd;
      break;
    }
    case "subtog": {
      const s = b.dataset.s,
        on = S.subjects.includes(s);
      if (on && S.subjects.length < 2) {
        sfx("no");
        toast("Keep at least one subject");
        break;
      }
      S.subjects = on ? S.subjects.filter((x) => x !== s) : SUBJ_KEYS.filter((x) => x === s || S.subjects.includes(x));
      if (!on) {
        S.levels = { ...S.levels, [s]: S.levels?.[s] || S.levels?.sci || 1 };
      }
      sfx(on ? "flip" : "ok");
      commit();
      toast(on ? `${SUBJ[s]} left out. Its progress is kept.` : `${SUBJ[s]} added. It's in Today and the Queue now.`);
      break;
    }
    case "pacego": {
      navPush();
      ui.seg = { ...(ui.seg || {}), week: "family" };
      sfx("flip");
      render();
      setTimeout(() => document.getElementById("paceSec")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      break;
    }
    case "ist": {
      const key = k + "|" + b.dataset.id,
        W = WK(),
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
      break;
    }
    case "quizgo": {
      sfx("flip");
      ui.qrun = null;
      ui.qzv = null;
      openSheet({ mode: "quizz" });
      break;
    }
    case "qall": {
      ui.qall = !ui.qall;
      sfx("tap");
      render();
      break;
    }
    case "tofinish": {
      navPush();
      tab = "week";
      ui.seg = { ...(ui.seg || {}), week: "finish" };
      sfx("flip");
      render();
      scrollTo(0, 0);
      break;
    }
    case "qzresume": {
      sfx("flip");
      ui.qrun = { ...S.qzopen.run, i: S.qzopen.run.res.length, cur: null };
      ui.qzv = null;
      openSheet({ mode: "quizz" });
      break;
    }
    case "rfset": {
      sfx("flip");
      openSheet({ mode: "rfset" });
      break;
    }
    case "qzset": {
      const Z = (ui.qz = ui.qz || {}),
        v = b.dataset.v;
      Z[b.dataset.key] = /^\d+$/.test(v) ? +v : v;
      sfx("tap");
      renderSheet();
      break;
    }
    case "qzstart": {
      const Z = ui.qz,
        N = Z.by === "n" ? Z.n : Z.m * 2,
        P = quizPool(Z.s, Z.focus);
      if (!P.length) break;
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
      break;
    }
    case "qans": {
      const q = (window._qmap || {})[b.dataset.id];
      if (!q) break;
      const c = b.dataset.c != null ? +b.dataset.c : null,
        r = c != null ? c === q.ans : b.dataset.r === "1";
      qRecord(q, r);
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
      break;
    }
    case "qznext": {
      const R = ui.qrun;
      if (R) {
        R.i++;
        R.cur = null;
        qzKeep();
        save();
      }
      sfx("tap");
      renderSheet();
      break;
    }
    case "qzstop": {
      const R = ui.qrun;
      if (R) {
        R.qs = R.qs.slice(0, R.res.length);
        R.i = R.qs.length;
      }
      renderSheet();
      break;
    }
    case "qzagain": {
      ui.qrun = null;
      renderSheet();
      break;
    }
    case "qzend": {
      ui.qrun = null;
      goBack();
      break;
    }
    case "qzpast": {
      ui.qzv = b.dataset.id;
      renderSheet();
      break;
    }
    case "qzback": {
      ui.qzv = null;
      renderSheet();
      break;
    }
    case "qgen": {
      qGen();
      break;
    }
    case "rfmix": {
      const g = b.dataset.g,
        t = b.dataset.t,
        R = RFS(),
        v = Math.max(0, Math.min(100, R[g].mix[t] + +b.dataset.d));
      S.rfs = { ...(S.rfs || {}), [g]: { ...((S.rfs || {})[g] || {}), mix: { ...R[g].mix, [t]: v } } };
      delete (S.rfp || {})[today];
      sfx("tap");
      commit();
      renderSheet();
      break;
    }
    case "rfday": {
      const R = RFS(),
        d = +b.dataset.d,
        days = R.days.includes(d) ? R.days.filter((x) => x !== d) : [...R.days, d];
      S.rfs = { ...(S.rfs || {}), days };
      delete (S.rfp || {})[today];
      sfx("tap");
      commit();
      renderSheet();
      break;
    }
    case "dts": {
      ui.dts = b.dataset.s;
      sfx("tap");
      render();
      break;
    }
    case "dtreset": {
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
      break;
    }
    case "wfguide": {
      sfx("flip");
      openSheet({ mode: "wfguide" });
      break;
    }
    case "wsprint": {
      const u = unitByK(k),
        w = wsOf(u)[+b.dataset.i];
      if (w) {
        sfx("ok");
        printDoc(wsPage(w, u));
      }
      break;
    }
    case "wssave": {
      const u = unitByK(k),
        w = wsOf(u)[+b.dataset.i];
      if (w) saveDoc(wsPage(w, u), `${w.title.replace(/[^\w ]+/g, "").trim()}.html`);
      break;
    }
    case "wsview": {
      sfx("flip");
      openSheet({ mode: "wsv", k, i: +b.dataset.i });
      break;
    }
    case "plv":
    case "pdep": {
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
      break;
    }
    case "cgprint": {
      const u = unitByK(k);
      if (u?.c?.p?.game) {
        sfx("ok");
        printDoc(wsPage(gameSheet(u), u));
      }
      break;
    }
    case "cgview": {
      sfx("flip");
      openSheet({ mode: "wsv", k, game: 1 });
      break;
    }
    case "tqt": {
      ui.tq = b.dataset.t;
      ui.qpick = null;
      sfx("tap");
      render();
      break;
    }
    case "qzs": {
      sfx("flip");
      openSheet({ mode: "qzs", k, n: +b.dataset.n });
      break;
    }
    case "dkmin": {
      const i = Math.max(0, DKSTEPS.indexOf(dkMinsOf()));
      S.dkMins = DKSTEPS[Math.min(DKSTEPS.length - 1, Math.max(0, i + +b.dataset.d))];
      sfx("tap");
      commit();
      break;
    }
    case "lt": {
      navPush();
      ui.lt = b.dataset.t;
      sfx("tap");
      render();
      break;
    }
    case "invadd": {
      S.inv = [
        ...(S.inv || []),
        { id: Math.random().toString(36).slice(2, 9), name: b.dataset.n, cat: b.dataset.c || "other", from: "tap" },
      ];
      sfx("ok");
      toast("Added to what we have");
      commit();
      break;
    }
    case "invnew": {
      const n = document.getElementById("invName").value.trim();
      if (!n) return;
      S.inv = [
        ...(S.inv || []),
        { id: Math.random().toString(36).slice(2, 9), name: n, cat: document.getElementById("invCat").value },
      ];
      sfx("ok");
      commit();
      clearIn("invName");
      break;
    }
    case "signout": {
      window.DK_PLATFORM?.signOut?.();
      break;
    }
    case "invsel": {
      ui.invSel = ui.invSel === b.dataset.i ? null : b.dataset.i;
      sfx("tap");
      render();
      break;
    }
    case "invdel": {
      S.inv = (S.inv || []).filter((i) => i.id !== b.dataset.i);
      sfx("flip");
      commit();
      break;
    }
    case "lvl": {
      const s = b.dataset.s;
      S.levels[s] = Math.min(5, Math.max(1, S.levels[s] + +b.dataset.d));
      ui.view[s] = S.levels[s];
      sfx("tick");
      commit();
      break;
    }
    case "day": {
      const s = b.dataset.s,
        d = +b.dataset.d,
        cur = new Set(daysOf(s));
      cur.has(d) ? cur.delete(d) : cur.add(d);
      if (cur.size) {
        S.days = { ...S.days, [s]: [...cur].sort() };
        sfx("tap");
        commit();
      }
      break;
    }
    case "lsub": {
      ui.lsub = b.dataset.s;
      sfx("tap");
      render();
      break;
    }
    case "view": {
      ui.view[b.dataset.s] = +b.dataset.l;
      sfx("tap");
      render();
      break;
    }
    case "setlvl": {
      S.levels[b.dataset.s] = +b.dataset.l;
      sfx("tick");
      commit();
      break;
    }
    case "check": {
      const x = S.exps.find((x) => x.id === b.dataset.e);
      if (x && !x.checks.includes(today)) {
        x.checks.push(today);
        sfx("ok");
        commit();
      }
      break;
    }
    case "close": {
      const x = S.exps.find((x) => x.id === b.dataset.e);
      if (x) {
        x.closed = true;
        x.end = today;
        sfx("win");
        confetti();
        toast("Finished: " + x.title);
        commit();
      }
      break;
    }
    case "addexp": {
      const v = document.getElementById("newExp").value.trim();
      if (v) {
        addExp(v, "Our own experiment");
        sfx("ok");
        commit();
        clearIn("newExp");
      }
      break;
    }
    case "joke": {
      ui.jokes[b.dataset.j] = !ui.jokes[b.dataset.j];
      sfx(ui.jokes[b.dataset.j] ? "ok" : "flip");
      sheet.open ? renderSheet() : render();
      break;
    }
    case "gtab": {
      ui.game = b.dataset.g;
      sfx("tap");
      renderSheet();
      break;
    }
    case "wk": {
      const u = dailyUnit();
      if (!u) return;
      const word = u.c.x.words[dayNo % u.c.x.words.length],
        g = G();
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
      break;
    }
    case "tf": {
      const u = dailyUnit(),
        q = u.c.x.quiz[+b.dataset.i];
      G().tf[b.dataset.i] = +b.dataset.v;
      sfx((+b.dataset.v === 1) === q[1] ? "ok" : "no");
      if (Object.keys(G().tf).length === u.c.x.quiz.length) setTimeout(() => sfx("win"), 300);
      commit();
      break;
    }
    case "odd": {
      const u = dailyUnit(),
        o = u.c.x.odd[dayNo % u.c.x.odd.length],
        g = G();
      if (!g.odd) {
        g.odd = b.dataset.w;
        sfx(g.odd === o[1] ? "win" : "no");
        if (g.odd === o[1]) confetti();
        commit();
      }
      break;
    }
    case "mcq": {
      setA(k, b.dataset.id, +b.dataset.o);
      sfx(+b.dataset.o === +b.dataset.a ? "ok" : "no");
      commit();
      break;
    }
    case "mcqreset": {
      delete S.ans[k][b.dataset.id];
      sfx("flip");
      commit();
      break;
    }
    case "checkfill": {
      const ans = JSON.parse(b.dataset.a),
        v = A(k, b.dataset.id) || [],
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
      break;
    }
    case "showfill": {
      sfx("flip");
      toast(b.dataset.a);
      break;
    }
    case "fadd": {
      const v = A(k, b.dataset.id) || { fs: [] },
        sel =
          (ui.fsel || {})[k + b.dataset.id] || document.querySelector(`[data-fsel][data-fid="${b.dataset.id}"]`)?.value;
      if (sel) {
        setA(k, b.dataset.id, { fs: [...(v.fs || []), { name: sel, dir: b.dataset.dir }], checked: false });
        sfx("tap");
        commit();
      }
      break;
    }
    case "fdel": {
      const v = A(k, b.dataset.id) || { fs: [] };
      setA(k, b.dataset.id, { fs: (v.fs || []).filter((_, i) => i !== +b.dataset.i), checked: false });
      commit();
      break;
    }
    case "fcheck": {
      const v = A(k, b.dataset.id) || { fs: [] };
      setA(k, b.dataset.id, { ...v, checked: true });
      sfx("flip");
      commit();
      break;
    }
    case "fshow": {
      const v = A(k, b.dataset.id) || { fs: [] };
      setA(k, b.dataset.id, { ...v, shown: true });
      commit();
      break;
    }
    case "aidraw": {
      aiCheckDraw(k, b.dataset.id);
      break;
    }
    case "drew": {
      if (A(k, b.dataset.id)) delete S.ans[k][b.dataset.id];
      else {
        setA(k, b.dataset.id, today);
        sfx("ok");
      }
      commit();
      break;
    }
    case "tok": {
      const key = k + b.dataset.id;
      ui.sel[key] = ui.sel[key] === b.dataset.x ? undefined : b.dataset.x;
      sfx("tap");
      renderSheet();
      break;
    }
    case "bucket": {
      const sel = ui.sel[k + b.dataset.id];
      if (sel === undefined) return;
      const v = { ...(A(k, b.dataset.id) || {}) };
      v[sel] = +b.dataset.c;
      setA(k, b.dataset.id, v);
      ui.sel[k + b.dataset.id] = undefined;
      sfx("tick");
      commit();
      break;
    }
    case "untok": {
      const v = { ...(A(k, b.dataset.id) || {}) };
      delete v[b.dataset.x];
      setA(k, b.dataset.id, v);
      sfx("flip");
      commit();
      break;
    }
    case "mleft": {
      ui.sel[k + b.dataset.id] = b.dataset.x;
      sfx("tap");
      renderSheet();
      break;
    }
    case "mright": {
      const l = ui.sel[k + b.dataset.id];
      if (!l) {
        sfx("no");
        toast("Tap a word on the left first");
        return;
      }
      const v = { ...(A(k, b.dataset.id) || {}) };
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
      break;
    }
    case "mreset": {
      setA(k, b.dataset.id, {});
      sfx("flip");
      commit();
      break;
    }
    case "clearpad": {
      const c = document.querySelector(`canvas[data-pad="${CSS.escape(b.dataset.pad)}"]`);
      if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height);
      sfx("flip");
      break;
    }
    case "saveset": {
      S.child = document.getElementById("sName").value.trim();
      const v = document.getElementById("sStart").value;
      if (v) S.start = v;
      sfx("ok");
      S.updatedAt = Date.now();
      render();
      saveNow().then((ok) =>
        toast(ok || !store ? "Saved" : "Couldn't reach your account. Saved on this phone; it will retry."),
      );
      break;
    }
    case "redo": {
      sheet.close();
      startOnboarding(1);
      break;
    }
  }
}
/* event dialog */
const evd = document.getElementById("evd");
let evRep = "once";
const [evForm, eDate, eErr, eDays, eRep, eDateF, eDaysF, eTitle, eEnd, eStart, eKind, eWho, eNote] = [
  "evForm",
  "eDate",
  "eErr",
  "eDays",
  "eRep",
  "eDateF",
  "eDaysF",
  "eTitle",
  "eEnd",
  "eStart",
  "eKind",
  "eWho",
  "eNote",
].map((id) => document.getElementById(id));
function openEv() {
  evForm.reset();
  eDate.value = ui.wday || today;
  evRep = "once";
  syncEv();
  eErr.hidden = true;
  eDays.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
  sfx("tap");
  evd.showModal();
}
function syncEv() {
  eRep.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x.dataset.rep === evRep));
  eDateF.hidden = evRep !== "once";
  eDaysF.hidden = evRep === "once";
}
const pick = document.getElementById("pick");
function openPicker() {
  document.getElementById("pickList").replaceChildren(
    el(
      everyUnit()
        .map(
          (u) =>
            `<button class="unit ${SC(u.subj)}" style="grid-template-columns:44px 1fr" data-k="${u.k}"><span class="no">${/^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span><b>${esc(u.title)}</b><br><span class="xs muted">${SUBJ[u.subj]} · Level ${u.level}</span></span></button>`,
        )
        .join(""),
    ),
  );
  sfx("tap");
  pick.showModal();
}
