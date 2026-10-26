/* Start-up: event wiring, timers and boot, in the order they must run */
try {
  soundOn = localStorage.getItem("dk-sound") !== "off";
} catch (e) {}
addEventListener("pagehide", () => {
  if (store && saveTimer) {
    clearTimeout(saveTimer);
    writeNow();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && store) {
    clearTimeout(saveTimer);
    writeNow();
  }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset?.fsel) {
    ui.fsel = { ...(ui.fsel || {}), [t.dataset.fk + t.dataset.fid]: t.value };
    renderSheet();
  }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "wsPhoto") {
    aiCheckPhoto(e.target.dataset.k, [...e.target.files].slice(0, 4));
  }
});
/* re-check the profile once a day */
document.addEventListener("change", (e) => {
  const s = e.target.dataset?.pauto;
  if (!s) return;
  S.prof = { ...(S.prof || {}), [s]: { ...((S.prof || {})[s] || {}), auto: e.target.checked } };
  save();
  render();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hiddenAt = Date.now();
    return;
  }
  if (hiddenAt && Date.now() - hiddenAt > 20000 && ui.tday) {
    ui.tday = null;
    render();
  }
  hiddenAt = 0;
});
SFX.chime = () => {
  tone(988, 0, 0.1, "sine", 0.07);
  tone(1319, 0.07, 0.16, "sine", 0.05);
};
document.addEventListener("click", (e) => {
  const m = e.target.closest?.(".mascot");
  if (!m || e.target.closest("button,a")) return;
  m.classList.remove("wig");
  void m.getBoundingClientRect();
  m.classList.add("wig");
  sfx("chime");
  const r = m.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top, MTIPS[Math.floor(Math.random() * MTIPS.length)]);
});
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.("[data-act]");
    if (!b) return;
    const a = b.dataset.act;
    if (
      (a === "wkst" && b.dataset.to === "done") ||
      (a === "qz" && b.dataset.r === "1") ||
      a === "evsave" ||
      a === "iofin" ||
      a === "iodone" ||
      a === "drew"
    )
      setTimeout(() => sfx("chime"), 120);
  },
  true,
);
document.addEventListener(
  "click",
  () => {
    lastTap = Date.now();
  },
  true,
);
document.addEventListener("input", (e) => {
  if (e.target.id === "dumpText") {
    const t = e.target;
    t.style.height = "auto";
    t.style.height = Math.min(160, t.scrollHeight) + "px";
  }
});
setInterval(() => {
  try {
    if (
      !S?.rem?.notif ||
      typeof Notification === "undefined" ||
      Notification.permission !== "granted" ||
      !document.hidden
    )
      return;
    if (Date.now() - lastNote < 2 * 36e5) return;
    const free = freeNow(),
      P = pendingWork().filter((p) => p.m <= free);
    if (free < 15 || !P.length) return;
    lastNote = Date.now();
    new Notification("DeepKids · " + hmin(free) + " free", {
      body: `Finish “${P[0].t}”? About ${hmin(P[0].m)}.`,
      tag: "dk-nudge",
    });
  } catch (e) {}
}, 5 * 6e4);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.("[data-act]");
    if (!b) return;
    const a = b.dataset.act,
      done =
        a === "pdone" ||
        (a === "wkst" && b.dataset.to === "done") ||
        (a === "qz" && b.dataset.r === "1") ||
        a === "evsave" ||
        a === "iofin" ||
        a === "iodone" ||
        a === "drew" ||
        (a === "tlcheck" &&
          b.closest(".tr") &&
          !b.closest(".tr.done") &&
          !b.closest(".tr").querySelector('[data-id^="L-"]')) ||
        (a === "task" && !b.classList.contains("done"));
    if (!done) return;
    const r = b.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, "✓ " + CHEER[Math.floor(Math.random() * CHEER.length)]);
    try {
      navigator.vibrate?.(15);
    } catch (_) {}
  },
  true,
);
setTimeout(() => {
  if (S?.cal?.on) gcSync(false);
}, 5000);
setInterval(() => {
  if (S?.cal?.on && !document.hidden && Date.now() - (S.cal.at || 0) > 15 * 6e4) gcSync(false);
}, 6e4);
document.addEventListener("pointerover", (e) => {
  const t = e.target.closest?.("[data-tip]");
  if (t) tipAt(t);
  else if (TIP) TIP.style.display = "none";
});
document.addEventListener("focusin", (e) => {
  const t = e.target.closest?.("[data-tip]");
  if (t) tipAt(t);
});
document.addEventListener(
  "scroll",
  () => {
    if (TIP) TIP.style.display = "none";
  },
  true,
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.dataset?.qa !== undefined) {
    e.preventDefault();
    qSend();
  }
});
if ("speechSynthesis" in window)
  speechSynthesis.onvoiceschanged = () => {
    _vv = null;
  };
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-vox]");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      voxCtl(b.dataset.vox);
    }
  },
  true,
);
setInterval(() => {
  const e = document.getElementById("spent");
  if (e && sheet.open) e.textContent = mmss(stepSecs());
}, 1000);
document.addEventListener("change", (e) => {
  if (e.target.id === "invImg") {
    ui.idump = ui.idump || {};
    ui.idump.text = document.getElementById("invText")?.value || "";
    ui.idump.files = [...e.target.files].slice(0, 4);
    render();
  }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "rcSel") {
    ui.rc = e.target.value;
    ui.rmore = 40;
    delete e.target.dataset.dirty;
    render();
  }
});
addEventListener("popstate", () => navBack());
document
  .querySelector("header.top .wrap")
  .insertAdjacentHTML(
    "afterbegin",
    `<button class="iconbtn" id="backTop" aria-label="Back" hidden>${icon("back")}</button>`,
  );
document.getElementById("backTop").onclick = goBack;
document.getElementById("guideBtn").onclick = onGuideBtn;
addEventListener("resize", guideResize);
document.addEventListener("change", (e) => {
  if (e.target.id === "mbFile") onMyBookFiles(e.target.files);
});
document.addEventListener(
  "input",
  (e) => {
    if (e.target.id) e.target.dataset.dirty = "1";
  },
  true,
);
document.addEventListener(
  "change",
  (e) => {
    if (e.target.id) e.target.dataset.dirty = "1";
  },
  true,
);
/* uploads, night inputs, alarm and the clock */
document.addEventListener("change", async (e) => {
  const t = e.target;
  if (t.id === "obExam" && ob) {
    ob.d.exam = t.checked;
    return;
  }
  if (t.id === "sMode") {
    S.mode = t.value;
    S.plus = t.value !== "books";
    sfx("tick");
    commit();
    return;
  }
  if (t.id === "sExam") {
    S.exam = t.checked;
    sfx("tick");
    commit();
    return;
  }
  if (t.dataset.remf) {
    REM()[t.dataset.remf] = t.value;
    commit();
    return;
  }
  if (t.dataset.remck) {
    const R = REM(),
      k = t.dataset.remck;
    if (k === "notif" && t.checked && typeof Notification !== "undefined") {
      Notification.requestPermission()
        .then((p) => {
          R.notif = p === "granted";
          if (!R.notif) toast("Pop-ups were not allowed on this phone");
          commit();
        })
        .catch(() => {
          R.notif = false;
          toast("Pop-ups aren't available here");
          commit();
        });
      return;
    }
    R[k] = t.checked;
    commit();
    return;
  }
  if (t.dataset.tsel) {
    const T = tSetup();
    T[t.dataset.tsel] = t.value;
    sfx("tap");
    commit();
    return;
  }
  if (t.dataset.zip) {
    const Z = zipSel();
    t.checked ? Z[t.dataset.zip].add(t.value) : Z[t.dataset.zip].delete(t.value);
    ui.zip = null;
    render();
    return;
  }
  if (t.dataset.evf) {
    const e = (S.events || []).find((x) => x.id === t.dataset.id);
    if (e) {
      e[t.dataset.evf] = t.value || (t.dataset.evf === "title" ? e.title : null);
      save();
    }
    return;
  }
  if (t.id === "importFile" && t.files?.[0]) {
    const f = t.files[0];
    t.value = "";
    dataImport(f);
    return;
  }
  if (t.id === "upFiles" && t.files?.length) {
    const F = [...t.files];
    t.value = "";
    upFiles(F);
    return;
  }
  if (t.dataset.upk !== undefined) {
    const w = (S.work || []).find((x) => x.id === t.dataset.upk);
    if (w) {
      w.k = t.value;
      sfx("tap");
      commit();
    }
    return;
  }
  if (t.dataset.sch) {
    S.school = { ...(S.school || {}), [t.dataset.sch]: t.value };
    save();
    return;
  }
  if (t.id === "icsFile" && t.files?.[0]) {
    let items = [];
    try {
      items = parseICS(await t.files[0].text());
    } catch (err) {}
    ui.dump = { items, questions: [], text: "", err: items.length ? "" : "No upcoming events found in that file." };
    sfx(items.length ? "ok" : "no");
    render();
    setTimeout(() => document.querySelector(".dump")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return;
  }
  if (t.id === "dumpImg") {
    ui.dump = ui.dump || {};
    ui.dump.text = document.getElementById("dumpText")?.value || "";
    ui.dump.files = [...t.files].slice(0, 4);
    render();
    return;
  }
  if (t.dataset.upload && t.files?.length) {
    if (!ASSETS) {
      toast("Photos can't be saved in this view");
      return;
    }
    const k = t.dataset.upload,
      u = unitBy(k);
    toast("Saving photo…");
    try {
      for (const f of [...t.files].slice(0, 4)) {
        const r = await ASSETS.upload(f);
        S.work = [...(S.work || []), { id: r.id, k, date: today, title: u?.title || "" }];
      }
      sfx("ok");
      toast("Photo saved to the journey");
      commit();
    } catch (err) {
      toast(
        {
          too_large: "That photo is too big (20 MB limit)",
          unsupported_type: "Use a JPG, PNG or WebP photo",
          quota_or_state: "Photo storage is full",
        }[err?.code] || "Couldn't save the photo. Try again.",
      );
    }
    return;
  }
  if (t.dataset.alarm) {
    S.alarm = {
      ...(S.alarm || { on: false, time: "06:30" }),
      [t.dataset.alarm]: t.type === "checkbox" ? t.checked : t.value,
    };
    S.updatedAt = Date.now();
    save();
    return;
  }
  if (t.dataset.over) {
    S.dayOver = {
      ...(S.dayOver || {}),
      [t.dataset.over]: { ...((S.dayOver || {})[t.dataset.over] || {}), start: t.value },
    };
    S.updatedAt = Date.now();
    save();
    return;
  }
});
setInterval(() => {
  const nm = nowMin();
  if (nm === lastMin) return;
  lastMin = nm;
  const al = S.alarm;
  if (al?.on && clock24(nm) === al.time && !rang[today]) {
    rang[today] = 1;
    let n = 0;
    const ring = () => {
      if (n++ < 6) {
        sfx("win");
        setTimeout(ring, 1600);
      }
    };
    ring();
    toast(greetWord() + (pname() ? ", " + pname() : "") + "! Time to get up");
  }
  const busy = document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (!busy && !(ui.sheet && sheet.open) && (rollDay() || tab === "today")) render();
}, 20000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !(ui.sheet && sheet.open)) {
    rollDay();
    render();
  }
});
document.getElementById("hello").onclick = () => {
  if (ACC && !ob && S.setup) {
    sfx("flip");
    openSheet({ mode: "parent" });
  }
};
(async () => {
  try {
    DBH = (await window.claude?.use?.("db")) || null;
    const us = await window.claude?.use?.("user");
    UID = us ? await us.id().catch(() => null) : null;
    if (us) {
      const me = await us.me().catch(() => null);
      ACCT =
        String(me?.name || "")
          .trim()
          .split(/\s+/)[0] || "";
      ACCT = ACCT ? ACCT[0].toUpperCase() + ACCT.slice(1) : "";
      render();
    }
    if (DBH) {
      const sn = await DBH.collection("topics")
        .limit(500)
        .get()
        .catch(() => null);
      if (sn)
        SHARED.topics = sn.docs
          .map((d) => {
            const g = d.data() || {};
            return { ...g, id: d.id, level: Math.min(5, Math.max(1, +g.level || 1)), hours: +g.hours || 3 };
          })
          .filter((g) => g.name && SUBJ[g.subj]);
      _all = null;
    }
  } catch (e) {}
  try {
    SAMPLE = (await window.claude?.use?.("sample")) || null;
    ASSETS = (await window.claude?.use?.("assets")) || null;
    if (SAMPLE) {
      const l = await SAMPLE.limits().catch(() => null);
      IMGOK = !!l?.images;
    }
  } catch (e) {}
  render();
})();
document.getElementById("sheetClose").onclick = () => {
  sfx("tap");
  goBack();
};
sheet.addEventListener("close", () => {
  if (sheet.open) return;
  ui.phelp = null;
  sheet.className = "sheet";
  ui.sheet = null;
  clearInterval(tick);
  render();
  updBack();
});
document.getElementById("nav").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-tab]");
  if (!b) return;
  const m = document.getElementById("main");
  m.classList.remove("enter");
  void m.offsetWidth;
  m.classList.add("enter");
  setTimeout(() => m.classList.remove("enter"), 700);
  if (tab !== b.dataset.tab) navPush();
  tab = b.dataset.tab;
  sfx("tap");
  render();
  scrollTo(0, 0);
});
document.getElementById("snd").onclick = () => {
  soundOn = !soundOn;
  try {
    localStorage.setItem("dk-sound", soundOn ? "on" : "off");
  } catch (e) {}
  sfx("tick");
  render();
};
document.getElementById("me").onclick = () => {
  sfx("tap");
  openSheet({ mode: "settings" });
};
document.getElementById("main").addEventListener("click", onAct);
document.getElementById("sheetBody").addEventListener("click", onAct);
document.addEventListener("input", (e) => {
  const t = e.target;
  if (!t.dataset.ans) return;
  const [k, id, sub] = t.dataset.ans.split("|");
  if (sub === undefined) setA(k, id, t.value);
  else if (sub.includes(".")) {
    const v = { ...(A(k, id) || {}) };
    v[sub] = t.value;
    setA(k, id, v);
  } else {
    const v = [...(A(k, id) || [])];
    v[+sub] = t.value;
    setA(k, id, v);
  }
  S.updatedAt = Date.now();
  save();
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.dt) {
    const f = t.dataset.dt,
      v = t.type === "time" ? t.value : +t.value,
      sc = ui.dts || "all";
    if (!v && t.type === "time") return;
    if (sc === "all") S.day = { ...D(), [f]: v };
    else if (sc[0] === "w") {
      const w = sc.slice(1);
      S.dayW = { ...(S.dayW || {}), [w]: { ...((S.dayW || {})[w] || {}), [f]: v } };
    } else {
      const d = sc.slice(2);
      S.dayOver = { ...(S.dayOver || {}), [d]: { ...((S.dayOver || {})[d] || {}), [f]: v } };
    }
    sfx("tap");
    commit();
    return;
  }
  if (t.id === "dtDate" && t.value) {
    ui.dts = "d:" + t.value;
    sfx("tap");
    render();
    return;
  }
  if (t.dataset.rfe) {
    S.rfs = { ...(S.rfs || {}), [t.dataset.rfe]: { ...((S.rfs || {})[t.dataset.rfe] || {}), every: +t.value } };
    delete (S.rfp || {})[today];
    sfx("tap");
    commit();
    renderSheet();
    return;
  }
  if (t.id === "rfmins") {
    S.rfs = { ...(S.rfs || {}), mins: +t.value };
    delete (S.rfp || {})[today];
    sfx("tap");
    commit();
    renderSheet();
    return;
  }
  if (t.dataset.dayset) {
    S.day = { ...D(), [t.dataset.dayset]: t.type === "time" ? t.value : +t.value };
    sfx("tap");
    commit();
    return;
  }
  if (t.matches("select[data-hpd]")) {
    const s = t.dataset.hpd,
      v = +t.value;
    sfx("tap");
    if (ob) ob.d.hpd = { ...(ob.d.hpd || DEF_HPD), [s]: v };
    else {
      S.hpd = { ...(S.hpd || DEF_HPD), [s]: v };
      commit();
    }
    return;
  }
  if (ob && t.matches("#obPlus")) {
    ob.d.plus = t.checked;
    sfx("tap");
    return;
  }
  if (ob && t.matches("select[data-s]")) {
    ob.d.levels[t.dataset.s] = +t.value;
    sfx("tap");
  }
});
document.getElementById("eDays").innerHTML = [1, 2, 3, 4, 5, 6, 0]
  .map((d) => `<button type="button" data-d="${d}" aria-pressed="false">${DAYN[d]}</button>`)
  .join("");
eRep.addEventListener("click", (e) => {
  const x = e.target.closest("button");
  if (!x) return;
  evRep = x.dataset.rep;
  syncEv();
  sfx("tap");
});
eDays.addEventListener("click", (e) => {
  const x = e.target.closest("button");
  if (!x) return;
  x.setAttribute("aria-pressed", x.getAttribute("aria-pressed") !== "true");
  sfx("tap");
});
evForm.addEventListener("submit", (e) => {
  if (!e.submitter || e.submitter.value !== "save") return;
  const days = [...eDays.querySelectorAll('[aria-pressed="true"]')].map((x) => +x.dataset.d);
  const err = !eTitle.value.trim()
    ? "Give it a name."
    : evRep === "weekly" && !days.length
      ? "Pick at least one day."
      : evRep === "once" && !eDate.value
        ? "Pick a date."
        : hm(eEnd.value) <= hm(eStart.value)
          ? "The end time must be after the start."
          : "";
  if (err) {
    e.preventDefault();
    eErr.textContent = err;
    eErr.hidden = false;
    sfx("no");
    return;
  }
  S.events = [
    ...(S.events || []),
    {
      id: Math.random().toString(36).slice(2, 9),
      title: eTitle.value.trim(),
      kind: eKind.value,
      who: eKind.value === "outing" && eWho.value === "kid" ? "both" : eWho.value,
      start: eStart.value,
      end: eEnd.value,
      rep: evRep,
      date: evRep === "once" ? eDate.value : null,
      days: evRep === "weekly" ? days : [],
      from: today,
      note: eNote.value.trim(),
    },
  ];
  sfx("ok");
  toast("Added to the day");
  commit();
});
document.getElementById("pickList").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const u = unitBy(b.dataset.k);
  if (u) {
    logSession(u, "free");
    pick.close();
    sfx("ok");
    toast("Logged");
    commit();
  }
});
document.getElementById("pickClose").onclick = () => pick.close();
try {
  EDITS = JSON.parse(localStorage.getItem("dk-edits") || "{}") || {};
} catch (e) {
  EDITS = {};
}
setTimeout(editsInit, 0);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.(".dkedb");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      EDITING = !EDITING;
      editBtn();
      applyAll();
      toast(EDITING ? "Edit mode: tap any text to change it" : "Edit mode off");
      return;
    }
    if (!EDITING || e.target.closest?.("#dkEditDlg")) return;
    e.preventDefault();
    e.stopPropagation();
    const n = textAt(e.clientX, e.clientY, e.target);
    if (n) openEditor(n);
    else toast("Tap right on the words");
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.("[data-act=fxopen]");
    if (b) {
      e.stopPropagation();
      fxOpen(b.dataset.u);
    }
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.("[data-act=fxsong]");
    if (b) {
      e.stopPropagation();
      fxOpenSong(b.dataset.s);
    }
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest('[data-act="fxq"]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const s = b.dataset.s,
      k = b.dataset.k,
      ex = (S.extra || {})[s] || [];
    if (!S.subjects.includes(s)) {
      S.subjects = [...S.subjects, s];
      S.levels = { ...S.levels, [s]: S.levels[s] || 3 };
    }
    ui.qs = s; // Plan > Up next opens on this subject
    ui.tq = "les";
    S.extra = { ...(S.extra || {}), [s]: [...new Set([...ex, k])] };
    if (b.dataset.front) S.next = { ...(S.next || {}), [s]: [k, ...((S.next || {})[s] || []).filter((x) => x !== k)] };
    commit();
    sfx("ok");
    toast(
      b.dataset.front
        ? "Added to the plan. It comes next in " + SUBJ[s] + "."
        : "Added to the plan, at the end of " + SUBJ[s] + ".",
      5000,
    );
    render();
  },
  true,
);
document.addEventListener(
  "click",
  async (e) => {
    const b = e.target.closest('[data-act="fxpart"]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    await fxOpen(b.dataset.u);
    const i = (FXALL?.sections || []).findIndex((s) => s.id === b.dataset.p);
    if (i >= 0) fxGo(i, 0);
  },
  true,
);
/* units are ordinary lessons in DATA.items (board "unit", key "unit|<id>"), so search, browse and related links find them;
   opening one shows its feed instead of a chapter sheet */
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.('[data-act="chapter"][data-k^="unit|"]');
    if (b) {
      e.stopImmediatePropagation();
      e.preventDefault();
      fxOpen(b.dataset.k.slice(5));
    }
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest?.("[data-act=fxpractise]");
    if (b) {
      e.stopImmediatePropagation();
      fxPractise(b.dataset.u);
    }
  },
  true,
);
/* unit parts join the app's Started, Pending and History lists */
/* hooks: stamp the date a part is finished; note the first day of a multi-day experiment or project */
/* paper work: a parent can mark a worksheet done when it was done on paper */
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest('[data-fx="paper"]');
    if (!b || !FXU) return;
    e.preventDefault();
    e.stopPropagation();
    const D = (fxSt().done[FXU.id] = fxSt().done[FXU.id] || {});
    D["man:" + b.dataset.id] = 1;
    D["sec:" + b.dataset.id] = 1;
    fxStamp(FXU.id);
    save();
    b.textContent = "✔ Marked done";
    b.disabled = true;
    toast("Marked done. It moves to History.");
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxprac]");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      fxPractise(b.dataset.fxprac);
      return;
    }
    const r = e.target.closest("[data-fxrev]");
    if (r) {
      const R = (S.fxRev = S.fxRev || {}),
        o = R[r.dataset.fxrev] || { n: 0 };
      R[r.dataset.fxrev] = { n: o.n + 1, at: today };
      save();
    }
  },
  true,
);
document.addEventListener(
  "change",
  (e) => {
    const c = e.target.closest("[data-fxtick]");
    if (!c) return;
    S.prep = { ...S.prep, [c.dataset.fxtick]: c.checked ? today : 0 };
    save();
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxbought]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const k = b.dataset.fxbought,
      B = (S.bought = S.bought || {});
    if (B[k]) delete B[k];
    else B[k] = today;
    commit();
    b.textContent = B[k] ? "✔ We have it: added to the plan" : "We bought it";
    toast(B[k] ? "Added. The parts that use it are now in the plan." : "Removed from the plan.");
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxwt]");
    if (b) {
      e.preventDefault();
      e.stopPropagation();
      const d = +b.dataset.fxwt,
        nx = { full: "half", half: "free", free: "full" }[fxWT(d)];
      S.weekType = { ...(S.weekType || FXWT0), [d]: nx };
      commit();
      render();
      return;
    }
    const a = e.target.closest("[data-fxai]");
    if (a) {
      e.preventDefault();
      e.stopPropagation();
      S.aiPlan = fxAIOn() ? "" : "on";
      commit();
      render();
    }
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    if (fxAIOn()) return;
    // the buttons that open an AI feature open IAm's Plus page instead; the chat's own buttons are never blocked
    const b = e.target.closest('[data-fx="chat"],[data-fx="askcard"],[data-fx="photo"],.fxfab');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    fxChat("");
  },
  true,
);
new MutationObserver(() => document.body.classList.toggle("ai-locked", !fxAIOn())).observe(document.body, {
  childList: true,
});
document.body.classList.toggle("ai-locked", !fxAIOn());
// IAm follows into whichever panel opens or closes
new MutationObserver(iamFollow).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
// IAm reads on his own until something needs the family
iamIdle();
document.addEventListener(
  "click",
  (e) => {
    if (!ob) return;
    const d = ob.d,
      t = e.target;
    const tr = t.closest("[data-obtrack]");
    if (tr) {
      e.preventDefault();
      e.stopPropagation();
      d.boards = d.boards?.length ? d.boards : ["ncert"];
      d.board = d.boards[0];
      render();
      return;
    }
    const bb = t.closest("[data-obb]");
    if (bb) {
      e.preventDefault();
      e.stopPropagation();
      const k = bb.dataset.obb;
      d.boards = d.boards.includes(k) ? d.boards.filter((x) => x !== k) : [...d.boards, k];
      d.board = d.boards[0] || "ncert";
      render();
      return;
    }
    const wt = t.closest("[data-obwt]");
    if (wt) {
      e.preventDefault();
      e.stopPropagation();
      const x = +wt.dataset.obwt,
        W = { ...(d.weekType || FXWT0) };
      W[x] = { full: "half", half: "free", free: "full" }[W[x] || "full"];
      d.weekType = W;
      render();
      return;
    }
    const qz = t.closest("[data-obquiz]");
    if (qz) {
      e.preventDefault();
      e.stopPropagation();
      const s = qz.dataset.obquiz;
      ob.quiz = { s, l: d.levels[s] || obCls(d), i: 0, n: 0, k: 0, best: 0, low: 6 };
      render();
      return;
    }
    const a = t.closest("[data-obqa]");
    if (a) {
      e.preventDefault();
      e.stopPropagation();
      const Q = ob.quiz,
        v = a.dataset.obqa;
      if (v === "stop") {
        ob.quiz = null;
        render();
        return;
      }
      if (v === "1") Q.k++;
      Q.i++;
      Q.n++;
      if (Q.i < 3) {
        render();
        return;
      }
      const passed = Q.k >= 2;
      if (passed) Q.best = Math.max(Q.best, Q.l);
      else Q.low = Math.min(Q.low, Q.l);
      const next = passed ? Q.l + 1 : Q.l - 1;
      if (next >= 1 && next <= 5 && next < Q.low && next > Q.best && Q.n < 12) {
        Q.l = next;
        Q.i = 0;
        Q.k = 0;
        render();
        return;
      }
      const lvl = Math.max(1, Q.best || Math.max(1, Q.low - 1));
      d.levels[Q.s] = lvl;
      d.picked = { ...(d.picked || {}), [Q.s]: 1 };
      ob.quiz = null;
      toast(`${SUBJ[Q.s]}: starting at ${lvlLabel(lvl)}. You can change it.`, 5000);
      render();
    }
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    if (!ob) return;
    const b = e.target.closest("[data-oblvl]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const [x, l] = b.dataset.oblvl.split(":");
    ob.d.levels[x] = +l;
    ob.d.picked = { ...(ob.d.picked || {}), [x]: 1 };
    render();
  },
  true,
);
document.addEventListener(
  "change",
  (e) => {
    if (!ob) return;
    const t = e.target.closest("select[data-hpd]");
    if (!t) return;
    ob.d.hpd = { ...(ob.d.hpd || DEF_HPD), [t.dataset.hpd]: +t.value };
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxsnd]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("snd")?.click();
    setTimeout(render, 50);
  },
  true,
);
document.addEventListener(
  "scroll",
  (e) => {
    const c = e.target;
    if (!(c instanceof Element) || c.id !== "fxintro") return;
    const i = Math.round(c.scrollLeft / c.clientWidth);
    document.querySelectorAll(".fxdots i").forEach((d, j) => d.classList.toggle("on", i === j));
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const l = e.target.closest("#fxlogo");
    if (l) {
      e.preventDefault();
      e.stopPropagation();
      fxHome();
      return;
    }
    const c = e.target.closest("[data-fxcr]");
    if (c) {
      e.preventDefault();
      e.stopPropagation();
      if (+c.dataset.fxcr === 0) {
        if (tab === "today") ui.tday = null;
        else ui.seg && (ui.seg.week = undefined);
        render();
        scrollTo(0, 0);
      }
      return;
    }
    const b = e.target.closest("#backTop");
    if (!b) return;
    if (ob && ob.step > 0) {
      e.preventDefault();
      e.stopPropagation();
      if (ob.quiz) {
        ob.quiz = null;
      } else ob.step--;
      render();
      scrollTo(0, 0);
      return;
    }
    if (!navHist.length) {
      e.preventDefault();
      e.stopPropagation();
      if (ui.tday) {
        ui.tday = null;
      } else tab = "today";
      render();
      scrollTo(0, 0);
    }
  },
  true,
);
document.addEventListener(
  "click",
  (e) => {
    const c = e.target.closest("[data-fxob]");
    if (!c || !ob) return;
    e.preventDefault();
    e.stopPropagation();
    ob.quiz = null;
    ob.step = +c.dataset.fxob;
    render();
    scrollTo(0, 0);
  },
  true,
);
/* Today: no separate date bar; the greeting already says the date */
/* opening a part counts as started straight away (it goes to Plan > To finish > Started) */
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest("[data-fxsee]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    ui.qs = b.dataset.fxsee;
    ui.tq = "les";
    ui.seg = { ...(ui.seg || {}), week: "next" };
    ui.flash = b.dataset.k;
    tab = "week";
    render();
    scrollTo(0, 0);
  },
  true,
);
/* "Later today" visibly moves the item: it shows at its new time with a note, and sorts there */
/* empty inputs say what to do instead of doing nothing */
document.addEventListener(
  "click",
  (e) => {
    const b = e.target.closest('[data-act="tfind"],[data-act="invnew"]');
    if (!b) return;
    const id = b.dataset.act === "tfind" ? "tq" : "invName",
      v = (document.getElementById(id)?.value || "").trim();
    if (!v) {
      e.preventDefault();
      e.stopPropagation();
      sfx("no");
      toast(
        b.dataset.act === "tfind" ? "Type a topic to search for, like volcanoes" : "Type the name of the thing first",
      );
      document.getElementById(id)?.focus();
    }
  },
  true,
);
/* History: every finished part, named clearly (lesson parts of board chapters too, not only whole chapters) */
// To finish: units show all parts and the core path separately
boot();
