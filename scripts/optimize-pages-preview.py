#!/usr/bin/env python3
"""Prepare the MAISON MILLIN static archive for Cloudflare Pages Preview."""
from pathlib import Path
import base64
import hashlib
import re
import shutil
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "dist").resolve()
if not root.exists():
    raise SystemExit(f"Missing build directory: {root}")

# Source-only HTML and setup notes are not part of the public website.
for name in ("source-pages", "CORRESPONDENCE_BACKEND_SETUP.md", "DEPLOYMENT_NOTES.txt"):
    target = root / name
    if target.is_dir():
        shutil.rmtree(target)
    elif target.exists():
        target.unlink()

mime_ext = {
    "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg",
    "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif"
}
asset_dir = root / "assets" / "embedded"
asset_dir.mkdir(parents=True, exist_ok=True)
seen = {}
stats = {"html": 0, "embedded_refs": 0, "assets": 0, "before": 0, "after": 0}

data_uri = re.compile(r"data:(image/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)")

def externalize(match):
    mime, payload = match.group(1).lower(), match.group(2)
    raw = base64.b64decode(payload)
    digest = hashlib.sha256(raw).hexdigest()[:20]
    ext = mime_ext.get(mime, "bin")
    filename = f"{digest}.{ext}"
    if filename not in seen:
        (asset_dir / filename).write_bytes(raw)
        seen[filename] = True
    stats["embedded_refs"] += 1
    return f"/assets/embedded/{filename}"

descriptions = {
    "/": "MAISON MILLIN is an independent House of Horological Art, creating exceptional mechanical timepieces for a select circle of collectors.",
    "/the-house/": "Discover the philosophy, heritage and private world of MAISON MILLIN, a House of Horological Art founded in 2022.",
    "/the-atelier/": "Enter the MAISON MILLIN Atelier and discover the considered process behind individual horological creations.",
    "/metiers-d-art/": "Discover Grand Feu enamel, hand engraving, guilloché and miniature dial painting at MAISON MILLIN.",
    "/bespoke/": "Discover private commissions at MAISON MILLIN, from the first conversation and sketch to materials, craft and creation.",
    "/creations/": "Explore the MAISON MILLIN archive of individual works of horological art, each conceived as a singular object.",
    "/creations/yellow-tiger/": "Discover Yellow Tiger, an individual MAISON MILLIN creation combining decorative artistry and Swiss mechanical watchmaking.",
    "/creations/graceful-crane/": "Discover Graceful Crane, a MAISON MILLIN horological creation inspired by movement, time and transience.",
    "/creations/golden-peacock/": "Discover Golden Peacock, an individual work in the MAISON MILLIN collection of horological art.",
    "/creations/starry-night/": "Discover Starry Night, a MAISON MILLIN creation with a celestial artistic identity.",
    "/creations/royal-wave/": "Discover Royal Wave, an individual MAISON MILLIN creation exploring motion and balance.",
    "/journal/": "Read the MAISON MILLIN Journal: notes on horological art, decorative craft, material, time and the human hand.",
    "/journal/the-colour-of-fire": "A study of Grand Feu enamel at MAISON MILLIN: material, heat, patience and the making of a luminous dial.",
    "/journal/the-engravers-hour": "A close study of hand engraving at MAISON MILLIN: the burin, the hand and the character of a cut line.",
    "/journal/when-precision-meets-the-hand": "An essay on the relationship between mechanical precision, human judgement and horological art.",
    "/correspondence/": "Contact MAISON MILLIN for private appointments, creation enquiries and bespoke commissions.",
    "/service/": "Information about the care and service of MAISON MILLIN horological creations."
}

for page in sorted(root.rglob("*.html")):
    if "source-pages" in page.parts:
        continue
    original = page.read_text(encoding="utf-8", errors="replace")
    stats["before"] += len(original.encode("utf-8"))
    html = data_uri.sub(externalize, original)

    # External images should not block the initial HTML response.
    img_index = 0
    def tune_img(m):
        nonlocal_dummy = None
        nonlocal_img = m.group(0)
        nonlocal_dummy = nonlocal_img
        nonlocal_dummy = re.sub(r"\sloading=(['\"]).*?\1", "", nonlocal_dummy, flags=re.I)
        nonlocal_dummy = re.sub(r"\sdecoding=(['\"]).*?\1", "", nonlocal_dummy, flags=re.I)
        nonlocal_dummy = re.sub(r"\sfetchpriority=(['\"]).*?\1", "", nonlocal_dummy, flags=re.I)
        nonlocal_dummy = re.sub(r"\s+", " ", nonlocal_dummy)
        return nonlocal_dummy[:-1] + (' loading="eager" fetchpriority="high" decoding="async">' if img_index == 0 else ' loading="lazy" decoding="async">')
    def img_repl(m):
        nonlocal_holder[0] += 1
        return tune_img(m)
    nonlocal_holder = [0]
    html = re.sub(r"<img\b[^>]*>", img_repl, html, flags=re.I)

    rel = "/" + str(page.relative_to(root)).replace("\\", "/")
    if rel.endswith("index.html"):
        rel = rel[:-10]
        if not rel:
            rel = "/"
    canonical = "https://maisonmillin.com" + rel
    description = descriptions.get(rel)
    if description and re.search(r"<head\b", html, re.I):
        head_end = re.search(r"</head\s*>", html, re.I)
        if head_end:
            head = html[:head_end.start()]
            # Replace the generic description if present, otherwise add one.
            if re.search(r'<meta\s+name=["\']description["\']', head, re.I):
                html = re.sub(r'(<meta\s+name=["\']description["\']\s+content=["\'])[^"\']*(["\'])', lambda m: m.group(1) + description + m.group(2), html, count=1, flags=re.I)
            else:
                html = html[:head_end.start()] + f'<meta name="description" content="{description}">\n' + html[head_end.start():]
            head_end = re.search(r"</head\s*>", html, re.I)
            head = html[:head_end.start()]
            if not re.search(r'<link\s+rel=["\']canonical["\']', head, re.I):
                html = html[:head_end.start()] + f'<link rel="canonical" href="{canonical}">\n' + html[head_end.start():]
            head_end = re.search(r"</head\s*>", html, re.I)
            head = html[:head_end.start()]
            og = [
                ("og:type", "article" if rel.startswith("/journal/") and rel != "/journal/" else "website"),
                ("og:url", canonical),
                ("og:description", description),
            ]
            for prop, value in og:
                if not re.search(r'<meta\s+property=["\']' + re.escape(prop) + r'["\']', head, re.I):
                    html = html[:head_end.start()] + f'<meta property="{prop}" content="{value}">\n' + html[head_end.start():]
                    head_end = re.search(r"</head\s*>", html, re.I)

    page.write_text(html, encoding="utf-8")
    stats["html"] += 1
    stats["after"] += len(html.encode("utf-8"))

# Remove the unsafe catch-all that turned unknown URLs into HTTP 200 home pages.
redirects = root / "_redirects"
existing = redirects.read_text(encoding="utf-8") if redirects.exists() else ""
lines = [line for line in existing.splitlines() if not re.match(r"\s*/\*\s+/index\.html\s+200\s*$", line)]
for route in ("/journal /index.html 200", "/journal/* /index.html 200"):
    if route not in lines:
        lines.append(route)
redirects.write_text("\n".join(lines).strip() + "\n", encoding="utf-8")

# Cache immutable media separately from HTML and strengthen baseline headers.
headers = root / "_headers"
headers.write_text("""/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
""", encoding="utf-8")

# Keep the correspondence endpoint compatible with the isolated Preview host
# and the configured MAIL_FROM name. Preview has no email secrets, so it cannot send.
fn = root / "functions" / "api" / "correspondence.js"
if fn.exists():
    code = fn.read_text(encoding="utf-8")
    code = code.replace(
        'url.hostname === "maison-millin-preview.pages.dev" ||',
        'url.hostname === "maison-millin-preview.pages.dev" || url.hostname === "maison-millin-remediation-preview.pages.dev" ||'
    )
    code = code.replace("env.EMAIL_FROM", "env.MAIL_FROM")
    fn.write_text(code, encoding="utf-8")

# Cloudflare Pages discovers Functions from the project-root /functions directory.
source_functions = root / "functions"
if source_functions.exists():
    # Build command copies this after optimization, not into dist.
    pass

stats["assets"] = len(seen)
print("MAISON MILLIN Preview optimization:", stats)
