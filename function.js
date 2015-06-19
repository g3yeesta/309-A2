window.onload = pageLoad; 

var time, timer, bugTimer, animateTimer;
var startTime, bugStartTime, pauseTime, animateStartTime;
var isPlaying = false;
var highScore = 0;  //TODO remember highscore using local storage
var canvas, ctx;
var food = []; //array holding food objects->format: {x,y}
var bugs = []; //array of bug objects->format: {x,y,dx,dy,colour,stepsToFood,food}
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
		//max = width or height - 20 so it doesn't overflow
		food.push({x:(Math.random()*380), y:(300+Math.random()*280) });
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
	gameover();
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
	var b = calculateSpeed({x:bX, y:0, dx:0, dy:0 ,colour:c, stepsToFood:0 , food:0});
	bugs.push(b);
	
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
		bugs[i].stepsToFood -= 1;
	}
}

function calculateSpeed( bug ){		
	//TODO re-adjust base on closest pixels instead of upper leftcorner, re-adjust for rotating bugs as well
	var nearestFood;
	var distanceSum = 9000; //Max distance is 400(width))+600(height)
	var distanceCheck;
	for (i = 0; i < food.length; i++) {
		distanceCheck = (Math.abs(bug.x - food[i].x) +  Math.abs(bug.y - food[i].y));
		if (distanceCheck < distanceSum ){
			distanceSum = distanceCheck;
			nearestFood = i;
		}
	}	
	var distanceX = (food[nearestFood].x - bug.x);
	var distanceY = (food[nearestFood].y - bug.y);
	var distance = Math.sqrt(Math.pow(distanceX,2)+Math.pow(distanceY,2));
	var speed = 0;
	if (bug.colour == "orange"){
		if (document.getElementById("level2").checked){
			speed = 80;
		}else{
			speed = 60;
		}
	}
	else if (bug.colour == "red"){
		if (document.getElementById("level2").checked){
			speed = 100;
		}else{
			speed = 75;
		}		
	}
	else{
		if (document.getElementById("level2").checked){
			speed = 200;
		}else{
			speed = 150;
		}		
	}
	
	speed = speed/(1000/framerate);
	//using equivalent triangles to get dy and dx
	var xspeed = speed*(distanceX/distance);
	var yspeed = speed*(distanceY/distance);
	/*
	document.getElementById("t1").innerHTML  = speed;
	document.getElementById("t2").innerHTML  = distanceX;
	document.getElementById("t3").innerHTML  = distanceY;
	document.getElementById("t4").innerHTML  = distance;
	document.getElementById("t5").innerHTML  = xspeed;
	document.getElementById("t6").innerHTML  = yspeed;
	*/
	bug.dx = xspeed;
	bug.dy = yspeed;
	bug.food = nearestFood;
	bug.stepsToFood = distance/speed;
	
	return bug;
}

function onClick(){
	//TODO add event handlers
}

function animate(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawFood();
	moveBugs();
	drawBugs();	
	//TODO re-adjust eat checking for closest pixel/rotating bugs
	//exists a bug that causes a food to get eaten early
	var eaten = [];
	for (i = 0; i < bugs.length; i++) {	
		if (bugs[i].stepsToFood	<= 0){
			eaten.push(bugs[i].food);
		}							
	}
	//cut out all eaten food
	for (i = 0; i < eaten.length; i++) {	
		food.splice(eaten[i],1);
	}
	if ( food.length <= 0){		
		gameover();
		return;
	}
	//make bugs change targets if a food is now gone
	//this loop cause it to crash for some reason
	/*
	if ( eaten.length > 0 && food.length > 0 ){
		for (i = 0; i < bugs.length; i++) {	
			bugs[i] = calculateSpeed(bugs[i]);
		}
	}
	*/
	animateTimer = setTimeout(function(){animate()},framerate);
	animateStartTime = new Date();
}