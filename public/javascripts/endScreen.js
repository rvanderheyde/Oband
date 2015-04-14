function main() {
  $('#content').load('templates/end.html', function() {
    var score1 = '20'; //values from actual game
    var score2 = '17';

    $('#player1score').html(score1);
    $('#player2score').html(score2);
  });
}

$(document).ready(function() {
  $(document).on('click', '#restart', function(event) {
    console.log('restart');
  });

  $(document).on('click', '#new', function(event) {
    console.log('new');
    $('#player1score').text('test');
  });
});