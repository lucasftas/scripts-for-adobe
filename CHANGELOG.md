# Changelog

---

### 2026-03-26 — v0.2.0 — Padronização e README

#### Changed
- Renomeados scripts para PascalCase em inglês: GridLayout6X6, GridLayoutQuadrants, SlideshowFromBin, OrganizeWAVTracks
- Atualizado CLAUDE.md com nomes novos

#### Added
- README.md com tabela de scripts, instruções de uso e estrutura do projeto
- .gitignore para excluir arquivos .log

---

### 2026-03-26 — v0.1.1 — Organizador de WAV Tracks

#### Added
- OrganizarWAVTracks.jsx — identifica WAVs na timeline e move para tracks dedicadas sem overlap
- Detecção WAV dupla: mediaPath (primário) + nome do clip (fallback)
- Algoritmo greedy bin-packing para número mínimo de tracks
- Geração de .log com diagnóstico completo de cada operação
- 3 métodos de criação de tracks (QE addTracks, individual, reuso de tracks vazias)
- Remoção via QE DOM com busca por nome (resolve mismatch de índices QE vs ExtendScript)

---

### 2026-03-26 — v0.1.0 — Release inicial

#### Added
- LayerTimecodeOrganizer.jsx — painel para renomear layers com timecode
- Organizar_6X6.jsx — grid 3x2 com gap customizável
- Organizar_Quadrantes_Por_Camada.jsx — grid 2x2 por ordem de layer
- Slides15s.jsx — criação de sequência de slides 15s a partir de bin
- CLAUDE.md com gatilho "filé" e estrutura do projeto
