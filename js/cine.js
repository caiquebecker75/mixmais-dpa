/* ==========================================================================
   ESQUADRAO ACELERA +DPA | cinema: videos de transicao
   Trechos reais em assets/video (decolagem, contato, combates, vitoria, fundo).
   Fontes em dominio publico: ver README. Se o video nao carregar, a cena
   segue so com o texto, sem travar o jogo.
   ========================================================================== */
(function () {
  const $ = s => document.querySelector(s);
  const CLIPES = ["decolagem", "contato", "combate1", "combate2", "combate3", "combate4", "combate5", "combate6", "vitoria", "fundo"];
  const cache = {};
  let ultimoCombate = 0, fila = Promise.resolve();

  /* baixa os clipes inteiros para a memoria: a troca fica instantanea no totem */
  function precarregar() {
    CLIPES.forEach(n => {
      if (cache[n]) return;
      cache[n] = fetch("assets/video/" + n + ".mp4").then(r => r.ok ? r.blob() : Promise.reject()).then(b => URL.createObjectURL(b)).catch(() => null);
    });
  }
  const url = n => (cache[n] || Promise.resolve(null));

  /* toca um clipe em tela cheia. opcoes: html (texto), tag, mira, dur (s), cor */
  function tocar(nome, opcoes) {
    opcoes = opcoes || {};
    fila = fila.then(() => new Promise(async res => {
      const box = $("#cine"), v = $("#cine-video");
      const src = await url(nome);
      $("#cine-texto").innerHTML = opcoes.html || "";
      $("#cine-texto").style.setProperty("--c", opcoes.cor || "#fff");
      $("#cine-tag").textContent = opcoes.tag || "CAM 01";
      box.classList.toggle("sem-mira", !opcoes.mira);
      let acabou = false;
      const fim = () => { if (acabou) return; acabou = true; box.classList.remove("on"); try { v.pause(); } catch (e) {} res(); };
      if (src) {
        v.src = src; v.currentTime = 0; v.playbackRate = opcoes.velocidade || 1;
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      } else { v.removeAttribute("src"); }
      box.classList.remove("on"); void box.offsetWidth; box.classList.add("on");
      setTimeout(fim, (opcoes.dur || 2) * 1000);
    }));
    return fila;
  }
  function combate(opcoes) {
    let n; do { n = 1 + Math.floor(Math.random() * 6); } while (n === ultimoCombate);
    ultimoCombate = n;
    return tocar("combate" + n, opcoes);
  }
  /* liga um video de fundo em loop num elemento <video> */
  async function fundo(video, nome) {
    const src = await url(nome || "fundo");
    if (!src) return;
    if (video.src !== src) video.src = src;
    const p = video.play(); if (p && p.catch) p.catch(() => {});
  }

  window.CINE = { precarregar, tocar, combate, fundo };
  window.addEventListener("load", () => setTimeout(precarregar, 600));
})();
