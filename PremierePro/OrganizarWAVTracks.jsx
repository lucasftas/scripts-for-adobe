app.enableQE();

var seq = app.project.activeSequence;
if (!seq) {
    alert("Nenhuma sequencia ativa encontrada.");
} else {
    (function () {
        // === LOG SETUP ===
        var logLines = [];
        var scriptFile = new File($.fileName);
        var logFile = new File(scriptFile.path + "/OrganizarWAVTracks.log");

        function log(msg) {
            var now = new Date();
            var ts = now.getFullYear() + "-" +
                ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
                ("0" + now.getDate()).slice(-2) + " " +
                ("0" + now.getHours()).slice(-2) + ":" +
                ("0" + now.getMinutes()).slice(-2) + ":" +
                ("0" + now.getSeconds()).slice(-2);
            logLines.push("[" + ts + "] " + msg);
        }

        function writeLog() {
            try {
                logFile.open("w");
                logFile.encoding = "UTF-8";
                logFile.write(logLines.join("\n"));
                logFile.close();
            } catch (e) {}
        }

        log("=== OrganizarWAVTracks iniciado ===");
        log("Sequencia: " + seq.name);
        log("Audio tracks existentes: " + seq.audioTracks.numTracks);

        // === PHASE 1: SCAN ALL AUDIO TRACKS ===
        var wavClips = [];
        var audioTracks = seq.audioTracks;
        var totalClips = 0;

        for (var i = 0; i < audioTracks.numTracks; i++) {
            var track = audioTracks[i];
            var clipCount = track.clips.numItems;
            log("Track " + i + " (" + track.name + "): " + clipCount + " clips");

            for (var j = 0; j < clipCount; j++) {
                totalClips++;
                var clip = track.clips[j];
                var isWav = false;
                var detectedBy = "";
                var mediaPath = "";

                // Try mediaPath first
                try {
                    mediaPath = clip.projectItem.getMediaPath();
                    if (mediaPath && /\.wav$/i.test(mediaPath)) {
                        isWav = true;
                        detectedBy = "mediaPath";
                    }
                } catch (e) {
                    log("  Clip " + j + " (" + clip.name + "): getMediaPath() falhou: " + e.message);
                }

                // Fallback to clip name
                if (!isWav) {
                    try {
                        if (clip.name && /\.wav$/i.test(clip.name)) {
                            isWav = true;
                            detectedBy = "clipName";
                        }
                    } catch (e) {
                        log("  Clip " + j + ": erro ao ler nome: " + e.message);
                    }
                }

                if (isWav) {
                    var startSec = clip.start.seconds;
                    var endSec = clip.end.seconds;
                    log("  [WAV] Clip " + j + ": \"" + clip.name + "\" | " + startSec.toFixed(3) + "s - " + endSec.toFixed(3) + "s | via " + detectedBy);
                    if (mediaPath) log("         path: " + mediaPath);

                    wavClips.push({
                        projectItem: clip.projectItem,
                        startSeconds: startSec,
                        endSeconds: endSec,
                        sourceTrack: i,
                        sourceClip: j,
                        name: clip.name,
                        assignedTrack: -1
                    });
                } else {
                    log("  [---] Clip " + j + ": \"" + clip.name + "\" | nao e WAV");
                }
            }
        }

        log("Total clips escaneados: " + totalClips);
        log("Total WAVs encontrados: " + wavClips.length);

        if (wavClips.length === 0) {
            log("Nenhum WAV encontrado. Abortando.");
            writeLog();
            alert("Nenhum clip WAV encontrado na timeline.\nLog salvo em: " + logFile.fsName);
            return;
        }

        // === PHASE 2: ASSIGN TRACKS (greedy bin-packing) ===
        wavClips.sort(function (a, b) { return a.startSeconds - b.startSeconds; });

        var trackEnds = [];
        for (var w = 0; w < wavClips.length; w++) {
            var placed = false;
            for (var t = 0; t < trackEnds.length; t++) {
                if (wavClips[w].startSeconds >= trackEnds[t]) {
                    wavClips[w].assignedTrack = t;
                    trackEnds[t] = wavClips[w].endSeconds;
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                wavClips[w].assignedTrack = trackEnds.length;
                trackEnds.push(wavClips[w].endSeconds);
            }
            log("Assign: \"" + wavClips[w].name + "\" -> nova track " + wavClips[w].assignedTrack);
        }

        var numNewTracks = trackEnds.length;
        log("Tracks necessarias: " + numNewTracks);

        // === PHASE 3: CREATE EMPTY TRACKS FIRST ===
        var baseIndex = audioTracks.numTracks;
        log("Base index para novas tracks: " + baseIndex);

        // Try multiple methods to add audio tracks
        var tracksCreated = false;

        // Diagnosticar QE DOM
        try {
            var qeSeqDiag = qe.project.getActiveSequence();
            log("QE sequence name: " + qeSeqDiag.name);
            log("QE numAudioTracks: " + qeSeqDiag.numAudioTracks);
            // List QE methods
            var qeMethods = [];
            for (var prop in qeSeqDiag) {
                qeMethods.push(prop);
            }
            log("QE sequence properties: " + qeMethods.join(", "));
        } catch (e) {
            log("QE diagnostico falhou: " + e.message);
        }

        // Method 1: QE DOM addTracks(videoNum, audioNum, submixNum)
        if (!tracksCreated) {
            try {
                var qeSeq = qe.project.getActiveSequence();
                log("Tentativa 1: qeSeq.addTracks(0, " + numNewTracks + ", 0)");
                qeSeq.addTracks(0, numNewTracks, 0);
                // Re-check after a moment
                var count1 = seq.audioTracks.numTracks;
                log("  Count apos addTracks: " + count1);
                if (count1 >= baseIndex + numNewTracks) {
                    tracksCreated = true;
                    log("  OK via QE addTracks");
                } else {
                    log("  Falhou: count ainda " + count1);
                }
            } catch (e) {
                log("  Erro QE addTracks: " + e.message);
            }
        }

        // Method 2: Add tracks one by one via QE
        if (!tracksCreated) {
            try {
                log("Tentativa 2: addTracks individual x" + numNewTracks);
                for (var nt = 0; nt < numNewTracks; nt++) {
                    var qeSeqLoop = qe.project.getActiveSequence();
                    qeSeqLoop.addTracks(0, 1, 0);
                    log("  Iteracao " + nt + ": count=" + seq.audioTracks.numTracks);
                }
                if (seq.audioTracks.numTracks >= baseIndex + numNewTracks) {
                    tracksCreated = true;
                    log("  OK via QE addTracks individual");
                } else {
                    log("  Falhou: count ainda " + seq.audioTracks.numTracks);
                }
            } catch (e) {
                log("  Erro QE addTracks individual: " + e.message);
            }
        }

        // Method 3: Use existing empty tracks if available
        if (!tracksCreated) {
            log("Tentativa 3: procurando tracks vazias existentes");
            var emptyTracks = [];
            for (var et = 0; et < seq.audioTracks.numTracks; et++) {
                if (seq.audioTracks[et].clips.numItems === 0) {
                    emptyTracks.push(et);
                    log("  Track " + et + " (" + seq.audioTracks[et].name + ") esta vazia");
                }
            }
            if (emptyTracks.length >= numNewTracks) {
                // Remap: use existing empty tracks instead of creating new ones
                baseIndex = -1; // flag: using existing empty tracks
                for (var remap = 0; remap < wavClips.length; remap++) {
                    wavClips[remap].destTrackIndex = emptyTracks[wavClips[remap].assignedTrack];
                }
                tracksCreated = true;
                log("  OK: usando " + numNewTracks + " tracks vazias existentes");
            } else {
                log("  Apenas " + emptyTracks.length + " tracks vazias, precisa de " + numNewTracks);
            }
        }

        if (!tracksCreated) {
            log("TODAS as tentativas de criar tracks falharam.");
            log("Por favor adicione " + numNewTracks + " audio tracks manualmente e rode o script novamente.");
            writeLog();
            alert("Nao foi possivel criar audio tracks automaticamente.\nAdicione " + numNewTracks + " audio tracks manualmente e rode novamente.\n\nLog: " + logFile.fsName);
            return;
        }

        var newTrackCount = seq.audioTracks.numTracks;
        log("Audio tracks apos criacao: " + newTrackCount + " (base: " + baseIndex + ", novas: " + numNewTracks + ")");

        // === PHASE 4: MOVE CLIPS ===
        // Premiere Pro undo: each insertClip/remove is automatically undoable
        // Multiple Ctrl+Z steps will undo each action
        log("Iniciando movimentacao de clips");

        // Phase 4a: Insert clips into new tracks
        var insertOk = 0;
        var insertErrors = 0;

        for (var w = 0; w < wavClips.length; w++) {
            var wc = wavClips[w];
            var destIdx = (wc.destTrackIndex !== undefined) ? wc.destTrackIndex : baseIndex + wc.assignedTrack;

            try {
                var destTrack = seq.audioTracks[destIdx];
                log("Inserindo \"" + wc.name + "\" na track " + destIdx + " em " + wc.startSeconds.toFixed(3) + "s");

                destTrack.insertClip(wc.projectItem, wc.startSeconds);

                // Adjust duration to match original
                var adjusted = false;
                for (var c = 0; c < destTrack.clips.numItems; c++) {
                    var inserted = destTrack.clips[c];
                    if (Math.abs(inserted.start.seconds - wc.startSeconds) < 0.05) {
                        var newEnd = new Time();
                        newEnd.seconds = wc.endSeconds;
                        inserted.end = newEnd;
                        adjusted = true;
                        log("  Duracao ajustada: end=" + wc.endSeconds.toFixed(3) + "s");
                        break;
                    }
                }
                if (!adjusted) {
                    log("  AVISO: nao encontrou clip inserido para ajustar duracao");
                }
                insertOk++;
            } catch (e) {
                insertErrors++;
                log("  ERRO ao inserir \"" + wc.name + "\": " + e.message);
            }
        }

        log("Insercoes: " + insertOk + " ok, " + insertErrors + " erros");

        // Phase 4b: Remove originals via QE DOM
        // QE indices don't match ExtendScript indices (QE includes gaps/transitions)
        // So we search by name match instead of using stored indices
        var byTrack = {};
        for (var w = 0; w < wavClips.length; w++) {
            var st = wavClips[w].sourceTrack;
            if (!byTrack[st]) byTrack[st] = [];
            byTrack[st].push({ name: wavClips[w].name, startSeconds: wavClips[w].startSeconds });
        }

        var removeOk = 0;
        var removeErrors = 0;

        for (var trackIdx in byTrack) {
            if (!byTrack.hasOwnProperty(trackIdx)) continue;

            var ti = parseInt(trackIdx, 10);
            var clipsToRemove = byTrack[ti];
            log("Removendo " + clipsToRemove.length + " clips da track original " + ti);

            // Remove one clip at a time, re-scanning QE track after each removal
            for (var r = 0; r < clipsToRemove.length; r++) {
                var targetName = clipsToRemove[r].name;
                var targetStart = clipsToRemove[r].startSeconds;
                var found = false;

                try {
                    var qeSeqR = qe.project.getActiveSequence();
                    var qeTrack = qeSeqR.getAudioTrackAt(ti);
                    var numQEItems = qeTrack.numItems;
                    log("  Buscando \"" + targetName + "\" em " + numQEItems + " QE items");

                    for (var qi = 0; qi < numQEItems; qi++) {
                        try {
                            var qeItem = qeTrack.getItemAt(qi);
                            var qeName = qeItem.name;

                            if (qeName === targetName) {
                                qeItem.remove();
                                removeOk++;
                                found = true;
                                log("  Removido QE item " + qi + " (\"" + targetName + "\")");
                                break;
                            }
                        } catch (eqi) {
                            // QE item might be a gap/transition, skip
                        }
                    }
                } catch (e3) {
                    log("  ERRO ao acessar QE track " + ti + ": " + e3.message);
                }

                if (!found) {
                    removeErrors++;
                    log("  NAO ENCONTRADO no QE: \"" + targetName + "\"");
                }
            }
        }

        log("Remocoes: " + removeOk + " ok, " + removeErrors + " erros");

        log("Movimentacao concluida");

        // === SUMMARY ===
        log("=== Concluido ===");
        writeLog();

        var msg = "Organizados " + insertOk + " clips WAV em " + numNewTracks + " novas audio tracks.";
        if (insertErrors > 0) msg += "\n" + insertErrors + " erro(s) ao inserir.";
        if (removeErrors > 0) msg += "\n" + removeErrors + " erro(s) ao remover originais.";
        msg += "\n\nCtrl+Z para desfazer.";
        msg += "\nLog salvo em:\n" + logFile.fsName;
        alert(msg);
    })();
}
