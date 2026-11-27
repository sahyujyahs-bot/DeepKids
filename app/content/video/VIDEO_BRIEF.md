# DeepKids videos: everything decided so far (read this first)

Founder's exact words are in `founder-messages-video-design.txt` (10 long messages). This file is the summary. Branch: `claude/homeschooling-app-india-83y794`.

## The golden rules the founder keeps repeating
1. **Picture first, voice says the words.** Never put paragraphs on screen. No one can read and listen at once. On-screen words = names, labels, one short line.
2. **Animation must be meaningful and show what the voice says, at the moment it says it** (cell splits as she says "how did one cell know"). No typing text that differs from the voice. No random extra slides (she was angry about one stray ribosome slide).
3. **Show her the screens (stills storyboard) before building any video.** She compares screens by screenshot, so give contact sheets.
4. **Use the real app screens** (desktop screens, captions below) where a feature is the point; **illustrations/animation** where an idea is the point. Real unit art, real ribosome/protein/DNA illustrations from the unit; never a placeholder icon (show an actual worksheet).
5. **Slow enough to read; scroll long screens to the very end; captions stay for the whole scene.** No dead pauses on Today between scenes; start the next action while the voice starts.
6. **Our fonts and look** (see `app/content/DESIGN.md`: notebook and night sky). Music: not repetitive.
7. **Philosophies apply:** living beings and cells/molecules are never "it"; India first; women lead; many views; no false claims. Don't name competing apps (unfair, unchecked). Don't say "no AI" or "human-written": the units are AI-drafted and checked by rules + validator.
8. **Voice:** Piper "alba-medium" (en_GB) was liked best. The founder records her own voice too and wants it kept as is (tone not blunted; only fix wording). Two voices together (Alba for questions, founder for the app part) was accepted for now. Verify audio with `ffmpeg -af volumedetect` (mean about -16 dB) before sending; check audio and video lengths agree.
9. Format: reels are vertical 1080x1920; the perspectives video was made 1280x720. Founder is on a phone: send her contact sheets and the mp4.

## What exists (all files in this folder, copies from the old container)
| Video | Status | File |
|---|---|---|
| App intro reel, 2:42 (v6, 12 scenes: welcome, setup, plan, levels, swap, life, unit, depth, IAm, belief, end) | Made, she said "everything so fast" earlier and had many fixes (see messages 11-24). Latest v6 has them. Voice-over script was written (below) but she hasn't confirmed recording/AI voice. File too big for repo (45 MB; container /tmp/sh/reel/v6). Contact sheets in stills/ (s01..s09). | stills only |
| DNA "Big think questions" video, 46 s | Done: 3 animated questions (cell splits into skin and bone cell; seed = plant?; same four letters, A T C G with plant/elephant/person/fish/butterfly) in Alba's voice, then the app part (real app: Library, DNA unit, Big Questions, hint) in the founder's voice, then the seed-grows-in-a-woman-meditating slide ("true learning happens when we stay with questions long enough for answers to emerge from within", third eye opens), then "Try free at app.deepkids.in". Open small fixes: app-part sync (voice says "array of questions" while Library still on screen), hide the IAm "Ask me" mascot, check "array" wording. | dna-bigthink-v13-46s.mp4 |
| "Perspectives" video, 70 s (video 2 of the 8) | v1 animated and voiced, made 26 Nov by a helper. Check: slide 3 finger on the real "I disagree" button, twins on slide 4, Meena on slide 7. Not yet watched or approved by the founder. | perspectives-v1-70s.mp4, stills/board2-sheet.png, video-two-frames.png |

## The series she asked for: one video per feature, always with the DNA/RNA unit as the example
1. Big think questions (done, above)
2. Different perspectives (v1 made)
3. What nobody knows yet
4. Ideas people believe that are not true (the "it runs in the blood" card: blood or DNA?)
5. Depth beyond the definition (many succinct points, not two)
6. Scientist stories (story as illustration, not text)
7. Old texts from across the world (Chandogya Upanishad 6.12 Uddalaka and the banyan seed; Bhagavad Gita 7.10; show passages beautifully, say "ancient and modern voices")
8. Games, worksheets, experiments, activities (pictures of the printable games, the three-seeds experiment, an actual worksheet)

Her 10-slide script for the combined "what is special" video (11-25): slide 1 big question ("we don't need kids to memorise; we need them to think critically and be original"), 2 stay with questions long enough, 3 almost every science concept is debated, show two perspectives side by side with illustrations, 4 more unknown than known, show only the questions beautifully, 5 beliefs people hold that are false, 6 depth (many points), 7 scientist stories as illustration, 8 passages from old texts, 9 printable games/worksheets/experiments, 10 end slide.

Other videos she planned (11-25): (a) How we compare: a generic side-by-side "typical app: video, quiz, score" vs DeepKids; no named apps. (b) Our philosophy: no theory as settled truth, debates shown, no human-centred bias, no patriarchal bias, Indian context. (c) "Why not just use AI?": AI can be confidently wrong or shallow; use it by questioning and pushing back. The nails story is her own experience; she tells it in her words, nothing invented.

## App intro voice-over script (written 26 Nov, ~370 words, 2:45)
1 Welcome: "Introducing DeepKids Gurukul: the only tool homeschooling parents need, for kids aged 6 to 10. No more sleepless nights researching and curating resources. Never worry if your child is learning enough."
2 Setup: "Tell us about your child, in just a few taps. Follow a board of your choice: NCERT, Cambridge Primary or NIOS. Or opt for the DeepKids track, our own curriculum with no textbook."
3 Plan and tracking: "Your day is planned and delivered, with lessons, games and activities in order. Tracking is made easy: every subject drawn as a constellation. And if you join a regular school, get a transcript, plus an entrance test score that makes admission a breeze."
4 Levels: "The DeepKids track is special and ambitious. We never limit what topics kids can learn. A breadth of topics like no other app. Every topic is told age-appropriately, across five levels."
5 Swap/library: "An app that bends with your child: their interests, their moods. No plan is set in stone. Don't like today's topic? Swap it, or add what your heart wants from the library."
6 Life: "Learning is not only reading. It happens across life, and the app tracks it. Cooked dal today? Tell the app, and it delivers the related science. Add it all in one click."
7 Unit: "Every unit has a story to begin, flashcards, scientist stories, activities, experiments, worksheets and games, all printable, and open-ended questions: the parent asks, the child thinks."
8 Depth: "A depth like no other app or book. Different perspectives, real-life connections, open questions. No rote learning."
9 IAm: "Meet IAm, the guru at DeepKids, inspired by Lord Narasimha. He answers your questions, can help you assess your child's work, and more."
10 Belief: "Kids are deep. Prahlada's mother, Kayadhu, sat listening to the sage Narada; her unborn child heard it all, and remembered. We believe learning happens through play, life experiences and free thinking."
11 End: "Try it for free at app dot deepkids dot in."
To check with her: "like no other app" claims (hers, unverified); the Kayadhu/Narada wording is not source-checked.

## Tools (copied from the old container into `tools/`)
- `make9.js`, `rec9.js`, `stills9.js`: the DNA video: HTML scenes, stills, CDP screencast recording. `full7.sh`: voice (Piper alba-medium, in /tmp/sh/tts of the old container; download again: `pip install piper-tts`, voice en_GB-alba-medium) + whisper timing + mux.
- `art.js` (code-drawn people, bubble, helix, seed, plant), `board.js`/`board2.js` (storyboard slides), `app-shots.js` (real app screenshots), `make.js`/`tts.js`/`rec.js`/`mux.js` (perspectives video: step CSS animations to exact times, then mux; sync is exact).
- Free CC0 silhouette (svgsilh) was used for the meditating figure; images must be CC0/public domain/CC BY with credit; all other drawings are code-drawn.

## Cost note
Helpers: Sonnet for drawing/animation, Haiku for checks. Ask the founder (model, how many helpers, rough cost) before any helper job. She is low on weekly tokens.
