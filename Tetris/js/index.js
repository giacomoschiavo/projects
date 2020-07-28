const widthCanvas = 400;
const nRows = 23;
const nCols = 15;

let shape = [new LShape(0, 0), new LShape(2, 4), new LShape(8, 4)];
let grid;
function setup() {
  grid = new Grid(nRows, nCols, widthCanvas);
  grid.createGameCanvas();
  grid.addShape(shape);
}

function draw() {
  frameRate(2);
  grid.update();
  grid.drawGrid();
  grid.drawShapes();
}
