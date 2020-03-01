class Matrix{
	constructor(rows, cols){
		this.rows = rows;
		this.cols = cols;

		this.data = [];

		for (let i = 0; i < this.rows; i++){
			this.data.push([]);
		}

		this.randomize();
	}

	randomize(){
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.cols; j++){
				this.data[i][j] = Math.random() * 2 - 1;
			}
		}
	}

	static multiply(a, b){
		if(b instanceof Matrix){
			if (a.cols === b.rows){
				let result = new Matrix(a.rows, b.cols);
				for (let i = 0; i < result.rows; i++){
					for (let y = 0; y < result.cols; y++){
						let sum = 0;
						for (let z = 0; z < b.rows; z++){
							sum += a.data[i][z] * b.data[z][y];
						}
						result.data[i][y] = sum;
					}
				}
				return result;
			}else if(a.rows === b.rows && a.cols === b.cols){
				let result = new Matrix(a.rows, b.cols);
				for (let i = 0; i < result.rows; i++){
					for (let j = 0; j < result.cols; j++){
						result.data[i][j] = a.data[i][j] * b.data[i][j];
					}
				}
				return result;
			}
		}else{
			let result = new Matrix(a.rows, a.cols);
			for (let i = 0; i < result.rows; i++){
				for (let j = 0; j < result.cols; j++){
					result.data[i][j] *= b;
				}
			}
			return result;
		}
	}

	multiply(b){
		if(b instanceof Matrix){
			for (let i = 0; i < this.rows; i++){
				for (let j = 0; j < this.cols; j++){
					this.data[i][j] *= b.data[i][j];
				}
			}
		}else if(this.rows === b.rows && this.cols === b.cols){
			for (let i = 0; i < this.rows; i++){
				for (let j = 0; j < this.cols; j++){
					this.data[i][j] *= b;
				}
			}
		}
	}

	static transpose(a){
		let result = new Matrix(a.cols, a.rows);
		for (let i = 0; i < a.rows; i++){
			for (let j = 0; j < a.cols; j++){
				result.data[j][i] = a.data[i][j];
			}
		}
		return result;
	}

	transpose(){
		let result = new Matrix(this.cols, this.rows);
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.cols; j++){
				result.data[j][i] = this.data[i][j];
			}
		}
		this.rows = result.rows;
		this.cols = result.cols;
		this.data = result.data;
		return this;
	}

	static convertArray(array){
		let result = new Matrix(array.length, 1);
		for (let i = 0; i < result.rows; i++){
			result.data[i][0] = array[i];
		}
		return result;
	}

	static subtract(a, b){
		if (a.rows != b.rows || a.cols != b.cols){
			console.log("le matrici devono essere uguali");
			return;
		}
		let result = new Matrix(a.rows, a.cols)
		for (let i = 0; i < result.rows; i++){
			for (let j = 0; j < result.cols; j++){
				result.data[i][j] = a.data[i][j] - b.data[i][j];
			}
		}
		return result;
	}

	add(matrix){
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.cols; j++){
				this.data[i][j] = matrix.data[i][j];
			}
		}
	}

	map(fun){
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.cols; j++){
				this.data[i][j] = fun(this.data[i][j]);
			}
		}
		//console.log(this.data)
	}

	//se non utilizzata, eliminala
	static map(a, fun){
		let result = new Matrix(a.rows, a.cols);
		for (let i = 0; i < result.rows; i++){
			for (let j = 0; j < result.cols; j++){
				result.data[i][j] = fun(a.data[i][j]);
			}
		}
		return result;
	}

	toArray(){
		if(this.cols !== 1){
			console.log("Solo matrici a una colonna")
			return;
		}
		let array = [];
		for (let i = 0; i < this.rows; i++){
			for (let j = 0; j < this.cols; j++){
				array[i] = this.data[i][j];
			}
		}
		return array;
	}

	print(){
		console.table(this.data);
	}
}