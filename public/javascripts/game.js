var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

var KEY = {
    BACKSPACE: 8,
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    SPACE:    32,
    PAGEUP:   33,
    PAGEDOWN: 34,
    END:      35,
    HOME:     36,
    LEFT:     37,
    UP:       38,
    RIGHT:    39,
    DOWN:     40,
    INSERT:   45,
    DELETE:   46,
    ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
    A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
    TILDA:    192
};
var Global = { song:{} };
var now, dt;
var last = timestamp();
var step = 1/60;
var score = 0;

var input = {a: false, s: false, d: false, f: false, g:false}

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function songFinished(songObj){
	if(songObj.song.length !== 0){
		return false;
	} else {
		return true;
	}
}

function onKey(ev, key, pressed){
	switch(key){
		case KEY.A: input.a = pressed; break;
		case KEY.S: input.s = pressed; break;
		case KEY.D: input.d = pressed; break;
		case KEY.F: input.f = pressed; break;
		case KEY.G: input.g = pressed; break;
	}
}

function update(dt){
	var song = Global.song;
	for(var i = 0; i<song.length; i++){
		if(song[i].time < 0){
			var note = song.shift()
			for(var i=0; i<note.length; i++){
				if (note.keys[i] === 'A' && input.a){
					score += 10;
				} else if (note.keys[i] === 'S' && input.s){
					score += 10;
				} else if (note.keys[i] === 'D' && input.d){
					score += 10;
				} else if (note.keys[i] === 'F' && input.f){
					score += 10;
				} else if (note.keys[i] === 'G' && input.g){
					score += 10;
				} else {
					if (input.a || input.s || input.d || input.f || input.g){
						score -= 5;
					} else {
						score -= 2;
					}
				}
			}
			//Update scores on all cleints via sockets here. 
		} else {
			song[i].time -= dt;
		}
	}
	Global.song = song;
}

function render(dt){
	canvas.setBackgroundColor('#999999');
	canvas.createBackground()
	canvas.setPenColor('#656565')
	canvas.drawRect(canvas.width*.125, canvas.height*.05, canvas.width*.5, canvas.height*.9)
	canvas.setPenColor('#000000')
	canvas.drawLine(canvas.width*.125, canvas.height*.8, canvas.width*.625, canvas.height*.8)
	canvas.setPenColor('#444444')
	for(var i=0; i<Global.song.length; i++){
		var note = Global.song[i]
		if ()
	}

}




function mainGame(songObj){
	if(!songFinished(songObj)){
		now = timestamp();
		dt = dt + Math.min(1, (now - last) / 1000);
		while(dt > step) {
    		dt = dt - step;
    		update(step);
  		}
		render(dt)
		last = now;
		requestAnimationFrame(function(){ mainGame(songObj) })
	}
}
// var socket = io(); call this to connect

function playGame(songObj){
	canvas = gf.fullCanvas();
	Global.song = songObj;
	document.addEventListener('keydown', function(ev){ onKey(ev, ev.keyCode, true), false})
	document.addEventListener('keyup', function(ev){ onKey(ev, ev.keyCode, false), false})
	requestAnimationFrame(function(){ mainGame(songObj) })
}

function main(){
	var songObj = { song: [{time: .45, notes:['A']},{time: 2.1, notes:['A','S']},]}
	playGame(songObj)
}




