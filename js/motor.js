/* ==========================================================================
   ESQUADRAO ACELERA +DPA | motor de pontuacao
   Base: planilha "SORTIMENTO MINIMO 2026-2027 VF" (aba BASE).
   - FIXOS entram sozinhos (carga obrigatoria).
   - Cada GRUPO DE ESCOLHA vira um alvo: o piloto trava a quantidade pedida.
   - Junto do grupo entram SKUs que estao FORA do sortimento do canal (iscas).
   - Nota do SKU = venda (importancia DPA) + margem (posicao no canal), em %.
   - Nota do alvo e normalizada entre o pior e o melhor conjunto possivel.
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG;
  const B = window.BASE;

  const FILIAIS = [
    { id: "SSCO", nome: "Sul, Sudeste e Centro-Oeste", curto: "SSCO" },
    { id: "NENO", nome: "Norte e Nordeste", curto: "NENO" }
  ];
  const CANAIS = [
    { id: "Trad+Pad", nome: "Tradicional e Padaria", curto: "Tradicional", icone: 1 },
    { id: "1-4 CKS", nome: "Autosserviço 1 a 4 checkouts", curto: "1 a 4 checkouts", icone: 2 },
    { id: "5-9 CKS", nome: "Autosserviço 5 a 9 checkouts", curto: "5 a 9 checkouts", icone: 3 },
    { id: "10+ CKS", nome: "Autosserviço 10+ checkouts", curto: "10+ checkouts", icone: 4 },
    { id: "C&C", nome: "Cash & Carry", curto: "Cash & Carry", icone: 5 }
  ];
  const MISSOES = [
    { id: "iogurtes", numero: 1, nome: "Iogurtes", titulo: "Missão Iogurtes", marca: "Nestlé, Chamyto, Chambinho, Ninho, Grego, Molico, Chandelle" },
    { id: "galbani", numero: 2, nome: "Galbani", titulo: "Missão Queijos e Spreads", marca: "Galbani e Requeijão Nestlé" }
  ];

  const sku = e => B.skus[e] || { n: e, m: "", s: "" };

  function embaralhar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Monta as duas missoes do canal escolhido, ja com as opcoes embaralhadas. */
  function montar(filial, canal) {
    const blk = B.canais[filial + "|" + canal];
    return MISSOES.map(m => {
      const d = blk[m.id];
      return Object.assign({}, m, {
        fixos: d.fixos,
        alvos: d.alvos.map((a, i) => ({ id: m.id + "-" + i, g: a.g, q: a.q, o: embaralhar(a.o) }))
      });
    });
  }

  /* Valor de um SKU dentro do alvo, de 0 a 1.
     Recomendado (dentro do grupo de escolha): venda relativa ao mais vendido do grupo + margem.
     Fora do sortimento: sempre vale menos que o recomendado mais fraco, por mais que venda. */
  function valores(alvo) {
    const dentro = alvo.o.filter(o => !o.f), fora = alvo.o.filter(o => o.f);
    const base = dentro.length ? dentro : alvo.o;
    const maxI = Math.max(...base.map(o => o.i), 0.0001), maxTodos = Math.max(...alvo.o.map(o => o.i), 0.0001);
    const out = {};
    base.forEach(o => { out[o.e] = CFG.pesos.venda * Math.min(1, o.i / maxI) + CFG.pesos.margem * o.r; });
    const piso = Math.min(...base.map(o => out[o.e]));
    if (dentro.length) fora.forEach(o => {
      const proprio = CFG.pesos.venda * (o.i / maxTodos) + CFG.pesos.margem * o.r;
      out[o.e] = piso * CFG.fatorForaDoSortimento * Math.min(1, proprio);
    });
    return out;
  }

  function avaliarAlvo(alvo, escolhidos) {
    const v = valores(alvo);
    const ord = alvo.o.slice().sort((a, b) => v[b.e] - v[a.e]);
    const q = Math.min(alvo.q, alvo.o.length);
    const melhor = ord.slice(0, q).map(o => o.e);
    const pior = ord.slice(-q).map(o => o.e);
    const soma = l => l.reduce((t, e) => t + (v[e] || 0), 0);
    const sB = soma(melhor), sP = soma(pior), sE = soma(escolhidos);
    let pv = sB - sP > 1e-9 ? (sE - sP) / (sB - sP) : 1;
    pv = Math.max(0, Math.min(1, pv));
    const acertos = escolhidos.filter(e => melhor.includes(e)).length;
    /* metade pela qualidade do conjunto (venda + margem), metade por SKU certo */
    const p = acertos === q ? 1 : 0.5 * pv + 0.5 * (acertos / q);
    const iscas = escolhidos.filter(e => (alvo.o.find(o => o.e === e) || {}).f).length;
    /* venda capturada (so importancia DPA) */
    /* venda capturada: SKU fora do sortimento conta com o mesmo desconto */
    const imp = e => { const o = alvo.o.find(x => x.e === e); return o ? o.i * (o.f ? CFG.fatorForaDoSortimento : 1) : 0; };
    const vendaEscolha = escolhidos.reduce((t, e) => t + imp(e), 0);
    const vendaMelhor = melhor.reduce((t, e) => t + imp(e), 0);
    let grau;
    if (p >= 0.999) grau = { id: "perfeito", nome: "Alvo abatido", sub: "Escolha perfeita", estrelas: 3 };
    else if (p >= 0.6) grau = { id: "bom", nome: "No alvo", sub: "Boa escolha, dava para ir mais alto", estrelas: 2 };
    else if (p > 0.05) grau = { id: "raspao", nome: "De raspão", sub: "Tinha SKU que incrementa mais", estrelas: 1 };
    else grau = { id: "erro", nome: "Alvo perdido", sub: "Essa escolha não incrementa a loja", estrelas: 0 };
    return { p, melhor, acertos, iscas, grau, vendaEscolha, vendaMelhor };
  }

  function totalEscolhas(missao) { return missao.alvos.reduce((t, a) => t + a.q, 0); }

  /* Pontos que um alvo vale dentro da missao */
  function pontosDoAlvo(missao, alvo, p) {
    const total = totalEscolhas(missao) || 1;
    return CFG.pontos[missao.id] * (alvo.q / total) * p;
  }

  function tempoReferencia(missoes) {
    return missoes.reduce((t, m) => t + m.alvos.length * CFG.tempoPorAlvo + totalEscolhas(m) * CFG.tempoPorSku, 0);
  }

  /* Bonus de velocidade: cheio ate metade do tempo de referencia, zero em 2,5x */
  function bonusVelocidade(segundos, ref) {
    const rapido = ref * 0.5, limite = ref * 2.5;
    const f = Math.max(0, Math.min(1, (limite - segundos) / (limite - rapido)));
    return { fator: f, pontos: Math.round(CFG.pontos.velocidade * f) };
  }

  const PATENTES = [
    { min: 9000, nome: "Ás do Esquadrão", divisas: 5 },
    { min: 8000, nome: "Comandante", divisas: 4 },
    { min: 6500, nome: "Capitão", divisas: 3 },
    { min: 5000, nome: "Tenente", divisas: 2 },
    { min: 0, nome: "Cadete", divisas: 1 }
  ];
  const patente = pts => PATENTES.find(p => pts >= p.min);

  const CODINOMES = ["FALCÃO", "TROVÃO", "RELÂMPAGO", "COMETA", "FÊNIX", "CONDOR", "TUFÃO", "ÁGUIA", "RAIO", "ÓRBITA",
    "TORNADO", "VULCÃO", "JAGUAR", "ESTRELA", "TURBO", "RADAR", "HÉLICE", "CICLONE", "PANTERA", "METEORO", "GAVIÃO", "TITÃ", "NOVA", "ZÊNITE"];

  const formatarTempo = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.round(s) % 60).padStart(2, "0");
  const milhar = n => Math.round(n).toLocaleString("pt-BR");
  const pct = (x, casas = 0) => (x * 100).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) + "%";

  window.MOTOR = {
    FILIAIS, CANAIS, MISSOES, CODINOMES, PATENTES,
    sku, montar, avaliarAlvo, pontosDoAlvo, totalEscolhas, tempoReferencia, bonusVelocidade,
    patente, embaralhar, formatarTempo, milhar, pct
  };
})();
