window.onload = pageLoad; 

var isPlaying = false;
var highScore = 0;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

/*
 *Bind buttons and variables to functions on load
 */
 
function pageLoad() {
	document.getElementById("start").onclick = play;
	document.getElementById("pause").onclick = pause;	
		
	document.getElementById("high-score").innerHTML  = highScore;
} 

function play() {
	document.getElementById("start-page").style.display = "none";
	document.getElementById("info-bar").style.display = "table";
	document.getElementById("game-page").style.display = "block";
	document.getElementById("canvas").style.display = "block";
	isPlaying = true;
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

