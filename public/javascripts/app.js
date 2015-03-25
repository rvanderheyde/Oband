var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
var radius = 10;
var height = $(window).height()-20;
var width = $(window).width()-20;
var socket = io();

function init(){
	canvas = document.getElementById("blankSpace");
	canvas.width = width;
	canvas.height = height;
  	drawStuff();
  	canvas.addEventListener("mousedown", mouseClickDown)
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
	ctx = canvas.getContext("2d");

	drawCircle(ctx);
	radius += 10;
	requestAnimationFrame(drawStuff);
}

function mouseClickDown(event){
	var clickX = event.pageX;
	var clickY = event.pageY;
	var point = [clickX,clickY];
	socket.emit('mouseClick', point);
}