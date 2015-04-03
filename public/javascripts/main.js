function main(){
	canvas = gf.fullCanvas();
	canvas.setBackgroundColor('#909090');
	canvas.createBackground();
	init()
}

function init(){
	canvas.setPenColor('#656565')
	var rect1 = canvas.drawRect(canvas.width/2-90, 270, 180, 48);
	var rect2 = canvas.drawRect(canvas.width/2-90, 330, 180, 48);
	var rect3 = canvas.drawRect(canvas.width/2-90, 390, 180, 48);
	var rect4 = canvas.drawRect(canvas.width/2-90, 450, 180, 48);
	canvas.setPenColor('#000000')
	canvas.setFont('Bold 128px Arial')
	var title = canvas.drawText('OBand', canvas.width/2-200, 228)
	canvas.setFont('Bold 24px Arial')
	var text1 = canvas.drawText('Single Player', canvas.width/2-75, 300)
	var text2 = canvas.drawText('Multi-Player', canvas.width/2-67, 360)
	var text3 = canvas.drawText('Leaderboard', canvas.width/2-70, 420)
	var text3 = canvas.drawText('Help', canvas.width/2-24, 480)
	canvas.paper.addEventListener("mousedown", function startScreenClick(event){
		var clickX = event.pageX;
  		var clickY = event.pageY;
  		var point = [clickX,clickY];
  		if (rect1.checkInside(point)){
  			console.log('Single Player');
    		canvas.paper.removeEventListener("mousedown", startScreenClick)
    		var setupScreen = drawSinglePlayerSetup()
  		}
  		if (rect2.checkInside(point)){
  			console.log('Multi-Player')
    		canvas.paper.removeEventListener("mousedown", startScreenClick)
    		//drawMultiPlayerLobby()
  		}
  		if (rect3.checkInside(point)){
  			console.log('Leaderboard')
  			canvas.paper.removeEventListener("mousedown", startScreenClick)
  		}
  		if (rect4.checkInside(point)){
  			console.log('help')
  		}
	})
}

function drawSongListArea(){
	$.get('songs').done(onSuccess).error(onError)
}

function onSuccess(data, status){

}

function onError(data, status){
	console.log(data);
	console.log(status);
}