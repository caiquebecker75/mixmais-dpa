/* ==========================================================================
   ESQUADRAO ACELERA +DPA | trilha sonora
   Tres faixas orquestrais (assets/musica): heroica, acao e vitoria.
   Musicas de Kevin MacLeod (incompetech.com), licenca Creative Commons
   Atribuicao 4.0: "Heroic Age", "Five Armies" e "Take a Chance".
   Troca com fusao, abaixa quando a torre fala e respeita o botao de som.
   ========================================================================== */
(function () {
  const FAIXAS = { heroica: "assets/musica/heroica.m4a", acao: "assets/musica/acao.m4a", vitoria: "assets/musica/vitoria.m4a" };
  const VOL = { heroica: .5, acao: .42, vitoria: .55 };
  const audios = {};
  let atual = null, baixo = 1, liberado = false, pendente = null, fades = {};

  function pegar(nome) {
    if (!audios[nome]) {
      const a = new Audio(FAIXAS[nome]);
      a.loop = true; a.preload = "auto"; a.volume = 0;
      audios[nome] = a;
    }
    return audios[nome];
  }
  function alvoVol(nome) { return SOM.mudo ? 0 : VOL[nome] * baixo; }
  function fade(nome, ate, ms, depois) {
    const a = audios[nome]; if (!a) return;
    clearInterval(fades[nome]);
    const de = a.volume, t0 = performance.now();
    fades[nome] = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      a.volume = Math.max(0, Math.min(1, de + (ate - de) * k));
      if (k >= 1) { clearInterval(fades[nome]); if (depois) depois(); }
    }, 40);
  }

  function tocar(nome, opcoes) {
    opcoes = opcoes || {};
    if (!liberado) { pendente = [nome, opcoes]; return; }
    if (nome === atual && !opcoes.reiniciar) return;
    const anterior = atual; atual = nome;
    if (anterior && anterior !== nome) fade(anterior, 0, 700, () => audios[anterior].pause());
    if (!nome) return;
    const a = pegar(nome);
    if (opcoes.reiniciar || a.paused) { try { a.currentTime = opcoes.de || 0; } catch (e) {} }
    a.loop = opcoes.loop !== false;
    const p = a.play(); if (p && p.catch) p.catch(() => {});
    fade(nome, alvoVol(nome), opcoes.rapido ? 250 : 900);
  }
  function abaixar(seg) {
    baixo = .35; if (atual) fade(atual, alvoVol(atual), 150);
    setTimeout(() => { baixo = 1; if (atual) fade(atual, alvoVol(atual), 500); }, seg * 1000);
  }
  function atualizarMudo() { if (atual) fade(atual, alvoVol(atual), 200); }

  /* o navegador so libera audio depois do primeiro toque */
  const liberar = () => {
    if (liberado) return;
    liberado = true;
    Object.keys(FAIXAS).forEach(pegar);
    if (pendente) { const [n, o] = pendente; pendente = null; tocar(n, o); }
  };
  ["pointerdown", "keydown"].forEach(ev => window.addEventListener(ev, liberar, { passive: true }));

  window.MUSICA = { tocar, abaixar, atualizarMudo, get atual() { return atual; } };
})();
