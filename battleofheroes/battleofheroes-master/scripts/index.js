//dichiarazione canvas e context
var canvas = document.getElementById("myCanvas"), ctx = canvas.getContext("2d");
//dichiarazioni costanti
const canvas_width = screen.width, canvas_height = screen.height;
//const canvas_width = 800, canvas_height = 500;
const playerInitialLife = 30;
const playerDefaultVelocity = Math.floor((canvas.width / canvas.height) * 5);
const playerShotRate = Math.floor(canvas.width / 11);
const playerShotsVelocity = Math.floor((canvas.width / canvas.height) * 6);
//impostazione dimensioni canvas0
canvas.width = canvas_width, canvas.height = canvas_height;
//creazione della classe Game
var gameManager = new GameManager();

//dichiarazione game loop 
function gameLoop(){
	//richiama game loop dell'oggetto game
	gameManager.getLoop();
	//richiama per doppio buffering
	window.requestAnimationFrame(gameLoop);
}

function random(min, max){
	return Math.floor(Math.random() * (max - min)) + min;
}

var f11pressed = false;

function clickPlay(){
	gameManager.menu.playButtonClicked = true;
}

function clickOptions(){
	gameManager.menu.optionsClicked = true;
}

function changeButtonClickedA(){
	gameManager.choose.indexAColor++;
}
function changeButtonClickedB(){
	gameManager.choose.indexBColor++;
}
function clickAgain(){
	gameManager.victory.againButtonClicked = true;
}
function onGoClicked(){
	gameManager.choose.goButtonClicked = true;
}
window.requestAnimationFrame(gameLoop);