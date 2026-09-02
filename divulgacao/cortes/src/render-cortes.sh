#!/bin/bash
# Renderiza os gabaritos de cortes/Reels: HTML -> PNG no tamanho nativo.
set -e
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$(cd "$(dirname "$0")" && pwd)"; OUT="$(cd "$SRC/.." && pwd)"
shot () { "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=9000 \
  --window-size=$2,$3 --screenshot="$OUT/$1-$2x$3.png" "file://$SRC/$1.html" >/dev/null 2>&1; echo "-> $1 ($2x$3)"; }
shot reel-padrao 1080 1920
shot reel-fullbleed 1080 1920
shot reel-editorial 1080 1920
shot tiktok-padrao 1080 1920
shot corte-horizontal 1920 1080
shot corte-horizontal-quadro 1920 1080
