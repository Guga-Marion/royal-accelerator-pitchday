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

mkdir -p "$OUT/posts-foto"
shotp () { # nome largura altura  -> posts-foto/
  echo "→ posts-foto/$1 (${2}x${3})"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=9000 \
    --window-size=$2,$3 --screenshot="$OUT/posts-foto/$1-$2x$3.png" "file://$SRC/$1.html" >/dev/null 2>&1
}
shotp post-foto-feed     1080 1350
shotp post-foto-quadrado 1080 1080
shotp post-foto-story    1080 1920

# YouTube: banner no tamanho mínimo (2048x1152, <= 6 MB) e foto de perfil (98x98, <= 4 MB)
echo "→ youtube-capa (2048x1152)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=0.8 \
  --virtual-time-budget=8000 --window-size=2560,1440 --screenshot="$OUT/youtube-capa-2048x1152.png" \
  "file://$SRC/social-capa-youtube.html" >/dev/null 2>&1
echo "→ youtube-avatar (98x98)"
sips -Z 98 "$OUT/social-avatar-instagram-1080x1080.png" --out "$OUT/youtube-avatar-98x98.png" >/dev/null
echo "PNGs em: $OUT"
