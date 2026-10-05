/* ==========================================================================
   MIX+ DPA | motor do jogo
   --------------------------------------------------------------------------
   A planilha da DPA e o modelo ideal: para cada formato de loja ela diz quais
   SKUs entram, com quantas frentes, quanto espaco linear ocupam e quanto giram.
   O jogo comeca com metade da gondola montada por sorteio, diferente a cada
   rodada, e o participante tem que chegar o mais perto possivel do resultado
   financeiro do modelo, no menor tempo.
   ========================================================================== */
(function () {

  const skusDaEtapa = etapa => window[etapa.fonte] || [];
  const plano = fid => (window.PLANOS || {})[fid] || null;
  const noPlano = (sku, fid) => !!(sku.planos && sku.planos[fid]);

  /* ---------------- espaco ---------------- */
  function frentesPlano(sku, fid) {
    if (noPlano(sku, fid)) return sku.planos[fid].frentes || 1;
    const fs = Object.values(sku.planos || {}).map(p => p.frentes || 1);
    return fs.length ? Math.max(1, Math.round(fs.reduce((a, b) => a + b, 0) / fs.length)) : 1;
  }
  const larguraDe = sku => sku.larg || 10;
  const cmPorFrente = sku => Math.round(larguraDe(sku) * 10) / 10;
  const espacoCm = (sku, fid, frentes) => Math.round(cmPorFrente(sku) * (frentes || 1) * 10) / 10;

  /* ---------------- dinheiro ---------------- */
  /* Giro que uma frente do SKU entrega naquele formato. Fora do plano o item
     ainda vende alguma coisa, mas bem menos: nao e o shopper daquela loja.    */
  function giroPorFrente(sku, fid) {
    if (noPlano(sku, fid)) {
      const p = sku.planos[fid];
      return p.giro / Math.max(1, p.frentes || 1);
    }
    const gs = Object.values(sku.planos || {});
    if (!gs.length) return 0;
    const media = gs.reduce((t, p) => t + p.giro / Math.max(1, p.frentes || 1), 0) / gs.length;
    return media * 0.35;
  }
  /* Frente a mais rende menos: depois do que o modelo recomenda, cada frente
     extra entrega 30% do que a primeira entrega.                              */
  function giroDoBloco(sku, fid, frentes) {
    const base = giroPorFrente(sku, fid);
    const ideal = noPlano(sku, fid) ? frentesPlano(sku, fid) : 1;
    const dentro = Math.min(frentes, ideal);
    const extra = Math.max(0, frentes - ideal);
    return base * (dentro + extra * 0.3);
  }
  const densidade = (sku, fid) => giroPorFrente(sku, fid) / Math.max(1, cmPorFrente(sku));

  /* ---------------- contexto do formato ---------------- */
  function contexto(etapa, fid) {
    if (etapa.modoEspaco !== "linear") return null;
    const p = plano(fid);
    const todos = skusDaEtapa(etapa);
    const cmTotal = Math.round(p.linearPlano * p.gondolaCm);
    return {
      todos,
      doPlano: todos.filter(s => noPlano(s, fid)),
      gondolaCm: p.gondolaCm,
      cmTotal,
      metaFaturamento: p.skusPlano.reduce((t, id) => {
        const s = todos.find(x => x.id === id);
        return t + (s ? s.planos[fid].giro : 0);
      }, 0),
      skusPlano: p.skusPlano
    };
  }

  /* o melhor uso possivel do espaco, por giro por centimetro */
  function melhorPossivel(etapa, fid) {
    const ctx = contexto(etapa, fid);
    const ordenados = ctx.doPlano.slice().sort((a, b) => densidade(b, fid) - densidade(a, fid));
    const out = []; let usado = 0;
    for (const s of ordenados) {
      const alvo = frentesPlano(s, fid);
      for (let f = 1; f <= alvo; f++) {
        const cm = cmPorFrente(s);
        if (usado + cm > ctx.cmTotal) break;
        usado += cm;
        const achado = out.find(o => o.id === s.id);
        if (achado) achado.frentes++; else out.push({ id: s.id, frentes: 1 });
      }
    }
    return out;
  }
  /* o pior uso possivel, usado como piso da nota */
  function piorPossivel(etapa, fid) {
    const ctx = contexto(etapa, fid);
    const ordenados = ctx.todos.slice().sort((a, b) => densidade(a, fid) - densidade(b, fid));
    const out = []; let usado = 0;
    for (const s of ordenados) {
      const cm = cmPorFrente(s);
      while (usado + cm <= ctx.cmTotal) {
        usado += cm;
        const achado = out.find(o => o.id === s.id);
        if (achado) achado.frentes++; else out.push({ id: s.id, frentes: 1 });
        if (out.find(o => o.id === s.id).frentes >= 3) break;
      }
      if (usado >= ctx.cmTotal) break;
    }
    return out;
  }

  /* ---------------- sorteio da gondola inicial ---------------- */
  /* Metade da gondola ja vem montada, diferente a cada rodada. O sorteio evita
     os campeoes de giro por centimetro: a graca e o participante descobrir. */
  function sortearInicial(etapa, fid, fracao) {
    const ctx = contexto(etapa, fid);
    const alvo = ctx.cmTotal * (fracao || 0.5);
    const pool = ctx.todos.slice().sort((a, b) => densidade(b, fid) - densidade(a, fid));
    const semTopo = pool.slice(Math.ceil(pool.length * 0.18));
    for (let i = semTopo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [semTopo[i], semTopo[j]] = [semTopo[j], semTopo[i]];
    }
    const out = []; let usado = 0;
    for (const s of semTopo) {
      if (usado >= alvo) break;
      const frentes = 1 + (Math.random() < 0.38 ? 1 : 0);
      const cm = espacoCm(s, fid, frentes);
      if (usado + cm > alvo + 12) continue;
      out.push({ id: s.id, frentes });
      usado += cm;
    }
    return out;
  }

  /* ---------------- avaliacao ---------------- */
  function faturamentoDe(lista, etapa, fid) {
    const todos = skusDaEtapa(etapa);
    return lista.reduce((t, e) => {
      const s = todos.find(x => x.id === e.id);
      return s ? t + giroDoBloco(s, fid, e.frentes) : t;
    }, 0);
  }

  function avaliarEtapa(etapa, escolhas, fid) {
    const todos = skusDaEtapa(etapa);
    const blocos = escolhas.map(e => ({ sku: todos.find(x => x.id === e.id), frentes: e.frentes }))
      .filter(b => b.sku);

    if (etapa.modoEspaco === "linear") {
      const ctx = contexto(etapa, fid);
      const melhor = melhorPossivel(etapa, fid);
      const pior = piorPossivel(etapa, fid);
      const teto = faturamentoDe(melhor, etapa, fid);
      const piso = faturamentoDe(pior, etapa, fid);
      const meu = faturamentoDe(escolhas, etapa, fid);
      const resultado = Math.max(0, Math.min(1, (meu - piso) / Math.max(1, teto - piso)));

      /* aderencia ao modelo: quanto do espaco foi distribuido como a planilha manda */
      let desvio = 0;
      const vistos = new Set();
      blocos.forEach(b => {
        vistos.add(b.sku.id);
        const ideal = noPlano(b.sku, fid) ? espacoCm(b.sku, fid, frentesPlano(b.sku, fid)) : 0;
        desvio += Math.abs(espacoCm(b.sku, fid, b.frentes) - ideal);
      });
      ctx.doPlano.forEach(s => {
        if (!vistos.has(s.id)) desvio += espacoCm(s, fid, frentesPlano(s, fid));
      });
      const aderencia = Math.max(0, 1 - desvio / Math.max(1, 2 * ctx.cmTotal));

      const idsPlano = new Set(ctx.skusPlano);
      const acertos = blocos.filter(b => idsPlano.has(b.sku.id))
        .sort((a, b) => giroDoBloco(b.sku, fid, b.frentes) - giroDoBloco(a.sku, fid, a.frentes));
      const foraDoPlano = blocos.filter(b => !idsPlano.has(b.sku.id))
        .sort((a, b) => espacoCm(b.sku, fid, b.frentes) - espacoCm(a.sku, fid, a.frentes));
      const escolhidosIds = new Set(blocos.map(b => b.sku.id));
      const perdidos = melhor.filter(m => !escolhidosIds.has(m.id))
        .map(m => ({ sku: todos.find(x => x.id === m.id), frentes: m.frentes }))
        .filter(x => x.sku)
        .sort((a, b) => densidade(b.sku, fid) - densidade(a.sku, fid));

      return {
        etapa, fid, modo: "linear", blocos,
        faturamento: Math.round(meu), teto: Math.round(teto), piso: Math.round(piso),
        meta: Math.round(ctx.metaFaturamento),
        aproveitamento: resultado, aderencia,
        espacoUsado: Math.round(blocos.reduce((t, b) => t + espacoCm(b.sku, fid, b.frentes), 0)),
        espacoTotal: ctx.cmTotal,
        acertos, perdidos, foraDoPlano,
        itens: blocos.length,
        frentes: blocos.reduce((t, b) => t + b.frentes, 0)
      };
    }

    /* etapa de vagas (Galbani) */
    const ideal = incrementais(etapa).slice().sort((a, b) => b.valor - a.valor).slice(0, etapa.vazios);
    const piores = incrementais(etapa).slice().sort((a, b) => a.valor - b.valor).slice(0, etapa.vazios);
    const valorDe = lista => lista.reduce((t, e) => {
      const s = todos.find(x => x.id === e.id);
      return s ? t + s.valor * (e.frentes || 1) : t;
    }, 0);
    const teto = ideal.reduce((t, s) => t + s.valor, 0) || 1;
    const piso = piores.reduce((t, s) => t + s.valor, 0);
    const meu = valorDe(escolhas);
    const resultado = Math.max(0, Math.min(1, (meu - piso) / Math.max(1, teto - piso)));
    const idsIdeais = new Set(ideal.map(s => s.id));
    const escolhidosIds = new Set(blocos.map(b => b.sku.id));
    return {
      etapa, fid, modo: "vagas", blocos,
      faturamento: Math.round(meu), teto: Math.round(teto), piso: Math.round(piso), meta: Math.round(teto),
      aproveitamento: resultado,
      aderencia: blocos.length ? blocos.filter(b => idsIdeais.has(b.sku.id)).length / Math.max(1, blocos.length) : 0,
      acertos: blocos.filter(b => idsIdeais.has(b.sku.id)),
      perdidos: ideal.filter(s => !escolhidosIds.has(s.id)).map(s => ({ sku: s, frentes: 1 })),
      foraDoPlano: [],
      itens: blocos.length,
      frentes: blocos.reduce((t, b) => t + b.frentes, 0)
    };
  }

  /* etapa de vagas: helpers antigos */
  const base = etapa => skusDaEtapa(etapa).filter(s => s.core);
  function incrementais(etapa) {
    return skusDaEtapa(etapa).filter(s => !s.core)
      .slice().sort((a, b) => (a.seg || "").localeCompare(b.seg || "") || a.nome.localeCompare(b.nome));
  }

  function pontuar(resultados, segundos) {
    const P = window.PESOS;
    const res = resultados.reduce((t, r) => t + r.aproveitamento, 0) / resultados.length;
    const ade = resultados.reduce((t, r) => t + r.aderencia, 0) / resultados.length;
    const pRes = Math.round(res * P.resultado);
    const pAde = Math.round(ade * P.aderencia);
    let fator = 1;
    if (segundos > P.tempoAlvo) fator = 1 - (segundos - P.tempoAlvo) / (P.tempoLimite - P.tempoAlvo);
    fator = Math.max(0, Math.min(1, fator));
    const pTempo = Math.round(fator * P.tempo);
    const total = pRes + pAde + pTempo;
    const nivel = total >= 880 ? "Especialista de MIX"
                : total >= 740 ? "Executor avançado"
                : total >= 600 ? "Bom caminho"
                : "Em construção";
    return {
      total, nivel,
      blocos: [
        { chave: "resultado", nome: "Resultado financeiro", pontos: pRes, max: P.resultado,
          detalhe: Math.round(res * 100) + "% do faturamento possível no espaço da loja" },
        { chave: "aderencia", nome: "Aderência ao modelo", pontos: pAde, max: P.aderencia,
          detalhe: Math.round(ade * 100) + "% de semelhança com o planograma recomendado" },
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
  const metros = cm => (cm / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m";
  function dinheiro(v) {
    if (v >= 1000000) return "R$ " + (v / 1000000).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " mi";
    if (v >= 1000) return "R$ " + Math.round(v / 1000).toLocaleString("pt-BR") + " mil";
    return "R$ " + Math.round(v).toLocaleString("pt-BR");
  }

  window.MOTOR = {
    skusDaEtapa, base, incrementais, contexto, noPlano, frentesPlano, cmPorFrente, espacoCm,
    giroPorFrente, giroDoBloco, densidade, sortearInicial, melhorPossivel, piorPossivel,
    faturamentoDe, avaliarEtapa, pontuar, formatarTempo, metros, dinheiro
  };
})();
