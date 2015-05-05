var express = require('express');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var Sock = require('socket.io');
var exphbs = require('express-handlebars')
var http = require('http');

var app = express();
var server = http.Server(app);
// var http = require('http').Server(app);
// var io = new Sock(http);

var index = require('./routes/index');
var end = require('./routes/end');
var io = require('./routes/socket').listen(server);
// var socket = require('./routes/socket.js');

// Hook socket.io into Express
// var io = require('socket.io')(server);

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

// io.sockets.on('connection', socket);

app.get('/', index.indexRender);
app.get('/end', end.endRender);
app.get('/echonestCall', index.echonestCall);
app.get('/beats', index.beats);
app.get('/echonestKey', index.echonestKey);
app.get('/getSongInfo', index.getSongInfo);
app.post('/songNotes', index.songNotes);

// // roomStatus obj to indicate how room joining works
// var roomStatus = {};
// // index will be incremented whenever someone joins a new room 
// var roomIdx = {};
// var count = 0;

// io.on('connection', function(client) {
//   count += 1;
//   console.log('a user connected: ' + client.id);
//   client.emit('connecting', client.id, count);
//   client.broadcast.emit('newConnection', client.id);

//   client.on('disconnect', function() {
//     console.log('user disconnected: ' + client.id);
//     io.emit('disconnecting', client.id);
//     count -= 1;
//   });

//   client.on('mouseClick', function(point, room) {
//   	console.log('click');
//   	console.log(point);
//     if (room) {
//     	io.to(room).emit('mouseClick', point, client.id);
//     } 
//   });

//   client.on('joinRoom', function(song) {
//     console.log(client.id + ' creating room for song: ' + song);
//     console.log('\nROOMSTATUS');
//     console.log(roomStatus);
//     // 'Index' room number based on number of rooms for a song (A0 and A1 for room A)
//     if (roomStatus[song]) {
//       room = song + roomStatus[song].length;
//       roomStatus[song].push(false);
//     } else {
//       room = song + 0;
//       // Set index for this song to 0
//       roomIdx[song] = 0;
//       roomStatus[song] = [false];
//     }
//     console.log(roomStatus);
//     console.log(room);
//     client.join(room);
//     client.emit('joining', room);
//   });

//   client.on('joinExisting', function(song) {
//     console.log(client.id + ' joining room for existing song: ' + song);
//     // Find room to connect to based on roomStatus['_index'], then increment the index
//     room = song + roomIdx[song];
//     client.join(room);
//     roomIdx[song] += 1;
//     console.log(room);
//     console.log(roomStatus);
//     console.log(roomIdx);
//     // Emit to room, letting it know if host is ready or not based on roomStatus
//     if (roomStatus[room[0]][room.substring(1)]) {
//       client.emit('joinExisting', room, true);
//     } else {
//       client.emit('joinExisting', room, false);
//     }
//   });

//   client.on('songParsed', function(room) {
//     // Change roomStatus of approp room to true if song has been parsed and POSTed
//     roomStatus[room[0]][room.substring(1)] = true;
//     console.log(roomStatus);
//     client.broadcast.to(room).emit('roomReady', room);
//   });

//   client.on('allReady', function(room) {
//     // inform all clients in a room that the room is ready to start playing
//     console.log('yaa its all ready');
//     io.to(room).emit('allReady', room);
//   });

//   console.log(count + ' users online');
// });

server.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});