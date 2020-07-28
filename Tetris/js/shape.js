class Shape {
  constructor(cubes, color) {
    this.pos = new p5.Vector(2, -5);
    this.cubes = cubes;
    this.color = color;
    this.stopped = false;
  }

  update() {
    if (this.stopped) return;
    this.pos.y++;
  }

  stop() {
    this.stopped = true;
  }

  check(x, y) {
    let margin = this.cubes.length;
    if (x >= this.pos.x + margin || y >= this.pos.y + margin || x < this.pos.x || y < this.pos.y) {
      return false;
    }
    let xOffset = x - this.pos.x;
    let yOffset = y - this.pos.y;
    if (this.cubes[yOffset][xOffset] == 1) return true;
  }

}

class LShape extends Shape {
  constructor() {
    let cubes = [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ];
    super(cubes, "orange");
  }


}

class JShape extends Shape {
  constructor() {
    let cubes = [new p5.Vector(0, 1), new p5.Vector(1, 1), new p5.Vector(2, 1), new p5.Vector(2, 0)]
    super(cubes, "blue");
  }

  rotate() {

  }

}

class IShape extends Shape {
  constructor() {
    let cubes = [new p5.Vector(0, 0), new p5.Vector(0, 1), new p5.Vector(0, 2), new p5.Vector(0, 3)]
    super(cubes, "lightblue");
  }
}

class OShape extends Shape {
  constructor() {
    let cubes = [new p5.Vector(0, 0), new p5.Vector(0, 1), new p5.Vector(1, 1), new p5.Vector(1, 0)]
    super(cubes, "yellow");
  }
}

class TShape extends Shape {
  constructor() {
    let cubes = [new p5.Vector(0, 0), new p5.Vector(1, 0), new p5.Vector(2, 0), new p5.Vector(1, 1)]
    super(cubes, "purple");
  }
}

class SShape extends Shape {
  constructor() {
    let cubes = [new p5.Vector(0, 1), new p5.Vector(1, 1), new p5.Vector(1, 0), new p5.Vector(2, 0)]
    super(cubes, "lightgreen");
  }
}

class ZShape extends Shape {
  constructor() {
    let cubes = [new p5.Vector(0, 0), new p5.Vector(1, 0), new p5.Vector(1, 1), new p5.Vector(2, 1)]
    super(cubes, "red");
  }
}