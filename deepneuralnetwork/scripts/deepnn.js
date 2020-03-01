function sigmoid(n){
	return 1 / (1 + Math.exp(-n));
}

function dSigmoid(n){
	return n * (1 - n);
}

class DeepNN{
	constructor(setup){
		this.nInputNodes = setup.nInputNodes;
		this.nHiddenNodes = setup.nHiddenNodes;
		this.nOutputNodes = setup.nOutputNodes;
		this.nHiddenLayer = setup.nHiddenLayer;
		this.learningRate = setup.learningRate;
		this.activationFunHL = sigmoid;
		this.dActivationFunHL = dSigmoid;
		this.activationFunOL = sigmoid;
		this.dActivationFunOL = dSigmoid;

		this.weightsH = [];
		this.weightsH.push(new Matrix(this.nHiddenNodes, this.nInputNodes))
		for(let i = 0; i < this.nHiddenLayer - 1; i++){
			this.weightsH.push(new Matrix(this.nHiddenNodes, this.nHiddenNodes));
		}
		this.weightsH.push(new Matrix(this.nOutputNodes, this.nHiddenNodes))

		this.biasWeightsH = [];
		for(let i = 0; i < this.weightsH.length - 1; i++){
			this.biasWeightsH.push(new Matrix(this.nHiddenNodes, 1));
		}
		this.biasWeightsH.push(new Matrix(this.nOutputNodes, 1));

		this.outputHN = [];
	}

	feedforward(inputsArray){
		let input = Matrix.convertArray(inputsArray);
		this.outputHN.push(input);
		for(let i = 0; i < this.weightsH.length; i++){
			let nodeInput = Matrix.multiply(this.weightsH[i], input);
			//nodeInput.add(this.biasWeightsH[i]);
			let nodeOutput = Matrix.map(nodeInput, sigmoid);
			this.outputHN.push(nodeOutput);
			input = nodeOutput;
		}		
		let output = this.outputHN.pop();
		//output.print();
		return output;
	}

	train(inputsArray, targetResult){
		this.outputHN = [];
		let output = this.feedforward(inputsArray);
		let target = Matrix.convertArray(targetResult);
		let error = this.calculateError(output, target);

		let deltas = [];
		let firstDelta = new Matrix(this.nOutputNodes, 1);
		for(let i = 0; i < firstDelta.rows; i++){
			firstDelta.data[i][0] = (output.data[i][0] - target.data[i][0]) * output.data[i][0] * (1 - output.data[i][0]);
		}
		deltas[0] = firstDelta;
		for(let i = 1; i < this.weightsH.length; i++){
			let weights = Matrix.transpose(this.weightsH[this.weightsH.length - i]);
			let delta = deltas[i - 1];
			let mapOutput = Matrix.map(this.outputHN[this.outputHN.length - i], dSigmoid);
			deltas[i] = Matrix.multiply(Matrix.multiply(weights, delta), mapOutput);
		}

		let newWeights = [];
		for(let i = 0; i < this.weightsH.length; i++){
			let delta = deltas[i];
			let outputNode = this.outputHN.pop();
			let tOutputNode = Matrix.transpose(outputNode);
			let temp = Matrix.multiply(delta, tOutputNode);
			temp.multiply(this.learningRate);
			newWeights.push(Matrix.subtract(this.weightsH[this.weightsH.length - 1 - i], temp));
		}
		this.weightsH = newWeights.reverse();
		this.biasWeightsH = deltas.reverse();
		deltas.reverse();
	}

	mutate(rate){
		for(let i = 0; i < this.weightsH.length; i++){
			this.weightsH[i].mutate(rate);
		}
		for(let i = 0; i < this.biasWeightsH.length; i++){
			this.biasWeightsH[i].mutate(rate);
		}
	}

	calculateError(actual, target){
		return Matrix.map(Matrix.subtract(target, actual), n => Math.pow(n, 2));
	}

	draw(x, y, width, height, bgcolor = "white", colorInput = "grey", colorHidden = "white", colorOutput = "grey", good = "green", bad = "red"){
		let totalSections = (2 + this.nHiddenLayer) * 2;
		let sectionWidth = width / totalSections;

		ctx.fillStyle = bgcolor;
		ctx.fillRect(x, y, width, height);
		//this.drawNodes(x, y, width, height, sectionWidth, colorInput, colorHidden, colorOutput);
		let inputHeight = height / this.nInputNodes;
		let radius = (inputHeight > sectionWidth ? sectionWidth : inputHeight) / 2;

		let hiddenHeight = height / this.nHiddenNodes;
		let hiddenRadius = hiddenHeight / 2;

		let outputHeight = height / this.nOutputNodes;

		let lineWidth = 0.5;

		let goodWeights = good;
		let badWeights = bad;
		//weights input-hidden
		for(let i = 0; i < this.nInputNodes; i++){
			let xInput = x + sectionWidth / 2;
			let yInput = y + inputHeight / 2 + i * inputHeight;
			for(let j = 0; j < this.nHiddenNodes; j++){
				let xHidden = x + sectionWidth * 3;
				let yHidden = y + hiddenHeight / 2 + j * hiddenHeight;
				ctx.beginPath();
				ctx.lineWidth = (this.weightsH[0].data[j][i] > 0.5 || this.weightsH[0].data[j][i] < -0.5) ? lineWidth + 0.5 : lineWidth;
				ctx.strokeStyle = this.weightsH[0].data[j][i] > 0 ? goodWeights : badWeights;
				ctx.moveTo(xInput, yInput);
				ctx.lineTo(xHidden, yHidden);
				ctx.stroke();
				ctx.closePath();
			}
		}
		//weights hidden-hidden
		for(let i = 0; i < this.nHiddenLayer - 1; i++){
			let xHidden = x + sectionWidth * 3 + sectionWidth * 2 * i;
			for(let j = 0; j < this.nHiddenNodes; j++){
				let xOrigin = xHidden;
				let yOrigin = y + hiddenHeight / 2 + hiddenHeight * j;
				for(let z = 0; z < this.nHiddenNodes; z++){
					let xLast = xOrigin + sectionWidth * 2;
					let yLast = y + hiddenHeight / 2 + z * hiddenHeight;
					ctx.beginPath();
					ctx.lineWidth = (this.weightsH[i+1].data[j][z] > 0.5 || this.weightsH[i+1].data[j][z] < -0.5) ? lineWidth + 0.5 : lineWidth;
					ctx.strokeStyle = this.weightsH[i+1].data[j][z] > 0 ? goodWeights : badWeights;
					ctx.moveTo(xOrigin, yOrigin);
					ctx.lineTo(xLast, yLast);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
		//weights hidden-output
		for(let i = 0; i < this.nHiddenNodes; i++){
			let xHidden = x + width - sectionWidth * 3;
			let yHidden = y + hiddenHeight / 2 + hiddenHeight * i;
			for(let j = 0; j < this.nOutputNodes; j++){
				let xOutput = x + width - sectionWidth / 2;
				let yOutput = y + outputHeight / 2 + j * outputHeight;
				ctx.beginPath();
				ctx.lineWidth = (this.weightsH[this.weightsH.length - 1].data[j][i] > 0.5 || this.weightsH[this.weightsH.length - 1].data[j][i] < -0.5) ? lineWidth + 0.5 : lineWidth;
				ctx.strokeStyle = this.weightsH[this.weightsH.length - 1].data[j][i] > 0 ? goodWeights  : badWeights;
				ctx.moveTo(xHidden, yHidden);
				ctx.lineTo(xOutput, yOutput);
				ctx.stroke();
				ctx.closePath();
			}
		}
		
		for(let i = 0; i < this.nInputNodes; i++){
			ctx.strokeStyle = "black";
			ctx.fillStyle = colorInput;
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.arc(x + sectionWidth / 2, y + inputHeight / 2 + i * inputHeight, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}

		for(let j = 0; j < this.nHiddenLayer; j++){
			for(let i = 0; i < this.nHiddenNodes; i++){
				ctx.strokeStyle = "black";
				ctx.fillStyle = colorHidden;
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.arc(x + sectionWidth * 3 + sectionWidth * j * 2, y + hiddenHeight / 2 + i * hiddenHeight, hiddenRadius, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			}
		}

		for(let i = 0; i < this.nOutputNodes; i++){
			ctx.strokeStyle = "black";
			ctx.fillStyle = colorOutput;
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.arc(x + width - sectionWidth / 2, y + outputHeight / 2 + i * outputHeight, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
}