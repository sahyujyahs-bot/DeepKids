/* Reading aloud */
function splitSent(t) {
  const out = [];
  let cur = "",
    q = null;
  for (let i = 0; i < t.length; i++) {
    const c = t[i],
      p = t[i - 1] || " ",
      n = t[i + 1] || " ";
    let closed = false;
    if (!q && (c === "“" || (c === "'" && /[\s:(—-]/.test(p)))) {
      q = c === "“" ? "”" : "'";
    } else if (q && (c === q || (q === "'" && c === "’")) && (q === "”" || /[\s.,!?;:)—-]/.test(n))) {
      q = null;
      closed = true;
    }
    cur += c;
    const end =
      (!q && !closed && /[.!?]/.test(c)) || (closed && /[.!?]/.test(p)) || (!q && c === ")" && /[.!?]/.test(p));
    if (end && /\s/.test(n) && /[A-Z('‘“0-9]/.test(t[i + 2] || "")) {
      out.push(cur.trim());
      cur = "";
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function fmtPts(text, plain) {
  if (!text) return "";
  let t = String(text)
    .replace(/\bDays (\d+)\s*(–|-|to|and)\s*(\d+)/g, "Parts $1$2$3")
    .replace(/\bDay (\d+)\b/g, "Part $1")
    .replace(
      /\bDo (Experiment|Activity) [ea]\d+(?:,? [^.]*?)?\.\s*/g,
      (m, k) => `Use the ${k.toLowerCase()} card below. `,
    )
    .replace(/\bDo Worksheet ws\d+(?: \((core|stretch|challenge)\))?\.?/g, "Open the worksheet below.")
    .replace(/\b(?:in |from )?Voice v\d+\b/g, "on the card below")
    .replace(/\bthe ['‘]why['’] of [ea]\d+\b/gi, "'Why it happens' on the card below")
    .replace(/\b(Experiment|Activity) [ea]\d+\b/g, (m, k) => "the " + k.toLowerCase());
  const S = splitSent(t),
    items = [];
  S.forEach((x) => {
    if (/^\(.*\)\.?$/.test(x) && items.length) {
      items[items.length - 1].ans =
        (items[items.length - 1].ans ? items[items.length - 1].ans + " " : "") + x.replace(/^\(|\)\.?$/g, "");
      return;
    }
    const m = x.match(/^(.*?['’”?])\s*\(([^()]+)\)\.?$/);
    if (m && /^(Ask|['‘“])/.test(x)) {
      items.push({ t: m[1], ans: m[2] });
      return;
    }
    items.push({ t: x });
  });
  const ic = (x) =>
    plain
      ? "p-pl"
      : /^Ask:|\bask:\s*['‘“]|^['‘“]|[?]['’”]?$/i.test(x)
        ? "p-ask"
        : /^(Say|Tell|Explain)\b/.test(x)
          ? "p-say"
          : /^(Read|Open|Turn to|Look at)\b/.test(x)
            ? "p-read"
            : /^(If|Note|Be honest|Safety)/.test(x)
              ? "p-note"
              : "p-do";
  return `<ul class="pts">${items.map((x) => `<li class="${ic(x.t)}"><span>${esc(x.t)}</span>${x.ans ? `<span class="ans"><b>Listen for:</b> ${esc(x.ans)}</span>` : ""}</li>`).join("")}</ul>`;
}
let voxQ = [],
  voxDone = [],
  voxOn = false,
  voxPaused = false,
  voxCur = "",
  _vv = null;
function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const V = speechSynthesis.getVoices();
  if (!V.length) return null;
  const fem = /female|woman|veena|heera|neerja|kajal|aditi|swara|lekha|priya|isha|google/i,
    male = /\bmale\b|rishi|ravi|prabhat|hemant|madhur|kumar/i,
    en = V.filter((v) => /en[-_]IN/i.test(v.lang));
  return (
    en.find((v) => fem.test(v.name) && !male.test(v.name)) ||
    en.find((v) => !male.test(v.name)) ||
    en[0] ||
    V.find((v) => /^en/i.test(v.lang) && /female|samantha|zira|susan|karen|moira|tessa/i.test(v.name)) ||
    V.find((v) => /^en/i.test(v.lang)) ||
    null
  );
}
const voxRate = () => S.voiceRate || 0.8;
function speak(text) {
  if (!("speechSynthesis" in window)) {
    toast("Read-aloud isn't available on this phone's browser.");
    return;
  }
  speechSynthesis.cancel();
  const parts =
    String(text)
      .replace(/\s+/g, " ")
      .replace(/ ?([·•]) ?/g, ". ")
      .match(/[^.!?।:;]+[.!?।:;]*/g) || [];
  voxQ = parts.map((x) => x.trim()).filter((x) => x.length > 1);
  voxDone = [];
  voxOn = !!voxQ.length;
  voxPaused = false;
  voxNext();
  voxBar();
}
function voxNext() {
  if (!voxOn || voxPaused) return;
  const t = voxQ.shift();
  if (!t) {
    voxOn = false;
    voxBar();
    return;
  }
  voxCur = t;
  voxDone.push(t);
  const u = new SpeechSynthesisUtterance(t),
    v = _vv || (_vv = pickVoice());
  u.lang = v?.lang || "en-IN";
  if (v)
    try {
      u.voice = v;
    } catch (e) {}
  u.rate = voxRate();
  u.pitch = 1.05;
  u.onend = () => {
    if (voxCur === t) setTimeout(voxNext, S.voiceGap ?? 450);
  };
  u.onerror = () => {
    if (voxCur === t && !voxPaused) setTimeout(voxNext, 50);
  };
  speechSynthesis.speak(u);
  voxBar();
}
function voxCtl(c) {
  if (c === "stop") {
    voxOn = false;
    voxQ = [];
    voxPaused = false;
    voxCur = "";
    speechSynthesis.cancel();
    voxBar();
    return;
  }
  if (c === "pause") {
    if (!voxPaused) {
      voxPaused = true;
      if (voxDone.length) voxQ.unshift(voxDone.pop());
      voxCur = "";
      speechSynthesis.cancel();
    } else {
      voxPaused = false;
      voxNext();
    }
    voxBar();
    return;
  }
  if (c === "back") {
    const cur = voxDone.pop(),
      prev = voxDone.pop();
    if (cur) voxQ.unshift(cur);
    if (prev) voxQ.unshift(prev);
    voxCur = "";
    speechSynthesis.cancel();
    voxPaused = false;
    voxNext();
    return;
  }
  if (c === "skip") {
    voxCur = "";
    speechSynthesis.cancel();
    voxPaused = false;
    voxNext();
    return;
  }
  if (c === "slower" || c === "faster") {
    S.voiceRate = Math.round(Math.min(1.3, Math.max(0.5, voxRate() + (c === "faster" ? 0.1 : -0.1))) * 10) / 10;
    save();
    if (voxOn && !voxPaused) {
      if (voxDone.length) voxQ.unshift(voxDone.pop());
      voxCur = "";
      speechSynthesis.cancel();
      voxNext();
    }
    voxBar();
  }
}
function voxBar() {
  let b = document.getElementById("voxbar");
  if (!voxOn && !voxPaused) {
    if (b) b.remove();
    return;
  }
  if (!b) {
    b = document.createElement("div");
    b.id = "voxbar";
  }
  const host = sheet.open ? sheet : document.body;
  if (b.parentNode !== host) host.appendChild(b);
  b.innerHTML = `<span class="vt">${voxPaused ? "Paused" : "Reading"} · ${voxRate().toFixed(1)}×</span><button data-vox="back" aria-label="Repeat the last sentence">⏮</button><button data-vox="pause" aria-label="${voxPaused ? "Resume" : "Pause"}">${voxPaused ? "▶" : "⏸"}</button><button data-vox="skip" aria-label="Next sentence">⏭</button><button data-vox="slower" aria-label="Slower">🐢</button><button data-vox="faster" aria-label="Faster">🐇</button><button data-vox="stop" aria-label="Stop reading">✕</button>`;
}
function readable(el) {
  if (!el) return "";
  const c = el.cloneNode(true);
  c.querySelectorAll(
    ".spent,.secbar,.kind,button,.ptrack,svg,.tasks-inline,summary,.xs.muted,#voxbar,.readbtn",
  ).forEach((x) => x.remove());
  c.querySelectorAll("h1,h2,h3,p,li,.ask,.src b,.src span,.eyebrow,.idea,.kv span,.kv b").forEach((x) =>
    x.append(" ¶ "),
  );
  return (c.textContent || "")
    .replace(/\s*¶\s*/g, ". ")
    .replace(/([.!?:;])\s*\.\s/g, "$1 ")
    .replace(/\.\s*\./g, ".")
    .replace(/[📖✨🔊]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function readNow() {
  if (sheet.open) {
    const st = document.querySelector("#sheetBody .stage");
    if (st) return speak(readable(st));
    return speak(
      document.getElementById("sheetTitle").textContent + ". " + readable(document.getElementById("sheetBody")),
    );
  }
  speak(readable(document.getElementById("main")));
}
function autoRead() {
  if (S.autoRead && sheet.open && ui.sheet?.mode === "player")
    setTimeout(() => {
      const st = document.querySelector("#sheetBody .stage");
      if (st) speak(readable(st));
    }, 250);
}
