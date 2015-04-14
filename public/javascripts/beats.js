var millis = function() {
  /* Return the number of milliseconds since the epoch. */
  return new Date().getTime();
}


var choose = function(arr) {
  /* Randomly return one item from the supplied array. */
  return arr[Math.floor(Math.random()*arr.length)];
}


var generateNotes = function(beats) {
  /**
   * Return an array of objects representing notes to be played.
   * A note object contains two attributes: "time" and "key".
   * "time" is the # of milliseconds into the song
   * when that note should be played.
   * "key" is either "KEY_UP", "KEY_DOWN", "KEY_LEFT", or "KEY_RIGHT",
   * representing the arrow-key which should be pressed for that note.
   */
  var notes = new Array();
  var runningTime = 0;
  var beat;
  var duration;
  var numberOfNotesThisBeat;
  var key;
  
  // We're going to add in some notes for each beat.
  for (var i = 0; i < beats.length; i++) {
    beat = beats[i]
    runningTime += duration;

    // We will randomly either include 1 or 2 notes per beat. (Usually 1.)
    numberOfNotesThisBeat = choose([1,1,2]);
    duration = (beat.duration * 1000.0) / numberOfNotesThisBeat;
    for (var j = 0; j < numberOfNotesThisBeat; j++) {

      // Create and push each note.
      startTime = beat.start*1000 + (duration * j);
      key = choose(["KEY_UP", "KEY_DOWN", "KEY_LEFT", "KEY_RIGHT"]);
      notes.push({
        time: startTime,
        key: key
      });
    }
  }
  return notes;
}


$.get('echonestKey', function(apiKey) { // Get the API Key from the server
  var trackID = 'TRCYWPQ139279B3308';
  var trackURL = 'audio/OKGO.mp3';
  var remixer;
  var player;
  var track;
  var remixed;

  function init() {
    // Make sure the browser can handle it
    var contextFunction = window.AudioContext;
    if (contextFunction === undefined) {
      $("#info").text("Sorry, this app needs advanced web audio. Your browser doesn't"
          + " support it. Try the latest version of Chrome?");
      return;
    }

    // These set up the WebAudio playback environment,
    // and create the remixer and player.
    var context = new contextFunction();
    remixer = createJRemixer(context, $, apiKey);
    player = remixer.getPlayer();
    $("#info").text("Loading analysis data...");

    // The key line.  This prepares the track for remixing:  it gets
    // data from the Echo Nest analyze API and connects it with the audio file.
    // All the remixing takes place in the callback function.
    remixer.remixTrackById(trackID, trackURL, function(t, percent) {
      track = t;

      // Keep the user updated with load times
      $("#info").text(percent + "% of the track loaded");
      if (percent == 100) {
        $("#info").text(percent + "% of the track loaded, remixing...");
      }

      // Do the remixing!
      if (track.status == 'ok') {
        var notes = generateNotes(track.analysis.beats);
        $("#info").text("Remix complete!");
        console.log(notes);

        // Play the song
        player.play(0,track.analysis.beats);
        var startTime = millis();

        var total = notes.length; // Total # of notes -- for logging.
        function playNotes(notes) {
          // console.log("Beat:");
          console.log(total - notes.length);
          $("#info").text("Beat#: " + (total-notes.length));
          note = notes.shift; // This is .pop() from the front. Like queue.pop.

          // If there are any notes left to play,
          // set a timer to display that note when it's time.
          if (notes.length > 0) {
            var nextStartTime = note + startTime; // Time when next note plays
            setTimeout(
              function() { playNotes(notes); }, // Recurse
              nextStartTime - millis() // in (desired-now) milliseconds.
            );
          }
        }

        // Uncomment this line to display the beat#s realtime in the 
        // playNotes(notes);
      }
    });
  }

  $(document).ready(init());
});