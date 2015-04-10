// First-beat extraction and assembly
// You will need to supply your Echo Nest API key, the trackID, and a URL to the track.
// The supplied track can be found in the audio subdirectory.
$.get('echonestKey', function(apiKey) {
    var trackID = 'TRCYWPQ139279B3308';
    var trackURL = 'audio/OKGO.mp3';
    var remixer;
    var player;
    var track;
    var remixed;
    function init() {
        console.log("Initting");
        var contextFunction = window.AudioContext;
        if (contextFunction === undefined) {
            $("#info").text("Sorry, this app needs advanced web audio. Your browser doesn't"
                + " support it. Try the latest version of Chrome?");
        } else {
            var context = new contextFunction();
            remixer = createJRemixer(context, $, apiKey);
            player = remixer.getPlayer();
            $("#info").text("Loading analysis data...");
            remixer.remixTrackById(trackID, trackURL, function(t, percent) {
                console.log("Sup");
                track = t;
                $("#info").text(percent + "% of the track loaded");
                if (percent == 100) {
                    $("#info").text(percent + "% of the track loaded, remixing...");
                }
                if (track.status == 'ok') {
                    remixed = new Array();
                    // Do the remixing here!
                    for (var i=0; i < track.analysis.beats.length; i++) {
                        if (i % 4 == 0) {
                            remixed.push(track.analysis.beats[i])
                        }
                    }
                    console.log(remixed);
                    $("#info").text("Remix complete!");
                    player.play(0,remixed);
                }
            });
        }
    }
    $(document).ready(init());
    //window.onload = init;
});