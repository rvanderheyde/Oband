var path = require('path');

routes = {};

routes.endRender = function (req, res){
  var url = path.resolve( __dirname + '../../views/end.html');
  res.sendFile(url);
};

module.exports = routes;