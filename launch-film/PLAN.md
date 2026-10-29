# DeepKids Gurukul launch film: plan for the AI-video version

Status: waiting for OpenArt credits (next month's refresh). The code-drawn cuts in this folder are the earlier versions.

## Decisions so far
- Vertical 9:16, about 45 seconds. Name on screen: "DeepKids Gurukul".
- Story: a tired mother falls asleep mid-morning at the dining table among her child's books and projects, filter coffee going cold. She dreams learning adventures with her daughter. She wakes after a nap (the wall clock jumps from 10:10 to 11:05), smiles, opens the app, sees the feature list ticked off, and taps "Log in".
- The dream looks like a dream: Waking Life-style rotoscoped, painterly, slightly shifting lines and colours. Real life (nap and waking) is steady and warm.
- Indian context: about 60% South Indian, 40% North, East and West.
- Each dream scene must show the real activity clearly, with mother and daughter both enjoying it and wowed, and a one-line caption.
- Music: flute and drone (Carnatic, misra chapu) for real life; a separate dream score; hard cuts between them (`gurukulScore.ts`).

## Characters (keep identical in every shot)
- Amma, 38, South Indian: teal cotton saree with a mustard-gold border, loose bun, small maroon bindi, gold studs and bangles. Reference: the founder's sleeping-mother picture.
- Kavya, 8: two long plaits with white jasmine and pink ribbons, rani-pink knee-length frock.
- IAm: the lion-man teacher from the app (`app/content/media/ui/iam*.webp` on the app branch: read, page, glance, lift, reach, shift, blink, talk). Use these as the identity reference; a dreamy filter or style blend is fine.

## Shot list
1. Nap: Amma asleep at the table, drool, hands sprawled, books, notebooks, a pinwheel, a steel tumbler of coffee with fading steam, wall clock ticking at 10:10, morning light through the window grille. The room begins to melt into the dream.
2. Kingfisher (Kerala backwater, ghat steps):
   - Wide: Amma points out a diving kingfisher to Kavya.
   - 90-degree top-down close-up: the kingfisher dives in with almost no splash and bursts out as a bullet train (the beak becomes the train's nose).
   - The splash soaks them; they laugh and wipe their faces.
   - Caption: "The kingfisher's beak shaped the bullet train's nose."
3. Velcro:
   - They pick burrs off a burdock plant, stick them on their clothes and peel them off like Velcro.
   - Amma fetches a shoe with a Velcro strap, comes back to the plant and shows Kavya the same hooks and loops.
   - Caption: "A burr's tiny hooks gave us Velcro."
4. Mirrors: they walk into a mirror room in a park and see themselves repeated forever, and wave. Caption: "Two mirrors facing each other make a 'forever'."
5. IAm: he appears in the dream (among stars, on his stone step), looks up from his book and smiles at them.
6. Waking: the clock now reads 11:05 and the coffee is cold. She wakes, smiles, picks up her phone.
7. App: the phone screen in the app's look (DESIGN.md: night band, notebook page, red margin). Features ticked one by one, no strike-through: Today's plan, ready each morning / Plans around classes and outings / Follows NCERT, Cambridge or NIOS / Or learn deep, topic by topic / Real experiments with kitchen things / Worksheets at three levels / Read aloud, so kids learn alone. She taps "Log in".

## How to make it
- OpenArt is connected in Claude sessions. Per shot: a keyframe image (image-to-image from the character references, about 15-20 credits), then image-to-video (PixVerse V6 about 50 credits, or Kling 3 about 175 for better people).
- Estimate: 10-12 shots, about 900-1,200 credits with retries on the cheaper model.
- Test first: one shot (the kingfisher splash) before buying the rest.
- Claude assembles: cuts, captions, the clock, the app screen and the Log in tap (code), the music, and the 9:16 export.
