const DATA = /*DATA*/ null; // the build puts all content here (app/build/data.json)
const SUBJ = { ...DATA.subjects, dks: "DeepKids Science", wml: "Main lesson", wart: "Arts & handwork" },
  SUBJ_KEYS = Object.keys(SUBJ);
DATA.prepgen.guide.dks =
  DATA.prepgen.guide.dks ||
  "DeepKids Science starts from a big question. Read the topic story yourself first, then let your child wonder out loud before you explain anything. Their questions matter more than the answers.";
DATA.prepgen.guide.wml =
  "Prepare tomorrow's story the night before so you can tell it in your own words. Keep the rhythm: circle, recall, new content, Main Lesson Book, practice, closing.";
DATA.prepgen.guide.wart =
  "Lay out the materials before you begin: a cloth on the table, water, the paper soaked for painting.";
DATA.prepgen.prep.wml = [
  ["read", 1, "Read tomorrow's story or lesson and practise telling it (10 min)", "The day plan in DeepKids"],
];
DATA.prepgen.prep.wart = [["act", 0, "Lay out today's art materials", "Around the house"]];
DATA.prepgen.prep.dks = DATA.prepgen.prep.dks || [
  ["read", 1, "Read the topic story and its big question yourself (5 min)", "The topic page in DeepKids"],
  ["act", 0, "Keep a wonder notebook handy for your child's questions", "At home"],
];
const BOARDS = {
  ncert: "NCERT / CBSE",
  cambridge: "Cambridge Primary",
  nios: "NIOS (Open Basic Education)",
  waldorf: "Waldorf",
};
const STATUS = { none: "Not started", learning: "Learning", completed: "Completed", mastered: "Mastered" };
const DAYN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DEF_DAYS = {
  math: [1, 2, 3, 4, 5],
  eng: [1, 2, 4, 5],
  hin: [2, 4],
  sci: [1, 2, 3, 4, 5],
  dks: [1, 2, 3, 4, 5],
  wml: [1, 2, 3, 4, 5],
  wart: [1, 2, 3, 4, 5],
};
const DEF_HPD = { math: 1, eng: 0.75, hin: 0.5, sci: 0.75, dks: 0.5, wml: 1.5, wart: 0.75 };
const DEF_DAY = {
  prepAt: "07:30",
  start: "09:30",
  brk: 15,
  lunch: "13:00",
  lunchMin: 45,
  eveAt: "20:30",
  endAt: "18:30",
};

const PRESET_EXP = {
  A1: [
    "Lotus seeds (Kamali): change water",
    "Alum crystal (Fitkari): check growth",
    "World in a Jar: look for droplets",
    "Bread mould bag: look, never open",
  ],
  A5: ["Moong sprouts: light vs dark"],
  B5: ["Moon diary: draw tonight's Moon"],
  B10: ["Bury test: dig up after 3 weeks"],
};
const iso = (d) => {
  const x = new Date(d);
  return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
};
const parse = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
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
const fmt = (s) => parse(s).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
const monday = () => {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
};
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fh = (h) => (Math.round(h * 4) / 4).toString();
const mins = (h) => {
  const m = Math.round(h * 60);
  return m >= 60 ? `${fh(m / 60)} h` : `${m} min`;
};
const fresh = () => ({
  setup: false,
  child: "",
  age: 6,
  board: "ncert",
  plus: true,
  subjects: ["math", "eng", "hin", "sci", "dks"],
  levels: { math: 1, eng: 1, hin: 1, sci: 1, dks: 1 },
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
