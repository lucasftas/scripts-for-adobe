app.enableQE();
var seq = app.project.activeSequence;

if (seq) {
    var videoTracks = seq.videoTracks;
    var orderedSelection = [];

    for (var i = 0; i < videoTracks.numTracks; i++) {
        var track = videoTracks[i];
        var items = track.clips;
        for (var j = 0; j < items.numItems; j++) {
            var item = items[j];
            if (item.isSelected()) {
                orderedSelection.push(item);
            }
        }
    }

    for (var k = 0; k < orderedSelection.length; k++) {
        var clip = orderedSelection[k];
        var x, y, scale;

        if (k === 0) {
            x = 0.25; y = 0.25; scale = 50;
        } else if (k === 1) {
            x = 0.75; y = 0.25; scale = 50;
        } else if (k === 2) {
            x = 0.25; y = 0.75; scale = 50;
        } else if (k === 3) {
            x = 0.75; y = 0.75; scale = 50;
        } else {
            x = 0.5; y = 0.5; scale = 25;
        }

        var components = clip.components;
        if (components) {
            for (var m = 0; m < components.numItems; m++) {
                var comp = components[m];
                if (comp.displayName === "Motion" || comp.displayName === "Movimento") {
                    var props = comp.properties;
                    props[0].setValue([x, y], true);
                    props[1].setValue(scale, true);
                    break;
                }
            }
        }
    }
}