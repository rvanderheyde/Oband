var path = require('path');
var echojs = require('echojs');
var mgschema = require('../models/schema.js');

var routes = {};
// I know this is stupid as a global var, but database will come later
var beats;

routes.indexRender = function (req, res){
  /* GET request to render the homeapge */
  var url = path.resolve( __dirname + '../../views/index.html');
  res.sendFile(url);
}

routes.echonestKey = function(req,res) {
  /* GET request to send the EchoNest API key */
  process.env.ECHONEST_KEY = 'P2KSY2ZXAFTJKGIRG';
	res.send(process.env.ECHONEST_KEY);
}

var echo = echojs({
  /* Wtf Pip */
  key: process.env.ECHONEST_KEY
});

routes.echonestCall = function (req, res) {
  /* Test function please ignore */
  echo('track/profile').get({
    id: 'TRTLKZV12E5AC92E11', //TESTING TRACK ID
    bucket: 'audio_summary'
  }, function (err, json) {
    console.log(json.response);
  });
}

routes.beats = function(req, res) {
  /* GET request to render the /beats page */
	res.render("beats");
}

routes.songNotes = function (req, res) {
  /* POST request to receive the remixed and parsed song data */
  var notes = JSON.parse(req.body.notes);
  beats = notes;
  console.log('SLKDJFLSDKJF');
  console.log(notes[0]);
  res.send('.');
}

routes.getSongInfo = function(req, res) {
  // Get request for person connecting to get parsed song data
  console.log('Getting dat song info!');
  console.log(beats[0]);
  res.json(beats);
}

routes.cacheSongData = function(req, res) {
  // POST request to store a beats-file in the remote db.
  var songObj = new mgschema.Song({
    title: JSON.parse(req.body.songpath),
    data: JSON.parse(req.body.beats)
  });
  songObj.save(function (err) {
    if (err) {
      console.log("Problem caching song data: ", err);
    }
  });
  res.end("");
}

module.exports = routes;