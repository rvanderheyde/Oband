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
var prevTime = 0;
var time = 0;
//make the song object global
var Global = { song:{} };
var keyDown = false;
var keyCount = 0;
//variables used in loop timing
var now; 
var dt =0;
var last = timestamp();
var step = 1/60;
//Score variable used in update and render
var score = 0;
var oppScore = 0;
var noteCounter = 0;
var hitNotes = 0;
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

function onKeyDown(ev, key, pressed){
  keyDown = true;
  keyCount+=1;
  //set input based on key response
  switch(key){
    case KEY.A: input.a = pressed; break;
    case KEY.S: input.s = pressed; break;
    case KEY.D: input.d = pressed; break;
    case KEY.F: input.f = pressed; break;
    case KEY.G: input.g = pressed; break;
  }
}
function onKeyUp(ev, key, pressed){
  keyDown = false;
  keyCount = 0;
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
var hit = []

function update(dt){
  //reset hit list
  //change the game state based on time, User input
  if(Global.song.song.length!=0){
    for(var i = 0; i<Global.song.song.length; i++){
      //remove the note after a while
      if (Global.song.song[i].time <-250){ Global.song.song.splice(i,1) }
      //check if user has hit note at proper time
      else if(Global.song.song[i].time < 10 && Global.song.song[i].time > -10){
        Global.song.song[i].time -= dt;
        var note = Global.song.song[i]
        for(var j=0; j<note.keys.length; j++){
          if (note.keys[j] === 'A' && input.a && keyCount<=1){
            //add to score
            score += 10;
            //remove note if hit
            Global.song.song.splice(i,1)
            //add to hit list for hit animation in render function. 
            hit.push('a')
            hitNotes += 1;
          } else if (note.keys[j] === 'S' && input.s && keyCount<=1){
            score += 10;
            Global.song.song.splice(i,1)
            hit.push('s')
            hitNotes += 1;
          } else if (note.keys[j] === 'D' && input.d && keyCount<=1){
            score += 10;
            Global.song.song.splice(i,1)
            hit.push('d')
            hitNotes += 1;
          } else if (note.keys[j] === 'F' && input.f && keyCount<=1){
            score += 10;
            Global.song.song.splice(i,1)
            hit.push('f')
            hitNotes += 1;
          } else if (note.keys[j] === 'G' && input.g && keyCount<=1){
            score += 10;
            Global.song.song.splice(i,1)
            hit.push('g')
            hitNotes += 1;
          }
        }
        //Update scores on all cleints via sockets here. 
      } else {
        Global.song.song[i].time -= dt;
      }
    }
    if (info.mode === 'online') {
      time = millis()
      if (time - prevTime >= 1000) {
        // console.log(time);
        prevTime = time;
        socket.emit('scoreUpdate', info.room, score, time);
      }
    }
  }
}

function mainGame(songObj){
  //game loop function
  if(!songFinished(Global.song) && !audio.ended){
    now = timestamp();
    dt += Math.min(1000, (now - last));
    while(dt > step) {
        //to keep processing at 60fps
        dt -= step;
        update(step);
      }
    drawGame(dt)
    // renderV2()
    last = now;
    requestAnimationFrame(function(){ mainGame(Global.song) })
  } else {
    //post score to server
    console.log(info.mode);
    $.post('endGame', {score: score, oppScore: oppScore, number: noteCounter, mode: info.mode, song: info.song})
      .done(function(data) {
        //load after game screen
        $.get('end', data)
          .success(function(data) {
            console.log(data);
            $('body').html(data);
          })
          .error(onError);
      })
      .error(function() { 
        alert("Failed to submit score!");
      });
  }
}
function mainGameTest(songObj){
  //game loop function test
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
  } 
}
function playGame(songObj){
  //function that starts the game
  $('#content').remove()
  audio = document.createElement('audio');
  audio.src = songObj.track;
  canvas = gf.fullCanvas();
  Global.song = songObj;
  for(var i = 0; i<Global.song.song.length; i++){
    for(var j=0; j<Global.song.song[i].keys.length; j++){
      noteCounter += 1;
    }
  }
  console.log(noteCounter);
  console.log(Global.song.song[Global.song.song.length-1]);
  //event listening for keyboard inputs
  document.addEventListener('keydown', 
        function(ev){ onKeyDown(ev, ev.keyCode, true)}, false);
  document.addEventListener('keyup', 
        function(ev){ onKeyUp(ev, ev.keyCode, false)}, false);
  //start game loop 
  audio.play();
  // audio.onended= function() {
  //   alert("The audio has ended");
  // };
  // commented out hacky fix for quick testing
  // songObj = {song:[]};
  // Global.song = {song:[]};
  requestAnimationFrame(function(){ mainGame(songObj) })
}
function playGameTest(songObj){
  //function that starts the game test
  $('#content').remove()
  canvas = gf.fullCanvas();
  Global.song = songObj;
  //event listening for keyboard inputs
  document.addEventListener('keydown', 
        function(ev){ onKey(ev, ev.keyCode, true)}, false);
  document.addEventListener('keyup', 
        function(ev){ onKey(ev, ev.keyCode, false)}, false);
  //start game loop 
  mainGameTest(songObj)
}
function mainTest(){
  //test function
  var songObj = { song: [{time: 2000, keys:['A']},{time: 0, keys:['A','S']},]}
  playGameTest(songObj)
}

function drawGame(dt){
  //draws the game on its own coordinate system
  var width = canvas.width/2;
  var height = canvas.height;
  var originX = canvas.width/4;
  //draw background
  canvas.setPenColor('#454545');
  canvas.drawRect(originX,0,width,height);
  canvas.setPenColor('#FFFFFF');
  // canvas.drawLine(originX,height-.05*width,width+originX,height-.05*width);
  canvas.drawRect(originX,height-.075*width,width,.05*width)
  canvas.setPenColor('#000000');
  //loop and draw notes
  for(var i=0; i<Global.song.song.length; i++){
    var note = Global.song.song[i];
    for(var j=0; j<note.keys.length; j++){
      if (note.keys[j] === 'A'){
        canvas.drawFilledCirc(.1*width+originX, (-note.time+2000-.2*width)/(2000)*height, .045*width,'#FF0000');
      }
      if (note.keys[j] === 'S'){
        canvas.drawFilledCirc(.3*width+originX, (2000-note.time-.2*width)/(2000)*height, .045*width,'#0000FF');
      }
      if (note.keys[j] === 'D'){
        canvas.drawFilledCirc(.5*width+originX, (2000-note.time-.2*width)/(2000)*height, .045*width,'#00FF00');
      }
      if (note.keys[j] === 'F'){
        canvas.drawFilledCirc(.7*width+originX, (2000-note.time-.2*width)/(2000)*height, .045*width,'#FFFF00');
      }
      if (note.keys[j] === 'G'){
        canvas.drawFilledCirc(.9*width+originX, (2000-note.time-.2*width)/(2000)*height, .045*width,'#FF00FF');
      }
    }
  }
  //hit animations
  canvas.setPenColor('#FF0000');
  canvas.drawRect(3/16*canvas.width, .47*height, 1/16*canvas.width, 30);
  for(var i=0; i<hit.length; i++){
    canvas.setPenColor('#000000');
    canvas.drawText('A HIT', 3/16*canvas.width, .5*height);
    if (hit[i] === 'a'){
      canvas.drawText('A', .23*canvas.width, .5*height)
      canvas.drawFilledCirc(.1*width+originX, -.045*width+height, .045*width,'#000000');
    }
    if (hit[i] === 's'){
      canvas.drawText('S', .23*canvas.width, .5*height)
      canvas.drawFilledCirc(.3*width+originX, -.045*width+height, .045*width,'#000000');
    }
    if (hit[i] === 'd'){
      canvas.drawText('D', .23*canvas.width, .5*height)
      canvas.drawFilledCirc(.5*width+originX, -.045*width+height, .045*width,'#000000');
    }
    if (hit[i] === 'f'){
      canvas.drawText('F', .23*canvas.width, .5*height)
      canvas.drawFilledCirc(.7*width+originX, -.045*width+height, .045*width,'#000000');
    }
    if (hit[i] === 'g'){
      canvas.drawText('G', .23*canvas.width, .5*height)
      canvas.drawFilledCirc(.9*width+originX, -.045*width+height, .045*width,'#000000');
    }
  }
  hit.shift()
  
  //draw score
  canvas.setPenColor('#2222FF')
  canvas.drawRect(.75*canvas.width, .47*height, 1/16*canvas.width, 30)
  var str = score.toString()
  canvas.setPenColor('#000000')
  canvas.drawText(str, .75*canvas.width, .5*height)
  if (info.mode === 'online') {
    canvas.setPenColor('#2222FF')
    canvas.drawRect(.75*canvas.width, .27*height, 1/16*canvas.width, 30);
    canvas.setPenColor('#000000')
    canvas.drawText(oppScore.toString(), .75*canvas.width, .3*height);
  }
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

