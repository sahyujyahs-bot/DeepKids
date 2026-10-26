/* ---------- DeepKids AI chat: always one tap away (in the feed, in sheets, on every page) ---------- */
let FXCHAT = [];
function fxChat(about, photo) {
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
      if (b.dataset.cx === "send") fxSend();
      if (b.dataset.cx === "pic") d.querySelector("input[type=file]").click();
    });
    d.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && e.target.tagName === "TEXTAREA") {
        e.preventDefault();
        fxSend();
      }
    });
  }
  d.dataset.about = about || "";
  const u = FXU && document.getElementById("fxDlg")?.open ? FXU : null;
  d.innerHTML = `<div class="fxcbox"><div class="fxchead"><b>💬 Ask DeepKids</b><span class="fxsm">${u ? "About: " + esc(u.title) : "Any question, any subject"}</span><button class="fxx" data-cx="x" aria-label="Close">✕</button></div>
    <div class="fxmsgs">${FXCHAT.length ? FXCHAT.map((m) => `<p class="fxm ${m.r}">${esc(m.t)}</p>`).join("") : `<p class="fxm ai">Ask me anything: why the sky is blue, what a word means, how to explain this card to your child. ${about ? "I can see the card you're on." : ""}</p>`}</div>
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
  box.scrollTop = 1e9;
  const u = FXU && document.getElementById("fxDlg")?.open ? FXU : null,
    F = fxSt(),
    age = S.age || 7;
  const input = `You are DeepKids, a warm, honest science and learning guide for an Indian homeschooling family. Reply to ${F.mode === "child" ? `a child aged about ${age}: short sentences, simple words, one idea at a time, end with a question back to them` : "the parent who is teaching: clear, accurate, practical, with one way to explain it to a child"}. Say plainly when scientists don't know or disagree. Keep it under 150 words unless asked for more.
${u ? `They are studying: ${u.title} (${u.id}). Unit summary: ${u.summary.text}` : ""}${d.dataset.about ? `\nThe card on their screen says: ${d.dataset.about.slice(0, 1500)}` : ""}${pic ? "\nThey sent a photo of finished work. Mark it kindly: say what is right, what to fix, and why." : ""}
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
  b.textContent = "💬 Ask";
  b.setAttribute("aria-label", "Ask DeepKids AI");
  b.onclick = () => fxChat("");
  document.body.appendChild(b);
  const sh = document.getElementById("sheet");
  if (sh && !sh.querySelector(".fxfab")) {
    const c = b.cloneNode(true);
    c.id = "";
    c.onclick = () => fxChat(document.getElementById("sheetBody")?.innerText?.slice(0, 1200) || "");
    sh.appendChild(c);
  }
}
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
const fxSongBtns = () => {
  const L = Object.values(DATA.songs || {});
  return L.length
    ? `<span class="eyebrow">Songs</span><div class="row chips">${L.map((sg) => `<button class="chip" data-act="fxsong" data-s="${esc(sg.id)}">🎵 ${esc(sg.title)}</button>`).join("")}</div>`
    : "";
};
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
/* a subtopic-level unit in the library and the daily plan: its parts are packed into days by the subject's daily minutes */
function fxParts(u) {
  return DATA.units?.[u?.c?.unit || u?.id]?.parts || [];
}
/* the spine (core path, about 2 sessions) comes first; the rest of the unit is "Go deeper", offered after the spine */
function fxSpineIdsV0(u) {
  const I = DATA.units?.[u?.c?.unit || u?.id] || {},
    P = I.parts || [];
  return I.spine?.length ? I.spine.filter((id) => P.some((p) => p[0] === id)) : P.map((p) => p[0]);
}
function fxSpineIds(u) {
  const base = fxSpineIdsV0(u),
    id = u?.c?.unit || u?.id,
    I = DATA.units?.[id] || {},
    B = S.bought || {},
    add = [];
  (I.buy || []).forEach((b) => {
    if (B[id + "|" + b.item])
      (b.used_in || []).forEach((x) => {
        if ((I.parts || []).some((p) => p[0] === x) && !base.includes(x) && !add.includes(x)) add.push(x);
      });
  });
  return [...base, ...add];
}
function fxPack(u, L) {
  const cap = Math.max(20, Math.round(hpdOf(u.subj || "sci") * 60)),
    D = [];
  let cur = [],
    m = 0;
  for (const p of L) {
    if (cur.length && m + p[3] > cap) {
      D.push(cur);
      cur = [];
      m = 0;
    }
    cur.push(p);
    m += p[3];
  }
  if (cur.length) D.push(cur);
  return D;
}
function fxSpineDays(u) {
  const P = fxParts(u),
    sp = fxSpineIds(u);
  return fxPack(
    u,
    sp.map((id) => P.find((p) => p[0] === id)),
  );
}
function fxDeeper(u) {
  const sp = new Set(fxSpineIds(u));
  return fxParts(u).filter((p) => !sp.has(p[0]));
}
function fxDayPlan(u) {
  const D = [...fxSpineDays(u), ...fxPack(u, fxDeeper(u))];
  return D.length ? D : [[]];
}
function fxDaySteps(u, n) {
  const D = fxDayPlan(u),
    day = D[Math.min(n, D.length) - 1] || [],
    id = u.c.unit,
    P = fxParts(u);
  return day.map((p) => {
    const [lab, ic] = FXKC[fxGroup(p[2])] || ["Part", "✨"],
      i = P.findIndex((x) => x[0] === p[0]);
    return {
      kind: p[2] === "worksheets" ? "work" : p[2] === "quiz" ? "check" : "learn",
      label: lab,
      icon: ic,
      title: p[1],
      mins: p[3] / 60,
      html: `<p class="xs"><button class="link" data-act="fxopen" data-u="${esc(id)}">📚 Open the whole unit: every part, games, worksheets and more</button></p><p class="xs muted">Part ${i + 1} of ${P.length} · ${p[3]} min · ${{ done: "✔ done", pending: "⏳ pending: questions left", going: "▶ started", none: "not started" }[fxStates(id)[i]]}</p><button class="btn sm" data-act="fxpart" data-u="${esc(id)}" data-p="${esc(p[0])}">${ic} Open this part</button>`,
    };
  });
}
const fxUnitBtns = (L) =>
  L.map((x) => {
    const I = DATA.units?.[x.id] || {},
      k = "unit|" + x.id,
      u = unitBy(k),
      P = I.parts || [],
      X = fxStates(x.id),
      isD = (p) => X[P.indexOf(p)] === "done",
      nd = P.filter(isD).length,
      np = X.filter((z) => z === "pending").length,
      SD = u ? fxSpineDays(u) : [],
      tot = P.reduce((a, p) => a + p[3], 0),
      D = u ? fxDayPlan(u) : [],
      di = Math.max(
        0,
        D.findIndex((d) => d.some((p) => !isD(p))),
      ),
      day = D[di] || [],
      s = u?.subj || "sci";
    return `<div class="fxucard"><button class="fxopenbtn" data-act="fxopen" data-u="${esc(x.id)}">${I.img?.summary ? `<img src="${esc(I.img.summary)}" alt="">` : "<span>▶</span>"}<span><b>${esc(x.title)}</b><br><span class="xs muted">Subtopic: ${esc(I.subtopic || "")} · Topic: ${esc(I.topic || "")}</span></span></button>
  <ul class="fxustat xs"><li><b>Next session:</b> ${day.reduce((m, p) => m + p[3], 0)} min · ${di < SD.length ? `core session ${di + 1} of ${SD.length}` : "go deeper"}: ${day
    .map((p) => esc(p[1]))
    .slice(0, 3)
    .join(
      ", ",
    )}${day.length > 3 ? "…" : ""}</li><li><b>Whole unit:</b> about ${Math.round((tot / 60) * 10) / 10} hours, ${D.length} sessions</li><li><b>Core path:</b> ${SD.length} sessions${u && rank[fxUnitSt(k)] >= 2 ? " · done ✔" : ""} · <b>Go deeper:</b> ${u ? fxDeeper(u).length : 0} more parts</li><li><b>Done:</b> ${nd} of ${P.length} parts${np ? ` · ${np} pending` : ""}</li></ul>
  ${(S.extra?.[s] || []).includes(k) ? `<p class="xs"><b>✓ In the plan</b> · ${(S.next?.[s] || [])[0] === k ? "comes next" : "in the queue"} · <button class="link xs" data-fxsee="${s}" data-k="${esc(k)}">See it in Plan</button></p>` : `<div class="row" style="align-items:center"><button class="btn sm" data-act="fxq" data-front="1" data-s="${s}" data-k="${esc(k)}">＋ Add to plan</button><button class="link xs" data-act="fxq" data-s="${s}" data-k="${esc(k)}">or add it at the end</button></div>`}</div>`;
  }).join("");
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

SEGS.week.splice(SEGS.week.findIndex((x) => x[0] === "queue") + 1, 0, [
  "refresh",
  "Refresher",
  "Questions answered wrongly in any unit, with their explanations, to practise until they're right",
]);

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
