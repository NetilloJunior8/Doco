import os
import glob
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from rembg import remove

ARCHIVE_DIR = 'frontend/public/assets/archive'
MANNEQUIN_PATH = 'frontend/public/assets/brand/mannequin_base.png'

def fix_cutout_and_mannequin(base_name, mannequin_img):
    src_path = os.path.join(ARCHIVE_DIR, f"{base_name}.webp")
    dst_cutout = os.path.join(ARCHIVE_DIR, f"{base_name}_cutout.webp")
    dst_mfront = os.path.join(ARCHIVE_DIR, f"{base_name}_mannequin_front.webp")
    dst_mback = os.path.join(ARCHIVE_DIR, f"{base_name}_mannequin_back.webp")
    
    if not os.path.exists(src_path):
        print(f"Source not found: {src_path}")
        return
        
    print(f"Processing clean cutout for {base_name}...")
    raw = Image.open(src_path).convert('RGB')
    rem = remove(raw)
    r, g, b, a = rem.split()
    
    # Binary fill holes to completely preserve all graphics/prints/fabrics
    mask = np.array(a) > 25
    filled = ndimage.binary_fill_holes(mask)
    clean_alpha = np.where(filled, 255, 0).astype(np.uint8)
    clean_alpha_im = Image.fromarray(clean_alpha).filter(ImageFilter.GaussianBlur(0.8))
    
    out = Image.merge('RGBA', (r, g, b, clean_alpha_im))
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
        
    w, h = out.size
    dim = max(w, h) + 60
    sq = Image.new('RGBA', (dim, dim), (0, 0, 0, 0))
    sq.paste(out, ((dim - w) // 2, (dim - h) // 2))
    sq.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    sq.save(dst_cutout, format='WEBP', quality=88)
    print(f"Saved solid cutout: {dst_cutout}")
    
    # Generate mannequin composite
    target_w = 350
    aspect = sq.height / sq.width
    target_h = int(target_w * aspect)
    garment_scaled = sq.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    pos_x = (mannequin_img.width - target_w) // 2
    pos_y = 172
    
    shadow = Image.new('RGBA', mannequin_img.size, (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 75), (pos_x + 2, pos_y + 4), mask=garment_scaled)
    shadow = shadow.filter(ImageFilter.GaussianBlur(5))
    
    res = mannequin_img.copy()
    res = Image.alpha_composite(res, shadow)
    res.paste(garment_scaled, (pos_x, pos_y), mask=garment_scaled)
    
    res.save(dst_mfront, format='WEBP', quality=88)
    print(f"Saved mannequin front: {dst_mfront}")
    
    # Also save back view if requested or as fallback
    res.save(dst_mback, format='WEBP', quality=88)

def main():
    targets = [
        'img_5488_2',
        'img_5502_2',
        'img_5507_2',
        'img_5514_2',
        'img_5529_2',
        'img_5533_2',
        'img_5538_2',
        'img_5542_2'
    ]
    mannequin = Image.open(MANNEQUIN_PATH).convert('RGBA')
    for t in targets:
        fix_cutout_and_mannequin(t, mannequin)
    print("ALL HOLE DEFECTS REPAIRED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
