//Global stuff
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
var now; 
var dt =0;
var last = timestamp();
var step = 1/60;
var score = 0;

var input = {a: false, s: false, d: false, f: false, g:false}

function timestamp() {
  //find how time delay is between frame updates
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function songFinished(songObj){
  //check if song is over
  if(songObj.song.length !== 0){
    return false;
  } else {
    return true;
  }
}

function onKey(ev, key, pressed){
  //set input based on key response
  switch(key){
    case KEY.A: input.a = pressed; break;
    case KEY.S: input.s = pressed; break;
    case KEY.D: input.d = pressed; break;
    case KEY.F: input.f = pressed; break;
    case KEY.G: input.g = pressed; break;
  }
}

function update(dt){
  //change the game state based on time, User input
  var song = Global.song.song;
  for(var i = 0; i<song.length; i++){
    if(song[i].time < 100){
      var note = song.shift()
      for(var j=0; j<note.keys.length; j++){
        console.log(input)
        if (note.keys[j] === 'A' && input.a){
          score += 10;
          alert('SCORE 1')
        } else if (note.keys[j] === 'S' && input.s){
          score += 10;
          alert('SCORE 2')
        } else if (note.keys[j] === 'D' && input.d){
          score += 10;
        } else if (note.keys[j] === 'F' && input.f){
          score += 10;
        } else if (note.keys[j] === 'G' && input.g){
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
  Global.song.song = song;
}
var loop = 0;

function render(){
  //draws the game state on screen
  canvas.setBackgroundColor('#999999');
  canvas.createBackground()
  canvas.setPenColor('#656565')
  canvas.drawRect(canvas.width*.125, canvas.height*.05, canvas.width*.5, canvas.height*.9)
  canvas.setPenColor('#000000')
  canvas.drawLine(canvas.width*.125, canvas.height*.8, canvas.width*.625, canvas.height*.8)
  canvas.setPenColor('#440044')
  for(var i=0; i<Global.song.song.length; i++){
    var note = Global.song.song[i]
    for(var j=0; j<note.keys.length; j++){
      if (note.keys[j] === 'A'){
        var dx = timeToX(note.time)
        canvas.drawRect(canvas.width*.225,(5000-note.time)/6250*canvas.height ,50,50) 
      }
      if (note.keys[j] === 'S'){
        var dx = timeToX(note.time)
        canvas.drawRect(canvas.width*.325,(5000-note.time)/6250*canvas.height ,50,50) 
      }
    }
  }
  var str = loop.toString()
  canvas.drawText(str, canvas.width*.75, canvas.height*.5)
  loop += 1;

}

function timeToX(time){
  //turn time on range 0-5000 to x. 
  //5000 = 0
  //0 = canvas.height*.8
  return (5000-time)/6250*canvas.height 
}


function mainGame(songObj){
  //game loop function
  if(!songFinished(songObj)){
    now = timestamp();
    dt += Math.min(1000, (now - last));
    while(dt > step) {
        dt -= step;
        update(step);
      }
    render(dt)
    last = now;
    requestAnimationFrame(function(){ mainGame(songObj) })
  }
}

function playGame(songObj){
  //function that starts the game
  canvas = gf.fullCanvas();
  Global.song = songObj;
  document.addEventListener('keydown', function(ev){ onKey(ev, ev.keyCode, true), false})
  document.addEventListener('keyup', function(ev){ onKey(ev, ev.keyCode, false), false})
  requestAnimationFrame(function(){ mainGame(songObj) })
}

function main(){
  //test function
  var songObj = { song: [{time: 5000, keys:['A']},{time: 10000, keys:['A','S']},]}
  playGame(songObj)
}




