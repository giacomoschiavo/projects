class Player{

	constructor(initialX, initialY, color, game, isClone = false, headPlayer = undefined){
		//l'oggetto gioco
		this.game = game;
		//posizione iniziale del giocatore
		this.initialX = initialX;
		this.initialY = initialY;
		//nome identificativo del giocatore (max 6 lettere)
		this.name = undefined;
		this.defaultColor = color;
		//colore del giocatore
		this.color = color;
		//dimensioni proiettile normale
		this.shotsWidth = canvas.width / 100;
		this.shotsHeight = canvas.height / 50;
		//tempo di sparo
		this.shotRate = playerShotRate;
		//velocita del giocatore
		this.velocity = playerDefaultVelocity;
		//lunghezza animazione
		this.hitAnimationLength = 30;
		//contatore per l'animazione
		this.hitAnimTimer = 0;
		//ricarica totale
		this.fullChargingTime = 600;
		this.dischargeTimeUnit = 10;
		this.chargeTimeUnit = this.dischargeTimeUnit / 2;
		//this.pew = new Audio("sounds/pew.mp3");
		//this.pew.volume = 0.9;
		this.hitSound = new Audio("sounds/hit_sound.mp3");
		this.hitSound.volume = 0.2;
		this.isClone = isClone;
		//inizializzazione di altre variabili
		this.clone = undefined;
		if(this.isClone){
			this.headPlayer = headPlayer;
			this.headPlayer.clone = this;
		}
		this.otherPlayer = undefined;
		//creato in Game
		this.bonusManager = new BonusManager(this);
	}

	init(){
		//coordinate del giocatore
		this.x = this.initialX;
		this.y = this.initialY;
		//dimensioni del giocatore
		this.dim = this.game.playerDim;
		//dimensione dell'occhio
		this.eyeDim = this.dim / 4;
		//oggetto di ascoltatori
		this.listeners = {
			up : false,
			down : false,
			right : false,
			left : false
		};
		//vita attuale del giocatore
		this.life = playerInitialLife;
		//colore attuale
		this.color = this.defaultColor;
		//timer del proiettile, al shotRate spara
		this.shotTimer = 0;
		//tutti i proiettili
		this.shots = [];
		//colpito?
		this.isHitted = false;
		//charging timer
		this.chargeTimer = 599;
		this.stillPressed = false;
		this.isPowered = false;
		this.hasShield = false;
		//velocita del proiettile normale
		this.shotsVelocity = playerShotsVelocity;
		this.poweredShotsVelocity = playerShotsVelocity + canvas.width / 150;
		this.poweredShotRate = playerShotRate - (canvas.width / canvas.height) * 8;
		this.poweredVelocity = playerDefaultVelocity / 2;
		//potenza del proiettile
		this.shotDamage = 1;
		this.nowYouWait = false;
		//inizializzazione bonus manager
		this.bonusManager.init();
	}

	update(gameListeners){
		if(!this.isClone){
			this.bonusManager.update();
		}
		//quando un giocatore perde tutta la vita
		if(this.life <= 0){
			//vincitore è l'altro
			this.game.winner = this.otherPlayer;
			this.game.loser = this;
			//cambia schermata
			this.game.gameManager.inGame = false;
			this.game.gameManager.inVictoryScreen = true;		
		}
		//aggiorna timer di sparo
		this.shotTimer++;
		//aggiorna gli ascoltatori
		this.listeners = gameListeners;
		//controlla per gli input
		this.checkInputPlayer();
		//aggiorna posizione proiettili
		this.updateShots();
		if(!this.isClone){
			//controllo collisioni con proiettili
			this.checkShotsCollisions();
		}
		this.checkScreenCollision();
		//applica il potenziamento
		if(this.isPowered){
			this.shotsVelocity = this.poweredShotsVelocity;
			this.shotRate = this.poweredShotRate;
			this.velocity = this.poweredVelocity;
		}else{
			this.shotsVelocity = playerShotsVelocity;
			this.shotRate = playerShotRate;
			this.velocity = playerDefaultVelocity;
		}
	}

	render(){	
		//disegna nome del giocatore
		this.renderPlayerName();
		//disegna proiettili
		this.renderShots();
		//disegna la barra del potenziamento
		this.renderPowerBar();
		//disegna corpo, occhi, bocca... del giocatore
		this.renderPlayerBody();
		if(!this.isClone){
			this.bonusManager.render();
		}
	}

	//registra input per giocatore
	checkInputPlayer(){
		if(this.listeners.up){
			this.y -= this.velocity;
		}else if(this.listeners.down){
			this.y += this.velocity;
		}
		if(this.listeners.right){
			this.x += this.velocity;
		}else if(this.listeners.left){
			this.x -= this.velocity;
		}

		//BARRA POTENZIAMENTO
		if(this.listeners.charge){
			if(this.chargeTimer >= this.fullChargingTime){
				this.chargeTimer = this.fullChargingTime;
				this.isPowered = false;
				this.nowYouWait = true;
			}else if(!this.nowYouWait){
				this.chargeTimer += this.dischargeTimeUnit;	
				this.isPowered = true;
			}
		}else{
			if(this.chargeTimer < 0){
				this.chargeTimer = 0;
				this.nowYouWait = false;
			}else if(this.nowYouWait || this.chargeTimer < this.fullChargingTime){
				this.chargeTimer -= this.chargeTimeUnit;
			}
			this.isPowered = false;
		}
	}

	//disegna corpo giocatore
	renderPlayerBody(){
		//disegna corpo
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.dim, this.dim);
		//colore del contorno
		ctx.strokeStyle = "white";
		//spessore della linea
		ctx.lineWidth = 1;
		//disegna contorno corpo
		ctx.strokeRect(this.x, this.y, this.dim, this.dim);
		//dimensione dell'occhio
		let eyeDim = this.dim / 4;
		//coordinate del primo occhio
		let xEyeDim = this.x + this.dim / 8;
		let yEyeDim = this.y + this.dim / 6;
		//dimensione della pupilla
		let pupilDim = eyeDim / 2;
		//disegna bocca
		ctx.fillStyle = "black";
		ctx.fillRect(this.x + this.dim / 10, this.y + this.dim / 2, this.dim / 10 * 8, 2);
		//se non colpito
		if(!this.isHitted){
			ctx.fillStyle = "white";
			//disegna occhio destro
			ctx.fillRect(this.x + this.dim / 8, this.y + this.dim / 6, this.eyeDim, this.eyeDim);
			//disegna occhio sinistro
			ctx.fillRect(this.x + this.dim / 8 * 5, this.y + this.dim / 6, this.eyeDim, this.eyeDim);
			//ottieni l'altro giocatore per seguirlo con le pupille
			//pupille cambiano direzione in base a dove si trova l'altro giocatore
			let right = this.x < this.otherPlayer.x;
			let down = this.y < this.otherPlayer.y;
			//posizione della pupilla
			let offsetX = right ? pupilDim : 0;
			let offsetY = down ? pupilDim : 0;
			//colore della pupilla
			ctx.fillStyle = "black";
			//disegna pupille
			ctx.fillRect(xEyeDim + offsetX, yEyeDim + offsetY, pupilDim, pupilDim);
			ctx.fillRect(xEyeDim + this.dim / 2 + offsetX, yEyeDim + offsetY, pupilDim, pupilDim);
		}else{
			//altrimenti disegna faccia stordita [X_X]
			//aggiorna timer
			this.hitAnimTimer++;
			//non puo piu sparare
			this.shotTimer = 0;
			ctx.beginPath();
			//spessore della linea
			ctx.lineWidth = 4;
			//prima croce
			ctx.moveTo(xEyeDim, yEyeDim);
			ctx.lineTo(xEyeDim + eyeDim, yEyeDim + eyeDim);
			ctx.moveTo(xEyeDim + eyeDim, yEyeDim);
			ctx.lineTo(xEyeDim, yEyeDim + eyeDim);
			//seconda croce
			ctx.moveTo(xEyeDim + this.dim / 2, yEyeDim);
			ctx.lineTo(xEyeDim + eyeDim + this.dim / 2, yEyeDim + eyeDim);
			ctx.moveTo(xEyeDim + eyeDim + this.dim / 2, yEyeDim);
			ctx.lineTo(xEyeDim + this.dim / 2, yEyeDim + eyeDim);
			//colore croce
			ctx.strokeStyle = "black";
			ctx.stroke();
			ctx.closePath();
			//raggiunto il timer
			if(this.hitAnimTimer === this.hitAnimationLength){
				this.isHitted = false;
				//finisce l'animazione
				this.hitAnimTimer = 0;
			}
		}
	}
	//aggiorna proiettili
	updateShots(){
		for(let i = 0; i < this.shots.length; i++){
			//aumentano della propria velocita
			this.shots[i].x += this.shots[i].velocity.x;
			this.shots[i].y += this.shots[i].velocity.y;
		}
		//lancia un proiettile al momento giusto
		if(this.shotTimer >= this.shotRate){
			//this.pew.play();
			this.shotTimer = 0;
			//aggiungi un proiettile
			this.shots.push({
				//coordinate
				x: this.otherPlayer.x < this.x ? this.x : this.x + this.dim,
				y: this.y + this.dim / 2 - this.shotsHeight / 2,
				//dimensioni
				width: this.shotsWidth,
				height: this.shotsHeight,
				//velocità
				velocity: {
					x: this.otherPlayer.x < this.x ? -this.shotsVelocity : this.shotsVelocity,
					y: 0
				},
				damage: this.shotDamage,
				bounce: false,
				color: this.color
			});
		}
	}

	//disegna i proiettili
	renderShots(){
		for(let i = 0; i < this.shots.length; i++){
			ctx.beginPath();
			//colore del proiettile
			ctx.fillStyle = this.shots[i].color;
			ctx.strokeStyle = "white";
			ctx.lineWidth = 3;
			if(this.shots[i].bounce){
				ctx.arc(this.shots[i].x, this.shots[i].y, this.shots[i].width / 2, 0, Math.PI * 2);
				ctx.fill();
				//ctx.arc(this.shots[i].x, this.shots[i].y, this.shots[i].width / 2, 0, Math.PI * 2);
				ctx.stroke();
			}else{
				//disegna proiettile
				ctx.fillRect(this.shots[i].x, this.shots[i].y, this.shots[i].width, this.shots[i].height);
				ctx.strokeRect(this.shots[i].x, this.shots[i].y, this.shots[i].width, this.shots[i].height);
			}
			ctx.closePath();
		}
	}

	//controlla i proiettili
	checkShotsCollisions(){
		//avversario
		if(!this.isClone){
			for(let i = 0; i < this.otherPlayer.shots.length; i++){
				let shot = this.otherPlayer.shots[i];
				//se colpiscono il giocatore avversario
				if((shot.x + shot.width > this.x && shot.x < this.x + this.dim) && (shot.y + shot.height > this.y && shot.y < this.y + this.dim)){
					//diminuisci la vita avversaria
					if(!this.hasShield){
						this.life -= shot.damage;
						//notifica l'avversario
						this.hitSound.play();
					}else{
						this.life -= shot.damage / 2;
					}
					this.isHitted = true;
					//togli proiettile
					this.otherPlayer.shots.splice(i, 1);
				}
			}	
			if(this.otherPlayer.clone){
				for(let i = 0; i < this.otherPlayer.clone.shots.length; i++){
					let shot = this.otherPlayer.clone.shots[i];
					//se colpiscono il giocatore avversario
					if((shot.x + shot.width > this.x && shot.x < this.x + this.dim) && (shot.y + shot.height > this.y && shot.y < this.y + this.dim)){
						//diminuisci la vita avversaria
						if(!this.hasShield){
							this.life -= shot.damage;
							//notifica l'avversario
							this.hitSound.play();
						}else{
							this.life -= shot.damage / 2;
						}
						this.isHitted = true;
						//togli proiettile
						this.otherPlayer.clone.shots.splice(i, 1);
					}
				}
			}
		}
	}

	checkScreenCollision(){
		//collisioni con schermo
		if(this.x < 0){
			this.x = 0;
		}else if(this.x + this.dim > canvas.width){
			this.x = canvas.width - this.dim;
		}    

		if(this.y < 0){
			this.y = 0;
		}else if(this.y + this.dim > canvas.height){
			this.y = canvas.height - this.dim;
		}

		for(let i = 0; i < this.otherPlayer.shots.length; i++){
			let shot = this.otherPlayer.shots[i];
			if(shot.x > canvas.width || shot.x + shot.width < 0){
				if(shot.bounce){
					shot.x = shot.x + shot.width > canvas.width	? canvas.width - shot.width : 0;	
					shot.velocity.x *= -1;
				}else{
					this.otherPlayer.shots.splice(i, 1);
				}
			}
			if(shot.y > canvas.height || shot.y + shot.height < 0){
				if(shot.bounce){
					shot.y = shot.y + shot.width > canvas.height ? canvas.height - shot.width : 0;	
					shot.velocity.y *= -1;
				}else{
					this.otherPlayer.shots.splice(i, 1);
				}
			}
		}
	}

	//disegna nome del giocatore
	renderPlayerName(){
		ctx.fillStyle = "white";
		let dimension = (canvas.width / canvas.height);
		ctx.font = dimension * 15 + "px fixedsys";
		ctx.fillText(this.name, this.x + this.game.playerDim / 2 - dimension * this.name.length * 4, this.y - dimension * 2);
	}

	static renderPlayerBody(x, y, dim, color, right = false, down = false, hitted = false){
		//disegna corpo
		ctx.fillStyle = color;
		ctx.fillRect(x, y, dim, dim);
		//disegna bocca
		ctx.fillStyle = "black";
		ctx.fillRect(x + dim / 10, y + dim / 2, dim / 10 * 8, 2);
		//colore del contorno
		ctx.strokeStyle = "black";
		//spessore della linea
		ctx.lineWidth = 2;
		//disegna contorno corpo
		ctx.strokeRect(x, y, dim, dim);
		//dimensione dell'occhio
		let eyeDim = dim / 4;
		//x del primo occhio
		let xEyeDim = x + dim / 8;
		//dimensione della pupilla
		let pupilDim = eyeDim / 2;
		//posizione della pupilla
		let offsetX = right ? pupilDim : 0;
		let offsetY = down ? pupilDim : 0;
		if(hitted){
			ctx.beginPath();
			//spessore della linea
			ctx.lineWidth = 4;
			//prima croce
			ctx.moveTo(xEyeDim, y + dim / 6);
			ctx.lineTo(xEyeDim + eyeDim, y + dim / 6 + eyeDim);
			ctx.moveTo(xEyeDim + eyeDim, y + dim / 6);
			ctx.lineTo(xEyeDim, y + dim / 6 + eyeDim);
			//seconda croce
			ctx.moveTo(xEyeDim + dim / 2, y + dim / 6);
			ctx.lineTo(xEyeDim + eyeDim + dim / 2, y + dim / 6 + eyeDim);
			ctx.moveTo(xEyeDim + eyeDim + dim / 2, y + dim / 6);
			ctx.lineTo(xEyeDim + dim / 2, y + dim / 6 + eyeDim);
			//colore croce
			ctx.strokeStyle = "black";
			ctx.stroke();
			ctx.closePath();
		}else{
			//disegno della pupilla
			ctx.fillStyle = "white";
			//disegna occhio destro
			ctx.fillRect(x + dim / 8, y + dim / 6, dim / 4, dim / 4);
			//disegna occhio sinistro
			ctx.fillRect(x + dim / 8 * 5, y + dim / 6, dim / 4, dim / 4);
			ctx.fillStyle = "black";
			ctx.fillRect(xEyeDim + offsetX, y + dim / 6 + offsetY, pupilDim, pupilDim);
			ctx.fillRect(xEyeDim + dim / 2 + offsetX, y + dim / 6 + offsetY, pupilDim, pupilDim);
		}
	}

	renderPowerBar(){
		let powerDim = (this.fullChargingTime - this.chargeTimer) * this.dim / this.fullChargingTime;
		if(!this.nowYouWait){
			ctx.fillStyle = "yellow";
		}else{
			ctx.fillStyle = "black";
		}
		ctx.fillRect(this.x, this.y + this.dim + this.dim / 6, powerDim, this.dim / 5);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		ctx.strokeRect(this.x, this.y + this.dim + this.dim / 6, this.dim, this.dim / 5);
	}
}