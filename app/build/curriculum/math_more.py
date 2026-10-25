"""Maths additions so every item of the founder's HomeSchooling Track 'Maths' tab (and the maths parts of the
Physics and Chemistry tabs) is taught somewhere, each at the age where it can be delivered well. Same shape as sci_more.py."""
L = lambda **k: k

NOTES = {
 "maths-and-world/what-is-maths": "math:1,math:17",
 "maths-and-world/maths-and-science": "math:2,math:20,math:22,math:23,phy:90",
 "maths-and-world/maths-and-art": "math:11,math:86,math:88",
 "maths-and-world/stories-of-mathematicians": "math:18",
 "number-sense/counting": "math:25",
 "number-sense/place-value": "math:3,math:29",
 "number-sense/zero": "math:26",
 "number-sense/history-of-numbers": "math:27",
 "number-sense/negative-numbers": "math:32,math:39",
 "number-sense/infinity": "math:87",
 "number-sense/comparing-ordering": "math:79",
 "addition-subtraction/meaning": "math:4,math:33",
 "multiplication/equal-groups": "math:34",
 "multiplication/properties": "math:36,math:77",
 "division/sharing-and-grouping": "math:35",
 "factors-multiples/factors-and-multiples": "math:30,math:31",
 "fractions/fractions-of-a-whole": "math:28,math:37",
 "fractions/decimals-and-percentages": "math:38,math:40",
 "measurement-basics/comparing-and-non-standard": "math:43",
 "measurement-basics/standard-units": "math:5,math:44,math:45,math:50,phy:84-87,chem:1,chem:2,chem:138-140",
 "measurement-basics/estimation-and-precision": "math:51,chem:141-149",
 "time/telling-time": "math:46",
 "length/standard-units-length": "math:47",
 "weight-capacity/weight": "math:48",
 "temperature/reading-thermometers": "math:49",
 "lines-angles/lines": "math:52,math:54,math:56",
 "lines-angles/angles": "math:55",
 "position/coordinates": "math:53",
 "shapes-2d/recognising-shapes": "math:9,math:57",
 "shapes-2d/polygons-and-properties": "math:58,math:59",
 "shapes-3d/solid-shapes": "math:63",
 "area-perimeter/perimeter": "math:60",
 "area-perimeter/volume": "math:62",
 "patterns/number-patterns": "math:16,math:85",
 "patterns/shape-patterns": "math:24,math:87",
 "algebra/balance-and-missing-numbers": "math:6,math:75,math:76,math:79",
 "algebra/input-output": "math:15,math:78",
 "data/sorting-and-tallies": "math:69",
 "data/bar-charts": "math:70",
 "data/reading-data": "math:8,math:71-74",
 "probability/likely-and-unlikely": "math:7,math:80,math:81",
 "probability/experiments": "math:82-84,phy:94",
 "logic/puzzles": "math:64",
 "logic/problem-solving": "math:10,math:19,math:68",
 "logic/sets-and-venn": "math:14,math:67",
 "logic/true-false": "math:65",
 "logic/if-then": "math:66",
}

SUBS = {
"number-sense": [
 ("powers-and-roots", "Squares, cubes, powers and roots", {
   4: "Square numbers as squares of dots, cube numbers as cubes of blocks; doubling again and again.",
   5: "Powers of ten and other powers; square roots as 'which number times itself?'; the chessboard and rice story."},
  [], L(pre=["multiplication/multiplication-facts"], wide=["number-sense/big-numbers"], src="notes", notes="math:41,math:42")),
],
"fractions": [
 ("ratio-and-proportion", "Ratio and proportion", {
   4: "For every 2 cups of rice, 1 cup of dal: recipes and mixing paint.",
   5: "Ratio and proportion; scaling recipes up and down; maps and models to scale."},
  [], L(pre=["fractions/fractions-of-a-whole"], wide=["measurement-basics/scale-models"], src="notes", notes="math:21")),
],
"area-perimeter": [
 ("surface-area", "Surface area", {
   5: "How much paper wraps a box? Surface area by unfolding the net."},
  [], L(pre=["area-perimeter/area", "shapes-3d/nets"], src="notes", notes="math:61")),
],
"lines-angles": [
 ("triangles-and-heights", "Measuring the unreachable with triangles", {
   5: "Measuring a tree's height with its shadow (similar triangles); how surveyors measured Everest; the idea behind trigonometry."},
  [], L(pre=["lines-angles/angles"], wide=["sci:light/shadows"], src="notes", notes="phy:91")),
],
"logic": [
 ("counting-ways", "Counting the ways", {
   3: "How many outfits from 3 shirts and 2 shorts? Counting arrangements.",
   5: "Combinations and arrangements; networks and the bridges of Königsberg; discrete maths, the maths of countable things."},
  [], L(pre=["multiplication/equal-groups"], wide=["probability/experiments"], src="notes", notes="math:12")),
],
}

TOPICS = [
("big-ideas", "Big ideas of maths", "Thinking mathematically", [
 ("change-and-motion", "The maths of change (the idea behind calculus)", {
   4: "How fast is it going right now? Speed at an instant vs average speed.",
   5: "Adding up tiny slices to find an area; change and continuity; how equations describe changing things (rockets, populations)."},
  [], L(pre=["data/line-graphs"], wide=["sci:motion/describing-motion"], src="notes", notes="math:13,phy:92,phy:93")),
 ("functions-and-models", "Rules that describe the world", {
   5: "A rule that turns one number into another (function); using a rule to predict (models of population, savings, temperature)."},
  [], L(pre=["algebra/input-output"], src="notes", notes="math:15")),
]),
]
