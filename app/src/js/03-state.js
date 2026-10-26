/* The family's saved state (S) and the screen's passing state (ui) */
let today = iso(new Date()),
  dayNo = Math.floor(parse(today) / 864e5);
function rollDay() {
  const t = iso(new Date());
  if (t === today) return false;
  today = t;
  dayNo = Math.floor(parse(today) / 864e5);
  _sess = null;
  ui.more = {};
  ui.jokes = {};
  ui.open = {};
  return true;
}
const fresh = () => ({
  setup: false,
  child: "",
  age: 6,
  board: "ncert",
  plus: true,
  subjects: ["math", "eng", "hin", "sci"],
  levels: { math: 1, eng: 1, hin: 1, sci: 1 },
  start: monday(),
  days: DEF_DAYS,
  hpd: DEF_HPD,
  progress: {},
  log: [],
  exps: [],
  skips: {},
  hrs: {},
  games: {},
  steps: {},
  tasks: {},
  ans: {},
  events: [],
  prep: {},
  tl: {},
  day: DEF_DAY,
  hideHow: false,
  updatedAt: 0,
});
let S = fresh(),
  store = null,
  saving = Promise.resolve(),
  saveTimer = null,
  syncMode = "device",
  tab = "today",
  ob = null;
const ui = {
  open: {},
  pm: 0,
  pv: "week",
  dump: {},
  view: {},
  ctab: {},
  qi: {},
  wsec: {},
  game: "word",
  jokes: {},
  more: {},
  sheet: null,
  back: null,
  sel: {},
  week: 0,
  wday: null,
  wview: "lanes",
  lsub: null,
  timer: null,
};
const A = (k, id) => (S.ans[k] || {})[id];
function setA(k, id, v) {
  S.ans[k] = S.ans[k] || {};
  S.ans[k][id] = v;
}
let lastTap = 0;
const pname = () => (S.parent && S.parent.name) || ACCT;
const sid = (x) => x.kind + "|" + x.title;
let lastMin = -1,
  rang = {};
