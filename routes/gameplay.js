routes = {}

routes.startGame = function(req, res) {
  console.log(req.query);
  // Do necessary database shit
  res.send('.');
}

module.exports = routes;