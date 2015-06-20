window.onload = pageLoad; 

var time, timer, bugTimer, animateTimer;
var startTime, bugStartTime, pauseTime, animateStartTime;
var isPlaying = false;
var highScore = 0;  
var score = 0;
var canvas, ctx;
var food = []; //array holding food objects->format: {x,y}
var bugs = []; //array of bug objects->format: {x,y,dx,dy,colour,stepsToFood,food,dead,fade,angle,headx,heady}
var nextBug;
var framerate = 20; //milliseconds per frame -> 20 = 50 fps
var rbugImg, obugImg, bbugImg, foodImg;


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
	
	rbugImg = new Image();
	bbugImg = new Image();
	obugImg = new Image();
	foodImg = new Image();
	
	rbugImg.src = 'red_bug.png';
	bbugImg.src = 'black_bug.png';
	obugImg.src = 'orange_bug.png';
	foodImg.src = 'food.png';
} 

/*
 *On pressing start or restart
 */

function play() {
	document.getElementById("start-page").style.display = "none";
	document.getElementById("info-bar").style.display = "table";
	document.getElementById("canvas").style.display = "block";
	isPlaying = true;
	document.getElementById("pause").disabled = false;
	//empty and then fill food arrays with food objects
	food = [];
	for (var i = 0; i < 5; i++) { 
		//max = width or height - 20 so it doesn't overflow
		food.push({x:(10+(Math.random()*390)), y:(310+Math.random()*290) });
	}
	time =61;
	countdown();
	
	bugs = []; 
	spawnBug();

	document.getElementById("pause").innerHTML  = "&#10074;&#10074;";
	
	score = 0
	document.getElementById("score").innerHTML  = score;
	animate();
}

/*
 *On pressing pause
 */

function pause(){
	if (isPlaying) {
		//pause
		isPlaying = false;
		document.getElementById("pause").innerHTML  = "►";
		clearTimeout(timer);
		clearTimeout(bugTimer);
		clearTimeout(animateTimer);
		pauseTime = new Date();
		
		ctx.font="30px Georgia";
		ctx.fillStyle='black';
		ctx.fillText("Restart",70,300);		
		ctx.fillText("Quit",270,300);
		
	}
	else{
		//resume
		isPlaying = true;
		document.getElementById("pause").innerHTML  = "&#10074;&#10074;";
		timer = setTimeout(function(){countdown()},(1000-(pauseTime-startTime)));
		bugTimer = setTimeout(function(){spawnBug()},(nextBug-(pauseTime-bugStartTime)));
		animateTimer = setTimeout(function(){animate()},(framerate-(pauseTime-animateStartTime)));
	}
}

/*
 *Countdown timer method that every second to decrement the timer
 */

function countdown(){
	document.getElementById("timer").innerHTML  = time-1;
	time = time -1;
	if (time <= 0){
		gameover();
	}
	else{
		timer = setTimeout(function(){countdown()},1000);
		startTime = new Date();
	}
}

/*
 *Exit to start page
 */


function quit(){
	document.getElementById("start-page").style.display = "block";
	document.getElementById("info-bar").style.display = "none";
	document.getElementById("canvas").style.display = "none";
	gameover();
}

/*
 *Runs when food or timer reaches 0
 */

function gameover(){
	ctx.font="30px Georgia";
	ctx.fillStyle='black';
	ctx.fillText("Game Over",130,200);
	ctx.fillText("Restart",70,300);		
	ctx.fillText("Quit",270,300);
	ctx.fillText("Score: "+score ,140,400);
	clearTimeout(timer);
	clearTimeout(bugTimer);
	clearTimeout(animateTimer);
	document.getElementById("pause").disabled = true;
	isPlaying = false;	
}

/*
 *Draws food on canvas
 */

function drawFood(){
	for (var i = 0; i < food.length; i++) {
		ctx.drawImage(foodImg, food[i].x-10, food[i].y-10);
	}
}

/*
 *Countdown timer method for when the next bug will spawn, runs randomly between 1 and 3 seconds
 */

function spawnBug(){
	//leftmost pixel at 10, rightmost pixel at 390
	var bX = 15+(Math.random()*385);
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
	var b = calculateSpeed({x:bX, y:0, dx:0, dy:0 ,colour:c, stepsToFood:0 , food:0, dead:false, fade: 1, angle:0, headx:bX, heady:40});
	bugs.push(b);
	
	bugTimer = setTimeout(function(){spawnBug()},nextBug);
	bugStartTime = new Date();	
}

/*
 *Draws bugs on canvas
 */

function drawBugs(){
	for (var i = bugs.length; i--;) {
		ctx.globalAlpha = 1;
		if (bugs[i].dead){
			//2000 for millisecond fade
			bugs[i].fade -= (framerate/2000);
			if (bugs[i].fade <=(framerate/2000) ){
				bugs.splice(i,1);
			}
			else{
				ctx.globalAlpha = bugs[i].fade;
			}
		}
		if (bugs.length <=0 ){
			continue;
		}
		var img;
		if (bugs[i].colour == "orange"){
			img = obugImg;
		}
		else if (bugs[i].colour == "red"){
			img = rbugImg;
		}
		else{
			img = bbugImg;
		}
		ctx.translate(bugs[i].x, bugs[i].y);   
		ctx.rotate(bugs[i].angle); 		
		ctx.translate(-bugs[i].x, -bugs[i].y); 	
		ctx.drawImage(img, bugs[i].x-5, bugs[i].y-5);
		ctx.setTransform(1,0,0,1,0,0); 		
		ctx.globalAlpha = 1;
	}
}

/*
 *Changes the position of the bugs based on the speed: dx, dy
 */

function moveBugs(){
	for (var i = bugs.length; i--;) {
		if (!bugs[i].dead){
			bugs[i].y += bugs[i].dy;
			bugs[i].x += bugs[i].dx;
			bugs[i].stepsToFood -= 1;
		}
	}
}

/*
 *Function for finding the speed and vector (dx, dy) of a bug based on the nearest food
 */

function calculateSpeed( bug ){		
	if (bug.dead){
		return bug;
	}	
	var nearestFood;
	var distanceSum = 9000; //Max distance is 400(width))+600(height)
	var distanceCheck;
	for (var i = 0; i < food.length; i++) {
		distanceCheck = (Math.abs(bug.x + bug.headx - food[i].x) +  Math.abs(bug.y + bug.heady - food[i].y));
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
	var a =  (Math.atan2(distanceY, distanceX)- 0.5*Math.PI);
	var bodylengthx = (-40*Math.sin(a));
	var bodylengthy = (40*Math.cos(a));
	bug.dx = xspeed;
	bug.dy = yspeed;
	
	bug.headx =  bodylengthx;
	bug.heady =  bodylengthy;
	var bodylength = Math.sqrt(Math.pow(bodylengthx,2)+Math.pow(bodylengthy,2));
	bug.food = nearestFood;
	bug.stepsToFood = (distance-bodylength)/speed;
	bug.angle = a;
	
	return bug;
}

/*
 *Function for event handling a click on the canvas
 */

function onClick(event){
	
	var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	
	
	if(!isPlaying){
		//restart button
		if ( (50 < x) && (x < 190) && (250 < y) && (y < 320) ){
			gameover();
			play();
		}
		//quit button
		else if ( (245 < x) && (x < 350) && (260 < y) && (y < 320) ){
			gameover();
			quit();
		}
		return;
	}	
	//reverse loop is safer when splicing elements out
	for (var i = bugs.length; i--;) {
		if (bugs[i].dead){
			continue;
		}
		else if ((Math.sqrt((Math.pow((bugs[i].x-x),2) +  Math.pow((bugs[i].y-y),2))) < 30) || 
				(Math.sqrt((Math.pow((bugs[i].x+bugs[i].headx-x),2) +  Math.pow((bugs[i].y+bugs[i].heady-y),2))) < 30)){
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

/*
 *Function that runs every frame of the game
 */

function animate(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawFood();
	moveBugs();
	drawBugs();	
	//check if a bug ate a food then remove and recalculate if it did.
	if ( food.length >= 0){
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
	}
	animateTimer = setTimeout(function(){animate()},framerate);
	animateStartTime = new Date();
}