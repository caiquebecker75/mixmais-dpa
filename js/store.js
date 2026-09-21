/* ==========================================================================
   MIX+ DPA | camada de dados
   Modo "firebase": todos os tablets gravam na mesma colecao e o ranking
   atualiza ao vivo. Modo "local": cada aparelho guarda as proprias partidas.
   Em qualquer modo o registro tambem fica salvo no aparelho, para nao se
   perder queda de rede.
   ========================================================================== */
(function () {
  const CFG = window.MIX_CONFIG;
  const CHAVE = "mixmais_registros";

  function lerLocal() {
    try { return JSON.parse(localStorage.getItem(CHAVE) || "[]"); } catch (e) { return []; }
  }
  function gravarLocal(lista) {
    try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) {}
  }
  function guardarNoAparelho(registro) {
    const lista = lerLocal();
    const i = lista.findIndex(r => r.id === registro.id);
    if (i >= 0) lista[i] = registro; else lista.push(registro);
    gravarLocal(lista);
  }

  const usaFirebase = () => CFG.storage === "firebase" && !!CFG.firebase.projectId;

  let fb = null;
  async function firebase() {
    if (fb) return fb;
    const appMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const fsMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const app = appMod.initializeApp(CFG.firebase);
    fb = { fs: fsMod, db: fsMod.getFirestore(app) };
    return fb;
  }

  function ordenar(lista) {
    return lista
      .filter(r => r.status === "concluido" && typeof r.pontuacao === "number")
      .sort((a, b) => (b.pontuacao - a.pontuacao) || ((a.segundos || 0) - (b.segundos || 0)));
  }

  const Store = {
    modo: CFG.storage,
    aoVivo: usaFirebase(),

    async salvar(registro) {
      registro.id = registro.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
      registro.criadoEm = registro.criadoEm || new Date().toISOString();
      registro.atualizadoEm = new Date().toISOString();
      registro.evento = CFG.evento;
      registro.tablet = CFG.tablet || "";
      guardarNoAparelho(registro);
      if (usaFirebase()) {
        try {
          const { fs, db } = await firebase();
          await fs.setDoc(fs.doc(db, CFG.firebaseColecao, registro.id), registro);
        } catch (e) { console.warn("Gravou só no aparelho:", e); }
      }
      return registro;
    },

    async listar() {
      if (usaFirebase()) {
        try {
          const { fs, db } = await firebase();
          const snap = await fs.getDocs(fs.collection(db, CFG.firebaseColecao));
          const out = [];
          snap.forEach(d => out.push(d.data()));
          return out;
        } catch (e) { console.warn(e); }
      }
      return lerLocal();
    },

    /* Chama o callback agora e a cada mudanca (quando o Firestore esta ligado). */
    async ouvirRanking(callback) {
      if (usaFirebase()) {
        try {
          const { fs, db } = await firebase();
          return fs.onSnapshot(fs.collection(db, CFG.firebaseColecao), snap => {
            const out = [];
            snap.forEach(d => out.push(d.data()));
            callback(ordenar(out), out.length);
          }, err => {
            console.warn(err);
            callback(ordenar(lerLocal()), lerLocal().length);
          });
        } catch (e) { console.warn(e); }
      }
      const lista = lerLocal();
      callback(ordenar(lista), lista.length);
      return () => {};
    },

    posicao(lista, id) {
      const i = lista.findIndex(r => r.id === id);
      return i >= 0 ? i + 1 : null;
    },

    ordenar,
    limparLocal() { gravarLocal([]); }
  };

  window.STORE = Store;
})();
