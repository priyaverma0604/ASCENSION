import os
import json
import subprocess
from PIL import Image, ImageFilter

def get_clean_source(filename, temp_clean_dir):
    manual_sources = {
        # Pyramids
        'seven_chakra_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789637836392.jpg',
        'black_tourmaline_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789637836470.jpg',
        'amethyst_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789637836761.jpg',
        'lapis_lazuli_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789637836927.jpg',
        'moonstone_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789637836971.jpg',
        'clear_quartz_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789639385799.jpg',
        'rudraksha_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789639385943.jpg',
        'rose_quartz_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789639386000.jpg',
        'citrine_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789639386260.jpg',
        'tiger_eye_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789639386300.jpg',
        'carnelian_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789640164859.jpg',
        'labradorite_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789640164898.jpg',
        'green_aventurine_orgone_pyramid.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789640165031.jpg',

        # Zodiac Bracelets
        'aries_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789633707940.png',
        'taurus_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789633718649.png',
        'gemini_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789633741573.png',
        'cancer_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789633752193.png',
        'leo_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789633764698.png',
        'virgo_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789634550942.png',
        'libra_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789634674714.png',
        'scorpio_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789634692569.png',
        'sagittarius_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789634703766.png',
        'capricorn_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789634769726.png',
        'aquarius_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789635371188.png',
        'pisces_zodiac_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789635382504.png',

        # Chakra & Healing Crystal Bracelets
        'seven_chakra_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\c3216775-704f-4973-b965-354b312bc950\.user_uploaded\media_1789195786734.jpg',
        'tiger_eye_crystal_bracelet.png': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789580482695.jpg',
        'tiger_eye_single_bracelet.jpg': r'C:\Users\Dell\.gemini\antigravity-ide\brain\3585e767-d13f-4772-abd3-451e8f2fac44\.user_uploaded\media_1789580482695.jpg',
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

    git_clean_file = os.path.join(temp_clean_dir, filename)
    if os.path.exists(git_clean_file):
        return git_clean_file

    backend_file = os.path.join('backend/uploads', filename)
    if os.path.exists(backend_file):
        return backend_file

    return None

def watermark_image_center(input_path, output_path, logo_img):
    try:
        base = Image.open(input_path).convert('RGBA')
        w, h = base.size

        # Adaptive sizing for rich centered placement
        if w < 500:
            target_w = max(150, int(w * 0.44))
        elif w < 900:
            target_w = max(200, int(w * 0.38))
        else:
            target_w = max(280, min(int(w * 0.35), 480))

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

        # Position: EXACT CENTER
        pos_x = (w - target_w) // 2
        pos_y = (h - target_h) // 2

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
    temp_clean_dir = 'backend/scripts/temp_clean_images'
    os.makedirs(temp_clean_dir, exist_ok=True)

    # All pyramid and crystal targets
    targets = [
        # 13 Orgone Pyramids
        'seven_chakra_orgone_pyramid.png',
        'black_tourmaline_orgone_pyramid.png',
        'amethyst_orgone_pyramid.png',
        'lapis_lazuli_orgone_pyramid.png',
        'moonstone_orgone_pyramid.png',
        'clear_quartz_orgone_pyramid.png',
        'rudraksha_orgone_pyramid.png',
        'rose_quartz_orgone_pyramid.png',
        'citrine_orgone_pyramid.png',
        'tiger_eye_orgone_pyramid.png',
        'carnelian_orgone_pyramid.png',
        'labradorite_orgone_pyramid.png',
        'green_aventurine_orgone_pyramid.png',

        # 12 Zodiac Crystal Bracelets
        'aries_zodiac_crystal_bracelet.png',
        'taurus_zodiac_crystal_bracelet.png',
        'gemini_zodiac_crystal_bracelet.png',
        'cancer_zodiac_crystal_bracelet.png',
        'leo_zodiac_crystal_bracelet.png',
        'virgo_zodiac_crystal_bracelet.png',
        'libra_zodiac_crystal_bracelet.png',
        'scorpio_zodiac_crystal_bracelet.png',
        'sagittarius_zodiac_crystal_bracelet.png',
        'capricorn_zodiac_crystal_bracelet.png',
        'aquarius_zodiac_crystal_bracelet.png',
        'pisces_zodiac_crystal_bracelet.png',

        # Chakra & Healing Crystal Bracelets
        'seven_chakra_crystal_bracelet.png',
        'tiger_eye_crystal_bracelet.png',
        'tiger_eye_single_bracelet.jpg',
        'cleansing_crystal_bracelet.png',
        'abundance_crystal_bracelet.png',
        'health_crystal_bracelet.png',
        'love_peace_crystal_bracelet.png',
        'protection_crystal_bracelet.png',
        'manifestation_crystal_bracelet.png',
        'pyrite_crystal_bracelet.png',
    ]

    print(f"Centering logo for {len(targets)} pyramid and crystal images...", flush=True)
    success_count = 0

    for filename in targets:
        src_path = get_clean_source(filename, temp_clean_dir)
        if not src_path or not os.path.exists(src_path):
            print(f"[MISSING] Clean source for {filename}", flush=True)
            continue

        b_dest = os.path.join('backend/uploads', filename)
        f_dest = os.path.join('frontend/public/uploads', filename)

        res1 = watermark_image_center(src_path, b_dest, logo_img)
        res2 = watermark_image_center(src_path, f_dest, logo_img)

        if res1 and res2:
            success_count += 1
            print(f"[OK] Centered logo: {filename}", flush=True)
        else:
            print(f"[FAIL] {filename}", flush=True)

    print(f"\nDone! Successfully placed centered logo on {success_count}/{len(targets)} pyramids and crystals.", flush=True)

if __name__ == '__main__':
    main()
