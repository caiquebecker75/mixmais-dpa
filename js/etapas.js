/* ==========================================================================
   MIX+ DPA | formatos de loja, etapas e pesos
   --------------------------------------------------------------------------
   A atividade e de visao comercial, nao de execucao de gondola: a loja ja tem
   o sortimento de maior volume e o participante decide o que acrescentaria
   para vender mais. Os quatro formatos vem das quatro abas do simulador da
   cliente (BASE_SIMULADOR.xlsx).

   AJUSTAR QUANDO A DANI ENVIAR A LISTA DEFINITIVA:
   - escolhas  : quantos SKUs o participante pode marcar em cada etapa
   - opcoes    : tamanho da lista de produtos incrementais
   - PESOS     : como os pontos sao distribuidos
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

window.FORMATOS = [
  {
    id: "supermercado",
    nome: "Supermercado",
    resumo: "Loja de bairro",
    detalhe: "Compra de reposição da família, tíquete médio e giro semanal."
  },
  {
    id: "cash",
    nome: "Cash and carry",
    resumo: "Atacarejo",
    detalhe: "Formato família e pack grande, com transformador e consumidor final no mesmo corredor."
  },
  {
    id: "hiper_minimo",
    nome: "Hiper, sortimento mínimo",
    resumo: "Hipermercado enxuto",
    detalhe: "O hiper que ainda trabalha o essencial da categoria e tem espaço para crescer."
  },
  {
    id: "hiper_total",
    nome: "Hiper, sortimento completo",
    resumo: "Hipermercado completo",
    detalhe: "Loja que compra a categoria inteira: é onde a cauda longa e o item premium se pagam."
  }
];

window.ETAPAS = [
  {
    id: "iogurtes",
    numero: 1,
    nome: "Iogurtes",
    marca: "DPA",
    fonte: "SKUS_DPA",
    escolhas: 10,     /* quantos SKUs o participante marca */
    opcoes: 30,       /* tamanho da lista de incrementais */
    titulo: "O que você acrescentaria a esta loja?",
    resumo: "A loja já trabalha os SKUs de maior volume. Agora é a sua leitura comercial: o que entra para vender mais?",
    instrucao: "Marque os produtos que você incluiria no sortimento desta loja."
  },
  {
    id: "galbani",
    numero: 2,
    nome: "Galbani",
    marca: "Galbani",
    fonte: "SKUS_GALBANI",
    escolhas: 8,
    opcoes: 19,
    titulo: "Agora o sortimento Galbani",
    resumo: "Os queijos de maior volume já estão na loja. Escolha o que completa o sortimento italiano.",
    instrucao: "Marque os produtos Galbani que você incluiria nesta loja."
  }
];

/* Pontuacao: potencial de venda + margem + cobertura + tempo = 1000 */
window.PESOS = {
  venda: 550,
  margem: 150,
  cobertura: 100,
  tempo: 200,
  tempoAlvo: 180,   /* ate aqui o bonus de tempo e cheio */
  tempoLimite: 600  /* daqui para frente zera */
};
