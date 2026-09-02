# RBG · Diligência Inicial

Substitui o PDF `RBG.Diligencia.pdf` por um formulário web na identidade da RBG, com
recebimento em planilha do Google, documentos no Drive e um painel interno para consulta.

```
diligencia/
├── index.html        formulário (link público para as empresas)
├── painel.html       mini CMS com login (uso interno RBG)
├── config.js         ← o único arquivo que você precisa editar
├── schema.js         os 11 blocos e todos os campos (fonte única)
├── estilo.css        sistema visual do formulário
├── app.js            motor do formulário
├── fonts.css         Cormorant / Inter / JetBrains Mono em base64
├── apps-script.gs    backend — colar no Google Apps Script
└── testar.sh         prova de ponta a ponta do backend
```

## Como funciona hoje — sem servidor nenhum

1. Você manda o link do formulário para a empresa.
2. Ela preenche e clica em enviar. O formulário baixa dois arquivos — um **.json**
   com tudo (inclusive os documentos embutidos) e um **.txt** legível — e abre um
   e-mail já preenchido para `emailDestino`.
3. Ela anexa e envia. Você recebe por e-mail.
4. Você abre o **painel**, arrasta os `.json` das duas empresas para dentro dele e
   vê a ficha completa, os documentos e o comparativo com gráficos.

O painel **não tem login e não precisa de servidor**: ele lê os arquivos no seu
próprio navegador. Nada sobe para lugar nenhum. As empresas ficam guardadas no
navegador entre as visitas (os documentos não — para abri-los, rearraste o `.json`).

## Modo automático — opcional

Se quiser que as respostas caiam sozinhas numa planilha do Google e nos documentos
no Drive, publique o `apps-script.gs`:

1. <https://script.google.com> → **Novo projeto** → cole o `apps-script.gs`.
2. Troque a `SENHA` e confira o `AVISAR`.
3. **Implantar → Nova implantação → App da Web** · *Executar como:* **Eu** ·
   *Quem pode acessar:* **Qualquer pessoa**. Copie a URL (termina em `/exec`).
4. Cole em `config.js` no campo `endpoint`.

Com o endpoint preenchido o formulário envia direto para lá e o plano B acima só
entra se a rede falhar. Para conferir: `./testar.sh "<url>/exec"`.

## Os links

| | |
|---|---|
| Formulário | `…/royal-accelerator-pitchday/diligencia/` |
| Personalizado | `…/diligencia/?e=bruno` · `…/diligencia/?e=daniel` — abre com o nome dele na capa |
| Painel interno | `…/diligencia/painel.html` |

O painel abre direto, sem senha — ele não guarda nada de ninguém, só lê os arquivos
que você arrasta para dentro.

## O que mudou em relação ao PDF

- **Acrescentado:** Profit and Loss de 2025, 2024 e 2023, e Balance Sheet mais recente —
  todos marcados como *assinados*. P&L 2025 e Balance Sheet entram como obrigatórios.
- Sócios viraram lista dinâmica: o formulário não trava em dois, e valida que a soma das
  participações fecha em 100%.
- Assinatura é desenhada na tela e salva como `assinatura.png` na pasta do protocolo.
- Cada envio ganha um protocolo (`RBG-2026-XXXXX`), usado como nome da pasta no Drive.

## Plano B — enquanto o Apps Script não estiver publicado

O formulário está aberto e funcionando. Se o `endpoint` do `config.js` estiver vazio, ou se
o envio falhar por rede, o formulário **não perde nada**: ao clicar em enviar ele baixa dois
arquivos (`RBG-2026-XXXXX.json` com tudo, inclusive os anexos embutidos, e um `.txt`
legível) e abre um e-mail já preenchido para o `emailDestino`. A pessoa só anexa os
arquivos e envia.

É rede de segurança, não substituto: sem o Apps Script publicado, nada entra na planilha
nem aparece no painel.

## Onde as respostas chegam — três lugares

1. **E-mail.** No fim de cada envio o script manda para o `AVISAR` a resposta inteira
   formatada — todas as seções, o quadro societário e os links de cada documento. Mesmo
   que você nunca abra a planilha nem o painel, a resposta completa está na sua caixa.
2. **Painel** (`painel.html`) — a ficha navegável, com status e anotações.
3. **Planilha + Drive** — o registro bruto.

## Como fica organizado

- **Planilha** `RBG · Diligência 2026` — aba `Submissoes` (uma linha por empresa, com o JSON
  completo numa coluna oculta) e aba `Arquivos` (link de cada documento).
- **Drive** `RBG · Diligência 2026 — Documentos` → uma subpasta por protocolo, com os
  documentos nomeados pelo campo de origem.

## Limites e cuidados

- Arquivo até **18 MB** cada (ajustável em `config.js`; o teto do Apps Script fica perto de 50 MB
  por requisição). Acima disso o formulário orienta a mandar por e-mail.
- O rascunho fica no `localStorage` do navegador de quem preenche — **os arquivos não**, por
  serem grandes. Se a pessoa fechar e voltar, precisa reanexar (o formulário avisa qual era).
- A senha do painel é validada no servidor e o token é HMAC com expiração, mas **qualquer um
  com a URL do `/exec` pode tentar logar**. Use uma senha forte e troque depois do processo.
- O `?e=nome` é só cosmético — não é autenticação. Quem tiver o link do formulário pode enviar.

## Manutenção

Todo campo do formulário vem de `schema.js`. Para acrescentar, remover ou reordenar
qualquer pergunta, edite só esse arquivo — o formulário e o painel se ajustam sozinhos,
porque os dois leem o mesmo schema.
