# Divulgação · Pitch Day 2ª Edição · 29–30 ago 2026 · Orlando, FL

Artes geradas em 2026-08-28 a partir do sistema visual do deck (`investidores/slides.html`):
navy `#08132B`, dourado `#C2922A→#F0C44D`, Cormorant Garamond (display), Inter (corpo),
JetBrains Mono (eyebrows). Foto: `assets/conselho-pitch-day.jpg`.

## Arquivos

| Arquivo | Formato | Uso |
|---|---|---|
| `rbg-pitch-day-2-principal-1920x1080.png` | 1920×1080 | arte principal (telão, YouTube, LinkedIn) |
| `rbg-pitch-day-2-10-empresas-1920x1080.png` | 1920×1080 | variação "10 empresas na disputa" |
| `rbg-pitch-day-2-feed-1080x1350.png` | 1080×1350 | feed Instagram (retrato) |
| `rbg-pitch-day-2-quadrada-1080x1080.png` | 1080×1080 | feed quadrado |
| `rbg-pitch-day-2-story-1080x1920.png` | 1080×1920 | story / reels |
| `conselheiros/rbg-pd2-conselheiro-*.png` | 1080×1350 | um card por conselheiro |

## Ordem da foto (confirmada pelo usuário em 2026-08-28)

Esquerda→direita: 1 Fernando Alves · 2 Gustavo Marion · 3 Lúcio Santana ·
4 Carlos Osorio · 5 Alex Zocche · 6 Kamila Adamatti.

## Como regenerar / editar

Os HTMLs em `src/` são autocontidos (fontes embutidas em `fonts.css`). Editar o HTML e:

```bash
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1920,1080 --screenshot=saida.png "file://$PWD/src/principal-1920x1080.html"
```

(usar o `--window-size` do formato correspondente: 1080,1350 · 1080,1080 · 1080,1920)

`src/` também contém `logo-rbg-transp.png` (logo com fundo transparente, gerado do
`assets/logo-rbg.png`) e `crop-1..6.jpg` (recortes individuais da foto do conselho em
1200×1500) — insumos para o futuro manual de identidade visual.
