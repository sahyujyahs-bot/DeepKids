import numpy as np,json,sys
from scipy.signal import fftconvolve
from scipy.io import wavfile
sr=48000
B=json.load(open('bounds.json'));T=B['total']+3.0;N=int(T*sr);t=np.arange(N)/sr
rng=np.random.default_rng(42)
Sa=146.83 # D3
def env_pluck(n,dec):return np.exp(-np.arange(n)/sr/dec)
def pluck(f,dur,amp,bright=1.0,dec=1.3):
    n=int(dur*sr);tt=np.arange(n)/sr;y=np.zeros(n)
    for k in range(1,16):
        fk=f*k*(1+0.0004*k*k) # slight inharmonic, sitar-like
        if fk>9000:break
        y+=np.sin(2*np.pi*fk*tt+rng.uniform(0,6.28))*(1/k**(1.1/bright))*np.exp(-tt*(1.0+k*0.9)/dec)
    a=np.minimum(1,tt/0.004)
    return y*a*amp
def add(buf,y,at):
    i=int(at*sr);j=min(N,i+len(y))
    if i<N and j>i:buf[i:j]+=y[:j-i]
dr=np.zeros(N);pad=np.zeros(N);me=np.zeros(N);ch=np.zeros(N)
# tanpura: Pa, Sa, Sa', Sa-low cycling
cyc=[Sa*.75,Sa,Sa*2,Sa*.5];tp=1.05;i=0;tt_=0.3
while tt_<T:
    f=cyc[i%4];y=pluck(f,3.2,.5,bright=.8,dec=2.2)
    # jivari shimmer: slow AM on upper harmonics
    n=len(y);y*=1+.25*np.sin(2*np.pi*(.45+.07*(i%4))*np.arange(n)/sr)
    add(dr,y,tt_);tt_+=tp*(1+.03*np.sin(i));i+=1
# pad: slow triads
chords=[[Sa,Sa*1.5,Sa*2],[Sa,Sa*1.25,Sa*1.5*2],[Sa*.75*2,Sa*1.5,Sa*2*1.25],[Sa,Sa*1.5,Sa*2*1.125]]
seg=7.0;k=0;ts=0.0
while ts<T:
    L=seg+2.0;n=int(L*sr);tt=np.arange(n)/sr
    e=np.minimum(1,tt/2.5)*np.minimum(1,(L-tt)/2.5)
    y=sum(np.sin(2*np.pi*f*tt+.3*np.sin(2*np.pi*.2*tt))*(.5 if j else .8) for j,f in enumerate(chords[k%4]))*e*.12
    add(pad,y,ts);ts+=seg;k+=1
# melody in Bhoopali (S R G P D), mild plucks
semi=[0,2,4,7,9,12,14,16,19,21]
f_of=lambda s:Sa*2**((s)/12)
motifs=[[0,1,2,3,2,1,0],[2,3,4,3,2],[3,2,1,2,0],[0,2,3,4,5,4,3],[4,3,2,1,0],[2,4,3,2]]
beat=0.95;tm=2.0;prev=2
phr=0
while tm<T-4:
    m=motifs[phr%len(motifs)];phr+=1
    for d in m:
        if rng.random()<.22:tm+=beat;continue
        idx=min(len(semi)-1,max(0,d+(1 if rng.random()<.2 else 0)))
        dur=beat*(1.5 if rng.random()<.25 else 1.0)
        add(me,pluck(f_of(semi[idx])*(2 if idx>=5 else 1),2.2,.34,bright=1.0,dec=1.5),tm);tm+=dur
    tm+=beat*rng.choice([2,3,4])
# end: Sa resolves
add(me,pluck(Sa*2,5.0,.4,dec=3.0),B['bounds'][-1]+13.0)
# chimes at scene changes
for bnd in B['bounds'][1:]:
    for j,(mult,a,dc) in enumerate([(1,1,2.2),(2.76,.5,1.4),(5.4,.28,.9),(8.93,.14,.6)]):
        n=int(3.0*sr);tt=np.arange(n)/sr
        add(ch,np.sin(2*np.pi*Sa*4*mult*tt)*np.exp(-tt/dc)*a*.18*np.minimum(1,tt/.003),bnd-.05)
# space-stretch shimmer (scene index 9)
s0,s1=B['bounds'][9],B['bounds'][10]
n=int((s1-s0)*sr);tt=np.arange(n)/sr;f=Sa*4*(1+.5*tt/(s1-s0));ph=2*np.pi*np.cumsum(f)/sr
sh=(np.sin(ph)+.5*np.sin(1.5*ph))*np.sin(np.pi*tt/(s1-s0))**2*.05*(1+.3*np.sin(2*np.pi*5*tt))
add(ch,sh,s0)
dry=dr*.9+pad+me+ch
# reverb
ir_n=int(2.6*sr);ir=rng.standard_normal(ir_n)*np.exp(-np.arange(ir_n)/sr/.7);ir[:int(.012*sr)]=0
wet=fftconvolve(dry,ir/np.sqrt((ir**2).sum()),mode='full')[:N]
mix=dry*.7+wet*.55
fade=np.minimum(1,np.minimum(t/2.0,(T-t)/3.0))
mix*=fade
mix=mix/np.max(np.abs(mix))*.7
wavfile.write('music.wav',sr,(mix*32767).astype(np.int16))
print('music',T,'s')
