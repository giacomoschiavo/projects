class Grid {

  constructor(nRows, nCols, width = 400) {
    this.nRows = nRows;
    this.nCols = nCols;
    this.width = width;
    this.squareDim = width / nCols;
    this.height = this.squareDim * nRows;
    this.shapes = [];
    this.target = undefined;
  }

  createGameCanvas() {
    return createCanvas(this.width, this.height);
  }

  addShape(shape) {
    if (Array.isArray(shape)) {
      shape.forEach(shap => this.addShape(shap));
      return;
    }
    this.shapes.push(shape);
    this.target = shape;
  }

  drawShapes() {
    this.shapes.forEach(shape => {
      for (let i = 0; i < shape.cubes.length; i++) {
        for (let j = 0; j < shape.cubes[i].length; j++) {
          if (shape.cubes[i][j] == 0) continue;
          stroke(0);
          strokeWeight(2);
          fill(shape.color);
          rect(j * this.squareDim + shape.pos.x * this.squareDim,
            i * this.squareDim + shape.pos.y * this.squareDim,
            this.squareDim, this.squareDim);
        }
      }
    });
  }

  update() {
    this.shapes.forEach(shape => shape.update())
  }

  drawGrid() {
    background(125);
    stroke(200, 200, 200, 100);
    strokeWeight(1);
    for (let i = this.squareDim; i < this.width; i += this.squareDim) {
      line(i, 0, i, this.height);
    }
    for (let i = this.squareDim; i < this.height; i += this.squareDim) {
      line(0, i, this.width, i);
    }
  }

  check(x, y) {
    let result = false;
    this.shapes.forEach(shape => {
      if (shape.check(x, y)) {
        result = true;
        return;
      }
    })
    return result;
  }

  printRows() {
    let rows = [];
    for (let j = 0; j < this.nRows; j++) {
      let row = [];
      for (let i = 0; i < this.nCols; i++) {
        row.push(int(this.check(i, j)));
      }
      rows.push(row);
    }
    console.table(rows)
  }

  stopAll() {
    this.shapes.forEach(shape => shape.stop());
  }
}