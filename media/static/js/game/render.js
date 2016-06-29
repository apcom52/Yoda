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
			var cell = map.cells[i][j];
			var current = game.add.sprite(64 * j, 64 * i, cell.sprite);
			current.inputEnabled = true;
			current.events.onInputOver.add(over, this);
			current.events.onInputOut.add(out, this);

			var str = "";
			if (cell.values.food) str += "🍎 " + cell.values.food + "\n";
			if (cell.values.production) str += "🔨 " + cell.values.production + "\n";
			if (cell.values.culture) str += "✒ " + cell.values.culture + "\n";
			if (cell.values.gold) str += "○ " + cell.values.gold + "\n";
			if (cell.values.faith) str += "🐦 " + cell.values.faith + "\n";
			if (cell.values.science) str += "👓 " + cell.values.science + "\n";

			if (str) {
				game.add.text(64*j, 64*i, str, {
					font: "bold 14px Arial",
					fill: "#000",					
				})
			}
		}
	}
}

function over(item) {
	item.alpha = 0.5; 
}

function out(item) {
	item.alpha = 1; 
}