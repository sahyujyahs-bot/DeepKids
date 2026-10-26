/* Content and fixed tables: DATA (filled in by the build), subjects, boards, defaults */
const DATA = /*DATA*/ null;
// the build puts all content here (app/build/data.json)
const SUBJ = { ...DATA.subjects, sci: "Science", wml: "Main lesson", wart: "Arts & handwork" },
  SUBJ_KEYS = Object.keys(SUBJ);
DATA.prepgen.guide.wml =
  "Prepare tomorrow's story the night before so you can tell it in your own words. Keep the rhythm: circle, recall, new content, Main Lesson Book, practice, closing.";
DATA.prepgen.guide.wart =
  "Lay out the materials before you begin: a cloth on the table, water, the paper soaked for painting.";
DATA.prepgen.prep.wml = [
  ["read", 1, "Read tomorrow's story or lesson and practise telling it (10 min)", "The day plan in DeepKids"],
];
DATA.prepgen.prep.wart = [["act", 0, "Lay out today's art materials", "Around the house"]];
const BOARDS = {
  ncert: "NCERT / CBSE",
  cambridge: "Cambridge Primary",
  nios: "NIOS (Open Basic Education)",
  waldorf: "Waldorf",
};
const STATUS = { none: "Not started", learning: "Learning", completed: "Completed", mastered: "Mastered" };
const DAYN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYFULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DEF_DAYS = {
  math: [1, 2, 3, 4, 5],
  eng: [1, 2, 4, 5],
  hin: [2, 4],
  sci: [1, 2, 3, 4, 5],
  wml: [1, 2, 3, 4, 5],
  wart: [1, 2, 3, 4, 5],
};
const DEF_HPD = { math: 1, eng: 0.75, hin: 0.5, sci: 0.75, wml: 1.5, wart: 0.75 };
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
(DATA.resources || []).forEach((r) => {
  r.concepts = r.concepts || [];
  r.strands = r.strands || [];
  r.subj = [].concat(r.subj || "sci");
});
