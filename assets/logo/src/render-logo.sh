#!/bin/bash
# Renderiza o pacote de logo RBG: HTML -> PNG. Rode de qualquer lugar.
set -e
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$(cd "$(dirname "$0")" && pwd)"; OUT="$(cd "$SRC/../png" && pwd)"
shot () { # nome largura altura
  "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --default-background-color=00000000 --virtual-time-budget=9000 \
    --window-size=$2,$3 --screenshot="$OUT/$1-$2x$3.png" "file://$SRC/$1.html" >/dev/null 2>&1
  echo "→ $1 ($2x$3)"
}
shot horizontal-navy   2752 1536
shot horizontal-transp 2752 1536
shot mono-branco       2752 1536
shot mono-navy         2752 1536
shot banner-navy       2752 600
shot banner-transp     2752 600
shot vertical-navy     2000 2000
shot vertical-transp   2000 2000
shot emblema-transp    1600 1600
echo "PNGs em: $OUT"
