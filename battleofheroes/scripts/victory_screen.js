class VictoryScreen{

	constructor(gameMng){
		//manager
		this.gameManager = gameMng;
		//coordinate e dimensioni del giocatore in schermata
		this.xWinner = canvas.width / 6;
		this.yWinner = canvas.height / 4;
		this.dimWinner = canvas.width / 4;
		//coordinate scritta REPLAY
		this.xText = this.xWinner + this.dimWinner + 50;
		this.yText = this.yWinner + canvas.height / 6;
		//coordinate e dimensioni bottone REPLAY
		this.xReplay = this.xWinner + this.dimWinner + this.dimWinner / 2;
		this.yReplay = canvas.height / 2;
		this.wReplay = canvas.width / 5;
		this.hReplay = canvas.height / 6;

		this.againButton = document.getElementById("again");
		this.againButton.style.left = this.xReplay;
		this.againButton.style.top = this.yReplay;
		this.againButton.style.width = this.wReplay;
		this.againButton.style.height = this.hReplay;
		this.againButton.style.fontSize = canvas.width / 18;

		this.againButtonClicked = false;

 	}

	update(){
		this.againButton.style.visibility = "visible";
		this.againButton.style.color = this.gameManager.game.winner.color;
		if(this.againButtonClicked){
			this.againButtonClicked = false;
			this.againButton.style.visibility = "hidden";
			this.gameManager.inVictoryScreen = false;
			this.gameManager.inChooseScreen = true;
			this.gameManager.game.init();
		}
	}

	render(){
		let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
 		grd.addColorStop(0, this.gameManager.game.loser.defaultColor);
		grd.addColorStop(0.7, this.gameManager.game.winner.defaultColor);

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//disegna vincitore
		Player.renderPlayerBody(this.xWinner, this.yWinner, this.dimWinner, this.gameManager.game.winner.defaultColor, true, true);
		//disegna scritta ":| wins"
		ctx.fillStyle = "white";
		ctx.font = canvas.width / 15 + "px fixedsys";
		ctx.fillText(this.gameManager.game.winner.name + " wins", this.xText, this.yText);
	}	
}