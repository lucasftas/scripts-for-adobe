# Implementations

---

## v0.1.1 — 2026-03-26

- **OrganizarWAVTracks** — Script que escaneia todas as audio tracks, identifica clips WAV (via mediaPath + fallback nome), e redistribui em tracks dedicadas sem sobreposição usando algoritmo greedy bin-packing. Remoção via QE DOM com busca por nome. Gera log detalhado (.log) para diagnóstico.

---

## v0.1.0 — 2026-03-26

- **LayerTimecodeOrganizer** — Painel ExtendScript para renomear layers com timecode no Premiere Pro (v3, com UI resizável)
- **Organizar_6X6** — Grid 3x2 com gap customizável para 6 clips selecionados na timeline
- **Organizar_Quadrantes_Por_Camada** — Grid 2x2 posicionando clips por ordem de layer (track order)
- **Slides15s** — Cria sequência automática de slides com duração de 15s a partir de um Bin selecionado
