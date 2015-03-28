var path = require('path');
var echojs = require('echojs');

routes = {}

routes.indexRender = function (req, res){
  var url = path.resolve( __dirname + '../../views/index.html');
  res.sendFile(url);
}

var echo = echojs({
  key: process.env.ECHONEST_KEY
});

// testing if api works
routes.testing = function (req, res) {
  echo('song/search').get({
    artist: 'abba',
    title: 'mamma mia'
  }, function (err, json) {
    console.log(json.response);
  });
}

module.exports = routes