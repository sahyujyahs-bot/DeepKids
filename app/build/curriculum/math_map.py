"""DeepKids Combined Maths: topics -> subtopics -> levels (L1-L5, level n is taught in Class n).
Same shape as sci_map.py. Board chapter keys:
  N3-7   NCERT Class 3 (Maths Mela) Chapter 7. A trailing "?" means the chapter's content is mapped from its
         title and the book's known sequence and should be checked against the book.
  C3-Nc  Cambridge Primary Maths (0096) Stage 3, sub-strand: Nc counting and sequences, Ni integers and powers
         (calculation), Nm money, Np place value/ordering/rounding, Nf fractions/decimals/percentages/ratio,
         Gt time, Gg geometrical reasoning/shapes/measurement, Gp position and transformation,
         Ss statistics, Sp probability, TWM thinking and working mathematically.
NIOS OBE maths (Levels A-C) is not listed lesson by lesson yet.
"""
L = lambda **k: k
CAM_STRAND = {"Nc": 1, "Ni": 1, "Nm": 1, "Np": 1, "Nf": 1, "Gt": 2, "Gg": 2, "Gp": 2, "Ss": 3, "Sp": 3, "TWM": 4}  # cam|math|stage|unit

TOPICS = [
# ======================= NUMBER =======================
("number-sense", "Numbers and place value", "Number", [
 ("counting", "Counting", {
   1: "Counting objects to 20 and beyond; one number for each object; counting on and back; skip counting in 2s.",
   2: "Counting to 100 in 1s, 2s, 5s and 10s; counting groups; estimating then counting."},
  ["N1-3", "N1-4", "N1-5", "C1-Nc", "C2-Nc", "N2-1?"], L(deep=["number-sense/place-value"], wide=["data/sorting-and-tallies"])),
 ("place-value", "Place value", {
   1: "Numbers 10 to 20 and up to 99: tens and ones with bundles of sticks.",
   2: "Numbers to 100: tens and ones; number names; the number line.",
   3: "Numbers to 999 (and 1000): hundreds, tens and ones; House of Hundreds.",
   4: "Numbers to 9999 and beyond: thousands; reading and writing large numbers.",
   5: "Large numbers in lakhs and in thousands (Indian and international systems); place value to 1,00,000 and beyond."},
  ["N1-8", "N1-13?", "N2-3", "N3-3", "N3-6", "N4-4", "N5-1", "C1-Np", "C2-Np", "C3-Np", "C4-Np", "C5-Np"], L(pre=["number-sense/counting"], deep=["number-sense/big-numbers"])),
 ("comparing-ordering", "Comparing and ordering numbers", {
   1: "More, fewer, same; bigger and smaller numbers.",
   2: "Comparing numbers to 100 with < > =; ordering.",
   3: "Comparing and ordering 3-digit numbers; the number line.",
   4: "Ordering 4- and 5-digit numbers; rounding to the nearest 10 and 100.",
   5: "Comparing large numbers; rounding to the nearest 1000; estimating."},
  ["N1-5", "C1-Np", "C2-Np", "C3-Np", "C4-Np", "C5-Np"], L(pre=["number-sense/place-value"], wide=["number-sense/estimation"])),
 ("estimation", "Estimating", {
   2: "About how many? Estimating then counting to check.",
   4: "Rounding to estimate answers; is my answer sensible?",
   5: "Estimating large quantities and distances; Fermi questions for children."},
  ["C4-Np", "C5-Np", "N5-5?"], L(pre=["number-sense/comparing-ordering"], wide=["measurement-basics/estimation-and-precision"], src="notes")),
 ("odd-even", "Odd and even numbers", {
   2: "Pairs and odd ones out; odd and even numbers to 20.",
   3: "Odd and even numbers to 100; patterns when adding odd and even."},
  ["C2-Nc", "C3-Nc"], L(pre=["number-sense/counting"], deep=["factors-multiples/factors-and-multiples"])),
 ("zero", "Zero", {
   1: "Zero means nothing; zero on the number line.",
   3: "Zero as a placeholder; India's gift of zero; adding and multiplying by zero."},
  [], L(wide=["number-sense/history-of-numbers"], src="notes")),
 ("history-of-numbers", "The story of numbers", {
   3: "Tally marks, Egyptian and Roman numerals, Brahmi numerals, our Hindu-Arabic digits.",
   5: "How the place-value system travelled from India to the world; numbers in other bases."},
  [], L(pre=["number-sense/place-value"], src="notes")),
 ("big-numbers", "Very big numbers", {
   4: "How big is a million? Counting grains, stars and people.",
   5: "Lakhs, crores, millions, billions; powers of ten in simple words; the size of the universe."},
  ["N5-1"], L(pre=["number-sense/place-value"], deep=["number-sense/infinity"], src="notes")),
 ("negative-numbers", "Negative numbers", {
   4: "Numbers below zero: thermometers and lifts; the number line both ways.",
   5: "Ordering negative numbers; temperature differences."},
  ["C4-Ni", "C5-Ni"], L(pre=["number-sense/comparing-ordering"], wide=["temperature/reading-thermometers"])),
 ("infinity", "Infinity", {
   3: "Numbers never end; is there a biggest number?",
   5: "Infinity is an idea, not a number; endless halving; endless patterns."},
  [], L(pre=["number-sense/place-value"], wide=["number-sense/big-numbers"], src="notes")),
]),
("addition-subtraction", "Addition and subtraction", "Number", [
 ("meaning", "Putting together and taking away", {
   1: "Adding as putting together, subtracting as taking away; numbers to 10 and 20 with objects.",
   2: "Addition and subtraction as inverses; missing-number problems."},
  ["N1-4", "N1-6", "N1-7?", "C1-Ni", "C2-Ni"], L(pre=["number-sense/counting"], deep=["addition-subtraction/number-facts"])),
 ("number-facts", "Number facts and bonds", {
   1: "Number bonds to 10 (Making 10); doubles.",
   2: "Number bonds to 20 and 100; adding and subtracting 10."},
  ["N1-4", "C1-Ni", "C2-Ni"], L(pre=["addition-subtraction/meaning"], deep=["addition-subtraction/written-methods"])),
 ("mental-strategies", "Mental strategies", {
   2: "Counting on, bridging through 10, near doubles.",
   3: "Adding and subtracting 2-digit numbers mentally.",
   4: "Compensating, partitioning, using known facts.",
   5: "Mental methods with larger numbers; choosing a strategy."},
  ["C2-Ni", "C3-Ni", "C4-Ni", "C5-Ni"], L(pre=["addition-subtraction/number-facts"], wide=["addition-subtraction/written-methods"])),
 ("written-methods", "Adding and subtracting bigger numbers", {
   2: "2-digit addition and subtraction with and without regrouping.",
   3: "3-digit addition and subtraction with regrouping; Give and Take.",
   4: "4-digit addition and subtraction; checking with the inverse.",
   5: "Adding and subtracting large numbers (travel distances, populations)."},
  ["N2-1?", "N3-4?", "N3-9", "N3-12", "N4-7?", "N5-4", "C2-Ni", "C3-Ni", "C4-Ni", "C5-Ni"], L(pre=["number-sense/place-value", "addition-subtraction/number-facts"])),
 ("word-problems", "Word problems and stories", {
   1: "Story sums with objects and pictures.",
   3: "Two-step word problems; choosing add or subtract.",
   5: "Multi-step problems from real life."},
  ["N1-6", "N3-12", "C1-TWM", "C3-TWM", "C5-TWM"], L(pre=["addition-subtraction/meaning"], wide=["logic/problem-solving"])),
]),
("multiplication", "Multiplication", "Number", [
 ("equal-groups", "Equal groups and repeated addition", {
   2: "Equal groups; grouping and sharing; repeated addition; arrays.",
   3: "Multiplication as equal groups (Raksha Bandhan); arrays and skip counting."},
  ["N2-8", "N3-7", "C2-Ni", "C3-Ni"], L(pre=["addition-subtraction/meaning"], deep=["multiplication/multiplication-facts"], wide=["division/sharing-and-grouping"])),
 ("multiplication-facts", "Multiplication tables", {
   3: "Tables of 2, 3, 4, 5 and 10; patterns in tables.",
   4: "Tables to 10 × 10; multiplying by 10 and 100; Equal Groups.",
   5: "Recall to 12 × 12; using facts to multiply larger numbers."},
  ["N3-7", "N4-9", "N4-13?", "C3-Ni", "C4-Ni", "C5-Ni"], L(pre=["multiplication/equal-groups"], deep=["multiplication/multi-digit"], wide=["patterns/number-patterns"])),
 ("multi-digit", "Multiplying bigger numbers", {
   4: "2-digit × 1-digit; grid method.",
   5: "3-digit × 2-digit; the standard method; The Dairy Farm."},
  ["N5-6", "C4-Ni", "C5-Ni"], L(pre=["multiplication/multiplication-facts", "number-sense/place-value"])),
 ("properties", "Properties of operations", {
   3: "Order doesn't matter for adding and multiplying (commutative).",
   5: "Commutative, associative and distributive laws in simple words; using them to calculate; order of operations (brackets first)."},
  ["C3-Ni", "C5-Ni"], L(pre=["multiplication/equal-groups"], wide=["algebra/balance-and-missing-numbers"], src="notes")),
]),
("division", "Division", "Number", [
 ("sharing-and-grouping", "Sharing and grouping", {
   2: "Sharing equally and grouping; Grouping and Sharing.",
   3: "Fair share: division as sharing and as grouping."},
  ["N2-8", "N3-8", "C2-Ni", "C3-Ni"], L(pre=["multiplication/equal-groups"], deep=["division/division-facts"], wide=["fractions/halves-and-quarters"])),
 ("division-facts", "Division facts", {
   3: "Division facts from the tables; division as the inverse of multiplication.",
   4: "Dividing 2-digit numbers; remainders.",
   5: "Dividing by 1- and 2-digit numbers; Coconut Farm; what to do with remainders."},
  ["N4-9", "N5-9", "C3-Ni", "C4-Ni", "C5-Ni"], L(pre=["division/sharing-and-grouping", "multiplication/multiplication-facts"])),
]),
("factors-multiples", "Factors, multiples and primes", "Number", [
 ("factors-and-multiples", "Factors and multiples", {
   4: "Multiples on a number line; animal jumps; common multiples.",
   5: "Factors and multiples; primes and composites; tests of divisibility."},
  ["N5-13?", "C4-Ni", "C5-Ni"], L(pre=["multiplication/multiplication-facts"], src="notes")),
]),
("fractions", "Fractions, decimals and percentages", "Number", [
 ("halves-and-quarters", "Halves and quarters", {
   1: "Half of a roti, half of a group; equal and unequal parts.",
   2: "Halves and quarters of shapes and sets.",
   3: "Fair Share: halves, quarters, thirds; fraction words."},
  ["N3-8", "C1-Nf", "C2-Nf", "C3-Nf"], L(deep=["fractions/fractions-of-a-whole"], wide=["division/sharing-and-grouping"])),
 ("fractions-of-a-whole", "Fractions of a whole and of a set", {
   3: "Unit fractions; fractions of shapes and quantities.",
   4: "Sharing and measuring with fractions; equivalent fractions with strips.",
   5: "Fractions; comparing, ordering and adding simple fractions; mixed numbers."},
  ["N4-5", "N5-2", "C3-Nf", "C4-Nf", "C5-Nf"], L(pre=["fractions/halves-and-quarters"], deep=["fractions/decimals-and-percentages"])),
 ("decimals-and-percentages", "Decimals and percentages", {
   4: "Tenths as decimals; money and measurement with decimals.",
   5: "Tenths and hundredths; percentages as 'out of 100'; simple ratio (for every)."},
  ["C4-Nf", "C5-Nf"], L(pre=["fractions/fractions-of-a-whole"], wide=["money/money-in-life"])),
]),
("money", "Money", "Number", [
 ("money-in-life", "Coins, notes, buying and selling", {
   1: "Recognising coins and notes; how much can we spend?",
   2: "Adding money; giving change; Fun at the Fair.",
   3: "Rupees and paise; bills; buying at the fair.",
   4: "Making a budget; comparing prices.",
   5: "Profit and loss in simple words; saving; where money comes from and who decides what things cost."},
  ["N1-12", "N2-10", "N3-12?", "N3-14?", "C1-Nm", "C2-Nm", "C3-Nm", "C4-Nm", "C5-Nm"], L(pre=["addition-subtraction/meaning"], wide=["fractions/decimals-and-percentages"])),
]),
# ======================= MEASUREMENT =======================
("measurement-basics", "Measuring", "Measurement", [
 ("comparing-and-non-standard", "Comparing and non-standard units", {
   1: "Longer, shorter, heavier, lighter, holds more; measuring with hand spans, footsteps and cubes.",
   2: "Why non-standard units disagree; the need for standard units."},
  ["N1-2", "N1-11?", "C1-Gg", "C2-Gg"], L(deep=["measurement-basics/standard-units"], wide=["length/comparing-length"])),
 ("standard-units", "Standard units and their story", {
   2: "Centimetres, metres, kilograms, litres; the story of standard units.",
   3: "Choosing the right unit and tool.",
   4: "Converting units (cm↔m, g↔kg, ml↔l)."},
  ["C2-Gg", "C3-Gg", "C4-Gg"], L(pre=["measurement-basics/comparing-and-non-standard"], deep=["measurement-basics/reading-scales"])),
 ("reading-scales", "Reading scales", {
   3: "Reading rulers, weighing scales and jugs; counting the gaps on a scale.",
   4: "Reading scales where not every mark is numbered; forcemeters and thermometers."},
  ["C3-Gg", "C4-Gg"], L(pre=["measurement-basics/standard-units"], wide=["temperature/reading-thermometers"])),
 ("estimation-and-precision", "Estimation and precision", {
   3: "Estimating lengths and weights, then measuring.",
   5: "Measuring carefully; repeating measurements; errors and rounding."},
  ["C3-Gg", "C5-Gg"], L(pre=["measurement-basics/standard-units"], wide=["number-sense/estimation"], src="notes")),
 ("scale-models", "Scale and scale models", {
   4: "Scale drawings: 1 cm stands for 1 m.",
   5: "Scale models of the solar system and of deep time; maps and scale."},
  ["N5-5?", "N5-14?"], L(pre=["measurement-basics/standard-units", "multiplication/multiplication-facts"], wide=["position/maps"], src="dk")),
]),
("length", "Length and distance", "Measurement", [
 ("comparing-length", "Long and short", {
   1: "What is long? Comparing lengths and heights directly."},
  ["N1-2", "C1-Gg"], L(deep=["length/standard-units-length"])),
 ("standard-units-length", "Centimetres and metres", {
   2: "Measuring with a ruler in centimetres; Rani's Gift.",
   3: "Metres and centimetres; measuring the classroom.",
   4: "Measuring Length: cm, m, mm; measuring and drawing lines.",
   5: "Choosing units; measuring curved lines; perimeter links."},
  ["N2-7", "N4-6", "C2-Gg", "C3-Gg", "C4-Gg", "C5-Gg"], L(pre=["length/comparing-length"], deep=["length/kilometres-and-conversions"])),
 ("kilometres-and-conversions", "Kilometres and distance", {
   4: "Kilometres; how far is 1 km? Walking it.",
   5: "Far and Near: distances in km and m; converting units; travel distances."},
  ["N5-1", "N5-5", "C4-Gg", "C5-Gg"], L(pre=["length/standard-units-length"], wide=["position/maps"])),
]),
("weight-capacity", "Weight and capacity", "Measurement", [
 ("weight", "Weight", {
   1: "Heavier and lighter; balancing.",
   3: "Filling and Lifting: weighing in grams and kilograms.",
   4: "Weigh it: grams and kilograms; reading scales.",
   5: "Weight and Capacity: converting g and kg; weight problems."},
  ["N3-11", "N4-8", "N5-8", "C1-Gg", "C3-Gg", "C4-Gg", "C5-Gg"], L(deep=["measurement-basics/reading-scales"])),
 ("capacity", "Capacity", {
   1: "Holds more, holds less.",
   3: "Filling and Lifting: litres and millilitres.",
   4: "Pour it: measuring capacity.",
   5: "Weight and Capacity: converting ml and l; volume of a box by counting cubes."},
  ["N3-11", "N4-8", "N5-8", "C1-Gg", "C3-Gg", "C4-Gg", "C5-Gg"], L(wide=["weight-capacity/weight"], deep=["area-perimeter/volume"])),
]),
("time", "Time", "Measurement", [
 ("daily-time", "My day: sequencing time", {
   1: "How do I spend my day? Morning, afternoon, evening, night; before and after; days of the week."},
  ["N1-10", "C1-Gt"], L(deep=["time/telling-time", "time/calendar"])),
 ("telling-time", "Telling the time", {
   2: "O'clock and half past.",
   3: "Time Goes On: hours and minutes; quarter past and to.",
   4: "Ticking Clocks: reading time to 5 minutes and to the minute; am and pm.",
   5: "Racing Seconds: seconds; 24-hour time; timetables."},
  ["N3-13", "N4-12", "N5-12", "C2-Gt", "C3-Gt", "C4-Gt", "C5-Gt"], L(pre=["time/daily-time"], deep=["time/duration"])),
 ("calendar", "Calendars, months and seasons", {
   2: "Months of the year; Which Season Is It?",
   3: "Reading a calendar; dates.",
   4: "Turning Calendar: days, weeks, months, years; leap years.",
   5: "Calendars of different cultures (lunar, solar); why a year has 365¼ days."},
  ["N2-9?", "N3-13", "N4-12", "C2-Gt", "C3-Gt", "C4-Gt"], L(pre=["time/daily-time"], wide=["time/duration"])),
 ("duration", "How long? Duration", {
   3: "How long things take; timing with a stopwatch.",
   4: "Working out durations from start and end times.",
   5: "Duration across hours; comparing times in races (Racing Seconds)."},
  ["N5-12", "C3-Gt", "C4-Gt", "C5-Gt"], L(pre=["time/telling-time"])),
]),
("temperature", "Temperature", "Measurement", [
 ("reading-thermometers", "Reading thermometers", {
   3: "Hot and cold; degrees Celsius; reading a thermometer.",
   5: "Temperatures below zero; temperature differences; graphs of temperature."},
  ["C3-Gg", "C5-Gg"], L(pre=["measurement-basics/reading-scales"], wide=["number-sense/negative-numbers"])),
]),
("area-perimeter", "Perimeter, area and volume", "Measurement", [
 ("perimeter", "Perimeter", {
   4: "Distance around a shape; fencing a garden.",
   5: "Perimeter of rectangles and other shapes; Grandmother's Quilt."},
  ["N5-11", "C4-Gg", "C5-Gg"], L(pre=["length/standard-units-length"], wide=["area-perimeter/area"])),
 ("area", "Area", {
   3: "Covering shapes with squares; which covers more?",
   4: "Area by counting squares.",
   5: "Area of rectangles; same perimeter, different area (Grandmother's Quilt)."},
  ["N5-11", "C4-Gg", "C5-Gg"], L(wide=["area-perimeter/perimeter"], deep=["area-perimeter/volume"])),
 ("volume", "Volume", {
   5: "Volume by counting cubes; capacity and volume."},
  [], L(pre=["area-perimeter/area", "weight-capacity/capacity"], src="notes")),
]),
# ======================= GEOMETRY =======================
("shapes-2d", "2D shapes", "Geometry", [
 ("recognising-shapes", "Recognising shapes", {
   1: "Circles, triangles, squares, rectangles around us; What is round?",
   2: "Shapes Around Us; flat faces of solid shapes (Shadow Story).",
   3: "Fun with Shapes: sides and corners; drawing shapes on dot paper."},
  ["N1-2", "N2-2", "N2-4", "N3-5", "C1-Gg", "C2-Gg", "C3-Gg"], L(deep=["shapes-2d/polygons-and-properties"], wide=["shapes-3d/solid-shapes"])),
 ("polygons-and-properties", "Polygons and their properties", {
   4: "Shapes Around Us: polygons; regular and irregular; tangrams.",
   5: "Shapes and Patterns: properties of triangles and quadrilaterals; circles: centre, radius, diameter."},
  ["N4-1", "N5-7", "C4-Gg", "C5-Gg"], L(pre=["shapes-2d/recognising-shapes"], wide=["lines-angles/angles"])),
]),
("shapes-3d", "3D shapes", "Geometry", [
 ("solid-shapes", "Solid shapes", {
   1: "Things that roll and things that slide: balls, boxes, cans, cones.",
   2: "Shapes Around Us: cube, cuboid, cylinder, cone, sphere.",
   3: "Toy Joy: making toys from solid shapes."},
  ["N1-2", "N2-2", "N3-2", "C1-Gg", "C2-Gg", "C3-Gg"], L(deep=["shapes-3d/faces-edges-vertices"])),
 ("faces-edges-vertices", "Faces, edges and corners", {
   3: "Counting faces, edges and corners of solids.",
   4: "Shapes Around Us: views from the top, front and side (Hide and Seek)."},
  ["N4-1", "N4-2", "C3-Gg", "C4-Gg"], L(pre=["shapes-3d/solid-shapes"], deep=["shapes-3d/nets"])),
 ("nets", "Nets: folding shapes", {
   4: "Unfolding a box; nets of a cube.",
   5: "Nets of cuboids, prisms and pyramids; making 3D models."},
  ["C4-Gg", "C5-Gg"], L(pre=["shapes-3d/faces-edges-vertices"])),
]),
("lines-angles", "Lines and angles", "Geometry", [
 ("lines", "Lines", {
   2: "Playing with Lines: straight and curved lines, horizontal and vertical.",
   4: "Parallel and perpendicular lines."},
  ["N2-5", "C2-Gg", "C4-Gg"], L(deep=["lines-angles/angles"])),
 ("angles", "Angles as turns", {
   3: "Turns: quarter, half, three-quarter and full turns; right angles around us.",
   4: "Right angles as quarter turns; angles smaller and bigger than a right angle.",
   5: "Angles as Turns: right, acute and obtuse angles; comparing angles; degrees in simple words."},
  ["N5-3", "C3-Gp", "C4-Gg", "C5-Gg"], L(pre=["lines-angles/lines"], wide=["position/directions-and-grids"])),
]),
("position", "Position, direction and maps", "Geometry", [
 ("position-words", "Where is it? Position words", {
   1: "Finding the Furry Cat: top, bottom, inside, outside, near, far, left, right."},
  ["N1-1", "C1-Gp"], L(deep=["position/directions-and-grids"])),
 ("directions-and-grids", "Directions and grids", {
   2: "Giving directions; moving on a grid.",
   3: "North, south, east, west; turns and routes.",
   4: "Hide and Seek: views and positions; grid references."},
  ["N4-2", "C2-Gp", "C3-Gp", "C4-Gp"], L(pre=["position/position-words"], deep=["position/maps", "position/coordinates"])),
 ("maps", "Maps", {
   4: "Drawing a map of a room or street; map symbols.",
   5: "Maps and Locations: reading maps, routes and distances; We the Travellers."},
  ["N5-14", "N5-4?", "C5-Gp"], L(pre=["position/directions-and-grids"], wide=["measurement-basics/scale-models"])),
 ("coordinates", "Coordinates", {
   5: "Coordinates on a grid; plotting points; drawing pictures with coordinates."},
  ["C5-Gp"], L(pre=["position/directions-and-grids"], src="notes")),
]),
("symmetry", "Symmetry and transformations", "Geometry", [
 ("line-symmetry", "Line symmetry", {
   2: "Matching halves: folding paper shapes.",
   4: "Fun with Symmetry: lines of symmetry in shapes, letters and rangoli.",
   5: "Symmetrical Designs: making symmetric patterns; more than one line of symmetry."},
  ["N4-11", "N5-10", "C2-Gp", "C4-Gp", "C5-Gp"], L(deep=["symmetry/rotational-symmetry"], wide=["patterns/shape-patterns"])),
 ("rotational-symmetry", "Turning symmetry", {
   4: "Shapes that look the same after a turn; windmills and flowers.",
   5: "Order of rotational symmetry; designs that turn."},
  ["N5-10", "C5-Gp"], L(pre=["symmetry/line-symmetry", "lines-angles/angles"])),
 ("transformations", "Slide, flip, turn", {
   4: "Translating, reflecting and rotating shapes on a grid.",
   5: "Tessellations; transformations in art and tiles."},
  ["C4-Gp", "C5-Gp"], L(pre=["symmetry/line-symmetry"], wide=["patterns/shape-patterns"])),
]),
# ======================= PATTERNS, ALGEBRA, DATA, LOGIC =======================
("patterns", "Patterns", "Patterns and algebra", [
 ("repeating-patterns", "Repeating patterns", {
   1: "Repeating patterns of colours, shapes, sounds and movements; Utsav decorations.",
   2: "Decoration for Festival: making and continuing patterns; the repeating unit."},
  ["N1-9?", "N2-6", "C1-Nc", "C2-Nc"], L(deep=["patterns/number-patterns", "patterns/shape-patterns"])),
 ("number-patterns", "Number patterns", {
   2: "Counting in steps; patterns on the 100 square.",
   3: "Patterns in addition and tables; Fun at Class Party.",
   4: "Pattern Around Us: growing patterns; rules for patterns.",
   5: "Sequences and their rules; square and triangle numbers."},
  ["N3-10?", "N4-3", "C2-Nc", "C3-Nc", "C4-Nc", "C5-Nc"], L(pre=["patterns/repeating-patterns"], deep=["algebra/input-output"])),
 ("shape-patterns", "Patterns in shapes and nature", {
   3: "Patterns in tiles, kolam and rangoli.",
   4: "Pattern Around Us: patterns in shapes.",
   5: "Shapes and Patterns; spirals, fractals and the Fibonacci numbers in nature."},
  ["N4-3", "N5-7"], L(pre=["patterns/repeating-patterns"], wide=["symmetry/line-symmetry"])),
]),
("algebra", "Early algebra", "Patterns and algebra", [
 ("balance-and-missing-numbers", "Missing numbers and balance", {
   2: "Missing numbers in sums; balancing scales with cubes.",
   3: "Number sentences with a box for the unknown.",
   5: "Simple equations as balance puzzles; letters for unknown numbers."},
  ["C2-Ni", "C3-Ni", "C5-Ni"], L(pre=["addition-subtraction/meaning"], deep=["algebra/input-output"], src="notes")),
 ("input-output", "Input-output machines", {
   3: "Number machines: what's the rule?",
   5: "Rules with two steps; finding the input from the output."},
  ["C5-Nc"], L(pre=["patterns/number-patterns"], src="notes")),
]),
("data", "Data handling", "Data and chance", [
 ("sorting-and-tallies", "Sorting, counting and tallies", {
   1: "Sorting objects and counting each group; So Many Toys.",
   2: "Tally marks; Data Handling: collecting answers to a question.",
   3: "What's in a Name? Counting letters and making tallies."},
  ["N1-13?", "N2-11", "N3-1", "C1-Ss", "C2-Ss", "C3-Ss"], L(deep=["data/pictographs"])),
 ("pictographs", "Pictographs and tables", {
   2: "Pictographs: one picture for one thing.",
   3: "Tables and pictographs; The Surajkund Fair.",
   4: "Pictographs where one picture stands for many; Data Handling.",
   5: "Data Through Pictures."},
  ["N2-11", "N3-14?", "N4-10?", "N4-14", "N5-15", "C2-Ss", "C3-Ss", "C4-Ss"], L(pre=["data/sorting-and-tallies"], deep=["data/bar-charts"])),
 ("bar-charts", "Bar charts", {
   3: "Block graphs and simple bar charts.",
   4: "Bar charts with scales; asking and answering questions about data.",
   5: "Choosing how to show data; bar charts of experiment results."},
  ["N4-14", "N5-15", "C3-Ss", "C4-Ss", "C5-Ss"], L(pre=["data/pictographs"], deep=["data/line-graphs", "data/reading-data"])),
 ("line-graphs", "Line graphs", {
   4: "Showing change over time (plant height, temperature).",
   5: "Drawing and reading line graphs; spotting trends."},
  ["C5-Ss"], L(pre=["data/bar-charts"], wide=["time/duration"], src="dk")),
 ("reading-data", "Reading data and misleading graphs", {
   4: "What does the data tell us? Comparing groups.",
   5: "Mode and range in simple words; the same data told two ways; spotting a misleading graph."},
  ["C4-Ss", "C5-Ss"], L(pre=["data/bar-charts"], src="notes")),
]),
("probability", "Chance and probability", "Data and chance", [
 ("likely-and-unlikely", "Certain, likely, unlikely, impossible", {
   1: "Will it happen? Will, might, won't: talking about chance in everyday life.",
   2: "Certain, maybe, impossible.",
   3: "Likely and unlikely; sorting events by how likely they are.",
   4: "Likely, unlikely, even chance; the language of chance."},
  ["C1-Sp", "C2-Sp", "C3-Sp", "C4-Sp"], L(deep=["probability/experiments"], src="notes")),
 ("experiments", "Chance experiments and games", {
   4: "Coin, dice and spinner experiments; tallying outcomes; is the game fair?",
   5: "Predicting from experiments; probability as a fraction; Ludo and snakes and ladders."},
  ["C4-Sp", "C5-Sp"], L(pre=["probability/likely-and-unlikely", "data/sorting-and-tallies"], wide=["fractions/fractions-of-a-whole"])),
]),
("logic", "Logic and problem solving", "Thinking mathematically", [
 ("puzzles", "Puzzles and riddles", {
   1: "Picture puzzles, mazes, odd one out.",
   3: "Number puzzles, magic squares, sudoku for children.",
   5: "Logic puzzles; working backwards; puzzles from Indian mathematics."},
  ["C1-TWM", "C3-TWM", "C5-TWM"], L(wide=["logic/problem-solving"], src="notes")),
 ("problem-solving", "Problem-solving strategies", {
   2: "Draw it, act it out, try and check.",
   4: "Make a table, look for a pattern, solve a simpler problem.",
   5: "Choosing and explaining a strategy; checking if an answer makes sense."},
  ["C2-TWM", "C4-TWM", "C5-TWM"], L(src="notes")),
 ("sets-and-venn", "Sorting with sets and Venn diagrams", {
   2: "Sorting by two rules; overlapping hoops.",
   4: "Venn and Carroll diagrams."},
  ["C2-Ss", "C4-Ss"], L(pre=["data/sorting-and-tallies"], src="notes")),
 ("true-false", "True or false statements", {
   3: "Is it always, sometimes or never true?",
   4: "True/false and on/off: binary logic in simple words."},
  ["C3-TWM", "C4-TWM"], L(src="notes")),
 ("if-then", "If-then reasoning", {
   4: "If-then statements; making and testing a rule.",
   5: "Logical chains; counter-examples."},
  ["C5-TWM"], L(pre=["logic/true-false"], src="notes")),
]),
("maths-and-world", "Maths and the world", "Thinking mathematically", [
 ("what-is-maths", "What is maths? Thinking like a mathematician", {
   1: "Maths is everywhere: counting, shapes and patterns around us.",
   3: "Mistakes help us learn; maths as patterns.",
   5: "Is maths discovered or invented? Proof and why it matters."},
  ["C1-TWM", "C3-TWM", "C5-TWM"], L(src="notes")),
 ("stories-of-mathematicians", "Stories of mathematicians", {
   2: "Stories of Aryabhata, Lilavati and Ramanujan.",
   4: "Hypatia, Brahmagupta, Gauss, Katherine Johnson: who counted, and who got counted?"},
  [], L(src="notes")),
 ("maths-and-science", "Maths in science", {
   4: "Measuring and recording in experiments; tables and graphs of results.",
   5: "Speed = distance ÷ time; ratio in recipes and mixtures; scale models."},
  [], L(pre=["data/bar-charts", "measurement-basics/standard-units"], src="notes")),
 ("maths-and-art", "Maths in art and music", {
   3: "Symmetry and patterns in rangoli, kolam and textiles.",
   5: "The golden ratio, spirals, rhythms and beats in music; drawing with coordinates."},
  [], L(pre=["symmetry/line-symmetry", "patterns/shape-patterns"], src="notes")),
]),
]
