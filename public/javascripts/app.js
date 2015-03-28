var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
var radius = 10;
var height = $(window).height()-5;
var width = $(window).width()-5;
var socket = io();
num_users = 0;

function init(){
	canvas = document.getElementById("blankSpace");
	canvas.width = width;
	canvas.height = height;
	canvas.ids = {};
	socket.on('connecting', function(clientId) {
		num_users += 1;
		canvas.myId = clientId;
		canvas.ids[clientId] = 0;
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
		alert('User disconnected: ' + clientId)
	});
	ctx = canvas.getContext("2d");
  	drawStuff();
  	canvas.addEventListener("mousedown", mouseClickDown)
  	// scores['user' + num_users] = 0;
  	socket.on('mouseClick', function(point) {
  		ctx.beginPath();
  		ctx.arc(point[0],point[1],10,0,2*Math.PI);
  		ctx.stroke();
  		ctx.closePath();

  		ctx.fillStyle ="#FF0000";
  		ctx.fill();
  	});
}

function drawCircle(ctx){
	ctx.fillStyle = "#FF0000";
  	ctx.fillRect(0,0,width,height); 
	ctx.beginPath();
	ctx.arc(width/2,height/2,radius,0,2*Math.PI);
	ctx.stroke();
	ctx.closePath();

	ctx.fillStyle = "#006699";
	ctx.fill();
}

function drawStuff(){
	if (radius <= 500){
		drawCircle(ctx);
		radius += 10;
		requestAnimationFrame(drawStuff);
	}	
}

function mouseClickDown(event){
	var clickX = event.pageX;
	var clickY = event.pageY;
	var point = [clickX,clickY];
	socket.emit('mouseClick', point);
}