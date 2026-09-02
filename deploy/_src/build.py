import re, pathlib, base64
D = pathlib.Path(__file__).parent
rd = lambda n: (D / n).read_text(encoding='utf-8')

# Símbolo Deploy: "D" sólido dourado com dois dentes à esquerda e estrela de 4 pontas vazada
DPATH = ('M7 3 H21 A17 17 0 0 1 21 37 H7 V29 H11.5 V24.5 H7 V15.5 H11.5 V11 H7 Z '
         'M21 11 L23.4 17.6 L30 20 L23.4 22.4 L21 29 L18.6 22.4 L12 20 L18.6 17.6 Z')
DLOGO = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="%s" fill="#D4A437" fill-rule="evenodd"/></svg>' % DPATH
DLOGO_BIG = '<svg viewBox="0 0 40 40" role="img" aria-label="Deploy"><path d="%s" fill="#D4A437" fill-rule="evenodd"/></svg>' % DPATH

# ── logos reais → data URI ─────────────────────────────────────────────
LOGOS = {
    'newbalance': ('newbalance.svg', 'New Balance'),
    'kipling': ('kipling.svg', 'Kipling'),
    'northface': ('northface.svg', 'The North Face'),
    'coach': ('coach.svg', 'Coach'),
    'sephora': ('sephora.svg', 'Sephora'),
    'estapar': ('estapar.svg', 'Estapar'),
    'rossi': ('rossi-white.svg', 'Rossi'),
    'uniconstrutora': ('uniconstrutora.png', 'Uniconstrutor'),
    'petropolis': ('petropolis.png', 'Águas de Petrópolis'),
}
MIME = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg'}

def fix_svg(name, txt):
    # The North Face: quadrado vermelho + letras brancas → fundo transparente, letras pretas, viewBox recortado
    if name == 'northface':
        txt = (txt.replace('.fil0 {fill:#DA2427}', '.fil0 {fill:none}')
                  .replace('.fil2 {fill:#DA2427;fill-rule:nonzero}', '.fil2 {fill:none}')
                  .replace('.fil1 {fill:white}', '.fil1 {fill:#000}')
                  .replace('.fil3 {fill:white;fill-rule:nonzero}', '.fil3 {fill:#000;fill-rule:nonzero}')
                  .replace('viewBox="0 0 170 170"', 'viewBox="20 48 135 70"'))
        assert '.fil0 {fill:none}' in txt and '.fil1 {fill:#000}' in txt
    # Estapar: currentColor dentro de <img> → preto; o gradiente vira cor sólida
    if name == 'estapar':
        txt = txt.replace('fill="url(#estapar_svg__a)"', 'fill="#000"').replace('fill="currentColor"', 'fill="#000"')
    if name == 'rossi':
        txt = txt.replace('fill="#fff"', 'fill="#000"')
    return txt

def logo_tag(name):
    fn, alt = LOGOS[name]
    p = D / 'logos' / fn
    ext = p.suffix.lower()
    if ext == '.svg':
        raw = fix_svg(name, p.read_text(encoding='utf-8')).encode('utf-8')
    else:
        raw = p.read_bytes()
    uri = 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(raw).decode('ascii'))
    return '<img src="%s" alt="%s">' % (uri, alt)

# ── painel (JPEG já reduzido para 1100 px) ─────────────────────────────
panel_b64 = base64.b64encode((D / 'painel-acelerada.jpg').read_bytes()).decode('ascii')
PANEL = '<img src="data:image/jpeg;base64,%s" alt="Painel da empresa acelerada: visão geral da trilha, encontros, tarefas e métricas.">' % panel_b64

body = rd('body-deploy.html').replace('{{DLOGO_BIG}}', DLOGO_BIG).replace('{{DLOGO}}', DLOGO).replace('{{PANEL}}', PANEL)
body = re.sub(r'\{\{LOGO:([a-z]+)\}\}', lambda m: logo_tag(m.group(1)), body)
assert '{{' not in body, 'placeholder sobrando: ' + body[body.index('{{'):body.index('{{') + 40]

html = ('<meta charset="utf-8">\n<title>Deploy · Aceleração Empresarial</title>\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n<style>\n'
        + rd('_fonts.css') + '\n' + rd('_imgs.css') + '\n' + rd('base.css') + '\n' + rd('extra.css') + '\n</style>\n'
        + body + '\n<script>\n' + rd('deck.js') + '\n</script>\n')
out = D / 'deploy-aceleracao.html'
out.write_text(html, encoding='utf-8')

# balanço de tags no corpo (sem o CSS/JS)
body_nolog = re.sub(r'<img [^>]*>', '<img>', body)
tags = ['div', 'section', 'svg', 'g', 'span', 'p', 'ul', 'li', 'table', 'tr', 'td', 'th', 'a', 'h1', 'h2', 'h3', 'button']
bad = 0
for t in tags:
    o = len(re.findall(r'<%s(?=[\s>])' % t, body_nolog)); c = len(re.findall(r'</%s>' % t, body_nolog))
    flag = '' if o == c else '   <-- DESBALANCEADO'; bad += (o != c)
    print('%-8s abre %3d fecha %3d%s' % (t, o, c, flag))
print('slides:', len(re.findall(r'<section class="slide', body)), '| bytes:', out.stat().st_size,
      '| imgs:', len(re.findall(r'<img', body)), '| desbalanceados:', bad)
