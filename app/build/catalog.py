# DeepKids board catalogue, Classes 1–5 (Levels 1–5, ages 6–10).
# NCERT titles were collected from several secondary listings plus CIET/NCERT pages surfaced in search
# (ncert.nic.in itself was unreachable from the build environment). Verify against the official PDFs.

LEVELS = {1: (1, 6), 2: (2, 7), 3: (3, 8), 4: (4, 9), 5: (5, 10)}  # level: (class, age)
SUBJECTS = {"math": "Maths", "eng": "English", "hin": "Hindi", "sci": "EVS / Science"}

NCERT = {
 ("math", 1): ("Joyful Mathematics", ["Finding the Furry Cat!", "What is Long?", "Mango Treat", "Making 10", "How Many?", "Vegetable Farm", "Lina's Family", "Fun with Numbers", "Utsav", "How do I Spend my Day?", "How Many Times?", "How Much Can We Spend?", "So Many Toys"]),
 ("math", 2): ("Joyful Mathematics", ["A Day at the Beach", "Shapes Around Us", "Fun with Numbers", "Shadow Story", "Playing with Lines", "Decoration for Festival", "Rani's Gift", "Grouping and Sharing", "Which Season Is It?", "Fun at the Fair", "Data Handling"]),
 ("math", 3): ("Maths Mela", ["What's in a Name?", "Toy Joy", "Double Century", "Vacation with My Nani Maa", "Fun with Shapes", "House of Hundreds – I", "Raksha Bandhan", "Fair Share", "House of Hundreds – II", "Fun at Class Party!", "Filling and Lifting", "Give and Take", "Time Goes On", "The Surajkund Fair"]),
 ("math", 4): ("Maths Mela", ["Shapes Around Us", "Hide and Seek", "Pattern Around Us", "Thousands Around Us", "Sharing and Measuring", "Measuring Length", "The Cleanest Village", "Weigh it, Pour it", "Equal Groups", "Elephants, Tigers, and Leopards", "Fun with Symmetry", "Ticking Clocks and Turning Calendar", "The Transport Museum", "Data Handling"]),
 ("math", 5): ("Maths Mela", ["We the Travellers – I", "Fractions", "Angles as Turns", "We the Travellers – II", "Far and Near", "The Dairy Farm", "Shapes and Patterns", "Weight and Capacity", "Coconut Farm", "Symmetrical Designs", "Grandmother's Quilt", "Racing Seconds", "Animal Jumps", "Maps and Locations", "Data Through Pictures"]),
 ("eng", 1): ("Mridang", ["Two Little Hands", "Greetings", "Picture Time", "The Cap Seller and the Monkeys", "A Farm", "Fun with Pictures", "The Food We Eat", "The Four Seasons", "Anandi's Rainbow"]),
 ("eng", 2): ("Mridang", ["My Bicycle", "Picture Reading", "It is Fun", "Seeing without Seeing", "Come Back Soon", "Between Home and School", "This is My Town", "A Show of Clouds", "My Name", "The Crow", "The Smart Monkey", "Little Drops of Water", "We are all Indians"]),
 ("eng", 3): ("Santoor", ["Colours", "Badal and Moti", "Best Friends", "Out in the Garden", "Talking Toys", "Paper Boats", "The Big Laddoo", "Thank God", "Madhu's Wish", "Night", "Chanda Mama Counts the Stars", "Chandrayaan"]),
 ("eng", 4): ("Santoor", ["Together We Can", "The Tinkling Bells", "Be Smart, Be Safe", "One Thing at a Time", "The Old Stag", "Braille", "Fit Body, Fit Mind, Fit Nation", "The Lagori Champions", "Hekko", "The Swing", "A Journey to the Magical Mountains", "Maheshwar"]),
 ("eng", 5): ("Santoor", ["Papa's Spectacles", "Gone with the Scooter", "The Rainbow", "The Wise Parrot", "The Frog", "What a Tank!", "Gilli Danda", "The Decision of the Panchayat", "Vocation", "Glass Bangles"]),
 ("hin", 1): ("Sarangi (सारंगी)", ["Meena ka Parivar", "Dada-Dadi", "Reena ka Din", "Rani Bhi", "Mithai", "Teen Sathi", "Waah Mere Ghode", "Khatre mein Saanp", "Aloo ki Sadak", "Jhoolam-Jhooli", "Bhutte", "Phooli Roti", "Mela", "Barkha aur Megha", "Holi", "Janamdin par Ped Lagao", "Hawa", "Kitni Pyaari Hai Ye Duniya", "Chaand ka Bachcha"]),
 ("hin", 2): ("Sarangi (सारंगी)", ["Neema ki Dadi", "Ghar", "Mala ki Chandi ki Payal", "Maa", "Thathu aur Main", "Cheenta", "Tillu Ji", "Teen Dost", "Duniya Rang-Birangi", "Kaun", "Baingani Jojo", "Toshiya ka Sapna", "Taalaab", "Beej", "Kisan", "Mooli", "Barsaat aur Mendhak", "Sher aur Choohe ki Dosti", "Out", "Chhupan-Chhupai", "Haathi Cycle Chala Raha Tha", "Chaar Dishayen", "Chanda Mama", "Gire Taal mein Chanda Mama", "Sabse Bada Chhata", "Baadal"]),
 ("hin", 3): ("Veena (वीणा)", ["सीखो", "चींटी", "कितने पैर?", "बया हमारी चिड़िया रानी!", "आम का पेड़", "बीरबल की खिचड़ी", "मित्र को पत्र", "चतुर गीदड़", "प्रकृति पर्व – फूलदेई", "रस्साकशी", "एक जादुई पिटारा", "अपना-अपना काम", "पेड़ों की अम्मा 'तिमक्का'", "किसान की होशियारी", "भारत", "चंद्रयान", "बोलने वाली माँद", "हम अनेक किंतु एक"]),
 ("hin", 4): ("Veena (वीणा)", ["Chidiya ka Geet", "Bagiche ka Ghongha", "Neem", "Hamara Aahar", "Aasman Gira", "Jaipur se Patra", "Nakli Heere", "Onam ke Rang", "Mithaiyon ka Sammelan", "Camera", "Kavita ka Kamaal", "Shatranj mein Maat", "Hamara Aditya"]),
 ("hin", 5): ("Veena (वीणा)", ["Kiran", "Nyay ki Kursi", "Chaand ka Kurta", "Sanken", "Sundariya", "Chatur Chitrakar", "Mera Bachpan", "Kaziranga Rashtriya Udyan ki Yatra", "Nyay", "Teen Machhliyan", "Hamare ye Kalamandir", "Ganga ki Kahani"]),
 ("sci", 3): ("Our Wondrous World", ["Family and Friends", "Going to the Mela", "Celebrating Festivals", "Getting to Know Plants", "Plants and Animals Live Together", "Living in Harmony", "Water – A Precious Gift", "Food We Eat", "Staying Healthy and Happy", "This World of Things", "Making Things", "Taking Charge of Waste"]),
 ("sci", 4): ("Our Wondrous World", ["Living Together", "Exploring Our Neighbourhood", "Nature Trail", "Growing Up with Nature", "Food for Health", "Happy and Healthy Living", "How Things Work", "How Things Are Made", "Different Lands, Different Lives", "Our Sky"]),
 ("sci", 5): ("Our Wondrous World", ["Water – The Essence of Life", "Journey of a River", "The Mystery of Food", "Our School – A Happy Place", "Our Vibrant Country", "Some Unique Places", "Energy – How Things Work", "Clothes – How Things are Made", "Rhythms of Nature", "Earth – Our Shared Home"]),
}
NCERT_NOTES = {("sci", 1): "No separate EVS book in Classes 1–2 (NCF 2023): EVS ideas sit inside the language and maths books.",
               ("sci", 2): "No separate EVS book in Classes 1–2 (NCF 2023): EVS ideas sit inside the language and maths books."}

# Which DeepKids Science Level 1 topics touch each NCERT EVS chapter (Classes 3–5).
NCERT_DK = {
 (3, 1): ["B2", "C6"], (3, 2): ["B2"], (3, 3): ["B2", "B5"], (3, 4): ["A5"], (3, 5): ["A5", "B4", "B9"], (3, 6): ["B9", "C4"],
 (3, 7): ["B8", "A4"], (3, 8): ["C11"], (3, 9): ["C10", "C7"], (3, 10): ["A4"], (3, 11): ["A4"], (3, 12): ["B10"],
 (4, 1): ["B2"], (4, 2): ["B2"], (4, 3): ["A5", "B4"], (4, 4): ["A5", "B9"], (4, 5): ["C11"], (4, 6): ["C10"], (4, 7): ["B6"],
 (4, 8): ["A4"], (4, 9): ["B8", "B2"], (4, 10): ["B5", "B1"],
 (5, 1): ["B8", "C12"], (5, 2): ["B8"], (5, 3): ["C11"], (5, 4): ["B2"], (5, 5): ["B2"], (5, 6): ["B8"], (5, 7): ["C12", "B6"],
 (5, 8): ["A4"], (5, 9): ["B5"], (5, 10): ["B9", "B1"],
}

# Cambridge Primary curriculum frameworks: strands are the same across Stages 1–6; content deepens by stage.
CAMBRIDGE = {
 "math": ("Cambridge Primary Mathematics (0096)", ["Number", "Geometry and Measure", "Statistics and Probability", "Thinking and Working Mathematically"]),
 "eng": ("Cambridge Primary English (0058)", ["Reading", "Writing", "Speaking and Listening"]),
 "sci": ("Cambridge Primary Science (0097)", ["Biology", "Chemistry", "Physics", "Earth and Space", "Thinking and Working Scientifically", "Science in Context"]),
}
CAMBRIDGE_DK = {"Biology": ["A1", "A5", "B3", "B4", "C1", "C4", "C7", "C8", "C11"], "Chemistry": ["A3", "A4", "B10"],
                "Physics": ["B6", "B7", "C10"], "Earth and Space": ["B1", "B5", "B8", "A4"],
                "Thinking and Working Scientifically": ["A1", "A4", "A5"], "Science in Context": ["B9", "C3", "B2"]}

# NIOS Open Basic Education: Level A ≈ Class 3, Level B ≈ Class 5, Level C ≈ Class 8.
NIOS_EVS_A = ["Human existence and the body", "Hygiene and health", "Family and kinship", "Respect for women and elders",
              "Festivals", "Planets and the sky", "Weather", "Basic needs and diet", "Transport", "Communication",
              "Rights: education, information, consumer rights"]
NIOS_DK = {"Human existence and the body": ["C7", "C3"], "Hygiene and health": ["C10"], "Family and kinship": ["C6", "B2"],
           "Respect for women and elders": ["B2"], "Festivals": ["B2", "B5"], "Planets and the sky": ["B1", "B5"], "Weather": ["B5", "B8"],
           "Basic needs and diet": ["C11", "C12"], "Transport": ["B2"], "Communication": ["B2"], "Rights: education, information, consumer rights": ["B2"]}
NIOS = {"sci": ("Environmental Study (A-102)", NIOS_EVS_A)}
NIOS_PENDING = {"math": "Mathematics", "eng": "Language: English", "hin": "Language: Hindi"}

def nios_level(level):
    return "A" if level <= 3 else "B"
