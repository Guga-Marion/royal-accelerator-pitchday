#!/bin/bash
# Renderiza as peças de social RBG: HTML -> PNG no tamanho exato de cada plataforma.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$(cd "$(dirname "$0")" && pwd)"
OUT="$(cd "$SRC/.." && pwd)"
cd "$SRC"

shot () { # nome  largura  altura
  echo "→ $1 (${2}x${3})"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --default-background-color=00000000 --virtual-time-budget=8000 \
    --window-size=$2,$3 --screenshot="$OUT/$1-$2x$3.png" "file://$SRC/$1.html" >/dev/null 2>&1
}

shot social-avatar-instagram      1080 1080
shot social-avatar-linkedin       1080 1080
shot social-capa-youtube          2560 1440
shot social-capa-linkedin         1584 396
shot social-capa-linkedin-empresa 1128 191

echo "PNGs em: $OUT"
