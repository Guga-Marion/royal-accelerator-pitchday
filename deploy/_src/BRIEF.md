# Briefing · Apresentação comercial Deploy (braço de educação da RBG)

## O que construir
Um deck HTML **de arquivo único**, em **português**, com navegação por slides (← → / índice / tela cheia) e
**animações de entrada bem trabalhadas** (count-up de números, linhas SVG que se desenham, cards que
"pop", texto que entra em cascata). É uma **apresentação comercial (vendas)**: problema → agitação →
solução → prova → oferta → fechamento, com **gatilhos mentais** (escassez real, autoridade, prova social,
reciprocidade, ancoragem de preço, compromisso/consistência, comunidade/pertencimento).

Arquivo de saída: `deploy-aceleracao.html` (nesta pasta). Um só arquivo, fontes embutidas em base64.

## Identidade visual — OBRIGATÓRIO reusar o sistema da RBG
Não invente paleta nova. Reaproveite os arquivos desta pasta:
- `_fonts.css` — @font-face (Cormorant Garamond, Inter, JetBrains Mono) em base64. Cole inteiro no `<style>`.
- `base.css` — CSS completo do deck da RBG (classes .slide, .pane, .hd/.eb/.mk, .bd, .ft, .bx, .g2/.g3/.g4,
  .tb, .stat, .dg .draw .pop .grow, .ask, .chips, .stp/.st, .hz/.hzc, .note, .ctas/.cta, engine de auto-fit
  via `--uf`). Cole inteiro. Adicione um bloco `extra.css` seu **depois** para componentes novos — nunca
  reuse nomes curtos já existentes (armadilha: `.fr` já existe).
- `deck.js` — navegação, HUD, índice, barra, animação por slide (classe `.on`), auto-fit. Cole inteiro
  e mantenha o chrome do fim do body (ver `body-full.html`, últimas ~40 linhas: `#bar`, `#hint`, `#ov`, `.hud`).
- `body-full.html` — o corpo do deck da RBG. **Leia inteiro** para copiar a gramática dos slides
  (capa `k-full s-dark` com `.bg` + `.veil`, slides de ato `.bd.act` com `.no/.ru/.ti/.su`, `k-split`,
  `s-light`, `s-paper`, diagramas SVG `.dg` com `.draw`/`.pop`, `.ask` com `.v.num`, `.chips`).
- `design-system.md` — paleta e componentes.

Paleta: navy `#08132B/#0C1B3D/#16295A`, dourado `#C2922A/#D4A437/#F0C44D/#A87C18`, papel/areia
`#FFFFFF/#F6F2E9/#EFE8D9`, tinta `#0E1730/#394561/#6B7591/#9AA4BD`, azul de exit `#4C74D9`.
Tipografia: display Cormorant Garamond (títulos, números grandes), corpo Inter, mono JetBrains Mono
(eyebrows uppercase com letter-spacing).

Não há fotos disponíveis: nas capas use `.glow` ou gradientes/geometria navy+dourado (SVG/CSS),
nunca imagens externas (CSP bloqueia). Sem CDN, sem `<link>` externo. Comece o arquivo com
`<meta charset="utf-8">` e `<title>`.

### Marca Deploy
A Deploy tem um símbolo próprio: um **"D" negativo com uma estrela de 4 pontas** dentro (o "D" tem dois
recortes/dentes no lado esquerdo). Recrie em SVG inline simples (D sólido dourado com estrela de 4 pontas
vazada), use como marcador `.mk` no header dos slides e na capa. Ao lado, o wordmark
"DEPLOY" em Inter bold com "EXPERIENCE" pequeno em mono embaixo — ou apenas "Deploy". No deck,
a Deploy é apresentada como **"o braço de educação da Royal Business Growth"**.

## Quem é a Deploy (narrativa)
- **Deploy = braço de educação da Royal Business Growth (RBG).** Aceleradora empresarial: educação
  para empreendedores / educação empresarial. Faz parte do grupo RBG (Orlando, FL · Delaware).
- Origem: agência de experiência digital (UX, CRO, growth, produto) em São Paulo que trabalhou com
  grandes marcas. Hoje aplica o **mesmo método da RBG** em programas pagos.
- **Boutique de propósito.** Atende **20 a 30 projetos por ano**, no máximo. Time enxuto. "Não vendemos
  para todo mundo. Não temos produto para isso — nem queremos ter." (gatilho: escassez real + exclusividade)
- Quem chega: empresas que passaram pelo Pitch Day da RBG e não foram selecionadas para a turma
  investida (a RBG só acelera ~10 por turma), mais empresas indicadas. **Ninguém sai do funil de mãos
  vazias.**
- Relação com o programa da RBG: o programa de 120 dias **com o conselho** é exclusivo dos vencedores do
  Pitch Day e das investidas. Na Deploy, o programa também é de **120 dias**, sobre **as mesmas bases**
  (finanças, comercial, liderança, processos, growth/GTM, tecnologia & IA), mas **entregue pelo time da
  Deploy**, não pelos conselheiros da RBG.

## O time (mentores) — nomes reais, use exatamente
- **Gustavo Marion** — Managing Partner da RBG e sócio da Deploy. Na Deploy faz **todas as introduções**
  e conduz **reuniões de Go-to-Market/growth**. Perfil: palestrante (TEDx, Rio Innovation Week, ISPO
  Munique, Equity USA Orlando), founder da MyDose AI.
- **Luiz** — IA & Tecnologia.
- **Eugênio** — Financeiro.
- **Nick** — mentor Deploy (área não informada: use um rótulo neutro tipo "Mentor · operação do programa"
  e deixe fácil de trocar).

## Os três programas (oferta) — números exatos
1. **Empresas tradicionais** (negócio que já fatura: serviços, varejo, construção, saúde, etc.)
   - **Sprint · 60 dias** — **US$ 4.000** · 4 encontros focados + acesso ao time (formato consultoria).
   - **Aceleração · 120 dias** — **US$ 7.500** · programa completo, 8 encontros quinzenais sobre as 6 bases,
     introduções e GTM com Gustavo, financeiro com Eugênio, tecnologia & IA com Luiz.
2. **Startups / empresas de tecnologia** (objetivo de tese/investimento — é outro tipo de aceleração:
   tração, métricas, produto, captação)
   - **Sprint · 60 dias** — **US$ 4.200** (confirmado 2026-09-02)
   - **Aceleração · 120 dias** — **US$ 7.500** (confirmado 2026-09-02)
3. **US Journey** (levar a empresa do Brasil para os Estados Unidos: estrutura, abertura, mercado, rede
   em Orlando, entrada no ecossistema RBG) — programa de 120 dias + jornada de internacionalização —
   preço **ainda não informado**. Escreva entregáveis plausíveis e genéricos (estruturação da entidade nos
   EUA com parceiros, plano de mercado, rede/introduções em Orlando, go-to-market americano,
   acompanhamento 120 dias) sem inventar números.

**IMPORTANTE sobre preços:** use SOMENTE os valores informados (US$ 4.000 e US$ 7.500 do programa
tradicional). Os preços NÃO informados devem aparecer como `<span class="v num price-tbd" data-price="startup-60">US$ ···</span>`
com um `.k` "valor sob consulta" — ou seja, um placeholder visualmente elegante, fácil de substituir
depois via `data-price` (`startup-60`, `startup-120`, `us-journey`). NUNCA invente um número.

Ancoragem: mostrar o 120 dias como "o programa" e o 60 dias como porta de entrada; destacar
"Mais escolhido" no 120 dias tradicional. Para a comparação, use o componente `.hz`/`.hzc h1/h2/h3`
(rampa dourado sólido → dourado profundo → azul exit) — é o componente-assinatura da RBG.

## Prova social — logos de clientes (wordmarks tipográficos, sem imagem)
Faça uma "parede de logos" com wordmarks em texto estilizado, tom `--on-2`/`--ink-3` (monocromático
elegante), hover/entrada animada. Marcas: **New Balance · Kipling · The North Face · Coach · Sephora ·
Estapar · MS Saúde · Rossi (construtora) · Uniconstrutor · Águas de Petrópolis**. Cada wordmark pode
ter um tratamento tipográfico leve que lembre a marca (ex.: "THE NORTH FACE" em bold condensed uppercase,
"COACH" em serif spaced, "Kipling" em lowercase arredondado, "SEPHORA" em bold tracked) — apenas
tipografia, nunca reproduza logotipos.

## Storyline sugerido (~16–18 slides; ajuste)
1. **Capa** — "Deploy · o braço de educação da Royal Business Growth". Sub: "Aceleração empresarial de 120
   dias, com o método da RBG, para 20 a 30 empresas por ano." Três `.ask`: **120 dias · 6 bases · 20–30
   vagas/ano**.
2. **Ato I · O problema** — "Faturar não é o mesmo que crescer." O dono é o gargalo; sem margem conhecida,
   sem processo, sem time de primeiro escalão. (agitação com 3 sintomas × 3 consequências, `.g2` `.bx`)
3. **O custo de esperar** — números que contam (count-up): meses perdidos, decisões sem dado, etc. Use
   afirmações qualitativas fortes, sem estatísticas inventadas com fonte falsa.
4. **Ato II · A solução** — "O mesmo método que a RBG usa para decidir onde investir — agora para você."
5. **Quem é a Deploy** — braço de educação da RBG; de agência de experiência digital para aceleradora;
   diagrama SVG `.dg` RBG (hub → Pitch Day → conselho/investidas) e Deploy ao lado (a cauda longa).
6. **Parede de logos** — "Quem já construiu com a gente."
7. **As 6 bases** — finanças · comercial · liderança · processos · growth & GTM · tecnologia & IA (grid).
8. **Como funciona · 120 dias** — linha do tempo com 8 encontros quinzenais (SVG `.draw`), diagnóstico
   no dia 0, plano no encontro 8.
9. **O time** — 4 cards (Gustavo, Eugênio, Luiz, Nick).
10. **Boutique** — "20 a 30 projetos por ano. Só." (escassez) — número grande.
11. **Ato III · Os programas** — abertura.
12. **Empresas tradicionais** — 60 vs 120 dias, preços.
13. **Startups** — 60 vs 120 dias, preços.
14. **US Journey** — US$ 20.000, o que inclui.
15. **Comparativo** `.hz` dos três programas.
16. **Para quem é / para quem não é** (compromisso + filtro).
17. **Próximo passo** — conversa de diagnóstico (30 min) → proposta → início da turma. `.stp`.
18. **Fechamento** — frase forte + chips (Gustavo Marion · Managing Partner RBG / Orlando · Delaware).

## Regras
- Datas absolutas. Ano: 2026. Nunca chame Alexandre de "CEO" (não precisa citar ele).
- Números em `<span class="num">` para count-up quando o JS suportar (veja deck.js).
- Slide muito cheio encolhe pelo auto-fit — prefira menos texto por slide.
- Ao terminar: cheque balanço de tags e faça **um** screenshot headless de 2–3 slides para conferir:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=5500 --window-size=1440,810 --screenshot=s.png "file://$PWD/deploy-aceleracao.html#12"`
  (count-up aparece como 0 no headless — é artefato). Corrija o que vir e pare.
