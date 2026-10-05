/* ==========================================================================
   MIX+ DPA | fluxo da atividade
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const estado = {
    participante: null,
    formato: null,          /* id do formato de loja escolhido */
    etapaIdx: 0,
    etapa: null,
    slots: [],              /* [{tipo:'core'|'escolha', id} | {tipo:'livre', cm}] */
    ctx: null,              /* contexto linear da etapa */
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
    avisoTimer = setTimeout(() => el.classList.remove("aparece"), 2600);
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
      consentimento: true, status: "cadastrado",
      dispositivo: navigator.userAgent.includes("Mobi") ? "celular" : "tablet ou computador"
    });
    btn.disabled = false; btn.textContent = "Iniciar";
    estado.etapaIdx = 0; estado.escolhas = {}; estado.tempos = {};
    montarFormatos();
    irPara("tela-formato");
  });

  /* ---------------- escolha do formato de loja ---------------- */
  function montarFormatos() {
    $("#lista-formatos").innerHTML = FORMATOS.map(f => {
      const p = PLANOS[f.id];
      const cmPlano = Math.round(p.linearPlano * p.gondolaCm);
      const cmCore = Math.round(p.linearCore * p.gondolaCm);
      const livre = Math.round((cmPlano - cmCore) * (f.fracaoLivre != null ? f.fracaoLivre : (window.FRACAO_LIVRE || 1)));
      return `<button type="button" class="cartao-formato" data-formato="${f.id}">
        <span class="chip">${f.resumo}</span>
        <h3>${f.nome}</h3>
        <p>${f.detalhe}</p>
        <div class="numeros">
          <div><b>${p.core.length}</b><span>SKUs no 80% do faturamento</span></div>
          <div><b>${MOTOR.metros(livre)}</b><span>de espaço livre para você</span></div>
          <div><b>${p.skusPlano.length}</b><span>SKUs no plano da loja</span></div>
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
  $("#btn-confirmar-formato").addEventListener("click", () => {
    if (!estado.formato) return;
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

    if (e.modoEspaco === "linear") {
      const ctx = MOTOR.contexto(e, estado.formato);
      const fmt = FORMATOS.find(f => f.id === estado.formato);
      $("#etapa-regras").innerHTML = `
        <div class="regra"><b>${ctx.core.length}</b><p>SKUs representam 80% do faturamento em ${fmt.nome.toLowerCase()} e já estão posicionados.</p></div>
        <div class="regra"><b>${MOTOR.metros(ctx.espacoLivreCm)}</b><p>de espaço linear livre na gôndola. Cada embalagem ocupa a largura real dela.</p></div>
        <div class="regra"><b>${ctx.candidatos.length}</b><p>SKUs disponíveis no portfólio. Nem todos pertencem a este formato de loja.</p></div>`;
    } else {
      $("#etapa-regras").innerHTML = `
        <div class="regra"><b>${MOTOR.base(e).length}</b><p>SKUs representam 80% do faturamento e já estão posicionados.</p></div>
        <div class="regra"><b>${e.vazios}</b><p>espaços livres para você preencher.</p></div>
        <div class="regra"><b>${MOTOR.incrementais(e).length}</b><p>opções na lista. Sobra portfólio, então a decisão é sua.</p></div>`;
    }
    irPara("tela-etapa");
  }
  $("#btn-abrir-etapa").addEventListener("click", iniciarEtapa);

  /* ---------------- montagem do planograma ---------------- */
  function montarSlotsLinear(e) {
    const ctx = MOTOR.contexto(e, estado.formato);
    estado.ctx = ctx;
    const core = ctx.core.slice().sort((a, b) =>
      (a.cat || "").localeCompare(b.cat || "") || b.giroRef - a.giroRef);
    const blocos = core.map(s => ({ tipo: "core", id: s.id, cm: MOTOR.espacoCm(s, estado.formato) }));
    /* o espaco livre vira de 4 a 6 lacunas espalhadas pelo planograma */
    const n = Math.max(3, Math.min(14, Math.ceil(ctx.espacoLivreCm / 48)));
    const pedaco = ctx.espacoLivreCm / n;
    const lacunas = [];
    for (let i = 0; i < n; i++) {
      const cm = i === n - 1 ? ctx.espacoLivreCm - Math.round(pedaco) * (n - 1) : Math.round(pedaco);
      lacunas.push({ tipo: "livre", cm });
    }
    const saida = [];
    const passo = Math.max(1, Math.floor(blocos.length / n));
    let li = 0;
    blocos.forEach((b, i) => {
      saida.push(b);
      if (li < lacunas.length && (i + 1) % passo === 0) saida.push(lacunas[li++]);
    });
    while (li < lacunas.length) saida.push(lacunas[li++]);
    return saida;
  }

  function montarSlotsVagas(e) {
    const base = MOTOR.base(e).slice().sort((a, b) => a.seg.localeCompare(b.seg) || a.nome.localeCompare(b.nome));
    const total = base.length + e.vazios;
    const buracos = new Set();
    for (let i = 0; i < e.vazios; i++) buracos.add(Math.floor(i * total / e.vazios));
    const slots = []; let b = 0;
    for (let i = 0; i < total; i++) {
      if (buracos.has(i)) slots.push({ tipo: "livre" });
      else { const s = base[b++]; slots.push(s ? { tipo: "core", id: s.id } : { tipo: "livre" }); }
    }
    return slots;
  }

  function iniciarEtapa() {
    const e = estado.etapa;
    estado.slots = e.modoEspaco === "linear" ? montarSlotsLinear(e) : montarSlotsVagas(e);
    estado.filtro = "todos"; estado.busca = "";
    $("#busca").value = "";
    $("#m-etapa").textContent = "Etapa " + e.numero;
    $("#m-etapa-nome").textContent = e.nome;
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    $("#plano-titulo").textContent = e.tituloPlano + (e.modoEspaco === "linear" ? " | " + fmt.nome : "");
    $("#btn-confirmar").textContent = "Confirmar etapa " + e.numero;
    $("#rotulo-espaco").textContent = e.modoEspaco === "linear" ? "Espaço livre restante" : "Espaços a preencher";
    $("#catalogo-dica").textContent = e.instrucao;
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

  const skuPorId = id => (MOTOR.skusDaEtapa(estado.etapa) || []).find(s => s.id === id);
  const escolhidosIds = () => estado.slots.filter(s => s.tipo === "escolha").map(s => s.id);
  function livreRestante() {
    return estado.etapa.modoEspaco === "linear"
      ? estado.slots.filter(s => s.tipo === "livre").reduce((t, s) => t + s.cm, 0)
      : estado.slots.filter(s => s.tipo === "livre").length;
  }

  /* divide os blocos em prateleiras de mesma largura fisica.
     Todas as prateleiras usam a mesma escala, entao o que a tela mostra
     e a proporcao real de espaco linear de cada produto. */
  function prateleiras() {
    const e = estado.etapa;
    if (e.modoEspaco !== "linear") {
      const cols = e.colunas, out = [];
      for (let i = 0; i < estado.slots.length; i += cols) out.push({ cap: cols, itens: estado.slots.slice(i, i + cols) });
      return out;
    }
    const fmt = FORMATOS.find(f => f.id === estado.formato) || {};
    const n = fmt.prateleiras || e.prateleiras || 5;
    const total = estado.slots.reduce((t, s) => t + (s.cm || 0), 0);
    const maior = estado.slots.reduce((m, s) => Math.max(m, s.cm || 0), 0);
    const cap = Math.max(total / n, maior) * 1.02;
    const out = []; let atual = [], soma = 0;
    estado.slots.forEach(s => {
      const cm = s.cm || 0;
      if (soma + cm > cap && atual.length) { out.push({ cap, itens: atual }); atual = []; soma = 0; }
      atual.push(s); soma += cm;
    });
    if (atual.length) out.push({ cap, itens: atual });
    return out;
  }

  function desenharPlano() {
    const e = estado.etapa;
    const linear = e.modoEspaco === "linear";
    const html = prateleiras().map(prat => {
      const cap = prat.cap || 1;
      const itens = prat.itens.map(slot => {
        const idx = estado.slots.indexOf(slot);
        const flex = linear ? `flex:0 0 ${(slot.cm / cap * 100).toFixed(3)}%` : "flex:1 1 0";
        if (slot.tipo === "livre") {
          return `<div class="vao vazio" data-slot="${idx}" style="${flex}">
            ${linear ? `<span class="cm">${Math.round(slot.cm)} cm</span>` : ""}
          </div>`;
        }
        const s = skuPorId(slot.id);
        const cls = slot.tipo === "core" ? "base-80" : "escolhido";
        return `<div class="vao ${cls}" data-slot="${idx}" style="${flex}" title="${s.nome}">
          <img src="${s.arquivo}" alt="${s.nome}" draggable="false" loading="lazy">
          <span class="nome-mini">${s.nome}</span>
        </div>`;
      }).join("");
      return `<div class="prateleira"><div class="vaos">${itens}</div><div class="base"></div></div>`;
    }).join("");
    $("#prateleiras").innerHTML = html;
    $$("#prateleiras .vao").forEach(v => {
      const slot = estado.slots[Number(v.dataset.slot)];
      if (slot.tipo === "core") return;
      prepararArraste(v, { tipo: "slot", index: Number(v.dataset.slot) });
    });
  }

  function montarAbas() {
    const e = estado.etapa;
    const lista = e.modoEspaco === "linear" ? estado.ctx.candidatos : MOTOR.incrementais(e);
    const segs = [...new Set(lista.map(s => s.cat || s.seg))];
    $("#abas").innerHTML = [`<button data-seg="todos" class="ativo">Todos</button>`]
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
    const linear = e.modoEspaco === "linear";
    const dentro = new Set(escolhidosIds());
    const busca = normal(estado.busca);
    const todos = linear ? estado.ctx.candidatos : MOTOR.incrementais(e);
    const lista = todos.filter(s => {
      const cat = s.cat || s.seg;
      const okSeg = estado.filtro === "todos" || cat === estado.filtro;
      const okBusca = !busca || normal(s.nome).includes(busca) || normal(s.marca).includes(busca) ||
        (s.ean || "").includes(busca);
      return okSeg && okBusca;
    }).sort((a, b) => (a.cat || a.seg || "").localeCompare(b.cat || b.seg || "") || a.nome.localeCompare(b.nome));

    if (!lista.length) {
      $("#lista").innerHTML = `<p style="font-size:13px;color:var(--texto-suave)">Nenhum produto encontrado.</p>`;
      return;
    }
    const restante = livreRestante();
    $("#lista").innerHTML = lista.map(s => {
      const cat = seg(s.cat || s.seg);
      const cm = linear ? MOTOR.espacoCm(s, estado.formato) : null;
      const cabe = !linear || dentro.has(s.id) || cm <= restante;
      return `<div class="item ${dentro.has(s.id) ? "dentro" : ""} ${cabe ? "" : "nao-cabe"}" data-sku="${s.id}">
        <img src="${s.arquivo}" alt="${s.nome}" draggable="false" loading="lazy">
        <div>
          <b>${s.nome}</b>
          <small>${s.marca}${linear ? " · " + MOTOR.frentesDe(s, estado.formato) + (MOTOR.frentesDe(s, estado.formato) > 1 ? " frentes" : " frente") + " · " + cm + " cm" : ""}</small>
          <span class="selo" style="background:${cat.cor}">${cat.nome}</span>
        </div>
        <div class="marca-check">✓</div>
      </div>`;
    }).join("");
    $$("#lista .item").forEach(el => prepararArraste(el, { tipo: "lista", id: el.dataset.sku }));
  }

  function atualizarMedidores() {
    const e = estado.etapa;
    if (e.modoEspaco === "linear") {
      const restante = livreRestante();
      $("#m-espacos").textContent = MOTOR.metros(restante);
      $("#m-espacos").classList.toggle("zerado", restante <= 0);
      const usado = estado.ctx.espacoLivreCm - restante;
      $("#jogo-progresso") && ($("#jogo-progresso").style.width = (usado / estado.ctx.espacoLivreCm * 100) + "%");
      $("#m-itens").textContent = escolhidosIds().length;
    } else {
      $("#m-espacos").textContent = (e.vazios - livreRestante()) + " / " + e.vazios;
      $("#m-itens").textContent = escolhidosIds().length;
    }
  }

  /* ---------------- colocar e tirar ---------------- */
  function colocar(id, indiceAlvo) {
    const e = estado.etapa;
    if (escolhidosIds().includes(id)) { aviso("Esse item já está na gôndola"); return; }
    const s = skuPorId(id);
    if (e.modoEspaco === "linear") {
      const cm = MOTOR.espacoCm(s, estado.formato);
      let alvo = indiceAlvo;
      if (alvo == null || !estado.slots[alvo] || estado.slots[alvo].tipo !== "livre" || estado.slots[alvo].cm < cm) {
        alvo = estado.slots.findIndex(x => x.tipo === "livre" && x.cm >= cm);
      }
      if (alvo < 0) {
        const total = livreRestante();
        if (cm > total) {
          aviso(`${s.nome} precisa de ${cm} cm e só restam ${MOTOR.metros(total)} de gôndola`);
          return;
        }
        /* junta o espaco livre espalhado numa lacuna so e tenta de novo */
        compactarLivres();
        alvo = estado.slots.findIndex(x => x.tipo === "livre" && x.cm >= cm);
        if (alvo < 0) { aviso(`${s.nome} não cabe no espaço que restou`); return; }
        aviso("Espaços livres juntados para caber " + s.nome);
      }
      const sobra = estado.slots[alvo].cm - cm;
      const novos = [{ tipo: "escolha", id, cm }];
      if (sobra >= 4) novos.push({ tipo: "livre", cm: sobra });
      else if (sobra > 0) novos[0].cm += sobra;
      estado.slots.splice(alvo, 1, ...novos);
    } else {
      let alvo = indiceAlvo;
      if (alvo == null || !estado.slots[alvo] || estado.slots[alvo].tipo === "core") {
        alvo = estado.slots.findIndex(x => x.tipo === "livre");
      }
      if (alvo < 0) { aviso("Todos os espaços já estão preenchidos"); return; }
      estado.slots[alvo] = { tipo: "escolha", id };
    }
    atualizar();
  }

  function compactarLivres() {
    const total = estado.slots.filter(x => x.tipo === "livre").reduce((t, x) => t + x.cm, 0);
    const restantes = estado.slots.filter(x => x.tipo !== "livre");
    estado.slots = restantes.concat(total > 0 ? [{ tipo: "livre", cm: total }] : []);
  }

  function remover(indice) {
    const slot = estado.slots[indice];
    if (!slot || slot.tipo !== "escolha") return;
    if (estado.etapa.modoEspaco === "linear") {
      estado.slots[indice] = { tipo: "livre", cm: slot.cm };
      /* junta lacunas vizinhas para o espaço voltar a ser utilizável */
      for (let i = estado.slots.length - 1; i > 0; i--) {
        if (estado.slots[i].tipo === "livre" && estado.slots[i - 1].tipo === "livre") {
          estado.slots[i - 1].cm += estado.slots[i].cm;
          estado.slots.splice(i, 1);
        }
      }
    } else {
      estado.slots[indice] = { tipo: "livre" };
    }
    atualizar();
  }
  function atualizar() { desenharPlano(); desenharLista(); atualizarMedidores(); }

  /* ---------------- arrastar e soltar ---------------- */
  let rolagem = null, ultimoPonteiro = 0;
  function criarFantasma(sku, x, y) {
    const f = document.createElement("div");
    f.className = "fantasma";
    f.innerHTML = `<img src="${sku.arquivo}" alt=""><span>${sku.nome}</span>`;
    document.body.appendChild(f);
    f.style.transform = `translate(${x}px, ${y}px)`;
    return f;
  }
  const vaoSob = (x, y) => { const el = document.elementFromPoint(x, y); return el ? el.closest(".vao") : null; };
  function rolarSeNaBorda(y) {
    cancelAnimationFrame(rolagem);
    const margem = 110; let passo = 0;
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
        $$("#prateleiras .vao").forEach(v => {
          const slot = estado.slots[Number(v.dataset.slot)];
          const serve = v === alvo && slot && slot.tipo === "livre" &&
            (estado.etapa.modoEspaco !== "linear" || slot.cm >= MOTOR.espacoCm(sku, estado.formato));
          v.classList.toggle("sobre", !!serve);
          v.classList.toggle("nao-serve", v === alvo && !serve && slot && slot.tipo !== "core");
        });
        rolarSeNaBorda(e.clientY);
        e.preventDefault();
      };

      const soltar = e => {
        window.removeEventListener("pointermove", mover);
        window.removeEventListener("pointerup", soltar);
        window.removeEventListener("pointercancel", soltar);
        cancelAnimationFrame(rolagem);
        document.body.classList.remove("arrastando");
        $$("#prateleiras .vao").forEach(v => v.classList.remove("sobre", "nao-serve"));
        if (fantasma) fantasma.remove();
        el.style.opacity = "";
        if (!ativo) {
          if (origem.tipo === "lista") colocar(id, null); else remover(origem.index);
        } else {
          const alvo = vaoSob(e.clientX, e.clientY);
          if (alvo) {
            const destino = Number(alvo.dataset.slot);
            const slot = estado.slots[destino];
            if (!slot || slot.tipo === "core") aviso("Esse espaço é do sortimento que já faz 80% do faturamento");
            else if (origem.tipo === "lista") colocar(id, destino);
            else if (destino !== origem.index) { remover(origem.index); colocar(id, null); }
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
    const e = estado.etapa;
    const resta = livreRestante();
    const texto = e.modoEspaco === "linear"
      ? `Ainda sobram ${MOTOR.metros(resta)} de gôndola vazios. Quer confirmar assim mesmo?`
      : `Ainda faltam ${resta} espaços. Quer confirmar assim mesmo?`;
    if (resta > (e.modoEspaco === "linear" ? 12 : 0) && !confirm(texto)) return;
    clearInterval(estado.cronometro);
    const gastos = Math.max(1, Math.floor((Date.now() - estado.inicio) / 1000));
    estado.tempos[e.id] = gastos;
    estado.tempos.acumulado = (estado.tempos.acumulado || 0) + gastos;
    estado.escolhas[e.id] = escolhidosIds();
    if (estado.etapaIdx < ETAPAS.length - 1) { estado.etapaIdx++; abrirAvisoEtapa(); }
    else finalizar();
  });

  /* ---------------- resultado ---------------- */
  async function finalizar() {
    const resultados = ETAPAS.map(e => MOTOR.avaliarEtapa(e, estado.escolhas[e.id] || [], estado.formato));
    const segundos = estado.tempos.acumulado || 0;
    const nota = MOTOR.pontuar(resultados, segundos);
    estado.resultado = { resultados, nota };
    const fmt = FORMATOS.find(f => f.id === estado.formato);

    const registro = Object.assign({}, estado.participante, {
      status: "concluido",
      formato: estado.formato,
      formatoNome: fmt ? fmt.nome : "",
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
        foraDoPlano: (r.foraDoPlano || []).map(s => s.nome),
        aproveitamento: Math.round(r.aproveitamento * 100),
        espacoUsado: r.espacoUsado || null,
        espacoLivre: r.espacoLivre || null
      }))
    });
    estado.participante = await STORE.salvar(registro);
    montarResultado();
    irPara("tela-resultado");
  }

  function montarResultado() {
    const { resultados, nota } = estado.resultado;
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    $("#res-nome").textContent = estado.participante.nome +
      (estado.participante.empresa ? " | " + estado.participante.empresa : "") +
      (fmt ? " | " + fmt.nome : "");
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
      const linear = r.modo === "linear";
      const fid = estado.formato;
      const linha = (s, classe, extra) => `
        <div class="linha-item ${classe}">
          <img src="${s.arquivo}" alt="">
          <div><b>${s.nome}</b><small>${extra}</small></div>
          <div class="valor">${linear
            ? (MOTOR.giroNoFormato(s, fid) ? (MOTOR.giroNoFormato(s, fid) / 1000).toFixed(0) + "k" : "0")
            : "+" + s.valor}</div>
        </div>`;
      const acertos = r.acertos.slice(0, 4).map(s => linha(s, "ok",
        linear ? seg(s.cat).nome + " · " + MOTOR.espacoCm(s, fid) + " cm" : (s.motivo || ""))).join("")
        || `<p style="font-size:13px;color:var(--texto-suave)">Nenhuma escolha coincidiu com o sortimento de referência.</p>`;
      const perdidos = r.perdidos.slice(0, 4).map(s => linha(s, "falta",
        linear ? "Giro por centímetro alto neste formato" : (s.motivo || "Item de alta incrementalidade"))).join("")
        || `<p style="font-size:13px;color:var(--texto-suave)">Você levou tudo o que o plano recomendava.</p>`;
      const fora = (r.foraDoPlano || []).slice(0, 3).map(s => linha(s, "falta",
        "Não faz parte do sortimento deste formato")).join("");

      return `
      <div class="cartao">
        <h3>Etapa ${r.etapa.numero} | ${r.etapa.nome}</h3>
        <p class="sub">${linear
          ? `${r.acertos.length} de ${r.ideal.length} itens do sortimento de referência, ${Math.round(r.aproveitamento * 100)}% do giro possível, ${MOTOR.metros(r.espacoUsado)} de ${MOTOR.metros(r.espacoLivre)} ocupados.`
          : `${r.acertos.length} de ${r.ideal.length} itens de referência, ${Math.round(r.aproveitamento * 100)}% do potencial incremental.`}
          Tempo: ${MOTOR.formatarTempo(estado.tempos[r.etapa.id] || 0)}.</p>
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--verde);margin:0 0 8px">Boas escolhas</h4>
        ${acertos}
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--vermelho);margin:16px 0 8px">Ficaram de fora</h4>
        ${perdidos}
        ${fora ? `<h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--texto-suave);margin:16px 0 8px">Fora do plano deste formato</h4>${fora}` : ""}
      </div>`;
    }).join("");

    if (estado.desligarRanking) estado.desligarRanking();
    STORE.ouvirRanking((lista) => {
      const pos = STORE.posicao(lista, estado.participante.id);
      $("#res-posicao").innerHTML = pos
        ? `<b>${pos}º</b><span>lugar entre ${lista.length} ${lista.length === 1 ? "participante" : "participantes"}${STORE.aoVivo ? " do evento" : " deste tablet"}<br>Desempate pelo menor tempo de montagem</span>`
        : `<span>Resultado registrado</span>`;
      $("#res-ranking-sub").textContent = STORE.aoVivo
        ? "Atualiza sozinho conforme os outros tablets terminam."
        : "Ranking deste tablet. Para juntar todos, ligue o Firebase em config.js.";
      $("#res-ranking").innerHTML = `
        <thead><tr><th>#</th><th>Participante</th><th>Empresa</th><th>Loja</th><th>Tempo</th><th>Pontos</th></tr></thead>
        <tbody>${lista.slice(0, 10).map((r, i) => `
          <tr class="${r.id === estado.participante.id ? "eu" : ""}">
            <td class="pos ${i < 3 ? "podio-" + (i + 1) : ""}">${i + 1}</td>
            <td>${(r.nome || "").split(" ").slice(0, 2).join(" ")}</td>
            <td>${r.empresa || ""}</td>
            <td>${r.formatoNome || ""}</td>
            <td>${MOTOR.formatarTempo(r.segundos || 0)}</td>
            <td><b>${r.pontuacao}</b></td>
          </tr>`).join("")}</tbody>`;
    }).then(off => { estado.desligarRanking = off; });
  }

  $("#btn-proximo").addEventListener("click", () => {
    if (estado.desligarRanking) { estado.desligarRanking(); estado.desligarRanking = null; }
    estado.participante = null; estado.formato = null;
    estado.etapaIdx = 0; estado.escolhas = {}; estado.tempos = {};
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
