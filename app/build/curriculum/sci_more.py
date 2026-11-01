"""Science additions so that every item of the founder's HomeSchooling Track tabs (Physics, Chemistry, Biology)
is taught somewhere, each at the age where it can be delivered well (nothing is left out for being 'too advanced').
  NOTES: existing subtopic -> notebook items it teaches (ids from app/content/curriculum/notebook_items.json)
  SUBS:  existing topic -> new subtopics (same shape as sci_map.py; 'notes' in links)
  TOPICS: new topics
Item ranges like "phy:31-35" are allowed.
"""
L = lambda **k: k

NOTES = {
 "how-we-know/asking-questions": "phy:1,phy:4,phy:5",
 "how-we-know/stories-of-discovery": "phy:2,bio:6",
 "how-we-know/fair-tests": "bio:5",
 "how-we-know/questioning-evidence": "phy:27",
 "what-is-life/signs-of-life": "bio:1,bio:4",
 "what-is-life/cells": "bio:71-73",
 "order-chaos/order-and-chaos": "phy:6,bio:225",
 "order-chaos/chance": "phy:6",
 "order-chaos/entropy": "phy:18,phy:210",
 "order-chaos/cause-and-effect": "phy:20",
 "nothing-and-forever/zero": "phy:7",
 "nothing-and-forever/infinity": "phy:7,phy:21",
 "what-is-real/consciousness": "phy:8,bio:2,bio:65-67",
 "what-is-real/perception-and-reality": "phy:9",
 "what-is-real/other-minds": "bio:68-70",
 "the-very-small/atoms": "phy:10,phy:116,phy:117",
 "the-very-small/quantum": "phy:24,phy:28,phy:163,phy:244,phy:261",
 "space-time/space": "phy:11",
 "space-time/time": "phy:12",
 "space-time/dimensions": "phy:17",
 "space-time/relativity": "phy:25,phy:26,phy:29,phy:164,phy:243",
 "gravity/spacetime": "phy:13,phy:34,phy:161",
 "gravity/orbits": "phy:49",
 "gravity/weight-and-mass": "phy:102",
 "states/solids-liquids-gases": "phy:14,phy:100,phy:104",
 "states/particles": "phy:211",
 "states/melting-and-solidifying": "phy:111,phy:112",
 "states/properties-of-water": "bio:35",
 "states/floating-and-sinking": "chem:156",
 "energy/energy-around-us": "phy:15,phy:197",
 "energy/transfers": "phy:194",
 "energy/heat": "phy:199,phy:201,phy:202",
 "energy/sources-and-saving": "bio:147",
 "patterns-symmetry/symmetry-in-nature": "phy:19",
 "sky/sun-moon-stars": "phy:30",
 "sky/solar-system": "phy:45,phy:60",
 "sky/moon-phases": "phy:65",
 "sky/stars-and-galaxies": "phy:36,phy:43",
 "sky/exploring-space": "phy:42",
 "day-night-seasons/day-and-night": "phy:64",
 "day-night-seasons/seasons": "phy:72",
 "day-night-seasons/rhythms-of-nature": "bio:54-57,bio:59",
 "air/air-around-us": "phy:63",
 "weather/weather": "phy:66,phy:80",
 "weather/wind-and-air": "phy:67,phy:70",
 "weather/clouds-and-rain": "phy:68",
 "weather/natural-events": "phy:69",
 "weather/climate-change": "phy:71,phy:73,phy:75,phy:77,phy:78,bio:64",
 "planet-earth/structure-of-earth": "phy:59",
 "planet-earth/volcanoes-and-earthquakes": "phy:151",
 "planet-earth/soil-and-crops": "bio:217-220",
 "planet-earth/earth-shared-home": "bio:141,bio:204",
 "materials/properties": "phy:101,chem:150,chem:154,chem:155",
 "forces/push-and-pull": "phy:170,phy:176",
 "forces/friction": "phy:177",
 "forces/normal-force": "phy:178",
 "forces/air-water-resistance": "phy:179,phy:180",
 "forces/simple-machines": "phy:299,phy:301",
 "motion/kinds-of-motion": "phy:185,phy:190",
 "motion/speed": "phy:187,phy:189,phy:191,phy:192",
 "motion/swings-and-pendulums": "phy:135",
 "electricity/uses-of-electricity": "phy:217,phy:218",
 "electricity/electrical-safety": "phy:242",
 "electricity/circuits": "phy:230,phy:302",
 "electricity/conductors-and-insulators": "phy:220",
 "electricity/static-and-charge": "phy:219,phy:225-228",
 "magnets/poles": "phy:221,phy:222,phy:234",
 "magnets/magnets-and-materials": "phy:289",
 "light/colour": "phy:96,phy:158,phy:159,phy:165",
 "light/transparent-opaque": "phy:160",
 "light/reflection": "phy:156",
 "light/shadows": "phy:156",
 "light/how-we-see": "phy:167",
 "light/light-sources": "phy:152",
 "sound/sources-of-sound": "phy:131,phy:136,phy:139",
 "sound/vibration": "phy:136",
 "sound/sound-moves": "phy:137,phy:141,phy:142,phy:144,phy:145",
 "sound/volume-and-pitch": "phy:138",
 "sound/music": "phy:97,phy:140",
 "plants/photosynthesis": "phy:167,bio:188",
 "plants/plant-variety": "bio:175,bio:186",
 "plants/plant-senses": "bio:190",
 "plants/water-transport": "bio:189",
 "seeds-and-life-cycles/plant-life-cycle": "bio:191",
 "seeds-and-life-cycles/pollination": "bio:279",
 "animals/animals-around-us": "bio:16,bio:176",
 "animals/animal-life-cycles": "bio:277",
 "animals/insects": "bio:275,bio:276,bio:278,bio:280",
 "animals/animal-minds": "bio:104",
 "classification/keys-and-kingdoms": "bio:171-174",
 "habitats/habitats": "bio:195",
 "habitats/adaptations": "bio:124,bio:125",
 "habitats/water-habitats": "bio:212-216,bio:260,phy:166",
 "ecology/interdependence": "bio:192,bio:199,bio:226",
 "ecology/food-chains": "bio:193,bio:196",
 "ecology/cycles-and-decomposers": "bio:60-62,bio:197",
 "ecology/biodiversity": "bio:200,bio:261",
 "evolution/story-of-life": "bio:45,bio:46,bio:49,bio:52,chem:135",
 "evolution/natural-selection": "bio:47,bio:149,bio:152",
 "evolution/fossils-and-extinction": "bio:51,bio:292-296",
 "evolution/inheritance": "hist:1,hist:2",
 "microorganisms/microbes-everywhere": "bio:179,bio:180,bio:181,bio:184",
 "microorganisms/helpful-microbes": "bio:185,bio:231",
 "microorganisms/germs": "bio:185",
 "body/organs-inside": "bio:10,bio:27",
 "body/skeleton": "bio:20",
 "body/digestion": "bio:23",
 "senses/five-senses": "bio:19,bio:87",
 "food/nutrients": "bio:14,bio:237",
 "health/diseases-and-medicines": "bio:15,bio:234,bio:235",
 "mind/thinking-and-memory": "bio:7,bio:91",
 "mind/brain-and-nerves": "bio:82-86,bio:88,bio:89",
 "changes/fire": "phy:198",
 "changes/chemical-reactions": "chem:19",
 "making-things/design-and-build": "bio:297,bio:298",
 "me-and-others/me-and-others": "bio:129",
}

SUBS = {
"what-is-life": [
 ("inside-a-cell", "Inside a cell", {
   4: "A cell is a busy city: a skin (membrane) that chooses what comes in, a control centre (nucleus), power stations (mitochondria), kitchens (chloroplasts in plants).",
   5: "More cell parts and their jobs: the packaging and shipping system (ER and Golgi), recycling bins (lysosomes), a skeleton inside the cell; bacteria cells vs our cells; mitochondria were once free-living bacteria."},
  [], L(pre=["what-is-life/cells"], deep=["what-is-life/cells-divide"], src="notes", notes="bio:74-79")),
 ("cells-divide", "How cells copy themselves", {
   4: "One cell becomes two: how you grew from a single cell; cells that wear out are replaced every day.",
   5: "Mitosis and meiosis in simple words; stem cells that can become any cell; cells that are programmed to die so the body stays healthy."},
  [], L(pre=["what-is-life/inside-a-cell"], wide=["body/how-bodies-build-themselves"], src="notes", notes="bio:80,bio:81")),
],
"plants": [
 ("inside-plants", "Inside a plant: cells, pipes and tissues", {
   4: "Plants are built from cells with stiff walls; looking at leaf skin under a microscope.",
   5: "Two pipe systems: xylem carries water up, phloem carries food around; growth rings; plant tissues."},
  [], L(pre=["plants/water-transport"], wide=["what-is-life/inside-a-cell"], src="notes", notes="bio:187")),
],
"animals": [
 ("vertebrate-groups", "Fish, amphibians, reptiles, birds and mammals", {
   2: "Five big groups of animals with backbones and how to tell them apart.",
   3: "How each group breathes, keeps warm or cool, and has young.",
   5: "Surprises: mammals that lay eggs, fish that breathe air, birds that are dinosaurs; what the groups tell us about evolution."},
  [], L(pre=["animals/animals-around-us"], wide=["classification/sorting-living-things"], src="notes", notes="bio:28-31,bio:178")),
 ("invertebrates", "Animals without backbones", {
   3: "Worms, snails, crabs, spiders, insects, starfish and jellyfish: most animals have no backbone.",
   5: "Sponges, cnidarians, molluscs, arthropods, echinoderms; the octopus's three hearts and clever arms."},
  [], L(pre=["animals/animals-around-us"], wide=["animals/insects"], src="notes", notes="bio:177")),
 ("body-plans", "Animal body plans", {
   4: "Animals built in rings, in halves, in spirals and in segments; tissues as teams of cells.",
   5: "Body plans across the animal kingdom; comparing bodies to see who is related (comparative anatomy)."},
  [], L(pre=["animals/animal-bodies"], deep=["evolution/family-tree-of-life"], src="notes", notes="bio:17,bio:150")),
 ("courtship-and-mates", "Courtship, mates and families in nature", {
   4: "Peacock tails, bird songs and dances: how animals choose partners.",
   5: "Sexual selection; many family systems in nature (pairs, harems, groups where females lead, seahorse fathers that carry eggs); who looks after the young and why."},
  [], L(pre=["animals/animal-babies"], wide=["animal-behaviour/animal-societies"], src="notes", notes="bio:117-121,bio:153")),
],
"habitats": [
 ("where-life-lives", "Why life lives where it does", {
   4: "Why kangaroos live only in Australia; islands with their own animals; animals carried to new places (invasive species).",
   5: "Biogeography: drifting continents carried life apart; island species; endemic and invasive species in India."},
  [], L(pre=["habitats/habitats"], wide=["planet-earth/structure-of-earth"], src="notes", notes="bio:151,bio:207-211")),
 ("city-nature", "Nature in towns and cities", {
   2: "Birds, trees, insects and street animals that share our streets.",
   4: "How cities change habitats; animals that adapt to cities; designing greener towns."},
  [], L(wide=["habitats/habitats", "environment/caring"], src="notes", notes="bio:206")),
],
"ecology": [
 ("levels-of-life", "From one living thing to the whole biosphere", {
   4: "One organism, a population, a community, an ecosystem, the biosphere.",
   5: "How each level depends on the others; Earth as one living system (the Gaia idea, and its critics)."},
  [], L(pre=["ecology/interdependence"], src="notes", notes="bio:194")),
 ("populations", "How populations grow and stop growing", {
   4: "Rabbits in Australia; why numbers of animals rise and fall.",
   5: "Carrying capacity; predator and prey numbers rising and falling together; simple population graphs."},
  [], L(pre=["ecology/food-chains"], math=["data/line-graphs", "patterns/number-patterns"], src="notes", notes="bio:198,bio:221,bio:222")),
 ("how-ecosystems-change", "How ecosystems change and heal", {
   4: "A bare field becomes a forest (succession); keystone species like tigers and elephants.",
   5: "Wolves returning to Yellowstone; restoring forests, rivers and wetlands; landscapes as patchworks."},
  [], L(pre=["ecology/interdependence"], wide=["ecology/biodiversity"], src="notes", notes="bio:201-203,bio:205")),
],
"evolution": [
 ("family-tree-of-life", "The family tree of life", {
   4: "Every living thing is related; drawing a family tree of animals.",
   5: "How scientists build the tree of life from bodies and DNA (phylogeny); molecular clocks; surprising cousins."},
  [], L(pre=["evolution/story-of-life"], wide=["classification/keys-and-kingdoms"], src="notes", notes="bio:48,bio:155")),
 ("population-change", "How whole populations change", {
   5: "Chance changes in small groups (genetic drift), genes moving between groups, new species forming."},
  [], L(pre=["evolution/natural-selection"], src="notes", notes="bio:50")),
],
"microorganisms": [
 ("viruses", "Viruses", {
   4: "Viruses are far smaller than bacteria and can only copy themselves inside cells; colds and flu.",
   5: "How a virus takes over a cell; vaccines; prions and viroids, the strangest things that copy themselves."},
  [], L(pre=["microorganisms/microbes-everywhere"], wide=["what-is-life/edge-of-life", "body/immune-system"], src="notes", notes="bio:182,bio:183")),
 ("parasites", "Parasites", {
   3: "Lice, ticks, fleas and worms; the mosquito and malaria; keeping safe.",
   5: "Parasites and hosts in an arms race; parasites that change their host's behaviour."},
  [], L(wide=["health/how-diseases-spread"], src="notes", notes="bio:270-274")),
],
"body": [
 ("keeping-balance", "How the body keeps itself steady", {
   3: "Sweating when hot, shivering when cold, feeling thirsty: the body keeps things just right.",
   5: "Homeostasis: sensors, control and response; feedback loops in the body and in machines."},
  [], L(pre=["body/organs-inside"], wide=["frontiers/life-as-a-system"], src="notes", notes="bio:11")),
 ("heart-blood-breath", "Heart, blood and breathing", {
   3: "The heart pumps blood; lungs take in air; feeling your heartbeat and breath.",
   4: "Blood carries oxygen and food everywhere; measuring pulse and breathing rate.",
   5: "The circulatory and respiratory systems; open and closed circulation in other animals; gills and lungs."},
  [], L(pre=["body/organs-inside"], math=["data/bar-charts"], src="notes", notes="bio:21,bio:22")),
 ("kidneys-and-waste", "How the body gets rid of waste", {
   4: "Kidneys clean the blood; sweat, breath and urine as ways of removing waste.",
   5: "Excretion and balancing water and salt in humans, fish and desert animals."},
  [], L(pre=["body/organs-inside"], src="notes", notes="bio:24")),
 ("messages-in-the-body", "Nerves and hormones: messages in the body", {
   4: "Fast messages by nerves, slow messages by hormones; reflexes.",
   5: "The endocrine system; adrenaline; how growth and sleep are controlled by hormones."},
  [], L(pre=["mind/brain-and-nerves"], src="notes", notes="bio:12,bio:25")),
 ("immune-system", "The immune system: the body's defenders", {
   3: "Skin, tears and fever as defences; white blood cells fight germs.",
   4: "Two kinds of defence: the quick general one and the one that learns; how vaccines teach the body.",
   5: "Antibodies and memory cells; allergies and autoimmunity; how HIV attacks the immune system; Edward Jenner and Onesimus."},
  [], L(pre=["microorganisms/germs"], wide=["microorganisms/viruses"], src="notes", notes="bio:26,bio:240-246")),
 ("how-babies-grow", "How a baby grows", {
   3: "Every person began as one tiny cell in their mother; growing in the womb; birth.",
   5: "Human reproduction and development in age-appropriate words; egg and sperm; families of many kinds."},
  [], L(pre=["body/growing"], wide=["animals/animal-babies"], src="notes", notes="bio:13,bio:18")),
 ("how-bodies-build-themselves", "From one cell to a whole body", {
   5: "Development: one cell divides into a ball, folds into layers, builds organs; chemical signals that tell cells where they are; master switch genes (Hox); regrowing limbs in axolotls."},
  [], L(pre=["what-is-life/cells-divide"], wide=["animals/animal-life-cycles"], src="notes", notes="bio:154,bio:263-269")),
 ("energy-from-food", "Turning food into energy", {
   5: "Metabolism: breaking food down for energy and building the body up; why we feel warm after eating."},
  [], L(pre=["food/nutrients"], wide=["life-chemistry/energy-currency"], src="notes", notes="bio:43")),
 ("growing-old", "Growing old", {
   3: "Babies, children, adults, grandparents: how bodies change over a lifetime.",
   5: "Why bodies age; animals that live very long (tortoises, whales); caring for the elderly."},
  [], L(pre=["body/growing"], src="notes", notes="bio:238")),
],
"health": [
 ("sleep", "Sleep", {
   2: "Why we sleep; a bedtime routine.",
   4: "What happens when we sleep; dreams; animals that sleep standing up or half a brain at a time.",
   5: "Sleep and memory; body clocks (circadian rhythms) and light at night."},
  [], L(wide=["day-night-seasons/rhythms-of-nature", "mind/thinking-and-memory"], src="notes", notes="bio:58")),
 ("how-diseases-spread", "How diseases spread", {
   4: "How an illness spreads from person to person; why washing hands and masks help.",
   5: "Epidemics and pandemics; diseases that jump from animals (zoonoses); simple spread models (one person infects two...); public health and safe labs."},
  [], L(pre=["microorganisms/germs"], math=["patterns/number-patterns", "data/line-graphs"], src="notes", notes="bio:223,bio:236,bio:239,bio:306-310")),
 ("medicines-and-poisons", "Medicines and poisons", {
   4: "The dose makes the poison: medicines are helpful in the right amount; never take medicine without an adult.",
   5: "How new medicines are found; antibiotics and why germs become resistant; snake venom and plant toxins; pollution as poison."},
  [], L(pre=["health/diseases-and-medicines"], src="notes", notes="bio:247-253")),
],
"mind": [
 ("sense-of-self", "A sense of self", {
   2: "Who am I? My body, my likes, my feelings.",
   4: "Every living thing keeps 'self' apart from 'other', from the first cells to our immune system; a bacterium's map of its own body.",
   5: "How the brain builds a story of 'me'; self-awareness in humans and other animals (mirror tests)."},
  [], L(wide=["what-is-real/consciousness", "me-and-others/me-and-others"], src="notes", notes="bio:3,bio:53")),
 ("brain-habits", "Habits, rewards and the storytelling brain", {
   4: "Habits form when we repeat things; the brain's reward chemical (dopamine) makes us want more of sweets and screens.",
   5: "The brain's 'default' network that daydreams and tells stories about us; how to notice our habits; what scientists know and still argue about."},
  [], L(pre=["mind/brain-and-nerves"], src="notes", notes="bio:8,bio:9")),
 ("brains-that-struggle", "When brains struggle", {
   5: "Kindly and simply: memory loss in old age (Alzheimer's), sadness that doesn't go away (depression), shaking illness (Parkinson's); getting help is brave."},
  [], L(pre=["mind/brain-and-nerves"], src="notes", notes="bio:90")),
 ("brains-and-computers", "Brains and computers", {
   5: "How neurons pass on information; artificial neural networks were inspired by brains; brain-computer interfaces; is AI like a brain?"},
  [], L(pre=["mind/brain-and-nerves"], wide=["phil:technology-and-ai/artificial-intelligence"], src="notes", notes="bio:301-305")),
],
"me-and-others": [
 ("human-nature", "Why people do what they do", {
   4: "Cooperation, kindness and conflict; language, culture and rituals; how we copy each other.",
   5: "Evolution and human behaviour (with caution); empathy and aggression; thinking traps (cognitive biases) that fool us all."},
  [], L(pre=["me-and-others/me-and-others"], wide=["animal-behaviour/animal-societies", "how-we-know/questioning-evidence"], src="notes", notes="bio:130-135")),
],
"how-we-know": [
 ("science-and-right-wrong", "Science and what is right", {
   4: "Should we test medicines on animals? Should we change crops' genes? Talking about hard choices.",
   5: "Ethics in biology: animal testing, genetic modification, conservation dilemmas, cloning and stem cells; who should decide?"},
  [], L(wide=["frontiers/gene-editing"], src="notes", notes="bio:156-161")),
],
"states": [
 ("crystals", "Crystals", {
   3: "Growing salt and sugar crystals; crystals have flat faces and repeating shapes.",
   5: "Atoms stacked in repeating patterns (crystal lattices); glass is not a crystal; how X-rays reveal crystal shapes (Dorothy Hodgkin)."},
  [], L(pre=["states/solids-liquids-gases"], wide=["patterns-symmetry/symmetry-in-nature"], src="notes", notes="phy:105,phy:126,phy:286,chem:16,chem:17,chem:153")),
 ("liquids-up-close", "Liquids up close: thick, thin and stretchy skin", {
   3: "Syrup race: some liquids flow slowly (viscosity); insects that walk on water.",
   5: "Surface tension; why drops are round; soap bubbles; how temperature changes thickness."},
  [], L(pre=["states/solids-liquids-gases"], math=["time/duration"], src="notes", notes="phy:106")),
 ("gas-laws", "Squeezing and heating gases", {
   5: "Squash a syringe and the gas pushes back; warm a balloon and it grows; gas particles bumping (kinetic theory); partial pressures in air."},
  [], L(pre=["states/particles"], wide=["air/air-around-us"], src="notes", notes="phy:107,chem:39,chem:40,chem:191-193")),
 ("expanding-when-hot", "Things grow when warm", {
   4: "Bridges have gaps, tight lids open in hot water: materials expand when heated.",
   5: "Thermal expansion and thermometers; water is strange (it expands when it freezes)."},
  [], L(pre=["energy/heat"], src="notes", notes="phy:203")),
 ("plasma", "Plasma: the fourth state", {
   4: "Lightning, the Sun and neon signs are plasma: gas so hot its atoms break apart.",
   5: "Most of the visible universe is plasma; the solar wind and auroras; fusion reactors that try to hold a star in a magnetic bottle."},
  [], L(pre=["states/solids-liquids-gases"], wide=["sky/the-sun"], src="notes", notes="phy:108,phy:293-298")),
 ("strange-states", "Strange states of matter", {
   5: "Supercooled water that freezes in a flash; superfluids that climb walls; Bose–Einstein condensates (Satyendra Nath Bose); liquid crystals in screens."},
  [], L(pre=["states/solids-liquids-gases"], src="notes", notes="phy:109,phy:110,phy:115,phy:258-260,chem:151,chem:152")),
 ("phase-maps", "When is water ice, water or steam?", {
   5: "A map of temperature and pressure for water; why water boils at a lower temperature on mountains; the triple point."},
  [], L(pre=["states/evaporation-and-condensation"], math=["data/line-graphs"], src="notes", notes="phy:113,phy:114,chem:42,chem:157,chem:158,chem:41")),
],
"changes": [
 ("kitchen-science", "Science in the kitchen", {
   2: "Cooking changes food: melting butter, boiling rice, setting curd.",
   4: "Why food browns, bread rises and onions make us cry.",
   5: "Food chemistry: browning (Maillard), flavours, preservatives; cooking as chemistry and physics."},
  [], L(wide=["changes/reversible-and-irreversible", "microorganisms/helpful-microbes"], src="notes", notes="phy:99,chem:107")),
],
"making-things": [
 ("biomimicry", "Inventions copied from nature", {
   3: "Velcro from burrs, gecko-feet tape, lotus leaves that stay clean.",
   5: "Robots that walk like insects and swim like fish; spider silk; why nature is a great engineer."},
  [], L(wide=["making-things/design-and-build"], src="notes", notes="bio:297-300")),
],
"forces": [
 ("stretching-springs", "Stretching and springs", {
   3: "Rubber bands and springs stretch and spring back (elastic).",
   5: "Hooke's law: twice the pull, twice the stretch (until it breaks); making a spring balance."},
  [], L(pre=["forces/changing-motion"], math=["data/line-graphs", "measurement-basics/reading-scales"], src="notes", notes="phy:103")),
 ("direction-and-size", "Forces have size and direction", {
   4: "Force arrows: longer arrow, bigger force; arrows in the same and opposite directions.",
   5: "Vectors and scalars in simple words; adding forces at angles with arrows (two people pulling a cart)."},
  [], L(pre=["forces/balanced-forces"], math=["lines-angles/angles"], src="notes", notes="phy:88,phy:89")),
 ("four-forces", "The four forces of nature", {
   4: "Every push and pull comes from just four forces: gravity, electric-magnetic, and two inside the atom.",
   5: "Gravity, electromagnetism, the strong and the weak nuclear forces; which is strongest and which reaches furthest."},
  [], L(pre=["forces/push-and-pull"], wide=["the-very-small/nucleus"], src="notes", notes="phy:171-175")),
 ("fields", "Forces at a distance: fields", {
   4: "Magnets and gravity pull without touching.",
   5: "Fields as invisible maps of force: gravity fields, electric fields, magnetic fields."},
  [], L(pre=["magnets/poles"], wide=["gravity/orbits"], src="notes", notes="phy:181-183")),
 ("flight", "How things fly", {
   3: "Kites, paper planes, birds and seeds that glide.",
   5: "Lift and drag; wing shape; how heavy planes stay up."},
  [], L(pre=["forces/push-and-pull"], wide=["forces/air-water-resistance", "animals/birds"], src="notes", notes="phy:180")),
],
"motion": [
 ("newtons-laws", "Newton's laws of motion", {
   3: "Things keep doing what they are doing unless a force acts (a ball on ice).",
   4: "Bigger force, bigger change; heavier things need more force.",
   5: "Newton's three laws; every action has an equal and opposite reaction (rockets, balloons)."},
  [], L(pre=["forces/changing-motion"], wide=["forces/normal-force"], src="notes", notes="phy:186")),
 ("describing-motion", "Describing motion: position, speed and acceleration", {
   4: "Where is it, how fast, which way? Speeding up and slowing down.",
   5: "Velocity and acceleration; distance-time graphs; motion in a line, on a plane, in 3D."},
  [], L(pre=["motion/speed"], math=["data/line-graphs", "position/coordinates"], src="notes", notes="phy:187,phy:189,phy:191")),
 ("spinning", "Spinning and turning", {
   3: "Tops, wheels and merry-go-rounds; why a spinning top stays up.",
   5: "Turning forces (a longer spanner is easier); ice skaters spin faster with arms in; spinning planets."},
  [], L(pre=["motion/kinds-of-motion"], wide=["forces/simple-machines"], src="notes", notes="phy:188")),
 ("momentum", "Momentum and things that are conserved", {
   4: "Newton's cradle; a heavy truck is hard to stop.",
   5: "Momentum and energy are conserved; collisions; conservation laws as nature's bookkeeping (and Emmy Noether's symmetry idea)."},
  [], L(pre=["motion/newtons-laws"], wide=["energy/laws-of-energy"], src="notes", notes="phy:195,phy:196")),
 ("physics-of-sport", "Physics of sport and play", {
   3: "Bouncing balls, throwing, kicking, running on different ground.",
   5: "Best angle for a long throw (projectiles); spin on a cricket ball; friction in running shoes."},
  [], L(pre=["motion/kinds-of-motion"], math=["lines-angles/angles", "data/bar-charts"], src="notes", notes="phy:95,phy:98,phy:193")),
],
"energy": [
 ("stored-energy", "Stored energy", {
   3: "Energy waiting to be used: a stretched band, a ball held high, food, a battery.",
   5: "Potential energy and the forces behind it; energy stored in springs, height and chemicals."},
  [], L(pre=["energy/energy-around-us"], wide=["forces/stretching-springs"], src="notes", notes="phy:184")),
 ("heat-moves", "How heat moves", {
   3: "Heat moves from hot to cold; a metal spoon in hot tea gets hot.",
   5: "Conduction, convection and radiation; insulation; why the Sun's heat crosses empty space."},
  [], L(pre=["energy/heat"], src="notes", notes="phy:200")),
 ("work-and-power", "Work and power", {
   5: "Work is force times distance; power is how fast energy is used; watts on appliances."},
  [], L(pre=["energy/transfers"], math=["multiplication/multi-digit"], src="notes", notes="phy:194")),
 ("laws-of-energy", "The laws of energy (thermodynamics)", {
   5: "Energy is never made or destroyed; heat spreads out and things run down (entropy); things in contact reach the same temperature; absolute zero, the coldest possible."},
  [], L(pre=["energy/transfers"], wide=["order-chaos/entropy"], src="notes", notes="phy:204-208")),
 ("engines-and-fridges", "Engines and fridges", {
   4: "Engines turn heat into movement; fridges push heat out.",
   5: "How a steam engine and a fridge work; why no engine can use all its heat."},
  [], L(pre=["energy/heat-moves"], src="notes", notes="phy:209")),
 ("e-mc2", "Mass is energy: E = mc²", {
   5: "A little mass holds a huge amount of energy; how the Sun shines; Einstein's most famous idea."},
  [], L(pre=["energy/transfers"], wide=["the-very-small/nucleus"], src="notes", notes="phy:216")),
],
"electricity": [
 ("current-and-resistance", "Current, voltage and resistance", {
   5: "Current as a flow, voltage as a push, resistance as a narrow pipe; Ohm's law in words; current splits and joins at junctions (Kirchhoff)."},
  [], L(pre=["electricity/circuits"], math=["multiplication/multiplication-facts"], src="notes", notes="phy:231-233")),
 ("storing-charge", "Storing charge", {
   5: "Capacitors and the Leyden jar; how a camera flash stores energy."},
  [], L(pre=["electricity/static-and-charge"], src="notes", notes="phy:229")),
 ("special-materials", "Semiconductors, superconductors and nano-materials", {
   5: "Materials that conduct sometimes (semiconductors) make computer chips; superconductors with zero resistance; graphene and nanomaterials; quantum effects in materials."},
  [], L(pre=["electricity/conductors-and-insulators"], src="notes", notes="phy:220,phy:285,phy:287,phy:288,phy:290-292,chem:18,chem:64,chem:80,chem:97,chem:119-122")),
],
"magnets": [
 ("electromagnets", "Electricity makes magnets", {
   4: "Wrap a wire round a nail, connect a battery: an electromagnet.",
   5: "Current makes a magnetic field; motors turn because of it (Lorentz force); Ampère and Ørsted."},
  [], L(pre=["magnets/poles", "electricity/circuits"], src="notes", notes="phy:235-237")),
 ("electricity-from-magnets", "Magnets make electricity", {
   4: "A bicycle dynamo lights a lamp; moving magnets make current.",
   5: "Electromagnetic induction (Faraday); generators in power stations; Lenz's law in simple words."},
  [], L(pre=["magnets/electromagnets"], wide=["energy/sources-and-saving"], src="notes", notes="phy:223,phy:238-240")),
],
"light": [
 ("what-is-light", "What is light?", {
   3: "Light travels very fast (it reaches us from the Sun in 8 minutes).",
   5: "Light as a wave and as particles (photons); light is an electromagnetic wave (Maxwell); nothing is faster than light."},
  [], L(pre=["light/light-sources"], deep=["the-very-small/light-as-particles"], src="notes", notes="phy:153-155,phy:241")),
 ("refraction", "Bending light: lenses and magnifiers", {
   3: "A pencil looks broken in water; magnifying glasses make things look big.",
   5: "Refraction; lenses in eyes, glasses, microscopes and telescopes; mirages."},
  [], L(pre=["light/how-we-see"], wide=["light/colour"], src="notes", notes="phy:156,phy:165,phy:300")),
 ("invisible-light", "Invisible light: X-rays, UV, infrared, radio", {
   4: "Light we can't see: warm infrared, sunburning ultraviolet, X-rays that see bones.",
   5: "The electromagnetic spectrum from radio to gamma rays; telescopes that see invisible light."},
  [], L(pre=["light/what-is-light"], src="notes", notes="phy:128,phy:224")),
 ("light-fingerprints", "Light fingerprints: what stars are made of", {
   5: "Every element glows its own colours (spectra); flame tests; how we know what the Sun and stars are made of (Cecilia Payne)."},
  [], L(pre=["light/colour"], wide=["chemistry-detectives/finding-out-whats-inside"], src="notes", notes="phy:125,phy:129")),
 ("light-tricks", "Light as a wave: rainbows on CDs and holograms", {
   5: "Diffraction (rainbows on a CD, a feather held to a lamp); interference; holograms."},
  [], L(pre=["light/what-is-light"], src="notes", notes="phy:157,phy:162")),
 ("lasers", "Lasers", {
   4: "A laser is light of one colour marching in step; lasers in shops, surgery and music.",
   5: "How lasers and masers work; their uses in medicine, industry and war."},
  [], L(pre=["light/what-is-light"], src="notes", notes="phy:130,phy:169")),
 ("living-light", "Living light: glowing creatures", {
   3: "Fireflies, glowing mushrooms and deep-sea fish make their own light.",
   5: "Bioluminescence and fluorescence; why animals glow."},
  [], L(wide=["habitats/water-habitats"], src="notes", notes="phy:166")),
 ("light-carries-messages", "Light carries messages", {
   4: "Signal lamps and optical fibres; the internet travels as light.",
   5: "Optical fibres and photonics; how a phone call crosses oceans."},
  [], L(pre=["light/refraction"], src="notes", notes="phy:168")),
],
"sound": [
 ("waves", "Waves", {
   3: "Ripples in water, a slinky, a Mexican wave: energy moves, the water stays.",
   5: "Wavelength, frequency and speed; sound, light and water waves compared."},
  [], L(wide=["sound/vibration"], math=["multiplication/multiplication-facts"], src="notes", notes="phy:132-134")),
 ("doppler-and-shock", "The Doppler effect and sonic booms", {
   4: "An ambulance siren sounds higher coming towards you and lower going away.",
   5: "The Doppler effect explained; sonic booms when planes beat the speed of sound."},
  [], L(pre=["sound/sound-moves"], src="notes", notes="phy:143,phy:146")),
 ("adding-waves", "When waves meet", {
   5: "Waves add and cancel (noise-cancelling headphones); standing waves on a guitar string; beats when two notes are close; every sound is a mix of pure tones (Fourier)."},
  [], L(pre=["sound/volume-and-pitch"], wide=["sound/music"], src="notes", notes="phy:147-150")),
],
"sky": [
 ("stargazing", "Stargazing", {
   1: "Looking at the night sky: Moon, bright stars, planets.",
   3: "Constellations and the stories cultures tell about them; nakshatras.",
   5: "Naked-eye astronomy: finding planets, watching eclipses safely, meteor showers."},
  [], L(wide=["sky/sun-moon-stars"], src="notes", notes="phy:41")),
 ("history-of-astronomy", "How people learned about the sky", {
   3: "Babylonian, Greek, Indian (Jyotisha), Chinese and Maya sky-watchers; calendars from the sky.",
   5: "From Aryabhata's spinning Earth to Copernicus, Galileo and Kepler; whose ideas were ignored, and why."},
  [], L(wide=["how-we-know/stories-of-discovery"], src="notes", notes="phy:40")),
 ("the-sun", "Our Sun", {
   3: "The Sun is a star; it gives us light and warmth; never look straight at it.",
   5: "Inside the Sun: fusion in the core, sunspots, solar flares and the 11-year cycle."},
  [], L(pre=["sky/sun-moon-stars"], wide=["energy/e-mc2"], src="notes", notes="phy:62")),
 ("birth-of-solar-system", "How the solar system was born", {
   4: "A spinning cloud of gas and dust became the Sun and planets.",
   5: "The nebular theory; why rocky planets are close to the Sun and gas giants far away."},
  [], L(pre=["sky/solar-system"], src="notes", notes="phy:44")),
 ("moons-asteroids-comets", "Moons, asteroids and comets", {
   3: "Other planets have moons; shooting stars are space dust burning up.",
   5: "Titan, Europa and Ganymede; asteroids, comets and meteoroids; the asteroid that ended the dinosaurs."},
  [], L(pre=["sky/solar-system"], src="notes", notes="phy:46,phy:47")),
 ("other-worlds", "Other worlds", {
   4: "Planets around other stars; what makes a planet good for life (the Goldilocks zone).",
   5: "Exoplanets, their atmospheres; liquid water and magnetic fields; Mars and Venus as warnings."},
  [], L(pre=["sky/solar-system"], deep=["sky/life-beyond-earth"], src="notes", notes="phy:50,phy:51,phy:83")),
 ("life-beyond-earth", "Is there life beyond Earth?", {
   3: "Could aliens exist? Tiny creatures that live in boiling water and ice.",
   5: "Astrobiology: extremophiles, signs of life we look for (biosignatures), where life might be (Europa, Enceladus, exoplanets)."},
  [], L(pre=["what-is-life/signs-of-life"], wide=["sky/other-worlds"], src="notes", notes="bio:258,bio:287-291")),
],
"weather": [
 ("forecasting", "Forecasting the weather", {
   3: "Weather signs and sayings; making a weather forecast.",
   5: "Satellites, weather balloons and computer models; why forecasts are sometimes wrong (chaos)."},
  [], L(pre=["weather/weather"], wide=["order-chaos/order-and-chaos"], src="notes", notes="phy:81")),
 ("monsoon-and-oceans", "The monsoon and the oceans", {
   4: "The monsoon: winds from the sea bring rain to India.",
   5: "How oceans and air work together: El Niño and La Niña; why some monsoons fail."},
  [], L(pre=["weather/wind-and-air"], src="notes", notes="phy:74,bio:63")),
 ("ice-ages", "Ice ages and Earth's long cycles", {
   5: "Ice ages and warm ages; slow wobbles in Earth's orbit (Milankovitch cycles); how ice cores tell the past."},
  [], L(pre=["day-night-seasons/seasons"], wide=["weather/climate-change"], src="notes", notes="phy:72,phy:76")),
 ("climate-science", "How scientists study climate", {
   5: "Climate feedbacks (melting ice reflects less sunlight); climate models and predictions; geoengineering ideas and their risks."},
  [], L(pre=["weather/climate-change"], math=["data/line-graphs"], src="notes", notes="phy:75,phy:79,phy:82")),
],
"story-of-universe": [
 ("galaxies", "Galaxies", {
   3: "Galaxies are cities of stars; our Milky Way.",
   5: "Spiral, elliptical and irregular galaxies; star nurseries; quasars and active galaxies; galaxy groups and clusters; the cosmic web of filaments and voids."},
  [], L(pre=["sky/sun-moon-stars"], wide=["sky/stars-and-galaxies"], src="notes", notes="phy:31,phy:35-38,phy:61")),
 ("big-bang", "The Big Bang", {
   4: "The universe was once tiny and hot and has been growing for 13.8 billion years.",
   5: "Evidence: the expanding universe (Hubble's law), the leftover glow (cosmic microwave background), light elements made in the first minutes; inflation; what came before is unknown."},
  [], L(pre=["story-of-universe/galaxies-and-big-bang"], math=["number-sense/big-numbers"], src="notes", notes="phy:3,phy:32,phy:33,phy:52-54,phy:57")),
 ("dark-matter-and-energy", "Dark matter and dark energy", {
   5: "Galaxies spin too fast for what we see (Vera Rubin); most of the universe is dark matter and dark energy, and nobody knows what they are."},
  [], L(pre=["story-of-universe/galaxies"], src="notes", notes="phy:39,phy:55,phy:284")),
 ("black-holes", "Black holes", {
   3: "Places where gravity is so strong not even light escapes.",
   5: "How black holes form from big stars; the first photo of a black hole; Chandrasekhar's limit."},
  [], L(pre=["gravity/falling"], wide=["gravity/spacetime"], src="notes", notes="phy:48")),
 ("fate-of-universe", "How will the universe end? Other universes?", {
   5: "Heat death, big rip or a bounce; multiverse ideas as speculation; questions science may never answer."},
  [], L(pre=["story-of-universe/big-bang"], wide=["order-chaos/entropy"], src="notes", notes="phy:56,phy:58")),
],
"the-very-small": [
 ("inside-the-atom", "Inside the atom", {
   4: "Atoms have a centre (nucleus) with electrons around it; how scientists found out (Thomson, Rutherford).",
   5: "Atomic models through history (Dalton, Thomson, Rutherford, Bohr, quantum); electron shells; why some atoms grab electrons and others give them away."},
  [], L(pre=["the-very-small/atoms"], deep=["the-very-small/nucleus"], src="notes", notes="phy:118,phy:119,phy:123,phy:127,chem:3,chem:7-11,chem:159-166,chem:173-175")),
 ("molecules", "Molecules", {
   4: "Atoms join to make molecules: water is two hydrogens and an oxygen; building models with clay balls.",
   5: "Shapes of molecules; how molecules bump and react."},
  [], L(pre=["the-very-small/atoms"], wide=["chemistry/bonds"], src="notes", notes="phy:120-122")),
 ("antimatter", "Antimatter", {
   5: "Every particle has an opposite twin; when they meet, both vanish in a flash of energy; why is there more matter than antimatter? (unknown)."},
  [], L(pre=["the-very-small/inside-the-atom"], src="notes", notes="phy:16")),
 ("nucleus", "The nucleus: radioactivity, fission and fusion", {
   4: "Some atoms are unstable and give off radiation (Marie Curie); splitting atoms releases energy.",
   5: "Binding energy, alpha, beta and gamma decay, half-life; fission in power stations, fusion in stars; nuclear medicine; nuclear waste."},
  [], L(pre=["the-very-small/inside-the-atom"], wide=["energy/e-mc2"], src="notes", notes="phy:263-273,chem:65,chem:101,chem:167-170")),
 ("light-as-particles", "Light comes in packets", {
   5: "The birth of quantum physics: glowing hot objects (Planck), light knocking out electrons (Einstein), light bouncing like a ball (Compton)."},
  [], L(pre=["light/what-is-light"], deep=["the-very-small/quantum"], src="notes", notes="phy:245-248")),
 ("waves-of-matter", "Particles that behave like waves", {
   5: "The double-slit experiment; electrons as waves (de Broglie); a wave of possibilities (Schrödinger, and his cat); the uncertainty principle; tunnelling through walls; why nobody fully understands it."},
  [], L(pre=["the-very-small/light-as-particles"], wide=["order-chaos/chance"], src="notes", notes="phy:249-257,chem:9,chem:10")),
 ("particle-zoo", "The particle zoo", {
   5: "The Standard Model: quarks, electrons, neutrinos and force carriers; the Higgs boson; particle colliders; fields as the real stuff of the universe."},
  [], L(pre=["the-very-small/inside-the-atom"], src="notes", notes="phy:124,phy:262,phy:274-280")),
 ("unfinished-theories", "Unfinished theories", {
   5: "What physics hasn't solved: joining gravity and quantum physics, string theory, supersymmetry; honest unknowns."},
  [], L(pre=["the-very-small/particle-zoo"], wide=["story-of-universe/dark-matter-and-energy"], src="notes", notes="phy:23,phy:281-283")),
],
"order-chaos": [
 ("zero-sum", "Zero-sum and win-win", {
   4: "Games where one wins only if another loses, and games where everyone can win; does nature balance everything out?"},
  [], L(wide=["animal-behaviour/animal-societies"], src="notes", notes="phy:22")),
 ("counting-ways", "Why messy wins: counting the ways", {
   5: "There are far more messy arrangements than tidy ones; that's why things mix and never unmix (microstates, Boltzmann); a shuffled deck."},
  [], L(pre=["order-chaos/entropy"], math=["logic/counting-ways"], src="notes", notes="phy:212-215,chem:73")),
],
}

TOPICS = [
("chemistry", "Chemistry: elements, bonds and reactions", "Matter", [
 ("elements", "Elements: the building blocks", {
   2: "Some substances are made of just one kind of atom: gold, iron, oxygen.",
   4: "There are 118 elements; elements in your body (oxygen, carbon, hydrogen); metals and non-metals.",
   5: "The periodic table as a map: rows and columns, families of elements that behave alike (reactive alkali metals, unreactive noble gases); Mendeleev's gaps."},
  [], L(pre=["materials/what-is-it-made-of"], deep=["chemistry/bonds"], src="notes", notes="chem:4,chem:44,chem:115,chem:171,chem:172,chem:176-179,bio:33")),
 ("names-and-formulas", "Chemical names and formulas", {
   4: "H₂O, CO₂, NaCl: formulas say which atoms and how many.",
   5: "Naming compounds; ions; why chemists need one shared language."},
  [], L(pre=["chemistry/elements"], src="notes", notes="chem:5")),
 ("metals-and-colours", "Metals, colours and special compounds", {
   5: "Why copper sulphate is blue and rubies are red (metal atoms in compounds); metals in our blood and in leaves (haemoglobin, chlorophyll); molecule-sized magnets."},
  [], L(pre=["chemistry/elements"], wide=["light/colour"], src="notes", notes="chem:43,chem:45,chem:46,chem:78-82,chem:113,chem:114,chem:116")),
 ("bonds", "How atoms hold on: bonds", {
   3: "Atoms hold hands to make everything around us.",
   4: "Salt, water and metals hold together in different ways (ionic, covalent, metallic).",
   5: "Shapes of molecules (build them with marshmallows); why water sticks to itself (hydrogen bonds); weak pulls between molecules."},
  [], L(pre=["the-very-small/atoms"], wide=["the-very-small/molecules"], src="notes", notes="chem:12-15,chem:48,chem:180-189,bio:34")),
 ("kinds-of-reactions", "Kinds of chemical reactions", {
   4: "Joining, splitting, swapping and burning; milk and lemon make curds (precipitation).",
   5: "Combination, decomposition, displacement; oxidation and reduction (rusting, burning)."},
  [], L(pre=["changes/chemical-reactions"], src="notes", notes="chem:20,chem:200-203")),
 ("counting-atoms", "Counting atoms: balancing reactions", {
   5: "Atoms are never lost in a reaction: balancing like a recipe; the mole as a chemist's 'dozen'; how strong a solution is (concentration, parts per million)."},
  [], L(pre=["chemistry/kinds-of-reactions"], math=["multiplication/multiplication-facts", "fractions/ratio-and-proportion"], src="notes", notes="chem:6,chem:190,chem:194-199")),
 ("reaction-energy", "Reactions that give heat and take heat", {
   4: "Hand-warmers get hot, instant ice packs get cold.",
   5: "Exothermic and endothermic reactions; bond energy; why some reactions happen by themselves and others need a push (free energy)."},
  [], L(pre=["chemistry/kinds-of-reactions"], wide=["energy/laws-of-energy"], src="notes", notes="chem:21-26,chem:72,chem:74,chem:204-207,chem:215")),
 ("reaction-speed", "Fast and slow reactions; catalysts", {
   3: "Some changes are fast (fireworks), some slow (rusting).",
   4: "Heat, stirring and small pieces speed reactions up; catalysts help without being used up.",
   5: "Collisions and activation energy; enzymes as living catalysts; light-driven reactions; filming reactions in a millionth of a billionth of a second."},
  [], L(pre=["changes/reversible-and-irreversible"], wide=["changes/chemical-reactions", "life-chemistry/enzymes"], src="notes", notes="chem:27-30,chem:77,chem:95,chem:109,chem:110,chem:117,chem:125,chem:208-211")),
 ("equilibrium", "Reactions that go both ways", {
   5: "Some reactions run forwards and backwards at once; nature's see-saw (Le Chatelier); dissolving until no more will dissolve."},
  [], L(pre=["chemistry/reaction-speed"], src="notes", notes="chem:31,chem:32,chem:34,chem:212-214")),
 ("acids-and-bases", "Acids and bases", {
   3: "Sour things (lemon, vinegar) and soapy things; red cabbage changes colour.",
   4: "Indicators and the pH scale; acids in our stomach; neutralising (antacids).",
   5: "Strong and weak acids; buffers that keep our blood steady; what acids and bases really are."},
  [], L(pre=["materials/properties"], wide=["changes/chemical-reactions"], math=["number-sense/comparing-ordering"], src="notes", notes="chem:33,chem:216-219")),
 ("electrochemistry", "Batteries, electrolysis and rust", {
   4: "A lemon battery; splitting water with electricity; why iron rusts.",
   5: "Cells and batteries (lithium-ion); electroplating; stopping corrosion; Volta and Faraday."},
  [], L(pre=["electricity/circuits"], wide=["chemistry/kinds-of-reactions"], src="notes", notes="chem:35-38,chem:90,chem:105,chem:106,chem:112,chem:220-222")),
 ("carbon-chemistry", "Carbon, the builder: organic chemistry", {
   4: "Carbon makes chains and rings: the backbone of fuels, sugars, plastics and living things.",
   5: "Families of carbon molecules (alcohols, acids); left- and right-handed molecules; chemists as molecule builders following recipes (named reactions)."},
  [], L(pre=["chemistry/bonds"], deep=["chemistry/polymers"], src="notes", notes="chem:47,chem:49-52,chem:79,chem:83-88")),
 ("polymers", "Polymers: long-chain molecules", {
   3: "Plastic, rubber, silk and wool are made of very long molecules; making slime.",
   5: "Natural and synthetic polymers; molecules that build themselves (supramolecular); new materials; plastics and the planet."},
  [], L(pre=["materials/properties"], wide=["chemistry/carbon-chemistry", "waste/reduce-reuse-recycle"], src="notes", notes="chem:55,chem:68,chem:103,chem:118")),
 ("chemistry-in-industry", "Chemistry that feeds and builds the world", {
   4: "Fertilisers, medicines, fuels and paints all come from chemistry.",
   5: "Making ammonia from air (Haber–Bosch) fed billions and also made weapons; petrochemicals; medicines by design; explosives and fireworks; green chemistry that wastes less."},
  [], L(pre=["chemistry/kinds-of-reactions"], wide=["how-we-know/science-and-right-wrong"], src="notes", notes="chem:61,chem:63,chem:67,chem:69,chem:94,chem:96,chem:98,chem:102,chem:104,chem:108,chem:111")),
 ("chemistry-of-earth-and-space", "Chemistry of air, water, soil and space", {
   4: "What is in air, sea water and soil; acid rain.",
   5: "Molecules floating between stars; elements made in stars; isotopes that tell Earth's age; chemistry of the oceans and atmosphere."},
  [], L(pre=["chemistry/elements"], wide=["environment/pollution"], src="notes", notes="chem:62,chem:70,chem:100,chem:134")),
 ("computers-and-chemistry", "Chemistry on computers", {
   5: "Modelling molecules on computers; AI that designs new medicines and materials; materials for quantum computers; molecules that copy themselves."},
  [], L(pre=["chemistry/bonds"], src="notes", notes="chem:66,chem:71,chem:75,chem:99,chem:123,chem:126,chem:127,chem:133,chem:136,chem:137")),
]),
("chemistry-detectives", "Chemistry detectives: finding out what things are made of", "Matter", [
 ("finding-out-whats-inside", "How chemists find out what's inside", {
   3: "Separating felt-pen ink with paper and water (chromatography); flame colours.",
   5: "Weighing and measuring to identify substances; spectroscopy, mass spectrometry, X-rays and electron microscopes as chemists' eyes."},
  [], L(pre=["states/dissolving"], wide=["light/light-fingerprints"], src="notes", notes="chem:53,chem:56-60,chem:76,chem:89,chem:91-93,chem:124,chem:128-132")),
]),
("life-chemistry", "The chemistry of life", "Life", [
 ("molecules-of-life", "The molecules of life", {
   4: "Sugars, fats and proteins in food; testing foods for starch with iodine.",
   5: "Carbohydrates, lipids, proteins and nucleic acids: what each does in a living thing."},
  [], L(pre=["food/nutrients"], wide=["chemistry/carbon-chemistry"], src="notes", notes="bio:32,bio:36-40,chem:54")),
 ("enzymes", "Enzymes: life's helpers", {
   4: "Saliva breaks starch into sugar (chewing bread until it tastes sweet).",
   5: "Enzymes speed up reactions in the body; heat can ruin them; enzymes in washing powder and cheese-making."},
  [], L(pre=["life-chemistry/molecules-of-life"], wide=["chemistry/reaction-speed"], src="notes", notes="bio:41")),
 ("energy-currency", "Energy currency of the cell", {
   5: "Cells store energy in a small molecule (ATP) like coins to spend; breathing turns food into ATP."},
  [], L(pre=["life-chemistry/molecules-of-life"], wide=["body/energy-from-food"], src="notes", notes="bio:42")),
]),
("genetics", "Genes and DNA", "Life", [
 ("dna-and-rna", "DNA and RNA: the instructions of life", {
   3: "Every living thing carries instructions that make it what it is.",
   4: "DNA is a long twisted ladder of four letters; Rosalind Franklin's photo.",
   5: "How DNA copies itself; RNA carries messages; the code that turns instructions into proteins."},
  [], L(pre=["evolution/inheritance"], deep=["genetics/genes-switch"], src="notes", notes="bio:44,bio:162-165")),
 ("genes-switch", "Genes that switch on and off", {
   5: "Every cell has the same DNA but uses different parts; genes switched by food, stress and environment (epigenetics) and whether those marks pass to children (debated)."},
  [], L(pre=["genetics/dna-and-rna"], src="notes", notes="bio:139,bio:166,bio:168")),
 ("mutations", "Mutations: changes in DNA", {
   5: "Copying mistakes and damage; most are harmless, some cause illness, some help evolution; cells that repair DNA."},
  [], L(pre=["genetics/dna-and-rna"], wide=["evolution/natural-selection"], src="notes", notes="bio:167")),
 ("reading-genomes", "Reading genomes and DNA detectives", {
   4: "DNA fingerprinting solves crimes and finds relatives.",
   5: "Reading whole genomes; computers that compare DNA (bioinformatics); ancient DNA from bones."},
  [], L(pre=["genetics/dna-and-rna"], wide=["hist:how-we-know-history/ancient-dna"], src="notes", notes="bio:169,bio:232,bio:233,bio:255")),
]),
("animal-behaviour", "Animal behaviour", "Life", [
 ("born-knowing", "Born knowing and learning", {
   2: "Some things animals know at birth (a spider spins a web), some they learn.",
   4: "Instincts, reflexes and fixed patterns; ducklings that follow the first thing they see (imprinting, Konrad Lorenz).",
   5: "Getting used to things (habituation); innate vs learned behaviour."},
  [], L(pre=["animals/animals-around-us"], deep=["animal-behaviour/animal-learning"], src="notes", notes="bio:92-98")),
 ("animal-learning", "How animals learn", {
   3: "Dogs learn tricks; crows solve puzzles; chimps use tools.",
   5: "Learning by reward (Skinner), by signals (Pavlov's dogs), by copying; problem-solving in animals."},
  [], L(pre=["animal-behaviour/born-knowing"], wide=["animals/animal-minds"], src="notes", notes="bio:99-103")),
 ("animal-communication", "How animals talk", {
   2: "Birdsong, dog barks, cat purrs: animals send messages.",
   4: "Smells (pheromones), colours and dances, calls and songs, touch; bats and dolphins that see with sound.",
   5: "The bee waggle dance; do apes and whales have language?"},
  [], L(pre=["animals/animals-around-us"], src="notes", notes="bio:105-110")),
 ("animal-societies", "Animal societies", {
   3: "Elephant herds led by grandmothers; ant colonies; wolf packs.",
   5: "Territories, pecking orders, helping relatives, cooperation and trust; game theory in nature (hawks and doves)."},
  [], L(pre=["animal-behaviour/animal-communication"], wide=["ecology/interdependence"], src="notes", notes="bio:111-116,bio:224")),
 ("foraging-and-survival", "Finding food and staying alive", {
   3: "How animals hunt, graze and hide.",
   5: "Choosing where to feed (optimal foraging); predator and prey tricks; mimicry."},
  [], L(wide=["habitats/adaptations"], src="notes", notes="bio:122,bio:123")),
 ("migration", "Migration and navigation", {
   3: "Birds, whales and butterflies that travel across the world every year.",
   5: "How animals find their way: the Sun, the stars and the Earth's magnetism."},
  [], L(wide=["magnets/compass-and-earth", "day-night-seasons/seasons"], src="notes", notes="bio:126-128")),
]),
("frontiers", "Frontiers of biology", "Life", [
 ("gene-editing", "Changing genes: biotechnology", {
   4: "Scientists can change genes in plants and animals; glowing fish and pest-proof crops.",
   5: "CRISPR in simple words; GM crops and the debate; cloning; who decides what is allowed?"},
  [], L(pre=["genetics/dna-and-rna"], wide=["how-we-know/science-and-right-wrong"], src="notes", notes="bio:170,bio:227-229,bio:259,bio:262")),
 ("medicine-of-tomorrow", "Medicine of tomorrow", {
   4: "Vaccines, new organs and repairing bodies.",
   5: "Gene therapy, stem cell therapy, regenerative medicine, cancer in simple words, medicines matched to your genes."},
  [], L(pre=["body/immune-system"], src="notes", notes="bio:230,bio:281-286")),
 ("synthetic-life", "Building life: synthetic biology", {
   5: "Making the smallest possible living cell; storing books in DNA; biosensors, biofuels and bioreactors; artificial life on computers; should we make new life?"},
  [], L(pre=["genetics/dna-and-rna"], wide=["what-is-life/edge-of-life"], src="notes", notes="bio:136-138,bio:142-148")),
 ("life-as-a-system", "Life as a system", {
   5: "Feedback loops and networks in living things; how proteins fold; mechanics of cells; why life is more than its parts (emergence)."},
  [], L(pre=["body/keeping-balance"], wide=["order-chaos/order-and-chaos"], src="notes", notes="bio:254,bio:256,bio:257,bio:311")),
 ("human-enhancement", "Should humans upgrade themselves?", {
   5: "Glasses, pacemakers, brain chips and gene changes: where does fixing end and 'upgrading' begin? (a debate)."},
  [], L(wide=["mind/brains-and-computers"], src="notes", notes="bio:140")),
]),
]
