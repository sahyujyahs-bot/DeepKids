/* ---------- live Google Calendar (the viewer's claude.ai connector) ---------- */
const GC = "Google Calendar";
let MCP = null,
  MCPT = false;
async function mcpH() {
  if (!MCPT) {
    MCPT = true;
    try {
      MCP = (await window.claude?.use?.("mcp")) || null;
    } catch (e) {
      MCP = null;
    }
  }
  return MCP;
}
function findArr(x, d = 0) {
  if (x == null || d > 5) return null;
  if (typeof x === "string") {
    try {
      return findArr(JSON.parse(x), d + 1);
    } catch (e) {
      return null;
    }
  }
  if (Array.isArray(x)) {
    if (x.some((o) => o && typeof o === "object" && (o.start || o.summary || o.start_time || o.startTime))) return x;
    for (const y of x) {
      const r = findArr(y, d + 1);
      if (r) return r;
    }
    return null;
  }
  if (typeof x === "object") {
    for (const k of ["events", "items", "data", "results", "result"])
      if (x[k] != null) {
        const r = findArr(x[k], d + 1);
        if (r) return r;
      }
    for (const v of Object.values(x)) {
      const r = findArr(v, d + 1);
      if (r) return r;
    }
  }
  return null;
}
function calArr(x, d = 0) {
  if (x == null || d > 5) return [];
  if (typeof x === "string") {
    try {
      return calArr(JSON.parse(x), d + 1);
    } catch (e) {
      return [];
    }
  }
  if (Array.isArray(x)) return x.filter((o) => o && typeof o === "object" && o.id && (o.summary || o.name || o.title));
  if (typeof x === "object") {
    for (const v of Object.values(x)) {
      const r = calArr(v, d + 1);
      if (r.length) return r;
    }
  }
  return [];
}
const tOf = (v) => (typeof v === "string" ? v : v?.dateTime || v?.date_time || v?.date || null);
function gcMap(o) {
  const s = tOf(o.start || o.start_time || o.startTime),
    e = tOf(o.end || o.end_time || o.endTime);
  if (!s || o.status === "cancelled") return null;
  const allDay = /^\d{4}-\d{2}-\d{2}$/.test(s),
    sd = allDay ? parse(s) : new Date(s);
  if (isNaN(sd)) return null;
  const ed = e ? (allDay ? parse(e) : new Date(e)) : null,
    hh = (d) => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  return {
    id:
      "g" +
      String(o.id || o.eventId || s + (o.summary || ""))
        .replace(/[^\w-]/g, "")
        .slice(-40),
    title: String(o.summary || o.title || o.name || "Busy").slice(0, 80),
    date: iso(sd),
    start: allDay ? null : hh(sd),
    end: allDay || !ed || isNaN(ed) ? null : hh(ed),
    who: "you",
    kind: "other",
    note: "Google Calendar",
    src: "gcal",
    allDay,
  };
}
async function gcInput(cal) {
  let props = {};
  try {
    const d = await MCP.describeTool(GC, "list_events");
    props = d?.inputSchema?.properties || {};
  } catch (e) {}
  const K = Object.keys(props),
    used = new Set(),
    pick = (re) => {
      const k = K.find((k) => !used.has(k) && re.test(k));
      if (k) used.add(k);
      return k;
    },
    inp = {};
  const cid = pick(/^calendar_?id$|^calendar$/i) || pick(/calendar/i);
  if (cid && cal) inp[cid] = cal;
  const a = pick(/^time_?min$/i) || pick(/^(start|from|after)|min_?time|start_?time/i) || "timeMin",
    b = pick(/^time_?max$/i) || pick(/^(end|to|until|before)|max_?time|end_?time/i) || "timeMax";
  inp[a] = new Date(parse(today)).toISOString();
  inp[b] = new Date(parse(addDays(today, 60))).toISOString();
  const mx = pick(/max|limit|page_?size/i);
  if (mx) inp[mx] = 250;
  const se = pick(/single|expand/i);
  if (se && props[se]?.type === "boolean") inp[se] = true;
  const ob = pick(/order/i);
  if (ob && se) inp[ob] = "startTime";
  return inp;
}
async function gcSync(manual) {
  if (!ACC) return;
  const m = await mcpH();
  if (!m) {
    S.cal = { ...(S.cal || {}), err: "nomcp" };
    if (manual) render();
    return;
  }
  ui.gcBusy = true;
  if (manual) render();
  try {
    if (!S.cal?.list) {
      try {
        const r = await m.callTool(GC, "list_calendars", {});
        const L = calArr(r.payload).map((c) => ({
          id: String(c.id),
          name: String(c.summary || c.name || c.title).slice(0, 60),
          primary: !!c.primary,
        }));
        S.cal = { ...(S.cal || {}), list: L, cals: S.cal?.cals || L.filter((c) => c.primary).map((c) => c.id) };
      } catch (e) {
        if (
          [
            "server_not_connected",
            "needs_reauth",
            "not_in_manifest",
            "approval_required",
            "consent_required",
            "blocked_by_policy",
            "selection_required",
          ].includes(e?.code)
        )
          throw e;
      }
    }
    const cals = S.cal?.cals?.length ? S.cal.cals : [null];
    let all = [];
    for (const c of cals) {
      const r = await m.callTool(GC, "list_events", await gcInput(c), { cache: false });
      all = all.concat((findArr(r.payload) || []).map(gcMap).filter(Boolean));
    }
    const seen = new Set();
    all = all
      .filter((e) => !seen.has(e.id) && seen.add(e.id))
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .slice(0, 400);
    S.cal = { ...(S.cal || {}), on: true, ev: all, at: Date.now(), err: "" };
    if (manual) {
      sfx("ok");
      toast(
        all.length
          ? `${all.length} events from Google Calendar`
          : "Connected. Nothing on your calendar in the next 60 days.",
      );
    }
    commit();
  } catch (e) {
    S.cal = { ...(S.cal || {}), err: e?.code || "upstream_error" };
    if (manual) render();
  } finally {
    ui.gcBusy = false;
    if (manual) render();
  }
}
const GCERR = {
  nomcp: "Live calendars work when DeepKids is open in claude.ai.",
  server_not_connected: "Add Google Calendar in claude.ai Settings → Connectors, then tap Connect again.",
  selection_required:
    "Pick which Google Calendar account to use in the prompt claude.ai shows, then tap Connect again.",
  needs_reauth: "Google Calendar needs signing in again: claude.ai Settings → Connectors → Google Calendar.",
  not_in_manifest: "DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",
  approval_required: "DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",
  consent_required: "DeepKids needs your OK to read your calendar. Tap Connect and choose Allow.",
  blocked_by_policy: "Your organisation doesn't allow calendar access here.",
  server_unavailable: "Google Calendar didn't answer. Try again in a minute.",
  tool_error: "Google Calendar couldn't send the events. Try Refresh.",
};
setTimeout(() => {
  if (S?.cal?.on) gcSync(false);
}, 5000);
setInterval(() => {
  if (S?.cal?.on && !document.hidden && Date.now() - (S.cal.at || 0) > 15 * 6e4) gcSync(false);
}, 6e4);
