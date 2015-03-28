//using gf.js to make view
var x = 1510/2-90
var y = 270
var oscilate = true;
var theta = 0;

function main(){
	var canvas = gf.fullCanvas();
	canvas.paper.addEventListener('mousedown',mouse)
	canvas.setBackgroundColor('#656565');
	canvas.createBackground();
	var rect1 = canvas.drawRect(x,y, 180, 45);
	drawShit(canvas, rect1)
}

function drawShit(canvas, obj){
	if (oscilate){
		x = 50*Math.cos(theta);
		theta+=.1;
		canvas.move(obj, x, 0)
		canvas.animate(drawShit, obj)
	} else {
		y = 50*Math.cos(theta);
		theta+=1;
		canvas.move(obj, 0, y)
		canvas.animate(function(){drawShit(canvas, obj)})
	}
	
}

function mouse(){
	console.log('click')
	oscilate = !oscilate
}

function wrapper(){
	canvas.animate(wrapper)
}