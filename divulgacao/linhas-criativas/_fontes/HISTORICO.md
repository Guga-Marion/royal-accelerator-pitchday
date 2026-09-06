# Linhas criativas · Instagram e YouTube · 2026

Nove linhas de conteúdo sobre o sistema visual do manual da marca (`manual-marca.html`, capítulos 01–09).
Geradas em 2026-09-06. Cadência prevista: **um post por dia, vídeo a cada três dias**.

## As linhas

| # | Linha | Papel | Formatos | Gabarito |
|---|---|---|---|---|
| 01 | **Tese** | posicionamento · sem foto, só tipografia | quadrado 1080×1080 · story 1080×1920 | `tese-quadrado.html?v=N` · `tese-story.html?v=N` |
| 02 | **A travessia** | narrativa do site em 5 etapas | carrossel 4:5 (capa + 5 + CTA) | `travessia.html?s=0..6` |
| 03 | **Sete frentes** | educação · o método | carrossel 4:5 (capa + 7 + CTA) | `frentes.html?n=0..8` |
| 04 | **A banca fala** | autoridade · retrato + frase | 4:5 | `banca.html?c=1..6` |
| 05 | **O número** | prova · um dado por peça | quadrado | `numero.html?n=1..6` |
| 06 | **O custo de esperar** | urgência · Empresa A × B | 4:5 | `custo.html` |
| 07 | **Hub & bastidores** | prova social · foto com véu | quadrado · 4:5 | `bastidores-quadrado.html?v=1` · `bastidores-feed.html?v=2` |
| 08 | **Chamada** | conversão · CTA direto | story · quadrado | `chamada-story.html` · `chamada-quadrado.html` |
| 09 | **Vídeo** | cortes e episódios | thumbnail 1280×720 · cartela 1920×1080 · Reels (cap. 09) | `yt-thumb.html?v=1..3` · `yt-cartela.html` |

## Como editar

- **Texto:** tudo em `src/_copy.js`. Os gabaritos só desenham; troque a frase lá e renderize de novo.
- **Estilo compartilhado:** `src/_base.css` (tokens do manual) e `src/_rbg.js` (lockup, rota da travessia, parâmetros da URL).
- **Fontes:** embutidas via `../pitch-day-2/src/fonts.css` — renderiza sem internet.
- **Renderizar:** `./render-linhas.sh` (tudo) ou `./render-linhas.sh banca` (só o que tiver "banca" no nome). Os PNGs caem nas pastas `01-tese/` … `09-video/`.

## Regras que as peças seguem

- Uma ideia por peça; o destaque em itálico dourado (`<em>`) é **uma palavra ou expressão**, nunca a frase inteira.
- Foto nunca crua: véu navy (cap. 05); texto só na zona escura.
- Moldura dourada a 34 px nas peças estáticas; **régua dos horizontes** (10 px) só nas peças de vídeo.
- Algarismos alinhados (`lnum`) em títulos e números — na Cormorant os algarismos antigos transformam "120" em "I2o".
- Story: nada importante nos 200 px do topo nem nos 280 px de baixo. Reels/TikTok: zonas do capítulo 09.
- Avatar e capas dos perfis continuam em `divulgacao/social-rbg/`; reels em `divulgacao/cortes/`.

## Atenção

As frases da linha **A banca fala** (`RBG.banca[].q`) são **propostas de copy** escritas a partir do site — precisam ser
validadas com cada conselheiro antes de publicar com o nome dele. O mesmo vale para os hooks dos thumbnails.

## Em movimento (`motion/`)

MP4s renderizados com Remotion a partir do projeto `~/dev/rbg-motion` (fora do iCloud; ver o README de lá).
Mesmas linhas, com tempo: a frase entra palavra a palavra, a palavra dourada recebe o brilho por último,
faíscas douradas sobem devagar (o gesto do herói do site), a rota do emblema se desenha.

| Arquivo | Uso |
|---|---|
| `vinheta-rbg-1920x1080.mp4` | abertura/fechamento de vídeo no YouTube (2,7 s) |
| `tese-01-reel-1080x1920.mp4` | Reel da Tese 01 (7 s, loop) |
| `tese-02-feed-1080x1350.mp4` | **lâmina de vídeo para carrossel** — 1ª lâmina em movimento, as seguintes estáticas |
| `travessia-reel-1080x1920.mp4` · `travessia-feed-1080x1350.mp4` | a rota com o ponto percorrendo as 5 etapas (16,7 s) |
| `numero-120-quadrado-1080x1080.mp4` | contagem 0 → 120 (5,5 s) |
| `sete-frentes-feed-1080x1350.mp4` | os sete quadrados acendendo (11 s) |
| `banca-lucio-feed-1080x1350.mp4` | retrato com zoom lento + frase (7 s) — **frase a validar com o Lúcio** |

Para mudar texto ou criar peça nova: `~/dev/rbg-motion/src/copy.ts` e `src/Root.tsx`, depois `./render.sh`.

## Linhas visuais · fotos + motion (`motion/`)

Três linhas novas, mais visuais, para gerar curiosidade sobre o Pitch Day e a aceleração:

| Linha | Arquivos | O gesto |
|---|---|---|
| **Em relevo** | `relevo-guga-reel-1080x1920.mp4` · `relevo-lucio-feed-1080x1350.mp4` | palavras gigantes passando por trás da pessoa, com profundidade (recorte pelo Vision do macOS) |
| **Fragmentos** | `fragmentos-reel-1080x1920.mp4` · `fragmentos-feed-1080x1350.mp4` | mosaico de fotos com cortinas e fios dourados que colapsa no palco do Pitch Day |
| **O globo** | `globo-reel-1080x1920.mp4` | esfera de pontos, arco São Paulo → Orlando, janela circular com a banca |

Fonte: `~/dev/rbg-motion` (`src/comps/Relevo.tsx`, `Fragmentos.tsx`, `Globo.tsx`). Para trocar a pessoa do Em relevo, gerar o recorte com `./matte` e registrar em `src/Root.tsx`.

## Planejamento por funil (2026-09-06, tarde) · `motion/` + `10-livros/` + `11-diagnostico/`

Nove linhas organizadas em topo, meio e fundo de funil — apresentação completa (ciclo de 9 dias, pautas, fontes e prévias)
no artefato "Planejamento de Social RBG". Ciclo: 4 peças de topo · 3 de meio · 2 de fundo a cada 9 dias; vídeo a cada 3.

| Funil | Linha | Arquivos |
|---|---|---|
| Topo · descoberta | **Travessias** (globo + linha do tempo + número + lição, com fonte) | `historia-brex-reel`, `historia-fogo-reel`, `historia-tractian-reel` |
| Topo | **O número com fonte** | `numero-brasileiros-quadrado`, `numero-empresas-fl-quadrado`, `numero-diaspora-quadrado` |
| Topo | **O que o livro diz** (carrossel, capa tipográfica) | `10-livros/livro-00..07` · gabarito `src/livro.html?n=` |
| Meio · educação | **Infográfico da frente** (Finanças, Comercial, Liderança) | `info-financas-feed`, `info-comercial-feed`, `info-lideranca-feed` |
| Meio | **Diagnóstico em 5 perguntas** (carrossel) | `11-diagnostico/diagnostico-00..06` · gabarito `src/diagnostico.html?n=` |
| Meio | **Corte com contexto** (cartela de 3 s + moldura do Reels) | `corte-abertura-reel` — o editor troca o frame pelo corte |
| Fundo · conversão | **A banca** (seis recortes + "Sete pareceres") | `banca-reel` |
| Fundo | **Como funciona o dia** (linha do tempo + scorecard) | `pitchday-dia-reel` |
| Fundo | **Convite** (palco + Pitch Day + passos + botão) | `convite-reel` |

Fontes usadas nas peças de topo: Y Combinator e CNBC (Brex); Bain Capital e Dallas News (Fogo de Chão); Bloomberg Línea e Brazil Journal (Tractian);
Wellhub (Série F 2023); Colossus (3G Capital); Endeavor Brasil 2025 (diáspora); Itamaraty × Migration Policy Institute (brasileiros nos EUA).
Histórias de terceiros são contadas só em gráfico, sem foto. Capas de livro são tipográficas.

## Plano de social media (v3 · 2026-09-06)

Cadência definida pelo Gustavo: **três posts por semana** — terça (topo), quinta (meio), sábado (fundo) — e não um por dia.
Lançamento em **15/09/2026** com o vídeo mãe no YouTube; teasers em 10 e 12/09; episódios do YouTube a cada duas quintas.
O plano completo (marca, objetivos por fase, funil, ritmo, calendário até 07/11, linhas, fontes) está publicado em
**rbg-hub.com/plano** (fonte em `~/dev/rbg-app/public/plano/`) e no artefato "Plano de Social Media RBG".

## v4 (2026-09-06, noite) · fotos dos casos, base Brasil × EUA, calendário em grade

- `fontes-fotos/` — fotos de apoio baixadas com licença (Wikimedia Commons CC, kit de imprensa da Brex, capas via Open Library); créditos em `fontes-fotos/CREDITOS.md`. Usar só em peça editorial, com crédito.
- Travessias agora levam a foto do caso na fase dos marcos (`foto`, `credito` em `src/Root.tsx` do motion). Carrossel de livros com a capa real (`src/capas/`).
- Plano v4 em rbg-hub.com/plano: calendário em grade mensal com o tipo de post, matriz das nove linhas (formato flexível: Reel, vídeo no feed ou carrossel com lâmina em motion), base de conhecimento com 11 dados Brasil × EUA e fonte, guia "como usar" para quem gerencia.

## Travessias · carrossel em vídeo (2026-09-06, noite) · `12-travessias-carrossel/`

Cada história virou um carrossel de 8 lâminas, e cada lâmina é um vídeo de 6 s (1080×1350) com PNG do último frame como reserva.
Estrutura fixa: gancho · origem · primeiro sucesso · a travessia · o problema do outro lado · a virada · a lição · convite (CTA "comente RBG" + link na bio).
Roteiros em `~/dev/rbg-motion/src/travessias.ts`; composição `src/comps/Lamina.tsx`; render com `./render-travessias.sh`.
Legendas dos posts em `12-travessias-carrossel/LEGENDAS.md`. Fotos com crédito na própria lâmina (ver `fontes-fotos/CREDITOS.md`).

## Histórias com números · carrossel em vídeo (2026-09-06, noite) · `13-numeros-carrossel/`

Linha de topo que junta O número e o infográfico de dados: três carrosséis de 8 lâminas em vídeo (Brasil × EUA · O imigrante que empreende · O Pitch Day em números),
um dado por lâmina com barras, dois números ou número gigante em contagem, fonte na tela, loop aberto e CTA "comente RBG". Dados em `~/dev/rbg-motion/src/numeros-carrossel.ts`,
composição `src/comps/DadoLamina.tsx`, render `render-numeros.sh` (que também gera Oakberry, Havaianas e Em relevo Kamila/Carlos). Legendas em `13-numeros-carrossel/LEGENDAS.md`.
Travessias novas: Oakberry e Havaianas em `12-travessias-carrossel/`. Calendário do plano estendido até 12/12.

## v6 final (2026-09-06, noite) · CTAs por etapa, Brasileiros no mundo, Ambev, linha Pitch Day

- **CTAs por etapa** (parametrizados em `~/dev/rbg-motion/src/travessias.ts`): topo = "salve, compartilhe e comente o nome da próxima"; meio = "comente PITCH · quero estar no Pitch Day de 6 de dezembro"; fundo = "conheça os programas de aceleração · link na bio"; Pitch Day = "inscreva-se · 6 de dezembro".
- **Topo com 4 linhas:** Histórias com números, Travessias (empresas: + Ambev → AB InBev), **Brasileiros no mundo** (`14-brasileiros-no-mundo/`: João Fonseca, Marta, Rodrigo Santoro) e Livros.
- **Linha Pitch Day** (`15-pitch-day/`, `src/comps/PitchDayLinha.tsx`): inscrições (feed e Reel), contagem 30 · 15 · 7 · 1, selecionados (template), obrigado. Data 6/12/2026 a confirmar — trocar em `travessias.ts` (CTA_MEIO/CTA_PITCHDAY), `PitchDayLinha.tsx`, `Convite.tsx`, `PitchDayDia.tsx`, `numeros-carrossel.ts`.
- Plano v6 final em rbg-hub.com/plano com os carrosséis em **autoplay** (prévias leves em `public/plano/video/`), calendário até 31/12 com os posts do Pitch Day.
