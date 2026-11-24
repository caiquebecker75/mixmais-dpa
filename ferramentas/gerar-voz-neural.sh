#!/bin/sh
# Gera as falas da torre com voz neural em portugues do Brasil (Kokoro, modelo aberto,
# roda no proprio computador pelo comando "hyperframes tts") e grava em assets/voz/*.m4a.
# Precisa de Python 3.10+ com kokoro-onnx e soundfile, e do ffmpeg, no PATH.
# Uso: sh ferramentas/gerar-voz-neural.sh [voz]     (voz padrao: pm_alex; outras: pm_santa, pf_dora)
set -e
VOZ="${1:-pm_alex}"
DEST="assets/voz"; TMP="${TMPDIR:-/tmp}/esq-voz-neural"
mkdir -p "$DEST" "$TMP"
fala() {
  npx --yes hyperframes@0.9.91 tts "$2" -v "$VOZ" -l pt-br -s "${3:-1.05}" -o "$TMP/$1.wav" >/dev/null 2>&1
  ffmpeg -hide_banner -loglevel error -y -i "$TMP/$1.wav" -ac 1 -ar 44100 -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5" -c:a aac -b:a 80k "$DEST/$1.m4a"
  echo "ok $1"
}
fala bemvindo   "Torre de controle para piloto. Bem-vindo ao Esquadrão Acelera mais dê pê á."
fala ficha      "Identifique-se, piloto."
fala missao     "Escolha sua zona de operação."
fala briefing   "Atenção ao briefing. Pense em incremento: o que mais vende, e mais rende, para a loja."
fala tres       "Três!"
fala dois       "Dois!"
fala um         "Um!"
fala decolar    "Decolar!"
fala missao1    "Missão um. Iogurtes."
fala missao2    "Missão dois. Galbâni."
fala carga      "Carga fixa embarcada. Primeiro alvo no radar."
fala perfeito   "Alvo abatido!"
fala bom        "No alvo!"
fala raspao     "De raspão."
fala erro       "Alvo perdido."
fala sequencia  "Sequência perfeita!"
fala reserva    "Atenção. Tempo na reserva."
fala cumprida   "Missão cumprida!"
fala pouso      "Pouso confirmado. Confira sua patente."
fala zona       "Você está na zona de premiação!"
fala ocioso     "Piloto, ainda está aí?"
