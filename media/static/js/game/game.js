//Build 100 - 09.04.16
var game = new Phaser.Game(1024, 768, Phaser.WEBGL, 'game', {
	init: init,
	preload: preload,
	create: create,
	update: update,
	render: render,
});

function init() {
	game.kineticScrolling = game.plugins.add(Phaser.Plugin.KineticScrolling);
}

function preload() {
	game.stage.backgroundColor = '#333333';
	game.time.advancedTiming = true;

	game.load.image('plain', '/media/game/grass.png');
	game.load.image('sand', '/media/game/sand.png');
	game.load.image('mountain', '/media/game/mountains.png');
	
	game.load.image('sea', '/media/game/water.png');
	game.load.image('seaE', '/media/game/waterE.png');
	game.load.image('seaW', '/media/game/waterW.png');
	game.load.image('seaS', '/media/game/waterS.png');
	game.load.image('seaN', '/media/game/waterN.png');
	game.load.image('seaEWNS', '/media/game/waterEWNS.png');
	game.load.image('seaE', '/media/game/waterE.png');
	game.load.image('seaW', '/media/game/waterW.png');
	game.load.image('seaN', '/media/game/waterN.png');
	game.load.image('seaS', '/media/game/waterS.png');
	game.load.image('seaEW', '/media/game/waterEW.png');
	game.load.image('seaNS', '/media/game/waterNS.png');

	// game.load.image('castle', '/media/game/castle.gif');
	
	game.load.image('stone_plain', '/media/game/stone_plain.png');
	game.load.image('stone_sand', '/media/game/stone_sand.png');
	game.load.image('wood', '/media/game/wood.png');
	game.load.image('iron_plain', '/media/game/iron_plain.png');
	game.load.image('iron_sand', '/media/game/iron_sand.png');
	game.load.image('carbon', '/media/game/carbon_plain.png');
	// game.load.image('uran', '/media/game/uran.png');
	// game.load.image('wood', '/media/game/wood.png');
	// game.load.image('oil', '/media/game/oil.png');
	// game.load.image('aluminium', '/media/game/aluminium.png');
	
	// game.load.image('flower', '/media/game/flower.png');

	// game.load.tilemap('landscape', '/media/game/landscape_tilemap.png');
}

var map = new Map('RUS');
var render = new Render(game);
map.generate();

function create() {
	console.log(map.cells);
	game.world.setBounds(-1024, -768, 4096, 3072);
	game.debug.text(game.time.fps, 8, 16, '#00FF00');
	render.draw(map);

	game.kineticScrolling.configure({
		verticalScroll: true,
	});
	game.kineticScrolling.start();

	/*game.input.mouse.onMouseMove = function(e) {
		// if (game.input.mouse.isDown) {
			game.camera.x = e.offsetX;
			game.camera.y = e.offsetY;
		// }		
	}*/
	console.log(game);
}

var mouseTrack = {
	last: null,
}

function update() {
	game.debug.text(game.time.fps, 8, 16, '#00FF00');

	/*if (game.input.mousePointer.isDown) {	
		if (game.origDragPoint) {	
			game.camera.x += game.origDragPoint.x - game.input.mousePointer.position.x;		
			game.camera.y += game.origDragPoint.y - game.input.mousePointer.position.y;	
			game.canvas.style.cursor = "move";
		}
		this.game.origDragPoint = this.game.input.mousePointer.position.clone();
	} else {
		this.game.origDragPoint = null;
		game.canvas.style.cursor = "default";
	}*/
}

function render() {
	game.debug.cameraInfo(game.camera, 32, 32);
}

/*var map = createMatrix(24, 32);
var vsb_map = createMatrix(24, 32);
var resource_map = createMatrix(24, 32);
var resource_amount_map = createMatrix(24, 32);
var building_map = createMatrix(24, 32);

var CELL_WIDTH = 64;
var CELL_HEIGHT = 64;

function getRandomCell() {
	var rnd = Math.random();
	var sprite = '';
	if (rnd <= 0.5) sprite = 'grass';
	else if (rnd > 0.5 && rnd <= 0.72) sprite = 'sand';
	else if (rnd > 0.72 && rnd <= 0.93) sprite = 'water';
	else if (rnd > 0.93) sprite = 'mountains';
	return sprite;
}

function getRandomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

function createMatrix(m, n) {
	var matrix = [];
	for (var i = 0; i < n; i++) {
		matrix[i] = [];
		for (var j = 0; j < m; j++) {
			matrix[i][j] = 0;
		}
	}
	return matrix;
}

function create() {
	game.kineticScrolling.start();
	game.world.setBounds(0, 0, 1024, 768);

	// Выбираем местоположение для ратуши
	var castle_x, castle_y = 0;
	var castle_cell_type = 'water';
	while (castle_cell_type == 'water' || castle_cell_type == 'mountains') {
		castle_x = Math.round(getRandomInRange(3, 28));
		castle_y = Math.round(getRandomInRange(2, 20));
		castle_cell_type = map[castle_y][castle_x];
	}

	for (var i = castle_y - 2; i <= castle_y + 2; i++) {
		for (var j = castle_x - 2; j <= castle_x + 2; j++) {
			vsb_map[i][j] = 1;
		}
	}
	console.log(vsb_map);

	for (var i = 0; i < 24; i++) {
		for (var j = 0; j < 32; j++) {
			if (i == 0 && j == 0) {
				map[i][j] = getRandomCell();
				continue;
			}

			if (i == 0) {
				if (Math.random() <= 0.35) {
					map[i][j] = map[i][j - 1]
				} else {
					map[i][j] = getRandomCell();
				}
				continue;
			}

			if (j == 0) {
				if (map[i - 1][j] == map[i - 1][j + 1]) {
					if (Math.random() <= 0.5) {
						map[i][j] = map[i - 1][j]						
					} else {
						map[i][j] = getRandomCell();
					}
					continue;
				} else {
					var rnd = Math.random();
					if (rnd <= 0.2) {
						map[i][j] = map[i - 1][j]
					} else if (rnd > 0.2 && rnd <= 0.4) {
						map[i][j] = map[i - 1][j + 1]
					} else {
						map[i][j] = getRandomCell();
					}
					continue;
				}				
			}

			if (map[i - 1][j - 1] == map[i - 1][j] == map[i][j - 1]) {
				if (Math.random() <= 0.75) {
					map[i][j] = map[i - 1][j]						
				} else {
					map[i][j] = getRandomCell();
				}
				continue;
			} else if (map[i - 1][j - 1] == map[i - 1][j] != map[i][j - 1]) {
				var rnd = Math.random();
				if (rnd <= 0.5) {
					map[i][j] = map[i - 1][j - 1];
				} else if (rnd > 0.5 && rnd <= 0.7) {
					map[i][j] = map[i][j - 1];
				} else {
					map[i][j] = getRandomCell();
				}
				continue;
			} else if (map[i - 1][j - 1] != map[i - 1][j] == map[i][j - 1]) {
				var rnd = Math.random();
				if (rnd <= 0.5) {
					map[i][j] = map[i - 1][j];
				} else if (rnd > 0.5 && rnd <= 0.7) {
					map[i][j] = map[i - 1][j - 1];
				} else {
					map[i][j] = getRandomCell();
				}
				continue;
			} else if (map[i - 1][j - 1] == map[i][j - 1] != map[i - 1][j]) {
				var rnd = Math.random();
				if (rnd <= 0.5) {
					map[i][j] = map[i - 1][j - 1];
				} else if (rnd > 0.5 && rnd <= 0.7) {
					map[i][j] = map[i - 1][j];
				} else {
					map[i][j] = getRandomCell();
				}
				continue;
			} else {
				var rnd = Math.random();
				if (rnd <= 0.25) {
					map[i][j] = map[i - 1][j - 1];
				} else if (rnd > 0.25 && rnd <= 0.5) {
					map[i][j] = map[i][j - 1];
				} else  if (rnd > 0.5 && rnd <= 0.7) {
					map[i][j] = map[i - 1][j];
				} else {
					map[i][j] = getRandomCell();
				}
				continue;
			}
		}
	}

	for (var i = 0; i < 24; i++) {
		for (var j = 0; j < 32; j++) {
			if (map[i][j] == 'water' || map[i][j] == 'mountains')
				continue;
			var rnd = Math.random();
			var amount = null;
			
			if (rnd <= 0.14) {
				var resRnd = Math.random();
				if (resRnd <= 0.25) {
					resource = 'stone';
				} else if (resRnd > 0.25 && resRnd <= 0.5) {
					resource = 'wood';
				} else if (resRnd > 0.5 && resRnd <= 0.67) {
					resource = 'oil';
				} else if (resRnd > 0.67 && resRnd <= 0.9) {
					resource = 'aluminium';
				} else if (resRnd > 0.9) {
					resource = 'uran';
				}

				var amountRnd = Math.random();
				if (amountRnd <= 0.4) {
					amount = 1;
				} else if (amountRnd > 0.4 && amountRnd <= 0.65) {
					amount = 2;
				} else if (amountRnd > 0.65 && amountRnd <= 0.85) {
					amount = 3;
				} else if (amountRnd > 0.85 && amountRnd <= 0.96) {
					amount = 4;
				} else if (amountRnd > 0.96) {
					amount = 5;
				}	

				resource_map[i][j] = resource;
				resource_amount_map[i][j] = amount;
			} else if (rnd > 0.14 && rnd <= 0.2) {
				resource_map[i][j] = 'flower';
				resource_amount_map[i][j] = 1;
			}		
		}
	}

	/* Ищем крайние активные клетки */
	// var actual_y = 0, actual_x = 0;
	// for (var i = 0; i < 24; i++) {
	// 	for (var j = 0; j < 32; j++) {
	// 		if (map[i][j] != 0) {
	// 			actual_y = i;
	// 			actual_x = j;
	// 			break;
	// 		}
	// 	}
	// }

	/*var y_counter = 2, x_counter = 2;
	for (var i = 0; i < 24; i++) {
		for (var j = 0; j < 32; j++) {			
			if (vsb_map[i][j]) {
				game.add.sprite(CELL_WIDTH * j, CELL_HEIGHT * i, map[i][j]);
				console.log('print');
				x_counter -= 1;

				// game.add.sprite(CELL_WIDTH * j, CELL_HEIGHT * i, resource_map[i][j])
				// if (resource_amount_map[i][j] > 0) {
				// 	game.add.text(CELL_WIDTH * j, CELL_HEIGHT * i, resource_amount_map[i][j].toString(), {font: "14px Arial"})
				// }
				// game.add.sprite(CELL_WIDTH * j, CELL_HEIGHT * i, building_map[i][j])	
			}			
		}
		y_counter -= 1;
	}

	console.log(map.join('+'));

	game.add.text(0, 0, 'Тестовая версия', {
		font: "10px Arial"
	});

	// var buildCastle = new Dialog('Постройте ратушу', 'Выберите наиболее удачное место для строительства ратуши.<br><a href="#">Как выбрать хорошее место для строительства ратуши</a>').show();
}*/