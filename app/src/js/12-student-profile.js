/* ---------- Student profile: level and depth per subject, adjusting itself from answers ---------- */
const PLV = ["gentle", "core", "stretch"],
  PLN = { gentle: "Gentle", core: "Core", stretch: "Stretch" },
  PDN = { explore: "Explore", deep: "Deep", challenge: "Challenge" };
const PLD = {
  gentle: "More pictures, fewer words, one step at a time",
  core: "Right for the class: practice and a little thinking",
  stretch: "Harder puzzles, more writing and reasoning",
};
const PDD = {
  explore: "Hands-on and playful first",
  deep: "A balance of doing and thinking",
  challenge: "Lots of big questions and design tasks",
};
const defLvl = (s) => {
  const l = S.levels?.[s] || 1;
  return l <= 2 ? "gentle" : l >= 5 ? "stretch" : "core";
};
function profOf(s) {
  const p = (S.prof || {})[s] || {};
  return {
    lvl: p.lvl || defLvl(s),
    depth: p.depth || "deep",
    auto: p.auto !== false,
    why: p.why || "",
    at: p.at || "",
  };
}
/* recent answers in a subject: raise the level when it's easy, lower it when it's hard (at most once a week) */
function profAuto() {
  if (!S.setup) return;
  const M = Object.values(lastAnswers()).filter((x) => x.d);
  let ch = false;
  S.subjects.forEach((s) => {
    const p = profOf(s);
    if (!p.auto || (p.at && (parse(today) - parse(p.at)) / 864e5 < 7)) return;
    const A = M.filter((x) => unitByK(x.k)?.subj === s)
      .sort((a, b) => (a.d < b.d ? 1 : -1))
      .slice(0, 20);
    if (A.length < 8) return;
    const acc = A.filter((x) => x.r).length / A.length,
      i = PLV.indexOf(p.lvl);
    let to = null,
      why = "";
    if (acc >= 0.85 && A.length >= 10 && i < 2) {
      to = PLV[i + 1];
      why = `${Math.round(acc * 100)}% right in the last ${A.length} answers`;
    } else if (acc <= 0.5 && i > 0) {
      to = PLV[i - 1];
      why = `${Math.round(acc * 100)}% right in the last ${A.length} answers`;
    }
    if (to) {
      S.prof = { ...(S.prof || {}), [s]: { ...((S.prof || {})[s] || {}), lvl: to, why, at: today } };
      ch = true;
    }
  });
  if (ch) save();
}
function profCard() {
  return `<section class="sec"><div class="sech"><h3>Learning profile</h3><span class="xs muted">${esc(S.child || "Your child")}'s level and depth in each subject</span></div>
  ${S.subjects
    .map((s) => {
      const p = profOf(s);
      return `<div class="card ${SC(s)}" style="gap:6px"><div class="sech"><b style="font:600 16px var(--display)">${SUBJ[s]}</b><label class="xs"><input type="checkbox" data-pauto="${s}" ${p.auto ? "checked" : ""}> Adjust by itself</label></div>
   <div class="seg">${PLV.map((l) => `<button aria-pressed="${p.lvl === l}" data-act="plv" data-s="${s}" data-v="${l}">${PLN[l]}</button>`).join("")}</div><p class="xs muted">${PLD[p.lvl]}${p.why ? ` · changed on ${esc(fmt(p.at))}: ${esc(p.why)}` : ""}</p>
   <div class="seg">${Object.keys(PDN)
     .map(
       (d) => `<button aria-pressed="${p.depth === d}" data-act="pdep" data-s="${s}" data-v="${d}">${PDN[d]}</button>`,
     )
     .join("")}</div><p class="xs muted">${PDD[p.depth]}</p></div>`;
    })
    .join("")}</section>`;
}
