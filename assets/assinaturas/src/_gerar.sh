#!/bin/bash
# Gera as assinaturas de e-mail da RBG: HTML -> PNG (2x, fundo branco).
set -e
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$(cd "$(dirname "$0")" && pwd)"; OUT="$(cd "$SRC/.." && pwd)"
W=560; H=150
for f in "$SRC"/sig-*.html; do
  n=$(basename "$f" .html)
  "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --virtual-time-budget=9000 --window-size=$W,$H \
    --screenshot="$OUT/$n.png" "file://$f" >/dev/null 2>&1
  echo "-> $n.png ($((W*2))x$((H*2)))"
done
