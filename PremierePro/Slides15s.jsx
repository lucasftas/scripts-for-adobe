var project = app.project;
var selection = project.getSelection();
var presetPath = ""; 

if (selection.length > 0 && selection[0].type === ProjectItemType.BIN) {
    var bin = selection[0];
    var seqName = bin.name + "_Sequence";
    var sequence = project.createNewSequence(seqName, presetPath);
    var videoTrack = sequence.videoTracks[0];
    var timeCursor = 0;
    var targetDuration = 15;

    for (var i = 0; i < bin.children.numItems; i++) {
        var item = bin.children[i];
        if (item.type === ProjectItemType.CLIP) {
            
            videoTrack.insertClip(item, timeCursor);

            for (var k = 0; k < videoTrack.clips.numItems; k++) {
                var clip = videoTrack.clips[k];
                if (Math.abs(clip.start.seconds - timeCursor) < 0.01) {
                    var newEnd = new Time();
                    newEnd.seconds = timeCursor + targetDuration;
                    clip.end = newEnd;
                    break;
                }
            }
            timeCursor += targetDuration;
        }
    }
} else {
    alert("Selecione um Bin.");
}