# Revisão v2 · deck comercial da Deploy

Feedback do usuário (3 mensagens de áudio, 2026-09-02). O princípio que manda em tudo:
**é uma apresentação de vendas.** A pessoa precisa terminar dizendo "beleza, vou comprar".
Sem confusão. Em cada formato tem que ficar óbvio: **o que eu ganho · quando ganho · quando
começa · quando acaba · o que eu vou ter · como funciona · roadmap.** Direto, claro, bonito.

Fonte da verdade continua sendo `BRIEF.md` (identidade, arquivos, regras). Este arquivo
sobrescreve o storyline.

## Correção de conceito (o erro do v1)
O v1 apresentava "8 encontros quinzenais" como se fosse o programa único. **Não é.** São dois
formatos e a jornada muda:
- **Sprint · 60 dias · 4 encontros** (tradicionais US$ 4.000 · startups US$ 4.200)
- **Aceleração · 120 dias · 8 encontros + Demo Day** (tradicionais US$ 7.500 · startups US$ 7.500)
- **US Journey · a partir de US$ 10.000** (jornada própria: Brasil → EUA)
Só fale de "8 encontros" dentro do contexto da Aceleração. Cada formato tem o seu roadmap.

## Insumos novos (nesta pasta)
- `logos/` — **logos reais** baixados da internet: `newbalance.svg`, `kipling.svg`, `northface.svg`,
  `coach.svg`, `sephora.svg`, `estapar.svg`, `rossi-white.svg` (paths brancos — vira escuro com o
  filtro), `uniconstrutora.png`, `petropolis.png` (Águas Petrópolis Paulista), `mssaude.png` (se
  existir e for válido; senão MS Saúde fica como wordmark tipográfico e você avisa no relatório).
  Embuta como **data URI base64** dentro de `<img>` (CSP bloqueia URL externa). Todos com o
  **mesmo tamanho visual**: caixa fixa (ex.: 200×72 px em unidades do deck), `object-fit:contain`,
  e tratamento monocromático uniforme via CSS `filter: brightness(0) opacity(.72)` (fica navy
  sobre papel) — assim logos coloridos e brancos ficam iguais. Verifique no screenshot que
  nenhum virou um bloco preto (PNG com fundo branco sólido precisaria de `mix-blend-mode:
  multiply` em vez do filtro).
- `rbg-img1.jpg … rbg-img7.jpg` — as 7 fotos do deck da RBG (Orlando, hub, negócios). **Olhe as
  7** e use como `.bg` + `.veil` nas capas de ato e no `k-split` de vários slides. O usuário
  pediu "mais imagens, em tudo". Embuta em `:root{--img1..}` como o deck da RBG (`_imgs.css`
  já tem isso pronto — pode colar direto no `<style>`).
- `painel-acelerada.png` — screenshot real do sistema da empresa acelerada (1440×900). Reduza
  para ~1100 px de largura e JPEG q≈80 antes de embutir (Python `PIL` está disponível). Mostre
  dentro de uma moldura de "janela" (barra com 3 bolinhas), levemente inclinada ou com sombra.

## Storyline v2 (≈23 slides)

1. **Capa** — igual, mas com foto de fundo (`.bg` + `.veil`). Os três `.ask`: **60 ou 120 dias ·
   7 frentes · 20–30 vagas/ano**. (Atenção: são **7 frentes** agora, não 6 — ver slide 8.)
2. **Ato I · O problema** — foto de fundo. "Faturar não é o mesmo que crescer."
3. **O dono virou o gargalo** — `k-split` com foto. Manter os 3 sintomas → 3 consequências.
4. **O custo de esperar — REESCREVER com storytelling.** Duas empresas, mesma cidade, mesmo
   faturamento, mesmo mês (setembro de 2026). Uma "espera o momento certo"; a outra entra numa
   trilha de 120 dias. Mostre os dois caminhos lado a lado em uma linha do tempo de 12 meses
   (SVG `.draw`): dia 0 → dia 120 → mês 12. Na que espera: mesmo caixa, mesmo dono-gargalo, mesma
   empresa que ninguém compra. Na que estrutura: margem conhecida, primeiro escalão, plano de GTM
   rodando, Demo Day com a banca da RBG. Gatilho: **aversão à perda** ("o que você não faz em
   120 dias custa 12 meses"). Foto lateral. Nada de estatística inventada — só consequências
   concretas e qualitativas.
5. **Ato II · A solução** — foto. "O mesmo método que a RBG usa para decidir onde investir."
6. **Quem é a Deploy + diagrama** — **acrescentar uma seta nova** no SVG: da Deploy (aceleração
   120 dias) sai uma seta para um nó **"Demo Day · banca da RBG"**, e desse nó uma seta para
   **"Investimento · capital ou smart money"** que entra no mesmo bloco das investidas. Legenda:
   *"Quem passa pela aceleração da Deploy também apresenta para os conselheiros da RBG — e pode
   ser investido."* Não chame de Pitch Day.
7. **Quem já construiu com a gente** — parede com os **logos reais** (ver insumos).
8. **Sete frentes. Uma empresa inteira.** — Finanças · Comercial · Tecnologia & IA · Liderança ·
   Processos · Marketing & redes sociais · Growth & Go-to-Market. Grid 7 (4+3) com ícone
   simples em SVG e quem conduz (Eugênio / — / Luiz / — / — / — / Gustavo; as sem nome ficam "time
   Deploy"). Eyebrow: "as mesmas frentes que os conselheiros da RBG usam".
9. **O que você compra — NOVO.** Três colunas `.hz` (dourado / dourado profundo / azul exit):
   - **Empresas tradicionais** → foco em **caixa e distribuição de dividendos**. "Empresa que dá
     lucro previsível e paga o dono."
   - **Startups e empresas de tecnologia** → foco em **exit e M&A**. "Empresa que fica investível
     e pronta para ser comprada."
   - **US Journey** → **do Brasil para os Estados Unidos**. "Empresa que atravessa com estrutura,
     rede e mercado." *A partir de US$ 10.000.*
   Rodapé: "Mesmo método, mesmo time, mesmo sistema. Muda o objetivo — e a trilha segue o objetivo."
10. **Dois formatos — NOVO, o slide mais importante do deck.** Tabela/`.g2` Sprint × Aceleração,
    linhas fixas e curtas, todas respondidas:
    | | **Sprint · 60 dias** | **Aceleração · 120 dias** |
    | O que você ganha | 1 ou 2 frentes destravadas com plano de ação | a empresa inteira estruturada nas 7 frentes + Demo Day |
    | Encontros | **4** (quinzenais) | **8** (quinzenais) **+ Demo Day** |
    | Começa | kick-off **2 dias depois do pagamento** | idem |
    | Termina | **dia 60** · entrega do plano de ação | **dia 120** · Demo Day com a banca da RBG |
    | O que você tem | time Deploy entre os encontros · sistema da acelerada · materiais | idem + banca da RBG + possibilidade de investimento |
    | Para quem | precisa destravar algo específico agora | quer a empresa estruturada e investível |
    | Investimento | US$ 4.000 (tradicional) · US$ 4.200 (startup) | **US$ 7.500** |
    Badge "Mais escolhido" na Aceleração. Rodapé: "O Sprint resolve um gargalo. A Aceleração
    estrutura a empresa — e abre a porta da RBG."
11. **Roadmap da Aceleração · 120 dias** — linha do tempo SVG (`.draw`) com os 8 encontros
    quinzenais **nesta ordem**, cada um com quem conduz e o entregável:
    - Dia 0 · **Kick-off** (2 dias após o pagamento) — acesso ao sistema, metas e linha de base
    - **1 · Diagnóstico** (dia 0–15) — raio-x das 7 frentes · time Deploy
    - **2 · Finanças** — DRE, margem, caixa · Eugênio
    - **3 · Comercial** — funil, oferta, precificação · time Deploy
    - **4 · Tecnologia & IA** — stack, automações, IA no dia a dia · Luiz
    - **5 · Liderança** — primeiro escalão, delegação · time Deploy
    - **6 · Processos** — rotina, indicadores, governança · time Deploy
    - **7 · Marketing & redes sociais** — posicionamento, conteúdo, canais · time Deploy
    - **8 · Growth & Go-to-Market** — plano de crescimento + **preparação para o Demo Day** · Gustavo
    - **Demo Day · dia 120** — apresentação ao vivo para a banca da RBG (marcador diferente,
      dourado-hi, com a coroa/marca da RBG — é da RBG, não da Deploy)
    Nada de "plano de 12 meses". O que fecha a trilha é o **Demo Day**.
12. **Roadmap do Sprint · 60 dias** — 4 encontros quinzenais: **1 · Diagnóstico e escolha das
    frentes** (dia 0–15) → **2 e 3 · Execução nas frentes escolhidas** (dias 30 e 45) → **4 · Entrega
    do plano de ação** (dia 60). Entre encontros: time Deploy por WhatsApp/sistema. Nota: "Quer
    seguir para a Aceleração? O Sprint vira crédito na conversa." *(⚠ regra de crédito é proposta
    minha — deixe como frase de rodapé fácil de tirar e avise no relatório.)*
13. **Demo Day — NOVO.** "Não é um Pitch Day. É a sua empresa na frente de quem investe." Ao vivo,
    **online ou presencial em Orlando** (data conforme disponibilidade da banca). **Banca:** Lúcio
    Santana (founder & chairman), Carlos Osorio (finanças), Fernando Alves (comercial), Kamila
    Adamatti (liderança), Alex Zocche (processos), Giva (marketing) e Gustavo Marion (growth &
    GTM). Objetivo: a RBG decidir se **entra como sócia — com capital ou com smart money**.
    Chips com os nomes; eyebrow "Exclusivo da Aceleração · 120 dias".
14. **O sistema — NOVO.** Screenshot do painel da acelerada. Título: "O mesmo sistema de quem
    foi selecionado no Pitch Day." Texto: trilha, encontros, tarefas, métricas, materiais e o seu
    time — login e senha chegam por e-mail **na hora do pagamento**. "Só mudam os encontros e
    quem conduz. O sistema é o mesmo."
15. **O time** — 4 cards (Gustavo · Nick, Sócio & COO · Eugênio · Luiz), com foto de fundo suave.
16. **20 a 30 projetos por ano. Só.** — manter.
17. **Ato III · Os programas** — foto.
18. **Empresas tradicionais — REESCREVER.** Título com gatilho: *"Caixa previsível. Dividendo no
    bolso."* Sub: "Para quem já fatura e quer que a empresa pague o dono todo mês — sem depender
    dele para tudo." 3 ganhos concretos (margem conhecida · primeiro escalão que decide · rotina
    que roda sem você) + os dois formatos com preço (Sprint US$ 4.000 · Aceleração US$ 7.500).
    Setores no `.mk`: serviços · varejo · construção · saúde.
19. **Startups** — *"Investível. Vendável."* Foco em exit e M&A: tração, métricas, produto,
    narrativa de investimento, preparação para o Demo Day. Sprint US$ 4.200 · Aceleração US$ 7.500.
20. **US Journey** — *"Do Brasil para os Estados Unidos, com estrutura."* Entidade nos EUA com
    parceiros, plano de mercado, rede e introduções em Orlando, go-to-market americano,
    acompanhamento. **A partir de US$ 10.000** (substitui o placeholder — use
    `data-price="us-journey"` mantido no span, com o texto "a partir de US$ 10.000").
21. **Comparativo** `.hz` — atualizar US Journey para "a partir de US$ 10.000".
22. **Para quem é / para quem não é** — manter, enxugar.
23. **Como fechar — REESCREVER, passo a passo real.** `.stp` com 6 passos:
    1. **Você dá o OK** (nesta conversa)
    2. **Recebe o link de pagamento** — Stripe (cartão) ou Zelle. O termo de uso está no link;
       **não tem contrato para assinar**
    3. **Paga a primeira parcela**
    4. **Na mesma hora:** e-mail de boas-vindas com **login e senha** do sistema da aceleração
    5. **Kick-off em 2 dias** — primeira reunião, metas e linha de base
    6. **Dia 60 ou dia 120:** entrega do plano (Sprint) ou **Demo Day com a banca da RBG** (Aceleração)
    Rodapé: "Do OK ao kick-off: 48 horas."
24. **Fechamento** — foto. Frase forte + chips. CTA: "Qual formato faz sentido para você?"

## Regras de clareza
- Cada slide responde uma pergunta só. Título = a resposta.
- Números sempre com unidade e data: "dia 60", "2 dias após o pagamento", "US$ 7.500".
- Onde houver "8 encontros", diga "Aceleração · 120 dias" no mesmo bloco.
- Frases curtas. Nada de parágrafo com mais de 2 linhas.
- Mantenha a identidade da RBG e os componentes existentes; novos com prefixo `dp-`.

## Ao terminar
Rebuild com `build.py`, balanço de tags, screenshots dos slides **4, 6, 7, 10, 11, 13, 14 e 23**,
corrija o que estiver quebrado (logo virando bloco preto, texto SVG cortado, slide encolhido
demais) e pare. Relatório: lista de slides, o que ficou como proposta minha (crédito do Sprint,
estrutura do Sprint, entregáveis do US Journey), logos que não vieram.
