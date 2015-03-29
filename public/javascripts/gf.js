//Require Jquery
var gf = {
  fullCanvas: function (){
    //creates a canvas object
    var canvas = document.createElement('Canvas');
    var height = $(window).height()-5;
    var width = $(window).width()-5;
    canvas.height = height;
    canvas.width = width;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
    return {paper: canvas, 
            height: height, 
            width: width,
            context: ctx,
            font: 'Bold 16px Arial',
            penColor: '#000000',
            backgroundColor: '#FFFFFF',
            objects: [],
            setFont: function(font){
              this.font = font;
              this.context.font = font;
            },
            setPenColor: function(hexColor){
              this.context.fillStyle = hexColor;
              this.penColor = hexColor;
            },
            setBackgroundColor: function(hexColor){
              this.backgroundColor = hexColor;
            },
            createBackground: function(){
              this.context.fillStyle = this.backgroundColor;
              this.context.fillRect(0,0,this.width,this.height);
              this.context.fillStyle = this.penColor;
              this.objects.push({type:'background'})
            },
            drawRect: function(x1, y1, width, height){
              this.context.fillStyle = this.penColor
              this.context.fillRect(x1, y1, width, height)
              this.objects.push({type:'rect', vars: [x1, y1, width, height], color: this.penColor})
              return {type: 'Rect',
                      point1: [x1,y1], 
                      point2: [x1+width, y1+height], 
                      width: width, 
                      height: height,
                      color: this.penColor,
                      checkInside: function(point){
                        //point, rect1, rect2 are all length 2 arrays. [x,y]
                        var rect1 = this.point1;
                        var rect2 = this.point2;
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
                    }
            },
            drawText: function(text, x, y){
              this.context.fillStyle = this.penColor;
              this.context.font = this.font;
              this.context.fillText(text, x, y);
              this.objects.push({type:'text', vars: [ text, x, y], font: this.font, color: this.penColor})
              return {type: 'Text',
                      point: [x,y], 
                      text: text, 
                      font: this.font, 
                      color: this.penColor,
                    }
            },
            move: function(shape, dx, dy){
              if(shape.type === 'Rect'){
                for(var i=0; i<this.objects.length;i++){
                  if (this.objects[i].type === 'rect'){
                    if (this.objects[i].vars[0]===shape.point1[0] && this.objects[i].vars[1]===shape.point1[1] && this.objects[i].vars[2]===shape.width && this.objects[i].vars[3]===shape.height){
                      this.objects[i].vars[0] += dx;
                      this.objects[i].vars[1] += dy;
                    }
                  }
                }
                shape.point1 = [shape.point1[0]+dx, shape.point1[1]+dy];
                shape.point2 = [shape.point2[0]+dx, shape.point2[1]+dy];
              }
            },
            undraw: function(shape){
              //shape is a object
              if(shape.type === 'Rect'){
                this.context.fillStyle = this.backgroundColor;
                this.context.fillRect(shape.point1[0], shape.point1[1], shape.width, shape.height);
                this.context.fillStyle = this.penColor;
              }
              if(shape.type === 'Text'){
                this.context.fillStyle = this.backgroundColor;
                this.context.font = shape.font;
                this.context.fillText(shape.text, shape.point[0], shape.point[1])
              }
            },
            redraw: function(){
              for(var i=0; i<this.objects.length;i++){
                var obj = this.objects[i]
                if (obj.type ==='background'){
                  this.context.fillStyle = this.backgroundColor;
                  this.context.fillRect(0,0,this.width, this.height)
                }
                if (obj.type === 'rect'){
                  this.context.fillStyle = obj.color;
                  this.context.fillRect(obj.vars[0], obj.vars[1], obj.vars[2], obj.vars[3])
                }
              }
            },
            animate: function(fun, objs){
              var canvas = this;
              this.redraw();
              requestAnimationFrame(function(){fun(canvas,objs)})
            }
          }
  }
}
