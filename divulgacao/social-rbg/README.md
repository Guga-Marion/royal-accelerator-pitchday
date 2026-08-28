# Social RBG · perfis oficiais

Avatar e capa de cada plataforma, gerados em 2026-08-28 a partir do sistema visual do deck
(`investidores/slides.html`) e do `assets/logo-rbg.png`: navy `#070e22→#21376a`,
dourado `#D4A437 / #F0C44D`, Cormorant Garamond (display), Inter (corpo).
Documentados no capítulo **08 · Social** de `manual-marca.html`.

## Arquivos

| Arquivo | Tamanho | Uso |
|---|---|---|
| `social-avatar-instagram-1080x1080.png` | 1080×1080 | foto de perfil do Instagram |
| `social-avatar-linkedin-1080x1080.png` | 1080×1080 | logo da página / foto de perfil do LinkedIn |
| `social-capa-youtube-2560x1440.png` | 2560×1440 | banner do canal do YouTube |
| `social-capa-linkedin-1584x396.png` | 1584×396 | capa de **perfil pessoal** do LinkedIn |
| `social-capa-linkedin-empresa-1128x191.png` | 1128×191 | capa de **página de empresa** do LinkedIn |

Compartilhados em `src/`: `_social-base.css` (paleta e fundo) · `_emblema.svg` (coroa em anel duplo, vetor).

## Áreas seguras respeitadas

- **Avatar Instagram** — corte circular: todo elemento dentro de um círculo de 900 px de diâmetro.
- **Avatar LinkedIn** — quadrado arredondado: moldura dourada a 64 px da borda.
- **Banner YouTube** — texto e marca só dentro dos **1546×423** centrais, a única faixa visível
  no celular. Os 2560×1440 completos só aparecem em TV.
- **Capas LinkedIn** — esquerda livre (412 px no perfil, 246 px na página de empresa), onde a
  foto/logo sobrepõe a arte.

## Decisões

**Avatar não leva texto.** O perfil do Instagram é exibido a ~110 px e o logo da página do
LinkedIn a ~60 px. O monograma "RBG" foi testado no avatar do LinkedIn e virou borrão —
removido. O emblema da coroa sozinho é o que sobrevive à redução; o nome por extenso fica
nas capas.

**A coroa subiu 9,5 unidades** dentro do anel (`translate(0,-9.5)` no viewBox 100×100).
No vetor original ela ficava baixa — imperceptível quando o emblema é pequeno, desequilibrada
quando ele vira o avatar inteiro. `src/_emblema.svg` é a referência corrigida.

**Frase das capas:** "Empresas precisam de estrutura antes de escala." — a tese da RBG.
Dá pra trocar a frase; não trocar a estrutura da composição.

## Como regenerar / editar

Os HTMLs em `src/` são autocontidos (fontes via Google Fonts, com fallback local).
Editar o HTML e rodar:

```bash
./src/render-social.sh
```

O script renderiza os cinco PNGs no tamanho exato, direto nesta pasta.
