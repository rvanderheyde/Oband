// var socket = io();

// Home Page

function main() {
	$('#content').load('templates/home.html');
}

$(document).on('click', '#help', function(event) {
  event.preventDefault();
  $('#help_info').toggle();
});

$(document).on('click', '#online', function(event) {
  event.preventDefault();
  console.log('Hsldfkjsdlkf');
  $('#content').load('templates/online.html')
});

var difficulty = false;
var instrument = false;
var song = false;

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

var songSuccess = function(data, status) {
  console.log('Success');
}

var onError = function(data, status) {
  console.log(data);
  console.log(status);
}

$(document).on('click', '#start', function(event) {
  if (difficulty && instrument && song) {
    console.log('Start Song!');
    var data = {
      'difficulty': difficulty,
      'instrument': instrument,
      'song': song
    };
    $.get('/startSong', data)
      .done(songSuccess)
      .error(onError);
  } else {
    console.log('Please select a difficulty, instrument, and song');
  }
});

$(document).on('click', '#join', function(event) {
  if (difficulty && instrument && song) {
    console.log('Join Song!');
  } else {
    console.log('Please select a difficulty, instrument, and song');
  }
});