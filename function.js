window.onload = pageLoad; 

var time, timer, bugTimer, animateTimer;
var startTime, bugStartTime, pauseTime, animateStartTime;
var isPlaying = false;
var highScore = 0;
var canvas, ctx;
var food = []; //array holding food objects->format: {x,y}
var bugs = []; //array of bug objects->format: {x,y,dx,dy,colour}
var nextBug;
var framerate = 20; //milliseconds per frame -> 20 = 50 fps

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
	time =61;
	countdown();	
	bugs = []; 
	spawnBug();
	
	animate();
}

function pause(){
	if (isPlaying) {
		//pause
		isPlaying = false;
		document.getElementById("pause").innerHTML  = "►";
		clearTimeout(timer);
		clearTimeout(bugTimer);
		clearTimeout(animateTimer);
		pauseTime = new Date();
	}
	else{
		//resume //TODO disable pausing after game over
		isPlaying = true;
		document.getElementById("pause").innerHTML  = "| |";
		timer = setTimeout(function(){countdown()},(1000-(pauseTime-startTime)));
		bugTimer = setTimeout(function(){spawnBug()},(nextBug-(pauseTime-bugStartTime)));
		animateTimer = setTimeout(function(){animate()},(framerate-(pauseTime-animateStartTime)));
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
	clearTimeout(bugTimer);
	clearTimeout(animateTimer);
	isPlaying = false;

	//placeholder
	canvas.onclick = quit;
}

function drawFood(){
	ctx.fillStyle='green';
	for (i = 0; i < food.length; i++) {
		ctx.fillRect(food[i].x,food[i].y,20,20);
	}
}

function spawnBug(){
	//leftmost pixel at 10, rightmost pixel at 390
	var bX = 10+(Math.random()*370);
	var rColour = Math.random();
	var c;
	nextBug = 1000+(Math.random()*2000);
	
	if (rColour < 0.4 ){
		c = "orange";
	}
	else if (rColour < 0.7 ){
		c = "red";
	}
	else {
		c = "black";
	}
	bugs.push({x:bX, y:0, dx:1, dy:1 ,colour:c});
	
	bugTimer = setTimeout(function(){spawnBug()},nextBug);
	bugStartTime = new Date();	
	
}

function drawBugs(){
	for (i = 0; i < bugs.length; i++) {
		ctx.fillStyle=bugs[i].colour;
		ctx.fillRect(bugs[i].x,bugs[i].y,10,40);
	}
}

function moveBugs(){
	for (i = 0; i < bugs.length; i++) {
		bugs[i].y += bugs[i].dy;
		bugs[i].x += bugs[i].dx;
	}
}

function calculateSpeed(){
	//TODO calculate dx/dy here
}

function animate(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawFood();
	drawBugs();
	moveBugs();
	//TODO code for checking if a bug ate food goes here
	animateTimer = setTimeout(function(){animate()},framerate);
	animateStartTime = new Date();
}