function drawSinglePlayerSetup(){
	canvas.createBackground()
	canvas.setPenColor('#656565')
	var rect1 = canvas.drawRect(canvas.width/48, 158, 150, 48)
	var rect2 = canvas.drawRect(canvas.width/48, 218, 150, 48)
	var rect3 = canvas.drawRect(canvas.width/48, 278, 150, 48)
	var rect4 = canvas.drawRect(canvas.width/48, 338, 150, 48)
	var rect5 = canvas.drawRect(canvas.width/6+20, 158, 240, 48)
	var rect6 = canvas.drawRect(canvas.width/6+20, 218, 240, 48)
	var rect7 = canvas.drawRect(canvas.width/6+20, 278, 240, 48)
	var rect8 = canvas.drawRect(canvas.width/6+20, 338, 240, 48)
	canvas.setPenColor('#000000')
	canvas.setFont('Bold 64px Arial')
	canvas.drawText('Setup', canvas.width/2-96,64)
	canvas.setFont('Bold 32px Arial')
	canvas.drawText('Difficulty', canvas.width/48, 128)
	canvas.drawText('Instruments', canvas.width/6+40, 128)
	canvas.drawText('Songs', canvas.width/2+20, 128)
	canvas.setFont('Bold 24px Arial')
	var but1 = canvas.drawText('Easy', canvas.width/24+15, 188)
	var but2 = canvas.drawText('Medium', canvas.width/24, 248)
	var but3 = canvas.drawText('Hard', canvas.width/24+15, 308)
	var but4 = canvas.drawText('Expert', canvas.width/24+5, 368)
	var intr1 = canvas.drawText('Guitar', canvas.width/6+30, 188)
	var intr2 = canvas.drawText('Bass', canvas.width/6+30, 248)
	var intr3 = canvas.drawText('Piano', canvas.width/6+30, 308)
	var intr4 = canvas.drawText('Drums', canvas.width/6+30, 368)
	return {easy: [but1, rect1],
			med: [but2, rect2],
			hard: [but3, rect3],
			expert: [but4, rect4],
			guitar: [intr1, rect5],
			bass: [intr2, rect6],
			piano: [intr3, rect7],
			drums: [intr4, rect8]
			}
}