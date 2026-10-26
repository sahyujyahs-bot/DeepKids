/* Dates and times */
const iso = (d) => {
  const x = new Date(d);
  return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
};
const parse = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmt = (s) => parse(s).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
const monday = () => {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
};
const hm = (s) => {
  const [h, m] = String(s || "0:0")
    .split(":")
    .map(Number);
  return h * 60 + (m || 0);
};
const clock = (m) => {
  m = Math.round(m);
  let h = Math.floor(m / 60) % 24,
    mm = String(m % 60).padStart(2, "0");
  const ap = h < 12 ? "am" : "pm";
  h = h % 12 || 12;
  return `${h}:${mm} ${ap}`;
};
const D = () => ({ ...DEF_DAY, ...(S.day || {}) });
const Dd = (date) => ({ ...D(), ...((S.dayW || {})[parse(date).getDay()] || {}), ...((S.dayOver || {})[date] || {}) });
const addDays = (s, n) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const longDate = () => new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
const nowMin = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.round(s % 60))).padStart(2, "0")}`;
