#!/usr/bin/env python3
"""Gera o vídeo "Sua jornada, seus direitos" a partir de roteiro.json.

Um áudio e um quadro por frase. Cada segmento dura exatamente o áudio da frase
mais uma pausa, arredondado para um número inteiro de quadros (30 fps), e tudo
é concatenado com ffmpeg. Assim legenda e narração ficam sempre em sincronia.

Uso:
  python gerar_video.py amostras --motor openai            # amostras de vozes da OpenAI
  python gerar_video.py amostras --motor piper
  python gerar_video.py quadros                            # só renderiza os quadros
  python gerar_video.py video --motor piper                # narra, renderiza e monta
  python gerar_video.py video --motor openai --voz marin

Requisitos: ffmpeg, Python com `playwright` (usa o Chromium do sistema) e,
para o Piper, `piper-tts` + o modelo pt_BR-faber-medium. A chave da OpenAI é
lida somente da variável de ambiente OPENAI_API_KEY e nunca é gravada.
"""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import urllib.request
import wave
from pathlib import Path

AQUI = Path(__file__).resolve().parent
BUILD = AQUI / "build"
SAIDA = AQUI / "saida"
FPS = 30
TAXA = 48000

INSTRUCAO_OPENAI = "Português do Brasil, tom calmo e didático."
VOZES_OPENAI = ["marin", "cedar", "coral", "sage", "ash"]
MODELO_OPENAI = "gpt-4o-mini-tts"
PIPER_MODELO = Path(os.environ.get(
    "PIPER_MODELO", AQUI.parent / "narracao" / "modelos" / "pt_BR-faber-medium.onnx"))
FRASE_TESTE = (AQUI.parent / "narracao" / "frase-teste.txt").read_text(encoding="utf-8").strip()


def roteiro():
    return json.loads((AQUI / "roteiro.json").read_text(encoding="utf-8"))


def frases(r):
    """Lista achatada de frases com o estado de cada quadro."""
    nomes = [c["nome"] for c in r["cenas"]]
    out = []
    for c in r["cenas"]:
        for i, f in enumerate(c["frases"]):
            ultima = i == len(c["frases"]) - 1
            out.append({
                "cena": c["id"], "cenas": nomes, "titulo": c["titulo"],
                "base_legal": c["base_legal"], "texto": f["texto"], "visual": f["visual"],
                "pausa": r["pausa_fim_cena"] if ultima else r["pausa_entre_frases"],
            })
    return out


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def para_wav_padrao(origem, destino):
    """Converte qualquer áudio para WAV mono 48 kHz 16 bits."""
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(origem),
         "-ac", "1", "-ar", str(TAXA), "-sample_fmt", "s16", str(destino)])


# ---------- motores de voz ----------

def tts_piper(texto, destino, velocidade=1.0):
    tmp = destino.with_suffix(".piper.wav")
    piper = shutil.which("piper") or str(Path(sys.executable).parent / "piper")
    subprocess.run([piper, "-m", str(PIPER_MODELO), "-f", str(tmp), "--length-scale", str(velocidade)],
                   input=texto.encode(), check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    para_wav_padrao(tmp, destino)
    tmp.unlink()


def tts_openai(texto, destino, voz):
    chave = os.environ.get("OPENAI_API_KEY")
    if not chave:
        sys.exit("OPENAI_API_KEY não está definida no ambiente.")
    corpo = json.dumps({"model": MODELO_OPENAI, "voice": voz, "input": texto,
                        "instructions": INSTRUCAO_OPENAI, "response_format": "wav"}).encode()
    req = urllib.request.Request("https://api.openai.com/v1/audio/speech", data=corpo, headers={
        "Authorization": f"Bearer {chave}", "Content-Type": "application/json"})
    tmp = destino.with_suffix(".openai.wav")
    with urllib.request.urlopen(req, timeout=120) as resp:
        tmp.write_bytes(resp.read())
    para_wav_padrao(tmp, destino)
    tmp.unlink()


def falar(motor, voz, texto, destino):
    if motor == "piper":
        tts_piper(texto, destino, float(voz or 1.0))
    else:
        tts_openai(texto, destino, voz)


def duracao_wav(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


# ---------- etapas ----------

def amostras(motor):
    pasta = AQUI.parent / "narracao" / "amostras"
    pasta.mkdir(parents=True, exist_ok=True)
    vozes = VOZES_OPENAI if motor == "openai" else ["1.0", "1.15"]
    for voz in vozes:
        wav = BUILD / f"amostra-{motor}-{voz}.wav"
        wav.parent.mkdir(parents=True, exist_ok=True)
        falar(motor, voz, FRASE_TESTE, wav)
        nome = f"openai-{voz}.mp3" if motor == "openai" else f"piper-faber-velocidade-{voz}.mp3"
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "128k", str(pasta / nome)])
        print("amostra:", pasta / nome)


def narrar(motor, voz, lista):
    pasta = BUILD / "audio" / f"{motor}-{voz}"
    pasta.mkdir(parents=True, exist_ok=True)
    arquivos = []
    for i, f in enumerate(lista):
        h = hashlib.sha1(f["texto"].encode()).hexdigest()[:10]
        wav = pasta / f"{i:02d}-{h}.wav"
        if not wav.exists():
            falar(motor, voz, f["texto"], wav)
        arquivos.append(wav)
        print(f"áudio {i + 1}/{len(lista)}  {duracao_wav(wav):5.2f}s  {f['texto']}")
    return arquivos


def quadros(lista):
    from playwright.sync_api import sync_playwright
    pasta = BUILD / "quadros"
    pasta.mkdir(parents=True, exist_ok=True)
    problemas = []
    exe = os.environ.get("CHROMIUM") or next(
        (str(p) for p in Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome")), None)
    with sync_playwright() as pw:
        nav = pw.chromium.launch(executable_path=exe) if exe else pw.chromium.launch()
        pag = nav.new_page(viewport={"width": 1080, "height": 1920})
        pag.goto((AQUI / "quadro.html").as_uri())
        pag.evaluate("document.fonts.ready")
        saida = []
        for i, f in enumerate(lista):
            over = pag.evaluate("st => render(st)", f)
            pag.evaluate("document.fonts.ready")
            png = pasta / f"{i:02d}.png"
            pag.screenshot(path=str(png))
            saida.append(png)
            if over:
                problemas.append((i, over, f["texto"]))
        nav.close()
    for p in problemas:
        print("TRANSBORDA:", p)
    print(f"{len(saida)} quadros em {pasta}")
    return saida


def montar(lista, audios, pngs, nome):
    """Áudio: concatena cada WAV + silêncio, amostra a amostra.
    Vídeo: concat de imagens com a duração exata de cada segmento."""
    BUILD.mkdir(exist_ok=True)
    SAIDA.mkdir(exist_ok=True)
    trilha = BUILD / "trilha.wav"
    linhas = ["ffconcat version 1.0"]
    legendas, t = [], 0.0
    with wave.open(str(trilha), "wb") as out:
        out.setnchannels(1); out.setsampwidth(2); out.setframerate(TAXA)
        for f, wav, png in zip(lista, audios, pngs):
            with wave.open(str(wav)) as w:
                dados = w.readframes(w.getnframes())
                n = w.getnframes()
            quadros_seg = -(-int((n / TAXA + f["pausa"]) * FPS * 1000) // 1000)  # arredonda p/ cima
            total = round(quadros_seg * TAXA / FPS)
            out.writeframes(dados + b"\x00\x00" * (total - n))
            dur = quadros_seg / FPS
            linhas += [f"file '{png}'", f"duration {dur:.6f}"]
            legendas.append((t, t + n / TAXA, f["texto"]))
            t += dur
    linhas.append(f"file '{pngs[-1]}'")  # o demuxer exige repetir o último
    lista_txt = BUILD / "quadros.ffconcat"
    lista_txt.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    mp4 = SAIDA / f"{nome}.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-safe", "0", "-f", "concat", "-i", str(lista_txt),
         "-i", str(trilha), "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-preset", "medium",
         "-crf", "20", "-tune", "stillimage", "-c:a", "aac", "-b:a", "160k", "-ar", str(TAXA),
         "-movflags", "+faststart", "-shortest", str(mp4)])
    srt = SAIDA / f"{nome}.srt"
    def ts(x):
        ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    srt.write_text("".join(f"{i}\n{ts(a)} --> {ts(b)}\n{tx}\n\n" for i, (a, b, tx) in enumerate(legendas, 1)),
                   encoding="utf-8")
    print(f"vídeo: {mp4}  ({t:.1f}s)\nlegendas: {srt}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("etapa", choices=["amostras", "quadros", "video"])
    ap.add_argument("--motor", choices=["piper", "openai"], default="piper")
    ap.add_argument("--voz", help="voz da OpenAI (ex.: marin) ou velocidade do Piper (ex.: 1.0)")
    ap.add_argument("--nome", default="sua-jornada-seus-direitos")
    a = ap.parse_args()
    if a.etapa == "amostras":
        return amostras(a.motor)
    lista = frases(roteiro())
    if a.etapa == "quadros":
        return quadros(lista)
    voz = a.voz or ("1.0" if a.motor == "piper" else "marin")
    audios = narrar(a.motor, voz, lista)
    pngs = quadros(lista)
    montar(lista, audios, pngs, a.nome)


if __name__ == "__main__":
    main()
