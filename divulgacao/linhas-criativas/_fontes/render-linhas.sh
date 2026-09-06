#!/bin/bash
# Renderiza as linhas criativas RBG: HTML -> PNG no tamanho exato de cada plataforma.
# Uso: ./render-linhas.sh            (tudo)
#      ./render-linhas.sh tese       (só os arquivos cujo nome contém "tese")
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$(cd "$(dirname "$0")/src" && pwd)"; OUT="$(cd "$SRC/.." && pwd)"; ONLY="${1:-}"
shot () { # html  query  pasta/nome  largura  altura
  local name="$3-$4x$5.png"
  [ -n "$ONLY" ] && [[ "$name" != *"$ONLY"* ]] && return 0
  mkdir -p "$OUT/$(dirname "$3")"; echo "→ $name"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=9000 --window-size=$4,$5 --screenshot="$OUT/$name" "file://$SRC/$1.html?$2" >/dev/null 2>&1
}
# L01 · Tese
for v in 1 3 4; do shot tese-quadrado "v=$v" "01-tese/tese-0$v-quadrado" 1080 1080; done
for v in 2 5; do shot tese-story "v=$v" "01-tese/tese-0$v-story" 1080 1920; done
# L02 · A travessia (carrossel: 0 capa · 1..5 · 6 cta)
for s in 0 1 2 3 4 5 6; do shot travessia "s=$s" "02-travessia/travessia-0$s" 1080 1350; done
# L03 · Sete frentes (carrossel: 0 capa · 1..7 · 8 cta)
for n in 0 1 2 3 4 5 6 7 8; do shot frentes "n=$n" "03-sete-frentes/frentes-0$n" 1080 1350; done
# L04 · A banca fala
i=0; for slug in fernando-alves gustavo-marion lucio-santana carlos-osorio alex-zocche kamila-adamatti; do i=$((i+1)); shot banca "c=$i" "04-banca-fala/banca-$i-$slug" 1080 1350; done
# L05 · O número
for n in 1 2 3 4 5 6; do shot numero "n=$n" "05-numero/numero-0$n" 1080 1080; done
# L06 · O custo de esperar
shot custo "" "06-custo-de-esperar/custo-de-esperar" 1080 1350
# L07 · Hub & bastidores
shot bastidores-quadrado "v=1" "07-bastidores/bastidores-01-quadrado" 1080 1080
shot bastidores-feed "v=2" "07-bastidores/bastidores-02-feed" 1080 1350
# L08 · Chamada
shot chamada-story "" "08-chamada/chamada-story" 1080 1920
shot chamada-quadrado "" "08-chamada/chamada-quadrado" 1080 1080
# Topo · O que o livro diz (carrossel: 0 capa · 1..6 · 7 cta)
for n in 0 1 2 3 4 5 6 7; do shot livro "n=$n" "10-livros/livro-0$n" 1080 1350; done
# Meio · Diagnóstico em 5 perguntas (carrossel: 0 capa · 1..5 · 6 cta)
for n in 0 1 2 3 4 5 6; do shot diagnostico "n=$n" "11-diagnostico/diagnostico-0$n" 1080 1350; done
# Vídeo · YouTube
for v in 1 2 3; do shot yt-thumb "v=$v" "09-video/yt-thumb-0$v" 1280 720; done
shot yt-cartela "" "09-video/yt-cartela-abertura" 1920 1080
echo "PNGs em: $OUT"
