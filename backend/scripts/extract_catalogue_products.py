import fitz
import os
import json
import shutil

PDF_PATH = r"D:\photos of ascension\Catalogue Ascension Seva 2026.pdf"
FRONTEND_UPLOADS = r"d:\ASCENSION\frontend\public\uploads\catalogue_2026"
BACKEND_UPLOADS = r"d:\ASCENSION\backend\uploads\catalogue_2026"

os.makedirs(FRONTEND_UPLOADS, exist_ok=True)
os.makedirs(BACKEND_UPLOADS, exist_ok=True)

# Also copy PDF to public for download
frontend_pdf = r"d:\ASCENSION\frontend\public\Catalogue_Ascension_Seva_2026.pdf"
backend_pdf = r"d:\ASCENSION\backend\uploads\Catalogue_Ascension_Seva_2026.pdf"
shutil.copy2(PDF_PATH, frontend_pdf)
shutil.copy2(PDF_PATH, backend_pdf)
print("Copied catalogue PDF to public and uploads folders.")

doc = fitz.open(PDF_PATH)

# Helper to save extracted image to both locations
def save_image_bytes(img_bytes, filename):
    f_path = os.path.join(FRONTEND_UPLOADS, filename)
    b_path = os.path.join(BACKEND_UPLOADS, filename)
    with open(f_path, 'wb') as f:
        f.write(img_bytes)
    with open(b_path, 'wb') as f:
        f.write(img_bytes)
    return f"/uploads/catalogue_2026/{filename}"

# Helper to render page as JPG card
def render_page_card(page_num, filename):
    page = doc[page_num - 1]
    pix = page.get_pixmap(dpi=150)
    f_path = os.path.join(FRONTEND_UPLOADS, filename)
    b_path = os.path.join(BACKEND_UPLOADS, filename)
    pix.save(f_path)
    pix.save(b_path)
    return f"/uploads/catalogue_2026/{filename}"

# Helper to extract xref
def extract_and_save(xref, filename):
    meta = doc.extract_image(xref)
    ext = meta['ext']
    full_name = f"{filename}.{ext}"
    return save_image_bytes(meta['image'], full_name)

# Story text from Page 2
WOMEN_EMPOWERMENT_NOTE = (
    "Behind every candle is a woman's dream of a brighter tomorrow. "
    "At Ascension Seva, our handcrafted candles, diyas, and festive hampers celebrate creativity, courage, "
    "and women empowerment. Each creation carries a story of hope, dignity, and independence. "
    "When you purchase from us, you support a woman's journey towards a brighter future. "
    "Buy with love. Gift with purpose. Empower a woman. — Team Ascension Seva"
)

# Product definitions mapping xref and page
products_config = [
    # 1. Golden Ember Diya
    {
        "name": "Ascension Golden Ember Diya (Per Dozen)",
        "slug": "golden_ember_diya",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 699,
        "originalPrice": 850,
        "stock": 50,
        "page": 3,
        "xref": 826,
        "tagline": "Handcrafted Elegance | Festive Glow",
        "description": f"Tagline: Handcrafted Elegance | Festive Glow\n\nSpecifications:\n- Set: 12 Handcrafted Clay Diyas (1 Dozen)\n- Burning Hours: 5–6 Hours\n- Wax: Natural Soy & Golden Shimmer Wax\n- Wicks: Dual high-grade cotton wicks for an opulent, steady golden illumination\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 2. Traditional Diya
    {
        "name": "Ascension Traditional Festive Diya (Per Dozen)",
        "slug": "traditional_festive_diya",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 599,
        "originalPrice": 750,
        "stock": 50,
        "page": 4,
        "xref": 845,
        "tagline": "Handcrafted Festive Candle",
        "description": f"Tagline: Handcrafted Festive Candle\n\nSpecifications:\n- Set: 12 Handcrafted Festive Diyas (1 Dozen)\n- Burning Hours: 2–4 Hours\n- Finish: Traditional Terracotta with Golden Embellished Rim\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 3. Rosewater Charm
    {
        "name": "Ascension Rosewater Charm Candle",
        "slug": "rosewater_charm",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 555,
        "originalPrice": 650,
        "stock": 40,
        "page": 5,
        "xref": 864,
        "tagline": "Handcrafted Floral Elegance | Mix & Match Duo Eligible",
        "description": f"Tagline: Handcrafted Floral Elegance\n\nSpecial Offer: Choose any 2 small candles from our collection for ₹999!\n\nFragrance & Theme:\nDelicate, soothing rosewater aroma infused in artisanal botanical wax with golden petals. Ideal for meditation, self-care, and festive decor.\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 4. Sapphire Serenity
    {
        "name": "Ascension Sapphire Serenity Candle",
        "slug": "sapphire_serenity",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 555,
        "originalPrice": 650,
        "stock": 40,
        "page": 6,
        "xref": 883,
        "tagline": "Tranquil Blue Harmony | Mix & Match Duo Eligible",
        "description": f"Tagline: Tranquil Blue Harmony\n\nSpecial Offer: Choose any 2 small candles from our collection for ₹999!\n\nTheme:\nDeep sapphire hues radiating serene, calming vibrations into your sacred space.\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 5. Ruby Elegance
    {
        "name": "Ascension Ruby Elegance Candle",
        "slug": "ruby_elegance",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 555,
        "originalPrice": 650,
        "stock": 40,
        "page": 7,
        "xref": 902,
        "tagline": "Radiant Crimson Passion | Mix & Match Duo Eligible",
        "description": f"Tagline: Radiant Crimson Passion\n\nSpecial Offer: Choose any 2 small candles from our collection for ₹999!\n\nTheme:\nOpulent ruby-toned candle poured into a luxurious ornate setting, exuding warmth, vitality, and devotion.\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 6. Lavender Peacock Elegance
    {
        "name": "Ascension Lavender Peacock Elegance Candle",
        "slug": "lavender_peacock_elegance",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 555,
        "originalPrice": 650,
        "stock": 40,
        "page": 8,
        "xref": 921,
        "tagline": "Royal Calming Grace | Mix & Match Duo Eligible",
        "description": f"Tagline: Royal Calming Grace\n\nSpecial Offer: Choose any 2 small candles from our collection for ₹999!\n\nTheme:\nA timeless blend of serene lavender soothing notes and ornate royal peacock motifs.\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 7. Amber Grace
    {
        "name": "Ascension Amber Grace Candle",
        "slug": "amber_grace",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 555,
        "originalPrice": 650,
        "stock": 40,
        "page": 9,
        "xref": 940,
        "tagline": "Warm Golden Serenity | Mix & Match Duo Eligible",
        "description": f"Tagline: Warm Golden Serenity\n\nSpecial Offer: Choose any 2 small candles from our collection for ₹999!\n\nTheme:\nDeep amber resin tones with warm earthy undertones for inner grounding and comforting sanctuary ambiance.\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 8. Golden Grace
    {
        "name": "Ascension Golden Grace Candle",
        "slug": "golden_grace",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 555,
        "originalPrice": 650,
        "stock": 40,
        "page": 10,
        "xref": 959,
        "tagline": "Divine Festive Radiance | Mix & Match Duo Eligible",
        "description": f"Tagline: Divine Festive Radiance\n\nSpecial Offer: Choose any 2 small candles from our collection for ₹999!\n\nTheme:\nGleaming gold artisan finish bringing prosperity and elevated festive frequency to your home altars.\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 9. Special Offer Duo
    {
        "name": "Ascension Mix & Match Candle Duo (Set of 2)",
        "slug": "mix_match_candle_duo",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 999,
        "originalPrice": 1110,
        "stock": 30,
        "page": 11,
        "xref": None, # Will use page 11 card
        "tagline": "Choose Any 2 Small Candles for ₹999",
        "description": f"Special Offer:\nChoose any 2 small candles from our collection for ₹999 (Regular ₹1,110). Mix and match your favourite colours and designs (Rosewater Charm, Sapphire Serenity, Ruby Elegance, Lavender Peacock, Amber Grace, Golden Grace) to create a beautiful, meaningful gift.\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 10. Golden Marigold Elegance
    {
        "name": "Ascension Golden Marigold Elegance Candle",
        "slug": "golden_marigold_elegance",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1450,
        "originalPrice": 1750,
        "stock": 25,
        "page": 12,
        "xref": 992,
        "tagline": "Auspicious Marigold Statement Candle",
        "description": f"Tagline: Auspicious Marigold Statement Candle\n\nSpecifications:\n- Design: Handcrafted sculpted marigold blossom centerpiece\n- Symbolism: Marigolds represent purity, sacred auspiciousness, and divine surrender\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 11. The Royal Bloom Treasure
    {
        "name": "Ascension The Royal Bloom Treasure Hamper",
        "slug": "the_royal_bloom_treasure",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1250,
        "originalPrice": 1500,
        "stock": 25,
        "page": 13,
        "xref": 1011,
        "tagline": "Festive Floral Gift Hamper",
        "description": f"Tagline: Festive Floral Gift Hamper\n\nSpecifications:\n- Inclusions: Handcrafted floral statement candles, sacred diyas, and festive presentation packaging\n- Perfect for gifting during Diwali, Navratri, weddings, and sacred pujas\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 12. Golden Hour Floaters (Page 14, Top)
    {
        "name": "Ascension Golden Hour Floaters",
        "slug": "golden_hour_floaters",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1450,
        "originalPrice": 1700,
        "stock": 30,
        "page": 14,
        "xref": 1028,
        "tagline": "Artisanal Water Floater Candles",
        "description": f"Tagline: Artisanal Water Floater Candles\n\nSpecifications:\n- Type: High-buoyancy floating candles for urli bowls, pools, and festive centerpieces\n- Glow: Warm shimmering reflection across tranquil water\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 13. Honeyed Petals (Page 14, Middle)
    {
        "name": "Ascension Honeyed Petals Candle",
        "slug": "honeyed_petals",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1333,
        "originalPrice": 1550,
        "stock": 30,
        "page": 14,
        "xref": 1034,
        "tagline": "Delicate Botanical Floral Candle",
        "description": f"Tagline: Delicate Botanical Floral Candle\n\nSpecifications:\n- Hand-poured wax with sweet botanical floral essence and golden petal accents\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 14. Brass & Bloom (Page 14, Bottom)
    {
        "name": "Ascension Brass & Bloom Candle",
        "slug": "brass_and_bloom",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1111,
        "originalPrice": 1350,
        "stock": 30,
        "page": 14,
        "xref": 1031,
        "tagline": "Artisan Brass & Botanical Flower Diya",
        "description": f"Tagline: Artisan Brass & Botanical Flower Diya\n\nSpecifications:\n- Sacred brass metallic setting with intricately handcrafted floral wax petals\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 15. Emerald & Gold Radiance
    {
        "name": "Ascension Emerald & Gold Radiance Hamper",
        "slug": "emerald_gold_radiance",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 2222,
        "originalPrice": 2600,
        "stock": 20,
        "page": 15,
        "xref": 1050,
        "tagline": "Regal Emerald & Gold Festive Hamper",
        "description": f"Tagline: Regal Emerald & Gold Festive Hamper\n\nSpecifications:\n- Opulent emerald green velvet theme with handcrafted golden dipped candles and festive accents\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 16. Rosette Reverie (Page 16, Top)
    {
        "name": "Ascension Rosette Reverie Candle",
        "slug": "rosette_reverie",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1444,
        "originalPrice": 1700,
        "stock": 25,
        "page": 16,
        "xref": 1067,
        "tagline": "Sculpted Rose Garden Candle",
        "description": f"Tagline: Sculpted Rose Garden Candle\n\nSpecifications:\n- Realistic multi-layered rose petals hand-sculpted in slow-burning natural wax\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 17. Ruby Petal (Page 16, Middle)
    {
        "name": "Ascension Ruby Petal Candle",
        "slug": "ruby_petal",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1675,
        "originalPrice": 1950,
        "stock": 25,
        "page": 16,
        "xref": 1070,
        "tagline": "Lush Ruby Blossom Statement Candle",
        "description": f"Tagline: Lush Ruby Blossom Statement Candle\n\nSpecifications:\n- Deep crimson petals capturing the vibrant essence of sacred shakti and celebration\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 18. Pearl & Petal (Page 16, Bottom)
    {
        "name": "Ascension Pearl & Petal Candle",
        "slug": "pearl_and_petal",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 525,
        "originalPrice": 650,
        "stock": 35,
        "page": 16,
        "xref": 1073,
        "tagline": "Subtle Pearl Shimmer Mini Candle",
        "description": f"Tagline: Subtle Pearl Shimmer Mini Candle\n\nSpecifications:\n- Elegant pearlescent sheen infused with delicate floral undertones\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 19. Gilded Radiance
    {
        "name": "Ascension Gilded Radiance Festive Hamper",
        "slug": "gilded_radiance",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 2999,
        "originalPrice": 3500,
        "stock": 15,
        "page": 17,
        "xref": 1090,
        "tagline": "Grand Festive Luxury Celebration Hamper",
        "description": f"Tagline: Grand Festive Luxury Celebration Hamper\n\nSpecifications:\n- Ascension's flagship luxury gifting set featuring premium handcrafted candles, ornate brass diyas, and festive keepsakes\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 20. Crimson Royale
    {
        "name": "Ascension Crimson Royale Festive Hamper",
        "slug": "crimson_royale",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 2299,
        "originalPrice": 2700,
        "stock": 20,
        "page": 18,
        "xref": 1110,
        "tagline": "Majestic Crimson Velvet Hamper",
        "description": f"Tagline: Majestic Crimson Velvet Hamper\n\nSpecifications:\n- Curated red and gold artisan candles, sacred festive embellishments, and blessings\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 21. Kamal Glow (Page 19, Top)
    {
        "name": "Ascension Kamal Glow Lotus Diya",
        "slug": "kamal_glow",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 525,
        "originalPrice": 650,
        "stock": 35,
        "page": 19,
        "xref": 1127,
        "tagline": "Sacred Kamal Diya Candle",
        "description": f"Tagline: Sacred Kamal Diya Candle\n\nSpecifications:\n- Lotus-inspired traditional diya candle bringing spiritual purity and Lakshmi blessings\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 22. Pink Lotus Reverie (Page 19, Middle)
    {
        "name": "Ascension Pink Lotus Reverie Candle",
        "slug": "pink_lotus_reverie",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1111,
        "originalPrice": 1350,
        "stock": 30,
        "page": 19,
        "xref": 1133,
        "tagline": "Blossoming Pink Lotus Candle",
        "description": f"Tagline: Blossoming Pink Lotus Candle\n\nSpecifications:\n- Intricately folded pink lotus petals designed to burn smoothly and serenely\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 23. Rani Pink Garden (Page 19, Bottom)
    {
        "name": "Ascension Rani Pink Garden Hamper",
        "slug": "rani_pink_garden",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1850,
        "originalPrice": 2200,
        "stock": 25,
        "page": 19,
        "xref": 1130,
        "tagline": "Traditional Rani Pink Festive Gift Set",
        "description": f"Tagline: Traditional Rani Pink Festive Gift Set\n\nSpecifications:\n- Vibrant Indian festive palette featuring pink and gold artisanal candles and festive accessories\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 24. The Emerald Blossom Royale
    {
        "name": "Ascension The Emerald Blossom Royale Hamper",
        "slug": "emerald_blossom_royale",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 2777,
        "originalPrice": 3200,
        "stock": 15,
        "page": 20,
        "xref": 1149,
        "tagline": "Regal Emerald Blossom Luxury Hamper",
        "description": f"Tagline: Regal Emerald Blossom Luxury Hamper\n\nSpecifications:\n- Premium botanical wax creations paired with emerald stone-inspired containers\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 25. Jade Lotus (Page 21, Top)
    {
        "name": "Ascension Jade Lotus Candle",
        "slug": "jade_lotus",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1111,
        "originalPrice": 1350,
        "stock": 30,
        "page": 21,
        "xref": 1166,
        "tagline": "Serene Jade Green Lotus Candle",
        "description": f"Tagline: Serene Jade Green Lotus Candle\n\nSpecifications:\n- Soothing pale jade green tones evoking calm rivers and flourishing abundance\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 26. Peacock Pond (Page 21, Middle)
    {
        "name": "Ascension Peacock Pond Candle",
        "slug": "peacock_pond",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 999,
        "originalPrice": 1200,
        "stock": 30,
        "page": 21,
        "xref": 1172,
        "tagline": "Turquoise & Blue Artisan Water Candle",
        "description": f"Tagline: Turquoise & Blue Artisan Water Candle\n\nSpecifications:\n- Mesmerizing peacock blue shades reflecting serenity and divine joy\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 27. Sea Glass Lotus (Page 21, Bottom)
    {
        "name": "Ascension Sea Glass Lotus Candle",
        "slug": "sea_glass_lotus",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1555,
        "originalPrice": 1850,
        "stock": 25,
        "page": 21,
        "xref": 1169,
        "tagline": "Translucent Aqua Sea Glass Candle",
        "description": f"Tagline: Translucent Aqua Sea Glass Candle\n\nSpecifications:\n- Unique frosted glass aesthetic poured with premium clean-burning wax\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 28. Blush & Jade Royale
    {
        "name": "Ascension Blush & Jade Royale Hamper",
        "slug": "blush_jade_royale",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 2444,
        "originalPrice": 2850,
        "stock": 20,
        "page": 22,
        "xref": 1189,
        "tagline": "Pastel Luxury Celebration Hamper",
        "description": f"Tagline: Pastel Luxury Celebration Hamper\n\nSpecifications:\n- Harmonious pairing of soft blush rose and restorative jade green elements\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 29. Lavender Reverie (Page 23, Top)
    {
        "name": "Ascension Lavender Reverie Candle",
        "slug": "lavender_reverie",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1111,
        "originalPrice": 1350,
        "stock": 30,
        "page": 23,
        "xref": 1206,
        "tagline": "French Lavender Botanical Candle",
        "description": f"Tagline: French Lavender Botanical Candle\n\nSpecifications:\n- Infused with pure calming lavender oil and dried lavender sprigs\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 30. Twilight Bloom (Page 23, Bottom)
    {
        "name": "Ascension Twilight Bloom Festive Hamper",
        "slug": "twilight_bloom",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1875,
        "originalPrice": 2200,
        "stock": 20,
        "page": 23,
        "xref": 1209,
        "tagline": "Deep Twilight Floral Gift Set",
        "description": f"Tagline: Deep Twilight Floral Gift Set\n\nSpecifications:\n- Atmospheric evening ambiance set with soothing aromas and glowing accents\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 31. Lavender Royale
    {
        "name": "Ascension Lavender Royale Hamper",
        "slug": "lavender_royale",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 1999,
        "originalPrice": 2400,
        "stock": 20,
        "page": 24,
        "xref": 1226,
        "tagline": "Grand Lavender Wellness Gift Set",
        "description": f"Tagline: Grand Lavender Wellness Gift Set\n\nSpecifications:\n- Complete relaxation ritual set featuring handcrafted lavender candles, calming scents, and wellness keepsakes\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 32. Marigold Majesty
    {
        "name": "Ascension Marigold Majesty Multi-Tier Candle",
        "slug": "marigold_majesty_multi_tier",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 2399,
        "originalPrice": 2800,
        "stock": 15,
        "page": 25,
        "xref": 1246,
        "tagline": "Sculpted Multi-Tier Tower Candle",
        "description": f"Tagline: Sculpted Multi-Tier Tower Candle\n\nSpecifications:\n- Majestic multi-tiered candle tower sculpted with cascading marigold blossoms\n- Long burning time for festival centerpieces and temple rooms\n\n{WOMEN_EMPOWERMENT_NOTE}"
    },
    # 33. Petals of Elegance
    {
        "name": "Ascension Petals of Elegance Hamper",
        "slug": "petals_of_elegance",
        "category": "Candles & Hampers (Women Empowerment)",
        "pricing": 2399,
        "originalPrice": 2800,
        "stock": 15,
        "page": 26,
        "xref": 1266,
        "tagline": "Signature Artisan Blossom Hamper",
        "description": f"Tagline: Signature Artisan Blossom Hamper\n\nSpecifications:\n- Premium curation of floral artisanal candles handcrafted with dedication by Ascension Seva women artisans\n\n{WOMEN_EMPOWERMENT_NOTE}"
    }
]

# Process and extract all
final_products = []

for idx, p in enumerate(products_config):
    images = []
    
    # 1. Extract raw photo if xref exists
    if p["xref"]:
        raw_url = extract_and_save(p["xref"], f"{p['slug']}_photo")
        images.append(raw_url)
    
    # 2. Render catalogue card
    card_url = render_page_card(p["page"], f"page_{p['page']}_{p['slug']}_card.jpg")
    images.append(card_url)
    
    # If no raw photo (like page 11 offer), use card as primary
    if not p["xref"]:
        images = [card_url]
    
    prod_data = {
        "name": p["name"],
        "category": p["category"],
        "pricing": p["pricing"],
        "originalPrice": p.get("originalPrice", p["pricing"]),
        "stock": p.get("stock", 30),
        "images": images,
        "description": p["description"]
    }
    final_products.append(prod_data)
    print(f"[{idx+1}/33] Extracted: {p['name']} -> {images}")

# Save JSON
json_out = r"d:\ASCENSION\backend\scripts\catalogue_products_2026.json"
with open(json_out, "w", encoding="utf-8") as f:
    json.dump(final_products, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully extracted all {len(final_products)} products to {json_out}!")
