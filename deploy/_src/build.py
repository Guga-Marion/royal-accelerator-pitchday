import re, pathlib, collections
D = pathlib.Path(__file__).parent
rd = lambda n: (D / n).read_text(encoding='utf-8')

# Símbolo Deploy: "D" sólido dourado com dois dentes à esquerda e estrela de 4 pontas vazada
DPATH = ('M7 3 H21 A17 17 0 0 1 21 37 H7 V29 H11.5 V24.5 H7 V15.5 H11.5 V11 H7 Z '
         'M21 11 L23.4 17.6 L30 20 L23.4 22.4 L21 29 L18.6 22.4 L12 20 L18.6 17.6 Z')
DLOGO = ('<svg viewBox="0 0 40 40" aria-hidden="true"><path d="%s" fill="#D4A437" fill-rule="evenodd"/></svg>' % DPATH)
DLOGO_BIG = ('<svg viewBox="0 0 40 40" role="img" aria-label="Deploy"><path d="%s" fill="#D4A437" fill-rule="evenodd"/></svg>' % DPATH)

# Geometria de fundo (no lugar de foto): anéis dourados + "D" gigante em marca d'água
GEO = ('<svg class="dp-geo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
       '<defs><radialGradient id="dpg" cx="72%" cy="40%" r="55%"><stop offset="0" stop-color="#2E56A6" stop-opacity=".42"/><stop offset="1" stop-color="#08132B" stop-opacity="0"/></radialGradient>'
       '<linearGradient id="dpl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0C44D" stop-opacity=".16"/><stop offset="1" stop-color="#C2922A" stop-opacity=".03"/></linearGradient></defs>'
       '<rect width="1600" height="900" fill="url(#dpg)"/>'
       '<g class="dp-orb" style="--dd:150ms"><circle cx="1230" cy="380" r="560" fill="none" stroke="#C2922A" stroke-opacity=".07" stroke-width="1"/></g>'
       '<g class="dp-orb" style="--dd:300ms"><circle cx="1230" cy="380" r="420" fill="none" stroke="#C2922A" stroke-opacity=".1" stroke-width="1"/></g>'
       '<g class="dp-orb" style="--dd:450ms"><circle cx="1230" cy="380" r="290" fill="none" stroke="#D4A437" stroke-opacity=".14" stroke-width="1.2"/></g>'
       '<g class="dp-orb" style="--dd:600ms"><circle cx="1230" cy="380" r="170" fill="none" stroke="#F0C44D" stroke-opacity=".18" stroke-width="1.4"/></g>'
       '<g class="dp-orb" style="--dd:750ms" transform="translate(1030 180) scale(10)"><path d="%s" fill="url(#dpl)" fill-rule="evenodd"/></g>'
       '<path d="M0 760 L1600 520" stroke="#C2922A" stroke-opacity=".08"/><path d="M0 860 L1600 620" stroke="#C2922A" stroke-opacity=".05"/>'
       '</svg>').replace('%s', DPATH)

body = rd('body-deploy.html').replace('{{DLOGO_BIG}}', DLOGO_BIG).replace('{{DLOGO}}', DLOGO).replace('{{GEO}}', GEO)
assert '{{' not in body, 'placeholder sobrando'

html = ('<meta charset="utf-8">\n<title>Deploy · Aceleração Empresarial</title>\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n<style>\n'
        + rd('_fonts.css') + '\n' + rd('base.css') + '\n' + rd('extra.css') + '\n</style>\n'
        + body + '\n<script>\n' + rd('deck.js') + '\n</script>\n')
out = D / 'deploy-aceleracao.html'
out.write_text(html, encoding='utf-8')

# balanço de tags no corpo (sem o CSS/JS)
tags = ['div', 'section', 'svg', 'g', 'span', 'p', 'ul', 'li', 'table', 'tr', 'td', 'a', 'h1', 'h2', 'h3', 'button']
for t in tags:
    o = len(re.findall(r'<%s(?=[\s>])' % t, body)); c = len(re.findall(r'</%s>' % t, body))
    flag = '' if o == c else '   <-- DESBALANCEADO'
    print('%-8s abre %3d fecha %3d%s' % (t, o, c, flag))
print('slides:', len(re.findall(r'<section class="slide', body)), '| bytes:', out.stat().st_size, '| price-tbd:', body.count('price-tbd'))
