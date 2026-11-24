#!/bin/sh
# Corta os trechos de video usados nas transicoes do jogo.
# Fontes (dominio publico, Wikimedia Commons / DVIDS):
#   trident-ready.webm   = "Atlantic Trident 2017 - Ready to fight"
#   decolagem-f16.webm   = "Combined Strike 25 F-16s takeoffs (974487)"
# Uso: sh ferramentas/cortar-videos.sh <pasta-das-fontes> <caminho-do-ffmpeg>
set -e
SRC="$1"; FF="$2"; OUT="assets/video"; TMP="${TMPDIR:-/tmp}/esq-video"
mkdir -p "$OUT" "$TMP"
V="scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=30,eq=contrast=1.08:saturation=1.12"
corta() { # nome fonte inicio duracao [filtro extra]
  "$FF" -hide_banner -loglevel error -y -ss "$3" -t "$4" -i "$SRC/$2" -an -vf "$V$5" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$TMP/$1.mp4"
}
junta() { # saida partes...
  s="$1"; shift; : > "$TMP/lista.txt"
  for p in "$@"; do echo "file '$TMP/$p.mp4'" >> "$TMP/lista.txt"; done
  "$FF" -hide_banner -loglevel error -y -f concat -safe 0 -i "$TMP/lista.txt" -c copy -movflags +faststart "$OUT/$s.mp4"
}
# decolagem: taxi e corrida na pista + F-16 saindo do chao
corta dec1 trident-ready.webm 46.6 2.3
corta dec2 decolagem-f16.webm 0.25 3.3
junta decolagem dec1 dec2
# contato: formacao vista do cockpit + esquadrilha ao longe
corta con1 trident-ready.webm 49.2 1.9
corta con2 trident-ready.webm 41.2 2.5
junta contato con1 con2
# combates: cortes curtos entre um alvo e outro
corta c1 trident-ready.webm 5.3 1.9;   cp "$TMP/c1.mp4" "$OUT/combate1.mp4"
corta c2 trident-ready.webm 26.2 1.9;  cp "$TMP/c2.mp4" "$OUT/combate2.mp4"
corta c3 trident-ready.webm 32.6 1.5;  cp "$TMP/c3.mp4" "$OUT/combate3.mp4"
corta c4 trident-ready.webm 38.6 2.2;  cp "$TMP/c4.mp4" "$OUT/combate4.mp4"
corta c5 trident-ready.webm 51.4 2.2;  cp "$TMP/c5.mp4" "$OUT/combate5.mp4"
corta c6 trident-ready.webm 65.7 2.1;  cp "$TMP/c6.mp4" "$OUT/combate6.mp4"
# vitoria: formacao mista
corta vit trident-ready.webm 82.5 4.2; cp "$TMP/vit.mp4" "$OUT/vitoria.mp4"
# fundo do briefing e da vinheta: formacao + cockpit em camera lenta
corta f1 trident-ready.webm 82.5 4.2 ",setpts=1.5*PTS"
corta f2 trident-ready.webm 63.5 1.8 ",setpts=2.2*PTS"
corta f3 trident-ready.webm 38.6 2.2 ",setpts=1.8*PTS"
junta fundo f1 f2 f3
ls -la "$OUT"
