//Build 100 - 09.04.16
var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', {
	preload: preload,
	create: create,
});

function preload() {
	game.stage.backgroundColor = '#414a4c';

	game.load.image('grass', '/media/game/grass.png');
	game.load.image('water', '/media/game/water.png');
	game.load.image('sand', '/media/game/sand.png');
	game.load.image('mountains', '/media/game/mountains.png');
}

var map = createMatrix(24, 32);

function getRandomCell() {
	var rnd = Math.random();
	var sprite = '';
	if (rnd <= 0.5) sprite = 'grass';
	else if (rnd > 0.5 && rnd <= 0.72) sprite = 'sand';
	else if (rnd > 0.72 && rnd <= 0.93) sprite = 'water';
	else if (rnd > 0.93) sprite = 'mountains';
	return sprite;
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
	for (var i = 0; i < 24; i++) {
		map[i] = new Array(32);
	}

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

			// if (j == 31) {
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
			// }

			// map[i][j] = getRandomCell();
		}
	}

	for (var i = 0; i < 24; i++) {
		for (var j = 0; j < 32; j++) {			
			game.add.sprite(32 * j, 32 * i, map[i][j]);
		}
	}
}