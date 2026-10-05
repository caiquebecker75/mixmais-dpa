// Base real do simulador da cliente (BASE_SIMULADOR.xlsx, 4 abas = 4 formatos de loja).
// EAN, nome, categoria, giro DPA, margem, dimensoes, frentes e espaco linear sao da planilha.
// Packshots: aiogurteria.com.br, chamyto.com.br e chambinho.com.br. A linha Chandelle entra
// com cartao tipografico ate o cliente enviar os packshots oficiais.
window.SKUS_DPA = [
 {
  "ean": "7891000261026",
  "nomeBase": "NINHO Iogurte Polpa 6x540g BR",
  "nome": "Ninho Iogurte Polpa 6x540g",
  "marca": "Ninho",
  "cat": "INFANTIL",
  "margem": 1.91,
  "larg": 18.9,
  "alt": 15.2,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-ninho-polpa-540g.webp",
  "planos": {
   "supermercado": {
    "giro": 749576,
    "frentes": 2,
    "un": 6,
    "linear": 0.05162
   },
   "hiper_minimo": {
    "giro": 940887,
    "frentes": 3,
    "un": 9,
    "linear": 0.01312
   },
   "hiper_total": {
    "giro": 940887,
    "frentes": 1,
    "un": 3,
    "linear": 0.00437
   },
   "cash": {
    "giro": 1247526,
    "frentes": 2,
    "un": 6,
    "linear": 0.03854
   }
  },
  "giroRef": 969719,
  "id": "d00"
 },
 {
  "ean": "7891000070444",
  "nomeBase": "CHAMYTO Leite Fermentado 21(6x75g) BR",
  "nome": "Chamyto Leite Fermentado 21(6x75g)",
  "marca": "Chamyto",
  "cat": "LEITE FERMENTADO",
  "margem": 2.65,
  "larg": 12.6,
  "alt": 8.1,
  "prof": 8.4,
  "arquivo": "assets/produtos/iogurtes/chamyto-box-trad-80g.webp",
  "planos": {
   "supermercado": {
    "giro": 608483,
    "frentes": 6,
    "un": 90,
    "linear": 0.10324
   },
   "hiper_minimo": {
    "giro": 773202,
    "frentes": 8,
    "un": 120,
    "linear": 0.02332
   },
   "hiper_total": {
    "giro": 773202,
    "frentes": 8,
    "un": 120,
    "linear": 0.02332
   },
   "cash": {
    "giro": 1184258,
    "frentes": 8,
    "un": 120,
    "linear": 0.10277
   }
  },
  "giroRef": 834786,
  "id": "d01"
 },
 {
  "ean": "7891000072950",
  "nomeBase": "NESTLE Iogurte Natural 28x170g BR",
  "nome": "Nestlé Iogurte Natural 28x170g",
  "marca": "Nestlé",
  "cat": "NATURAL",
  "margem": 3.91,
  "larg": 6.8,
  "alt": 9.0,
  "prof": 6.8,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-170g.webp",
  "planos": {
   "supermercado": {
    "giro": 325423,
    "frentes": 3,
    "un": 42,
    "linear": 0.02786
   },
   "hiper_minimo": {
    "giro": 272866,
    "frentes": 10,
    "un": 140,
    "linear": 0.01573
   },
   "hiper_total": {
    "giro": 272866,
    "frentes": 10,
    "un": 140,
    "linear": 0.01573
   },
   "cash": {
    "giro": 467419,
    "frentes": 3,
    "un": 42,
    "linear": 0.0208
   }
  },
  "giroRef": 334644,
  "id": "d02"
 },
 {
  "ean": "7898755200331",
  "nomeBase": "NESTLE IOGURTE MORAN ZERO 12X1,150KG BR",
  "nome": "Nestlé IOGURTE Morango ZERO 12X1,150KG",
  "marca": "Nestlé",
  "cat": "LIQUIDO",
  "margem": 1.95,
  "larg": 9.9,
  "alt": 23.7,
  "prof": 9.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-1-25kg.webp",
  "planos": {
   "supermercado": {
    "giro": 209873,
    "frentes": 2,
    "un": 10,
    "linear": 0.02704
   },
   "hiper_minimo": {
    "giro": 214282,
    "frentes": 1,
    "un": 5,
    "linear": 0.00229
   },
   "hiper_total": {
    "giro": 214282,
    "frentes": 1,
    "un": 5,
    "linear": 0.00229
   },
   "cash": {
    "giro": 284747,
    "frentes": 2,
    "un": 10,
    "linear": 0.02019
   }
  },
  "giroRef": 230796,
  "id": "d03"
 },
 {
  "ean": "7898755200461",
  "nomeBase": "NESTLE Iogurte Morango 12x1150kg BR",
  "nome": "Nestlé Iogurte Morango 12x1150kg",
  "marca": "Nestlé",
  "cat": "LIQUIDO",
  "margem": 1.32,
  "larg": 9.9,
  "alt": 23.7,
  "prof": 9.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-1-25kg.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 171720,
    "frentes": 6,
    "un": 30,
    "linear": 0.01374
   },
   "hiper_total": {
    "giro": 171720,
    "frentes": 3,
    "un": 15,
    "linear": 0.00687
   },
   "cash": {
    "giro": 249358,
    "frentes": 2,
    "un": 10,
    "linear": 0.02019
   }
  },
  "giroRef": 197599,
  "id": "d04"
 },
 {
  "ean": "7891000362037",
  "nomeBase": "NESTLE Iogurte Polpa Morango 6x510g BR",
  "nome": "Nestlé Iogurte Polpa Morango 6x510g",
  "marca": "Nestlé",
  "cat": "POLPA",
  "margem": 1.43,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-polpa-morango-510g.webp",
  "planos": {
   "supermercado": {
    "giro": 246878,
    "frentes": 1,
    "un": 3,
    "linear": 0.02581
   },
   "hiper_minimo": {
    "giro": 165408,
    "frentes": 6,
    "un": 18,
    "linear": 0.02623
   },
   "hiper_total": {
    "giro": 165408,
    "frentes": 3,
    "un": 9,
    "linear": 0.01312
   },
   "cash": {
    "giro": 183559,
    "frentes": 1,
    "un": 3,
    "linear": 0.01927
   }
  },
  "giroRef": 190313,
  "id": "d05"
 },
 {
  "ean": "7891000103937",
  "nomeBase": "CHAMBINHO Petit Morango 16x320g BR",
  "nome": "Chambinho Petit Morango 16x320g",
  "marca": "Chambinho",
  "cat": "PETIT SUISSE",
  "margem": 2.8,
  "larg": 17,
  "alt": 15.2,
  "prof": 11.6,
  "arquivo": "assets/produtos/iogurtes/chambinho-petit-morango-320.webp",
  "planos": {
   "supermercado": {
    "giro": 180763,
    "frentes": 2,
    "un": 8,
    "linear": 0.04643
   },
   "hiper_minimo": {
    "giro": 151609,
    "frentes": 2,
    "un": 8,
    "linear": 0.00879
   },
   "hiper_total": {
    "giro": 151609,
    "frentes": 1,
    "un": 4,
    "linear": 0.00439
   },
   "cash": {
    "giro": 269032,
    "frentes": 1,
    "un": 4,
    "linear": 0.02039
   }
  },
  "giroRef": 188253,
  "id": "d06"
 },
 {
  "ean": "7898755200362",
  "nomeBase": "NESTLE IOGURTE BATIDO ZERO 12X1,150KG BR",
  "nome": "Nestlé IOGURTE BATIDO ZERO 12X1,150KG",
  "marca": "Nestlé",
  "cat": "SOBREMESA",
  "margem": 2.04,
  "larg": 9.9,
  "alt": 23.7,
  "prof": 9.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-1-25kg.webp",
  "planos": {
   "supermercado": {
    "giro": 135564,
    "frentes": 2,
    "un": 10,
    "linear": 0.02704
   },
   "hiper_minimo": {
    "giro": 148815,
    "frentes": 2,
    "un": 10,
    "linear": 0.00458
   },
   "hiper_total": {
    "giro": 148815,
    "frentes": 1,
    "un": 5,
    "linear": 0.00229
   },
   "cash": {
    "giro": 165717,
    "frentes": 2,
    "un": 10,
    "linear": 0.02019
   }
  },
  "giroRef": 149728,
  "id": "d07"
 },
 {
  "ean": "7891000027974",
  "nomeBase": "CHAMYTO LeiteFermentado 21(6x120g)BR",
  "nome": "Chamyto Leite Fermentado 21(6x120g)",
  "marca": "Chamyto",
  "cat": "LEITE FERMENTADO",
  "margem": 2.35,
  "larg": 12.6,
  "alt": 11.7,
  "prof": 8.4,
  "arquivo": "assets/produtos/iogurtes/chamyto-big-leite-ferm-720g.webp",
  "planos": {
   "supermercado": {
    "giro": 143811,
    "frentes": 3,
    "un": 30,
    "linear": 0.05162
   },
   "hiper_minimo": {
    "giro": 109498,
    "frentes": 8,
    "un": 80,
    "linear": 0.02332
   },
   "hiper_total": {
    "giro": 109498,
    "frentes": 8,
    "un": 80,
    "linear": 0.02332
   },
   "cash": {
    "giro": 215692,
    "frentes": 8,
    "un": 80,
    "linear": 0.10277
   }
  },
  "giroRef": 144625,
  "id": "d08"
 },
 {
  "ean": "7891000370933",
  "nomeBase": "CHANDELLE Chocolate 8x540g BR",
  "nome": "Chandelle Chocolate 8x540g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 1.87,
  "larg": 17,
  "alt": 15,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/chandelle-chocolate-8x540g-br.webp",
  "planos": {
   "supermercado": {
    "giro": 71549,
    "frentes": 1,
    "un": 3,
    "linear": 0.02321
   },
   "hiper_minimo": {
    "giro": 118826,
    "frentes": 3,
    "un": 9,
    "linear": 0.01249
   },
   "hiper_total": {
    "giro": 118826,
    "frentes": 3,
    "un": 9,
    "linear": 0.01249
   },
   "cash": {
    "giro": 243198,
    "frentes": 1,
    "un": 3,
    "linear": 0.01886
   }
  },
  "giroRef": 138100,
  "id": "d09"
 },
 {
  "ean": "7891000363256",
  "nomeBase": "NESTLE Iogurte Polpa 2 Sabores 6x510g BR",
  "nome": "Nestlé Iogurte Polpa 2 Sabores 6x510g",
  "marca": "Nestlé",
  "cat": "POLPA",
  "margem": 1.31,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-polpa-morango-e-vitamina-de-frutas-51.webp",
  "planos": {
   "hiper_total": {
    "giro": 77919,
    "frentes": 2,
    "un": 6,
    "linear": 0.00874
   }
  },
  "giroRef": 77919,
  "id": "d10"
 },
 {
  "ean": "7891000096864",
  "nomeBase": "NESTLE GREGO IOG LIGHT 3 SAB 6X540G BR",
  "nome": "Nestlé GREGO Iogurte LIGHT 3 SAB 6X540G",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 4.07,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/neos-grego-light-3-sabores-540g.webp",
  "planos": {
   "supermercado": {
    "giro": 71877,
    "frentes": 1,
    "un": 3,
    "linear": 0.02581
   },
   "hiper_minimo": {
    "giro": 58081,
    "frentes": 1,
    "un": 3,
    "linear": 0.00416
   },
   "hiper_total": {
    "giro": 58081,
    "frentes": 2,
    "un": 6,
    "linear": 0.00874
   },
   "cash": {
    "giro": 123116,
    "frentes": 1,
    "un": 3,
    "linear": 0.01927
   }
  },
  "giroRef": 77789,
  "id": "d11"
 },
 {
  "ean": "7891000252819",
  "nomeBase": "CHAMYTO Pouch Iog Liq Morango 24x100g BR",
  "nome": "Chamyto Pouch Iogurte Líquido Morango 24x100g",
  "marca": "Chamyto",
  "cat": "INFANTIL",
  "margem": 5.08,
  "larg": 9,
  "alt": 17,
  "prof": 4,
  "arquivo": "assets/produtos/iogurtes/chamyto-pouch-morango-100g.webp",
  "planos": {
   "supermercado": {
    "giro": 86380,
    "frentes": 1,
    "un": 12,
    "linear": 0.01229
   },
   "hiper_minimo": {
    "giro": 59710,
    "frentes": 1,
    "un": 12,
    "linear": 0.00208
   },
   "hiper_total": {
    "giro": 59710,
    "frentes": 1,
    "un": 12,
    "linear": 0.00208
   },
   "cash": {
    "giro": 82296,
    "frentes": 1,
    "un": 12,
    "linear": 0.00918
   }
  },
  "giroRef": 72024,
  "id": "d12"
 },
 {
  "ean": "7891000073018",
  "nomeBase": "NESTLE IOG NATURAL DESNATADO 28X160G BR",
  "nome": "Nestlé Iogurte NATURAL DESNATADO 28X160G",
  "marca": "Nestlé",
  "cat": "NATURAL",
  "margem": 5.75,
  "larg": 6.8,
  "alt": 9.0,
  "prof": 6.8,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-desnatado-160g.webp",
  "planos": {
   "supermercado": {
    "giro": 78916,
    "frentes": 1,
    "un": 14,
    "linear": 0.00929
   },
   "hiper_minimo": {
    "giro": 54204,
    "frentes": 10,
    "un": 210,
    "linear": 0.01573
   },
   "hiper_total": {
    "giro": 54204,
    "frentes": 10,
    "un": 210,
    "linear": 0.01573
   },
   "cash": {
    "giro": 79406,
    "frentes": 2,
    "un": 28,
    "linear": 0.01386
   }
  },
  "giroRef": 66682,
  "id": "d13"
 },
 {
  "ean": "7891000360361",
  "nomeBase": "NESTLE GREGO Tradicional + Mrg 6x540g BR",
  "nome": "Nestlé GREGO Tradicional + Morango 6x540g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 4.12,
  "larg": 18,
  "alt": 15.2,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/neos-grego-morango-540g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 47307,
    "frentes": 2,
    "un": 6,
    "linear": 0.00833
   },
   "hiper_total": {
    "giro": 47307,
    "frentes": 2,
    "un": 6,
    "linear": 0.00874
   },
   "cash": {
    "giro": 96181,
    "frentes": 1,
    "un": 3,
    "linear": 0.01927
   }
  },
  "giroRef": 63598,
  "id": "d14"
 },
 {
  "ean": "7891000378175",
  "nomeBase": "NESTLE Iogurte Natural 12x340g BR",
  "nome": "Nestlé Iogurte Natural 12x340g",
  "marca": "Nestlé",
  "cat": "NATURAL",
  "margem": 2.53,
  "larg": 12.6,
  "alt": 16.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-340g.webp",
  "planos": {
   "supermercado": {
    "giro": 53561,
    "frentes": 2,
    "un": 20,
    "linear": 0.03441
   },
   "hiper_minimo": {
    "giro": 48185,
    "frentes": 6,
    "un": 18,
    "linear": 0.01915
   },
   "hiper_total": {
    "giro": 48185,
    "frentes": 4,
    "un": 12,
    "linear": 0.01277
   },
   "cash": {
    "giro": 104081,
    "frentes": 1,
    "un": 10,
    "linear": 0.01285
   }
  },
  "giroRef": 63503,
  "id": "d15"
 },
 {
  "ean": "7898755200485",
  "nomeBase": "NESTLE IOGURTE AMEIXA ZERO 12X1,150KG BR",
  "nome": "Nestlé IOGURTE AMEIXA ZERO 12X1,150KG",
  "marca": "Nestlé",
  "cat": "BENEFÍCIOS",
  "margem": 1.19,
  "larg": 9.9,
  "alt": 23.7,
  "prof": 9.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-1-25kg.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 61431,
    "frentes": 1,
    "un": 5,
    "linear": 0.00229
   },
   "hiper_total": {
    "giro": 61431,
    "frentes": 1,
    "un": 5,
    "linear": 0.00229
   }
  },
  "giroRef": 61431,
  "id": "d16"
 },
 {
  "ean": "7891000340004",
  "nomeBase": "NESTLE BiCam Iogurte Morango 28x150g BR",
  "nome": "Nestlé Bicamada Iogurte Morango 28x150g",
  "marca": "Nestlé",
  "cat": "SOBREMESA",
  "margem": 4.31,
  "larg": 6.8,
  "alt": 9.0,
  "prof": 6.8,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-bi-camada-morango-150g.webp",
  "planos": {
   "supermercado": {
    "giro": 55956,
    "frentes": 2,
    "un": 20,
    "linear": 0.01857
   },
   "hiper_minimo": {
    "giro": 43478,
    "frentes": 10,
    "un": 140,
    "linear": 0.01573
   },
   "hiper_total": {
    "giro": 43478,
    "frentes": 6,
    "un": 84,
    "linear": 0.00944
   },
   "cash": {
    "giro": 102198,
    "frentes": 3,
    "un": 30,
    "linear": 0.0208
   }
  },
  "giroRef": 61278,
  "id": "d17"
 },
 {
  "ean": "7891000261460",
  "nomeBase": "CHAMYTO Iogurte Mrg+Cer Crml 24x130g BR",
  "nome": "Chamyto Iogurte Morango+Cereal Caramelo 24x130g",
  "marca": "Chamyto",
  "cat": "INFANTIL",
  "margem": 6.49,
  "larg": 10.7,
  "alt": 15.2,
  "prof": 9.6,
  "arquivo": "assets/produtos/iogurtes/chamyto-iogurte-chocolate-130g.webp",
  "planos": {
   "supermercado": {
    "giro": 60018,
    "frentes": 3,
    "un": 15,
    "linear": 0.0437
   },
   "hiper_minimo": {
    "giro": 46650,
    "frentes": 6,
    "un": 30,
    "linear": 0.01481
   },
   "hiper_total": {
    "giro": 46650,
    "frentes": 3,
    "un": 15,
    "linear": 0.0074
   },
   "cash": {
    "giro": 83311,
    "frentes": 4,
    "un": 20,
    "linear": 0.0435
   }
  },
  "giroRef": 59157,
  "id": "d18"
 },
 {
  "ean": "7891000360668",
  "nomeBase": "CHAMBINHO Iog Morango Pouch 24x100g BR",
  "nome": "Chambinho Iogurte Morango Pouch 24x100g",
  "marca": "Chambinho",
  "cat": "INFANTIL",
  "margem": 6.56,
  "larg": 9,
  "alt": 17,
  "prof": 4,
  "arquivo": "assets/produtos/iogurtes/chambinho-recreio.webp",
  "planos": {
   "supermercado": {
    "giro": 66244,
    "frentes": 2,
    "un": 24,
    "linear": 0.02458
   },
   "hiper_minimo": {
    "giro": 42419,
    "frentes": 2,
    "un": 24,
    "linear": 0.00416
   },
   "hiper_total": {
    "giro": 42419,
    "frentes": 2,
    "un": 24,
    "linear": 0.00416
   },
   "cash": {
    "giro": 78286,
    "frentes": 3,
    "un": 36,
    "linear": 0.02753
   }
  },
  "giroRef": 57342,
  "id": "d19"
 },
 {
  "ean": "7891000261002",
  "nomeBase": "NINHO Liq Iogurte Maca e Banana12x850gBR",
  "nome": "Ninho Líquido Iogurte Maçã e Banana12x850gBR",
  "marca": "Ninho",
  "cat": "INFANTIL",
  "margem": 3.32,
  "larg": 8.2,
  "alt": 23.7,
  "prof": 8.2,
  "arquivo": "assets/produtos/iogurtes/iogurte-ninho-liquido-maca-e-banana-850g.webp",
  "planos": {
   "supermercado": {
    "giro": 49114,
    "frentes": 2,
    "un": 12,
    "linear": 0.02239
   },
   "hiper_minimo": {
    "giro": 44514,
    "frentes": 6,
    "un": 36,
    "linear": 0.01138
   },
   "hiper_total": {
    "giro": 44514,
    "frentes": 4,
    "un": 24,
    "linear": 0.00759
   },
   "cash": {
    "giro": 82731,
    "frentes": 3,
    "un": 18,
    "linear": 0.02508
   }
  },
  "giroRef": 55218,
  "id": "d20"
 },
 {
  "ean": "7898755200324",
  "nomeBase": "NESTLE IOGURTE COCO ZERO 12X1,150KG BR",
  "nome": "Nestlé IOGURTE COCO ZERO 12X1,150KG",
  "marca": "Nestlé",
  "cat": "BENEFÍCIOS",
  "margem": 1.03,
  "larg": 9.9,
  "alt": 23.7,
  "prof": 9.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-1-25kg.webp",
  "planos": {
   "hiper_total": {
    "giro": 53983,
    "frentes": 1,
    "un": 5,
    "linear": 0.00229
   }
  },
  "giroRef": 53983,
  "id": "d21"
 },
 {
  "ean": "7891000394632",
  "nomeBase": "CHAMBINHO Iogurte Polpa Mrg 6x510g BR",
  "nome": "Chambinho Iogurte Polpa Morango 6x510g",
  "marca": "Chambinho",
  "cat": "INFANTIL",
  "margem": 2.11,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/chambinho-polpa-morango-510.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 41872,
    "frentes": 1,
    "un": 3,
    "linear": 0.00437
   },
   "hiper_total": {
    "giro": 41872,
    "frentes": 1,
    "un": 3,
    "linear": 0.00437
   },
   "cash": {
    "giro": 71231,
    "frentes": 1,
    "un": 3,
    "linear": 0.01927
   }
  },
  "giroRef": 51658,
  "id": "d22"
 },
 {
  "ean": "7891000072974",
  "nomeBase": "NESTLE Iogurte Natural Mel 28x170g BR",
  "nome": "Nestlé Iogurte Natural Mel 28x170g",
  "marca": "Nestlé",
  "cat": "NATURAL",
  "margem": 4.21,
  "larg": 6.8,
  "alt": 9.0,
  "prof": 6.8,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-mel-170g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 35010,
    "frentes": 5,
    "un": 105,
    "linear": 0.00786
   },
   "hiper_total": {
    "giro": 35010,
    "frentes": 5,
    "un": 105,
    "linear": 0.00786
   },
   "cash": {
    "giro": 76550,
    "frentes": 2,
    "un": 42,
    "linear": 0.01387
   }
  },
  "giroRef": 48857,
  "id": "d23"
 },
 {
  "ean": "7891000261484",
  "nomeBase": "NINHO Pouch IogLiq MacaBanana 24x100g BR",
  "nome": "Ninho Pouch IogLíquido MaçãBanana 24x100g",
  "marca": "Ninho",
  "cat": "INFANTIL",
  "margem": 7.15,
  "larg": 9,
  "alt": 17,
  "prof": 4,
  "arquivo": "assets/produtos/iogurtes/iogurte-ninho-pouch-maca-e-banana-100g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 35439,
    "frentes": 1,
    "un": 12,
    "linear": 0.00208
   },
   "hiper_total": {
    "giro": 35439,
    "frentes": 1,
    "un": 12,
    "linear": 0.00208
   },
   "cash": {
    "giro": 73987,
    "frentes": 1,
    "un": 12,
    "linear": 0.00918
   }
  },
  "giroRef": 48288,
  "id": "d24"
 },
 {
  "ean": "7891000072998",
  "nomeBase": "NESTLE Natural Cenoura+Laranja 28x170gBR",
  "nome": "Nestlé Natural Cenoura+Laranja 28x170gBR",
  "marca": "Nestlé",
  "cat": "NATURAL",
  "margem": 3.82,
  "larg": 6.8,
  "alt": 9.0,
  "prof": 6.8,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-cenoura-laranja-e-mel-170g.webp",
  "planos": {
   "supermercado": {
    "giro": 41920,
    "frentes": 1,
    "un": 14,
    "linear": 0.00929
   },
   "hiper_minimo": {
    "giro": 35581,
    "frentes": 5,
    "un": 105,
    "linear": 0.00786
   },
   "hiper_total": {
    "giro": 35581,
    "frentes": 5,
    "un": 105,
    "linear": 0.00786
   },
   "cash": {
    "giro": 70017,
    "frentes": 3,
    "un": 63,
    "linear": 0.0208
   }
  },
  "giroRef": 45775,
  "id": "d25"
 },
 {
  "ean": "7891000096468",
  "nomeBase": "CHANDELLE Chocolate 18x360g BR",
  "nome": "Chandelle Chocolate 18x360g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 2.6,
  "larg": 14.0,
  "alt": 12,
  "prof": 12.8,
  "arquivo": "assets/produtos/iogurtes/chandelle-chocolate-18x360g-br.webp",
  "planos": {
   "supermercado": {
    "giro": 45536,
    "frentes": 1,
    "un": 6,
    "linear": 0.01912
   },
   "hiper_minimo": {
    "giro": 30016,
    "frentes": 2,
    "un": 6,
    "linear": 0.00694
   },
   "hiper_total": {
    "giro": 30016,
    "frentes": 2,
    "un": 6,
    "linear": 0.00694
   }
  },
  "giroRef": 35189,
  "id": "d26"
 },
 {
  "ean": "7891000244265",
  "nomeBase": "NESTLE Iogurte Morango 24x170g BR",
  "nome": "Nestlé Iogurte Morango 24x170g",
  "marca": "Nestlé",
  "cat": "LIQUIDO",
  "margem": 3.13,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-170g.webp",
  "planos": {
   "supermercado": {
    "giro": 35793,
    "frentes": 3,
    "un": 60,
    "linear": 0.02048
   },
   "hiper_minimo": {
    "giro": 23930,
    "frentes": 13,
    "un": 130,
    "linear": 0.01504
   },
   "hiper_total": {
    "giro": 23930,
    "frentes": 8,
    "un": 80,
    "linear": 0.00925
   },
   "cash": {
    "giro": 51559,
    "frentes": 8,
    "un": 80,
    "linear": 0.04078
   }
  },
  "giroRef": 33803,
  "id": "d27"
 },
 {
  "ean": "7891000382349",
  "nomeBase": "NESTLE GREGO Trad e Mor calda 24x90g BR",
  "nome": "Nestlé GREGO Tradicional e Mor calda 24x90g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 5.73,
  "larg": 10.2,
  "alt": 11,
  "prof": 9.6,
  "arquivo": "assets/produtos/iogurtes/neos-grego-calda-de-morango-90g.webp",
  "planos": {
   "supermercado": {
    "giro": 29109,
    "frentes": 1,
    "un": 10,
    "linear": 0.01393
   },
   "hiper_minimo": {
    "giro": 21273,
    "frentes": 6,
    "un": 60,
    "linear": 0.01416
   },
   "hiper_total": {
    "giro": 21273,
    "frentes": 3,
    "un": 30,
    "linear": 0.00708
   },
   "cash": {
    "giro": 60219,
    "frentes": 1,
    "un": 10,
    "linear": 0.00969
   }
  },
  "giroRef": 32968,
  "id": "d28"
 },
 {
  "ean": "78936171",
  "nomeBase": "NESTLE GREGO Tradicional 24x90g BR",
  "nome": "Nestlé GREGO Tradicional 24x90g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 5.91,
  "larg": 10.2,
  "alt": 11,
  "prof": 9.6,
  "arquivo": "assets/produtos/iogurtes/neos-grego-tradicional-90g.webp",
  "planos": {
   "supermercado": {
    "giro": 35879,
    "frentes": 1,
    "un": 10,
    "linear": 0.01393
   },
   "hiper_minimo": {
    "giro": 23052,
    "frentes": 6,
    "un": 60,
    "linear": 0.01416
   },
   "hiper_total": {
    "giro": 23052,
    "frentes": 6,
    "un": 60,
    "linear": 0.01416
   },
   "cash": {
    "giro": 43686,
    "frentes": 2,
    "un": 20,
    "linear": 0.01937
   }
  },
  "giroRef": 31417,
  "id": "d29"
 },
 {
  "ean": "7891000305775",
  "nomeBase": "MOLICO Iogurte Liq Morango 12x850g BR",
  "nome": "Molico Iogurte Líquido Morango 12x850g",
  "marca": "Molico",
  "cat": "BENEFÍCIOS",
  "margem": 2.11,
  "larg": 8.2,
  "alt": 23.7,
  "prof": 8.2,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-liquido-morango-zero-850g.webp",
  "planos": {
   "supermercado": {
    "giro": 36000,
    "frentes": 2,
    "un": 12,
    "linear": 0.02239
   },
   "hiper_minimo": {
    "giro": 22189,
    "frentes": 1,
    "un": 5,
    "linear": 0.00206
   },
   "hiper_total": {
    "giro": 22189,
    "frentes": 1,
    "un": 5,
    "linear": 0.00206
   },
   "cash": {
    "giro": 44882,
    "frentes": 2,
    "un": 12,
    "linear": 0.01672
   }
  },
  "giroRef": 31315,
  "id": "d30"
 },
 {
  "ean": "7891000244425",
  "nomeBase": "NESTLE Iogurte Morango 12 x900g BR",
  "nome": "Nestlé Iogurte Morango 12 x900g",
  "marca": "Nestlé",
  "cat": "LIQUIDO",
  "margem": 2.45,
  "larg": 8.2,
  "alt": 23.7,
  "prof": 8.2,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-900g.webp",
  "planos": {
   "hiper_total": {
    "giro": 28309,
    "frentes": 4,
    "un": 24,
    "linear": 0.00759
   }
  },
  "giroRef": 28309,
  "id": "d31"
 },
 {
  "ean": "7891000260166",
  "nomeBase": "CHAMYTO Yogurt Mor+Cer Choc 24x130g BR",
  "nome": "Chamyto Yogurt Mor+Cereal Choc 24x130g",
  "marca": "Chamyto",
  "cat": "INFANTIL",
  "margem": 6.81,
  "larg": 10.2,
  "alt": 15.2,
  "prof": 9.6,
  "arquivo": "assets/produtos/iogurtes/chamyto-iogurte-chocolate-130g.webp",
  "planos": {
   "hiper_total": {
    "giro": 27192,
    "frentes": 3,
    "un": 15,
    "linear": 0.00708
   }
  },
  "giroRef": 27192,
  "id": "d32"
 },
 {
  "ean": "7891000379547",
  "nomeBase": "CHAMYTO LeiFerm Trad Tetra 5x480g BR",
  "nome": "Chamyto Leite Fermentado Tradicional Tetra 5x480g",
  "marca": "Chamyto",
  "cat": "LEITE FERMENTADO",
  "margem": 1.01,
  "larg": 12.7,
  "alt": 7.2,
  "prof": 6.6,
  "arquivo": "assets/produtos/iogurtes/chamyto-leite-ferm-450g.webp",
  "planos": {
   "supermercado": {
    "giro": 15254,
    "frentes": 2,
    "un": 42,
    "linear": 0.03469
   },
   "hiper_minimo": {
    "giro": 16200,
    "frentes": 2,
    "un": 42,
    "linear": 0.00588
   },
   "hiper_total": {
    "giro": 16200,
    "frentes": 2,
    "un": 42,
    "linear": 0.00588
   },
   "cash": {
    "giro": 55572,
    "frentes": 4,
    "un": 84,
    "linear": 0.05179
   }
  },
  "giroRef": 25806,
  "id": "d33"
 },
 {
  "ean": "7891000396452",
  "nomeBase": "CHANDELLE Duo Dark+Branco 24x180g BR",
  "nome": "Chandelle Duo Dark+Branco 24x180g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 3.66,
  "larg": 13,
  "alt": 12,
  "prof": 6.4,
  "arquivo": "assets/produtos/iogurtes/chandelle-duo-dark-branco-24x180g-br.webp",
  "planos": {
   "supermercado": {
    "giro": 24452,
    "frentes": 1,
    "un": 14,
    "linear": 0.01775
   },
   "hiper_minimo": {
    "giro": 21699,
    "frentes": 4,
    "un": 56,
    "linear": 0.01342
   },
   "hiper_total": {
    "giro": 21699,
    "frentes": 1,
    "un": 14,
    "linear": 0.00335
   },
   "cash": {
    "giro": 34897,
    "frentes": 2,
    "un": 28,
    "linear": 0.02855
   }
  },
  "giroRef": 25687,
  "id": "d34"
 },
 {
  "ean": "7891000360323",
  "nomeBase": "NESTON Iogurte Polpa 2 Sabores 6x510g BR",
  "nome": "Neston Iogurte Polpa 2 Sabores 6x510g",
  "marca": "Neston",
  "cat": "INFANTIL",
  "margem": 1.91,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-neston-polpa-2-sabores-510g.webp",
  "planos": {
   "hiper_total": {
    "giro": 23239,
    "frentes": 1,
    "un": 3,
    "linear": 0.00437
   }
  },
  "giroRef": 23239,
  "id": "d35"
 },
 {
  "ean": "7891000252833",
  "nomeBase": "CHAMYTO Pouch Iog Liq Vitamina 24x100g",
  "nome": "Chamyto Pouch Iogurte Líquido Vitamina 24x100g",
  "marca": "Chamyto",
  "cat": "INFANTIL",
  "margem": 7.17,
  "larg": 9,
  "alt": 17,
  "prof": 4,
  "arquivo": "assets/produtos/iogurtes/chamyto-pouch-frutas-100g.webp",
  "planos": {
   "hiper_total": {
    "giro": 22267,
    "frentes": 1,
    "un": 12,
    "linear": 0.00208
   }
  },
  "giroRef": 22267,
  "id": "d36"
 },
 {
  "ean": "7891000260623",
  "nomeBase": "NESTON Iogurte Liq Mc Bna 12x850g BR",
  "nome": "Neston Iogurte Líquido Maçã e Banana 12x850g",
  "marca": "Neston",
  "cat": "INFANTIL",
  "margem": 3.06,
  "larg": 8.2,
  "alt": 23.7,
  "prof": 8.2,
  "arquivo": "assets/produtos/iogurtes/iogurte-liquido-neston-maca-e-banana-850g.webp",
  "planos": {
   "hiper_total": {
    "giro": 21715,
    "frentes": 2,
    "un": 12,
    "linear": 0.00379
   }
  },
  "giroRef": 21715,
  "id": "d37"
 },
 {
  "ean": "7898755200348",
  "nomeBase": "NESTLE IOGURTE LIQ MORANGO ZERO 24X170G",
  "nome": "Nestlé IOGURTE Líquido MORANGO ZERO 24X170G",
  "marca": "Nestlé",
  "cat": "BENEFÍCIOS",
  "margem": 4.31,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-170g.webp",
  "planos": {
   "supermercado": {
    "giro": 24843,
    "frentes": 3,
    "un": 60,
    "linear": 0.02048
   },
   "hiper_minimo": {
    "giro": 18237,
    "frentes": 6,
    "un": 48,
    "linear": 0.00694
   },
   "hiper_total": {
    "giro": 18237,
    "frentes": 6,
    "un": 48,
    "linear": 0.00694
   },
   "cash": {
    "giro": 25157,
    "frentes": 3,
    "un": 30,
    "linear": 0.01529
   }
  },
  "giroRef": 21618,
  "id": "d38"
 },
 {
  "ean": "7891000094396",
  "nomeBase": "NINHO Soleil Ploc Morango 8x250g BR",
  "nome": "Ninho Soleil Ploc Morango 8x250g",
  "marca": "Ninho",
  "cat": "INFANTIL",
  "margem": 7.42,
  "larg": 13.0,
  "alt": 12.0,
  "prof": 12.0,
  "arquivo": "assets/produtos/iogurtes/ninho-fruti-morango-250g.webp",
  "planos": {
   "hiper_total": {
    "giro": 21260,
    "frentes": 1,
    "un": 4,
    "linear": 0.00301
   }
  },
  "giroRef": 21260,
  "id": "d39"
 },
 {
  "ean": "7898755200232",
  "nomeBase": "CHAMBINHO Petit Maçã e Banana 16x320g BR",
  "nome": "Chambinho Petit Maçã e Banana 16x320g",
  "marca": "Chambinho",
  "cat": "BENEFÍCIOS",
  "margem": 2.58,
  "larg": 18.5,
  "alt": 15.2,
  "prof": 11.6,
  "arquivo": "assets/produtos/iogurtes/chambinho-petit-maca-banana-320.webp",
  "planos": {
   "supermercado": {
    "giro": 24568,
    "frentes": 1,
    "un": 4,
    "linear": 0.02526
   },
   "hiper_minimo": {
    "giro": 22353,
    "frentes": 2,
    "un": 8,
    "linear": 0.00879
   },
   "hiper_total": {
    "giro": 22353,
    "frentes": 1,
    "un": 4,
    "linear": 0.00439
   },
   "cash": {
    "giro": 15240,
    "frentes": 1,
    "un": 4,
    "linear": 0.02039
   }
  },
  "giroRef": 21128,
  "id": "d40"
 },
 {
  "ean": "7891000390078",
  "nomeBase": "NESTLE Iog FrtsVerms BiCam 28x150g BR",
  "nome": "Nestlé Iogurte Frutas Vermelhas Bicamada 28x150g",
  "marca": "Nestlé",
  "cat": "SOBREMESA",
  "margem": 4.31,
  "larg": 6.8,
  "alt": 9,
  "prof": 6.8,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-bi-camada-frutas-vermelhas-150g.webp",
  "planos": {
   "hiper_total": {
    "giro": 20366,
    "frentes": 4,
    "un": 56,
    "linear": 0.00629
   }
  },
  "giroRef": 20366,
  "id": "d41"
 },
 {
  "ean": "7891000110430",
  "nomeBase": "CHAMBINHO Chocolate 16x320g BR",
  "nome": "Chambinho Chocolate 16x320g",
  "marca": "Chambinho",
  "cat": "PETIT SUISSE",
  "margem": 1.31,
  "larg": 19.0,
  "alt": 15.2,
  "prof": 11.6,
  "arquivo": "assets/produtos/iogurtes/chambinho-petit-chocolate-320.webp",
  "planos": {
   "hiper_total": {
    "giro": 20021,
    "frentes": 1,
    "un": 4,
    "linear": 0.00439
   }
  },
  "giroRef": 20021,
  "id": "d42"
 },
 {
  "ean": "7891000103852",
  "nomeBase": "NINHO Iogurte Liq Maca e Banana24x170gBR",
  "nome": "Ninho Iogurte Líquido Maçã e Banana24x170gBR",
  "marca": "Ninho",
  "cat": "INFANTIL",
  "margem": 4.71,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-ninho-liquido-maca-e-banana-170g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 18855,
    "frentes": 4,
    "un": 40,
    "linear": 0.00463
   },
   "hiper_total": {
    "giro": 18855,
    "frentes": 2,
    "un": 20,
    "linear": 0.00231
   }
  },
  "giroRef": 18855,
  "id": "d43"
 },
 {
  "ean": "7891000360583",
  "nomeBase": "NESTLE GREGO Tradicional 12x360g BR",
  "nome": "Nestlé GREGO Tradicional 12x360g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 5.9,
  "larg": 14,
  "alt": 14,
  "prof": 14,
  "arquivo": "assets/produtos/iogurtes/neos-grego-tradicional-360g.webp",
  "planos": {
   "hiper_total": {
    "giro": 18334,
    "frentes": 2,
    "un": 6,
    "linear": 0.00648
   }
  },
  "giroRef": 18334,
  "id": "d44"
 },
 {
  "ean": "7891000104613",
  "nomeBase": "NESTLE Grego Light Maracujá 12x360g BR",
  "nome": "Nestlé Grego Light Maracujá 12x360g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 5.45,
  "larg": 14,
  "alt": 14,
  "prof": 14,
  "arquivo": "assets/produtos/iogurtes/neos-grego-light-maracuja-360g.webp",
  "planos": {
   "hiper_total": {
    "giro": 17825,
    "frentes": 1,
    "un": 3,
    "linear": 0.00324
   }
  },
  "giroRef": 17825,
  "id": "d45"
 },
 {
  "ean": "7891000360620",
  "nomeBase": "NESTLE GREGO FrtsVerms 12x360g BR",
  "nome": "Nestlé GREGO Frutas Vermelhas 12x360g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 5.72,
  "larg": 14,
  "alt": 14,
  "prof": 14,
  "arquivo": "assets/produtos/iogurtes/neos-grego-frutas-vermelhas-360g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 17785,
    "frentes": 1,
    "un": 3,
    "linear": 0.00324
   },
   "hiper_total": {
    "giro": 17785,
    "frentes": 1,
    "un": 3,
    "linear": 0.00324
   }
  },
  "giroRef": 17785,
  "id": "d46"
 },
 {
  "ean": "7898755200393",
  "nomeBase": "CHAMBINHO MORANGO 850G",
  "nome": "Chambinho MORANGO 850G",
  "marca": "Chambinho",
  "cat": "INFANTIL",
  "margem": 3.71,
  "larg": 8.2,
  "alt": 23.7,
  "prof": 8.2,
  "arquivo": "assets/produtos/iogurtes/chambinho-garrafa-morango-850.webp",
  "planos": {
   "supermercado": {
    "giro": 24498,
    "frentes": 2,
    "un": 12,
    "linear": 0.0224
   },
   "hiper_minimo": {
    "giro": 17032,
    "frentes": 3,
    "un": 18,
    "linear": 0.00569
   },
   "hiper_total": {
    "giro": 17032,
    "frentes": 3,
    "un": 18,
    "linear": 0.00569
   },
   "cash": {
    "giro": 11713,
    "frentes": 2,
    "un": 10,
    "linear": 0.01815
   }
  },
  "giroRef": 17569,
  "id": "d47"
 },
 {
  "ean": "7891000409282",
  "nomeBase": "NESTLE GREGO F Verm Calda 24x90g BR",
  "nome": "Nestlé GREGO Frutas Vermelhas Calda 24x90g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 5.65,
  "larg": 10.2,
  "alt": 11,
  "prof": 9.6,
  "arquivo": "assets/produtos/iogurtes/neos-grego-calda-de-frutas-vermelhas-90g.webp",
  "planos": {
   "supermercado": {
    "giro": 22388,
    "frentes": 1,
    "un": 10,
    "linear": 0.01393
   },
   "hiper_minimo": {
    "giro": 14091,
    "frentes": 6,
    "un": 60,
    "linear": 0.01416
   },
   "hiper_total": {
    "giro": 14091,
    "frentes": 3,
    "un": 30,
    "linear": 0.00708
   },
   "cash": {
    "giro": 18390,
    "frentes": 1,
    "un": 10,
    "linear": 0.00979
   }
  },
  "giroRef": 17240,
  "id": "d48"
 },
 {
  "ean": "7891000103876",
  "nomeBase": "NINHO Iogurte Liq Morango 24x170g BR",
  "nome": "Ninho Iogurte Líquido Morango 24x170g",
  "marca": "Ninho",
  "cat": "INFANTIL",
  "margem": 4.94,
  "larg": 5.0,
  "alt": 12.3,
  "prof": 5.0,
  "arquivo": "assets/produtos/iogurtes/iogurte-ninho-liquido-morango-170g.webp",
  "planos": {
   "hiper_total": {
    "giro": 17138,
    "frentes": 1,
    "un": 10,
    "linear": 0.00116
   }
  },
  "giroRef": 17138,
  "id": "d49"
 },
 {
  "ean": "7891000241448",
  "nomeBase": "NESTLE Iogurte Vit de Fruta 24x170g BR",
  "nome": "Nestlé Iogurte Vitamina de Frutas 24x170g",
  "marca": "Nestlé",
  "cat": "LIQUIDO",
  "margem": 3.07,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-vitamina-de-frutas-170g.webp",
  "planos": {
   "hiper_total": {
    "giro": 16782,
    "frentes": 5,
    "un": 50,
    "linear": 0.00578
   }
  },
  "giroRef": 16782,
  "id": "d50"
 },
 {
  "ean": "7891000103913",
  "nomeBase": "CHAMBINHO Petit Morango 12x480g  BR",
  "nome": "Chambinho Petit Morango 12x480g",
  "marca": "Chambinho",
  "cat": "PETIT SUISSE",
  "margem": 2.61,
  "larg": 19,
  "alt": 17,
  "prof": 11.6,
  "arquivo": "assets/produtos/iogurtes/chambinho-petit-maxi-morango-480.webp",
  "planos": {
   "hiper_total": {
    "giro": 16762,
    "frentes": 1,
    "un": 4,
    "linear": 0.00439
   }
  },
  "giroRef": 16762,
  "id": "d51"
 },
 {
  "ean": "78936195",
  "nomeBase": "CHANDELLE Chocolate 24x180g BR",
  "nome": "Chandelle Chocolate 24x180g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 4.55,
  "larg": 14.0,
  "alt": 12,
  "prof": 6.4,
  "arquivo": "assets/produtos/iogurtes/chandelle-chocolate-24x180g-br.webp",
  "planos": {
   "hiper_total": {
    "giro": 15653,
    "frentes": 1,
    "un": 14,
    "linear": 0.00324
   }
  },
  "giroRef": 15653,
  "id": "d52"
 },
 {
  "ean": "7898755200195",
  "nomeBase": "NATURAL BANDEJA DESN",
  "nome": "Nestlé Natural BANDEJA DESN",
  "marca": "Nestlé Natural",
  "cat": "NATURAL",
  "margem": 4.31,
  "larg": 13.8,
  "alt": 14,
  "prof": 14,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-desnatado-320g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 15450,
    "frentes": 3,
    "un": 9,
    "linear": 0.00958
   },
   "hiper_total": {
    "giro": 15450,
    "frentes": 2,
    "un": 6,
    "linear": 0.00638
   }
  },
  "giroRef": 15450,
  "id": "d53"
 },
 {
  "ean": "7891000276280",
  "nomeBase": "CHAMYTO LeiFerm Uva Tetra 5x480g BR",
  "nome": "Chamyto Leite Fermentado Uva Tetra 5x480g",
  "marca": "Chamyto",
  "cat": "LEITE FERMENTADO",
  "margem": 1.3,
  "larg": 12.7,
  "alt": 7.2,
  "prof": 6.6,
  "arquivo": "assets/produtos/iogurtes/chamyto-leite-ferm-uva-tetra.webp",
  "planos": {
   "hiper_total": {
    "giro": 15274,
    "frentes": 1,
    "un": 21,
    "linear": 0.00294
   }
  },
  "giroRef": 15274,
  "id": "d54"
 },
 {
  "ean": "7898755200317",
  "nomeBase": "NESTLE Iogurte Polpa Morango e Coco 6x510g BR",
  "nome": "Nestlé Iogurte Polpa Morango e Coco 6x510g",
  "marca": "Nestlé",
  "cat": "POLPA",
  "margem": 0.61,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-polpa-morango-e-vitamina-de-frutas-51.webp",
  "planos": {
   "hiper_total": {
    "giro": 15193,
    "frentes": 1,
    "un": 3,
    "linear": 0.00437
   }
  },
  "giroRef": 15193,
  "id": "d55"
 },
 {
  "ean": "7891000276303",
  "nomeBase": "CHAMYTO LeiFerm Morango Tetra 5x480g BR",
  "nome": "Chamyto Leite Fermentado Morango Tetra 5x480g",
  "marca": "Chamyto",
  "cat": "LEITE FERMENTADO",
  "margem": 1.34,
  "larg": 12.7,
  "alt": 7.2,
  "prof": 6.6,
  "arquivo": "assets/produtos/iogurtes/chamyto-leite-ferm-morango-tetra.webp",
  "planos": {
   "supermercado": {
    "giro": 18569,
    "frentes": 1,
    "un": 21,
    "linear": 0.01734
   },
   "hiper_minimo": {
    "giro": 13369,
    "frentes": 2,
    "un": 42,
    "linear": 0.00588
   },
   "hiper_total": {
    "giro": 13369,
    "frentes": 1,
    "un": 21,
    "linear": 0.00294
   }
  },
  "giroRef": 15102,
  "id": "d56"
 },
 {
  "ean": "7891000393536",
  "nomeBase": "NESTLE Iog Nat Zero Lactose 12x320g BR",
  "nome": "Nestlé Iogurte Nat Zero Lactose 12x320g",
  "marca": "Nestlé",
  "cat": "NATURAL",
  "margem": 3.02,
  "larg": 14,
  "alt": 14,
  "prof": 14,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-zero-lactose-320g.webp",
  "planos": {
   "hiper_total": {
    "giro": 15029,
    "frentes": 2,
    "un": 6,
    "linear": 0.00648
   }
  },
  "giroRef": 15029,
  "id": "d57"
 },
 {
  "ean": "7898755200379",
  "nomeBase": "NESTLE IOGURTE LIQ BATIDO ZERO 24X170G B",
  "nome": "Nestlé IOGURTE Líquido BATIDO ZERO 24X170G B",
  "marca": "Nestlé",
  "cat": "BENEFÍCIOS",
  "margem": 4.37,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-170g.webp",
  "planos": {
   "supermercado": {
    "giro": 19943,
    "frentes": 3,
    "un": 60,
    "linear": 0.02048
   },
   "hiper_minimo": {
    "giro": 12296,
    "frentes": 6,
    "un": 48,
    "linear": 0.00694
   },
   "hiper_total": {
    "giro": 12296,
    "frentes": 6,
    "un": 48,
    "linear": 0.00694
   },
   "cash": {
    "giro": 15208,
    "frentes": 4,
    "un": 40,
    "linear": 0.02039
   }
  },
  "giroRef": 14936,
  "id": "d58"
 },
 {
  "ean": "7891000409305",
  "nomeBase": "NESTLE GREGO Limão Calda 24x90g BR",
  "nome": "Nestlé GREGO Limão Calda 24x90g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 6.29,
  "larg": 10.2,
  "alt": 11,
  "prof": 9.6,
  "arquivo": "assets/produtos/iogurtes/neos-grego-calda-de-limao-90g.webp",
  "planos": {
   "supermercado": {
    "giro": 19213,
    "frentes": 1,
    "un": 10,
    "linear": 0.01393
   },
   "hiper_minimo": {
    "giro": 13373,
    "frentes": 6,
    "un": 60,
    "linear": 0.01416
   },
   "hiper_total": {
    "giro": 13373,
    "frentes": 3,
    "un": 30,
    "linear": 0.00708
   },
   "cash": {
    "giro": 11997,
    "frentes": 1,
    "un": 10,
    "linear": 0.00969
   }
  },
  "giroRef": 14489,
  "id": "d59"
 },
 {
  "ean": "7891000241615",
  "nomeBase": "NESTLE GREGO Iog. Lt. Morango 12x360gBR",
  "nome": "Nestlé GREGO Iog. Lt. Morango 12x360gBR",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 5.91,
  "larg": 14,
  "alt": 14,
  "prof": 14,
  "arquivo": "assets/produtos/iogurtes/neos-grego-light-morango-360g.webp",
  "planos": {
   "hiper_total": {
    "giro": 14270,
    "frentes": 1,
    "un": 3,
    "linear": 0.00324
   }
  },
  "giroRef": 14270,
  "id": "d60"
 },
 {
  "ean": "7891000110096",
  "nomeBase": "CHANDELLE Choc Branco 18x360g BR",
  "nome": "Chandelle Choc Branco 18x360g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 2.93,
  "larg": 15,
  "alt": 15,
  "prof": 15,
  "arquivo": "assets/produtos/iogurtes/chandelle-choc-branco-18x360g-br.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 13706,
    "frentes": 2,
    "un": 6,
    "linear": 0.00694
   },
   "hiper_total": {
    "giro": 13706,
    "frentes": 2,
    "un": 6,
    "linear": 0.00694
   }
  },
  "giroRef": 13706,
  "id": "d61"
 },
 {
  "ean": "7898755200041",
  "nomeBase": "CHAMBINHO Iogurte Liq Mrg 24x165g BR",
  "nome": "Chambinho Iogurte Líquido Morango 24x165g",
  "marca": "Chambinho",
  "cat": "INFANTIL",
  "margem": 4.31,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/chambinho-garrafa-morango-165.webp",
  "planos": {
   "supermercado": {
    "giro": 19455,
    "frentes": 2,
    "un": 40,
    "linear": 0.01366
   },
   "hiper_minimo": {
    "giro": 9846,
    "frentes": 4,
    "un": 40,
    "linear": 0.00463
   },
   "hiper_total": {
    "giro": 9846,
    "frentes": 2,
    "un": 20,
    "linear": 0.00231
   }
  },
  "giroRef": 13049,
  "id": "d62"
 },
 {
  "ean": "7891000378212",
  "nomeBase": "NESTLE Iogurte Natural Mel 12x340g BR",
  "nome": "Nestlé Iogurte Natural Mel 12x340g",
  "marca": "Nestlé",
  "cat": "NATURAL",
  "margem": 2.72,
  "larg": 12.6,
  "alt": 16.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-natural-mel-340g.webp",
  "planos": {
   "supermercado": {
    "giro": 10304,
    "frentes": 1,
    "un": 10,
    "linear": 0.01721
   },
   "hiper_total": {
    "giro": 12276,
    "frentes": 3,
    "un": 9,
    "linear": 0.00972
   }
  },
  "giroRef": 11290,
  "id": "d63"
 },
 {
  "ean": "7898755200386",
  "nomeBase": "MOLICO IOGURTE LIQ AMEIXA 12X850 BR",
  "nome": "Molico IOGURTE Líquido AMEIXA 12X850",
  "marca": "Molico",
  "cat": "BENEFÍCIOS",
  "margem": 1.2,
  "larg": 8.9,
  "alt": 23.7,
  "prof": 8.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-liquido-baunilha-zero-850g.webp",
  "planos": {
   "supermercado": {
    "giro": 12954,
    "frentes": 2,
    "un": 10,
    "linear": 0.02431
   },
   "hiper_minimo": {
    "giro": 10224,
    "frentes": 1,
    "un": 5,
    "linear": 0.00206
   },
   "hiper_total": {
    "giro": 10224,
    "frentes": 1,
    "un": 5,
    "linear": 0.00206
   },
   "cash": {
    "giro": 10102,
    "frentes": 1,
    "un": 5,
    "linear": 0.00907
   }
  },
  "giroRef": 10876,
  "id": "d64"
 },
 {
  "ean": "7891000305812",
  "nomeBase": "MOLICO Iogurte Liq Morango 24x170g BR",
  "nome": "Molico Iogurte Líquido Morango 24x170g",
  "marca": "Molico",
  "cat": "BENEFÍCIOS",
  "margem": 2.93,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-liquido-morango-zero-170g.webp",
  "planos": {
   "supermercado": {
    "giro": 16030,
    "frentes": 2,
    "un": 40,
    "linear": 0.01366
   },
   "hiper_minimo": {
    "giro": 9116,
    "frentes": 4,
    "un": 32,
    "linear": 0.00463
   },
   "hiper_total": {
    "giro": 9116,
    "frentes": 4,
    "un": 32,
    "linear": 0.00463
   },
   "cash": {
    "giro": 8168,
    "frentes": 2,
    "un": 20,
    "linear": 0.0102
   }
  },
  "giroRef": 10608,
  "id": "d65"
 },
 {
  "ean": "7891000260609",
  "nomeBase": "NESTON Iogurte Liq Mc Bna 24x170g BR",
  "nome": "Neston Iogurte Líquido Maçã e Banana 24x170g",
  "marca": "Neston",
  "cat": "INFANTIL",
  "margem": 4.64,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-liquido-neston-maca-e-banana-170g.webp",
  "planos": {
   "hiper_total": {
    "giro": 10094,
    "frentes": 1,
    "un": 10,
    "linear": 0.00116
   }
  },
  "giroRef": 10094,
  "id": "d66"
 },
 {
  "ean": "7891000332221",
  "nomeBase": "MOLICO Iogurte Liq Baunilha 12x850g BR",
  "nome": "Molico Iogurte Líquido Baunilha 12x850g",
  "marca": "Molico",
  "cat": "BENEFÍCIOS",
  "margem": 1.62,
  "larg": 8.9,
  "alt": 23.7,
  "prof": 8.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-liquido-baunilha-zero-850g.webp",
  "planos": {
   "hiper_total": {
    "giro": 9346,
    "frentes": 1,
    "un": 5,
    "linear": 0.00206
   }
  },
  "giroRef": 9346,
  "id": "d67"
 },
 {
  "ean": "7891000241417",
  "nomeBase": "NESTLE Iogurte Vit de Fruta 12 x900g BR",
  "nome": "Nestlé Iogurte Vitamina de Frutas 12 x900g",
  "marca": "Nestlé",
  "cat": "LIQUIDO",
  "margem": 2.28,
  "larg": 8.2,
  "alt": 23.7,
  "prof": 8.2,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-vitamina-de-frutas-900g.webp",
  "planos": {
   "hiper_total": {
    "giro": 8979,
    "frentes": 3,
    "un": 18,
    "linear": 0.00569
   }
  },
  "giroRef": 8979,
  "id": "d68"
 },
 {
  "ean": "7898755200065",
  "nomeBase": "CHANDELLE Chantilly Chocolate 90g",
  "nome": "Chandelle Chantilly Chocolate 90g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 3.31,
  "larg": 6.9,
  "alt": 8,
  "prof": 6.5,
  "arquivo": "assets/produtos/iogurtes/chandelle-chantilly-chocolate-90g.webp",
  "planos": {
   "hiper_total": {
    "giro": 8383,
    "frentes": 1,
    "un": 21,
    "linear": 0.0016
   }
  },
  "giroRef": 8383,
  "id": "d69"
 },
 {
  "ean": "7898755200218",
  "nomeBase": "MOLICO IOGURTE LIQ AMEIXA 24X170G BR",
  "nome": "Molico IOGURTE Líquido AMEIXA 24X170G",
  "marca": "Molico",
  "cat": "LIQUIDO",
  "margem": 1.9,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-liquido-baunilha-zero-170g.webp",
  "planos": {
   "supermercado": {
    "giro": 8026,
    "frentes": 1,
    "un": 20,
    "linear": 0.00683
   },
   "hiper_minimo": {
    "giro": 5121,
    "frentes": 4,
    "un": 32,
    "linear": 0.00463
   },
   "hiper_total": {
    "giro": 5121,
    "frentes": 2,
    "un": 16,
    "linear": 0.00231
   },
   "cash": {
    "giro": 5098,
    "frentes": 3,
    "un": 75,
    "linear": 0.01682
   }
  },
  "giroRef": 5842,
  "id": "d70"
 },
 {
  "ean": "7898755200225",
  "nomeBase": "MOLICO IOG POLPA AMEIXA 12X360G BR",
  "nome": "Molico Iogurte POLPA AMEIXA 12X360G",
  "marca": "Molico",
  "cat": "INFANTIL",
  "margem": 1.2,
  "larg": 15,
  "alt": 15,
  "prof": 15,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-polpa-morango-zero-360g.webp",
  "planos": {
   "supermercado": {
    "giro": 6025,
    "frentes": 1,
    "un": 3,
    "linear": 0.02048
   },
   "hiper_total": {
    "giro": 4915,
    "frentes": 1,
    "un": 3,
    "linear": 0.00324
   }
  },
  "giroRef": 5470,
  "id": "d71"
 },
 {
  "ean": "7891000390214",
  "nomeBase": "NESTLE GRGO TrdlPess+Dam comCda24x90gBR",
  "nome": "Nestlé GRGO TrdlPess+Dam comCda24x90gBR",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 30.49,
  "larg": 10.2,
  "alt": 11.0,
  "prof": 9.7,
  "arquivo": "assets/produtos/iogurtes/neos-grego-calda-de-damasco-com-pessego-90g.webp",
  "planos": {
   "hiper_total": {
    "giro": 4797,
    "frentes": 2,
    "un": 20,
    "linear": 0.00472
   }
  },
  "giroRef": 4797,
  "id": "d72"
 },
 {
  "ean": "7898755200027",
  "nomeBase": "CHANDELLE Pudim 15x100g BR",
  "nome": "Chandelle Pudim 15x100g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 0.19,
  "larg": 7.6,
  "alt": 9,
  "prof": 7.6,
  "arquivo": "assets/produtos/iogurtes/chandelle-pudim-15x100g-br.webp",
  "planos": {
   "hiper_total": {
    "giro": 4796,
    "frentes": 2,
    "un": 24,
    "linear": 0.00352
   }
  },
  "giroRef": 4796,
  "id": "d73"
 },
 {
  "ean": "7898755200478",
  "nomeBase": "NESTLE IOG POLPA MORANGO ZERO 6X510G",
  "nome": "Nestlé Iogurte POLPA MORANGO ZERO 6X510G",
  "marca": "Nestlé",
  "cat": "BENEFÍCIOS",
  "margem": 1.06,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-polpa-morango-510g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 1776,
    "frentes": 6,
    "un": 18,
    "linear": 0.02623
   },
   "hiper_total": {
    "giro": 1776,
    "frentes": 2,
    "un": 6,
    "linear": 0.00874
   },
   "cash": {
    "giro": 8260,
    "frentes": 1,
    "un": 3,
    "linear": 0.01927
   }
  },
  "giroRef": 3937,
  "id": "d74"
 },
 {
  "ean": "7898755200126",
  "nomeBase": "CHANDELLE Flan Caramelo 20x200g BR",
  "nome": "Chandelle Flan Caramelo 20x200g",
  "marca": "Chandelle",
  "cat": "INFANTIL",
  "margem": 1.36,
  "larg": 13,
  "alt": 12,
  "prof": 6.4,
  "arquivo": "assets/produtos/iogurtes/chandelle-flan-caramelo-20x200g-br.webp",
  "planos": {
   "supermercado": {
    "giro": 5270,
    "frentes": 1,
    "un": 14,
    "linear": 0.01775
   },
   "hiper_minimo": {
    "giro": 4244,
    "frentes": 5,
    "un": 90,
    "linear": 0.01446
   },
   "hiper_total": {
    "giro": 4244,
    "frentes": 2,
    "un": 36,
    "linear": 0.00578
   },
   "cash": {
    "giro": 1519,
    "frentes": 2,
    "un": 36,
    "linear": 0.02549
   }
  },
  "giroRef": 3819,
  "id": "d75"
 },
 {
  "ean": "7891000334188",
  "nomeBase": "MOLICO_BANDEJA_PROBIÓTICO_MORANGO",
  "nome": "Molico BANDEJA PROBIÓTICO MORANGO",
  "marca": "Molico",
  "cat": "BENEFÍCIOS",
  "margem": 1.75,
  "larg": 14,
  "alt": 14,
  "prof": 14,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-polpa-morango-zero-360g.webp",
  "planos": {
   "hiper_total": {
    "giro": 3762,
    "frentes": 1,
    "un": 3,
    "linear": 0.00324
   }
  },
  "giroRef": 3762,
  "id": "d76"
 },
 {
  "ean": "7891000332269",
  "nomeBase": "MOLICO Iogurte Liq Baunilha 24x170g BR",
  "nome": "Molico Iogurte Líquido Baunilha 24x170g",
  "marca": "Molico",
  "cat": "BENEFÍCIOS",
  "margem": 2.48,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-liquido-baunilha-zero-170g.webp",
  "planos": {
   "hiper_total": {
    "giro": 3595,
    "frentes": 2,
    "un": 20,
    "linear": 0.00231
   }
  },
  "giroRef": 3595,
  "id": "d77"
 },
 {
  "ean": "7898755200188",
  "nomeBase": "CHANDELLE_FESTA_BRIGADEIRO",
  "nome": "Chandelle FESTA BRIGADEIRO",
  "marca": "Chandelle",
  "cat": "BENEFÍCIOS",
  "margem": 1.02,
  "larg": 7.6,
  "alt": 9,
  "prof": 7.6,
  "arquivo": "assets/produtos/iogurtes/chandelle-festa-brigadeiro.webp",
  "planos": {
   "hiper_total": {
    "giro": 3394,
    "frentes": 2,
    "un": 24,
    "linear": 0.00352
   }
  },
  "giroRef": 3394,
  "id": "d78"
 },
 {
  "ean": "7891000382387",
  "nomeBase": "NESTLE GREGO Trdl e Coco Calda 24x90g BR",
  "nome": "Nestlé GREGO Trdl e Coco Calda 24x90g",
  "marca": "Nestlé",
  "cat": "GREGO",
  "margem": 103.83,
  "larg": 10.2,
  "alt": 11.0,
  "prof": 9.6,
  "arquivo": "assets/produtos/iogurtes/neos-grego-calda-de-coco-90g.webp",
  "planos": {
   "hiper_total": {
    "giro": 3299,
    "frentes": 1,
    "un": 10,
    "linear": 0.00236
   }
  },
  "giroRef": 3299,
  "id": "d79"
 },
 {
  "ean": "7898755200515",
  "nomeBase": "NESTLE_ZERO_MORANGO_AMEIXA_510",
  "nome": "Nestlé ZERO MORANGO AMEIXA 510",
  "marca": "Nestlé",
  "cat": "BENEFÍCIOS",
  "margem": 1.2,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-polpa-morango-510g.webp",
  "planos": {
   "supermercado": {
    "giro": 4420,
    "frentes": 1,
    "un": 3,
    "linear": 0.02581
   },
   "hiper_total": {
    "giro": 1526,
    "frentes": 1,
    "un": 3,
    "linear": 0.00437
   }
  },
  "giroRef": 2973,
  "id": "d80"
 },
 {
  "ean": "7898755200492",
  "nomeBase": "NESTLE_GARRAFINHA_AMEIXA_170",
  "nome": "Nestlé GARRAFINHA AMEIXA 170",
  "marca": "Nestlé",
  "cat": "BENEFÍCIOS",
  "margem": 1.47,
  "larg": 5,
  "alt": 12.3,
  "prof": 5,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-morango-170g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 975,
    "frentes": 4,
    "un": 32,
    "linear": 0.00463
   },
   "hiper_total": {
    "giro": 975,
    "frentes": 4,
    "un": 32,
    "linear": 0.00463
   }
  },
  "giroRef": 975,
  "id": "d81"
 },
 {
  "ean": "7898755200676",
  "nomeBase": "CHANDELLE_FESTA_BEIJINHO",
  "nome": "Chandelle FESTA BEIJINHO",
  "marca": "Chandelle",
  "cat": "BENEFÍCIOS",
  "margem": 0.31,
  "larg": 7.6,
  "alt": 9,
  "prof": 7.6,
  "arquivo": "assets/produtos/iogurtes/chandelle-festa-beijinho.webp",
  "planos": {
   "hiper_total": {
    "giro": 266,
    "frentes": 2,
    "un": 24,
    "linear": 0.00352
   }
  },
  "giroRef": 266,
  "id": "d82"
 },
 {
  "ean": "7898755200430",
  "nomeBase": "NESTLE Iogurte Vit de Fruta 12x1150g BR",
  "nome": "Nestlé Iogurte Vitamina de Frutas 12x1150g",
  "marca": "Nestlé",
  "cat": "LIQUIDO",
  "margem": 1.1,
  "larg": 9.9,
  "alt": 23.7,
  "prof": 9.9,
  "arquivo": "assets/produtos/iogurtes/iogurte-nestle-vitamina-de-frutas-900g.webp",
  "planos": {
   "hiper_minimo": {
    "giro": 0,
    "frentes": 6,
    "un": 30,
    "linear": 0.01374
   },
   "hiper_total": {
    "giro": 0,
    "frentes": 2,
    "un": 10,
    "linear": 0.00458
   },
   "cash": {
    "giro": 0,
    "frentes": 2,
    "un": 10,
    "linear": 0.02019
   }
  },
  "giroRef": 0,
  "id": "d83"
 },
 {
  "ean": "7898755200751",
  "nomeBase": "Chandelle Feste Morango 90g",
  "nome": "Chandelle Feste Morango 90g",
  "marca": "Chandelle",
  "cat": "SOBREMESA",
  "margem": 0,
  "larg": 7.6,
  "alt": 9,
  "prof": 7.6,
  "arquivo": "assets/produtos/iogurtes/chandelle-feste-morango-90g.webp",
  "planos": {
   "hiper_total": {
    "giro": 0,
    "frentes": 2,
    "un": 24,
    "linear": 0.00352
   }
  },
  "giroRef": 0,
  "id": "d84"
 },
 {
  "ean": "7898755200713",
  "nomeBase": "MOLICO_BANDEIJA_MORANGO_540G",
  "nome": "Molico BANDEIJA MORANGO 540G",
  "marca": "Molico",
  "cat": "BENEFÍCIOS",
  "margem": 0,
  "larg": 18.9,
  "alt": 15.5,
  "prof": 12.6,
  "arquivo": "assets/produtos/iogurtes/iogurte-molico-polpa-morango-zero-360g.webp",
  "planos": {
   "hiper_total": {
    "giro": 0,
    "frentes": 1,
    "un": 3,
    "linear": 0.00437
   }
  },
  "giroRef": 0,
  "id": "d85"
 }
];

window.PLANOS = {
 "supermercado": {
  "gondolaCm": 732.3,
  "skusPlano": [
   "d00",
   "d01",
   "d02",
   "d03",
   "d05",
   "d06",
   "d07",
   "d08",
   "d09",
   "d11",
   "d12",
   "d13",
   "d15",
   "d17",
   "d18",
   "d19",
   "d20",
   "d25",
   "d26",
   "d27",
   "d28",
   "d29",
   "d30",
   "d33",
   "d34",
   "d38",
   "d40",
   "d47",
   "d48",
   "d56",
   "d58",
   "d59",
   "d62",
   "d63",
   "d64",
   "d65",
   "d70",
   "d71",
   "d75",
   "d80"
  ],
  "core": [
   "d00",
   "d01",
   "d02",
   "d05",
   "d03",
   "d06",
   "d08",
   "d07",
   "d12",
   "d13",
   "d11",
   "d09",
   "d19"
  ],
  "linearCore": 0.4558,
  "linearPlano": 1.0,
  "giroTotal": 3694435,
  "giroCore": 2975337
 },
 "hiper_minimo": {
  "gondolaCm": 4323.2,
  "skusPlano": [
   "d00",
   "d01",
   "d02",
   "d03",
   "d04",
   "d05",
   "d06",
   "d07",
   "d08",
   "d09",
   "d11",
   "d12",
   "d13",
   "d14",
   "d15",
   "d16",
   "d17",
   "d18",
   "d19",
   "d20",
   "d22",
   "d23",
   "d24",
   "d25",
   "d26",
   "d27",
   "d28",
   "d29",
   "d30",
   "d33",
   "d34",
   "d38",
   "d40",
   "d43",
   "d46",
   "d47",
   "d48",
   "d53",
   "d56",
   "d58",
   "d59",
   "d61",
   "d62",
   "d64",
   "d65",
   "d70",
   "d74",
   "d75",
   "d81",
   "d83"
  ],
  "core": [
   "d00",
   "d01",
   "d02",
   "d03",
   "d04",
   "d05",
   "d06",
   "d07",
   "d09",
   "d08",
   "d16",
   "d12",
   "d11",
   "d13"
  ],
  "linearCore": 0.1679,
  "linearPlano": 0.4972,
  "giroTotal": 4097202,
  "giroCore": 3300539
 },
 "hiper_total": {
  "gondolaCm": 4323.2,
  "skusPlano": [
   "d00",
   "d01",
   "d02",
   "d03",
   "d04",
   "d05",
   "d06",
   "d07",
   "d08",
   "d09",
   "d10",
   "d11",
   "d12",
   "d13",
   "d14",
   "d15",
   "d16",
   "d17",
   "d18",
   "d19",
   "d20",
   "d21",
   "d22",
   "d23",
   "d24",
   "d25",
   "d26",
   "d27",
   "d28",
   "d29",
   "d30",
   "d31",
   "d32",
   "d33",
   "d34",
   "d35",
   "d36",
   "d37",
   "d38",
   "d39",
   "d40",
   "d41",
   "d42",
   "d43",
   "d44",
   "d45",
   "d46",
   "d47",
   "d48",
   "d49",
   "d50",
   "d51",
   "d52",
   "d53",
   "d54",
   "d55",
   "d56",
   "d57",
   "d58",
   "d59",
   "d60",
   "d61",
   "d62",
   "d63",
   "d64",
   "d65",
   "d66",
   "d67",
   "d68",
   "d69",
   "d70",
   "d71",
   "d72",
   "d73",
   "d74",
   "d75",
   "d76",
   "d77",
   "d78",
   "d79",
   "d80",
   "d81",
   "d82",
   "d83",
   "d84",
   "d85"
  ],
  "core": [
   "d00",
   "d01",
   "d02",
   "d03",
   "d04",
   "d05",
   "d06",
   "d07",
   "d09",
   "d08",
   "d10",
   "d16",
   "d12",
   "d11",
   "d13",
   "d21",
   "d15",
   "d14",
   "d18",
   "d20",
   "d17",
   "d19",
   "d22"
  ],
  "linearCore": 0.2025,
  "linearPlano": 0.5029,
  "giroTotal": 4655161,
  "giroCore": 3746866
 },
 "cash": {
  "gondolaCm": 980.9,
  "skusPlano": [
   "d00",
   "d01",
   "d02",
   "d03",
   "d04",
   "d05",
   "d06",
   "d07",
   "d08",
   "d09",
   "d11",
   "d12",
   "d13",
   "d14",
   "d15",
   "d17",
   "d18",
   "d19",
   "d20",
   "d22",
   "d23",
   "d24",
   "d25",
   "d27",
   "d28",
   "d29",
   "d30",
   "d33",
   "d34",
   "d38",
   "d40",
   "d47",
   "d48",
   "d58",
   "d59",
   "d64",
   "d65",
   "d70",
   "d74",
   "d75",
   "d83"
  ],
  "core": [
   "d00",
   "d01",
   "d02",
   "d03",
   "d06",
   "d04",
   "d09",
   "d08",
   "d05",
   "d07",
   "d11",
   "d15",
   "d17",
   "d14"
  ],
  "linearCore": 0.4562,
  "linearPlano": 1.0001,
  "giroTotal": 6055564,
  "giroCore": 4936082
 }
};
