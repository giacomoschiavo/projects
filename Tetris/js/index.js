const widthCanvas = 400;
const nRows = 23;
const nCols = 15;

let shape = [
  new IShape(0, 0),
  new OShape(1, -2),
  new SShape(2, -5),
  new ZShape(3, -9),
  new JShape(4, -13),
  new LShape(5, -15),
  new TShape(6, -18)
];

let grid;

function setup() {
  grid = new Grid(nRows, nCols, widthCanvas);
  grid.createGameCanvas();
  grid.addShape(shape);
}

function draw() {
  frameRate(3);
  grid.update();
  grid.drawGrid();
  grid.drawShapes();
}
