async function runDump(){const ta=document.getElementById("dumpText"),D_=ui.dump=ui.dump||{},typed=(ta?.value||"").trim(),text=(D_.items&&typed&&D_.text&&!D_.text.includes(typed)?D_.text+"\n"+typed:typed||D_.text||"").trim();D_.text=text;if(!SAMPLE){D_.err="Sorting needs Claude, which isn't available in this view.";return render()}
  if(!text&&!D_.files?.length){D_.err="Type something or add a photo first.";sfx("no");return render()}
  D_.busy=true;D_.err="";render();
  const prompt=`You are the planning helper inside DeepKids, a homeschool planner used by a parent in India. Today is ${new Date().toLocaleDateString("en-IN",{weekday:"long"})} ${today}. The child is ${S.child||"the child"}, age ${S.age}. The day's lessons start at ${D().start}; lunch is at ${D().lunch}.
Routines and classes already in the plan:
${routinesText()}
The parent wrote the message below${D_.files?.length?" and attached photos (they may be WhatsApp screenshots, notes, timetables or receipts)":""}${D_.chat?.length?". It ends with their answers to your earlier questions":""}.
Pull out every class, tuition, online class, outing, rest or nap, meal, chore, to-do, exam, reminder, and every learning item the family owns (books, games, electronics, equipment, tools).
Rules:
- Anything that repeats ("every day", "weekdays", "on Mondays") is weekly, with "days" as numbers, 0 = Sunday to 6 = Saturday. "Every day" is [0,1,2,3,4,5,6]; "weekdays" is [1,2,3,4,5]. Never make a repeating thing a todo.
- Rest, naps, sleep and meals are type "rest" or "meal" with a start and end. A time given relative to something ("1 hour rest after tuition") gets real times worked out from that thing's end time, on the same days.
- Times are 24-hour HH:MM. "4pm-5pm" is 16:00–17:00. If only a length is given, set end from it.
- If an item is already in the list above, leave it out. If the message changes one (new time, new days), return {"type":"update","id":"<its id>", with the new fields}.
- "who" is "you" (the parent alone), "kid" (the child alone, parent free), or "both".
- Resolve dates like "tomorrow" or "next Friday" to YYYY-MM-DD.
- A "todo" is a one-off task with no fixed time. A "note" is only for facts that can't go on a calendar.
- Ask a question only when a needed time or day is really missing and can't be worked out. Never ask about something already in the list above. One short question per gap, at most 3.
- Never invent details.
Reply with only JSON: {"items":[{"type":"class|tuition|online|outing|rest|meal|chore|todo|exam|reminder|have|note|update","id":null,"title":"short title","who":"you|kid|both","date":null,"days":null,"start":null,"end":null,"note":"","category":"book|game|electronics|equipment|tool|other"}],"questions":["..."]}
Message:
"""${text.slice(0,6000)}"""`;
  try{const opt={modelTier:"default",cache:false};if(D_.files?.length)opt.images=D_.files;const r=await SAMPLE.json(prompt,opt);D_.items=(Array.isArray(r?.items)?r.items:[]).filter(x=>x&&(x.title||x.type==="update")).map(x=>({...x,title:x.title||(S.events||[]).find(e=>e.id===x.id)?.title||"Change",who:["you","kid","both"].includes(x.who)?x.who:x.type==="rest"?"kid":"you",keep:true})).map(fixItem);D_.questions=Array.isArray(r?.questions)?r.questions.filter(q=>typeof q==="string").slice(0,3):[];if(D_.items.length)clearIn("dumpText");if(!D_.items.length&&!D_.questions.length)D_.err="We couldn't find plans in that. Try adding days and times.";sfx(D_.items.length?"ok":"no")}
  catch(e){D_.err=({not_granted:"Claude wasn't allowed for this page, so we can't sort it. Use quick add below.",rate_limited:"Too many requests just now. Try again in a minute.",image_rejected:"That photo couldn't be read. Try a different one.",invalid_json:"We couldn't read the answer. Try again.",images_unavailable:"Photos can't be sent from this view. Type it instead."})[e?.code]||"Something went wrong. Try again.";sfx("no")}
  D_.busy=false;render()}