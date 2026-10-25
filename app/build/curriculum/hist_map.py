"""DeepKids Combined History: my history, how we know, human origins, the Indian subcontinent, the world.
Built from the founder's HomeSchooling Track tabs 'History' (hist:) and 'History of Our Sub Continent' (sub:).
Same shape as sci_map.py; 'notes' lists the notebook items each subtopic teaches.
Board links: NCERT EVS and NIOS social-studies chapters are mapped in sci_map.py ('People and society');
here they appear as cross-subject 'wide' links.
Dates are given as historians date them today; where the notebook table had a slip, the corrected date is used
(listed in DATE_FIXES)."""
L = lambda **k: k
DATE_FIXES = [
 "Delhi Sultanate: 1206–1526 CE (the table says 1206–1256)",
 "Maratha Confederacy: 1674–1818 CE (the table says 1647–18181)",
 "Hoysala Empire: c. 1026–1343 CE (the table says 1026–1046)",
 "Kushan Empire: c. 30–375 CE (the table says 300–375 CE)",
 "British Raj: 1858–1947 CE (the table says 1858–1949)",
 "Kakatiya: the table gives 1083–1323 here and 1163–1323 in the dynasties list; rule as an independent kingdom is usually dated c. 1163–1323",
]

TOPICS = [
# ======================= MY HISTORY AND HOW WE KNOW =======================
("my-history", "My history", "History and memory", [
 ("my-story", "My story", {
   1: "What I did yesterday and last week; photos of me as a baby; before and after.",
   2: "My family's story: where my family comes from; a family tree.",
   3: "Interviewing grandparents: life when my parents were my age; then and now."},
  [], L(wide=["sci:family/family"], notes="hist:3")),
 ("we-are-all-related", "We are all related", {
   2: "We look like our parents and grandparents because of what we inherit.",
   4: "We share DNA with every person and every living thing; how far back does a family tree go?"},
  [], L(pre=["my-history/my-story"], wide=["sci:evolution/inheritance"], notes="hist:1,hist:2")),
 ("memory-and-history", "Memory, stories and history", {
   3: "Two people remember the same day differently; history is built from memories, records and stories.",
   5: "How memories and histories get distorted; myth and history; why historians check many sources."},
  [], L(pre=["my-history/my-story"], wide=["sci:mind/thinking-and-memory", "phil:mind-and-self/memory"], notes="hist:4,hist:5")),
]),
("how-we-know-history", "How we know the past", "History and memory", [
 ("archaeology", "Archaeology: digging up the past", {
   2: "Old things buried in the ground tell us how people lived; a pretend dig in sand.",
   4: "How archaeologists dig and date finds; India's recent discoveries (Keeladi, Sinauli, Rakhigarhi).",
   5: "New finds rewrite history: a 476,000-year-old wooden structure in Zambia, lidar revealing hidden Maya cities, a possible Saraswati river channel; why scientists argue about each find."},
  [], L(deep=["how-we-know-history/ancient-dna"], notes="hist:12,hist:16-18,hist:20-22")),
 ("ancient-dna", "Ancient DNA: what old bones tell us", {
   4: "DNA from very old bones tells us who people were related to.",
   5: "The Rakhigarhi genome; South Asians as a mix of ancient groups; why ancient DNA is changing old debates (and why some are still argued)."},
  [], L(pre=["how-we-know-history/archaeology"], wide=["sci:genetics/reading-genomes"], notes="hist:13-15,hist:30")),
 ("scripts-and-inscriptions", "Writing, scripts and inscriptions", {
   3: "The first writing; the Indus script nobody can read yet.",
   5: "Brahmi and Kharosthi scripts; reading Ashoka's edicts; the oldest Buddhist manuscripts from Gandhara."},
  [], L(wide=["phil:knowing/language-and-thought"], notes="hist:19,hist:29,hist:41,hist:57")),
 ("who-tells-history", "Who tells history?", {
   4: "The same event told by the winner and the loser; whose stories got written down?",
   5: "Historians disagree: different schools of history (looking at kings, at ordinary people, at the colonised); history as an argument with evidence."},
  [], L(pre=["my-history/memory-and-history"], wide=["sci:how-we-know/questioning-evidence"], notes="hist:54-56,hist:139")),
]),
# ======================= HUMAN ORIGINS AND PREHISTORY =======================
("prehistory", "Prehistory: the first people", "Human origins", [
 ("first-humans", "The first humans", {
   2: "Long ago people lived without houses, shops or writing; where the first people came from (Africa).",
   4: "Homo sapiens and other human species; how humans spread across the world.",
   5: "Evolution of Homo sapiens; what fossils and DNA tell us; humans reaching South Asia."},
  [], L(wide=["sci:evolution/human-origins"], notes="hist:6,hist:7")),
 ("hunter-gatherers", "Hunter-gatherers, stone tools and cave art", {
   2: "Living by gathering and hunting; stone tools; paintings on cave walls.",
   3: "Bhimbetka rock shelters, Lascaux and Chauvet; making a 'cave painting'.",
   4: "Life in the Old Stone Age: fire, tools, art, sharing food."},
  [], L(pre=["prehistory/first-humans"], notes="hist:8")),
 ("first-farmers", "The first farmers", {
   3: "People learned to grow crops and keep animals; the first villages (Mehrgarh, Jericho, Çatalhöyük).",
   5: "The Neolithic revolution: what changed when people settled (food, homes, owning land); was it good for everyone?"},
  [], L(pre=["prehistory/hunter-gatherers"], wide=["sci:food/where-food-comes-from"], notes="hist:9")),
 ("metals", "Copper, bronze and iron", {
   4: "How people learned to use copper, then bronze, then iron, and what changed."},
  [], L(pre=["prehistory/first-farmers"], wide=["sci:materials/natural-and-made"], notes="hist:10")),
 ("prehistoric-india", "Prehistoric India", {
   3: "The first people in India; rock art; tiny stone tools (microliths).",
   5: "Earliest humans in South Asia; domesticating millets and rice; India's first villages."},
  [], L(pre=["prehistory/first-humans"], notes="hist:11,hist:25,hist:26")),
]),
# ======================= THE INDIAN SUBCONTINENT =======================
("early-india", "Early India", "Indian subcontinent", [
 ("regional-cultures", "Early cultures across the subcontinent", {
   4: "Before and around the Indus cities: villages in Balochistan, Rajasthan (Ahar-Banas), Haryana, the Deccan, the east and the south.",
   5: "Copper Age cultures, their pottery and houses; Keeladi and early South Indian towns; India was many places, not one story."},
  [], L(deep=["early-india/indus"], notes="sub:1-6")),
 ("indus", "The Indus (Harappan) civilisation", {
   3: "Great planned cities (Mohenjo-daro, Harappa, Dholavira) with drains, wells and baths.",
   4: "Trade, standard weights, seals; how the cities ended.",
   5: "Writing nobody can read yet; what ancient DNA says about the people; debates about the Saraswati river."},
  [], L(pre=["prehistory/first-farmers"], wide=["world-ancient/mesopotamia"], math=["math:weight-capacity/weight"], notes="hist:27-30,hist:86,sub:7")),
 ("vedic-age", "The Vedic age", {
   4: "The Vedas were composed and remembered by heart; early villages and cattle herders.",
   5: "Iron, new kingdoms; how languages spread; Sinauli and other finds; what is known and what is debated."},
  [], L(pre=["early-india/indus"], wide=["phil:living-well/values"], notes="hist:31-33,sub:8")),
 ("sangam-south", "The Sangam age: Cheras, Cholas and Pandyas", {
   4: "The three crowned kingdoms of the south; Sangam poems about love and war.",
   5: "Sea trade with Rome, Keeladi's brick towns, the long story of Cheras, Cholas and Pandyas."},
  [], L(wide=["india-empires/trade-across-the-ocean"], notes="hist:34,hist:35,hist:80-82,sub:10-13")),
 ("kingdoms-and-republics", "Sixteen kingdoms and republics; the rise of Magadha", {
   4: "The mahajanapadas: kingdoms and republics; the time of the Buddha and Mahavira.",
   5: "How Magadha grew strong; the Nandas; cities of the second urbanisation."},
  [], L(pre=["early-india/vedic-age"], notes="hist:62,sub:9,sub:14")),
]),
("india-empires", "Empires and kingdoms of India", "Indian subcontinent", [
 ("mauryas", "The Mauryas and Ashoka", {
   3: "Ashoka, the king who gave up war; the lion capital on our money.",
   4: "Chandragupta Maurya and Chanakya; a huge empire.",
   5: "Ashoka's edicts in many languages and scripts (even Greek and Aramaic); Persian neighbours in the north-west."},
  [], L(wide=["early-india/kingdoms-and-republics", "sci:india/national-identity"], notes="hist:36-38,hist:63,hist:93,sub:15")),
 ("after-the-mauryas", "After the Mauryas: Shungas, Kanvas, Satavahanas", {
   5: "Smaller kingdoms after the empire; the Satavahanas linking north and south."},
  [], L(pre=["india-empires/mauryas"], notes="hist:64-66,sub:16")),
 ("crossroads", "The north-west crossroads: Greeks, Sakas and Kushans", {
   4: "Traders and kings from far away; Buddha statues in Greek style (Gandhara).",
   5: "Indo-Greeks, Sakas and Kushans; Taxila; how Buddhism travelled along the Silk Roads."},
  [], L(wide=["world-ancient/greece"], notes="hist:39-41,hist:59,sub:17-19")),
 ("trade-across-the-ocean", "Trade across the ocean", {
   4: "Pepper, cotton and spices sailed to Rome and beyond; Muziris and Arikamedu.",
   5: "Monsoon winds and the Indian Ocean trade; a 2,000-year-old trade contract (Muziris papyrus)."},
  [], L(wide=["sci:weather/monsoon-and-oceans"], notes="hist:42,hist:43,hist:60")),
 ("guptas-and-classical", "The Guptas and the classical age", {
   4: "Ajanta paintings, Nalanda, stories and plays; Aryabhata and zero.",
   5: "The Gupta age and its neighbours (Vakatakas, Kalabhras, Harsha); Indian mathematics and astronomy travelling the world."},
  [], L(wide=["math:number-sense/history-of-numbers", "sci:sky/history-of-astronomy"], notes="hist:44-46,hist:58,hist:67,sub:20-22,sub:27")),
 ("southern-and-deccan-kingdoms", "Kingdoms of the south and the Deccan", {
   4: "Temple builders: Pallavas (Mahabalipuram), Chalukyas, Rashtrakutas (Kailasa at Ellora), Hoysalas, Kakatiyas.",
   5: "The Chola navy and its empire across the sea; Kadambas, Western Gangas, later Pandyas; what temples tell us."},
  [], L(wide=["india-empires/trade-across-the-ocean"], notes="hist:70-73,sub:23-26,sub:28,sub:31,sub:32,sub:35,sub:36")),
 ("north-and-east-kingdoms", "Kingdoms of the north and east", {
   5: "The Palas and their great universities; the Gurjara-Pratiharas; the struggle for Kannauj."},
  [], L(notes="hist:68,hist:69,sub:29,sub:30")),
 ("sultanates", "The sultanates", {
   4: "Turkish and Afghan rulers in Delhi; new languages, buildings and foods.",
   5: "The Ghaznavid raids, the Delhi Sultanate, the Bahmani and Deccan sultanates; Persian culture meeting Indian culture."},
  [], L(notes="hist:47,hist:48,hist:75,hist:76,sub:33,sub:34,sub:38,sub:39")),
 ("vijayanagara", "Vijayanagara", {
   4: "The city of Hampi and its markets; Krishnadevaraya.",
   5: "The rise and fall of Vijayanagara."},
  [], L(notes="hist:74,sub:37")),
 ("mughals", "The Mughals", {
   3: "The Taj Mahal and the emperors who built forts and gardens.",
   4: "Babur to Aurangzeb; Akbar's court and its many faiths.",
   5: "Mughal India among the great empires (Safavid, Ottoman); Indian cloth and the world's silver."},
  [], L(wide=["world-early-modern/gunpowder-empires"], notes="hist:49,hist:50,hist:77,hist:106,sub:40")),
 ("marathas-and-sikhs", "Marathas and Sikhs", {
   4: "Shivaji and the Maratha forts; Ranjit Singh and the Sikh empire.",
   5: "The Maratha confederacy and the Sikh empire after the Mughals."},
  [], L(pre=["india-empires/mughals"], notes="hist:78,hist:79,sub:41,sub:42")),
 ("colonial-india", "Traders who became rulers", {
   4: "European traders came by sea (Portuguese, Dutch, French, British); the East India Company.",
   5: "Plassey, the Company, 1857, the British Raj; railways, famines and reforms; who gained and who lost."},
  [], L(deep=["india-empires/freedom-and-republic"], notes="hist:51,hist:52,sub:43-45")),
 ("freedom-and-republic", "Freedom, partition and the republic", {
   3: "How India became free; Gandhiji and many others; 15 August and 26 January.",
   5: "Nationalism and the freedom struggle across India; Partition; the Constitution; the Green Revolution, liberalisation and India today."},
  [], L(wide=["india-empires/colonial-india", "sci:india/freedom-struggle", "sci:india/government-and-rights"], notes="hist:53")),
 ("big-timeline", "The big timeline of the subcontinent", {
   3: "A timeline from the first villages to today (the Kaala Chakram board game).",
   5: "Placing every kingdom and empire on one timeline and one map; how long each lasted; who lived at the same time."},
  [], L(math=["math:number-sense/big-numbers"], notes="hist:23,hist:24,hist:61")),
]),
# ======================= THE WORLD =======================
("world-ancient", "The ancient world", "World history", [
 ("mesopotamia", "Mesopotamia: the first cities and writing", {
   3: "Sumer, the first cities, the wheel and writing on clay.",
   5: "Akkad, Babylon and Assyria; Hammurabi's laws."},
  [], L(wide=["early-india/indus"], notes="hist:83,hist:84")),
 ("egypt", "Ancient Egypt", {
   2: "Pyramids, the Nile and mummies.",
   4: "Pharaohs, hieroglyphs and the gods of Egypt; who built the pyramids."},
  [], L(notes="hist:85")),
 ("china", "Ancient China", {
   4: "The Shang and Zhou; oracle bones; the Great Wall.",
   5: "The Qin and Han empires; Confucius and government by exams; paper and the compass."},
  [], L(notes="hist:87,hist:94")),
 ("greece", "Ancient Greece", {
   4: "Athens and Sparta; the first Olympics; Greek stories.",
   5: "City-states, democracy for some, wars with Persia; Alexander and the Hellenistic world."},
  [], L(notes="hist:89,hist:90")),
 ("rome", "Ancient Rome", {
   4: "From a small city to a vast empire; roads, aqueducts and the Colosseum.",
   5: "Republic and empire, Roman law, the rise of Christianity."},
  [], L(notes="hist:91")),
 ("persia", "The Persian empires", {
   5: "Achaemenids, Parthians and Sassanids; the Persian road system and their neighbour India."},
  [], L(wide=["india-empires/mauryas"], notes="hist:95")),
 ("africa", "Early African kingdoms", {
   4: "Kush and Axum: kingdoms of pyramids, gold and trade."},
  [], L(notes="hist:96")),
 ("americas", "The ancient Americas", {
   4: "The Olmec and Chavín; the Maya, Aztec and Inca: cities, calendars and roads.",
   5: "What lidar is revealing about Maya cities; how the Inca kept records with knots."},
  [], L(notes="hist:88,hist:101")),
]),
("world-medieval", "The medieval world", "World history", [
 ("classical-and-medieval", "Empires and faiths, 500 BCE–1500 CE", {
   4: "The Byzantine empire; the rise and spread of Islam; castles and knights in medieval Europe.",
   5: "The caliphates and the House of Wisdom; feudalism and the Crusades; scholars who saved and grew knowledge."},
  [], L(notes="hist:92,hist:97-99")),
 ("mongols", "The Mongol empire", {
   5: "Genghis Khan's empire from China to Europe; how it connected the world (and how it destroyed)."},
  [], L(notes="hist:100")),
]),
("world-early-modern", "The early modern world", "World history", [
 ("renaissance-and-science", "Renaissance, reformation and the scientific revolution", {
   4: "Artists and inventors (Leonardo); the printing press.",
   5: "The Renaissance and Reformation; Galileo and Newton; the Enlightenment's new ideas about rights."},
  [], L(wide=["sci:how-we-know/stories-of-discovery"], notes="hist:102,hist:103,hist:105")),
 ("age-of-exploration", "The age of exploration", {
   4: "Sailing ships crossing oceans; Vasco da Gama reaching India.",
   5: "Empires across the seas; the Columbian exchange (potatoes, chillies, diseases); what it meant for the peoples already there."},
  [], L(notes="hist:104")),
 ("gunpowder-empires", "Great empires of Asia", {
   5: "Mughal India, Safavid Persia, the Ottoman empire, Ming and Qing China, Tokugawa Japan."},
  [], L(wide=["india-empires/mughals"], notes="hist:106,hist:107")),
 ("slavery-and-trade", "Slavery, trade and early capitalism", {
   5: "Told with care: the trans-Atlantic slave trade and the people who resisted it; mercantile companies and early capitalism; who grew rich, and who paid."},
  [], L(notes="hist:108,hist:109")),
]),
("world-modern", "The modern world", "World history", [
 ("revolutions", "Revolutions", {
   5: "The American and French revolutions; Napoleon; ideas of liberty and equality, and who they left out."},
  [], L(notes="hist:110,hist:111")),
 ("industrial-revolution", "The industrial revolution", {
   3: "Machines, factories and steam trains changed how people worked.",
   5: "Coal, cities, child labour and workers' movements; how India's cloth industry was ruined."},
  [], L(wide=["sci:energy/engines-and-fridges"], notes="hist:112")),
 ("nations-and-empires", "Nations and empires", {
   5: "New nations (Italy, Germany, Meiji Japan); the scramble for Africa; empires and their critics."},
  [], L(notes="hist:113-115")),
 ("reformers", "Reformers and rights", {
   4: "People who fought to end slavery and to win votes for women; Indian reformers (Savitribai Phule, Raja Ram Mohan Roy).",
   5: "Social reform movements worldwide; Darwin, Marx and new ways of thinking."},
  [], L(notes="hist:116,hist:117")),
]),
("twentieth-century", "The twentieth century", "World history", [
 ("world-wars", "The world wars", {
   5: "Told gently: why the wars began, what they cost, the Holocaust, the atomic bomb; Indian soldiers in both wars; how people built peace afterwards."},
  [], L(notes="hist:118,hist:119,hist:121,hist:122")),
 ("revolution-and-cold-war", "Revolutions and the Cold War", {
   4: "The space race: Sputnik, Gagarin, the Moon landing.",
   5: "The Russian revolution; the Cold War between the USA and the USSR; how it ended."},
  [], L(wide=["sci:sky/exploring-space"], notes="hist:120,hist:124,hist:127")),
 ("freedom-movements", "Freedom and rights movements", {
   4: "Countries winning freedom (India, Africa, Asia); Martin Luther King, Nelson Mandela.",
   5: "Decolonisation; civil rights, women's and liberation movements around the world."},
  [], L(wide=["india-empires/freedom-and-republic"], notes="hist:123,hist:125")),
]),
("world-today", "The world today", "World history", [
 ("connected-world", "A connected world", {
   3: "Phones, the internet and things made in many countries.",
   5: "Globalisation; the rise of China, India and other countries; the digital age and social media."},
  [], L(notes="hist:126,hist:128,hist:129,hist:132")),
 ("conflict-today", "Conflict and peace today", {
   5: "Told with care: terrorism and wars in our time; how people work for peace."},
  [], L(notes="hist:131")),
 ("environment-history", "People and the planet through history", {
   4: "How people changed forests, rivers and the climate over time.",
   5: "Environmental and climate history; sustainability debates; communities that protected nature (Chipko, Bishnois)."},
  [], L(wide=["sci:weather/climate-change"], notes="hist:130,hist:137")),
]),
("history-themes", "Themes across history", "World history", [
 ("money-and-work", "Money, work and trade through history", {
   4: "From barter to coins to digital money; farmers, craftspeople, factory workers.",
   5: "Economic history: farming societies, trade systems, capitalism; who owned land and who worked it."},
  [], L(wide=["math:money/money-in-life"], notes="hist:133,hist:134")),
 ("ideas-and-faiths", "Ideas, faiths and science through history", {
   5: "How philosophies, religions, science and technology shaped each other."},
  [], L(wide=["phil:knowing/knowledge"], notes="hist:135")),
 ("everyday-life", "Everyday life, families and fairness", {
   3: "How children, women and men lived in the past; games and homes long ago.",
   5: "Social history: gender roles, family structures, caste and class; how they changed."},
  [], L(wide=["sci:family/family"], notes="hist:136")),
 ("medicine-history", "Medicine and health through history", {
   4: "Ayurveda, Sushruta, Jenner and vaccines, the discovery of germs.",
   5: "Plagues and pandemics in history; public health; who got care and who didn't."},
  [], L(wide=["sci:health/how-diseases-spread"], notes="hist:138")),
]),
]
