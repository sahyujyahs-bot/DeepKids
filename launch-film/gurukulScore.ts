import type { Material } from "./music";

// DeepKids Gurukul launch film, the 8-second sample: the moment the nap turns into the dream.
// Tradition drawn on: Carnatic. A venu-like flute over a tanpura-style drone (open fifths, low and
// wide), misra chapu tala (7 beats felt 3+2+2) on hand drums. The real room is raga
// Kharaharapriya (dorian on D: the natural B is its colour); the dream is raga Kalyani (lydian on
// D: G# is its colour), the same Sa, the world lifting a semitone at two places.
// No traditional melody is quoted: every phrase is written for this film.
export const sample = (): Material => ({
  style: "world", title: "Gurukul: the nap becomes a dream (sample)", seed: 1038, mood: "curious",
  bpm: 120, key: "D", mode: "dorian", meter: "7/8", grouping: [1.5, 1, 1],
  moodControls: { energy: 0.5, warmth: 0.62, brightness: 0.42, tension: 0.3, space: 0.6 },
  dyn: [0.5, 0.7], tail: 2.6,
  voices: { chords: { inst: "strings", role: "accomp" } },
  levels: { lead: 3, chords: -2.5, counter: -2, perc: -3.5 },
  chords: {
    drone: { voicing: "[D3 A3 D4]", bass: "D2:3.5" },
    dor: { voicing: "[D3 A3 C4 F4]", bass: "D2:2 A2:1.5" },
    kal: { voicing: "[D3 A3 E4 G#4]", bass: "D2:2 A2:1.5" },
    kal2: { voicing: "[D3 B3 E4 G#4]", bass: "D2:1.5 E2:1 A2:1" },
  },
  motifs: {
    // the tired phrase: a slow fall from Pa to Sa, the long note last
    sleepA: "r:.5 A4:1.5 G4:.5 F4:.5 E4:.5", sleepB: "F4:.5 E4:.5 D4:1.5 r:1",
    // the dream rises: Kalyani's G# heard at once
    rise: "r:1 E5:.5 F#5:.5 G#5:.5 A5:1",
    // the dream's motif: an upbeat climb to the long Ga, turn, home to Pa
    wonder: "A4:.5 B4:.5 C#5:1 B4:.5 G#4:.5 A4:.5", answer: "F#5:1.5 E5:.5 C#5:.5 B4:.5 A4:.5",
    harpUp: "D4:.25 A4:.25 E5:.25 F#5:.25 G#5:.25 A5:.25 C#6:.25 E6:.25 r:1.5",
    harp1: "D5:.5 A4:.5 F#5:.5 r:.5 E5:.5 A4:.5 G#5:.5", harp2: "C#5:.5 G#4:.5 E5:.5 r:.5 B4:.5 E4:.5 F#5:.5",
  },
  grooves: { main: { family: "hand", density: 0.55, variation: 0.4 } },
  sections: [
    { kind: "intro", bars: 2, harmony: ["drone", "dor"], lead: ["sleepA", "sleepB"], chordVel: 0.6, energy: 0.35 },
    { kind: "swell", bars: 1, key: "D", mode: "lydian", harmony: ["kal"], lead: ["rise"], counter: ["harpUp"], energy: 0.55 },
    { kind: "groove", bars: 2, key: "D", mode: "lydian", harmony: ["kal", "kal2"], lead: ["wonder", "answer"], counter: ["harp1", "harp2"], energy: 0.65 },
  ],
});

// THE FILM'S SCORE: 26 bars of misra chapu (7/8 at 120: a bar is 1.75 s, 52.5 frames), 45.5 s,
// composed to the picture's length (no fit needed). Form and picture:
//   intro 0-3    the nap: drone, the tired flute in Kharaharapriya, no drums
//   swell 4      the turn: harp sweeps up, the world lifts into Kalyani
//   grooveA 5-8  the burr, the kingfisher: the dream's motif and its answer, hand drums enter
//   grooveB 9-12 the compass, the banyan: the motif fragments and climbs, harp under it
//   break 13-14  a breath before the peak: strings and flute, a heartbeat pulse
//   build 15-18  the mirrors: fragments sequenced upward, drums dense
//   drop 19-20   the zoom to the stars, IAm: the motif augmented on the highest note, choir, all in
//   breath 21    she wakes: the drums stop; G natural for G#, Kalyani turns Shankarabharanam
//   outro 22-25  the app: the motif at home in D major, its last word as she taps Log in
export const score = (): Material => ({
  style: "world", title: "DeepKids Gurukul: the dream", seed: 4505, mood: "curious",
  bpm: 120, key: "D", mode: "dorian", meter: "7/8", grouping: [1.5, 1, 1],
  moodControls: { energy: 0.55, warmth: 0.62, brightness: 0.42, tension: 0.32, space: 0.6 },
  dyn: [0.5, 0.72], tail: 1.2,
  voices: { chords: { inst: "strings", role: "accomp" }, arp: { inst: "choir", role: "accomp", opts: { vowel: "a" } } },
  levels: { lead: 3, chords: -3, counter: -5, kick: -9, ghost: -6.5, arp: -10, perc: 4 },
  chords: {
    drone: { voicing: "[D3 A3 D4]", bass: "D2:3.5" },
    dor: { voicing: "[D3 A3 C4 F4]", bass: "D2:2 A2:1.5" },
    kal: { voicing: "[D3 A3 E4 G#4]", bass: "D2:2 A2:1.5" },
    kal2: { voicing: "[D3 B3 E4 G#4]", bass: "D2:1.5 E2:1 A2:1" },
    kalE: { voicing: "[D3 B3 E4 G#4]", bass: "D2:1.5 B1:1 E2:1" },
    kalA: { voicing: "[E3 A3 C#4 E4]", bass: "A1:2 E2:1.5" },
    bm: { voicing: "[F#3 B3 D4]", bass: "B1:2 F#2:1.5" },
    fsm: { voicing: "[C#3 F#3 A3 C#4]", bass: "F#1:2 C#2:1.5" },
    gD: { voicing: "[D3 G3 B3 D4]", bass: "D2:3.5" },
    D: { voicing: "[D3 A3 F#4]", bass: "D2:2 A2:1.5" },
    G: { voicing: "[D3 G3 B3 D4]", bass: "G1:2 D2:1.5" },
    A: { voicing: "[E3 A3 C#4 E4]", bass: "A1:2 E2:1 C#2:.5" },
  },
  motifs: {
    sleepA: "r:.5 A4:1.5 G4:.5 F4:.5 E4:.5", sleepB: "F4:.5 E4:.5 D4:1.5 r:1", sleepC: "r:1 C4:.5 A3:.5 B3:1 C4:.5", sleepD: "D4:3.5",
    rise: "r:1 E5:.5 F#5:.5 G#5:.5 A5:1",
    wonder: "A4:.5 B4:.5 C#5:1 B4:.5 G#4:.5 A4:.5", answer: "F#5:1.5 E5:.5 C#5:.5 B4:.5 A4:.5",
    wonder2: "C#5:.5 D5:.5 E5:1 D5:.5 B4:.5 C#5:.5", answer2: "A5:1.5 G#5:.5 F#5:.5 E5:.5 D5:.5",
    frag: "C#5:.5 D5:.5 E5:1 r:.5 C#5:.5 E5:.5", frag2: "E5:.5 F#5:.5 G#5:1 r:.5 E5:.5 G#5:.5",
    climb: "A5:.5 B5:.5 C#6:1 B5:.5 A5:.5 G#5:.5", land: "B5:1 A5:.5 G#5:.5 A5:1.5",
    hush1: "r:1.5 E5:1 F#5:1", hush2: "G#5:2.5 r:1",
    peak1: "D6:2 C#6:.5 B5:.5 A5:.5", peak2: "B5:1.5 A5:1 F#5:1",
    wake: "r:2 A4:1.5",
    home1: "A4:.5 B4:.5 C#5:1 B4:.5 G4:.5 A4:.5", home2: "F#4:1.5 E4:.5 F#4:.5 A4:1", home3: "B4:.5 C#5:.5 D5:1 C#5:.5 A4:.5 B4:.5", home4: "A4:1 F#4:.5 E4:.5 D4:1.5",
    harpUp: "D4:.25 A4:.25 E5:.25 F#5:.25 G#5:.25 A5:.25 C#6:.25 E6:.25 r:1.5",
    h1: "D4:.5 A3:.5 F#4:.5 r:.5 E4:.5 A3:.5 G#4:.5", h2: "B3:.5 E3:.5 G#3:.5 r:.5 B3:.5 E4:.5 G#4:.5", hA: "A3:.5 E3:.5 C#4:.5 r:.5 A3:.5 E4:.5 C#4:.5",
    hB: "B3:.5 F#3:.5 D4:.5 r:.5 B3:.5 F#4:.5 D4:.5", hE: "E4:.5 B3:.5 G#4:.5 r:.5 E4:.5 B3:.5 G#3:.5", hF: "F#3:.5 C#4:.5 A3:.5 r:.5 F#3:.5 C#4:.5 A4:.5",
    hD: "D4:.5 A3:.5 F#4:.5 r:.5 A3:.5 D4:.5 F#4:.5", hG: "G3:.5 D4:.5 B3:.5 r:.5 G3:.5 D4:.5 B4:.5", hAA: "A3:.5 E4:.5 C#4:.5 r:.5 E4:.5 A4:.5 C#5:.5", hEnd: "D4:.5 A4:.5 F#4:.5 D5:2",
    ch1: "[F#4 A4]:3.5", ch2: "[E4 A4]:3.5",
  },
  // misra chapu written out: dum (timpani on Sa or Pa) on each group of 3+2+2, tek (rim) inside, ka (shaker) fills
  grooves: {
    main: { kick: ["D2:1.5 A2:1 D2:1", "D2:1.5 A2:.5 A2:.5 D2:1"], ghost: ["r:.5 C4:.5 C4:.5 r:.5 C4:.5 r:.5 C4:.5", "r:.5 C4:.5 C4:.5 r:.5 C4:.5 C4:.25 C4:.25 C4:.5"], perc: ["C4:.25 C4:.25 r:1 C4:.5 r:.5 C4:.25 C4:.25 r:.5", "r:1.5 C4:.25 C4:.25 r:.5 C4:.5 r:.5"] },
    dense: { kick: ["D2:1 D2:.5 A2:1 D2:.5 A2:.5", "D2:.5 D2:.5 D2:.5 A2:.5 A2:.5 D2:.5 D2:.5"], ghost: ["r:.25 C4:.25 C4:.25 C4:.25 C4:.5 r:.25 C4:.25 C4:.5 C4:.25 C4:.25 C4:.5"], perc: ["C4:.25 C4:.25 C4:.25 C4:.25 C4:.5 C4:.5 C4:.25 C4:.25 C4:.5 C4:.5"], hat: ["C4:.5 C4:.5 C4:.5 C4:.5 C4:.5 C4:.5 C4:.5"] },
    soft: { kick: ["D2:3.5"], ghost: ["r:1.5 C4:1 r:1"] },
    home: { kick: ["D2:1.5 A2:2"], ghost: ["r:1.5 C4:.5 r:.5 C4:.5 r:.5"], perc: ["r:2.5 C4:.25 C4:.25 r:.5"] },
  },
  sections: [
    { kind: "intro", bars: 4, harmony: ["drone", "drone", "dor", "drone"], lead: ["sleepA", "sleepB", "sleepC", "sleepD"], chordVel: 0.6, energy: 0.3 },
    { kind: "swell", bars: 1, key: "D", mode: "lydian", harmony: ["kal"], lead: ["rise"], counter: ["harpUp"], energy: 0.5 },
    { kind: "groove", bars: 4, key: "D", mode: "lydian", harmony: ["kal", "kal2", "kal", "kalA"], lead: ["wonder", "answer", "wonder2", "answer2"], counter: ["h1", "h2", "h1", "hA"], groove: "main", energy: 0.55 },
    { kind: "groove", bars: 4, key: "D", mode: "lydian", harmony: ["kal", "bm", "kalE", "kalA"], lead: ["frag", "wonder", "frag2", "answer"], counter: ["h1", "hB", "hE", "hA"], groove: "main", energy: 0.64 },
    { kind: "breakdown", bars: 2, key: "D", mode: "lydian", harmony: ["bm", "kalE"], lead: ["hush1", "hush2"], groove: "soft", energy: 0.45 },
    { kind: "build", bars: 4, key: "D", mode: "lydian", harmony: ["kal", "bm", "fsm", "kalA"], lead: ["frag", "frag2", "climb", "land"], counter: ["h1", "hB", "hF", "hA"], groove: "dense", energy: 0.76 },
    { kind: "drop", bars: 2, key: "D", mode: "lydian", harmony: ["kal", "kal"], lead: ["peak1", "peak2"], counter: ["h1", "h1"], arp: ["ch1", "ch2"], groove: "dense", energy: 0.95 },
    { kind: "breath", bars: 1, key: "D", mode: "major", harmony: ["gD"], lead: ["wake"], groove: null, energy: 0.35 },
    { kind: "outro", bars: 4, key: "D", mode: "major", harmony: ["D", "G", "A", "D"], lead: ["home1", "home2", "home3", "home4"], counter: ["hD", "hG", "hAA", "hEnd"], groove: "home", energy: 0.58 },
  ],
});

// THE REAL WORLD, in two parts, cut from the film score above: the nap (its first 4 bars) and the
// waking (its last 5). The dream between them has its own music, and the cuts are hard.
export const napScore = (): Material => { const m = score(); return { ...m, title: "DeepKids Gurukul: the nap", tail: 0.5, sections: m.sections.slice(0, 1) }; };
export const wakeScore = (): Material => { const m = score(); return { ...m, title: "DeepKids Gurukul: waking", key: "D", mode: "major", tail: 1.2, sections: m.sections.slice(-2) }; };

// THE DREAM: 14 bars of 4/4 at 120 (28 s, a bar is 60 frames). Cinematic, E lydian (the raised
// fourth, A#, is the wonder in it). A celesta sings the motif (a climb that leaps to the #4 and
// settles), the real harp turns arpeggios under it, strings hold and swell, a soft pulse becomes a
// build, and it peaks at the stars on the motif augmented. It is still in full flight when she
// wakes: the cut to the waking music is the shock of waking.
export const dreamScore = (): Material => ({
  style: "cinematic", title: "DeepKids Gurukul: the dream", seed: 2840, mood: "awe",
  bpm: 120, key: "E", mode: "lydian", meter: "4/4",
  moodControls: { energy: 0.6, warmth: 0.5, brightness: 0.6, tension: 0.35, space: 0.55 },
  dyn: [0.62, 0.8], tail: 0.4,
  voices: { lead: "celesta" },
  levels: { lead: 3, counter: -13, kick: -7, arp: -8, chords: -6, bass: -2, hat: 5 },
  chords: {
    E: { voicing: "[E3 B3 G#3]", bass: "E2:2 B2:2" },
    FsE: { voicing: "[E3 A#3 C#4]", bass: "E2:4" },
    Csm: { voicing: "[C#3 G#3 B3]", bass: "C#2:2 G#2:2" },
    B: { voicing: "[F#3 B3 D#4]", bass: "B1:2 F#2:2" },
    Gsm: { voicing: "[D#3 G#3 B3]", bass: "G#1:2 D#2:2" },
  },
  motifs: {
    m1: "B4:.5 C#5:.5 D#5:.5 A#5:1.5 G#5:1", m2: "F#5:1 E5:.5 F#5:.5 G#5:2", m1b: "B4:.5 C#5:.5 D#5:.5 B5:1.5 A#5:1", m3: "G#5:1 F#5:1 E5:2",
    g1: "E5:.5 G#5:.5 B5:1 A#5:.5 G#5:.5 F#5:1", g2: "D#5:1 E5:.5 F#5:.5 B4:2", g3: "C#5:.5 E5:.5 G#5:1 F#5:.5 E5:.5 D#5:1", g4: "B4:3 r:1",
    b1: "B4:.5 C#5:.5 D#5:.5 F#5:.5 B4:.5 C#5:.5 D#5:.5 G#5:.5", b2: "C#5:.5 D#5:.5 F#5:.5 A#5:.5 C#5:.5 D#5:.5 F#5:.5 B5:.5", b3: "D#5:.5 F#5:.5 A#5:.5 C#6:.5 D#6:2",
    d1: "E6:2 D#6:1 B5:1", d2: "A#5:1.5 B5:.5 C#6:2", d3: "B5:4",
    hE: "E3:.5 B3:.5 G#4:.5 B3:.5 F#4:.5 B3:.5 G#4:.5 B3:.5", hF: "E3:.5 A#3:.5 F#4:.5 A#3:.5 C#4:.5 A#3:.5 F#4:.5 A#3:.5",
    hC: "C#3:.5 G#3:.5 E4:.5 G#3:.5 B3:.5 G#3:.5 E4:.5 G#3:.5", hB: "B2:.5 F#3:.5 D#4:.5 F#3:.5 A#3:.5 F#3:.5 D#4:.5 F#3:.5", hG: "G#2:.5 D#3:.5 B3:.5 D#3:.5 G#3:.5 D#3:.5 B3:.5 D#3:.5",
    oE: "E3:.5 B3:.5 E3:.5 B3:.5 E3:.5 B3:.5 E3:.5 B3:.5", oF: "E3:.5 A#3:.5 E3:.5 A#3:.5 E3:.5 A#3:.5 E3:.5 A#3:.5", oC: "C#3:.5 G#3:.5 C#3:.5 G#3:.5 C#3:.5 G#3:.5 C#3:.5 G#3:.5", oB: "B2:.5 F#3:.5 B2:.5 F#3:.5 B2:.5 F#3:.5 B2:.5 F#3:.5",
  },
  grooves: { main: { family: "pulse", density: 0.5, variation: 0.3 }, rise: { family: "build", density: 0.6, variation: 0.3 }, big: { family: "halfTime", density: 0.6, variation: 0.3 } },
  sections: [
    { kind: "hook", bars: 4, harmony: ["E", "FsE", "E", "FsE"], lead: ["m1", "m2", "m1b", "m3"], counter: ["hE", "hF", "hE", "hF"], groove: "main", energy: 0.6 },
    { kind: "groove", bars: 4, harmony: ["Csm", "B", "Gsm", "B"], lead: ["g1", "g2", "g3", "g4"], counter: ["hC", "hB", "hG", "hB"], groove: "main", energy: 0.66 },
    { kind: "build", bars: 3, harmony: ["Csm", "B", "FsE"], lead: ["b1", "b2", "b3"], arp: ["oC", "oB", "oF"], counter: ["hC", "hB", "hF"], groove: "rise", energy: 0.78 },
    { kind: "drop", bars: 3, harmony: ["E", "FsE", "E"], lead: ["d1", "d2", "d3"], arp: ["oE", "oF", "oE"], counter: ["hE", "hF", "hE"], groove: "big", energy: 0.95 },
  ],
});
