window.onload = pageLoad; 

var isPlaying = false;

function pageLoad() {
	document.getElementById("start").onclick = play;
	document.getElementById("pause").onclick = pause;
	document.getElementById("resume").onclick = resume;
	document.getElementById("restart").onclick = restart;
} 



function play() {
	document.getElementById("startmenu").style.display = "none";
	document.getElementById("pause").style.display = "block";
	document.getElementById("game-page").style.display = "block";
	isPlaying = true;
}
function pause(){
	if (isPlaying) {
		isPlaying = false;
		document.getElementById("pause").innerHTML  = "resume";
	}
	else{
		isPlaying = true;
		document.getElementById("pause").innerHTML  = "pause";
	}
	
}
