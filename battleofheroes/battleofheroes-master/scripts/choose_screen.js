class ChooseScreen{
	constructor(gameMng){
		//gestore del gioco
		this.gameManager = gameMng;
		//dimensioni giocatori in schermata
		this.playerDim = canvas.width / 5; 
		//coordinate giocatori in schermata, [0] a sinistra, [1] a destra
		this.xPlayers = [canvas.width / 4 - this.playerDim / 2, canvas.width / 4 * 3 - this.playerDim / 2];
		this.yPlayers = canvas.height / 2 - this.playerDim / 2;
		//indice per ottenere colore
		this.indexAColor = 0;
		this.indexBColor = 1;
		//colore iniziale
		this.playerAColor = this.gameManager.availableColor[this.indexAColor];
		this.playerBColor = this.gameManager.availableColor[this.indexBColor];
		//CHANGE
		this.changeButtons = document.getElementsByClassName("changeButton");
		this.bChange1 = this.changeButtons[0];
		this.bChange2 = this.changeButtons[1];
		//dimensioni CHANGE
		this.wChange = canvas.width / 7;
		this.hChange = canvas.height / 10;
		//coordinate CHANGE
		this.yChange = this.yPlayers - canvas.height / 6;
		//coordinate CHANGE[0]
		this.bChange1.style.left = this.xPlayers[0] + this.playerDim / 2 - this.wChange / 2 + "px";
		this.bChange1.style.top = this.yChange + "px";
		//coordinate CHANGE[1]
		this.bChange2.style.left = this.xPlayers[1] + this.playerDim / 2 - this.wChange / 2 + "px";
		this.bChange2.style.top = this.yChange + "px";
		//dimensioni CHANGE
		this.bChange1.style.width = this.wChange + "px";
		this.bChange2.style.width = this.wChange + "px";
		this.bChange1.style.height = this.hChange + "px";
		this.bChange2.style.height = this.hChange + "px";
		//testo CHANGE
		this.bChange1.style.fontSize = canvas.width / 40;
		this.bChange2.style.fontSize = canvas.width / 40;
		this.changeButtonA = false;
		this.changeButtonB = false;
		//oggetti dei form, i nomi dei giocatori
		this.inputA = document.getElementById("playerNameA");
		this.inputB = document.getElementById("playerNameB");
		//colore sfondo dei form
		this.inputA.style.backgroundColor = this.playerAColor;
		this.inputB.style.backgroundColor = this.playerBColor;
		//dimensioni form
		this.inputA.style.width = canvas.width / 9;
		this.inputA.style.fontSize = canvas.width / 50;
		this.inputB.style.width = canvas.width / 9;
		this.inputB.style.fontSize = canvas.width / 50;
		//posizionali corretti
		this.inputA.style.top = this.yPlayers + this.playerDim + 30 + "px";
		this.inputB.style.top = this.yPlayers + this.playerDim + 30 + "px";
		this.inputA.style.left = canvas.width / 100 * 19 + "px";
		this.inputB.style.left = canvas.width / 100 * 69 + "px";
		//tasto GO
		this.goButton = document.getElementById("go");
		//coordinate GO
		this.goButton.style.top = canvas.height / 100 * 70;
		this.goButton.style.left = canvas.width / 100 * 44;
		//dimensioni GO
		this.goButton.style.width = canvas.width / 9;
		this.goButton.style.height = canvas.height / 10;
		this.goButton.style.fontSize = canvas.width / 20;
		this.goButtonClicked = false;
		//direzioni occhi casuali
		this.eyes = [random(0, 2), random(0, 2)];
	}


	update(){
		//CHANGE visibili
		this.bChange1.style.visibility = "visible";
		this.bChange2.style.visibility = "visible";
		//CHANGE visibili
		this.inputA.style.visibility = "visible";
		this.inputB.style.visibility = "visible";
		//GO visibile
		this.goButton.style.visibility = "visible";
		//se clicca sul tasto continue
		if(this.goButtonClicked && f11pressed){
			this.goButtonClicked = false;
			//se i nomi sono uguali		
			this.gameManager.game.playerA.name = this.inputA.value;
			this.gameManager.game.playerB.name = (this.inputA.value === this.inputB.value) ? this.inputB.value + " Clone" : this.inputB.value;
			//cambia colore in base a quello scelto
			this.gameManager.game.playerA.color = this.playerAColor;
			this.gameManager.game.playerB.color = this.playerBColor;
			this.gameManager.game.playerA.defaultColor = this.playerAColor;
			this.gameManager.game.playerB.defaultColor = this.playerBColor;
			//nascondi i form
			this.inputA.style.visibility = "hidden";
			this.inputB.style.visibility = "hidden";
			//nascondi CHANGE
			this.bChange1.style.visibility = "hidden";
			this.bChange2.style.visibility = "hidden";
			//nascondi GO
			this.goButton.style.visibility = "hidden";
			//avvisa il gestore delle schermate
			this.gameManager.inChooseScreen = false;
			this.gameManager.game.playerA.life = this.gameManager.tutorialDone ? playerInitialLife : this.gameManager.tutorial.tutorialLife;
			this.gameManager.game.playerB.life = this.gameManager.tutorialDone ? playerInitialLife : this.gameManager.tutorial.tutorialLife;
			this.gameManager.tutorialDone ? this.gameManager.inGame = true : this.gameManager.inTutScreen = true;
		}
		
		this.goButtonClicked = false;
		//aggiorna colori dei giocatori
		this.playerAColor = this.gameManager.availableColor[this.indexAColor % this.gameManager.availableColor.length];
		this.playerBColor = this.gameManager.availableColor[this.indexBColor % this.gameManager.availableColor.length];
		//aggiorna colori dei form
		this.inputB.style.backgroundColor = this.playerBColor;
		this.inputA.style.backgroundColor = this.playerAColor;
	}

	render(){
		//disegna le barre della vita
		this.gameManager.game.renderLifeBars(this.playerAColor, this.playerBColor);
		//disegna le linee nel campo
		this.gameManager.game.renderGroundLines();
		//disegna i giocatori
		Player.renderPlayerBody(this.xPlayers[0], this.yPlayers, this.playerDim, this.playerAColor, this.eyes[0], this.eyes[1]);
		Player.renderPlayerBody(this.xPlayers[1], this.yPlayers, this.playerDim, this.playerBColor, this.eyes[1], this.eyes[1]);
		
		if(!f11pressed){
			ctx.font = canvas.width / 50 + "px fixedsys";
			ctx.fillStyle = "white";
			ctx.fillText("Press F11!", canvas.width / 100 * 45, canvas.height / 100 * 85)
		}

		ctx.font = canvas.width / 15 + "px fixedsys";
		ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
		ctx.fillText("CHOOSE YOUR HERO!", canvas.width / 100 * 22, canvas.height / 10);
		ctx.strokeStyle = "white";
		ctx.strokeText("CHOOSE YOUR HERO!", canvas.width / 100 * 22, canvas.height / 10);
	}

}