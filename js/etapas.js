/* ==========================================================================
   MIX+ DPA | formatos de loja, etapas e pesos
   --------------------------------------------------------------------------
   Os quatro formatos vêm das quatro abas do simulador da cliente
   (BASE_SIMULADOR.xlsx): SUPERMERCADO, HIPER_MINIMO, HIPER_TOTAL e CASH.
   Gôndola, espaço linear, frentes e giro são os números dela.
   ========================================================================== */

/* Categorias do simulador da cliente */
window.SEGMENTOS = {
  "INFANTIL":         { nome: "Infantil",          cor: "#2E79D6" },
  "LEITE FERMENTADO": { nome: "Leite fermentado",  cor: "#D9466B" },
  "NATURAL":          { nome: "Natural",           cor: "#2E9E6B" },
  "GREGO":            { nome: "Grego",             cor: "#8B5CF6" },
  "SOBREMESA":        { nome: "Sobremesa",         cor: "#8C5A2B" },
  "LIQUIDO":          { nome: "Líquido",           cor: "#1B4F9C" },
  "POLPA":            { nome: "Polpa",             cor: "#E2714A" },
  "BENEFÍCIOS":       { nome: "Benefícios",        cor: "#0B8F8F" },
  "PETIT SUISSE":     { nome: "Petit suisse",      cor: "#E0A82E" },
  /* Galbani */
  fatiados:    { nome: "Fatiados",        cor: "#1B4F9C" },
  parmesao:    { nome: "Parmesão",        cor: "#C9A227" },
  requeijao:   { nome: "Requeijão",       cor: "#2E79D6" },
  ricota:      { nome: "Creme de ricota", cor: "#69B78B" },
  crema:       { nome: "Crema di Queijo", cor: "#E2714A" },
  aperitivo:   { nome: "Aperitivo",       cor: "#D9466B" },
  manteiga:    { nome: "Manteiga",        cor: "#E0A82E" },
  especiais:   { nome: "Italianos",       cor: "#8B5CF6" }
};

/* Quanto da gôndola já vem montada no sorteio do início da rodada.
   O sorteio muda a cada partida: ninguém recebe a mesma sugestão.            */
window.FRACAO_INICIAL = 0.5;

window.FORMATOS = [
  {
    id: "supermercado",
    nome: "Supermercado",
    resumo: "Gôndola de 7,3 m de refrigerados",
    detalhe: "Loja de bairro com uma gôndola de iogurtes. Espaço curto, sortimento tem que ser certeiro.",
    prateleiras: 6
  },
  {
    id: "cash",
    nome: "Cash and carry",
    resumo: "Gôndola de 9,8 m",
    detalhe: "Atacarejo: formato família, pack grande e preço por quilo mandam na escolha.",
    prateleiras: 7
  },
  {
    id: "hiper_minimo",
    nome: "Hiper, sortimento mínimo",
    resumo: "Seção de 43 m, sortimento enxuto",
    detalhe: "O plano mínimo que o hiper precisa ter de pé antes de abrir espaço para a cauda.",
    prateleiras: 12
  },
  {
    id: "hiper_total",
    nome: "Hiper, sortimento completo",
    resumo: "Seção de 43 m, portfólio inteiro",
    detalhe: "O hiper que compra a categoria toda: é onde a cauda longa se paga.",
    prateleiras: 13
  }
];

window.ETAPAS = [
  {
    id: "iogurtes",
    numero: 1,
    nome: "Iogurtes",
    marca: "DPA",
    modoEspaco: "linear",
    titulo: "A loja já tem meia gôndola montada",
    resumo: "Metade do espaço veio preenchido, e vem diferente a cada rodada. Tire o que não se paga e coloque o que rende mais.",
    instrucao: "Toque para somar uma frente, toque no produto exposto para tirar uma. Cada frente ocupa a largura real da embalagem e soma faturamento.",
    tituloPlano: "Gôndola de iogurtes",
    prateleiras: 5,
    fonte: "SKUS_DPA"
  },
  {
    id: "galbani",
    numero: 2,
    nome: "Galbani",
    marca: "Galbani",
    modoEspaco: "vagas",
    titulo: "Agora o bloco Galbani",
    resumo: "Metade das vagas já veio preenchida por sorteio. Troque o que não vale a pena.",
    instrucao: "Toque para ocupar uma vaga, toque no produto exposto para liberar. Pode repetir o mesmo item para dar mais espaço a ele.",
    tituloPlano: "Gôndola Galbani",
    colunas: 5,
    vazios: 10,
    segmentosPrioritarios: ["fatiados", "crema", "aperitivo", "especiais"],
    fonte: "SKUS_GALBANI"
  }
];

/* Pontuacao: resultado financeiro + aderencia ao modelo + tempo = 1000.
   O modelo ideal e o planograma da planilha da DPA.                          */
window.PESOS = {
  resultado: 650,
  aderencia: 150,
  tempo: 200,
  tempoAlvo: 240,   /* ate aqui o bonus de tempo e cheio */
  tempoLimite: 840  /* daqui para frente zera */
};
