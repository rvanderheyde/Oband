function init(){
	canvas = document.getElementById("blankSpace");
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(95,50,40,0,2*Math.PI);
	ctx.stroke();
}