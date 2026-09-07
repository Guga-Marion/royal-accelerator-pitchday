# Assinatura "Lousa" · infográfico da frente

A linha de meio de funil que **ensina**: uma métrica, um framework, um conceito ou uma estratégia por carrossel, só infográfico,
sem foto, com fonte na lâmina. A assinatura foi definida com as skills de motion instaladas
(`motion-art-direction`, `animated-infographic`, `chart-animation`, `diagram-animation`, `kinetic-typography`, `animation-principles`)
e vive em código no projeto `~/dev/rbg-motion` (`src/infografico/viz.tsx`, `src/comps/FrenteLamina.tsx`, texto em `src/frentes-carrossel.ts`).

## Os cinco gestos (o que só a RBG faz)

| Gesto | O que é | Onde está no código |
|---|---|---|
| **A lousa** | Navy com grade fina de pontos e linhas douradas a 10 %, que nasce de cima para baixo em 1,1 s. É a superfície de aula. | `Lousa` |
| **O fio dourado** | Uma única linha (`#F0C44D`, 1,5–3 px) desenha todo diagrama: eixos, conectores, anéis, régua, fio-guia do callout. É o mesmo traço do gráfico do emblema. | `Draw` (stroke-dashoffset, `pathLength=1`) |
| **Blocos extrudados** | Barras em 2.5D (frente, topo, lateral; profundidade 16 × 11 px) que crescem da base. Dourado = o herói da lâmina; azul-acinzentado = contexto; tracejado = o que falta. | `Block` |
| **Números que assentam** | Todo valor conta de zero com desaceleração (`cubic-bezier(.4,0,.2,1)`), algarismos tabulares, formato pt-BR (`US$ 1.000.000`, `15 %`, `16 ×`). O total ganha **callout**: pílula dourada com fio-guia até o ponto. | `fmt`, `Callout` |
| **O fio da próxima lâmina** | No lugar de "arraste →", cada lâmina termina com a isca da seguinte, em mono dourado pulsando: *"e do EBITDA até o bolso do dono? →"*. É o que faz querer ler a próxima. | `fio` em cada slide |

Personalidade de movimento: **Premium** (sem overshoot, sem bounce). Tempo base 0,3 s; entradas 0,9 s; stagger de 9 frames (0,3 s) entre irmãos;
o diagrama começa a nascer em 1,5 s (frame 46), depois do título; o quadro final fica parado ≥ 1,5 s. Título palavra a palavra, **uma** palavra em itálico dourado.

## A estrutura de aula (8 lâminas, sempre)

1. **Gancho** — a frase que para o dedo, sobre o diagrama-fantasma que você vai aprender (o mesmo desenho, a 34 %).
2. **A dor** — a cena que o dono reconhece, com a conta que ele não sabe fazer (`?` piscando).
3. **O framework** — o conceito nomeado, com autor, ano e fonte na lâmina.
4. **O exemplo com números** — uma empresa de brasileiro em Orlando; o diagrama principal (cascata, régua, matriz, árvore…).
5. **O contraste** — o mesmo diagrama com o erro clássico (Empresa B, S4 em vez de S2, retenção de 3 meses).
6. **A regra** — o número ou a ordem que resolve (0,7; 3 : 1; três R; 90 dias; 30 minutos).
7. **A lição** — "Esta semana": três checks desenhados, o dever de casa.
8. **CTA** — Pitch Day de 6 de dezembro, comente PITCH.

Cada título puxa o anterior (Empresa A → "e do EBITDA até o bolso?" → Empresa B → "então, para que serve cada número?") e cada `fio` abre o próximo.

## Vocabulário de diagramas (em `viz.tsx`)

`waterfall` cascata (Receita → EBITDA → lucro) · `bars` blocos com resultado ou linha de regra · `pairs` A × B · `range` régua com zona (ZOPA) ·
`matrix` 2 × 2 com seta de erro (Liderança Situacional) · `rings` anéis de dentro para fora (Golden Circle) · `tree` objetivo → resultados-chave (OKR) ·
`cards` cartões de framework com fio entre eles · `calc` linhas que somam · `checklist` dever de casa · `pictogram` 6 de 10 · `timeline` fases (90 dias, semana de OKR) ·
`formula` fichas e operadores · `cycle` o ciclo que recomeça (ponto dourado que nunca para).

## Formatos

- `carrossel-video/` — 8 lâminas 1080 × 1350, 6 s cada (MP4 + PNG do último frame).
- `feed/` — o carrossel inteiro em um vídeo 4:5 de 44 s (`infografico-<frente>-feed-1080x1350.mp4`), com fade entre lâminas e "a seguir:" no fio.
- Reels 9:16: mesma lâmina com `height 1920` (a fazer: registrar `FrenteLamina` com `fmt: 'reel'`).

## Produzir e verificar

```bash
cd ~/dev/rbg-motion
./chk.sh financas-04 comercial-05 lideranca-04     # stills do último frame + folha de contato em out/chk/
FRAME=84 ./chk.sh financas-04                        # um frame no meio da animação
./render-frentes.sh                                  # tudo (≈ 30 min) → copia MP4/PNG para estas pastas
./render-frentes.sh growth                           # só uma frente
```

Fontes citadas nas lâminas: Investopedia · CFA Institute (EBITDA); Fisher & Ury, *Getting to Yes* (1981); McKinsey Global Institute, *A future that works* (2017);
Hersey & Blanchard, *Management of Organizational Behavior* (1969); Doerr, *Measure What Matters* (2018) · Grove; Google re:Work (0,7); Sinek, TEDx Puget Sound (2009);
Hanlon, *Primal Branding* (2006); David Skok, forentrepreneurs.com (3 : 1, payback < 12 meses). Cenários com "US$" são ilustrativos e assinados "Cenário ilustrativo · RBG".
