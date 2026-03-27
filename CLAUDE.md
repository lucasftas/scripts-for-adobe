# Scripts for Adobe

Scripts JSX para automacao de workflows no Adobe Premiere Pro e After Effects.

## Regras do Projeto

### Gatilho "filé"
Quando o usuario disser **"filé"**, executar automaticamente:

1. `git add -A` — adicionar todas as alterações
2. `git commit` — com mensagem descritiva baseada nas mudanças feitas
3. `git push` — enviar para o remote (origin/main)
4. Criar uma nova **GitHub Release** com:
   - Verificar a última tag com `git tag --sort=-v:refname | head -1`
   - Se não houver tags, começar em `v0.1.0`
   - Caso contrário, incrementar o patch (ex: v0.1.0 → v0.1.1)
   - Criar a release: `gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes`
5. Atualizar o arquivo `IMPLEMENTATIONS.md`:
   - Se não existir, criar com o cabeçalho `# Implementations`
   - Adicionar entrada com versão, data e resumo do que foi implementado/alterado
   - Agrupar por versão, mais recentes no topo
6. Atualizar o arquivo `CHANGELOG.md`:
   - Se não existir, criar com o cabeçalho `# Changelog`
   - Seguir formato [Keep a Changelog](https://keepachangelog.com/)
   - Categorizar em: `Added`, `Changed`, `Fixed`, `Removed` (conforme aplicável)
   - Versões mais recentes no topo
7. Atualizar o arquivo `OPERATIONS.md`:
   - Se não existir, criar com o cabeçalho `# Operations Log`
   - Registrar todas as operações, verificações e solicitações feitas na sessão
   - Agrupar por data, com categorias descritivas
   - Usar checkboxes `[x]` para cada item realizado
8. Fazer um novo commit e push com os arquivos `.md` atualizados

### Estrutura

```
PremierePro/
  LayerTimecodeOrganizer.jsx  # Painel para renomear layers com timecode
  GridLayout6X6.jsx           # Grid 3x2 com gap customizavel (6 clips)
  GridLayoutQuadrants.jsx     # Grid 2x2 por ordem de layer
  SlideshowFromBin.jsx        # Cria sequencia de slides com 15s cada a partir de bin
  OrganizeWAVTracks.jsx       # Move WAVs para tracks dedicadas sem overlap (gera .log)

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
