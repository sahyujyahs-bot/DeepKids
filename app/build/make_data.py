import json,sys,os
sys.path.insert(0,os.path.dirname(__file__))
from sci_l1_data import T
from boards import BOARDS,RES,WEEKS
topics=[]
for t in T:
    topics.append({"id":t["id"],"q":t["q"],"name":t["topic"],"sub":[s.strip("• ").strip() for s in t["subtopics"].split("\n") if s.strip()],
      "summary":t["summary"],"oneness":t["oneness"],"res":[{"type":a,"title":b,"url":c} for a,b,c in RES.get(t["id"],[])],"weeks":WEEKS[t["id"]],
      "full": t["id"]=="A1"})
data={"topics":topics,"boards":{k:{"name":v["name"],"note":v["note"],"books":[{"title":b["title"],"chapters":[{"n":n,"title":ti,"topics":tp} for n,ti,tp in b["chapters"]]} for b in v["books"]]} for k,v in BOARDS.items()}}
print(json.dumps(data,ensure_ascii=False,separators=(",",":")))
