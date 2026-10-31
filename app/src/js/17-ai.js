/* DeepKids Plus and the features that use AI */
async function aiCheckPhoto(k, files) {
  if (!SAMPLE || !files.length) return;
  const [uk, wid] = k.split("#"),
    u = unitBy(uk),
    pw = u?.c?.p?.worksheets?.find((w) => w.id === wid);
  if (!pw) return;
  const qs = pw.sections
    .flatMap((s) => s[1])
    .map((it, i) => `${i + 1}. [${it.t}] ${it.p} — expected: ${keyText(it)}`)
    .join("\n");
  ui.aiws = { k, busy: true };
  renderSheet();
  try {
    const r = await SAMPLE.json(
      `You are checking a child's worksheet (age ${S.age || 8}, ${SUBJ[u.subj]}, "${pw.title}"). The photo shows the child's handwritten answers on the printed sheet. For each question below, read what the child wrote or drew and judge it kindly and honestly against the expected answer. Open questions have no single right answer: judge whether the reasoning makes sense. Return JSON {"results":[{"n":1,"verdict":"right"|"partly"|"not yet"|"can't read","note":"one short, warm sentence for the parent"}],"summary":"two sentences for the parent: what the child understands and one thing to talk about"}.\n\nQuestions:\n${qs}`,
      { images: files, purpose: "Check the photo of your child's worksheet against our answers." },
    );
    ui.aiws = { k, res: r };
  } catch (e) {
    ui.aiws = { k, err: e.code === "cancelled" ? "" : e.message || "Couldn't check just now." };
  }
  renderSheet();
}
async function aiCheckDraw(k, id) {
  if (!SAMPLE) return;
  const c = document.querySelector(`canvas[data-pad="${k}|${id}"]`);
  if (!c) return;
  const [uk, wid] = k.split("#"),
    u = unitBy(uk),
    pw = u?.c?.p?.worksheets?.find((w) => w.id === wid),
    [si, ii] = id.split("-").map(Number),
    it = pw?.sections?.[si]?.[1]?.[ii];
  const blob = await new Promise((r) => c.toBlob(r, "image/png"));
  ui.aires = { ...(ui.aires || {}), [k + id]: "Checking…" };
  renderSheet();
  try {
    const r = await SAMPLE.json(
      `A child (age ${S.age || 8}) drew this for the task: "${it?.p || "a drawing"}" in a lesson on "${u?.title || ""}". Say kindly and honestly whether the drawing shows the idea, what is right in it, and one thing to add or fix. Return JSON {"verdict":"shows it"|"partly"|"not yet","note":"two short warm sentences"}.`,
      { images: [blob], purpose: "Check your child's drawing." },
    );
    ui.aires[k + id] = `${r.verdict === "shows it" ? "✓" : r.verdict === "partly" ? "◐" : "…"} ${r.note || ""}`;
  } catch (e) {
    ui.aires[k + id] = e.code === "cancelled" ? "" : "Couldn't check just now.";
  }
  renderSheet();
}
/* every lesson step says where it comes from: the textbook (open it at these pages) or DeepKids (book closed) */
const PLUSR = {
  photo: "Reading photos and screenshots",
  chat: "Understanding longer messages",
  shelf: "Sorting your shelf from photos",
  test: "Entrance test papers",
  topic: "Exploring new topics",
};
// everything DeepKids Plus switches on, said once for the Plus page and for IAm
const PLUS_FEATS = [
  "🦁 Talk with IAm, the DeepKids Guru, about any page, card or question",
  "📷 Photos of finished work checked kindly, with what to fix and why",
  "📷 Send photos and screenshots of timetables, WhatsApp messages, notes and receipts; they go straight into your plan",
  "💬 Write the way you talk: long or mixed-up messages are understood",
  "🏷️ Photos of work are matched to the right chapter automatically",
  "📚 Shelf photos become a tagged home library, and your own books become lessons",
  "📝 Entrance test papers for any board and class",
  "🔎 Explore any new topic, with lesson plans written for you",
];
const plusList = () => `<ul class="pluslist">${PLUS_FEATS.map((f) => `<li>${f}</li>`).join("")}</ul>`;
const lockBtn = (r, cls, label) =>
  `<button class="${cls} locked" data-act="plus" data-r="${r}" aria-label="${esc(PLUSR[r])}: part of DeepKids Plus">${label}<span class="lk">🔒</span></button>`;
function plusView() {
  const r = ui.sheet?.r,
    pend = S.pendAI;
  document.getElementById("sheetTitle").textContent = "DeepKids Plus";
  const waiting = !!S.plusWait;
  return `<div class="exdone">${blob("var(--sun)", 6, "wow", "", 'width="76" height="76"')}<h2 style="font-size:24px">DeepKids Plus</h2>${r ? `<p class="sm"><b>${esc(PLUSR[r] || "")}</b> is part of Plus.</p>` : ""}</div>
  ${plusList()}
  ${pend ? `<div class="ask"><span class="eyebrow">Your message is kept</span>“${esc(pend.text.slice(0, 160))}${pend.text.length > 160 ? "…" : ""}”<br><span class="xs muted">As soon as Plus is on, DeepKids reads it. No need to type it again.</span></div>` : ""}
  <div class="col" style="gap:10px;margin-top:12px"><button class="btn accent" data-act="plusgo" ${waiting && !window.DK_PLATFORM?.upgrade ? "disabled" : ""}>${waiting && !window.DK_PLATFORM?.upgrade ? "You're on the list ✓" : "Upgrade to Plus"}</button><button class="btn line sm" data-act="texit">Not now</button></div>
  ${waiting && !window.DK_PLATFORM?.upgrade ? `<p class="xs muted" style="text-align:center">Plus opens soon. We'll let you know here as soon as it does.</p>` : ""}`;
}
async function plusGo() {
  const P = window.DK_PLATFORM;
  if (P?.upgrade) {
    let ok = false;
    try {
      ok = await P.upgrade({ reason: ui.sheet?.r || "" });
    } catch (e) {}
    if (ok) {
      await afterUpgrade();
      return;
    }
    toast("Payment didn't go through. Nothing was charged.");
    return;
  }
  S.plusWait = S.plusWait || Date.now();
  sfx("ok");
  toast("You're on the list. Plus opens soon.");
  commit();
}
async function afterUpgrade() {
  try {
    SAMPLE = (await window.claude?.use?.("sample")) || null;
    const l = SAMPLE ? await SAMPLE.limits().catch(() => null) : null;
    IMGOK = !!l?.images;
  } catch (e) {}
  sfx("win");
  confetti();
  toast("Welcome to DeepKids Plus!");
  if (document.getElementById("fxChat")?.open) fxChat("");
  if (ui.sheet) goBack();
  if (S.pendAI && SAMPLE) {
    const t = S.pendAI.text;
    tab = "week";
    ui.seg = { ...(ui.seg || {}), week: "days" };
    ui.dump = { text: t, chat: [] };
    delete S.pendAI;
    commit();
    setTimeout(() => {
      const ta = document.getElementById("dumpText");
      if (ta) ta.value = t;
      runDump();
    }, 300);
  } else commit();
}
/* a message the phone can't read well: too long, nothing found, or sentences that aren't plans */
// a message read on the phone, part by part: sentences, and "and her grandmother visits…" style second parts
// (not "Mondays and Wednesdays"); the child's name and "goes to" come off titles; rest and meals with no days
// are every day. Only the parts that give nothing go to AI.
const lifeName = () =>
  (S.child || "")
    .trim()
    .split(/\s+/)[0]
    .replace(/[^A-Za-z]/g, "");
// "She is interested in…", "loves…", "is into…": interests, kept per child, never on the calendar
const INTEREST =
  /\b(?:interested in|loves?|likes?|enjoys?|is into|really into|fascinated by|obsessed with|curious about|crazy about|mad about)\s+(.+)/i;
const SUBJW =
  /^(art|arts|craft|crafts|music|dance|science|chemistry|physics|biology|maths|math|history|geography|coding|reading|writing|stitching|sewing|cooking|baking|gardening|drawing|painting|singing|space|animals|plants|rocks|robots|chess|football|cricket|swimming|insects|birds|stories|poetry|languages)$/;
// one interest per comma or "and"; a short run of words with no commas splits too when each word is something the
// activity library knows ("stitching chemistry art")
// "to sing", "play badminton", "to draw": the activity, said as a thing ("Singing", "Badminton", "Drawing")
const ING = {
  sing: "Singing",
  dance: "Dancing",
  draw: "Drawing",
  paint: "Painting",
  read: "Reading",
  write: "Writing",
  cook: "Cooking",
  bake: "Baking",
  swim: "Swimming",
  stitch: "Stitching",
  sew: "Sewing",
  build: "Building",
  code: "Coding",
  garden: "Gardening",
  run: "Running",
  climb: "Climbing",
  act: "Acting",
  knit: "Knitting",
};
const asThing = (x) =>
  x
    .replace(/^to\s+/i, "")
    .replace(/^(?:play(?:ing)?|do(?:ing)?|learn(?:ing)?)\s+/i, "")
    .replace(/^(\w+)$/, (m, w) => ING[w.toLowerCase()] || m);
function interestsOf(t) {
  const L = t
    .replace(/[.!]+$/, "")
    .split(/,|\band\b|&|\//i)
    .map((x) => x.trim())
    .filter(Boolean);
  const known = (w) =>
    SUBJW.test(w) ||
    (DATA.life?.acts || []).some((a) => a.words.includes(w) || a.name.toLowerCase().split(/\W+/).includes(w));
  return L.map(asThing)
    .flatMap((x) => {
      const W = x.toLowerCase().split(/\s+/);
      return W.length > 1 && W.length <= 5 && W.every(known) ? W : [x];
    })
    .map((x) => x[0].toUpperCase() + x.slice(1));
}
const TITLEFILL =
  /\b(everyday|every day|daily|weekdays|weekends|only|on|at|from|to|a\.?m\.?|p\.?m\.?|in the (morning|evening|afternoon))\b/gi;
function readOnPhone(text) {
  const nm = lifeName(),
    who = `her|his|my|our|we|she|he|they|their|i|on|every${nm ? "|" + nm : ""}`,
    joiner = new RegExp(`\\s+(?:and|also|plus|then)\\s+(?=(?:${who})\\b)`, "i"),
    parts = text
      .replace(/\b([ap])\.m\./gi, "$1m")
      .split(/(?<=[.;!?\n])\s+|\n+/)
      .flatMap((t) => t.split(joiner))
      // spoken messages run on: a new idea starts at "she also likes…", "he has…" even with no "and" or full stop
      .flatMap((t) =>
        t.split(
          /\s+(?=(?:she|he|they|we|i)\s+(?:also\s+|really\s+)?(?:likes?|loves?|enjoys?|is|has|goes|attends|plays|wants|does)\b)/i,
        ),
      )
      .map((t) =>
        t
          .trim()
          // what people say before the point: "ok so", "um", "basically"
          .replace(/^(?:(?:ok(?:ay)?|so|um+|uh+|hmm+|well|basically|actually|like|also|and)[,\s]+)+/i, "")
          // "Liri goes to…", "She has…": the person at the start isn't part of the title
          .replace(
            /^(?:[A-Z][a-z]+(?:'s)?|she|he|they|we)\s+(?=(?:goes|go|has|have|attends|attend|does|will|is|are|learns|takes|plays|joins)\b)/i,
            "",
          )
          .replace(/^(?:goes to|go to|attends|takes|joins)\s+/i, "")
          // "everyday … only on weekdays": the narrower days win
          .replace(/\b(?:every ?day|daily)\b(?=.*\bonly\b.*\b(?:weekdays|weekends|mon|tue|wed|thu|fri|sat|sun))/i, ""),
      )
      .filter((t) => t.length > 2),
    items = [],
    asks = [],
    left = [];
  parts.forEach((t) => {
    const I = t.match(INTEREST);
    if (I && !/\b\d|(mon|tue|wed|thu|fri|sat|sun)[a-z]*\b/i.test(t)) {
      interestsOf(I[1]).forEach((x) => items.push({ type: "interest", title: x, who: "kid", keep: true }));
      return;
    }
    const R = localParse(t);
    if (!R.items.length) return left.push(t);
    R.asks.forEach((a) => asks.push({ ...a, i: a.i + items.length }));
    items.push(...R.items);
  });
  const nameRe = nm ? new RegExp(`^${nm}('s)?\\s+`, "i") : null;
  for (let i = 0; i < items.length; i++) {
    const x = items[i];
    if (x.type === "interest") continue;
    const was = x.title;
    x.title = x.title
      .replace(nameRe || /^\b$/, "")
      .replace(/^(goes to|go to|has|attends|does|will go to|is going to)\s+/i, "")
      .replace(TITLEFILL, "")
      // "art class art and crafts class": said twice, keep the fuller last one
      .replace(/^.*?\b(class|tuition|lesson|practice|coaching)\s+(?=.+\b\1\b)/i, "")
      .replace(/\b(?:on\s+)?(?:a\s+)?few days(?: a week)?\b|\b(?:once|twice|thrice) a week\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    // "only on weekdays": a part that only changes the days of the thing before it
    if ((!x.title || /^(only|also|just|but)$/i.test(x.title)) && i > 0 && items[i - 1].type !== "interest") {
      if (x.days?.length) items[i - 1].days = x.days;
      if (x.start && !items[i - 1].start) [items[i - 1].start, items[i - 1].end] = [x.start, x.end];
      items.splice(i, 1);
      for (let k = asks.length - 1; k >= 0; k--) {
        if (asks[k].i === i) asks.splice(k, 1);
        else if (asks[k].i > i) asks[k].i--;
      }
      i--;
      continue;
    }
    x.title = x.title
      .replace(/\bfew\b/gi, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (c) => c.toUpperCase());
    // its questions use the clean title too
    asks.forEach((a) => a.i === i && (a.q = a.q.split(was).join(x.title)));
    if ((x.type === "rest" || x.type === "meal") && !x.days?.length && !x.date) {
      x.days = [0, 1, 2, 3, 4, 5, 6];
      for (let k = asks.length - 1; k >= 0; k--)
        if (asks[k].i === i && /which days/i.test(asks[k].q)) asks.splice(k, 1);
    }
  }
  return { items, asks, left };
}
function localDump(text) {
  const D_ = (ui.dump = ui.dump || {});
  const R = readOnPhone(text),
    hard = R.left.length > 0;
  if (hard) {
    S.pendAI = { text: R.left.join(". "), at: Date.now() };
    save();
  }
  D_.needAI = hard;
  if (!R.items.length) {
    D_.err = "";
    D_.items = D_.items || null;
    sfx("tap");
    render();
    return;
  }
  D_.local = true;
  D_.items = [...(D_.items || []), ...R.items];
  const base = D_.items.length - R.items.length;
  D_.asks = [...(D_.asks || []), ...R.asks.map((a) => ({ ...a, i: a.i + base }))];
  D_.questions = D_.asks.map((a) => a.q);
  D_.err = "";
  clearIn("dumpText");
  sfx("ok");
  render();
}
const needAICard = (D_) =>
  D_.needAI && !SAMPLE
    ? `<div class="needai"><span class="lk">🔒</span><div><b>${D_.items?.length ? "We read most of it. One part we couldn't:" : "We couldn't read this one:"}</b><p class="sm">“${esc(S.pendAI?.text || "")}”</p><p class="xs muted">Try it as a class, trip, rest time or to-do with a day or time ("Swimming Tue 5 pm"), or use Add by hand. DeepKids Plus reads anything, and keeps this message to read after upgrading.</p></div><button class="btn sm soft" data-act="plus" data-r="chat">DeepKids Plus</button></div>`
    : "";
function dumpChat(D_) {
  const Q = D_.questions || [],
    C = D_.chat || [];
  if (!Q.length && !C.length) return "";
  return `<div class="chat">${C.map((c) => `<div class="bub cl">${esc(c.q)}</div><div class="bub me">${esc(c.a)}</div>`).join("")}${Q.map((q, i) => `<div class="bub cl">${esc(q)}</div><div class="qa"><input class="inp" id="qa-${i}" data-qa="${i}" placeholder="Type your answer" autocomplete="off"><button class="btn sm" data-act="qsend" ${D_.busy ? "disabled" : ""}>Send</button></div>`).join("")}${Q.length ? `<p class="xs muted">Skip any you'd rather not answer.</p>` : ""}</div>`;
}
function qSend() {
  const D_ = (ui.dump = ui.dump || {}),
    Q = D_.questions || [],
    ans = Q.map((q, i) => [q, (document.getElementById("qa-" + i)?.value || "").trim()]).filter(([, a]) => a);
  if (!ans.length) {
    toast("Type an answer first");
    return;
  }
  D_.chat = [...(D_.chat || []), ...ans.map(([q, a]) => ({ q, a }))];
  if (D_.local) {
    const left = [];
    (D_.asks || []).forEach((a, i) => {
      const v = (document.getElementById("qa-" + i)?.value || "").trim();
      if (!v) {
        left.push(a);
        return;
      }
      const it = D_.items[a.i];
      if (!it) return;
      if (a.need === "ampm") {
        if (/eve|night|pm|after/i.test(v)) {
          it.start = clock24(hm(it.start) + 720);
          if (it.end) it.end = clock24((hm(it.end) + 720) % 1440);
        }
      } else if (a.need === "days") {
        const d = recurring(v.includes("every") || dayNames(v).length > 1 ? v : "every " + v) || null,
          dt = d ? null : dateWords(v);
        if (d) {
          it.days = d;
          it.date = null;
        } else if (dt) {
          it.date = dt;
        } else left.push(a);
      } else if (a.need === "time") {
        const w = whenOf(/\d/.test(v) && !/at|from/.test(v) ? "at " + v : v);
        if (w.start) {
          it.start = w.start;
          it.end = w.end || clock24(hm(w.start) + (w.dur || 60));
          const ap = ampmGuess(v, it);
          if (ap === "pm") {
            it.start = clock24(hm(it.start) + 720);
            it.end = clock24(hm(it.end) + 720);
          }
        } else left.push(a);
      }
    });
    D_.asks = left;
    D_.questions = left.map((a) => a.q);
    sfx("ok");
    render();
    return;
  }
  const ta = document.getElementById("dumpText");
  if (ta) {
    ta.value = ((ta.value || D_.text || "").trim() + "\n" + ans.map(([q, a]) => `${q} ${a}`).join("\n")).trim();
  }
  D_.questions = [];
  runDump();
}
function plusFor(u) {
  const ids = new Set([
    ...(u.dk || []),
    ...(DATA.rconcepts || []).filter((c) => c.chapters.includes(u.k)).flatMap((c) => c.plus || []),
  ]);
  if (u.board === "dk") ids.delete(u.n);
  return [...ids]
    .map((id) => DATA.topics.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 3);
}
let SAMPLE = null,
  ASSETS = null,
  IMGOK = false;
let FXCHAT = [];
function fxChat(about, photo, at = null) {
  let d = document.getElementById("fxChat");
  if (!d) {
    d = document.createElement("dialog");
    d.id = "fxChat";
    d.className = "fxchat";
    document.body.appendChild(d);
    d.addEventListener("click", (e) => {
      if (e.target === d) d.close();
      const b = e.target.closest("[data-cx]");
      if (!b) return;
      if (b.dataset.cx === "x") d.close();
      if (b.dataset.cx === "plus") plusGo();
      if (b.dataset.cx === "send") fxSend();
      if (b.dataset.cx === "pic") d.querySelector("input[type=file]").click();
      if (b.dataset.cx === "q") {
        d.querySelector("textarea").value = b.dataset.q;
        fxSend();
      }
    });
    d.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && e.target.tagName === "TEXTAREA") {
        e.preventDefault();
        fxSend();
      }
    });
  }
  if (!fxAIOn()) {
    d.innerHTML = `<div class="fxcbox"><div class="fxchead">${iamFace("big")}<b>IAm</b><span class="fxsm">Part of DeepKids Plus</span><button class="fxx" data-cx="x" aria-label="Close">✕</button></div>
      <div class="fxmsgs">${iamFace("hero")}<p class="fxm ai">I am IAm. I can talk with you about any page, card or question once DeepKids Plus is on. Here is everything it opens up:</p>${plusList()}
      <button class="btn accent" data-cx="plus">Get DeepKids Plus</button><button class="btn line sm" data-cx="x">Not now</button></div></div>`;
    if (!d.open) d.showModal();
    return;
  }
  d.dataset.about = about || "";
  d.dataset.where = at?.where || "";
  const u = FXU && document.getElementById("fxDlg")?.open ? FXU : null;
  d.innerHTML = `<div class="fxcbox"><div class="fxchead">${iamFace("big")}<b>IAm</b><span class="fxsm">${u ? "About: " + esc(u.title) : at ? "On " + esc(at.where) : "Any question, any subject"}</span><button class="fxx" data-cx="x" aria-label="Close">✕</button></div>
    <div class="fxmsgs">${FXCHAT.length ? FXCHAT.map((m) => `<p class="fxm ${m.r}">${esc(m.t)}</p>`).join("") : `${iamFace("hero")}<p class="fxm ai">I am IAm. ${at ? `I can see you're on ${esc(at.where)}. Ask me about it, or anything at all.` : `Ask me anything: why the sky is blue, what a word means, how to explain this card to your child. ${about ? "I can see the card you're on." : ""}`}</p>${at ? `<div class="iamasks">${IAM_ASKS[at.kind].map((q) => `<button class="chip" data-cx="q" data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>` : ""}`}</div>
    ${about ? `<p class="fxctx">On this card: “${esc(about.slice(0, 140))}${about.length > 140 ? "…" : ""}”</p>` : ""}
    <div class="fxcin"><button class="fxb" data-cx="pic" aria-label="Add a photo">📷</button><textarea rows="2" placeholder="${photo ? "Add a photo of the finished worksheet, then tap Send" : "Type a question…"}"></textarea><button class="fxb" data-cx="send">Send</button><input type="file" accept="image/*" capture="environment" hidden></div></div>`;
  d.querySelector("input[type=file]").onchange = (e) => {
    d._pic = e.target.files[0] || null;
    if (d._pic) toast("Photo added");
  };
  if (!d.open) d.showModal();
  d.querySelector("textarea").focus();
  if (photo) d.querySelector("input[type=file]").click();
}
async function fxSend() {
  const d = document.getElementById("fxChat"),
    ta = d.querySelector("textarea"),
    q = ta.value.trim(),
    pic = d._pic;
  if (!q && !pic) return;
  ta.value = "";
  d._pic = null;
  FXCHAT.push({ r: "me", t: q || "(photo)" });
  const box = d.querySelector(".fxmsgs");
  box.insertAdjacentHTML(
    "beforeend",
    `<p class="fxm me">${esc(q || "📷 photo")}</p><p class="fxm ai fxwait">Thinking…</p>`,
  );
  d.classList.add("iamthink");
  box.scrollTop = 1e9;
  const u = FXU && document.getElementById("fxDlg")?.open ? FXU : null,
    F = fxSt(),
    age = S.age || 7;
  const input = `You are IAm, the Guru in DeepKids Gurukul, a homeschool app for an Indian family. IAm is a calm, kind lion-man from a world beyond ours where everyone is called IAm; he asks as much as he tells, and never pretends: if asked, say you are an AI speaking as IAm. Be a warm, honest science and learning guide. Reply to ${F.mode === "child" ? `a child aged about ${age}: short sentences, simple words, one idea at a time, end with a question back to them` : "the parent who is teaching: clear, accurate, practical, with one way to explain it to a child"}. Say plainly when scientists don't know or disagree. Keep it under 150 words unless asked for more.
${u ? `They are studying: ${u.title} (${u.id}). Unit summary: ${u.summary.text}` : ""}${d.dataset.where ? `\nThey opened you from ${d.dataset.where} in the app.` : ""}${d.dataset.about ? `\nThe card on their screen says: ${d.dataset.about.slice(0, 1500)}` : ""}${pic ? "\nThey sent a photo of finished work. Mark it kindly: say what is right, what to fix, and why." : ""}
Conversation so far:\n${FXCHAT.slice(-8)
    .map((m) => (m.r === "me" ? "Them: " : "You: ") + m.t)
    .join("\n")}`;
  let txt;
  try {
    const sm = await window.claude?.use?.("sample");
    if (!sm) throw Object.assign(new Error(), { code: "none" });
    const r = await sm(input, {
      purpose: "DeepKids will ask Claude, an AI model made by Anthropic, to answer your question.",
      images: pic ? [pic] : [],
    });
    txt = (r?.text || "").trim() || "Sorry, I couldn't answer that. Try asking another way.";
  } catch (e) {
    txt =
      e?.code === "none"
        ? "DeepKids AI isn't switched on for this account yet. On the website, sign in and turn on DeepKids Plus to ask questions here."
        : e?.code === "cancelled"
          ? "Okay, I didn't send it."
          : "I couldn't reach DeepKids AI just now. Please try again in a moment.";
  }
  FXCHAT.push({ r: "ai", t: txt });
  iamSay(d, txt);
  const w = box.querySelector(".fxwait");
  if (w) {
    w.classList.remove("fxwait");
    w.textContent = txt;
  }
  box.scrollTop = 1e9;
}
function fxFab() {
  if (document.getElementById("fxFab")) return;
  const b = document.createElement("button");
  b.id = "fxFab";
  b.className = "fxfab";
  b.innerHTML = `${iamFace()}<span class="iamtag">Ask me</span>`;
  b.setAttribute("aria-label", "Talk to IAm, the DeepKids Guru (AI). Drag to move him.");
  b.onclick = () => {
    if (b.dataset.dragged) return delete b.dataset.dragged;
    iamLook();
    const at = iamWhere();
    fxChat(at.about, false, at);
  };
  document.body.appendChild(b);
  iamDrag(b);
  iamPlace(b);
  iamFollow();
}
// AI is on for families with DeepKids Plus (on the website), or when switched on for testing
const fxAIOn = () => S.aiPlan === "on" || !!window.DK_PLATFORM?.plus?.()?.on;
