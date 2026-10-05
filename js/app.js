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
    slots: [],       /* [{tipo:'item', id, frentes, cm} | {tipo:'livre', cm}] */
    ctx: null,
    sorteioInicial: {},
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
  const ehLinear = () => estado.etapa.modoEspaco === "linear";

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
    estado.etapaIdx = 0; estado.escolhas = {}; estado.tempos = {}; estado.sorteioInicial = {};
    montarFormatos();
    irPara("tela-formato");
  });

  /* ---------------- formato de loja ---------------- */
  function montarFormatos() {
    $("#lista-formatos").innerHTML = FORMATOS.map(f => {
      const p = PLANOS[f.id];
      const cmTotal = Math.round(p.linearPlano * p.gondolaCm);
      const meta = p.skusPlano.reduce((t, id) => {
        const s = SKUS_DPA.find(x => x.id === id);
        return t + (s ? s.planos[f.id].giro : 0);
      }, 0);
      return `<button type="button" class="cartao-formato" data-formato="${f.id}">
        <span class="chip">${f.resumo}</span>
        <h3>${f.nome}</h3>
        <p>${f.detalhe}</p>
        <div class="numeros">
          <div><b>${MOTOR.metros(cmTotal)}</b><span>de gôndola para montar</span></div>
          <div><b>${MOTOR.dinheiro(meta)}</b><span>é o resultado do modelo</span></div>
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
    $("#etapa-numero").textContent = e.numero;
    $("#etapa-marca").textContent = e.nome;
    $("#etapa-titulo").textContent = e.titulo;
    $("#etapa-resumo").textContent = e.resumo;
    if (e.modoEspaco === "linear") {
      const ctx = MOTOR.contexto(e, estado.formato);
      const fmt = FORMATOS.find(f => f.id === estado.formato);
      $("#etapa-regras").innerHTML = `
        <div class="regra"><b>${MOTOR.metros(ctx.cmTotal)}</b><p>de gôndola em ${fmt.nome.toLowerCase()}. Metade já vem montada por sorteio e você pode mexer em tudo.</p></div>
        <div class="regra"><b>${MOTOR.dinheiro(ctx.metaFaturamento)}</b><p>é o faturamento do planograma que a companhia recomenda. Chegue o mais perto que conseguir.</p></div>
        <div class="regra"><b>${ctx.todos.length}</b><p>SKUs disponíveis. Pode repetir o mesmo item para dar mais frentes a ele.</p></div>`;
    } else {
      $("#etapa-regras").innerHTML = `
        <div class="regra"><b>${e.vazios + MOTOR.base(e).length}</b><p>vagas na gôndola, metade já preenchida por sorteio.</p></div>
        <div class="regra"><b>${MOTOR.incrementais(e).length}</b><p>opções na lista, e você pode repetir o mesmo item.</p></div>
        <div class="regra"><b>Tempo</b><p>conta ponto: quanto mais rápido chegar perto do ideal, melhor.</p></div>`;
    }
    irPara("tela-etapa");
  }
  $("#btn-abrir-etapa").addEventListener("click", iniciarEtapa);

  /* ---------------- montagem inicial ---------------- */
  function slotsLinear(e) {
    const ctx = MOTOR.contexto(e, estado.formato);
    estado.ctx = ctx;
    const sorteio = MOTOR.sortearInicial(e, estado.formato, window.FRACAO_INICIAL || 0.5);
    estado.sorteioInicial[e.id] = sorteio.map(s => ({ id: s.id, frentes: s.frentes }));
    const slots = sorteio.map(s => {
      const sku = ctx.todos.find(x => x.id === s.id);
      return { tipo: "item", id: s.id, frentes: s.frentes, cm: MOTOR.espacoCm(sku, estado.formato, s.frentes) };
    });
    const usado = slots.reduce((t, s) => t + s.cm, 0);
    const livre = Math.max(0, ctx.cmTotal - usado);
    const n = Math.max(3, Math.min(14, Math.ceil(livre / 48)));
    const pedaco = Math.round(livre / n);
    const saida = [];
    const passo = Math.max(1, Math.floor(slots.length / n));
    let postas = 0;
    slots.forEach((b, i) => {
      saida.push(b);
      if (postas < n && (i + 1) % passo === 0) {
        saida.push({ tipo: "livre", cm: postas === n - 1 ? livre - pedaco * (n - 1) : pedaco });
        postas++;
      }
    });
    while (postas < n) { saida.push({ tipo: "livre", cm: pedaco }); postas++; }
    return saida;
  }

  function slotsVagas(e) {
    const total = MOTOR.base(e).length + e.vazios;
    const pool = MOTOR.skusDaEtapa(e).slice();
    const sorteio = [];
    const quantas = Math.round(total * (window.FRACAO_INICIAL || 0.5));
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    for (let i = 0; i < quantas && i < pool.length; i++) sorteio.push(pool[i]);
    estado.sorteioInicial[e.id] = sorteio.map(s => ({ id: s.id, frentes: 1 }));
    const slots = [];
    for (let i = 0; i < total; i++) {
      slots.push(i < sorteio.length ? { tipo: "item", id: sorteio[i].id, frentes: 1 } : { tipo: "livre" });
    }
    for (let i = slots.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [slots[i], slots[j]] = [slots[j], slots[i]]; }
    return slots;
  }

  function iniciarEtapa() {
    const e = estado.etapa;
    estado.slots = e.modoEspaco === "linear" ? slotsLinear(e) : slotsVagas(e);
    estado.filtro = "todos"; estado.busca = "";
    $("#busca").value = "";
    $("#m-etapa").textContent = "Etapa " + e.numero;
    $("#m-etapa-nome").textContent = e.nome;
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    $("#plano-titulo").textContent = e.tituloPlano + (e.modoEspaco === "linear" ? " | " + fmt.nome : "");
    $("#btn-confirmar").textContent = "Confirmar etapa " + e.numero;
    $("#rotulo-espaco").textContent = e.modoEspaco === "linear" ? "Espaço livre" : "Vagas livres";
    $("#catalogo-dica").textContent = e.instrucao;
    montarAbas(); desenharPlano(); desenharLista(); atualizarMedidores();
    if (ehLinear()) {
      aviso("A gôndola sorteada fatura " + MOTOR.dinheiro(faturamentoAtual()) +
        ". O modelo da companhia faria " + MOTOR.dinheiro(estado.ctx.metaFaturamento) + ".");
    }
    estado.inicio = Date.now();
    clearInterval(estado.cronometro);
    estado.cronometro = setInterval(() => {
      const s = Math.floor((Date.now() - estado.inicio) / 1000) + (estado.tempos.acumulado || 0);
      $("#m-tempo").textContent = relogio(s);
    }, 500);
    irPara("tela-jogo");
  }

  /* ---------------- estado da gôndola ---------------- */
  const skuPorId = id => (MOTOR.skusDaEtapa(estado.etapa) || []).find(s => s.id === id);
  function escolhasAtuais() {
    const m = new Map();
    estado.slots.filter(s => s.tipo === "item").forEach(s => {
      m.set(s.id, (m.get(s.id) || 0) + (s.frentes || 1));
    });
    return [...m.entries()].map(([id, frentes]) => ({ id, frentes }));
  }
  const livreRestante = () => ehLinear()
    ? estado.slots.filter(s => s.tipo === "livre").reduce((t, s) => t + s.cm, 0)
    : estado.slots.filter(s => s.tipo === "livre").length;
  const faturamentoAtual = () => MOTOR.faturamentoDe(escolhasAtuais(), estado.etapa, estado.formato);

  function prateleiras() {
    const e = estado.etapa;
    if (!ehLinear()) {
      const cols = e.colunas, out = [];
      for (let i = 0; i < estado.slots.length; i += cols) out.push({ cap: cols, itens: estado.slots.slice(i, i + cols) });
      return out;
    }
    const fmt = FORMATOS.find(f => f.id === estado.formato) || {};
    const n = fmt.prateleiras || e.prateleiras || 6;
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
    const linear = ehLinear();
    const html = prateleiras().map(prat => {
      const cap = prat.cap || 1;
      const itens = prat.itens.map(slot => {
        const idx = estado.slots.indexOf(slot);
        const flex = linear ? `flex:0 0 ${(slot.cm / cap * 100).toFixed(3)}%` : "flex:1 1 0";
        if (slot.tipo === "livre") {
          return `<div class="vao vazio" data-slot="${idx}" style="${flex}">${linear ? `<span class="cm">${Math.round(slot.cm)} cm</span>` : ""}</div>`;
        }
        const s = skuPorId(slot.id);
        const fr = slot.frentes || 1;
        return `<div class="vao escolhido" data-slot="${idx}" style="${flex}" title="${s.nome}">
          ${fr > 1 ? `<span class="frentes">${fr}x</span>` : ""}
          <img src="${s.arquivo}" alt="${s.nome}" draggable="false" loading="lazy">
          <span class="nome-mini">${s.nome}</span>
        </div>`;
      }).join("");
      return `<div class="prateleira"><div class="vaos">${itens}</div><div class="base"></div></div>`;
    }).join("");
    $("#prateleiras").innerHTML = html;
    $$("#prateleiras .vao").forEach(v => prepararArraste(v, { tipo: "slot", index: Number(v.dataset.slot) }));
  }

  function montarAbas() {
    const e = estado.etapa;
    const lista = ehLinear() ? estado.ctx.todos : MOTOR.skusDaEtapa(e);
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
    const e = estado.etapa, linear = ehLinear();
    const atuais = new Map(escolhasAtuais().map(x => [x.id, x.frentes]));
    const busca = normal(estado.busca);
    const todos = linear ? estado.ctx.todos : MOTOR.skusDaEtapa(e);
    const lista = todos.filter(s => {
      const cat = s.cat || s.seg;
      const okSeg = estado.filtro === "todos" || cat === estado.filtro;
      const okBusca = !busca || normal(s.nome).includes(busca) || normal(s.marca).includes(busca) || (s.ean || "").includes(busca);
      return okSeg && okBusca;
    }).sort((a, b) => (a.cat || a.seg || "").localeCompare(b.cat || b.seg || "") || a.nome.localeCompare(b.nome));
    if (!lista.length) {
      $("#lista").innerHTML = `<p style="font-size:13px;color:var(--texto-suave)">Nenhum produto encontrado.</p>`;
      return;
    }
    const restante = livreRestante();
    $("#lista").innerHTML = lista.map(s => {
      const cat = seg(s.cat || s.seg);
      const cm = linear ? MOTOR.cmPorFrente(s) : null;
      const cabe = !linear ? restante > 0 : cm <= restante;
      const q = atuais.get(s.id) || 0;
      return `<div class="item ${q ? "dentro" : ""} ${cabe ? "" : "nao-cabe"}" data-sku="${s.id}">
        <img src="${s.arquivo}" alt="${s.nome}" draggable="false" loading="lazy">
        <div>
          <b>${s.nome}</b>
          <small>${s.marca}${linear ? " · " + cm + " cm por frente" : ""}</small>
          <span class="selo" style="background:${cat.cor}">${cat.nome}</span>
        </div>
        <div class="marca-check">${q ? q + "x" : "+"}</div>
      </div>`;
    }).join("");
    $$("#lista .item").forEach(el => prepararArraste(el, { tipo: "lista", id: el.dataset.sku }));
  }

  function atualizarMedidores() {
    const linear = ehLinear();
    const restante = livreRestante();
    $("#m-espacos").textContent = linear ? MOTOR.metros(restante) : restante;
    const fat = faturamentoAtual();
    const meta = linear ? estado.ctx.metaFaturamento : (MOTOR.avaliarEtapa(estado.etapa, escolhasAtuais(), estado.formato).meta || 1);
    $("#m-faturamento").textContent = MOTOR.dinheiro(fat);
    const pct = Math.round(fat / Math.max(1, meta) * 100);
    $("#m-meta").textContent = pct + "% da meta";
    $("#m-faturamento").classList.toggle("bom", pct >= 85);
    const barra = $("#m-barra");
    if (barra) barra.style.width = Math.min(100, pct) + "%";
  }

  /* ---------------- colocar e tirar ---------------- */
  function colocar(id, indiceAlvo) {
    const s = skuPorId(id);
    if (!s) return;
    if (ehLinear()) {
      const cm = MOTOR.cmPorFrente(s);
      let alvo = indiceAlvo;
      const bomAlvo = i => estado.slots[i] && estado.slots[i].tipo === "livre" && estado.slots[i].cm >= cm;
      if (alvo == null || !bomAlvo(alvo)) alvo = estado.slots.findIndex((x, i) => bomAlvo(i));
      if (alvo < 0) {
        const total = livreRestante();
        if (cm > total) { aviso(`${s.nome} precisa de ${cm} cm e só restam ${MOTOR.metros(total)}`); return; }
        compactarLivres();
        alvo = estado.slots.findIndex((x, i) => bomAlvo(i));
        if (alvo < 0) { aviso(`${s.nome} não cabe no espaço que restou`); return; }
      }
      const sobra = estado.slots[alvo].cm - cm;
      const vizinho = estado.slots[alvo - 1];
      if (vizinho && vizinho.tipo === "item" && vizinho.id === id) {
        /* soma uma frente ao bloco que já está do lado */
        vizinho.frentes += 1; vizinho.cm = MOTOR.espacoCm(s, estado.formato, vizinho.frentes);
        if (sobra >= 4) estado.slots[alvo] = { tipo: "livre", cm: sobra };
        else estado.slots.splice(alvo, 1);
      } else {
        const novos = [{ tipo: "item", id, frentes: 1, cm }];
        if (sobra >= 4) novos.push({ tipo: "livre", cm: sobra });
        else if (sobra > 0) novos[0].cm += sobra;
        estado.slots.splice(alvo, 1, ...novos);
      }
    } else {
      let alvo = indiceAlvo;
      if (alvo == null || !estado.slots[alvo] || estado.slots[alvo].tipo !== "livre") {
        alvo = estado.slots.findIndex(x => x.tipo === "livre");
      }
      if (alvo < 0) { aviso("Todas as vagas estão ocupadas. Tire alguma para trocar."); return; }
      estado.slots[alvo] = { tipo: "item", id, frentes: 1 };
    }
    atualizar();
  }

  function tirarUmaFrente(indice) {
    const slot = estado.slots[indice];
    if (!slot || slot.tipo !== "item") return;
    const s = skuPorId(slot.id);
    if (ehLinear() && (slot.frentes || 1) > 1) {
      const antes = slot.cm;
      slot.frentes -= 1;
      slot.cm = MOTOR.espacoCm(s, estado.formato, slot.frentes);
      estado.slots.splice(indice + 1, 0, { tipo: "livre", cm: antes - slot.cm });
    } else {
      estado.slots[indice] = ehLinear() ? { tipo: "livre", cm: slot.cm } : { tipo: "livre" };
    }
    if (ehLinear()) juntarLivres();
    atualizar();
  }
  function tirarBloco(indice) {
    const slot = estado.slots[indice];
    if (!slot || slot.tipo !== "item") return;
    estado.slots[indice] = ehLinear() ? { tipo: "livre", cm: slot.cm } : { tipo: "livre" };
    if (ehLinear()) juntarLivres();
    atualizar();
  }
  function juntarLivres() {
    for (let i = estado.slots.length - 1; i > 0; i--) {
      if (estado.slots[i].tipo === "livre" && estado.slots[i - 1].tipo === "livre") {
        estado.slots[i - 1].cm += estado.slots[i].cm;
        estado.slots.splice(i, 1);
      }
    }
  }
  function compactarLivres() {
    const total = estado.slots.filter(x => x.tipo === "livre").reduce((t, x) => t + x.cm, 0);
    estado.slots = estado.slots.filter(x => x.tipo !== "livre").concat(total > 0 ? [{ tipo: "livre", cm: total }] : []);
  }
  function atualizar() { desenharPlano(); desenharLista(); atualizarMedidores(); }

  /* ---------------- arrastar ---------------- */
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
      const slot = origem.tipo === "slot" ? estado.slots[origem.index] : null;
      const id = origem.tipo === "slot" ? (slot || {}).id : origem.id;
      if (!id) return;
      const sku = skuPorId(id);
      if (!sku) return;
      const inicio = { x: ev.clientX, y: ev.clientY };
      let ativo = false, fantasma = null;

      const mover = e => {
        if (!ativo && Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) < 9) return;
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
          const sl = estado.slots[Number(v.dataset.slot)];
          const serve = v === alvo && sl && sl.tipo === "livre" &&
            (!ehLinear() || sl.cm >= MOTOR.cmPorFrente(sku));
          v.classList.toggle("sobre", !!serve);
          v.classList.toggle("nao-serve", v === alvo && !serve && sl && sl.tipo === "livre");
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
          if (origem.tipo === "lista") colocar(id, null); else tirarUmaFrente(origem.index);
        } else {
          const alvo = vaoSob(e.clientX, e.clientY);
          if (alvo) {
            const destino = Number(alvo.dataset.slot);
            const sl = estado.slots[destino];
            if (origem.tipo === "lista") colocar(id, destino);
            else if (destino !== origem.index) { tirarBloco(origem.index); colocar(id, null); }
          } else if (origem.tipo === "slot") {
            tirarBloco(origem.index);
            aviso(sku.nome + " saiu da gôndola");
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
      if (origem.tipo === "lista") colocar(origem.id, null); else tirarUmaFrente(origem.index);
    });
    el.addEventListener("dragstart", e => e.preventDefault());
  }

  $("#busca").addEventListener("input", e => { estado.busca = e.target.value; desenharLista(); });

  $("#btn-esvaziar").addEventListener("click", () => {
    if (!estado.slots.some(s => s.tipo === "item")) return;
    if (!confirm("Tirar tudo da gôndola e montar do zero? O relógio não para.")) return;
    if (ehLinear()) {
      estado.slots = [{ tipo: "livre", cm: estado.ctx.cmTotal }];
    } else {
      estado.slots = estado.slots.map(() => ({ tipo: "livre" }));
    }
    atualizar();
    aviso("Gôndola vazia. Agora é montar do seu jeito.");
  });

  /* ---------------- confirmar ---------------- */
  $("#btn-confirmar").addEventListener("click", () => {
    const e = estado.etapa;
    const resta = livreRestante();
    const vazio = ehLinear() ? resta > 12 : resta > 0;
    const texto = ehLinear()
      ? `Ainda sobram ${MOTOR.metros(resta)} de gôndola vazios, e gôndola vazia não fatura. Confirmar assim mesmo?`
      : `Ainda faltam ${resta} vagas. Confirmar assim mesmo?`;
    if (vazio && !confirm(texto)) return;
    clearInterval(estado.cronometro);
    const gastos = Math.max(1, Math.floor((Date.now() - estado.inicio) / 1000));
    estado.tempos[e.id] = gastos;
    estado.tempos.acumulado = (estado.tempos.acumulado || 0) + gastos;
    estado.escolhas[e.id] = escolhasAtuais();
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
      faturamento: resultados[0] ? resultados[0].faturamento : 0,
      meta: resultados[0] ? resultados[0].meta : 0,
      temposEtapas: ETAPAS.reduce((o, e) => (o[e.id] = estado.tempos[e.id] || 0, o), {}),
      blocos: nota.blocos.reduce((o, b) => (o[b.chave] = b.pontos, o), {}),
      sorteioInicial: estado.sorteioInicial,
      etapas: resultados.map(r => ({
        etapa: r.etapa.id,
        escolhidos: r.blocos.map(b => b.sku.nome + (b.frentes > 1 ? " (" + b.frentes + " frentes)" : "")),
        faturamento: r.faturamento, meta: r.meta,
        aproveitamento: Math.round(r.aproveitamento * 100),
        aderencia: Math.round(r.aderencia * 100),
        perdidos: r.perdidos.slice(0, 8).map(p => p.sku.nome),
        foraDoPlano: r.foraDoPlano.map(b => b.sku.nome)
      }))
    });
    estado.participante = await STORE.salvar(registro);
    montarResultado();
    irPara("tela-resultado");
  }

  function montarResultado() {
    const { resultados, nota } = estado.resultado;
    const fmt = FORMATOS.find(f => f.id === estado.formato);
    const r1 = resultados[0];
    $("#res-nome").textContent = estado.participante.nome +
      (estado.participante.empresa ? " | " + estado.participante.empresa : "") +
      (fmt ? " | " + fmt.nome : "");
    $("#res-pontos").innerHTML = nota.total + "<small>/1000</small>";
    $("#res-nivel").textContent = nota.nivel;
    $("#res-financeiro").innerHTML = r1
      ? `<div class="fat-bloco"><span>Sua gôndola fatura</span><b>${MOTOR.dinheiro(r1.faturamento)}</b></div>
         <div class="fat-seta">→</div>
         <div class="fat-bloco"><span>Modelo da companhia</span><b>${MOTOR.dinheiro(r1.meta)}</b></div>
         <div class="fat-bloco destaque"><span>Você chegou a</span><b>${Math.round(r1.faturamento / Math.max(1, r1.meta) * 100)}%</b></div>`
      : "";

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
      const linha = (sku, frentes, classe, extra, valor) => `
        <div class="linha-item ${classe}">
          <img src="${sku.arquivo}" alt="">
          <div><b>${sku.nome}${frentes > 1 ? " · " + frentes + " frentes" : ""}</b><small>${extra}</small></div>
          <div class="valor">${valor}</div>
        </div>`;
      const bons = r.acertos.slice(0, 4).map(b => linha(b.sku, b.frentes, "ok",
        linear ? seg(b.sku.cat).nome + " · " + MOTOR.espacoCm(b.sku, fid, b.frentes) + " cm"
               : (b.sku.motivo || ""),
        linear ? MOTOR.dinheiro(MOTOR.giroDoBloco(b.sku, fid, b.frentes)) : "+" + b.sku.valor)).join("")
        || `<p style="font-size:13px;color:var(--texto-suave)">Nenhum item do plano entrou na sua gôndola.</p>`;
      const faltou = r.perdidos.slice(0, 4).map(p => linha(p.sku, p.frentes, "falta",
        linear ? "Rende " + MOTOR.dinheiro(MOTOR.giroPorFrente(p.sku, fid)) + " por frente em " + MOTOR.cmPorFrente(p.sku) + " cm"
               : (p.sku.motivo || "Item de alta incrementalidade"),
        linear ? MOTOR.dinheiro(MOTOR.giroDoBloco(p.sku, fid, p.frentes)) : "+" + p.sku.valor)).join("")
        || `<p style="font-size:13px;color:var(--texto-suave)">Você levou tudo o que o modelo recomenda.</p>`;
      const fora = (r.foraDoPlano || []).slice(0, 3).map(b => linha(b.sku, b.frentes, "falta",
        "Não faz parte do plano deste formato", MOTOR.espacoCm(b.sku, fid, b.frentes) + " cm")).join("");
      return `
      <div class="cartao">
        <h3>Etapa ${r.etapa.numero} | ${r.etapa.nome}</h3>
        <p class="sub">${linear
          ? `${MOTOR.dinheiro(r.faturamento)} de faturamento projetado, ${Math.round(r.aproveitamento * 100)}% do melhor resultado possível, ${r.itens} SKUs em ${r.frentes} frentes, ${MOTOR.metros(r.espacoUsado)} de ${MOTOR.metros(r.espacoTotal)} ocupados.`
          : `${r.itens} SKUs escolhidos, ${Math.round(r.aproveitamento * 100)}% do potencial.`}
          Tempo: ${MOTOR.formatarTempo(estado.tempos[r.etapa.id] || 0)}.</p>
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--verde);margin:0 0 8px">O que mais fatura na sua gôndola</h4>
        ${bons}
        <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--vermelho);margin:16px 0 8px">O que o modelo tinha e você deixou passar</h4>
        ${faltou}
        ${fora ? `<h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--texto-suave);margin:16px 0 8px">Fora do plano deste formato</h4>${fora}` : ""}
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
      const podio = lista.slice(0, 3);
      $("#res-podio").innerHTML = podio.length > 1 ? podio.map((r, i) => `
        <div class="podio-card lugar-${i + 1} ${r.id === estado.participante.id ? "eu" : ""}">
          <span class="medalha">${["1º", "2º", "3º"][i]}</span>
          <b>${(r.nome || "").split(" ").slice(0, 2).join(" ")}</b>
          <small>${r.empresa || ""}</small>
          <span class="pts">${r.pontuacao} pts</span>
        </div>`).join("") : "";
      $("#res-ranking").innerHTML = `
        <thead><tr><th>#</th><th>Participante</th><th>Empresa</th><th>Loja</th><th>Faturamento</th><th>Tempo</th><th>Pontos</th></tr></thead>
        <tbody>${lista.slice(0, 10).map((r, i) => `
          <tr class="${r.id === estado.participante.id ? "eu" : ""}">
            <td class="pos ${i < 3 ? "podio-" + (i + 1) : ""}">${i + 1}</td>
            <td>${(r.nome || "").split(" ").slice(0, 2).join(" ")}</td>
            <td>${r.empresa || ""}</td>
            <td>${r.formatoNome || ""}</td>
            <td>${r.faturamento ? MOTOR.dinheiro(r.faturamento) : ""}</td>
            <td>${MOTOR.formatarTempo(r.segundos || 0)}</td>
            <td><b>${r.pontuacao}</b></td>
          </tr>`).join("")}</tbody>`;
    }).then(off => { estado.desligarRanking = off; });
  }

  $("#btn-proximo").addEventListener("click", () => {
    if (estado.desligarRanking) { estado.desligarRanking(); estado.desligarRanking = null; }
    estado.participante = null; estado.formato = null;
    estado.etapaIdx = 0; estado.escolhas = {}; estado.tempos = {}; estado.sorteioInicial = {};
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
