/* ==========================================================================
   MIX+ DPA | fluxo da atividade
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const estado = {
    participante: null,
    formato: null,
    etapaIdx: 0,
    etapa: null,
    lista: [],          /* opcoes da etapa */
    marcados: [],       /* ids escolhidos */
    escolhas: {},
    tempos: {},
    inicio: 0,
    cronometro: null,
    filtro: "todos",
    busca: "",
    resultado: null,
    desligarRanking: null
  };

  const params = new URLSearchParams(location.search);
  if (params.get("tablet")) CFG.tablet = params.get("tablet");

  function irPara(id) {
    $$(".tela").forEach(t => t.classList.remove("ativa"));
    $("#" + id).classList.add("ativa");
    window.scrollTo(0, 0);
  }
  let avisoTimer = null;
  function aviso(txt) {
    const el = $("#aviso");
    el.textContent = txt;
    el.classList.add("aparece");
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => el.classList.remove("aparece"), 2400);
  }
  const relogio = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  const normal = t => (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const seg = s => SEGMENTOS[s] || { nome: s, cor: "#1B4F9C" };

  /* ---------------- abertura ---------------- */
  $("#nome-evento").textContent = CFG.evento + (CFG.tablet ? " | tablet " + CFG.tablet : "");
  $("#texto-lgpd").textContent = CFG.lgpd;
  $("#btn-comecar").addEventListener("click", () => irPara("tela-cadastro"));
  STORE.listar().then(l => {
    const n = l.filter(r => r.status === "concluido").length;
    if (n) $("#contador-jogadores").textContent =
      n === 1 ? "1 participante já montou o MIX" : n + " participantes já montaram o MIX";
  });

  /* ---------------- cadastro ---------------- */
  const fone = $("#f-telefone");
  fone.addEventListener("input", () => {
    let v = fone.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2, v.length > 10 ? 7 : 6)}-${v.slice(v.length > 10 ? 7 : 6)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length) v = `(${v}`;
    fone.value = v;
  });
  function erro(campo, msg) {
    const alvo = document.querySelector(`[data-erro="${campo}"]`);
    if (alvo) alvo.textContent = msg || "";
    const input = $("#" + campo);
    if (input) input.classList.toggle("invalido", !!msg);
    return !msg;
  }

  $("#form-cadastro").addEventListener("submit", async e => {
    e.preventDefault();
    const nome = $("#f-nome").value.trim(), email = $("#f-email").value.trim();
    const empresa = $("#f-empresa").value.trim(), tel = $("#f-telefone").value.trim();
    const area = $("#f-area").value, lgpd = $("#f-lgpd").checked;
    let ok = true;
    ok = erro("f-nome", nome.split(" ").filter(Boolean).length >= 2 ? "" : "Escreva nome e sobrenome") && ok;
    ok = erro("f-email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "E-mail inválido") && ok;
    ok = erro("f-empresa", empresa.length >= 2 ? "" : "Informe a empresa ou loja") && ok;
    ok = erro("f-telefone", (!tel || tel.replace(/\D/g, "").length >= 10) ? "" : "Telefone com DDD, por favor") && ok;
    ok = erro("f-area", area ? "" : "Escolha sua área") && ok;
    ok = erro("f-lgpd", lgpd ? "" : "Precisamos do seu aceite para continuar") && ok;
    if (!ok) return;
    const btn = $("#btn-cadastro");
    btn.disabled = true; btn.textContent = "Salvando...";
    estado.participante = await STORE.salvar({
      nome, email, empresa, telefone: tel, area, consentimento: true, status: "cadastrado",
      dispositivo: navigator.userAgent.includes("Mobi") ? "celular" : "tablet ou computador"
    });
    btn.disabled = false; btn.textContent = "Iniciar";
    estado.etapaIdx = 0; estado.escolhas = {}; estado.tempos = {};
    montarFormatos();
    irPara("tela-formato");
  });

  /* ---------------- formato de loja ---------------- */
  function montarFormatos() {
    $("#lista-formatos").innerHTML = FORMATOS.map(f => {
      const p = PLANOS[f.id];
      const et = ETAPAS[0];
      return `<button type="button" class="cartao-formato" data-formato="${f.id}">
        <span class="chip">${f.resumo}</span>
        <h3>${f.nome}</h3>
        <p>${f.detalhe}</p>
        <div class="numeros">
          <div><b>${p.core.length}</b><span>SKUs de maior volume já na loja</span></div>
          <div><b>${et.escolhas}</b><span>produtos você pode incluir</span></div>
          <div><b>${p.skusPlano.length}</b><span>SKUs no plano da companhia</span></div>
        </div>
      </button>`;
    }).join("");
    $$("#lista-formatos .cartao-formato").forEach(el => el.addEventListener("click", () => {
      $$("#lista-formatos .cartao-formato").forEach(o => o.classList.remove("marcado"));
      el.classList.add("marcado");
      estado.formato = el.dataset.formato;
      $("#btn-confirmar-formato").disabled = false;
    }));
  }
  $("#btn-confirmar-formato").addEventListener("click", () => { if (estado.formato) abrirAvisoEtapa(); });

  /* ---------------- aviso de etapa ---------------- */
  function montarPassos() {
    $("#passos-topo").innerHTML = ETAPAS.map((e, i) => {
      const cls = i < estado.etapaIdx ? "feito" : i === estado.etapaIdx ? "ativo" : "";
      return `<span class="passo-chip ${cls}"><b>${e.numero}</b>${e.nome}</span>`;
    }).join("");
  }
  function abrirAvisoEtapa() {
    const e = ETAPAS[estado.etapaIdx];
    estado.etapa = e;
    montarPassos();
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    const base = MOTOR.fixos(e, estado.formato);
    const lista = MOTOR.opcoes(e, estado.formato);
    $("#etapa-numero").textContent = e.numero;
    $("#etapa-marca").textContent = e.nome;
    $("#etapa-titulo").textContent = e.titulo;
    $("#etapa-resumo").textContent = e.resumo;
    $("#etapa-regras").innerHTML = `
      <div class="regra"><b>${base.length}</b><p>SKUs de maior volume já estão no sortimento de ${fmt.nome.toLowerCase()}.</p></div>
      <div class="regra"><b>${e.escolhas}</b><p>produtos você pode incluir. Escolha os que mais somam venda e margem.</p></div>
      <div class="regra"><b>${lista.length}</b><p>opções na lista, de todas as categorias. Nem toda opção serve para esta loja.</p></div>`;
    irPara("tela-etapa");
  }
  $("#btn-abrir-etapa").addEventListener("click", iniciarEtapa);

  /* ---------------- seleção ---------------- */
  function iniciarEtapa() {
    const e = estado.etapa;
    estado.lista = MOTOR.opcoes(e, estado.formato);
    estado.marcados = [];
    estado.filtro = "todos"; estado.busca = "";
    $("#busca").value = "";
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    const base = MOTOR.fixos(e, estado.formato);
    $("#m-etapa").textContent = "Etapa " + e.numero;
    $("#m-etapa-nome").textContent = e.nome;
    $("#plano-titulo").textContent = "A loja já trabalha";
    $("#plano-sub").textContent = base.length + " SKUs de maior volume em " + fmt.nome.toLowerCase() +
      ". Esses já estão garantidos no sortimento.";
    $("#titulo-escolha").textContent = "Escolha até " + e.escolhas + " produtos para incluir";
    $("#catalogo-dica").textContent = e.instrucao;
    $("#btn-confirmar").textContent = "Confirmar etapa " + e.numero;
    desenharFixos(base);
    montarAbas();
    desenharLista();
    atualizarContador();
    estado.inicio = Date.now();
    clearInterval(estado.cronometro);
    estado.cronometro = setInterval(() => {
      const s = Math.floor((Date.now() - estado.inicio) / 1000) + (estado.tempos.acumulado || 0);
      $("#m-tempo").textContent = relogio(s);
    }, 500);
    irPara("tela-jogo");
  }

  function desenharFixos(base) {
    $("#fixos").innerHTML = base.map(s => `
      <div class="fixo" title="${s.nome}">
        <img src="${s.arquivo}" alt="${s.nome}" loading="lazy">
        <span>${s.nome}</span>
      </div>`).join("");
  }

  function montarAbas() {
    const segs = [...new Set(estado.lista.map(MOTOR.catDe))];
    $("#abas").innerHTML = [`<button data-seg="todos" class="ativo">Todas</button>`]
      .concat(segs.map(s => `<button data-seg="${s}">${seg(s).nome}</button>`)).join("");
    $$("#abas button").forEach(b => b.addEventListener("click", () => {
      $$("#abas button").forEach(o => o.classList.remove("ativo"));
      b.classList.add("ativo");
      estado.filtro = b.dataset.seg;
      desenharLista();
    }));
  }

  function desenharLista() {
    const e = estado.etapa;
    const busca = normal(estado.busca);
    const lista = estado.lista.filter(s => {
      const cat = MOTOR.catDe(s);
      const okSeg = estado.filtro === "todos" || cat === estado.filtro;
      const okBusca = !busca || normal(s.nome).includes(busca) || normal(s.marca).includes(busca) || (s.ean || "").includes(busca);
      return okSeg && okBusca;
    });
    if (!lista.length) {
      $("#lista").innerHTML = `<p style="font-size:13px;color:var(--texto-suave)">Nenhum produto encontrado.</p>`;
      return;
    }
    const cheio = estado.marcados.length >= e.escolhas;
    $("#lista").innerHTML = lista.map(s => {
      const cat = seg(MOTOR.catDe(s));
      const marcado = estado.marcados.includes(s.id);
      return `<label class="item ${marcado ? "dentro" : ""} ${!marcado && cheio ? "bloqueado" : ""}" data-sku="${s.id}">
        <img src="${s.arquivo}" alt="${s.nome}" draggable="false" loading="lazy">
        <div>
          <b>${s.nome}</b>
          <small>${s.marca}</small>
          <span class="selo" style="background:${cat.cor}">${cat.nome}</span>
        </div>
        <span class="caixa">${marcado ? "✓" : ""}</span>
      </label>`;
    }).join("");
    $$("#lista .item").forEach(el => el.addEventListener("click", ev => {
      ev.preventDefault();
      alternar(el.dataset.sku);
    }));
  }

  function alternar(id) {
    const e = estado.etapa;
    const i = estado.marcados.indexOf(id);
    if (i >= 0) estado.marcados.splice(i, 1);
    else {
      if (estado.marcados.length >= e.escolhas) {
        aviso("Você já escolheu " + e.escolhas + " produtos. Desmarque um para trocar.");
        return;
      }
      estado.marcados.push(id);
    }
    desenharLista();
    atualizarContador();
  }

  function atualizarContador() {
    const e = estado.etapa;
    const n = estado.marcados.length;
    const ultima = estado.etapaIdx === ETAPAS.length - 1;
    $("#m-espacos").textContent = n + " / " + e.escolhas;
    $("#contador").innerHTML = `<b>${n}</b><span>de ${e.escolhas}</span>`;
    $("#contador").classList.toggle("completo", n === e.escolhas);
    const barra = $("#m-barra");
    if (barra) barra.style.width = (n / e.escolhas * 100) + "%";

    /* barra de ação: as bolinhas mostram o que já foi escolhido */
    $("#bolinhas").innerHTML = Array.from({ length: e.escolhas }, (_, i) =>
      `<i class="${i < n ? "cheia" : ""}"></i>`).join("");
    $("#texto-selecao").textContent = n === 0
      ? "Escolha até " + e.escolhas + " produtos"
      : n + " de " + e.escolhas + (n === 1 ? " produto escolhido" : " produtos escolhidos");
    $("#texto-apoio").textContent = n === e.escolhas
      ? "Seleção completa. Pode seguir."
      : n === 0 ? "Marque os que você incluiria nesta loja"
      : "Ainda dá para incluir " + (e.escolhas - n);
    const btn = $("#btn-continuar");
    btn.textContent = ultima ? "Ver meu resultado" : "Continuar para a etapa " + (e.numero + 1);
    btn.classList.toggle("pronto", n === e.escolhas);
    btn.classList.toggle("apagado", n === 0);
    document.body.classList.toggle("com-barra-acao", true);
  }

  $("#busca").addEventListener("input", e => { estado.busca = e.target.value; desenharLista(); });
  $("#btn-limpar").addEventListener("click", () => {
    if (!estado.marcados.length) return;
    estado.marcados = [];
    desenharLista(); atualizarContador();
  });

  /* ---------------- confirmar ---------------- */
  function confirmarEtapa() {
    const e = estado.etapa;
    const faltam = e.escolhas - estado.marcados.length;
    if (faltam > 0 && !confirm(`Você ainda pode incluir ${faltam} ${faltam === 1 ? "produto" : "produtos"}. Confirmar assim mesmo?`)) return;
    clearInterval(estado.cronometro);
    const gastos = Math.max(1, Math.floor((Date.now() - estado.inicio) / 1000));
    estado.tempos[e.id] = gastos;
    estado.tempos.acumulado = (estado.tempos.acumulado || 0) + gastos;
    estado.escolhas[e.id] = estado.marcados.slice();
    document.body.classList.remove("com-barra-acao");
    if (estado.etapaIdx < ETAPAS.length - 1) { estado.etapaIdx++; abrirAvisoEtapa(); }
    else finalizar();
  }
  $("#btn-confirmar").addEventListener("click", confirmarEtapa);
  $("#btn-continuar").addEventListener("click", confirmarEtapa);

  /* ---------------- resultado ---------------- */
  async function finalizar() {
    const resultados = ETAPAS.map(e => MOTOR.avaliarEtapa(e, estado.escolhas[e.id] || [], estado.formato));
    const segundos = estado.tempos.acumulado || 0;
    const nota = MOTOR.pontuar(resultados, segundos);
    estado.resultado = { resultados, nota };
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    const incremento = resultados.reduce((t, r) => t + r.incremento, 0);
    const tetoTotal = resultados.reduce((t, r) => t + r.teto, 0);

    const registro = Object.assign({}, estado.participante, {
      status: "concluido",
      formato: estado.formato,
      formatoNome: fmt ? fmt.nome : "",
      pontuacao: nota.total,
      nivel: nota.nivel,
      segundos,
      incremento, tetoIncremento: tetoTotal,
      temposEtapas: ETAPAS.reduce((o, e) => (o[e.id] = estado.tempos[e.id] || 0, o), {}),
      blocos: nota.blocos.reduce((o, b) => (o[b.chave] = b.pontos, o), {}),
      etapas: resultados.map(r => ({
        etapa: r.etapa.id,
        escolhidos: r.escolhidos.map(s => s.nome),
        incremento: r.incremento, teto: r.teto,
        acertos: r.acertos.length,
        perdidos: r.perdidos.map(s => s.nome),
        foraDoPlano: r.foraDoPlano.map(s => s.nome),
        categorias: r.categorias
      }))
    });
    estado.participante = await STORE.salvar(registro);
    montarResultado();
    irPara("tela-resultado");
  }

  function montarResultado() {
    const { resultados, nota } = estado.resultado;
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    const incremento = resultados.reduce((t, r) => t + r.incremento, 0);
    const teto = resultados.reduce((t, r) => t + r.teto, 0);
    $("#res-nome").textContent = estado.participante.nome +
      (estado.participante.empresa ? " | " + estado.participante.empresa : "") +
      (fmt ? " | " + fmt.nome : "");
    $("#res-pontos").innerHTML = nota.total + "<small>/1000</small>";
    $("#res-nivel").textContent = nota.nivel;
    $("#res-financeiro").innerHTML = `
      <div class="fat-bloco"><span>Seu mix adiciona</span><b>${MOTOR.dinheiro(incremento)}</b></div>
      <div class="fat-seta">→</div>
      <div class="fat-bloco"><span>Melhor escolha possível</span><b>${MOTOR.dinheiro(teto)}</b></div>
      <div class="fat-bloco destaque"><span>Você capturou</span><b>${Math.round(incremento / Math.max(1, teto) * 100)}%</b></div>`;

    $("#res-blocos").innerHTML = nota.blocos.map(b => `
      <div class="bloco">
        <b>${b.pontos}<i> / ${b.max}</i></b>
        <h4>${b.nome}</h4>
        <p>${b.detalhe}</p>
        <div class="barra-nota"><i style="width:${(b.pontos / b.max * 100).toFixed(0)}%"></i></div>
      </div>`).join("");

    $("#res-etapas").innerHTML = resultados.map(r => {
      const fid = estado.formato;
      const linha = (s, classe, extra) => `
        <div class="linha-item ${classe}">
          <img src="${s.arquivo}" alt="">
          <div><b>${s.nome}</b><small>${extra}</small></div>
          <div class="valor">${MOTOR.dinheiro(MOTOR.potencial(s, fid))}</div>
        </div>`;
      const bons = r.acertos.slice(0, 4).map(s => linha(s, "ok",
        seg(MOTOR.catDe(s)).nome + " · margem " + MOTOR.margem(s).toFixed(1))).join("")
        || `<p style="font-size:13px;color:var(--texto-suave)">Nenhuma das escolhas estava entre as de maior potencial.</p>`;
      const faltou = r.perdidos.slice(0, 4).map(s => linha(s, "falta",
        seg(MOTOR.catDe(s)).nome + " · era uma das maiores oportunidades desta loja")).join("")
        || `<p style="font-size:13px;color:var(--texto-suave)">Você pegou todas as maiores oportunidades.</p>`;
      const fora = (r.foraDoPlano || []).slice(0, 3).map(s => linha(s, "falta",
        "Gira em outro formato de loja, não neste")).join("");
      return `
      <div class="cartao">
        <h3>Etapa ${r.etapa.numero} | ${r.etapa.nome}</h3>
        <p class="sub">${r.itens} ${r.itens === 1 ? "produto incluído" : "produtos incluídos"},
          ${MOTOR.dinheiro(r.incremento)} de potencial adicional,
          ${r.categorias.length} ${r.categorias.length === 1 ? "categoria" : "categorias"} cobertas.
          Tempo: ${MOTOR.formatarTempo(estado.tempos[r.etapa.id] || 0)}.</p>
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--verde);margin:0 0 8px">Escolhas que mais somam</h4>
        ${bons}
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--vermelho);margin:16px 0 8px">Oportunidades que ficaram de fora</h4>
        ${faltou}
        ${fora ? `<h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--texto-suave);margin:16px 0 8px">Não é o sortimento desta loja</h4>${fora}` : ""}
      </div>`;
    }).join("");

    if (estado.desligarRanking) estado.desligarRanking();
    STORE.ouvirRanking((lista) => {
      const pos = STORE.posicao(lista, estado.participante.id);
      const lider = lista[0];
      const faltam = lider && pos > 1 ? lider.pontuacao - estado.participante.pontuacao : 0;
      $("#res-posicao").innerHTML = pos
        ? `<b>${pos}º</b><span>de ${lista.length} ${lista.length === 1 ? "participante" : "participantes"}${STORE.aoVivo ? " do evento" : " deste tablet"}${faltam > 0 ? `<br>${faltam} pontos para o primeiro lugar` : "<br>Você está na liderança"}</span>`
        : `<span>Resultado registrado</span>`;
      $("#res-ranking-sub").textContent = STORE.aoVivo
        ? "Atualiza sozinho conforme os outros tablets terminam."
        : "Ranking deste tablet. Para juntar todos, ligue o Firebase em config.js.";
      desenharRanking(lista);
    }).then(off => { estado.desligarRanking = off; });
  }

  const iniciais = nome => (nome || "").trim().split(/\s+/).slice(0, 2).map(p => p[0] || "").join("").toUpperCase();
  const primeiroNome = nome => (nome || "").split(" ").slice(0, 2).join(" ");

  function desenharRanking(lista) {
    const eu = estado.participante.id;
    const podio = lista.slice(0, 3);
    const ordemVisual = [1, 0, 2];   /* 2º, 1º, 3º, como num pódio de verdade */
    const alturas = { 0: 122, 1: 92, 2: 72 };
    $("#res-podio").innerHTML = podio.length > 1 ? ordemVisual.filter(i => podio[i]).map(i => {
      const r = podio[i];
      return `<div class="lugar l${i + 1} ${r.id === eu ? "eu" : ""}">
        ${i === 0 ? '<span class="coroa">★</span>' : ""}
        <span class="aval">${iniciais(r.nome)}</span>
        <b>${primeiroNome(r.nome)}</b>
        <small>${r.empresa || ""}</small>
        <div class="degrau" style="height:${alturas[i]}px">
          <span class="num">${i + 1}º</span>
          <em>${r.pontuacao}</em>
        </div>
      </div>`;
    }).join("") : "";

    const maior = lista.length ? lista[0].pontuacao : 1000;
    $("#res-ranking").innerHTML = lista.slice(0, 10).map((r, i) => `
      <div class="linha-rank ${r.id === eu ? "eu" : ""}">
        <span class="pos ${i < 3 ? "medalha-" + (i + 1) : ""}">${i + 1}</span>
        <span class="aval">${iniciais(r.nome)}</span>
        <div class="quem">
          <b>${primeiroNome(r.nome)}${r.id === eu ? " <i>você</i>" : ""}</b>
          <small>${[r.empresa, r.formatoNome].filter(Boolean).join(" · ")}</small>
        </div>
        <div class="trilho"><i style="width:${Math.max(6, r.pontuacao / Math.max(1, maior) * 100)}%"></i></div>
        <div class="dados">
          <b>${r.pontuacao}</b>
          <small>${r.incremento ? MOTOR.dinheiro(r.incremento) : ""} · ${MOTOR.formatarTempo(r.segundos || 0)}</small>
        </div>
      </div>`).join("");
  }

  $("#btn-proximo").addEventListener("click", () => {
    if (estado.desligarRanking) { estado.desligarRanking(); estado.desligarRanking = null; }
    estado.participante = null; estado.formato = null;
    estado.etapaIdx = 0; estado.escolhas = {}; estado.tempos = {}; estado.marcados = [];
    $("#form-cadastro").reset();
    $$(".erro").forEach(e => e.textContent = "");
    $("#btn-confirmar-formato").disabled = true;
    irPara("tela-abertura");
    STORE.listar().then(l => {
      const n = l.filter(r => r.status === "concluido").length;
      $("#contador-jogadores").textContent = n ? n + " participantes já montaram o MIX" : "";
    });
  });
})();
