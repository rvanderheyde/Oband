var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
var radius = 10;

function init(){
	canvas = document.getElementById("blankSpace");
	canvas.width = $(window).width()-20;
	canvas.height = $(window).height()-20;
  	drawStuff();
}

function drawCircle(ctx){
	ctx.beginPath();
	ctx.arc(95,50,radius,0,2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	radius += 10;
}

function drawRectangle(ctx){
	ctx.fillStyle = "#FF0000";
  	ctx.fillRect(250,250,250,175);
}

function drawStuff(){
	ctx = canvas.getContext("2d");

	drawCircle(ctx);
	drawRectangle(ctx);
	requestAnimationFrame(drawStuff);
}