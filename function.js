window.onload = pageLoad; 

var time, timer, bugTimer, animateTimer;
var startTime, bugStartTime, pauseTime, animateStartTime;
var isPlaying = false;
var highScore = 0;  
var score = 0;
var canvas, ctx;
var food = []; //array holding food objects->format: {x,y}
var bugs = []; //array of bug objects->format: {x,y,dx,dy,colour,stepsToFood,food,dead,fade}
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
	
	canvas.addEventListener("mousedown", onClick, false);
	
	if (typeof(Storage) != "undefined") {
    highScore = localStorage.getItem("highScore");
	}
	
	document.getElementById("high-score").innerHTML  = highScore;
} 

function play() {
	document.getElementById("start-page").style.display = "none";
	document.getElementById("info-bar").style.display = "table";
	document.getElementById("canvas").style.display = "block";
	isPlaying = true;
	//empty and then fill food arrays with food objects
	food = [];
	for (var i = 0; i < 5; i++) { 
		//max = width or height - 20 so it doesn't overflow
		food.push({x:(Math.random()*380), y:(300+Math.random()*280) });
	}
	time =61;
	countdown();	
	bugs = []; 
	spawnBug();
	
	score = 0
	document.getElementById("score").innerHTML  = score;
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
	//clearTimeout(animateTimer);
	isPlaying = false;
}

function drawFood(){
	ctx.fillStyle='green';
	for (var i = 0; i < food.length; i++) {
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
	var b = calculateSpeed({x:bX, y:0, dx:0, dy:0 ,colour:c, stepsToFood:0 , food:0, dead:false, fade: 1});
	bugs.push(b);
	
	bugTimer = setTimeout(function(){spawnBug()},nextBug);
	bugStartTime = new Date();	
	
}

function drawBugs(){
	for (var i = bugs.length; i--;) {
		if (bugs[i].dead){
			bugs[i].fade -= (framerate/2000);
			ctx.globalAlpha = bugs[i].fade;
			if (bugs[i].fade <=0 ){
				bugs.splice(i,1);
			}
		}
		ctx.fillStyle=bugs[i].colour;
		ctx.fillRect(bugs[i].x,bugs[i].y,10,40);
		ctx.globalAlpha = 1;
	}
}

function moveBugs(){
	for (var i = bugs.length; i--;) {
		if (!bugs[i].dead){
			bugs[i].y += bugs[i].dy;
			bugs[i].x += bugs[i].dx;
			bugs[i].stepsToFood -= 1;
		}
	}
}

function calculateSpeed( bug ){		
	//TODO re-adjust based on closest pixels instead of upper leftcorner, re-adjust for rotating bugs as well
	//Possibly by keeping track of 4 corners after rotating
	if (bug.dead){
		return bug;
	}	
	var nearestFood;
	var distanceSum = 9000; //Max distance is 400(width))+600(height)
	var distanceCheck;
	for (var i = 0; i < food.length; i++) {
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
	//using similar triangles to get dy and dx
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

function onClick(event){
	if(!isPlaying){
		//quit();
		return;
	}
	var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	//TODO readjust for closest pixels and rotating
	//reverse loop for killing multiple
	for (var i = bugs.length; i--;) {	
		if (Math.sqrt((bugs[i].x-x)*(bugs[i].x-x) + (bugs[i].y-y)*(bugs[i].y-y)) < 30){
			if (bugs[i].colour == "orange"){
				score +=1;
			}
			else if (bugs[i].colour == "red"){
				score +=3;
			}
			else{
				score +=5;
			}			
			document.getElementById("score").innerHTML  = score;
			bugs[i].dead = true;
			bugs[i].dx = 0;
			bugs[i].dy = 0;
		}
	}
	if (score >= highScore){
		highScore = score;
		document.getElementById("high-score").innerHTML  = highScore;
		if (typeof(Storage) != "undefined") {
		    localStorage.setItem("highScore", highScore);
		}
	}

	
}

function animate(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawFood();
	moveBugs();
	drawBugs();	
	//check if a bug ate a food then remove and recalculate if it did.
	for (var i = bugs.length; i--;) {	
		if (bugs[i].stepsToFood	<= 0){
			food.splice(bugs[i].food, 1);
			if ( food.length <= 0){	
				gameover();
				//return;
			}
			else{
				//make bugs change targets if a food is now gone
				for (var j = bugs.length; j--;) {	
					bugs[j] = calculateSpeed(bugs[j]);
				}
			}
		}							
	}
	animateTimer = setTimeout(function(){animate()},framerate);
	animateStartTime = new Date();
}