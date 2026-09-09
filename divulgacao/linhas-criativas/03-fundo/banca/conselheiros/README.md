# A banca · a história de cada conselheiro

Uma pasta por cadeira. Cada uma vira **um carrossel de história** (o primeiro post da banca sobre aquela pessoa)
e alimenta o carrossel coletivo do Pitch Day. Linha de **fundo de funil**: quem chega aqui já conhece a RBG e
precisa de um motivo para confiar na banca. CTA: *conheça os programas de aceleração · link na bio*.

```
conselheiros/
  N-slug/
    _fontes/        o que o conselheiro manda: fotos (alta), bio, links, prêmios, prints — tudo cru
    HISTORIA.md     dossiê: fatos com fonte, a virada, o número, a frase; e o roteiro do carrossel
    carrossel/      saída renderizada (PNG/MP4), gerada no ~/dev/rbg-motion
```

Numeração = a mesma dos estáticos `banca-N-*.png` (1 Fernando · 2 Gustavo · 3 Lúcio · 4 Carlos · 5 Alex · 6 Kamila · 7 Giva).

## O formato: um "look" no primeiro slide
1. **Lâmina 1 · o gancho.** Uma imagem que para o dedo (o conselheiro num lugar que conta a história sozinho) e uma
   frase de contraste, sem o nome ainda. Ex.: *"O dono vendeu o clube por US$ 400 milhões. O CFO ficou."*
2. **Lâminas 2–3 · de onde veio.** Origem, formação, o primeiro emprego que importa.
3. **Lâminas 4–5 · a virada.** O convite, a travessia, o momento em que a história muda de escala.
4. **Lâmina 6 · o número.** Um dado só, grande, com fonte na lâmina.
5. **Lâmina 7 · o que essa pessoa olha numa empresa.** A frase-régua da cadeira (liga com "A banca fala").
6. **Lâmina 8 · CTA.** *É para esta banca que você apresenta em 5 de dezembro.* + link na bio.

Regras: foto do conselheiro é dele (pedir alta, horizontal e vertical). Foto de terceiros (estádio, ex-chefe,
marca) só com crédito na lâmina ou fornecida pelo próprio conselheiro; ver `_fontes/fotos/CREDITOS.md` na raiz.
Tudo que for dado público leva fonte na lâmina, como nas linhas de topo. Nada que o conselheiro não tenha validado sai.

## Status
| # | Conselheiro | Cadeira | Dossiê | Fontes recebidas | Carrossel |
|---|---|---|---|---|---|
| 1 | Fernando Alves | Comercial | **pesquisado** · faltam empresas anteriores | — | roteiro rascunhado |
| 2 | Gustavo Marion | Growth & GTM | **pesquisado** · Guga completa | — | roteiro rascunhado |
| 3 | Lúcio Santana | Founder & chairman | **pesquisado** · validar com ele | — | roteiro pronto |
| 4 | Carlos Osorio | Finanças | **pesquisado** · validar com ele | foto no estádio | **renderizado** · 8 lâminas · post #13 (19/09) |
| 5 | Alex Zocche | Processos | só LinkedIn · **precisa dele** | — | esqueleto |
| 6 | Kamila Adamatti | Liderança | **pesquisado** · faltam empresas | — | roteiro rascunhado |
| 7 | Giva Matias | Marketing | @givamatias1 · Promove Digital · **precisa dele** | — | esqueleto |

## Produzir
Dados em `~/dev/rbg-motion/src/banca-carrossel.ts` (um objeto por conselheiro: `id`, `pasta`, `nome`, `cargo`, `hookCut`, 8 `slides`), componente `src/comps/BancaLamina.tsx`
(gramática do carrossel das Travessias + o "look" da lâmina 1: foto inteira no alto, pessoa recortada com `./matte` saindo do quadro, palavra-gancho passando por trás).
`./render-banca.sh <id>` renderiza as 8 lâminas e copia MP4 + PNG para `N-slug/carrossel/`. Stills de conferência: `npx remotion still src/index.ts Banca-<id>-01 out/chk/x.png --frame=179`.
Foto do conselheiro: upscale com `ffmpeg -vf "scale=2048:-1:flags=lanczos,unsharp=5:5:0.6:5:5:0"` se vier pequena, depois `./matte foto.jpg foto-cut.png`.

Depois dos sete: `carrossel-pitch-day/` (a banca inteira, uma lâmina por cadeira, reaproveitando a lâmina 1 de cada história).
