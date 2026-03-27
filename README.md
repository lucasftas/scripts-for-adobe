# Scripts for Adobe

Coleção de scripts ExtendScript (JSX) para automação de workflows no Adobe Premiere Pro e After Effects.

## Scripts — Premiere Pro

| Script | Descrição |
|--------|-----------|
| **LayerTimecodeOrganizer.jsx** | Painel com UI para renomear e posicionar layers baseado em timecode. Suporta formatos HH_MM_SS, MM_SS, MM_SS_FF e SS_FF. |
| **GridLayout6X6.jsx** | Organiza até 6 clips selecionados em grid 3x2 com gap customizável (prompt de pixels). |
| **GridLayoutQuadrants.jsx** | Posiciona clips selecionados em grid 2x2 por ordem de layer/track na timeline. |
| **SlideshowFromBin.jsx** | Cria sequência automática a partir de um Bin selecionado, com cada slide durando 15 segundos. |
| **OrganizeWAVTracks.jsx** | Escaneia todas as audio tracks, identifica clips WAV e redistribui em tracks dedicadas sem sobreposição. Gera arquivo `.log` com diagnóstico completo. |

## Como usar

1. Abra o Adobe Premiere Pro
2. Vá em **File > Scripts > Run Script File...** (ou `Ctrl+Shift+F12` no ExtendScript Toolkit)
3. Selecione o script `.jsx` desejado
4. O script executa na sequência/composição ativa

## Estrutura

```
PremierePro/
  LayerTimecodeOrganizer.jsx
  GridLayout6X6.jsx
  GridLayoutQuadrants.jsx
  SlideshowFromBin.jsx
  OrganizeWAVTracks.jsx

AfterEffects/
  (em breve)
```

## Stack

- **ExtendScript (JSX)** — API nativa do Premiere Pro e After Effects
- Sem dependências externas
