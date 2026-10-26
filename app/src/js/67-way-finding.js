/* ---------- Way-finding: logo goes home, a back button on every screen, breadcrumbs ---------- */
function fxCrumbs() {
  if (!ACC) return "";
  if (ob) {
    const N = ["Child", "Track", "Subjects", "Levels", "Week", "Summary"];
    return N.slice(0, ob.step + 1)
      .map((n, i) => (i < ob.step ? `<button class="fxcr" data-fxob="${i}">${n}</button><i>›</i>` : `<b>${n}</b>`))
      .join("");
  }
  const T = { today: "Today", week: "Plan", journey: "Progress", library: "Library" },
    parts = [T[tab] || "Today"];
  if (tab === "week") parts.push((SEGS.week.find((x) => x[0] === seg("week")) || [])[1]);
  if (tab === "library") {
    const l = (LIBT.find((x) => x[0] === (ui.lt || "topics")) || [])[1];
    if (l) parts.push(l);
  }
  if (tab === "today" && ui.tday && ui.tday !== today) parts.push(fmt(ui.tday));
  return parts
    .filter(Boolean)
    .map((p, i, a) =>
      i < a.length - 1 ? `<button class="fxcr" data-fxcr="${i}">${esc(p)}</button><i>›</i>` : `<b>${esc(p)}</b>`,
    )
    .join("");
}
function fxWay() {
  const w = document.querySelector("header.top .wrap");
  if (!w) return;
  if (!document.getElementById("fxlogo")) {
    const a = document.createElement("button");
    a.id = "fxlogo";
    a.setAttribute("aria-label", "DeepKids home");
    a.innerHTML = `<span>Deep</span>Kids`;
    w.prepend(a);
  }
  let c = document.getElementById("fxcrumb");
  if (!c) {
    c = document.createElement("nav");
    c.id = "fxcrumb";
    c.setAttribute("aria-label", "You are here");
    document.querySelector("header.top").after(c);
  }
  c.innerHTML = fxCrumbs();
  const b = document.getElementById("backTop");
  if (b) b.hidden = !ACC || (tab === "today" && !ui.tday && !navHist.length && !(ob && ob.step > 0));
}

const fxHome = () => {
  if (ob) {
    if (!confirm("Leave setup? Your answers so far are kept.")) return;
  }
  if (sheet.open) sheet.close();
  ui.tday = null;
  tab = "today";
  render();
  scrollTo(0, 0);
};
document.addEventListener(
  "click",
  (e) => {
    const l = e.target.closest("#fxlogo");
    if (l) {
      e.preventDefault();
      e.stopPropagation();
      fxHome();
      return;
    }
    const c = e.target.closest("[data-fxcr]");
    if (c) {
      e.preventDefault();
      e.stopPropagation();
      if (+c.dataset.fxcr === 0) {
        if (tab === "today") ui.tday = null;
        else ui.seg && (ui.seg.week = undefined);
        render();
        scrollTo(0, 0);
      }
      return;
    }
    const b = e.target.closest("#backTop");
    if (!b) return;
    if (ob && ob.step > 0) {
      e.preventDefault();
      e.stopPropagation();
      if (ob.quiz) {
        ob.quiz = null;
      } else ob.step--;
      render();
      scrollTo(0, 0);
      return;
    }
    if (!navHist.length) {
      e.preventDefault();
      e.stopPropagation();
      if (ui.tday) {
        ui.tday = null;
      } else tab = "today";
      render();
      scrollTo(0, 0);
    }
  },
  true,
);
/* Today: the week strip is gone (the calendar below already moves day by day) */

function fxObBar(n) {
  return `<div class="fxstep"><b><i style="width:${Math.round(((n + 1) / 6) * 100)}%"></i></b></div>`;
}
document.addEventListener(
  "click",
  (e) => {
    const c = e.target.closest("[data-fxob]");
    if (!c || !ob) return;
    e.preventDefault();
    e.stopPropagation();
    ob.quiz = null;
    ob.step = +c.dataset.fxob;
    render();
    scrollTo(0, 0);
  },
  true,
);
