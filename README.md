# Esquadrão Acelera +DPA · MIX+ DPA

Game de sortimento para a Convenção de Vendas DPA 2027 (Lactalis), no KV "Esquadrão Acelera +DPA · Potência para voar mais alto".
Pensado para totem vertical com tela de toque (cabine), também roda em tablet e computador.

Link público: https://projetos.75lab.com.br/mixmais-dpa/
Painel do evento: https://projetos.75lab.com.br/mixmais-dpa/painel.html (senha em `config.js`)
Placar ao vivo para a TV grande: https://projetos.75lab.com.br/mixmais-dpa/placar.html (demonstração com dados fictícios: `placar.html?demo=1`)

## Placar da TV (placar.html)

Tela 16:9 para TV: Top 10 com zona de premiação, pilotos que pousaram, média, alvos perfeitos, duelo das regionais (SSCO x NENO),
melhor piloto por canal e últimos pousos. Cada partida nova entra em tela cheia por 6 s com patente, pontos e posição.
Só junta os totens com o Firebase ligado; em modo local mostra apenas as partidas do próprio aparelho.

## Visual, som e voz

- Interface e cenários em CSS, SVG e canvas (sonar, mapa, HUD). Fotos de produto: packshots oficiais da DPA.
- Vídeos de transição (`assets/video`): trechos reais em domínio público, cortados por `ferramentas/cortar-videos.sh`.
  Fontes: "Atlantic Trident 2017 - Ready to fight" e "Combined Strike 25 F-16s takeoffs (974487)", U.S. Air Force via DVIDS e Wikimedia Commons.
- `assets/video/vinheta.mp4`: vinheta de abertura de 15 s (projeto HyperFrames em `Projetos/esquadrao-vinheta`).
- Trilha (`assets/musica`): "Heroic Age", "Five Armies" e "Take a Chance", de Kevin MacLeod (incompetech.com), licença Creative Commons Atribuição 4.0. O crédito aparece no fim do jogo e precisa continuar lá.
- Mapa: malha de UFs do IBGE. Ícones: Lucide (ISC). Confete: canvas-confetti (ISC).
- Voz da torre: precisa ser gravada por uma pessoa em `gravador.html` (21 falas, baixa um zip de WAV). Depois `sh ferramentas/gerar-voz.sh <pasta>` converte para `assets/voz`. Sem os arquivos o jogo roda sem voz.
- Efeitos sonoros sintetizados em `js/som.js`. Botão de som no topo.

## Fluxo

1. **Espera**: vinheta em loop, botão "Toque para decolar" e Top 5 ao vivo.
2. **Ficha do piloto**: nome, e-mail, celular, empresa, função, codinome e aceite LGPD, com a credencial de voo ao lado.
3. **Zona de operação**: mapa do Brasil. O piloto toca na regional (SSCO ou NENO) e escolhe o canal (ou sorteia); os alvos aparecem no mapa.
4. **Briefing** cinematográfico (pulável), decolagem em vídeo e contagem regressiva.
5. **Missão 1 · Iogurtes** e **Missão 2 · Galbani (queijos e spreads)**:
   - a carga fixa (itens FIXOS do canal) embarca sozinha;
   - cada GRUPO DE ESCOLHA da planilha vira um alvo: "trave 2 SKUs", "trave 1 SKU";
   - junto do grupo entram até 2 SKUs que estão fora do sortimento do canal (iscas);
   - cada opção é um contato (T1, T2...) no sonar; o piloto trava e dispara, os mísseis saem no sonar e um corte de combate mostra o resultado;
   - o anel em volta do sonar é o tempo: ele esvazia, fica vermelho e a tela pulsa quando o bônus está acabando.
6. **Debrief**: patente, pontos, posição, precisão, venda potencial capturada, ranking do esquadrão e revisão de cada alvo (o que era o ideal).

Sem toque por 90 s no meio do jogo, aparece o alerta e o totem volta para a espera.

## Pontuação (10.000 pontos)

- Missão Iogurtes: 6.000 · Missão Galbani: 2.000 · Velocidade: 2.000 (ajustável em `config.js`).
- Dentro de cada missão, o alvo vale proporcional à quantidade de SKUs que pede.
- Nota de cada SKU, em porcentagem (como combinado na reunião de 23/11):
  `70% × importância DPA (sell-in) relativa ao melhor do alvo + 30% × posição da margem real no canal`.
  SKU fora do sortimento vale metade.
- Nota do alvo: metade pela qualidade do conjunto escolhido (normalizada entre o pior e o melhor conjunto possível) e metade pela fração de SKUs certos. Acertou todos: 100%.
- Velocidade: bônus cheio até metade do tempo de referência (9 s por alvo + 2 s por SKU), zero em 2,5 vezes.
- Ranking: pontos e, no empate, menor tempo. Top 5 = zona de premiação (`zonaPremio` e `premio` em `config.js`).

## Dados

- `js/base.js` é gerado da planilha **16112026_SORTIMENTO MÍNIMO - 2026-2027 VF**, aba BASE, com `ferramentas/build.py` (nomes curtos em `ferramentas/nomes.py`).
- Imagens: `assets/sku/<EAN>.webp`, convertidas dos TIF "IMAGENS COM EANS" enviados pela DPA (INCUBES).

Pontos para validar com a Dani:
- grupos com regra estranha na planilha (ex.: "NINHO 170GR" com um item FIXO e outro OU no 10+ NENO; "1+1" sem quantidade no C&C NENO, tratado como 1);
- INOVAÇÃO sem grupo foi tratada como carga fixa;
- 1 SKU ainda sem imagem: Molico Polpa Ameixa Bandeja 540g (7898755200713).

## Ranking entre totens (Firebase)

Enquanto `firebase.projectId` estiver vazio, cada aparelho guarda as próprias partidas (modo local).
Para juntar os totens: crie um projeto no Firebase, ative o Firestore, copie a configuração do app web para `config.js`
e libere leitura e escrita na coleção `esquadrao2027` durante o evento.
