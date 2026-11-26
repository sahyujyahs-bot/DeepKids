# Handover (2026-11-26)

Branch: `claude/homeschooling-app-india-83y794`. Latest push: e74c5638. Working tree clean. No helpers or tests are running.

## Done and live (pushed)
- Search bar on Today; no-match shows "write me a mini lesson" (Sonnet, `12-live.js`) with a writing animation; the mini lesson goes into plan, history, refresher and started lists; free "request full lesson" button; ready lesson replaces the mini one (`replaceLive`).
- IAm chat step-by-step with all philosophies; chats stored (`iam_chats`); searches with no unit stored (`topic_gaps`); founder email on request via `unit-request` function.
- Khan videos on 329 units; 39 high-confidence non-Khan videos on 31 units ("More to watch", `app/content/explainers/`). 66 medium matches are NOT added.
- Six new Fable units (validated, in build): conductors-insulators L4, gravity-orbits L5, seasons L5, melting-solidifying L4, energy-transfers L4, volcanoes-earthquakes L4. Not home-tested; facts to check are in each unit's `playtest` note; art is text briefs only.
- Perspectives video (animated, voiced, 70 s): /tmp/sh/persp/video-two-v1.mp4 (container only, may be gone).

## Not done
- Final full browser test (`sh app/tests/run.sh`) on the last build was not completed (earlier run: 0 FAIL up to the last few checks). Run it first.
- Founder must add `FOUNDER_EMAIL` secret in Supabase (Edge Functions, Secrets). Until then request emails are not sent.
- Founder reviews three video veto lists (106 earlier; 109 in veto_list2.md; veto_list3.md = 39 live + 66 not added). Files were in the old session's scratchpad.
- Doc audit answer: writers read WRITER_BRIEF + EXAMPLES + SPEC_UNIT + one part card + validator; reviewers/rewriters do not read PLAYTEST.md / REWRITE_UNIT.md / BRIEF_UNIT.md; in-app generators use short built-in rules (`IAM_VOICE`, `livePrompt`), not the md files.
- 351 units still to write (285 planned-unwritten L4-5, 46 new science, 20 new social). Fable used ~1% of weekly limit per unit (~280K tokens each; the unit output is the main cost).

## Plan awaiting founder's yes (cheaper Fable writing)
1. One combined rules file (~8K tokens): WRITER_BRIEF + PHILOSOPHY + BRIEF_UNIT + playtest checks + part cards; all writers/reviewers/rewriters read only it + validator.
2. Fable writes only deep parts (roots with deep_truth, explanations, perspectives, open questions, 2-session spine); Sonnet writes routine parts (quiz, worksheets, warmup, games, buy list, activity steps); Haiku finds and verifies videos.
3. Batches of 3 units, measure, then scale. Ask founder (model, helper count, rough cost) before any helper job.

## Rules to keep
See CLAUDE.md. Founder pays per token: short plain replies, never Opus for helpers, no helper without her yes. Costs for families in INR only. Push only to the branch above, no PRs, commit trailers as before. End replies with the veto-list reminder.
