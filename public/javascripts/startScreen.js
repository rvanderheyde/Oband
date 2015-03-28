function drawStartScreen(){
	ctx.fillStyle = "#909090";
	ctx.fillRect(0,0,width,height);
	ctx.fillStyle = "#656565";
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
	canvas.addEventListener("mousedown", startScreenClick)	
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

function drawSinglePlayerSetup(){
  ctx.fillStyle = "#909090";
  ctx.fillRect(0,0,width,height);
  ctx.fillStyle = "#656565";
  // ctx.fillRect(width/6-)
}

function checkInBox(point, rect1, rect2){
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