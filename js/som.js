/* ==========================================================================
   ESQUADRAO ACELERA +DPA | efeitos sonoros sintetizados (Web Audio, sem arquivos)
   ========================================================================== */
(function () {
  let ctx = null, mestre = null, mudo = false;
  try { mudo = localStorage.getItem("esq_mudo") === "1"; } catch (e) {}

  function abrir() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return ctx; }
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    mestre = ctx.createGain();
    mestre.gain.value = mudo ? 0 : 0.55;
    mestre.connect(ctx.destination);
    return ctx;
  }
  ["pointerdown", "keydown"].forEach(ev => window.addEventListener(ev, abrir, { passive: true }));

  function tom(freq, dur, tipo = "sine", vol = 0.3, quando = 0, ate = null) {
    if (!abrir() || mudo) return;
    const t = ctx.currentTime + quando;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(freq, t);
    if (ate) o.frequency.exponentialRampToValueAtTime(ate, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(mestre);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function ruido(dur, de, ate, vol = 0.25, quando = 0, tipo = "bandpass") {
    if (!abrir() || mudo) return;
    const t = ctx.currentTime + quando;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = tipo; f.Q.value = 0.9;
    f.frequency.setValueAtTime(de, t); f.frequency.exponentialRampToValueAtTime(ate, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(mestre);
    src.start(t); src.stop(t + dur);
  }

  /* Sons reais de jato (assets/som), tirados do audio das filmagens em dominio publico.
     Enquanto nao carregam, ou se faltarem, entram os sons sintetizados. */
  const AMOSTRAS = { decolagem: "jato-decolagem.m4a", rasante1: "jato-rasante1.m4a", rasante2: "jato-rasante2.m4a", cabine: "jato-cabine.wav" };
  const amostra = {};
  let carregouAmostras = false, cabineNo = null, cabineGanho = null, ultimoRasante = 0;
  function carregarAmostras() {
    if (carregouAmostras || !abrir()) return;
    carregouAmostras = true;
    Object.keys(AMOSTRAS).forEach(k => {
      fetch("assets/som/" + AMOSTRAS[k]).then(r => r.ok ? r.arrayBuffer() : Promise.reject())
        .then(b => new Promise((ok, falha) => ctx.decodeAudioData(b, ok, falha)))
        .then(buf => { amostra[k] = buf; }).catch(() => {});
    });
  }
  ["pointerdown", "keydown"].forEach(ev => window.addEventListener(ev, carregarAmostras, { passive: true }));
  function tocarAmostra(nome, vol, taxa) {
    if (!abrir() || mudo || !amostra[nome]) return false;
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = amostra[nome]; s.playbackRate.value = taxa || 1; g.gain.value = vol;
    s.connect(g); g.connect(mestre); s.start();
    return true;
  }

  window.SOM = {
    get mudo() { return mudo; },
    contexto() { return abrir(); },
    saida() { abrir(); return mestre; },
    alternar() {
      mudo = !mudo;
      try { localStorage.setItem("esq_mudo", mudo ? "1" : "0"); } catch (e) {}
      if (abrir() && mestre) mestre.gain.value = mudo ? 0 : 0.55;
      return mudo;
    },
    clique() { tom(1250, 0.05, "square", 0.08); },
    trava() { tom(880, 0.06, "square", 0.12); tom(1320, 0.09, "square", 0.12, 0.07); },
    destrava() { tom(660, 0.08, "triangle", 0.12, 0, 330); },
    negado() { tom(180, 0.14, "sawtooth", 0.12); tom(150, 0.18, "sawtooth", 0.12, 0.12); },
    contagem(final) { final ? tom(1046, 0.45, "square", 0.16) : tom(523, 0.18, "square", 0.14); },
    disparo() { ruido(0.55, 2400, 300, 0.32); tom(220, 0.4, "sawtooth", 0.08, 0, 60); },
    explosao() { ruido(0.7, 900, 60, 0.4, 0.05, "lowpass"); },
    perfeito() { [784, 988, 1175, 1568].forEach((f, i) => tom(f, 0.16, "square", 0.11, 0.08 * i)); },
    bom() { [659, 880].forEach((f, i) => tom(f, 0.16, "square", 0.1, 0.09 * i)); },
    raspao() { tom(523, 0.16, "triangle", 0.12); tom(440, 0.2, "triangle", 0.12, 0.1); },
    erro() { tom(330, 0.2, "sawtooth", 0.1, 0, 160); },
    decolar() { if (!tocarAmostra("decolagem", 0.95)) { ruido(2.4, 200, 3200, 0.3, 0, "bandpass"); tom(90, 2.2, "sawtooth", 0.05, 0, 260); } },
    rasante(vol) {
      ultimoRasante = ultimoRasante === 1 ? 2 : 1;
      if (!tocarAmostra("rasante" + ultimoRasante, vol || 0.7, 0.92 + Math.random() * 0.2)) { ruido(1.3, 500, 2600, 0.22); ruido(1.0, 2600, 400, 0.18, 0.6); }
    },
    /* ronco continuo da cabine durante a missao */
    cabine(ligar) {
      if (!abrir()) return;
      if (ligar) {
        if (cabineNo || !amostra.cabine) return;
        cabineNo = ctx.createBufferSource(); cabineGanho = ctx.createGain();
        cabineNo.buffer = amostra.cabine; cabineNo.loop = true;
        cabineGanho.gain.value = 0; cabineGanho.gain.setTargetAtTime(0.16, ctx.currentTime, 0.8);
        cabineNo.connect(cabineGanho); cabineGanho.connect(mestre); cabineNo.start();
      } else if (cabineNo) {
        const n = cabineNo; cabineNo = null;
        cabineGanho.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
        setTimeout(() => { try { n.stop(); } catch (e) {} }, 1200);
      }
    },
    vitoria() { [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tom(f, 0.2, "square", 0.1, 0.11 * i)); },
    tique() { tom(1400, 0.04, "square", 0.09); tom(95, 0.13, "sine", 0.28, 0.02); },
    alerta() { tom(988, 0.12, "square", 0.1); tom(988, 0.12, "square", 0.1, 0.2); }
  };
})();
