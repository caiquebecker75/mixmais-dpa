# MIX+ DPA

Atividade interativa de convenção: o participante recebe a gôndola **já montada** com os SKUs
que representam 80% do faturamento e precisa decidir quais **itens incrementais** entram nos
espaços que sobraram. São duas etapas, iogurtes e Galbani, com pontuação por assertividade e
tempo e ranking do evento entre os tablets.

**Atividade:** https://projetos.75lab.com.br/mixmais-dpa/
**Painel do evento:** https://projetos.75lab.com.br/mixmais-dpa/painel.html

## Como a atividade funciona

1. **Cadastro** (nome, e-mail, empresa ou loja, telefone e área), com aceite de uso dos dados.
2. **Escolha do formato de loja**: supermercado, cash and carry, hiper com sortimento mínimo
   ou hiper com sortimento completo. São as quatro abas do simulador da DPA, cada uma com a
   gôndola, o sortimento e o espaço linear reais.
3. **Etapa 1, Iogurtes**: os SKUs que fazem 80% do faturamento naquele formato já chegam
   posicionados, ocupando o espaço linear real deles. O que sobra de gôndola é do participante,
   que escolhe entre todo o portfólio. **Cada embalagem ocupa a largura real vezes o número de
   frentes**, então o que cabe é uma decisão de priorização, não uma lista de desejos.
4. **Etapa 2, Galbani**: 5 SKUs do 80% já posicionados, 10 espaços livres e 19 opções.
5. **Resultado**: pontuação de 0 a 1000, nível, posição no ranking do evento, o que foi bem
   escolhido e quais oportunidades ficaram de fora em cada etapa.

### Os quatro formatos, com os números da planilha

| Formato | Gôndola | SKUs no plano | SKUs que fazem 80% do faturamento | Espaço livre no jogo |
| --- | --- | --- | --- | --- |
| Supermercado | 7,32 m | 40 | 13 | 1,99 m |
| Cash and carry | 9,81 m | 41 | 14 | 2,67 m |
| Hiper, sortimento mínimo | 43,2 m | 50 | 14 | 7,12 m |
| Hiper, sortimento completo | 43,2 m | 86 | 23 | 6,50 m |

O espaço livre é metade do espaço que os itens incrementais ocupam no plano real, para a
partida caber no tempo de uma convenção. Para a experiência completa, mude `FRACAO_LIVRE`
para `1` em [js/etapas.js](js/etapas.js).

Em cada etapa o participante arrasta o produto da lista até o espaço que quiser, ou toca nele
para ocupar o próximo espaço livre. Tocar em um item que ele escolheu devolve para a lista.
Os SKUs do 80% ficam travados: não dá para tirar o que a loja já vende bem.

## Pontuação

| Bloco | Peso | O que mede |
| --- | --- | --- |
| Assertividade do MIX | 700 | Quanto do giro possível a pessoa capturou dentro do espaço que tinha |
| Cobertura de categorias | 100 | Se as categorias do plano daquele formato foram atendidas |
| Tempo de montagem | 200 | Bônus cheio até 4min nas duas etapas, zerando em 14min |

**O que vale ponto na etapa de iogurtes é giro por centímetro linear.** Um SKU que vende bem
mas ocupa meio metro pode render menos que dois SKUs menores no mesmo espaço, e é essa conta
que o simulador da cliente faz. SKU que não pertence ao plano daquele formato vale zero:
ocupa gôndola e não devolve venda.

Empate no total é desempatado pelo **menor tempo**. Regras em [js/motor.js](js/motor.js) e pesos
em [js/etapas.js](js/etapas.js).

A nota não é uma contagem simples de acertos: o sortimento de pior densidade que caberia no
mesmo espaço zera o bloco de assertividade, o de melhor densidade o leva a 700, e qualquer
combinação no meio cai proporcionalmente. Sem esse piso, qualquer escolha ficaria perto de 100%.

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

### Iogurtes: a base do simulador da cliente

[js/dados-dpa.js](js/dados-dpa.js) é a tradução direta de `BASE_SIMULADOR.xlsx`, a planilha que
a DPA usa hoje. São **86 SKUs** e, para cada um, os números dela: EAN, categoria, giro DPA,
giro Scanntech, margem, altura, largura, profundidade, unidades, frentes e espaço linear, em
cada um dos quatro formatos de loja. O jogo não inventa peso de importância: usa o giro da
planilha dividido pelo espaço que a embalagem ocupa.

```js
{
  "ean": "7891000261026",
  "nome": "Ninho Iogurte Polpa 6x540g",
  "marca": "Ninho",
  "cat": "INFANTIL",
  "margem": 1.91,
  "larg": 18.9, "alt": 15.2, "prof": 12.6,     // centímetros, da planilha
  "planos": {
    "supermercado": { "giro": 749576, "frentes": 2, "un": 6, "linear": 0.05162 },
    "cash": { ... }, "hiper_minimo": { ... }, "hiper_total": { ... }
  }
}
```

Um SKU só entra no sortimento de referência do formato onde a cliente o colocou. Os outros
aparecem na lista como opção, mas valem zero naquele formato: é assim que o jogo cobra
sortimento certo para cada tipo de loja.

Para atualizar quando a planilha mudar: rode de novo a extração (quatro abas, mesmas colunas)
e regenere `js/dados-dpa.js`. A estrutura de `PLANOS` traz, por formato, a gôndola em
centímetros, a lista de SKUs do plano, os SKUs do 80% e o espaço linear ocupado.

**Packshots**: aiogurteria.com.br, chamyto.com.br e chambinho.com.br cobrem 75 dos 86 SKUs.
Os 11 da linha Chandelle entram com um cartão tipográfico provisório, marcado como
"packshot a receber". Basta substituir o arquivo em `assets/produtos/iogurtes/` mantendo o
nome para o jogo passar a usar a foto oficial.

### Galbani

24 SKUs com nome e packshot de galbani.com.br. Enquanto a Galbani não mandar a base dela no
mesmo formato do simulador de iogurtes, essa etapa continua com vagas iguais e peso de
incrementalidade estimado, no arquivo [js/dados.js](js/dados.js).

## Estrutura

```
index.html        atividade completa (abertura, cadastro, duas etapas, resultado)
painel.html       painel do evento
config.js         evento, tablet, senha do painel e chaves do Firebase
js/dados-dpa.js   86 SKUs da base do simulador da cliente, com os 4 planos de loja
js/dados.js       24 SKUs Galbani
js/etapas.js      formatos de loja, etapas, categorias e pesos da pontuação
js/motor.js       correção e pontuação
js/store.js       gravação e ranking ao vivo
js/app.js         fluxo da atividade, arrastar e soltar
js/painel.js      painel
assets/produtos/  packshots oficiais
```

Projeto 75 LAB.

## Base original da cliente

O arquivo [base-simulador-dpa.xlsx](base-simulador-dpa.xlsx) é a planilha que a DPA enviou,
guardada aqui para rastreabilidade. Quatro abas, uma por formato de loja, com as colunas
EAN, Nome, Categoria, GIRO DPA, GIRO SCANNTECH, MARGEM, Altura, Largura, Profundidade,
Total Unidades, Total Frentes e Espaço Linear.

Dela saíram, por formato: a largura da gôndola (espaço linear de cada item dividido pela
largura vezes frentes), a curva de Pareto do giro que define os SKUs do 80% e o sortimento
de referência usado na correção.
