# Radar Trabalhista

Conteúdo informativo para trabalhadores (demissão em massa e jornada),
dentro dos limites do Provimento 205/2021 do CFOAB. Todo conteúdo jurídico
aqui é **rascunho para revisão** da advogada responsável.

| Caminho | O que é |
|---|---|
| `radar/AAAA-MM-DD.md` / `.json` | Entrega 1: radar diário, com itens, descartados, leis em votação e o que não foi verificado |
| `radar/PROMPT-tarefa-diaria.md` | Instrução usada pela tarefa agendada (dias úteis, 6h52, horário de Brasília) |
| `pagina/index.html` | Entrega 2: página com cinco abas, tema claro e escuro. Abra direto no navegador |
| `pagina/atualizar_dados.py` | Atualiza `radar-hoje.js` e `roteiro.js` a partir do radar mais recente e do roteiro |
| `video/roteiro.json` | Entrega 3: narração em 8 cenas, uma frase por quadro |
| `video/quadro.html` | Modelo visual de cada quadro (1080×1920) |
| `video/gerar_video.py` | Narra, renderiza os quadros com Chromium headless e monta o MP4 com ffmpeg |
| `narracao/` | Comparação de vozes (Piper e OpenAI) |
| `base-legal.md` | Base legal conferida em 12/10/2026, com o que mudou e o que não foi possível confirmar |

## Como gerar o vídeo

```bash
pip install piper-tts playwright
python video/gerar_video.py video --motor piper --voz 1.0
# ou, com OPENAI_API_KEY no ambiente:
python video/gerar_video.py video --motor openai --voz marin
```

Cada frase gera um áudio e um quadro. O segmento dura exatamente o áudio mais
uma pausa (0,35 s; 0,6 s no fim da cena), arredondado para quadros inteiros a
30 fps. Tudo é concatenado pelo ffmpeg (H.264 + AAC). O script também gera um `.srt`.
