// small flat-style drawing kit for the perspective video (code-drawn, no outside images)
const SK = { a: "#c68a5e", b: "#a8693f", c: "#8a5230", d: "#e0a97e" };
const INK = "#23233a";
// a person from the waist up: opts {skin, hair, hairStyle:'bun'|'short'|'plaits'|'bald'|'turban', cloth, cloth2, extra:'glasses'|'bindi'|'beard'|'coat', pose:'hold'|'point'|'hands'}
function person(x, y, s, o = {}) {
  const skin = o.skin || SK.a, hair = o.hair || "#2b1d16", cloth = o.cloth || "#d63a2a";
  let h = `<g transform="translate(${x} ${y}) scale(${s})">`;
  // body
  h += `<path d="M-70 150 C-70 85 -40 62 0 62 C40 62 70 85 70 150 Z" fill="${cloth}" stroke="${INK}" stroke-width="4"/>`;
  if (o.cloth2) h += `<path d="M-70 150 C-62 100 -30 80 10 70 L40 150 Z" fill="${o.cloth2}" opacity=".9"/>`;
  if (o.extra === "coat") h += `<path d="M-70 150 C-70 85 -40 62 0 62 C40 62 70 85 70 150 Z" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M0 62 L0 150" stroke="${INK}" stroke-width="3"/>`;
  // neck + head
  h += `<rect x="-14" y="46" width="28" height="26" rx="8" fill="${skin}" stroke="${INK}" stroke-width="4"/>`;
  if (o.hairStyle === "bun") h += `<circle cx="0" cy="-48" r="18" fill="${hair}" stroke="${INK}" stroke-width="4"/>`;
  if (o.hairStyle === "plaits") h += `<path d="M-44 -4 C-52 30 -52 52 -46 70" stroke="${hair}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M44 -4 C52 30 52 52 46 70" stroke="${hair}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  h += `<circle cx="0" cy="0" r="50" fill="${skin}" stroke="${INK}" stroke-width="4"/>`;
  if (o.hairStyle !== "bald" && o.hairStyle !== "turban") h += `<path d="M-50 -4 C-50 -52 50 -52 50 -4 C40 -34 -40 -34 -50 -4 Z" fill="${hair}" stroke="${INK}" stroke-width="4"/>`;
  if (o.hairStyle === "turban") h += `<path d="M-52 -8 C-52 -58 52 -58 52 -8 C30 -26 -30 -26 -52 -8 Z" fill="#f2c94c" stroke="${INK}" stroke-width="4"/>`;
  // face
  h += `<circle cx="-17" cy="4" r="5" fill="${INK}"/><circle cx="17" cy="4" r="5" fill="${INK}"/><path d="M-14 26 Q0 38 14 26" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (o.extra === "glasses") h += `<circle cx="-17" cy="4" r="13" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="17" cy="4" r="13" fill="none" stroke="${INK}" stroke-width="3"/><path d="M-4 4 H4" stroke="${INK}" stroke-width="3"/>`;
  if (o.extra === "bindi") h += `<circle cx="0" cy="-14" r="4" fill="#d63a2a"/>`;
  if (o.extra === "beard") h += `<path d="M-40 18 C-30 70 30 70 40 18 C20 40 -20 40 -40 18 Z" fill="#eee" stroke="${INK}" stroke-width="4"/>`;
  h += `</g>`;
  return h;
}
// a speech bubble with a pointer to the lower left; content is html inside a foreignObject-free text
function bubble(x, y, w, hgt, txt, o = {}) {
  const f = o.fill || "#fff";
  return `<g transform="translate(${x} ${y})"><path d="M0 0 H${w} Q${w + 14} 0 ${w + 14} 14 V${hgt - 14} Q${w + 14} ${hgt} ${w} ${hgt} H44 L18 ${hgt + 30} L24 ${hgt} H14 Q0 ${hgt} 0 ${hgt - 14} V14 Q0 0 14 0 Z" fill="${f}" stroke="${INK}" stroke-width="4"/><text x="${w / 2 + 6}" y="${hgt / 2 + 9}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${o.size || 24}" fill="${INK}">${txt}</text></g>`;
}
const helix = (x, y, s = 1, ang = 0) => {
  let g = `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})">`;
  const cols = ["#d63a2a", "#2e9e6b", "#f2b01e", "#3a6fd6"];
  for (let i = 0; i < 9; i++) { const yy = i * 22 - 90, w = Math.cos(i * 0.8) * 46; g += `<line x1="${-w}" y1="${yy}" x2="${w}" y2="${yy}" stroke="${cols[i % 4]}" stroke-width="7" stroke-linecap="round"/><circle cx="${-w}" cy="${yy}" r="9" fill="#7a4fd6" stroke="${INK}" stroke-width="3"/><circle cx="${w}" cy="${yy}" r="9" fill="#b58be8" stroke="${INK}" stroke-width="3"/>`; }
  return g + `</g>`;
};
const seed = (x, y, s = 1, c = "#c9a227") => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="22" ry="30" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-6 -14 Q0 -4 -6 8" stroke="${INK}" stroke-width="3" fill="none"/></g>`;
const plant = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-4 -60 4 -110 0 -160" stroke="#2e7d32" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M0 -50 C-50 -60 -60 -100 -50 -110 C-20 -100 -4 -80 0 -50 Z" fill="#3fa55a" stroke="${INK}" stroke-width="4"/><path d="M0 -90 C50 -100 60 -140 50 -150 C20 -140 4 -120 0 -90 Z" fill="#3fa55a" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-166" r="14" fill="#f2c94c" stroke="${INK}" stroke-width="4"/></g>`;
module.exports = { SK, INK, person, bubble, helix, seed, plant };
