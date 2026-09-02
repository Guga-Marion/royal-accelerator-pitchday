#!/usr/bin/env python3
"""Emblema RBG · versão final (2026-09-02) — "v1 afinado".
Anel duplo (o selo) · área de gráfico em contorno com picos numa tendência que acelera (o gráfico)
· barra de base (o chão). É o emblema original de 2026-08 com o traço mais fino e a geometria fechada.
Fonte única da geometria. Gera os SVGs oficiais e patcheia o <svg class="emb"> dos fontes HTML.
Uso: python3 emblema_v3.py            -> escreve assets/logo/svg/*.svg e patcheia os fontes
     python3 emblema_v3.py --print ouro -> imprime o markup inline (para colar num HTML)
"""
import re, sys, pathlib

# Geometria (viewBox 0 0 100 100). Picos (38,43) (53,38) (71,29): cada subida maior que a anterior.
AREA = "M29 60 V51 L38 43 L44 49 L53 38 L59 44 L71 29 V60 Z"
BARRA = 'x="29" y="63.5" width="42" height="3" rx="1.5"'

def emblema(variante="ouro", mini=False, cls="emb", xmlns=False):
    """variante: ouro (colorida, só sobre navy) | branco | navy.
    mini (<= 40 px): anel único mais grosso e a área do gráfico cheia — o contorno fino some nesse tamanho."""
    if variante == "ouro":
        anel, traco = "#D4A437", "#F0C44D"
    elif variante == "branco":
        anel = traco = "#F5F2E8"
    else:
        anel = traco = "#08132B"
    attrs = ' xmlns="http://www.w3.org/2000/svg"' if xmlns else ""
    c = f' class="{cls}"' if cls else ""
    if mini:
        corpo = (f'<circle cx="50" cy="50" r="45" stroke="{anel}" stroke-width="2.6"/>'
                 f'<path d="{AREA}" fill="{traco}"/><rect {BARRA} fill="{traco}"/>')
    else:
        corpo = (f'<circle cx="50" cy="50" r="45" stroke="{anel}" stroke-width="1.6"/>'
                 f'<circle cx="50" cy="50" r="39" stroke="{anel}" stroke-width=".8" opacity=".55"/>'
                 f'<path d="{AREA}" stroke="{traco}" stroke-width="1.8" stroke-linejoin="round"/>'
                 f'<rect {BARRA} fill="{traco}"/>')
    return f'<svg{c} viewBox="0 0 100 100" fill="none"{attrs}>{corpo}</svg>'

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
  "divulgacao/social-rbg/src/social-capa-youtube.html": "ouro",
  "divulgacao/social-rbg/src/social-capa-linkedin.html": "ouro",
  "divulgacao/social-rbg/src/social-capa-linkedin-empresa.html": "ouro",
  "divulgacao/social-rbg/src/post-foto-feed.html": "ouro",
  "divulgacao/social-rbg/src/post-foto-quadrado.html": "ouro",
  "divulgacao/social-rbg/src/post-foto-story.html": "ouro",
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
