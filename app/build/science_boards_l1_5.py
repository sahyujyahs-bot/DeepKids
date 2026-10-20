# All board Science / EVS topics for DeepKids Levels 1–5 (Classes 1–5, ages 6–10), one sheet.
# Run from repo root: python3 app/build/science_boards_l1_5.py
import openpyxl, sys, os
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from boards import BOARDS
from ncert_evs_content import C as NC

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'DeepKids_Science_Board_Topics_L1-5.xlsx')

# Cambridge Primary Science 0097, Stages 1–5. Topic areas worded by us from the framework's sub-strands,
# because cambridgeinternational.org was unreachable. Check against the framework PDF before relying on them.
CAM = {
 1: [
  ('Biology', 'Structure and function', 'Parts of a plant: root, stem, leaf, flower'),
  ('Biology', 'Structure and function', 'Outside parts of the human body and of animals'),
  ('Biology', 'Structure and function', 'Five senses and their organs'),
  ('Biology', 'Life processes', 'Living, once living and never alive'),
  ('Biology', 'Life processes', 'What plants need: water and light'),
  ('Biology', 'Life processes', 'What animals and humans need: food, water, air'),
  ('Biology', 'Ecosystems', 'Local habitats: plants and animals around us'),
  ('Chemistry', 'Materials and their properties', 'Everyday materials: wood, plastic, metal, glass, rock, paper, fabric'),
  ('Chemistry', 'Materials and their properties', 'Sorting materials by property: hard/soft, rough/smooth, shiny/dull'),
  ('Chemistry', 'Changes to materials', 'Changing shape: squash, bend, twist, stretch'),
  ('Physics', 'Forces and energy', 'Pushes and pulls; starting, stopping, speeding up, turning'),
  ('Physics', 'Light and sound', 'Sources of sound; hearing; sound gets fainter further away'),
  ('Physics', 'Light and sound', 'Sources of light; dark is no light'),
  ('Physics', 'Electricity and magnetism', 'Things that use electricity; electrical safety'),
  ('Earth and space', 'Planet Earth', 'Land and water; rocks and soil'),
  ('Earth and space', 'Earth in space', 'The Sun: light and heat, never look at it'),
  ('Earth and space', 'Cycles on Earth', 'Day and night; daily weather'),
 ],
 5: [
  ('Biology', 'Structure and function', 'Flower parts; pollination and seed dispersal'),
  ('Biology', 'Life processes', 'Plant life cycle and what plants need to make food'),
  ('Biology', 'Life processes', 'Human life stages and changes'),
  ('Biology', 'Ecosystems', 'Microorganisms: helpful and harmful'),
  ('Chemistry', 'Materials and their structure', 'Mixtures and solutions; dissolving'),
  ('Chemistry', 'Changes to materials', 'Evaporation and condensation; the water cycle'),
  ('Chemistry', 'Changes to materials', 'Separating mixtures: sieving, filtering, evaporating'),
  ('Physics', 'Forces and energy', 'Measuring forces in newtons; gravity, air and water resistance'),
  ('Physics', 'Light and sound', 'Reflection; mirrors; how we see'),
  ('Physics', 'Forces and energy', 'Energy: forms and transfers'),
  ('Earth and space', 'Earth in space', 'The solar system; planets'),
  ('Earth and space', 'Cycles on Earth', 'Earth\'s orbit and tilt: years and seasons; Moon phases'),
 ],
}
# From the uploaded Learner's Books: unit -> (strands, topics). Stage 3 is the 1st edition (older framework).
BOOK = {
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
        book = BOARDS['ncert']['books'][lv - 3]
        for n, title, _ in book['chapters']:
            ROWS.append([lv, lv, age, 'NCERT / CBSE', book['title'], 'Ch ' + n, title, NC.get((lv, int(n)), {}).get('covers', ''), 'Titles: verify vs PDF'])
    if lv in BOOK:
        title, units = BOOK[lv]
        for u, strands, topics in units:
            ROWS.append([lv, lv, age, 'Cambridge Primary', title, u, u.split(' ', 1)[1], '; '.join(topics) + '  [' + strands + ']', 'From the book'])
    else:
        for strand, sub, t in CAM[lv]:
            ROWS.append([lv, lv, age, 'Cambridge Primary', f'Science 0097 · Stage {lv}', f'{strand}: {sub}', t, '', 'Verify: no book yet'])
    for strand, sub, t in CAM_ALL:
        ROWS.append([lv, lv, age, 'Cambridge Primary', f'Science 0097 · Stage {lv}', strand, t, '', 'Runs through every stage'])
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
    col = {b: [r[6] if b != 'Cambridge Primary' else f'{r[6]}  ({r[5].split(":")[0]})' for r in ROWS if r[0] == lv and r[3] == b]
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
ws.append(['Level', 'Class', 'Age', 'NCERT chapters', 'Cambridge units / topic areas', 'NIOS lessons'])
for lv in range(1, 6):
    n = lambda b: sum(1 for r in ROWS if r[0] == lv and r[3] == b)
    ws.append([lv, lv, lv + 5, 0 if lv <= 2 else n('NCERT / CBSE'), n('Cambridge Primary'), n('NIOS OBE')])
style(ws, [8, 8, 6, 16, 22, 14], 0)

ws = wb.create_sheet('Notes')
for line in [
 'Science / EVS topics of NCERT, Cambridge Primary and NIOS for DeepKids Levels 1–5 (Classes 1–5, ages about 6–10).',
 'NCERT: "Our Wondrous World" Classes 3–5 (NCF 2023). Classes 1–2 have no EVS book. Chapter titles came from secondary listings; check against the NCERT PDFs.',
 'Cambridge Stages 2 and 4: units and topics from the uploaded Learner\'s Books (2nd edition, current 0097 framework).',
 'Cambridge Stage 3: from the uploaded Learner\'s Book 3, 1st edition, which follows the older framework; the 2nd edition may group topics differently.',
 'Cambridge Stages 1 and 5: no book uploaded yet, so these rows are topic areas worded by us from the framework. Check them.',
 'Cambridge also runs two strands through every stage: Thinking and working scientifically, and Science in context.',
 'NIOS: Open Basic Education Level A (A 102) is "equivalent to Class 3" per the book, so its 12 lessons sit at Level 3. NIOS has nothing below Level A. Level B (≈ Class 5) book not uploaded yet.',
 'Still to upload: NCERT Our Wondrous World 3–5, Cambridge Learner\'s Books 1 and 5 (and 3, 2nd edition), NIOS Level B EVS.',
]: ws.append([line])
ws.column_dimensions['A'].width = 140
for c in ws['A']: c.alignment = Alignment(wrap_text=True)
wb.move_sheet('Notes', offset=-3)
wb.save(OUT); print(len(ROWS), os.path.abspath(OUT))
