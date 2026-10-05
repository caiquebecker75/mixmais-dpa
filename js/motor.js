/* ==========================================================================
   MIX+ DPA | motor de correcao e pontuacao
   --------------------------------------------------------------------------
   Etapa de iogurtes: trabalha em centimetros lineares, com os numeros do
   simulador da cliente. O que vale ponto e o giro que o SKU traz dentro do
   espaco que ele ocupa, ou seja, giro por centimetro. SKU que nao esta no
   plano daquele formato vale zero: ocupa espaco e nao devolve venda.
   Etapa Galbani: vagas iguais, com peso de incrementalidade.
   ========================================================================== */
(function () {

  function skusDaEtapa(etapa) { return window[etapa.fonte] || []; }
  const plano = fid => (window.PLANOS || {})[fid] || null;

  /* ---------- etapa linear (iogurtes) ---------- */
  function noPlano(sku, fid) { return !!(sku.planos && sku.planos[fid]); }
  function giroNoFormato(sku, fid) { return noPlano(sku, fid) ? sku.planos[fid].giro : 0; }

  function frentesDe(sku, fid) {
    if (noPlano(sku, fid)) return sku.planos[fid].frentes || 1;
    const fs = Object.values(sku.planos || {}).map(p => p.frentes || 1);
    return fs.length ? Math.max(1, Math.round(fs.reduce((a, b) => a + b, 0) / fs.length)) : 1;
  }
  /* centimetros lineares que o SKU ocupa naquele formato */
  function espacoCm(sku, fid) {
    return Math.round((sku.larg || 10) * frentesDe(sku, fid) * 10) / 10;
  }
  function densidade(sku, fid) {
    const e = espacoCm(sku, fid);
    return e > 0 ? giroNoFormato(sku, fid) / e : 0;
  }

  function contexto(etapa, fid) {
    if (etapa.modoEspaco !== "linear") return null;
    const p = plano(fid);
    const todos = skusDaEtapa(etapa);
    const core = p.core.map(id => todos.find(s => s.id === id)).filter(Boolean);
    const candidatos = todos.filter(s => !p.core.includes(s.id));
    const gondola = p.gondolaCm;
    const cmPlano = p.linearPlano * gondola;
    const cmCore = p.linearCore * gondola;
    const fmt = (window.FORMATOS || []).find(f => f.id === fid) || {};
    const fracao = fmt.fracaoLivre != null ? fmt.fracaoLivre : (window.FRACAO_LIVRE || 1);
    const livre = Math.round((cmPlano - cmCore) * fracao);
    return {
      core, candidatos, gondolaCm: gondola,
      cmPlano: Math.round(cmPlano), cmCore: Math.round(cmCore), espacoLivreCm: livre,
      planoIds: p.skusPlano
    };
  }

  /* melhor sortimento possivel: maior giro por centimetro ate encher o espaco */
  function gabarito(etapa, fid) {
    const ctx = contexto(etapa, fid);
    const elegiveis = ctx.candidatos.filter(s => noPlano(s, fid))
      .slice().sort((a, b) => densidade(b, fid) - densidade(a, fid));
    return encher(elegiveis, fid, ctx.espacoLivreCm);
  }
  /* pior sortimento possivel dentro do mesmo espaco, usado como piso da nota */
  function piorCaso(etapa, fid) {
    const ctx = contexto(etapa, fid);
    const ruins = ctx.candidatos.slice().sort((a, b) => densidade(a, fid) - densidade(b, fid));
    return encher(ruins, fid, ctx.espacoLivreCm);
  }
  function encher(lista, fid, limite) {
    const out = []; let usado = 0;
    for (const s of lista) {
      const e = espacoCm(s, fid);
      if (usado + e <= limite) { out.push(s); usado += e; }
    }
    return out;
  }

  /* ---------- etapa de vagas (Galbani) ---------- */
  function base(etapa) { return skusDaEtapa(etapa).filter(s => s.core); }
  function incrementais(etapa) {
    return skusDaEtapa(etapa).filter(s => !s.core)
      .slice().sort((a, b) => (a.seg || "").localeCompare(b.seg || "") || a.nome.localeCompare(b.nome));
  }
  function recomendados(etapa) {
    return incrementais(etapa).slice().sort((a, b) => b.valor - a.valor).slice(0, etapa.vazios);
  }

  /* ---------- avaliacao ---------- */
  function avaliarEtapa(etapa, escolhidosIds, fid) {
    const todos = skusDaEtapa(etapa);
    const escolhidos = escolhidosIds.map(id => todos.find(s => s.id === id)).filter(Boolean);

    if (etapa.modoEspaco === "linear") {
      const ctx = contexto(etapa, fid);
      const ideal = gabarito(etapa, fid);
      const pior = piorCaso(etapa, fid);
      const maximo = ideal.reduce((t, s) => t + giroNoFormato(s, fid), 0) || 1;
      const minimo = pior.reduce((t, s) => t + giroNoFormato(s, fid), 0);
      const obtido = escolhidos.reduce((t, s) => t + giroNoFormato(s, fid), 0);
      const aproveitamento = Math.max(0, Math.min(1, (obtido - minimo) / Math.max(1, maximo - minimo)));

      const idsIdeais = new Set(ideal.map(s => s.id));
      const acertos = escolhidos.filter(s => idsIdeais.has(s.id));
      const perdidos = ideal.filter(s => !escolhidosIds.includes(s.id));
      const foraDoPlano = escolhidos.filter(s => !noPlano(s, fid));
      const usado = escolhidos.reduce((t, s) => t + espacoCm(s, fid), 0);

      /* cobertura: categorias que o plano real tem no espaco incremental */
      const catsPlano = [...new Set(ctx.candidatos.filter(s => noPlano(s, fid)).map(s => s.cat))];
      const catsEscolhidas = new Set(escolhidos.filter(s => noPlano(s, fid)).map(s => s.cat));
      const cobertos = catsPlano.filter(c => catsEscolhidas.has(c));

      return {
        etapa, fid, escolhidos, ideal, acertos, perdidos, foraDoPlano,
        obtido, maximo, minimo, aproveitamento,
        espacoUsado: Math.round(usado), espacoLivre: ctx.espacoLivreCm,
        ocupacao: ctx.espacoLivreCm ? usado / ctx.espacoLivreCm : 0,
        cobertura: catsPlano.length ? cobertos.length / catsPlano.length : 1,
        segmentosFalta: catsPlano.filter(c => !catsEscolhidas.has(c)),
        modo: "linear"
      };
    }

    /* modo vagas */
    const ideal = recomendados(etapa);
    const piores = incrementais(etapa).slice().sort((a, b) => a.valor - b.valor).slice(0, etapa.vazios);
    const maximo = ideal.reduce((t, s) => t + s.valor, 0) || 1;
    const minimo = piores.reduce((t, s) => t + s.valor, 0);
    const obtido = escolhidos.reduce((t, s) => t + s.valor, 0);
    const aproveitamento = Math.max(0, Math.min(1, (obtido - minimo) / Math.max(1, maximo - minimo)));
    const idsIdeais = new Set(ideal.map(s => s.id));
    const segsEscolhidos = new Set(escolhidos.map(s => s.seg));
    const cobertos = (etapa.segmentosPrioritarios || []).filter(s => segsEscolhidos.has(s));
    return {
      etapa, fid, escolhidos, ideal,
      acertos: escolhidos.filter(s => idsIdeais.has(s.id)),
      perdidos: ideal.filter(s => !escolhidosIds.includes(s.id)),
      foraDoPlano: [],
      obtido, maximo, minimo, aproveitamento,
      cobertura: etapa.segmentosPrioritarios && etapa.segmentosPrioritarios.length
        ? cobertos.length / etapa.segmentosPrioritarios.length : 1,
      segmentosFalta: (etapa.segmentosPrioritarios || []).filter(s => !segsEscolhidos.has(s)),
      modo: "vagas"
    };
  }

  function pontuar(resultados, segundos) {
    const P = window.PESOS;
    const aprov = resultados.reduce((t, r) => t + r.aproveitamento, 0) / resultados.length;
    const cob = resultados.reduce((t, r) => t + r.cobertura, 0) / resultados.length;
    const pAssert = Math.round(aprov * P.assertividade);
    const pCob = Math.round(cob * P.cobertura);
    let fator = 1;
    if (segundos > P.tempoAlvo) fator = 1 - (segundos - P.tempoAlvo) / (P.tempoLimite - P.tempoAlvo);
    fator = Math.max(0, Math.min(1, fator));
    const pTempo = Math.round(fator * P.tempo);
    const total = pAssert + pCob + pTempo;
    const nivel = total >= 880 ? "Especialista de MIX"
                : total >= 740 ? "Executor avançado"
                : total >= 600 ? "Bom caminho"
                : "Em construção";
    return {
      total, nivel,
      blocos: [
        { chave: "assertividade", nome: "Assertividade do MIX", pontos: pAssert, max: P.assertividade,
          detalhe: Math.round(aprov * 100) + "% do giro possível capturado no espaço disponível" },
        { chave: "cobertura", nome: "Cobertura de categorias", pontos: pCob, max: P.cobertura,
          detalhe: Math.round(cob * 100) + "% das categorias do plano atendidas" },
        { chave: "tempo", nome: "Tempo de montagem", pontos: pTempo, max: P.tempo,
          detalhe: formatarTempo(segundos) + " nas duas etapas" }
      ],
      segundos, fatorTempo: fator
    };
  }

  function formatarTempo(s) {
    const m = Math.floor(s / 60), r = s % 60;
    return (m > 0 ? m + "min " : "") + String(r).padStart(m > 0 ? 2 : 1, "0") + "s";
  }
  function metros(cm) {
    return (cm / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m";
  }

  window.MOTOR = {
    skusDaEtapa, base, incrementais, recomendados,
    contexto, gabarito, piorCaso, espacoCm, frentesDe, giroNoFormato, noPlano, densidade,
    avaliarEtapa, pontuar, formatarTempo, metros
  };
})();
