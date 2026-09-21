/* ==========================================================================
   MIX+ DPA | fluxo da atividade
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const estado = {
    participante: null,
    etapaIdx: 0,
    etapa: null,
    slots: [],           /* { id, fixo } ou { id: null, fixo: false } */
    escolhas: {},        /* etapaId -> [ids] */
    tempos: {},          /* etapaId -> segundos */
    inicio: 0,
    cronometro: null,
    filtro: "todos",
    busca: "",
    resultado: null,
    desligarRanking: null
  };

  /* tablet pela URL, ex.: index.html?tablet=3 */
  const params = new URLSearchParams(location.search);
  if (params.get("tablet")) CFG.tablet = params.get("tablet");

  /* ---------------- utilidades ---------------- */
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
  function normal(t) { return (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

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
    const nome = $("#f-nome").value.trim();
    const email = $("#f-email").value.trim();
    const empresa = $("#f-empresa").value.trim();
    const tel = $("#f-telefone").value.trim();
    const area = $("#f-area").value;
    const lgpd = $("#f-lgpd").checked;

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
      nome, email, empresa, telefone: tel, area,
      consentimento: true,
      status: "cadastrado",
      dispositivo: navigator.userAgent.includes("Mobi") ? "celular" : "tablet ou computador"
    });
    btn.disabled = false; btn.textContent = "Iniciar";

    estado.etapaIdx = 0;
    estado.escolhas = {};
    estado.tempos = {};
    abrirAvisoEtapa();
  });

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
    $("#etapa-numero").textContent = e.numero;
    $("#etapa-marca").textContent = e.nome;
    $("#etapa-titulo").textContent = e.titulo;
    $("#etapa-resumo").textContent = e.resumo;
    const base = MOTOR.base(e).length;
    const opcoes = MOTOR.incrementais(e).length;
    $("#etapa-regras").innerHTML = `
      <div class="regra"><b>${base}</b><p>SKUs representam 80% do faturamento e já estão posicionados na gôndola.</p></div>
      <div class="regra"><b>${e.vazios}</b><p>espaços livres para você preencher com os itens que mais somam venda.</p></div>
      <div class="regra"><b>${opcoes}</b><p>opções disponíveis na lista. Sobra portfólio, então a decisão é sua.</p></div>`;
    irPara("tela-etapa");
  }
  $("#btn-abrir-etapa").addEventListener("click", iniciarEtapa);

  /* ---------------- jogo ---------------- */
  function montarSlots(etapa) {
    const base = MOTOR.base(etapa).slice().sort((a, b) => a.seg.localeCompare(b.seg) || a.nome.localeCompare(b.nome));
    const total = base.length + etapa.vazios;
    /* buracos espalhados de forma fixa, igual para todos os participantes */
    const buracos = new Set();
    for (let i = 0; i < etapa.vazios; i++) buracos.add(Math.floor(i * total / etapa.vazios));
    const slots = [];
    let b = 0;
    for (let i = 0; i < total; i++) {
      if (buracos.has(i)) slots.push({ id: null, fixo: false });
      else slots.push({ id: base[b] ? base[b++].id : null, fixo: !!base[b - 1] });
    }
    return slots;
  }

  function iniciarEtapa() {
    const e = estado.etapa;
    estado.slots = montarSlots(e);
    estado.filtro = "todos";
    estado.busca = "";
    $("#busca").value = "";
    $("#m-etapa").textContent = "Etapa " + e.numero;
    $("#m-etapa-nome").textContent = e.nome;
    $("#plano-titulo").textContent = e.tituloPlano || ("Gôndola " + e.nome);
    $("#catalogo-dica").textContent = MOTOR.incrementais(e).length + " opções para " + e.vazios + " espaços. " + e.instrucao;
    $("#btn-confirmar").textContent = "Confirmar etapa " + e.numero;
    montarAbas();
    desenharPlano();
    desenharLista();
    atualizarMedidores();
    estado.inicio = Date.now();
    clearInterval(estado.cronometro);
    estado.cronometro = setInterval(() => {
      const s = Math.floor((Date.now() - estado.inicio) / 1000) + (estado.tempos.acumulado || 0);
      $("#m-tempo").textContent = relogio(s);
    }, 500);
    irPara("tela-jogo");
  }

  function escolhidosIds() { return estado.slots.filter(s => s.id && !s.fixo).map(s => s.id); }
  function vaziosRestantes() { return estado.slots.filter(s => !s.id).length; }

  function desenharPlano() {
    const e = estado.etapa;
    const skus = MOTOR.skusDaEtapa(e);
    const cols = e.colunas;
    const linhas = [];
    for (let i = 0; i < estado.slots.length; i += cols) {
      const parte = estado.slots.slice(i, i + cols).map((slot, j) => {
        const idx = i + j;
        if (!slot.id) return `<div class="vao vazio" data-slot="${idx}"></div>`;
        const s = skus.find(x => x.id === slot.id);
        const cls = slot.fixo ? "base-80" : "escolhido";
        return `<div class="vao ${cls}" data-slot="${idx}">
          <img src="${s.arquivo}" alt="${s.nome}" draggable="false" loading="lazy">
          <span class="nome-mini">${s.nome}</span>
        </div>`;
      }).join("");
      linhas.push(`<div class="prateleira">
        <div class="vaos" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${parte}</div>
        <div class="base"></div>
      </div>`);
    }
    $("#prateleiras").innerHTML = linhas.join("");
    $$("#prateleiras .vao").forEach(v => {
      const idx = Number(v.dataset.slot);
      const slot = estado.slots[idx];
      if (slot.fixo) return;
      prepararArraste(v, { tipo: "slot", index: idx });
    });
  }

  function montarAbas() {
    const segs = [...new Set(MOTOR.incrementais(estado.etapa).map(s => s.seg))];
    $("#abas").innerHTML = [`<button data-seg="todos" class="ativo">Todos</button>`]
      .concat(segs.map(s => `<button data-seg="${s}">${SEGMENTOS[s] ? SEGMENTOS[s].nome : s}</button>`)).join("");
    $$("#abas button").forEach(b => b.addEventListener("click", () => {
      $$("#abas button").forEach(o => o.classList.remove("ativo"));
      b.classList.add("ativo");
      estado.filtro = b.dataset.seg;
      desenharLista();
    }));
  }

  function desenharLista() {
    const e = estado.etapa;
    const dentro = new Set(escolhidosIds());
    const busca = normal(estado.busca);
    const lista = MOTOR.incrementais(e).filter(s => {
      const okSeg = estado.filtro === "todos" || s.seg === estado.filtro;
      const okBusca = !busca || normal(s.nome).includes(busca) || normal(s.marca).includes(busca);
      return okSeg && okBusca;
    });
    if (!lista.length) {
      $("#lista").innerHTML = `<p style="font-size:13px;color:var(--texto-suave)">Nenhum produto encontrado.</p>`;
      return;
    }
    $("#lista").innerHTML = lista.map(s => {
      const seg = SEGMENTOS[s.seg] || { nome: s.seg, cor: "#1B4F9C" };
      return `<div class="item ${dentro.has(s.id) ? "dentro" : ""}" data-sku="${s.id}">
        <img src="${s.arquivo}" alt="${s.nome}" draggable="false" loading="lazy">
        <div>
          <b>${s.nome}</b>
          <small>${s.marca}</small>
          <span class="selo" style="background:${seg.cor}">${seg.nome}</span>
        </div>
        <div class="marca-check">✓</div>
      </div>`;
    }).join("");
    $$("#lista .item").forEach(el => prepararArraste(el, { tipo: "lista", id: el.dataset.sku }));
  }

  function atualizarMedidores() {
    const e = estado.etapa;
    const preenchidos = e.vazios - vaziosRestantes();
    $("#m-espacos").textContent = preenchidos + " / " + e.vazios;
    $("#btn-confirmar").classList.toggle("azul", preenchidos === e.vazios);
  }

  function colocar(id, indice) {
    if (escolhidosIds().includes(id)) { aviso("Esse item já está na gôndola"); return; }
    let alvo = indice;
    if (alvo == null || estado.slots[alvo].fixo) alvo = estado.slots.findIndex(s => !s.id);
    if (alvo < 0) { aviso("Todos os espaços já estão preenchidos"); return; }
    if (estado.slots[alvo].id && !estado.slots[alvo].fixo) {
      /* troca: devolve o anterior para a lista */
      estado.slots[alvo] = { id, fixo: false };
    } else {
      estado.slots[alvo] = { id, fixo: false };
    }
    atualizar();
  }
  function remover(indice) {
    const slot = estado.slots[indice];
    if (!slot || slot.fixo || !slot.id) return;
    estado.slots[indice] = { id: null, fixo: false };
    atualizar();
  }
  function atualizar() { desenharPlano(); desenharLista(); atualizarMedidores(); }

  /* ---------------- arrastar e soltar ---------------- */
  let rolagem = null, ultimoPonteiro = 0;
  function skuPorId(id) { return MOTOR.skusDaEtapa(estado.etapa).find(s => s.id === id); }

  function criarFantasma(sku, x, y) {
    const f = document.createElement("div");
    f.className = "fantasma";
    f.innerHTML = `<img src="${sku.arquivo}" alt=""><span>${sku.nome}</span>`;
    document.body.appendChild(f);
    f.style.transform = `translate(${x}px, ${y}px)`;
    return f;
  }
  function vaoSob(x, y) {
    const el = document.elementFromPoint(x, y);
    return el ? el.closest(".vao") : null;
  }
  function rolarSeNaBorda(y) {
    cancelAnimationFrame(rolagem);
    const margem = 110;
    let passo = 0;
    if (y < margem) passo = -Math.ceil((margem - y) / 6);
    else if (y > window.innerHeight - margem) passo = Math.ceil((y - (window.innerHeight - margem)) / 6);
    if (!passo) return;
    const anda = () => { window.scrollBy(0, passo); rolagem = requestAnimationFrame(anda); };
    rolagem = requestAnimationFrame(anda);
  }

  function prepararArraste(el, origem) {
    el.addEventListener("pointerdown", ev => {
      if (ev.button > 0) return;
      const id = origem.tipo === "slot" ? (estado.slots[origem.index] || {}).id : origem.id;
      if (!id) return;
      const sku = skuPorId(id);
      if (!sku) return;
      const inicio = { x: ev.clientX, y: ev.clientY };
      let ativo = false, fantasma = null;

      const mover = e => {
        const dx = e.clientX - inicio.x, dy = e.clientY - inicio.y;
        if (!ativo && Math.hypot(dx, dy) < 9) return;
        if (!ativo) {
          ativo = true;
          fantasma = criarFantasma(sku, e.clientX, e.clientY);
          document.body.classList.add("arrastando");
          const sel = window.getSelection();
          if (sel && sel.removeAllRanges) sel.removeAllRanges();
          if (origem.tipo === "slot") el.style.opacity = ".35";
        }
        fantasma.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        fantasma.style.visibility = "hidden";
        const alvo = vaoSob(e.clientX, e.clientY);
        fantasma.style.visibility = "visible";
        $$("#prateleiras .vao").forEach(v => v.classList.toggle("sobre", v === alvo && !estado.slots[Number(v.dataset.slot)].fixo));
        rolarSeNaBorda(e.clientY);
        e.preventDefault();
      };

      const soltar = e => {
        window.removeEventListener("pointermove", mover);
        window.removeEventListener("pointerup", soltar);
        window.removeEventListener("pointercancel", soltar);
        cancelAnimationFrame(rolagem);
        document.body.classList.remove("arrastando");
        $$("#prateleiras .vao").forEach(v => v.classList.remove("sobre"));
        if (fantasma) fantasma.remove();
        el.style.opacity = "";

        if (!ativo) {
          if (origem.tipo === "lista") colocar(id, null); else remover(origem.index);
        } else {
          const alvo = vaoSob(e.clientX, e.clientY);
          if (alvo) {
            const destino = Number(alvo.dataset.slot);
            if (estado.slots[destino].fixo) { aviso("Esse espaço é do sortimento que já representa 80% do faturamento"); }
            else if (origem.tipo === "lista") colocar(id, destino);
            else if (destino !== origem.index) {
              const troca = estado.slots[destino];
              estado.slots[destino] = { id, fixo: false };
              estado.slots[origem.index] = troca.id && !troca.fixo ? { id: troca.id, fixo: false } : { id: null, fixo: false };
              atualizar();
            }
          } else if (origem.tipo === "slot") {
            remover(origem.index);
          }
        }
        ultimoPonteiro = Date.now();
      };

      window.addEventListener("pointermove", mover, { passive: false });
      window.addEventListener("pointerup", soltar);
      window.addEventListener("pointercancel", soltar);
    });
    el.addEventListener("click", () => {
      if (Date.now() - ultimoPonteiro < 700) return;
      if (origem.tipo === "lista") colocar(origem.id, null); else remover(origem.index);
    });
    el.addEventListener("dragstart", e => e.preventDefault());
  }

  $("#busca").addEventListener("input", e => { estado.busca = e.target.value; desenharLista(); });

  /* ---------------- confirmar etapa ---------------- */
  $("#btn-confirmar").addEventListener("click", () => {
    const faltam = vaziosRestantes();
    if (faltam > 0 && !confirm("Ainda faltam " + faltam + " espaços. Quer confirmar assim mesmo?")) return;
    clearInterval(estado.cronometro);
    const gastos = Math.max(1, Math.floor((Date.now() - estado.inicio) / 1000));
    estado.tempos[estado.etapa.id] = gastos;
    estado.tempos.acumulado = (estado.tempos.acumulado || 0) + gastos;
    estado.escolhas[estado.etapa.id] = escolhidosIds();

    if (estado.etapaIdx < ETAPAS.length - 1) {
      estado.etapaIdx++;
      abrirAvisoEtapa();
    } else {
      finalizar();
    }
  });

  /* ---------------- resultado ---------------- */
  async function finalizar() {
    const resultados = ETAPAS.map(e => MOTOR.avaliarEtapa(e, estado.escolhas[e.id] || []));
    const segundos = estado.tempos.acumulado || 0;
    const nota = MOTOR.pontuar(resultados, segundos);
    estado.resultado = { resultados, nota };

    const registro = Object.assign({}, estado.participante, {
      status: "concluido",
      pontuacao: nota.total,
      nivel: nota.nivel,
      segundos,
      temposEtapas: ETAPAS.reduce((o, e) => (o[e.id] = estado.tempos[e.id] || 0, o), {}),
      blocos: nota.blocos.reduce((o, b) => (o[b.chave] = b.pontos, o), {}),
      etapas: resultados.map(r => ({
        etapa: r.etapa.id,
        escolhidos: r.escolhidos.map(s => s.nome),
        acertos: r.acertos.length,
        deIdeais: r.ideal.length,
        perdidos: r.perdidos.map(s => s.nome),
        aproveitamento: Math.round(r.aproveitamento * 100)
      }))
    });
    estado.participante = await STORE.salvar(registro);
    montarResultado();
    irPara("tela-resultado");
  }

  function montarResultado() {
    const { resultados, nota } = estado.resultado;
    $("#res-nome").textContent = estado.participante.nome + (estado.participante.empresa ? " | " + estado.participante.empresa : "");
    $("#res-pontos").innerHTML = nota.total + "<small>/1000</small>";
    $("#res-nivel").textContent = nota.nivel;

    $("#res-blocos").innerHTML = nota.blocos.map(b => `
      <div class="bloco">
        <b>${b.pontos}<i> / ${b.max}</i></b>
        <h4>${b.nome}</h4>
        <p>${b.detalhe}</p>
        <div class="barra-nota"><i style="width:${(b.pontos / b.max * 100).toFixed(0)}%"></i></div>
      </div>`).join("");

    $("#res-etapas").innerHTML = resultados.map(r => {
      const perdidos = r.perdidos.slice(0, 4).map(s => `
        <div class="linha-item falta">
          <img src="${s.arquivo}" alt="">
          <div><b>${s.nome}</b><small>${s.motivo || "Item de alta incrementalidade"}</small></div>
          <div class="valor">+${s.valor}</div>
        </div>`).join("") || `<p style="font-size:13px;color:var(--texto-suave)">Você levou todos os itens de maior potencial.</p>`;
      const acertos = r.acertos.slice(0, 4).map(s => `
        <div class="linha-item ok">
          <img src="${s.arquivo}" alt="">
          <div><b>${s.nome}</b><small>${s.motivo || ""}</small></div>
          <div class="valor">+${s.valor}</div>
        </div>`).join("") || `<p style="font-size:13px;color:var(--texto-suave)">Nenhuma das escolhas estava no sortimento de referência.</p>`;
      return `
      <div class="cartao">
        <h3>Etapa ${r.etapa.numero} | ${r.etapa.nome}</h3>
        <p class="sub">${r.acertos.length} de ${r.ideal.length} itens de referência escolhidos, ${Math.round(r.aproveitamento * 100)}% do potencial incremental, em ${MOTOR.formatarTempo(estado.tempos[r.etapa.id] || 0)}.</p>
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--verde);margin:0 0 8px">Boas escolhas</h4>
        ${acertos}
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--vermelho);margin:16px 0 8px">Ficaram de fora</h4>
        ${perdidos}
      </div>`;
    }).join("");

    if (estado.desligarRanking) estado.desligarRanking();
    STORE.ouvirRanking((lista, total) => {
      const pos = STORE.posicao(lista, estado.participante.id);
      $("#res-posicao").innerHTML = pos
        ? `<b>${pos}º</b><span>lugar entre ${lista.length} ${lista.length === 1 ? "participante" : "participantes"}${STORE.aoVivo ? " do evento" : " deste tablet"}<br>Desempate pelo menor tempo de montagem</span>`
        : `<span>Resultado registrado</span>`;
      $("#res-ranking-sub").textContent = STORE.aoVivo
        ? "Atualiza sozinho conforme os outros tablets terminam."
        : "Ranking deste tablet. Para juntar todos, ligue o Firebase em config.js.";
      $("#res-ranking").innerHTML = `
        <thead><tr><th>#</th><th>Participante</th><th>Empresa</th><th>Tempo</th><th>Pontos</th></tr></thead>
        <tbody>${lista.slice(0, 10).map((r, i) => `
          <tr class="${r.id === estado.participante.id ? "eu" : ""}">
            <td class="pos ${i < 3 ? "podio-" + (i + 1) : ""}">${i + 1}</td>
            <td>${(r.nome || "").split(" ").slice(0, 2).join(" ")}</td>
            <td>${r.empresa || ""}</td>
            <td>${MOTOR.formatarTempo(r.segundos || 0)}</td>
            <td><b>${r.pontuacao}</b></td>
          </tr>`).join("")}</tbody>`;
    }).then(off => { estado.desligarRanking = off; });
  }

  $("#btn-proximo").addEventListener("click", () => {
    if (estado.desligarRanking) { estado.desligarRanking(); estado.desligarRanking = null; }
    estado.participante = null;
    estado.etapaIdx = 0;
    estado.escolhas = {};
    estado.tempos = {};
    $("#form-cadastro").reset();
    $$(".erro").forEach(e => e.textContent = "");
    irPara("tela-abertura");
    STORE.listar().then(l => {
      const n = l.filter(r => r.status === "concluido").length;
      $("#contador-jogadores").textContent = n ? n + " participantes já montaram o MIX" : "";
    });
  });
})();
