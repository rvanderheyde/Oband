// This script is not currently in use, but is useful for sockets stuff in the future

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
var radius = 10;
var height = $(window).height()-5;
var width = $(window).width()-5;
var socket = io();
var num_users = 0;

function main () {
  canvas = document.getElementById("blankSpace");
  canvas.width = width;
  canvas.height = height;
  canvas.ids = {};
  canvas.room = false;
  socket.on('connecting', function(clientId) {
    num_users += 1;
    canvas.myId = clientId;
    canvas.ids[clientId] = 0;
    console.log(clientId);
    alert('I connected! ' + clientId);
  });
  socket.on('newConnection', function(clientId) {
    num_users += 1;
    canvas.ids[clientId] = 0;
    alert('New connection: ' + clientId);
  });
  socket.on('disconnecting', function(clientId) {
    num_users -= 1;
    delete canvas.ids[clientId];
    alert('User disconnected: ' + clientId);
  });
  socket.on('joinRoom', function(clientId, letter) {
    alert(clientId + ' joined room ' + letter);
  });
  ctx = canvas.getContext("2d");
    drawStuff();
    canvas.addEventListener("mousedown", mouseClickDown);
    // scores['user' + num_users] = 0;
    socket.on('mouseClick', function(point, clientId) {
      ctx.beginPath();
      ctx.arc(point[0],point[1],10,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      ctx.fillStyle ="#FF0000";
      ctx.fill();
      if (clientId in canvas.ids) {
        canvas.ids[clientId] += 1;
      } else {
        canvas.ids[clientId] = 1;
      }
    });
}

function drawCircle(ctx) {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,width,height); 
  ctx.beginPath();
  ctx.arc(width/2,height/2,radius,0,2*Math.PI);
  ctx.stroke();
  ctx.closePath();

  ctx.fillStyle = "#006699";
  ctx.fill();
}

function drawStuff() {
  if (radius <= 500){
    drawCircle(ctx);
    radius += 10;
    requestAnimationFrame(drawStuff);
  }
  var rect1x = width/10;
  var rect1y = height/10;
  ctx.fillStyle = '#EEEEEE';
  ctx.fillRect(rect1x, rect1y, width/5, height/20);
  ctx.fillRect(rect1x*4, rect1y, width/5, height/20);
  ctx.fillStyle = '#000000';
  ctx.fillText('Join Room A', width/8, height/8);
  ctx.fillText('Join Room B', rect1x*3 + width/8, height/8);
}

function mouseClickDown(event) {
  var clickX = event.pageX;
  var clickY = event.pageY;
  var point = [clickX,clickY];
  if (canvas.room) {
    socket.emit('mouseClick', point, canvas.room);
  } else {
    processClick(event);
  }
}

function checkInBox(point, rect1, rect2) {
  //point, rect1, rect2 are all length 2 arrays. [x,y]
  if (rect1[0]>point[0]){
    return false;
  } else if(rect1[1]>point[1]){
    return false;
  } else if(rect2[1]<point[1]){
    return false;
  } else if (rect2[0]<point[0]){
    return false;
  } else {
    return true;
  }
}

function processClick(event) {
  var clickX = event.pageX;
  var clickY = event.pageY;
  var point = [clickX, clickY];
  var rect1bl = [width/10, height/10];
  var rect1tr = [width*3/10, height*3/20];
  var rect2bl = [width*4/10, height/10];
  var rect2tr = [width*6/10, height*3/20];
  if (checkInBox(point, rect1bl, rect1tr)) {
    console.log('Join Room A');
    canvas.room = 'A';
    socket.emit('joinRoom', canvas.room);
  } else if (checkInBox(point, rect2bl, rect2tr)) {
    console.log('Join Room B');
    canvas.room = 'B';
    socket.emit('joinRoom', canvas.room);
  } else {
    socket.emit('mouseClick', point, canvas.myId);
  }
}