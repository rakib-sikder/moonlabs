"""Generate paper-craft diorama images for /guides with the Gemini image API.
Reads scenes from design/guide-scenes.json ({slug: scene}), wraps them in the house style from
design/image-prompts.md, saves public/images/guide-<slug>.webp (1376x768). Skips files that exist.
Keys: GEMINI_API_KEY* lines in LeadPilot's .env (never printed).
Usage (from orbit/): python scripts/gen-guide-images.py [model] [only-slug]
"""
import base64, io, json, re, sys, time
from pathlib import Path
import httpx
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MODEL = sys.argv[1] if len(sys.argv) > 1 else "gemini-2.5-flash-image"
ONLY = sys.argv[2] if len(sys.argv) > 2 else None
env = Path(r"D:\Desktop\Anything\LeadPilot_AllInOne\services\CL_Lead\.env").read_text(encoding="utf-8")
KEYS = list(dict.fromkeys(m.group(1).strip().strip('"').strip("'") for m in
                          re.finditer(r"^\s*GEMINI_API_KEY(?:_\d+)?\s*=\s*(.+)$", env, re.M) if m.group(1).strip()))
STYLE = ("HOW IT IS MADE AND LIT (the look only, this adds no extra objects): A photorealistic macro studio photograph of a handmade "
         "paper-craft miniature diorama. Every object in the scene is cut, scored and folded by hand from thick matte paper and card. "
         "The paper is deep graphite and charcoal (between #0b0c0f and #272b33), with visible paper fibre, crisp knife-cut edges, tiny "
         "glue seams and soft layered shadows between the layers. The diorama sits on a dark matte charcoal desk surface at night, "
         "against a plain near-black backdrop (#0b0c0f) that fades to darkness at the edges. There is exactly one accent colour: warm "
         "amber (#f5b24e), used only where described, like lamplight. Somewhere in the upper part of the frame hangs one small crescent "
         "moon cut from warm off-white paper (#ece6d8) on an almost invisible thread; it is small and quiet, never the main subject. "
         "Lighting: a single small warm amber light source inside the scene, plus a very faint cool fill so the dark paper shapes stay "
         "readable. Gentle glow, long soft shadows, no harsh highlights. Camera: 85mm macro lens at f/4, slightly raised three-quarter "
         "view, shallow depth of field with the main subject tack sharp and the background softly blurred. Calm, tidy, quiet mood. "
         "Strictly no people, no hands, no faces, no animals. No text, letters, numbers, logos, brand marks, screens, user-interface "
         "elements or watermarks anywhere; every sheet, sign, card and label is blank. Not a 3D render, not a cartoon, not an "
         "illustration, not neon, not glossy plastic: it must look like real paper photographed in a studio.\n\n"
         "The only objects in the picture are the ones listed in THE SCENE, plus the small paper moon.")
scenes = json.loads((ROOT / "design/guide-scenes.json").read_text(encoding="utf-8"))
out_dir = ROOT / "public/images"
k = 0
for slug, scene in scenes.items():
    if ONLY and slug != ONLY:
        continue
    out = out_dir / f"guide-{slug}.webp"
    if out.exists():
        continue
    prompt = ("Create a brand-new image. Aspect ratio: 16:9 landscape. High resolution.\n\nTHE SCENE (this is the subject, and it is "
              f"the most important part): {scene['scene']} Main subject centred, calm empty space around it.\n\n{STYLE}")
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9"}}}
    for attempt in range(len(KEYS) * 2):
        key = KEYS[k % len(KEYS)]
        r = httpx.post(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                       params={"key": key}, json=body, timeout=240)
        if r.status_code == 200:
            parts = r.json()["candidates"][0]["content"]["parts"]
            data = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
            if not data:
                print(slug, "no image:", str(parts)[:160]); break
            im = Image.open(io.BytesIO(base64.b64decode(data))).convert("RGB")
            w, h = im.size; th = int(w * 768 / 1376)
            if th <= h:
                im = im.crop((0, (h - th) // 2, w, (h - th) // 2 + th))
            im.resize((1376, 768), Image.LANCZOS).save(out, "WEBP", quality=82)
            print("saved", out.name, flush=True); break
        print(f"  {slug}: key{k % len(KEYS) + 1} -> {r.status_code} {r.text[:150]}", flush=True)
        k += 1
        time.sleep(4)
    time.sleep(2)
