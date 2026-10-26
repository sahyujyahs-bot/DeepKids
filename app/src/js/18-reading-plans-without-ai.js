/* ---------- reading plans without AI: the common ways parents write classes, rest, outings, to-dos and things they own ---------- */
const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};
const DAYW = { sun: 0, mon: 1, tue: 2, tues: 2, wed: 3, thu: 4, thur: 4, thurs: 4, fri: 5, sat: 6 };
const CLASSW =
  /\b(tuition|class|classes|coaching|lesson|lessons|swim\w*|dance|dancing|tabla|music|piano|guitar|keyboard|violin|singing|karate|taekwondo|judo|chess|art|drawing|painting|abacus|robotics|coding|cricket|football|tennis|badminton|skating|yoga|gym|sports?|practice|training|kathak|bharatanatyam|carnatic|hindustani|veena|mridangam|sloka|shloka|vedic|phonics|tutor|camp)\b/i;
const OUTW =
  /\b(trip|visit|visiting|outing|zoo|museum|park|picnic|party|birthday|wedding|function|holiday|vacation|festival|temple|travel|travelling|going to|movie|show|exhibition|fair|mela|library|farm|beach|grandma|grandpa|nani|dadi|nana|dada|cousin)\b/i;
const APPTW =
  /\b(doctor|dentist|appointment|check-?up|vaccin\w*|hospital|clinic|eye test|haircut|meeting|ptm|interview|exam)\b/i;
const MEALW = /\b(lunch|dinner|breakfast|snack|tiffin|meal)\b/i;
const TODOW =
  /^(buy|get|order|call|pay|book|send|remember|need to|pick up|collect|return|print|fill|submit|renew|fix|clean|pack|bring|make)\b/i;
const HAVEW =
  /^(we\s+(have|own|got|bought)|we've\s+got|i\s+(have|bought)|there(?:'s| is| are)\s+(a|an)?|have\s+(a|an))\s+/i;
const FILLER = new Set([
  "every",
  "each",
  "at",
  "from",
  "to",
  "till",
  "until",
  "on",
  "and",
  "the",
  "next",
  "this",
  "coming",
  "for",
  "an",
  "a",
  "of",
  "in",
  "is",
  "are",
  "will",
  "be",
  "has",
  "have",
  "goes",
  "go",
  "going",
  "does",
  "do",
  "daily",
  "weekly",
  "weekday",
  "weekdays",
  "weekend",
  "weekends",
  "hour",
  "hours",
  "hr",
  "hrs",
  "min",
  "mins",
  "minutes",
  "pm",
  "am",
  "morning",
  "evening",
  "night",
  "afternoon",
  "noon",
  "today",
  "tomorrow",
  "tonight",
  "day",
  "days",
  "between",
  "around",
  "about",
  "by",
  "with",
  "her",
  "his",
  "she",
  "he",
  "they",
  "we",
  "our",
  "my",
  "me",
  "i",
  "there",
  "after",
  "before",
  "then",
  "also",
  "plus",
  "starts",
  "starting",
  "start",
  "ends",
  "ending",
  "time",
  "times",
  "week",
  "month",
  "p.m.",
  "a.m.",
  "o'clock",
  "oclock",
]);
function dateWords(t) {
  t = t.toLowerCase();
  const now = parse(today);
  if (/\bday after tomorrow\b/.test(t)) return addDays(today, 2);
  if (/\btomorrow\b/.test(t)) return addDays(today, 1);
  if (/\btoday\b|\btonight\b/.test(t)) return today;
  let m = /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\b/.exec(t) || null,
    mo,
    d;
  if (m) {
    d = +m[1];
    mo = MONTHS[m[2]];
  } else if (
    (m = /\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?\b/.exec(t))
  ) {
    mo = MONTHS[m[1]];
    d = +m[2];
  } else if ((m = /\b(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/.exec(t))) {
    d = +m[1];
    mo = +m[2] - 1;
    if (m[3]) {
      const y = +m[3] < 100 ? 2000 + +m[3] : +m[3];
      return iso(new Date(y, mo, d));
    }
  }
  if (mo !== undefined && d >= 1 && d <= 31) {
    let dt = new Date(now.getFullYear(), mo, d);
    if (iso(dt) < addDays(today, -30)) dt = new Date(now.getFullYear() + 1, mo, d);
    return iso(dt);
  }
  m = /\b(?:next|this|coming|on)?\s*(sun|mon|tues?|wed|thu(?:rs?)?|fri|sat)[a-z]*\b/.exec(t);
  if (m) {
    const wd = DAYW[m[1]] ?? DAYW[m[1].slice(0, 3)];
    let k = (wd - now.getDay() + 7) % 7;
    if (k === 0 || (/\bnext\b/.test(t) && k < 7 && /\bnext week\b/.test(t))) k += 7;
    return addDays(today, k);
  }
  return null;
}
const dayNames = (t) =>
  [...t.toLowerCase().matchAll(/\b(sun|mon|tues?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:days?|s|\.)?\b/g)]
    .map((m) => DAYW[m[1].slice(0, 3)])
    .filter((v, i, a) => v !== undefined && a.indexOf(v) === i);
function recurring(t) {
  const l = t.toLowerCase();
  if (/\bevery ?day\b|\bdaily\b|\beach day\b/.test(l)) return [0, 1, 2, 3, 4, 5, 6];
  if (/\bweek ?days\b|\bmon(day)?\s*(-|–|to)\s*fri(day)?\b/.test(l)) return [1, 2, 3, 4, 5];
  if (/\bweekends?\b/.test(l)) return [0, 6];
  const D = dayNames(l);
  if (
    D.length &&
    (/\bevery\b|\beach\b|\bweekly\b|\b(sun|mon|tues|wednes|thurs|fri|satur)days\b/.test(l) || D.length > 1)
  )
    return D;
  if (D.length && CLASSW.test(l) && !/\bnext\b|\bthis\b|\bcoming\b|\bon\s+\d/.test(l)) return D;
  return null;
}
function titleOf(seg) {
  const kid = (S.child || "").toLowerCase();
  let t = seg
    .replace(/\b(after|before)\b.*$/i, "")
    .replace(/\b\d{1,2}([:.]\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?\b/gi, " ")
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, " ")
    .replace(/[–—\-\/,:;()!?]/g, " ");
  const W = t
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => {
      const l = w.toLowerCase().replace(/'s$/, "");
      if (FILLER.has(l)) return false;
      if (kid && l === kid) return false;
      if (/^(sun|mon|tue|tues|wed|wednes|thu|thur|thurs|fri|sat|satur)(day|days|s)?$/.test(l)) return false;
      if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*$/.test(l)) return false;
      if (/^(one|two|three|half|an)$/.test(l)) return false;
      return true;
    });
  const s = W.slice(0, 6).join(" ").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}
function splitPlans(text) {
  const out = [];
  const add = (s) => {
    s = s.trim().replace(/[.!]+$/, "");
    if (!s) return;
    if (out.length && !titleOf(s) && !HAVEW.test(s)) out[out.length - 1] += " " + s;
    else out.push(s);
  };
  text.split(/\n+|(?<=[.!?])\s+(?=[A-Z])|;\s*/).forEach((sent) => {
    if (HAVEW.test(sent.trim())) add(sent);
    else sent.split(/,\s+/).forEach(add);
  });
  return out;
}
function ampmGuess(t, w) {
  const l = t.toLowerCase();
  if (!w.start || /\d\s*(am|pm|a\.m\.|p\.m\.)|\b(am|pm|noon)\b/.test(l)) return null;
  const h = +w.start.slice(0, 2);
  if (/\b(morning)\b/.test(l)) return h >= 12 ? clock24(hm(w.start) - 720) : null;
  if (/\b(evening|night|afternoon)\b/.test(l)) return h < 12 ? clock24(hm(w.start) + 720) : null;
  if (h >= 1 && h <= 6) return "pm";
  if (h >= 7 && h <= 11) return "ask";
  return null;
}
function localParse(text) {
  const items = [],
    asks = [];
  splitPlans(text).forEach((seg) => {
    const l = seg.toLowerCase();
    const hv = HAVEW.exec(seg);
    if (hv) {
      seg
        .slice(hv[0].length)
        .split(/,\s*|\s+and\s+/)
        .map((s) => s.replace(/^(a|an|the|some)\s+/i, "").trim())
        .filter(Boolean)
        .forEach((n) =>
          items.push({
            type: "have",
            title: n[0].toUpperCase() + n.slice(1),
            who: "you",
            category: /\b(book|books|comic|comics|story|novel|encyclopedia|atlas)\b/i.test(n)
              ? "book"
              : /\b(game|ludo|chess|carrom|puzzle|cards|monopoly|scrabble|uno|jenga|snakes)\b/i.test(n)
                ? "game"
                : /\b(tablet|laptop|computer|ipad|phone|kindle|tv|speaker)\b/i.test(n)
                  ? "electronics"
                  : /\b(microscope|magnifying|telescope|globe|kit|magnet|lens|thermometer|binoculars)\b/i.test(n)
                    ? "equipment"
                    : "other",
            keep: true,
          }),
        );
      return;
    }
    let w = whenOf(seg),
      days = recurring(seg),
      date = days ? null : dateWords(seg);
    const title = titleOf(seg);
    if (!title) return;
    let type = RESTW.test(l)
      ? "rest"
      : MEALW.test(l)
        ? "meal"
        : TODOW.test(seg)
          ? "todo"
          : APPTW.test(l)
            ? "other"
            : CLASSW.test(l)
              ? "class"
              : OUTW.test(l)
                ? "outing"
                : w.start || days
                  ? "class"
                  : "todo";
    if (type === "todo" && w.start && !TODOW.test(seg)) type = "other";
    const who =
      /\b(i|me|my)\b/.test(l) && !CLASSW.test(l)
        ? "you"
        : ["class", "rest"].includes(type)
          ? "kid"
          : /\b(we|us|together|family)\b/.test(l)
            ? "both"
            : type === "todo"
              ? "you"
              : "both";
    const it = {
      type,
      title,
      who,
      date: days ? null : date || (type === "todo" ? today : null),
      days: days || null,
      start: w.start || null,
      end: w.end || null,
      note: "",
      keep: true,
      _src: seg,
    };
    if (!it.start && /\bafter\b/.test(l)) {
      const fx = fixItem({ ...it, note: seg });
      if (fx.start) {
        it.start = fx.start;
        it.end = fx.end || null;
        if (fx.days?.length) it.days = fx.days;
      }
    }
    const ap = ampmGuess(seg, it);
    if (ap === "pm") {
      it.start = clock24(hm(it.start) + 720);
      if (it.end && hm(it.end) < hm(it.start)) it.end = clock24(hm(it.end) + 720);
    } else if (ap === "ask")
      asks.push({
        i: items.length,
        need: "ampm",
        q: `Is ${title} at ${clock(hm(it.start))
          .replace(/:00/, "")
          .replace(/ ?(am|pm)/, "")} in the morning or the evening?`,
      });
    else if (ap) it.start = ap;
    if (it.start && !it.end) {
      const d = w.dur || (type === "meal" ? 45 : 60);
      it.end = clock24(hm(it.start) + d);
    }
    if (["class", "rest", "meal", "outing"].includes(type)) {
      if (!it.days && !it.date)
        asks.push({
          i: items.length,
          need: "days",
          q: `Which days is ${title}? (e.g. Tue and Thu, every day, or a date)`,
        });
      if (!it.start && type !== "outing")
        asks.push({ i: items.length, need: "time", q: `What time is ${title}? (e.g. 5 to 6 pm)` });
    }
    items.push(it);
  });
  return { items, asks };
}
