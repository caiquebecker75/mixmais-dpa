/* ==========================================================================
   MIX+ DPA | painel do evento
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG;
  const $ = s => document.querySelector(s);
  let registros = [];
  let desligar = null;

  function aviso(t) {
    const el = $("#aviso"); el.textContent = t; el.classList.add("aparece");
    setTimeout(() => el.classList.remove("aparece"), 2200);
  }

  $("#form-senha").addEventListener("submit", e => {
    e.preventDefault();
    if ($("#f-senha").value === CFG.senhaPainel) {
      sessionStorage.setItem("mix_painel_ok", "1");
      abrir();
    } else {
      document.querySelector('[data-erro="f-senha"]').textContent = "Senha incorreta";
      $("#f-senha").classList.add("invalido");
    }
  });

  function abrir() {
    $("#tela-senha").classList.remove("ativa");
    $("#tela-painel").classList.add("ativa");
    $("#tarja-evento").textContent = CFG.evento;
    $("#descricao-modo").textContent = "Modo de armazenamento: " + CFG.storage + ".";
    $("#modo").textContent = STORE.aoVivo
      ? "Firestore ligado: as partidas de todos os tablets chegam aqui e o ranking atualiza sozinho."
      : "Modo local: este painel mostra apenas as partidas jogadas neste aparelho. Para juntar os tablets, preencha as chaves do Firebase em config.js.";
    ligar();
  }
  if (sessionStorage.getItem("mix_painel_ok") === "1") abrir();

  async function ligar() {
    if (desligar) desligar();
    desligar = await STORE.ouvirRanking(() => carregar());
    carregar();
  }
  async function carregar() {
    registros = await STORE.listar();
    render();
  }
  $("#btn-atualizar").addEventListener("click", () => { carregar(); aviso("Dados atualizados"); });

  const fmtData = iso => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  function barras(alvo, itens) {
    if (!itens.length) { $(alvo).innerHTML = `<p style="font-size:13px;color:var(--texto-suave)">Sem dados ainda.</p>`; return; }
    const max = Math.max(...itens.map(i => i.valor), 1);
    $(alvo).innerHTML = itens.map(i => `
      <div class="barra-linha">
        <div>
          <div class="nome">${i.nome}</div>
          <div class="trilho"><i style="width:${i.valor / max * 100}%"></i></div>
        </div>
        <div class="num">${i.valor}x</div>
      </div>`).join("");
  }

  function render() {
    const feitos = STORE.ordenar(registros);
    const media = feitos.length ? Math.round(feitos.reduce((t, r) => t + r.pontuacao, 0) / feitos.length) : 0;
    const tempoMedio = feitos.length ? Math.round(feitos.reduce((t, r) => t + (r.segundos || 0), 0) / feitos.length) : 0;
    const melhor = feitos[0];

    $("#kpis").innerHTML = `
      <div class="kpi"><b>${registros.length}</b><span>Cadastros</span></div>
      <div class="kpi"><b>${feitos.length}</b><span>Partidas concluídas</span></div>
      <div class="kpi"><b>${media}</b><span>Pontuação média</span></div>
      <div class="kpi"><b>${MOTOR.formatarTempo(tempoMedio)}</b><span>Tempo médio</span></div>
      <div class="kpi"><b>${melhor ? melhor.pontuacao : 0}</b><span>Melhor pontuação</span></div>`;

    $("#sub-ranking").textContent = STORE.aoVivo
      ? "Atualiza sozinho quando qualquer tablet termina uma partida."
      : "Somente as partidas deste aparelho.";
    $("#tabela-ranking").innerHTML = `
      <thead><tr><th>#</th><th>Participante</th><th>Empresa</th><th>Loja</th><th>Tablet</th><th>Tempo</th><th>Nível</th><th>Pontos</th></tr></thead>
      <tbody>${feitos.slice(0, 20).map((r, i) => `
        <tr>
          <td class="pos ${i < 3 ? "podio-" + (i + 1) : ""}">${i + 1}</td>
          <td>${r.nome || ""}</td><td>${r.empresa || ""}</td><td>${r.formatoNome || ""}</td><td>${r.tablet || ""}</td>
          <td>${MOTOR.formatarTempo(r.segundos || 0)}</td><td>${r.nivel || ""}</td>
          <td><b>${r.pontuacao}</b></td>
        </tr>`).join("")}</tbody>`;

    const escolhidos = {}, esquecidos = {};
    feitos.forEach(r => (r.etapas || []).forEach(e => {
      (e.escolhidos || []).forEach(n => escolhidos[n] = (escolhidos[n] || 0) + 1);
      (e.perdidos || []).forEach(n => esquecidos[n] = (esquecidos[n] || 0) + 1);
    }));
    const paraLista = obj => Object.entries(obj).map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor).slice(0, 8);
    barras("#mais-escolhidos", paraLista(escolhidos));
    barras("#mais-esquecidos", paraLista(esquecidos));

    $("#resumo-base").textContent = registros.length + " registros no evento " + CFG.evento + ".";
    $("#tabela-base").innerHTML = `
      <thead><tr><th>Nome</th><th>E-mail</th><th>Empresa</th><th>Telefone</th><th>Área</th><th>Pontos</th><th>Tempo</th><th>Status</th><th>Quando</th></tr></thead>
      <tbody>${registros.slice().sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || "")).map(r => `
        <tr>
          <td>${r.nome || ""}</td><td>${r.email || ""}</td><td>${r.empresa || ""}</td>
          <td>${r.telefone || ""}</td><td>${r.area || ""}</td>
          <td>${r.pontuacao != null ? r.pontuacao : ""}</td>
          <td>${r.segundos ? MOTOR.formatarTempo(r.segundos) : ""}</td>
          <td>${r.status === "concluido" ? "Concluiu" : "Só cadastro"}</td>
          <td>${fmtData(r.criadoEm)}</td>
        </tr>`).join("")}</tbody>`;
  }

  function baixar(nome, conteudo, tipo) {
    const b = new Blob([conteudo], { type: tipo });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = nome; a.click();
    URL.revokeObjectURL(a.href);
  }
  $("#btn-csv").addEventListener("click", () => {
    const cols = ["nome", "email", "empresa", "telefone", "area", "formatoNome", "pontuacao", "nivel", "segundos", "tablet", "status", "criadoEm", "evento"];
    const linhas = [cols.concat(["escolhas", "esquecidos"]).join(";")];
    registros.forEach(r => {
      const esc = (r.etapas || []).flatMap(e => e.escolhidos || []).join(" | ");
      const per = (r.etapas || []).flatMap(e => e.perdidos || []).join(" | ");
      linhas.push(cols.map(c => String(r[c] == null ? "" : r[c]).replace(/[;\n\r]/g, " ")).concat([esc, per]).join(";"));
    });
    baixar("mixmais-dpa-participantes.csv", "﻿" + linhas.join("\n"), "text/csv;charset=utf-8");
  });
  $("#btn-json").addEventListener("click", () => baixar("mixmais-dpa-participantes.json", JSON.stringify(registros, null, 2), "application/json"));
  $("#btn-limpar").addEventListener("click", () => {
    if (!confirm("Isso apaga os registros gravados neste aparelho. Baixe o CSV antes. Continuar?")) return;
    STORE.limparLocal(); carregar(); aviso("Registros locais apagados");
  });
})();
