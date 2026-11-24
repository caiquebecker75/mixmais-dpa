/* ==========================================================================
   ESQUADRAO ACELERA +DPA | fluxo do jogo
   espera > ficha do piloto > zona de operacao (mapa) > briefing (cinema) >
   decolagem > missao 1 (iogurtes) > intervalo > missao 2 (galbani) > debrief
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG;
  const M = window.MOTOR;
  const A = window.ARTE;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esperar = ms => new Promise(r => setTimeout(r, ms));

  const params = new URLSearchParams(location.search);
  if (params.get("totem")) CFG.tablet = params.get("totem");
  if (params.get("tablet")) CFG.tablet = params.get("tablet");

  const CORES_MARCA = { "Nestlé": "#1B4F9C", "Chamyto": "#D7141A", "Chambinho": "#E4007C", "Ninho": "#E8A200", "Grego": "#0B2E63",
    "Molico": "#0096D6", "Chandelle": "#5B2C1A", "Neston": "#E87511", "Galbani": "#00843D" };
  const COR_GRAU = { perfeito: "#8DC63F", bom: "#3FB6A8", raspao: "#F47B20", erro: "#E5383B" };

  const E = {
    piloto: null, filial: null, canal: null, codinome: null,
    missoes: [], mi: 0, ai: 0, marcados: [],
    res: {}, pontos: 0, sequencia: 0, tempoRef: 1,
    rodando: false, acumulado: 0, marco: 0,
    travado: false, ranking: [], desligar: null, registroFinal: null, avisouComb: false
  };

  /* ---------------- utilidades ---------------- */
  const CENAS = { "t-espera": "cena-ceu", "t-jogo": "cena-cockpit" };
  const ORDEM = ["t-cadastro", "t-missao", "t-briefing", "t-jogo", "t-debrief"];
  let primeiraTela = true;
  function transicao() {
    const t = $("#transicao");
    t.classList.remove("vai"); void t.offsetWidth; t.classList.add("vai");
  }
  function irPara(id) {
    if (!primeiraTela && id !== document.body.dataset.tela) transicao();
    primeiraTela = false;
    $$(".tela").forEach(t => t.classList.remove("ativa"));
    $("#" + id).classList.add("ativa");
    document.body.className = CENAS[id] || "cena-comando";
    document.body.dataset.tela = id;
    A.esquadrilha(id === "t-espera");
    SONAR.ligar(id === "t-jogo");
    const passo = id === "t-intervalo" ? "t-jogo" : id, pi = ORDEM.indexOf(passo);
    $$("#bt-passos li").forEach((li, i) => { li.classList.toggle("atual", i === pi); li.classList.toggle("feito", pi > i); });
    if (id !== "t-jogo") { $("#alerta-borda").classList.remove("on"); }
    $("#" + id).scrollTop = 0;
  }
  let avisoT = null;
  function aviso(txt) {
    const el = $("#aviso");
    el.textContent = txt; el.classList.add("aparece");
    clearTimeout(avisoT); avisoT = setTimeout(() => el.classList.remove("aparece"), 2400);
  }
  const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nomeCurto = n => { const p = (n || "").trim().split(/\s+/); return p.length > 1 ? p[0] + " " + p[p.length - 1][0] + "." : p[0] || ""; };

  function imgSku(e) {
    const s = M.sku(e);
    if (s.img) return `<span class="sku-img"><img src="assets/sku/${e}.webp" alt="" draggable="false"></span>`;
    const cor = CORES_MARCA[s.m] || "#1B4F9C";
    return `<span class="sku-img sem" style="--c:${cor}"><b>${esc(s.m || "")}</b><small>${esc(s.n.replace(new RegExp("^" + (s.m || "") + "\\s*", "i"), ""))}</small></span>`;
  }

  /* ---------------- som ---------------- */
  function pintarSom() { $$(".b-som").forEach(b => b.innerHTML = A.ico(SOM.mudo ? "volume-x" : "volume-2")); }
  $$(".b-som").forEach(b => b.addEventListener("click", () => { SOM.alternar(); MUSICA.atualizarMudo(); pintarSom(); }));
  pintarSom();

  /* ---------------- ESPERA ---------------- */
  $$(".n-zona").forEach(el => el.textContent = CFG.zonaPremio);
  const textoPremio = CFG.premio ? `Os ${CFG.zonaPremio} primeiros do ranking levam ${CFG.premio}` : `Os ${CFG.zonaPremio} primeiros entram na zona de premiação`;
  $("#premio-espera").textContent = textoPremio;
  $("#premio-debrief").textContent = textoPremio;

  const quem = r => `<span class="quem"><b>${esc(r.codinome || "PILOTO")}</b><span>${esc(nomeCurto(r.nome))}</span></span>`;

  function pintarEspera(lista) {
    const top = lista.slice(0, CFG.zonaPremio);
    $("#top-espera").innerHTML = top.length
      ? top.map((r, i) => `<li class="p${i + 1}"><i>${i + 1}</i>${quem(r)}<em>${M.milhar(r.pontuacao)}</em></li>`).join("")
      : `<li class="vazio">Nenhum piloto decolou ainda. Seja o primeiro.</li>`;
    $("#n-pilotos").textContent = lista.length ? (lista.length === 1 ? "1 PILOTO" : lista.length + " PILOTOS") : "";
  }
  (async function ligarRanking() {
    E.desligar = await STORE.ouvirRanking(lista => {
      E.ranking = lista;
      pintarEspera(lista);
      if (document.body.dataset.tela === "t-debrief" && E.registroFinal) pintarRanking();
    });
  })();

  $("#b-decolar").addEventListener("click", () => { SOM.decolar(); VOZ.falar("bemvindo"); abrirCadastro(); });
  $(".esp-heroi .logo").addEventListener("dblclick", () => {
    const d = document.documentElement;
    if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen().catch(() => {});
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $$("[data-voltar]").forEach(b => b.addEventListener("click", () => { SOM.clique(); irPara(b.dataset.voltar); }));

  /* ---------------- FICHA DO PILOTO ---------------- */
  $("#texto-lgpd").textContent = CFG.lgpd;

  function pintarCracha() {
    $("#c-codinome").textContent = E.codinome || "";
    $("#c-nome").textContent = $("#f-nome").value.trim() || "Seu nome aqui";
    const f = $("#f-area").value, e = $("#f-empresa").value.trim();
    $("#c-funcao").textContent = [f, e].filter(Boolean).join(" · ") || "Função · Empresa";
  }
  ["f-nome", "f-empresa", "f-area"].forEach(id => $("#" + id).addEventListener("input", pintarCracha));

  function sortearCodinomes() {
    const usados = new Set(E.ranking.map(r => r.codinome));
    const livres = M.embaralhar(M.CODINOMES.filter(c => !usados.has(c)));
    const lista = (livres.length >= 4 ? livres : M.embaralhar(M.CODINOMES)).slice(0, 4);
    E.codinome = lista[0];
    $("#f-codinome").innerHTML = lista.map((c, i) => `<button type="button" class="chip ${i ? "" : "marcado"}" data-v="${c}">${c}</button>`).join("")
      + `<button type="button" class="chip troca" id="b-outros">outros nomes</button>`;
    $$("#f-codinome .chip[data-v]").forEach(b => b.addEventListener("click", () => {
      SOM.clique();
      $$("#f-codinome .chip").forEach(o => o.classList.toggle("marcado", o === b));
      E.codinome = b.dataset.v; pintarCracha();
    }));
    $("#b-outros").addEventListener("click", () => { SOM.clique(); sortearCodinomes(); });
    pintarCracha();
  }

  function abrirCadastro() {
    $("#form-cadastro").reset();
    $$(".formulario .erro").forEach(e => e.textContent = "");
    $$(".formulario .invalido").forEach(e => e.classList.remove("invalido"));
    E.filial = null; E.canal = null;
    sortearCodinomes();
    irPara("t-cadastro");
    MUSICA.tocar("heroica");
  }

  const fone = $("#f-telefone");
  fone.addEventListener("input", () => {
    let v = fone.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, v.length > 10 ? 7 : 6)}-${v.slice(v.length > 10 ? 7 : 6)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length) v = `(${v}`;
    fone.value = v;
  });
  function erro(campo, msg) {
    const alvo = document.querySelector(`[data-erro="${campo}"]`);
    if (alvo) alvo.textContent = msg || "";
    const input = $("#" + campo), caixa = input && input.closest(".entrada");
    if (caixa) caixa.classList.toggle("invalido", !!msg);
    return !msg;
  }

  $("#form-cadastro").addEventListener("submit", async e => {
    e.preventDefault();
    const nome = $("#f-nome").value.trim().replace(/\s+/g, " "), email = $("#f-email").value.trim();
    const tel = $("#f-telefone").value.trim(), empresa = $("#f-empresa").value.trim();
    const area = $("#f-area").value, lgpd = $("#f-lgpd").checked;
    let ok = true;
    ok = erro("f-nome", nome.split(" ").filter(Boolean).length >= 2 ? "" : "Escreva nome e sobrenome") && ok;
    ok = erro("f-email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "E-mail inválido") && ok;
    ok = erro("f-telefone", tel.replace(/\D/g, "").length >= 10 ? "" : "Celular com DDD") && ok;
    ok = erro("f-empresa", empresa.length >= 2 ? "" : "Informe a empresa") && ok;
    ok = erro("f-area", area ? "" : "Escolha sua função") && ok;
    ok = erro("f-lgpd", lgpd ? "" : "Precisamos do seu aceite para continuar") && ok;
    if (!ok) { SOM.negado(); aviso("Confira os campos destacados"); return; }
    const btn = $("#b-cadastro");
    btn.disabled = true;
    E.piloto = await STORE.salvar({ nome, email, telefone: tel, empresa, area, codinome: E.codinome, consentimento: true, status: "cadastrado" });
    btn.disabled = false;
    SOM.trava();
    abrirZona();
  });

  /* ---------------- ZONA DE OPERACAO (mapa) ---------------- */
  const MP = window.MAPA;
  let vbAtual = [0, 0, MP.w, MP.h], vbAnim = null;

  function centroRegiao(reg) {
    let sx = 0, sy = 0, sa = 0;
    MP.estados.filter(e => e.r === reg).forEach(e => { sx += e.x * e.a; sy += e.y * e.a; sa += e.a; });
    return { x: sx / sa, y: sy / sa };
  }
  function montarMapa() {
    const svg = $("#mapa");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.classList.remove("tem");
    vbAtual = [-40, -30, MP.w + 80, MP.h + 60];
    svg.setAttribute("viewBox", vbAtual.join(" "));
    const ordem = MP.estados.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y));
    svg.innerHTML = ordem.map((e, i) => `<path class="uf r-${e.r}" data-r="${e.r}" data-uf="${e.uf}" d="${e.d}" pathLength="1" style="--d:${i * 45}ms"/>`).join("")
      + ["SSCO", "NENO"].map(r => { const c = centroRegiao(r); return `<text class="reg-rot" data-r="${r}" x="${c.x.toFixed(0)}" y="${(c.y + 20).toFixed(0)}">${r}</text>`; }).join("")
      + `<g id="mapa-alvos"></g>`;
    $$("#mapa .uf").forEach(p => p.addEventListener("click", () => escolherRegional(p.dataset.r)));
  }
  function animarVista(para, ms) {
    cancelAnimationFrame(vbAnim);
    const de = vbAtual.slice(), t0 = performance.now(), svg = $("#mapa");
    const passo = () => {
      const k = Math.min(1, (performance.now() - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      vbAtual = de.map((v, i) => v + (para[i] - v) * e);
      svg.setAttribute("viewBox", vbAtual.map(v => v.toFixed(1)).join(" "));
      if (k < 1) vbAnim = requestAnimationFrame(passo);
    };
    vbAnim = requestAnimationFrame(passo);
  }
  $("#mapa").addEventListener("pointermove", ev => {
    const r = $("#mapa").getBoundingClientRect();
    const x = vbAtual[0] + (ev.clientX - r.left) / r.width * vbAtual[2], y = vbAtual[1] + (ev.clientY - r.top) / r.height * vbAtual[3];
    const lat = 5.3 - y / MP.h * 39, lon = 74 - x / MP.w * 39.3;
    $("#mapa-coord").textContent = `LAT ${Math.abs(lat).toFixed(1)}${lat < 0 ? "S" : "N"} / LON ${lon.toFixed(1)}W`;
  });

  function resumoCanal(canal) {
    const blk = BASE.canais[E.filial + "|" + canal];
    const alvos = blk.iogurtes.alvos.length + blk.galbani.alvos.length;
    const escolhas = [blk.iogurtes, blk.galbani].reduce((t, m) => t + m.alvos.reduce((s, a) => s + a.q, 0), 0);
    const fixos = blk.iogurtes.fixos.length + blk.galbani.fixos.length;
    return { alvos, escolhas, fixos };
  }

  function abrirZona() {
    E.filial = null; E.canal = null;
    $("#b-missao").disabled = true; $("#b-sortear").disabled = true;
    $("#zp2").classList.add("travado");
    $("#mapa-estado").textContent = "AGUARDANDO REGIONAL";
    $("#reg-botoes").innerHTML = M.FILIAIS.map(f => `<button type="button" class="reg-btn" data-r="${f.id}"><b>${f.curto}</b><small>${f.nome}</small></button>`).join("");
    $$("#reg-botoes .reg-btn").forEach(b => b.addEventListener("click", () => escolherRegional(b.dataset.r)));
    $("#lista-canais").innerHTML = M.CANAIS.map(c => `<div class="canal"><span class="canal-ico">${A.iconeCanal(c.icone)}</span><span class="canal-txt"><b>${c.nome}</b><small>escolha a regional primeiro</small></span></div>`).join("");
    montarMapa();
    irPara("t-missao");
    VOZ.falar("missao");
  }

  function escolherRegional(reg) {
    if (E.filial === reg) return;
    E.filial = reg; E.canal = null;
    SOM.trava(); SOM.rasante();
    const fil = M.FILIAIS.find(f => f.id === reg);
    $("#mapa").classList.add("tem");
    $$("#mapa .uf").forEach(p => p.classList.toggle("sel", p.dataset.r === reg));
    $$("#mapa .reg-rot").forEach(t => t.classList.toggle("sel", t.dataset.r === reg));
    $("#mapa-alvos").innerHTML = "";
    const c = MP.caixas[reg], m = 70;
    animarVista([c[0] - m, c[1] - m, c[2] + m * 2, c[3] + m * 2], 900);
    $("#mapa-estado").textContent = `ZONA ${reg} TRAVADA · ${fil.nome.toUpperCase()}`;
    $$("#reg-botoes .reg-btn").forEach(b => b.classList.toggle("marcado", b.dataset.r === reg));
    $("#zp2").classList.remove("travado");
    $("#b-sortear").disabled = false; $("#b-missao").disabled = true;
    $("#lista-canais").innerHTML = M.CANAIS.map(cn => {
      const r = resumoCanal(cn.id);
      const nivel = Math.min(5, Math.max(1, Math.round(r.escolhas / 6)));
      return `<button type="button" class="canal" data-canal="${cn.id}">
        <span class="canal-ico">${A.iconeCanal(cn.icone)}</span>
        <span class="canal-txt"><b>${cn.nome}</b><small>${r.alvos} alvos · ${r.escolhas} SKUs para travar · ${r.fixos} fixos</small></span>
        <span class="canal-nivel">${"<i class=on></i>".repeat(nivel)}${"<i></i>".repeat(5 - nivel)}</span>
      </button>`;
    }).join("");
    $$("#lista-canais .canal").forEach(b => b.addEventListener("click", () => marcarCanal(b.dataset.canal, true)));
  }

  function marcarCanal(id, comSom) {
    E.canal = id;
    $$("#lista-canais .canal").forEach(o => o.classList.toggle("marcado", o.dataset.canal === id));
    $("#b-missao").disabled = false;
    const r = resumoCanal(id), cn = M.CANAIS.find(c => c.id === id);
    /* alvos espalhados pelos estados da regional */
    const ufs = MP.estados.filter(e => e.r === E.filial);
    const n = Math.min(r.alvos, 18);
    let h = "";
    for (let i = 0; i < n; i++) {
      const e = ufs[Math.floor(Math.random() * ufs.length)], raio = Math.sqrt(e.a) * .28;
      const x = e.x + (Math.random() - .5) * raio, y = e.y + (Math.random() - .5) * raio;
      h += `<g class="alvo-mapa" style="--d:${i * 55}ms"><circle class="p" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="13" style="animation-delay:${(i * .11).toFixed(2)}s"/><circle class="n" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4.5"/></g>`;
    }
    $("#mapa-alvos").innerHTML = h;
    $("#mapa-estado").textContent = `${r.alvos} ALVOS DETECTADOS · ${cn.curto.toUpperCase()}`;
    if (comSom) { SOM.trava(); SOM.alerta(); }
  }
  $("#b-sortear").addEventListener("click", async () => {
    const btns = $$("#lista-canais .canal[data-canal]");
    if (!btns.length) return;
    const final = Math.floor(Math.random() * btns.length), voltas = btns.length * 2 + final;
    for (let i = 0; i <= voltas; i++) {
      $$("#lista-canais .canal").forEach(o => o.classList.toggle("marcado", o === btns[i % btns.length]));
      SOM.clique();
      await esperar(60 + i * 9);
    }
    marcarCanal(btns[final].dataset.canal, true);
  });
  $("#b-missao").addEventListener("click", () => { if (E.canal && E.filial) { SOM.clique(); abrirBriefing(); } });

  /* ---------------- BRIEFING ---------------- */
  let bT = [];
  function abrirBriefing() {
    const c = M.CANAIS.find(x => x.id === E.canal), fil = M.FILIAIS.find(f => f.id === E.filial), r = resumoCanal(E.canal);
    E.missoes = M.montar(E.filial, E.canal);
    E.tempoRef = M.tempoReferencia(E.missoes);
    $("#briefing-sub").innerHTML = `Regional <b>${fil.curto}</b> · <b>${c.nome}</b>`;
    $("#brief-dados").innerHTML = [
      ["Piloto", esc(E.codinome), ""], ["Regional", fil.curto, ""], ["Canal", c.curto, ""],
      ["Alvos", r.alvos, "num"], ["SKUs para travar", r.escolhas, "num"], ["Carga fixa", r.fixos, "num"],
      ["Tempo de referência", M.formatarTempo(E.tempoRef), "num"]
    ].map(([k, v, cl]) => `<div><dt>${k}</dt><dd class="${cl}">${v}</dd></div>`).join("");
    irPara("t-briefing");
    cinemaBriefing(c, fil, r);
  }
  function fimCinemaBriefing() {
    bT.forEach(clearTimeout); bT = [];
    const b = $("#bcine");
    if (!b.classList.contains("on")) return;
    b.classList.add("sai");
    setTimeout(() => { b.classList.remove("on", "sai"); $("#bcine-cena").innerHTML = ""; }, 700);
  }
  function cinemaBriefing(c, fil, r) {
    const b = $("#bcine"), cena = $("#bcine-cena");
    b.classList.remove("sai"); b.classList.add("on");
    CINE.fundo($("#bcine-video"));
    MUSICA.tocar("heroica", { reiniciar: true, de: 0 });
    VOZ.falar("briefing");
    const zona = `ZONA: ${fil.curto} · ${c.curto.toUpperCase()}`, pil = `PILOTO: ${E.codinome}`;
    const cenas = [
      [0, `<span class="bc-tag">ORDEM DE MISSÃO // 2027</span><span class="bc-linha" style="--w:${pil.length}ch">${esc(pil)}</span><span class="bc-linha" style="--w:${zona.length}ch">${esc(zona)}</span>`, "trava"],
      [3400, `<div class="bc-numeros"><div><b data-n="${r.alvos}">0</b><span>ALVOS</span></div><div><b data-n="${r.escolhas}">0</b><span>SKUs PARA TRAVAR</span></div><div><b data-n="${r.fixos}">0</b><span>NA CARGA FIXA</span></div></div>`, "alerta"],
      [6600, `<i class="bc-ico">${A.ico("package")}</i><p class="bc-grande">A carga fixa<br><b>já embarcou</b></p><p class="bc-sub">os SKUs obrigatórios entram sozinhos</p>`, "rasante"],
      [9300, `<i class="bc-ico">${A.ico("crosshair")}</i><p class="bc-grande">Cada alvo é um<br><b>grupo de escolha</b></p><p class="bc-sub">trave no sonar a quantidade pedida</p>`, "rasante"],
      [12000, `<i class="bc-ico">${A.ico("trending-up")}</i><p class="bc-grande">Pense em<br><b>incremento</b></p><p class="bc-sub">o que mais vende e mais rende para a loja</p>`, "explosao"],
      [15400, `<i class="bc-ico" style="background:var(--laranja)">${A.ico("timer")}</i><p class="bc-grande lar">O tempo<br><b>não para</b></p><p class="bc-sub">precisão vale 80% · velocidade vale 20%</p>`, "rasante"]
    ];
    bT.forEach(clearTimeout); bT = [];
    cenas.forEach(([ms, html, som]) => bT.push(setTimeout(() => {
      cena.innerHTML = html;
      if (SOM[som]) SOM[som]();
      cena.querySelectorAll("[data-n]").forEach((el, i) => setTimeout(() => contar(0, +el.dataset.n, el, 900), i * 300));
    }, ms)));
    bT.push(setTimeout(fimCinemaBriefing, 18200));
  }
  $("#bcine-pular").addEventListener("click", () => { SOM.clique(); fimCinemaBriefing(); });

  /* ---------------- DECOLAGEM ---------------- */
  async function contagem(titulo) {
    const box = $("#contagem");
    box.classList.add("on");
    $("#contagem-t").textContent = titulo;
    for (const [n, v] of [["3", "tres"], ["2", "dois"], ["1", "um"]]) {
      $("#contagem-n").textContent = n;
      box.classList.remove("pulso"); void box.offsetWidth; box.classList.add("pulso");
      SOM.contagem(false); VOZ.falar(v);
      await esperar(760);
    }
    $("#contagem-n").textContent = "GO";
    box.classList.remove("pulso"); void box.offsetWidth; box.classList.add("pulso");
    SOM.contagem(true); SOM.decolar(); VOZ.falar("decolar");
    await esperar(900);
    box.classList.remove("on");
  }

  $("#b-iniciar").addEventListener("click", async () => {
    fimCinemaBriefing();
    E.mi = 0; E.res = {}; E.pontos = 0; E.sequencia = 0; E.acumulado = 0; E.rodando = false; E.registroFinal = null; E.avisouComb = false;
    $("#h-piloto").textContent = E.codinome;
    $("#h-pontos").textContent = "0"; $("#h-seq").textContent = "0";
    pintarTempo();
    irPara("t-jogo");
    MUSICA.tocar("acao", { reiniciar: true });
    const filme = CINE.tocar("decolagem", { dur: 5.4, tag: "PISTA 09 // DECOLAGEM" });
    await esperar(250);
    await contagem("MISSÃO 1 · IOGURTES");
    await filme;
    iniciarMissao(0);
  });

  /* ---------------- TEMPO ---------------- */
  function segundos() { return E.acumulado + (E.rodando ? (performance.now() - E.marco) / 1000 : 0); }
  function rodar() { if (E.rodando) return; E.rodando = true; E.marco = performance.now(); }
  function pausar() { if (!E.rodando) return; E.acumulado = segundos(); E.rodando = false; }
  let ultimoSeg = -1;
  function pintarTempo() {
    const s = segundos(), txt = M.formatarTempo(Math.floor(s));
    $("#h-tempo").textContent = txt; $("#s-tempo").textContent = txt;
    const f = Math.max(0, 1 - s / (E.tempoRef * 2.5));
    SONAR.tempo(f);
    const bonus = M.bonusVelocidade(s, E.tempoRef);
    const nivel = f > .5 ? "" : f > .25 ? "medio" : "baixo";
    $("#sonar-centro").className = "sonar-centro " + nivel;
    $("#s-bonus").textContent = bonus.fator >= 1 ? "BÔNUS CHEIO +" + M.milhar(bonus.pontos) : bonus.pontos > 0 ? "BÔNUS +" + M.milhar(bonus.pontos) : "SEM BÔNUS";
    const critico = nivel === "baixo" && E.rodando;
    $("#h-bloco-tempo").classList.toggle("alerta", critico);
    $("#alerta-borda").classList.toggle("on", critico);
    const seg = Math.floor(s);
    if (critico && seg !== ultimoSeg) SOM.tique();
    ultimoSeg = seg;
    if (nivel === "baixo" && !E.avisouComb && E.rodando) { E.avisouComb = true; SOM.alerta(); VOZ.falar("reserva"); aviso("Tempo na reserva: o bônus de velocidade está acabando"); }
  }
  setInterval(() => { if (document.body.dataset.tela === "t-jogo") pintarTempo(); }, 200);

  /* ---------------- MISSAO ---------------- */
  SONAR.iniciar($("#sonar"));
  const missao = () => E.missoes[E.mi];
  const alvo = () => missao().alvos[E.ai];

  async function iniciarMissao(mi) {
    E.mi = mi; E.ai = 0;
    const m = missao();
    $("#h-missao-n").textContent = `MISSÃO ${m.numero}/2`;
    $("#h-missao").textContent = m.nome;
    $("#h-fixos").textContent = m.fixos.length;
    $("#h-travados").textContent = "0";
    $("#radar").innerHTML = m.alvos.map((a, i) => `<i class="pip" data-i="${i}"></i>`).join("");
    $("#opcoes").innerHTML = ""; $("#sonar-selo").innerHTML = "";
    $("#alvo-nome").textContent = m.titulo; $("#alvo-ordem").innerHTML = "Preparar"; $("#alvo-apoio").textContent = "carga fixa embarcando"; $("#alvo-miras").innerHTML = "";
    SONAR.novosContatos(0);
    await embarque(m);
    await CINE.tocar("contato", { dur: 3.4, tag: "CAM 02 // CONTATO", mira: true,
      html: `<small>CONTATO NO RADAR</small><h3>${m.alvos.length} alvos avistados</h3><p>${esc(m.titulo)} · trave e dispare</p>`, cor: "#8DC63F" });
    mostrarAlvo();
    rodar();
  }

  async function embarque(m) {
    const box = $("#embarque"), fixos = m.fixos;
    box.innerHTML = `<div class="emb-caixa">
        <span class="etapa-tag">MISSÃO ${m.numero} // ${esc(m.titulo.toUpperCase())}</span>
        <h3>${fixos.length ? "Carga fixa embarcando" : "Sem carga fixa neste canal"}</h3>
        <p>${fixos.length ? `<b id="emb-n">0</b> de ${fixos.length} SKUs obrigatórios já estão no avião` : "Todo o mix desta missão depende das suas escolhas."}</p>
        <div class="emb-grade">${fixos.map((f, i) => `<span class="emb-item" style="--d:${i * 40}ms">${imgSku(f.e)}</span>`).join("")}</div>
      </div>`;
    box.classList.add("on");
    SOM.rasante();
    if (fixos.length) {
      setTimeout(() => VOZ.falar("carga"), Math.min(1800, 500 + fixos.length * 40));
      const dur = Math.min(2200, 800 + fixos.length * 40), t0 = performance.now();
      await new Promise(res => {
        const passo = () => {
          const k = Math.min(1, (performance.now() - t0) / dur), el = $("#emb-n");
          if (el) el.textContent = Math.round(k * fixos.length);
          if (k < 1) requestAnimationFrame(passo); else res();
        };
        requestAnimationFrame(passo);
      });
      await esperar(700);
    } else {
      await esperar(1700);
    }
    box.classList.remove("on");
  }

  /* cabe o maior cartao possivel no espaco que sobrou */
  function ajustarGrade() {
    const box = $("#opcoes"), n = box.children.length;
    if (!n) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const emPe = window.innerHeight > window.innerWidth;
    const gap = .8 * rem, W = box.clientWidth - 1.6 * rem, H = box.clientHeight - 1.6 * rem, prop = .8, teto = (emPe ? 21 : 16) * rem;
    let melhor = null;
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), vazios = cols * rows - n;
      const cw = Math.min((W - gap * (cols - 1)) / cols, ((H - gap * (rows - 1)) / rows) * prop, teto);
      if (!melhor || cw > melhor.cw + 1 || (Math.abs(cw - melhor.cw) <= 1 && vazios < melhor.vazios)) melhor = { cw, cols, vazios };
    }
    box.style.setProperty("--cols", melhor.cols);
    box.style.setProperty("--cw", Math.floor(melhor.cw) + "px");
    box.style.setProperty("--ch", Math.floor(melhor.cw / prop) + "px");
    box.style.setProperty("--gap", gap + "px");
  }
  window.addEventListener("resize", ajustarGrade);

  function mostrarAlvo() {
    const m = missao(), a = alvo();
    E.marcados = []; E.travado = false;
    $("#alvo-num").textContent = `${String(E.ai + 1).padStart(2, "0")}/${String(m.alvos.length).padStart(2, "0")}`;
    $("#alvo-nome").textContent = a.g;
    $("#alvo-ordem").innerHTML = `Trave <b>${a.q === 1 ? "1 SKU" : a.q + " SKUs"}</b>`;
    $("#alvo-apoio").textContent = a.q === 1 ? "o que mais incrementa a loja" : "os que mais incrementam a loja";
    $("#sonar-selo").innerHTML = "";
    $$("#radar .pip").forEach((p, i) => p.classList.toggle("atual", i === E.ai));
    const rot = SONAR.novosContatos(a.o.length);
    $("#opcoes").innerHTML = a.o.map((o, i) => `
      <button type="button" class="op" data-e="${o.e}" data-i="${i}" style="--d:${i * 55}ms">
        ${imgSku(o.e)}
        <span class="op-nome">${esc(M.sku(o.e).n)}</span>
        <span class="op-cod">${rot[i]}</span>
        <span class="op-mira"><i></i><i></i><i></i><i></i></span>
        <span class="op-lock">TRAVADO</span>
      </button>`).join("");
    $$("#opcoes .op").forEach(b => b.addEventListener("click", () => alternar(b)));
    ajustarGrade();
    const o = $("#ordem"); o.classList.remove("entra"); void o.offsetWidth; o.classList.add("entra");
    SOM.alerta();
    atualizarMiras();
  }

  function atualizarMiras() {
    const a = alvo(), n = E.marcados.length, pronto = n === a.q;
    $("#alvo-miras").innerHTML = Array.from({ length: a.q }, (_, i) => `<span class="mira-slot ${i < n ? "cheia" : ""}">${A.MIRA}</span>`).join("");
    const b = $("#b-disparar");
    b.disabled = !pronto; b.classList.toggle("pronto", pronto);
    $("#opcoes").classList.toggle("cheio", pronto);
    const feitos = Object.values(E.res).filter(r => r.missao === missao().id).reduce((t, r) => t + r.escolhidos.length, 0);
    $("#h-travados").textContent = feitos + n;
  }

  function alternar(btn) {
    if (E.travado) return;
    const e = btn.dataset.e, a = alvo(), i = E.marcados.indexOf(e);
    if (i >= 0) {
      E.marcados.splice(i, 1); btn.classList.remove("marcado"); SOM.destrava(); SONAR.travar(+btn.dataset.i, false);
    } else if (E.marcados.length < a.q) {
      E.marcados.push(e); btn.classList.add("marcado"); SOM.trava(); SONAR.travar(+btn.dataset.i, true);
    } else {
      SOM.negado();
      btn.classList.remove("treme"); void btn.offsetWidth; btn.classList.add("treme");
      aviso(`Este alvo pede ${a.q === 1 ? "1 SKU" : a.q + " SKUs"}. Toque num travado para soltar.`);
      return;
    }
    atualizarMiras();
  }

  $("#b-disparar").addEventListener("click", disparar);

  async function disparar() {
    const m = missao(), a = alvo();
    if (E.travado || E.marcados.length !== a.q) return;
    E.travado = true;
    pausar(); pintarTempo();
    $("#alerta-borda").classList.remove("on");
    const av = M.avaliarAlvo(a, E.marcados);
    const pts = M.pontosDoAlvo(m, a, av.p), g = av.grau.id, cor = COR_GRAU[g];
    E.res[a.id] = { missao: m.id, g: a.g, q: a.q, escolhidos: E.marcados.slice(), av, pts };
    E.sequencia = g === "perfeito" ? E.sequencia + 1 : 0;
    $("#h-seq").textContent = E.sequencia;

    /* 1) misseis no sonar */
    SOM.disparo();
    const idx = e => a.o.findIndex(o => o.e === e);
    const travados = E.marcados.map(idx), certos = E.marcados.filter(e => av.melhor.includes(e)).map(idx);
    $$("#opcoes .op:not(.marcado)").forEach(b => b.classList.add("apaga"));
    await SONAR.disparar(travados, certos, g);
    SOM.explosao();
    $$("#opcoes .op.marcado").forEach(b => b.classList.add(av.melhor.includes(b.dataset.e) ? "certo" : "errado"));
    const pip = $(`#radar .pip[data-i="${E.ai}"]`);
    pip.classList.remove("atual"); pip.classList.add(g);
    $("#sonar-selo").innerHTML = `<b style="--c:${cor}">${av.grau.nome}</b><span>+${M.milhar(pts)}</span>`;
    ({ perfeito: SOM.perfeito, bom: SOM.bom, raspao: SOM.raspao, erro: SOM.erro })[g]();
    VOZ.falar(E.sequencia >= 3 ? "sequencia" : g);
    if (g === "perfeito" && window.confetti) confetti({ particleCount: 70, spread: 75, startVelocity: 40, origin: { y: .45 }, colors: ["#8DC63F", "#FFFFFF", "#F47B20"], ticks: 130 });
    contar(E.pontos, E.pontos + pts, $("#h-pontos"), 700);
    E.pontos += pts;
    await esperar(850);

    /* 2) corte de combate com o resultado */
    const estrelas = [0, 1, 2].map(i => `<i class="${i < av.grau.estrelas ? "on" : ""}">★</i>`).join("");
    SOM.rasante();
    await CINE.combate({ dur: 1.75, mira: g !== "erro", cor, tag: "CAM 0" + (3 + (E.ai % 5)) + " // COMBATE",
      html: `<div class="estrelas">${estrelas}</div><h3>${av.grau.nome}</h3><p>${av.grau.sub}</p><b>+${M.milhar(pts)}</b>${E.sequencia >= 2 ? `<span class="seq">SEQUÊNCIA x${E.sequencia}</span>` : ""}` });

    if (E.ai < m.alvos.length - 1) { E.ai++; mostrarAlvo(); rodar(); }
    else fimMissao();
  }

  function contar(de, ate, el, dur) {
    const t0 = performance.now();
    const passo = () => {
      const k = Math.min(1, (performance.now() - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = M.milhar(de + (ate - de) * e);
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }
  function confete(forca) {
    if (!window.confetti) return;
    const cores = ["#F47B20", "#8DC63F", "#FFFFFF", "#2F7BE8"];
    confetti({ particleCount: Math.round(160 * forca), spread: 80, startVelocity: 55, origin: { y: .35 }, colors: cores, scalar: 1.2 });
    setTimeout(() => {
      confetti({ particleCount: Math.round(70 * forca), angle: 60, spread: 60, origin: { x: 0, y: .6 }, colors: cores });
      confetti({ particleCount: Math.round(70 * forca), angle: 120, spread: 60, origin: { x: 1, y: .6 }, colors: cores });
    }, 350);
  }

  function resumoMissao(mid) {
    const rs = Object.values(E.res).filter(r => r.missao === mid);
    const pts = rs.reduce((t, r) => t + r.pts, 0);
    const perf = rs.filter(r => r.av.grau.id === "perfeito").length;
    const vE = rs.reduce((t, r) => t + r.av.vendaEscolha, 0), vM = rs.reduce((t, r) => t + r.av.vendaMelhor, 0);
    return { pts: Math.round(pts), perf, total: rs.length, venda: vM > 0 ? Math.min(1, vE / vM) : 1 };
  }

  let autoT = null;
  function fimMissao() {
    pausar();
    if (E.mi === 0) {
      const r = resumoMissao("iogurtes"), prox = E.missoes[1];
      $("#int-tag").textContent = "MISSÃO 1 // CONCLUÍDA";
      $("#int-titulo").textContent = r.perf === r.total ? "Missão perfeita" : "Missão cumprida";
      $("#int-numeros").innerHTML = `
        <div><b>${M.milhar(r.pts)}</b><span>pontos na missão</span></div>
        <div><b>${r.perf}/${r.total}</b><span>alvos perfeitos</span></div>
        <div><b>${M.formatarTempo(Math.floor(segundos()))}</b><span>tempo de voo</span></div>`;
      $("#int-prox").innerHTML = `<span class="etapa-tag">PRÓXIMA</span><h3>${prox.titulo}</h3><p>${prox.alvos.length} alvos · ${prox.fixos.length} SKUs na carga fixa · ${esc(prox.marca)}</p>`;
      irPara("t-intervalo");
      SOM.vitoria(); VOZ.falar("cumprida");
      let n = 10;
      $("#int-auto").textContent = `SEGUE SOZINHO EM ${n}s`;
      clearInterval(autoT);
      autoT = setInterval(() => {
        n--; $("#int-auto").textContent = `SEGUE SOZINHO EM ${n}s`;
        if (n <= 0) { clearInterval(autoT); proximaMissao(); }
      }, 1000);
    } else finalizar();
  }
  async function proximaMissao() {
    clearInterval(autoT);
    if (document.body.dataset.tela !== "t-intervalo") return;
    irPara("t-jogo");
    await esperar(300);
    await contagem("MISSÃO 2 · GALBANI");
    iniciarMissao(1);
  }
  $("#b-continuar").addEventListener("click", () => { SOM.clique(); proximaMissao(); });

  /* ---------------- DEBRIEF ---------------- */
  async function finalizar() {
    const seg = Math.round(segundos());
    const bonus = M.bonusVelocidade(seg, E.tempoRef);
    E.pontos = Math.round(E.pontos);
    const total = E.pontos + bonus.pontos, pat = M.patente(total);
    const rI = resumoMissao("iogurtes"), rG = resumoMissao("galbani");
    const todos = Object.values(E.res);
    const perf = todos.filter(r => r.av.grau.id === "perfeito").length;
    const pesoQ = todos.reduce((t, r) => t + r.q, 0) || 1;
    const precisao = todos.reduce((t, r) => t + r.av.p * r.q, 0) / pesoQ;
    const vE = todos.reduce((t, r) => t + r.av.vendaEscolha, 0), vM = todos.reduce((t, r) => t + r.av.vendaMelhor, 0);
    const venda = vM > 0 ? Math.min(1, vE / vM) : 1;
    const canal = M.CANAIS.find(c => c.id === E.canal), fil = M.FILIAIS.find(f => f.id === E.filial);

    const filme = CINE.tocar("vitoria", { dur: 3.8, tag: "CAM 09 // RETORNO", cor: "#8DC63F",
      html: `<small>MISSÃO CUMPRIDA</small><h3>Retorno à base</h3><p>Calculando seu resultado</p>` });
    MUSICA.tocar("vitoria", { reiniciar: true });
    SOM.vitoria();

    const reg = Object.assign({}, E.piloto, {
      status: "concluido", filial: E.filial, filialNome: fil.nome, canal: E.canal, canalNome: canal.nome,
      pontuacao: total, pontosPrecisao: E.pontos, bonusVelocidade: bonus.pontos,
      patente: pat.nome, segundos: seg, precisao: Math.round(precisao * 1000) / 10,
      vendaCapturada: Math.round(venda * 1000) / 10, alvosPerfeitos: perf, alvosTotal: todos.length,
      missoes: E.missoes.map(m => ({
        id: m.id, pontos: resumoMissao(m.id).pts,
        alvos: m.alvos.map(a => {
          const r = E.res[a.id];
          return { grupo: a.g, quantidade: a.q, nota: Math.round(r.av.p * 100),
            escolhidos: r.escolhidos.map(e => M.sku(e).n), ideal: r.av.melhor.map(e => M.sku(e).n) };
        })
      }))
    });
    E.registroFinal = await STORE.salvar(reg);
    E.piloto = E.registroFinal;

    $("#r-insignia").innerHTML = A.insignia(pat.divisas);
    $("#r-patente").textContent = pat.nome.toUpperCase();
    $("#r-nome").textContent = `${E.codinome} · ${E.piloto.nome}`;
    $("#r-pontos").textContent = "0";
    $("#r-posicao").innerHTML = "";
    $("#r-kpis").innerHTML = `
      <div class="kpi"><b>${M.pct(precisao)}</b><span>precisão das escolhas</span></div>
      <div class="kpi"><b>${M.pct(venda)}</b><span>da venda potencial capturada</span></div>
      <div class="kpi"><b>${perf}/${todos.length}</b><span>alvos perfeitos</span></div>
      <div class="kpi"><b>${M.formatarTempo(seg)}</b><span>bônus de velocidade +${M.milhar(bonus.pontos)}</span></div>
      <div class="kpi mini"><b>${M.milhar(rI.pts)}</b><span>Missão Iogurtes</span></div>
      <div class="kpi mini"><b>${M.milhar(rG.pts)}</b><span>Missão Galbani</span></div>`;
    pintarRevisao();
    mostrarAba("ab-ranking");
    if (!E.ranking.find(r => r.id === E.registroFinal.id)) E.ranking = STORE.ordenar(E.ranking.concat([E.registroFinal]));
    await filme;
    irPara("t-debrief");
    pintarRanking();
    VOZ.falar("pouso").then(() => {
      const p = STORE.posicao(E.ranking, E.registroFinal.id);
      if (p && p <= CFG.zonaPremio) VOZ.falar("zona");
    });
    await esperar(350);
    contar(0, total, $("#r-pontos"), 1800);
    setTimeout(() => confete(pat.divisas >= 3 ? 1 : .45), 1700);
    contadorFinal();
  }

  function pintarRanking() {
    const lista = E.ranking, meu = E.registroFinal;
    if (!meu) return;
    const pos = STORE.posicao(lista, meu.id);
    if (pos) $("#r-posicao").innerHTML = `<b>${pos}º</b>de ${lista.length} ${lista.length === 1 ? "piloto" : "pilotos"}${pos <= CFG.zonaPremio ? `<em>ZONA DE PREMIAÇÃO</em>` : ""}`;
    const top3 = lista.slice(0, 3);
    $("#r-podio").innerHTML = [1, 0, 2].map(i => {
      const r = top3[i];
      if (!r) return `<div class="degrau d${i + 1} vazio"><div class="bloco"><i>${i + 1}</i></div></div>`;
      return `<div class="degrau d${i + 1} ${r.id === meu.id ? "voce" : ""}">
        <span class="avatar">${esc((r.codinome || "P").slice(0, 2))}</span>${quem(r)}
        <em>${M.milhar(r.pontuacao)}</em><div class="bloco"><i>${i + 1}</i></div></div>`;
    }).join("");
    const resto = lista.slice(3, 10).map((r, k) => ({ r, p: k + 4 }));
    if (pos && pos > 10) resto.push({ r: meu, p: pos, longe: true });
    const max = lista[0] ? lista[0].pontuacao : 1;
    $("#r-ranking").innerHTML = resto.map(({ r, p, longe }) => `
      <li class="${r.id === meu.id ? "voce" : ""} ${p <= CFG.zonaPremio ? "zona" : ""} ${longe ? "longe" : ""}">
        <i>${p}</i>${quem(r)}
        <span class="barra"><s style="width:${Math.max(4, r.pontuacao / max * 100)}%"></s></span>
        <b>${M.milhar(r.pontuacao)}</b>
      </li>`).join("");
  }

  function pintarRevisao() {
    $("#r-revisao").innerHTML = E.missoes.map(m => `
      <h3 class="rev-missao">Missão ${m.numero} · ${esc(m.nome)}<small>${M.milhar(resumoMissao(m.id).pts)} pts</small></h3>
      ${m.alvos.map((a, i) => {
        const r = E.res[a.id];
        const itens = a.o.filter(o => r.escolhidos.includes(o.e) || r.av.melhor.includes(o.e));
        return `<div class="rev-alvo g-${r.av.grau.id}">
          <div class="rev-cab"><span>ALVO ${String(i + 1).padStart(2, "0")}</span><b>${esc(a.g)}</b><em>${r.av.grau.nome}</em></div>
          <div class="rev-itens">${itens.map(o => {
            const meu = r.escolhidos.includes(o.e), ideal = r.av.melhor.includes(o.e);
            return `<span class="rev-item ${meu && ideal ? "ok" : meu ? "x" : "ideal"}">${imgSku(o.e)}<small>${esc(M.sku(o.e).n)}${o.f ? " · fora do sortimento" : ""}</small></span>`;
          }).join("")}</div>
        </div>`;
      }).join("")}`).join("");
  }

  function mostrarAba(id) {
    $$(".aba").forEach(a => a.classList.toggle("ativa", a.dataset.aba === id));
    $$(".aba-corpo").forEach(c => c.classList.toggle("ativa", c.id === id));
  }
  $$(".aba").forEach(a => a.addEventListener("click", () => { SOM.clique(); mostrarAba(a.dataset.aba); }));

  let finalT = null;
  function contadorFinal() {
    let n = 80;
    clearInterval(finalT);
    finalT = setInterval(() => {
      n--;
      $("#r-auto").textContent = n <= 20 ? `VOLTANDO PARA A BASE EM ${n}s` : "";
      if (n <= 0 || document.body.dataset.tela !== "t-debrief") { clearInterval(finalT); if (n <= 0) voltarBase(); }
    }, 1000);
  }
  $("#b-nova").addEventListener("click", () => { SOM.clique(); voltarBase(); });

  function voltarBase() {
    clearInterval(finalT); clearInterval(autoT);
    pausar(); fimCinemaBriefing();
    E.piloto = null; E.registroFinal = null; E.canal = null; E.filial = null;
    $("#ocioso").hidden = true;
    ["#contagem", "#embarque", "#cine"].forEach(s => $(s).classList.remove("on"));
    irPara("t-espera");
    MUSICA.tocar("heroica");
    /* no modo local o ranking nao chega sozinho: rele ao voltar */
    STORE.listar().then(l => { E.ranking = STORE.ordenar(l); pintarEspera(E.ranking); });
  }

  /* ---------------- OCIOSO (totem) ---------------- */
  let ultimoToque = Date.now(), ociosoT = null;
  ["pointerdown", "keydown", "input", "click"].forEach(ev => window.addEventListener(ev, () => { ultimoToque = Date.now(); }, { passive: true }));
  setInterval(() => {
    const tela = document.body.dataset.tela;
    if (!tela || tela === "t-espera" || tela === "t-debrief" || tela === "t-intervalo") return;
    if (!$("#ocioso").hidden || $("#bcine").classList.contains("on") || $("#cine").classList.contains("on")) return;
    if ((Date.now() - ultimoToque) / 1000 > CFG.ociosoSegundos) {
      const estava = E.rodando;
      pausar();
      $("#ocioso").hidden = false;
      SOM.alerta(); VOZ.falar("ocioso");
      let n = 10;
      $("#ocioso-n").textContent = n;
      clearInterval(ociosoT);
      ociosoT = setInterval(() => { n--; $("#ocioso-n").textContent = n; if (n <= 0) { clearInterval(ociosoT); voltarBase(); } }, 1000);
      $("#b-ocioso").onclick = () => { clearInterval(ociosoT); $("#ocioso").hidden = true; ultimoToque = Date.now(); if (estava) rodar(); };
    }
  }, 1000);

  window.addEventListener("contextmenu", e => { if (e.target.closest(".op, button, video")) e.preventDefault(); });
  document.addEventListener("gesturestart", e => e.preventDefault());

  /* ---------------- VINHETA (abertura em loop na espera) ---------------- */
  const vin = $("#vinheta");
  vin.querySelector(".vin-logo").innerHTML = A.LOGO;
  vin.querySelector(".vin-jato").innerHTML = A.JATO;
  let vinT = [], vinAtiva = false;
  function pararVinheta() { vinT.forEach(clearTimeout); vinT = []; vin.className = "vinheta"; vinAtiva = false; }
  function vinheta() {
    if (document.body.dataset.tela !== "t-espera" || vinAtiva) return;
    vinAtiva = true;
    CINE.fundo($("#vin-video"));
    [[0, "c1"], [2600, "c2"], [5200, "c3"], [9000, "c4"], [12600, "sai"], [13400, ""]].forEach(([ms, c]) => vinT.push(setTimeout(() => {
      if (!c) { pararVinheta(); return; }
      vin.className = "vinheta on " + c;
      if (c === "c2") SOM.rasante();
      if (c === "c3") SOM.explosao();
    }, ms)));
  }
  vin.addEventListener("pointerdown", e => { e.preventDefault(); pararVinheta(); });
  setInterval(() => {
    if (document.body.dataset.tela === "t-espera" && (Date.now() - ultimoToque) / 1000 > 45) { ultimoToque = Date.now(); vinheta(); }
  }, 2000);

  irPara("t-espera");
  MUSICA.tocar("heroica");
  setTimeout(vinheta, 500);
})();
