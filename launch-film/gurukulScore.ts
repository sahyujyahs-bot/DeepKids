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
