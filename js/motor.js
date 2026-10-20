/* ==========================================================================
   MIX+ DPA | motor da atividade
   --------------------------------------------------------------------------
   A loja ja tem o sortimento de maior volume. O participante escolhe quais
   itens incrementais entrariam para vender mais. A correcao usa o simulador
   da DPA: potencial de venda do SKU naquele formato de loja e a margem dele.
   Durante a escolha nada disso aparece na tela, senao entrega a resposta.
   ========================================================================== */
(function () {

  const skusDaEtapa = etapa => window[etapa.fonte] || [];
  const plano = fid => (window.PLANOS || {})[fid] || null;
  const noPlano = (sku, fid) => !!(sku.planos && sku.planos[fid]);
  const catDe = sku => sku.cat || sku.seg;

  /* ---------------- potencial de venda ---------------- */
  /* Quanto o SKU adiciona de venda naquela loja. Item que nao faz parte do
     plano do formato ainda vende alguma coisa, mas bem menos: nao e o shopper
     daquela loja.                                                            */
  function potencial(sku, fid) {
    if (sku.planos) {
      if (noPlano(sku, fid)) return sku.planos[fid].giro;
      const gs = Object.values(sku.planos);
      if (!gs.length) return 0;
      return (gs.reduce((t, p) => t + p.giro, 0) / gs.length) * 0.35;
    }
    /* etapa Galbani, enquanto nao vem a base da marca: peso de referencia */
    return (sku.valor || 0) * 1000;
  }
  /* Indice de margem. A planilha tem dois outliers, entao o valor entra
     limitado para nao distorcer a nota.                                      */
  function margem(sku) {
    const m = sku.margem != null ? sku.margem : (sku.valor ? sku.valor / 14 : 3);
    return Math.max(0.2, Math.min(8, m));
  }

  /* ---------------- sortimento da loja e lista de opcoes ---------------- */
  function fixos(etapa, fid) {
    const todos = skusDaEtapa(etapa);
    if (etapa.fonte === "SKUS_DPA") {
      const p = plano(fid);
      return p.core.map(id => todos.find(s => s.id === id)).filter(Boolean)
        .sort((a, b) => potencial(b, fid) - potencial(a, fid));
    }
    return todos.filter(s => s.core);
  }

  /* Lista enxuta de incrementais: o que o plano daquele formato pede, os de
     maior margem e uma amostra de outros formatos como distratores.          */
  function opcoes(etapa, fid) {
    const todos = skusDaEtapa(etapa);
    const idsFixos = new Set(fixos(etapa, fid).map(s => s.id));
    const resto = todos.filter(s => !idsFixos.has(s.id));
    if (etapa.fonte !== "SKUS_DPA") return ordenarLista(resto);

    const doPlano = resto.filter(s => noPlano(s, fid)).sort((a, b) => potencial(b, fid) - potencial(a, fid));
    const fora = resto.filter(s => !noPlano(s, fid)).sort((a, b) => margem(b) - margem(a));
    const limite = etapa.opcoes || 30;
    const escolhidos = [];
    const usar = s => { if (!escolhidos.find(x => x.id === s.id) && escolhidos.length < limite) escolhidos.push(s); };

    /* o miolo da lista e o plano do formato */
    doPlano.slice(0, Math.round(limite * 0.65)).forEach(usar);
    /* garante os de maior margem do portfolio, que e o aprendizado comercial */
    todos.slice().sort((a, b) => margem(b) - margem(a))
      .filter(s => !idsFixos.has(s.id)).slice(0, 6).forEach(usar);
    /* distratores: itens que giram em outros formatos */
    fora.slice(0, 6).forEach(usar);
    /* completa com o que sobrou do plano */
    doPlano.forEach(usar);
    resto.forEach(usar);
    return ordenarLista(escolhidos.slice(0, limite));
  }
  /* A lista nunca aparece ordenada por valor, senao a ordem entrega a resposta */
  function ordenarLista(lista) {
    return lista.slice().sort((a, b) =>
      (catDe(a) || "").localeCompare(catDe(b) || "") || a.nome.localeCompare(b.nome));
  }

  /* ---------------- avaliacao ---------------- */
  function avaliarEtapa(etapa, idsEscolhidos, fid) {
    const lista = opcoes(etapa, fid);
    const n = etapa.escolhas;
    const escolhidos = idsEscolhidos.map(id => lista.find(s => s.id === id)).filter(Boolean);

    const porPotencial = lista.slice().sort((a, b) => potencial(b, fid) - potencial(a, fid));
    const melhores = porPotencial.slice(0, n);
    const piores = porPotencial.slice(-n);
    const teto = melhores.reduce((t, s) => t + potencial(s, fid), 0) || 1;
    const piso = piores.reduce((t, s) => t + potencial(s, fid), 0);
    const meu = escolhidos.reduce((t, s) => t + potencial(s, fid), 0);
    const notaVenda = Math.max(0, Math.min(1, (meu - piso) / Math.max(1, teto - piso)));

    const porMargem = lista.slice().sort((a, b) => margem(b) - margem(a));
    const mTeto = porMargem.slice(0, n).reduce((t, s) => t + margem(s), 0) / n;
    const mPiso = porMargem.slice(-n).reduce((t, s) => t + margem(s), 0) / n;
    const mMeu = escolhidos.length ? escolhidos.reduce((t, s) => t + margem(s), 0) / escolhidos.length : 0;
    const notaMargem = Math.max(0, Math.min(1, (mMeu - mPiso) / Math.max(0.01, mTeto - mPiso)));

    const catsLista = [...new Set(lista.map(catDe))];
    const catsMinhas = [...new Set(escolhidos.map(catDe))];
    const alvoCats = Math.min(n, catsLista.length, 5);
    const notaCobertura = Math.max(0, Math.min(1, catsMinhas.length / alvoCats));

    const idsMelhores = new Set(melhores.map(s => s.id));
    const acertos = escolhidos.filter(s => idsMelhores.has(s.id))
      .sort((a, b) => potencial(b, fid) - potencial(a, fid));
    const perdidos = melhores.filter(s => !idsEscolhidos.includes(s.id));
    const foraDoPlano = etapa.fonte === "SKUS_DPA"
      ? escolhidos.filter(s => !noPlano(s, fid)) : [];

    return {
      etapa, fid, escolhidos, lista, melhores,
      incremento: Math.round(meu), teto: Math.round(teto), piso: Math.round(piso),
      notaVenda, notaMargem, notaCobertura,
      margemMedia: mMeu, margemTeto: mTeto,
      categorias: catsMinhas,
      acertos, perdidos, foraDoPlano,
      itens: escolhidos.length
    };
  }

  function pontuar(resultados, segundos) {
    const P = window.PESOS;
    const med = f => resultados.reduce((t, r) => t + f(r), 0) / resultados.length;
    const pVenda = Math.round(med(r => r.notaVenda) * P.venda);
    const pMargem = Math.round(med(r => r.notaMargem) * P.margem);
    const pCob = Math.round(med(r => r.notaCobertura) * P.cobertura);
    let fator = 1;
    if (segundos > P.tempoAlvo) fator = 1 - (segundos - P.tempoAlvo) / (P.tempoLimite - P.tempoAlvo);
    fator = Math.max(0, Math.min(1, fator));
    const pTempo = Math.round(fator * P.tempo);
    const total = pVenda + pMargem + pCob + pTempo;
    const nivel = total >= 880 ? "Especialista de MIX"
                : total >= 740 ? "Executor avançado"
                : total >= 600 ? "Bom caminho"
                : "Em construção";
    return {
      total, nivel,
      blocos: [
        { chave: "venda", nome: "Potencial de venda", pontos: pVenda, max: P.venda,
          detalhe: Math.round(med(r => r.notaVenda) * 100) + "% do incremento possível com o número de itens que você tinha" },
        { chave: "margem", nome: "Margem do mix", pontos: pMargem, max: P.margem,
          detalhe: Math.round(med(r => r.notaMargem) * 100) + "% do ganho de margem possível" },
        { chave: "cobertura", nome: "Equilíbrio do sortimento", pontos: pCob, max: P.cobertura,
          detalhe: Math.round(med(r => r.notaCobertura) * 100) + "% de equilíbrio entre as categorias" },
        { chave: "tempo", nome: "Tempo de decisão", pontos: pTempo, max: P.tempo,
          detalhe: formatarTempo(segundos) + " nas duas etapas" }
      ],
      segundos, fatorTempo: fator
    };
  }

  function formatarTempo(s) {
    const m = Math.floor(s / 60), r = s % 60;
    return (m > 0 ? m + "min " : "") + String(r).padStart(m > 0 ? 2 : 1, "0") + "s";
  }
  function dinheiro(v) {
    if (v >= 1000000) return "R$ " + (v / 1000000).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " mi";
    if (v >= 1000) return "R$ " + Math.round(v / 1000).toLocaleString("pt-BR") + " mil";
    return "R$ " + Math.round(v).toLocaleString("pt-BR");
  }

  window.MOTOR = {
    skusDaEtapa, fixos, opcoes, potencial, margem, noPlano, catDe,
    avaliarEtapa, pontuar, formatarTempo, dinheiro
  };
})();
