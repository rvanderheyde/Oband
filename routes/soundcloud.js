var path = require('path');
var SoundCloudAPI = require('soundcloud-node');
var access_token = null;

routes = {}

var credentials = {
  access_token: "{ACCESS_TOKEN}",
  user_id: "{USER_ID}"
}

var client = new SoundCloudAPI(
  process.env.SOUNDCLOUD_KEY,
  process.env.SOUNDCLOUD_SECRET,
  redirect_uri = 'http://localhost:3000/submit',
  credentials);

var oauthInit = function (req, res) {
  var url = client.getConnectUrl();

  res.writeHead(301, url);
  res.end();
}

var oauthHandleToken = function (req, res) {
  var query = req.query;

  client.getToken(query.code, function (err, tokens) {
    if (err)
      callback(err);
    else {
      callback(null, tokens);
    }
  });
}

client.setToken(access_token);

var user_id;
var getUser = client.getMe(function(err, user) {
    user_id = user.id;

    //  Then you can set it to the API like
    client.setUser(user_id);
});

routes.user = function (req, res) {
  client.get('/users', function (data) {
    console.log(data.title);
  });
}

module.exports = routes;