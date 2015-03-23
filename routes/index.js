var path = require('path');
routes = {}

routes.indexRender = function(req, res){
  var url = path.resolve( __dirname + '../../views/index.html');
  res.sendFile(url);
};

module.exports = routes