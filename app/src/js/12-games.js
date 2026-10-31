/* Library → Games: quick games to play now with only paper and a pen, puzzles to play here (made from a unit's
   science words), and every printable game, each opening at its place in its unit. */
const gamesAll = () =>
  Object.values(DATA.units || {})
    .sort((a, b) => a.order - b.order)
    .flatMap((u) => (u.games || []).map((g) => ({ ...g, uid: u.id, ut: u.title })));
const gameRow = (g) =>
  `<button class="menurow" data-act="${g.quick ? "qgame" : "gameopen"}" data-u="${esc(g.uid)}" data-g="${esc(g.id)}"><span style="font-size:24px">🎲</span><span><b>${esc(g.t)}</b><br><span class="xs muted">${esc(g.pl)}${g.mins ? " · " + g.mins + " min" : ""} · ${esc(g.ut)}</span></span>${icon("next")}</button>`;
const PUZZLES = [
  ["memory", "🃏", "Memory match", "Flip two cards: find each science word and its meaning."],
  ["words", "🔤", "Word search", "Find the science words hidden in the grid."],
];
function gamesTab() {
  const G = gamesAll(),
    Q = G.filter((g) => g.quick);
  return `<section class="sec"><div class="card rshead"><span class="eyebrow">Play and learn</span><h2>Games</h2><p class="sm">Quick games for a spare ten minutes, puzzles to play right here, and every card and board game from the units.</p></div></section>
   <section class="sec"><div class="sech"><h3>Puzzles to play here</h3></div><div class="pzgrid">${PUZZLES.map(([k, e, t, d]) => `<button class="pzcard" data-act="pzstart" data-k="${k}"><span>${e}</span><b>${t}</b><span class="xs muted">${d}</span></button>`).join("")}<button class="pzcard" data-act="games"><span>🧩</span><b>Daily games</b><span class="xs muted">Word of the Day, True or False, Odd One Out</span></button></div></section>
   <section class="sec"><div class="sech"><h3>Quick games: nothing to print</h3><span class="xs muted">${Q.length}</span></div><p class="xs muted">Write the few cards on paper slips, or play with nothing at all.</p><div class="card" style="gap:0">${Q.map(gameRow).join("")}</div></section>
   <section class="sec"><div class="sech"><h3>Print-and-play games</h3><span class="xs muted">${G.length - Q.length}</span></div><div class="card" style="gap:0">${G.filter(
     (g) => !g.quick,
   )
     .map(gameRow)
     .join("")}</div></section>`;
}
function qgameView() {
  const g = gamesAll().find((x) => x.uid === ui.sheet.u && x.id === ui.sheet.g);
  document.getElementById("sheetTitle").textContent = g ? g.t : "Game";
  if (!g) return "";
  return `<section class="sec"><span class="eyebrow">${esc(g.pl)}${g.mins ? " · " + g.mins + " min" : ""}</span><h2>${esc(g.t)}</h2><p class="xs muted">From the unit “${esc(g.ut)}”</p></section>
   ${g.slips?.length ? `<section class="sec"><h3>Write these on ${g.slips.length} paper slips</h3><div class="slips">${g.slips.map((s) => `<span>${esc(s)}</span>`).join("")}</div></section>` : `<section class="sec"><p class="sm"><b>Nothing to print or write.</b></p></section>`}
   <section class="sec"><h3>How to play</h3><ol class="rules">${g.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ol></section>
   <section class="sec"><button class="btn soft" data-act="gameopen" data-u="${esc(g.uid)}" data-g="${esc(g.id)}">Open it in the unit</button></section>`;
}
// opens a unit at one of its games
async function gameOpen(uid, gid) {
  if (ui.sheet) goBack();
  await fxOpen(uid);
  const i = (FXALL?.sections || []).findIndex((x) => x.id === gid);
  if (i >= 0) fxGo(i, 0);
}

// ---------------------------------------------------------------- the puzzles, from one unit's science words
const pzRnd = (seed) => {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
};
// today's unit: one the child is working on, else one by the date; "another" moves to the next
function pzUnit(skip = 0) {
  const ids = Object.keys(DATA.units || {}),
    going = Object.keys(fxSt().time).filter((id) => ids.includes(id));
  const L = going.length ? going : ids;
  return L[(dayNo + skip) % L.length];
}
async function pzStart(kind, skip = 0) {
  const id = pzUnit(skip);
  let u;
  try {
    u = await fxLoad(id);
  } catch (e) {
    return toast("Couldn't open the puzzle just now. Check your connection and try again.");
  }
  const r = pzRnd(dayNo * 31 + skip * 7 + id.length),
    T = (u.terms || []).slice().sort(() => r() - 0.5);
  if (kind === "memory") {
    const pairs = T.slice(0, 6).map((t, i) => ({ i, term: t.term, mean: t.meaning.split(/(?<=\.)\s/)[0] }));
    const cards = pairs
      .flatMap((p) => [
        { p: p.i, txt: p.term, w: 1 },
        { p: p.i, txt: p.mean, w: 0 },
      ])
      .sort(() => r() - 0.5);
    ui.pz = { kind, id, title: u.title, skip, cards, open: [], got: [], tries: 0 };
  } else {
    const words = T.map((t) => t.term.toUpperCase().replace(/[^A-Z]/g, ""))
        .filter((w, i, a) => w.length >= 3 && w.length <= 9 && a.indexOf(w) === i)
        .slice(0, 7),
      N = 10,
      grid = Array(N * N).fill(""),
      placed = [],
      DIRS = [
        [1, 0],
        [0, 1],
        [1, 1],
      ];
    words.forEach((w) => {
      for (let tryN = 0; tryN < 80; tryN++) {
        const [dx, dy] = DIRS[(r() * 3) | 0],
          x0 = (r() * (N - dx * (w.length - 1))) | 0,
          y0 = (r() * (N - dy * (w.length - 1))) | 0,
          cells = [...w].map((_, k) => (y0 + dy * k) * N + x0 + dx * k);
        if (cells.every((c, k) => !grid[c] || grid[c] === w[k])) {
          cells.forEach((c, k) => (grid[c] = w[k]));
          placed.push({ w, cells });
          break;
        }
      }
    });
    for (let c = 0; c < N * N; c++) if (!grid[c]) grid[c] = String.fromCharCode(65 + ((r() * 26) | 0));
    ui.pz = { kind, id, title: u.title, skip, N, grid, words: placed, found: [], pick: null };
  }
  if (ui.sheet?.mode === "puzzle") renderSheet();
  else openSheet({ mode: "puzzle" });
}
function puzzleView() {
  const P = ui.pz;
  document.getElementById("sheetTitle").textContent = P?.kind === "memory" ? "Memory match" : "Word search";
  if (!P) return "";
  const done = P.kind === "memory" ? P.got.length === P.cards.length / 2 : P.found.length === P.words.length;
  const head = `<p class="sm muted">Science words from “${esc(P.title)}”${done ? "" : P.kind === "memory" ? ". Tap two cards: a word and its meaning." : ". Tap the first letter of a word, then its last letter."}</p>`;
  const foot = `${done ? `<p class="pzwin">🎉 All found${P.kind === "memory" ? ` in ${P.tries} tries` : ""}!</p>` : ""}<div class="row"><button class="btn soft sm" data-act="pzstart" data-k="${P.kind}" data-skip="${P.skip + 1}">Another puzzle</button><button class="link sm" data-act="gameopen" data-u="${esc(P.id)}">Open this unit</button></div>`;
  if (P.kind === "memory")
    return `<section class="sec">${head}<div class="memgrid">${P.cards
      .map((c, i) => {
        const up = P.open.includes(i) || P.got.includes(c.p);
        return `<button class="memcard ${up ? "up" : ""} ${P.got.includes(c.p) ? "got" : ""} ${c.w ? "word" : ""}" data-act="pzflip" data-i="${i}" aria-label="${up ? esc(c.txt) : "Hidden card"}">${up ? esc(c.txt) : "?"}</button>`;
      })
      .join("")}</div>${foot}</section>`;
  const hit = new Set(P.words.filter((w) => P.found.includes(w.w)).flatMap((w) => w.cells));
  return `<section class="sec">${head}<div class="wsgrid" style="--n:${P.N}">${P.grid.map((ch, i) => `<button class="${hit.has(i) ? "hit" : ""} ${P.pick === i ? "pick" : ""}" data-act="pzcell" data-i="${i}">${ch}</button>`).join("")}</div><div class="wslist">${P.words.map((w) => `<span class="${P.found.includes(w.w) ? "got" : ""}">${w.w}</span>`).join("")}</div>${foot}</section>`;
}
function pzFlip(i) {
  const P = ui.pz;
  if (P.got.includes(P.cards[i].p) || P.open.includes(i)) return;
  if (P.open.length === 2) P.open = [];
  P.open.push(i);
  if (P.open.length === 2) {
    P.tries++;
    const [a, b] = P.open.map((k) => P.cards[k]);
    if (a.p === b.p && a.w !== b.w) {
      P.got.push(a.p);
      P.open = [];
      sfx("ok");
      if (P.got.length === P.cards.length / 2) setTimeout(celebrate, 150);
    } else sfx("tap");
  } else sfx("flip");
  renderSheet();
}
function pzCell(i) {
  const P = ui.pz;
  if (P.pick == null) P.pick = i;
  else {
    const a = P.pick,
      w = P.words.find(
        (x) =>
          !P.found.includes(x.w) &&
          ((x.cells[0] === a && x.cells.at(-1) === i) || (x.cells[0] === i && x.cells.at(-1) === a)),
      );
    P.pick = null;
    if (w) {
      P.found.push(w.w);
      sfx("ok");
      if (P.found.length === P.words.length) setTimeout(celebrate, 150);
    } else sfx("tap");
  }
  renderSheet();
}
