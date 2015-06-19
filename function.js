window.onload = pageLoad; 

var time = 60;
var timer;
var isPlaying = false;
var highScore = 0;
var canvas, ctx;
var foodx = []; //array holding food x coordinates
var foody = []; //array holding food y coordinates
var startTime, pauseTime;

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
	//empty and then fill food arrays with food objects
	foodx = [];
	foody = [];
	for (i = 0; i < 5; i++) { 
		foodx.push(Math.random()*400);
		foody.push(300+Math.random()*300);
	}
	
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawFood();
	
	time =60;
	document.getElementById("timer").innerHTML  = time;
	timer = setTimeout(function(){countdown()},1000);
	startTime = new Date();
}

function pause(){
	if (isPlaying) {
		//pause
		isPlaying = false;
		document.getElementById("pause").innerHTML  = "►";
		clearTimeout(timer);
		pauseTime = new Date();
	}
	else{
		//resume //TODO disable pausing after game over
		isPlaying = true;
		document.getElementById("pause").innerHTML  = "| |";
		timer = setTimeout(function(){countdown()},(1000-(pauseTime-startTime)));
	}
}

function countdown(){
	document.getElementById("timer").innerHTML  = time-1;
	time = time -1;
	if (time < 57){
		gameover();
	}
	else{
		timer = setTimeout(function(){countdown()},1000);
		startTime = new Date();
	}
}

function quit(){
	document.getElementById("start-page").style.display = "block";
	document.getElementById("info-bar").style.display = "none";
	document.getElementById("game-page").style.display = "none";
	document.getElementById("canvas").style.display = "none";
	isPlaying = false;
}

function gameover(){
	ctx.font="30px Georgia";
	ctx.fillStyle='black';
	ctx.fillText("Game Over",130,200);
	clearTimeout(timer);
	isPlaying = false;

	//placeholder
	canvas.onclick = quit;
}

function drawFood(){
	ctx.fillStyle='green';
	for (i = 0; i < 5; i++) {
		ctx.fillRect(foodx[i],foody[i],20,20);
	}
}