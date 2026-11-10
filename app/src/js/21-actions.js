/* What every tap does (onAct) and the event dialog */
function playItem(it, toExperiment) {
  // a DeepKids-track unit opens as the unit itself, where the family left off (or at its first experiment)
  if (it.u.board === "unit") return toExperiment ? fxOpenExperiment(it.u.c.unit) : fxOpen(it.u.c.unit, true);
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
/* Buttons whose data-act is built at run time, so they have no one home file */
Object.assign(ACT, {
  track(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "track" });
  },
  school(b, e, a, k) {
    sfx("flip");
    openSheet({ mode: "school" });
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
  qgame(b, e, a, k) {
    openSheet({ mode: "qgame", u: b.dataset.u, g: b.dataset.g });
  },
});
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
