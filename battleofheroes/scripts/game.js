//ascoltatori per input tastiera
var playerAKeys = {
	up : false,
	down : false,
	right : false,
	left : false,
	charge : false
}	
var playerBKeys = {
	up : false,
	down : false,
	right : false,
	left : false,
	charge : false
}	
//tasto premuto
window.addEventListener("keydown", e => {
	if(e.keyCode === 87){
		playerAKeys.up = true;
	}
	if(e.keyCode === 65){
		playerAKeys.left = true;
	}
	if(e.keyCode === 83){
		playerAKeys.down = true;
	}
	if(e.keyCode === 68){
		playerAKeys.right = true;
	}
	if(e.keyCode === 32){
		playerAKeys.charge = true;
	}
	

	if(e.keyCode === 38){
		playerBKeys.up = true;
	}
	if(e.keyCode === 37){
		playerBKeys.left = true;
	}
	if(e.keyCode === 40){
		playerBKeys.down = true;
	}
	if(e.keyCode === 39){
		playerBKeys.right = true;
	}
	if(e.keyCode === 76){
		playerBKeys.charge = true;
	}
});
//tasto rilasciato
window.addEventListener("keyup", e => {
	if(e.keyCode === 87){
		playerAKeys.up = false;
	}
	if(e.keyCode === 65){
		playerAKeys.left = false;
	}
	if(e.keyCode === 83){
		playerAKeys.down = false;
	}
	if(e.keyCode === 68){
		playerAKeys.right = false;
	}
	if(e.keyCode === 32){
		playerAKeys.charge = false;
	}
	if(e.keyCode === 122){
		f11pressed = !f11pressed;
	}

	if(e.keyCode === 38){
		playerBKeys.up = false;
	}
	if(e.keyCode === 37){
		playerBKeys.left = false;
	}
	if(e.keyCode === 40){
		playerBKeys.down = false;
	}
	if(e.keyCode === 39){
		playerBKeys.right = false;
	}
	if(e.keyCode === 76){
		playerBKeys.charge = false;
	}
});

window.addEventListener("keypress", e => {
});	


//rappresenta SOLO il gioco
class Game{
	constructor(gameMng){
		this.gameManager = gameMng;
		//scelta arbitraria
		this.playerDim = canvas.width / 25;
		//giocatore A
		this.playerA = new Player(canvas.width / 2 - this.playerDim / 2, canvas.height / 4 - this.playerDim / 2, "red", this);
		//giocatore B
		this.playerB = new Player(canvas.width / 2 - this.playerDim / 2, canvas.height / 4 * 3 - this.playerDim / 2, "blue", this);
		
		this.playerA.otherPlayer = this.playerB;
		this.playerB.otherPlayer = this.playerA;
		this.init();
	}

	init(){
		//il vincitore
		this.winner = undefined;
		//il perdente
		this.loser = undefined;
		//sta aspettando?
		this.isWaiting = true;
		//conto alla rovescia
		this.waitTimer = 0;
		//timer rovescia
		this.waitLimit = 160;
		this.playerA.init();
		this.playerB.init();
	}

	update(){
		if(this.isWaiting){
			this.waitTimer++;
			if(this.waitTimer >= this.waitLimit){
				this.isWaiting = false;
			}
			return;
		}
		//manda aggiornamento
		this.playerA.update(playerAKeys);
		//manda aggiornamento
		this.playerB.update(playerBKeys);
	}

	render(){
		ctx.beginPath();
		//sfondo
		ctx.fillStyle = "#102030";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//disegna barra della vita
		this.renderLifeBars();
		//disegna il campo
		this.renderGroundLines();

		//disegna giocatore A
		this.playerA.render();
		//disegna giocatore B
		this.playerB.render();

		this.showCountdown();

		ctx.closePath();
	}

	//disegna le barre della vita
	renderLifeBars(color1, color2, maxLife){
		//massima dimensione della barra
		var maxLifeLength = canvas.width / 2;
		//impostazioni del gradient
		let grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
		grd.addColorStop(0.3, (color1 ? color1 : this.playerA.color));
		grd.addColorStop(0.7, (color2 ? color2 : this.playerB.color));
		//dai il colore del gradient
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, maxLifeLength / (maxLife ? maxLife : playerInitialLife) * this.playerA.life, canvas.height);
		//disegna barra della vita per giocatore B
		ctx.fillStyle = grd;
		ctx.fillRect(canvas.width, 0, - maxLifeLength / (maxLife ? maxLife : playerInitialLife) * this.playerB.life, canvas.height);
	}

	//disegna le linee del campo
	renderGroundLines(){
		let radius = canvas.width / 15;
		ctx.beginPath();
		//spessore della linea	
		ctx.lineWidth = 3;
		//linea verticale centrale
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		//colore della linea
		ctx.strokeStyle = "white";
		//linea orizzontale centrale
		ctx.moveTo(0, canvas.height / 2);
		ctx.lineTo(canvas.width, canvas.height / 2);
		//colora la linea
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		//disegna cerchio centrale
		ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
		//colora il cerchio
		ctx.stroke();
		ctx.closePath();
		//faccia
		ctx.beginPath();
		//occhi
		ctx.fillStyle = "white";
		ctx.arc(canvas.width / 2 - radius / 2 + 10, canvas.height / 2 - radius / 2 + canvas.height / 30, radius / 10, 0, Math.PI * 2);
		ctx.arc(canvas.width / 2 + radius / 2 - 10, canvas.height / 2 - radius / 2 + canvas.height / 30, radius / 10, 0, Math.PI * 2);
		ctx.fill();
		//bocca
		ctx.fillRect(canvas.width / 2 - radius / 2 - 20, canvas.height / 2 + radius / 2 - canvas.height / 30, radius + 40, canvas.height / 120);
		ctx.closePath();
	}

	drawNumber(number){
		let dimension = (canvas.width / canvas.height) * 150;
		ctx.font = dimension + "px fixedsys";
		ctx.fillStyle = "white";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		ctx.fillText(number, canvas.width / 2 - dimension / 3, canvas.height / 2 + 50);
		ctx.strokeText(number, canvas.width / 2 - dimension / 3, canvas.height / 2 + 50);
	}

	showCountdown(){
		if(this.waitTimer < this.waitLimit / 4){
			this.drawNumber("3");
		}else if(this.waitTimer < this.waitLimit / 2){
			this.drawNumber("2");
		}else if(this.waitTimer < this.waitLimit / 4 * 3){
			this.drawNumber("1");
		}else if(this.waitTimer < this.waitLimit){
			this.drawNumber("GO!");
		}
	}
}