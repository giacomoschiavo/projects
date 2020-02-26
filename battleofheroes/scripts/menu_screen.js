//PRIMA SCHERMATA CON TASTO PLAY E SFONDO
//1
class MenuScreen{
	constructor(gameMng){
		//oggetto gamemanager per poter cambiare schermata
		this.gameManager = gameMng;
		//sono responsive, vanno bene così
		//dimensioni del PLAY
		this.widthButton = canvas.width / 4;
		this.heightButton = canvas.height / 5;
		//coordinate del PLAY
		this.xButton = canvas.width / 2 - this.widthButton / 2;
		this.yButton = canvas.height / 2 - 20;
		//impostazioni del PLAY controllati da qui
		this.button = document.getElementById("play");
		//coordinate PLAY
		this.button.style.left = this.xButton;
		this.button.style.top = this.yButton;
		//dimensioni PLAY
		this.button.style.width = this.widthButton + "px";
		this.button.style.height = this.heightButton + "px";
		//testo PLAY
		this.button.style.fontSize = canvas.width / 10;

		//applica sfondo
		this.image = new Image();
		this.image.src = "images/wallpaper.png";
		//se PLAY viene cliccato
		this.playButtonClicked = false;

		this.copyright = document.getElementById("copyright");
		this.copyright.style.left = canvas.width / 100;
		this.copyright.style.top = canvas.height / 100 * 95;
		this.xShift = canvas.width / 100;
		this.yShift = canvas.height / 100;

		this.music = new Audio("sounds/menu_music.mp3");
		this.music.volume = 0.7;
		//alert("PREMI F11 SULLA TASTIERA!");
		//alert(":)");
	}

	update(){
		this.button.style.visibility = "visible";
		if(this.playButtonClicked){
			this.music.load();
			//cambia schermata
			gameManager.inMenuScreen = false;
			gameManager.inChooseScreen = true;
			//nascondi il PLAY
			this.button.style.display = "none";
		}
	}

	render(){
		ctx.beginPath();
		//this.drawBackground();
		//this.gameManager.game.renderLifeBars("rgb(200, 0, 0)", "rgb(0, 0, 200)");
		ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
		//this.drawTitle();
		this.drawRedSquares();
		this.drawBlueSquares();
		//disegna sfondo
		ctx.closePath();
		this.xShift += 1 % canvas.width / 15;
		this.yShift += 1 % canvas.height / 15;
	}

	drawBackground(){
		ctx.fillStyle = "rgb(100, 0, 0)";
		ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 4 * 3);

		ctx.fillStyle = "rgb(0, 0, 100)";
		ctx.fillRect(canvas.width / 2, 0, canvas.width, canvas.height / 4 * 3);

		ctx.beginPath();
		ctx.moveTo(0, canvas.height / 4 * 3);
		ctx.lineTo(canvas.width, canvas.height / 4 * 3);

		ctx.moveTo(canvas.width / 2, canvas.height / 4 * 3);
		ctx.lineTo(canvas.width / 100 * 45, canvas.height);	

		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		ctx.lineWidth = canvas.width / 200;
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.closePath();
	}

	drawTitle(){
		ctx.font = canvas.width / 10 + "px fixedsys";
		ctx.fillStyle = "white";
		ctx.fillText("Battle Of", canvas.width / 100 * 26, canvas.height / 100 * 26);
		ctx.fillText("Heroes", canvas.width / 100 * 35, canvas.height / 100 * 42);
	}

	drawRedSquares(){
		let xUnit = canvas.width / 100;
		let yUnit = canvas.height / 100;

		Player.renderPlayerBody(xUnit * -1 + Math.cos(this.xShift) * -2, yUnit * 10 + Math.cos(this.yShift) * 1, xUnit * 9, "red", true, true);
		Player.renderPlayerBody(xUnit * 6 + Math.cos(this.xShift) * 2, yUnit * 20 + Math.cos(this.yShift) * -2, xUnit * 13, "red", true, true);
		Player.renderPlayerBody(xUnit * -6 + Math.cos(this.xShift) * -1, yUnit * 22 + Math.cos(this.yShift) * 3, xUnit * 15, "red", true, true);
		Player.renderPlayerBody(xUnit * -4 + Math.cos(this.xShift) * 2, yUnit * 40 + Math.cos(this.yShift) * -2, xUnit * 20, "red", true, false);
		Player.renderPlayerBody(xUnit * 5 + Math.cos(this.xShift) * -3, yUnit * 35 + Math.cos(this.yShift) * 2, xUnit * 18, "red", true, false);
		Player.renderPlayerBody(xUnit * 22 + Math.cos(this.xShift) * 4, yUnit * 62 + Math.cos(this.yShift) * -3, xUnit * 10, "red", true, false);
		Player.renderPlayerBody(xUnit * 20 + Math.cos(this.xShift) * -3, yUnit * 75 + Math.cos(this.yShift) * 3, xUnit * 15, "red", true, false);
		Player.renderPlayerBody(xUnit * -1 + Math.cos(this.xShift) * 2, yUnit * 60 + Math.cos(this.yShift) * -3, xUnit * 25, "red", true, false);
	}

	drawBlueSquares(){
		let xUnit = canvas.width / 100;
		let yUnit = canvas.height / 100;

		Player.renderPlayerBody(xUnit * 94 + Math.cos(this.xShift) * 4, yUnit * 10 + Math.cos(this.yShift) * -4, xUnit * 9, "blue", false, true);
		Player.renderPlayerBody(xUnit * 84 + Math.cos(this.xShift) * -5, yUnit * 20 + Math.cos(this.yShift) * 2, xUnit * 13, "blue", false, true);
		Player.renderPlayerBody(xUnit * 95 + Math.cos(this.xShift) * -2, yUnit * 22 + Math.cos(this.yShift) * -1, xUnit * 15, "blue", false, true);
		Player.renderPlayerBody(xUnit * 90 + Math.cos(this.xShift) * -4, yUnit * 40 + Math.cos(this.yShift) * -2, xUnit * 20, "blue", false, false);
		Player.renderPlayerBody(xUnit * 75 + Math.cos(this.xShift) * 2, yUnit * 35 + Math.cos(this.yShift) * -5, xUnit * 18, "blue", false, false);
		Player.renderPlayerBody(xUnit * 89 + Math.cos(this.xShift) * -3, yUnit * 65 + Math.cos(this.yShift) * -3, xUnit * 20, "blue", false, false);
		Player.renderPlayerBody(xUnit * 65 + Math.cos(this.xShift) * 5, yUnit * 60 + Math.cos(this.yShift) * -4, xUnit * 25, "blue", false, false);
		Player.renderPlayerBody(xUnit * 89 + Math.cos(this.xShift) * 2, yUnit * 87 + Math.cos(this.yShift) * 3, xUnit * 10, "blue", false, false);
	}
}