/* ---------- Onboarding: the two tracks, one or more boards, a level per subject (or a quick quiz), the week ---------- */
const FXPQ = {
  math: {
    1: [
      ["What is 7 + 5?", "12"],
      ["Count on in twos: 2, 4, 6, ...", "8"],
      ["Which is more: 14 or 41?", "41"],
    ],
    2: [
      ["What is 46 + 38?", "84"],
      ["What is 52 − 17?", "35"],
      ["How many 10s make 100?", "10"],
    ],
    3: [
      ["What is 6 × 7?", "42"],
      ["Share 24 sweets between 4 children. How many each?", "6"],
      ["What is half of 30?", "15"],
    ],
    4: [
      ["What is 125 × 4?", "500"],
      ["What is 3/4 of 20?", "15"],
      ["Round 4,682 to the nearest hundred.", "4,700"],
    ],
    5: [
      ["What is 0.5 + 0.25?", "0.75"],
      ["What is 15% of 200?", "30"],
      ["A rectangle is 8 cm by 5 cm. What is its area?", "40 square cm"],
    ],
  },
  eng: {
    1: [
      ["Read this word aloud: sun", "sun"],
      ["Which word rhymes with cat: dog, hat, cup?", "hat"],
      ["Say the first sound of 'mango'.", "m"],
    ],
    2: [
      ["Read aloud: The dog ran to the gate.", "read it smoothly"],
      ["What is the plural of 'box'?", "boxes"],
      ["Put in order: the / is / sky / blue", "The sky is blue."],
    ],
    3: [
      ["What does 'enormous' mean?", "very big"],
      ["Find the verb: The girl jumped over the puddle.", "jumped"],
      ["Write the past tense of 'go'.", "went"],
    ],
    4: [
      ["What is a synonym of 'happy'?", "glad, joyful"],
      ["Join with 'because': I stayed home. It rained.", "I stayed home because it rained."],
      ["What is the opposite of 'ancient'?", "modern"],
    ],
    5: [
      ["What is a metaphor? Give one example.", "saying one thing is another: 'The classroom was a zoo.'"],
      ["Change to reported speech: She said, 'I am tired.'", "She said that she was tired."],
      ["What is the main idea of a paragraph?", "what it is mostly about"],
    ],
  },
};
function fxPQ(s, l) {
  if (FXPQ[s]) return FXPQ[s][l] || [];
  const L = DATA.items.filter((i) => i.subj === s && i.level === l && i.c?.p?.check?.length);
  if (!L.length) return [];
  const h = hsh(s + l);
  return [0, 1, 2].map((k) => {
    const u = L[(h + k) % L.length],
      c = u.c.p.check;
    const q = c[(h + k * 7) % c.length];
    return [q.q, q.a];
  });
}
const fxHasPQ = (s) => [1, 2, 3, 4, 5].every((l) => fxPQ(s, l).length);

const fxObNav = (back, label) =>
  `<div class="row" style="justify-content:space-between">${back ? `<button class="btn soft" data-ob="back">Back</button>` : "<span></span>"}<button class="btn" data-ob="next">${label}</button></div>`;
const _vo = viewOnboardingV0,
  _on = obNextV0;

function fxObQuiz() {
  const Q = ob.quiz,
    L = fxPQ(Q.s, Q.l),
    q = L[Q.i];
  return `<div class="ob">${fxObBar(3)}<h1>${SUBJ[Q.s]} quiz</h1><p class="muted">Question ${Q.n + 1}. Ask it out loud. Show the answer only after your child has tried.</p><div class="card"><p style="font-size:20px"><b>${esc(q[0])}</b></p><details><summary class="link">Show the answer</summary><p>${esc(q[1])}</p></details></div><div class="row"><button class="btn" data-obqa="1">They knew it</button><button class="btn soft" data-obqa="0">Not yet</button></div><button class="link" data-obqa="stop">Stop the quiz</button></div>`;
}
document.addEventListener(
  "click",
  (e) => {
    if (!ob) return;
    const d = ob.d,
      t = e.target;
    const tr = t.closest("[data-obtrack]");
    if (tr) {
      e.preventDefault();
      e.stopPropagation();
      d.boards = d.boards?.length ? d.boards : ["ncert"];
      d.board = d.boards[0];
      render();
      return;
    }
    const bb = t.closest("[data-obb]");
    if (bb) {
      e.preventDefault();
      e.stopPropagation();
      const k = bb.dataset.obb;
      d.boards = d.boards.includes(k) ? d.boards.filter((x) => x !== k) : [...d.boards, k];
      d.board = d.boards[0] || "ncert";
      render();
      return;
    }
    const wt = t.closest("[data-obwt]");
    if (wt) {
      e.preventDefault();
      e.stopPropagation();
      const x = +wt.dataset.obwt,
        W = { ...(d.weekType || FXWT0) };
      W[x] = { full: "half", half: "free", free: "full" }[W[x] || "full"];
      d.weekType = W;
      render();
      return;
    }
    const qz = t.closest("[data-obquiz]");
    if (qz) {
      e.preventDefault();
      e.stopPropagation();
      const s = qz.dataset.obquiz;
      ob.quiz = { s, l: d.levels[s] || obCls(d), i: 0, n: 0, k: 0, best: 0, low: 6 };
      render();
      return;
    }
    const a = t.closest("[data-obqa]");
    if (a) {
      e.preventDefault();
      e.stopPropagation();
      const Q = ob.quiz,
        v = a.dataset.obqa;
      if (v === "stop") {
        ob.quiz = null;
        render();
        return;
      }
      if (v === "1") Q.k++;
      Q.i++;
      Q.n++;
      if (Q.i < 3) {
        render();
        return;
      }
      const passed = Q.k >= 2;
      if (passed) Q.best = Math.max(Q.best, Q.l);
      else Q.low = Math.min(Q.low, Q.l);
      const next = passed ? Q.l + 1 : Q.l - 1;
      if (next >= 1 && next <= 5 && next < Q.low && next > Q.best && Q.n < 12) {
        Q.l = next;
        Q.i = 0;
        Q.k = 0;
        render();
        return;
      }
      const lvl = Math.max(1, Q.best || Math.max(1, Q.low - 1));
      d.levels[Q.s] = lvl;
      d.picked = { ...(d.picked || {}), [Q.s]: 1 };
      ob.quiz = null;
      toast(`${SUBJ[Q.s]}: starting at ${lvlLabel(lvl)}. You can change it.`, 5000);
      render();
    }
  },
  true,
);
