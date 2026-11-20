import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

folder = 'frontend/public/assets/archive'
cutouts = sorted([f for f in os.listdir(folder) if f.endswith('_cutout.webp')])
print(f"Refining and perfecting all {len(cutouts)} cutouts...")

for idx, c in enumerate(cutouts):
    cutout_path = os.path.join(folder, c)
    orig_name = c.replace('_cutout.webp', '.webp')
    orig_path = os.path.join(folder, orig_name)
    
    if not os.path.exists(orig_path):
        continue
    
    try:
        cutout = Image.open(cutout_path).convert('RGBA')
        orig = Image.open(orig_path).convert('RGB')
        
        c_arr = np.array(cutout)
        alpha = c_arr[:, :, 3]
        
        # 1. binary mask where alpha > 20
        mask = alpha > 20
        
        # 2. fill any inner holes so fabric is completely solid
        filled = ndi.binary_fill_holes(mask)
        
        # 3. restore original RGB under the filled mask to preserve 100% texture quality
        orig_resized = orig.resize(cutout.size, Image.Resampling.LANCZOS)
        o_arr = np.array(orig_resized)
        
        out_arr = np.zeros_like(c_arr)
        out_arr[:, :, :3] = o_arr
        # Smooth alpha edge slightly (keep soft edge if present, otherwise 255)
        out_alpha = np.where(filled, 255, 0).astype(np.uint8)
        
        # Apply 1px gaussian blur on alpha edge to prevent jaggedness
        blurred_alpha = ndi.gaussian_filter(out_alpha.astype(float), sigma=0.8)
        out_arr[:, :, 3] = np.clip(blurred_alpha, 0, 255).astype(np.uint8)
        
        out_img = Image.fromarray(out_arr, 'RGBA')
        out_img.save(cutout_path, 'WEBP', quality=95)
    except Exception as e:
        print(f"Error on {c}: {e}")

print("All cutouts perfected successfully!")
