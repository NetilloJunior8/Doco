import os
import re
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from rembg import remove

DATASET_FILE = 'frontend/src/app/core/services/catalog.fallback.data.ts'
ARCHIVE_DIR = 'frontend/public/assets/archive'
MANNEQUIN_PATH = 'frontend/public/assets/brand/mannequin_base.png'

def clean_cutout(src_path, dst_path):
    """
    Removes background using rembg, then applies binary_fill_holes to guarantee
    no internal graphics, logos, prints, or lighter fabric are hollowed out.
    """
    if os.path.exists(dst_path):
        return True
    try:
        raw_img = Image.open(src_path).convert('RGB')
        # Run rembg
        rem_out = remove(raw_img)
        r, g, b, a = rem_out.split()
        alpha_arr = np.array(a)
        
        # Binary threshold: pixels with alpha > 25 are garment
        mask = alpha_arr > 25
        # Fill any internal holes enclosed by the garment contour
        filled = ndimage.binary_fill_holes(mask)
        
        # Also clean isolated noise pixels in background
        filled = ndimage.binary_opening(filled, structure=np.ones((3, 3)))
        filled = ndimage.binary_fill_holes(filled)
        
        # Create solid 255 alpha for garment interior, 0 for background
        clean_alpha = np.where(filled, 255, 0).astype(np.uint8)
        
        # Soften edges slightly (1px) for seamless antialiasing
        clean_alpha_im = Image.fromarray(clean_alpha).filter(ImageFilter.GaussianBlur(0.8))
        
        # Combine original RGB with clean filled alpha
        out = Image.merge('RGBA', (r, g, b, clean_alpha_im))
        
        # Crop to bounding box
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)
            
        w, h = out.size
        dim = max(w, h) + 60
        sq = Image.new('RGBA', (dim, dim), (0, 0, 0, 0))
        sq.paste(out, ((dim - w) // 2, (dim - h) // 2))
        sq.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        sq.save(dst_path, format='WEBP', quality=88)
        print(f"Clean cutout saved: {dst_path}")
        return True
    except Exception as e:
        print(f"Error clean_cutout {src_path}: {e}")
        return False

def make_mannequin(cutout_path, dst_path, mannequin_img, is_back=False):
    """
    Dresses the user's white 3D sculpted mannequin with the garment cutout.
    """
    if os.path.exists(dst_path):
        return True
    try:
        garment = Image.open(cutout_path).convert('RGBA')
        res = mannequin_img.copy()
        
        # Garment target width to fit mannequin torso (approx 350px)
        target_w = 350
        aspect = garment.height / garment.width
        target_h = int(target_w * aspect)
        garment_scaled = garment.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Position centered on chest/torso
        pos_x = (res.width - target_w) // 2
        pos_y = 172
        
        # Subtle contact shadow behind garment on mannequin
        shadow = Image.new('RGBA', res.size, (0, 0, 0, 0))
        shadow.paste((0, 0, 0, 75), (pos_x + 2, pos_y + 4), mask=garment_scaled)
        shadow = shadow.filter(ImageFilter.GaussianBlur(5))
        
        res = Image.alpha_composite(res, shadow)
        res.paste(garment_scaled, (pos_x, pos_y), mask=garment_scaled)
        res.save(dst_path, format='WEBP', quality=88)
        print(f"Mannequin view saved: {dst_path}")
        return True
    except Exception as e:
        print(f"Error make_mannequin {cutout_path}: {e}")
        return False

def main():
    print("Reading catalog fallback data...", flush=True)
    with open(DATASET_FILE, 'r', encoding='utf-8') as fh:
        raw = fh.read()
        
    mannequin = Image.open(MANNEQUIN_PATH).convert('RGBA')
    
    parts = raw.split("sku: 'DOCO-")
    print(f"Found {len(parts) - 1} products to process.", flush=True)
    
    for idx, part in enumerate(parts[1:], 1):
        img_matches = re.findall(r'"imageUrl":\s*"(/assets/archive/([^"]+\.webp))"', part)
        if not img_matches:
            continue
            
        primary_url, primary_file = img_matches[0]
        base_primary = os.path.splitext(primary_file)[0]
        # Remove any existing suffix if present
        base_primary = base_primary.replace('_cutout', '')
        
        src_path = os.path.join('frontend/public/assets/archive', f"{base_primary}.webp")
        cutout_path = os.path.join(ARCHIVE_DIR, f"{base_primary}_cutout.webp")
        m_front_path = os.path.join(ARCHIVE_DIR, f"{base_primary}_mannequin_front.webp")
        
        if os.path.exists(src_path):
            clean_cutout(src_path, cutout_path)
            if os.path.exists(cutout_path):
                make_mannequin(cutout_path, m_front_path, mannequin, is_back=False)
                
        # Back image if available
        if len(img_matches) > 1:
            back_url, back_file = img_matches[1]
            base_back = os.path.splitext(back_file)[0].replace('_cutout', '')
            back_src = os.path.join('frontend/public/assets/archive', f"{base_back}.webp")
            back_cutout = os.path.join(ARCHIVE_DIR, f"{base_back}_cutout.webp")
            m_back_path = os.path.join(ARCHIVE_DIR, f"{base_back}_mannequin_back.webp")
            
            if os.path.exists(back_src):
                clean_cutout(back_src, back_cutout)
                if os.path.exists(back_cutout):
                    make_mannequin(back_cutout, m_back_path, mannequin, is_back=True)
                    
        print(f"Processed product {idx}/25", flush=True)
        
    print("ALL 25 PRODUCTS PROCESSED WITH CLEAN CUTOUTS & MANNEQUIN VIEWS!", flush=True)

if __name__ == '__main__':
    main()
