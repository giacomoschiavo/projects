let x_vals = [];
let y_vals = [];

let a, b, c;

const learningRate = 0.1;
const optimizer = tf.train.adamax(learningRate);

let dragged = false;

function setup() {
  createCanvas(400, 400);
  a = tf.variable(tf.scalar(random(-1, 1)));
  b = tf.variable(tf.scalar(random(-1, 1)));
  c = tf.variable(tf.scalar(random(-1, 1)));
}

function mouseDragged() {
  dragged = true;
}

function mouseReleased() {
  dragged = false;
}

function predict(input) {
  const xs = tf.tensor1d(input);
  // const output = xs.mul(m).add(b);
  const output = xs.square().mul(a).add(xs.mul(b)).add(c);
  return output;
}

function loss(pred, labels) {
  return pred.sub(labels).square().mean();
}

function draw() {
  if (dragged) {
    let x = map(mouseX, 0, width, -1, 1);
    let y = map(mouseY, 0, height, 1, -1);
    x_vals.push(x);
    y_vals.push(y);
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