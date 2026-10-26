/* ---------- day steps ---------- */
const HINT = {
  wml: "Tell, don't read. Move it first, then draw it, then write it.",
  wart: "Process before product: enjoy the colours and the making.",
  dks: "Start from your child's own questions. There are no wrong answers here: ask “how do we know?” and try it out at home.",
  math: "Use real things for every problem (coins, beans, rotis, a ruler) before writing anything down.",
  eng: "Read aloud together, collect new words in a notebook, and ask your child to retell it in their own words.",
  hin: "Read aloud in Hindi, collect new words with meanings, and ask your child to retell it in Hindi.",
  sci: "Look for the idea in your own home or street before reading about it.",
};
const KIND = (n) =>
  /^Read/.test(n)
    ? ["read", "Read", "📖"]
    : /^What to learn/.test(n)
      ? ["learn", "Learn & think", "💡"]
      : /^Worksheet/.test(n)
        ? ["ws", "Worksheet", "✏️"]
        : /^Experiment/.test(n)
          ? ["exp", "Experiment", "🧪"]
          : /^Activit/.test(n)
            ? ["act", "Activity", "🧭"]
            : /^Game/.test(n)
              ? ["game", "Game", "🎲"]
              : /^Project/.test(n)
                ? ["proj", "Project", "🛠️"]
                : ["step", "Step", "⭐"];

function daySteps(u, n, tot) {
  if (u.board === "unit") return fxDaySteps(u, n);
  if (u.c?.p) return packDay(u, n);
  const cap = hpdOf(u.subj);
  if (u.c?.x?.hours) {
    const days = [];
    let cur = [],
      left = cap;
    u.c.x.hours.forEach(([name, h]) => {
      let rem = h,
        part = 1;
      while (rem > 1e-9) {
        const take = Math.min(rem, left);
        cur.push({ name, take, part });
        rem -= take;
        left -= take;
        part++;
        if (left < 1e-9) {
          days.push(cur);
          cur = [];
          left = cap;
        }
      }
    });
    if (cur.length) days.push(cur);
    const parts = {};
    days.flat().forEach((s) => (parts[s.name] = Math.max(parts[s.name] || 0, s.part)));
    return (days[Math.min(n, days.length) - 1] || []).map((s) => {
      const [kind, label, icon] = KIND(s.name);
      return {
        kind,
        label,
        icon,
        title:
          s.name.replace(/^(Experiments?|Activities|Game|Project): /, "") +
          (parts[s.name] > 1 ? ` · part ${s.part} of ${parts[s.name]}` : ""),
        mins: s.take,
        html: stepBody(u, s.name),
      };
    });
  }
  if (u.board === "dk") {
    const t = u.topic,
      k = t.sub.length;
    if (t.full)
      return [
        {
          kind: "game",
          label: "Lesson",
          icon: "👑",
          title: "The King's Doubt",
          mins: cap,
          html: `<p>${n === 1 ? "The Proclamation, setting your rules, and the first guests." : n === tot ? "The Nakkeeran challenge, the verdicts and the treats." : "The next investigation cards; check the lotus seeds and crystals."}</p>`,
        },
      ];
    if (n === 1)
      return [
        {
          kind: "read",
          label: "Story",
          icon: "📖",
          title: "Start with the story",
          mins: cap * 0.6,
          html: `<p>${esc(t.summary)}</p>`,
        },
        {
          kind: "learn",
          label: "Wonder",
          icon: "💡",
          title: "Wonder together",
          mins: cap * 0.4,
          html: `<div class="ask">${esc(t.oneness)}</div>`,
        },
      ];
    const i = Math.min(k - 1, Math.floor(((n - 2) * k) / Math.max(1, tot - 1)));
    return n === tot
      ? [
          {
            kind: "learn",
            label: "Wrap up",
            icon: "🎤",
            title: "Teach it back",
            mins: cap,
            html: `<p>Your child teaches you the topic in five minutes.</p><div class="ask">${esc(t.oneness)}</div>`,
          },
        ]
      : [
          {
            kind: "exp",
            label: "Explore",
            icon: "🧭",
            title: t.sub[i].slice(0, 60) + (t.sub[i].length > 60 ? "…" : ""),
            mins: cap,
            html: `<p>${esc(t.sub[i])}</p><p class="small muted">${esc(HINT.sci)}</p>`,
          },
        ];
  }
  const w = `${esc(u.book)}${chNo(u) ? ", " + chNo(u) : ""}`;
  const A =
    n === 1
      ? [
          [
            "read",
            "Read",
            "📖",
            "Open the chapter",
            0.6,
            `Read the first part of <b>${w}</b> together. Ask what your child thinks it's about.`,
          ],
          ["act", "Try it", "🧭", "Hands-on", 0.4, esc(HINT[u.subj])],
        ]
      : n === tot
        ? [
            ["act", "Finish", "🧭", "Last activities", 0.5, `Do the final activities in <b>${w}</b>.`],
            [
              "learn",
              "Review",
              "🎤",
              "Teach it back",
              0.3,
              "Your child explains the chapter to you, as if you were the student.",
            ],
            ["ws", "Mark", "✅", "Mark it done", 0.2, "If it feels solid, mark the chapter Completed in Topics."],
          ]
        : [
            ["read", "Continue", "📖", "Continue the chapter", 0.6, `Carry on in <b>${w}</b> from where you stopped.`],
            ["act", "Practice", "🧭", "Hands-on practice", 0.3, esc(HINT[u.subj])],
            ["ws", "Note", "📝", "Note what's hard", 0.1, "Write down anything that needs another go."],
          ];
  return A.map(([kind, label, icon, title, f, html]) => ({
    kind,
    label,
    icon,
    title,
    mins: cap * f,
    html,
    generic: true,
  }));
}

function dailyUnit() {
  if (!S.subjects.includes("sci")) return null;
  const sc = schedule("sci", 60);
  const t = sc.find((x) => x.u.c?.x);
  if (t) return t.u;
  const any = S.log.find((l) => unitBy(l.key)?.c?.x);
  if (any) return unitBy(any.key);
  return DATA.items.find((i) => i.c?.x) || null;
}
const G = () => (S.games[today] = S.games[today] || { g: [], tf: {}, odd: null });
const splitJoke = (j) => {
  const m = j.match(/^(.*?\?)\s*(.*)$/);
  return m ? [m[1], m[2]] : [j, ""];
};
const taskDone = (k, id) => !!(S.tasks[k] && S.tasks[k][id]);
function chapterTasks(u) {
  const c = u.c;
  return [
    [
      "ws",
      "✏️",
      "Worksheet",
      c.x.wsd.length + " sections: " + c.x.wsd.map((s) => s[0].replace(/^[A-Z]\. /, "")).join(", "),
    ],
    ...c.exp.map((e, i) => ["exp" + i, "🧪", "Experiment " + (i + 1), e]),
    ...c.act.map((e, i) => ["act" + i, "🧭", "Activity " + (i + 1), e]),
    ["game", "🎲", c.game[0], c.game[1]],
    ["proj", "🛠️", c.proj[0], c.proj[1] + " You end up with: " + c.proj[2] + "."],
  ];
}
const A = (k, id) => (S.ans[k] || {})[id];
function setA(k, id, v) {
  S.ans[k] = S.ans[k] || {};
  S.ans[k][id] = v;
}
const hm = (s) => {
  const [h, m] = String(s || "0:0")
    .split(":")
    .map(Number);
  return h * 60 + (m || 0);
};
const clock = (m) => {
  m = Math.round(m);
  let h = Math.floor(m / 60) % 24,
    mm = String(m % 60).padStart(2, "0");
  const ap = h < 12 ? "am" : "pm";
  h = h % 12 || 12;
  return `${h}:${mm} ${ap}`;
};
const D = () => ({ ...DEF_DAY, ...(S.day || {}) });
const Dd = (date) => ({ ...D(), ...((S.dayW || {})[parse(date).getDay()] || {}), ...((S.dayOver || {})[date] || {}) });
const addDays = (s, n) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const todosOn = (date) =>
  (S.todos || []).filter(
    (x) =>
      x.date === date ||
      (date === today && x.date < date && !x.done) ||
      (x.done && x.doneOn === date && x.date !== date),
  );
const eventsOn = (date) =>
  [...(S.events || []), ...(S.cal?.on ? S.cal.ev || [] : [])]
    .filter((e) => !S.evoff?.[date + "|" + e.id])
    .filter((e) => (e.rep === "weekly" ? e.days.includes(parse(date).getDay()) && date >= e.from : e.date === date))
    .sort((a, b) => hm(a.start) - hm(b.start));
const ncertWhere = (u, w) =>
  u.board === "ncert" ? w : w.replace(/ or the NCERT PDF \(ncert\.nic\.in\/textbook\.php\)/, "");
function prepFor(u, n, tot) {
  if (u.board === "unit") return fxPrep(u, n);
  if (u.c?.p) return packPrep(u, n);
  const kinds = new Set(daySteps(u, n, tot).map((s) => s.kind));
  let L = [];
  if (u.c?.x?.prep) {
    L = u.c.x.prep.filter((p) => kinds.has(p[0]));
    if (n === 1) L = [["guide", 1, "Read this chapter's parent guide (3 min)", "Here, at the top of this list"], ...L];
  } else if (u.board === "dk")
    L = u.topic.full
      ? [
          [
            "print",
            2,
            "Print The King's Doubt cards, rule scrolls and the comic parent guide",
            "The DeepKids printables for topic A1",
          ],
          ["read", 1, "Read the parent guide comic once before you play", "The printed guide"],
        ]
      : [
          [
            "read",
            1,
            "Read the topic summary and the wonder prompt (5 min)",
            "The topic page in this app (Topics → " + u.title + ")",
          ],
        ];
  else L = (DATA.prepgen.prep[u.subj] || []).map((p) => [p[0], p[1], p[2], ncertWhere(u, p[3])]);
  return L.map((p, i) => ({ id: `p|${u.k}|${n}|${i}`, kind: p[0], lead: p[1], task: p[2], where: p[3] }));
}
let _sess = null;
function upcoming() {
  if (_sess) return _sess;
  const out = [];
  S.subjects.forEach((s) => schedule(s, 12).forEach((x) => out.push(x)));
  return (_sess = out.sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : SUBJ_KEYS.indexOf(a.subj) - SUBJ_KEYS.indexOf(b.subj),
  ));
}
const LEARNK = new Set(["guide", "read", "learn"]);
function prepBlock(date, when) {
  const items = [];
  upcoming().forEach((x) => {
    if (x.date < date) return;
    prepFor(x.u, x.n, x.tot).forEach((p) => {
      const due = addDays(x.date, -p.lead);
      let ok = false;
      if (when === "am")
        ok =
          (p.lead === 0 && x.date === date) ||
          (p.lead >= 2 && due === date) ||
          (date === today && due < date && (!S.prep[p.id] || S.prep[p.id] === today));
      else ok = p.lead === 1 && due === date;
      if (ok && !LEARNK.has(p.kind)) items.push({ ...p, x, early: p.lead >= 2 && x.date !== date });
    });
  });
  return items;
}
const prepMins = (its) =>
  Math.max(
    10,
    its.reduce((a, p) => a + (p.kind === "guide" ? 3 : 6), 0),
  );
function lessonsOn(date) {
  const L = [];
  S.subjects.forEach((s) => {
    if (date <= today) {
      S.log
        .filter((l) => l.date === date && l.subj === s && l.kind !== "free")
        .slice()
        .reverse()
        .forEach((l) => {
          const u = unitBy(l.key);
          if (u)
            L.push({
              s,
              u,
              done: true,
              title: l.title,
              at: l.at,
              n: l.n,
              tot: sessionsFor(u),
              skipped: l.kind === "skipped",
            });
        });
      if (date === today && ui.more[s]) {
        const nx = nextUp(s);
        if (nx && !L.some((z) => z.s === s && !z.done)) L.push({ s, u: nx.u, n: nx.n, tot: nx.tot, bonus: true });
      }
    }
    const x = upcoming().find((z) => z.subj === s && z.date === date);
    if (x && !(date === today && ui.more[s])) L.push({ s, u: x.u, n: x.n, tot: x.tot });
  });
  return L;
}
function dayPlanV0(date) {
  const d = Dd(date),
    items = [],
    ev = eventsOn(date),
    isT = date === today;
  const am = prepBlock(date, "am"),
    pm = prepBlock(date, "pm");
  if (am.length)
    items.push({
      id: "am",
      at: hm(d.prepAt),
      dur: prepMins(am),
      who: "you",
      kind: "prep",
      title: "Your morning prep",
      sub: `${am.length} things to get ready` + (am.some((p) => p.early) ? " · includes early starts" : ""),
      prep: am,
      done: am.every((p) => S.prep[p.id]),
    });
  const lessons = lessonsOn(date);
  const fixed = [
    { a: hm(d.lunch), b: hm(d.lunch) + +d.lunchMin },
    ...ev.filter((e) => e.start).map((e) => ({ a: hm(e.start), b: e.end ? hm(e.end) : hm(e.start) + 60 })),
  ];
  let cur = hm(d.start);
  const place = (dur) => {
    let moved = true;
    while (moved) {
      moved = false;
      for (const f of fixed) {
        if (cur < f.b && cur + dur > f.a) {
          cur = f.b;
          moved = true;
        }
      }
    }
    const at = cur;
    cur += dur;
    return at;
  };
  if (lessons.length) {
    if (S.board !== "waldorf")
      items.push({
        id: "warm",
        at: place(15),
        dur: 15,
        who: "both",
        kind: "warm",
        title: "Warm-up: jokes and Word of the Day",
        sub: "Start the day laughing",
        done: !!S.tl[date + "|warm"] || (isT && G().g.length > 0),
      });
    const rf = rfPlan(date);
    if (rf)
      items.push({
        id: "refresh",
        at: place(rf.mins),
        dur: rf.mins,
        who: "both",
        kind: "refresh",
        title: "Refresher: " + rf.title,
        sub: rf.sub,
        rf,
        done: !!S.tl[date + "|refresh"],
      });
    const open = [...S.exps.filter((e) => !e.closed && e.start <= date), ...fxOngoing(date)];
    if (open.length)
      items.push({
        id: "exps",
        at: place(fxOM(open)),
        dur: fxOM(open),
        who: "both",
        kind: "exps",
        title: "Daily check-ins",
        sub:
          open
            .map((e) => e.title)
            .slice(0, 2)
            .join(" · ") + (open.length > 2 ? ` +${open.length - 2}` : ""),
        done: isT && open.every((e) => e.checks.includes(today)),
      });
    cur += 5;
  }
  lessons.forEach((l, i) => {
    if (l.done && l.at != null) {
      items.push({
        id: "L-" + l.s + "d" + i,
        at: l.at,
        doneAt: l.at,
        dur: lessonMins(l.s, date),
        who: "both",
        kind: "lesson",
        s: l.s,
        u: l.u,
        n: l.n,
        tot: l.tot,
        title: SUBJ[l.s] + ": " + l.u.title,
        sub: l.skipped ? "Skipped" : "Done ✓",
        skipped: l.skipped,
        done: true,
      });
      return;
    }
    const dur = lessonMins(l.s, date),
      lastEnd = cur;
    if (i > 0) cur += +d.brk;
    const at = place(dur),
      late = at + dur > hm(d.endAt || "18:30");
    if (i > 0 && +d.brk && at === lastEnd + +d.brk)
      items.push({
        id: "brk" + i,
        at: lastEnd,
        dur: +d.brk,
        who: "free",
        kind: "brk",
        title: "Break: water, snack, move",
      });
    items.push({
      id: "L-" + l.s + (l.bonus ? "b" : "") + i,
      at: late ? 24 * 60 - 1 : at,
      anytime: late,
      dur,
      who: "both",
      kind: "lesson",
      s: l.s,
      u: l.u,
      n: l.n,
      tot: l.tot,
      bonus: !!l.bonus,
      doneNoTime: !!l.done,
      title:
        (l.bonus ? "Bonus · " : "") +
        SUBJ[l.s] +
        ": " +
        (l.u.subj === "wart" && l.u.c?.p ? pkDay(l.u, l.n).title : l.u.title),
      sub: l.done
        ? "Done ✓"
        : (late ? `Doesn't fit before your day ends at ${d.endAt || "18:30"} · do it any time, or move it · ` : "") +
          `Part ${l.n} of ${l.tot}` +
          (l.u.c?.x
            ? ` · ${daySteps(l.u, l.n, l.tot)
                .map((z) => z.label)
                .join(", ")}`
            : ""),
      done: !!l.done,
    });
  });
  if (lessons.some((l) => !l.bonus) && plusOn() && S.subjects.includes("sci") && dkMinsOf() > 0) {
    const pk = dkPick(date, lessons);
    if (pk) {
      const dur = dkMinsOf();
      cur += +d.brk;
      items.push({
        id: "dkt",
        at: place(dur),
        dur,
        who: "both",
        kind: "dkt",
        u: pk.u,
        title: "DeepKids topic: " + pk.u.title,
        sub: pk.why,
        done: !!S.tl[date + "|dkt"],
      });
    }
  }
  if (!lessons.length) {
    const rf = rfPlan(date);
    if (rf)
      items.push({
        id: "refresh",
        at: place(rf.mins),
        dur: rf.mins,
        who: "both",
        kind: "refresh",
        title: "Refresher: " + rf.title,
        sub: rf.sub,
        rf,
        done: !!S.tl[date + "|refresh"],
      });
  }
  if (lessons.length)
    items.push({ id: "lunch", at: hm(d.lunch), dur: +d.lunchMin, who: "free", kind: "brk", title: "Lunch" });
  ev.forEach((e) =>
    items.push({
      id: "e-" + e.id,
      at: e.start ? hm(e.start) : 24 * 60 - 1,
      anytime: !e.start,
      dur: e.start && e.end ? Math.max(15, hm(e.end) - hm(e.start)) : 15,
      who: e.kind === "outing" ? "out" : e.who,
      kind: "event",
      ev: e,
      title: e.title,
      sub: evSub(e) + (e.start ? "" : e.allDay ? " · all day" : " · time not set"),
      done: !!S.tl[date + "|e-" + e.id],
    }),
  );
  todosOn(date).forEach((td) =>
    items.push({
      id: "t-" + td.id,
      at: 24 * 60 - 1,
      dur: 15,
      anytime: true,
      who: td.who || "you",
      kind: "todo",
      td,
      title: td.title,
      sub: (td.date < date ? "Carried over from " + fmt(td.date) : "Any time today") + (td.note ? " · " + td.note : ""),
      done: !!td.done && td.doneOn === date,
    }),
  );
  if (parse(date).getDay() === 0)
    items.push({
      id: "weekplan",
      at: hm(d.eveAt) - 20,
      dur: 15,
      who: "you",
      kind: "plan",
      title: "Plan next week",
      sub: "Add classes, outings and family plans for the coming week",
      done: !!S.tl[date + "|weekplan"],
    });
  if (pm.length)
    items.push({
      id: "pm",
      at: hm(d.eveAt),
      dur: prepMins(pm),
      who: "you",
      kind: "prep",
      title: "Prep for tomorrow",
      sub: `${pm.length} things for ${fmt(addDays(date, 1))}`,
      prep: pm,
      done: pm.every((p) => S.prep[p.id]),
    });
  items.forEach((it) => {
    if (!it.done || it.kind === "event" || it.kind === "lesson") return;
    const v = S.tl[date + "|" + it.id];
    if (typeof v === "number" && v > 1e12) {
      const x = new Date(v);
      it.at = it.doneAt = x.getHours() * 60 + x.getMinutes();
    } else if (it.kind !== "prep") it.doneNoTime = true;
  });
  return items.sort((a, b) => a.at - b.at || (a.kind === "prep" ? -1 : 1));
}
function dayPlan(date) {
  const L = dayPlanV0(date);
  if (date !== today) return L;
  L.forEach((i) => {
    const t = S.snz?.[date + "|" + i.id];
    if (t && t > nowMin() && !i.done) {
      i.at = t;
      i.sub = "Moved to later · " + (i.sub || "");
    }
  });
  return L.sort((a, b) => a.at - b.at);
}
