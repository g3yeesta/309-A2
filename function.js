window.onload = pageLoad; 

var time, timer, bugTimer;
var isPlaying = false;
var highScore = 0; //change this line later
var canvas, ctx;
var food = []; //array holding food objects->format: {x,y}
var startTime, pauseTime;
var bugs = []; //array of bug objects->format: {x,y,dx,dy,colour}

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
	document.getElementById("canvas").style.display = "block";
	isPlaying = true;
	//empty and then fill food arrays with food objects
	food = [];
	for (i = 0; i < 5; i++) { 
		food.push({x:(Math.random()*400), y:(300+Math.random()*300) });
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
	//change value here to debug
	if (time <= 0){
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
	document.getElementById("canvas").style.display = "none";
	isPlaying = false;
}

function gameover(){
	ctx.font="30px Georgia";
	ctx.fillStyle='black';
	ctx.fillText("Game Over",130,200);
	clearTimeout(timer);
	isPlaying = false;

	//placeholder delete later
	canvas.onclick = quit;
}

function drawFood(){
	ctx.fillStyle='green';
	for (i = 0; i < food.length; i++) {
		ctx.fillRect(food[i].x,food[i].y,20,20);
	}
}
function spawnBug(){
	var bX = 10+Math.random()*370;
	var r = Math.random();
	var c;
	
	if (r < 0.3 ){
		c = "black";
	}
	else if (r < 0.6 ){
		c = "red";
	}
	else {
		c = "orange";
	}
	
	bugs.push({x:bX, y:0, dx:0, dy:0 ,colour:c) });
}