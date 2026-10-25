"""DeepKids Combined Science: topics -> subtopics -> levels (L1-L5, level n is taught in Class n).

Each subtopic: (id, name, {level: what this level covers}, board chapters, links)
  board chapters: keys of the board chapters/topics it covers, e.g. N3-4 (NCERT Class 3 Ch 4),
                  C2-1.3 (Cambridge Stage 2 topic 1.3), O5-7 (NIOS Level B lesson 7). A chapter key is
                  placed on this subtopic's level that matches its class.
  links: pre = prerequisite subtopics, deep = go-deeper subtopics, wide = go-wider subtopics,
         math = maths subtopics it uses (ids in math_map.py), src = where the subtopic comes from
         when no board teaches it ("notes" = the founder's notebook sheets, "dk" = DeepKids).
Cross-references are "topic/subtopic". Levels are matched automatically (see build.py).
"""
L = lambda **k: k

TOPICS = [
# ======================= LIFE =======================
("what-is-life", "What is life?", "Life", [
 ("signs-of-life", "Living and non-living: signs of life", {
   1: "Things that are alive, things that never were, things that once were; living things eat, grow, move, breathe and have young.",
   2: "The seven life processes in simple words; plants are alive even though they seem still; sorting tricky cases.",
   3: "Life processes named (nutrition, growth, movement, reproduction, sensing, respiration, excretion); testing each on a seed, a cloud, a car.",
   4: "Why the definition is hard: fire 'eats' and 'grows', crystals grow, seeds sleep for centuries; scientists' working definitions."},
  ["C1-1.1", "C3-3.1", "C3-3.2", "C3-3.3", "O3-4"], L(wide=["animals/animals-around-us", "plants/plant-parts"], deep=["what-is-life/edge-of-life"])),
 ("edge-of-life", "The edge of life: viruses, seeds, fire", {
   3: "Puzzle cases: dormant seeds, tardigrades that dry out and revive, fire; is there a clear line between alive and not?",
   5: "Viruses as the great debate (alive or not?); NASA's definition of life; life that might be very different on other worlds."},
  [], L(pre=["what-is-life/signs-of-life"], deep=["microorganisms/microbes-everywhere", "how-we-know/questioning-evidence"], src="notes")),
 ("cells", "Cells: what living things are made of", {
   3: "All living things are built from tiny living units called cells; seeing onion skin and cheek cells with a magnifier or microscope.",
   4: "Cell parts in simple words (membrane, nucleus, cytoplasm); plant vs animal cells; single-celled life.",
   5: "Trillions of cells in you, each alive; cells divide to grow; you also carry as many microbe cells as your own."},
  [], L(pre=["what-is-life/signs-of-life"], deep=["evolution/story-of-life", "the-very-small/atoms"], math=["number-sense/big-numbers"], src="notes")),
]),
("plants", "Plants", "Life", [
 ("plant-parts", "Parts of a plant and their jobs", {
   1: "Roots, stem, leaves, flowers, fruits and seeds; what each part does for the plant.",
   2: "Comparing parts of different plants (cactus, lotus, banyan); edible parts of plants we eat.",
   3: "How each part's shape suits its job; roots that store food, stems that climb, leaves that catch light."},
  ["C1-2.1", "C3-1.1", "N3-4"], L(wide=["plants/what-plants-need", "food/where-food-comes-from"], deep=["plants/water-transport"])),
 ("what-plants-need", "What plants need to live and grow", {
   1: "Plants need light and water; watching a plant in the dark and one in the light.",
   2: "Light, water, air, warmth and soil; plants turn towards light.",
   3: "Fair tests of light, water and temperature on plant growth; measuring and recording growth."},
  ["C1-2.3", "C3-1.2", "C3-1.4"], L(pre=["plants/plant-parts"], deep=["plants/photosynthesis"], math=["measurement-basics/standard-units", "data/bar-charts"])),
 ("water-transport", "How water travels through a plant", {
   3: "Water goes up from roots through the stem to the leaves; the coloured-water celery experiment.",
   4: "Leaves let water out (transpiration); plants pull water up like a straw; trees lifting water many metres."},
  ["C3-1.3"], L(pre=["plants/plant-parts"], wide=["water/water-cycle"], deep=["plants/photosynthesis"])),
 ("photosynthesis", "Food from light: photosynthesis", {
   3: "Green leaves make the plant's food using sunlight, air and water; a tree is built mostly from air.",
   4: "Carbon dioxide in, oxygen out; why plants and animals need each other's 'breath'.",
   5: "Chlorophyll, starch test on a leaf; how almost all food on Earth starts with sunlight caught by plants."},
  [], L(pre=["plants/what-plants-need"], deep=["ecology/food-chains", "energy/energy-in-living-things"], wide=["air/air-around-us"], src="dk")),
 ("plant-senses", "Plants sense and respond", {
   2: "Plants turn to light, roots grow down, touch-me-not folds its leaves.",
   4: "Plants respond to touch, gravity, light and damage; J.C. Bose's instruments that recorded plant responses.",
   5: "Plant signalling through roots and fungi; the open debate: can plants feel, learn or remember?"},
  [], L(pre=["plants/plant-parts"], deep=["mind/thinking-without-brains"], wide=["senses/five-senses"], src="notes")),
 ("plant-variety", "Kinds of plants and their uses", {
   3: "Trees, shrubs, herbs, climbers, creepers; plants around us and how people use them (food, medicine, shade, wood).",
   4: "Unique trees and flowers of India; medicinal plants and traditional knowledge; caring for plants.",
   5: "Flowering and non-flowering plants (ferns, mosses, conifers); how plants are grouped."},
  ["N3-4", "N4-4", "C5-1.1"], L(wide=["classification/sorting-living-things"], deep=["evolution/story-of-life"])),
]),
("seeds-and-life-cycles", "Seeds, growth and life cycles of plants", "Life", [
 ("seeds-and-germination", "Seeds and how they sprout", {
   1: "Seeds grow into new plants; planting and watching seeds sprout.",
   3: "What a seed needs to germinate (water, warmth, air); inside a seed: baby plant and food store.",
   5: "Germination investigations; dormancy and seeds that wait for years; seed banks."},
  ["C1-2.2", "C5-1.4"], L(pre=["plants/what-plants-need"], deep=["seeds-and-life-cycles/plant-life-cycle"], math=["data/bar-charts", "time/duration"])),
 ("plant-life-cycle", "The life cycle of a flowering plant", {
   3: "Seed → seedling → adult plant → flower → fruit → seed; plants we can watch through a cycle.",
   5: "Life cycle stages named; annuals and perennials; how long different plants live."},
  ["C5-1.1"], L(pre=["seeds-and-life-cycles/seeds-and-germination"], wide=["animals/animal-life-cycles"], deep=["seeds-and-life-cycles/pollination"])),
 ("pollination", "Flowers, pollination and fruits", {
   4: "Flowers make seeds; insects, birds and wind carry pollen; bees and flowers need each other.",
   5: "Parts of a flower (petal, stamen, carpel); pollination and fertilisation; fruit forms from the flower."},
  ["C5-1.2"], L(pre=["plants/plant-parts"], wide=["ecology/interdependence", "animals/insects"], deep=["seeds-and-life-cycles/seed-dispersal"])),
 ("seed-dispersal", "How seeds travel", {
   4: "Seeds spread by wind, water, animals and bursting pods; why plants send seeds far away.",
   5: "Designing seeds that fly (helicopter seeds); seed shape and travel; people as seed carriers and savers."},
  ["C5-1.3"], L(pre=["seeds-and-life-cycles/pollination"], math=["measurement-basics/standard-units"], wide=["forces/air-water-resistance"])),
]),
("animals", "Animals", "Life", [
 ("animals-around-us", "Animals around us", {
   1: "Animals at home, on the street, in the garden; what they eat, where they live, how they move.",
   2: "Comparing animals: body coverings, legs, wings, fins; pets and wild animals.",
   3: "Animal habits and homes; animals in Indian towns, villages and forests; watching an animal for a week."},
  ["N3-5", "C2-4.1"], L(wide=["habitats/habitats", "classification/sorting-living-things"], deep=["animals/animal-bodies"])),
 ("animal-babies", "Animal babies and growing up", {
   1: "Animals have young; baby animals and their parents; some look like their parents, some don't.",
   2: "How animals and humans grow and change; caring for young."},
  ["C1-1.3", "C2-4.2"], L(wide=["body/growing"], deep=["animals/animal-life-cycles", "evolution/inheritance"])),
 ("animal-life-cycles", "Animal life cycles", {
   3: "Life cycles of a frog, butterfly and hen; metamorphosis: a body that rebuilds itself.",
   4: "Comparing life cycles of mammals, birds, insects and amphibians; how long animals live.",
   5: "Strange life cycles (cicadas, salmon, the immortal jellyfish); why so many young in some species."},
  [], L(pre=["animals/animal-babies"], wide=["seeds-and-life-cycles/plant-life-cycle"], src="dk")),
 ("animal-bodies", "How animals move, eat and breathe", {
   2: "Legs, wings, fins and crawling; teeth and beaks for different foods.",
   3: "Breathing with lungs, gills and skin; how animals find food.",
   4: "Body parts matched to life: the camel, the woodpecker, the octopus."},
  [], L(pre=["animals/animals-around-us"], deep=["habitats/adaptations", "body/skeleton"], src="dk")),
 ("birds", "The world of birds", {
   1: "Birds around us: feathers, beaks, nests and songs; feeding birds.",
   4: "Beaks and feet for different foods; nests and migration; birds are living dinosaurs."},
  ["N4-3"], L(wide=["animals/animal-bodies"], deep=["evolution/fossils-and-extinction"], src="dk")),
 ("insects", "Insects and small creatures", {
   2: "Ants, bees, butterflies, spiders (not insects!) and worms in the garden; counting legs.",
   4: "Social insects: ant and bee colonies; insects as pollinators and recyclers."},
  [], L(wide=["animals/animals-around-us"], deep=["ecology/interdependence"], src="notes")),
 ("animal-minds", "Do animals think and feel?", {
   3: "Animals play, learn and remember; crows using tools, dogs reading faces.",
   5: "Animal emotions, communication (bee dances, elephant rumbles), the debate over animal consciousness."},
  [], L(pre=["animals/animals-around-us"], wide=["mind/thinking-and-memory"], deep=["what-is-real/other-minds"], src="notes")),
]),
("classification", "Sorting living things", "Life", [
 ("sorting-living-things", "Sorting and grouping living things", {
   1: "Sorting animals and plants by what we can see.",
   2: "Grouping animals by body covering, legs, food; similarities and differences.",
   3: "Sorting humans and other living things in more than one way; there is no single right way to sort.",
   4: "Vertebrates and invertebrates; mammals, birds, reptiles, amphibians and fish."},
  ["C2-4.1", "C3-3.4", "C3-3.5"], L(pre=["animals/animals-around-us"], math=["logic/sets-and-venn"], deep=["classification/keys-and-kingdoms"])),
 ("keys-and-kingdoms", "Keys and the kingdoms of life", {
   4: "Making and using a branching key with yes/no questions.",
   5: "The big groups of life: animals, plants, fungi, microbes; why scientists keep re-drawing the tree of life."},
  [], L(pre=["classification/sorting-living-things"], deep=["evolution/story-of-life"], math=["logic/if-then"], src="dk")),
]),
("habitats", "Habitats and adaptation", "Life", [
 ("local-environments", "Our local environment", {
   1: "Places near home where plants and animals live: park, pond, tree, under a stone."},
  ["C1-1.2"], L(deep=["habitats/habitats"])),
 ("habitats", "Habitats", {
   2: "What a habitat is; plants and animals in different habitats; rocks in the environment.",
   3: "Habitats near and far: pond, forest, desert, sea; what each provides.",
   4: "Different habitats of the world; microhabitats; how habitats change."},
  ["C2-1.1", "C2-1.2", "C2-1.3", "C4-4.4", "N3-5"], L(pre=["habitats/local-environments"], wide=["ecology/interdependence"], deep=["habitats/adaptations"])),
 ("adaptations", "Adaptation: suited to a place", {
   2: "Why a fish has fins and a camel has humps; animals and plants suited to where they live.",
   3: "Adaptations to heat, cold, water and darkness.",
   5: "Plants and animals adapted to environments; predators and prey; camouflage and warning colours."},
  ["C5-6.3", "C5-6.4"], L(pre=["habitats/habitats"], deep=["evolution/natural-selection"], wide=["animals/animal-bodies"])),
 ("lands-and-lives", "Different lands, different lives", {
   4: "Plains, deserts, coasts and mountains of India: how land shapes food, clothes, houses, plants and animals.",
   5: "Ecological regions of India; unique landscapes; rare and endemic species; traditional knowledge."},
  ["N4-9", "N5-6"], L(wide=["planet-earth/landforms", "india/states-and-features"], deep=["ecology/biodiversity"])),
 ("water-habitats", "Life in water", {
   3: "Ponds, rivers and seas as homes; fish, frogs, lotus and algae.",
   5: "Freshwater habitats; rivers supporting ecosystems; the deep sea and glowing creatures."},
  ["N5-1", "N5-2"], L(wide=["water/rivers"], deep=["ecology/food-chains"])),
]),
("ecology", "Living in harmony: the web of life", "Life", [
 ("interdependence", "Living things need each other", {
   3: "Plants and animals support each other; we are connected to life near and far; kindness to all beings.",
   4: "The web of life on a nature trail; nature and culture; sustainable living.",
   5: "Partnerships in nature: bees and flowers, fungi and roots, lichens; cooperation as well as competition."},
  ["N3-5", "N3-6", "N4-3", "N4-4"], L(wide=["habitats/habitats"], deep=["ecology/food-chains"])),
 ("food-chains", "Food chains and food webs", {
   3: "Who eats whom: simple food chains starting with plants.",
   4: "Energy passes along a food chain; producers, consumers, decomposers.",
   5: "Food webs; natural balance; what happens when one link disappears."},
  ["O3-5", "O5-7", "C4-2.4"], L(pre=["plants/photosynthesis", "animals/animals-around-us"], deep=["energy/energy-in-living-things", "ecology/cycles-and-decomposers"])),
 ("cycles-and-decomposers", "Decomposers and nature's recycling", {
   3: "Worms, fungi and microbes break down dead things into soil.",
   5: "Nothing is wasted in nature: carbon and nitrogen cycles in simple words; compost."},
  [], L(pre=["ecology/food-chains"], wide=["waste/compost-and-disposal", "microorganisms/helpful-microbes"], src="dk")),
 ("biodiversity", "Biodiversity and protecting it", {
   4: "The variety of life; endangered animals of India; why variety matters.",
   5: "Endemic species, extinction today, conservation and protected areas; people who protect forests."},
  ["N5-6", "O5-7"], L(pre=["ecology/interdependence"], wide=["environment/conservation"], deep=["evolution/fossils-and-extinction"])),
]),
("evolution", "Evolution: the story of life", "Life", [
 ("inheritance", "Alike and different: inheriting features", {
   1: "We are similar and we are different; how children look like their parents.",
   2: "Inheriting characteristics from parents; features we inherit and features we learn.",
   4: "Variation within a species; genes as instructions passed on (simply).",
   5: "DNA in simple words; why siblings differ; nature and nurture."},
  ["C1-3.1", "C1-3.2", "C2-4.3"], L(wide=["body/body-parts"], deep=["evolution/natural-selection"])),
 ("story-of-life", "The story of life, from RNA to us", {
   2: "Life began in the sea long ago and slowly became many kinds; a timeline from first cells to us.",
   3: "How life began: the oldest life, the RNA idea; the open question of life's origin.",
   4: "The tree of life: big innovations (cells, multicellular life, land, flowers) and what was lost on the way.",
   5: "How life might have begun (hydrothermal vents, RNA world); deep time on a scale model."},
  [], L(pre=["what-is-life/signs-of-life"], deep=["evolution/natural-selection"], math=["number-sense/big-numbers", "measurement-basics/scale-models"], src="notes")),
 ("fossils-and-extinction", "Fossils, dinosaurs and extinction", {
   2: "Fossils are traces of old life; dinosaurs and the animals that came after.",
   4: "How fossils form; Mary Anning; birds as the dinosaurs that survived.",
   5: "Mass extinctions and recovery; extinction today."},
  [], L(wide=["planet-earth/rocks"], deep=["evolution/natural-selection"], src="dk")),
 ("natural-selection", "How species change: natural selection", {
   4: "Variation, survival and passing on: the peppered moth; Darwin and Wallace.",
   5: "Natural selection, adaptation and new species; cooperation in evolution (Lynn Margulis)."},
  ["C5-6.3"], L(pre=["evolution/inheritance", "habitats/adaptations"], src="dk")),
 ("human-origins", "Where humans came from", {
   4: "Early humans in Africa; tools, fire and art; how humans spread across the world.",
   5: "Many human species (Neanderthals, Denisovans); what fossils and DNA tell us; what makes us human?"},
  [], L(pre=["evolution/story-of-life"], wide=["evolution/closest-cousins"], src="dk")),
 ("closest-cousins", "Our closest cousins: apes", {
   2: "Chimpanzees, bonobos, gorillas and orangutans: how they live, play and care for each other.",
   5: "What we share with apes (DNA, emotions, tools, culture); Jane Goodall; are we special?"},
  [], L(wide=["animals/animal-minds", "evolution/human-origins"], src="dk")),
]),
("microorganisms", "Microorganisms", "Life", [
 ("microbes-everywhere", "Microbes are everywhere", {
   2: "Living things too small to see: on hands, in soil, in curd.",
   4: "Bacteria, fungi and viruses; growing mould on bread (safely); microscopes and van Leeuwenhoek.",
   5: "Microbes in and on our body; most microbes are harmless or helpful."},
  [], L(deep=["microorganisms/helpful-microbes", "microorganisms/germs"], src="dk")),
 ("helpful-microbes", "Helpful microbes and food", {
   4: "Microbes make curd, idli, bread rise; yeast experiment.",
   5: "How microbes spoil food; preservation methods and their culture (drying, salting, pickling); good microbes."},
  ["N5-3"], L(pre=["microorganisms/microbes-everywhere"], wide=["food/food-safety"], deep=["ecology/cycles-and-decomposers"])),
 ("germs", "Germs, infection and staying well", {
   3: "Some microbes make us ill; washing hands; how germs spread.",
   4: "Infectious diseases; medicines and when to use them; vaccines in simple words.",
   5: "Infectious and non-infectious diseases; symptoms and spread; prevention."},
  ["C4-1.5", "O5-14"], L(pre=["microorganisms/microbes-everywhere"], wide=["health/diseases-and-medicines"])),
]),
# ======================= BODY AND HEALTH =======================
("body", "Our bodies", "Body and health", [
 ("body-parts", "Body parts and what they do", {
   1: "Naming body parts; what each part helps us do; our bodies are similar and different.",
   3: "External organs and their jobs; care and cleanliness of each, including private parts."},
  ["C1-3.3", "O3-9"], L(wide=["senses/five-senses"], deep=["body/organs-inside"])),
 ("growing", "Growing and changing", {
   2: "How humans grow from baby to adult; measuring ourselves over time."},
  ["C2-4.2"], L(wide=["animals/animal-babies"], math=["length/standard-units-length"])),
 ("teeth", "Teeth", {
   2: "Milk teeth and adult teeth; kinds of teeth and their jobs; looking after teeth."},
  ["C2-4.5"], L(wide=["health/hygiene"])),
 ("skeleton", "Bones, skeleton and muscles", {
   2: "We have bones inside; feeling bones and joints.",
   4: "Bones and skeletons; why we need a skeleton; skeletons and movement; different kinds of skeletons.",
   5: "Muscles work in pairs; joints; exoskeletons and hydrostatic skeletons."},
  ["C4-1.1", "C4-1.2", "C4-1.3", "C4-1.4"], L(pre=["body/body-parts"], wide=["animals/animal-bodies"], deep=["body/organs-inside"], math=["data/bar-charts"])),
 ("organs-inside", "Organs inside the body", {
   3: "Heart, lungs, stomach and brain: where they are and what they do.",
   4: "Breathing and the heartbeat; measuring pulse before and after exercise.",
   5: "The main internal organs and their jobs; body systems working together."},
  ["O5-13"], L(pre=["body/body-parts"], deep=["body/digestion"], math=["data/line-graphs"])),
 ("digestion", "The digestive system", {
   4: "The journey of food from mouth to stomach to intestines.",
   5: "Parts and functions of the digestive system; teeth, saliva, stomach, intestines; gut microbes."},
  ["C5-4.1"], L(pre=["body/organs-inside", "food/nutrients"], wide=["food/balanced-diet"])),
]),
("senses", "Senses and perception", "Body and health", [
 ("five-senses", "Our senses", {
   1: "Seeing, hearing, smelling, tasting and touching; the sense organs.",
   3: "Hearing and touch, taste and smell, sight: how each sense works; senses working together."},
  ["C1-3.4", "C3-4.1", "C3-4.2", "C3-4.3"], L(wide=["body/body-parts"], deep=["senses/more-senses", "light/how-we-see", "sound/hearing"])),
 ("more-senses", "More than five senses", {
   3: "Balance, temperature, pain, knowing where your hands are; animals with senses we lack.",
   5: "Electric, magnetic and heat senses in animals; how the brain builds one picture from many senses."},
  [], L(pre=["senses/five-senses"], deep=["senses/perception"], src="notes")),
 ("perception", "Perception and illusions", {
   3: "Optical illusions; the brain can be fooled.",
   5: "We see what the brain predicts; different people perceive differently; can we trust our senses?"},
  [], L(pre=["senses/five-senses"], deep=["what-is-real/perception-and-reality"], src="notes")),
]),
("food", "Food and nutrition", "Body and health", [
 ("healthy-food", "Healthy food and drink", {
   1: "Food and drink keep us healthy; foods we like; drinking water.",
   2: "Foods that help us grow, give energy and protect us; treats in moderation."},
  ["C1-1.4"], L(deep=["food/nutrients"])),
 ("where-food-comes-from", "Where food comes from", {
   1: "Food from plants and food from animals.",
   3: "Foods from many sources; traditional knowledge of healthy eating.",
   4: "The journey of a grain from farm to plate; gratitude; not wasting food."},
  ["N3-8", "N4-6"], L(wide=["plants/plant-parts"], deep=["planet-earth/soil-and-crops"])),
 ("nutrients", "Food groups and nutrients", {
   3: "Food groups; carbohydrates, proteins, fats, vitamins, minerals and water in simple words.",
   4: "Energy-giving, body-building and protective foods; reading a food label."},
  ["C3-2.1", "O3-8", "N4-5"], L(pre=["food/healthy-food"], deep=["food/balanced-diet", "body/digestion"], math=["fractions/fractions-of-a-whole"])),
 ("balanced-diet", "A balanced diet", {
   3: "A healthy diet and an unhealthy diet; making a balanced plate.",
   4: "Balanced food; traditional foods; food festivals.",
   5: "Balanced diets for different people; deficiency diseases and how to prevent them; cheap nutritious foods."},
  ["C3-2.2", "C3-2.3", "N4-5", "C5-4.2", "O5-12"], L(pre=["food/nutrients"], wide=["health/exercise-and-rest"], math=["data/pictographs", "fractions/fractions-of-a-whole"])),
 ("food-safety", "Keeping food safe", {
   3: "Food safety: washing, covering, cooking; parts of food and their jobs.",
   5: "Storing food; when to take extra care with food; how microbes spoil food."},
  ["O3-8", "O5-12", "N5-3"], L(wide=["microorganisms/helpful-microbes"])),
]),
("health", "Health and well-being", "Body and health", [
 ("hygiene", "Hygiene and cleanliness", {
   1: "Washing hands, bathing, brushing teeth.",
   3: "Hygiene and cleanliness at home and around us; staying healthy and happy."},
  ["N3-9", "O3-9"], L(deep=["microorganisms/germs"])),
 ("exercise-and-rest", "Exercise, sleep and rest", {
   2: "Keeping healthy: exercise, good food, sleep and keeping clean.",
   3: "Exercise and sleep; regular exercise and yoga.",
   4: "Mindful eating, exercise and rest; a safe environment."},
  ["C2-4.4", "C3-2.4", "N3-9", "N4-6"], L(wide=["food/balanced-diet"], deep=["body/organs-inside"], math=["time/duration"])),
 ("feelings-and-wellbeing", "Feelings and well-being", {
   1: "Naming feelings; what helps when we feel sad or angry.",
   3: "Physical and emotional well-being; kindness, respect and friendship.",
   5: "A happy school: kindness, respect and positive behaviour; caring for each other and for places."},
  ["N3-9", "N5-4"], L(wide=["me-and-others/me-and-others"], src="dk")),
 ("diseases-and-medicines", "Diseases and medicines", {
   4: "Medicines and infectious diseases; using medicines safely.",
   5: "Common diseases: causes, prevention and protection; deficiency diseases."},
  ["C4-1.5", "O5-14", "O5-12"], L(pre=["microorganisms/germs"])),
]),
("mind", "Mind, brain and memory", "Body and health", [
 ("thinking-and-memory", "Thinking and memory", {
   3: "The brain helps us think, remember and learn; memory games; how practice changes the brain.",
   5: "Memory is rebuilt, not replayed; habits; how sleep helps learning; the brain can be fooled."},
  [], L(wide=["animals/animal-minds"], deep=["mind/thinking-without-brains", "what-is-real/consciousness"], src="dk")),
 ("brain-and-nerves", "Brain and nerves", {
   4: "Nerves carry messages; reaction time; reflexes.",
   5: "Neurons in simple words; the brain's parts and jobs; the brain changes all through life."},
  [], L(pre=["body/organs-inside"], wide=["senses/more-senses"], math=["measurement-basics/standard-units", "data/bar-charts"], src="notes")),
 ("thinking-without-brains", "Does thinking need a brain?", {
   5: "Single cells sense, decide and remember; slime moulds solving mazes; plants and fungi as networks; the debate over basal cognition."},
  [], L(pre=["mind/brain-and-nerves"], wide=["plants/plant-senses"], src="notes")),
]),
("me-and-others", "Me and others", "Body and health", [
 ("me-and-others", "Me, my family and others", {
   1: "Who am I? What I like; we are all similar and different; being kind.",
   3: "Seeing from another's point of view; friendship; living together with differences."},
  ["C1-3.1", "C1-3.2"], L(wide=["family/family"], src="dk")),
]),
# ======================= MATTER =======================
("materials", "Materials and their properties", "Matter", [
 ("what-is-it-made-of", "What things are made of", {
   1: "Wood, metal, plastic, glass, fabric, paper; naming the material of everyday things.",
   3: "This world of things: where materials come from; natural and made by people."},
  ["C1-4.1", "N3-10"], L(deep=["materials/properties"], wide=["making-things/design-and-build"])),
 ("properties", "Properties of materials", {
   1: "Hard, soft, rough, smooth, bendy, stiff, shiny, dull.",
   2: "Properties of materials; waterproof, stretchy, strong; transparent or opaque.",
   3: "Properties of materials compared and measured; sorting materials by properties."},
  ["C2-3.2", "C3-5.1", "C3-5.2", "N3-10"], L(pre=["materials/what-is-it-made-of"], deep=["materials/testing-materials", "states/solids-liquids-gases"], math=["logic/sets-and-venn"])),
 ("natural-and-made", "Natural and made materials", {
   2: "Natural materials and materials made by people; how glass, plastic and paper are made from natural materials."},
  ["C2-3.1"], L(pre=["materials/what-is-it-made-of"], deep=["making-things/paper"])),
 ("using-materials", "Using the right material", {
   1: "Using materials: why a spoon is metal and a raincoat is plastic.",
   2: "Using the right material for the job.",
   3: "Uses of materials linked to properties."},
  ["C1-4.2", "C2-3.3", "C3-5.3"], L(pre=["materials/properties"], deep=["making-things/design-and-build"])),
 ("sorting-materials", "Sorting materials", {
   1: "Sorting materials into groups.",
   3: "Sorting materials in more than one way."},
  ["C1-4.3", "C3-5.2"], L(math=["logic/sets-and-venn", "data/sorting-and-tallies"])),
 ("testing-materials", "Testing materials", {
   2: "Testing materials: which is the most waterproof, the strongest, the stretchiest?",
   3: "Fair tests on materials; recording results in a table."},
  ["C2-3.4", "C3-5.4"], L(pre=["materials/properties"], wide=["how-we-know/fair-tests"], math=["data/bar-charts", "measurement-basics/standard-units"])),
 ("magnetic-materials", "Magnetic and non-magnetic materials", {
   3: "Which materials a magnet attracts; not all metals are magnetic."},
  ["C3-5.5"], L(pre=["materials/properties"], deep=["magnets/magnets-and-materials"])),
]),
("states", "Solids, liquids, gases and particles", "Matter", [
 ("solids-liquids-gases", "Solids, liquids and gases", {
   2: "Solids keep their shape, liquids flow, gases spread out; water as ice, water and steam.",
   4: "How solids and liquids behave; powders that pour but are solids.",
   5: "Gases have mass and fill their container; air is a gas; states compared."},
  ["C4-3.2", "C5-3.1"], L(pre=["materials/properties"], deep=["states/particles", "states/melting-and-solidifying"])),
 ("particles", "Everything is made of particles", {
   3: "Tiny particles too small to see; dissolving sugar disappears but is still there.",
   4: "Materials, substances and particles; particles in solids, liquids and gases.",
   5: "Particles move faster when heated; the particle model explains melting, evaporating and dissolving."},
  ["C4-3.1"], L(pre=["states/solids-liquids-gases"], deep=["the-very-small/atoms"])),
 ("melting-and-solidifying", "Melting and solidifying", {
   2: "Ice melts and water freezes; chocolate and wax melt.",
   4: "Melting and solidifying; melting points; reversible changes."},
  ["C4-3.3"], L(pre=["states/solids-liquids-gases"], wide=["changes/reversible-and-irreversible"], math=["temperature/reading-thermometers"])),
 ("evaporation-and-condensation", "Evaporation and condensation", {
   3: "Puddles disappear and windows mist up: water goes into the air and comes back.",
   5: "Evaporation and condensation; what speeds up evaporation; the water cycle explained with particles."},
  ["C5-3.3"], L(pre=["states/solids-liquids-gases"], wide=["water/water-cycle"], math=["data/line-graphs", "time/duration"])),
 ("properties-of-water", "Properties of water", {
   5: "Properties of water: boiling and freezing points, it expands when it freezes, surface tension."},
  ["C5-3.2"], L(pre=["states/solids-liquids-gases"], wide=["water/water-sources-and-uses"], math=["temperature/reading-thermometers"])),
 ("dissolving", "Dissolving and solutions", {
   3: "Some things dissolve in water, some don't; making lemonade.",
   5: "Solutions; soluble and insoluble; separating mixtures (filtering, evaporating)."},
  ["C5-3.4"], L(pre=["states/particles"], math=["weight-capacity/capacity"])),
 ("floating-and-sinking", "Floating, sinking and density", {
   2: "What floats and what sinks; guessing before testing.",
   4: "Floating and sinking with shape: boats of clay; patterns in how things work.",
   5: "Density in simple words: heavy for its size; why ships float; floating in salty water."},
  ["N4-7"], L(wide=["forces/air-water-resistance"], math=["weight-capacity/weight", "data/sorting-and-tallies"])),
]),
("changes", "Changing materials", "Matter", [
 ("reversible-and-irreversible", "Changes we can and can't undo", {
   2: "Changing materials by squashing, bending, heating and cooling.",
   4: "Reversible and irreversible changes; cooking changes food for ever.",
   5: "Burning, rusting and cooking as new materials forming."},
  ["C2-3.5"], L(pre=["materials/properties"], deep=["changes/chemical-reactions"])),
 ("chemical-reactions", "Chemical reactions", {
   4: "Chemical reactions: new substances form (vinegar and baking soda, rusting); signs of a reaction.",
   5: "Burning needs fuel, air and heat; useful and harmful reactions."},
  ["C4-3.4"], L(pre=["changes/reversible-and-irreversible"], deep=["changes/fire"])),
 ("fire", "Fire", {
   3: "What fire needs; fire safety; how humans learned to use fire.",
   5: "Burning as a chemical reaction; the fire triangle; is fire alive?"},
  [], L(wide=["what-is-life/edge-of-life", "energy/heat"], src="notes")),
]),
("making-things", "Making things", "Matter", [
 ("houses-and-shelter", "Houses and shelter", {
   3: "Making things: materials and uses; houses built from natural resources; new designs; safety rules."},
  ["N3-11", "O3-7"], L(wide=["basic-needs/basic-needs"], deep=["making-things/design-and-build"])),
 ("paper", "How paper is made", {
   4: "Making handmade paper from pulp; how paper is made; the 5Rs of waste."},
  ["N4-8"], L(pre=["materials/natural-and-made"], wide=["waste/reduce-reuse-recycle"])),
 ("cloth", "Clothes and cloth", {
   5: "From birds weaving nests to spinning, weaving and stitching; handloom and embroidery; reuse and recycling."},
  ["N5-8"], L(pre=["materials/properties"], wide=["india/unity-in-diversity"])),
 ("design-and-build", "Design and build", {
   3: "Design a thing for a purpose, choose materials, build, test and improve.",
   5: "Engineers' design cycle; inventions from nature (biomimicry)."},
  [], L(pre=["materials/using-materials"], wide=["forces/simple-machines"], math=["length/standard-units-length", "shapes-3d/nets"], src="dk")),
]),
("waste", "Waste", "Matter", [
 ("sorting-waste", "Sorting waste", {
   2: "Wet and dry waste; where waste goes.",
   3: "Taking charge of waste: throwing and sorting waste correctly; clean and safe homes and neighbourhoods."},
  ["N3-12"], L(deep=["waste/reduce-reuse-recycle"], math=["data/sorting-and-tallies"])),
 ("reduce-reuse-recycle", "Reduce, reuse, recycle (the 5Rs)", {
   3: "Reuse and recycling; making something new from waste.",
   4: "The 5Rs: refuse, reduce, reuse, repurpose, recycle."},
  ["N3-12", "N4-8"], L(pre=["waste/sorting-waste"], deep=["waste/compost-and-disposal"])),
 ("compost-and-disposal", "Garbage disposal and compost", {
   3: "Composting kitchen waste; worms and microbes at work.",
   5: "Organic and inorganic waste; disposal and reuse; harm to the environment; there is no 'away'."},
  ["O5-15"], L(pre=["waste/reduce-reuse-recycle"], wide=["ecology/cycles-and-decomposers"], math=["data/bar-charts", "weight-capacity/weight"])),
]),
# ======================= PHYSICS =======================
("forces", "Forces and movement", "Physics", [
 ("push-and-pull", "Pushes and pulls", {
   1: "In the playground and with toys: pushes and pulls make things move; pushes and pulls around us.",
   2: "Forces around us: every push or pull is a force.",
   3: "Push and pull in more detail; forces act in a direction; arrows to show forces."},
  ["C1-5.1", "C1-5.2", "C1-5.3", "C2-2.1", "C3-6.1"], L(deep=["forces/changing-motion", "gravity/falling"], wide=["motion/kinds-of-motion"])),
 ("changing-motion", "Forces change shape, speed and direction", {
   1: "Changing movement: start, stop, faster, slower.",
   2: "Changing shape, changing speed, changing direction.",
   3: "Changing shape with forces; squashing, stretching, twisting."},
  ["C1-5.4", "C2-2.2", "C2-2.3", "C2-2.4", "C3-6.2"], L(pre=["forces/push-and-pull"], deep=["forces/balanced-forces"], wide=["motion/speed"])),
 ("measuring-forces", "How big is a force? Forcemeters", {
   3: "How big is that force? Measuring forces with a forcemeter in newtons."},
  ["C3-6.3", "C3-6.4"], L(pre=["forces/push-and-pull"], math=["measurement-basics/reading-scales", "data/bar-charts"], deep=["gravity/weight-and-mass"])),
 ("friction", "Friction", {
   3: "Friction slows things down; rough and smooth surfaces; testing shoes and slopes.",
   5: "Friction as a contact force; useful and unwanted friction; friction makes heat."},
  ["C3-6.5", "C5-5.3"], L(pre=["forces/push-and-pull"], deep=["forces/air-water-resistance", "energy/heat"], math=["measurement-basics/reading-scales", "data/bar-charts"])),
 ("air-water-resistance", "Air resistance, water resistance and upthrust", {
   4: "Parachutes, boats and streamlined shapes; water pushes up (upthrust).",
   5: "Friction, air resistance, water resistance and upthrust together; designing a parachute."},
  ["C5-5.3"], L(pre=["forces/friction"], wide=["states/floating-and-sinking"], math=["time/duration", "data/line-graphs"])),
 ("normal-force", "The ground pushes back: normal force", {
   4: "When you stand, the ground pushes up on you; you can't push anything without being pushed back.",
   5: "Gravity, normal forces and applied forces; drawing force diagrams."},
  ["C5-5.1"], L(pre=["forces/push-and-pull"], wide=["gravity/weight-and-mass"], src="notes")),
 ("balanced-forces", "Balanced and multiple forces", {
   4: "Tug of war: equal forces balance, unequal forces change motion.",
   5: "Multiple forces on one object; resultant force; force diagrams."},
  ["C5-5.4"], L(pre=["forces/changing-motion"], math=["addition-subtraction/mental-strategies", "algebra/balance-and-missing-numbers"])),
 ("simple-machines", "Simple machines", {
   3: "Levers, wheels and slopes make work easier; see-saw balance.",
   4: "Lever, pulley, wheel and axle, inclined plane, wedge, screw.",
   5: "Balancing a lever with weights and distances; machines that multiply force."},
  [], L(pre=["forces/push-and-pull"], wide=["making-things/design-and-build"], math=["multiplication/multiplication-facts", "algebra/balance-and-missing-numbers", "length/standard-units-length"], src="notes")),
 ("how-toys-work", "How things work: toys and spinning", {
   1: "How toys work: wind-up, roll, bounce, spin.",
   4: "Hands-on with toys and paper: spinning, floating and sinking; finding patterns in how things work."},
  ["C1-5.2", "N4-7"], L(pre=["forces/push-and-pull"], wide=["motion/kinds-of-motion"])),
]),
("gravity", "Gravity", "Physics", [
 ("falling", "Things fall", {
   1: "Everything falls down when we let go; dropping things.",
   3: "Gravity pulls everything towards the Earth; heavy and light things fall together (without air); Galileo's question."},
  [], L(pre=["forces/push-and-pull"], deep=["gravity/weight-and-mass"], src="notes")),
 ("weight-and-mass", "Weight and mass", {
   3: "Weight is the pull of gravity; measuring weight with a forcemeter.",
   5: "Mass and weight are different; weight on the Moon and other planets; gravity, normal force and applied force."},
  ["C5-5.1"], L(pre=["gravity/falling", "forces/measuring-forces"], math=["weight-capacity/weight", "multiplication/multi-digit"], deep=["gravity/orbits"])),
 ("orbits", "Gravity, orbits and satellites", {
   4: "The Moon falls around the Earth; why astronauts float (they are falling, not weightless).",
   5: "Gravity and satellites; natural and artificial satellites; escape speed."},
  ["C5-5.2", "O5-11"], L(pre=["gravity/weight-and-mass"], wide=["sky/solar-system"], deep=["gravity/spacetime"])),
 ("spacetime", "Gravity bends space and time", {
   5: "Gravity as curved space (the stretched-blanket model); light bends near the Sun; time runs slower near big masses."},
  [], L(pre=["gravity/orbits"], wide=["space-time/relativity"], src="notes")),
]),
("motion", "Motion", "Physics", [
 ("kinds-of-motion", "Kinds of motion", {
   1: "Rolling, sliding, spinning, swinging, bouncing.",
   2: "Straight, round and back-and-forth motion; things that move by themselves and things that are moved."},
  [], L(wide=["forces/push-and-pull"], deep=["motion/swings-and-pendulums"], src="notes")),
 ("speed", "Fast and slow: speed", {
   2: "Faster and slower; races and who wins.",
   4: "Speed means distance in a time; timing a toy car over a measured track.",
   5: "Speed = distance ÷ time; fastest animals and machines; relative motion."},
  ["C2-2.3"], L(pre=["forces/changing-motion"], math=["length/standard-units-length", "time/duration", "division/division-facts"], src="notes")),
 ("swings-and-pendulums", "Swings and pendulums", {
   3: "A swing goes back and forth; what changes how fast it swings?",
   5: "Pendulum length and timing; pendulum clocks; patterns in motion."},
  [], L(pre=["motion/kinds-of-motion"], math=["time/duration", "data/line-graphs", "patterns/number-patterns"], src="notes")),
]),
("energy", "Energy", "Physics", [
 ("energy-around-us", "Energy around us", {
   3: "Energy makes things happen: moving, lighting, heating, sounding.",
   4: "Energy around us; forms of energy (movement, light, sound, heat, electrical, stored).",
   5: "Energy in everyday life at home and in society; how energy makes things work; a table has energy too."},
  ["C4-2.1", "N5-7"], L(deep=["energy/transfers"], wide=["electricity/uses-of-electricity"])),
 ("transfers", "Energy transfers and changes", {
   4: "Energy transfers and energy changes: a torch, a kettle, a ball rolling down a slope.",
   5: "Energy is never used up, only changed; energy chains; useful and wasted energy."},
  ["C4-2.2", "C4-2.3"], L(pre=["energy/energy-around-us"], deep=["order-chaos/entropy"])),
 ("energy-in-living-things", "Energy and living things", {
   4: "Energy and living things: food gives energy; energy comes from the Sun through plants."},
  ["C4-2.4"], L(pre=["energy/energy-around-us"], wide=["ecology/food-chains", "plants/photosynthesis"])),
 ("sources-and-saving", "Energy sources and saving energy", {
   4: "Why we need energy; sources of energy (sun, wind, water, fuels).",
   5: "Sources and kinds of energy; renewable and non-renewable; alternatives; clean and efficient energy; saving energy."},
  ["O5-10", "N5-7"], L(pre=["energy/energy-around-us"], wide=["environment/conservation"], math=["data/bar-charts"])),
 ("heat", "Heat and temperature", {
   2: "Hot and cold; things that warm us up.",
   3: "Measuring temperature with a thermometer; heat moves from hot to cold.",
   5: "Conductors and insulators of heat; keeping things hot or cold."},
  [], L(wide=["states/melting-and-solidifying"], math=["temperature/reading-thermometers", "data/line-graphs"], src="notes")),
]),
("electricity", "Electricity", "Physics", [
 ("uses-of-electricity", "Where we use electricity", {
   2: "Where do we use electricity? Mains and batteries."},
  ["C2-6.1"], L(deep=["electricity/circuits"])),
 ("electrical-safety", "Keeping safe with electricity", {
   2: "Keep safe with electricity: never touch sockets or wires; water and electricity.",
   4: "Why water near electricity is dangerous; safety rules."},
  ["C2-6.2", "C4-6.2"], L(wide=["electricity/uses-of-electricity"])),
 ("circuits", "Making circuits", {
   2: "Making a simple circuit with a cell, wires and a bulb.",
   4: "Changing the number of components in a circuit; brighter and dimmer bulbs.",
   5: "Circuit diagrams and symbols; series circuits."},
  ["C2-6.3", "C4-6.5"], L(pre=["electricity/uses-of-electricity"], deep=["electricity/conductors-and-insulators"], math=["patterns/number-patterns"])),
 ("conductors-and-insulators", "Conductors and insulators", {
   4: "Which materials conduct electricity; does water conduct; conductors and insulators in appliances."},
  ["C4-6.1", "C4-6.2", "C4-6.3"], L(pre=["electricity/circuits"], wide=["materials/properties"], math=["data/sorting-and-tallies"])),
 ("switches", "Switches", {
   4: "Switches open and close a circuit; making a switch."},
  ["C4-6.4"], L(pre=["electricity/circuits"], math=["logic/true-false"])),
 ("static-and-charge", "Static electricity and charge", {
   3: "Balloons that stick to walls and lift hair; lightning is a giant spark.",
   5: "Positive and negative charge; attraction and repulsion; Tesla's experiments and their legends."},
  [], L(wide=["magnets/poles"], src="notes")),
]),
("magnets", "Magnets", "Physics", [
 ("magnets-and-materials", "Magnets and magnetic materials", {
   3: "Magnets attract some metals (iron, steel, nickel).",
   5: "Magnets and magnetic materials; testing which metals are magnetic."},
  ["C3-5.5", "C5-5.5"], L(pre=["materials/magnetic-materials"], deep=["magnets/poles"])),
 ("poles", "Poles and magnetic force", {
   3: "North and south poles; attract and repel.",
   5: "Magnetic force acts without touching; strength of magnets; magnetic fields with iron filings."},
  ["C5-5.6"], L(pre=["magnets/magnets-and-materials"], deep=["magnets/compass-and-earth"], math=["data/bar-charts"])),
 ("compass-and-earth", "The Earth is a magnet: compasses", {
   4: "A compass points north; making a compass with a needle.",
   5: "Earth's magnetic field; animals that navigate by magnetism; electromagnets."},
  [], L(pre=["magnets/poles"], wide=["planet-earth/maps-and-directions"], math=["position/directions-and-grids"], src="dk")),
]),
("light", "Light, seeing and shadows", "Physics", [
 ("light-sources", "Light sources", {
   1: "Sun, lamp, fire, torch: things that give light.",
   2: "Light sources; the Moon is not a light source; darkness is the absence of light."},
  ["C2-5.1", "C2-5.2"], L(deep=["light/how-we-see", "light/shadows"])),
 ("how-we-see", "How we see", {
   3: "Light enters our eyes; we see things when light bounces off them.",
   4: "How we see things; light travels in straight lines."},
  ["C4-5.1", "C4-5.2"], L(pre=["light/light-sources"], wide=["senses/five-senses"], deep=["light/reflection"])),
 ("shadows", "Shadows", {
   2: "Shadows form when light is blocked; shadow puppets.",
   4: "Shadows at different times of day and why their length changes; investigating shadow lengths.",
   5: "Shadow length and the Sun's height; sundials."},
  ["N4-10", "C4-5.6"], L(pre=["light/light-sources"], wide=["day-night-seasons/sun-appears-to-move"], math=["length/standard-units-length", "data/line-graphs", "time/telling-time"])),
 ("transparent-opaque", "Transparent, translucent and opaque", {
   2: "Which materials let light through.",
   3: "Transparent, translucent and opaque materials; using them (windows, curtains, sunglasses)."},
  [], L(pre=["light/light-sources"], wide=["materials/properties"], src="notes")),
 ("reflection", "Reflection and mirrors", {
   3: "Mirrors reflect light; mirror writing.",
   4: "Light reflects off different surfaces; shiny and dull; periscopes."},
  ["C4-5.3"], L(pre=["light/how-we-see"], math=["symmetry/line-symmetry"])),
 ("colour", "Colour and rainbows", {
   1: "Mixing paints to invent new colours; colours around us.",
   3: "Rainbows: sunlight is made of many colours; prisms.",
   5: "Mixing light vs mixing paint; why the sky is blue; colours animals see that we can't."},
  [], L(pre=["light/light-sources"], wide=["senses/perception"], src="notes")),
 ("light-in-space", "Light in the solar system", {
   4: "Light in the solar system: the Sun lights the planets and the Moon."},
  ["C4-5.4"], L(pre=["light/light-sources"], wide=["sky/moon-phases"])),
]),
("sound", "Sound", "Physics", [
 ("sources-of-sound", "Where sounds come from", {
   1: "Where do sounds come from? Loud and soft sounds around us.",
   3: "Sounds are made when things vibrate; feeling vibration."},
  ["C1-6.1"], L(deep=["sound/vibration"])),
 ("hearing", "Our ears and hearing", {
   1: "Our ears; hearing near and far sounds.",
   3: "How the ear works; protecting hearing; animals that hear what we can't."},
  ["C1-6.2"], L(wide=["senses/five-senses"])),
 ("sound-moves", "Sound travels", {
   1: "Sounds move from the source to our ears.",
   4: "Sound travels through solids, liquids and gases; string telephones; knock on wood vs metal.",
   5: "Speed of sound; echoes; sound can't travel in space."},
  ["C1-6.3"], L(pre=["sound/sources-of-sound"], math=["time/duration"], deep=["sound/vibration"])),
 ("vibration", "Vibration", {
   5: "How are sounds made? Vibrations of strings, skins and air columns."},
  ["C5-2.1"], L(pre=["sound/sources-of-sound"], deep=["sound/volume-and-pitch"])),
 ("volume-and-pitch", "Volume and pitch", {
   5: "Volume and pitch; changing the volume of sound; changing the pitch of sound; instruments."},
  ["C5-2.2", "C5-2.3", "C5-2.4"], L(pre=["sound/vibration"], wide=["sound/music"], math=["fractions/fractions-of-a-whole", "length/standard-units-length", "data/bar-charts"])),
 ("music", "Music and sound", {
   2: "Making instruments from boxes, bottles and rubber bands; rhythm and beat.",
   4: "How instruments make different notes; Om and resonance.",
   5: "Halving a string raises the note an octave; patterns of music."},
  [], L(pre=["sound/sources-of-sound"], math=["patterns/repeating-patterns", "fractions/fractions-of-a-whole"], src="notes")),
]),
# ======================= EARTH AND SPACE =======================
("sky", "Sun, Moon, stars and planets", "Earth and space", [
 ("sun-moon-stars", "Sun, Moon and stars", {
   1: "The Sun gives light and heat; the Moon and stars at night.",
   3: "Sun, Moon and stars; stars vs planets; Sun and planets.",
   4: "Our sky: Sun, Moon and stars; sky-related festivals and practices."},
  ["O3-6", "N4-10"], L(deep=["sky/solar-system", "sky/stars-and-galaxies"])),
 ("solar-system", "The solar system", {
   3: "The Sun and eight planets; Earth is a planet.",
   4: "Planets in order; rocky and gas planets.",
   5: "Planets of the solar system and Earth; planets vs satellites; scale of the solar system."},
  ["O5-11", "C4-5.4"], L(pre=["sky/sun-moon-stars"], wide=["gravity/orbits"], math=["number-sense/big-numbers", "measurement-basics/scale-models"])),
 ("moon-phases", "The Moon and its phases", {
   3: "The Moon seems to change shape; keeping a Moon diary.",
   5: "Phases of the Moon explained; the Moon's light is reflected sunlight; eclipses."},
  ["O5-11"], L(pre=["sky/sun-moon-stars"], wide=["light/light-in-space"], math=["time/calendar", "patterns/repeating-patterns"])),
 ("stars-and-galaxies", "Stars and galaxies", {
   4: "Stars are suns far away; constellations and stories of the sky from many cultures.",
   5: "The Milky Way; how stars are born and die; light-years."},
  [], L(pre=["sky/sun-moon-stars"], deep=["story-of-universe/galaxies-and-big-bang"], math=["number-sense/big-numbers"], src="notes")),
 ("exploring-space", "Exploring space", {
   3: "Telescopes, rockets and astronauts; India's space missions.",
   5: "Natural and man-made satellites; how we learn about places we can't visit."},
  ["O5-11", "C5-5.2"], L(wide=["gravity/orbits"], src="dk")),
]),
("day-night-seasons", "Day, night, seasons and rhythms of nature", "Earth and space", [
 ("sun-appears-to-move", "The Sun appears to move", {
   2: "The Sun appears to move across the sky; morning, noon and evening shadows."},
  ["C2-5.3"], L(deep=["day-night-seasons/day-and-night"], wide=["light/shadows"])),
 ("day-and-night", "Day and night", {
   3: "Day and night happen because the Earth spins.",
   4: "Day and night; the Earth spins once in 24 hours.",
   5: "Day and night across the world; why it is night in America when it is day in India."},
  ["O3-6", "C4-5.5", "N5-9"], L(pre=["day-night-seasons/sun-appears-to-move"], math=["time/telling-time"], deep=["day-night-seasons/time-zones"])),
 ("seasons", "Seasons", {
   2: "Seasons of India: summer, monsoon, winter; what changes.",
   3: "Seasons and how plants, animals and people change with them.",
   5: "The Earth moves around the Sun; the tilt of the Earth causes seasons; seasonal changes."},
  ["O3-6", "C5-6.1", "C5-6.2", "N5-9"], L(wide=["weather/weather"], math=["time/calendar"])),
 ("rhythms-of-nature", "Rhythms of nature", {
   3: "Daily and yearly rhythms: flowers that open at dawn, birds that migrate.",
   5: "Rhythms of nature: how plants, animals, people and places change; body clocks; nature journaling."},
  ["N5-9"], L(pre=["day-night-seasons/seasons"], math=["data/line-graphs"])),
 ("time-zones", "Latitude, longitude and time zones", {
   5: "Latitude and longitude; time zones."},
  ["O5-11"], L(pre=["day-night-seasons/day-and-night"], math=["position/coordinates", "time/telling-time"])),
]),
("planet-earth", "Planet Earth", "Earth and space", [
 ("structure-of-earth", "Inside the Earth", {
   4: "The structure of the Earth: crust, mantle, core.",
   5: "Moving plates; how continents drift; how we know what's inside."},
  ["C4-4.1"], L(deep=["planet-earth/volcanoes-and-earthquakes"])),
 ("volcanoes-and-earthquakes", "Volcanoes and earthquakes", {
   4: "Volcanoes; earthquakes; why they happen where they do.",
   5: "Plates and the shaking Earth; living safely in earthquake zones."},
  ["C4-4.2", "C4-4.3"], L(pre=["planet-earth/structure-of-earth"], wide=["weather/natural-events"])),
 ("rocks", "Rocks", {
   2: "Rocks and the environment; kinds of rocks and their uses.",
   4: "How rocks form and change; fossils in rocks."},
  ["C2-1.4"], L(wide=["evolution/fossils-and-extinction"], deep=["planet-earth/soil-and-crops"])),
 ("soil-and-crops", "Soil and crops", {
   3: "Soil is made from rocks and dead things; worms in soil.",
   5: "Types of soil and crops; preparing the field, sowing, manure, irrigation, harvesting; crops by season; soil erosion and its prevention."},
  ["O5-8", "O5-9"], L(pre=["planet-earth/rocks"], wide=["food/where-food-comes-from"], math=["data/bar-charts"])),
 ("landforms", "Landforms of India and the world", {
   4: "Mountains, plains, plateaus, deserts, coasts, islands.",
   5: "States and Union Territories; India on the world map; physical features, resources, climate, crops and vegetation."},
  ["N4-9", "O5-5"], L(wide=["habitats/lands-and-lives"], math=["position/maps"])),
 ("maps-and-directions", "Maps and directions", {
   3: "Directions (north, south, east, west); drawing a map of your home or street.",
   4: "Drawing and reading maps; directions; the neighbourhood.",
   5: "Maps, scale and symbols; globe and atlas."},
  ["N4-2"], L(math=["position/maps", "position/directions-and-grids"], wide=["magnets/compass-and-earth"])),
 ("earth-shared-home", "Earth, our shared home", {
   5: "Earth as a connected living planet; sharing nature, knowledge and culture; Vasudhaiva Kutumbakam."},
  ["N5-10"], L(wide=["environment/conservation", "ecology/interdependence"])),
]),
("weather", "Weather and climate", "Earth and space", [
 ("weather", "Weather", {
   1: "Sunny, rainy, windy, cloudy; dressing for the weather.",
   3: "Measuring weather: rain gauge, wind vane, thermometer; a weather diary.",
   4: "Temperature, humidity and air pressure in simple words."},
  [], L(wide=["day-night-seasons/seasons"], math=["temperature/reading-thermometers", "data/pictographs", "data/bar-charts"], src="notes")),
 ("clouds-and-rain", "Clouds and rain", {
   2: "Where rain comes from; clouds are tiny drops of water.",
   4: "Cloud types; how clouds form (condensation)."},
  [], L(wide=["water/water-cycle", "states/evaporation-and-condensation"], src="notes")),
 ("wind-and-air", "Wind and moving air", {
   3: "Wind is moving air; kites and windmills.",
   5: "Warm air rises; sea and land breezes; the monsoon winds."},
  [], L(pre=["air/air-around-us"], wide=["energy/sources-and-saving"], src="notes")),
 ("natural-events", "Nature's events: storms, floods, droughts", {
   4: "Cyclones, floods, droughts, landslides; staying safe; how communities help."},
  [], L(wide=["planet-earth/volcanoes-and-earthquakes"], src="dk")),
 ("climate-change", "Climate and climate change", {
   4: "Climate zones; weather vs climate.",
   5: "The greenhouse effect in simple words; global warming; what people can do; Eunice Foote."},
  [], L(pre=["weather/weather"], wide=["environment/conservation"], math=["data/line-graphs"], src="notes")),
]),
("water", "Water", "Earth and space", [
 ("water-sources-and-uses", "Water: sources and uses", {
   1: "Water for drinking, cooking, washing, plants and animals.",
   3: "Rain, storing and cleaning water; using it at home; problems of water quality and quantity.",
   5: "Forms and sources of water (fresh and salt); how little of Earth's water we can drink."},
  ["N3-7", "N5-1"], L(deep=["water/saving-water", "water/water-cycle"], math=["weight-capacity/capacity", "fractions/fractions-of-a-whole"])),
 ("saving-water", "Saving and cleaning water", {
   3: "Saving water at home and school; filtering dirty water.",
   5: "Water conservation; rainwater harvesting; traditional stepwells and tanks."},
  ["N3-7", "N5-1", "O3-5"], L(pre=["water/water-sources-and-uses"], math=["weight-capacity/capacity", "data/bar-charts"])),
 ("water-cycle", "The water cycle", {
   3: "Water goes round and round: rain, rivers, sea, clouds.",
   5: "The water cycle: evaporation, condensation, precipitation, collection; water shaping land."},
  ["N5-1"], L(pre=["water/water-sources-and-uses"], wide=["states/evaporation-and-condensation", "weather/clouds-and-rain"])),
 ("rivers", "Journey of a river", {
   5: "The Godavari from source to delta: tributaries, river life, dams, pollution; rivers support ecosystems, people and culture."},
  ["N5-2"], L(pre=["water/water-cycle"], wide=["habitats/water-habitats"], math=["length/kilometres-and-conversions", "position/maps"])),
]),
("air", "Air", "Earth and space", [
 ("air-around-us", "Air around us", {
   1: "Air is all around us; we can't see it but we can feel it.",
   3: "Air takes up space and has weight; we breathe air; plants and air.",
   5: "Air is a mixture of gases; air pressure; the atmosphere's layers."},
  ["O3-7"], L(deep=["weather/wind-and-air", "states/solids-liquids-gases"], wide=["plants/photosynthesis"], src="dk")),
]),
("environment", "Caring for the environment", "Earth and space", [
 ("caring", "How we can care for our environment", {
   1: "Keeping our surroundings clean; caring for plants and animals near us.",
   2: "How can we care for our environment?",
   3: "What the environment is (physical and living); natural and man-made things around us.",
   4: "Caring for shared spaces together: Van Mahotsav, tree planting, community clean-ups."},
  ["C2-1.5", "O3-4", "N4-1"], L(deep=["environment/conservation", "environment/pollution"])),
 ("conservation", "Conservation of the environment", {
   3: "Useful animals and their care; conserving the environment and water.",
   5: "Conservation of soil and forests; India's natural heritage (forests, wildlife, water, minerals) and why to protect it."},
  ["O3-5", "O5-9", "O5-1"], L(pre=["environment/caring"], wide=["ecology/biodiversity", "energy/sources-and-saving"])),
 ("pollution", "Pollution", {
   3: "Dirty air, water and land; where pollution comes from.",
   5: "Air, water, soil and noise pollution; river pollution; what we can change."},
  ["N5-2"], L(pre=["environment/caring"], wide=["waste/compost-and-disposal"], math=["data/bar-charts"], src="dk")),
]),
("basic-needs", "Our basic needs", "Earth and space", [
 ("basic-needs", "Air, water, food, clothing and shelter", {
   1: "What we need to live: air, water, food, clothes, a home.",
   3: "Our basic needs: why we need them and how to take care of them; needs and wants."},
  ["O3-7"], L(wide=["making-things/houses-and-shelter", "food/healthy-food", "water/water-sources-and-uses"])),
]),
# ======================= NATURE OF SCIENCE AND THE DEEP END =======================
("how-we-know", "How we know: thinking and working scientifically", "Nature of science", [
 ("asking-questions", "Asking questions and observing", {
   1: "Wondering and asking questions; observing closely with all senses.",
   2: "Questions we can test and questions we can't; predicting.",
   3: "Planning how to find out; observing over time."},
  [], L(deep=["how-we-know/fair-tests"], src="dk")),
 ("fair-tests", "Fair tests and recording results", {
   3: "A fair test changes one thing at a time; recording results in tables.",
   4: "Variables in simple words; repeating measurements; drawing conclusions.",
   5: "Planning investigations; graphs of results; was the test fair? what would we change?"},
  [], L(pre=["how-we-know/asking-questions"], math=["data/bar-charts", "data/line-graphs", "measurement-basics/estimation-and-precision"], src="dk")),
 ("stories-of-discovery", "Stories of discovery", {
   1: "Scientists are curious people; stories of discoveries from India and the world.",
   3: "Mistakes and accidents that led to discoveries; who got the credit and who was left out.",
   5: "How ideas change: from Aryabhata to Galileo to Einstein; science as a human story."},
  [], L(wide=["how-we-know/questioning-evidence"], src="notes")),
 ("questioning-evidence", "Questioning the evidence", {
   3: "Says who? How do they know? Who's missing? Science vs stories that only sound true.",
   5: "Fringe science and how to tell it from science; debates scientists still have."},
  [], L(pre=["how-we-know/fair-tests"], wide=["what-is-real/perception-and-reality"], src="notes")),
]),
("patterns-symmetry", "Patterns and symmetry", "The Deep End", [
 ("symmetry-in-nature", "Symmetry in nature and art", {
   1: "Butterflies, leaves and faces: two matching halves; making symmetric art.",
   3: "Line and rotational symmetry in flowers, snowflakes and rangoli; why nature makes symmetry."},
  [], L(math=["symmetry/line-symmetry", "symmetry/rotational-symmetry"], deep=["patterns-symmetry/fractals-and-spirals"], src="notes")),
 ("fractals-and-spirals", "Fractals and spirals", {
   3: "Patterns inside patterns: ferns, cauliflower, coastlines; spirals in shells and sunflowers; crystal growing."},
  [], L(pre=["patterns-symmetry/symmetry-in-nature"], math=["patterns/shape-patterns", "number-sense/infinity"], src="notes")),
]),
("order-chaos", "Order, chaos and chance", "The Deep End", [
 ("order-and-chaos", "Order and chaos", {
   2: "Neat and messy; things that never happen the same way twice (falling leaves, splashes).",
   4: "Tiny changes, huge differences: the butterfly effect and weather; order that grows out of chaos."},
  [], L(deep=["order-chaos/entropy"], math=["patterns/repeating-patterns"], src="notes")),
 ("chance", "Chance and probability", {
   2: "Coin tosses and dice: we can't know, but we can guess well.",
   4: "Probability from experiments; predicting and checking; is anything truly random?"},
  [], L(math=["probability/likely-and-unlikely", "probability/experiments", "data/sorting-and-tallies"], src="notes")),
 ("entropy", "Entropy: why things get messier", {
   4: "Mixing is easy, unmixing is hard; why time has a direction; every order made somewhere makes more mess around it."},
  [], L(pre=["energy/transfers"], src="notes")),
 ("cause-and-effect", "Cause and effect", {
   2: "Every action has an effect; chains of causes.",
   4: "Action and reaction in physics; karma as an idea people hold; cause, chance and choice."},
  [], L(wide=["forces/normal-force"], math=["logic/if-then"], src="notes")),
]),
("what-is-real", "What is real?", "The Deep End", [
 ("perception-and-reality", "Perception and reality", {
   2: "Dreams feel real until we wake; things we can't see but know are there (air, sounds).",
   4: "Plato's cave; illusions; is the world exactly as we see it?"},
  [], L(wide=["senses/perception"], deep=["what-is-real/consciousness"], src="notes")),
 ("consciousness", "Awareness and experience", {
   2: "Being awake and noticing; what it feels like to be you.",
   4: "Subjective experience; can we ever know what another feels? The ship of Theseus: what makes you you?"},
  [], L(wide=["mind/thinking-and-memory"], deep=["what-is-real/other-minds"], src="notes")),
 ("other-minds", "Other minds: animals, plants, machines", {
   4: "Do animals, plants or computers have experiences? Why it is so hard to know."},
  [], L(pre=["what-is-real/consciousness"], wide=["animals/animal-minds", "plants/plant-senses"], src="notes")),
]),
("space-time", "Space, time and dimensions", "The Deep End", [
 ("space", "What is space?", {
   2: "Space is what is between things; near and far; does space go on for ever?",
   4: "Space can bend; the universe is stretching."},
  [], L(math=["position/directions-and-grids"], src="notes")),
 ("time", "What is time?", {
   2: "Before and after; clocks and calendars; different ways people have thought about time.",
   4: "Is time the same for everyone? Time runs slower when you move fast or are near big masses."},
  [], L(math=["time/telling-time", "time/calendar"], deep=["space-time/relativity"], src="notes")),
 ("dimensions", "Dimensions", {
   2: "Flat and solid: 2D and 3D shapes; a flat creature's world.",
   4: "From circle to sphere; Flatland; could there be more dimensions?"},
  [], L(math=["shapes-2d/recognising-shapes", "shapes-3d/faces-edges-vertices"], src="notes")),
 ("relativity", "Relativity and time travel", {
   4: "The twin paradox; GPS clocks need relativity; wormholes and time travel as honest speculation."},
  [], L(pre=["space-time/time"], wide=["gravity/spacetime"], src="notes")),
]),
("nothing-and-forever", "Nothing and forever", "The Deep End", [
 ("zero", "Zero: the idea of nothing", {
   3: "Zero as nothing and as a placeholder; India's gift of zero; Brahmagupta's rules.",
   5: "Is empty space really empty? The quantum vacuum in simple words."},
  [], L(math=["number-sense/zero", "number-sense/history-of-numbers"], deep=["nothing-and-forever/infinity"], src="notes")),
 ("infinity", "Infinity", {
   3: "Numbers never end; counting for ever; infinity is not a number.",
   5: "Hilbert's hotel; bigger and smaller infinities; singularities as the edge of what we know."},
  [], L(pre=["nothing-and-forever/zero"], math=["number-sense/infinity"], src="notes")),
]),
("the-very-small", "The very small", "The Deep End", [
 ("atoms", "Atoms and particles", {
   3: "Everything is made of tiny bits; how small is small? Cutting paper in half again and again.",
   5: "Atoms are mostly empty space; protons, neutrons, electrons; quarks."},
  [], L(pre=["states/particles"], math=["fractions/fractions-of-a-whole", "number-sense/big-numbers"], deep=["the-very-small/quantum"], src="notes")),
 ("quantum", "The strange quantum world", {
   5: "Light as waves and particles; antimatter; entanglement (correlated, but sends no messages); string theory as unproven."},
  [], L(pre=["the-very-small/atoms"], wide=["order-chaos/chance"], src="notes")),
]),
("story-of-universe", "The story of the universe", "The Deep End", [
 ("galaxies-and-big-bang", "Galaxies, the Big Bang and the expanding universe", {
   3: "Galaxies of every shape; the universe had a beginning; looking far is looking back in time.",
   5: "The expanding universe (Hubble, Henrietta Leavitt); the cosmic microwave background; dark matter (Vera Rubin); how the universe might end; what came before (unknown)."},
  [], L(pre=["sky/sun-moon-stars"], wide=["sky/stars-and-galaxies", "gravity/spacetime"], math=["number-sense/big-numbers"], src="notes")),
]),
# ======================= EVS: PEOPLE AND SOCIETY (taught with science in NCERT and NIOS) =======================
("family", "Family and friends", "People and society", [
 ("family", "Family and relations", {
   1: "My family; families of many kinds.",
   3: "Members of a family, how they are related and support each other; parents' responsibilities; the status of girls and women."},
  ["N3-1", "O3-1"], L(wide=["me-and-others/me-and-others"], deep=["community/community-and-helpers"], math=["data/pictographs"])),
]),
("community", "Community and neighbourhood", "People and society", [
 ("community-and-helpers", "Community and the people who serve it", {
   3: "Professions around us and respect for them; public services; family, neighbourhood and community.",
   4: "Community as togetherness and interdependence; community institutions; banks and money basics."},
  ["O3-2", "N4-1", "N4-2"], L(pre=["family/family"], math=["money/money-in-life"])),
 ("festivals", "Festivals and the mela", {
   3: "Going to the mela: materials, people, activities; celebrating festivals: food, dress and cultural practices; festivals across India and national festivals.",
   4: "Sharing in festivals; festivals of the sky and the seasons."},
  ["N3-2", "N3-3", "O3-3", "N4-1"], L(wide=["day-night-seasons/seasons", "india/unity-in-diversity"])),
 ("transport-and-communication", "Transport and communication", {
   3: "How transport and communication developed; kinds; benefits; road signs; effect on the environment.",
   4: "Transport and communication then and now."},
  ["O3-10", "N4-2"], L(wide=["energy/sources-and-saving"])),
 ("happy-school", "Our school, a happy place", {
   5: "A green school: waste, water, trees; kindness, respect and positive behaviour."},
  ["N5-4"], L(wide=["health/feelings-and-wellbeing", "waste/reduce-reuse-recycle"])),
]),
("india", "India: our country", "People and society", [
 ("national-identity", "National identity and symbols", {
   3: "National flag and its colours; national days; anthem and song; national symbols, animal, bird, sport.",
   5: "Republic Day, national symbols, currency, languages, clothing, dance and music."},
  ["O3-11", "N5-5"], L(deep=["india/unity-in-diversity"])),
 ("unity-in-diversity", "Unity in diversity", {
   5: "People and customs of India; unity in diversity; peace and harmony; Ashoka and Akbar."},
  ["O5-2", "N5-5"], L(pre=["india/national-identity"])),
 ("states-and-features", "States of India and their physical features", {
   5: "States and Union Territories on the map; physical features, resources, climate, crops and vegetation."},
  ["O5-5"], L(wide=["planet-earth/landforms"], math=["position/maps"])),
 ("heritage", "Cultural and natural heritage", {
   5: "Culture and heritage and why to conserve them; India's natural heritage."},
  ["O5-1"], L(wide=["environment/conservation"])),
 ("freedom-struggle", "Our freedom struggle", {
   5: "How British rule was established; people from every state in the freedom struggle; Gandhiji and other leaders."},
  ["O5-4"], L(pre=["india/national-identity"])),
 ("government-and-rights", "Government, rights and society", {
   3: "Our social and economic environment: Right to Education, Right to Information, MNREGA; globalisation.",
   5: "Democracy and the right to vote; how government works; rural and urban administration; social issues: girls' education, equality, dowry and the law."},
  ["O3-12", "O5-6", "O5-3"], L(wide=["india/unity-in-diversity"], math=["data/bar-charts"])),
]),
]
