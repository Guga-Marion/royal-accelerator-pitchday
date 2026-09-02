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
└── apps-script.gs    backend — colar no Google Apps Script
```

## Setup — uma vez, ~3 minutos

**1. Criar o script**
1. Abra <https://script.google.com> → **Novo projeto**.
2. Apague o conteúdo do `Código.gs` e cole o `apps-script.gs` inteiro.
3. No bloco `CONFIG` no topo, troque **`SENHA`** e **`SEGREDO`**. Confira o `AVISAR`
   (e-mail que recebe o aviso a cada envio).
4. Salve.

**2. Autorizar e criar planilha + pasta**
1. No seletor de função, escolha **`preparar`** e clique em **Executar**.
2. O Google vai pedir autorização — aceite (é a sua própria conta escrevendo na sua Drive).
3. Abra **Ver → Registro de execução**. Ele imprime a URL da planilha, a URL da pasta e os
   dois IDs. Cole os IDs em `PLANILHA_ID` e `PASTA_ID` no `CONFIG` e salve.

**3. Publicar**
1. **Implantar → Nova implantação** → tipo **App da Web**.
2. *Executar como:* **Eu**. *Quem pode acessar:* **Qualquer pessoa**.
   (Isso é obrigatório — é o que permite Bruno e Daniel enviarem sem login Google.)
3. Copie a URL gerada (termina em `/exec`).

**4. Ligar o front**
Cole a URL em `diligencia/config.js`:
```js
window.RBG_CONFIG = {
  endpoint: "https://script.google.com/macros/s/AKfyc.../exec",
  ...
};
```
Commit + push. Pronto.

> Sempre que editar o `apps-script.gs`, use **Implantar → Gerenciar implantações → editar
> → Nova versão**. Se criar uma implantação nova a URL muda e você precisa atualizar o
> `config.js`.

## Os links

| | |
|---|---|
| Formulário | `…/royal-accelerator-pitchday/diligencia/` |
| Personalizado | `…/diligencia/?e=bruno` · `…/diligencia/?e=daniel` — abre com o nome dele na capa |
| Painel interno | `…/diligencia/painel.html` |

Login do painel: o `USUARIO` / `SENHA` do `CONFIG`. Sessão dura 12 h.

## O que mudou em relação ao PDF

- **Acrescentado:** Profit and Loss de 2025, 2024 e 2023, e Balance Sheet mais recente —
  todos marcados como *assinados*. P&L 2025 e Balance Sheet entram como obrigatórios.
- Sócios viraram lista dinâmica: o formulário não trava em dois, e valida que a soma das
  participações fecha em 100%.
- Assinatura é desenhada na tela e salva como `assinatura.png` na pasta do protocolo.
- Cada envio ganha um protocolo (`RBG-2026-XXXXX`), usado como nome da pasta no Drive.

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
