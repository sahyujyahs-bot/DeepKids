/* ---------- calendars ---------- */
function parseICS(txt) {
  const lines = txt.replace(/\r?\n[ \t]/g, "").split(/\r?\n/),
    ev = [];
  let cur = null;
  for (const l of lines) {
    if (l === "BEGIN:VEVENT") cur = {};
    else if (l === "END:VEVENT") {
      if (cur) ev.push(cur);
      cur = null;
    } else if (cur) {
      const i = l.indexOf(":");
      if (i < 0) continue;
      cur[l.slice(0, i).split(";")[0]] = l.slice(i + 1);
    }
  }
  const P = (v) => {
    const m = (v || "").match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?/);
    if (!m) return null;
    return {
      d: m[4]
        ? m[7]
          ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5]))
          : new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5])
        : new Date(+m[1], m[2] - 1, +m[3]),
      allDay: !m[4],
    };
  };
  const BY = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 },
    lim = addDays(today, 90),
    hh = (d) => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"),
    out = [];
  ev.forEach((e) => {
    const s = P(e.DTSTART),
      en = P(e.DTEND);
    if (!s) return;
    const rr = e.RRULE || "",
      weekly = /FREQ=(WEEKLY|DAILY)/.test(rr),
      until = (rr.match(/UNTIL=(\d{8})/) || [])[1],
      ds = iso(s.d);
    if (!weekly && (ds < today || ds > lim)) return;
    if (weekly && until && until < today.replace(/-/g, "")) return;
    let days = null;
    if (weekly) {
      days = /DAILY/.test(rr)
        ? [0, 1, 2, 3, 4, 5, 6]
        : ((rr.match(/BYDAY=([A-Z0-9,+-]+)/) || [])[1] || "")
            .split(",")
            .map((x) => BY[x.replace(/[^A-Z]/g, "")])
            .filter((x) => x !== undefined);
      if (!days.length) days = [s.d.getDay()];
    }
    const title = (e.SUMMARY || "Calendar event")
      .replace(/\\,/g, ",")
      .replace(/\\n/g, " ")
      .replace(/\\;/g, ";")
      .slice(0, 80);
    out.push({
      type: "calendar",
      title,
      who: "you",
      date: weekly ? null : ds,
      days,
      start: s.allDay ? null : hh(s.d),
      end: en && !en.allDay ? hh(en.d) : null,
      note: "From your calendar",
      keep: true,
    });
  });
  return out.slice(0, 80);
}
function calendarCard() {
  // on the website, Google Calendar waits for Google sign-in scopes; the artifact links it through claude.ai connectors
  if (window.DK_PLATFORM?.name === "web")
    return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)", 14, "happy", "", 'width="46" height="46"')}<div><h3 style="font-size:19px">Your calendars</h3><p class="xs muted">Live Google Calendar linking is coming soon. For now, bring in a calendar file: you choose what to keep.</p></div></div><p class="xs muted">Google Calendar on a computer: Settings → Import & export → Export, then unzip. Apple Calendar on a Mac: File → Export.</p><label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose an .ics file<input type="file" id="icsFile" accept=".ics,text/calendar" hidden></label></section>`;
  const C = S.cal || {},
    busy = ui.gcBusy,
    err = C.err
      ? `<p class="sm" style="color:var(--bad)">${esc(GCERR[C.err] || "Couldn't read your calendar (" + C.err + "). Try Refresh.")}</p>`
      : "";
  const ics = `<details style="margin-top:6px"><summary class="link sm" style="cursor:pointer">Use Apple or Outlook? Import a file instead</summary><p class="xs muted">Export an .ics file and pick it here. You choose what to keep. A file doesn't update by itself.</p><label class="btn soft sm" style="cursor:pointer;justify-self:start">${icon("plus")}Choose an .ics file<input type="file" id="icsFile" accept=".ics,text/calendar" hidden></label></details>`;
  if (C.on) {
    const n = (C.ev || []).filter((e) => e.date >= today).length,
      L = C.list || [];
    return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)", 14, "happy", "", 'width="46" height="46"')}<div><h3 style="font-size:19px">Google Calendar is linked</h3><p class="xs muted">${n} event${n === 1 ? "" : "s"} in the next 60 days${C.at ? " · updated " + new Date(C.at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : ""}. It refreshes by itself while DeepKids is open, and the day plan works around it.</p></div></div>
    ${L.length > 1 ? `<div class="col" style="gap:6px"><span class="xs muted">Calendars to show</span><div class="row">${L.map((c) => `<button class="chip" aria-pressed="${(C.cals || []).includes(c.id)}" data-act="gccal" data-id="${esc(c.id)}">${esc(c.name)}</button>`).join("")}</div></div>` : ""}
    ${err}<div class="row"><button class="btn soft sm" data-act="gcsync" ${busy ? "disabled" : ""}>${busy ? "Refreshing…" : "Refresh now"}</button><button class="link sm" data-act="gcoff">Unlink</button></div>${ics}</section>`;
  }
  return `<section class="card"><div class="row" style="flex-wrap:nowrap;gap:12px">${blob("var(--sky)", 14, "happy", "", 'width="46" height="46"')}<div><h3 style="font-size:19px">Link your calendar</h3><p class="xs muted">Classes, tuitions, outings and busy times flow in by themselves and stay up to date. DeepKids only reads your calendar; it never changes it.</p></div></div>
    <button class="btn accent sm" data-act="gcsync" style="justify-self:start" ${busy ? "disabled" : ""}>${busy ? "Connecting…" : "Connect Google Calendar"}</button>${err}<p class="xs muted">First time: claude.ai asks you to add Google Calendar under Settings → Connectors and to allow DeepKids to read it.</p>${ics}</section>`;
}
const nowMin = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const sid = (x) => x.kind + "|" + x.title;
let SAMPLE = null,
  ASSETS = null,
  IMGOK = false;
function focusOf(items, date) {
  if (date !== today) return null;
  const nm = nowMin(),
    d = Dd(date),
    real = items.filter((i) => i.kind !== "brk" && !i.done && !snzd(i, date) && !evPast(i, date));
  if (!real.length) return null;
  const pm = real.find((i) => i.id === "pm");
  if (pm && nm >= hm(d.eveAt) - 30) return pm;
  const R = real.filter((i) => i.id !== "pm");
  const now = R.find((i) => !i.anytime && i.at <= nm && nm < i.at + i.dur);
  if (now) return now;
  const next = R.filter((i) => !i.anytime && i.at > nm),
    missed = R.filter((i) => OURS(i) && !i.anytime && i.at + i.dur <= nm);
  if (missed.length && !(next[0] && next[0].at - nm <= 15)) return missed[0];
  return next[0] || missed[0] || R.find((i) => i.anytime && OURS(i)) || R.find((i) => i.anytime) || pm || null;
}
const isMissed = (it, date) =>
  date === today &&
  !it.done &&
  !it.anytime &&
  OURS(it) &&
  it.kind !== "brk" &&
  !snzd(it, date) &&
  it.at + it.dur < nowMin();
function photoBtn(k, label) {
  return ASSETS
    ? `<label class="btn soft sm" style="cursor:pointer">${icon("plus")}${label || "Add a photo of the work"}<input type="file" accept="image/*" data-upload="${k}" hidden></label>`
    : "";
}
function workOf(k) {
  return (S.work || []).filter((w) => !k || w.k === k);
}
const thumbs = (list) =>
  list.length
    ? `<div class="thumbs">${list.map((w) => `<figure><img src="/_blob/${esc(w.id)}" alt="Work from ${esc(w.title || "")}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph',textContent:'Photo'}))"><figcaption class="xs muted">${fmt(w.date)}</figcaption></figure>`).join("")}</div>`
    : "";
