import os,sys,html
HERE=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,HERE)
from c3_daily import X
from c3_deep import WS, THINK
from catalog import NCERT
from ncert_evs_content import C
FD="/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/kd/fonts"
e=html.escape
css=f'''@font-face{{font-family:YS;src:url(file://{FD}/YoungSerif-Regular.ttf)}}@font-face{{font-family:OF;src:url(file://{FD}/Outfit-Regular.ttf)}}@font-face{{font-family:OF;font-weight:700;src:url(file://{FD}/Outfit-Bold.ttf)}}
@page{{size:A4;margin:12mm 0}}*{{box-sizing:border-box;margin:0}}body{{font-family:OF;color:#2A1A14}}
.pg{{width:210mm;height:272mm;padding:2mm 15mm;page-break-after:always;position:relative}}
.top{{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.2mm solid #B8322A;padding-bottom:3mm}}
h1{{font-family:YS;font-weight:400;font-size:21pt}} .meta{{font-size:9pt;color:#6E5A4C}}
.name{{font-size:10pt;margin:3mm 0 4mm}} .sec{{border:.4mm solid #D9C9A6;border-radius:3mm;padding:3.5mm 4.5mm;margin-bottom:3mm}}
.sec h2{{font-family:YS;font-weight:400;font-size:13pt;margin-bottom:1.5mm}} .sec p{{font-size:10.5pt;line-height:1.45}}
.lines{{margin-top:2mm}} .lines div{{border-bottom:.3mm solid #CDBF9E;height:7mm}}
.box{{border:.3mm dashed #CDBF9E;border-radius:2mm;height:27mm;margin-top:2mm}}
.one{{font-family:YS;font-size:10.5pt;border-left:1.2mm solid #E8A317;padding-left:4mm;margin-top:3mm;line-height:1.4}}
table{{width:100%;border-collapse:collapse;font-size:10pt;margin-top:3mm}} th{{background:#0E6E6E;color:#fff;padding:2mm;text-align:left;font-weight:700}} td{{border:.3mm solid #CDBF9E;height:11mm}}
.ws{{width:210mm;padding:2mm 15mm;page-break-after:always}} .q{{break-inside:avoid;margin:2.5mm 0 3.5mm}} .q b{{font-size:10.5pt}}
.opts{{display:flex;flex-wrap:wrap;gap:2mm 6mm;font-size:10.5pt;margin-top:1.5mm}} .tok{{display:inline-block;border:.3mm solid #CDBF9E;border-radius:4mm;padding:.5mm 3mm;margin:1mm 1.5mm 0 0;font-size:10pt}}
.cats{{display:flex;gap:3mm;margin-top:2mm}} .cats div{{flex:1;border:.3mm dashed #CDBF9E;border-radius:2mm;min-height:22mm;padding:1.5mm 2.5mm;font-weight:700;font-size:10pt}}
.mt{{display:grid;grid-template-columns:1fr 1fr;gap:1.5mm 14mm;font-size:10.5pt;margin-top:2mm}} .sech{{font-family:YS;font-size:13.5pt;color:#B8322A;margin:5mm 0 1mm;break-after:avoid}}
.key{{font-size:9.5pt;line-height:1.5}} .key h3{{font-family:YS;font-weight:400;font-size:12pt;margin-top:3mm}}
.foot{{position:absolute;bottom:0;left:15mm;right:15mm;font-size:8pt;color:#6E5A4C;display:flex;justify-content:space-between}}
'''
titles=NCERT[("sci",3)][1]
HOW={1:"List every job at home. Each day, write who did it. Halfway through the week, swap jobs.",
 2:None,3:"Look at the Moon at the same time each evening. Draw its shape and note any festival close to that date.",
 4:None,5:"Look under flowerpots, stones and leaves (put everything back gently). Record what lives there.",
 6:"Pick one harmony action as a family and do it every day for two weeks.",7:"For one whole day, count every mug or bucket of water the family uses.",
 8:None,9:None,10:None,11:None,12:None}
pages=[];keys=[]
for n,x in sorted(X.items()):
    t=titles[n-1];c=C[(3,n)]
    qn=0;body="";key=[]
    for si,(sh,its) in enumerate(WS[n]):
        body+=f'<div class="sech">{e(sh)}</div>'
        for it in its:
            qn+=1;k=it["t"];q=f'<div class="q"><b>{qn}. {e(it["p"])}</b>'
            if k=="mcq":
                q+='<div class="opts">'+"".join(f'<span>☐ {e(o)}</span>' for o in it["opts"])+'</div>';key.append(f'{qn}. {it["opts"][it["a"]]}')
            elif k=="fill":
                q+='<div class="lines">'+'<div></div>'*len(it["a"])+'</div>';key.append(f'{qn}. '+" · ".join(it["a"]))
            elif k=="write": q+='<div class="lines">'+'<div></div>'*it.get("lines",3)+'</div>'
            elif k=="draw": q+='<div class="box" style="height:48mm"></div>'
            elif k=="table":
                pre=it.get("prefill") or []
                q+="<table><tr>"+"".join(f"<th>{e(h)}</th>" for h in it["cols"])+"</tr>"+"".join("<tr>"+"".join(f'<td style="padding:0 2mm">{e(pre[r]) if ci==0 and r<len(pre) else ""}</td>' for ci in range(len(it["cols"])))+"</tr>" for r in range(it["rows"]))+"</table>"
            elif k=="sort":
                q+='<div>'+"".join(f'<span class="tok">{e(x)}</span>' for x in it["items"])+'</div><div class="cats">'+"".join(f'<div>{e(c)}</div>' for c in it["cats"])+'</div>'
            elif k=="match":
                rs=sorted(p[1] for p in it["pairs"]);q+='<div class="mt">'+"".join(f'<span>{e(l)} ●</span><span>● {e(r)}</span>' for (l,_),r in zip(it["pairs"],rs))+'</div>';key.append(f'{qn}. '+"; ".join(f"{l} → {r}" for l,r in it["pairs"]))
            body+=q+'</div>'
    keys.append((n,t,key))
    pages.append(f'<div class="ws"><div class="top"><h1>{e(t)}</h1><span class="meta">Worksheet · Our Wondrous World Class 3, Ch {n} · DeepKids Level 3</span></div><div class="name">Name: ____________________ &nbsp;&nbsp; Date: ____________</div>{body}<div class="one">Big question: {e(THINK[n][0]["q"])}<br>{e(x["oneness"])}</div></div>')
    title,cols,rows=x["sheet"]
    tbl="<table><tr>"+"".join(f"<th>{e(h)}</th>" for h in cols)+"</tr>"+"".join("<tr>"+"<td></td>"*len(cols)+"</tr>" for _ in range(rows))+"</table>"
    pages.append(f'<div class="pg"><div class="top"><h1>{e(title)}</h1><span class="meta">Activity sheet · {e(t)} · Ch {n}</span></div><div class="name">Name: ____________________ &nbsp;&nbsp; Started on: ____________</div>'
      f'<div class="sec"><h2>What we are doing</h2><p>{e(HOW[n] or c["exp"][0])}</p></div><div class="sec"><h2>My guess before we start</h2><div class="lines"><div></div><div></div></div></div>{tbl}'
      f'<div class="sec" style="margin-top:4mm"><h2>What I found, and what surprised me</h2><div class="lines"><div></div><div></div><div></div></div></div><div class="foot"><span>DeepKids</span><span>{e(x["think"][-1][:110])}</span></div></div>')
pages.append('<div class="ws"><div class="top"><h1>Answer key</h1><span class="meta">For parents · questions with one answer only; the rest are for discussion</span></div><div class="key">'+"".join(f'<h3>Ch {n}. {e(t)}</h3><p>'+"<br>".join(e(k) for k in ks)+'</p>' for n,t,ks in keys if ks)+'</div></div>')
open(os.path.join(HERE,"ws.html"),"w").write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(pages)}</body></html>')
print(len(pages),"pages")
