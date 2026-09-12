import os
import json
from PIL import Image, ImageFilter, ImageEnhance

def watermark_image(input_path, output_path, logo_img):
    try:
        base = Image.open(input_path).convert('RGBA')
        w, h = base.size

        # Logo size ~ 28% of width, minimum 120px, maximum 380px
        target_w = max(110, min(int(w * 0.28), 400))
        aspect = logo_img.height / logo_img.width
        target_h = int(target_w * aspect)

        resized_logo = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # Create soft shadow for contrast on light/dark backgrounds
        alpha = resized_logo.split()[3]
        
        # Dark subtle drop shadow
        shadow = Image.new('RGBA', resized_logo.size, (0, 0, 0, 160))
        shadow.putalpha(alpha)
        
        pad = 12
        shadow_padded = Image.new('RGBA', (target_w + pad * 2, target_h + pad * 2), (0, 0, 0, 0))
        shadow_padded.paste(shadow, (pad, pad))
        shadow_blurred = shadow_padded.filter(ImageFilter.GaussianBlur(radius=3))

        # Position: Top-Right
        padding_x = max(10, int(w * 0.035))
        padding_y = max(10, int(h * 0.035))
        pos_x = w - target_w - padding_x
        pos_y = padding_y

        overlay = Image.new('RGBA', base.size, (0, 0, 0, 0))
        # Paste shadow
        overlay.paste(shadow_blurred, (pos_x - pad + 2, pos_y - pad + 2), shadow_blurred)
        # Paste logo
        overlay.paste(resized_logo, (pos_x, pos_y), resized_logo)

        watermarked = Image.alpha_composite(base, overlay)

        # Save with appropriate format
        ext = os.path.splitext(output_path)[1].lower()
        if ext in ['.jpg', '.jpeg']:
            rgb_im = watermarked.convert('RGB')
            rgb_im.save(output_path, 'JPEG', quality=95, optimize=True)
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

    with open('backend/scripts/extracted_products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    img_set = set()
    for p in products:
        for img in p.get('images', []):
            filename = os.path.basename(img)
            img_set.add(filename)

    print(f"Starting watermarking for {len(img_set)} unique product images...")

    success_count = 0
    for filename in sorted(img_set):
        b_path = os.path.join('backend/uploads', filename)
        f_path = os.path.join('frontend/public/uploads', filename)

        # Determine source path
        src_path = b_path if os.path.exists(b_path) else f_path
        if not os.path.exists(src_path):
            print(f"Source not found: {filename}")
            continue

        # Watermark backend image
        res1 = watermark_image(src_path, b_path, logo_img)
        # Watermark frontend image
        res2 = watermark_image(src_path, f_path, logo_img)

        if res1 or res2:
            success_count += 1
            print(f"Watermarked: {filename}")

    print(f"Successfully watermarked {success_count}/{len(img_set)} product images!")

if __name__ == '__main__':
    main()
