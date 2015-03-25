var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

var height = $(window).height()-20;
var width = $(window).width()-20;
var socket = io();

function init(){
	canvas = document.getElementById("blankSpace");
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");

}