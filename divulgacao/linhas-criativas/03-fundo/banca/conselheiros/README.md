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
6. **Lâmina 8 · CTA.** *É para esta banca que você apresenta em 6 de dezembro.* + link na bio.

Regras: foto do conselheiro é dele (pedir alta, horizontal e vertical). Foto de terceiros (estádio, ex-chefe,
marca) só com crédito na lâmina ou fornecida pelo próprio conselheiro; ver `_fontes/fotos/CREDITOS.md` na raiz.
Tudo que for dado público leva fonte na lâmina, como nas linhas de topo. Nada que o conselheiro não tenha validado sai.

## Status
| # | Conselheiro | Cadeira | Dossiê | Fontes recebidas | Carrossel |
|---|---|---|---|---|---|
| 1 | Fernando Alves | Comercial | gabarito | — | — |
| 2 | Gustavo Marion | Growth & GTM | gabarito | — | — |
| 3 | Lúcio Santana | Founder & chairman | gabarito | — | — |
| 4 | Carlos Osorio | Finanças | **pesquisado · validar com ele** | — | roteiro pronto |
| 5 | Alex Zocche | Processos | gabarito | — | — |
| 6 | Kamila Adamatti | Liderança | gabarito | — | — |
| 7 | Giva | Marketing | gabarito | — | — |

Depois dos sete: `carrossel-pitch-day/` (a banca inteira, uma lâmina por cadeira, reaproveitando a lâmina 1 de cada história).
