#!/usr/bin/env bash
# Prova de ponta a ponta do backend da diligência.
# Uso:  ./testar.sh "https://script.google.com/macros/s/AKfyc.../exec" [usuario] [senha]
set -euo pipefail

URL="${1:?informe a URL do Apps Script (termina em /exec)}"
USUARIO="${2:-rbg}"
SENHA="${3:-RoyalDD2026!}"
PROTO="TESTE-$(date +%H%M%S)"

post(){ curl -sS -L -X POST "$URL" -H 'Content-Type: text/plain;charset=utf-8' -d "$1"; }
ok(){ printf '  \033[32m✓\033[0m %s\n' "$1"; }
fail(){ printf '  \033[31m✗\033[0m %s\n' "$1"; exit 1; }

echo "→ 1. o serviço responde"
curl -sS -L "$URL" | grep -q '"ok":true' && ok "doGet respondeu" || fail "o /exec não respondeu como esperado"

echo "→ 2. grava uma submissão"
R=$(post "{\"acao\":\"submissao\",\"protocolo\":\"$PROTO\",
  \"dados\":{\"razao_social\":\"Empresa de Teste LLC\",\"responsavel_nome\":\"Teste\",
             \"responsavel_email\":\"teste@exemplo.com\",\"fat_12m\":\"1,000,000\"},
  \"socios\":[{\"nome\":\"Sócio Teste\",\"percentual\":\"100\"}]}")
echo "$R" | grep -q '"ok":true' && ok "linha gravada na planilha" || fail "não gravou: $R"

echo "→ 3. anexa um documento"
B64=$(printf 'arquivo de teste RBG' | base64)
R=$(post "{\"acao\":\"arquivo\",\"protocolo\":\"$PROTO\",\"campo\":\"doc_ein\",
  \"nome\":\"teste.txt\",\"tipo\":\"text/plain\",\"b64\":\"$B64\"}")
echo "$R" | grep -q '"ok":true' && ok "arquivo salvo no Drive" || fail "não salvou o arquivo: $R"

echo "→ 4. dispara o e-mail com a resposta completa"
R=$(post "{\"acao\":\"finalizar\",\"protocolo\":\"$PROTO\"}")
echo "$R" | grep -q '"ok":true' && ok "e-mail disparado (confira a caixa de entrada)" || fail "não finalizou: $R"

echo "→ 5. login do painel"
T=$(post "{\"acao\":\"login\",\"usuario\":\"$USUARIO\",\"senha\":\"$SENHA\"}" \
    | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
[ -n "$T" ] && ok "login aceito, token emitido" || fail "login recusado"

echo "→ 6. senha errada é recusada"
post "{\"acao\":\"login\",\"usuario\":\"$USUARIO\",\"senha\":\"errada\"}" \
  | grep -q '"ok":false' && ok "senha inválida barrada" || fail "aceitou senha errada"

echo "→ 7. o painel lê de volta"
R=$(post "{\"acao\":\"listar\",\"token\":\"$T\"}")
echo "$R" | grep -q "$PROTO"           && ok "submissão aparece na listagem"   || fail "não achou o protocolo"
echo "$R" | grep -q "Empresa de Teste" && ok "campos vieram completos"         || fail "campos vazios"
echo "$R" | grep -q "Sócio Teste"      && ok "sócios vieram completos"         || fail "sócios vazios"
echo "$R" | grep -q "doc_ein"          && ok "documento ligado à submissão"    || fail "arquivo não vinculado"

echo "→ 8. listar sem token é recusado"
post "{\"acao\":\"listar\",\"token\":\"invalido\"}" | grep -q '"ok":false' \
  && ok "acesso sem token barrado" || fail "vazou dado sem token"

echo
echo "Tudo passou. Apague a linha \"$PROTO\" da planilha e a pasta dela no Drive."
