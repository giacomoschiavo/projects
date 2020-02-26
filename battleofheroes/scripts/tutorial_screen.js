class TutorialScreen{

	constructor(gameManager){
		this.gameManager = gameManager;
		this.game = this.gameManager.game;
		this.controlA = new Image();
		this.controlA.src = "images/controlli A.png";
		this.controlB = new Image();
		this.controlB.src = "images/controlli B.png";
		this.tutorialLife = 10;
		this.gameManager.game.playerA.bonusManager.init();
		this.gameManager.game.playerB.bonusManager.init();
	}

	update(){
		this.game.playerA.update(playerAKeys);
		this.game.playerB.update(playerBKeys);

		if(this.game.playerA.life <= 0 || this.game.playerB.life <= 0){
			this.restartGame();
		}
	}

	restartGame(){
		this.gameManager.inTutScreen = false;
		this.gameManager.game.render();
		this.gameManager.game.playerA.init();
		this.gameManager.game.playerB.init();
		this.gameManager.inGame = true;
	}

	render(){
		ctx.beginPath();
		//sfondo
		ctx.fillStyle = "#102030";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//disegna barra della vita
		this.game.renderLifeBars(undefined, undefined, this.tutorialLife);
		//disegna il campo
		this.game.renderGroundLines();
		ctx.font = canvas.width / 15 + "px fixedsys";
		ctx.fillStyle = "white";
		ctx.fillText("TUTORIAL", 10, canvas.height / 10);

		this.drawControls();

		//disegna giocatore A
		this.game.playerA.render();
		//disegna giocatore B
		this.game.playerB.render();
		//TODO
		if(!this.game.playerA.bonusManager.currentBonus.isTaken){
			this.writeBonus(this.game.playerA.bonusManager);
		}
		if(!this.game.playerB.bonusManager.currentBonus.isTaken){
			this.writeBonus(this.game.playerB.bonusManager);
		}

		ctx.closePath();
	}

	drawControls(){
		ctx.drawImage(this.controlA, canvas.width / 100 * 5, canvas.height / 10 * 7, canvas.width / 100 * 35, canvas.height / 10 * 3);
		ctx.drawImage(this.controlB, canvas.width / 100 * 60, canvas.height / 10 * 7, canvas.width / 100 * 35, canvas.height / 10 * 3);
	}

	writeBonus(bonus){
		if(bonus.initial){
			ctx.fillStyle = "black";
			ctx.strokeStyle = "white";
			ctx.lineWidth = 1;
			ctx.font = "40px fixedsys";
			ctx.fillText("BONUS", bonus.currentBonus.x - bonus.currentBonus.radius * 2, bonus.currentBonus.y - 10);
			ctx.strokeText("BONUS", bonus.currentBonus.x - bonus.currentBonus.radius * 2, bonus.currentBonus.y - 10);
		}
	}
}