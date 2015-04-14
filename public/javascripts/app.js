var socket = io();

// Info object for each user
var info = {};

function main() {
  info.count = 0;
  info.ids = {};
  info.room = false;
  info.roomCount = 0;

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
  socket.on('joinRoom', function(clientId, letter, count) {
    // informs everyone in a room if someone new joins, and potentially starts the game
    alert(clientId + ' joined room ' + letter);
    info.room = letter;
    info.roomCount = count;
    if (info.roomCount > 1) {
      $('#status').html('You can start game now?');
    }
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

// Success function for starting a new song
var songSuccess = function(data, status) {
  $('#status').html('Music data loaded. Waiting for more players...');
  console.log('Success');
}

// Success function for joining an existing song
var joinSuccess = function(data, status) {
  console.log('Room count: ' + info.roomCount);
  // Only allow successful join if someone has already started a game
  if (info.roomCount > 1) {
    $('#status').html('Music data loaded. Starting game...');
    console.log(data)
    playGame({song:data})
  } else {
    $('#status').html('Cannot join game. Try a different song');
  }
  console.log('Success');
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
    var data = {
      'difficulty': difficulty,
      'instrument': instrument,
      'song': song
    };
    // Create new socket room
    socket.emit('joinRoom', data.song);
    // Get request to server for song information
    $.get('/startSong', data)
      .done(songSuccess)
      .error(onError);
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
    socket.emit('joinRoom', data.song);
    // Get request to server for song information
    $.get('/startSong', data)
      .done(joinSuccess)
      .error(onError);
  } else {
    console.log('Please select a difficulty, instrument, and song');
  }
});