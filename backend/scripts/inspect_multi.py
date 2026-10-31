import fitz

doc = fitz.open(r'D:\photos of ascension\Catalogue Ascension Seva 2026.pdf')

for p in [14, 16, 19, 21, 23]:
    page = doc[p - 1]
    print(f'=== Page {p} ===')
    # get text blocks
    for b in page.get_text('blocks'):
        txt = b[4].strip().replace('\n', ' ')
        if any(c.isalnum() for c in txt) and 'women' not in txt.lower():
            print(f'  Text at y={b[1]:.1f}-{b[3]:.1f}: {txt}')
    # get image rects
    for img in page.get_images():
        xref = img[0]
        meta = doc.extract_image(xref)
        w, h = meta['width'], meta['height']
        if w > 400 and w != 941 and w != 730 and w != 687:
            rects = page.get_image_rects(xref)
            for r in rects:
                print(f'  Img {xref} ({w}x{h}) at y={r.y0:.1f}-{r.y1:.1f}')
