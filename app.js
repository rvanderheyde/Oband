var express = require('express');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Sock = require('socket.io');
var exphbs = require('express-handlebars')

var app = express();
var http = require('http').Server(app);
var io = new Sock(http);

// var io = require('socket.io')(http);

var index = require('./routes/index');

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
app.get('/echonestCall', index.echonestCall);
app.get('/beats', index.beats);
app.get('/echonestKey', index.echonestKey)

io.on('connection', function(client){
  console.log('a user connected');

  client.on('disconnect', function(){
    console.log('user disconnected');
  });

  client.on('mouseClick', function(point){
  	console.log('click');
  	console.log(point);
  	io.emit('mouseClick', point);
  })
});

http.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});