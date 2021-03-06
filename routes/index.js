var path = require('path');
var echojs = require('echojs');
var schema = require('./../models/schema');
var User = schema.User;
var Leader = schema.Leader;
var Song = schema.Song;

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
      console.log("USERS:");
      console.log(users);
    });
  Leader.find()
    .exec(function(err, leaders) {
      console.log("LEADERS:");
      console.log(leaders);
    });
  Song.find()
    .exec(function(err, songs) {
      console.log("SONGS:");
      for (var i = 0; i < songs.length; i++) {
        console.log(songs[i].title);
      }
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
  var userid = req.session.userid;

  User.findOne({_id: req.session.userid})
    .exec(function (err, user) {
      if (err) {
        res.status(500).json(err);
      } else {
        user.scores.push(data.score);
        user.songs.push(data.song);
        user.save(function (err) {
          if (err) {
            console.log('Problem saving users');
            res.status(500).json(err);
          } else {
            // check if user is logged in
            if (isEmpty(req.session.passport)) {
              data.loggedIn = false;
            } else {
              data.loggedIn = true;
              data.name = req.session.passport.user.displayName;
            }

            var entry = new Leader({
              score: data.score,
              user: data.name,
              song: data.song,
              user_id: userid
            });
            entry.save(function (err) {
              if (err) {
                console.log('Problem saving leaderboard');
                res.status(500).json(err);
              } else {
                if (data.mode === 'single') {
                  data.single = true;
                } else {
                  data.single = false;
                  if (data.score > data.oppScore) {
                    data.won = 'Won';
                  } else {
                    data.won = 'Lost';
                  }
                }
                
                console.log(data.score);
                console.log(data.number);
                data.ratio = data.score * 10 / data.number;
                data.ratio = data.ratio.toString().substring(0,4);

                res.json(data);
              }
            });
          }
        });
      }
    }) 
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
  var reqbody = JSON.parse(Object.keys(req.body)[0])
  console.log("Caching " + reqbody.title);
  var songObj = new schema.Song({
    title: reqbody.title,
    data: reqbody.data
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
  console.log("CHECKING IN: " + req.query.title);
  var query = schema.Song.where({ title: req.query.title });
  query.findOne(function (err, song) {
    if (err) {
      console.log("Problem searching for song: ", err);
      res.end();
    } else if (song) { // If we found a cached song,
      console.log(song);
      res.json(song.data); // send it.
    } else { // If it has not been cached yet,
      res.json(null); // return null.
    }
  });
}

routes.leaderboardRender = function(req, res) {
  Leader.find({}).sort({score: -1}).exec(function(err, data){
    res.render('leaderboard', {score: data})
  })
}

module.exports = routes;