var socketio = require('socket.io');

// roomStatus obj to indicate how room joining works
var roomStatus = {};
// index will be incremented whenever someone joins a new room 
var roomIdx = {};
// number of open rooms for each song
var openRooms = {};
// number of people online
var count = 0;

module.exports.listen = function(app) {
  io = socketio.listen(app);

  io.on('connection', function(client) {
    count += 1;
    console.log('a user connected: ' + client.id);
    client.emit('connecting', client.id, count, openRooms);
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

    client.on('joinRoom', function(song) {
      console.log(client.id + ' creating room for song: ' + song);
      console.log('\nROOMSTATUS');
      console.log(roomStatus);
      // 'Index' room number based on number of rooms for a song (A0 and A1 for room A)
      if (roomStatus[song]) {
        room = song + roomStatus[song].length;
        roomStatus[song].push(false);
        openRooms[song] += 1;
      } else {
        room = song + 0;
        // Set index for this song to 0
        roomIdx[song] = 0;
        // Indicate that there is an open room for this song
        roomStatus[song] = [false];
        // Increment number of open rooms for this song
        openRooms[song] = 1;
      }
      console.log(roomStatus);
      console.log(openRooms);
      console.log(room);
      client.join(room);
      client.emit('joining', room);
      io.emit('increment', room[0], true);
    });

    client.on('joinExisting', function(song) {
      console.log(client.id + ' joining room for existing song: ' + song);
      // Find room to connect to based on roomStatus['_index'], then increment the index
      room = song + roomIdx[song];
      client.join(room);
      roomIdx[song] += 1;
      openRooms[song] -= 1;
      console.log(room);
      console.log(roomStatus);
      console.log(roomIdx);
      // Emit to room, letting it know if host is ready or not based on roomStatus
      if (roomStatus[room[0]][room.substring(1)]) {
        client.emit('joinExisting', room, true);
      } else {
        client.emit('joinExisting', room, false);
      }
      io.emit('increment', room[0], false);
    });

    client.on('songParsed', function(room) {
      // Change roomStatus of approp room to true if song has been parsed and POSTed
      roomStatus[room[0]][room.substring(1)] = true;
      console.log(roomStatus);
      client.broadcast.to(room).emit('roomReady', room);
    });

    client.on('allReady', function(room) {
      // inform all clients in a room that the room is ready to start playing
      console.log('yaa its all ready');
      io.to(room).emit('allReady', room);
    });

    client.on('scoreUpdate', function(room, score, time) {
      console.log(room);
      console.log(score);
      console.log(time);
      if (room) {
        client.broadcast.to(room).emit('scoreUpdate', score, time);
      }
    });

    console.log(count + ' users online');
  });

  return io;
}