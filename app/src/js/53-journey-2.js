/* ---------- Journey ---------- */
const ring = (p, col) =>
  `<svg class="ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--sunk)" stroke-width="5"/><circle cx="22" cy="22" r="18" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${113 * p} 113" transform="rotate(-90 22 22)"/><text x="22" y="26" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="10" font-weight="600" fill="var(--ink)">${Math.round(p * 100)}%</text></svg>`;
function viewJourney0() {
  const kid = esc(S.child || "Your child"),
    Qn = quotes().length,
    W = workOf().length,
    bs = boardsOn();
  let h = `<section class="sec" style="margin-top:8px"><div class="sech"><h1 style="font-size:30px">${kid}'s journey</h1>${kidBlob("", "happy", 'width="54" height="54"')}</div><div class="stack3">${S.subjects
    .map((s) => {
      const x = subjStats(s);
      return `<button class="scard ${SC(s)}" data-act="jsub" data-s="${s}"><span class="eyebrow" style="color:#2B2340;opacity:.7">${SUBJ[s]}</span><span class="big num">${Math.round(x.pct * 100)}%</span><span class="xs" style="font-weight:800">${x.completed} of ${x.us.length} chapters${x.learning ? ` · ${x.learning} in progress` : ""}</span>${sblob(s, "happy")}</button>`;
    })
    .join("")}</div></section>`;
  const rows = [
    [
      "high",
      "Highlights",
      Qn || W ? `${Qn} answers in ${kid}'s words · ${W} photos` : "Answers and photos of work",
      blob("var(--sun)", 4, "wow", "", 'width="40" height="40"'),
    ],
    ...(bs.length
      ? [
          [
            "board",
            "Against the board",
            "What's done and what's due",
            blob("var(--sky)", 13, "calm", "", 'width="40" height="40"'),
          ],
        ]
      : []),
    [
      "beyond",
      "Beyond the board",
      "Plus topics and free exploring",
      blob("var(--gum)", 7, "happy", "", 'width="40" height="40"'),
    ],
    [
      "diary",
      "Learning diary",
      S.log.length + " lessons so far",
      blob("var(--pist)", 9, "happy", "", 'width="40" height="40"'),
    ],
    [
      "numbers",
      "Numbers",
      "Lessons, hours, tasks, games",
      blob("var(--tang)", 11, "happy", "", 'width="40" height="40"'),
    ],
  ];
  h += `<section class="sec">${rows.map(([k, t, s, b]) => `<button class="menurow" data-act="jrsheet" data-p="${k}">${b}<span><b>${t}</b><br><span class="xs muted">${s}</span></span>${icon("next")}</button>`).join("")}</section>`;
  h += rfCard();
  h += doneHistory();
  return h;
}
