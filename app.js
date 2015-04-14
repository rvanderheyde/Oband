var express = require('express');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Sock = require('socket.io');

var app = express();
var http = require('http').Server(app);
var io = new Sock(http);

var index = require('./routes/index');
var gameplay = require('./routes/gameplay');
var end = require('./routes/end');

var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
var PORT = process.env.PORT || 3000;

mongoose.connect(mongoURI);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.indexRender);
app.get('/end', end.endRender);
app.get('/echonestCall', index.echonestCall);

app.get('/startSong', gameplay.startGame);

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
    console.log('People in room');
    // console.log(io.sockets.clients(room));
    var clientObj = io.sockets.adapter.rooms[room];
    var count = (typeof clientObj !== 'undefined') ? Object.keys(clientObj).length : 0;
    console.log(clientObj);
    console.log(count);
    io.to(room).emit('joinRoom', client.id, room, count);
  });
  console.log(count + ' users online');
});

http.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});