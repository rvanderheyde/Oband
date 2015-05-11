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
   * "keys" is a list holding (for now) exactly one of "A", "S", "D", or "F",
   * representing the keyboard button(s) which should be pressed for that note.
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
      notes.push({
        time: startTime,
        keys: [choose(['A','S','D','F'])]
      });
    }
  }
  return notes;
}


var playSong = function(player, track, notes) {
  // Actually play the song.
  player.play(0,track.analysis.beats);
  var startTime = millis();

  var total = notes.length; // Total # of notes -- for logging.

  function playNotes(notes) {
    /**
     * Display the # of the beat being played,
     * remove that note from the queue,
     * and after an appropriate delay,
     * recursively call this function with the rest of the notes queue.
     */

    // Display this beat #
    console.log("Beat#: " + (total-notes.length) + " of " + total);
    var note = notes[0];
    notes = notes.slice(1);

    // If there are any notes left to play,
    // set a timer to recurse.
    if (notes.length > 0) {
      var nextStartTime = note.time + startTime; // Time when next note plays
      setTimeout(
        function() { playNotes(notes); }, // Recurse
        nextStartTime - millis() // in (desired-now) milliseconds.
      );
    }
  }
  playNotes(notes); // Let's get recursive!      
}

function runBeats(onlineFlag, trackURL) {
  /**
   * If the song has already been parsed, then retrieve the beats from the cache.
   * Otherwise, remix the beats using the echonest API.
   * TODO: Get this to work with different tracks.
   */
  info.trackURL = trackURL;

  // First, check whether this song has already been cached.
  var cacheQuery = { title: info.trackURL }
  $.get('/getCachedSongData', cacheQuery, function(cachedBeats) {

    // If we found this song in the cache,
    if (cachedBeats) {
      console.log("Found cached song data");
      notes = cachedBeats;
      info.notes = cachedBeats;
      info.host = true;

    // If no song data was found,
    } else { 
      remixBeats(onlineFlag, trackURL, function() {  // r-r-remix!
        console.log("NOTES " , info.notes.length)

        // Send the song data to the cache.
        var songDataQuery = { title: info.trackURL, data: info.notes };
        songDataQuery = JSON.stringify(songDataQuery);
        console.log("Firing /cacheSongData POST request");
        $.post('/cacheSongData', songDataQuery).done(function(data) {
          info.host = true;
        });
      });
    }
  });
}

function remixBeats(onlineFlag, trackURL, callback) {
  /**
   * Analze and parse out a beats-file,
   * which will be stored in routes/index/beats.
   */
  // Get the EchoNest API key fromt he server
  $.get('/echonestKey', function(apiKey) {
    var trackID = 'TRCYWPQ139279B3308'; // I don't know what this is.
    var trackURL = 'audio/OKGO.mp3';
    var remixer; // remix.js stuff
    var player;
    var track;
    var remixed;

    function init() {

      // Make sure the browser can handle it
      var contextFunction = window.AudioContext;
      if (contextFunction === undefined) {
        console.log("Sorry, this app needs advanced web audio. Your browser doesn't"
            + " support it. Try the latest version of Chrome?");
        return;
      }

      // These set up the WebAudio playback environment,
      // and create the remixer and player.
      var context = new contextFunction();
      remixer = createJRemixer(context, $, apiKey);
      player = remixer.getPlayer();
      console.log("Loading analysis data...");

      // The key line.  This prepares the track for remixing:  it gets
      // data from the Echo Nest analyze API and connects it with the audio file.
      // All the remixing takes place in the callback function.
      remixer.remixTrackById(trackID, trackURL, function(t, percent) {
        track = t;

        // Keep the user updated with load times
        console.log(percent + "% of the track loaded");
        if (percent == 100) {
          console.log(percent + "% of the track loaded, remixing...");
        }

        // Do the remixing!
        if (track.status == 'ok') {
          var notes = generateNotes(track.analysis.beats);
          console.log("Remix complete!");
          info.notes = notes;
          // person who parsed the music is the host
          info.host = true;

          // Send the notes to the server if you're in online mode
          if (onlineFlag) {
            $('#status').html('Music parsing complete, waiting for more users...');
            info.track = trackURL;
            $.post('/songNotes', {notes: JSON.stringify(notes), track: trackURL})
              .done(function() {
                socket.emit('songParsed', info.room);
                console.log('emitting that shit');
              })
              .error(onError);
          }

          // Caaaaaallbaaaaaaaack!
          callback();
        }
      });
    }

    $(document).ready(init());
  });
}