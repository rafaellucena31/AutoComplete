# Comparação de vozes

Frase de teste (`frase-teste.txt`): tem palavras com som nasal ("não", "são",
"demissão", "rescisão") e valores em reais por extenso.

| Opção | Situação em 12/10/2026 |
|---|---|
| Piper `pt_BR-faber-medium` (gratuita, local) | Amostras em `amostras/` (velocidade 1.0 e 1.15). Preferida: **1.0**. |
| OpenAI `gpt-4o-mini-tts` com a instrução "Português do Brasil, tom calmo e didático." | **Pendente.** A variável `OPENAI_API_KEY` não existe neste ambiente. |

Vozes da OpenAI a testar: `marin` e `cedar` (recomendadas pela documentação),
`coral`, `sage` e `ash`. Conferido em developers.openai.com em 12/10/2026.

## Como gerar as amostras da OpenAI (sessão com a chave configurada)

```bash
pip install piper-tts playwright        # o Playwright usa o Chromium do sistema
python video/gerar_video.py amostras --motor openai
```

A chave é lida só do ambiente e nunca é gravada em arquivo. Depois de escolher a voz:

```bash
python video/gerar_video.py video --motor openai --voz marin   # ou a voz escolhida
python video/gerar_video.py video --motor piper --voz 1.0      # alternativa gratuita
```

O modelo do Piper fica em `narracao/modelos/` (fora do git). Para baixar:
`https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx`
(e o `.onnx.json` correspondente).
