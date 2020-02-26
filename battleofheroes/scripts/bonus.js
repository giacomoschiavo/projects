class Bonus{
	constructor(player, color){
		this.radius = canvas.height / 40;
		this.player = player;
		this.sound = new Audio("sounds/bonus_sound.m4a");
		this.sound.volume = 0.5;
		this.color = color;
		this.initBonus();
	}

	initBonus(){
		let offsetWidth = canvas.width / 10;
		let offsetHeight = canvas.height / 10;
		this.x = Math.floor(Math.random() * (canvas.width - offsetWidth * 2)) + offsetWidth;
		this.y = Math.floor(Math.random() * (canvas.height - offsetHeight * 2)) + offsetHeight;
		this.isTaken = false;
	}

	update(){
		if((this.player.x + this.player.dim > this.x - this.radius && this.player.x < this.x + this.radius) && (this.player.y + this.player.dim > this.y - this.radius && this.player.y < this.y + this.radius) && !this.isTaken){
			this.isTaken = true;
			this.sound.play();
		}
	}

	render(){
		if(!this.isTaken){
			ctx.beginPath();
			ctx.fillStyle = this.player.color;
			ctx.arc(this.x, this.y, this.radius, Math.PI / 2, (Math.PI * 3) / 2);
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, this.radius, (Math.PI * 3) / 2, Math.PI / 2);
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.strokeStyle = this.player.game.gameManager.generateRandomColor();
			ctx.lineWidth = 3;
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.closePath();
		}
	}

}

class StupidShots extends Bonus{
	constructor(player){
		super(player, "#22F951");
		this.shotsDim = this.player.shotsWidth + 5;
	}

	init(){
		super.initBonus();
		this.added = false;
	}

	update(){
		super.update();
		if(this.isTaken && !this.added){
			this.player.shots.push({
				//coordinate
				x: this.player.x > this.player.otherPlayer.x ? this.player.x : this.player.x + this.player.dim - this.shotsDim,
				y: this.player.y - this.shotsDim,
				//dimensioni
				width: this.shotsDim,
				height: this.shotsDim,
				//velocità
				velocity: {
					x: this.player.x > this.player.otherPlayer.x ? -this.player.shotsVelocity : this.player.shotsVelocity,
					y: this.player.shotsVelocity - 5
				},
				damage: this.player.shotDamage,
				bounce: true,
				color: this.player.color
			});
			this.player.shots.push({
				//coordinate
				x: this.player.x > this.player.otherPlayer.x ? this.player.x : this.player.x + this.player.dim - this.shotsDim,
				y: this.player.y + this.player.dim,
				//dimensioni
				width: this.shotsDim,
				height: this.shotsDim,
				//velocità
				velocity: {
					x: this.player.x > this.player.otherPlayer.x ? -this.player.shotsVelocity : this.player.shotsVelocity,
					y: -this.player.shotsVelocity - 5
				},
				damage: this.player.shotDamage,
				bounce: true,
				color: this.player.color
			});
			this.added = true;
		}
	}

	render(){
		super.render();
	}	
}

class Clone extends Bonus{
	constructor(player){
		super(player, "#4B0082");
	}

	init(){
		super.initBonus();
		this.clone = new Player(this.player.otherPlayer.x, this.player.otherPlayer.y, this.player.color, this.player.game, true, this.player);
		this.clone.init();
		this.player.clone = this.clone;
		this.clone.life = 20;
		this.clone.name = "CLONE";
		this.clone.color = this.player.color;
		this.clone.shotDamage = 0.5;
		this.clone.otherPlayer = this.player.otherPlayer;
	}

	update(){
		super.update();
		if(this.isTaken){
			this.clone.update(this.player.listeners);
		}
	}

	render(){
		super.render();
		if(this.isTaken){
			this.clone.render();
			ctx.strokeStyle = this.player.color;
			ctx.lineWidth = 3;
			ctx.strokeRect(this.clone.x, this.clone.y, this.clone.dim, this.clone.dim);
		}
	}	
}

class Asteroids extends Bonus{
	constructor(player){
		super(player, "brown");
		this.asteroidsVelocity = canvas.height / 100;
		this.damage = 5;
	}

	init(){
		super.initBonus();
		this.asteroidsDim = this.player.dim - 5;
		this.asteroidsY = -this.asteroidsDim;
		this.asteroids = [
			canvas.width / 2 + canvas.width / 12 - this.asteroidsDim / 2,
			canvas.width / 2 + canvas.width / 4 - this.asteroidsDim / 2,
			canvas.width / 2 + canvas.width / 12 * 5 - this.asteroidsDim / 2,
			canvas.width / 12 - this.asteroidsDim / 2,
			canvas.width / 4 - this.asteroidsDim / 2,
			canvas.width / 12 * 5 - this.asteroidsDim / 2 
		];
		this.added = false
	}

	update(){
		super.update();
		if(this.isTaken && !this.added){
			this.addShot(0);
			this.addShot(1);
			this.addShot(2);
			this.addShot(3);
			this.addShot(4);
			this.addShot(5);

			this.added = true;
		}
	}

	addShot(shot){
		this.player.shots.push({
			//coordinate
			x: this.asteroids[shot],
			y: this.asteroidsY + 1,
			//dimensioni
			width: this.asteroidsDim,
			height: this.asteroidsDim,
			//velocità
			velocity: {
				x: 0,
				y: this.asteroidsVelocity
			},
			damage: this.damage,
			bounce: false,
			color: this.player.defaultColor
		});
	}

	render(){
		super.render();
	}	
}

class Shield extends Bonus{
	constructor(player){
		super(player, "yellow");
	}

	init(){
		super.initBonus();
	}

	update(){
		super.update();
		if(this.isTaken){
			this.player.hasShield = true;
			this.player.shotDamage = 0.5;
		}
	}

	render(){
		super.render();
		if(this.isTaken){
			ctx.strokeStyle = "yellow";
			ctx.lineWidth = 3;
			ctx.strokeRect(this.player.x, this.player.y, this.player.dim, this.player.dim);
		}
	}	
}

class Berserk extends Bonus{
	constructor(player){
		super(player, "black");
	}

	init(){
		super.initBonus();
		this.previousColor = this.player.color;
	}

	update(){
		super.update();
		if(this.isTaken){
			this.player.shotDamage = 2;
			this.player.color = this.player.game.gameManager.generateRandomColor();
			this.player.shotsVelocity = this.player.poweredShotsVelocity;
			this.player.shotRate = this.player.poweredShotRate;
		}
	}

	render(){
		super.render();
	}	
}

class MagicBullets extends Bonus{
	constructor(player){
		super(player, "white");
		this.damage = 6;
	}

	init(){
		super.initBonus();
		this.bulletsDim = canvas.height / 3 * 2;
		this.added = false;
	}

	update(){
		super.update();
		if(this.isTaken && !this.added){
			this.player.shots.push({
				x: this.player.x > this.player.otherPlayer.x ? canvas.width : -this.bulletsDim,
				y: canvas.height / 6,
				//dimensioni
				width: this.bulletsDim,
				height: this.bulletsDim,
				//velocità
				velocity: {
					x: this.player.x > this.player.otherPlayer.x ? -this.player.shotsVelocity : this.player.shotsVelocity,
					y: 0
				},
				damage: this.damage,
				bounce: false,
				color: this.player.color
			});

			this.added = true;
		}
	}

	render(){
		super.render();
	}	
}


class BonusManager{
	constructor(player){
		//player a cui appartiene
		this.player = player;
		//lista dei bonus
		this.bonuses = [
			new StupidShots(this.player),
			new Clone(this.player),
			new Asteroids(this.player),
			new Shield(this.player),
			new Berserk(this.player),
			new MagicBullets(this.player)
		];
		//tempo del bonus
		this.bonusTime = 500;
		//bonus attuale
		this.currentBonus = this.bonuses[0];
	}

	init(){
		this.currentBonus = this.bonuses[0];
		this.currentBonus.init();
		this.timer = 0;
	}

	update(){
		//aumenta il timer
		this.timer++;
		//se il timer raggiunge il tempo bonus ed è stato inizializzato
		if(this.timer >= this.bonusTime){
			this.currentBonus = this.bonuses[Math.floor(Math.random() * this.bonuses.length)];
			this.resetPlayer();
			this.currentBonus.init();
			this.timer = 0;
		}

		this.currentBonus.update();
	}

	render(){
		this.currentBonus.render();
	}

	resetPlayer(){
		this.player.shotDamage = 1;
		this.player.shotsVelocity = playerShotsVelocity;
		this.player.shotRate = playerShotRate;
		this.player.color = this.player.defaultColor;
		this.player.hasShield = false;
		this.player.clone = undefined;
	}
}