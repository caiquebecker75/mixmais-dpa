/* ==========================================================================
   MIX+ DPA | configuracao da atividade
   ========================================================================== */
window.MIX_CONFIG = {

  /* Nome do evento, exibido nas telas e gravado em cada partida */
  evento: "Convenção DPA 2026",

  /* Identificacao do tablet. Se cada aparelho usar um numero, o painel mostra
     de qual tablet veio cada partida. Deixe vazio para nao identificar.
     Tambem pode ser definido pela URL: index.html?tablet=3                   */
  tablet: "",

  /* Senha do painel de dados (painel.html) */
  senhaPainel: "mixdpa2026",

  /* Onde as partidas sao gravadas.
     "firebase" = todos os tablets no mesmo ranking, ao vivo. Preencha o objeto abaixo.
     "local"    = cada aparelho guarda as proprias partidas (sem ranking entre tablets). */
  storage: "firebase",

  /* Cole aqui as chaves do seu projeto Firebase (Console > Configuracoes do projeto >
     Seus apps > Configuracao do SDK). Enquanto estiver vazio, o jogo roda em modo local. */
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },
  firebaseColecao: "partidas",

  /* Texto de consentimento exibido no cadastro */
  lgpd: "Autorizo o uso dos meus dados de contato pela DPA e pela 75 LAB para fins deste evento."
};
