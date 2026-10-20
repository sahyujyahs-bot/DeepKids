# All board Science / EVS topics for DeepKids Levels 1–5 (Classes 1–5, ages 6–10), one sheet.
# Run from repo root: python3 app/build/science_boards_l1_5.py
import openpyxl, sys, os
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'DeepKids_Science_Board_Topics_L1-5.xlsx')

# NCERT "Our Wondrous World" (Reprint 2026-27), from the uploaded chapter PDFs: unit, chapter, covers (from each unit's Note to the Teacher).
NCERT = {
 3: [('Unit 1: Our Families and Communities', 'Family and Friends', 'Members of a family, how they are related, how they support each other, the joy of living together'),
     ('Unit 1: Our Families and Communities', 'Going to the Mela', 'Near and far family at the mela: materials, people, activities; how families in a community help each other'),
     ('Unit 1: Our Families and Communities', 'Celebrating Festivals', 'Food, dress and cultural practices at festivals; people of all ages celebrating together'),
     ('Unit 2: Life Around Us', 'Getting to Know Plants', 'Variety of plants around us, their features, uses and importance; what a plant needs and how to care for it'),
     ('Unit 2: Life Around Us', 'Plants and Animals Live Together', 'How plants and animals support each other; animals around us, their habits and habitats'),
     ('Unit 2: Life Around Us', 'Living in Harmony', 'We are connected to plants and animals near and far; kindness to all living beings'),
     ('Unit 3: Gifts of Nature', 'Water — A Precious Gift', 'Rain, storing and cleaning water, using it at home, problems of water quality and quantity, saving water'),
     ('Unit 3: Gifts of Nature', 'Food We Eat', 'Why food matters for health; foods from many sources; nutrients; traditional knowledge of healthy eating'),
     ('Unit 3: Gifts of Nature', 'Staying Healthy and Happy', 'Hygiene and cleanliness at home and around us; regular exercise and yoga; physical and emotional well-being'),
     ('Unit 4: Things Around Us', 'This World of Things', 'What things are made of, where they come from, natural vs made by people, properties of materials'),
     ('Unit 4: Things Around Us', 'Making Things', 'Materials and their uses; houses built from natural resources; new designs; safety rules'),
     ('Unit 4: Things Around Us', 'Taking Charge of Waste', 'Throwing and sorting waste correctly; reuse and recycling; clean and safe homes and neighbourhoods')],
 4: [('Unit 1: Our Community', 'Living Together', 'Community as togetherness and interdependence; Van Mahotsav and caring for shared spaces; sharing in festivals'),
     ('Unit 1: Our Community', 'Exploring Our Neighbourhood', 'Transport and communication then and now; community institutions; banks and money basics; drawing and reading maps, directions'),
     ('Unit 2: Life Around Us', 'Nature Trail', 'Variety of plants and animals and their features; birds and leaves; the web of life; caring for nature'),
     ('Unit 2: Life Around Us', 'Growing up with Nature', 'Nature and culture in daily life; unique trees and flowers; tribal art; medicinal plants; sustainable living'),
     ('Unit 3: Health and Well-being', 'Food for Health', 'Food festival; balanced food: energy-giving, body-building, protective foods; traditional foods'),
     ('Unit 3: Health and Well-being', 'Happy and Healthy Living', 'Journey of a grain and gratitude; not wasting food; mindful eating, exercise, rest; a safe environment'),
     ('Unit 4: Things Around Us', 'How Things Work', 'Hands-on with toys and paper: spinning, floating and sinking; finding patterns in how things work'),
     ('Unit 4: Things Around Us', 'How Things are Made', 'Making handmade paper from pulp; how paper is made; the 5Rs of waste'),
     ('Unit 5: Our Environment', 'Different Lands, Different Lives', 'Plains, deserts, coasts and mountains: how land shapes food, clothes, houses, festivals, plants and animals'),
     ('Unit 5: Our Environment', 'Our Sky', 'Sun, Moon and stars; sky-related festivals and practices; shadows at different times of day and why their length changes')],
 5: [('Unit 1: Life Around Us', 'Water — The Essence of Life', 'Forms and sources of water (fresh and salt); uses; the water cycle; water shaping land; freshwater habitats; conservation'),
     ('Unit 1: Life Around Us', 'Journey of a River', 'The Godavari from source to delta: tributaries, river life, dams, pollution; rivers support ecosystems, people and culture'),
     ('Unit 2: Health and Well-being', 'The Mystery of Food', 'How microbes spoil food; preservation methods and their culture; good microbes; storage and hygiene'),
     ('Unit 2: Health and Well-being', 'Our School — A Happy Place', 'A green school: waste, water, trees; kindness, respect and positive behaviour'),
     ('Unit 3: Incredible India', 'Our Vibrant Country', 'Republic Day, national symbols, currency, languages, clothing, dance and music; unity in diversity'),
     ('Unit 3: Incredible India', 'Some Unique Places', 'Ecological regions of India; unique landscapes; rare and endemic species; traditional knowledge'),
     ('Unit 4: Things Around Us', 'Energy — How Things Work', 'Energy in everyday life; forms of energy at home and in society; how energy makes things work; clean and efficient energy'),
     ('Unit 4: Things Around Us', 'Clothes — How Things are Made', 'From birds weaving nests to spinning, weaving and stitching; handloom and embroidery; reuse and recycling'),
     ('Unit 5: Our Amazing Planet', 'Rhythms of Nature', 'Day and night, seasons, and how plants, animals, people and places change; nature journaling'),
     ('Unit 5: Our Amazing Planet', 'Earth — Our Shared Home', 'Earth as a connected living planet; sharing nature, knowledge and culture; Vasudhaiva Kutumbakam')],
}
# From the uploaded Learner's Books: unit -> (strands, topics). Stages 1 and 3 are 1st editions (older framework).
BOOK = {
 1: ("Cambridge Primary Science Learner's Book 1 (1st ed., older framework)", [
  ('1 Being alive', 'Biology', ['Animals and plants alive!', 'Local environments', 'Animal babies', 'Healthy food and drink']),
  ('2 Growing plants', 'Biology', ['Plant parts', 'Growing seeds', 'Plants and light']),
  ('3 Ourselves', 'Biology', ['We are similar', 'We are different', 'Our bodies', 'Our fantastic senses']),
  ('4 Materials in my world', 'Chemistry', ['What is it made of?', 'Using materials', 'Sorting materials']),
  ('5 Pushes and pulls', 'Physics', ['In the playground', 'How toys work', 'Pushes and pulls around us', 'Changing movement']),
  ('6 Hearing sounds', 'Physics', ['Where do sounds come from?', 'Our ears', 'Sounds move'])]),
 2: ("Cambridge Primary Science Learner's Book 2 (2nd ed.)", [
  ('1 Environments and habitats', 'Biology: structure and function, life processes', ['Habitats', 'Plants in different habitats', 'Animals in different habitats', 'Rocks and the environment', 'How can we care for our environment?']),
  ('2 Forces and movement', 'Physics: forces and energy', ['Forces around us', 'Changing shape', 'Changing speed', 'Changing direction']),
  ('3 Getting materials right', 'Chemistry: materials, properties, changes', ['Natural and made materials', 'Properties of materials', 'Using the right material', 'Testing materials', 'Changing materials']),
  ('4 Humans and animals grow', 'Biology: structure and function, life processes', ['Comparing animals', 'Growing', 'Inheriting characteristics', 'Keeping healthy', 'Teeth']),
  ('5 Light', 'Physics: light and sound', ['Light sources', 'Darkness', 'The Sun appears to move!']),
  ('6 Electricity', 'Physics: electricity and magnetism', ['Where do we use electricity?', 'Keep safe with electricity', 'Making circuits'])]),
 3: ("Cambridge Primary Science Learner's Book 3 (1st ed., older framework)", [
  ('1 Looking after plants', 'Biology', ['Plants and their parts', 'Plants need light and water', 'Transporting water', 'Plant growth and temperature']),
  ('2 Looking after ourselves', 'Biology', ['Food groups', 'A healthy diet', 'An unhealthy diet', 'Exercise and sleep']),
  ('3 Living things', 'Biology', ['Living and non-living', 'Growth and nutrition', 'Movement and reproduction', 'Sorting humans', 'Sorting living things']),
  ('4 Our five senses', 'Biology', ['Hearing and touch', 'Taste and smell', 'Sight']),
  ('5 Investigating materials', 'Chemistry', ['Properties of materials', 'Sorting materials', 'Uses of materials', 'Testing materials', 'Magnetic materials']),
  ('6 Forces and movement', 'Physics', ['Push and pull', 'Changing shape', 'How big is that force?', 'Forcemeters', 'Friction'])]),
5: ("Cambridge Primary Science Learner's Book 5 (2nd ed.)", [
  ('1 Life cycles of flowering plants', 'Biology: structure and function, life processes', ['Flowering and non-flowering plants', 'Pollination, fruits and seeds', 'How seeds are spread', 'Seed germination']),
  ('2 Sound', 'Physics: light and sound', ['How are sounds made?', 'Volume and pitch', 'Changing the volume of sound', 'Changing the pitch of sound']),
  ('3 States and properties of matter', 'Chemistry: structure, properties, changes', ['Gases', 'Properties of water', 'Evaporation and condensation', 'Solutions']),
  ('4 The digestive system', 'Biology: structure and function', ['Parts and functions of the digestive system', 'Balanced diets']),
  ('5 Forces and magnetism', 'Physics: forces and energy, electricity and magnetism', ['Gravity, normal forces and applied forces', 'Gravity and satellites', 'Friction, air resistance, water resistance and upthrust', 'Multiple forces', 'Magnets and magnetic materials', 'Magnetic force']),
  ('6 Seasons and adaptations of plants and animals', 'Earth and space: Earth in space; Biology: ecosystems', ['The Earth moves around the Sun', 'Seasonal changes', 'Plants and animals are adapted to different environments', 'Adaptations of predators and prey'])]),
 4: ("Cambridge Primary Science Learner's Book 4 (2nd ed.)", [
  ('1 Living things', 'Biology: structure and function, life processes', ['Bones and skeletons', 'Why we need a skeleton', 'Skeletons and movement', 'Different kinds of skeletons', 'Medicines and infectious diseases']),
  ('2 Energy', 'Physics: forces and energy; Biology: ecosystems', ['Energy around us', 'Energy transfers', 'Energy changes', 'Energy and living things']),
  ('3 Materials', 'Chemistry: structure, properties, changes', ['Materials, substances and particles', 'How do solids and liquids behave?', 'Melting and solidifying', 'Chemical reactions']),
  ('4 Earth and its habitats', 'Earth and space: planet Earth; Biology: ecosystems', ['The structure of the Earth', 'Volcanoes', 'Earthquakes', 'Different habitats']),
  ('5 Light', 'Physics: light and sound; Earth and space: Earth in space', ['How we see things', 'Light travels in straight lines', 'Light reflects off different surfaces', 'Light in the solar system', 'Day and night', 'Investigating shadow lengths']),
  ('6 Electricity', 'Physics: electricity and magnetism', ['Which materials conduct electricity?', 'Does water conduct electricity?', 'Using conductors and insulators in electrical appliances', 'Switches', 'Changing the number of components in a circuit'])]),
}
# NIOS OBE Level A (A 102), "Equivalent to Class 3", from the uploaded book (2016): lesson -> "We will learn in this lesson".
NIOS_A = [
 ('1', 'Concept of Family and Interpersonal Relations', 'The family; relations in a family; parents\' responsibility to children; status of girls and women'),
 ('2', 'Our Social Environment', 'Professions around us and respect for them; public services; family, neighbourhood and community in society'),
 ('3', 'Our Festivals', 'Festivals across India and of different religions; national festivals'),
 ('4', 'The Environment', 'What environment means; physical and biological; plants and animals; natural and man-made non-living things'),
 ('5', 'Conservation of Environment', 'Useful animals and their care; plant parts and uses; food chain and food web; conserving the environment and water'),
 ('6', 'Sun-Moon-Stars, Day-Night and Seasons', 'Sun, Moon and stars; stars vs planets; Sun and planets; day and night; seasons'),
 ('7', 'Our Basic Needs', 'Air, water, food, clothing and shelter: why we need them and how to take care'),
 ('8', 'Food', 'Why we eat; parts of food and their jobs; balanced food; food safety'),
 ('9', 'Care and cleanliness of external organs', 'External organs and their jobs; cleanliness and care, including private parts'),
 ('10', 'Transport and Communication', 'How they developed; kinds; benefits; road signs; effect on the environment'),
 ('11', 'National Identity', 'National flag and its colours; national days; anthem and song; national symbols, animal, bird, sport'),
 ('12', 'Our Social and Economic Environment', 'Globalisation; Right to Education; Right to Information; MNREGA'),
]
CAM_ALL = [('Thinking and working scientifically', 'Every stage', 'Ask, predict, plan a fair test, observe, measure, record, conclude (grows each stage)'),
           ('Science in context', 'Every stage', 'Science in daily life; scientists past and present; caring for the environment')]

NIOS_ALL = ['Human existence and the body', 'Hygiene and health', 'Family and kinship', 'Respect for women and elders', 'Festivals',
            'Planets and the sky', 'Weather', 'Basic needs and diet', 'Transport', 'Communication', 'Rights: education, information, consumer rights']

ROWS = []  # level, class, age, board, book, unit/strand, topic, covers, confidence
for lv in range(1, 6):
    age = lv + 5
    if lv <= 2:
        ROWS.append([lv, lv, age, 'NCERT / CBSE', '(no EVS book)', '', 'No EVS book in Classes 1–2 (NCF 2023)',
                     'EVS ideas sit inside the English (Mridang), Hindi (Sarangi) and Maths (Joyful Mathematics) books', 'Confirmed'])
    else:
        for i, (unit, title, cov) in enumerate(NCERT[lv], 1):
            ROWS.append([lv, lv, age, 'NCERT / CBSE', f'Our Wondrous World · Class {lv}', f'{unit} · Ch {i}', title, cov, 'From the book'])
    title, units = BOOK[lv]
    for u, strands, topics in units:
        for i, t in enumerate(topics, 1):
            ROWS.append([lv, lv, age, 'Cambridge Primary', title, f'Unit {u} · {u.split()[0]}.{i}', t, strands, 'From the book'])
    for strand, sub, t in CAM_ALL:
        ROWS.append([lv, lv, age, 'Cambridge Primary', f'All stages', strand, t, '', 'Runs through every stage'])
    if lv == 3:
        for n, t, cov in NIOS_A:
            ROWS.append([lv, lv, age, 'NIOS OBE', 'Level A · Environmental Studies (A 102), ≈ Class 3', 'Lesson ' + n, t, cov, 'From the book'])
    elif lv < 3:
        ROWS.append([lv, lv, age, 'NIOS OBE', '(no level)', '', 'NIOS starts at Level A (≈ Class 3)', 'Level 1–2 work prepares for Level A', 'From the book'])
    else:
        ROWS.append([lv, lv, age, 'NIOS OBE', 'Level B · Environmental Studies, ≈ Class 5', '', 'Level B book not uploaded yet', 'Upload the Level B EVS book to fill this in', 'To add'])

# ---------- workbook
wb = openpyxl.Workbook()
HF = PatternFill('solid', fgColor='53A373'); HFont = Font(bold=True, color='FFFFFF')
LF = {1: 'FFF6D6', 2: 'FFE9DA', 3: 'FDE4EE', 4: 'E6E8F6', 5: 'E3F3EC'}
thin = Side(style='thin', color='DDDDDD'); BD = Border(top=thin, bottom=thin, left=thin, right=thin)
WRAP = Alignment(wrap_text=True, vertical='top')

def style(ws, widths, level_col=None):
    for c in ws[1]: c.fill = HF; c.font = HFont; c.alignment = WRAP; c.border = BD
    for row in ws.iter_rows(min_row=2):
        lv = row[level_col].value if level_col is not None else None
        for c in row:
            c.alignment = WRAP; c.border = BD
            if lv in LF: c.fill = PatternFill('solid', fgColor=LF[lv])
    for i, w in enumerate(widths): ws.column_dimensions[get_column_letter(i + 1)].width = w
    ws.freeze_panes = 'A2'; ws.auto_filter.ref = ws.dimensions

ws = wb.active; ws.title = 'All topics'
ws.append(['Level', 'Class', 'Age', 'Board', 'Book / framework', 'Chapter / strand', 'Topic', 'What it covers', 'Check'])
for r in ROWS: ws.append(r)
style(ws, [7, 7, 6, 16, 30, 32, 48, 60, 18], 0)

# side by side: one block per level, boards as columns
ws = wb.create_sheet('Side by side')
ws.append(['Level · Class · Age', 'NCERT / CBSE', 'Cambridge Primary', 'NIOS OBE'])
for lv in range(1, 6):
    col = {b: [r[6] if b != 'Cambridge Primary' else f'{r[5].split(" · ")[-1]} {r[6]}' if r[8] == 'From the book' else r[6] for r in ROWS if r[0] == lv and r[3] == b]
           for b in ('NCERT / CBSE', 'Cambridge Primary', 'NIOS OBE')}
    if lv >= 3: col['NCERT / CBSE'] = [f'{i+1}. {t}' for i, t in enumerate(col['NCERT / CBSE'])]
    h = max(len(v) for v in col.values())
    for i in range(h):
        ws.append([f'Level {lv} · Class {lv} · Age {lv+5}' if i == 0 else lv] +
                  [col[b][i] if i < len(col[b]) else '' for b in ('NCERT / CBSE', 'Cambridge Primary', 'NIOS OBE')])
style(ws, [22, 40, 60, 40], None)
for row in ws.iter_rows(min_row=2):
    v = row[0].value; lv = v if isinstance(v, int) else int(str(v).split()[1])
    for c in row: c.fill = PatternFill('solid', fgColor=LF[lv])
    if isinstance(v, int): row[0].value = ''
    else: row[0].font = Font(bold=True)

ws = wb.create_sheet('Counts')
ws.append(['Level', 'Class', 'Age', 'NCERT chapters', 'Cambridge topics', 'NIOS lessons'])
for lv in range(1, 6):
    n = lambda b: sum(1 for r in ROWS if r[0] == lv and r[3] == b and r[8] == 'From the book' and r[4] != '(no level)')
    ws.append([lv, lv, lv + 5, n('NCERT / CBSE'), n('Cambridge Primary'), n('NIOS OBE')])
style(ws, [8, 8, 6, 16, 22, 14], 0)

ws = wb.create_sheet('Notes')
for line in [
 'Science / EVS topics of NCERT, Cambridge Primary and NIOS for DeepKids Levels 1–5 (Classes 1–5, ages about 6–10).',
 'NCERT: "Our Wondrous World" Classes 3–5 (NCF-SE 2023, Reprint 2026-27), from the uploaded chapter PDFs. "What it covers" summarises each unit\'s Note to the Teacher. Classes 1–2 have no EVS book.',
 'Cambridge: units and topics from the uploaded Learner\'s Books. Books 2, 4 and 5 are 2nd editions (current 0097 framework). Books 1 and 3 are 1st editions (older framework), so the 2nd editions may group topics differently.',
 'Book 5 prints the strand column of units 4–6 shifted; strands here are matched to the topics.',
 'Cambridge also runs two strands through every stage: Thinking and working scientifically, and Science in context.',
 'NIOS: Open Basic Education Level A (A 102) is "equivalent to Class 3" per the book, so its 12 lessons sit at Level 3. NIOS has nothing below Level A. Level B (≈ Class 5) book not uploaded yet.',
 'Still to upload if wanted: Cambridge Learner\'s Books 1 and 3 (2nd edition), NIOS Level B Environmental Studies.',
]: ws.append([line])
ws.column_dimensions['A'].width = 140
for c in ws['A']: c.alignment = Alignment(wrap_text=True)
wb.move_sheet('Notes', offset=-3)
wb.save(OUT); print(len(ROWS), os.path.abspath(OUT))
