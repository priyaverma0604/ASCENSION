import os
import json
import subprocess
from PIL import Image, ImageFilter

def get_clean_source(filename, temp_clean_dir):
    # Check if we have a direct clean mapping
    manual_sources = {
        'seven_chakra_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789195786734.jpg',
        'aries_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789195824369.png',
        'taurus_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789195838515.jpg',
        'gemini_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789195847191.png',
        'tiger_eye_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789124910627.png',
        'tiger_eye_single_bracelet.jpg': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789124910627.png',
        'pocha_salt.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789120249413.png',
        'sage_leaves_bundle.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789120295458.png',
        'cleansing_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789119151193.png',
        'abundance_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789119069392.png',
        'health_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789119003744.png',
        'love_peace_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789119113405.png',
        'protection_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789119130935.png',
        'manifestation_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789120180447.png',
        'pyrite_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789120195122.png',
    }

    if filename in manual_sources and os.path.exists(manual_sources[filename]):
        return manual_sources[filename]

    # Check git extracted clean file
    git_clean_file = os.path.join(temp_clean_dir, filename)
    if os.path.exists(git_clean_file):
        return git_clean_file

    # Fallback to backend/uploads
    backend_file = os.path.join('backend/uploads', filename)
    if os.path.exists(backend_file):
        return backend_file

    return None

def watermark_image_left(input_path, output_path, logo_img):
    try:
        base = Image.open(input_path).convert('RGBA')
        w, h = base.size

        # Adaptive sizing for maximum readability on all resolutions
        if w < 500:
            target_w = max(150, int(w * 0.44))
        elif w < 900:
            target_w = max(200, int(w * 0.36))
        else:
            target_w = max(280, min(int(w * 0.32), 480))

        aspect = logo_img.height / logo_img.width
        target_h = int(target_w * aspect)

        resized_logo = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        alpha = resized_logo.split()[3]

        # Dual-layer contrast: sharp dark outline + rich soft ambient shadow
        pad = 20
        shadow_canvas = Image.new('RGBA', (target_w + pad * 2, target_h + pad * 2), (0, 0, 0, 0))

        # 1. Sharp dark outline in 8 directions for crisp letter definition
        dark_solid = Image.new('RGBA', resized_logo.size, (0, 0, 0, 220))
        dark_solid.putalpha(alpha)
        for dx in [-2, -1, 0, 1, 2]:
            for dy in [-2, -1, 0, 1, 2]:
                if dx != 0 or dy != 0:
                    shadow_canvas.paste(dark_solid, (pad + dx, pad + dy), dark_solid)

        # 2. Soft Gaussian blur on shadow layer
        shadow_blurred = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=3.5))

        # Position: TOP-LEFT SIDE with clean margins
        padding_x = max(12, int(w * 0.035))
        padding_y = max(12, int(h * 0.035))
        pos_x = padding_x
        pos_y = padding_y

        overlay = Image.new('RGBA', base.size, (0, 0, 0, 0))
        # Paste ambient shadow
        overlay.paste(shadow_blurred, (pos_x - pad, pos_y - pad), shadow_blurred)
        # Paste crisp logo at full 100% brilliance
        overlay.paste(resized_logo, (pos_x, pos_y), resized_logo)

        watermarked = Image.alpha_composite(base, overlay)

        # Save with appropriate format
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        ext = os.path.splitext(output_path)[1].lower()
        if ext in ['.jpg', '.jpeg']:
            rgb_im = watermarked.convert('RGB')
            rgb_im.save(output_path, 'JPEG', quality=96, optimize=True)
        else:
            watermarked.save(output_path, 'PNG', optimize=True)

        return True
    except Exception as e:
        print(f"Error watermarking {input_path}: {e}")
        return False

def main():
    logo_path = 'frontend/src/assets/logo.png'
    if not os.path.exists(logo_path):
        print(f"Logo not found at {logo_path}")
        return

    logo_img = Image.open(logo_path).convert('RGBA')

    # Create temporary directory for clean images from git
    temp_clean_dir = 'backend/scripts/temp_clean_images'
    os.makedirs(temp_clean_dir, exist_ok=True)

    # 1. Load extracted_products.json to get all product image paths
    with open('backend/scripts/extracted_products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    img_set = set()
    for p in products:
        for img in p.get('images', []):
            filename = os.path.basename(img)
            img_set.add(filename)

    # Also add any candle images explicitly
    candle_images = [
        'health_candle_1.jpeg', 'cleansing_candle_1.jpeg', 'protection_candle_1.jpeg',
        'abundance_candle_1.jpeg', 'love_peace_candle_1.jpeg',
        'abundance_boat_candle_1.png', 'cleansing_boat_candle_1.png', 'protection_boat_candle_1.png',
        'love_peace_boat_candle.jpg', 'health_boat_candle.jpg',
        'crown_candle_1.jpeg', 'third_eye_candle_1.jpeg', 'throat_candle_1.jpeg',
        'heart_candle_1.jpeg', 'solar_plexus_candle_1.jpeg', 'sacral_candle_1.jpeg', 'grounding_candle_1.jpeg'
    ]
    for ci in candle_images:
        img_set.add(ci)

    print(f"Extracting clean base files from git commit 438ed8c for {len(img_set)} images...")

    for filename in img_set:
        clean_target = os.path.join(temp_clean_dir, filename)
        # Try to extract from git commit 438ed8c
        git_path = f"438ed8c:backend/uploads/{filename}"
        res = subprocess.run(['git', 'show', git_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode == 0 and len(res.stdout) > 0:
            with open(clean_target, 'wb') as out_f:
                out_f.write(res.stdout)

    print("Beginning left-side watermark placement...")
    success_count = 0
    for filename in sorted(img_set):
        src_path = get_clean_source(filename, temp_clean_dir)
        if not src_path or not os.path.exists(src_path):
            print(f"Skipping {filename} (source not found)")
            continue

        b_dest = os.path.join('backend/uploads', filename)
        f_dest = os.path.join('frontend/public/uploads', filename)

        res1 = watermark_image_left(src_path, b_dest, logo_img)
        res2 = watermark_image_left(src_path, f_dest, logo_img)

        if res1 or res2:
            success_count += 1
            print(f"[OK] Left-side watermarked: {filename}")

    print(f"\nDone! Successfully applied visible left-side logo watermark to {success_count} product images.")

    # Clean up temp directory
    try:
        for f in os.listdir(temp_clean_dir):
            os.remove(os.path.join(temp_clean_dir, f))
        os.rmdir(temp_clean_dir)
    except Exception as e:
        print(f"Note on temp cleanup: {e}")

if __name__ == '__main__':
    main()
