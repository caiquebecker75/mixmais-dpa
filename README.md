# MIX+ DPA

Atividade interativa de convenção: o participante recebe a gôndola **já montada** com os SKUs
que representam 80% do faturamento e precisa decidir quais **itens incrementais** entram nos
espaços que sobraram. São duas etapas, iogurtes e Galbani, com pontuação por assertividade e
tempo e ranking do evento entre os tablets.

**Atividade:** https://projetos.75lab.com.br/mixmais-dpa/
**Painel do evento:** https://projetos.75lab.com.br/mixmais-dpa/painel.html

## Como a atividade funciona

1. **Cadastro** (nome, e-mail, empresa ou loja, telefone e área), com aceite de uso dos dados.
2. **Etapa 1, Iogurtes**: 21 SKUs do 80% do faturamento já estão posicionados. Sobram 15
   espaços livres e há 24 itens incrementais na lista, separados por segmento.
3. **Etapa 2, Galbani**: 5 SKUs do 80% já posicionados, 10 espaços livres e 19 opções.
4. **Resultado**: pontuação de 0 a 1000, nível, posição no ranking do evento, o que foi bem
   escolhido e quais oportunidades ficaram de fora em cada etapa.

Em cada etapa o participante arrasta o produto da lista até o espaço que quiser, ou toca nele
para ocupar o próximo espaço livre. Tocar em um item que ele escolheu devolve para a lista.
Os SKUs do 80% ficam travados: não dá para tirar o que a loja já vende bem.

## Pontuação

| Bloco | Peso | O que mede |
| --- | --- | --- |
| Assertividade do MIX | 700 | Quanto do potencial incremental a pessoa capturou, comparando a escolha dela com o melhor e o pior sortimento possível para aqueles espaços |
| Cobertura de segmentos | 100 | Se reforçou os segmentos que o bloco base atende pouco |
| Tempo de montagem | 200 | Bônus cheio até 3min30 nas duas etapas, zerando em 13min |

Empate no total é desempatado pelo **menor tempo**. Regras em [js/motor.js](js/motor.js) e pesos
em [js/etapas.js](js/etapas.js).

A nota não é uma contagem simples de acertos: escolher os itens de menor incrementalidade zera
o bloco de assertividade, escolher os de maior o leva a 700, e qualquer combinação no meio cai
proporcionalmente. Sem isso, qualquer escolha ficaria perto de 100%.

## Vários tablets no mesmo ranking

Com o Firebase configurado, cada tablet grava a partida na mesma coleção e o ranking atualiza
sozinho em todos eles, inclusive na tela de resultado de quem acabou de jogar.

**Passo a passo (uma vez, cerca de 10 minutos):**

1. Acesse `console.firebase.google.com` e clique em **Adicionar projeto**. Nome sugerido:
   `mixmais-dpa`. Pode desativar o Google Analytics.
2. No menu lateral, **Criar banco de dados** em Firestore Database. Escolha **Iniciar no modo
   de teste** e a região `southamerica-east1`.
3. Em **Regras**, cole e publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /partidas/{doc} {
      allow read, create, update: if true;
      allow delete: if false;
    }
  }
}
```

4. Ainda no console, **Configurações do projeto > Seus apps > Web (</>)**, registre um app
   (apelido `mixmais-dpa`) e copie o objeto `firebaseConfig`.
5. Cole as chaves em [config.js](config.js), no objeto `firebase`, e mantenha
   `storage: "firebase"`.
6. Em **Authentication > Settings > Domínios autorizados**, adicione `projetos.75lab.com.br`.

Enquanto as chaves estiverem em branco, a atividade roda em modo local: funciona igual, mas
cada tablet tem o próprio ranking.

**Identificar cada tablet:** abra a atividade com `?tablet=1`, `?tablet=2` e assim por diante.
O número aparece no painel, ao lado de cada partida.

## Painel

`painel.html`, protegido pela senha de [config.js](config.js) (padrão `mixdpa2026`). Mostra
cadastros, partidas concluídas, pontuação média, tempo médio, o ranking ao vivo, os itens
incrementais mais escolhidos, as oportunidades mais esquecidas e a base completa de
participantes. Exporta CSV e JSON.

## Dados dos produtos

- **Iogurtes**: 45 SKUs com nome e packshot de aiogurteria.com.br, o site do portfólio de
  iogurtes no Brasil (Nestlé, Ninho, Molico, Neston, Neos Grego e Nestlé Natural).
- **Galbani**: 24 SKUs com nome e packshot de galbani.com.br.

A mecânica enviada pelo cliente previa 50 SKUs de iogurte (21 mais 29) e 23 Galbani (5 mais 18).
O portfólio publicado nos sites oficiais traz 45 e 24, então os espaços livres foram calibrados
para que sempre haja **mais opção do que espaço**, que é o que obriga a priorizar. Quando a DPA
enviar a lista completa de sortimento, basta atualizar `js/dados.js` e o número de `vazios` em
`js/etapas.js`.

O campo `valor` de cada SKU é o peso de incrementalidade usado na correção, e `core: true`
marca os itens do 80% do faturamento que já vêm posicionados:

```js
{
  "id": "i21",
  "nome": "Neos Grego Light Morango 360g",
  "marca": "Neos Grego",
  "seg": "gregos",        // aba do catálogo
  "core": false,          // true = já vem na gôndola, travado
  "valor": 88,            // peso de incrementalidade, de 0 a 100
  "motivo": "Grego light puxa consumidor novo e sustenta preço",
  "arquivo": "assets/produtos/iogurtes/..."
}
```

Com o sell out real, é só substituir `valor` pelo índice de incrementalidade da DPA e o jogo
passa a corrigir pelo dado do cliente.

## Estrutura

```
index.html        atividade completa (abertura, cadastro, duas etapas, resultado)
painel.html       painel do evento
config.js         evento, tablet, senha do painel e chaves do Firebase
js/dados.js       45 SKUs de iogurte e 24 Galbani
js/etapas.js      configuração das etapas, segmentos e pesos da pontuação
js/motor.js       correção e pontuação
js/store.js       gravação e ranking ao vivo
js/app.js         fluxo da atividade, arrastar e soltar
js/painel.js      painel
assets/produtos/  packshots oficiais
```

Projeto 75 LAB.
