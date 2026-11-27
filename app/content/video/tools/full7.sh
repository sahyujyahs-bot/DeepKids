set -e
cd /tmp/sh/vo
A=/tmp/sh/dna/sb/anim9; T=/tmp/sh/tts
ffmpeg -y -v error -i $A/a01.mp4 -t 19.9 -vf "fps=30,format=yuv420p" -an -c:v libx264 -crf 20 -preset fast p1.mp4
ffmpeg -y -v error -i $A/a12.mp4 -t 13.2 -vf "fps=30,format=yuv420p,fade=t=in:d=0.3" -an -c:v libx264 -crf 20 -preset fast p2.mp4
ffmpeg -y -v error -i $A/a10.mp4 -t 5.9 -vf "fps=30,format=yuv420p,fade=t=in:d=0.3" -an -c:v libx264 -crf 20 -preset fast p3.mp4
ffmpeg -y -v error -i $A/a11.mp4 -t 6.9 -vf "fps=30,format=yuv420p,fade=t=in:d=0.3" -an -c:v libx264 -crf 20 -preset fast p4.mp4
printf "file p1.mp4\nfile p2.mp4\nfile p4.mp4\nfile p3.mp4\n" > pl.txt
ffmpeg -y -v error -f concat -i pl.txt -c:v libx264 -crf 20 -pix_fmt yuv420p whole.mp4
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 whole.mp4); echo dur $dur
ffmpeg -y -v error -ss 0 -to 13.0 -i voice_clean.wav -af "afade=t=out:st=12.9:d=0.1" -ar 44100 own1.wav
ffmpeg -y -v error -ss 107.2 -to 112.4 -i voice_clean.wav -ar 44100 own2.wav
ffmpeg -y -v error -ss 13.3 -to 19.3 -i voice_clean.wav -ar 44100 own3.wav
ffmpeg -y -v error -i whole.mp4 -i $T/q0.wav -i $T/q1.wav -i $T/q2.wav -i own1.wav -i own2.wav -i own3.wav -i /tmp/sh/reel/v4/music2.wav -filter_complex "[1:a]loudnorm=I=-16,aresample=44100,adelay=300|300[a0];[2:a]loudnorm=I=-16,aresample=44100,adelay=7700|7700[a1];[3:a]loudnorm=I=-16,aresample=44100,adelay=14500|14500[a2];[4:a]aresample=44100,adelay=20000|20000[o1];[5:a]aresample=44100,adelay=40200|40200[o2];[6:a]aresample=44100,adelay=33200|33200[o3];[7:a]aresample=44100,volume=0.09,afade=t=in:d=1,afade=t=out:st=$(python3 -c "print($dur-2.5)"):d=2.5[m];[a0][a1][a2][o1][o3][o2][m]amix=inputs=7:duration=longest:dropout_transition=0:normalize=0,volume=1.0[a]" -map 0:v -map "[a]" -t $dur -c:v libx264 -crf 24 -preset medium -c:a aac -b:a 160k -movflags +faststart video-one-v7.mp4
ls -la video-one-v7.mp4
