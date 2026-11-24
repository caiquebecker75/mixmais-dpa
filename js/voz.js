/* ==========================================================================
   ESQUADRAO ACELERA +DPA | voz da torre de controle
   Falas gravadas por uma pessoa em gravador.html e guardadas em assets/voz
   (m4a ou wav). Tocam com filtro de radio e chiado de transmissao, e a musica
   abaixa enquanto a torre fala. Sem arquivos, o jogo segue sem voz.
   ========================================================================== */
(function () {
  const FALAS = ["bemvindo", "ficha", "missao", "briefing", "tres", "dois", "um", "decolar", "missao1", "missao2", "carga",
    "perfeito", "bom", "raspao", "erro", "sequencia", "reserva", "cumprida", "pouso", "zona", "ocioso"];
  const buffers = {};
  let carregando = null, atual = null;

  function carregar() {
    if (carregando) return carregando;
    const ctx = SOM.contexto();
    if (!ctx) return Promise.resolve();
    carregando = Promise.all(FALAS.map(id =>
      fetch("assets/voz/" + id + ".m4a").then(r => r.ok ? r : fetch("assets/voz/" + id + ".wav")).then(r => r.ok ? r.arrayBuffer() : Promise.reject())
        .then(b => new Promise((ok, falha) => ctx.decodeAudioData(b, ok, falha)))
        .then(buf => { buffers[id] = buf; }).catch(() => {})
    ));
    return carregando;
  }
  ["pointerdown", "keydown"].forEach(ev => window.addEventListener(ev, carregar, { once: true, passive: true }));

  function chiado(ctx, saida, t, dur) {
    const n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2200; f.Q.value = .7;
    const g = ctx.createGain(); g.gain.value = .12;
    s.connect(f); f.connect(g); g.connect(saida); s.start(t);
  }

  async function falar(id, interromper = true) {
    if (SOM.mudo) return;
    await carregar();
    const ctx = SOM.contexto(), buf = buffers[id];
    if (!ctx || !buf) return;
    if (atual && interromper) { try { atual.stop(); } catch (e) {} }
    const saida = SOM.saida();
    const t = ctx.currentTime + 0.02;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 320;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3600;
    const pico = ctx.createBiquadFilter(); pico.type = "peaking"; pico.frequency.value = 1800; pico.gain.value = 6;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 6;
    const g = ctx.createGain(); g.gain.value = 1.5;
    src.connect(hp); hp.connect(lp); lp.connect(pico); pico.connect(comp); comp.connect(g); g.connect(saida);
    chiado(ctx, saida, t - 0.01, 0.09);
    src.start(t + 0.06);
    chiado(ctx, saida, t + 0.06 + buf.duration, 0.12);
    atual = src;
    if (window.MUSICA) MUSICA.abaixar(buf.duration + 0.4);
    return new Promise(res => { src.onended = res; });
  }

  window.VOZ = { falar, carregar };
})();
