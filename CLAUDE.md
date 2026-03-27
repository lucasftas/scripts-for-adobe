# Scripts for Adobe

Scripts JSX para automacao de workflows no Adobe Premiere Pro e After Effects.

## Regras do Projeto

### Gatilho "filé"
Quando o usuario disser **"filé"**, executar automaticamente:
1. Commitar todas as mudanças pendentes com mensagem descritiva
2. Push para o GitHub (origin/main)
3. Criar uma nova **GitHub Release** com:
   - Tag versionada (incrementar patch: v0.1.0 → v0.1.1 → v0.2.0 etc.)
   - Release notes em portugues com bullet points das mudanças

### Estrutura

```
PremierePro/
  LayerTimecodeOrganizer.jsx  # Painel para renomear layers com timecode
  Organizar_6X6.jsx           # Grid 3x2 com gap customizavel (6 clips)
  Organizar_Quadrantes_Por_Camada.jsx  # Grid 2x2 por ordem de layer
  Slides15s.jsx               # Cria sequencia de slides com 15s cada a partir de bin

AfterEffects/
  (scripts futuros)
```

### Stack
- ExtendScript (JSX) — API do Premiere Pro e After Effects
- Sem dependencias externas

### Idioma
- Codigo: ingles (nomes de variaveis, funcoes, commits)
- UI e documentacao: portugues brasileiro
- Release notes: portugues brasileiro
