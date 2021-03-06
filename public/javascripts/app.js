var socket = io();

// Info object for each user
var info = {};
// Room map for ID and song names
var roomMap = {
  'Madness': 'A',
  'Sail': 'B',
  'Intro': 'C'
};

// URL where the audio file can be found
// TODO: Tie this to the song select feature
var trackURL;
var trackID;


function main() {
  info.count = 0;
  info.ids = {};
  info.room = false;
  info.roomCount = {};
  info.host = false;
  info.difficulty = false;
  info.song = false;
  info.mode = false;

  socket.on('connecting', function(clientId, count, openRooms) {
    // called when you connect
    info.count = count;
    info.roomCount = openRooms;
    info.myId = clientId;
    info.ids[clientId] = 0;
    console.log(clientId);
    console.log('ROOMSTATUS');
    console.log(openRooms);
  });
  
  socket.on('newConnection', function(clientId) {
    // informs you of new people connecting and updates info obj
    info.count += 1;
    info.ids[clientId] = 0;
    console.log(clientId + ' connected');
    $('#number span').html(info.count);
  });
  
  socket.on('disconnecting', function(clientId) {
    // informs you of new people disconnecting and updates info obj
    info.count -= 1;
    delete info.ids[clientId];
    console.log('User disconnected: ' + clientId);
    $('#number span').html(info.count);
  });
  
  socket.on('joining', function(room) {
    // informs host that they joined the room
    console.log('I joined room: ' + room);
    info.room = room;
  });
  
  socket.on('joinExisting', function(room, ready) {
    // informs you if room you joined is ready
    info.room = room;
    if (ready) {
      // Get request to server for song information
      var data = {
        'difficulty': info.difficulty,
        'song': info.song
      };
      $.get('/getSongInfo', data)
        .done(infoSuccess)
        .error(onError);
    } else {
      $('#status').html('Room not ready. Please wait...');
    }
  });

  // To increment number of open rooms for all clients
  socket.on('increment', function(room, up) {
    console.log(room);
    var letter = '#' + room;
    if (!info.roomCount[room]) {
      info.roomCount[room] = 0;
    }
    if (up) {
      info.roomCount[room] += 1;
    } else {
      info.roomCount[room] -= 1;
    }
    $(letter).html(info.roomCount[room]);
  })
  
  socket.on('roomReady', function(room) {
    // Get song info from server when host indicates the room is ready
    var data = {
      'difficulty': info.difficulty,
      'song': info.song
    };
    $.get('/getSongInfo', data)
      .done(infoSuccess)
      .error(onError);
  });
  
  socket.on('allReady', function(room) {
    // When socket fires indicating that both users are ready, start game
    console.log('Starting dat game tho');
    var i = 5;
    var interval = setInterval(function () {
      i--;
      console.log(i);
      $('#status').html('Ready to begin! Starting in ' + i + ' seconds');
      if (i === 0) {
        clearInterval(interval);
        playGame({song: info.notes, track: info.track});
      }
    }, 1000);
  });


  socket.on('scoreUpdate', function(otherScore, otherTime) {
    // Doesnt work if tab is not open b/c we are using client time
    oppScore = otherScore;
  });
}

// Logs out
$(document).on('click', '#logout', function(event) {
  event.preventDefault();
  $.post('/loggingOut')
    .done(function() {
      window.location.replace('/');
    }) 
    .error(onError);
});

// Toggles help information
$(document).on('click', '#help', function(event) {
  event.preventDefault();
  $('#help_info').toggle();
});

// Loads singleplayer page
$(document).on('click', '#singlep', function(event) {
  event.preventDefault();
  
  var loggedIn = $('#name').html();
  if (loggedIn[0] === 'W') {
    $.get('/singlep')
      .done(function(data) {
        $('body').html(data);
        console.log('Singleplayer');
        info.mode = 'single';
      })
      .error(onError);
  } else {
    $('#help_info').show();
  }
});

// Loads online multiplayer page
$(document).on('click', '#online', function(event) {
  event.preventDefault();
  var loggedIn = $('#name').html();
  if (loggedIn[0] === 'W') {
    $.get('/online')
      .done(function(data) {
        $('body').html(data) //, function() {
          info.mode = 'online';
          console.log('Online multiplayer');
          $('#number span').html(info.count);
          // Updating number of open rooms when each song loading online multip page
          var rooms = info.roomCount;
          console.log(rooms);
          for (var r in rooms) {
            if (rooms.hasOwnProperty(r)) {
              console.log(r + " -> " + rooms[r]);
              // Render update on screen, using roomMap to get correct ID
              $('#' + r).html(rooms[r]);
            }
          }
      })
      .error(onError);
  } else {
    $('#help_info').show();
  }
});

// Functions to update vars when setup buttons are clicked
$(document).on('click', '#diff-col button', function(event) {
  info.difficulty = $(this).html();
  $('#diff').html(info.difficulty);
});

$(document).on('click', '#song-col button', function(event) {
  info.song = $(this).html();
  $('#song').html(info.song);
  //song URL and Id for Beats and audio
  if (info.song === 'Intro'){
    trackURL = 'audio/XX.mp3';
    trackID = 'TRKUSTF13974911656';
  } else if (info.song === 'Madness') {
    trackURL = 'audio/MUSE.mp3';
    trackID = 'TRHIUST13B5695A3E4';
  } else if (info.song==='Sail') {
    trackURL = 'audio/Sail.mp3';
    trackID = 'TRWHQOK13B357AB74A';
  }
});

// Success function for joining an existing song and getting song info
var infoSuccess = function(data, status) {
  console.log('This be the data');
  console.log(data)
  info.notes = data.beats;
  info.track = data.track;
  socket.emit('allReady', info.room);
}

var onError = function(data, status) {
  $('#status').html('Music loading failed :(');
  console.log(data);
  console.log(status);
}

// Loads game if start button is clicked
$(document).on('click', '#start', function(event) {
  if (info.difficulty && info.song) {
    console.log('Start Song!');
    $('#status').html('Loading music data...');
    // Create new socket room
    socket.emit('joinRoom', info.song);
    // runBeats() to save notes object to info w/ true flag for online play
    runBeats(true, trackURL, trackID);
  } else {
    console.log('Please select a difficulty and song');
  }
});

// Load game if join button is clicked
$(document).on('click', '#join', function(event) {
  if (info.difficulty && info.song) {
    console.log('Join Song!');
    $('#status').html('Loading music data...');
    var data = {
      'difficulty': info.difficulty,
      'song': info.song
    };
    // Join existing socket room
    if (info.roomCount[roomMap[data.song]] > 0) {
      socket.emit('joinExisting', data.song);
    } else {
      $('#status').html('No open rooms for this song. Please start a new game instead');
    }
  } else {
    $('#status').html('Please select a difficulty and song');
  }
});

// Load game for a single player experience
$(document).on('click', '#singleStart', function(event) {
  if (info.difficulty && info.song) {
    console.log('Begin Song!');
    $('#status').html('Loading music data...');
    // For when runBeats() actually takes in user inputs
    var data = {
      'difficulty': info.difficulty,
      'song': info.song
    };
    // runBeats to get notes object (w/ false flag because singleplayer)
    runBeats(false, trackURL, trackID);

    // Play the game, after a countdown.
    var i = 5;
    a = setInterval(function () {
      i--;
      console.log(i);
      $('#status').html('Music parsing complete! Starting in ' + i + ' seconds');
      if (i === 0) {
        clearInterval(a);
        playGame({song: info.notes, track: trackURL});
      }
    }, 1000);

  } else {
    console.log('Please select a difficulty and song');
  }
});