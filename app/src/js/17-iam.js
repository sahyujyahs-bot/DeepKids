/* I am, the DeepKids teacher: a lion-man with four arms, sitting on a stone step with a book. Tap him to talk (fxChat).
   States are classes on any parent: .iamthink (waiting for an answer: his eyes close), .iamtalk (answering: he speaks).
   The small sizes (big, mini) show his face in a round frame. */
function iamFace(cls = "") {
  return `<span class="iam ${cls}" aria-hidden="true"><span class="iamframe"><span class="iamfig"><img class="iambody" src="media/ui/iam.webp" alt=""><img class="iamblink" src="media/ui/iam-blink.webp" alt=""><img class="iammouth" src="media/ui/iam-talk.webp" alt=""></span></span></span>`;
}
// after an answer arrives, he speaks for about as long as it would take to say it
function iamSay(el, text) {
  el.classList.remove("iamthink");
  el.classList.add("iamtalk");
  clearTimeout(el._iamT);
  el._iamT = setTimeout(() => el.classList.remove("iamtalk"), Math.min(7000, 1200 + text.length * 25));
}
// where the family is when they tap I am: the screen or open panel, the words in the middle of the screen,
// and a few questions that suit that place
const IAM_ASKS = {
  unit: ["Explain this simply", "Give me a real-life example", "Ask me a question about it"],
  sheet: ["Explain this simply", "Give me an idea to try"],
  today: ["What should we start with today?", "Make today's lesson more fun"],
  week: ["Help me plan this week", "We have a trip coming. What changes?"],
  journey: ["How is my child doing?", "What should we go over again?"],
  library: ["What should we learn next?", "Find something about space"],
};
function iamWhere() {
  const top = [...document.querySelectorAll("dialog[open]")].filter((d) => d.id !== "fxChat").pop(),
    mid = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  let el = mid;
  while (el && el !== top && el !== document.body && (el.innerText || "").trim().length < 80) el = el.parentElement;
  const about = (el && el !== document.body ? el.innerText : "").trim().slice(0, 1500);
  if (top?.id === "fxDlg" && FXU) return { kind: "unit", where: `the unit “${FXU.title}”`, about };
  if (top) {
    const h = top.querySelector("h1,h2,h3,b")?.innerText?.trim();
    return { kind: "sheet", where: h ? `“${h.slice(0, 60)}”` : "this page", about };
  }
  const name = NAV.find(([k]) => k === tab)?.[1] || "the app";
  return { kind: IAM_ASKS[tab] ? tab : "today", where: `the ${name} screen`, about };
}
// one I am on screen: he moves into whichever panel is open on top, so he is always there to tap
function iamFollow() {
  const b = document.getElementById("fxFab");
  if (!b) return;
  const top = [...document.querySelectorAll("dialog[open]")].filter((d) => d.id !== "fxChat").pop() || document.body;
  if (b.parentElement !== top) top.appendChild(b);
}
