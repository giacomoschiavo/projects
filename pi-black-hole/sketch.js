const dimC = 500;
let radius;
let pi;
let piLoaded = false;

let index = 0;
let prevx = 0,
  prevy = 0;
let x, y;
let time = 0;

let colored = false;


function preload() {
  loadStrings("pi.txt", (result) => {
    pi = result[0];
    piLoaded = true;
  });
}


function setup() {
  colored = createCheckbox("Colors🌈", false);
  if (window.innerWidth > window.innerHeight) {
    createCanvas(window.innerHeight, window.innerHeight);
  } else {
    createCanvas(window.innerWidth, window.innerWidth);
  }
  background(0);
  radius = width / 5 * 4;
  let piValue = pi[index++];
  prevx = cos(piValue + time) * radius / 2;
  prevy = sin(piValue + time) * radius / 2;
  drawCircle();

}

function drawCircle() {
  translate(width / 2, height / 2);
  strokeWeight(0.5);
  stroke(255);
  noFill();
  circle(0, 0, radius);
}


function draw() {
  if (!piLoaded) return;
  time += 0.01;

  translate(width / 2, height / 2);

  let piValue = pi[index++];

  strokeWeight(0.1);
  if(colored.checked()) {
    colorMode(HSB, 100);
    stroke(int(time * 100) % 100, 100, 100);
  } else {
    stroke(255);
  }
  x = cos(piValue + time) * radius / 2;
  y = sin(piValue + time) * radius / 2;
  line(prevx, prevy, x, y);
  prevx = x;
  prevy = y;
}
