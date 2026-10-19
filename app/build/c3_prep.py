# Parent prep for NCERT Our Wondrous World Class 3, chapters 1-12.
# GUIDE[n]: a short intro for the parent: what the chapter is really about, how to run it, a pitfall.
# PREP[n]: (kind, days_ahead, task, where) — kind matches the day-step kinds
#   read, learn, ws, exp, act, game, proj. days_ahead 0 = the morning of, 1 = the evening before, >1 = start that many days early.

GUIDE = {
1: ("This chapter looks simple (names for relatives), but underneath it is about how humans build belonging. "
    "Your child will meet the idea that families are made in different ways: by birth, by marriage, by choice. "
    "Run it like a conversation, not a quiz. Bring your own family stories; children remember stories, not lists. "
    "Pitfall: don't correct family words from your own language into Hindi or English. Mama, mamu, ammavan are all right."),
2: ("A mela is a lesson in money, crowds, motion and craft all at once. The science hides in the toys: a firki is a turbine, a lattu is a gyroscope. "
    "Let your child run the money in the Mela Market game; counting real change is the point. "
    "Pitfall: don't explain why the pinwheel spins before they've tried changing it. Let them guess, test, then talk."),
3: ("Festivals are how communities keep time with the sky, the harvest and each other. This chapter connects calendars, the Moon and food. "
    "Include festivals your family doesn't celebrate, and ask why different people celebrate different things. "
    "Pitfall: the diya experiment uses a flame. You light it and stay at the table the whole time."),
4: ("The big idea is that plants are not still: they drink, climb toward light, and sense the world. "
    "Start the seed and coloured-water experiments early so there is something to see on the day. "
    "Pitfall: don't name plant parts first. Let your child notice and describe, then give the words."),
5: ("Nothing lives alone. This chapter is about webs: who eats whom, who carries whose seeds, who needs whom. "
    "Spend real time outdoors; ten minutes looking under one stone teaches more than the whole page. "
    "Pitfall: teach care for small creatures. Everything you lift goes back exactly as it was."),
6: ("Harmony is a skill, not a mood. The chapter asks how people, animals and plants share space and sound. "
    "The role plays work best if you play the difficult person. Let your child solve it. "
    "Pitfall: avoid making it a lecture on being good. Ask what each side wants."),
7: ("Water connects everything: our bodies, cities, festivals, farms. Your child will see that clear water is not always clean water. "
    "Do the home audit honestly, including your own use. "
    "Pitfall: the bottle filter makes water look clean. Never let anyone drink it."),
8: ("Food is biology, geography and family history on one plate. Trace food back to farms and grandmothers' kitchens. "
    "Use your own regional dishes as the main examples, not textbook ones. "
    "Pitfall: iodine stains and isn't food. Use old cut pieces and throw them away after."),
9: ("Health here means body and mind together: germs, sleep, play and feelings. "
    "The feelings charades matter as much as the hand washing. Share a time you felt worried too. "
    "Pitfall: don't make the healthy-habit chart a punishment chart. Celebrate tries, not perfect weeks."),
10: ("Everything is made of something, and each material was chosen for a reason. Your child becomes a materials tester. "
     "Let them predict before every test, and write predictions down. Wrong predictions are the best ones. "
     "Pitfall: not every metal is magnetic (steel spoons yes, aluminium foil no). Let them find this out."),
11: ("Making things is thinking with hands. The chapter honours craftspeople and the design loop: try, fail, change, try again. "
     "If you can, visit an artisan; ask before photographing their work. "
     "Pitfall: don't fix their toy for them. Ask what they'd change and let them change it."),
12: ("Waste is just a material in the wrong place. Your child will see what rots, what doesn't, and who in our cities sorts it. "
     "Start the bury test on day one; it needs three weeks. "
     "Pitfall: wear gloves for sorting, and keep sharp or hazardous waste (batteries, glass) for an adult."),
}

NC = "Your NCERT book, or the free PDF: ncert.nic.in/textbook.php → Class 3 → Our Wondrous World (also on the ePathshala app)"
APP = "In this app: open the chapter → Think"
WSW = "In this app (Worksheet), or print it from the worksheet PDF"

def base(n):
    return [("read", 1, f"Read Chapter {n} yourself first and mark 2–3 places to stop and ask a question (15 min)", NC),
            ("learn", 1, "Read the three big questions and their views. Decide which one you'll open with and what you think (10 min)", APP),
            ("ws", 0, "Print the worksheet or keep the app open on a tablet; set out pencils and crayons", WSW)]

PREP = {
1: [("exp", 0, "Gather a measuring tape or ruler, a notebook, and ask a neighbour family if they'll join the hand-span survey", "Home; a neighbour"),
    ("act", 2, "Call a grandparent or elder and book a 20-minute interview (phone or video is fine)", "Family"),
    ("act", 0, "Cut a paper circle and list the home jobs for the chore wheel", "Paper, a pin, a pencil"),
    ("game", 1, "Write 15 relation riddle cards for Relation Railway (e.g. 'Your father's sister's son is your…')", "Index cards or paper slips"),
    ("proj", 3, "Find a shoebox and ask relatives for old photos, a utensil or a letter with a story", "Home; relatives")],
2: [("exp", 0, "Get A4 paper, scissors, pins, pencils with erasers and a table fan for the pinwheel lab; a lattu (top), a steel plate and a stopwatch", "Home; a toy shop for the lattu"),
    ("act", 0, "Paper cups, thread, two beads or buttons, and a stick for the dugdugi", "Home"),
    ("game", 1, "Make play coins (₹1, 2, 5, 10, 20) and 12 customer cards with wishes and budgets for Mela Market", "Paper, or toy money"),
    ("proj", 3, "Invite 3–4 family members or neighbours to the Mini Mela and fix a date", "Family; neighbours")],
3: [("exp", 0, "Haldi, water, a little soap or baking soda, white paper; a diya, a small glass and a big jar, matches (adult only)", "Kitchen"),
    ("act", 0, "Print or draw a map of India for the festival food map; find this month's full and new moon dates", "A panchang or any moon calendar website"),
    ("game", 1, "Make 12 month cards in a circle and 15 festival cards from different regions and religions", "Paper"),
    ("proj", 2, "Pick a day this week or next to host the family festival", "Family")],
4: [("exp", 2, "Start early: put a white flower or celery stalk in food-coloured water 1 day ahead; sow moong in 4 cups (light, dark, no water, fridge) 5 days ahead", "Kitchen; a vegetable vendor for celery"),
    ("act", 0, "Collect crayons and thin paper for leaf rubbings; string and a ruler to measure a tree trunk", "Home; a park"),
    ("game", 1, "Draw Leaf Detective Bingo cards: leaf shapes, edges and vein patterns", "Paper; or search 'leaf shape chart'"),
    ("proj", 0, "Buy methi or dhaniya seeds and a pot with soil", "Nursery or kirana shop")],
5: [("exp", 0, "Old socks to wear over shoes, a tray of soil; cotton buds and a magnifying glass", "Home; a stationery shop for the magnifier"),
    ("act", 0, "Pick a flowerpot or stone to look under; set up a simple bird feeder (grains in a lid)", "Home; balcony or garden"),
    ("game", 1, "Make 12 living-thing cards and get a ball of string for Web of Life", "Paper, string"),
    ("proj", 2, "Find a shallow bowl, a flowering plant, and bamboo pieces or hollow sticks for the insect hotel", "Nursery; hardware shop")],
6: [("exp", 0, "Install a free sound-meter app on a phone, or plan to rate noise 1–5 by ear; list 6 places to visit", "Phone app store"),
    ("act", 0, "Write 3 common family quarrels for the role play (sharing the TV, a broken toy, who goes first)", "Your own family life"),
    ("act", 1, "Ask 2 neighbours if your child can interview them about sharing water, parking or a park", "Neighbours"),
    ("game", 1, "Make Trouble cards and Help cards for Harmony Village", "Paper"),
    ("proj", 0, "Decide together what the Harmony Pact action will be; keep a bowl ready if it's water for animals", "Home")],
7: [("exp", 0, "A cut plastic bottle, gravel, sand, charcoal pieces, cotton, muddy water; two equal plates", "Garden or construction sand; charcoal from a kirana shop"),
    ("act", 0, "Put a notebook in the bathroom and kitchen for the one-day water audit", "Home"),
    ("act", 1, "Find a stepwell, lake or tank nearby, or a short video about one", "Local; search 'stepwell India for kids'"),
    ("game", 1, "Make 50 water-drop tokens per player and activity cards for Drop Detective", "Paper, buttons or beans"),
    ("proj", 0, "A straight-sided bottle or jar, a ruler and tape for the rain gauge", "Home")],
8: [("exp", 0, "Betadine (iodine), a dropper; cut potato, rice, bread, cucumber on an old plate (not to be eaten after)", "Chemist; kitchen"),
    ("exp", 2, "Weigh 50 g of chana and soak it 2 days before the lesson so the sprouts are ready", "Kitchen; a kitchen scale"),
    ("act", 1, "Ask a grandparent for one recipe and buy its ingredients", "Family; market"),
    ("game", 1, "Make food cards with energy, body-building and protective icons for Thali Builder", "Paper"),
    ("proj", 3, "Message 5 relatives asking for a family recipe and a photo", "Family")],
9: [("exp", 0, "Glitter (or haldi powder), soap; a watch with a seconds hand", "Stationery shop; home"),
    ("act", 0, "Write feelings on slips (happy, worried, angry, proud, shy, excited) for charades; print a 7-day sleep and play diary", "Paper"),
    ("game", 1, "Draw the Germ Busters race track with habit and germ squares", "Chart paper, a dice"),
    ("proj", 0, "Make a 7-day chart: water, sleep, outdoor play, fruit, one kind act", "Paper")],
10: [("exp", 0, "Paper, plastic, cotton, wool and foil squares, tissues, a dropper; a fridge or toy magnet", "Home"),
     ("act", 0, "A clay matka (or clay cup) and a plastic bottle, both filled with water at the same time", "Potter or market"),
     ("game", 1, "Make 20 household-object cards scored for hardness, bendiness, waterproofness and floating", "Paper"),
     ("proj", 0, "Small boxes or zip bags and labels for the Material Museum", "Home")],
11: [("exp", 0, "A4 sheets, coins, two books for the bridge; air-drying clay or atta dough", "Home; stationery shop"),
     ("act", 2, "Find a potter, carpenter or tailor nearby and ask if you can watch for 20 minutes", "Your neighbourhood"),
     ("act", 0, "Pick one toy from the Arvind Gupta toys site and gather its materials", "arvindguptatoys.com"),
     ("game", 1, "Write challenge cards for Inventor's Workshop and set out paper, foil, tape and marbles", "Home"),
     ("proj", 0, "Balloons, straws, bottle caps, a cardboard sheet and tape for a balloon car", "Stationery shop")],
12: [("exp", 0, "A pot of soil, a banana peel, paper, a cotton rag and a plastic bag; mark the date on the pot", "Home"),
     ("exp", 0, "A second pot or bucket with holes for compost; dry leaves", "Home; garden"),
     ("act", 0, "Gloves, a kitchen scale and 4 bags marked wet, dry, hazardous and e-waste", "Home"),
     ("act", 1, "Ask your local kabadiwala if your child can ask them 5 questions", "Your neighbourhood"),
     ("game", 1, "Make 30 waste picture cards and 4 bin labels for Bin Blitz", "Paper; old magazines"),
     ("proj", 0, "Agree as a family on the Zero-Waste Week rules", "Family")],
}
for n in PREP:
    PREP[n] = base(n) + PREP[n]

# General guides for chapters without a detailed plan yet, by subject.
SUBJ_GUIDE = {
    "math": ("Teach maths with things first, pictures second, symbols last. Before each lesson, skim the chapter and collect real objects for it. "
             "Ask 'how did you work it out?' more than 'what's the answer?'"),
    "eng": ("Read aloud together every day, even after your child reads alone. Before the lesson, read the chapter yourself and pick 5 new words. "
            "Retelling in their own words matters more than written answers."),
    "hin": ("Use Hindi at home during the lesson, even if it's not your main language. Read the chapter first and list new words with meanings. "
            "Songs and rhymes from the chapter are worth singing more than once."),
    "sci": ("Start from what your child can see at home or outside. Read the chapter first and pick one thing to observe or try. "
            "Let them guess before you explain."),
}
SUBJ_PREP = {
    "math": [("read", 1, "Skim the chapter and do its first two problems yourself (10 min)", "Your textbook or the NCERT PDF (ncert.nic.in/textbook.php)"),
             ("act", 0, "Collect objects for counting and measuring: coins, beans, a ruler, a clock or a measuring cup", "Home")],
    "eng": [("read", 1, "Read the chapter yourself and list 5 new words (10 min)", "Your textbook or the NCERT PDF (ncert.nic.in/textbook.php)"),
            ("act", 0, "Keep a word notebook and a pencil ready", "Home")],
    "hin": [("read", 1, "Read the chapter yourself and list new words with meanings (10 min)", "Your textbook or the NCERT PDF (ncert.nic.in/textbook.php)"),
            ("act", 0, "Keep a word notebook ready; find the chapter's poem read aloud if there is one", "ePathshala app or YouTube")],
    "sci": [("read", 1, "Read the chapter yourself and pick one thing to observe or try (10 min)", "Your textbook or the NCERT PDF (ncert.nic.in/textbook.php)"),
            ("act", 0, "Gather what you need for that one thing", "Home")],
}
