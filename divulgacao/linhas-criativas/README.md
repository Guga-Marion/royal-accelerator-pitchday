# Linhas criativas · RBG · social media

Pastas organizadas pelo funil (topo · meio · fundo), uma pasta por linha criativa e uma por formato.
Plano completo, calendário e prévias em **rbg-hub.com/plano**. Histórico das versões anteriores em `_fontes/HISTORICO.md`.

```
01-topo/                       CTA: salve, compartilhe e comente a próxima (sem link)
  numeros-brasil-eua/          histórias de um número, Brasil × EUA, com fonte na tela
    carrossel-video/{cinco-anos, custo-dinheiro, imigrante, vontade, florida}/   8 lâminas × 6 s (MP4 + PNG)
    feed/                      quadrados de um dado só (2 milhões · +30 mil · 59 %)
    feed-estatico/             versões PNG
    LEGENDAS.md
  travessias-empresas/         a história de uma empresa brasileira que atravessou
    carrossel-video/{brex, fogo, tractian, oakberry, havaianas, ambev}/
    reels-stories/             versão Reel com o globo (Brex, Fogo de Chão, Tractian)
    LEGENDAS.md
  brasileiros-no-mundo/        a coragem de ir: pessoas
    carrossel-video/{fonseca, marta, santoro}/
    LEGENDAS.md
  livros/carrossel/            um livro por lâmina, capa real
02-meio/                       CTA: comente PITCH · quero estar no Pitch Day de 6 de dezembro
  infografico-frente/feed/     Finanças · Comercial · Liderança (vídeo 4:5)
  corte-com-contexto/reels-stories/   cartela de abertura; o corte vem da edição
03-fundo/                      CTA: conheça os programas de aceleração · link na bio
  banca/                       reels-stories/ (A banca, Em relevo Guga) · feed/ (Em relevo Lúcio, Kamila, Carlos) · feed-estatico/
  pitch-day/                   reels-stories/ (Como funciona o dia, Convite) · carrossel-video/pitch-day-em-numeros/ · evento-antes-durante-depois/
  aceleracao/                  reels-stories/ (Chamada, Fragmentos, O globo) · feed/ (Fragmentos 4:5) · feed-estatico/ (Chamada)
outros/                        reserva e YouTube: tese · manifesto-travessia · sete-frentes · diagnostico · custo-de-esperar · bastidores · youtube
_fontes/                       gabaritos-html/ (estáticos, texto em _copy.js) · fotos/ (CREDITOS.md) · render-linhas.sh
```

## Regras rápidas
- Um formato por pasta: `carrossel-video` (8 MP4 de 6 s + PNG de reserva), `carrossel` (PNG), `feed` (vídeo 4:5 ou 1:1), `feed-estatico` (PNG), `reels-stories` (9:16).
- Fotos de terceiros só nas linhas de topo, com crédito na lâmina (`_fontes/fotos/CREDITOS.md`).
- Data do Pitch Day (6/12/2026) a confirmar: está parametrizada no projeto de motion (`~/dev/rbg-motion`, ver README de lá).

## Produzir
- Motion (carrosséis e vídeos): `~/dev/rbg-motion` — `./render-carrosseis.sh` (topo), `./render-pecas-funil.sh` (meio, fundo, Pitch Day), `./render.sh <id>` (uma peça).
- Estáticos: `_fontes/render-linhas.sh` (texto em `_fontes/gabaritos-html/_copy.js`).
