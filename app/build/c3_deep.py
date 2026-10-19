# Deep "Think" content and full worksheets for NCERT EVS Class 3 (DeepKids Level 3).
# THINK[n]: list of {q, why, views:[(who, view)], tryit}
# WS[n]: worksheet sections: (section title, [items]); item = dict(t=type, p=prompt, ...)
#   types: write(lines), draw, table(cols, rows), mcq(opts, a), fill(blanks answer list a), sort(items, cats), match(pairs)

THINK = {}; WS = {}

THINK[1] = [
 dict(q="What makes a group of people a family?",
      why="Every society has families, but they are built very differently. Some count relatives through the mother's line, some through the father's, some through both. Some children are raised by a whole village. Asking what makes a family is asking what holds people together at all.",
      views=[("Biology", "Family is shared genes: parents, children and their blood relatives. This explains inherited looks and traits, but not adopted children, step-parents or chosen family."),
             ("Kerala's matrilineal Nair and Meghalaya's Khasi traditions", "Family and property pass through the mother's line. Among the Khasi, the youngest daughter traditionally inherits the house. So 'who is family' depends on which line a society follows."),
             ("Care-based view", "Family is whoever cares for you day after day. A grandmother raising a child, or two friends who share a home for life, can be family.")],
      tryit="Make two lists: people related to you by birth, and people who look after you. Where do the lists overlap? Who is on only one list, and are they less your family?"),
 dict(q="Why does Hindi have chacha, mama, fufa and mausa where English has only 'uncle'?",
      why="Languages grow words for what a culture needs to tell apart. In joint families it mattered whether an uncle was from your father's side (who might live with you) or your mother's side (who usually didn't).",
      views=[("Linguists", "Kinship words show how a society organises duties: who you live with, who inherits, who you may marry."),
             ("English speakers", "One word is simpler, and the difference can be explained when needed ('my mother's brother')."),
             ("Tamil", "Tamil goes further: an older brother (annan) and younger brother (thambi) have different words, because age order carries different roles.")],
      tryit="Ask an elder for every relative's name in your home language. Count them. Then count the English words for the same people."),
 dict(q="Do animals have families and friends, or are we just imagining it?",
      why="It is easy to see human feelings in animals. Scientists try hard not to, so the evidence matters.",
      views=[("Elephant researchers", "Herds are led by the oldest female, who remembers water holes from decades before. Herds with older matriarchs survive droughts better."),
             ("Primatologists", "Chimpanzees and baboons form long friendships, groom friends more, and are calmer near them."),
             ("Careful sceptics", "We should not call it 'friendship' unless it is more than just staying near someone. What we can measure is choosing, helping and returning to the same individual.")],
      tryit="Watch a group of pigeons, crows or street dogs for 10 minutes. Do some always stay together? What would count as proof that two are friends?"),
]
WS[1] = [
 ("A. My family map", [
   dict(t="draw", p="Draw your family tree for three generations: grandparents, parents and their brothers and sisters, you and your cousins. Write each person's name and what you call them."),
   dict(t="table", p="Who lives in your home? Fill in the table.", cols=["Name", "What I call them", "One job they do at home"], rows=5)]),
 ("B. Relations puzzle", [
   dict(t="fill", p="My father's sister is my ____. My mother's sister is my ____. My father's brother is my ____. My mother's brother is my ____.", a=["bua", "mausi", "chacha", "mama"]),
   dict(t="mcq", p="Your mother's mother's daughter could be:", opts=["Your mother or your mausi", "Your bua", "Your chachi", "Your cousin"], a=0)]),
 ("C. Then and now", [
   dict(t="table", p="Interview a grandparent or an elder.", cols=["Question", "Them at age 8", "Me now"], rows=5, prefill=["Favourite game", "Favourite food", "How they got to school", "A toy", "A chore they did"])]),
 ("D. Think it through", [
   dict(t="sort", p="Sort these into 'related by birth', 'related by marriage' and 'chosen family'.", items=["Nani", "Chachi", "Best friend", "Brother", "Fufa", "A neighbour who looks after you"], cats=["By birth", "By marriage", "Chosen"]),
   dict(t="write", p="A friend says: 'A family must have a mother and a father.' Do you agree? Give one example that supports them and one that doesn't.", lines=4)]),
 ("E. Animal families", [
   dict(t="write", p="Elephant herds are led by the oldest female. Why might the oldest one be the best leader in a drought?", lines=3)]),
]

THINK[2] = [
 dict(q="Is bargaining fair?",
      why="At a mela, prices are often not fixed. The buyer wants it cheap; the seller wants enough to live on. Bargaining is an old way of finding a price both accept, but it can also be unequal.",
      views=[("The haggler", "Bargaining is a game of respect: both sides talk and meet in the middle."),
             ("The artisan", "If customers always push the price down, the person who made the thing by hand for days may not earn enough. Fair-trade shops fix prices to protect makers."),
             ("Economists", "A fair price is one both sides accept freely, knowing the facts. Bargaining is fair when both know what the thing is really worth.")],
      tryit="Play shop: one person makes a paper toy and must earn at least ₹20 worth of tokens for it. The other has ₹30. Bargain. Then swap roles. How did each side feel?"),
 dict(q="Why do so many melas happen just after harvest?",
      why="Melas are tied to the farming calendar. After harvest, farmers have money, food and free time, and the weather is often pleasant.",
      views=[("Historians", "Fairs like Sonepur and Pushkar grew from cattle and camel trading at set times each year, when animals and crops could be sold."),
             ("Religious traditions", "Many melas mark a festival or a holy bath (like the Kumbh), so the date comes from the stars and the Moon."),
             ("Today", "Some melas are now planned for tourists. Does that change what a mela is?")],
      tryit="Pick three melas (Pushkar, Surajkund, a local one). Find the month each happens and what farmers are doing at that time."),
 dict(q="Is a mela a kind of living thing?",
      why="A mela appears, grows, draws in energy (people, money, food), changes, ends, and comes back next year. Thinking about this tests what we mean by 'alive'.",
      views=[("Biologists", "No: a mela has no cells and does not reproduce or evolve by itself."),
             ("Systems thinkers", "Cities, markets and ant colonies behave like living systems: many parts following simple rules make something bigger that seems to have a life of its own."),
             ("Oneness traditions", "Thousands of people moving as one, then scattering and gathering again, is a picture of how separate selves are part of one larger life.")],
      tryit="Watch a crowd (or a video of one) from above. Does it move like one creature? Draw the arrows."),
]
WS[2] = [
 ("A. Spend wisely", [
   dict(t="table", p="You have ₹100. Prices: balloon ₹15, chaat ₹30, bangles ₹40, pinwheel ₹10, ride ₹25, kulfi ₹20. Choose four things.", cols=["Item", "Price (₹)"], rows=5, prefill=["", "", "", "", "Total"]),
   dict(t="write", p="₹100 minus your total = how much change? Show your working.", lines=2),
   dict(t="mcq", p="Which set costs exactly ₹100?", opts=["Bangles, chaat, kulfi, pinwheel", "Ride, kulfi, chaat, balloon", "Bangles, ride, chaat", "Kulfi, pinwheel, balloon, ride"], a=0)]),
 ("B. How mela toys work", [
   dict(t="draw", p="Draw a pinwheel. Use arrows to show where the air comes from and which way it turns."),
   dict(t="mcq", p="A pinwheel spins fastest when:", opts=["The air is still", "Air pushes on its blades", "It is painted brightly", "It is heavy"], a=1),
   dict(t="write", p="A dugdugi (pellet drum) makes sound when you twist it. What is hitting what? Why does it stop when you stop twisting?", lines=3)]),
 ("C. Staying safe", [
   dict(t="write", p="Write your family's plan if you get separated at a mela: where you meet, who you ask, what number you say.", lines=3)]),
 ("D. Think it through", [
   dict(t="write", p="A potter spent two days making a pot and asks ₹200. A buyer offers ₹80. Write what each might say. What would be a fair price, and why?", lines=4),
   dict(t="sort", p="Sort what a mela gives people.", items=["Buying things", "Meeting friends", "Music and shows", "Selling crafts", "Rides", "Festival prayers"], cats=["Trade", "Fun", "Culture"])]),
]

THINK[3] = [
 dict(q="Why does Diwali move around the calendar but Christmas doesn't?",
      why="People have always used the sky to keep time. The Sun gives the year and the seasons; the Moon gives months of about 29½ days. The two don't fit neatly: 12 lunar months are about 11 days shorter than a solar year.",
      views=[("The solar calendar (used for Christmas and the school year)", "Follows the Sun, so dates stay with the seasons."),
             ("The Hindu lunisolar calendar (Panchang)", "Months follow the Moon, but an extra month (adhik maas) is added about every three years so festivals stay in the right season. That's why Diwali always comes in autumn but on different dates."),
             ("The Islamic calendar", "Purely lunar with no extra month, so Eid moves through all the seasons over about 33 years.")],
      tryit="Find the dates of Diwali and Eid for the last 5 years. Which moves more? Can you explain why from the rules above?"),
 dict(q="Should festivals change when they harm others?",
      why="Festivals carry meaning across generations. But some customs (loud firecrackers, plastic decorations, idols in rivers) affect air, water, animals and people with breathing problems.",
      views=[("Tradition keepers", "Customs connect us to our grandparents and give the festival its meaning; changing them loses something."),
             ("Environmental scientists", "Firecrackers add fine dust that can make city air much worse for days; animals and birds are frightened by the noise."),
             ("Many communities", "Festivals have always changed. Clay idols, green crackers, community diyas and quiet hours are new traditions keeping the old meaning.")],
      tryit="Ask three elders how their festivals were celebrated as children. What changed, and why? Was the change for better or worse?"),
 dict(q="Do animals and plants have festivals?",
      why="In spring, birds sing and nest; in the monsoon, frogs gather and call all night; some flowers bloom together on one night. These are timed by the season, like many human festivals.",
      views=[("Ecologists", "These are 'phenology': life events timed by day length, temperature and rain. Many human festivals are also tied to these same cycles, such as harvest festivals."),
             ("Poets and many traditions", "The koel's call announcing spring has been celebrated for centuries as nature's own festival."),
             ("Careful thinkers", "A festival needs meaning and choice. Do frogs choose, or only respond? What is the difference?")],
      tryit="For two weeks, note which birds call at dawn and which flowers are blooming. Is anything 'celebrating' this season?"),
]
WS[3] = [
 ("A. Festivals around the year", [
   dict(t="table", p="Fill in six festivals.", cols=["Festival", "Month", "Season", "Why then? (harvest / Moon / new year / other)"], rows=6),
   dict(t="sort", p="Sort these festivals.", items=["Holi", "Guru Purnima", "Diwali", "Pongal", "Baisakhi", "Eid"], cats=["Moon-based", "Harvest-based", "Both"])]),
 ("B. The Moon's clock", [
   dict(t="draw", p="Draw the Moon on a full-moon night and on a new-moon night. Under each, write one festival that falls on it."),
   dict(t="mcq", p="Diwali falls on:", opts=["A full moon", "A new moon (amavasya)", "The longest day", "Any day the family chooses"], a=1),
   dict(t="fill", p="12 Moon months are about ____ days shorter than one Sun year.", a=["11"])]),
 ("C. Look closer", [
   dict(t="write", p="Paint a strip of paper with haldi paste. Dab soap water on it. What happened to the colour? What might be inside soap that haldi 'notices'?", lines=3)]),
 ("D. Think it through", [
   dict(t="write", p="Firecrackers: write two reasons people love them and two problems they cause. Then design a celebration that keeps the joy.", lines=5)]),
 ("E. Create", [
   dict(t="draw", p="Invent a festival for this season. Draw its symbol and write what it celebrates, one food, and one way everyone joins in.")]),
]

THINK[4] = [
 dict(q="Do plants move, sense and decide?",
      why="Plants seem still only because they are slow. Time-lapse films show shoots circling, roots bending towards water, leaves following the Sun. J.C. Bose built instruments to record plant responses over a century ago.",
      views=[("Plant scientists", "Plants sense light, gravity, touch, chemicals and damage, and respond, all without a brain or nerves. Roots grow downward because special cells sense gravity."),
             ("'Plant intelligence' researchers", "Some argue plants learn and remember (the touch-me-not stops folding when repeatedly dropped harmlessly)."),
             ("Critics", "Words like 'decide' and 'learn' may be too human. Responding is not the same as thinking.")],
      tryit="Put a potted plant by a window, mark which way its leaves face, then turn it around. Photograph it every day for a week."),
 dict(q="Is a tree one living thing or a whole city?",
      why="A big tree is home to insects, birds, lichens, fungi and microbes. Its roots partner with fungi that bring water and minerals in exchange for sugar.",
      views=[("Ecologists", "A tree is a keystone: remove it and many species lose their homes."),
             ("The 'wood wide web' idea", "Some scientists say trees share sugar and warnings through fungal networks under the soil."),
             ("Recent critics (2023)", "Other scientists reviewed the evidence and said those claims are often exaggerated; the fungi certainly connect roots, but whether trees 'help each other' is unproven.")],
      tryit="Choose one tree. In 15 minutes, count every other living thing you can find on or under it."),
 dict(q="Why did Saalumarada Thimmakka call trees her children?",
      why="Thimmakka of Karnataka, who had no children of her own, planted and watered hundreds of banyan saplings along a highway, carrying water for kilometres. She was awarded the Padma Shri.",
      views=[("Science", "A banyan can live for centuries and support whole communities of creatures; planting one is one of the longest-lasting gifts a person can give."),
             ("Many Indian traditions", "Trees like the peepal, banyan and tulsi are treated as sacred and cared for like family."),
             ("Your view", "Can you love a tree? Can a tree be family? What would you need to do for it?")],
      tryit="Adopt one tree for a month: name it, measure its trunk with string, give it water in summer, and record its visitors."),
]
WS[4] = [
 ("A. Parts and jobs", [
   dict(t="draw", p="Draw a whole plant (pull up a small weed and wash its roots). Label: root, stem, leaf, flower, fruit or seed."),
   dict(t="match", p="Match each part to its job.", pairs=[("Root", "Holds the plant and drinks water"), ("Stem", "Carries water up and food down"), ("Leaf", "Makes food using sunlight"), ("Flower", "Makes seeds"), ("Seed", "Starts a new plant")])]),
 ("B. Which part do we eat?", [
   dict(t="sort", p="Sort these foods.", items=["Carrot", "Potato", "Spinach", "Cauliflower", "Rice", "Ginger", "Mango", "Sugarcane"], cats=["Root", "Stem", "Leaf", "Flower", "Fruit or seed"]),
   dict(t="mcq", p="A potato is really a:", opts=["Root", "Stem", "Fruit", "Seed"], a=1)]),
 ("C. Leaf detective", [
   dict(t="table", p="Collect five different leaves.", cols=["Plant", "Shape", "Edge (smooth / toothed)", "Veins (net / parallel)"], rows=5)]),
 ("D. Experiment", [
   dict(t="write", p="You put a white flower in coloured water. After a day the petals are coloured. Explain how the colour got there. Which part carried it?", lines=3)]),
 ("E. Think it through", [
   dict(t="write", p="Write one way plants move, and how you could prove it with a phone camera.", lines=3)]),
]

THINK[5] = [
 dict(q="Who needs whom more: the bee or the flower?",
      why="Bees get nectar and pollen as food; flowers get their pollen carried to other flowers so they can make seeds. Neither gives on purpose, yet both depend on the other. This is called mutualism.",
      views=[("Ecologists", "Many crops (mangoes, apples, almonds, many vegetables) depend heavily on pollinators; without them, harvests fall sharply."),
             ("Evolution biologists", "Flowers and pollinators shaped each other over millions of years: long tubes and long tongues, bright colours and colour vision."),
             ("A deeper question", "If neither could exist without the other for long, are they two things or one partnership?")],
      tryit="Sit by a flowering plant for 10 minutes. Count the visitors. Do different insects visit different flowers?"),
 dict(q="If all mosquitoes disappeared, would that be good?",
      why="Mosquitoes spread malaria and dengue, which kill many people each year. But they are also food for fish, frogs, birds and bats, and some pollinate plants.",
      views=[("Some scientists", "Most mosquito species are not harmful to people, and other insects could fill their role; removing the few disease-carrying species could save many lives."),
             ("Other ecologists", "Mosquito larvae are a big food source in ponds and the Arctic; removing them could have effects we can't predict."),
             ("Ethicists", "Do humans have the right to wipe out a species, even a harmful one?")],
      tryit="Draw a food web around a pond with a mosquito in it. Cross it out. Which arrows break?"),
 dict(q="Who decides what a 'weed' is?",
      why="A weed is just a plant growing where a person doesn't want it. Many 'weeds' are medicines, food for insects or the first plants to heal damaged soil.",
      views=[("Farmers", "Weeds compete with crops for water and light and lower the harvest."),
             ("Ecologists", "Wild plants feed bees and butterflies and hold soil together."),
             ("Ayurveda and folk medicine", "Plants like 'doob' grass and 'punarnava' are used as medicines.")],
      tryit="Find three 'weeds' near your home. Learn their names. Is any of them useful to an insect, a bird or a person?"),
]
WS[5] = [
 ("A. Who lives where?", [
   dict(t="match", p="Match each living thing to its home.", pairs=[("Frog", "Pond"), ("Baya weaver", "Hanging nest on a palm"), ("Earthworm", "Soil"), ("Honeybee", "Hive"), ("Squirrel", "Tree hole")])]),
 ("B. Food chains", [
   dict(t="fill", p="Grass → ____ → tiger. Leaf → caterpillar → ____ → snake.", a=["deer", "bird (e.g. myna)"]),
   dict(t="draw", p="Draw a food web with at least 6 living things from your area. Draw arrows from the food to the eater.")]),
 ("C. Helpers", [
   dict(t="table", p="How do animals help plants?", cols=["Animal", "What it does for plants"], rows=4, prefill=["Bee", "Bird", "Earthworm", "Bat"]),
   dict(t="mcq", p="A plant with sticky, hooked seeds most likely spreads them by:", opts=["Wind", "Water", "Sticking to animals' fur", "Exploding pods"], a=2)]),
 ("D. Investigate", [
   dict(t="table", p="Minibeast hunt: look under 4 places (a pot, a stone, leaves, bark).", cols=["Where", "What I found", "How many"], rows=4)]),
 ("E. Think it through", [
   dict(t="write", p="If all the bees in your area disappeared, what would happen to the mango trees? And then to the people and animals who eat mangoes?", lines=4)]),
]

THINK[6] = [
 dict(q="When a monkey steals food in town, whose fault is it?",
      why="As forests shrink and food is left in the open, monkeys, elephants and leopards come into towns. People feel the animals are the problem; the animals are following food and space.",
      views=[("Wildlife biologists", "Feeding monkeys teaches them to depend on people and become bolder; most conflict starts with food we leave or give."),
             ("Farmers near forests", "Losing a harvest to elephants can ruin a family; they need protection and compensation."),
             ("Solutions that worked", "Beehive fences keep elephants away because elephants avoid bees; covered dustbins and not feeding monkeys reduce raids.")],
      tryit="Write the same event (a monkey grabbing a banana) twice: once as the person, once as the monkey. What does each one need?"),
 dict(q="Is nature 'in balance'?",
      why="People often say nature is in perfect balance until humans upset it. It is a comforting idea, but is it true?",
      views=[("Older ecology", "Nature tends towards a stable balance where each species has its place."),
             ("Modern ecology", "Nature is always changing: fires, floods, droughts and new species keep shifting things. 'Balance' is more like a dance than a still scale."),
             ("A middle view", "Even if nature changes, human changes are now so fast and so big that many species can't keep up.")],
      tryit="Look at old photos of your area from 30 years ago (ask elders). What changed? Which changes were natural, which human?"),
 dict(q="Can people who disagree live in harmony?",
      why="Harmony in music is different notes sounding good together, not everyone singing the same note. India has hundreds of languages, foods and faiths living side by side.",
      views=[("Peacemakers", "Harmony comes from listening and finding fair rules, not from everyone agreeing."),
             ("Philosophers", "Disagreement, done kindly, helps everyone think better."),
             ("Vasudhaiva Kutumbakam", "If the world is one family, quarrels are family quarrels; you still belong together after them.")],
      tryit="Next time you disagree with someone at home, each of you repeats the other's view in your own words before replying. Did it change anything?"),
]
WS[6] = [
 ("A. Fix it", [
   dict(t="draw", p="Draw a four-box comic: a quarrel about sharing, how each person feels, a fair fix, how it ends."),
   dict(t="mcq", p="Two children want the same swing. The fairest fix is:", opts=["The stronger one takes it", "Take turns with a timer", "Nobody uses it", "The older one decides"], a=1)]),
 ("B. People and animals", [
   dict(t="write", p="Elephants keep raiding a village's fields. Suggest two ideas that protect the farmers AND the elephants.", lines=4),
   dict(t="sort", p="Sort these actions.", items=["Feeding monkeys chips", "Covering dustbins", "Planting fruit trees in the forest", "Throwing stones at dogs", "Keeping water bowls in summer"], cats=["Helps harmony", "Causes conflict"])]),
 ("C. Stories of courage", [
   dict(t="write", p="The Chipko movement and the Bishnois protected trees with their bodies. Would you do that? What would you protect?", lines=3)]),
 ("D. Think it through", [
   dict(t="write", p="Is nature 'in balance', or always changing? Give one example from what you've seen.", lines=3),
   dict(t="write", p="Write one rule for your home that is good for people and for animals.", lines=2)]),
]

THINK[7] = [
 dict(q="Who owns the rain?",
      why="Water falls freely from the sky, but rivers, wells and pipes are shared by many people, farms, factories, animals and other states. Deciding who gets how much is one of the biggest questions of our time.",
      views=[("The law in India", "Water in rivers and under the ground is treated as a shared public resource that governments manage for everyone."),
             ("Farmers upstream and downstream", "Rivers like the Kaveri are shared by states that have argued about them for over a hundred years."),
             ("Traditional communities", "Johads, kunds and stepwells were built and cared for by whole villages; water belonged to the community that kept it.")],
      tryit="Find where your home's water comes from (tap, tanker, well, river). Who else uses that same source?"),
 dict(q="If Earth is covered in water, why do people run short?",
      why="About 97 of every 100 drops on Earth are salty sea water. Of the fresh 3, most is frozen in ice or deep underground. Only a tiny part is in rivers, lakes and reachable groundwater.",
      views=[("Hydrologists", "India pumps more groundwater than any other country; in many places it is being used faster than rain refills it."),
             ("Engineers", "Desalination (removing salt from sea water) can help but uses a lot of energy."),
             ("Water harvesters", "Catching rain where it falls, on roofs and in ponds, can refill the ground.")],
      tryit="Do the apple model: cut an apple into 4 (three quarters are the sea), and keep cutting the last piece to see how small the usable fresh water is."),
 dict(q="Is water ever really 'new'?",
      why="The water on Earth has been recycling for billions of years: evaporating, raining, flowing, frozen, drunk and breathed out.",
      views=[("Science", "The same water molecules may have passed through clouds, oceans, plants and animals, including dinosaurs, many times."),
             ("Many Indian traditions", "Rivers are honoured as mothers (Ganga Maa) because they carry life from the mountains to us."),
             ("Oneness", "If the water in you was once a cloud and will be a river again, where do you end and the water cycle begin?")],
      tryit="Breathe on a cold mirror. Where did that water come from, and where will it go next?"),
]
WS[7] = [
 ("A. Where water comes from", [
   dict(t="draw", p="Draw the water cycle: sun, sea, evaporation, clouds, rain, river, groundwater. Use arrows."),
   dict(t="sort", p="Sort these water sources.", items=["River", "Well", "Rain tank", "Glacier", "Lake", "Borewell"], cats=["Above ground", "Under ground", "Frozen"])]),
 ("B. Numbers", [
   dict(t="mcq", p="Out of every 100 drops of water on Earth, about how many are salty?", opts=["3", "50", "97", "100"], a=2),
   dict(t="fill", p="Most of Earth's fresh water is ____ in ice and glaciers.", a=["frozen"])]),
 ("C. My water audit", [
   dict(t="table", p="Count mugs or buckets used in one day.", cols=["Activity", "Mugs or buckets", "How to save"], rows=6, prefill=["Brushing", "Bathing", "Washing hands", "Cooking", "Cleaning", "Plants"])]),
 ("D. Experiment", [
   dict(t="write", p="Your bottle filter made muddy water look clear. Is it safe to drink now? Why or why not? What else would you do?", lines=3)]),
 ("E. Think it through", [
   dict(t="write", p="Who owns the rain that falls on your roof? Who owns a river? Write what you think and why.", lines=4)]),
]

THINK[8] = [
 dict(q="Rice or millet: which is better?",
      why="Millets like ragi, bajra and jowar were India's main grains for thousands of years. Rice and wheat took over after the 1960s Green Revolution, which helped feed India but used much more water.",
      views=[("Nutritionists", "Ragi is rich in calcium; bajra in iron. Millets also have more fibre than polished rice."),
             ("Farmers and water experts", "Rice needs a lot of water; millets grow in dry land with little rain. That's why the UN declared 2023 the International Year of Millets."),
             ("Cooks and families", "Taste, habit and what's in the shop matter too. 'Better' depends on whether you mean for your body, the farmer or the river.")],
      tryit="Taste a ragi roti or ragi porridge and a rice dish. Compare taste, how full you feel, and look up how much water each crop needs."),
 dict(q="Why do people in different places eat such different food?",
      why="Food follows land and climate: coconuts and rice in wet Kerala, wheat in Punjab, fish in Bengal and Goa, millets in dry Rajasthan. Trade, religion and history add more layers.",
      views=[("Geographers", "What grows nearby shapes what people cook."),
             ("Historians", "Chillies, potatoes and tomatoes came to India from the Americas only about 400–500 years ago; Indian food has always mixed and changed."),
             ("Today", "Supermarkets bring food from everywhere. Is that good for farmers near you?")],
      tryit="Pick one dish your family cooks. List each ingredient and where it grows. How many came from far away?"),
 dict(q="Vegetarian, eggs, fish or meat: what's healthiest?",
      why="Families eat differently for reasons of health, belief, culture, cost and care for animals.",
      views=[("Many nutrition scientists", "Both vegetarian and non-vegetarian diets can be healthy when balanced; pulses, milk, nuts and grains together give good protein."),
             ("Ethical vegetarians (and Jain and many Hindu traditions)", "Avoiding harm to animals (ahimsa) is the main reason."),
             ("Coastal and hill communities", "Fish, eggs or meat are local, affordable and traditional.")],
      tryit="Without judging, ask three people why they eat what they eat. Sort the reasons: health, belief, taste, cost, habit."),
]
WS[8] = [
 ("A. Where food comes from", [
   dict(t="sort", p="Sort these foods.", items=["Milk", "Rice", "Egg", "Spinach", "Honey", "Dal", "Fish", "Banana"], cats=["From plants", "From animals"]),
   dict(t="mcq", p="Which of these is a millet?", opts=["Moong", "Ragi", "Rajma", "Wheat"], a=1)]),
 ("B. My plate", [
   dict(t="draw", p="Draw today's lunch. Colour energy foods yellow, body-building foods red, protective foods green."),
   dict(t="table", p="Is your plate balanced?", cols=["Food group", "What I ate", "Enough? (yes/no)"], rows=3, prefill=["Energy", "Body-building", "Protective"])]),
 ("C. Food trail", [
   dict(t="table", p="Trace three foods back to where they grew.", cols=["Food", "Plant or animal", "Where it grows", "How it reached me"], rows=3)]),
 ("D. Experiment", [
   dict(t="table", p="Starch test (adult adds iodine).", cols=["Food", "My guess", "Colour", "Starch?"], rows=4, prefill=["Potato", "Rice", "Cucumber", "Bread"])]),
 ("E. Think it through", [
   dict(t="write", p="Rice needs much more water than millets. If your area has little rain, which would you grow? Give two reasons.", lines=3)]),
]

THINK[9] = [
 dict(q="Are germs our enemies?",
      why="Germs (microbes) are everywhere: in soil, food, air and inside us. Only a small number cause disease. Our gut alone has trillions of helpful microbes.",
      views=[("Doctors", "Handwashing with soap is one of the cheapest ways to prevent illness; soap lifts away the oils that hold germs."),
             ("Microbiologists", "Many microbes are our helpers: they make curd, digest food and train our body's defences."),
             ("The 'hygiene hypothesis'", "Some scientists think children who play outdoors and around animals develop fewer allergies; others say it's more about the right microbes than about dirt.")],
      tryit="Make curd at home. Which tiny living things made it? Are they 'germs'?"),
 dict(q="Is happiness something you feel or something you do?",
      why="Feelings come and go like weather. People have long asked whether we can grow lasting contentment.",
      views=[("Psychologists", "Sleep, movement, time outdoors, friends and helping others reliably make people feel better."),
             ("Yoga and Buddhist traditions", "Watching your breath and thoughts calmly builds a steady happiness that doesn't depend on getting things."),
             ("Philosophers", "Some say a good life includes sadness too, and that feeling every feeling is healthy.")],
      tryit="For a week, write one thing that made you happy each day. Was it something you got, or something you did?"),
 dict(q="Are mind and body two things or one?",
      why="When you're scared your heart races; when you're tired you feel grumpy; when you laugh your body relaxes.",
      views=[("Modern science", "The brain is part of the body, and hormones and nerves connect feelings and health both ways."),
             ("Descartes (a French thinker, 1600s)", "Mind and body are two different kinds of things."),
             ("Vedanta", "Body and mind are both layers (koshas) around a deeper Self; the true 'I' is the awareness that knows them both.")],
      tryit="Sit quietly for one minute and count your breaths. Then think of something scary. Did your breathing change? Who noticed the change?"),
]
WS[9] = [
 ("A. Healthy habits", [
   dict(t="table", p="Tick each day this week.", cols=["Habit", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], rows=5, prefill=["Brushed twice", "Washed hands before eating", "Slept 9+ hours", "Played outside", "Ate a fruit"])]),
 ("B. Germs", [
   dict(t="mcq", p="Why does soap clean better than water alone?", opts=["It smells nice", "It lifts away oil and dirt that hold germs", "It is colourful", "It is cold"], a=1),
   dict(t="sort", p="Sort these microbes.", items=["Curd bacteria", "Cold virus", "Gut bacteria", "Yeast in idli batter", "Malaria parasite"], cats=["Helpful", "Harmful"])]),
 ("C. My body", [
   dict(t="table", p="Heartbeat experiment.", cols=["When", "Beats in 15 seconds", "× 4 = beats per minute"], rows=2, prefill=["Sitting", "After 30 jumps"])]),
 ("D. Feelings", [
   dict(t="draw", p="Draw a feelings wheel with six feelings. In each, write one thing that brings that feeling.")]),
 ("E. Think it through", [
   dict(t="write", p="Are mind and body two things or one? Give one example from your own day.", lines=3)]),
]

THINK[10] = [
 dict(q="Is anything really 'natural' or 'human-made'?",
      why="A wooden chair is a tree shaped by people. Steel is iron ore from rock, changed by fire. Plastic is made from oil, which came from ancient living things.",
      views=[("Chemists", "Everything is made of the same elements; humans only rearrange them."),
             ("Environmentalists", "The difference matters: natural materials usually rot back into the earth; many human-made ones like plastic last for centuries."),
             ("Panchamahabhuta", "Indian thought says all things are made of five elements: earth, water, fire, air and space.")],
      tryit="Take five objects. Trace each back to the earth: what was it before a person shaped it?"),
 dict(q="Is plastic good or bad?",
      why="Plastic is cheap, light, waterproof and long-lasting. Those same qualities make it a problem when thrown away.",
      views=[("Doctors", "Sterile plastic syringes, drips and gloves save lives every day."),
             ("Ocean scientists", "Millions of tonnes of plastic reach the sea every year, harming turtles, birds and fish, and breaking into tiny microplastics."),
             ("Designers", "The question is not plastic or no plastic, but which uses are worth it and how we design things to be reused or recycled.")],
      tryit="Find ten plastic things at home. Mark each: needed, useful but replaceable, or not needed."),
 dict(q="Why is each thing made of the material it is?",
      why="Engineers choose materials for their properties: glass windows let light through, rubber tyres grip and bend, clay pots cool water by letting it seep and evaporate.",
      views=[("Engineers", "Choosing the wrong material makes things break, leak or burn."),
             ("Traditional craftspeople", "Many old choices are clever science: matkas, bamboo houses and lime plaster suit Indian heat."),
             ("Inventors", "New materials (like bioplastics from plants) keep changing what's possible.")],
      tryit="Pretend plastic was never invented. Redesign a water bottle, a raincoat and a toothbrush using other materials."),
]
WS[10] = [
 ("A. Properties", [
   dict(t="table", p="Test eight objects.", cols=["Object", "Material", "Hard or soft", "Sinks or floats", "Magnet sticks?"], rows=8)]),
 ("B. Sort", [
   dict(t="sort", p="Sort these.", items=["Cotton", "Steel", "Wood", "Plastic", "Clay", "Glass", "Wool", "Paper"], cats=["Natural", "Human-made", "Both (natural, changed by people)"]),
   dict(t="mcq", p="Which of these sticks to a magnet?", opts=["Aluminium foil", "A steel spoon", "A copper coin", "A gold ring"], a=1)]),
 ("C. Experiment", [
   dict(t="table", p="Raincoat test: drip water on each material over a tissue.", cols=["Material", "My guess", "Tissue dry or wet?", "Good for a raincoat?"], rows=5, prefill=["Paper", "Plastic bag", "Cotton cloth", "Foil", "Wool"])]),
 ("D. Design", [
   dict(t="draw", p="Design an umbrella for a hailstorm. Label each material and why you chose it.")]),
 ("E. Think it through", [
   dict(t="write", p="Write one place plastic is the best choice and one place we should stop using it. Explain both.", lines=4)]),
]

THINK[11] = [
 dict(q="Who really makes a clay pot?",
      why="The potter shapes it, but the clay came from a riverbank, water softened it, the wheel spun it, the Sun dried it and fire hardened it.",
      views=[("Craftspeople", "Skill passed down for generations is the real maker; a beginner with the same clay makes a lopsided pot."),
             ("Scientists", "Fire changes the clay itself: above about 600°C, it becomes ceramic and can never turn back into soft clay."),
             ("Panchamahabhuta", "Earth, water, air, fire and space (the hollow inside that makes it a pot) all work together.")],
      tryit="Shape a pot from dough or clay. List everything and everyone who helped make it."),
 dict(q="Is handmade better than factory-made?",
      why="A handloom saree or a carved toy carries the maker's skill and is one of a kind. A factory makes thousands of identical things cheaply.",
      views=[("Artisans", "Handmade work keeps traditions and livelihoods alive; India has millions of handloom weavers."),
             ("Economists", "Factories make things affordable for many more people."),
             ("Designers", "Some of the best things combine both: machines for the boring parts, hands for the skilled parts.")],
      tryit="Compare a handmade and a factory-made version of the same thing (a basket, a toy, cloth). Look closely and list differences."),
 dict(q="Why do good designs need failures?",
      why="Almost nothing works perfectly the first time. Engineers build, test, fail, change and test again. This is called iteration.",
      views=[("Inventors", "Thomas Edison's team tested thousands of materials for a bulb filament; each failure taught them something."),
             ("Indian frugal engineers", "Jugaad, the knack of fixing things with what's at hand, is a kind of fast trial and error."),
             ("Scientists", "A failed test is still data. The only real failure is not learning from it.")],
      tryit="Build a paper bridge that holds coins. Record each try: what broke, what you changed."),
]
WS[11] = [
 ("A. Makers and tools", [
   dict(t="match", p="Match the maker to the tool.", pairs=[("Potter", "Wheel"), ("Weaver", "Loom"), ("Carpenter", "Saw and plane"), ("Blacksmith", "Anvil and hammer"), ("Tailor", "Needle and scissors")])]),
 ("B. Steps", [
   dict(t="table", p="Put the steps of making a pot in order (1–5).", cols=["Step", "Order"], rows=5, prefill=["Fire it in a kiln", "Dig clay", "Shape it on a wheel", "Dry it in the sun", "Knead it with water"])]),
 ("C. Design, build, test", [
   dict(t="draw", p="Sketch your toy or bridge design. Label materials."),
   dict(t="table", p="Record your tests.", cols=["Try", "What happened", "What I changed"], rows=3)]),
 ("D. Meet a maker", [
   dict(t="write", p="Interview an artisan: what they make, how they learned, the hardest part, and how long one piece takes.", lines=4)]),
 ("E. Think it through", [
   dict(t="write", p="Is handmade better than factory-made? Give one reason for each side, then your answer.", lines=4)]),
]

THINK[12] = [
 dict(q="When we throw something 'away', where is 'away'?",
      why="'Away' is always somewhere: a landfill on a city's edge, a burning heap, a river, the sea, or a recycling yard. Delhi's Ghazipur landfill grew taller than a 20-storey building.",
      views=[("City planners", "Landfills are running out of space; sorting at home is the cheapest fix."),
             ("Waste-pickers and kabadiwalas", "They recover and recycle a large share of India's plastic and paper, often unrecognised."),
             ("Nature", "In a forest there is no 'away': every leaf, dropping and dead body becomes food for something else.")],
      tryit="Follow one item (a bottle or a wrapper) after you bin it. Ask whoever collects your waste where it goes."),
 dict(q="Is recycling enough?",
      why="Recycling sounds like the answer, but only a small share of all plastic ever made has been recycled. Many items can't be recycled at all.",
      views=[("Recyclers", "Clean, sorted waste can become new products and saves raw materials."),
             ("Zero-waste movement", "Refuse and reduce first: the best waste is the one never made."),
             ("Companies and governments", "Some say individuals can't fix it alone; makers must design products to be reused or taken back.")],
      tryit="For one week, before you buy anything, ask: do I need it, can I reuse something instead?"),
 dict(q="Is a banana peel waste?",
      why="To us it is rubbish; to a worm, a fungus or a compost heap it is food. Whether something is waste depends on who is looking.",
      views=[("Composters", "Kitchen peels become rich soil in a few weeks."),
             ("Circular economy thinkers", "Design everything so one process's 'waste' is another's input, like a forest."),
             ("Oneness", "If nothing in nature is wasted, perhaps 'waste' is only a human idea of separation.")],
      tryit="Start a small compost pot. Each week, write who is 'eating' the peels."),
]
WS[12] = [
 ("A. Which bin?", [
   dict(t="sort", p="Sort these.", items=["Banana peel", "Newspaper", "Battery", "Plastic bottle", "Old phone", "Tea leaves", "Broken glass", "Medicine strip"], cats=["Wet", "Dry", "Hazardous", "E-waste"])]),
 ("B. Facts", [
   dict(t="mcq", p="A plastic bag in the ground can last:", opts=["A few days", "A few weeks", "Hundreds of years", "Forever, exactly"], a=2),
   dict(t="fill", p="The best order is: Refuse, ____, Reuse, Recycle.", a=["Reduce"])]),
 ("C. My waste audit", [
   dict(t="table", p="Weigh or count one day's waste at home.", cols=["Type", "Items or weight", "Could we avoid it? How?"], rows=4, prefill=["Wet", "Dry", "Hazardous", "E-waste"])]),
 ("D. Experiment", [
   dict(t="table", p="Bury test: bury and dig up after 3 weeks.", cols=["Item", "Week 1", "Week 2", "Week 3"], rows=4, prefill=["Banana peel", "Paper", "Cotton rag", "Plastic bag"])]),
 ("E. Think it through", [
   dict(t="write", p="When we throw something away, where is 'away'? Draw or write where your rubbish really goes.", lines=4)]),
]
