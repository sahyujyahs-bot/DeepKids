import os,sys,html
HERE=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,HERE)
from c3_daily import X
from catalog import NCERT
from ncert_evs_content import C
FD="/tmp/claude-0/-home-user/19592352-17e5-5d4c-8f59-ec21b7793c21/scratchpad/kd/fonts"
e=html.escape
css=f'''@font-face{{font-family:YS;src:url(file://{FD}/YoungSerif-Regular.ttf)}}@font-face{{font-family:OF;src:url(file://{FD}/Outfit-Regular.ttf)}}@font-face{{font-family:OF;font-weight:700;src:url(file://{FD}/Outfit-Bold.ttf)}}
@page{{size:A4;margin:0}}*{{box-sizing:border-box;margin:0}}body{{font-family:OF;color:#2A1A14}}
.pg{{width:210mm;height:297mm;padding:14mm 15mm;page-break-after:always;position:relative}}
.top{{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.2mm solid #B8322A;padding-bottom:3mm}}
h1{{font-family:YS;font-weight:400;font-size:21pt}} .meta{{font-size:9pt;color:#6E5A4C}}
.name{{font-size:10pt;margin:3mm 0 4mm}} .sec{{border:.4mm solid #D9C9A6;border-radius:3mm;padding:3.5mm 4.5mm;margin-bottom:3mm}}
.sec h2{{font-family:YS;font-weight:400;font-size:13pt;margin-bottom:1.5mm}} .sec p{{font-size:10.5pt;line-height:1.45}}
.lines{{margin-top:2mm}} .lines div{{border-bottom:.3mm solid #CDBF9E;height:7mm}}
.box{{border:.3mm dashed #CDBF9E;border-radius:2mm;height:27mm;margin-top:2mm}}
.one{{font-family:YS;font-size:10.5pt;border-left:1.2mm solid #E8A317;padding-left:4mm;margin-top:3mm;line-height:1.4}}
table{{width:100%;border-collapse:collapse;font-size:10pt;margin-top:3mm}} th{{background:#0E6E6E;color:#fff;padding:2mm;text-align:left;font-weight:700}} td{{border:.3mm solid #CDBF9E;height:11mm}}
.foot{{position:absolute;bottom:9mm;left:15mm;right:15mm;font-size:8pt;color:#6E5A4C;display:flex;justify-content:space-between}}
'''
titles=NCERT[("sci",3)][1]
HOW={1:"List every job at home. Each day, write who did it. Halfway through the week, swap jobs.",
 2:None,3:"Look at the Moon at the same time each evening. Draw its shape and note any festival close to that date.",
 4:None,5:"Look under flowerpots, stones and leaves (put everything back gently). Record what lives there.",
 6:"Pick one harmony action as a family and do it every day for two weeks.",7:"For one whole day, count every mug or bucket of water the family uses.",
 8:None,9:None,10:None,11:None,12:None}
pages=[]
for n,x in sorted(X.items()):
    t=titles[n-1];c=C[(3,n)]
    secs="".join(f'<div class="sec"><h2>{i}. {e(h)}</h2><p>{e(b)}</p>'+('<div class="box"></div>' if any(w in b.lower() for w in ("draw","sketch","design")) else '<div class="lines"><div></div><div></div><div></div></div>')+'</div>' for i,(h,b) in enumerate(x["ws"],1))
    pages.append(f'<div class="pg"><div class="top"><h1>{e(t)}</h1><span class="meta">Worksheet · Our Wondrous World Class 3, Ch {n} · DeepKids Level 3</span></div><div class="name">Name: ____________________ &nbsp;&nbsp; Date: ____________</div>{secs}<div class="one">{e(x["oneness"])}</div><div class="foot"><span>DeepKids</span><span>Think deeper: {e(x["think"][0])}</span></div></div>')
    title,cols,rows=x["sheet"]
    tbl="<table><tr>"+"".join(f"<th>{e(h)}</th>" for h in cols)+"</tr>"+"".join("<tr>"+"<td></td>"*len(cols)+"</tr>" for _ in range(rows))+"</table>"
    pages.append(f'<div class="pg"><div class="top"><h1>{e(title)}</h1><span class="meta">Activity sheet · {e(t)} · Ch {n}</span></div><div class="name">Name: ____________________ &nbsp;&nbsp; Started on: ____________</div>'
      f'<div class="sec"><h2>What we are doing</h2><p>{e(HOW[n] or c["exp"][0])}</p></div><div class="sec"><h2>My guess before we start</h2><div class="lines"><div></div><div></div></div></div>{tbl}'
      f'<div class="sec" style="margin-top:4mm"><h2>What I found, and what surprised me</h2><div class="lines"><div></div><div></div><div></div></div></div><div class="foot"><span>DeepKids</span><span>{e(x["think"][-1][:110])}</span></div></div>')
open(os.path.join(HERE,"ws.html"),"w").write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(pages)}</body></html>')
print(len(pages),"pages")
