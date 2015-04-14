var path = require('path');
var echojs = require('echojs');

routes = {}

routes.indexRender = function (req, res){
  var url = path.resolve( __dirname + '../../views/index.html');
  res.sendFile(url);
}

routes.echonestKey = function(req,res) {
	res.send(process.env.ECHONEST_KEY);
}

var echo = echojs({
  key: process.env.ECHONEST_KEY
});

routes.echonestCall = function (req, res) {
  echo('track/profile').get({
    id: 'TRTLKZV12E5AC92E11', //TESTING TRACK ID
    bucket: 'audio_summary'
  }, function (err, json) {
    console.log(json.response);
  });
}

routes.beats = function(req, res) {
	res.render("beats");
}

routes.songNotes = function (req, res) {
  var notes = JSON.parse(req.body.notes);
  console.log(notes[0]);
}

module.exports = routes