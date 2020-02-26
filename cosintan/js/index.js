var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var pi = 0;
var raggio = 200;

function update(){
	pi = (pi - 0.05) % (Math.PI * 2);
}

function render(){
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, raggio, 0, Math.PI*2);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(canvas.width/2 + Math.cos(pi) * raggio, canvas.height/2 + Math.sin(pi) * raggio, raggio / 50, 0, Math.PI*2);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.stroke();
	ctx.lineWidth = 2;
	ctx.closePath();
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.moveTo(canvas.width/2, canvas.height/2);
	ctx.lineTo(canvas.width/2 + Math.cos(pi) * raggio, canvas.height/2);
	ctx.strokeStyle = "blue";
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(canvas.width/2, canvas.height/2);
	ctx.lineTo(canvas.width/2, canvas.height/2 + Math.sin(pi) * raggio);
	ctx.strokeStyle = "red";
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(canvas.width/2, canvas.height/2);
	ctx.lineTo(canvas.width/2 + Math.cos(pi) * raggio, canvas.height/2 + Math.sin(pi) * raggio);
	ctx.strokeStyle = "green";
	ctx.stroke();
	ctx.closePath();
}

function loop(){
	update();
	render();
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);