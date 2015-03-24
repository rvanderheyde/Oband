function init(){
	canvas = document.getElementById("blankSpace");
	canvas.width = $(window).width()-20;
	canvas.height = $(window).height()-20;
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(95,50,40,0,2*Math.PI);
	ctx.stroke();
  var rec = canvas.getContext("2d");
  rec.fillStyle = "#FF0000";
  rec.fillRect(250,250,250,175);
}