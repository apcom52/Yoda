Render = function(game, map = null) {
	this.game = game;
	this.map = map;
}

Render.prototype.draw = function(map = undefined) {
	if (map != undefined) this.map = map;
	target = this;
	map = target.map;
	game = target.game;

	for (var i = 0; i < map.y_size; i++) {
		for (var j = 0; j < map.x_size; j++) {
			game.add.sprite(64 * j, 64 * i, map.cells[i][j].sprite);
		}
	}
}