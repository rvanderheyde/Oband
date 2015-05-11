var path = require('path');
var echojs = require('echojs');
var schema = require('./../models/schema');
var User = schema.User;

var routes = {};
// I know this is stupid as a global var, but database will come later
var beats;
var track;

routes.home = function(req, res) {
  // Simple way to empty DB, normally left commented out
  // User.remove({}, function(err) { 
  //  console.log('collection removed') 
  // });
  
  // Simple way to confirm that DB stuff works as we change schema, can later be deleted
  User.find()
    .exec(function(err, users) {
      console.log(users);
    });

  data = {};
  if (isEmpty(req.session.passport)) {
    data.loggedIn = false;
  } else {
    data.loggedIn = true;
    data.name = req.session.passport.user.displayName;
  }
  console.log(data);
  res.render('home', {'data': data});
}

routes.single = function(req, res) {
  data = {};
  if (isEmpty(req.session.passport)) {
    data.loggedIn = false;
  } else {
    data.loggedIn = true;
    data.name = req.session.passport.user.displayName;
  }

  res.render('single', {'data': data, 'layout': false});
}

routes.online = function(req, res) {
  data = {};
  if (isEmpty(req.session.passport)) {
    data.loggedIn = false;
  } else {
    data.loggedIn = true;
    data.name = req.session.passport.user.displayName;
  }

  res.render('online', {'data': data, 'layout': false});
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
  track = req.body.track;
  console.log('SLKDJFLSDKJF');
  console.log(notes[0]);
  res.send('.');
}

routes.getSongInfo = function(req, res) {
  // Get request for person connecting to get parsed song data
  var data = {};
  data.beats = beats;
  data.track = track;
  console.log('Getting dat song info!');
  console.log(data.beats[0]);
  res.json(data);
  // res.send(beats);
}

routes.endGame = function(req, res) {
  var data = req.body;
  if (data.mode === 'single') {
    data.single = true;
  } else {
    data.single = false;
  }
  // check if user is logged in
  if (isEmpty(req.session.passport)) {
    data.loggedIn = false;
  } else {
    data.loggedIn = true;
    data.name = req.session.passport.user.displayName;
  }
  console.log(data.score);
  console.log(data.number);
  data.ratio = data.score * 10 / data.number;

  res.json(data);
}

routes.end = function(req, res) {
  data = req.query;
  if (data.loggedIn === 'false') {
    data.loggedIn = false;
  }
  if (data.single === 'false') {
    data.single = false;
  }
  res.render('end', {'data': req.query, 'layout': false});
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

routes.cacheSongData = function(req, res) {
  // POST request to store a beats-file in the remote db.
  var songObj = new schema.Song({
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

routes.getCachedSongData = function(req, res) {
  // GET request to retrieve a song's data if it has been cached.
  // If it has not been cached, instead return null.
  var query = schema.Song.where({ title: req.body.songpath });
  query.findOne(function (err, song) {
    if (err) {
      console.log("Problem searching for song: ", err);
      res.end();
    } else if (song) { // If we found a cached song,
      res.json(songs[0]); // send it.
    } else { // If it has not been cached yet,
      res.json(null); // return null.
    }
  });
}

module.exports = routes;