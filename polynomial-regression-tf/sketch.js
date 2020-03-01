let x_vals = [];
let y_vals = [];

let coeffs = [];

const learningRate = 0.3;
const optimizer = tf.train.adamax(learningRate);

let dragged = false;

function setup() {
  createCanvas(400, 400).id("canvas");
  coeffs.push(tf.variable(tf.scalar(random(-1, 1))));
}

function mouseDragged() {
  dragged = true;
}

function mouseReleased() {
  dragged = false;
}

function mousePressed() {
  let x = map(mouseX, 0, width, -1, 1);
  let y = map(mouseY, 0, height, 1, -1);
  x_vals.push(x);
  y_vals.push(y);
}

function predict(input) {
  const xs = tf.tensor1d(input);
  // ax^n + bx^n-1 + cx^n-2 + ....
  let output = xs.pow(coeffs.length - 1).mul(coeffs[0]);
  for (let i = 1; i < coeffs.length; i++) {
    output = output.add(xs.pow(coeffs.length - 1 - i).mul(coeffs[i]));
  }
  return output;
}

function loss(pred, labels) {
  return pred.sub(labels).square().mean();
}

function draw() {
  if (dragged) {
    mousePressed();
  } else {
    tf.tidy(() => {
      if (x_vals.length > 0) {
        const ys = tf.tensor1d(y_vals);
        optimizer.minimize(() => loss(predict(x_vals), ys))
      }
    });
  }

  background(0);
  stroke(255);
  strokeWeight(4);
  for (let i = 0; i < x_vals.length; i++) {
    let x = map(x_vals[i], -1, 1, 0, width);
    let y = map(y_vals[i], -1, 1, height, 0);
    point(x, y);
  }

  const curveX = [];
  for (let x = -1; x <= 1; x += 0.005) {
    curveX.push(x);
  }

  const ys = tf.tidy(() => predict(curveX));
  const curveY = ys.dataSync();
  ys.dispose();

  beginShape();
  noFill();
  stroke(255);
  strokeWeight(2);

  for (let i = 0; i < curveX.length; i++) {
    let x = map(curveX[i], -1, 1, 0, width);
    let y = map(curveY[i], -1, 1, height, 0);
    vertex(x, y);
  }

  endShape();
}
