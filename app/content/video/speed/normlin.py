import subprocess,json,sys,re
def normlin(inp,out,pre='highpass=f=70',I=-17,TP=-1.5,LRA=9):
    r=subprocess.run(['ffmpeg','-hide_banner','-i',inp,'-af',f'{pre},loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json','-f','null','-'],capture_output=True,text=True)
    j=json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr,re.S).group(0))
    af=f"{pre},loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
    subprocess.run(['ffmpeg','-y','-v','error','-i',inp,'-af',af,'-ar','48000','-ac','1',out],check=True)
if __name__=='__main__':normlin(*sys.argv[1:3])
