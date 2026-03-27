(function (thisObj) {
    function createUI(thisObj) {
        var myWindow = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Organizador de Timecode v3", undefined, { resizable: true });

        myWindow.orientation = "column";
        myWindow.alignChildren = ["fill", "top"];
        myWindow.spacing = 10;
        myWindow.margins = 16;

        myWindow.add("statictext", undefined, "Escolha o formato do nome da camada:");
        var formatDropdown = myWindow.add("dropdownlist", undefined, [
            "HH_MM_SS (Ex: 00_02_00 = 2min)",
            "MM_SS (Ex: 03_00 = 3min)",
            "MM_SS_FF (Ex: 02_00_15 = 2min, 0s, 15f)",
            "SS_FF (Ex: 10_00 = 10s)"
        ]);
        formatDropdown.selection = 1;

        var btnProcess = myWindow.add("button", undefined, "Organizar Camadas");

        btnProcess.onClick = function () {
            var comp = app.project.activeItem;

            if (comp == null || !(comp instanceof CompItem)) {
                alert("Erro: Por favor, selecione ou abra uma composição ativa.");
                return;
            }

            app.beginUndoGroup("Organizar Layers por Nome v3");

            var layers = comp.layers;
            var formatIndex = formatDropdown.selection.index;
            var durationInSeconds = 10;
            var processedCount = 0;
            var ignoredCount = 0;

            for (var i = 1; i <= layers.length; i++) {
                var layer = layers[i];
                var name = layer.name;

                if (name === comp.name || /\.mp4/i.test(name) || (layer.source && layer.source.name && /\.mp4/i.test(layer.source.name))) {
                    ignoredCount++;
                    continue;
                }

                var parts = name.match(/\d+/g);

                if (parts && parts.length >= 2) {
                    var targetTime = 0;
                    var fps = 1 / comp.frameDuration;

                    try {
                        if (formatIndex === 0) {
                            var h = parseInt(parts[0], 10) * 3600;
                            var m = parseInt(parts[1], 10) * 60;
                            var s = parseInt(parts[2] || 0, 10);
                            targetTime = h + m + s;
                        } else if (formatIndex === 1) {
                            var m = parseInt(parts[0], 10) * 60;
                            var s = parseInt(parts[1], 10);
                            targetTime = m + s;
                        } else if (formatIndex === 2) {
                            var m = parseInt(parts[0], 10) * 60;
                            var s = parseInt(parts[1], 10);
                            var f = parseInt(parts[2] || 0, 10) / fps;
                            targetTime = m + s + f;
                        } else if (formatIndex === 3) {
                            var s = parseInt(parts[0], 10);
                            var f = parseInt(parts[1] || 0, 10) / fps;
                            targetTime = s + f;
                        }

                        layer.startTime = targetTime;
                        layer.outPoint = layer.inPoint + durationInSeconds;
                        processedCount++;

                    } catch (err) {
                    }
                }
            }

            app.endUndoGroup();

            var msg = "Processo concluído!\n" + processedCount + " camadas organizadas.";
            if (ignoredCount > 0) {
                msg += "\n" + ignoredCount + " camada(s) ignorada(s).";
            }
            alert(msg);
        };

        myWindow.onResizing = myWindow.onResize = function () {
            this.layout.resize();
        };

        if (myWindow instanceof Window) {
            myWindow.center();
            myWindow.show();
        } else {
            myWindow.layout.layout(true);
        }
    }

    createUI(thisObj);
})(this);