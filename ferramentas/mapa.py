import json, sys, math
src, out, icodir = sys.argv[1], sys.argv[2], sys.argv[3]
g = json.load(open(src))
UF = {11:"RO",12:"AC",13:"AM",14:"RR",15:"PA",16:"AP",17:"TO",21:"MA",22:"PI",23:"CE",24:"RN",25:"PB",26:"PE",27:"AL",28:"SE",29:"BA",
      31:"MG",32:"ES",33:"RJ",35:"SP",41:"PR",42:"SC",43:"RS",50:"MS",51:"MT",52:"GO",53:"DF"}
NENO = {"RO","AC","AM","RR","PA","AP","TO","MA","PI","CE","RN","PB","PE","AL","SE","BA"}
# projecao simples: x = lon * cos(lat0), y = -lat
lat0 = math.radians(-14)
def proj(lon, lat): return (lon * math.cos(lat0), -lat)
pts = []
feats = []
for f in g["features"]:
    cod = int(f["properties"]["codarea"])
    geom = f["geometry"]
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    rings = []
    for poly in polys:
        ring = [proj(*c[:2]) for c in poly[0]]
        # descarta ilhas minusculas
        xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
        if (max(xs)-min(xs)) * (max(ys)-min(ys)) < 0.02 and len(polys) > 1: continue
        rings.append(ring); pts += ring
    feats.append((UF[cod], rings))
minx = min(p[0] for p in pts); maxx = max(p[0] for p in pts); miny = min(p[1] for p in pts); maxy = max(p[1] for p in pts)
W = 1000.0; k = W / (maxx - minx); H = (maxy - miny) * k
def simp(ring, tol=1.4):
    out = [ring[0]]
    for p in ring[1:]:
        if math.hypot(p[0]-out[-1][0], p[1]-out[-1][1]) >= tol: out.append(p)
    return out
estados = []
for uf, rings in feats:
    d = ""; cx = cy = area = 0
    for ring in rings:
        r = simp([((x-minx)*k, (y-miny)*k) for x, y in ring])
        if len(r) < 3: continue
        d += "M" + "L".join(f"{x:.0f} {y:.0f}" for x, y in r) + "Z"
        a = 0; sx = sy = 0
        for i in range(len(r)):
            x1, y1 = r[i]; x2, y2 = r[(i+1) % len(r)]
            c = x1*y2 - x2*y1; a += c; sx += (x1+x2)*c; sy += (y1+y2)*c
        if abs(a) > abs(area):
            area = a; cx = sx/(3*a); cy = sy/(3*a)
    estados.append({"uf": uf, "r": "NENO" if uf in NENO else "SSCO", "d": d, "x": round(cx), "y": round(cy), "a": round(abs(area)/2)})
estados.sort(key=lambda e: e["uf"])
def caixa(reg):
    xs = []; ys = []
    for e in estados:
        if e["r"] != reg: continue
        for seg in e["d"].replace("Z", "").split("M"):
            for p in seg.split("L"):
                if p.strip():
                    x, y = p.split(); xs.append(float(x)); ys.append(float(y))
    return [round(min(xs)), round(min(ys)), round(max(xs)-min(xs)), round(max(ys)-min(ys))]
mapa = {"w": round(W), "h": round(H), "estados": estados, "caixas": {"SSCO": caixa("SSCO"), "NENO": caixa("NENO")}}
# icones lucide -> so o miolo do svg
import glob, os, re
icones = {}
for f in sorted(glob.glob(icodir + "/*.svg")):
    s = open(f).read()
    m = re.search(r"<svg[^>]*>(.*)</svg>", s, re.S)
    icones[os.path.basename(f)[:-4]] = re.sub(r"\s+", " ", m.group(1)).strip()
open(out, "w").write("/* Mapa: malha de UFs do IBGE (API de malhas, qualidade minima), simplificada. Icones: Lucide 0.460 (licenca ISC). Gerado por ferramentas/mapa.py */\nwindow.MAPA=" + json.dumps(mapa, separators=(",", ":")) + ";\nwindow.ICONES=" + json.dumps(icones, separators=(",", ":"), ensure_ascii=False) + ";\n")
print(mapa["w"], mapa["h"], len(estados), mapa["caixas"], os.path.getsize(out), len(icones))
