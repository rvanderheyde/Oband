var express = require('express');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars')
var http = require('http');
var app = express();
var server = http.Server(app);

var index = require('./routes/index');
var end = require('./routes/end');
var io = require('./routes/socket').listen(server);

var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
var PORT = process.env.PORT || 3000;

mongoose.connect(mongoURI);

app.engine('.hbs',exphbs({extname: '.hbs',
  defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.indexRender);
app.get('/end', end.endRender);
app.get('/echonestCall', index.echonestCall);
app.get('/beats', index.beats);
app.get('/echonestKey', index.echonestKey);
app.get('/getSongInfo', index.getSongInfo);
app.post('/songNotes', index.songNotes);

server.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});