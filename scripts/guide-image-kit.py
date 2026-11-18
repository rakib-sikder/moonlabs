"""Guide images, done by hand in the Gemini app.
  python scripts/guide-image-kit.py page     -> writes D:\\Downloads\\Moonlab_guide_image_prompts.html (copy buttons, in order)
  python scripts/guide-image-kit.py import   -> takes images from D:\\Downloads, saves public/images/guide-<slug>.webp,
                                                registers them in components/ui/Diorama.tsx, writes a contact sheet
Import matching, in this order: a file named like the slug or the prompt number ("07.png", "guide-07.jpg"),
otherwise Gemini_Generated_Image_* files newer than the page, oldest first, mapped to the guides still missing (in prompt order).
"""
import html, json, re, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DL = Path(r"D:\Downloads")
PAGE = DL / "Moonlab_guide_image_prompts.html"
scenes = json.loads((ROOT / "design/guide-scenes.json").read_text(encoding="utf-8"))
gen = (ROOT / "scripts/gen-guide-images.py").read_text(encoding="utf-8")
STYLE = eval(re.search(r"STYLE = (\(.*?\))\nscenes", gen, re.S).group(1))
order = list(scenes)


def prompt(slug):
    return ("Create a brand-new image. Aspect ratio: 16:9 landscape. High resolution.\n\nTHE SCENE (this is the subject, and it is "
            f"the most important part): {scenes[slug]['scene']} Main subject centred, calm empty space around it.\n\n{STYLE}")


def page():
    cards = []
    for i, s in enumerate(order, 1):
        done = (ROOT / f"public/images/guide-{s}.webp").exists()
        cards.append(f"""<section class="{'done' if done else ''}"><header><b>{i:02d}</b><span>{html.escape(s)}</span>
<button onclick="cp(this)">Copy prompt</button></header><p>{html.escape(scenes[s]['alt'])}</p>
<textarea readonly>{html.escape(prompt(s))}</textarea></section>""")
    PAGE.write_text(f"""<!doctype html><html><head><meta charset="utf-8"><title>Moonlab guide images</title><style>
:root{{color-scheme:dark}}body{{font:15px/1.5 system-ui;background:#0b0c0f;color:#ece6d8;max-width:860px;margin:0 auto;padding:24px 16px}}
h1{{font-size:22px}}ol{{color:#9a968c}}section{{border:1px solid #24262c;border-radius:12px;padding:14px;margin:14px 0;background:#14161b}}
section.done{{opacity:.45}}header{{display:flex;gap:12px;align-items:center}}header b{{color:#f5b24e;font-size:20px}}header span{{flex:1;font-family:monospace;font-size:13px}}
button{{background:#f5b24e;color:#0b0c0f;border:0;border-radius:8px;padding:8px 14px;font-weight:600;cursor:pointer}}
p{{margin:8px 0;color:#9a968c}}textarea{{width:100%;height:70px;background:#0b0c0f;color:#9a968c;border:1px solid #24262c;border-radius:8px;font-size:12px}}
</style></head><body><h1>Moonlab guide images ({len(order)})</h1>
<ol><li>Open a <b>new Gemini chat</b> for every image (Nano Banana / image mode).</li>
<li>Click <b>Copy prompt</b>, paste, generate, then <b>download</b> the image.</li>
<li>Go in order (01, 02, 03...). Skip one? Rename that file to its number, e.g. <code>07.png</code>.</li>
<li>If it shows text, people or hands, reply in the same chat: <i>Remove all text and people. Every surface is blank paper.</i></li>
<li>When a batch is done, tell Claude <b>"check"</b>. Faded cards are already on the site.</li></ol>
{''.join(cards)}
<script>function cp(b){{const t=b.closest('section').querySelector('textarea');navigator.clipboard.writeText(t.value);b.textContent='Copied';b.closest('section').style.borderColor='#f5b24e'}}</script>
</body></html>""", encoding="utf-8")
    print("page", PAGE)


def import_():
    missing = [s for s in order if not (ROOT / f"public/images/guide-{s}.webp").exists()]
    files = [f for f in DL.iterdir() if f.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")]
    pick = {}
    for f in files:
        st = f.stem.lower()
        m = re.fullmatch(r"(?:guide-)?(\d{1,2})", st)
        if m and 1 <= int(m.group(1)) <= len(order):
            pick[order[int(m.group(1)) - 1]] = f
        elif st.removeprefix("guide-") in scenes:
            pick[st.removeprefix("guide-")] = f
    since = PAGE.stat().st_mtime if PAGE.exists() else 0
    gem = sorted((f for f in files if f.name.startswith("Gemini_Generated_Image") and f.stat().st_mtime > since and f not in pick.values()),
                 key=lambda f: f.stat().st_mtime)
    if pick:  # numbered files given: never guess the rest from download order
        gem = []
    for s in [s for s in missing if s not in pick]:
        if not gem:
            break
        pick[s] = gem.pop(0)
    done = []
    for s, f in pick.items():
        if s not in missing:
            continue
        im = Image.open(f).convert("RGB")
        w, h = im.size; th = int(w * 768 / 1376)
        if th <= h:
            im = im.crop((0, (h - th) // 2, w, (h - th) // 2 + th))
        else:
            tw = int(h * 1376 / 768); im = im.crop(((w - tw) // 2, 0, (w - tw) // 2 + tw, h))
        im.resize((1376, 768), Image.LANCZOS).save(ROOT / f"public/images/guide-{s}.webp", "WEBP", quality=82)
        done.append((s, f.name))
        print("saved", s, "<-", f.name)
    dio = ROOT / "components/ui/Diorama.tsx"; src = dio.read_text(encoding="utf-8")
    for s in order:
        key = f'"guide-{s}"'
        if (ROOT / f"public/images/guide-{s}.webp").exists() and key not in src:
            alt = scenes[s]["alt"].replace('"', "'")
            src = src.replace('  "process-path":', f'  {key}: [1376, 768, "{alt}"],\n  "process-path":', 1)
    dio.write_text(src, encoding="utf-8")
    if done:
        ims = [Image.open(ROOT / f"public/images/guide-{s}.webp").resize((344, 192)) for s, _ in done]
        cols = 5; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new("RGB", (344 * cols, 192 * rows), "white")
        for i, im in enumerate(ims):
            sheet.paste(im, ((i % cols) * 344, (i // cols) * 192))
        sheet.save(DL / "_guide_images_sheet.jpg", quality=85)
        print("sheet", DL / "_guide_images_sheet.jpg")
    print(f"{len(order) - len(missing) + len(done)} of {len(order)} guide images on disk")


{"page": page, "import": import_}[sys.argv[1]]()
