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

var index = require('./routes/index');
// var gameplay = require('./routes/gameplay');
var end = require('./routes/end');

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

// app.get('/startSong', gameplay.startGame);
var roomStatus = {}
var count = 0;

io.on('connection', function(client) {
  count += 1;
  console.log('a user connected: ' + client.id);
  client.emit('connecting', client.id, count);
  client.broadcast.emit('newConnection', client.id);

  client.on('disconnect', function() {
    console.log('user disconnected: ' + client.id);
    io.emit('disconnecting', client.id);
    count -= 1;
  });

  client.on('mouseClick', function(point, room) {
  	console.log('click');
  	console.log(point);
    if (room) {
    	io.to(room).emit('mouseClick', point, client.id);
    } 
  });

  client.on('joinRoom', function(room) {
    console.log(client.id + ' joining room ' + room);
    client.join(room);
    client.emit('joining', room);
    // console.log('People in room');
    // // console.log(io.sockets.clients(room));
    // var clientObj = io.sockets.adapter.rooms[room];
    // var count = (typeof clientObj !== 'undefined') ? Object.keys(clientObj).length : 0;
    // console.log(clientObj);
    // console.log(count);
    // io.to(room).emit('joinRoom', client.id, room, count);
  });

  client.on('joinExisting', function(room) {
    console.log(client.id + ' joining existing room ' + room);
    client.join(room);
    console.log(roomStatus);
    if (roomStatus[room]) {
      client.emit('joinExisting', true);
    } else {
      client.emit('joinExisting', false);
    }
    // console.log('People in room');
    // // console.log(io.sockets.clients(room));
    // var clientObj = io.sockets.adapter.rooms[room];
    // var count = (typeof clientObj !== 'undefined') ? Object.keys(clientObj).length : 0;
    // console.log(clientObj);
    // console.log(count);
    // io.to(room).emit('joinRoom', client.id, room, count);
  });

  client.on('songParsed', function(room) {
    roomStatus[room] = true;
    io.to(room).emit('roomReady', room);
  });

  client.on('allReady', function(room) {
    console.log('yaa its all ready');
    io.to(room).emit('allReady', room);
  });

  console.log(count + ' users online');
});

http.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});