/* ==========================================================================
   MIX+ DPA | configuracao das duas etapas da atividade
   --------------------------------------------------------------------------
   A mecanica enviada pelo cliente prevê 50 SKUs de iogurte (21 do 80% do
   faturamento mais 29 escolhidos) e 23 SKUs Galbani (5 mais 18). O portfolio
   publicado nos sites oficiais traz 45 iogurtes e 24 Galbani, então os espaços
   vazios foram calibrados para que sempre haja mais opção do que espaço, que é
   o que obriga a pessoa a priorizar. Quando a DPA enviar a lista completa de
   sortimento, basta trocar js/dados.js e ajustar "vazios" aqui.
   ========================================================================== */

window.SEGMENTOS = {
  kids:        { nome: "Kids",         cor: "#2E79D6" },
  liquidos:    { nome: "Líquidos",     cor: "#1B4F9C" },
  saudaveis:   { nome: "Saudáveis",    cor: "#2E9E6B" },
  gregos:      { nome: "Gregos",       cor: "#8B5CF6" },
  polpa:       { nome: "Polpa",        cor: "#E2714A" },
  individuais: { nome: "Individuais",  cor: "#D9466B" },
  familiares:  { nome: "Familiares",   cor: "#0B2E63" },
  /* Galbani */
  fatiados:    { nome: "Fatiados",     cor: "#1B4F9C" },
  parmesao:    { nome: "Parmesão",     cor: "#C9A227" },
  requeijao:   { nome: "Requeijão",    cor: "#2E79D6" },
  ricota:      { nome: "Creme de ricota", cor: "#69B78B" },
  crema:       { nome: "Crema di Queijo", cor: "#E2714A" },
  aperitivo:   { nome: "Aperitivo",    cor: "#D9466B" },
  manteiga:    { nome: "Manteiga",     cor: "#E0A82E" },
  especiais:   { nome: "Italianos",    cor: "#8B5CF6" }
};

window.ETAPAS = [
  {
    id: "iogurtes",
    numero: 1,
    nome: "Iogurtes",
    marca: "DPA",
    titulo: "O bloco de iogurtes já está de pé",
    resumo: "21 SKUs representam 80% do faturamento e já estão na gôndola. Faltam 15 espaços.",
    instrucao: "Escolha os 15 itens incrementais que mais somam venda ao bloco. Sobra portfólio, então priorize.",
    tituloPlano: "Gôndola de iogurtes",
    colunas: 6,
    vazios: 15,
    /* segmentos que o bloco base cobre pouco e que o jogo espera ver reforçados */
    segmentosPrioritarios: ["gregos", "saudaveis", "kids", "familiares"],
    fonte: "SKUS_IOGURTES"
  },
  {
    id: "galbani",
    numero: 2,
    nome: "Galbani",
    marca: "Galbani",
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
  /* tempo total das duas etapas, em segundos */
  tempoAlvo: 210,    /* até aqui leva o bônus cheio */
  tempoLimite: 780   /* daqui para frente o bônus zera */
};
