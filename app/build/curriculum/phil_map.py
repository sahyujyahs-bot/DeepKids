"""DeepKids Combined Philosophy (philosophy for children): every item of the founder's HomeSchooling Track
'Philosophy' tab (phil:). Philosophy works at every age, so most subtopics have levels from Class 1: the
question stays the same, the way in (picture books, games, thought experiments, debate) grows with the child.
Same shape as sci_map.py."""
L = lambda **k: k

TOPICS = [
("existence-and-reality", "Existence and reality", "Big questions", [
 ("existence", "Why is there something?", {
   1: "What does it mean to be? Things that exist and things we only imagine.",
   3: "Why is there something rather than nothing? Did the universe have to exist?",
   5: "Existence in different traditions (being, emptiness, Brahman); questions with no final answer."},
  [], L(wide=["sci:nothing-and-forever/zero"], notes="phil:1")),
 ("dreams-and-imagination", "Waking, dreaming and imagining", {
   1: "Dreams, pretend play and imagination: where do they come from?",
   3: "How do you know you are not dreaming now? Zhuangzi's butterfly dream.",
   5: "Imagination as a way to explore possible worlds; lucid dreams; the brain while dreaming."},
  [], L(wide=["sci:what-is-real/perception-and-reality", "sci:health/sleep"], notes="phil:2")),
 ("reality", "What is real?", {
   2: "Is a rainbow real? Is a shadow? Is a story?",
   4: "Plato's cave; appearance and reality.",
   5: "Is the world only what we perceive? Different answers from philosophers and scientists."},
  [], L(wide=["sci:what-is-real/perception-and-reality"], notes="phil:4")),
 ("possible-and-necessary", "Possible, impossible and necessary", {
   3: "Could pigs fly? Could 2 + 2 be 5? Things that could be and things that must be.",
   5: "Possibility and necessity; what if history had gone differently?"},
  [], L(wide=["math:logic/true-false"], notes="phil:41,phil:42")),
 ("universals", "Kinds and individuals", {
   3: "What makes all dogs 'dogs' when every dog is different?",
   5: "Universals and particulars: is 'redness' a thing? Categories help and also trap our thinking."},
  [], L(wide=["sci:classification/sorting-living-things"], notes="phil:39")),
]),
("mind-and-self", "Mind and self", "Big questions", [
 ("thought", "What is a thought?", {
   1: "Thinking about thinking: where do thoughts come from?",
   3: "Can you stop thinking? Watching thoughts come and go.",
   5: "Do thoughts need a brain? Thinking in words and pictures; thoughts and the body."},
  [], L(wide=["sci:mind/thinking-and-memory"], notes="phil:6")),
 ("consciousness", "Awareness and experience", {
   2: "Being awake and noticing; what is it like to be a bat?",
   4: "Can I ever feel your pain? Subjective experience.",
   5: "Consciousness: the hardest question; is it everywhere, only in brains, or something else?"},
  [], L(wide=["sci:what-is-real/consciousness"], notes="phil:7-9")),
 ("memory", "Memory and the self", {
   2: "What do you remember? Are you the same person as baby you?",
   5: "If you lost all your memories, would you still be you?"},
  [], L(wide=["hist:my-history/memory-and-history"], notes="phil:5")),
 ("mind-and-body", "Mind and body", {
   3: "Where am 'I' in my body? Can the mind change the body (and the other way round)?",
   5: "The mind-body problem; feelings felt in the body; mindfulness and yoga."},
  [], L(wide=["sci:mind/brain-and-nerves"], notes="phil:17,phil:40")),
 ("identity", "Who am I?", {
   1: "Who am I? My name, my likes, my family; I am more than my name.",
   3: "The ship of Theseus; are you the same person every day?",
   5: "Identity and what makes 'me'; labels we give ourselves and others; we are never just one adjective."},
  [], L(wide=["sci:mind/sense-of-self"], notes="phil:18")),
 ("ego", "Ego: the 'I' that wants to be noticed", {
   3: "Wanting to win, to be praised, to be right; how it feels.",
   5: "Ego as a lens, not the whole truth; letting go of needing validation."},
  [], L(pre=["mind-and-self/identity"], notes="phil:10")),
 ("emotion", "Feelings", {
   1: "Naming feelings; all feelings are allowed.",
   3: "Where feelings come from; feelings and choices.",
   5: "Can feelings be wise? Emotion and reason working together."},
  [], L(wide=["sci:health/feelings-and-wellbeing"], notes="phil:50")),
 ("intelligence", "What is intelligence?", {
   3: "Are crows clever? Is a calculator clever? Many kinds of intelligence.",
   5: "Intelligence in animals, plants, machines and people; who decides what counts as smart?"},
  [], L(wide=["sci:animals/animal-minds"], notes="phil:33")),
 ("delusion", "Fooling ourselves", {
   4: "Seeing what we expect; believing something because we want it to be true.",
   5: "Delusion and self-deception; how to check our own beliefs."},
  [], L(wide=["sci:senses/perception", "sci:me-and-others/human-nature"], notes="phil:34")),
]),
("knowing", "Knowing and truth", "Big questions", [
 ("perspectives", "Perspectives: seeing from another place", {
   1: "The elephant and the blind men: everyone touches a different part.",
   3: "The same thing seen from different places, people and animals.",
   5: "Can all perspectives be right? Relativism and truth."},
  [], L(wide=["sci:me-and-others/me-and-others"], notes="phil:3")),
 ("known-and-unknown", "The known and the unknown", {
   2: "Things I know, things I don't, and things nobody knows.",
   4: "The edge of the known; 'I don't know' as the start of science.",
   5: "Things we may never know; living with mystery."},
  [], L(wide=["sci:how-we-know/questioning-evidence"], notes="phil:12")),
 ("knowledge", "How do we know?", {
   3: "Knowing by seeing, by being told, by thinking; how do you know the Earth is round?",
   5: "Knowledge and belief; evidence; trusting experts and checking them."},
  [], L(wide=["sci:how-we-know/fair-tests"], notes="phil:13")),
 ("truth", "Truth", {
   2: "Telling the truth; is a story true?",
   4: "Facts and opinions; can something be true for you and not for me?",
   5: "Different ideas of truth; truth in science, in maths, in stories."},
  [], L(wide=["living-well/honesty"], notes="phil:15")),
 ("objectivity", "Can anyone see without bias?", {
   4: "Fair judging: can a referee be completely fair?",
   5: "Objectivity and bias in science and history; why many eyes help."},
  [], L(wide=["hist:how-we-know-history/who-tells-history"], notes="phil:32")),
 ("reasoning", "Reasoning and inference", {
   2: "If... then...: detective thinking.",
   4: "Good and bad reasons; jumping to conclusions.",
   5: "Rationality and inference; spotting mistakes in arguments."},
  [], L(wide=["math:logic/if-then"], notes="phil:43,phil:45")),
 ("language-and-thought", "Words, meaning and thought", {
   1: "Words for things; making up new words.",
   3: "Does a word mean the same to everyone? Drawing the meaning of 'happy'.",
   5: "Language shapes thought; how words refer to things; meaning in pictures, music and silence."},
  [], L(wide=["hist:how-we-know-history/scripts-and-inscriptions"], notes="phil:27,phil:52-54")),
]),
("living-well", "Living well: right and wrong", "Big questions", [
 ("good-and-bad", "Good, bad, right and wrong", {
   1: "Is it ever okay to take something? Kind and unkind actions.",
   3: "Something good that is bad, something bad that is good; it depends.",
   5: "Different ideas of right and wrong; beyond good and bad: who we are when no one judges."},
  [], L(notes="phil:14")),
 ("values", "Values and morals", {
   2: "What matters most to me? To my family?",
   5: "Where values come from; when values clash; values in different cultures."},
  [], L(pre=["living-well/good-and-bad"], notes="phil:56")),
 ("duty-and-virtue", "Duty and character", {
   3: "Doing what we should; being brave, kind, patient.",
   5: "Duty (dharma) and virtue in different traditions; is a good person someone who follows rules or someone with a good heart?"},
  [], L(pre=["living-well/good-and-bad"], notes="phil:46")),
 ("honesty", "Honesty", {
   1: "Telling the truth even when it is hard.",
   4: "White lies; is it ever right to lie?"},
  [], L(wide=["knowing/truth"], notes="phil:47")),
 ("accountability", "Owning what we do", {
   2: "Saying sorry and making things right.",
   4: "Taking responsibility for choices and their effects on others."},
  [], L(wide=["living-well/karma"], notes="phil:26")),
 ("karma", "Karma, actions and consequences", {
   3: "Every action has effects; kindness that comes back.",
   5: "Karma as an idea in Indian traditions; cause and effect in physics; is life fair?"},
  [], L(wide=["sci:order-chaos/cause-and-effect"], notes="phil:31")),
 ("power", "Power", {
   3: "Who decides in a family, a game, a class?",
   5: "Power and fairness; how power can be used well or badly; whose voices are not heard."},
  [], L(wide=["hist:history-themes/everyday-life"], notes="phil:48")),
 ("freedom", "Freedom and choice", {
   2: "Choosing: what to play, what to say.",
   4: "Are we free to choose, or do things make us choose? Free will.",
   5: "Freedom and responsibility; freedom from what others expect; choosing again each moment."},
  [], L(notes="phil:22,phil:49")),
 ("fair-shares", "Fair shares", {
   2: "Sharing a cake fairly.",
   5: "Who gets water, land, food and money? Fair access to resources; enough versus more."},
  [], L(wide=["math:fractions/halves-and-quarters"], notes="phil:55")),
 ("nature-and-animals", "The value of nature and animals", {
   1: "Do animals and plants matter for their own sake?",
   3: "Is a tree worth something if nobody uses it?",
   5: "Rights of nature and animals; humans as one species among many."},
  [], L(wide=["sci:ecology/interdependence"], notes="phil:25")),
]),
("meaning", "Happiness, love and meaning", "Big questions", [
 ("happiness", "Happiness", {
   1: "What makes me happy?",
   3: "Is happiness the same as having fun? Can you be happy and sad together?",
   5: "Different ideas of happiness; does having more make us happier?"},
  [], L(notes="phil:23")),
 ("love", "Love", {
   1: "People and animals I love.",
   4: "Kinds of love; love and kindness to strangers.",
   5: "What is love? Love as care, as a feeling, as a choice."},
  [], L(notes="phil:16")),
 ("meaning-of-life", "What makes life meaningful?", {
   3: "What would you do if you could do anything?",
   5: "Meaning made or found? Purpose in different traditions."},
  [], L(notes="phil:24")),
 ("death", "Death and what comes after", {
   2: "Gently: living things die; remembering those we love.",
   5: "What different cultures believe about death; why death gives life meaning."},
  [], L(wide=["sci:what-is-life/signs-of-life"], notes="phil:29")),
 ("oneness", "Oneness: everything is connected", {
   1: "We breathe the same air as trees; we are part of nature.",
   3: "How everything is connected (food, air, water, stars).",
   5: "Oneness in Indian thought (advaita, Vasudhaiva Kutumbakam) and in science (we are made of star stuff)."},
  [], L(wide=["sci:planet-earth/earth-shared-home"], notes="phil:11")),
]),
("time-and-change", "Time and change", "Big questions", [
 ("time", "What is time?", {
   1: "Yesterday, today and tomorrow.",
   3: "Does time pass slowly when we are bored? Is time real?",
   5: "Time in physics and philosophy; cyclical time (kaala chakra) and line-time."},
  [], L(wide=["sci:space-time/time"], notes="phil:19,phil:35")),
 ("change", "Change", {
   2: "Everything changes: seasons, bodies, rivers.",
   5: "You can't step in the same river twice; is anything permanent?"},
  [], L(wide=["sci:day-night-seasons/seasons"], notes="phil:36")),
 ("past-and-future", "The past and the future", {
   2: "What happened before I was born? What will happen when I grow up?",
   4: "Can the past change? Is the future already decided?",
   5: "Imagining futures; responsibility to people not yet born."},
  [], L(wide=["hist:my-history/my-story"], notes="phil:30,phil:37,phil:38")),
 ("cause-and-effect", "Why things happen", {
   2: "Because...: chains of causes.",
   5: "Is everything caused? Chance, choice and cause."},
  [], L(wide=["sci:order-chaos/cause-and-effect"], notes="phil:21")),
 ("unpredictability", "Can we predict the future?", {
   3: "Weather, dice and surprises.",
   5: "Unpredictability in nature and in life; living with uncertainty."},
  [], L(wide=["sci:order-chaos/chance"], notes="phil:44")),
 ("space-and-infinity", "Space and infinity", {
   2: "Does space go on for ever?",
   5: "Is the universe infinite? Can we imagine infinity?"},
  [], L(wide=["sci:nothing-and-forever/infinity"], notes="phil:20")),
]),
("technology-and-ai", "Technology and AI", "Big questions", [
 ("technology", "Technology and its impact", {
   2: "Tools that help us; when do tools take over?",
   5: "How technology changes people and the planet; who benefits; living with screens."},
  [], L(wide=["hist:world-today/connected-world"], notes="phil:28")),
 ("artificial-intelligence", "Artificial intelligence", {
   3: "Can a computer think? Talking to an AI.",
   5: "What AI can and can't do; should we trust it; can a machine feel?"},
  [], L(wide=["sci:mind/brains-and-computers"], notes="phil:51")),
]),
]
