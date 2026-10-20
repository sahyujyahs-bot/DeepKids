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
 2: [
  ('Biology', 'Structure and function', 'Main human organs by name and place (heart, lungs, brain, stomach)'),
  ('Biology', 'Life processes', 'Growing up: babies to adults in humans and animals'),
  ('Biology', 'Life processes', 'Seeds grow into plants; plant life cycle'),
  ('Biology', 'Life processes', 'Staying healthy: food, exercise, sleep, hygiene'),
  ('Biology', 'Ecosystems', 'Habitats: how plants and animals suit where they live'),
  ('Biology', 'Ecosystems', 'How humans affect local habitats'),
  ('Chemistry', 'Materials and their properties', 'Natural and made materials'),
  ('Chemistry', 'Materials and their properties', 'Properties and uses: waterproof, absorbent, see-through, bendy'),
  ('Chemistry', 'Changes to materials', 'Heating and cooling: melting and freezing'),
  ('Physics', 'Forces and energy', 'Moving on different surfaces and slopes'),
  ('Physics', 'Light and sound', 'Light travels from a source; seeing needs light'),
  ('Physics', 'Electricity and magnetism', 'Simple circuits: battery, wire, bulb'),
  ('Earth and space', 'Planet Earth', 'Kinds of rock and soil'),
  ('Earth and space', 'Cycles on Earth', 'Seasons and weather patterns'),
  ('Earth and space', 'Earth in space', 'The Sun seems to move across the sky'),
 ],
 3: [
  ('Biology', 'Structure and function', 'What roots, stems and leaves do; water moving up a plant'),
  ('Biology', 'Structure and function', 'Skeleton and muscles: support and movement'),
  ('Biology', 'Life processes', 'Seven life processes of living things'),
  ('Biology', 'Life processes', 'Plant growth and temperature'),
  ('Biology', 'Ecosystems', 'Sorting living things with simple keys'),
  ('Chemistry', 'Materials and their properties', 'Magnetic and non-magnetic materials'),
  ('Chemistry', 'Materials and their properties', 'Testing materials: strength, flexibility, absorbency'),
  ('Physics', 'Forces and energy', 'Forces have size and direction; friction'),
  ('Physics', 'Forces and energy', 'Magnets attract and repel'),
  ('Physics', 'Light and sound', 'Shadows: how they form and change'),
  ('Earth and space', 'Planet Earth', 'Rocks, soil and fossils'),
  ('Earth and space', 'Earth in space', 'Earth spins: day and night'),
 ],
 4: [
  ('Biology', 'Structure and function', 'Human skeleton, muscles and joints in detail'),
  ('Biology', 'Structure and function', 'Heart, blood and circulation (introduction)'),
  ('Biology', 'Life processes', 'Healthy diet: food groups and their jobs'),
  ('Biology', 'Ecosystems', 'Food chains: producers and consumers'),
  ('Biology', 'Ecosystems', 'Habitats and how they change; caring for them'),
  ('Chemistry', 'Materials and their structure', 'Solids, liquids and gases'),
  ('Chemistry', 'Changes to materials', 'Melting, freezing, boiling; reversible changes'),
  ('Physics', 'Light and sound', 'Sound: vibration, pitch and loudness; how sound travels'),
  ('Physics', 'Electricity and magnetism', 'Circuits, switches; conductors and insulators'),
  ('Earth and space', 'Planet Earth', 'Earth\'s layers; volcanoes and earthquakes'),
  ('Earth and space', 'Earth in space', 'Shape and size of Earth, Moon and Sun'),
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
    for strand, sub, t in CAM[lv]:
        ROWS.append([lv, lv, age, 'Cambridge Primary', f'Science 0097 · Stage {lv}', f'{strand}: {sub}', t, '', 'Verify vs framework'])
    for strand, sub, t in CAM_ALL:
        ROWS.append([lv, lv, age, 'Cambridge Primary', f'Science 0097 · Stage {lv}', strand, t, '', 'Verify vs framework'])
    nl = 'A' if lv <= 3 else 'B'
    for t in NIOS_ALL:
        ROWS.append([lv, lv, age, 'NIOS OBE', f'Level {nl} · Environmental Study', 'Theme', t,
                     'Level A ≈ Classes 1–3, Level B ≈ Classes 4–5; same theme list until lesson lists are added', 'Lesson list to add'])

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
ws.append(['Level', 'Class', 'Age', 'NCERT chapters', 'Cambridge topic areas', 'NIOS themes'])
for lv in range(1, 6):
    n = lambda b: sum(1 for r in ROWS if r[0] == lv and r[3] == b)
    ws.append([lv, lv, lv + 5, 0 if lv <= 2 else n('NCERT / CBSE'), n('Cambridge Primary'), n('NIOS OBE')])
style(ws, [8, 8, 6, 16, 22, 14], 0)

ws = wb.create_sheet('Notes')
for line in [
 'Science / EVS topics of NCERT, Cambridge Primary and NIOS for DeepKids Levels 1–5 (Classes 1–5, ages about 6–10).',
 'NCERT: "Our Wondrous World" Classes 3–5 (NCF 2023). Classes 1–2 have no EVS book. Chapter titles came from secondary listings; check against the NCERT PDFs.',
 'Cambridge: topic areas from the Science 0097 framework, grouped by strand and sub-strand and worded by us, not quoted. The framework site was unreachable, so check every row against the framework PDF.',
 'Cambridge also runs two strands through every stage: Thinking and working scientifically, and Science in context.',
 'NIOS: Open Basic Education Level A (about Classes 1–3) and Level B (about Classes 4–5). Only the theme list is in hand, so the same themes repeat; lesson-by-lesson lists still need adding.',
 'Upload the NCERT PDFs, the Cambridge 0097 framework and NIOS study material to a private repo and these rows can be checked and filled in.',
]: ws.append([line])
ws.column_dimensions['A'].width = 140
for c in ws['A']: c.alignment = Alignment(wrap_text=True)
wb.move_sheet('Notes', offset=-3)
wb.save(OUT); print(len(ROWS), os.path.abspath(OUT))
