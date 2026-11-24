"""Recorta o logo ORIGINAL do KV (sem redesenhar) e separa do ceu de fundo.

Uso: python3 ferramentas/extrair-logo.py <kv.jpg> <pasta-saida>
Gera logo.png (ESQUADRAO + ACELERA +DPA + divisa), convencao.png e slogan.png,
todos com fundo transparente, a partir dos pixels do proprio KV.
Quando a DPA mandar o logo em vetor ou PNG, basta trocar os arquivos.
"""
import sys
import numpy as np
import cv2
from scipy import ndimage as ndi

kv, out = sys.argv[1], sys.argv[2]
img = cv2.imread(kv)[:, :, ::-1].astype(np.float32)  # RGB
ESC = 4

def extrair(caixa, nome, cores, min_area=260, limpar=False):
    x0, y0, x1, y1 = caixa
    c = img[y0:y1, x0:x1]
    c = cv2.resize(c, None, fx=ESC, fy=ESC, interpolation=cv2.INTER_LANCZOS4)
    c = np.clip(c, 0, 255)
    hsv = cv2.cvtColor(c.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    h, s, v = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255
    semente = np.zeros(c.shape[:2], bool)
    if "branco" in cores: semente |= (v > 0.88) & (s < 0.13)
    if "verde" in cores: semente |= (h > 75) & (h < 125) & (s > 0.40) & (v > 0.50)
    if "laranja" in cores: semente |= (h > 12) & (h < 38) & (s > 0.55) & (v > 0.65)
    # fundo = o ceu, estimado onde nao ha logo
    fora = ~ndi.binary_dilation(semente, iterations=14)
    w = cv2.GaussianBlur(fora.astype(np.float32), (0, 0), 40)
    B = np.stack([cv2.GaussianBlur(c[..., k] * fora, (0, 0), 40) for k in range(3)], -1) / np.maximum(w[..., None], 1e-3)
    F = {"branco": np.array([255, 255, 255.0])}
    for nomec, m in (("verde", (h > 75) & (h < 125) & (s > 0.5) & (v > 0.6)), ("laranja", (h > 12) & (h < 38) & (s > 0.65) & (v > 0.75))):
        if nomec in cores and m.sum() > 50: F[nomec] = np.median(c[m], axis=0)
    melhor_a = np.zeros(c.shape[:2], np.float32); melhor_e = np.full(c.shape[:2], 1e9, np.float32)
    cor = np.zeros_like(c)
    for nomec in cores:
        d = F[nomec][None, None, :] - B
        a = np.clip(((c - B) * d).sum(-1) / np.maximum((d * d).sum(-1), 1e-3), 0, 1)
        e = np.abs(c - (B + a[..., None] * d)).sum(-1)
        troca = e < melhor_e
        melhor_e[troca] = e[troca]; melhor_a[troca] = a[troca]; cor[troca] = F[nomec]
    a = np.clip((melhor_a - 0.38) / (0.80 - 0.38), 0, 1)
    a = a * a * (3 - 2 * a)
    # fica so com as formas grandes (tira nuvens finas e as cruzes do HUD)
    forte = a > 0.6
    rot, n = ndi.label(ndi.binary_dilation(forte, iterations=11))  # acentos ficam junto da letra
    areas = ndi.sum(forte, rot, range(1, n + 1))
    manter = np.isin(rot, 1 + np.where(areas >= min_area)[0])
    a = a * ndi.binary_dilation(manter, iterations=3)
    ys, xs = np.where(a > 0.05)
    y0c, y1c, x0c, x1c = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    a = a[y0c:y1c, x0c:x1c].copy(); cor = cor[y0c:y1c, x0c:x1c].copy()
    if limpar:
        # no KV ha rastros de jato e nuvens atras da asa direita: tira o que nao e logo
        H, W = a.shape; yy, xx = np.mgrid[0:H, 0:W]; fx, fy = xx / W, yy / H
        a[(fx > 0.955) & (fy > 0.32)] = 0
        a[(fx > 0.885) & (fy > 0.415)] = 0
        a[(fx > 0.72) & (fy > 0.60)] = 0
        # perfil vertical da asa esquerda (limpa): barra, vao, faixa, vao...
        perfil = a[:, int(W * 0.19):int(W * 0.21)].mean(1)
        topo = int(np.argmax(perfil > 0.5))
        a[:topo - 1][(fx[:topo - 1] < 0.34) | (fx[:topo - 1] > 0.66)] = 0   # nada acima da barra fora do ESQUADRAO
        a[int(H * 0.178):topo - 1] = 0                                       # cruzes do HUD entre o ESQUADRAO e a barra
        asa = (fx > 0.79) & (fy > 0.16) & (fy < 0.50)
        solido = (perfil > 0.5)[:, None] & asa
        a[asa & ~solido & (fy > topo / H + 0.07)] = 0                         # vaos entre as faixas
        cor[asa & (fy > 0.245) & (fy < 0.485) & (a > 0.3)] = F["verde"]
        r2, n2 = ndi.label(a > 0.3)                                           # pontinhos soltos do ceu
        ar2 = ndi.sum(a > 0.3, r2, range(1, n2 + 1))
        a[ndi.binary_dilation(np.isin(r2, 1 + np.where(ar2 < 150)[0]), iterations=3)] = 0
        ys, xs = np.where(a > 0.05)
        a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; cor = cor[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    rgba = np.dstack([cor, a * 255]).astype(np.uint8)
    cv2.imwrite(f"{out}/{nome}.png", cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    print(nome, rgba.shape[1], "x", rgba.shape[0], {k: [int(x) for x in val] for k, val in F.items()})

extrair((58, 106, 534, 314), "logo", ["branco", "verde", "laranja"], limpar=True)
extrair((110, 52, 480, 100), "convencao", ["branco"], min_area=120)
extrair((150, 314, 440, 348), "slogan", ["branco"], min_area=120)
