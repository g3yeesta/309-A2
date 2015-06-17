
function play() {
	document.getElementById("startmenu").style.display = "none";
	document.getElementById("pause").style.display = "block";
}
function pause(){
	document.getElementById("resume").style.display = "block";
	document.getElementById("pause").style.display = "none";
	document.getElementById("restart").style.display = "block";
}

function resume(){
	document.getElementById("pause").style.display = "block";
	document.getElementById("resume").style.display = "none";
	document.getElementById("restart").style.display = "none";
}

function restart(){
	document.getElementById("startmenu").style.display = "block";
	document.getElementById("resume").style.display = "none";
	document.getElementById("restart").style.display = "none";
}