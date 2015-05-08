var socket = io();

// Info object for each user
var info = {};

function main() {
  info.count = 0;
  info.ids = {};
  info.room = false;
  info.roomCount = {};
  info.host = false;
  info.difficulty = false;
  info.instrument = false;
  info.song = false;
  info.mode = false;

  // load home page template
	$('#content').load('templates/home.html');

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
        'instrument': info.instrument,
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
      'instrument': info.instrument,
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

// Toggles help information
$(document).on('click', '#help', function(event) {
  event.preventDefault();
  $('#help_info').toggle();
});

// Loads singleplayer page
$(document).on('click', '#singlep', function(event) {
  event.preventDefault();
  console.log('Singleplayer');
  info.mode = 'single';
  $('#content').load('templates/single.html');
});

// Loads online multiplayer page
$(document).on('click', '#online', function(event) {
  event.preventDefault();
  console.log('Online multiplayer');
  info.mode = 'online';
  $('#content').load('templates/online.html', function() {
    $('#number span').html(info.count);
    // Updating number of open rooms when each song loading online multip page
    var rooms = info.roomCount;
    for (var r in rooms) {
      if (rooms.hasOwnProperty(r)) {
        console.log(r + " -> " + rooms[r]);
        $('#' + r).html(rooms[r]);
      }
    }
  });
});

// Functions to update vars when setup buttons are clicked
$(document).on('click', '#diff-col button', function(event) {
  info.difficulty = $(this).html();
  $('#diff').html(info.difficulty);
});

$(document).on('click', '#inst-col button', function(event) {
  info.instrument = $(this).html();
  $('#inst').html(info.instrument);
});

$(document).on('click', '#song-col button', function(event) {
  info.song = $(this).html();
  $('#song').html(info.song);
});

// Success function for joining an existing song and getting song info
var infoSuccess = function(data, status) {
  console.log('This be the data');
  console.log(data)
  info.notes = data;
  socket.emit('allReady', info.room);
}

var onError = function(data, status) {
  $('#status').html('Music loading failed :(');
  console.log(data);
  console.log(status);
}

// Loads game if start button is clicked
$(document).on('click', '#start', function(event) {
  if (info.difficulty && info.instrument && info.song) {
    console.log('Start Song!');
    $('#status').html('Loading music data...');
    // Create new socket room
    socket.emit('joinRoom', info.song);
    // runBeats() to save notes object to info w/ true flag for online play
    runBeats(true);
  } else {
    console.log('Please select a difficulty, instrument, and song');
  }
});

// Load game if join button is clicked
$(document).on('click', '#join', function(event) {
  if (info.difficulty && info.instrument && info.song) {
    console.log('Join Song!');
    $('#status').html('Loading music data...');
    var data = {
      'difficulty': info.difficulty,
      'instrument': info.instrument,
      'song': info.song
    };
    // Join existing socket room
    if (info.roomCount[data.song] > 0) {
      socket.emit('joinExisting', data.song);
    } else {
      $('#status').html('No open rooms for this song. Please start a new game instead');
    }
  } else {
    $('#status').html('Please select a difficulty, instrument, and song');
  }
});

// Load game for a single player experience
$(document).on('click', '#singleStart', function(event) {
  if (info.difficulty && info.instrument && info.song) {
    console.log('Begin Song!');
    $('#status').html('Loading music data...');
    // For when runBeats() actually takes in user inputs
    var data = {
      'difficulty': info.difficulty,
      'instrument': info.instrument,
      'song': info.song
    };
    // runBeats to get notes object (w/ false flag because singleplayer)
    runBeats(false);

  } else {
    console.log('Please select a difficulty, instrument, and song');
  }
});