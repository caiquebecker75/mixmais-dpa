/* ==========================================================================
   ESQUADRAO ACELERA +DPA | artes vetoriais (logo, jato, insignias, icones)
   ========================================================================== */
(function () {
  const LARANJA = "#F47B20", VERDE = "#8DC63F";

  /* Logo ORIGINAL do KV (recortado do proprio arquivo da DPA, sem redesenho) */
  const LOGO = `<img src="assets/marca/logo.png" alt="Esquadrão Acelera +DPA" draggable="false">`;

  /* Jato visto de cima, apontando para cima */
  const JATO = `
  <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M50 2 C54 12 56 22 57 34 L58 54 L95 86 L95 95 L59 84 L58 104 L73 118 L73 125 L50 119 L27 125 L27 118 L42 104 L41 84 L5 95 L5 86 L42 54 L43 34 C44 22 46 12 50 2Z" fill="#F4F7FB"/>
    <path d="M95 86 L95 95 L84 91.5 L84 81.5Z M5 86 L5 95 L16 91.5 L16 81.5Z" fill="${LARANJA}"/>
    <path d="M73 118 L73 125 L64 122.6 L64 115Z M27 118 L27 125 L36 122.6 L36 115Z" fill="${LARANJA}"/>
    <ellipse cx="50" cy="36" rx="4.2" ry="11" fill="#0B2E63"/>
    <path d="M50 60 L50 112" stroke="#C9D3E0" stroke-width="1.4"/>
  </svg>`;

  /* Divisas de patente (1 a 5) */
  function insignia(divisas) {
    let v = "";
    for (let i = 0; i < divisas; i++) {
      const y = 118 + i * 20;
      v += `<polygon points="40,${y} 100,${y + 26} 160,${y} 160,${y + 13} 100,${y + 39} 40,${y + 13}" fill="${i % 2 ? VERDE : LARANJA}"/>`;
    }
    return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="100" cy="70" r="52" fill="none" stroke="${VERDE}" stroke-width="3" stroke-dasharray="6 6"/>
      <polygon points="100,26 113,56 146,58 120,79 129,111 100,93 71,111 80,79 54,58 87,56" fill="#fff"/>
      <path d="M8 70 L46 70 M154 70 L192 70" stroke="#fff" stroke-width="5"/>
      ${v}
    </svg>`;
  }

  /* Icones de canal: loja cada vez maior */
  function iconeCanal(n) {
    const lojas = [
      `<rect x="34" y="40" width="52" height="40" rx="3"/><path d="M28 40 L60 20 L92 40Z"/><rect x="52" y="58" width="16" height="22" fill="#031634"/>`,
      `<rect x="20" y="36" width="80" height="44" rx="3"/><rect x="16" y="28" width="88" height="10" rx="2"/><rect x="30" y="50" width="22" height="30" fill="#031634"/><rect x="62" y="48" width="28" height="16" fill="#031634"/>`,
      `<rect x="10" y="32" width="100" height="48" rx="3"/><rect x="6" y="22" width="108" height="12" rx="2"/><rect x="20" y="48" width="18" height="32" fill="#031634"/><rect x="46" y="46" width="56" height="18" fill="#031634"/>`,
      `<rect x="4" y="28" width="112" height="52" rx="3"/><rect x="0" y="16" width="120" height="14" rx="2"/><rect x="12" y="46" width="20" height="34" fill="#031634"/><rect x="40" y="44" width="68" height="20" fill="#031634"/><rect x="50" y="6" width="20" height="10"/>`,
      `<path d="M4 80 L4 34 L60 10 L116 34 L116 80Z"/><rect x="18" y="46" width="84" height="34" fill="#031634"/><path d="M18 58 H102 M18 70 H102" stroke="#fff" stroke-width="3"/>`
    ];
    return `<svg viewBox="0 0 120 86" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${lojas[n - 1] || lojas[0]}</svg>`;
  }

  const MIRA = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 2 V12 M20 28 V38 M2 20 H12 M28 20 H38" stroke="currentColor" stroke-width="3"/></svg>`;
  const SOM_ON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  const SOM_OFF = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

  /* Esquadrilha que cruza o ceu de tempos em tempos */
  let timerEsq = null;
  function esquadrilha(ligado) {
    const box = document.getElementById("esquadrilha");
    clearInterval(timerEsq);
    if (!ligado) { box.innerHTML = ""; return; }
    const voo = () => {
      const f = document.createElement("div");
      f.className = "formacao";
      const n = 5;
      let h = "";
      for (let i = 0; i < n; i++) {
        const off = i - (n - 1) / 2;
        h += `<span class="jato" style="--x:${off * 13}vmin;--y:${Math.abs(off) * 9}vmin">${JATO}<i class="rastro"></i></span>`;
      }
      f.innerHTML = h;
      f.style.left = (20 + Math.random() * 60) + "%";
      box.appendChild(f);
      setTimeout(() => f.remove(), 9000);
    };
    voo();
    timerEsq = setInterval(voo, 11000);
  }


  /* ---------------- Cenario 100% vetorial (sem imagens) ---------------- */
  function escada() {
    let l = "";
    for (let i = -4; i <= 4; i++) {
      if (!i) continue;
      const y = 300 - i * 70, w = Math.abs(i) % 2 ? 150 : 110;
      const tr = i < 0 ? ' stroke-dasharray="14 10"' : "";
      l += `<path d="M${400 - w - 60} ${y} H${400 - 60} V${y + (i > 0 ? 12 : -12)} M${400 + 60} ${y + (i > 0 ? 12 : -12)} V${y} H${400 + w + 60}"${tr}/>
            <text x="${400 - w - 72}" y="${y + 6}" text-anchor="end">${Math.abs(i) * 10}</text><text x="${400 + w + 72}" y="${y + 6}">${Math.abs(i) * 10}</text>`;
    }
    return `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="${VERDE}" stroke-width="3" font-family="Share Tech Mono, monospace" font-size="20">
        <g fill="${VERDE}" stroke="none" opacity=".9">${""}</g>
        ${l.replace(/<text/g, '<text fill="' + VERDE + '" stroke="none"')}
        <path d="M140 300 H330 M470 300 H660" stroke-width="4"/>
        <path d="M370 300 L400 322 L430 300" stroke="${LARANJA}" stroke-width="4"/>
        <circle cx="400" cy="300" r="5" fill="${LARANJA}" stroke="none"/>
      </g></svg>`;
  }
  const CANOPY = `<svg viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 H1000 V1000 H0Z M60 1000 C40 640 120 260 500 70 C880 260 960 640 940 1000Z" fill="#020C1F" fill-rule="evenodd" opacity=".92"/>
    <path d="M60 1000 C40 640 120 260 500 70 C880 260 960 640 940 1000" fill="none" stroke="#24426E" stroke-width="10"/>
    <path d="M500 70 V0" stroke="#24426E" stroke-width="14"/>
    <path d="M78 1000 C60 660 138 290 500 92" fill="none" stroke="rgba(141,198,63,.35)" stroke-width="2"/>
    <path d="M922 1000 C940 660 862 290 500 92" fill="none" stroke="rgba(141,198,63,.35)" stroke-width="2"/>
  </svg>`;
  function montarFundo() {
    const f = document.getElementById("fundo");
    if (!f) return;
    f.innerHTML = `
      <div class="f-ceu"></div>
      <div class="f-sol"><i class="raios"></i><i class="nucleo"></i></div>
      <div class="f-grade"></div>
      <div class="f-radar"><i class="aneis"></i><i class="varre"></i><b class="eco e1"></b><b class="eco e2"></b><b class="eco e3"></b></div>
      <div class="f-horizonte">${escada()}</div>
      <div class="nuvens">${"<i></i>".repeat(7)}</div>
      <div class="f-riscos"></div>
      <div id="esquadrilha"></div>
      <div class="f-canopy">${CANOPY}</div>
      <div class="f-scan"></div>
      <div class="f-veu"></div>`;
  }
  montarFundo();

  /* Icones de linha (Lucide), carregados de js/mapa.js */
  function ico(nome) {
    const m = (window.ICONES || {})[nome];
    return m ? `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${m}</svg>` : "";
  }
  function pintarIcones(raiz) {
    (raiz || document).querySelectorAll("[data-ico]").forEach(el => { el.innerHTML = ico(el.dataset.ico); });
  }

  window.ARTE = { LOGO, JATO, MIRA, SOM_ON, SOM_OFF, insignia, iconeCanal, esquadrilha, ico, pintarIcones };
  document.querySelectorAll("[data-logo]").forEach(el => el.innerHTML = LOGO);
  pintarIcones();
})();
