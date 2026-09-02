#!/usr/bin/env python3
"""Aplica o emblema v3 ao manual-marca.html:
   - substitui o capítulo 01 pelo manual-cap01.html (com imagens em base64 e emblemas inline)
   - troca a imagem do hero e os avatares do capítulo 08
   - versão / data / notas de status / CSS das aplicações
Rode depois de render-logo.sh (precisa dos PNGs novos)."""
import base64, pathlib, re, subprocess, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from emblema_v3 import emblema  # noqa

ROOT = pathlib.Path(__file__).resolve().parents[3]
SRC = pathlib.Path(__file__).parent
TMP = SRC / "_manual-img"; TMP.mkdir(exist_ok=True)
PNG = ROOT / "assets/logo/png"
MAN = ROOT / "manual-marca.html"

VERSAO, DATA = "4.0", "2026-09-02"

def prep(src, name, width, fmt):
    """redimensiona com sips para o manual (jpeg para fundo opaco, png para transparente)"""
    out = TMP / name
    args = ["sips", "-Z", str(width), str(src), "--out", str(out)]
    if fmt == "jpeg": args[1:1] = ["-s", "format", "jpeg", "-s", "formatOptions", "82"]
    subprocess.run(args, check=True, capture_output=True)
    mime = "image/jpeg" if fmt == "jpeg" else "image/png"
    return f"data:{mime};base64," + base64.b64encode(out.read_bytes()).decode()

IMGS = {
  "m-hero.png":            (PNG / "horizontal-transp-2752x1536.png", 1376, "png"),
  "m-horizontal-navy.jpg": (PNG / "horizontal-navy-2752x1536.png", 1376, "jpeg"),
  "m-banner-navy.jpg":     (PNG / "banner-navy-2752x600.png", 1376, "jpeg"),
  "m-vertical-navy.jpg":   (PNG / "vertical-navy-2000x2000.png", 1000, "jpeg"),
  "m-emblema-transp.png":  (PNG / "emblema-transp-1600x1600.png", 480, "png"),
  "m-mono-branco.png":     (PNG / "mono-branco-2752x1536.png", 1000, "png"),
  "m-mono-navy.png":       (PNG / "mono-navy-2752x1536.png", 1000, "png"),
  "m-rodadas.jpg":         (ROOT / "assets/logo/explor-v4/rodada-10.png", 1400, "jpeg"),
  "m-avatar-ig.jpg":       (ROOT / "divulgacao/social-rbg/social-avatar-instagram-1080x1080.png", 540, "jpeg"),
  "m-avatar-li.jpg":       (ROOT / "divulgacao/social-rbg/social-avatar-linkedin-1080x1080.png", 540, "jpeg"),
  # capítulo 09 · cortes & reels
  "c-reel-padrao.jpg":     (ROOT / "divulgacao/cortes/reel-padrao-1080x1920.png", 720, "jpeg"),
  "c-reel-fullbleed.jpg":  (ROOT / "divulgacao/cortes/reel-fullbleed-1080x1920.png", 720, "jpeg"),
  "c-reel-editorial.jpg":  (ROOT / "divulgacao/cortes/reel-editorial-1080x1920.png", 720, "jpeg"),
  "c-tiktok-padrao.jpg":   (ROOT / "divulgacao/cortes/tiktok-padrao-1080x1920.png", 720, "jpeg"),
  "c-corte-horizontal.jpg":(ROOT / "divulgacao/cortes/corte-horizontal-1920x1080.png", 1200, "jpeg"),
  "c-corte-horizontal-quadro.jpg": (ROOT / "divulgacao/cortes/corte-horizontal-quadro-1920x1080.png", 1200, "jpeg"),
}
b64 = {k: prep(v[0], k, v[1], v[2]) for k, v in IMGS.items()}

EMB = {
  "ouro": emblema("ouro", cls=None), "ouro-mini": emblema("ouro", mini=True, cls=None),
  "navy": emblema("navy", cls=None), "navy-mini": emblema("navy", mini=True, cls=None),
  "branco": emblema("branco", cls=None),
}

cap = (SRC / "manual-cap01.html").read_text()
cap = re.sub(r"\{\{B64:([^}]+)\}\}", lambda m: b64[m.group(1)], cap)
cap = re.sub(r"\{\{EMB:([^}]+)\}\}", lambda m: EMB[m.group(1)], cap)

s = MAN.read_text()

# 1. capítulo 01 inteiro
a = s.index('<section id="marca">'); b = s.index('<section id="cor">')
s = s[:a] + cap + s[b:]

# 1b. capítulo 09 · cortes & reels (insere antes do <footer>, ou substitui se já existe)
cap9 = (SRC / "manual-cap09.html").read_text()
cap9 = re.sub(r"\{\{B64:([^}]+)\}\}", lambda m: b64[m.group(1)], cap9)
if '<section id="cortes">' in s:
    a = s.index('<section id="cortes">'); b = s.index('<footer>')
    s = s[:a] + cap9 + s[b:]
else:
    s = s.replace('<footer>', cap9 + '<footer>', 1)
if '<a href="#cortes">' not in s:
    s = s.replace('<a href="#social"><b>08</b>Social</a>', '<a href="#social"><b>08</b>Social</a>\n  <a href="#cortes"><b>09</b>Cortes</a>', 1)

# 2. hero (primeira <img> do arquivo)
s = re.sub(r'(<div class="hero">\s*<img src=")data:image/[^"]+(")', lambda m: m.group(1) + b64["m-hero.png"] + m.group(2), s, count=1)

# 3. avatares do capítulo 08 (as duas primeiras <img> dentro de #social)
a = s.index('<section id="social">')
head, tail = s[:a], s[a:]
for name in ("m-avatar-ig.jpg", "m-avatar-li.jpg"):
    tail = re.sub(r'<img src="data:image/[^"]+"', lambda m: f'<img src="{b64[name]}"', tail, count=1)
s = head + tail

# 4. nota do capítulo 08
s = s.replace(
  '<div class="note"><p><b>Aguardando aprovação do selo final (capítulo 01):</b> as peças abaixo ainda mostram a versão anterior do emblema e serão regeneradas em lote assim que o elemento for aprovado.</p></div>',
  '<div class="note"><p><b>Emblema v3 (capítulo 01):</b> os dois avatares já estão na versão nova. Capas e posts com foto ainda mostram o emblema anterior e serão regenerados em lote na sequência — os HTMLs em <code class="mono" style="font-size:12.5px">divulgacao/social-rbg/src/</code> já apontam para o <code class="mono" style="font-size:12.5px">_emblema.svg</code> novo.</p></div>')

# 5. versão e data
s = re.sub(r'<span class="spec">Versão <b>[\d.]+</b></span>', f'<span class="spec">Versão <b>{VERSAO}</b></span>', s)
s = re.sub(r'(<span class="spec">Versão <b>[\d.]+</b></span>\s*<span class="spec">)\d{4}-\d{2}-\d{2}', lambda m: m.group(1) + DATA, s)
s = re.sub(r'<b>Manual da Marca · v[\d.]+</b><span class="dot"></span><span>\d{4}-\d{2}-\d{2}</span>',
           f'<b>Manual da Marca · v{VERSAO}</b><span class="dot"></span><span>{DATA}</span>', s)
# nota do capítulo 08 (versão v3 → final)
s = s.replace(
  '<div class="note"><p><b>Emblema v3 (capítulo 01):</b> os dois avatares já estão na versão nova. Capas e posts com foto ainda mostram o emblema anterior e serão regenerados em lote na sequência — os HTMLs em <code class="mono" style="font-size:12.5px">divulgacao/social-rbg/src/</code> já apontam para o <code class="mono" style="font-size:12.5px">_emblema.svg</code> novo.</p></div>',
  '<div class="note"><p><b>Emblema final (capítulo 01):</b> avatares, capas e posts abaixo já estão na versão final. Fonte em <code class="mono" style="font-size:12.5px">divulgacao/social-rbg/src/</code>; <code class="mono" style="font-size:12.5px">render-social.sh</code> regenera tudo.</p></div>')

# 6. CSS das aplicações do emblema (idempotente)
CSS = """
/* emblema · reduções e aplicações (v3) */
.redrow{display:flex;align-items:flex-end;gap:26px;flex-wrap:wrap;justify-content:center}
.red{display:flex;flex-direction:column;align-items:center;gap:10px}
.red span{display:block}.red span svg{width:100%;height:100%;display:block}
.red i{font-family:'JetBrains Mono',monospace;font-style:normal;font-size:10px;letter-spacing:.16em;color:var(--on-3);text-transform:uppercase}
.embapps{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:22px}
.embapps .wide{grid-column:span 3}
@media(max-width:900px){.embapps{grid-template-columns:1fr 1fr}.embapps .wide{grid-column:span 2}}
.tile{border:1px solid var(--on-rule);background:rgba(12,27,61,.4);display:flex;flex-direction:column}
.t-body{aspect-ratio:4/3;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(160deg,var(--navy-2),var(--navy))}
.wide .t-body{aspect-ratio:auto;height:300px;gap:34px;padding:28px}
.t-cap{padding:12px 16px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--on-2);border-top:1px solid var(--on-rule)}
.t-cap b{color:var(--gold-lt);font-weight:500}
.t-body svg{display:block}
/* instagram */
.t-ig{flex-direction:column;gap:14px;background:#0B0B0F}
.ig-avatar{width:118px;height:118px;border-radius:50%;padding:10px;background:radial-gradient(70% 70% at 50% 40%,#16295A,#08132B);
  box-shadow:0 0 0 2px #0B0B0F,0 0 0 4px #D4A437}
.ig-avatar svg{width:100%;height:100%}
.ig-meta{text-align:center;display:flex;flex-direction:column;gap:2px}
.ig-meta b{color:#fff;font-size:13px}.ig-meta span{color:#8A8F98;font-size:11px}
/* linkedin */
.t-li{background:#F3F2EF;flex-direction:column;justify-content:flex-start;align-items:flex-start}
.li-cover{width:100%;height:36%;background:linear-gradient(120deg,#08132B,#16295A)}
.li-avatar{width:88px;height:88px;margin:-44px 0 0 22px;border-radius:8px;padding:10px;background:#08132B;border:3px solid #F3F2EF}
.li-avatar svg{width:100%;height:100%}
.li-name{padding:8px 22px;display:flex;flex-direction:column}
.li-name b{color:#000;font-size:14px}.li-name span{color:#666;font-size:11px}
/* favicon */
.t-fav{flex-direction:column;align-items:stretch;justify-content:center;gap:8px;padding:0 26px;background:#1F1F1F}
.tab{display:flex;align-items:center;gap:9px;background:#35363A;border-radius:8px 8px 0 0;padding:8px 12px;font-family:'Inter',sans-serif;font-size:12px;color:#E8EAED}
.tab.dim{background:#232427;color:#9AA0A6}
.tab .fav{width:16px;height:16px;flex:none}.tab .fav svg{width:16px;height:16px}
.tab-t{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tab-x{color:#9AA0A6}
.url{display:flex;align-items:center;gap:9px;background:#282A2D;border-radius:999px;padding:7px 14px;font-family:'Inter',sans-serif;font-size:12px;color:#E8EAED;margin-top:4px}
.url .fav{width:16px;height:16px}.url .fav svg{width:16px;height:16px}
/* app icon */
.t-app{gap:22px}
.appicon{width:118px;height:118px;border-radius:26px;padding:20px;background:radial-gradient(70% 70% at 50% 38%,#16295A,#08132B);box-shadow:0 14px 34px rgba(0,0,0,.45)}
.appicon.sm{width:64px;height:64px;border-radius:15px;padding:11px}
.appicon.xs{width:36px;height:36px;border-radius:9px;padding:6px}
.appicon svg{width:100%;height:100%}
/* carimbo */
.t-stamp{background:#F6F2E9;flex-direction:column;gap:8px}
.stamp{width:132px;height:132px;opacity:.86;filter:contrast(1.05)}
.stamp svg{width:100%;height:100%}
.stamp-txt{display:flex;flex-direction:column;align-items:center;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;color:#08132B;opacity:.8}
/* pin */
.t-pin{background:radial-gradient(60% 60% at 50% 45%,#101F44,#08132B)}
.pin{width:120px;height:120px;border-radius:50%;padding:12px;background:radial-gradient(circle at 35% 30%,#1B2E63,#0A1533 70%);
  box-shadow:0 18px 40px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08),0 0 0 3px #A87C18,0 0 0 4px #F0C44D66}
.pin svg{width:100%;height:100%}
/* cartão */
.t-card{background:#0E1730}
.card{width:340px;height:196px;border-radius:6px;display:flex;flex-direction:column;justify-content:space-between;padding:22px 26px;box-shadow:0 18px 40px rgba(0,0,0,.5)}
.card.front{background:linear-gradient(160deg,#0C1B3D,#08132B)}
.card.back{background:#F6F2E9;flex-direction:row;align-items:center;gap:20px;justify-content:flex-start}
.card .lock{display:flex;align-items:center;gap:14px}
.card .lock svg{width:56px;height:56px}
.card .wm{display:flex;flex-direction:column;line-height:1;font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:22px;color:#F5F2E8}
.card .wm i{font-style:italic;color:#F0C44D}
.card .cf{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.28em;text-transform:uppercase;color:#A9B4D0}
.bk-emb{width:74px;height:74px;flex:none}.bk-emb svg{width:100%;height:100%}
.bk-txt{display:flex;flex-direction:column;gap:3px;border-left:1px solid #C2922A;padding-left:18px}
.bk-txt b{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:22px;color:#08132B;line-height:1}
.bk-txt span{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:#A87C18}
.bk-txt .bk-m{font-family:'Inter',sans-serif;text-transform:none;letter-spacing:0;font-size:10px;color:#394561;margin-top:4px}
/* social */
.t-story{background:#0E1730}
.story{width:150px;height:266px;border-radius:14px;background:linear-gradient(180deg,#0C1B3D,#08132B);border:1px solid rgba(212,164,55,.35);padding:14px;display:flex;flex-direction:column;align-items:center;gap:10px;justify-content:flex-start}
.st-top{display:flex;flex-direction:column;align-items:center;gap:6px}
.st-top svg{width:44px;height:44px}
.st-top span{font-family:'JetBrains Mono',monospace;font-size:6.5px;letter-spacing:.26em;text-transform:uppercase;color:#D4A437}
.st-title{margin-top:auto;font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:26px;line-height:1;color:#F5F2E8;text-align:center}
.st-title i{color:#F0C44D}
.st-eb{font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:.26em;text-transform:uppercase;color:#A9B4D0;margin-bottom:8px}
.post{width:266px;height:266px;background:linear-gradient(160deg,#0C1B3D,#08132B);border:1px solid rgba(212,164,55,.35);padding:22px;display:flex;flex-direction:column;justify-content:space-between}
.po-emb svg{width:40px;height:40px}
.po-t{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:30px;line-height:1.05;color:#F5F2E8}
.po-t i{color:#F0C44D}
.po-foot{display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;color:#6E7CA2}
.po-foot .dot{width:3px;height:3px;border-radius:50%;background:#C2922A}
"""
if "/* emblema · reduções e aplicações (v3) */" not in s:
    s = s.replace("/* rodapé */", CSS + "\n/* rodapé */", 1)

MAN.write_text(s)
print(f"manual-marca.html -> v{VERSAO} ({len(s)/1e6:.2f} MB)")
