var path = require('path');
var echojs = require('echojs');
var schema = require('./../models/schema');
var User = schema.User;

var routes = {};
// I know this is stupid as a global var, but database will come later
var beats;

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
  console.log('SLKDJFLSDKJF');
  console.log(notes[0]);
  res.send('.');
}

routes.getSongInfo = function(req, res) {
  // Get request for person connecting to get parsed song data
  console.log('Getting dat song info!');
  console.log(beats[0]);
  res.send(beats);
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = routes;