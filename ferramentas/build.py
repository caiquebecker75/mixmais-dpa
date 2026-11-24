import json,collections,os,sys
from nomes import N,GRUPOS
rows=json.load(open("base.json"))
IMG=sys.argv[1]; OUT=sys.argv[2]
def fl(x):
    try: return float(x)
    except: return None
skus={}
canais={}
FIL=["SSCO","NENO"]; CAN=["Trad+Pad","1-4 CKS","5-9 CKS","10+ CKS","C&C"]
PORT={"IOGURTE":"iogurtes","QUEIJOS & SPREADS":"galbani"}
for f in FIL:
  for c in CAN:
    blk={}
    for p,pk in PORT.items():
      sel=[r for r in rows if r['FILIAL']==f and r['CANAL']==c and r['PORTFÓLIO']==p and str(r['EAN'] or '').strip()]
      # remove EAN duplicado errado (manteiga 500g com EAN do requeijão)
      sel=[r for r in sel if not (str(r['EAN'])=='7891097108280' and 'Manteiga' in r['ITEM'])]
      seen=set(); s2=[]
      for r in sel:
          e=str(r['EAN']).strip()
          if e in seen: continue
          seen.add(e); s2.append(r)
      sel=s2
      mgs=sorted(fl(r['Margem (R$)']) for r in sel if fl(r['Margem (R$)']) is not None)
      def mr(r):
          m=fl(r['Margem (R$)'])
          if m is None or not mgs: return 0.0
          below=sum(1 for x in mgs if x<m); eq=sum(1 for x in mgs if x==m)
          return round((below+0.5*eq)/len(mgs),3)
      def item(r,fora=0):
          e=str(r['EAN']).strip()
          if e not in skus:
              skus[e]={"n":N.get(e,r['ITEM']),"m":r['MARCA'].title().replace("Neos","Grego").replace("Nestlé","Nestlé"),"s":str(r['SEGMENTO']).title(),"img":os.path.exists(f"{IMG}/{e}.webp")}
          d={"e":e,"i":round((fl(r['IMPORTÂNCIA DPA (categoria)']) or 0)*100,3),"r":mr(r)}
          if fora: d["f"]=1
          return d
      fixos=[];grupos=collections.OrderedDict();fora=[]
      for r in sel:
          st=r['STATUS / OBSERVAÇÃO']; g=r['GRUPO DE ESCOLHA']
          if not r['NO SORTIMENTO (1/0)']: fora.append(r); continue
          if g: grupos.setdefault(g,{"q":int(r['ESCOLHER (qtd)'] or 1),"rows":[]})["rows"].append(r)
          else: fixos.append(r)
      usados=set()
      alvos=[]
      # ordem dos alvos: pela importancia do melhor item
      for g,v in grupos.items():
          its=[item(r) for r in v["rows"]]
          q=min(v["q"],len(its)) if len(its)>v["q"] else v["q"]
          segs={r['SEGMENTO'] for r in v["rows"]}; marcas={r['MARCA'] for r in v["rows"]}
          cand=[r for r in fora if str(r['EAN']) not in usados and r['SEGMENTO'] in segs]
          cand.sort(key=lambda r:(-(r['MARCA'] in marcas), -int(os.path.exists(f"{IMG}/{str(r['EAN']).strip()}.webp")), -(fl(r['IMPORTÂNCIA DPA (categoria)']) or 0)))
          nisca = 2 if len(its)+2<=6 else 6-len(its)
          if len(its)<=q: nisca=max(nisca,2)
          iscas=cand[:max(0,nisca)]
          if len(its)+len(iscas)<=q:
              extra=[r for r in fora if str(r['EAN']) not in usados and r not in iscas]
              extra.sort(key=lambda r:-(fl(r['IMPORTÂNCIA DPA (categoria)']) or 0))
              iscas+=extra[:q+1-len(its)-len(iscas)]
          for r in iscas: usados.add(str(r['EAN']))
          alvos.append({"g":GRUPOS.get(g,g.title()),"q":q,"o":its+[item(r,1) for r in iscas]})
      blk[pk]={"fixos":[item(r) for r in fixos],"alvos":alvos}
    canais[f+"|"+c]=blk
json.dump({"skus":skus,"canais":canais},open(OUT,"w"),ensure_ascii=False,separators=(",",":"))
for k,v in canais.items():
    print(k, {p:(len(b["fixos"]),len(b["alvos"]),sum(a["q"] for a in b["alvos"])) for p,b in v.items()})
print(len(skus),"skus;", sum(1 for s in skus.values() if not s["img"]),"sem img:",[ (e,s["n"]) for e,s in skus.items() if not s["img"]])
