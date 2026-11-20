import cv2
import numpy as np
from PIL import Image

def fix_wood_top(img_p, out_p):
    img = Image.open(img_p).convert('RGB')
    arr = np.array(img)
    r = arr[:, :, 0].astype(int)
    g = arr[:, :, 1].astype(int)
    b = arr[:, :, 2].astype(int)
    
    # Wood desk: warm tones, high brightness
    is_wood = ((r - b > 8) & (r >= g - 10) & (r > 70)) | ((r > 180) & (g > 180) & (b > 160) & (r > b))
    
    wood_u8 = (is_wood.astype(np.uint8) * 255)
    flood = np.zeros_like(wood_u8)
    
    for x in range(0, arr.shape[1], 10):
        if is_wood[0, x]:
            m = np.zeros((arr.shape[0] + 2, arr.shape[1] + 2), np.uint8)
            cv2.floodFill(wood_u8.copy(), m, (x, 0), 255)
            flood = np.maximum(flood, m[1:-1, 1:-1])
            
    for y in range(0, int(arr.shape[0] * 0.5), 10):
        for x in [0, arr.shape[1] - 1]:
            if is_wood[y, x]:
                m = np.zeros((arr.shape[0] + 2, arr.shape[1] + 2), np.uint8)
                cv2.floodFill(wood_u8.copy(), m, (x, y), 255)
                flood = np.maximum(flood, m[1:-1, 1:-1])

    alpha = np.where(flood > 0, 0, 255).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    
    if np.all(alpha == 255):
        alpha[0, 0] = 254
        
    out = np.dstack([arr, alpha])
    Image.fromarray(out, 'RGBA').save(out_p, 'WEBP', quality=95)

folder = 'frontend/public/assets/archive'
targets = [
    'img_5530_2.webp', 'img_5863.webp', 'img_5871.webp', 'img_5914.webp',
    'img_5488_2.webp', 'img_5844.webp', 'img_5848.webp', 'img_5849.webp', 'img_5878.webp'
]

for f in targets:
    in_p = f'{folder}/{f}'
    out_p = f'{folder}/{f.replace(".webp", "_cutout.webp")}'
    fix_wood_top(in_p, out_p)
    print(f'Processed {f}')

print('All 9 detail cutouts refined.')
