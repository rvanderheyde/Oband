var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

var height = $(window).height()-5;
var width = $(window).width()-5;
var socket = io();

function init(){
	canvas = document.getElementById("blankSpace");
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");

	drawStartScreen()
	canvas.addEventListener("mousedown", mouseClickDown)
}

function drawStartScreen(){
	ctx.fillStyle = "#909090";
  	ctx.fillRect(0,0,width,height);
  	ctx.fillStyle = "#656565"
  	ctx.fillRect(width/2-90,270,180, 45)
  	ctx.fillRect(width/2-90, 320,180, 45)
  	ctx.fillRect(width/2-90,370,180, 45)
  	ctx.fillStyle = "#000000"
  	ctx.font = "Bold 128px Arial"
  	ctx.fillText('Oband', width/2-200, 228)
  	ctx.font = "Bold 24px Arial"
  	ctx.fillText('Single Player', width/2-75, 300)
  	ctx.fillText('Multi-Player', width/2-67, 350)
  	ctx.fillText('Help', width/2-24, 400)
  	
}

function mouseClickDown(event){
	var clickX = event.pageX;
	var clickY = event.pageY;
	var point = [clickX,clickY];

}