/* ==========================================================================
   ESQUADRAO ACELERA +DPA | MIX+ DPA | configuracao
   ========================================================================== */
window.MIX_CONFIG = {

  /* Nome do evento, exibido nas telas e gravado em cada partida */
  evento: "Convenção de Vendas DPA 2027",

  /* Identificacao da cabine/totem (aparece no painel). Tambem pela URL: ?totem=3 */
  tablet: "",

  /* Senha do painel de dados (painel.html) */
  senhaPainel: "esquadrao2027",

  /* "firebase" = todos os totens no mesmo ranking ao vivo (preencha as chaves abaixo).
     "local"    = cada aparelho guarda as proprias partidas. */
  storage: "firebase",
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },
  firebaseColecao: "esquadrao2027",
  chaveLocal: "esquadrao_registros",

  /* Premiacao: quantos primeiros colocados entram na zona de premio e o texto do premio.
     Deixe premio vazio enquanto o valor nao estiver aprovado. */
  zonaPremio: 5,
  premio: "",

  /* Peso de cada criterio na nota de cada alvo (somam 1).
     venda  = importancia de sell-in DPA do SKU no canal (coluna IMPORTANCIA DPA da base)
     margem = posicao da margem real do SKU no canal (coluna Margem R$ da base) */
  pesos: { venda: 0.7, margem: 0.3 },

  /* SKU fora do sortimento recomendado vale esta fracao do que valeria */
  fatorForaDoSortimento: 0.5,

  /* Pontos maximos: precisao de cada missao + bonus de velocidade (total 10.000) */
  pontos: { iogurtes: 6000, galbani: 2000, velocidade: 2000 },

  /* Segundos de referencia: por alvo e por SKU travado */
  tempoPorAlvo: 9,
  tempoPorSku: 2,

  /* Volta para a tela de espera depois deste tempo sem toque (segundos) */
  ociosoSegundos: 90,

  lgpd: "Autorizo a DPA e a 75 LAB a usarem meus dados de contato para fins desta convenção."
};
