/* Research for kids: real papers retold as flashcards (app/content/research). What the family reads and
   likes picks the next one, on the phone, with no AI. */
const RS_KIND = {
  q: "🔎",
  who: "👩‍🔬",
  how: "🧪",
  found: "💡",
  sure: "⚖️",
  why: "🌍",
  try: "🏠",
  think: "🤔",
  words: "📖",
};
const rsAll = () => DATA.research || [];
const rsBy = (id) => rsAll().find((p) => p.id === id);
const rsSt = () => (S.rs = S.rs || { read: {}, like: {} });
// a paper scores for each tag or topic it shares with papers they liked, and for topics the child has worked on
function rsScore(p) {
  const st = rsSt(),
    liked = rsAll().filter((x) => st.like[x.id]),
    tags = new Set(liked.flatMap((x) => x.tags)),
    tops = new Set(liked.flatMap((x) => x.topics)),
    learnt = Object.keys(fxSt().time),
    base = (id) => id.split(".").slice(0, 2).join(".");
  return (
    3 * p.tags.filter((t) => tags.has(t)).length +
    3 * p.topics.filter((t) => tops.has(t)).length +
    2 * p.topics.filter((t) => learnt.includes(t)).length +
    p.topics.filter((t) => learnt.some((u) => base(u) === base(t))).length
  );
}
const rsForYou = () =>
  rsAll()
    .filter((p) => !rsSt().read[p.id])
    .sort((a, b) => rsScore(b) - rsScore(a));
// Today's list gets one paper when none was read in the past week; once read, it shows as done that day
function rsToday(date) {
  const R = Object.entries(rsSt().read),
    readNow = R.find(([, d]) => d === date);
  if (readNow) return { p: rsBy(readNow[0]), done: true };
  if (R.some(([, d]) => d < date && d > addDays(date, -7))) return null;
  const p = rsForYou()[0];
  return p ? { p, done: false } : null;
}
function rsCard(p) {
  const st = rsSt();
  return `<article class="rscard"><button class="plain rsopen" data-act="paper" data-p="${esc(p.id)}"><img src="${esc(p.cover.src)}" alt="${esc(p.cover.alt || "")}" loading="lazy"><span class="rsbody"><span class="eyebrow">${esc(p.source.name)} · ${p.year || p.source.year}${st.read[p.id] ? " · Read ✓" : ""}</span><b>${esc(p.title)}</b><span class="sm muted">${esc(p.blurb)}</span><span class="xs muted">≈ ${p.mins || 6} min together · ${p.tags.slice(0, 3).map(esc).join(" · ")}</span></span></button><button class="rslike" data-act="rslike" data-p="${esc(p.id)}" aria-pressed="${!!st.like[p.id]}" aria-label="${st.like[p.id] ? "Liked" : "Like"}: ${esc(p.title)}">${st.like[p.id] ? "❤️" : "🤍"}</button></article>`;
}
function researchTab() {
  const f = ui.rsf || "you",
    st = rsSt(),
    L = f === "you" ? rsForYou() : f === "read" ? rsAll().filter((p) => st.read[p.id]) : rsAll();
  const chip = (k, n) => `<button class="chip" data-act="rsf" data-f="${k}" aria-pressed="${f === k}">${n}</button>`;
  return `<section class="sec"><div class="card rshead"><span class="eyebrow">Real science, told for children</span><h2>What scientists found out</h2><p class="sm">Real research papers, retold in a few flashcards: the question, who found out, how, and what they found. Read one together each week. Tap 🤍 on the ones you enjoy, and we'll pick more like them.</p></div>
   <div class="row">${chip("you", "Picked for you")}${chip("all", "All " + rsAll().length)}${chip("read", "Read already")}</div>
   ${L.length ? `<div class="rsgrid">${L.map(rsCard).join("")}</div>` : `<p class="sm muted">${f === "read" ? "Nothing read yet. Pick one above." : "You've read them all. New ones come every week."}</p>`}</section>`;
}
function paperView() {
  const p = rsBy(ui.sheet.p);
  if (!p) return "";
  const i = ui.sheet.i || 0,
    n = p.cards.length,
    last = i === n,
    c = p.cards[i],
    st = rsSt();
  document.getElementById("sheetTitle").textContent = "Research for kids";
  // Back and Next sit with the dots above the card, clear of the IAm button in the corner
  const nav = `<div class="rsnav"><button class="btn soft sm" data-act="rsgo" data-i="${i - 1}" ${i ? "" : "disabled"} aria-label="Back">${icon("back")}</button><div class="rsdots">${[...p.cards, null].map((x, k) => `<button data-act="rsgo" data-i="${k}" class="${k === i ? "cur" : ""}" aria-label="${x ? esc(x.t) : "Where this comes from"}"></button>`).join("")}</div><button class="btn sm" data-act="rsgo" data-i="${i + 1}" ${last ? "disabled" : ""}>Next ${icon("next")}</button></div>`;
  const body = last
    ? `<span class="rsk">📚</span><h3>Where this comes from</h3><p class="sm">Retold by DeepKids from <a href="${esc(p.source.url)}" target="_blank" rel="noopener">${esc(p.source.title || p.source.name)} ↗</a>${p.source.authors ? ", by " + esc(p.source.authors) : ""}, ${esc(p.source.name)}${p.source.year ? ", " + p.source.year : ""}${p.source.license ? " (" + esc(p.source.license) + ")" : ""}.</p>${p.original ? `<p class="sm">The scientists' own paper: <a href="${esc(p.original.url)}" target="_blank" rel="noopener">${esc(p.original.title)} ↗</a>${p.original.journal ? ", " + esc(p.original.journal) : ""}${p.original.year ? ", " + p.original.year : ""}.</p>` : ""}<p class="xs muted">Pictures: ${[
        p.cover,
        ...p.cards.map((x) => x.img),
      ]
        .filter(Boolean)
        .map((x) => esc(x.credit))
        .filter((x, k, a) => a.indexOf(x) === k)
        .join(
          " · ",
        )}</p><div class="row"><button class="btn" data-act="rsdone" data-p="${esc(p.id)}">${st.read[p.id] ? "Read ✓" : "We read it"}</button><button class="btn soft" data-act="rslike" data-p="${esc(p.id)}" aria-pressed="${!!st.like[p.id]}">${st.like[p.id] ? "❤️ Liked" : "🤍 Like it"}</button></div>`
    : `<span class="rsk">${RS_KIND[c.k] || "✨"}</span><h3>${esc(c.t)}</h3>${c.img ? `<figure><img src="${esc(c.img.src)}" alt="${esc(c.img.alt || "")}"><figcaption>${esc(c.img.credit)}</figcaption></figure>` : ""}${c.b ? `<p>${esc(c.b)}</p>` : ""}${c.words ? `<dl class="rswords">${c.words.map((w) => `<dt>${esc(w.w)}</dt><dd>${esc(w.m)}</dd>`).join("")}</dl>` : ""}`;
  return `<section class="sec"><div class="rstop">${i ? "" : `<img src="${esc(p.cover.src)}" alt="${esc(p.cover.alt || "")}">`}<span class="eyebrow">${esc(p.source.name)} · ${p.year || p.source.year}</span><h2>${esc(p.title)}</h2></div>${nav}<div class="card rsflash rs-${last ? "src" : c.k}">${body}</div></section>`;
}
