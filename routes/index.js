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

routes.echonestCall = function (req, res) {
  echo('track/profile').get({
    id: 'TRTLKZV12E5AC92E11', //TESTING TRACK ID
    bucket: 'audio_summary'
  }, function (err, json) {
    console.log(json.response);
  });
}

module.exports = routes