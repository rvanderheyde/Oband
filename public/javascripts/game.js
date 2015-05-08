//Global stuff
var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
//Key number mapping
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
//make the song object global
var Global = { song:{} };
//variables used in loop timing
var now; 
var dt =0;
var last = timestamp();
var step = 1/60;
//Score variable used in update and render
var score = 0;
//object of hit inputs
var input = {a: false, s: false, d: false, f: false, g:false}
//------------------------------------------------------------------
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

//list of notes hit in a loop
var hit = {}

function update(dt){
  //reset hit list
  //change the game state based on time, User input
  for(var i = 0; i<Global.song.song.length; i++){
    if (Global.song.song[i].time <-1000){ Global.song.song.splice(i,1) }
    if(Global.song.song[i].time < -5){
      Global.song.song[i].time -= dt;
      var note = Global.song.song[i]
      for(var j=0; j<note.keys.length; j++){
        if (note.keys[j] === 'A' && input.a){
          score += 10;
          Global.song.song.splice(i,1)
          if (hit[note.time]){
            hit[note.time] += 'a'
          } else {
            hit[note.time] = 'a'
          }
          // alert('SCORE 1')
        } else if (note.keys[j] === 'S' && input.s){
          score += 10;
          Global.song.song.splice(i,1)
          if (hit[note.time]){
            hit[note.time] += 's'
          } else {
            hit[note.time] = 's'
          }
        } else if (note.keys[j] === 'D' && input.d){
          score += 10;
          Global.song.song.splice(i,1)
          if (hit[note.time]){
            hit[note.time] += 'd'
          } else {
            hit[note.time] = 'd'
          }
        } else if (note.keys[j] === 'F' && input.f){
          score += 10;
          Global.song.song.splice(i,1)
          if (hit[note.time]){
            hit[note.time] += 'f'
          } else {
            hit[note.time] = 'f'
          }
        } else if (note.keys[j] === 'G' && input.g){
          score += 10;
          Global.song.song.splice(i,1)
          if (hit[note.time]){
            hit[note.time] += 'g'
          } else {
            hit[note.time] = 'g'
          }
        } else {
          if (input.a || input.s || input.d || input.f || input.g){
            score -= 10;
          } else {
            score -= 5;
          }
        }
      }
      //Update scores on all cleints via sockets here. 
    } else {
      Global.song.song[i].time -= dt;
    }
  }
  // console.log(score)
  // Global.song.song = song;
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
    drawGame(dt)
    // renderV2()
    last = now;
    requestAnimationFrame(function(){ mainGame(songObj) })
  }
}

function playGame(songObj){
  //function that starts the game
  $('#content').remove()
  canvas = gf.fullCanvas();
  Global.song = songObj;
  //event listening for keyboard inputs
  document.addEventListener('keydown', 
        function(ev){ onKey(ev, ev.keyCode, true)}, false);
  document.addEventListener('keyup', 
        function(ev){ onKey(ev, ev.keyCode, false)}, false);
  //start game loop 
  requestAnimationFrame(function(){ mainGame(songObj) })
}

function main(){
  //test function
  var songObj = { song: [{time: 3000, keys:['A']},{time: 10000, keys:['A','S']},]}
  playGame(songObj)
}

function drawGame(dt){
  //draws the game on its own coordinate system
  var width = canvas.width/2;
  var height = canvas.height;
  var originX = canvas.width/4;
  //draw background
  canvas.setPenColor('#656565');
  canvas.drawRect(originX,0,width,height);
  canvas.setPenColor('#000000');
  canvas.drawLine(originX,height-.1*width,width+originX,height-.1*width);
  //loop and draw notes
  for(var i=0; i<Global.song.song.length; i++){
    var note = Global.song.song[i];
    for(var j=0; j<note.keys.length; j++){
      if (note.keys[j] === 'A'){
        canvas.drawFilledCirc(.1*width+originX, (-note.time+3000)/(height+3000)*height, .09*width,'#FF0000');
      }
      if (note.keys[j] === 'S'){
        canvas.drawFilledCirc(.3*width+originX, (3000-note.time)/(height+3000)*height, .09*width,'#0000FF');
      }
      if (note.keys[j] === 'D'){
        canvas.drawFilledCirc(.5*width+originX, (3000-note.time)/(height+3000)*height, .09*width,'#00FF00');
      }
      if (note.keys[j] === 'F'){
        canvas.drawFilledCirc(.7*width+originX, (3000-note.time)/(height+3000)*height, .09*width,'#FFFF00');
      }
      if (note.keys[j] === 'G'){
        canvas.drawFilledCirc(.9*width+originX, (3000-note.time)/(height+3000)*height, .09*width,'#FF00FF');
      }
    }
  }
  canvas.setPenColor('#FF0000');
  canvas.drawRect(.1*canvas.width, .47*height, 100, 30);
  var attr = Object.keys(hit);
  for(var k=attr.length-1; k>=0; k--){  
    canvas.setPenColor('#000000');
    canvas.drawText('A HIT', .1*canvas.width, .5*height);
    var str = hit[attr[k]];
    for(var i=0; i<str.length; i++){
      if (str[i] === 'a'){
        canvas.drawText('A', .15*canvas.width, .5*height)
        canvas.drawFilledCirc(.1*width+originX, -.09*width+height, .09*width,'#000000');
      }
      if (str[i] === 's'){
        canvas.drawText('S', .15*canvas.width, .5*height)
        canvas.drawFilledCirc(.3*width+originX, -.09*width+height, .09*width,'#000000');
      }
      if (str[i] === 'd'){
        canvas.drawText('D', .15*canvas.width, .5*height)
        canvas.drawFilledCirc(.5*width+originX, -.09*width+height, .09*width,'#00FF00');
      }
      if (str[i] === 'f'){
        canvas.drawText('F', .15*canvas.width, .5*height)
        canvas.drawFilledCirc(.7*width+originX, -.09*width+height, .09*width,'#FFFF00');
      }
      if (str[i] === 'g'){
        canvas.drawText('G', .15*canvas.width, .5*height)
        canvas.drawFilledCirc(.9*width+originX, -.09*width+height, .09*width,'#FF00FF');
      }
    }
    
  }
  
  //draw score
  canvas.setPenColor('#2222FF')
  canvas.drawRect(.75*canvas.width, .45*height, 50, 50)
  var str = score.toString()
  canvas.setPenColor('#000000')
  canvas.drawText(str, .75*canvas.width, .5*height)
  //hit animation
  // for(var k=0; k<hit.length; k++){
  
  // }
  // hit = []
}

function renderV2(){
  //different view style IN PROGRESS
  var width = canvas.width/2
  var height = canvas.height
  var originX = canvas.width/4
  canvas.setPenColor('#656565');
  canvas.context.fillStyle = '#AA22AA'
  canvas.context.moveTo(originX,0)
  canvas.context.lineTo(originX+width/10, 0)
  canvas.context.lineTo(originX+width,height)
  canvas.context.lineTo(originX,height)
  canvas.context.lineTo(originX,0)
  canvas.context.stroke()
  canvas.context.fill()
}

