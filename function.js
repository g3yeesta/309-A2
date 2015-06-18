window.onload = pageLoad; 

var isPlaying = false;
var highScore = 0;
var canvas, ctx;
var foodx = []; //array holding food x coordinates
var foody = []; //array holding food y coordinates
//fill food arrays with food objects
for (i = 0; i < 5; i++) { 
    foodx.push(Math.random()*400);
	foody.push(300+Math.random()*300);
}

/*
 *Bind buttons and variables to functions on load
 */
 
function pageLoad() {
	document.getElementById("start").onclick = play;
	document.getElementById("pause").onclick = pause;	
	
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	
	document.getElementById("high-score").innerHTML  = highScore;
} 

function play() {
	document.getElementById("start-page").style.display = "none";
	document.getElementById("info-bar").style.display = "table";
	document.getElementById("game-page").style.display = "block";
	document.getElementById("canvas").style.display = "block";
	isPlaying = true;
	drawFood();
}
function pause(){
	if (isPlaying) {
		isPlaying = false;
		document.getElementById("pause").innerHTML  = "►";
	}
	else{
		isPlaying = true;
		document.getElementById("pause").innerHTML  = "||";
	}
	
}

function drawFood(){
	ctx.fillStyle='green';
	for (i = 0; i < 5; i++) {
		ctx.fillRect(foodx[i],foody[i],20,20);
	}
}