var socket = io();

// Info object for each user
var info = {};

function main() {
  info.count = 0;
  info.ids = {};
  info.room = false;
  info.roomCount = 0;
  info.ready = false;

  // load home page template
	$('#content').load('templates/home.html');
  socket.on('connecting', function(clientId, count) {
    // called when you connect
    info.count = count;
    info.myId = clientId;
    info.ids[clientId] = 0;
    console.log(clientId);
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
  socket.on('joining', function(letter) {
    // informs host that they joined the room
    console.log('I joined room: ', + letter);
    info.room = letter;
  });
  socket.on('joinExisting', function(ready) {
    // informs you if room you joined is ready
    if (ready) {
      // Get request to server for song information
      var data = {
        'difficulty': difficulty,
        'instrument': instrument,
        'song': song
      };
      $.get('/getSongInfo', data)
        .done(infoSuccess)
        .error(onError);
    } else {
      $('#status').html('Room not ready. Please wait...');
    }
  });
  socket.on('roomReady', function(room) {
    if (!info.ready) {
      var data = {
        'difficulty': difficulty,
        'instrument': instrument,
        'song': song
      };
      $.get('/getSongInfo', data)
        .done(infoSuccess)
        .error(onError);
    }
  });
  socket.on('allReady', function(room) {
    $('#status').html('Starting da game do');
    console.log('Starting dat game tho');
    console.log(info.notes);
  });
}

// Toggles help information
$(document).on('click', '#help', function(event) {
  event.preventDefault();
  $('#help_info').toggle();
});

// Loads online multiplayer page
$(document).on('click', '#online', function(event) {
  event.preventDefault();
  console.log('Hsldfkjsdlkf');
  $('#content').load('templates/online.html', function() {
    $('#number span').html(info.count);
  });
});

var difficulty = false;
var instrument = false;
var song = false;

// Functions to update vars when setup buttons are clicked
$(document).on('click', '#diff-col button', function(event) {
  difficulty = $(this).html();
  $('#diff').html(difficulty);
});

$(document).on('click', '#inst-col button', function(event) {
  instrument = $(this).html();
  $('#inst').html(instrument);
});

$(document).on('click', '#song-col button', function(event) {
  song = $(this).html();
  $('#song').html(song);
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
  if (difficulty && instrument && song) {
    console.log('Start Song!');
    $('#status').html('Loading music data...');
    // Create new socket room
    socket.emit('joinRoom', song);
    // runBeats() to save notes object to info
    runBeats();
  } else {
    console.log('Please select a difficulty, instrument, and song');
  }
});

// Load game if join button is clicked
$(document).on('click', '#join', function(event) {
  if (difficulty && instrument && song) {
    console.log('Join Song!');
    $('#status').html('Loading music data...');
    var data = {
      'difficulty': difficulty,
      'instrument': instrument,
      'song': song
    };
    // Join existing socket room
    socket.emit('joinExisting', data.song);
  } else {
    console.log('Please select a difficulty, instrument, and song');
  }
});