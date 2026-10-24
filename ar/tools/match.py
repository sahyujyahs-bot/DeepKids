import cv2, numpy as np, itertools, os
U = '/root/.claude/uploads/a7deec85-6caa-5290-a09d-cef236463621/'
ART = '/home/user/DeepKids/sci-noether-back.webp'

def load(p, w=1100):
    im = cv2.imread(p, cv2.IMREAD_COLOR)
    s = w / im.shape[1]
    return cv2.cvtColor(cv2.resize(im, None, fx=s, fy=s), cv2.COLOR_BGR2GRAY)

orb = cv2.ORB_create(nfeatures=6000)
def kp(img): return orb.detectAndCompute(img, None)

def inliers(a, b):
    """How many features survive a ratio test AND a single consistent
       perspective fit — which is exactly what an image tracker needs
       to lock on."""
    ka, da = kp(a); kb, db = kp(b)
    if da is None or db is None: return 0, 0
    bf = cv2.BFMatcher(cv2.NORM_HAMMING)
    good = [m for m, n in bf.knnMatch(da, db, k=2) if m.distance < 0.75 * n.distance]
    if len(good) < 8: return len(good), 0
    src = np.float32([ka[m.queryIdx].pt for m in good]).reshape(-1,1,2)
    dst = np.float32([kb[m.trainIdx].pt for m in good]).reshape(-1,1,2)
    H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
    return len(good), int(mask.sum()) if mask is not None else 0

def warp_like_a_photo(img):
    """The repo art put through what a camera does to it: perspective,
       a little blur, and a lift in brightness. The positive control."""
    h, w = img.shape
    src = np.float32([[0,0],[w,0],[w,h],[0,h]])
    dst = np.float32([[w*.08,h*.05],[w*.95,h*.02],[w*.90,h*.97],[w*.04,h*.93]])
    out = cv2.warpPerspective(img, cv2.getPerspectiveTransform(src,dst), (w,h))
    out = cv2.GaussianBlur(out, (5,5), 1.4)
    return np.clip(out.astype(np.float32)*1.25 + 18, 0, 255).astype(np.uint8)

art = load(ART)
photos = {
  'photo A (plain card)':  load(U+'503a5046-image.jpg'),
  'photo B (plain card)':  load(U+'0fd16558-image.jpg'),
  'photo C (plain card)':  load(U+'bc7937be-image.jpg'),
}

print('POSITIVE CONTROL — does the method work at all?')
g, i = inliers(art, warp_like_a_photo(art))
print(f'  repo art  vs  repo art, warped + blurred + brightened : {i:4d} consistent matches  (of {g} candidates)')

print('\nCONTROL — are the phone photos good enough to track from?')
for (n1,p1),(n2,p2) in itertools.combinations(photos.items(), 2):
    g, i = inliers(p1, p2)
    print(f'  {n1}  vs  {n2} : {i:4d} consistent matches  (of {g})')

print('\nTHE TEST — is the repo art the card in the photos?')
for n, p in photos.items():
    g, i = inliers(art, p)
    print(f'  repo art  vs  {n:22s} : {i:4d} consistent matches  (of {g})')
