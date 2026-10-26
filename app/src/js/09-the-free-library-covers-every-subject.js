/* ---------- The free library covers every subject: science, maths, English, Hindi, thinking, coding ---------- */
(DATA.resources || []).forEach((r) => {
  r.concepts = r.concepts || [];
  r.strands = r.strands || [];
  r.subj = [].concat(r.subj || "sci");
});
const LSUBJ = {
  sci: "Science",
  math: "Maths",
  eng: "English",
  hin: "Hindi",
  think: "Thinking",
  code: "Coding",
  all: "Textbooks",
};
const STRN = {
  number: "Numbers and place value",
  operations: "Adding, subtracting, multiplying, dividing",
  fractions: "Fractions",
  measurement: "Measuring",
  ["time-money"]: "Time and money",
  shapes: "Shapes and space",
  patterns: "Patterns",
  data: "Data and graphs",
  reasoning: "Puzzles and reasoning",
  ["all-maths"]: "All of maths",
  phonics: "Phonics",
  reading: "Reading",
  stories: "Stories",
  vocabulary: "Words",
  grammar: "Grammar",
  writing: "Writing",
  speaking: "Speaking",
  ["all-english"]: "All of English",
  varnamala: "वर्णमाला",
  poems: "Poems",
  ["all-hindi"]: "All of Hindi",
  thinking: "Thinking routines",
  philosophy: "Philosophy",
  coding: "Coding",
  unplugged: "Unplugged",
  ["all-science"]: "All of science",
  textbooks: "Textbooks",
  ["all-subjects"]: "All subjects",
};
const rOverlap = (r, l) => r.ages[0] <= l + 6 && r.ages[1] >= l + 5;

/* ---------- More hands-on and puzzles in books; the best free resources from elsewhere next to our worksheets ---------- */

/* curated: the best free resources tagged to the same topics, shown under our own sheets */
const CURT = {
  worksheet: "Printable",
  activity: "Hands-on",
  experiment: "Experiment",
  reading: "Story or reading",
  lesson: "Lesson",
  game: "Game",
  sim: "Simulation",
  "citizen-science": "Real science project",
  video: "Video",
};
const CURO = ["worksheet", "activity", "experiment", "reading", "game", "lesson", "citizen-science", "sim", "video"];
function curatedFor(u) {
  const T = new Set(topicsOf(u)),
    age = +S.age || 8;
  return (DATA.resources || [])
    .filter((r) => r.concepts.some((c) => T.has(c)) && r.access !== "paid")
    .map((r) => ({
      r,
      s: CURO.indexOf(r.type) * 2 + (age < r.ages[0] || age > r.ages[1] ? 6 : 0) + (r.access === "free" ? 0 : 1),
    }))
    .sort((a, b) => a.s - b.s)
    .map((x) => x.r);
}

/* ---------- Stories, big ideas and open questions ---------- */
const storyHtml = (st) =>
  `<article class="story"><h2>${esc(st.title)}</h2>${st.text.map((p, i) => `<p${i ? "" : ' class="first"'}>${esc(p)}</p>`).join("")}<div class="storyask"><b>Talk about it</b><ol>${st.ask.map((q) => `<li>${esc(q)}</li>`).join("")}</ol></div></article>`;
