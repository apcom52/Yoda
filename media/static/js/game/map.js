function createArray(rows = 1, columns = 1) {
	matrix = []
	for (var i = 0; i < rows; i++) {
		matrix[i] = [];
		for (var j = 0; j < columns; j++)
			matrix[i][j] = 0;
	}
	return matrix
}

Map = function(nation = undefined) {
	this.x_size = 32;
	this.y_size = 32;
	this.cells = createArray(this.x_size, this.y_size);
	this.nation = nation;

	for (var i = 0; i < this.y_size; i++) {
		for (var j = 0; j < this.x_size; j++) {
			this.cells[i][j] = {
				type: "",
				sprite: "",
				resource: "",
				building: "",
				values: {
					food: 0,
					production: 0,
					culture: 0,
					faith: 0,
					science: 0,
					tourism: 0,
					happiness: 0,
					gold: 0,
				},
				position: {
					x: 0,
					y: 0
				}
			};
		}
	}
}

Map.prototype.PLAIN = "plain";
Map.prototype.SAND = "sand";
Map.prototype.SEA = "sea";
Map.prototype.MOUNTAIN = "mountain";

Map.prototype.generate = function() {
	var target = this;
	var cells = this.cells;
	for (var i = 0; i < target.y_size; i++) {
		for (var j = 0; j < target.x_size; j++) {
			/* Генерация карты на основе окружающих клеток */
			var type = "";

			/* Если клетка первая, то генерируем случайную */
			if (i == 0 && j == 0) {
				type = target.getRandomCell();				
			} else {
				/* Если клетка в первой строке:
				- 15% - слева
				*/
				if (i == 0) {
					var rnd = Math.random();
					if (rnd <= 0.15) type = cells[i][j - 1].type;
					else type = target.getRandomCell();
				} else {
					/* Если клетка в других строках, то учиваем и левую, левую верхнюю, верхнюю и правую клетку 
					ГОВНОКОД
					*/
					if (j == 0) {
						if (cells[i-1][j].type == cells[i-1][j+1].type) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i-1][j].type;
							else type = target.getRandomCell();
						} else {
							var rnd = Math.random();
							if (rnd <= 0.15) type = cells[i-1][j].type;
							else if (rnd > 0.15 && rnd <= 0.3) type = cells[i-1][j+1].type;
							else type = target.getRandomCell();
						}
					} else if (j == target.x_size - 1) {
						if (cells[i][j-1].type == cells[i-1][j-1].type == cells[i-1][j].type) {
							var rnd = Math.random();
							if (rnd <= 0.45) type = cells[i-1][j].type;
							else type = target.getRandomCell();
						} else if ((cells[i][j-1].type == cells[i-1][j-1].type) != cells[i-1][j].type) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i][j-1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i-1][j].type;
							else type = target.getRandomCell();
						} else if (cells[i][j-1].type != (cells[i-1][j-1].type == cells[i-1][j].type)) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i-1][j-1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i][j-1].type;
							else type = target.getRandomCell();
						} else if (cells[i-1][j-1].type != (cells[i][j-1].type == cells[i-1][j].type)) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i-1][j].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i-1][j-1].type;
							else type = target.getRandomCell();
						} else {
							var rnd = Math.random();
							if (rnd <= 0.15) type = cells[i][j-1].type;
							else if (rnd > 0.15 && rnd <= 0.3) type = cells[i-1][j-1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i-1][j].type;
							else type = target.getRandomCell();
						}
					} else {
						if (cells[i][j-1].type == cells[i-1][j-1].type == cells[i-1][j].type == cells[i-1][j+1].type) {
							var rnd = Math.random();
							if (rnd <= 0.6) type = cells[i-1][j].type;
							else type = target.getRandomCell();
						} else if ((cells[i-1][j-1].type == cells[i][j-1].type == cells[i-1][j].type) != cells[i-1][j+1].type) {
							var rnd = Math.random();
							if (rnd <= 0.45) type = cells[i-1][j].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j+1].type;
							else type = target.getRandomCell();
						} else if ((cells[i][j-1].type == cells[i-1][j+1].type == cells[i-1][j].type) != cells[i-1][j-1].type) {
							var rnd = Math.random();
							if (rnd <= 0.45) type = cells[i-1][j].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j-1].type;
							else type = target.getRandomCell();
						} else if ((cells[i-1][j-1].type == cells[i-1][j+1].type == cells[i-1][j].type) != cells[i][j-1].type) {
							var rnd = Math.random();
							if (rnd <= 0.45) type = cells[i-1][j].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i][j-1].type;
							else type = target.getRandomCell();
						} else if ((cells[i-1][j-1].type == cells[i-1][j+1].type == cells[i][j-1].type) != cells[i-1][j].type) {
							var rnd = Math.random();
							if (rnd <= 0.45) type = cells[i-1][j-1].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j].type;
							else type = target.getRandomCell();
						} else if ((cells[i-1][j].type == cells[i-1][j+1].type) != cells[i][j-1].type != cells[i-1][j-1].type) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i-1][j+1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i][j-1].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j-1].type;
							else type = target.getRandomCell();
						} else if ((cells[i][j-1].type == cells[i-1][j-1].type) != cells[i-1][j].type != cells[i-1][j+1].type) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i-1][j-1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i-1][j].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j+1].type;
							else type = target.getRandomCell();
						} else if ((cells[i-1][j-1].type == cells[i-1][j].type) != cells[i][j-1].type != cells[i-1][j+1].type) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i-1][j-1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i][j-1].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j+1].type;
							else type = target.getRandomCell();
						} else if ((cells[i][j-1].type == cells[i-1][j+1].type) != cells[i-1][j-1].type != cells[i-1][j].type) {
							var rnd = Math.random();
							if (rnd <= 0.3) type = cells[i-1][j+1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i-1][j-1].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j].type;
							else type = target.getRandomCell();
						} else {
							var rnd = Math.random();
							if (rnd <= 0.15) type = cells[i][j-1].type;
							else if (rnd > 0.15 && rnd <= 0.3) type = cells[i-1][j-1].type;
							else if (rnd > 0.3 && rnd <= 0.45) type = cells[i-1][j].type;
							else if (rnd > 0.45 && rnd <= 0.6) type = cells[i-1][j+1].type;
							else type = target.getRandomCell();
						}
					}
				}
			}

			var food = 0;
			var production = 0;
			var culture = 0;
			var faith = 0;
			var science = 0;
			var tourism = 0;
			var happiness = 0;
			var gold = 0;

			if (type == target.PLAIN) {
				food = 1;
				console.log("PLAIN");
			}

			if (type == target.SAND) {
				faith = 1;
			}

			if (type == target.SEA) {
				food = 1;
			}

			if (type == target.MOUNTAIN) {
				production = 1;
				science = 1;
			}

			cells[i][j] = {
				type: type,
				sprite: type,
				resource: "",
				building: "",
				values: {
					food: food,
					production: production,
					culture: culture,
					faith: faith,
					science: science,
					tourism: tourism,
					happiness: happiness,
					gold: gold,
				},
				position: {
					x: j,
					y: i,
				}
			};	
		}
	}

	// Второй этап генерации 
	// var waterArray = createArray(target.y_size, target.x_size);
	for (var i = 0; i < target.y_size; i++) {
		for (var j = 0; j < target.x_size; j++) {
			var current = cells[i][j];
			var type = current.type;
			var str = "";
			if (type == "sea") {	
				/* 	Проверяем верхнюю строчку. 
					Если строчка является первой, то заполняем 111. 
					Если столбец - первый, то 1**, если последний, то **1 	 
				*/
				if (i == 0)	str += "111";
				else {					
					if (j == 0) str += "1";
					else {
						if (cells[i-1][j-1].type != "sea") str += "1";
						else str += "0";
					}
					
					if (cells[i-1][j].type != "sea") str += "1";
					else str += "0";

					if (j == target.x_size - 1) str += "1";
					else {
						if (cells[i-1][j+1].type != "sea") str += "1";
						else str += "0";						
					}
				}	

				/* Проверяем боковые клетки. 
				Если j = 0, то ---1*
				Если j - последний, то ---*1
				*/
				if (j == 0) str += "1";
				else {
					if (cells[i][j-1].type != "sea") str += "1";
					else str += "0";
				}

				if (j == target.x_size - 1) str += "1";
				else {
					if (cells[i][j+1].type != "sea") str += "1";
					else str += "0";
				}

				/* Проверяем нижние клетки
				Если i - последний, то ---==111
				Если j - первый, то ---==1**
				Если j - последний, то ---==**1
				*/
				if (i == target.y_size - 1)	str += "111";
				else {					
					if (j == 0) str += "1";
					else {
						if (cells[i+1][j-1].type != "sea") str += "1";
						else str += "0";
					}
					
					if (cells[i+1][j].type != "sea") str += "1";
					else str += "0";

					if (j == target.x_size - 1) str += "1";
					else {
						if (cells[i+1][j+1].type != "sea") str += "1";
						else str += "0";						
					}
				}	

				switch(str) {
					case "11111111":
						current.sprite = "seaEWNS";
						break;
					case "10010100":
					case "00010000":
						current.sprite = "seaW";
						break;
					case "00101001":
					case "00001000":
						current.sprite = "seaE";
						break;
					case "11100000":
					case "01000000":
						current.sprite = "seaN";
						break;
					case "00000111":
					case "00000010":
						current.sprite = "seaS";
						break;
					case "10111101":
					case "00011000":
						current.sprite = "seaEW";
						break;
					case "11100111":
					case "01000010":
						current.sprite = "seaNS";
						break;
				}
			}
		}
	}
}

Map.prototype.getRandomCell = function() {
	var rnd = Math.random();
	if (rnd <= 0.5) return this.PLAIN;
	else if (rnd > 0.5 && rnd <= 0.7) return this.SAND;
	else if (rnd > 0.7 && rnd <= 0.93) return this.SEA;
	else return this.MOUNTAIN; 
}

Map.prototype.onInputOver = function(item) {
	console.log(this.position);
}

Map.prototype.onInputOut = function(item) {
	console.log("out");
}