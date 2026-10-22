function splitSent(t){const out=[];let cur="",q=null;for(let i=0;i<t.length;i++){const c=t[i],p=t[i-1]||" ",n=t[i+1]||" ";let closed=false;
    if(!q&&(c==="“"||(c==="'"&&/[\s:(—-]/.test(p)))){q=c==="“"?"”":"'"}else if(q&&(c===q||(q==="'"&&c==="’"))&&(q==="”"||/[\s.,!?;:)—-]/.test(n))){q=null;closed=true}
    cur+=c;const end=(!q&&!closed&&/[.!?]/.test(c))||(closed&&/[.!?]/.test(p))||(!q&&c===")"&&/[.!?]/.test(p));
    if(end&&/\s/.test(n)&&/[A-Z('‘“0-9]/.test(t[i+2]||"")){out.push(cur.trim());cur=""}}
  if(cur.trim())out.push(cur.trim());return out}
function fmtPts(text,plain){if(!text)return "";let t=String(text).replace(/\bDo (Experiment|Activity) [ea]\d+(?:,? [^.]*?)?\.\s*/g,(m,k)=>`Use the ${k.toLowerCase()} card below. `).replace(/\bDo Worksheet ws\d+(?: \((core|stretch|challenge)\))?\.?/g,"Open the worksheet below.").replace(/\b(?:in |from )?Voice v\d+\b/g,"on the card below").replace(/\bthe ['‘]why['’] of [ea]\d+\b/gi,"'Why it happens' on the card below").replace(/\b(Experiment|Activity) [ea]\d+\b/g,(m,k)=>"the "+k.toLowerCase());
  const S=splitSent(t),items=[];S.forEach(x=>{if(/^\(.*\)\.?$/.test(x)&&items.length){items[items.length-1].ans=(items[items.length-1].ans?items[items.length-1].ans+" ":"")+x.replace(/^\(|\)\.?$/g,"");return}
    const m=x.match(/^(.*?['’”?])\s*\(([^()]+)\)\.?$/);if(m&&/^(Ask|['‘“])/.test(x)){items.push({t:m[1],ans:m[2]});return}items.push({t:x})});
  const ic=x=>plain?"p-pl":/^Ask:|\bask:\s*['‘“]|^['‘“]|[?]['’”]?$/i.test(x)?"p-ask":/^(Say|Tell|Explain)\b/.test(x)?"p-say":/^(Read|Open|Turn to|Look at)\b/.test(x)?"p-read":/^(If|Note|Be honest|Safety)/.test(x)?"p-note":"p-do";
  return `<ul class="pts">${items.map(x=>`<li class="${ic(x.t)}"><span>${esc(x.t)}</span>${x.ans?`<span class="ans"><b>Listen for:</b> ${esc(x.ans)}</span>`:""}</li>`).join("")}</ul>`}
const packStep=(u,s)=>`${fmtPts(s.do)}${s.ref?pkRef(u,s.ref):""}`;
const pkVoice=v=>`<div class="pk voicecard"><span class="vst ${esc(v.status)}">${VST[v.status]||esc(v.status)}</span><b>${esc(v.who)}</b>${fmtPts(v.idea,1)}<span class="eyebrow">Back then</span>${fmtPts(v.then,1)}<span class="eyebrow">Today</span>${fmtPts(v.now,1)}<div class="ask"><span class="eyebrow">Ask your child</span>${esc(v.ask)}</div></div>`;
