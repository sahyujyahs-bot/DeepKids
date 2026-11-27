// Animated slides for video 1. Each slide is a page whose elements appear on a timeline (css animation delays).
const fs = require("fs");
const B = "http://127.0.0.1:8796/";
const head = fs.readFileSync("/tmp/sh/dna/sb/make5.js", "utf8");
const rawCss = fs.readFileSync("/tmp/sh/dna/sb/make2.js", "utf8"); 
const css0 = rawCss.slice(rawCss.indexOf("const CSS = `") + 13, rawCss.indexOf("`;\nconst DNAC"));
const CSS5 = head.slice(head.indexOf("const CSS = CSS0 + `") + 20, head.indexOf("`;\nconst page"));
const CSS = new Function("B", "CSS0", "return CSS0+`" + CSS5 + "`")(B, new Function("B", "return `" + css0 + "`")(B)) + `
.an{opacity:0;animation:aIn .6s cubic-bezier(.2,.8,.2,1) var(--d,0s) forwards}
.l{animation-name:aL}.r{animation-name:aR}.b{animation-name:aB}.g{animation-name:aG}.w{animation-name:aW;animation-duration:1s}
@keyframes aIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes aL{from{opacity:0;transform:translateX(-90px)}to{opacity:1;transform:none}}
@keyframes aR{from{opacity:0;transform:translateX(90px)}to{opacity:1;transform:none}}
@keyframes aB{from{opacity:0;transform:translateY(80px)}to{opacity:1;transform:none}}
@keyframes aG{0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
@keyframes aW{from{opacity:1;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0 0 0)}}
.fl{animation:fl 2.6s ease-in-out infinite}@keyframes fl{50%{transform:translateY(-10px)}}
.sw{animation:sw 3s ease-in-out infinite}@keyframes sw{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.spin{animation:sp 7s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
.cam{animation:cam 20s ease-out forwards;transform-origin:50% 40%}@keyframes cam{from{transform:scale(1)}to{transform:scale(1.045)}}
.drop{animation:dr 1.6s ease-in infinite}@keyframes dr{0%{transform:translateY(-20px);opacity:0}30%{opacity:1}100%{transform:translateY(40px);opacity:0}}
.wd{opacity:0;animation:aIn .35s ease-out forwards}
`;
const A = (d, k = "") => `class="an ${k}" style="--d:${d}s"`;
// reveal a sentence word by word starting at t0, w seconds per word
const words = (txt, t0, w) => txt.split(" ").map((x, i) => `<span class="wd" style="animation-delay:${(t0 + i * w).toFixed(2)}s">${x} </span>`).join("");
const wordsH = (html, t0, w) => html.replace(/(<[^>]+>)|([^<\s]+)/g, (m, tag, word) => tag ? tag : `<span class="wd" style="animation-delay:${(t0 += w).toFixed(2)}s">${word}</span>`);
const page = (title, sub, stage, dur) => `<meta charset="utf-8"><style>${CSS}.top,.dots{display:none}.st{display:none}html,body{background:#efe3cf}</style><div class="abs" style="left:0;top:34px;width:540px;text-align:center;font:400 16px Norwester;letter-spacing:.16em;color:#c8402f">DEEPKIDS GURUKUL</div><div class="abs" style="left:0;top:916px;width:540px;text-align:center;font:400 18px Norwester;letter-spacing:.12em;color:#1F2440;opacity:.7">APP.DEEPKIDS.IN</div><div style="position:absolute;left:0;top:196px;width:540px;height:564px;overflow:hidden">${stage}</div>`;
const helixBar = (x, y, w, h, d) => `<div ${A(d, "w")} style="--d:${d}s;position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="abs" style="left:0;top:0;width:${w}px;height:${h}px;background:#cfbdf0;border:4px solid #1F2440;border-radius:${h / 2}px;overflow:hidden"><img src="${B}dna_helix.png" style="position:absolute;left:50%;top:50%;height:${w}px;margin-left:${-w * 0.145 * 1.5}px;margin-top:${-w / 2}px;transform:rotate(90deg) scale(.6)"><img src="${B}dna_helix.png" style="position:absolute;left:50%;top:50%;height:${w}px;margin-left:${w * 0.2}px;margin-top:${-w / 2}px;transform:rotate(90deg) scale(.6)"></div></div>`;
const css2 = `<style>
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes drawl{to{stroke-dashoffset:0}}@keyframes pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes gone{to{opacity:0;transform:scale(.6)}}@keyframes flip{0%{transform:rotateY(180deg)}100%{transform:rotateY(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(255,209,102,.0)}50%{box-shadow:0 0 28px 10px rgba(255,209,102,.9)}}
@keyframes fog{to{transform:translateX(420px);opacity:0}}@keyframes fogl{to{transform:translateX(-420px);opacity:0}}
@keyframes fall{0%{transform:translateY(-60px);opacity:0}20%{opacity:1}100%{transform:translateY(0);opacity:1}}
@keyframes pencil{0%{transform:translate(0,0)}100%{transform:translate(200px,90px)}}
@keyframes split1{to{transform:translateX(-125px)}}@keyframes split2{to{transform:translateX(125px)}}
@keyframes fly{from{opacity:0;transform:translate(var(--fx),var(--fy)) scale(.5)}to{opacity:1;transform:none}}
.o{opacity:0;animation:aIn .6s ease-out var(--d,0s) forwards}
.sx{transform-origin:0 50%;animation:growx 1s ease-out var(--d,0s) both}.sy{transform-origin:50% 0;animation:grow 1.2s ease-out var(--d,0s) both}.sb{transform-origin:50% 100%;animation:grow 1.6s ease-out var(--d,0s) both}
.pp{opacity:0;animation:pop .6s cubic-bezier(.2,.8,.2,1) var(--d,0s) forwards}
.gn{animation:gone .6s ease-in var(--d,0s) forwards}.dr{stroke-dasharray:var(--len,300);stroke-dashoffset:var(--len,300);animation:drawl var(--t,2s) ease-out var(--d,0s) forwards}
</style>`;
const helixIn = (l, t, d, extra = "") => `<div class="nuc" style="left:${l}px;top:${t}px;width:${d}px;height:${d}px"><img src="${B}dna_helix.png" style="left:50%;top:50%;height:${d * 1.02}px;margin-left:-${d * 0.145}px;margin-top:-${d * 0.51}px;transform:rotate(90deg) scale(.8)">${extra}</div>`;
const cellDiv = (cls, d0, l, t, w, fill, nuc, label, extra = "") => `<div class="${cls}" style="--d:${d0}s;position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${w}px"><div class="abs" style="left:0;top:0;width:${w}px;height:${w}px;border-radius:50%;background:${fill};border:5px solid #1F2440"></div>${helixIn(w * 0.22, w * 0.22, w * 0.56)}${label ? `<div class="tag" style="left:${w / 2}px;top:${w + 24}px;font-size:22px">${label}</div>` : ""}${extra}</div>`;
const ST = [];
// 1 ---------------------------------------------------------------- 19.8 s (Alba reads the three questions)
const DNAC = { A: "#f5c400", T: "#d40000", C: "#0066ff", G: "#00a000" };
const LN = (d, t, e) => `<div class="o" style="--d:${d}s;position:absolute;left:14px;width:512px;top:480px;text-align:center;font:400 22px/1.2 Futura;color:#1F2440">${t}</div>`;
const panel = (s0, s1, inner) => `<div style="position:absolute;inset:0;opacity:0;animation:aIn .5s ease-out ${s0}s forwards${s1 ? `,gone .5s ease-in ${s1}s forwards` : ""}">${inner}</div>`;
ST.push([19.8, "", "",
  css2 +
  panel(0.2, 7.3, `<style>@keyframes dvL{0%{opacity:0;transform:translate(135px,-232px) scale(.5)}12%{opacity:1}100%{opacity:1;transform:none}}@keyframes dvR{0%{opacity:0;transform:translate(-135px,-232px) scale(.5)}12%{opacity:1}100%{opacity:1;transform:none}}@keyframes neck{0%{stroke-width:0}35%{stroke-width:62}100%{stroke-width:0}}</style>
    <div class="tag" style="left:270px;top:24px;font-size:23px">Every cell has the same DNA</div>
    <svg class="abs" style="left:0;top:0" width="540" height="564" viewBox="0 0 540 564"><g stroke-linecap="round" fill="none"><line x1="270" y1="138" x2="135" y2="368" stroke="#f6b8c9" stroke-width="0" style="animation:neck 1.7s ease-in-out 3.3s forwards"/><line x1="270" y1="138" x2="405" y2="368" stroke="#efe3c4" stroke-width="0" style="animation:neck 1.7s ease-in-out 3.3s forwards"/></g></svg>
    ${cellDiv("pp", 0.7, 185, 53, 170, "#f8cfbd", 0, "")}
    <div style="position:absolute;left:55px;top:293px;width:160px;height:200px;opacity:0;animation:dvL 1.5s cubic-bezier(.3,.1,.2,1) 3.3s both">${cellDiv("", 0, 0, 0, 160, "#f6b8c9", 0, "skin cell")}</div>
    <div style="position:absolute;left:325px;top:293px;width:160px;height:200px;opacity:0;animation:dvR 1.5s cubic-bezier(.3,.1,.2,1) 3.3s both">${cellDiv("", 0, 0, 0, 160, "#efe3c4", 0, "bone cell")}</div>
    ${LN(5.4, "How did each cell know to become skin or bone?").replace("top:480px", "top:518px")}`) +
  panel(7.7, 14.2, `<style>@keyframes sfall{0%{opacity:0;transform:translateY(-330px) rotate(-30deg)}15%{opacity:1}100%{opacity:1;transform:translateY(0) rotate(0)}}</style>
    <div class="tag" style="left:270px;top:46px;font-size:23px">A tiny seed holds the plan</div>
    <svg class="abs gn" style="--d:10.7s;left:0;top:0" width="540" height="564" viewBox="0 0 540 564">
     <rect x="0" y="330" width="540" height="234" fill="#a77b4f"/><rect x="0" y="330" width="540" height="14" fill="#6b9a3c"/>
     <path d="M20 470 q30 -10 60 0 M400 500 q40 -12 80 0 M180 520 q30 -8 60 0" stroke="#8a6238" stroke-width="5" fill="none" stroke-linecap="round"/>
     <ellipse style="animation:sfall .9s ease-in 8s both" cx="270" cy="400" rx="20" ry="14" fill="#6b4a2a" stroke="#1F2440" stroke-width="4"/>
     <path class="dr" style="--len:200;--d:9s;--t:1.5s" d="M270 414 C268 450 250 470 238 510 M270 414 C272 455 292 478 304 514 M270 414 L270 530" fill="none" stroke="#f3e6c8" stroke-width="6" stroke-linecap="round"/>
     <path class="dr" style="--len:260;--d:9.4s;--t:1.4s" d="M270 388 C266 340 274 290 270 210" fill="none" stroke="#3c8a3f" stroke-width="10" stroke-linecap="round"/>
     <g class="pp" style="--d:10.3s;transform-origin:270px 210px"><path d="M270 210 C226 184 200 208 212 238 C240 246 264 232 270 210Z" fill="#6bbf59" stroke="#1F2440" stroke-width="4"/><path d="M270 210 C314 184 340 208 328 238 C300 246 276 232 270 210Z" fill="#6bbf59" stroke="#1F2440" stroke-width="4"/></g></svg>
    <svg class="abs" style="left:0;top:90px" width="540" height="340" viewBox="0 0 540 340"><ellipse class="pp" style="--d:10.9s;transform-origin:110px 190px" cx="110" cy="190" rx="52" ry="36" fill="#7a4a24" stroke="#1F2440" stroke-width="5"/><text class="pp" style="--d:12.5s;transform-origin:270px 190px" x="270" y="215" font-size="110" text-anchor="middle" font-family="Norwester" fill="#c8402f">=?</text><text class="pp" style="--d:11.7s;transform-origin:420px 200px" x="420" y="240" font-size="130" text-anchor="middle">🌿</text></svg>
    ${LN(11, "Is the plan the same as the plant?")}`) +
  panel(14.3, 0, `<div class="tag" style="left:270px;top:46px;font-size:23px">Every living thing: the same four letters</div>
    <div class="abs" style="left:60px;top:100px;width:420px;display:flex;gap:16px;justify-content:center">${["A", "T", "C", "G"].map((c, i) => `<div class="pp" style="--d:${14.6 + i * .3}s;width:84px;height:84px;border-radius:16px;border:4px solid #1F2440;background:${DNAC[c]};color:#fff;font:400 54px/76px Norwester;text-align:center">${c}</div>`).join("")}</div>
    <div class="abs" style="left:20px;top:240px;width:500px;display:flex;justify-content:space-around;font-size:78px">${["🌿", "🐘", "🧑", "🐟", "🦋"].map((e, i) => `<span class="pp" style="--d:${16.6 + i * .3}s">${e}</span>`).join("")}</div>
    ${LN(17.4, "Are we all the same, then?")}`)]);
// 2 ----------------------------------------------------------------- 6.6 s
ST.push([6.6, "Stay with <b>the question</b>", "Answers come from within.",
  css2 + `<svg class="abs" style="left:0;top:0" width="540" height="564" viewBox="0 0 540 564">
   <rect x="0" y="300" width="540" height="264" fill="#a77b4f"/><rect x="0" y="300" width="540" height="14" fill="#6b9a3c"/>
   <ellipse cx="270" cy="400" rx="30" ry="20" fill="#6b4a2a" stroke="#1F2440" stroke-width="4"/>
   <path class="dr" style="--len:200;--d:1s;--t:2.2s" d="M270 420 C270 460 250 480 240 520 M270 420 C272 470 290 490 300 525 M270 420 L270 540" fill="none" stroke="#f3e6c8" stroke-width="7" stroke-linecap="round"/>
   <path class="dr" style="--len:330;--d:2.4s;--t:2.6s" d="M270 385 C268 340 272 290 270 190" fill="none" stroke="#3c8a3f" stroke-width="12" stroke-linecap="round"/>
   <g class="pp" style="--d:4.8s;transform-origin:270px 190px"><path d="M270 190 C220 160 190 190 205 225 C235 235 262 215 270 190Z" fill="#6bbf59" stroke="#1F2440" stroke-width="4"/><path d="M270 190 C320 160 350 190 335 225 C305 235 278 215 270 190Z" fill="#6bbf59" stroke="#1F2440" stroke-width="4"/></g>
   <g class="gn" style="--d:4.6s"><text x="270" y="110" font-size="120" text-anchor="middle" font-family="Norwester" fill="#c8402f">?</text></g>
   <g class="pp" style="--d:5s;transform-origin:270px 110px"><text x="270" y="140" font-size="100" text-anchor="middle">💡</text></g></svg>
   <div class="o" style="--d:.5s;position:absolute;left:0;right:0;top:12px;text-align:center;font:400 24px Futura;color:#5d5670">a seed, some time, and a question</div>`]);
// 3 ----------------------------------------------------------------- 18 s
ST.push([18, "Many views. <b>Not one answer.</b>", "Textbooks avoid perspectives. We embrace them.",
  css2 + `<div class="o" style="--d:.4s;position:absolute;left:14px;top:8px;width:250px;text-align:center"><div class="em">🧑‍🔬</div><div class="eb">MANY GENETICISTS</div></div>
   <div class="card pp" style="--d:2s;left:16px;top:112px;width:246px;height:196px;padding:10px;text-align:center;transform-origin:20% 0"><img src="${B}dna_helix.png" style="height:120px"><div class="q" style="font-size:20px;margin-top:4px">DNA decides <b>almost everything</b></div></div>
   <div class="o" style="--d:6s;position:absolute;left:276px;top:8px;width:250px;text-align:center"><div class="em">👩‍🔬</div><div class="eb">MANY BIOLOGISTS</div></div>
   <div class="card pp" style="--d:8s;left:278px;top:112px;width:246px;height:196px;padding:10px;text-align:center;transform-origin:80% 0"><div style="position:relative;height:120px"><img src="${B}dna_helix.png" style="height:112px"><span class="abs fl" style="left:10px;top:0;font-size:38px">☀️</span><span class="abs fl" style="right:14px;top:0;font-size:38px">💧</span><span class="abs fl" style="right:14px;top:74px;font-size:38px">🌡️</span></div><div class="q" style="font-size:20px;margin-top:4px">DNA and <b>surroundings</b> work together</div></div>
   <div class="tag pp" style="--d:10.6s;left:270px;top:210px;font-size:30px;background:#ffd166">vs</div>
   <svg class="abs" style="left:0;top:330px" width="540" height="230" viewBox="0 0 540 230">
    <text class="o" style="--d:12.2s" x="30" y="30" font-size="22" font-family="Futura" fill="#5d5670">textbooks: one path</text>
    <path class="dr" style="--len:200;--d:12.4s;--t:1.4s" d="M30 60 H230" stroke="#9aa0b0" stroke-width="7" fill="none" stroke-linecap="round"/>
    <text class="o" style="--d:14.4s" x="30" y="122" font-size="22" font-family="Futura" fill="#c8402f">DeepKids: many paths</text>
    <g fill="none" stroke-width="7" stroke-linecap="round"><path class="dr" style="--len:300;--d:14.6s;--t:2.2s" d="M30 190 C120 190 150 150 260 150" stroke="#3c8a3f"/><path class="dr" style="--len:300;--d:14.8s;--t:2.2s" d="M30 190 C150 190 200 190 260 190" stroke="#2f6fb5"/><path class="dr" style="--len:300;--d:15s;--t:2.2s" d="M30 190 C120 190 150 230 260 225" stroke="#e8a317"/><path class="dr" style="--len:300;--d:15.2s;--t:2.2s" d="M30 190 C100 190 130 150 250 146" stroke="#7a4fb5"/></g>
    <g class="pp" style="--d:16.6s"><text x="330" y="180" font-size="60">🌍</text></g></svg>`]);
// 4 ----------------------------------------------------------------- 10.4 s
const Q4 = [["🧬", "How did the first instructions for life begin?", "#d7efe6", 20, 24], ["🧩", "How does a cell choose which genes to use?", "#e9e0fb", 90, 136], ["🧅", "Why does an onion have more DNA than a person?", "#fde9c9", 20, 248], ["✋", "How does a body grow the right shape?", "#fbd9e0", 90, 360]];
ST.push([10.4, "What <b>nobody knows</b> yet", "Maybe your child will find the answer.",
  css2 + `<div class="abs" style="left:0;top:0;width:540px;height:564px;background:linear-gradient(#b9c4dc,#e6dccb)"></div>
   ${Q4.map(([e, t, c, x, y], i) => `<div class="chip o" style="--d:${1.2 + i * 1.9}s;animation-name:aIn;left:${x}px;width:430px;top:${y}px;height:100px;background:${c};animation:aIn .6s ease-out ${1.2 + i * 1.9}s forwards,glow 1.6s ease-in-out ${1.4 + i * 1.9}s 2"><span class="em" style="font-size:44px">${e}</span><span style="font-size:23px">${t}</span></div>`).join("")}
   <div class="abs" style="left:-50px;top:0;width:640px;height:564px;background:radial-gradient(ellipse at 30% 30%,rgba(255,255,255,.96),rgba(255,255,255,.0) 70%);animation:fog 6s ease-in .4s forwards"></div>
   <div class="abs" style="left:0;top:200px;width:640px;height:364px;background:radial-gradient(ellipse at 70% 60%,rgba(255,255,255,.95),rgba(255,255,255,0) 70%);animation:fogl 6s ease-in .4s forwards"></div>
   <div class="abs o" style="--d:7.2s;left:380px;top:430px;font-size:100px">🧒<span style="display:inline-block;transform:rotate(-20deg)">🔭</span></div>`]);
// 5 ------------------------------------------------------------------ 9 s
ST.push([9, "<b>\"It runs in the blood.\"</b> Does it?", "Is it in your blood, or in your DNA?",
  css2 + `<div class="card o" style="--d:.3s;left:24px;top:12px;width:492px;height:84px;padding:14px;text-align:center;font:400 25px/1.2 Futura">"Features pass from parents to children <b style="color:#c8402f">through the blood</b>."</div>
   <div class="o" style="--d:2.6s;position:absolute;left:24px;top:116px;width:236px;text-align:center"><div class="eb">A RED BLOOD CELL</div></div>
   <div class="pp" style="--d:3s;position:absolute;left:70px;top:150px;width:140px;height:140px"><div class="abs" style="left:0;top:0;width:140px;height:140px;border-radius:50%;background:#e2352d;border:5px solid #1F2440"></div><div class="abs" style="left:32px;top:32px;width:76px;height:76px;border-radius:50%;background:#bf241d;border:3px dashed #1F2440"></div><div class="abs" style="left:-6px;top:-6px;right:-6px;bottom:-6px;border-radius:50%;border:5px solid #c8402f;animation:glow 1.5s ease-in-out 4.2s 2"></div></div>
   <div class="tag pp" style="--d:4.4s;left:140px;top:330px;font-size:24px">no DNA inside</div>
   <div class="o" style="--d:5.4s;position:absolute;left:280px;top:116px;width:236px;text-align:center"><div class="eb" style="color:#3c8a3f">AN EGG CELL</div></div>
   ${cellDiv("pp", 5.8, 322, 150, 150, "#f8cfbd", 0, "")}
   <div class="tag pp" style="--d:6.8s;left:380px;top:330px;font-size:24px">DNA inside</div>
   <svg class="abs" style="left:0;top:350px" width="540" height="100" viewBox="0 0 540 100"><path class="dr" style="--len:220;--d:7.4s;--t:1.2s" d="M400 20 C400 60 300 60 270 80" stroke="#3c8a3f" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
   <div class="pp" style="--d:8.2s;position:absolute;left:200px;top:440px;font-size:80px">👶</div><div class="o" style="--d:8.3s;position:absolute;left:290px;top:470px;font:400 24px Futura;color:#3b3552">DNA passes on</div>`]);
// 6 ------------------------------------------------------------------ 7.2 s
ST.push([7.2, "A definition <b>is not enough</b>", "We go deep.",
  css2 + `<div class="card o" style="--d:.3s;left:20px;top:8px;width:500px;height:70px;padding:8px 14px;background:#eee8dc;font:400 20px/1.2 Futura;color:#5d5670;border-style:dashed">A textbook: <b style="color:#1F2440">"DNA is a molecule that carries genetic information."</b></div>
   <div class="abs sy" style="--d:1s;left:10px;top:90px;width:10px;height:460px;background:linear-gradient(#c8402f,#7a4fb5);border-radius:5px"></div>
   <div class="o" style="--d:1s;position:absolute;left:-6px;top:540px;font:400 18px Norwester;color:#7a4fb5;transform:rotate(-90deg);transform-origin:0 0;top:560px">DEEPER</div>
   ${[["expl.0", "What it is"], ["expl.2", "How it works"], ["expl.3", "From gene to protein"], ["expl.4", "Same book, different pages"], ["expl.5", "Where it comes from"], ["expl.6", "Where scientists disagree"], ["expl.7", "What is still unknown"], ["expl.1", "How we see it"]].map(([f, t], i) => `<div class="card o" style="--d:${1.2 + i * .6}s;animation-name:aIn;left:${34 + (i % 2) * 248}px;top:${92 + Math.floor(i / 2) * 116}px;width:240px;height:106px;display:flex;align-items:center;gap:10px;padding:8px"><img src="${B}${f}.webp" style="width:84px;height:84px;object-fit:cover;border-radius:10px"><span style="font:400 21px/1.15 Futura">${t}</span></div>`).join("")}`]);
// 7 ------------------------------------------------------------------- 8 s
const H7 = [["🩹", "1869", "Miescher finds a new substance in bandage cells", "#fde9c9"], ["🧫", "1944", "Avery: DNA changes harmless bacteria", "#d7efe6"], ["🦠", "1952", "Hershey and Chase: DNA carries the instructions", "#e9e0fb"]];
ST.push([8, "How we <b>found out</b>", "A real story, told in pictures.",
  css2 + `<div class="abs sy" style="--d:.2s;left:46px;top:10px;width:6px;height:490px;background:#1F2440;opacity:.25"></div>` + H7.map(([e, y, t, c], i) => `<div class="chip o" style="--d:${.5 + i * 1.3}s;animation-name:aIn;left:20px;right:20px;top:${10 + i * 112}px;height:100px;background:${c}"><span class="em pp" style="--d:${.8 + i * 1.3}s;font-size:50px">${e}</span><span><span style="font:400 24px Norwester;color:#c8402f;display:block">${y}</span><span style="font-size:22px">${t}</span></span></div>`).join("") +
  `<div class="chip o" style="--d:4.6s;left:20px;right:20px;top:346px;height:110px;background:#fbd9e0"><div class="abs" style="left:14px;top:10px;width:90px;height:90px;border-radius:12px;background:#10121f;overflow:hidden"><div class="abs" style="left:0;top:0;width:100%;height:100%;animation:aIn 2.4s ease-in 4.8s both;opacity:0"><div class="abs" style="left:10px;top:42px;width:70px;height:6px;background:#fff;transform:rotate(35deg)"></div><div class="abs" style="left:10px;top:42px;width:70px;height:6px;background:#fff;transform:rotate(-35deg)"></div><div class="abs" style="left:18px;top:18px;width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:40px 40px #fff,40px 0 #fff,0 40px #fff"></div></div></div><span style="margin-left:110px"><span style="font:400 24px Norwester;color:#c8402f;display:block">1953</span><span style="font-size:22px">Franklin's X-ray photo shows the twist</span></span></div>
   <div class="abs o" style="--d:6.6s;left:20px;right:20px;top:480px;height:60px;border-radius:16px;background:#1F2440;color:#fff;font:400 20px/60px Futura;text-align:center;animation:aIn .6s ease-out 6.6s forwards,glow 1.4s ease-in-out 7s 1">Rosalind Franklin died in 1958, before the Nobel.</div>`]);
// 8 ------------------------------------------------------------------ 14.2 s
ST.push([14.2, "Questions as old <b>as humans</b>", "Passages from old texts, beside what science shows.",
  css2 + `<div class="card o" style="--d:.4s;left:18px;top:10px;width:504px;height:170px;padding:12px 16px;display:flex;gap:14px;align-items:center;background:#fdf2dc"><div style="position:relative;width:90px;height:110px;flex:none"><div class="abs gn" style="--d:2.8s;left:20px;top:70px;width:50px;height:34px;border-radius:50%;background:#7a4a24;border:4px solid #1F2440"></div><div class="abs sb" style="--d:3s;left:0;top:0;font-size:96px;line-height:1.05;transform-origin:50% 100%">🌳</div></div><span><span class="eb">CHANDOGYA UPANISHAD · INDIA</span><br><span class="dev" style="font-size:22px;color:#7a4fb5">किमत्र पश्यसीति । न किंचन भगव इति</span><br><span style="font:400 22px/1.2 Futura">Break open the banyan seed. Nothing to see. Yet a whole tree is in it.</span></span></div>
   <div class="card o" style="--d:5.6s;left:18px;top:192px;width:504px;height:150px;padding:12px 16px;display:flex;gap:14px;align-items:center;background:#e5f3ea"><div style="width:90px;height:100px;flex:none;position:relative"><div class="abs sb" style="--d:6.2s;left:0;top:0;font-size:84px;line-height:1.1">🌱</div></div><span><span class="eb">BHAGAVAD GITA 7.10 · INDIA</span><br><span class="dev" style="font-size:22px;color:#7a4fb5">बीजं मां सर्वभूतानां विद्धि</span><br><span style="font:400 22px/1.2 Futura">"Know me as the eternal seed of all beings."</span></span></div>
   <div class="card o" style="--d:9s;left:18px;top:354px;width:504px;height:190px;padding:12px 16px;display:flex;gap:14px;align-items:center;background:#e8eefb"><div style="position:relative;width:110px;height:140px;flex:none"><div class="abs" style="left:10px;top:30px;width:90px;height:110px;background:#fff;border:4px solid #1F2440;border-radius:6px"></div><div class="abs o" style="--d:10s;--fy:-40px;--fx:0px;animation-name:fly;left:0;top:-4px;font-size:36px">☁️</div><div class="abs o" style="--d:11.2s;--fy:-40px;--fx:0px;animation-name:fly;left:36px;top:34px;font-size:32px">🌧️</div><div class="abs o" style="--d:12.4s;--fy:-40px;--fx:0px;animation-name:fly;left:52px;top:74px;font-size:36px">🌳</div></div><span><span class="eb">THICH NHAT HANH · VIETNAM, 1988</span><br><span style="font:400 22px/1.2 Futura;margin-top:6px;display:block">Look deeply at a sheet of paper: the cloud, the rain and the tree are in it. Nothing stands alone.</span></span></div>`]);
// 9 ------------------------------------------------------------------ 10.6 s
ST.push([10.6, "Kids learn <b>through play</b>", "Printable games, worksheets, experiments and activities in every unit.",
  css2 + `<div class="card o" style="--d:.4s;left:20px;top:14px;width:246px;height:250px;overflow:hidden;perspective:600px"><div class="abs" style="left:0;top:0;width:100%;height:190px;background:#eac27a"></div><div class="abs" style="left:10px;top:20px;width:106px;height:150px;border-radius:10px;background:#fffdf6;border:3px solid #1F2440;animation:flip 1s ease-out 1.1s both;backface-visibility:hidden;overflow:hidden"><img src="${B}setup.g1.1.webp" style="position:absolute;left:-60px;top:-10px;width:300px"></div><div class="abs" style="left:126px;top:20px;width:106px;height:150px;border-radius:10px;background:#fffdf6;border:3px solid #1F2440;animation:flip 1s ease-out 2s both;backface-visibility:hidden;overflow:hidden"><img src="${B}setup.g1.1.webp" style="position:absolute;left:-150px;top:-10px;width:300px"></div><div style="font:400 26px Norwester;text-align:center;position:absolute;left:0;right:0;top:200px">Board &amp; card games</div></div>
   <div class="card o" style="--d:3.4s;left:274px;top:14px;width:246px;height:250px;overflow:hidden;background:#fff"><img src="${B}cards/wsf_chal4.png" style="width:100%;height:190px;object-fit:cover;object-position:top"><div class="abs" style="left:150px;top:58px;font-size:40px;animation:pencil 2s ease-in-out 3.8s both;transform-origin:0 100%">✏️</div><div style="font:400 26px Norwester;text-align:center;margin-top:8px">Worksheets</div></div>
   <div class="card o" style="--d:5.4s;left:20px;top:278px;width:246px;height:250px;overflow:hidden"><img src="${B}setup.e1.1.webp" style="width:100%;height:190px;object-fit:cover">${[0, 1, 2, 3, 4, 5].map((i) => `<div class="abs" style="left:${70 + i * 24}px;top:${60 + (i % 3) * 18}px;width:10px;height:10px;border-radius:50%;background:#3c8a3f;animation:fall .7s ease-in ${5.8 + i * .2}s both"></div>`).join("")}<div style="font:400 26px Norwester;text-align:center;margin-top:8px">Experiments</div></div>
   <div class="card o" style="--d:7.2s;left:274px;top:278px;width:246px;height:250px;overflow:hidden"><img src="${B}setup.a2.0.webp" style="width:100%;height:190px;object-fit:cover"><div style="font:400 26px Norwester;text-align:center;margin-top:8px">Activities</div></div>
   <div class="abs pp" style="--d:9.2s;left:150px;top:230px;width:240px;background:#c8402f;color:#fff;border-radius:30px;text-align:center;font:400 44px/70px Norwester;transform:rotate(-4deg);box-shadow:0 8px 22px rgba(0,0,0,.3)">PLAY!</div>`]);
// 10 -------------------------------------------------------------------- 5.4 s
ST.push([5.4, "DeepKids Gurukul", "Try it for free at app.deepkids.in", css2 + `<img class="abs pp fl" style="--d:.3s;left:130px;top:30px;width:280px" src="${B}iam.webp"><div class="abs o" style="--d:1.2s;left:0;top:420px;width:540px;text-align:center;font:400 42px Norwester;color:#c8402f">app.deepkids.in</div>`]);


// a plant that grows like a fractal: each stem grows, side shoots and branches fork as it goes, leaves open at the tips
function plantSvg() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const SP = 100, HXc = HX, HYc = HY, out = [];
  const greens = ["#5fb04a", "#3f9a3a", "#7cc95a", "#4aa84a"];
  const leaf = (x, y, ang, l, t) => {
    const w = l * 0.42, c = greens[Math.floor(rnd() * greens.length)];
    out.push(`<g class="pp" style="--d:${t.toFixed(2)}s;transform-origin:${x.toFixed(1)}px ${y.toFixed(1)}px"><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)})"><path d="M0 0 C${w} ${-l * 0.25} ${w * 0.9} ${-l * 0.75} 0 ${-l} C${-w * 0.9} ${-l * 0.75} ${-w} ${-l * 0.25} 0 0Z" fill="${c}" stroke="#1F5A28" stroke-width="1"/><path d="M0 -1 L0 ${-l * 0.82}" stroke="#1F5A28" stroke-width=".8" fill="none"/></g></g>`);
  };
  const seg = (x, y, a, len, w, t, bend = 0, col) => {
    const r = (a * Math.PI) / 180, x2 = x + Math.sin(r) * len, y2 = y - Math.cos(r) * len;
    const cx = (x + x2) / 2 + Math.cos(r) * bend, cy = (y + y2) / 2 + Math.sin(r) * bend, L = Math.ceil(len * 1.12) + 2, dur = len / SP;
    out.push(`<path class="dr" style="--len:${L};--d:${t.toFixed(2)}s;--t:${dur.toFixed(2)}s" d="M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${col || (w > 3 ? "#5fbf55" : "#3c9a3c")}" stroke-width="${w}" stroke-linecap="round"/>`);
    return [x2, y2, t + dur];
  };
  const twig = (x, y, a, len, w, t, depth) => {
    const [x2, y2, t2] = seg(x, y, a, len, w, t, (rnd() - 0.5) * 6);
    const dx = x2 - HXc, dy = y2 - HYc;
    if (depth <= 0 || (Math.hypot(dx, dy) > 54 && y2 < HYc + 70) || (Math.abs(dx) < 12 && y2 < HYc - 30)) { leaf(x2, y2, a + (rnd() - 0.5) * 30, 17 + rnd() * 5, t2); leaf(x2, y2, a + (rnd() < 0.5 ? -45 : 45), 13 + rnd() * 4, t2 + 0.05); return; }
    if (rnd() < 0.95) leaf(x + (x2 - x) * 0.55, y + (y2 - y) * 0.55, a + (rnd() < 0.5 ? -60 : 60), 10 + rnd() * 3, t + (t2 - t) * 0.55);
    const k = rnd() < 0.5 ? 3 : 2, spread = 28 + rnd() * 14;
    for (let i = 0; i < k; i++) twig(x2, y2, a + (k === 3 ? (i - 1) * spread : (i ? 1 : -1) * spread) + (rnd() - 0.5) * 10, len * 0.78, Math.max(1.6, w * 0.75), t2, depth - 1);
  };
  const root = (x, y, a, len, w, t, depth) => {
    const [x2, y2, t2] = seg(x, y, a, len, w, t, (rnd() - 0.5) * 8, "#f3e6c8");
    if (depth > 0) for (let i = 0; i < 2; i++) root(x2, y2, a + (i ? 1 : -1) * (24 + rnd() * 16), len * 0.78, Math.max(1.4, w * 0.7), t2, depth - 1);
  };
  root(HXc, CY + 8, 195, 40, 4.5, 1.1, 3); root(HXc, CY + 8, 165, 40, 4.5, 1.1, 3); root(HXc, CY + 8, 180, 46, 4.5, 1.2, 2);
  // low shoots at the seed, spreading out through the belly
  twig(HXc, CY - 16, -66, 34, 4.5, 1.9, 2); twig(HXc, CY - 16, 66, 34, 4.5, 1.95, 2); twig(HXc, CY - 30, -40, 28, 4, 2.15, 2); twig(HXc, CY - 30, 40, 28, 4, 2.2, 2);
  // the trunk, rising from the seed through the chest and neck; shoots fork off as it passes
  let x = HXc, y = CY - 12, a = 0, t = 1.8, k = 0;
  while (y > HYc + 52) {
    const step = 30 + rnd() * 8;
    a += (HXc - x) * 0.12 + (rnd() - 0.5) * 6; a = Math.max(-9, Math.min(9, a));
    const [x2, y2, t2] = seg(x, y, a, step, 7, t, (rnd() - 0.5) * 6);
    if (k % 2 === 1) {
      const side = (k / 2 | 0) % 2 ? 1 : -1;
      twig(x2, y2, side * (46 + rnd() * 12), 30, 4, t2, 2);
    }
    x = x2; y = y2; t = t2; k++;
  }
  twig(x, y, 0, 46, 6, t, 6); twig(x, y, -40, 36, 5, t + 0.05, 5); twig(x, y, 40, 36, 5, t + 0.1, 5);
  return out.join("");
}
// 11 ------------------------------------------------------------- the seed that grows into the third eye (6.9 s)
const FIGY = 40, HX = 272, HY = 116, CY = 337;
ST.push([6.9, "", "", css2 + `<style>@keyframes eopen{from{transform:scaleY(.04)}to{transform:scaleY(1)}}@keyframes eopenx{from{transform:scaleX(.04)}to{transform:scaleX(1)}}@keyframes gpulse{0%,100%{transform:scale(.8);opacity:.7}50%{transform:scale(1.2);opacity:1}}@keyframes ringx{0%{transform:scale(.4);opacity:.9}100%{transform:scale(3);opacity:0}}@keyframes eglow{from{filter:none}to{filter:drop-shadow(0 0 5px #fff6c4) drop-shadow(0 0 14px #ffb703)}}@keyframes ray{0%,100%{opacity:.25}50%{opacity:1}}</style>
 <svg class="abs" style="left:0;top:0" width="540" height="564" viewBox="0 0 540 564"><circle class="o" style="--d:5.2s" cx="${HX}" cy="${HY - 10}" r="105" fill="#ffd16666"/></svg>
 <div class="abs o" style="--d:.2s;left:16px;top:${FIGY}px;width:507px;height:540px;background:#3b3f73;-webkit-mask:url(${B}woman.png) center/100% 100% no-repeat;mask:url(${B}woman.png) center/100% 100% no-repeat"></div>
 <svg class="abs" style="left:0;top:0" width="540" height="564" viewBox="0 0 540 564">
  <circle class="o" style="--d:.5s" cx="${HX}" cy="${HY}" r="46" fill="#fff4e8" opacity=".92"/>
  <ellipse class="pp" style="--d:1s;transform-origin:${HX}px ${CY}px" cx="${HX}" cy="${CY}" rx="17" ry="12" fill="#8a5a2c" stroke="#fff4e8" stroke-width="3"/>
  <circle class="pp" style="--d:1s;transform-origin:${HX}px ${CY}px" cx="${HX}" cy="${CY}" r="30" fill="none" stroke="#ffd166" stroke-width="3" opacity=".8"/>
  ${plantSvg()}
  <g class="o" style="--d:4.3s"><g style="transform-origin:${HX}px ${HY - 38}px;transform:scaleX(.04);animation:eopenx 1s ease-out 4.4s forwards,eglow .9s ease-out 6s forwards">
   <path d="M${HX} ${HY - 64} Q${HX + 15} ${HY - 38} ${HX} ${HY - 12} Q${HX - 15} ${HY - 38} ${HX} ${HY - 64}Z" fill="#fff" stroke="#1F2440" stroke-width="3.5"/><circle cx="${HX}" cy="${HY - 38}" r="7" fill="#7a4fb5" stroke="#1F2440" stroke-width="2.5"/><circle cx="${HX}" cy="${HY - 38}" r="3" fill="#1F2440"/></g></g>
  <defs><radialGradient id="eg"><stop offset="0" stop-color="#fffbe0" stop-opacity="1"/><stop offset=".35" stop-color="#ffe08a" stop-opacity=".85"/><stop offset=".7" stop-color="#ffb703" stop-opacity=".35"/><stop offset="1" stop-color="#ffb703" stop-opacity="0"/></radialGradient></defs>
  <g style="opacity:0;animation:aIn .8s ease-out 5.9s forwards"><circle cx="${HX}" cy="${HY - 38}" r="86" fill="url(#eg)" style="transform-origin:${HX}px ${HY - 38}px;animation:gpulse 2.2s ease-in-out 6s infinite"/></g>
  ${[0, 0.7, 1.4].map((d) => `<circle cx="${HX}" cy="${HY - 38}" r="30" fill="none" stroke="#ffd166" stroke-width="3" style="opacity:0;transform-origin:${HX}px ${HY - 38}px;animation:ringx 2.1s ease-out ${(6.2 + d).toFixed(1)}s infinite"/>`).join("")}
 </svg>`]);

// 12 ------------------------------------------------------------- unit cards flip to show their big think question (13.2 s)
const COV = [["Friction","When a rolling ball stops, where has its movement gone?","#d7efe6"],["Reflection","Is the face in the mirror really you?","#e9e0fb"],["Reduce, reuse, recycle","When we throw something away, where is \'away\'?","#fde9c9"],["Born knowing","Nobody taught the spider to spin. So where did her know-how come from?","#fbd9e0"],["Growing up","If your height is different in the morning and at night, what is your real height?","#e5f3ea"],["DNA and RNA","If DNA is a set of instructions, who or what reads them?","#e8eefb"]];
ST.push([13.2, "", "", css2 + `<style>@keyframes flipc{to{transform:rotateY(180deg)}}.fc{position:absolute;inset:0;transform-style:preserve-3d;animation:flipc .8s ease-in-out var(--f) forwards}.fa,.fb{position:absolute;inset:0;border-radius:18px;border:3px solid #1F2440;backface-visibility:hidden;overflow:hidden;box-shadow:0 6px 16px rgba(31,36,64,.2)}.fb{transform:rotateY(180deg);background:#fffdf6;padding:12px 14px}</style>` +
  COV.map(([t, q, c], i) => `<div class="o" style="--d:${.3 + i * .55}s;position:absolute;left:${16 + (i % 2) * 260}px;top:${14 + Math.floor(i / 2) * 182}px;width:248px;height:170px;perspective:800px"><div class="fc" style="--f:${7.2 + i * .95}s"><div class="fa" style="background:#fff"><img src="${B}cov${i}.webp" style="width:100%;height:128px;object-fit:cover"><div style="font:400 22px/42px Norwester;text-align:center">${t}</div></div><div class="fb" style="background:${c}"><div class="eb">BIG THINK</div><div style="font:400 19px/1.18 Futura;margin-top:6px;color:#1F2440">${q}</div></div></div></div>`).join("")]);
module.exports = { S: ST.map(([d, t, s, st]) => [d, page(t, s, st, d)]) };
