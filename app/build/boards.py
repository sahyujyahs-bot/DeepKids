# Board catalogue for DeepKids Science Level 1 (age 6–7).
# NCERT chapter titles collected from multiple secondary listings (ncert.nic.in was unreachable): verify against the official PDFs.
NCERT_NOTE = "NCERT has no separate EVS book for Classes 1–2 (NCF 2023). Level 1 prepares for these Class 3–5 chapters of 'Our Wondrous World'."
BOARDS = {
 "ncert": {"name": "NCERT / CBSE", "books": [
   {"title": "Our Wondrous World · Class 3", "chapters": [
     ("1","Family and Friends",["B2","C6"]),("2","Going to the Mela",["B2"]),("3","Celebrating Festivals",["B2","B5"]),
     ("4","Getting to Know Plants",["A5"]),("5","Plants and Animals Live Together",["A5","B4","B9"]),("6","Living in Harmony",["B9","C4"]),
     ("7","Water – A Precious Gift",["B8","A4"]),("8","Food We Eat",["C11"]),("9","Staying Healthy and Happy",["C10","C7"]),
     ("10","This World of Things",["A4"]),("11","Making Things",["A4"]),("12","Taking Charge of Waste",["B10"])]},
   {"title": "Our Wondrous World · Class 4", "chapters": [
     ("1","Living Together",["B2"]),("2","Exploring Our Neighbourhood",["B2"]),("3","Nature Trail",["A5","B4"]),
     ("4","Growing Up with Nature",["A5","B9"]),("5","Food for Health",["C11"]),("6","Happy and Healthy Living",["C10"]),
     ("7","How Things Work",["B6"]),("8","How Things Are Made",["A4"]),("9","Different Lands, Different Lives",["B8","B2"]),("10","Our Sky",["B5","B1"])]},
   {"title": "Our Wondrous World · Class 5", "chapters": [
     ("1","Water — The Essence of Life",["B8","C12"]),("2","Journey of a River",["B8"]),("3","The Mystery of Food",["C11"]),
     ("4","Our School — A Happy Place",["B2"]),("5","Our Vibrant Country",["B2"]),("6","Some Unique Places",["B8"]),
     ("7","Energy — How Things Work",["C12","B6"]),("8","Clothes — How Things are Made",["A4"]),("9","Rhythms of Nature",["B5"]),("10","Earth — Our Shared Home",["B9","B1"])]},
 ], "note": NCERT_NOTE},
 "cambridge": {"name": "Cambridge Primary", "books": [
   {"title": "Science curriculum framework (0097) · Stages 1–2 strands", "chapters": [
     ("Bio","Biology: structure and function (body parts, plant parts)",["A5","C7","C8"]),
     ("Bio","Biology: life processes (living vs non-living, needs of living things)",["A1","A5","C11","C12"]),
     ("Bio","Biology: ecosystems (habitats, living things in local environment)",["A5","B4","B9"]),
     ("Chem","Chemistry: materials and their properties",["A4","A3"]),
     ("Chem","Chemistry: changes to materials",["A4","B10"]),
     ("Phys","Physics: forces and energy",["B6"]),("Phys","Physics: light and sound",["B6","B7"]),("Phys","Physics: electricity (safety, appliances)",["C10"]),
     ("E&S","Earth and space: planet Earth (land, water, rocks, soil)",["A4","B1"]),("E&S","Earth and space: cycles on Earth (day/night, seasons, weather)",["B5","B8"]),
     ("E&S","Earth and space: Earth in space (Sun, Moon, stars)",["B1","B5"]),
     ("TWS","Thinking and working scientifically (observe, predict, test, record)",["A1","A4","A5"])]},
 ], "note": "Cambridge publishes a framework, not one textbook. Learner's Books (e.g. Hodder, Cambridge University Press) organise these strands into units; unit names to be added."},
 "nios": {"name": "NIOS · Open Basic Education", "books": [
   {"title": "Level A · Environmental Study (A-102) themes", "chapters": [
     ("A","Human existence and the body",["C7","C3"]),("A","Hygiene and health",["C10"]),("A","Family and kinship",["C6","B2"]),
     ("A","Festivals and culture",["B2","B5"]),("A","Planets and the sky",["B1","B5"]),("A","Weather",["B5","B8"]),
     ("A","Basic needs and diet",["C11","C12"]),("A","Transport and communication",["B2"]),("A","Rights (education, information, consumer)",["B2"])]},
 ], "note": "Themes from the NIOS Level A course outline. Lesson-by-lesson titles to be added from NIOS study material."},
}
RES = {
 "A1":[("Book","A Seed Is Sleepy, Dianna Hutts Aston",""),("Visit","Acharya J.C. Bose Indian Botanic Garden, Howrah",""),("Watch","The Private Life of Plants (BBC, David Attenborough)",""),("Lesson","The King's Doubt: full game (cards + parent guide)","")],
 "A2":[("Book","The Story of Life: Evolution, Catherine Barr & Steve Williams",""),("Website","NASA Space Place: life in the universe","https://spaceplace.nasa.gov")],
 "A3":[("Book","Older Than the Stars, Karen C. Fox",""),("Website","PhET: Build an Atom (simulation)","https://phet.colorado.edu")],
 "A4":[("Make","Arvind Gupta Toys: science from everyday junk","https://www.arvindguptatoys.com"),("Website","PhET: Density (float or sink)","https://phet.colorado.edu")],
 "A5":[("Book","A Seed Is Sleepy, Dianna Hutts Aston",""),("Read","StoryWeaver (Pratham Books): free picture books on plants and animals","https://storyweaver.org.in"),("Visit","Any botanical garden, e.g. Lalbagh, Bengaluru","")],
 "B1":[("Website","NASA Space Place","https://spaceplace.nasa.gov"),("Book","Me and My Place in Space, Joan Sweeney",""),("Visit","Nehru Planetarium (Delhi / Mumbai)","")],
 "B2":[("Read","StoryWeaver: stories of children across India","https://storyweaver.org.in")],
 "B3":[("Watch","Microcosmos (1996 film)",""),("Make","Arvind Gupta Toys: simple magnifiers","https://www.arvindguptatoys.com")],
 "B4":[("Watch","Planet Earth: Birds of Paradise episode (BBC)",""),("Visit","Salim Ali Bird Sanctuary, Thattekad (Kerala) or a local lake","")],
 "B5":[("Website","NASA Space Place: Moon phases","https://spaceplace.nasa.gov"),("Make","Shadow-stick sundial","")],
 "B6":[("Book","The Way Things Work Now, David Macaulay",""),("Website","PhET: Forces and Motion Basics","https://phet.colorado.edu"),("Make","Arvind Gupta Toys: sound and force toys","https://www.arvindguptatoys.com")],
 "B7":[("Website","PhET: Color Vision","https://phet.colorado.edu"),("Visit","Shadow puppet show (Tholu Bommalata / Togalu Gombeyaata)","")],
 "B8":[("Website","India Meteorological Department: today's weather","https://mausam.imd.gov.in"),("Visit","A stepwell (e.g. Chand Baori, Rajasthan) or a local lake","")],
 "B9":[("Read","StoryWeaver: Jadav and the Tree-Place","https://storyweaver.org.in"),("Watch","The Elephant Whisperers (2022)",""),("Watch","Our Planet (2019)","")],
 "B10":[("Make","Arvind Gupta Toys: toys from trash","https://www.arvindguptatoys.com")],
 "C1":[("Website","Khan Academy: cells and microbes (older kids, parent prep)","https://www.khanacademy.org")],
 "C2":[("Make","Strawberry DNA extraction (lesson card)","")],
 "C3":[("Book","The Story of Life: Evolution, Catherine Barr & Steve Williams",""),("Visit","Bhimbetka rock shelters (Madhya Pradesh)","")],
 "C4":[("Watch","My Octopus Teacher (2020)","")],
 "C5":[("Watch","Jane Goodall documentaries (e.g. Jane, 2017)","")],
 "C7":[("Visit","Science centres: Nehru Science Centre Mumbai, Visvesvaraya Museum Bengaluru, National Science Centre Delhi","")],
 "C8":[("Book","What If You Had Animal Eyes?, Sandra Markle","")],
 "C10":[("Book","Germs Make Me Sick!, Melvin Berger","")],
 "C11":[("Read","StoryWeaver: food stories","https://storyweaver.org.in")],
 "C12":[("Watch","Blue Planet II: The Deep (BBC)","")],
}
WEEKS = {"A1":2,"A2":1,"A3":1,"A4":2,"A5":3,"B1":2,"B2":1,"B3":1,"B4":1,"B5":2,"B6":2,"B7":2,"B8":1,"B9":1,"B10":1,"C1":1,"C2":1,"C3":1,"C4":1,"C5":1,"C6":2,"C7":2,"C8":1,"C9":1,"C10":2,"C11":1,"C12":1}
