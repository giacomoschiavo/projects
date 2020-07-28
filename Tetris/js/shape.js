class Shape {
  constructor(pos, cubes, color) {
    this.pos = pos;
    this.cubes = cubes;
    this.color = color;
    this.stopped = false;
  }

  update() {
    if (this.stopped) return;
    this.collide();
    this.pos.y++;
  }

  stop() {
    this.stopped = true;
  }

  start() {
    this.stopped = false;
  }

  check(row, col) {
    let margin = this.cubes.length;
    if (row >= this.pos.x + margin || col >= this.pos.y + margin || row < this.pos.x || col < this.pos.y) {
      return false;
    }
    let xOffset = row - this.pos.x;
    let yOffset = col - this.pos.y;
    if (this.cubes[yOffset][xOffset]) return true;
  }

  rotate() {
    let upLeft = this.cubes[2][0];
    let upRight = this.cubes[0][0];
    let downRight = this.cubes[0][2];
    let downLeft = this.cubes[2][2];

    let up = this.cubes[1][0];
    let right = this.cubes[0][1];
    let down = this.cubes[1][2];
    let left = this.cubes[2][1];

    let center = this.cubes[1][1];

    this.cubes = [
      [upLeft, up, upRight],
      [left, center, right],
      [downLeft, down, downRight]
    ];
  }
}

class LShape extends Shape {
  constructor(x, y) {
    let cubes = [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ];
    super(new p5.Vector(x, y), cubes, "orange");
  }

}

class JShape extends Shape {
  constructor(x, y) {
    let cubes = [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ];
    super(new p5.Vector(x, y), cubes, "blue");
  }


}

class IShape extends Shape {
  constructor(x, y) {
    let cubes = [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ];
    super(new p5.Vector(x, y), cubes, "lightblue");
  }

  rotate() {
    // 1. reverse
    let reversed = this.cubes.reverse();
    // 2. transpose
    this.cubes = this.transpose(reversed);
  }

  transpose(matrix) {
    let newMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(this.cubes[j][i]);
      }
      newMatrix.push(row);
    }
    return newMatrix;
  }
}

class OShape extends Shape {
  constructor(x, y) {
    let cubes = [
      [1, 1],
      [1, 1],
    ];
    super(new p5.Vector(x, y), cubes, "yellow");
  }

  rotate() {
    return;
  }
}

class TShape extends Shape {
  constructor(x, y) {
    let cubes = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]; super(new p5.Vector(x, y), cubes, "purple");
  }
}

class SShape extends Shape {
  constructor(x, y) {
    let cubes = [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ];
    super(new p5.Vector(x, y), cubes, "lightgreen");
  }
}

class ZShape extends Shape {
  constructor(x, y) {
    let cubes = [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]; super(new p5.Vector(x, y), cubes, "red");
  }
}