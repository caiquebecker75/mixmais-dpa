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

/* Quanto do espaço incremental do plano o jogo libera para o participante.
   1 = o participante remonta todo o resto do planograma (experiência longa).
   0.5 = metade do espaço, que é o que cabe no tempo de uma convenção.        */
window.FRACAO_LIVRE = 0.5;

window.FORMATOS = [
  {
    id: "supermercado",
    nome: "Supermercado",
    resumo: "Gôndola de 7,3 m de refrigerados",
    detalhe: "Loja de bairro com uma gôndola de iogurtes. Espaço curto, sortimento tem que ser certeiro.",
    prateleiras: 5,
    fracaoLivre: 0.5
  },
  {
    id: "cash",
    nome: "Cash and carry",
    resumo: "Gôndola de 9,8 m",
    detalhe: "Atacarejo: formato família, pack grande e preço por quilo mandam na escolha.",
    prateleiras: 6,
    fracaoLivre: 0.5
  },
  {
    id: "hiper_minimo",
    nome: "Hiper, sortimento mínimo",
    resumo: "Seção de 43 m, sortimento enxuto",
    detalhe: "O plano mínimo que o hiper precisa ter de pé antes de abrir espaço para a cauda.",
    prateleiras: 9,
    fracaoLivre: 0.35
  },
  {
    id: "hiper_total",
    nome: "Hiper, sortimento completo",
    resumo: "Seção de 43 m, portfólio inteiro",
    detalhe: "O hiper que compra a categoria toda: é onde a cauda longa se paga.",
    prateleiras: 10,
    fracaoLivre: 0.3
  }
];

window.ETAPAS = [
  {
    id: "iogurtes",
    numero: 1,
    nome: "Iogurtes",
    marca: "DPA",
    modoEspaco: "linear",
    titulo: "O bloco de iogurtes já está de pé",
    resumo: "Os SKUs que fazem 80% do faturamento já estão na gôndola. O espaço que sobrou é seu.",
    instrucao: "Escolha o que entra no espaço livre. Cada item ocupa a largura real da embalagem, então o que cabe é uma decisão.",
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
    resumo: "5 SKUs representam 80% do faturamento e já estão na gôndola. Faltam 10 espaços.",
    instrucao: "Escolha os 10 itens incrementais que constroem o bloco italiano na loja.",
    tituloPlano: "Gôndola Galbani",
    colunas: 5,
    vazios: 10,
    segmentosPrioritarios: ["fatiados", "crema", "aperitivo", "especiais"],
    fonte: "SKUS_GALBANI"
  }
];

/* Pontuacao: assertividade + cobertura + tempo = 1000 */
window.PESOS = {
  assertividade: 700,
  cobertura: 100,
  tempo: 200,
  tempoAlvo: 240,
  tempoLimite: 840
};
