function drawSinglePlayerSetup(){
	//function that calls the other draw functions
	canvas.createBackground()
	drawTitles(canvas)
	var difficultyButtons = drawDifficultyButtons(canvas)
	var instrumentButtons = drawInstrumentButtons(canvas)
	drawSongSpace(canvas)
	drawBottomButtons(canvas)
	
	return {diff: difficultyButtons,
			instr: instrumentButtons
			}
}

function drawDifficultyButtons(canvas){
	//takes the canvas and returns the rect and text
	canvas.setPenColor('#656565')
	var rect1 = canvas.drawRect(canvas.width/48, 158, canvas.width*.098, 48)
	var rect2 = canvas.drawRect(canvas.width/48, 218, 150, 48)
	var rect3 = canvas.drawRect(canvas.width/48, 278, 150, 48)
	var rect4 = canvas.drawRect(canvas.width/48, 338, 150, 48)
	canvas.setPenColor('#000000')
	canvas.setFont('Bold 24px Arial')
	var but1 = canvas.drawText('Easy', canvas.width/24+15, 188)
	var but2 = canvas.drawText('Medium', canvas.width/24, 248)
	var but3 = canvas.drawText('Hard', canvas.width/24+15, 308)
	var but4 = canvas.drawText('Expert', canvas.width/24+5, 368)
	return {easy: [but1, rect1],
			med: [but2, rect2],
			hard: [but3, rect3],
			expert: [but4, rect4]}
}

function drawInstrumentButtons(canvas){
	//takes the canvas and returns the rect and text
	canvas.setPenColor('#656565')
	var rect5 = canvas.drawRect(canvas.width/6+20, 158, 240, 48)
	var rect6 = canvas.drawRect(canvas.width/6+20, 218, 240, 48)
	var rect7 = canvas.drawRect(canvas.width/6+20, 278, 240, 48)
	var rect8 = canvas.drawRect(canvas.width/6+20, 338, 240, 48)
	canvas.setPenColor('#000000')
	canvas.setFont('Bold 24px Arial')
	var intr1 = canvas.drawText('Guitar', canvas.width/6+30, 188)
	var intr2 = canvas.drawText('Bass', canvas.width/6+30, 248)
	var intr3 = canvas.drawText('Piano', canvas.width/6+30, 308)
	var intr4 = canvas.drawText('Drums', canvas.width/6+30, 368)
	return {guitar: [intr1, rect5],
			bass: [intr2, rect6],
			piano: [intr3, rect7],
			drums: [intr4, rect8]}
}

function drawSongSpace(canvas){
	canvas.setPenColor('#787878')
	var rect1 = canvas.drawRect(canvas.width/6+260+canvas.width/8.41/2, 158, canvas.width*5/8-canvas.width/24, canvas.height/2)
	canvas.setPenColor('#656565')
}

function drawBottomButtons(canvas){
	canvas.setPenColor('#656565')
	var rec1 = canvas.drawRect(canvas.width*7/8, canvas.height*7/8, canvas.width/10, canvas.height/16)
	var rec2 = canvas.drawRect(canvas.width*7/8, canvas.height*3/4, canvas.width/10, canvas.height/16)
	canvas.setPenColor('#000000')
	canvas.setFont('Bold 24px Arial')
	var text1 = canvas.drawText('START', canvas.width*115/128, canvas.height*235/256)
	var text1 = canvas.drawText('Add Song', canvas.width*455/512, canvas.height*(235/256-1/8))
}

function drawTitles(canvas){
	//draws the text titles
	canvas.setPenColor('#000000')
	canvas.setFont('Bold 64px Arial')
	canvas.drawText('Setup', canvas.width/2-96,64)
	canvas.setFont('Bold 32px Arial')
	canvas.drawText('Difficulty', canvas.width/48, 128)
	canvas.drawText('Instruments', canvas.width/6+40, 128)
	canvas.drawText('Songs', canvas.width/2+20, 128)	
}