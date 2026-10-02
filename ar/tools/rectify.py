import cv2, numpy as np
U='/root/.claude/uploads/a7deec85-6caa-5290-a09d-cef236463621/'
src=cv2.imread(U+'40b447be-image.jpg'); h,w=src.shape[:2]
print('screenshot',w,'x',h)
hsv=cv2.cvtColor(src,cv2.COLOR_BGR2HSV)
v=hsv[:,:,2].astype(np.int32); sat=hsv[:,:,1].astype(np.int32)
# the card is the one vivid, bright thing in a dark room
m=((v>70)&(sat>70)).astype(np.uint8)*255
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((31,31),np.uint8))
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((21,21),np.uint8))
cnts,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
cand=[]
for c in sorted(cnts,key=cv2.contourArea,reverse=True)[:8]:
    a=cv2.contourArea(c)
    if a<0.03*w*h: continue
    r=cv2.minAreaRect(c); (cw,ch)=r[1]
    if cw<10 or ch<10: continue
    ar=min(cw,ch)/max(cw,ch)
    cand.append((a,ar,r))
    print(f'  candidate area={a/(w*h):.3f} aspect={ar:.3f} size={cw:.0f}x{ch:.0f}')
pick=[c for c in cand if 0.62<c[1]<0.86]
print('usable:',len(pick))
if not pick: raise SystemExit('no card-shaped region')
a,ar,r=pick[0]
pts=cv2.boxPoints(r).astype(np.float32)
s=pts.sum(1); d=np.diff(pts,axis=1).ravel()
o=np.float32([pts[np.argmin(s)],pts[np.argmin(d)],pts[np.argmax(s)],pts[np.argmax(d)]])
print('corners:',[[round(x),round(y)] for x,y in o])
W,H=1140,1540
flat=cv2.warpPerspective(src,cv2.getPerspectiveTransform(o,np.float32([[0,0],[W,0],[W,H],[0,H]])),(W,H))
lab=cv2.cvtColor(flat,cv2.COLOR_BGR2LAB); L,A,B=cv2.split(lab)
L=cv2.createCLAHE(clipLimit=2.0,tileGridSize=(8,8)).apply(L)
flat=cv2.cvtColor(cv2.merge((L,A,B)),cv2.COLOR_LAB2BGR)
cv2.imwrite('/tmp/claude-0/noether-target.png',flat)
print('written',flat.shape)
