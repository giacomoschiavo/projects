var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

class Firework{
	constructor(x, y){
		this.color = this.getRandomColor();
		this.points = [];
		this.rays = Math.floor(Math.random() * 10) + 30;
		this.raysHeight = 1//Math.floor(Math.random() * 10) + 10;
		this.divs = (Math.PI * 2) / this.rays;
		this.velocity = Math.random() * 10 + 10;
		this.trigger = y;
		for(let i = 0; i < this.rays; i++){
			this.points.push({x: x, y: canvas.height, vel_x: Math.cos(this.divs * i), vel_y: Math.sin(this.divs * i)});
		}
		this.expansion = 0;
		this.visibility = 1;
		this.explosion = false;
		this.isDead = false;
	}

	getRandomColor(){
		let r = Math.floor(Math.random() * 255) + 0;
		let g = Math.floor(Math.random() * 255) + 0;
		let b = Math.floor(Math.random() * 255) + 0;

		return `rgba(${r}, ${g}, ${b}` ;
	}

	update(){
		if(this.explosion){
			this.points.forEach((point) => {
				point.x += point.vel_x * this.expansion;
				point.y += point.vel_y * this.expansion;
			});

			this.expansion = Math.floor(Math.random() * 4) + 2;
		}else{
			this.points.forEach((point) => {
				point.y -= this.velocity;
				if(point.y < this.trigger){
					this.explosion = true;
				}
			});
		}
	}

	draw(){
		if(this.explosion){
			this.points.forEach((point) => {
				ctx.beginPath();
				ctx.moveTo(point.x, point.y);
				ctx.lineTo(point.x + point.vel_x * this.raysHeight, point.y + point.vel_y * this.raysHeight);
				ctx.strokeStyle =  `${this.color}, ${this.visibility})`;
				ctx.lineCap = "round";
				ctx.stroke();
				ctx.lineWidth = Math.floor(Math.random() * 10);
				ctx.closePath();
			});
			this.visibility -= 0.01;
			if(this.visibility < 0){
				this.isDead = true;
			}
		}else{
			this.points.forEach((point) => {
				ctx.beginPath();
				ctx.arc(point.x, point.y, Math.floor(Math.random() * 4) + 1, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.closePath();
			});
		}
	}
}

let spam = [];
let slider = document.getElementById("slider");
function loop(){
	ctx.fillStyle = "rgba(0, 0, 0, 0." + Math.floor(Math.random() * 5) + 1 + ")";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for(let i = 0; i < slider.value; i++){
		if(spam[i] == undefined || spam[i].isDead){
			spam[i] = new Firework(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height) - canvas.height/ 6);
		}
		spam[i].update();
		spam[i].draw();
	}
	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);