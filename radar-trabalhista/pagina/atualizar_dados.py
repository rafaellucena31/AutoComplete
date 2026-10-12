#!/usr/bin/env python3
"""Gera os arquivos de dados da página a partir do radar mais recente e do roteiro do vídeo.

  radar/AAAA-MM-DD.json  ->  pagina/radar-hoje.js   (window.RADAR)
  video/roteiro.json     ->  pagina/roteiro.js      (window.ROTEIRO)

Os dados vão em .js (e não .json) para a página funcionar aberta direto do disco.
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PAGINA = RAIZ / "pagina"


def escrever(nome, var, dados):
    js = f"window.{var} = {json.dumps(dados, ensure_ascii=False, indent=1)};\n"
    (PAGINA / nome).write_text(js, encoding="utf-8")
    print("gravado:", PAGINA / nome)


def main():
    radares = sorted((RAIZ / "radar").glob("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].json"))
    if radares:
        escrever("radar-hoje.js", "RADAR", json.loads(radares[-1].read_text(encoding="utf-8")))
    escrever("roteiro.js", "ROTEIRO", json.loads((RAIZ / "video" / "roteiro.json").read_text(encoding="utf-8")))


if __name__ == "__main__":
    main()
