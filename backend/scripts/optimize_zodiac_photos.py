import os
from PIL import Image, ImageOps

USER_UPLOADED_DIR = r"C:\Users\Dell\.gemini\antigravity\brain\6522ba4a-1026-423b-a7ff-ffb887706b99\.user_uploaded"

ZODIAC_IMAGES = [
    ("aries", "media_1795119471949_c8a52c4c.jpg"),
    ("taurus", "media_1795119510711_21e7c262.jpg"),
    ("gemini", "media_1795119526557_6147439e.jpg"),
    ("cancer", "media_1795119538388_e1351595.jpg"),
    ("leo", "media_1795120598379_b19b5ad3.jpg"),
    ("virgo", "media_1795120610603_2993921a.jpg"),
    ("libra", "media_1795120638736_b2a94185.jpg"),
    ("scorpio", "media_1795120659297_d16502da.jpg"),
    ("sagittarius", "media_1795120672698_25e93390.jpg"),
    ("capricorn", "media_1795120699105_3464efad.jpg"),
    ("aquarius", "media_1795120715967_947fb027.jpg"),
    ("pisces", "media_1795120728624_a1c36673.jpg"),
]

TARGET_DIRS = [
    r"backend\uploads",
    r"frontend\public\uploads"
]

def main():
    print("=== Optimizing Zodiac Photos ===")
    for sign, fname in ZODIAC_IMAGES:
        src_path = os.path.join(USER_UPLOADED_DIR, fname)
        if not os.path.exists(src_path):
            raise FileNotFoundError(f"Missing source file: {src_path}")
        
        with Image.open(src_path) as raw_img:
            # 1. Normalize orientation from EXIF
            img = ImageOps.exif_transpose(raw_img)
            
            # 2. Convert to RGB
            if img.mode != "RGB":
                img = img.convert("RGB")
            
            # 3. Resize if max dimension > 1200
            max_dim = 1200
            if max(img.size) > max_dim:
                img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            
            # 4. Save to target dirs
            target_filename = f"{sign}_zodiac_crystal_bracelet.png"
            for target_dir in TARGET_DIRS:
                os.makedirs(target_dir, exist_ok=True)
                dest_path = os.path.join(target_dir, target_filename)
                
                # Save optimized PNG
                # Using 256 color adaptive palette for high visual quality + low file footprint
                q = img.convert('P', palette=Image.Palette.ADAPTIVE, colors=256)
                q.save(dest_path, "PNG", optimize=True)
                
                # Also save JPEG equivalent if needed
                jpg_dest_path = os.path.join(target_dir, f"{sign}_zodiac_crystal_bracelet.jpg")
                img.save(jpg_dest_path, "JPEG", quality=85, optimize=True)
                
                size_kb = os.path.getsize(dest_path) / 1024
                print(f"[{sign.upper()}] Saved {dest_path} ({img.size[0]}x{img.size[1]}, {size_kb:.1f} KB)")

    print("\nAll 12 Zodiac images optimized successfully!")

if __name__ == "__main__":
    main()
