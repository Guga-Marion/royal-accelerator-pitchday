---
name: rbg
description: Plataforma RBG (Royal Business Growth) — mapa completo do sistema: app no Lovable, Supabase (banco, RLS, Auth, edge functions), formulário de diligência, contas, URLs, como publicar, migrar e verificar. Use sempre que for mexer na plataforma RBG, nos painéis, na diligência ou no Supabase da RBG.
---

# Plataforma RBG · como o sistema é e como mexer nele

## O que é
Uma operação, quatro janelas. Um app só, com login por papel:

| Rota | Quem | O que mostra |
|---|---|---|
| `/empresa` | empresa acelerada | trilha dos 120 dias, encontros, tarefas, métricas, materiais |
| `/conselho` | conselheiro | tarefas da cadeira, reuniões, dossiês, parecer, vesting, documentos |
| `/investidor` | investidor | posição (SAFE), alocação, pipeline, programa, retorno, originação, relatórios |
| `/interno` | time RBG (`interno` e `admin`) | rituais, semana, Pitch Day dia D, cronograma (gantt editável), tarefas por time, metas, biblioteca — estado **compartilhado** no banco |
| `/admin` | admin | visão geral, usuários (criar/editar/desativar/excluir/reenviar convite), ver como, logs, **diligência** |
| `/diligencia/?e=nome` | público, sem login | formulário de diligência inicial (estático, `public/diligencia/`) → cai em `/admin/diligencia` |
| `/entrar`, `/redefinir-senha` | — | login (e-mail + senha), recuperação e destino do convite |

## Onde está cada coisa
- **Código do app:** `~/dev/rbg-app` (NUNCA em `~/Desktop` — o Desktop é iCloud e trava com `node_modules`). Repo GitHub `Guga-Marion/hello-world-starter`, branch `main`, conectado ao **Lovable** (projeto `5c362e36-0729-478d-8a5c-ad3ecb19a34a`). Publicado em **https://rbg-project.lovable.app**.
- **Materiais / site do Pitch Day / HTMLs originais:** `~/Desktop/royal-accelerator-pitchday` (repo `Guga-Marion/royal-accelerator-pitchday`, GitHub Pages em `guga-marion.github.io/royal-accelerator-pitchday`). Clone rápido fora do iCloud em `~/dev/pitchday`.
- **Node 22** via asdf (`~/.asdf/installs/nodejs/22.14.0`); `.tool-versions` no app aponta para ele. Antes de rodar npm: `export PATH="$HOME/.asdf/installs/nodejs/22.14.0/bin:$PATH"`.
- **Supabase:** org RBG · projeto RBG · ref `jktjurezegjksruyybzx` · `https://jktjurezegjksruyybzx.supabase.co` · Postgres 17 · us-east-1. Publishable key (pública) está como fallback em `src/lib/supabase.ts`. Service role / token pessoal (`sbp_…`): pedir ao Gustavo; ele autorizou mexer no banco direto pela API, sem copiar SQL no painel.

## Stack do app
TanStack Start (file routes em `src/routes`) + React 19 + Tailwind 4 (design system próprio em `src/rbg.css`, tokens navy/dourado, Cormorant Garamond / Inter / JetBrains Mono) + TanStack Query + `@supabase/supabase-js`.
- `src/lib/auth.tsx` — `useAuth()`: `user`, `effective` (ver como), `login`, `logout`, `startViewAs`, `stopViewAs`; `log()` grava em `audit_logs`; `ROLE_HOME`, `ROLE_ACCESS`.
- `src/routes/_app.tsx` — guarda: exige login e só deixa o papel entrar no seu painel (admin em todos).
- `src/data/provider.ts` — **única porta para o banco**: `fetchEmpresa/Conselho/Investidor`, `useProfiles`, `useLogs`, `adminUsers()` (edge function), `loadInternoState/saveInternoState`, `fetchSubmissions/useSubmission/updateSubmission/signedFileUrl` (diligência). Mapeia snake_case → tipos de `src/data/types.ts`.
- `src/data/mock/core.ts` e `mock/interno.ts` — conteúdo editorial que continua no código (rituais, decupagem, projeções ilustrativas) e o seed. `mock/users.ts` — contas de exemplo (senha `rbg-2026`).
- `src/data/internoStore.ts` — store local + `useInternoSync()` (carrega `interno_state.global` e salva com debounce 700 ms).
- `src/components/Shell.tsx` (moldura com sidebar/scrollspy/ver como), `ui.tsx` (Kpi, Card, Section, Pill, Stepper, PTrack, Modal, Toast…), `Icons.tsx`, `Loading.tsx`.

## Banco (Supabase)
Migrações em `supabase/migrations/` — aplicar com a Management API (Cloudflare bloqueia `python urllib`; usar **curl**):
```sh
python3 -c "import json; json.dump({'query': open('supabase/migrations/000X.sql').read()}, open('/tmp/q.json','w'))"
curl -s -X POST -H "Authorization: Bearer $SBP_TOKEN" -H "Content-Type: application/json" \
  https://api.supabase.com/v1/projects/jktjurezegjksruyybzx/database/query --data-binary @/tmp/q.json
```
- `0001_schema.sql` — 17 tabelas + RLS. `profiles` (1:1 com `auth.users`, trigger `handle_new_user` cria a partir do `user_metadata`: name, role, status, linked_id, title, invited_by). Helpers: `current_app_role()`, `current_linked_id()`, `is_staff()` (admin|interno), `is_admin()`. RPC `touch_last_login()`.
- `0002_grants.sql` — grants para `authenticated`/`service_role` (sem isso a service role dá 403).
- `0003_diligencia.sql` — `diligence_submissions` (staff lê/edita; inserts só pela edge function) + bucket privado `diligencia` (staff lê por URL assinada).

**Quem vê o quê (RLS):** empresa → só a própria empresa/encontros/tarefas/métricas/materiais liberados; conselheiro → tarefas da cadeira + das aceleradas, eventos, pipeline, docs de conselheiro; investidor → a própria posição, pipeline, plano de capital, ciclos, funil, metas, docs de investidor; staff → tudo; logs só admin; `interno_state` e `diligence_submissions` só staff. Escrita nas tabelas de domínio: só staff.

**Seed** (idempotente): `SUPABASE_SERVICE_KEY=… node --experimental-strip-types supabase/seed.mjs` — sobe advisors, companies, meetings, tasks etc. + 12 contas Auth (senha `rbg-2026`, e-mail confirmado) + 14 logs + `interno_state.global`.

## Edge functions (`supabase/functions/`)
Deploy pela Management API (multipart):
```sh
curl -s -X POST -H "Authorization: Bearer $SBP_TOKEN" \
  "https://api.supabase.com/v1/projects/jktjurezegjksruyybzx/functions/deploy?slug=NOME" \
  -F 'metadata={"entrypoint_path":"index.ts","name":"NOME","verify_jwt":false};type=application/json' \
  -F "file=@supabase/functions/NOME/index.ts;filename=index.ts"
```
- **`admin-users`** — `{action: create|update|delete|resend, …}` com o JWT do admin no `Authorization`. Só perfil `admin`. `create` sem senha → `inviteUserByEmail`; com senha (≥ 8) → cria confirmado. `status: desativado` bane no Auth.
- **`diligencia`** — mesmo contrato do Apps Script antigo, sem login: `POST` JSON (`Content-Type: text/plain` para evitar preflight) com `acao: submissao` (dados, socios, resumo, assinatura data-URL, agente, respondente) → `arquivo` (campo, nome, tipo, b64 — limite 25 MB) → `finalizar`. Grava em `diligence_submissions` + `diligencia/<protocolo>/…`. `GET` responde `{ok:true, versao:3}`.

## Auth
E-mail + senha. `disable_signup: true` (só por convite). `site_url` = `https://rbg-project.lovable.app`; allow-list inclui `localhost:5180` e `*.lovable.app`. Senha mínima 8. E-mails saem pelo SMTP padrão do Supabase (≈2/h, remetente genérico) — para convites reais em volume, configurar SMTP próprio (Resend) em `config/auth`.
Contas de exemplo (senha `rbg-2026`): `guga@rbg-hub.com` (admin), `lucio@rbg-hub.com` (admin), `lucilene@rbg-hub.com` (interno), `fernando.alves@rbg-hub.com` (conselheiro · Comercial), `investidor@exemplo.com`, `empresa@exemplo.com`.

## Diligência (fluxo atual)
1. Link por empresa: `https://rbg-project.lovable.app/diligencia/?e=bruno` e `…?e=daniel` (o `?e=` só personaliza e identifica; não é senha). Os links antigos do GitHub Pages (`guga-marion.github.io/…/diligencia/?e=…`) também gravam no mesmo banco (config.js lá aponta para a mesma edge function).
2. O formulário (`public/diligencia/app.js`, `config.js` com `endpoint` da edge function e `limiteArquivoMB: 15`) manda submissão → arquivos → finalizar. Se a rede falhar, plano B antigo (baixa .json e abre e-mail).
3. Painel: `/admin/diligencia` (lista, filtros, links prontos para copiar) e `/admin/diligencia/<protocolo>` (11 seções, sócios com soma de %, documentos com link assinado de 1 h, assinatura, status `nova|em_analise|pendente|aprovada|reprovada` e anotação interna; cada salvamento vira log).
4. Login do painel = conta do app com papel admin/interno (o painel antigo com senha própria foi aposentado).

## Publicar
`git push origin main` em `~/dev/rbg-app` → Lovable sincroniza → **Publish** no Lovable (não é Vercel). Nunca reescrever histórico de `main`. Build local: `npm run build` (nitro/cloudflare) + `npx tsc --noEmit`. Dev: `npm run dev -- --port 5180` (primeiro carregamento demora ~60 s).

## Checklist de verificação (fazer depois de qualquer mudança)
1. `npx tsc --noEmit` e `npm run build` sem erro.
2. Login via REST por papel e checar RLS (empresa não vê `investors`/`audit_logs`; admin vê `profiles` todos):
   `curl -X POST "$URL/auth/v1/token?grant_type=password" -H "apikey: $PUB" -d '{"email":…,"password":…}'` → usar `access_token` em `$URL/rest/v1/<tabela>`.
3. Edge functions: `GET …/functions/v1/diligencia` → `{ok:true}`; `admin-users` com ação inválida → 400 "Ação desconhecida" (prova que o JWT passou).
4. Envio de teste no contrato da diligência (submissao/arquivo/finalizar) e conferir a linha em `diligence_submissions` e a ficha em `/admin/diligencia`.
5. No site publicado: `/entrar` abre, login admin funciona, `/interno` mostra badge "salvo no banco", `/diligencia/?e=teste` abre o formulário.

## Armadilhas conhecidas
- Desktop/Documents são iCloud: nada de `node_modules` lá (load 20+, git e Vite travam).
- Tabelas novas: sempre incluir `grant` (ver `0002_grants.sql`) ou a service role recebe 42501.
- `exactOptionalPropertyTypes` está ligado: não passe `undefined` em prop opcional — use spread condicional.
- Lovable: `AGENTS.md` pede para não fazer force-push/rebase em `main`.
- Hydration warning no console vem de extensões do Chrome (Grammarly), não do app.
