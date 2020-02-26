let setup = {
	nInputNodes: 6,
	nHiddenNodes: 20,
	nHiddenLayer: 3,
	nOutputNodes: 3,
	learningRate: 0.1,
};

let nn = new DeepNN(setup);

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

nn.draw(0, 0, canvas.width, canvas.height, bgcolor="black");