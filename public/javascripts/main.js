function main(){
	canvas = gf.fullCanvas();
	if (canvas.width>1500 && canvas.height>800){
		canvas.setBackgroundColor('#909090');
		canvas.createBackground();
		init()
	} else {
		canvas.setBackgroundColor('#909090');
		canvas.createBackground();
		canvas.setPenColor('#E60000')
		var fontSize = canvas.width/12
		var font = 'Bold ' + fontSize.toString() + 'px Arial'
		canvas.setFont(font)
		canvas.drawText('Please resize the Screen', canvas.width/75,canvas.height/2)
	}
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
	var lastBut = '';
	function startScreenHoverEffect(event){
		var mx = event.pageX;
		var my = event.pageY;
		var point = [mx, my];
		if (rect1.checkInside(point)){
			canvas.undraw(rect1)
			canvas.setPenColor('#656565')
			canvas.drawRect(canvas.width/2-94, 260, 190, 51);
			canvas.setPenColor('#000000')
			canvas.setFont('Bold 24px Arial')
			canvas.drawText('Single Player', canvas.width/2-75, 300-7.5)
		} else if (rect2.checkInside(point)){
			canvas.undraw(rect2)
			canvas.setPenColor('#656565')
			canvas.drawRect(canvas.width/2-94, rect2.point1[1]-10, 190, 51);
			canvas.setPenColor('#000000')
			canvas.setFont('Bold 24px Arial')
			canvas.drawText('Multi-Player', canvas.width/2-67, 360-7.5)
		} else if (rect3.checkInside(point)){
			canvas.undraw(rect3)
			canvas.setPenColor('#656565')
			canvas.drawRect(canvas.width/2-94, rect3.point1[1]-10, 190, 51);
			canvas.setPenColor('#000000')
			canvas.setFont('Bold 24px Arial')
			canvas.drawText('Leaderboard', canvas.width/2-70, 410+2.5)
		} else if (rect4.checkInside(point)){
			canvas.undraw(rect4)
			canvas.setPenColor('#656565')
			canvas.drawRect(canvas.width/2-94, rect4.point1[1]-10, 190, 51);
			canvas.setPenColor('#000000')
			canvas.setFont('Bold 24px Arial')
			canvas.drawText('Help', canvas.width/2-24, 470+2.5)
		} else {
			canvas.setPenColor(canvas.backgroundColor)
			canvas.drawRect(canvas.width/2-94, 260, 190, 51);
			canvas.drawRect(canvas.width/2-94, 320, 190, 51);
			canvas.drawRect(canvas.width/2-94, 380, 190, 51);
			canvas.drawRect(canvas.width/2-94, 440, 190, 51);
			canvas.setPenColor('#656565')
			canvas.drawRect(canvas.width/2-90, 270, 180, 48);
			canvas.drawRect(canvas.width/2-90, 330, 180, 48);
			canvas.drawRect(canvas.width/2-90, 390, 180, 48);
			canvas.drawRect(canvas.width/2-90, 450, 180, 48);
			canvas.setPenColor('#000000')
			canvas.setFont('Bold 24px Arial')
			canvas.drawText('Single Player', canvas.width/2-75, 300)
			canvas.drawText('Multi-Player', canvas.width/2-67, 360)
			canvas.drawText('Leaderboard', canvas.width/2-70, 420)
			canvas.drawText('Help', canvas.width/2-24, 480)
		}
	}
	canvas.paper.addEventListener("mousemove", startScreenHoverEffect);
	canvas.paper.addEventListener("mousedown", function startScreenClick(event){
		var clickX = event.pageX;
  		var clickY = event.pageY;
  		var point = [clickX,clickY];
  		if (rect1.checkInside(point)){
  			console.log('Single Player');
    		canvas.paper.removeEventListener("mousedown", startScreenClick)
    		canvas.paper.removeEventListener("mousemove", startScreenHoverEffect)
    		var setupScreen = drawSinglePlayerSetup()
    		canvas.paper.addEventListener("mousemove", function(event){ setupScreenHoverEffect(event, setupScreen) })
    		canvas.paper.addEventListener("mousedown", function(event){ setupScreenClick(event, setupScreen) })
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

function setupScreenHoverEffect(event, disp){
	var mx = event.pageX;
	var my = event.pageY;
	var point = [mx,my];
	if (disp.diff.easy[1].checkInside(point)){
		canvas.undraw(disp.diff.easy[1])
		canvas.setPenColor(disp.diff.easy[1].color)
		canvas.drawRect(disp.diff.easy[1].point1[0]-4, disp.diff.easy[1].point1[1]-10, disp.diff.easy[1].width+10, disp.diff.easy[1].height+3)
		canvas.setPenColor(disp.diff.easy[0].color)
		canvas.drawText(disp.diff.easy[0].text, disp.diff.easy[0].point[0], disp.diff.easy[0].point[1]-7.5)
	} else if (disp.diff.med[1].checkInside(point)){
		canvas.undraw(disp.diff.med[1])
		canvas.setPenColor(disp.diff.med[1].color)
		canvas.drawRect(disp.diff.med[1].point1[0]-4, disp.diff.med[1].point1[1]-10, disp.diff.med[1].width+10, disp.diff.med[1].height+3)
		canvas.setPenColor(disp.diff.med[0].color)
		canvas.drawText(disp.diff.med[0].text, disp.diff.med[0].point[0], disp.diff.med[0].point[1]-7.5)
	} else if (disp.diff.hard[1].checkInside(point)){
		canvas.undraw(disp.diff.hard[1])
		canvas.setPenColor(disp.diff.hard[1].color)
		canvas.drawRect(disp.diff.hard[1].point1[0]-4, disp.diff.hard[1].point1[1]-10, disp.diff.hard[1].width+10, disp.diff.hard[1].height+3)
		canvas.setPenColor(disp.diff.hard[0].color)
		canvas.drawText(disp.diff.hard[0].text, disp.diff.hard[0].point[0], disp.diff.hard[0].point[1]-7.5)
	}  else if (disp.diff.expert[1].checkInside(point)){
		canvas.undraw(disp.diff.expert[1])
		canvas.setPenColor(disp.diff.expert[1].color)
		canvas.drawRect(disp.diff.expert[1].point1[0]-4, disp.diff.expert[1].point1[1]-10, disp.diff.expert[1].width+10, disp.diff.expert[1].height+3)
		canvas.setPenColor(disp.diff.expert[0].color)
		canvas.drawText(disp.diff.expert[0].text, disp.diff.expert[0].point[0], disp.diff.expert[0].point[1]-7.5)
	} else {
		canvas.setPenColor(canvas.backgroundColor)
		canvas.drawRect(disp.diff.easy[1].point1[0]-5, disp.diff.easy[1].point1[1]-10, disp.diff.easy[1].width+11, disp.diff.easy[1].height+10)
		canvas.drawRect(disp.diff.med[1].point1[0]-5, disp.diff.med[1].point1[1]-10, disp.diff.med[1].width+11, disp.diff.med[1].height+10)
		canvas.drawRect(disp.diff.hard[1].point1[0]-5, disp.diff.hard[1].point1[1]-10, disp.diff.hard[1].width+11, disp.diff.hard[1].height+10)
		canvas.drawRect(disp.diff.expert[1].point1[0]-5, disp.diff.expert[1].point1[1]-10, disp.diff.expert[1].width+11, disp.diff.expert[1].height+10)
		drawDifficultyButtons(canvas)
	}
}

function setupScreenClick(event, disp){
	var clickX = event.pageX;
	var clickY = event.pageY;
	var point  = [clickX, clickY];
	if (disp.diff.easy[1].checkInside(point)){
		console.log('Difficulty: Easy')
	}
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