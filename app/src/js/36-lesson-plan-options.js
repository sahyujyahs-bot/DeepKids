/* ---------- lesson plan options: 3 for a full day, 3 for a busy day (placeholders until written) ---------- */
function planOptions(u) {
  const c = u.c,
    x = c?.x,
    g = u.gen,
    t = u.topic;
  if (g?.plans)
    return {
      full: (g.plans.full || []).slice(0, 3).map((o, i) => genOpt(o, "f" + (i + 1))),
      busy: (g.plans.busy || []).slice(0, 3).map((o, i) => genOpt(o, "b" + (i + 1))),
    };
  const game = c?.game?.[0] || "The topic game",
    gameHow = c?.game?.[1] || "Play a quick game about the topic.",
    act = c?.act?.[0] || t?.sub?.[0] || "A hands-on activity about the topic.",
    exp = c?.exp?.[0] || "A small experiment or observation.",
    bq = x?.deep?.[0]?.q || t?.oneness || "What do you already know about this, and how do you know it?";
  const P = (kind, title, f, body) => ({ kind, label: KL[kind] || "Step", title, f, body });
  return {
    full: [
      {
        id: "f1",
        name: x ? "DeepKids plan" : "Chapter day",
        idea: x
          ? "Our full plan: read, think, worksheet, experiments, activities, game and project."
          : "Read the chapter together, talk about it, then try it with your hands.",
        real: true,
      },
      {
        id: "f2",
        name: "Story and play day",
        idea: "Start with a story, play the chapter game, end with something to make.",
        placeholder: true,
        parts: [
          P("read", "Story time", 0.3, "Tell or read the story of this topic in your own words."),
          P("game", game, 0.4, gameHow),
          P("act", "Make it real", 0.3, act),
        ],
      },
      {
        id: "f3",
        name: "Outdoor and make day",
        idea: "Take it outside: observe, collect, build.",
        placeholder: true,
        parts: [
          P("exp", "Go and look", 0.4, exp),
          P("proj", "Make something", 0.4, c?.proj?.[1] || "Build a small model or poster."),
          P("learn", "Talk it over", 0.2, bq),
        ],
      },
    ],
    busy: [
      {
        id: "b1",
        name: "30-minute core",
        idea: "The one idea that matters most, then a quick check.",
        placeholder: true,
        parts: [
          P(
            "read",
            "The key idea",
            0.5,
            x?.learn?.[0] || c?.covers || t?.summary || "Read the main part of the chapter.",
          ),
          P("learn", "One big question", 0.3, bq),
          P("game", "Quick check", 0.2, "Three quick questions, said aloud."),
        ],
      },
      {
        id: "b2",
        name: "Game-only day",
        idea: "Learn by playing. Nothing to write.",
        placeholder: true,
        parts: [
          P("game", game, 0.8, gameHow),
          P("learn", "What did we learn?", 0.2, "Each of you says one thing the game taught."),
        ],
      },
      {
        id: "b3",
        name: "Talk and walk",
        idea: "A walk and a conversation. No screens, no books.",
        placeholder: true,
        parts: [
          P("act", "Walk and spot", 0.6, "On a short walk, look for this topic around you."),
          P("learn", "The big question", 0.4, bq),
        ],
      },
    ],
  };
}
function genOpt(o, id) {
  const parts = (Array.isArray(o.steps) ? o.steps : []).slice(0, 6).map((s) => ({
    kind: KL[s.kind] ? s.kind : "act",
    label: KL[s.kind] || "Step",
    title: String(s.title || "").slice(0, 80),
    mins: Math.max(5, Math.min(90, +s.mins || 10)),
    body: String(s.how || "").slice(0, 600),
  }));
  return {
    id,
    name: String(o.name || "Plan").slice(0, 40),
    idea: String(o.idea || "").slice(0, 200),
    parts,
    gen: true,
  };
}
const pickOf = (u, type) => {
  const P = planOptions(u)[type] || [],
    id = ((S.planPick || {})[u.k] || {})[type];
  return P.find((o) => o.id === id) || P[0];
};
function bookSteps(u, n, tot) {
  const cap = hpdOf(u.subj),
    w = `${esc(u.book)}${chNo(u) ? ", " + chNo(u) : ""}`,
    res = u.c?.read?.[0];
  const L =
    n === 1
      ? [
          [
            "read",
            "Read",
            "Read the chapter",
            0.6,
            `Read the first part of <b>${w}</b> together. Ask what your child thinks it's about.`,
          ],
          ["act", "Try it", "Try it out", 0.4, esc(HINT[u.subj])],
        ]
      : n === tot
        ? [
            ["act", "Finish", "Finish the chapter", 0.5, `Do the last exercises in <b>${w}</b>.`],
            ["learn", "Review", "Teach it back", 0.5, "Your child explains the chapter to you."],
          ]
        : [
            ["read", "Continue", "Continue the chapter", 0.6, `Carry on in <b>${w}</b>.`],
            ["act", "Practice", "Practice", 0.4, esc(HINT[u.subj]) + (res ? ` More: ${esc(res)}.` : "")],
          ];
  return L.map(([kind, label, title, f, html]) => ({ kind, label, title, mins: cap * f, html, name: "" }));
}
function optionSteps(u, n, tot, date) {
  const type = dayTypeOf(date),
    o = pickOf(u, type);
  if (!o || (o.real && type === "full")) return daySteps(u, n, tot);
  if (o.real) return daySteps(u, n, tot);
  const total = lessonMins(u.subj, date);
  return o.parts.map((p) => ({
    kind: p.kind,
    label: p.label,
    title: p.title,
    mins: (p.mins || p.f * total) / 60,
    html: `<p>${esc(p.body)}</p>${o.placeholder ? `<p class="xs muted">Placeholder plan: “${esc(o.name)}”. The full version is being written.</p>` : ""}`,
    name: "opt:" + o.id,
  }));
}
