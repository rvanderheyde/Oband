function main(){
	canvas = gf.fullCanvas();
	canvas.setBackgroundColor('#909090');
	canvas.createBackground();
	drawStartScreen()
}

function drawStartScreen(){
	canvas.setPenColor('#656565')
	var rect1 = canvas.drawRect(canvas.width/2-90, 270, 180, 45);
	var rect1 = canvas.drawRect(canvas.width/2-90, 320, 180, 45);
	var rect1 = canvas.drawRect(canvas.width/2-90, 370, 180, 45);
	canvas.setPenColor('#000000')
	canvas.setFont('Bold 128px Arial')
	canvas.drawText('Oband', canvas.width/2-200, 228)
	canvas.setFont('Bold 24px Arial')
	canvas.drawText('Single Player', canvas.width/2-75, 300)
	canvas.drawText('Multi-Player', canvas.width/2-67, 350)
	canvas.drawText('Help', canvas.width/2-24, 400)
	canvas.paper.addEventListener("mousedown", startScreenClick)
}

function startScreenClick(event){
  var clickX = event.pageX;
  var clickY = event.pageY;
  var point = [clickX,clickY];
  if (checkInBox(point,[width/2-90, 270],[width/2+90, 315])){
    console.log('Single Player');
    canvas.removeEventListener("mousedown", startScreenClick)
    //drawSinglePlayerSetup()
  }
  if (checkInBox(point,[width/2-90, 320],[width/2+90, 365])){
    console.log('Multi-Player')
    canvas.removeEventListener("mousedown", startScreenClick)
    //drawMultiPlayerLobby()
  }
  if (checkInBox(point,[width/2-90, 370],[width/2+90, 415])){
    console.log('Help')
    //Something help related
  }
}
