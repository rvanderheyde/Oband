var path = require('path');
var SoundCloudAPI = require('soundcloud-node');

routes = {}

var user_id;
var client = new SoundCloudAPI(
  process.env.SOUNDCLOUD_KEY,
  process.env.SOUNDCLOUD_SECRET,
  redirect_uri = 'http://localhost:3000/submit');

routes.oauthInit = function (req, res) {
  var url = client.getConnectUrl();

  res.writeHead(301, url);
  res.end();
}

routes.oauthHandleToken = function (req, res) {
  var query = req.query;

  client.getToken(query.code, function (err, tokens) {
    if (err)
      callback(err);
    else {
      callback(null, tokens);
    }
  });

  client.setToken(access_token);
}

var getUser = client.getMe(function(err, user) {
    user_id = user.id;

    //  Then you can set it to the API like
    client.setUser(user_id);
});

routes.user = function (req, res) {
  var info = getUser();
  console.log(info);
}

module.exports = routes;