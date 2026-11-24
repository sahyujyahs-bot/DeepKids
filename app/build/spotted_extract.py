"""List the "Spot it around you" lines that name a place, in a small form a writer can read cheaply.
Usage: python3 app/build/spotted_extract.py [first last]   (a slice, 0-based)
Prints JSON: [{"id": lesson id, "i": line number, "text": the line}]"""
import json, glob, os, re, sys
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PL = re.compile(r"\b(?:Kerala|Chennai|Tamil Nadu|Kolkata|Mumbai|Kochi|India|Karnataka|Odisha|Bengaluru|Gujarat|Hyderabad|Assam|Pune|Madurai|Goa|Ahmedabad|Rajasthan|Guwahati|Bengal|Delhi|Sundarbans|Jaipur|Puri|Maharashtra|Marina Beach|Thoothukudi|Western Ghats|West Bengal|Andhra Pradesh|Munnar|Pichavaram|Ooty|Kutch|Shillong|Kovalam|Meghalaya|Kanyakumari|Thanjavur|Bandipur|Rushikulya|Kaveri|Rameswaram|Varanasi|Punjab|Nilgiris|Kodaikanal|Lucknow|Coimbatore|Patna|Bhopal|Kanpur|Uttarakhand|Himachal|Chilika|Kaziranga|Madhya Pradesh|Tirunelveli|Trichy|Mysuru|Nagpur|Surat|Agra|Amritsar|Srinagar|Leh|Ladakh|Sikkim|Tripura|Manipur|Mizoram|Nagaland|Jharkhand|Bihar|Chhattisgarh|Telangana|Haryana|Uttar Pradesh|Kozhikode|Thiruvananthapuram|Alappuzha|Visakhapatnam|Bhubaneswar|Cuttack|Ranchi|Dehradun|Chandigarh|Indore|Vadodara|Rajkot|Nashik|Kolhapur|Mangaluru|Udupi|Hampi|Gir|Ranthambore|Corbett|Periyar|Wayanad|Kodagu|Coorg|Anamalai|Valparai|Guindy|Chettinad|Guruvayur|Sivakasi|Kanchipuram|Mahabalipuram|Pondicherry|Puducherry|Lakshadweep|Andaman|Nicobar)\b")
rows = []
for f in sorted(glob.glob(os.path.join(APP, "content", "units", "*", "*.json"))):
    if f.endswith(".art.json"): continue
    try: u = json.load(open(f))
    except Exception: continue
    if not isinstance(u, dict): continue
    for i, s in enumerate(u.get("spotted", [])):
        if PL.search(s.get("text", "")): rows.append({"id": u["id"], "i": i, "text": s["text"]})
a, b = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) >= 3 else (0, len(rows))
print(json.dumps(rows[a:b], ensure_ascii=False, indent=0))
