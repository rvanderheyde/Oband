function main() {
  $('#content').load('templates/end.html');
}

$(document).on('click', '#restart button', function(event) {
  console.log('restart');
});

$(document).on('click', '#new button', function(event) {
  console.log('new');
});

$(document).on('click', '#player1', function(event) {
  console.log('testing1');
});

$(document).on('click', '#player2', function(event) {
  console.log('testing2');
});