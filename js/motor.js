/* ==========================================================================
   MIX+ DPA | motor de pontuacao
   Assertividade (700) + cobertura de segmentos (100) + tempo (200) = 1000.
   Os pesos e os valores de incrementalidade sao premissas de referencia,
   editaveis em js/etapas.js e js/dados.js.
   ========================================================================== */
(function () {

  function skusDaEtapa(etapa) { return window[etapa.fonte] || []; }
  function base(etapa) { return skusDaEtapa(etapa).filter(s => s.core); }
  /* Ordem neutra de exibicao: por segmento e nome. A ordem nunca segue o valor,
     senao a propria lista entregaria a resposta certa. */
  function incrementais(etapa) {
    return skusDaEtapa(etapa).filter(s => !s.core)
      .slice()
      .sort((a, b) => (a.seg || "").localeCompare(b.seg || "") || a.nome.localeCompare(b.nome));
  }

  /* Sortimento de referencia: os itens de maior incrementalidade que cabem nos espaços */
  function recomendados(etapa) {
    return incrementais(etapa)
      .slice()
      .sort((a, b) => b.valor - a.valor)
      .slice(0, etapa.vazios);
  }

  function avaliarEtapa(etapa, escolhidosIds) {
    const todos = skusDaEtapa(etapa);
    const escolhidos = escolhidosIds.map(id => todos.find(s => s.id === id)).filter(Boolean);
    const ideal = recomendados(etapa);
    /* piso: escolher os itens de menor incrementalidade que caberiam nos mesmos espaços */
    const piores = incrementais(etapa).slice().sort((a, b) => a.valor - b.valor).slice(0, etapa.vazios);
    const maximo = ideal.reduce((t, s) => t + s.valor, 0) || 1;
    const minimo = piores.reduce((t, s) => t + s.valor, 0);
    const obtido = escolhidos.reduce((t, s) => t + s.valor, 0);
    /* a nota compara a escolha com o melhor e o pior sortimento possivel, senao
       qualquer combinacao ficaria perto de 100% */
    const aproveitamento = Math.max(0, Math.min(1, (obtido - minimo) / Math.max(1, maximo - minimo)));

    const idsIdeais = new Set(ideal.map(s => s.id));
    const acertos = escolhidos.filter(s => idsIdeais.has(s.id));
    const perdidos = ideal.filter(s => !escolhidosIds.includes(s.id));
    const errados = escolhidos.filter(s => !idsIdeais.has(s.id))
      .sort((a, b) => a.valor - b.valor);

    /* cobertura dos segmentos que o bloco base atende pouco */
    const segsEscolhidos = new Set(escolhidos.map(s => s.seg));
    const cobertos = etapa.segmentosPrioritarios.filter(s => segsEscolhidos.has(s));

    return {
      etapa, escolhidos, ideal, acertos, perdidos, errados,
      obtido, maximo, minimo,
      aproveitamento,
      cobertura: cobertos.length / etapa.segmentosPrioritarios.length,
      segmentosCobertos: cobertos,
      segmentosFalta: etapa.segmentosPrioritarios.filter(s => !segsEscolhidos.has(s))
    };
  }

  function pontuar(resultados, segundos) {
    const P = window.PESOS;
    const aprovMedia = resultados.reduce((t, r) => t + r.aproveitamento, 0) / resultados.length;
    const cobMedia = resultados.reduce((t, r) => t + r.cobertura, 0) / resultados.length;

    const pAssert = Math.round(aprovMedia * P.assertividade);
    const pCob = Math.round(cobMedia * P.cobertura);

    let fatorTempo = 1;
    if (segundos > P.tempoAlvo) {
      fatorTempo = 1 - (segundos - P.tempoAlvo) / (P.tempoLimite - P.tempoAlvo);
    }
    fatorTempo = Math.max(0, Math.min(1, fatorTempo));
    const pTempo = Math.round(fatorTempo * P.tempo);

    const total = pAssert + pCob + pTempo;
    const nivel = total >= 880 ? "Especialista de MIX"
                : total >= 740 ? "Executor avançado"
                : total >= 600 ? "Bom caminho"
                : "Em construção";

    return {
      total, nivel,
      blocos: [
        { chave: "assertividade", nome: "Assertividade do MIX", pontos: pAssert, max: P.assertividade,
          detalhe: Math.round(aprovMedia * 100) + "% do potencial incremental capturado" },
        { chave: "cobertura", nome: "Cobertura de segmentos", pontos: pCob, max: P.cobertura,
          detalhe: Math.round(cobMedia * 100) + "% dos segmentos prioritários reforçados" },
        { chave: "tempo", nome: "Tempo de montagem", pontos: pTempo, max: P.tempo,
          detalhe: formatarTempo(segundos) + " nas duas etapas" }
      ],
      segundos, fatorTempo
    };
  }

  function formatarTempo(s) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return (m > 0 ? m + "min " : "") + String(r).padStart(m > 0 ? 2 : 1, "0") + "s";
  }

  window.MOTOR = { skusDaEtapa, base, incrementais, recomendados, avaliarEtapa, pontuar, formatarTempo };
})();
