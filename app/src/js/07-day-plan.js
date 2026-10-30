/* The day's plan: lessons, routines, classes and outings, calendars, reminders, prep */
const HINT = {
  wml: "Tell, don't read. Move it first, then draw it, then write it.",
  wart: "Process before product: enjoy the colours and the making.",
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
function buildDayPlan(date) {
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
    // 45 minutes a day to finish what was started, one thing at a time, until the list is empty
    const fin = date >= today ? finishList() : [];
    if (fin.length)
      items.push({
        id: "finish",
        at: place(45),
        dur: 45,
        who: "both",
        kind: "finish",
        title: "Finish what's started: " + fin[0],
        sub: fin.length > 1 ? `${fin.length} things started · one at a time` : "One thing left half-done",
        done: !!S.tl[date + "|finish"],
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
    // a book, game or kit from the home shelf, and the family's own notes, that go with this lesson: on its days
    // until each is ticked once
    if (!l.done) {
      const add = (id, dur, x) =>
        Object.keys(S.tl).some((k) => k.endsWith("|" + id) && k.slice(0, 10) < date) ||
        items.push({ id, at: place(dur), dur, who: "both", done: !!S.tl[date + "|" + id], ...x });
      shelfFor(l.u)
        .slice(0, 2)
        .forEach((it) =>
          add("shelf-" + it.id + "-" + l.u.k, 15, {
            kind: "shelf",
            title: (SHELFDO[it.cat] || "Use") + ": " + it.name,
            sub: "From your home shelf · goes with " + l.u.title,
          }),
        );
      myNotesFor(l.u)
        .slice(0, 2)
        .forEach((m) =>
          add("note-" + m.k + "-" + l.u.k, 20, {
            kind: "mynote",
            mk: m.k,
            title: "From your notes: " + m.title,
            sub: "Goes with " + l.u.title,
          }),
        );
    }
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
  const rs = date === today && rsToday(date);
  if (rs)
    items.push({
      id: "paper",
      at: 24 * 60 - 1,
      dur: rs.p.mins || 6,
      anytime: true,
      who: "both",
      kind: "paper",
      p: rs.p,
      title: "Real research: " + rs.p.title,
      sub: "This week's research paper, picked from what you like · " + rs.p.source.name,
      done: rs.done || !!S.tl[date + "|paper"],
    });
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
// A day's plan; today, snoozed items move to their new time
function dayPlan(date) {
  const L = buildDayPlan(date);
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
const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};
const DAYW = { sun: 0, mon: 1, tue: 2, tues: 2, wed: 3, thu: 4, thur: 4, thurs: 4, fri: 5, sat: 6 };
const CLASSW =
  /\b(tuition|class|classes|coaching|lesson|lessons|swim\w*|dance|dancing|tabla|music|piano|guitar|keyboard|violin|singing|karate|taekwondo|judo|chess|art|drawing|painting|abacus|robotics|coding|cricket|football|tennis|badminton|skating|yoga|gym|sports?|practice|training|kathak|bharatanatyam|carnatic|hindustani|veena|mridangam|sloka|shloka|vedic|phonics|tutor|camp)\b/i;
const OUTW =
  /\b(trip|visit|visiting|outing|zoo|museum|park|picnic|party|birthday|wedding|function|holiday|vacation|festival|temple|travel|travelling|going to|movie|show|exhibition|fair|mela|library|farm|beach|grandma|grandpa|nani|dadi|nana|dada|cousin)\b/i;
const APPTW =
  /\b(doctor|dentist|appointment|check-?up|vaccin\w*|hospital|clinic|eye test|haircut|meeting|ptm|interview|exam)\b/i;
const MEALW = /\b(lunch|dinner|breakfast|snack|tiffin|meal)\b/i;
const TODOW =
  /^(buy|get|order|call|pay|book|send|remember|need to|pick up|collect|return|print|fill|submit|renew|fix|clean|pack|bring|make)\b/i;
const HAVEW =
  /^(we\s+(have|own|got|bought)|we've\s+got|i\s+(have|bought)|there(?:'s| is| are)\s+(a|an)?|have\s+(a|an))\s+/i;
const FILLER = new Set([
  "every",
  "each",
  "at",
  "from",
  "to",
  "till",
  "until",
  "on",
  "and",
  "the",
  "next",
  "this",
  "coming",
  "for",
  "an",
  "a",
  "of",
  "in",
  "is",
  "are",
  "will",
  "be",
  "has",
  "have",
  "goes",
  "go",
  "going",
  "does",
  "do",
  "daily",
  "weekly",
  "weekday",
  "weekdays",
  "weekend",
  "weekends",
  "hour",
  "hours",
  "hr",
  "hrs",
  "min",
  "mins",
  "minutes",
  "pm",
  "am",
  "morning",
  "evening",
  "night",
  "afternoon",
  "noon",
  "today",
  "tomorrow",
  "tonight",
  "day",
  "days",
  "between",
  "around",
  "about",
  "by",
  "with",
  "her",
  "his",
  "she",
  "he",
  "they",
  "we",
  "our",
  "my",
  "me",
  "i",
  "there",
  "after",
  "before",
  "then",
  "also",
  "plus",
  "starts",
  "starting",
  "start",
  "ends",
  "ending",
  "time",
  "times",
  "week",
  "month",
  "p.m.",
  "a.m.",
  "o'clock",
  "oclock",
]);
function dateWords(t) {
  t = t.toLowerCase();
  const now = parse(today);
  if (/\bday after tomorrow\b/.test(t)) return addDays(today, 2);
  if (/\btomorrow\b/.test(t)) return addDays(today, 1);
  if (/\btoday\b|\btonight\b/.test(t)) return today;
  let m = /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\b/.exec(t) || null,
    mo,
    d;
  if (m) {
    d = +m[1];
    mo = MONTHS[m[2]];
  } else if (
    (m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?\b/.exec(t))
  ) {
    mo = MONTHS[m[1]];
    d = +m[2];
  } else if ((m = /\b(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/.exec(t))) {
    d = +m[1];
    mo = +m[2] - 1;
    if (m[3]) {
      const y = +m[3] < 100 ? 2000 + +m[3] : +m[3];
      return iso(new Date(y, mo, d));
    }
  }
  if (mo !== undefined && d >= 1 && d <= 31) {
    let dt = new Date(now.getFullYear(), mo, d);
    if (iso(dt) < addDays(today, -30)) dt = new Date(now.getFullYear() + 1, mo, d);
    return iso(dt);
  }
  m = /\b(?:next|this|coming|on)?\s*(sun|mon|tues?|wed|thu(?:rs?)?|fri|sat)[a-z]*\b/.exec(t);
  if (m) {
    const wd = DAYW[m[1]] ?? DAYW[m[1].slice(0, 3)];
    let k = (wd - now.getDay() + 7) % 7;
    if (k === 0 || (/\bnext\b/.test(t) && k < 7 && /\bnext week\b/.test(t))) k += 7;
    return addDays(today, k);
  }
  return null;
}
const dayNames = (t) =>
  [...t.toLowerCase().matchAll(/\b(sun|mon|tues?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:days?|s|\.)?\b/g)]
    .map((m) => DAYW[m[1].slice(0, 3)])
    .filter((v, i, a) => v !== undefined && a.indexOf(v) === i);
function recurring(t) {
  const l = t.toLowerCase();
  if (/\bevery ?day\b|\bdaily\b|\beach day\b/.test(l)) return [0, 1, 2, 3, 4, 5, 6];
  if (/\bweek ?days\b|\bmon(day)?\s*(-|–|to)\s*fri(day)?\b/.test(l)) return [1, 2, 3, 4, 5];
  if (/\bweekends?\b/.test(l)) return [0, 6];
  const D = dayNames(l);
  if (
    D.length &&
    (/\bevery\b|\beach\b|\bweekly\b|\b(sun|mon|tues|wednes|thurs|fri|satur)days\b/.test(l) || D.length > 1)
  )
    return D;
  if (D.length && CLASSW.test(l) && !/\bnext\b|\bthis\b|\bcoming\b|\bon\s+\d/.test(l)) return D;
  return null;
}
function titleOf(seg) {
  const kid = (S.child || "").toLowerCase();
  let t = seg
    .replace(/\b(after|before)\b.*$/i, "")
    .replace(/\b\d{1,2}([:.]\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?\b/gi, " ")
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, " ")
    .replace(/[–—\-\/,:;()!?]/g, " ");
  const W = t
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => {
      const l = w.toLowerCase().replace(/'s$/, "");
      if (FILLER.has(l)) return false;
      if (kid && l === kid) return false;
      if (/^(sun|mon|tue|tues|wed|wednes|thu|thur|thurs|fri|sat|satur)(day|days|s)?$/.test(l)) return false;
      if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*$/.test(l)) return false;
      if (/^(one|two|three|half|an)$/.test(l)) return false;
      return true;
    });
  const s = W.slice(0, 6).join(" ").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
function splitPlans(text) {
  const out = [];
  const add = (s) => {
    s = s.trim().replace(/[.!]+$/, "");
    if (!s) return;
    if (out.length && !titleOf(s) && !HAVEW.test(s)) out[out.length - 1] += " " + s;
    else out.push(s);
  };
  text.split(/\n+|(?<=[.!?])\s+(?=[A-Z])|;\s*/).forEach((sent) => {
    if (HAVEW.test(sent.trim())) add(sent);
    else sent.split(/,\s+/).forEach(add);
  });
  return out;
}
function ampmGuess(t, w) {
  const l = t.toLowerCase();
  if (!w.start || /\d\s*(am|pm|a\.m\.|p\.m\.)|\b(am|pm|noon)\b/.test(l)) return null;
  const h = +w.start.slice(0, 2);
  if (/\b(morning)\b/.test(l)) return h >= 12 ? clock24(hm(w.start) - 720) : null;
  if (/\b(evening|night|afternoon)\b/.test(l)) return h < 12 ? clock24(hm(w.start) + 720) : null;
  if (h >= 1 && h <= 6) return "pm";
  if (h >= 7 && h <= 11) return "ask";
  return null;
}
function localParse(text) {
  const items = [],
    asks = [];
  splitPlans(text).forEach((seg) => {
    const l = seg.toLowerCase();
    const hv = HAVEW.exec(seg);
    if (hv) {
      seg
        .slice(hv[0].length)
        .split(/,\s*|\s+and\s+/)
        .map((s) => s.replace(/^(a|an|the|some)\s+/i, "").trim())
        .filter(Boolean)
        .forEach((n) =>
          items.push({
            type: "have",
            title: n[0].toUpperCase() + n.slice(1),
            who: "you",
            category: /\b(book|books|comic|comics|story|novel|encyclopedia|atlas)\b/i.test(n)
              ? "book"
              : /\b(game|ludo|chess|carrom|puzzle|cards|monopoly|scrabble|uno|jenga|snakes)\b/i.test(n)
                ? "game"
                : /\b(tablet|laptop|computer|ipad|phone|kindle|tv|speaker)\b/i.test(n)
                  ? "electronics"
                  : /\b(microscope|magnifying|telescope|globe|kit|magnet|lens|thermometer|binoculars)\b/i.test(n)
                    ? "equipment"
                    : "other",
            keep: true,
          }),
        );
      return;
    }
    let w = whenOf(seg),
      days = recurring(seg),
      date = days ? null : dateWords(seg);
    const title = titleOf(seg);
    if (!title) return;
    let type = RESTW.test(l)
      ? "rest"
      : MEALW.test(l)
        ? "meal"
        : TODOW.test(seg)
          ? "todo"
          : APPTW.test(l)
            ? "other"
            : CLASSW.test(l)
              ? "class"
              : OUTW.test(l)
                ? "outing"
                : w.start || days
                  ? "class"
                  : "todo";
    if (type === "todo" && w.start && !TODOW.test(seg)) type = "other";
    const who =
      /\b(i|me|my)\b/.test(l) && !CLASSW.test(l)
        ? "you"
        : ["class", "rest"].includes(type)
          ? "kid"
          : /\b(we|us|together|family)\b/.test(l)
            ? "both"
            : type === "todo"
              ? "you"
              : "both";
    const it = {
      type,
      title,
      who,
      date: days ? null : date || (type === "todo" ? today : null),
      days: days || null,
      start: w.start || null,
      end: w.end || null,
      note: "",
      keep: true,
      _src: seg,
    };
    if (!it.start && /\bafter\b/.test(l)) {
      const fx = fixItem({ ...it, note: seg });
      if (fx.start) {
        it.start = fx.start;
        it.end = fx.end || null;
        if (fx.days?.length) it.days = fx.days;
      }
    }
    const ap = ampmGuess(seg, it);
    if (ap === "pm") {
      it.start = clock24(hm(it.start) + 720);
      if (it.end && hm(it.end) < hm(it.start)) it.end = clock24(hm(it.end) + 720);
    } else if (ap === "ask")
      asks.push({
        i: items.length,
        need: "ampm",
        q: `Is ${title} at ${clock(hm(it.start))
          .replace(/:00/, "")
          .replace(/ ?(am|pm)/, "")} in the morning or the evening?`,
      });
    else if (ap) it.start = ap;
    if (it.start && !it.end) {
      const d = w.dur || (type === "meal" ? 45 : 60);
      it.end = clock24(hm(it.start) + d);
    }
    if (["class", "rest", "meal", "outing"].includes(type)) {
      if (!it.days && !it.date)
        asks.push({
          i: items.length,
          need: "days",
          q: `Which days is ${title}? (e.g. Tue and Thu, every day, or a date)`,
        });
      if (!it.start && type !== "outing")
        asks.push({ i: items.length, need: "time", q: `What time is ${title}? (e.g. 5 to 6 pm)` });
    }
    items.push(it);
  });
  return { items, asks };
}
function pendingWork() {
  const out = [],
    O = openWork();
  O.wsGoing.forEach((x) =>
    out.push({
      t: x.w.title,
      sub: `${chT(x.u)} · ${x.tot - x.ans} questions left`,
      m: Math.min(25, Math.max(5, Math.round((x.tot - x.ans) * 1.5))),
      act: `data-act="ws" data-k="${x.u.k}" ${x.w.id ? `data-w="${esc(x.w.id)}"` : ""}`,
      go: "Continue",
    }),
  );
  (S.todos || [])
    .filter((t) => !t.done && t.date <= today)
    .forEach((t) =>
      out.push({
        t: t.title,
        sub: t.date < today ? "To-do from " + fmt(t.date) : "To-do for today",
        m: 10,
        act: `data-act="told"`,
        go: "Open",
      }),
    );
  O.started.forEach((x) =>
    out.push({
      t: x.w.title || wkTitle(x.u, x.id, ""),
      sub: `${chT(x.u)} · started ${fmt(x.w.started)}`,
      m: 15,
      act: `data-act="todo"`,
      go: "Open",
    }),
  );
  O.wsMissed.forEach((x) =>
    out.push({
      t: x.w.title,
      sub: `${chT(x.u)} · not started`,
      m: Math.min(25, Math.max(8, Math.round(x.tot * 1.5))),
      act: `data-act="ws" data-k="${x.u.k}" ${x.w.id ? `data-w="${esc(x.w.id)}"` : ""}`,
      go: "Start",
    }),
  );
  return out;
}
function freeNow() {
  const nm = nowMin(),
    d = Dd(today),
    its = dayPlan(today).filter(
      (i) => i.kind !== "brk" && !i.anytime && !i.done && !evPast(i, today) && !snzd(i, today),
    );
  if (its.some((i) => i.at <= nm && nm < i.at + i.dur)) return 0;
  if (its.some((i) => OURS(i) && i.at + i.dur <= nm)) return 0;
  const nx = its.filter((i) => i.at > nm).sort((a, b) => a.at - b.at)[0],
    end = nx ? nx.at : Math.max(nm, hm(d.eveAt || "20:30"));
  return Math.max(0, Math.min(end - nm, 180));
}
const REM = () => S.rem || (S.rem = { nudge: true, notif: false });
function nudgeCard() {
  if (REM().nudge === false || (S.nudgeOff?.[today] || 0) > Date.now()) return "";
  const free = freeNow();
  if (free < 10) return "";
  const P = pendingWork()
    .filter((p) => p.m <= free)
    .slice(0, 2);
  if (!P.length) return "";
  return `<section class="card nudge-card"><div class="row" style="flex-wrap:nowrap;gap:10px">${blob("var(--sun)", 6, "wow", "nb", 'width="40" height="40"')}<div><b style="font:600 17px var(--display)">${free >= 120 ? "Free time now" : `${hmin(free)} free now`}. Finish one?</b><p class="xs muted">Nothing else is planned${free < 120 ? " until then" : ""}.</p></div></div>
    ${P.map((p) => `<div class="row nrow"><div style="flex:1;min-width:0"><b class="sm">${esc(p.t)}</b><br><span class="xs muted">${esc(p.sub)} · ≈ ${hmin(p.m)}</span></div><button class="btn sm" ${p.act}>${p.go}</button></div>`).join("")}
    <div class="row" style="gap:16px"><button class="link sm" data-act="nudgeoff">Not now</button><button class="link sm" data-act="rem">Reminders on my phone</button></div></section>`;
}
/* phone reminders go through the phone's own calendar: a repeating event with an alert */
function freeSlots(days = 7) {
  const out = [];
  for (let k = 0; k < days; k++) {
    const d = addDays(today, k),
      D0 = Dd(d),
      its = dayPlan(d)
        .filter((i) => i.kind !== "brk" && !i.anytime)
        .sort((a, b) => a.at - b.at),
      lo = hm(D0.start || "09:30"),
      hi = hm(D0.eveAt || "20:30") - 30;
    let cur = lo;
    const lastL = Math.max(lo, ...its.filter((i) => i.kind === "lesson").map((i) => i.at + i.dur));
    for (const i of [...its, { at: hi, dur: 0 }]) {
      if (i.at - cur >= 25 && cur >= lastL) {
        out.push({ d, at: Math.ceil(cur / 15) * 15 });
        break;
      }
      cur = Math.max(cur, i.at + i.dur);
    }
  }
  return out;
}
function suggestRemTime() {
  const dd = REM().days || [1, 2, 3, 4, 5],
    S2 = freeSlots(7).filter((x) => dd.includes(parse(x.d).getDay())),
    c = {};
  S2.forEach((x) => {
    c[x.at] = (c[x.at] || 0) + 1;
  });
  const best = Object.entries(c).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
  return best ? clock24(+best[0]) : "16:30";
}
const BYD = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
function remLinks() {
  const R = REM(),
    t = R.time || suggestRemTime(),
    days = R.days || [1, 2, 3, 4, 5],
    [h, m] = t.split(":").map(Number),
    start = new Date(parse(today));
  start.setHours(h, m, 0, 0);
  if (start < new Date()) start.setDate(start.getDate() + 1);
  while (!days.includes(start.getDay())) start.setDate(start.getDate() + 1);
  const f = (d) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`,
    end = new Date(start.getTime() + 20 * 6e4),
    rr = `RRULE:FREQ=WEEKLY;BYDAY=${days.map((x) => BYD[x]).join(",")}`,
    title = "DeepKids: a few minutes to finish what's open",
    body = "Open DeepKids to see what's waiting: worksheets, projects and anything you skipped.";
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {}
  const g = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${f(start)}/${f(end)}&details=${encodeURIComponent(body)}&recur=${encodeURIComponent(rr)}${tz ? "&ctz=" + encodeURIComponent(tz) : ""}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DeepKids//Reminders//EN",
    "BEGIN:VEVENT",
    "UID:dk-rem-" + Date.now() + "@deepkids",
    "DTSTAMP:" + f(new Date()),
    "DTSTART:" + f(start),
    "DURATION:PT20M",
    rr,
    "SUMMARY:" + title,
    "DESCRIPTION:" + body,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:" + title,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { g, ics, t, days };
}
async function saveIcs() {
  const { ics } = remLinks(),
    name = "DeepKids reminder.ics";
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Saved. Open it to add the reminder to your calendar.");
  } catch (e) {
    toast("Couldn't save the file here");
  }
}
function remView() {
  document.getElementById("sheetTitle").textContent = "Reminders";
  const R = REM(),
    L = remLinks(),
    NOK = typeof Notification !== "undefined";
  return `<p class="sm muted">DeepKids reminds you only when the day has free time and something is waiting to be finished.</p>
  <section class="card"><span class="eyebrow">On your phone</span><b style="font:600 18px var(--display)">A daily reminder in your calendar</b><p class="xs muted">Your phone's calendar alerts you, even when DeepKids is closed. We picked a time that's usually free in your plan.</p>
    <div class="row" style="gap:10px;align-items:center"><label class="sm">At <input class="inp" type="time" data-remf="time" value="${L.t}" style="width:auto;height:40px"></label></div>
    <div class="dpick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button aria-pressed="${L.days.includes(d)}" data-act="remday" data-d="${d}">${DAYS3[d]}</button>`).join("")}</div>
    <div class="row" style="gap:10px;flex-wrap:wrap"><a class="btn accent sm" href="${esc(L.g)}" target="_blank" rel="noopener">Add to Google Calendar</a><button class="btn soft sm" data-act="remics">Apple or other calendar</button></div>
    <p class="xs muted">Google Calendar opens with the reminder filled in: tap Save. Changed the time? Delete the old one in your calendar and add again.</p></section>
  <section class="card"><span class="eyebrow">While DeepKids is open</span><label class="zrow"><input type="checkbox" data-remck="notif" ${R.notif && NOK && Notification.permission === "granted" ? "checked" : ""} ${NOK ? "" : "disabled"}><span><b class="sm">Pop-up when there's free time</b><br><span class="xs muted">${NOK ? "Even if you've switched to another app, as long as DeepKids is still open." : "This phone or view doesn't allow pop-ups from DeepKids."}</span></span></label>
    <label class="zrow"><input type="checkbox" data-remck="nudge" ${R.nudge !== false ? "checked" : ""}><span><b class="sm">A card on Today when you open the app</b><br><span class="xs muted">Shows one or two things that fit the free time.</span></span></label></section>`;
}
let lastNote = 0;
function paceFactor() {
  const R = (S.pace || [])
    .filter((p) => p.est > 0 && p.took > 0)
    .slice(-60)
    .map((p) => (p.took * 60) / p.est)
    .filter((r) => r > 0.2 && r < 4)
    .sort((a, b) => a - b);
  if (R.length < 5) return null;
  return Math.min(2, Math.max(0.5, R[Math.floor(R.length / 2)]));
}
function estMins(u, n, tot) {
  let m = 0;
  try {
    const st = stepState({ u, n, tot });
    m = st.filter((x) => !x.ok).reduce((a, x) => a + (x.mins || 0), 0) * 60;
  } catch (e) {}
  if (!m) m = lessonMins(u.subj, today);
  const f = paceFactor();
  return { m: Math.max(5, Math.round((m * (f || 1)) / 5) * 5), own: !!f };
}
const estTxt = (u, n, tot) => `≈ ${hmin(estMins(u, n, tot).m)}`;
function dedupeEv() {
  const seen = new Set(),
    E = S.events || [],
    F = E.filter((e) => {
      const k = [
        String(e.title || "").toLowerCase(),
        e.start,
        e.end,
        e.rep,
        (e.days || []).slice().sort().join(),
        e.date || "",
      ].join("|");
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  if (F.length !== E.length) S.events = F;
}
const evShort = (e) =>
  e.who === "kid"
    ? `${S.child || "Child"} ${e.kind === "rest" ? "rests" : "goes"}`
    : e.who === "both"
      ? "Together"
      : "You";
const evAsk = (e) => ["class", "online", "outing"].includes(e.kind) || /tuition|class|coaching|lesson/i.test(e.title);
function evGate(it, date) {
  const e = it.ev;
  if (!e || it.done) return false;
  if (date > today || (date === today && !it.anytime && nowMin() < it.at)) {
    openSheet({ mode: "evpre", date, id: e.id });
    return true;
  }
  if (evAsk(e)) {
    ui.evf = {};
    openSheet({ mode: "evdone", date, id: e.id });
    return true;
  }
  return false;
}
const evFind = (id) => [...(S.events || []), ...(S.cal?.ev || [])].find((e) => e.id === id);
function evpreView() {
  const { date, id } = ui.sheet,
    e = evFind(id);
  document.getElementById("sheetTitle").textContent = e ? e.title : "Plan";
  if (!e) return "";
  const day = date === today ? "today" : fmt(date);
  return `<div class="exdone">${kidBlob("mascot")}<h2 style="font-size:22px">${esc(e.title)}</h2><p>${e.start ? `Starts at <b>${clock(hm(e.start))}</b> ${esc(day)}.` : ""} You can mark it done once it has started.</p><div class="col" style="gap:10px;width:100%"><button class="btn line" data-act="evcancel" data-id="${esc(id)}" data-date="${date}">Cancel it for ${esc(day)}</button><button class="btn" data-act="texit">Keep it</button></div><p class="xs muted">Cancelling frees the time for lessons that day. You can undo it.</p></div>`;
}
const MOODS = [
  ["great", "Went well"],
  ["ok", "Okay"],
  ["hard", "Was hard"],
];
function evdoneView() {
  const { date, id } = ui.sheet,
    e = evFind(id),
    F = ui.evf || (ui.evf = {});
  document.getElementById("sheetTitle").textContent = e ? e.title : "Check-in";
  if (!e) return "";
  const kid = esc(S.child || "your child");
  return `<p class="sm muted">${esc(fmt(date))}${e.start ? " · " + clock(hm(e.start)) + (e.end ? "–" + clock(hm(e.end)) : "") : ""}. A few quick questions so DeepKids knows what happened. Skip any.</p>
  <div class="chat"><div class="bub cl">Did ${kid} go?</div><div class="row" style="gap:8px"><button class="chip" aria-pressed="${F.went !== false}" data-act="evf" data-k="went" data-v="1">Yes, went</button><button class="chip" aria-pressed="${F.went === false}" data-act="evf" data-k="went" data-v="0">Missed it</button></div>
  ${
    F.went === false
      ? `<div class="bub cl">What happened?</div><div class="qa"><input class="inp" id="evf-note" placeholder="Unwell, teacher on leave, holiday…" value="${esc(F.note || "")}"></div>`
      : `<div class="bub cl">What did they cover?</div><div class="qa"><textarea class="inp" id="evf-covered" rows="2" placeholder="e.g. Plants: parts of a flower, did a worksheet">${esc(F.covered || "")}</textarea></div>
  <div class="bub cl">How did it go?</div><div class="row" style="gap:8px">${MOODS.map(([k, l]) => `<button class="chip" aria-pressed="${F.mood === k}" data-act="evf" data-k="mood" data-v="${k}">${l}</button>`).join("")}</div>
  <div class="bub cl">Any homework?</div><div class="qa"><input class="inp" id="evf-hw" placeholder="Leave empty if none" value="${esc(F.hw || "")}"></div>
  <div class="bub cl">Anything the teacher said, or to follow up?</div><div class="qa"><input class="inp" id="evf-note" placeholder="Optional" value="${esc(F.note || "")}"></div>`
  }</div>
  <div class="row" style="gap:10px;margin-top:10px"><button class="btn green" data-act="evsave">Save</button><button class="link sm" data-act="evsave" data-quick="1">Just mark it done</button></div>`;
}
function evSave(quick) {
  const { date, id } = ui.sheet,
    e = evFind(id),
    F = ui.evf || {},
    v = (k) => (document.getElementById("evf-" + k)?.value || "").trim();
  if (!e) return;
  const rec = quick
    ? { went: true, at: Date.now() }
    : {
        went: F.went !== false,
        covered: v("covered"),
        mood: F.mood || "",
        hw: v("hw"),
        note: v("note"),
        at: Date.now(),
      };
  S.evlog = { ...(S.evlog || {}), [date + "|" + id]: rec };
  S.tl[date + "|e-" + id] = Date.now();
  if (rec.hw)
    S.todos = [
      ...(S.todos || []),
      {
        id: Math.random().toString(36).slice(2, 9),
        title: `${e.title} homework: ${rec.hw}`.slice(0, 120),
        who: "kid",
        date: addDays(date, 1),
        note: "From " + fmt(date),
        done: false,
      },
    ];
  ui.evf = null;
  sfx(rec.went ? "ok" : "flip");
  toast(rec.went ? (rec.hw ? "Saved · homework added for tomorrow" : "Saved") : "Marked as missed");
  goBack();
  commit();
}
function cancelNote(d) {
  const C = [...(S.events || []), ...(S.cal?.ev || [])].filter((e) => S.evoff?.[d + "|" + e.id]);
  return C.length
    ? `<p class="xs muted" style="margin:6px 0 0">Cancelled ${d === today ? "today" : "this day"}: ${C.map((e) => `${esc(e.title)} <button class="link xs" data-act="evundo" data-id="${esc(e.id)}" data-date="${d}">Undo</button>`).join(" · ")}</p>`
    : "";
}
function evLogLine(x) {
  const r = x.r;
  return `<li>${esc(x.title)}: ${r.went ? `${r.covered ? esc(r.covered) : "went"}${r.mood ? ` <span class="xs muted">(${esc(MOODS.find((m) => m[0] === r.mood)?.[1] || "")})</span>` : ""}${r.hw ? ` · homework: ${esc(r.hw)}` : ""}${r.note ? ` · ${esc(r.note)}` : ""}` : `missed${r.note ? " (" + esc(r.note) + ")" : ""}`}</li>`;
}
const DAYS3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayList = (a) => {
  const o = [1, 2, 3, 4, 5, 6, 0].filter((x) => (a || []).includes(x)),
    j = o.join();
  return j === "1,2,3,4,5,6,0"
    ? "Every day"
    : j === "1,2,3,4,5"
      ? "Mon–Fri"
      : j === "1,2,3,4,5,6"
        ? "Mon–Sat"
        : j === "6,0"
          ? "Weekends"
          : o.map((x) => DAYS3[x]).join(", ");
};
const EVK = { class: "Class", online: "Online class", outing: "Outing", rest: "Rest", meal: "Meal", other: "" };
function evSub(e) {
  const who =
    e.who === "kid"
      ? (e.kind === "rest" ? `${S.child || "Child"} rests` : `${S.child || "Child"} goes`) + " · you're free"
      : e.who === "both"
        ? "Together"
        : "";
  return [EVK[e.kind] ?? "", e.rep === "weekly" ? dayList(e.days) : "", who].filter(Boolean).join(" · ");
}
function evLine(e) {
  return `${e.rep === "weekly" ? dayList(e.days) : e.date ? fmt(e.date) : ""}${e.start ? ` · ${clock(hm(e.start))}${e.end ? "–" + clock(hm(e.end)) : ""}` : " · time not set"}`;
}
function routinesText() {
  return (
    (S.events || [])
      .map(
        (e) =>
          `- id ${e.id}: "${e.title}" (${e.kind}, ${e.who}) ${e.rep === "weekly" ? "every " + dayList(e.days) : "on " + e.date} ${e.start || "?"}–${e.end || "?"}`,
      )
      .join("\n") || "(none yet)"
  );
}
/* old bad sorts saved repeating things as to-dos: turn them into timed routines */
/* earlier sorting marked some tuition and classes as the parent's: they are the child's */
function fixWho() {
  if (S.fixW1) return;
  S.fixW1 = 1;
  (S.events || []).forEach((e) => {
    if (e.who === "you" && /tuition|coaching|class|lesson|exam/i.test(e.title) && !/\bmy\b/i.test(e.title))
      e.who = "kid";
  });
}
function fixRoutines() {
  if (S.fixR1 || !S.todos?.length) return;
  S.fixR1 = 1;
  const E = [...(S.events || [])],
    rep = /every ?day|daily|weekdays?|every (mon|tue|wed|thu|fri|sat|sun)/i;
  S.todos = S.todos.filter((td) => {
    const txt = td.title + " " + (td.note || "");
    if (!rep.test(txt)) return true;
    if (E.some((e) => e.title.toLowerCase() === td.title.toLowerCase())) return false;
    const m = /after (?:returning from |coming from |coming back from )?(.+?)(?:,|$| every| daily)/i.exec(txt),
      ref =
        m &&
        E.find(
          (e) =>
            txt.toLowerCase().includes(e.title.toLowerCase()) ||
            e.title.toLowerCase().includes(m[1].trim().toLowerCase()),
        ),
      hrs = +(/(\d+(?:\.\d+)?) ?(?:hour|hr)/i.exec(txt) || [])[1] || 1;
    if (ref && ref.end) {
      if (E.some((e) => e.start === ref.end && (e.days || []).join() === (ref.days || []).join() && e.kind !== "class"))
        return false;
      E.push({
        id: Math.random().toString(36).slice(2, 9),
        title: td.title.replace(/ for \d+ hours?/i, ""),
        kind: /rest|nap|sleep/i.test(txt) ? "rest" : "other",
        who: td.who || "kid",
        start: ref.end,
        end: clock24(hm(ref.end) + hrs * 60),
        rep: ref.rep,
        date: ref.date,
        days: [...(ref.days || [])],
        from: today,
        note: "",
      });
      return false;
    }
    return true;
  });
  S.events = E;
}
/* safety net: whatever Claude returns, anything with a time or a repeat lands on the calendar */
function whenOf(txt) {
  const t = " " + String(txt || "").toLowerCase() + " ",
    T = [];
  t.replace(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/g, (m, h, mm, ap, off) => {
    if (+h > 23) return m;
    const prev = t.slice(Math.max(0, off - 8), off),
      next = t.slice(off + m.length, off + m.length + 8);
    if (!ap && !mm && !/(at|from|to|till|until|-|–)\s*$/.test(prev) && !/^\s*(to|-|–|till)\s*\d/.test(next)) return m;
    let H = +h;
    if (ap) {
      const p = ap[0] === "p";
      if (p && H < 12) H += 12;
      if (!p && H === 12) H = 0;
    }
    T.push([H, +(mm || 0), !!ap]);
    return m;
  });
  if (T.length === 2 && !T[0][2] && T[1][2] && T[1][0] >= 12 && T[0][0] < 12 && T[0][0] + 12 <= T[1][0]) T[0][0] += 12;
  const f = (x) => String(x[0]).padStart(2, "0") + ":" + String(x[1]).padStart(2, "0"),
    W = { one: 1, an: 1, a: 1, two: 2, three: 3, half: 0.5 },
    hx = /(\d+(?:\.\d+)?|one|two|three|an|a|half)\s*(?:hours?|hrs?)/.exec(t),
    dur = /half an hour/.test(t) ? 30 : hx ? (W[hx[1]] ?? +hx[1]) * 60 : +(/(\d+)\s*min/.exec(t) || [])[1] || 0;
  let days = null;
  if (/every ?day|daily|each day/.test(t)) days = [0, 1, 2, 3, 4, 5, 6];
  else if (/week ?days|mon(day)?\s*(-|–|to)\s*fri/.test(t)) days = [1, 2, 3, 4, 5];
  else if (/weekends?/.test(t)) days = [0, 6];
  else {
    const D = [
      ["sun", 0],
      ["mon", 1],
      ["tue", 2],
      ["wed", 3],
      ["thu", 4],
      ["fri", 5],
      ["sat", 6],
    ]
      .filter(([k]) => new RegExp("\\b" + k + "[a-z]*").test(t))
      .map((x) => x[1]);
    if (D.length && (/every|on |\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*s\b/.test(t) || D.length > 1)) days = D;
  }
  return { start: T[0] ? f(T[0]) : null, end: T[1] ? f(T[1]) : null, days, dur };
}
const RESTW = /\b(nap|naps|napping|sleep|sleeps|sleeping|rest|rests|resting)\b/i;
function fixItem(x) {
  if (["have", "update"].includes(x.type)) return x;
  const txt = [x.title, x.note].join(" "),
    w = whenOf(txt);
  if (x.date && !/every|daily/i.test(txt)) w.days = null;
  if (RESTW.test(txt) && ["todo", "note", "chore", "reminder"].includes(x.type)) x.type = "rest";
  if (!x.days?.length && w.days) x.days = w.days;
  if (!x.start && w.start) {
    x.start = w.start;
    if (!x.end && w.end) x.end = w.end;
  }
  if (!x.start) {
    const m =
        /after\s+(?:returning from |coming (?:back )?from |coming home from )?(?:the |her |his )?(.+?)(?:[,.;]|$| every| daily| on )/i.exec(
          txt,
        ),
      E = S.events || [],
      ref =
        m &&
        (E.find((e) => m[1].toLowerCase().includes(e.title.toLowerCase())) ||
          E.find((e) => e.title.toLowerCase().includes(m[1].trim().toLowerCase().split(" ")[0])));
    if (ref?.end) {
      x.start = ref.end;
      if (ref.rep === "weekly") x.days = [...ref.days];
      else if (ref.date) x.date = ref.date;
    }
  }
  if (x.start && !x.end && w.dur) x.end = clock24(hm(x.start) + w.dur);
  if ((x.type === "todo" && x.days?.length && x.start) || (x.type === "note" && x.start))
    x.type = RESTW.test(txt) ? "rest" : "other";
  return x;
}
const GC = "Google Calendar";
let MCP = null,
  MCPT = false;
async function mcpH() {
  if (!MCPT) {
    MCPT = true;
    try {
      MCP = (await window.claude?.use?.("mcp")) || null;
    } catch (e) {
      MCP = null;
    }
  }
  return MCP;
}
function findArr(x, d = 0) {
  if (x == null || d > 5) return null;
  if (typeof x === "string") {
    try {
      return findArr(JSON.parse(x), d + 1);
    } catch (e) {
      return null;
    }
  }
  if (Array.isArray(x)) {
    if (x.some((o) => o && typeof o === "object" && (o.start || o.summary || o.start_time || o.startTime))) return x;
    for (const y of x) {
      const r = findArr(y, d + 1);
      if (r) return r;
    }
    return null;
  }
  if (typeof x === "object") {
    for (const k of ["events", "items", "data", "results", "result"])
      if (x[k] != null) {
        const r = findArr(x[k], d + 1);
        if (r) return r;
      }
    for (const v of Object.values(x)) {
      const r = findArr(v, d + 1);
      if (r) return r;
    }
  }
  return null;
}
function calArr(x, d = 0) {
  if (x == null || d > 5) return [];
  if (typeof x === "string") {
    try {
      return calArr(JSON.parse(x), d + 1);
    } catch (e) {
      return [];
    }
  }
  if (Array.isArray(x)) return x.filter((o) => o && typeof o === "object" && o.id && (o.summary || o.name || o.title));
  if (typeof x === "object") {
    for (const v of Object.values(x)) {
      const r = calArr(v, d + 1);
      if (r.length) return r;
    }
  }
  return [];
}
const tOf = (v) => (typeof v === "string" ? v : v?.dateTime || v?.date_time || v?.date || null);
function gcMap(o) {
  const s = tOf(o.start || o.start_time || o.startTime),
    e = tOf(o.end || o.end_time || o.endTime);
  if (!s || o.status === "cancelled") return null;
  const allDay = /^\d{4}-\d{2}-\d{2}$/.test(s),
    sd = allDay ? parse(s) : new Date(s);
  if (isNaN(sd)) return null;
  const ed = e ? (allDay ? parse(e) : new Date(e)) : null,
    hh = (d) => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  return {
    id:
      "g" +
      String(o.id || o.eventId || s + (o.summary || ""))
        .replace(/[^\w-]/g, "")
        .slice(-40),
    title: String(o.summary || o.title || o.name || "Busy").slice(0, 80),
    date: iso(sd),
    start: allDay ? null : hh(sd),
    end: allDay || !ed || isNaN(ed) ? null : hh(ed),
    who: "you",
    kind: "other",
    note: "Google Calendar",
    src: "gcal",
    allDay,
  };
}
async function gcInput(cal) {
  let props = {};
  try {
    const d = await MCP.describeTool(GC, "list_events");
    props = d?.inputSchema?.properties || {};
  } catch (e) {}
  const K = Object.keys(props),
    used = new Set(),
    pick = (re) => {
      const k = K.find((k) => !used.has(k) && re.test(k));
      if (k) used.add(k);
      return k;
    },
    inp = {};
  const cid = pick(/^calendar_?id$|^calendar$/i) || pick(/calendar/i);
  if (cid && cal) inp[cid] = cal;
  const a = pick(/^time_?min$/i) || pick(/^(start|from|after)|min_?time|start_?time/i) || "timeMin",
    b = pick(/^time_?max$/i) || pick(/^(end|to|until|before)|max_?time|end_?time/i) || "timeMax";
  inp[a] = new Date(parse(today)).toISOString();
  inp[b] = new Date(parse(addDays(today, 60))).toISOString();
  const mx = pick(/max|limit|page_?size/i);
  if (mx) inp[mx] = 250;
  const se = pick(/single|expand/i);
  if (se && props[se]?.type === "boolean") inp[se] = true;
  const ob = pick(/order/i);
  if (ob && se) inp[ob] = "startTime";
  return inp;
}
async function gcSync(manual) {
  if (!ACC) return;
  const m = await mcpH();
  if (!m) {
    S.cal = { ...(S.cal || {}), err: "nomcp" };
    if (manual) render();
    return;
  }
  ui.gcBusy = true;
  if (manual) render();
  try {
    if (!S.cal?.list) {
      try {
        const r = await m.callTool(GC, "list_calendars", {});
        const L = calArr(r.payload).map((c) => ({
          id: String(c.id),
          name: String(c.summary || c.name || c.title).slice(0, 60),
          primary: !!c.primary,
        }));
        S.cal = { ...(S.cal || {}), list: L, cals: S.cal?.cals || L.filter((c) => c.primary).map((c) => c.id) };
      } catch (e) {
        if (
          [
            "server_not_connected",
            "needs_reauth",
            "not_in_manifest",
            "approval_required",
            "consent_required",
            "blocked_by_policy",
            "selection_required",
          ].includes(e?.code)
        )
          throw e;
      }
    }
    const cals = S.cal?.cals?.length ? S.cal.cals : [null];
    let all = [];
    for (const c of cals) {
      const r = await m.callTool(GC, "list_events", await gcInput(c), { cache: false });
      all = all.concat((findArr(r.payload) || []).map(gcMap).filter(Boolean));
    }
    const seen = new Set();
    all = all
      .filter((e) => !seen.has(e.id) && seen.add(e.id))
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .slice(0, 400);
    S.cal = { ...(S.cal || {}), on: true, ev: all, at: Date.now(), err: "" };
    if (manual) {
      sfx("ok");
      toast(
        all.length
          ? `${all.length} events from Google Calendar`
          : "Connected. Nothing on your calendar in the next 60 days.",
      );
    }
    commit();
  } catch (e) {
    S.cal = { ...(S.cal || {}), err: e?.code || "upstream_error" };
    if (manual) render();
  } finally {
    ui.gcBusy = false;
    if (manual) render();
  }
}
const GCERR = {
  nomcp: "Live calendars work when DeepKids is open in claude.ai.",
  server_not_connected: "Add Google Calendar in claude.ai Settings → Connectors, then tap Connect again.",
  selection_required:
    "Pick which Google Calendar account to use in the prompt claude.ai shows, then tap Connect again.",
  needs_reauth: "Google Calendar needs signing in again: claude.ai Settings → Connectors → Google Calendar.",
  not_in_manifest: "DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",
  approval_required: "DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",
  consent_required: "DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",
  blocked_by_policy: "Your organisation doesn't allow calendar access here.",
  server_unavailable: "Google Calendar didn't answer. Try again in a minute.",
  tool_error: "Google Calendar couldn't send the events. Try Refresh.",
};
const dayTypeOf = (d) => (S.dayType || {})[d] || (fxWT(parse(d).getDay()) === "half" ? "busy" : "full");
const lessonMins = (s, date) => (dayTypeOf(date) === "busy" ? Math.min(30, hpdOf(s) * 60) : hpdOf(s) * 60);
function parseICS(txt) {
  const lines = txt.replace(/\r?\n[ \t]/g, "").split(/\r?\n/),
    ev = [];
  let cur = null;
  for (const l of lines) {
    if (l === "BEGIN:VEVENT") cur = {};
    else if (l === "END:VEVENT") {
      if (cur) ev.push(cur);
      cur = null;
    } else if (cur) {
      const i = l.indexOf(":");
      if (i < 0) continue;
      cur[l.slice(0, i).split(";")[0]] = l.slice(i + 1);
    }
  }
  const P = (v) => {
    const m = (v || "").match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?/);
    if (!m) return null;
    return {
      d: m[4]
        ? m[7]
          ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5]))
          : new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5])
        : new Date(+m[1], m[2] - 1, +m[3]),
      allDay: !m[4],
    };
  };
  const BY = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 },
    lim = addDays(today, 90),
    hh = (d) => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"),
    out = [];
  ev.forEach((e) => {
    const s = P(e.DTSTART),
      en = P(e.DTEND);
    if (!s) return;
    const rr = e.RRULE || "",
      weekly = /FREQ=(WEEKLY|DAILY)/.test(rr),
      until = (rr.match(/UNTIL=(\d{8})/) || [])[1],
      ds = iso(s.d);
    if (!weekly && (ds < today || ds > lim)) return;
    if (weekly && until && until < today.replace(/-/g, "")) return;
    let days = null;
    if (weekly) {
      days = /DAILY/.test(rr)
        ? [0, 1, 2, 3, 4, 5, 6]
        : ((rr.match(/BYDAY=([A-Z0-9,+-]+)/) || [])[1] || "")
            .split(",")
            .map((x) => BY[x.replace(/[^A-Z]/g, "")])
            .filter((x) => x !== undefined);
      if (!days.length) days = [s.d.getDay()];
    }
    const title = (e.SUMMARY || "Calendar event")
      .replace(/\\,/g, ",")
      .replace(/\\n/g, " ")
      .replace(/\\;/g, ";")
      .slice(0, 80);
    out.push({
      type: "calendar",
      title,
      who: "you",
      date: weekly ? null : ds,
      days,
      start: s.allDay ? null : hh(s.d),
      end: en && !en.allDay ? hh(en.d) : null,
      note: "From your calendar",
      keep: true,
    });
  });
  return out.slice(0, 80);
}
function calendarCard() {
  // on the website, Google Calendar waits for Google sign-in scopes; the artifact links it through claude.ai connectors
  if (window.DK_PLATFORM?.name === "web")
    return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)", 14, "happy", "", 'width="46" height="46"')}<div><h3 style="font-size:19px">Your calendars</h3><p class="xs muted">Live Google Calendar linking is coming soon. For now, bring in a calendar file: you choose what to keep.</p></div></div><p class="xs muted">Google Calendar on a computer: Settings → Import & export → Export, then unzip. Apple Calendar on a Mac: File → Export.</p><label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose an .ics file<input type="file" id="icsFile" accept=".ics,text/calendar" hidden></label></section>`;
  const C = S.cal || {},
    busy = ui.gcBusy,
    err = C.err
      ? `<p class="sm" style="color:var(--bad)">${esc(GCERR[C.err] || "Couldn't read your calendar (" + C.err + "). Try Refresh.")}</p>`
      : "";
  const ics = `<details style="margin-top:6px"><summary class="link sm" style="cursor:pointer">Use Apple or Outlook? Import a file instead</summary><p class="xs muted">Export an .ics file and pick it here. You choose what to keep. A file doesn't update by itself.</p><label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose an .ics file<input type="file" id="icsFile" accept=".ics,text/calendar" hidden></label></details>`;
  if (C.on) {
    const n = (C.ev || []).filter((e) => e.date >= today).length,
      L = C.list || [];
    return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)", 14, "happy", "", 'width="46" height="46"')}<div><h3 style="font-size:19px">Google Calendar is linked</h3><p class="xs muted">${n} event${n === 1 ? "" : "s"} in the next 60 days${C.at ? " · updated " + new Date(C.at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : ""}. It refreshes by itself while DeepKids is open, and the day plan works around it.</p></div></div>
    ${L.length > 1 ? `<div class="col" style="gap:6px"><span class="xs muted">Calendars to show</span><div class="row">${L.map((c) => `<button class="chip" aria-pressed="${(C.cals || []).includes(c.id)}" data-act="gccal" data-id="${esc(c.id)}">${esc(c.name)}</button>`).join("")}</div></div>` : ""}
    ${err}<div class="row"><button class="btn soft sm" data-act="gcsync" ${busy ? "disabled" : ""}>${busy ? "Refreshing…" : "Refresh now"}</button><button class="link sm" data-act="gcoff">Unlink</button></div>${ics}</section>`;
  }
  return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)", 14, "happy", "", 'width="46" height="46"')}<div><h3 style="font-size:19px">Link your calendar</h3><p class="xs muted">Classes, tuitions, outings and busy times flow in by themselves and stay up to date. DeepKids only reads your calendar; it never changes it.</p></div></div>
    <button class="btn accent sm" data-act="gcsync" style="justify-self:start" ${busy ? "disabled" : ""}>${busy ? "Connecting…" : "Connect Google Calendar"}</button>${err}<p class="xs muted">First time: claude.ai asks you to add Google Calendar under Settings → Connectors and to allow DeepKids to read it.</p>${ics}</section>`;
}
const PREP_KW = [
  "magnifying glass",
  "magnifier",
  "magnet",
  "kitchen scale",
  "measuring tape",
  "ruler",
  "stopwatch",
  "thermometer",
  "Betadine",
  "food colour",
  "balloons",
  "straws",
  "clay",
  "seeds",
  "glitter",
  "lattu",
  "phone sound meter",
];
function preppedTasks() {
  return Object.keys(S.prep || {})
    .map((id) => {
      const p = id.split("|"),
        i = +p[p.length - 1],
        n = +p[p.length - 2],
        u = unitBy(p.slice(1, -2).join("|"));
      if (!u) return "";
      const x = prepFor(u, n, sessionsFor(u))[i];
      return x ? x.task : "";
    })
    .filter(Boolean);
}
function prepView() {
  const { date, when } = ui.sheet,
    its = prepBlock(date, when);
  document.getElementById("sheetTitle").textContent =
    (when === "am" ? "Morning prep" : "Prep for tomorrow") + " · " + fmt(date);
  if (!its.length) return `<p class="note">Nothing to prepare. Enjoy the calm.</p>`;
  const dn = its.filter((p) => S.prep[p.id]).length;
  const groups = [];
  its.forEach((p) => {
    let g = groups.find((g) => g.x === p.x);
    if (!g) groups.push((g = { x: p.x, items: [] }));
    g.items.push(p);
  });
  return (
    `<section class="card r-you"><div class="sech"><h3>${dn} of ${its.length} ready</h3><span class="xs muted">about ${prepMins(its)} min</span></div><div class="bar"><span style="width:${(dn / its.length) * 100}%;background:var(--marigold)"></span></div><p class="xs muted">Set a daily phone alarm for ${clock(hm(D()[when === "am" ? "prepAt" : "eveAt"]))}. The app can't send reminders itself.</p></section>` +
    groups
      .map(({ x, items }) => {
        const u = x.u,
          g = u.c?.p?.summary || u.c?.x?.guide || (u.board !== "dk" ? DATA.prepgen.guide[u.subj] : u.topic?.summary);
        return `<section class="card ${SC(x.subj)}" style="gap:0"><div class="row" style="gap:8px;margin-bottom:4px"><span class="dotc"></span><span class="eyebrow">${SUBJ[x.subj]} · ${fmt(x.date)} · Part ${x.n} of ${x.tot}</span></div><h3 style="font-size:19px;margin-bottom:8px">${esc(u.title)}</h3>
   ${g ? `<details style="margin-bottom:6px" ${items.some((p) => p.kind === "guide") ? "open" : ""}><summary style="cursor:pointer;font-weight:500;color:var(--plum)">Parent guide</summary><p class="sm" style="margin-top:6px">${esc(g)}</p></details>` : ""}
   ${items.map((p) => `<div class="taskrow ${S.prep[p.id] ? "done" : ""}"><button class="ckb" data-act="prep" data-id="${p.id}" aria-label="Done: ${esc(p.task)}">${icon("check")}</button><div><b style="font-weight:500">${esc(p.task)}</b>${p.early ? ` <span class="pill learning">start early for ${fmt(x.date)}</span>` : ""}<p class="xs muted" style="margin-top:3px">From: ${esc(p.where)}</p></div></div>`).join("")}
   <div class="row" style="margin-top:8px">${u.c?.x ? `<button class="btn xs soft" data-act="chapter" data-k="${u.k}" data-t="questions">Big questions</button><button class="btn xs soft" data-act="ws" data-k="${u.k}">Worksheet</button>` : ""}<button class="btn xs soft" data-act="chapter" data-k="${u.k}">Chapter</button></div></section>`;
      })
      .join("")
  );
}
const FXWT0 = { 0: "free", 1: "full", 2: "full", 3: "full", 4: "full", 5: "full", 6: "half" };
const fxWT = (wd) => (S.weekType || FXWT0)[wd] || "full";
function fxWeekRow() {
  const N = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    L = { full: "Full", half: "Half", free: "Free" };
  return `<div class="field"><label>Your week (tap a day to change it)</label><div class="row" style="gap:6px;flex-wrap:wrap">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button class="chip fxwt-${fxWT(d)}" data-fxwt="${d}">${N[d]} · ${L[fxWT(d)]}</button>`).join("")}</div><p class="xs muted">Full: the whole plan. Half: short lessons. Free: no lessons that day.</p></div>
  <div class="field"><label>Sounds</label><button class="chip" data-fxsnd="1">${document.getElementById("snd")?.getAttribute("aria-label") === "Turn sound on" ? "🔇 Off" : "🔊 On"}</button></div><div class="field"><label>AI features (chat, checking a photo of a worksheet)</label><button class="chip" data-fxai="1">${fxAIOn() ? "🔓 Unlocked" : "🔒 Locked until you top up"}</button><p class="xs muted">Top-ups are not open yet. For testing you can unlock here.</p></div>`;
}
