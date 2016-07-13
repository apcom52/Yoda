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
	this.startPosition = [];

	for (var i = 0; i < this.y_size; i++) {
		for (var j = 0; j < this.x_size; j++) {
			this.cells[i][j] = {
				type: "",
				sprite: "",
				resource: "",
				building: "",
				visible: false,
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

Map.PLAIN = "plain";
Map.SAND = "sand";
Map.SEA = "sea";
Map.MOUNTAIN = "mountain";

Map.RESOURCE_STONE = "stone";
Map.RESOURCE_WOOD = "wood";
Map.RESOURCE_SANDS = "sands";
Map.RESOURCE_IRON = "iron";
Map.RESOURCE_CARBON = "carbon";
Map.RESOURCE_OIL = "oil";
Map.RESOURCE_URAN = "uran";

Map.RESOURCE_WHEAT = "wheat";
Map.RESOURCE_GRAPES = "grapes";
Map.RESOURCE_CITRUS = "citrus";

Map.BUILDING_CASTLE1 = "castle1";

Map.prototype.generate = function() {
	var target = this;
	var cells = this.cells;
	for (var i = 0; i < target.y_size; i++) {
		for (var j = 0; j < target.x_size; j++) {
			/* Генерация карты на основе окружающих клеток */
			var type = "";
			var sprite = "";

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

			if (type == Map.PLAIN) {
				food = 1;
			}

			if (type == Map.SAND) {
				faith = 1;
			}

			if (type == Map.SEA) {
				food = 1;
			}

			if (type == Map.MOUNTAIN) {
				production = 1;
				science = 1;
			}

			/* Назначаем ресурсы
			Вероятность появления стратегического ресурса - 17%
			Редкого ресурса (рудник) - 8%
			Редкого ресурса (плантация) - 9%
			*/
			var hasResource = Math.random();
			var resource = "";
			if (hasResource <= 0.25) {
				/* Шансы появления ресурсов:
				Камень	20%
				Песок	18%
				Лес		16%
				Железо 	13%
				Уголь	11%
				Алюминий 9%
				Нефть	8%
				Уран	5%
				*/
				var resourceRnd = Math.random();
				if (resourceRnd > STONE_RESOURCE_CHANCE.from && resourceRnd <= STONE_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN || type == Map.SAND) {						
						resource = Map.RESOURCE_STONE;
						production = 1;
						faith = 0;
						food = 0;
					}
				} else if (resourceRnd > WOOD_RESOURCE_CHANCE.from && resourceRnd <= WOOD_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN) {						
						resource = Map.RESOURCE_WOOD;
						production = 1;
						food = 1;
					}
				} else if (resourceRnd > IRON_RESOURCE_CHANCE.from && resourceRnd <= IRON_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN || type == Map.SAND) {						
						resource = Map.RESOURCE_IRON;
						production = 1;
						faith = 0;
						food = 0;
					}
				} else if (resourceRnd > CARBON_RESOURCE_CHANCE.from && resourceRnd <= CARBON_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN) {						
						resource = Map.RESOURCE_CARBON;
						production = 1;
						food = 0;
					}
				} else if (resourceRnd > OIL_RESOURCE_CHANCE.from && resourceRnd <= OIL_RESOURCE_CHANCE.to) {
					if (type == Map.SAND || type == Map.SEA) {						
						resource = Map.RESOURCE_OIL;
						production = 1;
						food = 0;
						faith = 0;
					}
				} else if (resourceRnd > URAN_RESOURCE_CHANCE.from && resourceRnd <= URAN_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN || type == Map.SAND) {						
						resource = Map.RESOURCE_URAN;
						production = 1;
						food = 0;
						faith = 0;
					}
				} else if (resourceRnd > SAND_RESOURCE_CHANCE.from && resourceRnd <= SAND_RESOURCE_CHANCE.to) {
					if (type == Map.SAND) {						
						resource = Map.RESOURCE_SANDS;
						production = 1;
						food = 0;
						faith = 0;
					}
				}
			} else if (hasResource > 0.25 && hasResource <= 0.34) {
				var resourceRnd = Math.random();
				if (resourceRnd > WHEAT_RESOURCE_CHANCE.from && resourceRnd <= WHEAT_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN) {						
						resource = Map.RESOURCE_WHEAT;
						production = 0;
						food = 2;
					}
				} else if (resourceRnd > GRAPES_RESOURCE_CHANCE.from && resourceRnd <= GRAPES_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN) {						
						resource = Map.RESOURCE_GRAPES;
						production = 0;
						food = 2;
					}
				} else if (resourceRnd > CITRUS_RESOURCE_CHANCE.from && resourceRnd <= CITRUS_RESOURCE_CHANCE.to) {
					if (type == Map.PLAIN) {						
						resource = Map.RESOURCE_CITRUS;
						production = 0;
						food = 2;
					}
				}
			}

			/* Генерируем разнообразие карты (кактусы, бочки и прочее) */
			if (type == Map.PLAIN && resource == "") {
				var spriteRandom = Math.random();
				if (spriteRandom < 0.25) sprite = "plain1";
				else if (spriteRandom >= 0.25 && spriteRandom < 0.41) sprite = "plain2";
				else sprite = type;
			} else if (type == Map.SAND && resource == "") {
				var spriteRandom = Math.random();
				if (spriteRandom < 0.23) sprite = "sand1";
				else if (spriteRandom >= 0.23 && spriteRandom < 0.39) sprite = "sand2";
				else sprite = type;
			} else {
				sprite = type;
			}

			cells[i][j] = {
				type: type,
				sprite: sprite,
				resource: resource,
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
						current.values.culture += 1;
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
					case "11111000":
					case "11111100":
					case "11111101":
					case "11111001":
						current.sprite = "sea_S";
						break;
					case "01101011":
					case "11101011":
					case "11101111":
					case "01101111":
						current.sprite = "sea_W";
						break;
					case "00011111":
					case "00111111":
					case "10111111":
					case "10011111":
						current.sprite = "sea_N";
						break;
					case "11010110":
					case "11110110":
					case "11110111":
					case "11010111":
						current.sprite = "sea_E";
						break;
				}
			}
		}
	}

	/* Определяем стартовую позицию игрока */
	var start_x = chooseInRange(5, 25);
	var start_y = chooseInRange(5, 25);
	while(cells[start_y][start_x].type == Map.SEA) {
		var start_x = chooseInRange(5, 25);
		var start_y = chooseInRange(5, 25);
	}
	target.startPosition = {
		x: start_x,
		y: start_y
	}

	// cells[start_y][start_x].building = new Building(Building.CASTLE);
	console.log(cells[start_y][start_x]);

	for (i = target.startPosition.y - 2; i <= target.startPosition.y + 2; i++)
		for (j = target.startPosition.x - 2; j <= target.startPosition.x + 2; j++)
			cells[i][j].visible = true;

}

Map.prototype.getRandomCell = function() {
	var rnd = Math.random();
	if (rnd <= 0.5) return Map.PLAIN;
	else if (rnd > 0.5 && rnd <= 0.7) return Map.SAND;
	else if (rnd > 0.7 && rnd <= 0.93) return Map.SEA;
	else return Map.MOUNTAIN; 
}

Map.prototype.onInputOver = function(item) {
	console.log(this.position);
}

Map.prototype.onInputOut = function(item) {
	console.log("out");
}