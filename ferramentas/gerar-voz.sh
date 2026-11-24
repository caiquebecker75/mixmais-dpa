#!/bin/sh
# Converte as falas gravadas em gravador.html (zip com .wav) para assets/voz/*.m4a
# Uso: sh ferramentas/gerar-voz.sh <pasta-com-os-wav>   (rodar na raiz do projeto, no Mac)
set -e
SRC="$1"; DEST="assets/voz"
mkdir -p "$DEST"
for f in "$SRC"/*.wav; do
  n=$(basename "$f" .wav)
  afconvert -f m4af -d aac -b 96000 "$f" "$DEST/$n.m4a"
  echo "ok $n"
done
