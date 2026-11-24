/* ==========================================================================
   ESQUADRAO ACELERA +DPA | placar ao vivo para TV (placar.html)
   Le o mesmo ranking do jogo. Com Firebase ligado, atualiza sozinho a cada pouso.
   placar.html?demo=1 mostra dados ficticios para apresentar o layout.
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG, M = window.MOTOR, A = window.ARTE;
  const $ = s => document.querySelector(s);
  const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nomeCurto = n => { const p = (n || "").trim().split(/\s+/); return p.length > 1 ? p[0] + " " + p[p.length - 1][0] + "." : p[0] || ""; };
  const demo = new URLSearchParams(location.search).get("demo") === "1";

  A.esquadrilha(true);
  $("#zona-txt").textContent = `TOP ${CFG.zonaPremio} = ZONA DE PREMIAÇÃO`;
  $("#premio-tv").textContent = CFG.premio ? `Top ${CFG.zonaPremio} leva ${CFG.premio}` : `Top ${CFG.zonaPremio} entra na zona de premiação`;

  const relogio = () => {
    const d = new Date();
    $("#relogio").innerHTML = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + "<small>HORA LOCAL</small>";
  };
  relogio(); setInterval(relogio, 10000);

  let vistos = null, fila = [], mostrando = false, anterior = [];

  function render(lista) {
    const top = lista.slice(0, 10), max = top[0] ? top[0].pontuacao : 1;
    const ant = new Set(anterior.slice(0, 10).map(r => r.id + ":" + r.pontuacao));
    $("#lista-tv").innerHTML = Array.from({ length: 10 }, (_, i) => {
      const r = top[i];
      if (!r) return `<li class="vazio ${i < CFG.zonaPremio ? "zona" : ""}"><span class="pos">${i + 1}</span><span class="quem"><b>posição livre</b></span></li>`;
      const canal = (M.CANAIS.find(c => c.id === r.canal) || {}).curto || "";
      const novo = anterior.length && !ant.has(r.id + ":" + r.pontuacao);
      return `<li class="p${i + 1} ${i < CFG.zonaPremio ? "zona" : ""} ${novo ? "novo" : ""}">
        <span class="pos">${i + 1}</span>
        <span class="av">${esc((r.codinome || "P").slice(0, 2))}</span>
        <span class="quem"><b>${esc(r.codinome || "PILOTO")}</b><span>${esc(nomeCurto(r.nome))} · ${esc(r.filial || "")} · ${esc(canal)}</span></span>
        <span class="barra"><s style="width:${Math.max(4, r.pontuacao / max * 100)}%"></s></span>
        <span class="pts">${M.milhar(r.pontuacao)}</span>
      </li>`;
    }).join("");
    anterior = lista.slice();

    const n = lista.length;
    $("#k-pilotos").textContent = n;
    $("#k-media").textContent = n ? M.milhar(lista.reduce((t, r) => t + r.pontuacao, 0) / n) : "0";
    $("#k-perfeitos").textContent = M.milhar(lista.reduce((t, r) => t + (r.alvosPerfeitos || 0), 0));

    const reg = M.FILIAIS.map(f => {
      const l = lista.filter(r => r.filial === f.id);
      return { f, n: l.length, media: l.length ? l.reduce((t, r) => t + r.pontuacao, 0) / l.length : 0 };
    });
    $("#duelo").innerHTML = `
      <div class="lado"><b>${reg[0].f.curto}</b><em>${M.milhar(reg[0].media)}</em><span>${reg[0].n} pilotos</span></div>
      <div class="vs">VS</div>
      <div class="lado"><b>${reg[1].f.curto}</b><em>${M.milhar(reg[1].media)}</em><span>${reg[1].n} pilotos</span></div>`;
    const soma = reg[0].media + reg[1].media || 1;
    const p0 = reg[0].media || reg[1].media ? reg[0].media / soma * 100 : 50;
    $("#duelo-barra").innerHTML = `<i style="width:${p0}%"></i><i style="width:${100 - p0}%"></i>`;

    $("#canais-tv").innerHTML = M.CANAIS.map(c => {
      const l = lista.filter(r => r.canal === c.id);
      const best = l[0];
      return `<div><span>${c.curto}</span>
        <span class="barra"><s style="width:${best ? best.pontuacao / 100 : 0}%"></s></span>
        <em>${best ? esc(best.codinome) : "-"}</em></div>`;
    }).join("");

    const ult = lista.slice().sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || "")).slice(0, 6);
    $("#pousos").innerHTML = ult.length ? ult.map(r => {
      const pos = lista.indexOf(r) + 1;
      const h = r.atualizadoEm ? new Date(r.atualizadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";
      return `<li><span><b>${esc(r.codinome)}</b><span>${esc(nomeCurto(r.nome))}</span></span><em>${M.milhar(r.pontuacao)} · ${pos}º</em><small>${h}</small></li>`;
    }).join("") : `<li><span>Aguardando o primeiro pouso...</span></li>`;

    /* novos pousos viram destaque em tela cheia */
    if (vistos === null) { vistos = new Set(lista.map(r => r.id)); return; }
    lista.forEach((r, i) => { if (!vistos.has(r.id)) { vistos.add(r.id); fila.push({ r, pos: i + 1 }); } });
    proximoAlerta();
  }

  async function proximoAlerta() {
    if (mostrando || !fila.length) return;
    mostrando = true;
    const { r, pos } = fila.shift();
    const pat = M.patente(r.pontuacao);
    $("#alerta-caixa").innerHTML = `
      <span class="etapa-tag">NOVO POUSO // ${esc(r.filial || "")} · ${esc(r.canalNome || "")}</span>
      <div class="insignia" style="margin:1.4rem auto 0">${A.insignia(pat.divisas)}</div>
      <h2>${esc(r.codinome)}</h2>
      <p>${esc(nomeCurto(r.nome))} · ${esc(pat.nome)}</p>
      <div class="num">${M.milhar(r.pontuacao)}</div>
      <div class="pos-tv">${pos}º lugar${pos <= CFG.zonaPremio ? " · ZONA DE PREMIAÇÃO" : ""}</div>`;
    $("#alerta-pouso").classList.add("on");
    SOM.rasante();
    if (window.confetti) setTimeout(() => confetti({ particleCount: pos <= CFG.zonaPremio ? 220 : 90, spread: 100, startVelocity: 60, origin: { y: .45 }, colors: ["#F47B20", "#8DC63F", "#FFFFFF", "#2F7BE8"], scalar: 1.4 }), 400);
    await new Promise(res => setTimeout(res, 6500));
    $("#alerta-pouso").classList.remove("on");
    await new Promise(res => setTimeout(res, 600));
    mostrando = false;
    proximoAlerta();
  }

  if (demo) {
    document.body.insertAdjacentHTML("beforeend", `<div class="demo-tag">DEMONSTRAÇÃO · DADOS FICTÍCIOS</div>`);
    const nomes = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha", "Elisa Prado", "Fábio Nunes", "Gabi Torres", "Hugo Melo", "Iara Costa", "João Pires", "Karla Reis", "Lucas Brito"];
    let lista = [];
    const novo = (i, min) => {
      const c = M.CANAIS[i % 5], f = M.FILIAIS[i % 2];
      return { id: "demo" + i, nome: nomes[i % nomes.length], codinome: M.CODINOMES[i % M.CODINOMES.length], filial: f.id, canal: c.id, canalNome: c.nome,
        pontuacao: Math.round(4200 + Math.random() * 5200), alvosPerfeitos: Math.round(4 + Math.random() * 12), status: "concluido",
        atualizadoEm: new Date(Date.now() - min * 60000).toISOString() };
    };
    for (let i = 0; i < 8; i++) lista.push(novo(i, 40 - i * 4));
    render(STORE.ordenar(lista));
    let k = 8;
    setInterval(() => { lista.push(novo(k++, 0)); render(STORE.ordenar(lista)); }, 15000);
  } else {
    STORE.ouvirRanking(lista => render(lista));
    /* modo local: sem Firebase o placar so ve partidas deste aparelho; relê a cada 10 s */
    if (!STORE.aoVivo) setInterval(() => STORE.listar().then(l => render(STORE.ordenar(l))), 10000);
  }
})();
