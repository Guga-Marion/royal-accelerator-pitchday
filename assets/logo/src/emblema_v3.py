#!/usr/bin/env python3
"""Emblema RBG v3 — 'coroa ascendente' (2026-09-02).
Fonte única da geometria. Gera os SVGs oficiais e patcheia o <svg class="emb"> dos fontes HTML.
Uso: python3 emblema_v3.py            -> escreve assets/logo/svg/*.svg e patcheia os fontes
     python3 emblema_v3.py --print ouro -> imprime o markup inline (para colar num HTML)
"""
import re, sys, pathlib

# Geometria (viewBox 0 0 100 100). Três pontas côncavas; as pontas (31,38) (49,28) (67,18)
# estão numa reta de inclinação constante — a linha de tendência. Faixa = estrutura.
PONTAS = "M22 68 Q27 56 31 38 Q35 56 40 68 Z M40 68 Q45 53 49 28 Q53 53 58 68 Z M58 68 Q63 48 67 18 Q72 48 78 68 Z"
PONTAS_MINI = "M22 68 L31 38 L40 68 Z M40 68 L49 28 L58 68 Z M58 68 L67 18 L78 68 Z"  # lados retos: <=40px
FAIXA = 'x="22" y="71.5" width="56" height="6.5"'

GRAD = ('<linearGradient id="{id}" x1="0" y1="1" x2="1" y2="0">'
        '<stop offset="0" stop-color="#C2922A"/><stop offset=".55" stop-color="#D4A437"/>'
        '<stop offset="1" stop-color="#F0C44D"/></linearGradient>')

def emblema(variante="ouro", mini=False, cls="emb", xmlns=False, gid="rbgGold"):
    """variante: ouro (colorida, só sobre navy) | branco | navy"""
    p = PONTAS_MINI if mini else PONTAS
    if variante == "ouro":
        fill, ring, ring2 = f"url(#{gid})", "#D4A437", "rgba(212,164,55,.35)"
    elif variante == "branco":
        fill, ring, ring2 = "#F5F2E8", "#F5F2E8", "rgba(245,242,232,.35)"
    else:
        fill, ring, ring2 = "#08132B", "#08132B", "rgba(8,19,43,.35)"
    defs = f"<defs>{GRAD.format(id=gid)}</defs>" if variante == "ouro" else ""
    inner = "" if mini else f'<circle cx="50" cy="50" r="41.5" stroke="{ring2}" stroke-width=".7"/>'
    rw = 1.8 if mini else 1.3
    attrs = ' xmlns="http://www.w3.org/2000/svg"' if xmlns else ""
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c} viewBox="0 0 100 100" fill="none"{attrs}>{defs}'
            f'<circle cx="50" cy="50" r="46" stroke="{ring}" stroke-width="{rw}"/>{inner}'
            f'<path d="{p}" fill="{fill}"/><rect {FAIXA} fill="{fill}"/></svg>')

ROOT = pathlib.Path(__file__).resolve().parents[3]
SVG_DIR = ROOT / "assets/logo/svg"

# Qual variante cada fonte HTML usa
FONTES = {
  "assets/logo/src/horizontal-navy.html": "ouro", "assets/logo/src/horizontal-transp.html": "ouro",
  "assets/logo/src/vertical-navy.html": "ouro",   "assets/logo/src/vertical-transp.html": "ouro",
  "assets/logo/src/banner-navy.html": "ouro",     "assets/logo/src/banner-transp.html": "ouro",
  "assets/logo/src/emblema-transp.html": "ouro",
  "assets/logo/src/mono-branco.html": "branco",   "assets/logo/src/mono-navy.html": "navy",
  "divulgacao/social-rbg/src/social-avatar-instagram.html": "ouro",
  "divulgacao/social-rbg/src/social-avatar-linkedin.html": "ouro",
  "assets/assinaturas/src/_tpl.html": "navy",
  "assets/assinaturas/src/sig-guga.html": "navy", "assets/assinaturas/src/sig-lucilene.html": "navy",
  "assets/assinaturas/src/sig-alexandre.html": "navy", "assets/assinaturas/src/sig-lucio.html": "navy",
}
RX = re.compile(r'<svg class="emb"[^>]*>.*?</svg>', re.S)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--print":
        print(emblema(sys.argv[2] if len(sys.argv) > 2 else "ouro")); sys.exit()
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    for v in ("ouro", "branco", "navy"):
        (SVG_DIR / f"emblema-{v}.svg").write_text(emblema(v, cls=None, xmlns=True) + "\n")
        (SVG_DIR / f"emblema-{v}-mini.svg").write_text(emblema(v, mini=True, cls=None, xmlns=True) + "\n")
        print("svg ->", f"emblema-{v}.svg", f"emblema-{v}-mini.svg")
    for rel, v in FONTES.items():
        f = ROOT / rel
        if not f.exists(): print("  (ausente)", rel); continue
        s = f.read_text(); n = len(RX.findall(s))
        f.write_text(RX.sub(lambda m: emblema(v), s))
        print(f"patch -> {rel} ({n} svg, {v})")
    (ROOT / "divulgacao/social-rbg/src/_emblema.svg").write_text(emblema("ouro", cls=None, xmlns=True) + "\n")
    print("svg -> divulgacao/social-rbg/src/_emblema.svg")
