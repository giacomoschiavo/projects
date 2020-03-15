class GameManager{

	constructor(){
		//colori disponibili
		//TODO: aggiungi colori :D
		this.availableColor = [
			"red",
			"blue",
			"lightblue",
			"rgb(255, 255, 0)",
			"rgb(255, 70, 0)",
			"deeppink",
			"green",
			"rgb(0, 255, 0)",
			"blueviolet",
			"grey",
			"brown",
			"black",
		];
		//schermata menu
		this.menu = new MenuScreen(this);
		//schermata scelta colore e nome
		this.choose = new ChooseScreen(this);
		//schermata gioco
		this.game = new Game(this);
		//schermata tutorial
		this.tutorial = new TutorialScreen(this);
		//schermata vittoria
		this.victory = new VictoryScreen(this);
		//flag di segnalazione
		this.inMenuScreen = true;
		this.inChooseScreen = false;
		this.inTutScreen = false;
		this.inGame = false;
		this.inVictoryScreen = false;

		//variabili musiche
		//musica intro/selezione
		this.introMusic = new Audio("sounds/intro_music.mp3");
		this.introMusic.loop = true;
		this.introMusic.volume = 0.7;
		//musica battaglia
		this.battleMusicStarted = false;
		this.battleMusic = new Audio("sounds/battle_music.mp3");
		this.battleMusic.loop = true;
		this.battleMusic.volume = 0.7;
		//muscia vittoria
		this.winSound =  new Audio("sounds/win_music.mp3");
		this.winSound.loop = true;
		this.winSound.volume = 0.7;
		this.winSoundPlayed = false;
		//se il tut è fatto; evita di rifarlo ogni volta
		this.tutorialDone = false;
	}
	//usato in index.js in gameLoop()
	getLoop(){
		this.update();
		this.render();
	}
	//aggiorna variabili
	//TODO: forse si può mettere a posto; guarda Audio properties
	update(){
		if(this.inMenuScreen){
			// this.menu.music.play();
			this.menu.update();
		}else if(this.inChooseScreen){
			this.winSound.load();
			this.introMusic.play();
			this.choose.update();
		}else if(this.inTutScreen){
			this.tutorial.update();
			this.tutorialDone = true;
		}else if(this.inGame){
			this.introMusic.load();
			this.battleMusic.play();
			this.game.update();
		}else if(this.inVictoryScreen){
			this.battleMusic.load();
			this.winSound.play();
			this.victory.update();
		}
	}
	//disegna
	render(){
		if(this.inMenuScreen){
			this.menu.render();
		}else if(this.inChooseScreen){
			this.choose.render();
		}else if(this.inTutScreen){
			this.tutorial.render();
		}else if(this.inGame){
			this.game.render();
		}else if(this.inVictoryScreen){
			this.victory.render();
		}
	}

	//restituisce un colore a caso
	generateRandomColor(){
		let index = Math.floor(Math.random() * this.availableColor.length);
		return this.availableColor[index];
	}
}
