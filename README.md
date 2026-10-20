# MIX+ DPA

Atividade interativa de convenção sobre **sortimento e incremento de vendas**: a loja já
trabalha os produtos de maior volume e o participante decide o que acrescentaria para vender
mais. São duas etapas, iogurtes e Galbani, com pontuação por potencial de venda, margem,
equilíbrio do sortimento e tempo, e ranking do evento entre os tablets.

**Atividade:** https://projetos.75lab.com.br/mixmais-dpa/
**Painel do evento:** https://projetos.75lab.com.br/mixmais-dpa/painel.html

## Como a atividade funciona

A atividade é de **visão comercial**, não de execução de gôndola. A pergunta que o
participante responde é: *o que eu acrescentaria ao sortimento desta loja para vender mais?*

1. **Cadastro** (nome, e-mail, empresa ou loja, telefone e área), com aceite de uso dos dados.
2. **Escolha do formato de loja**: supermercado, cash and carry, hiper com sortimento mínimo
   ou hiper com sortimento completo. São as quatro abas do simulador da DPA.
3. **Etapa 1, Iogurtes**: a tela mostra à esquerda os SKUs de maior volume que a loja **já
   trabalha** e à direita uma lista enxuta de produtos incrementais. O participante marca
   **até 10** deles. Nenhum número de venda ou margem aparece durante a escolha.
4. **Etapa 2, Galbani**: mesma lógica, com até 8 produtos.
5. **Resultado**: quanto o mix escolhido adiciona de potencial à loja, a pontuação, a posição
   no ranking com pódio, as escolhas que mais somaram e as oportunidades que ficaram de fora.

### Os quatro formatos, com os números da planilha

| Formato | SKUs no plano | SKUs de maior volume já na loja | Potencial do plano |
| --- | --- | --- | --- |
| Supermercado | 40 | 13 | R$ 3,69 mi |
| Cash and carry | 41 | 14 | R$ 6,06 mi |
| Hiper, sortimento mínimo | 50 | 14 | R$ 4,10 mi |
| Hiper, sortimento completo | 86 | 23 | R$ 4,66 mi |

### A lista de incrementais

São 30 opções em iogurtes e 19 em Galbani, montadas assim: o miolo são os SKUs que o plano
daquele formato pede e que a loja ainda não tem, somados aos de maior margem do portfólio e a
alguns itens que giram em **outros** formatos, que entram como distratores. Quem marca um
desses perde potencial, porque não é o shopper daquela loja.

A lista nunca aparece ordenada por valor: sai por categoria e nome, senão a ordem entrega a
resposta.

## Pontuação

| Bloco | Peso | O que mede |
| --- | --- | --- |
| Potencial de venda | 550 | Quanto de venda o mix escolhido adiciona, entre o pior e o melhor conjunto possível com o mesmo número de itens |
| Margem do mix | 150 | Se o participante puxou também os itens de maior margem, não só os de volume |
| Equilíbrio do sortimento | 100 | Se cobriu categorias diferentes em vez de concentrar tudo em uma |
| Tempo de decisão | 200 | Bônus cheio até 3min nas duas etapas, zerando em 10min |

Volume e margem competem de propósito: quem persegue só um dos dois não chega ao topo.
Calibração conferida em simulação, com 150 segundos de decisão:

| Como escolheu | Pontos |
| --- | --- |
| Os 10 de maior potencial de venda | 955 |
| Os 10 de maior margem | 772 |
| Os primeiros da lista | 710 |
| Dez ao acaso | 608 |
| Os 10 de menor potencial | 321 |

A mesma escolha ótima cai para 898 pontos em 5 minutos e 755 em 10 minutos.

## O que ainda falta validar com a Dani

A mecânica está parametrizada esperando a lista definitiva que ela enviaria. Tudo está em
[js/etapas.js](js/etapas.js):

- `escolhas`: quantos produtos o participante pode marcar (hoje 10 em iogurtes, 8 em Galbani)
- `opcoes`: tamanho da lista de incrementais (hoje 30 e 19)
- `PESOS`: distribuição dos pontos e as faixas de tempo

Se ela mandar a lista de SKUs fechada, dá para fixá-la direto em `js/dados-dpa.js`, marcando
quais entram como sortimento inicial e quais entram como opção.

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
giro Scanntech, margem, dimensões, unidades, frentes e espaço linear, em cada um dos quatro
formatos de loja. A atividade não inventa peso de importância: o potencial de cada produto é o
giro da planilha naquele formato, e a margem é a coluna de margem dela.

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
aparecem na lista como opção, mas rendem só 35% do que renderiam na loja certa: é assim que a
atividade cobra sortimento certo para cada tipo de loja.

Para atualizar quando a planilha mudar: rode de novo a extração (quatro abas, mesmas colunas)
e regenere `js/dados-dpa.js`. A estrutura de `PLANOS` traz, por formato, a lista de SKUs do
plano, quais deles fazem 80% do faturamento e o espaço linear de cada um, que a planilha usa
e a atividade guarda para quando o cliente quiser voltar a falar de execução.

**Packshots**: aiogurteria.com.br, chamyto.com.br e chambinho.com.br cobrem 75 dos 86 SKUs.
Os 9 da linha Chandelle que já estão no varejo foram buscados nos catálogos de supermercados
(Zaffari, Coop e Mambo, via API pública de catálogo), com o fundo branco removido para ficarem
iguais aos demais. Só dois itens muito novos, Chandelle Flan Caramelo e Chandelle Festa
Morango, seguem com cartão tipográfico marcado "packshot a receber". Basta substituir o arquivo
em `assets/produtos/iogurtes/` mantendo o nome.

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
js/motor.js       lista de opções, correção e pontuação
js/store.js       gravação e ranking ao vivo
js/app.js         fluxo da atividade e a tela de seleção
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
