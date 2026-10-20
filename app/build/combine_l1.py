import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

SRC = '/home/user/DeepKids/app/DeepKids_Board_Topics_Collated.xlsx'
OUT = '/home/user/DeepKids/app/DeepKids_Science_L1_Combined.xlsx'

wb0 = openpyxl.load_workbook(SRC, read_only=True)
DK = {}
for r in list(wb0['DeepKids Plus · Science L1'].iter_rows(values_only=True))[1:]:
    if r and r[0]:
        DK[r[0]] = dict(q=r[1], name=r[2], subs=r[6] or '', ncert=r[7] or '')

# Board items at Level 1 (Class 1 / Stage 1 / NIOS Level A). C = Cambridge 0097 Stage 1, N = NIOS A-102.
# Cambridge items are learning-objective areas from the 0097 framework, worded by us: verify against the framework PDF.
B = {
 'C-B1': ('Cambridge', 'Biology', 'Name the main parts of a plant: root, stem, leaf, flower'),
 'C-B2': ('Cambridge', 'Biology', 'Name the main outside parts of the human body and of animals'),
 'C-B3': ('Cambridge', 'Biology', 'Five senses and the body part for each: sight, hearing, touch, taste, smell'),
 'C-B4': ('Cambridge', 'Biology', 'Tell apart things that are living, things that were once living, and things that were never alive'),
 'C-B5': ('Cambridge', 'Biology', 'Plants need light and water to grow'),
 'C-B6': ('Cambridge', 'Biology', 'Animals, including humans, need food, water and air to stay alive'),
 'C-B7': ('Cambridge', 'Biology', 'Explore local habitats: which plants and animals live where'),
 'C-C1': ('Cambridge', 'Chemistry', 'Name everyday materials: wood, plastic, metal, glass, rock, paper, fabric'),
 'C-C2': ('Cambridge', 'Chemistry', 'Describe and sort materials by property: hard/soft, rough/smooth, shiny/dull, bendy/stiff'),
 'C-C3': ('Cambridge', 'Chemistry', 'One object can be made of more than one material'),
 'C-C4': ('Cambridge', 'Chemistry', 'Heating and cooling change some materials (ice melts, chocolate melts, water freezes)'),
 'C-P1': ('Cambridge', 'Physics', 'Pushes and pulls; forces can start, stop, speed up, slow down or turn things'),
 'C-P2': ('Cambridge', 'Physics', 'Squashing, bending, twisting and stretching change an object\'s shape'),
 'C-P3': ('Cambridge', 'Physics', 'Sources of sound; sound gets fainter as it travels away; we hear with our ears'),
 'C-P4': ('Cambridge', 'Physics', 'Sources of light; dark is the absence of light; we need light to see'),
 'C-P5': ('Cambridge', 'Physics', 'Things that use electricity (mains or battery); electricity can be dangerous'),
 'C-E1': ('Cambridge', 'Earth & space', 'Earth\'s surface is land and water; rocks and soil'),
 'C-E2': ('Cambridge', 'Earth & space', 'The Sun gives light and heat; never look straight at it; it seems to move across the sky'),
 'C-E3': ('Cambridge', 'Earth & space', 'Day and night; describe the weather and how it changes'),
 'C-T1': ('Cambridge', 'Thinking & working scientifically', 'Ask questions, predict, observe, sort and group, measure with simple units, record in drawings and tables'),
 'C-S1': ('Cambridge', 'Science in context', 'How science is used in everyday life; scientists past and present'),
 'N-1':  ('NIOS', 'Level A theme', 'Human existence and the body'),
 'N-2':  ('NIOS', 'Level A theme', 'Hygiene and health'),
 'N-3':  ('NIOS', 'Level A theme', 'Family and kinship'),
 'N-4':  ('NIOS', 'Level A theme', 'Respect for women and elders'),
 'N-5':  ('NIOS', 'Level A theme', 'Festivals'),
 'N-6':  ('NIOS', 'Level A theme', 'Planets and the sky'),
 'N-7':  ('NIOS', 'Level A theme', 'Weather'),
 'N-8':  ('NIOS', 'Level A theme', 'Basic needs and diet'),
 'N-9':  ('NIOS', 'Level A theme', 'Transport'),
 'N-10': ('NIOS', 'Level A theme', 'Communication'),
 'N-11': ('NIOS', 'Level A theme', 'Rights: education, information, consumer rights'),
}

# Pairs: DeepKids topic -> (board items, match, what the board adds that Plus lacks, what Plus adds beyond the board)
PAIRS = {
 'A1': (['C-B4'], 'Strong', '"Once living" as a third group (wood, paper, a dead leaf)', 'Questions whether the line is real: J.C. Bose, fire, dormant seeds, crystals, viruses, star elements'),
 'A3': (['C-C4'], 'Partial', 'Hands-on heating and cooling: melting and freezing everyday things', 'Same atoms in living and non-living; matter changing over time'),
 'A4': (['C-C1', 'C-C2', 'C-C3', 'C-E1'], 'Strong', 'Naming the standard materials; objects made of more than one material', 'Microscope views; soil life; water, tears and shadow as "materials"; is sound a material?'),
 'A5': (['C-B1', 'C-B5', 'C-B7'], 'Strong', 'Local habitats walk: who lives where', 'Fungi; full animal groups; humans are animals too; grow-a-seed project'),
 'B1': (['C-E1', 'N-6'], 'Partial', 'Planets and the sky at a simple naming level', 'Big Bang, mass and gravity, galaxies, black holes, dark matter'),
 'B2': (['N-3', 'N-4', 'N-5'], 'Partial', 'Respect for women and elders; festivals as lived culture', 'Why societies are the way they are: biology, upbringing, culture'),
 'B4': (['C-B2', 'C-B7'], 'Partial', 'Animal body parts in general', 'A whole world seen through birds: UV sight, magnetic sense, migration'),
 'B5': (['C-E2', 'C-E3', 'N-6', 'N-7'], 'Strong', 'Sun safety (never look at the Sun); daily weather log', 'Moon cycle, seasons and climate, stars and planets in the sky'),
 'B6': (['C-P1', 'C-P2', 'C-P3'], 'Strong', 'Shape change by squashing, bending, twisting, stretching', 'Normal force, air resistance, buoyancy; electromagnetism behind most forces; sound cannot travel in space'),
 'B7': (['C-P4'], 'Strong', '"Dark is the absence of light"', 'Shadows, reflections, mixing paint vs mixing light'),
 'B8': (['N-7'], 'Partial', 'Weather as daily life', 'Floods, droughts, storms, tsunamis, dry spells'),
 'B9': (['C-B7'], 'Partial', 'Caring for the local environment (verify: may sit in Stage 2)', 'Human impact as a whole topic'),
 'C3': (['N-1'], 'Partial', 'Human existence at a simple level', 'Species humans came from; a tour back in time'),
 'C4': (['C-B6'], 'Partial', 'Needs of animals and humans: food, water, air', 'Me and a dog, a bird, a plant: what we truly share'),
 'C6': (['N-3'], 'Strong', 'Kinship words and roles', 'Family tree with lifespans, traits, fingerprints, blood groups (parent-led); inclusive family options'),
 'C7': (['C-B2', 'N-1'], 'Strong', 'Naming outside body parts', 'How and why each part evolved'),
 'C8': (['C-B3'], 'Strong', 'The five senses with their organs', 'Senses beyond five (balance, hunger, heartbeat); senses in birds, bees, snakes, sharks, bats, plants'),
 'C10': (['N-2', 'C-P5'], 'Strong', 'Things at home that use electricity', 'How the body fights illness; are "I" and "my body" different?'),
 'C11': (['C-B6', 'N-8'], 'Strong', 'Basic needs beyond food: water, shelter, clothing', 'How the body breaks food down; shared amino acids, DNA and ATP across life'),
}
THREADS = {'C-T1': 'Little Scientist skills thread (observe, ask, predict, test, record)', 'C-S1': 'Two-lenses thread (scientists then and now, including J.C. Bose, Indian knowledge)'}
BOARD_GAP_IDEAS = {
 'N-9': 'Could be added to B2 (how humans live) or a new "How we move" topic with B6 forces',
 'N-10': 'Could be added to B2, or link to C9 (how do I think?) and B6 (sound)',
 'N-11': 'Values/civics, not science: better in a social studies or life-skills track',
}

used = {b for v in PAIRS.values() for b in v[0]}
plus_only = [k for k in DK if k not in PAIRS]
board_only = [k for k in B if k not in used]

# ---------- workbook
wb = openpyxl.Workbook()
HF = PatternFill('solid', fgColor='53A373'); HFont = Font(bold=True, color='FFFFFF')
PF = PatternFill('solid', fgColor='FFF1D6'); BF = PatternFill('solid', fgColor='E3F1F7')
thin = Side(style='thin', color='DDDDDD'); BD = Border(top=thin, bottom=thin, left=thin, right=thin)
WRAP = Alignment(wrap_text=True, vertical='top')

def sheet(ws, head, rows, widths, fills=None):
    ws.append(head)
    for c in ws[1]: c.fill = HF; c.font = HFont; c.alignment = WRAP; c.border = BD
    for r in rows: ws.append(r)
    for row in ws.iter_rows(min_row=2):
        for i, c in enumerate(row):
            c.alignment = WRAP; c.border = BD
            if fills and fills.get(i): c.fill = fills[i]
    for i, w in enumerate(widths): ws.column_dimensions[get_column_letter(i + 1)].width = w
    ws.freeze_panes = 'C2'

def bl(ids, who):
    return '\n'.join(f'• {B[i][2]}  ({B[i][1]})' for i in ids if B[i][0] == who) or '–'

ws = wb.active; ws.title = 'Combined topics'
rows = []
for k, (ids, m, badd, padd) in PAIRS.items():
    d = DK[k]
    rows.append([k, d['name'], m, d['subs'], bl(ids, 'Cambridge'), bl(ids, 'NIOS'), badd, padd, d['ncert']])
sheet(ws, ['ID', 'Topic', 'Match', 'Plus part (DeepKids)', 'Board part: Cambridge Stage 1', 'Board part: NIOS Level A', 'Board adds (Plus lacks)', 'Plus adds (beyond board)', 'NCERT later (Class 3–5)'],
      rows, [6, 30, 9, 55, 45, 28, 34, 40, 26], {3: PF, 4: BF, 5: BF})

ws = wb.create_sheet('Plus only')
sheet(ws, ['ID', 'Topic', 'Big question', 'Plus part (DeepKids)', 'NCERT later (Class 3–5)'],
      [[k, DK[k]['name'], DK[k]['q'], DK[k]['subs'], DK[k]['ncert']] for k in plus_only], [6, 34, 20, 70, 30], {3: PF})

ws = wb.create_sheet('Board only')
sheet(ws, ['Code', 'Board', 'Area', 'Board item', 'Where it could go'],
      [[k, B[k][0], B[k][1], B[k][2], THREADS.get(k) or BOARD_GAP_IDEAS.get(k, '')] for k in board_only], [7, 12, 26, 55, 55], {3: BF})

ws = wb.create_sheet('Notes')
for line in [
 'DeepKids Science Level 1 (age 6–7): Plus topics combined with board Level 1 topics.',
 'Boards at Level 1: Cambridge Primary Science 0097 Stage 1, and NIOS Level A Environmental Study (A-102) themes.',
 'NCERT has no EVS book for Class 1 (NCF 2023), so it has no board part here. The last column shows the Class 3–5 chapters each topic prepares for.',
 'NIOS Level A is roughly Classes 1–3 together, so its themes are a loose fit for Level 1.',
 'Cambridge items are learning-objective areas from the 0097 framework, worded by us. Check them against the framework PDF once it is in the repo.',
 'Match: Strong = the Plus topic fully covers the board item. Partial = they overlap; see "Board adds".',
 f'Counts: {len(PAIRS)} combined topics · {len(plus_only)} Plus-only topics · {len(board_only)} board-only items ({len(THREADS)} of them are skills threads, not topics).',
]: ws.append([line])
ws.column_dimensions['A'].width = 140
for c in ws['A']: c.alignment = Alignment(wrap_text=True)
wb.move_sheet('Notes', offset=-3)
wb.save(OUT)
print(len(PAIRS), plus_only, board_only)
