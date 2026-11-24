import cv2, numpy as np
im=cv2.imread('/tmp/claude-0/noether-target.png'); h,w=im.shape[:2]
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
H,S,V=hsv[:,:,0].astype(int),hsv[:,:,1].astype(int),hsv[:,:,2].astype(int)
# the border is the vivid orange/red ring
m=(((H<22)|(H>170))&(S>110)&(V>110)).astype(np.uint8)*255
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((25,25),np.uint8))
n,lab,stats,_=cv2.connectedComponentsWithStats(m,8)
big=max(range(1,n),key=lambda i:stats[i,cv2.CC_STAT_AREA])
x,y,bw,bh,a=stats[big]
print(f'border box x={x} y={y} w={bw} h={bh} aspect={bw/bh:.3f} (card is 0.740)')
card=im[y:y+bh, x:x+bw]
# resample to the card's true proportions, generously sized for the compiler
W=1140; Hh=int(round(W*1027/760))
card=cv2.resize(card,(W,Hh),interpolation=cv2.INTER_CUBIC)
card=cv2.detailEnhance(card, sigma_s=6, sigma_r=0.12)
cv2.imwrite('/tmp/claude-0/noether-target.png',card)
print('final',card.shape)
