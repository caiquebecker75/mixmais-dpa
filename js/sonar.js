/* ==========================================================================
   ESQUADRAO ACELERA +DPA | sonar tatico (canvas)
   O radar da tela de jogo: varredura, contatos (cada opcao do alvo e um
   contato T1..Tn), mira travada, misseis, explosoes e o anel do tempo.
   ========================================================================== */
(function () {
  const VERDE = "#8DC63F", LARANJA = "#F47B20", VERMELHO = "#E5383B", BRANCO = "#F4F7FB";
  const JATO = new Path2D("M50 2 C54 12 56 22 57 34 L58 54 L95 86 L95 95 L59 84 L58 104 L73 118 L73 125 L50 119 L27 125 L27 118 L42 104 L41 84 L5 95 L5 86 L42 54 L43 34 C44 22 46 12 50 2Z");

  let cv = null, ctx = null, W = 0, H = 0, dpr = 1, raf = null, ligado = false;
  let contatos = [], misseis = [], parts = [], aneis = [];
  let tempoF = 1, tremor = 0, flash = 0, t = 0, ultimo = 0, selo = null;

  function medir() {
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(10, r.width); H = Math.max(10, r.height);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }

  function iniciar(canvas) {
    cv = canvas; ctx = cv.getContext("2d");
    medir();
    if (window.ResizeObserver) new ResizeObserver(medir).observe(cv);
    window.addEventListener("resize", medir);
  }
  function ligar(v) {
    ligado = v;
    if (v && !raf) { ultimo = performance.now(); raf = requestAnimationFrame(quadro); }
    if (!v && raf) { cancelAnimationFrame(raf); raf = null; }
  }

  const geo = () => { const R = Math.min(W, H) * 0.415; return { cx: W / 2, cy: H / 2, R }; };

  /* n contatos espalhados em volta do centro */
  function novosContatos(n) {
    misseis = []; parts = []; selo = null;
    const base = Math.random() * Math.PI * 2;
    contatos = Array.from({ length: n }, (_, i) => {
      const ang = base + (i / n) * Math.PI * 2 + (Math.random() - .5) * .35;
      return { i, rotulo: "T" + (i + 1), ang, raio: .52 + Math.random() * .3, fase: Math.random() * 6.28,
        travado: false, estado: "entra", nasc: t + i * .09, k: 0, lock: 0, fim: 0 };
    });
    aneis.push({ r: 0, vida: 1, cor: VERDE, larg: 3, vel: 1.1, centro: true });
    return contatos.map(c => c.rotulo);
  }
  function travar(i, on) { const c = contatos[i]; if (c) { c.travado = on; if (on) aneis.push({ c, r: 0, vida: 1, cor: VERDE, larg: 2, vel: .5 }); } }
  function tempo(f) { tempoF = Math.max(0, Math.min(1, f)); }

  function pos(c) {
    const { cx, cy, R } = geo();
    const w = Math.sin(t * .9 + c.fase) * .035, a = c.ang + Math.sin(t * .35 + c.fase) * .06;
    return { x: cx + Math.cos(a) * R * (c.raio + w), y: cy + Math.sin(a) * R * (c.raio + w) };
  }

  /* acertos: indices dos travados que estavam no conjunto ideal */
  function disparar(travados, acertos, grau) {
    return new Promise(res => {
      const { cx, cy } = geo();
      travados.forEach((i, k) => {
        const c = contatos[i];
        misseis.push({ c, x: cx, y: cy, k: 0, atraso: k * .14, certo: acertos.includes(i), rastro: [] });
      });
      contatos.forEach(c => { if (!c.travado) { c.estado = "foge"; c.fim = t; } });
      const dur = 0.75 + travados.length * .14;
      setTimeout(() => {
        selo = { grau, nasc: t };
        if (grau === "perfeito") { flash = .55; tremor = 14; }
        else if (grau === "bom") { flash = .3; tremor = 8; }
        else tremor = 4;
        res();
      }, dur * 1000);
    });
  }

  function explodir(x, y, cor, forca) {
    for (let i = 0; i < 26 * forca; i++) {
      const a = Math.random() * 6.28, v = (40 + Math.random() * 220) * forca;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1, dec: 1.2 + Math.random() * 1.6, r: 1.5 + Math.random() * 3.5, cor: Math.random() < .5 ? cor : (Math.random() < .5 ? "#FFE27A" : "#fff") });
    }
    aneis.push({ x, y, r: 0, vida: 1, cor, larg: 4, vel: .9 * forca, abs: true });
    aneis.push({ x, y, r: 0, vida: 1, cor: "#fff", larg: 2, vel: .55 * forca, abs: true });
  }

  function jato(x, y, esc, rot, corpo, ponta) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot); ctx.scale(esc, esc); ctx.translate(-50, -64);
    ctx.fillStyle = corpo; ctx.fill(JATO);
    ctx.fillStyle = ponta;
    ctx.fillRect(84, 82, 11, 12); ctx.fillRect(5, 82, 11, 12);
    ctx.fillStyle = "#0B2E63"; ctx.beginPath(); ctx.ellipse(50, 36, 4.2, 11, 0, 0, 6.28); ctx.fill();
    ctx.restore();
  }

  function quadro(agora) {
    raf = requestAnimationFrame(quadro);
    const dt = Math.min(.05, (agora - ultimo) / 1000); ultimo = agora; t += dt;
    if (!W) return;
    const { cx, cy, R } = geo();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (tremor > .2) { ctx.translate((Math.random() - .5) * tremor, (Math.random() - .5) * tremor); tremor *= .88; }

    /* disco */
    const g = ctx.createRadialGradient(cx, cy, R * .05, cx, cy, R);
    g.addColorStop(0, "rgba(20,70,60,.55)"); g.addColorStop(.6, "rgba(6,36,60,.72)"); g.addColorStop(1, "rgba(3,18,42,.92)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.28); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.28); ctx.clip();
    /* grade */
    ctx.strokeStyle = "rgba(141,198,63,.10)"; ctx.lineWidth = 1;
    const passo = R / 5;
    for (let x = cx % passo; x < W; x += passo) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = cy % passo; y < H; y += passo) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    /* varredura */
    const va = (t * 1.5) % 6.28;
    for (let i = 0; i < 46; i++) {
      ctx.fillStyle = "rgba(141,198,63," + (.2 * (1 - i / 46)) + ")";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, va - i * .022 - .022, va - i * .022 + .004); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = "rgba(190,255,120,.9)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(va) * R, cy + Math.sin(va) * R); ctx.stroke();
    ctx.restore();
    /* aneis e eixos */
    ctx.strokeStyle = "rgba(141,198,63,.32)"; ctx.lineWidth = 1;
    [.25, .5, .75, 1].forEach(k => { ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 6.28); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    /* regua de graus */
    ctx.fillStyle = "rgba(141,198,63,.75)"; ctx.font = Math.max(9, R * .05) + "px 'Share Tech Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let d = 0; d < 360; d += 10) {
      const a = (d - 90) * Math.PI / 180, l = d % 30 === 0 ? R * .045 : R * .022;
      ctx.strokeStyle = "rgba(141,198,63,.5)"; ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
      if (d % 90 === 0) ctx.fillText(String(d).padStart(3, "0"), cx + Math.cos(a) * (R * .9), cy + Math.sin(a) * (R * .9));
    }

    /* anel do tempo */
    const Rt = R * 1.105, larg = Math.max(6, R * .06);
    ctx.lineCap = "butt";
    ctx.strokeStyle = "rgba(255,255,255,.09)"; ctx.lineWidth = larg; ctx.beginPath(); ctx.arc(cx, cy, Rt, 0, 6.28); ctx.stroke();
    const corT = tempoF > .5 ? VERDE : tempoF > .25 ? LARANJA : VERMELHO;
    const pulso = tempoF <= .25 ? .65 + .35 * Math.sin(t * 9) : 1;
    ctx.globalAlpha = pulso; ctx.strokeStyle = corT; ctx.shadowColor = corT; ctx.shadowBlur = tempoF <= .25 ? 22 : 10;
    ctx.beginPath(); ctx.arc(cx, cy, Rt, -Math.PI / 2, -Math.PI / 2 + 6.2832 * tempoF); ctx.stroke();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(3,22,52,.9)"; ctx.lineWidth = 2;
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * 6.2832 - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (Rt - larg / 2), cy + Math.sin(a) * (Rt - larg / 2)); ctx.lineTo(cx + Math.cos(a) * (Rt + larg / 2), cy + Math.sin(a) * (Rt + larg / 2)); ctx.stroke();
    }
    const ap = -Math.PI / 2 + 6.2832 * tempoF;
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + Math.cos(ap) * Rt, cy + Math.sin(ap) * Rt, larg * .62, 0, 6.28); ctx.fill();

    /* linhas de tiro ate os travados */
    contatos.forEach(c => {
      if (!c.travado || c.estado === "abatido") return;
      const p = pos(c);
      ctx.setLineDash([6, 6]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = "rgba(141,198,63,.8)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.setLineDash([]);
    });

    /* contatos */
    const esc = R / 420;
    contatos.forEach(c => {
      if (t < c.nasc) return;
      const p = pos(c);
      let alfa = 1, e = 1;
      if (c.estado === "entra") { c.k = Math.min(1, c.k + dt * 3); e = .4 + .6 * c.k; alfa = c.k; if (c.k >= 1) c.estado = "voa"; }
      if (c.estado === "foge") { const k = Math.min(1, (t - c.fim) * 1.6); alfa = 1 - k; c.raio += dt * .5; }
      if (c.estado === "abatido") return;
      const da = ((Math.atan2(p.y - cy, p.x - cx) - va) % 6.28 + 6.28) % 6.28;
      const brilho = da > 5.6 ? (da - 5.6) / .68 : 0;
      ctx.globalAlpha = alfa;
      const rot = c.ang + Math.PI + Math.sin(t * .6 + c.fase) * .5;
      ctx.shadowColor = c.travado ? VERDE : VERMELHO; ctx.shadowBlur = 8 + brilho * 16;
      jato(p.x, p.y, esc * .34 * e, rot, c.travado ? "#DFF3C4" : "#FF7A6B", c.travado ? VERDE : "#8E1418");
      ctx.shadowBlur = 0;
      /* rotulo */
      const fs = Math.max(11, R * .07);
      ctx.font = "700 " + fs + "px 'Saira Condensed', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const lx = p.x + Math.cos(c.ang) * R * .13, ly = p.y + Math.sin(c.ang) * R * .13;
      ctx.fillStyle = c.travado ? VERDE : "rgba(3,22,52,.9)"; ctx.strokeStyle = c.travado ? VERDE : LARANJA; ctx.lineWidth = 1.5;
      const bw = fs * 1.7, bh = fs * 1.2;
      ctx.beginPath(); ctx.rect(lx - bw / 2, ly - bh / 2, bw, bh); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.travado ? "#06214D" : "#fff"; ctx.fillText(c.rotulo, lx, ly + 1);
      /* mira travada */
      c.lock += ((c.travado ? 1 : 0) - c.lock) * Math.min(1, dt * 12);
      if (c.lock > .02) {
        const s = R * (.16 - .05 * c.lock), q = s * .45;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(t * 1.2); ctx.globalAlpha = alfa * c.lock;
        ctx.strokeStyle = VERDE; ctx.lineWidth = 2.5;
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
          ctx.beginPath(); ctx.moveTo(sx * s, sy * (s - q)); ctx.lineTo(sx * s, sy * s); ctx.lineTo(sx * (s - q), sy * s); ctx.stroke();
        });
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    });

    /* nosso jato no centro */
    ctx.shadowColor = "#fff"; ctx.shadowBlur = 12;
    jato(cx, cy + Math.sin(t * 2) * 2, esc * .5, 0, BRANCO, LARANJA);
    ctx.shadowBlur = 0;

    /* misseis */
    misseis.forEach(m => {
      if (m.atraso > 0) { m.atraso -= dt; return; }
      if (m.fim) return;
      const alvo = pos(m.c);
      m.k = Math.min(1, m.k + dt * 2.6);
      const k = m.k * m.k;
      const desvio = m.certo ? 0 : R * .16;
      const tx = alvo.x + Math.cos(m.c.ang + 1.57) * desvio, ty = alvo.y + Math.sin(m.c.ang + 1.57) * desvio;
      m.x = cx + (tx - cx) * k; m.y = cy + (ty - cy) * k;
      m.rastro.push({ x: m.x, y: m.y, v: 1 });
      if (m.k >= 1) {
        m.fim = true;
        if (m.certo) { explodir(alvo.x, alvo.y, VERDE, 1); m.c.estado = "abatido"; }
        else { explodir(tx, ty, LARANJA, .45); m.c.estado = "foge"; m.c.fim = t; m.c.travado = false; }
      }
    });
    misseis.forEach(m => {
      m.rastro.forEach(r => { r.v -= dt * 1.8; if (r.v > 0) { ctx.fillStyle = "rgba(255,255,255," + (r.v * .6) + ")"; ctx.beginPath(); ctx.arc(r.x, r.y, 3 * r.v + 1, 0, 6.28); ctx.fill(); } });
      if (!m.fim && m.atraso <= 0) { ctx.fillStyle = "#fff"; ctx.shadowColor = LARANJA; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(m.x, m.y, 4, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0; }
    });

    /* aneis de ping */
    aneis = aneis.filter(a => a.vida > 0);
    aneis.forEach(a => {
      a.r += dt * R * a.vel * 1.6; a.vida -= dt * 1.5;
      let x = cx, y = cy;
      if (a.c) { const p = pos(a.c); x = p.x; y = p.y; } else if (a.abs) { x = a.x; y = a.y; }
      ctx.globalAlpha = Math.max(0, a.vida); ctx.strokeStyle = a.cor; ctx.lineWidth = a.larg;
      ctx.beginPath(); ctx.arc(x, y, a.r, 0, 6.28); ctx.stroke(); ctx.globalAlpha = 1;
    });
    /* particulas */
    parts = parts.filter(p => p.vida > 0);
    parts.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .96; p.vy *= .96; p.vida -= dt * p.dec;
      ctx.globalAlpha = Math.max(0, p.vida); ctx.fillStyle = p.cor; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (flash > .01) { ctx.fillStyle = "rgba(255,255,255," + flash + ")"; ctx.fillRect(0, 0, W, H); flash *= .86; }
    ctx.restore();
  }

  window.SONAR = { iniciar, ligar, novosContatos, travar, disparar, tempo, medir };
})();
