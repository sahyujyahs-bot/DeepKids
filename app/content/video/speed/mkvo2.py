import os,json,subprocess
from gtts import gTTS
S=[
["How fast was the car?","Galileo found this formula: speed is distance divided by time.","That is its average speed."],
["When someone says a place is ten minutes away, they have intuitively assumed your average speed."],
["The Vaisheshika school of thought believed that Vayga is an inherent characteristic of a rolled object.","Today we call it momentum."],
["The astronomer Bhaskara the Second figured out that the Earth revolves with a variable speed."],
["Two buses moving at the same speed.","Each looks to be at rest for the other."],
["Myriam Hirt found a pattern.","Speed increases with body size to a point, and then decreases."],
["J. C. Bose measured a plant's growth, and its movements."],
["Thinking happens in both.","Waves in neurons travel at about a hundred metres each second,","and ion flow in plants at a few centimetres each second."],
["Nothing in this universe with mass can cross the speed of light."],
["Except space.","It is not travelling. It is stretching, and it has no speed limit."],
["Just one speed unit covers all these perspectives, and more."],
]
PAUSE=0.55;os.makedirs('vo2',exist_ok=True)
subprocess.run(['ffmpeg','-y','-v','error','-f','lavfi','-i','anullsrc=r=48000:cl=mono','-t',str(PAUSE),'vo2/pause.wav'])
out={'dur':[],'sent':[],'voice':'gTTS co.in'}
for i,sents in enumerate(S):
    t=0;starts=[];files=[]
    for j,s in enumerate(sents):
        f=f'vo2/s{i+1}_{j}'
        gTTS(s,lang='en',tld='co.in').save(f+'.mp3')
        subprocess.run(['ffmpeg','-y','-v','error','-i',f+'.mp3','-af','atempo=0.95,loudnorm=I=-17:TP=-1.5','-ar','48000','-ac','1',f+'.wav'])
        d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f+'.wav']))
        starts.append([round(t,2),round(t+d,2)]);files.append(f+'.wav');t+=d+PAUSE
    open(f'vo2/l{i+1}.txt','w').write(''.join(f"file '{os.path.abspath(f)}'\nfile '{os.path.abspath('vo2/pause.wav')}'\n" for f in files))
    subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',f'vo2/l{i+1}.txt','-c','copy',f'vo2/v{i+1}.wav'])
    out['sent'].append(starts);out['dur'].append(round(t-PAUSE,2))
json.dump(out,open('vo2/vo.json','w'));print(out['dur'],round(sum(out['dur']),1))
