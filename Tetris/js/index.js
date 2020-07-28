const widthCanvas = 400;
const xSquares = 15;
const ySquares = 23;
const cnvSquare = widthCanvas / xSquares;

let shape = new LShape();
let grid;
function setup() {
  grid = new Grid(ySquares, xSquares, widthCanvas);
  grid.createGameCanvas();
  grid.addShape(shape);
}

function draw() {
  frameRate(2);
  shape.update();
  grid.drawGrid();
  grid.drawShapes();
}
