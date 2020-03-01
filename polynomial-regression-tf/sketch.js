let x_vals = [];
let y_vals = [];

let coeffs = [];

let learningRate = 0.3;
let optimizer = tf.train.sgd(learningRate);

let coeffSlider;
let coeffP;
let learnSlider;
let learnP;

let canvas;

function setup() {
  canvas = createCanvas(400, 400);
  canvas.id("canvas");
  canvas.mousePressed(() => {
    let x = map(mouseX, 0, width, -1, 1);
    let y = map(mouseY, 0, height, 1, -1);
    x_vals.push(x);
    y_vals.push(y);
  });

  coeffP = createP("Order: " + coeffs.length);
  coeffSlider = createSlider(1, 10, 1, 1);
  coeffSlider.mouseClicked(updateCoeffs);

  learnP = createP("Learning rate: " + learningRate);
  learnSlider = createSlider(0.01, 1, learningRate, 0.01);
  learnSlider.mouseClicked(() => {
    learningRate = learnSlider.value();
    optimizer = tf.train.sgd(learningRate);
    learnP.html("Learning rate: " + learningRate);
  });

  coeffs.push(tf.variable(tf.scalar(random(-1, 1))));
}

function updateCoeffs() {
  let numCoeffs = coeffSlider.value();
  if (coeffs.length < numCoeffs) {
    let differ = numCoeffs - coeffs.length;
    for (let i = 0; i < differ; i++) {
      coeffs.push(tf.variable(tf.scalar(random(-1, 1))));
    }
  } else {
    let differ = coeffs.length - numCoeffs;
    for (let i = 0; i < differ; i++) {
      coeffs.pop();
    }
  }
  coeffP.html("Order: " + coeffs.length);
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





  tf.tidy(() => {
    if (x_vals.length > 0) {
      const ys = tf.tensor1d(y_vals);
      optimizer.minimize(() => loss(predict(x_vals), ys))
    }
  });


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
