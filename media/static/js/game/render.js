Render = function(game, map = null) {
	this.game = game;
	this.map = map;
}

Render.prototype.draw = function(map = undefined) {
	if (map != undefined) this.map = map;
	target = this;
	map = target.map;
	game = target.game;
	target.cells = game.add.group();
	console.log(map.startPosition);

	/*for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {*/
	for (var i = map.startPosition.y - 2, m=0; i < map.startPosition.y + 2; i++, m++) {
		for (var j = map.startPosition.x - 2, n=0; j < map.startPosition.x + 2; j++, n++) {
			var cell = map.cells[i][j];
			var current = game.add.sprite(64 * n, 64 * m, cell.sprite);
			current.inputEnabled = true;
			current.events.onInputOver.add(over, this);
			current.events.onInputOut.add(out, this);

			/* Если есть ресурсы, то добавляем спрайт ресурсов */
			if (cell.resource != "") {
				switch(cell.resource) {
					case Map.RESOURCE_STONE:
						game.add.sprite(64 * n, 64 * m, "stone_" + cell.type);
						break;
					case Map.RESOURCE_WOOD:
						game.add.sprite(64 * n, 64 * m, Map.RESOURCE_WOOD);
						break;
					case Map.RESOURCE_IRON:
						game.add.sprite(64 * n, 64 * m, "iron_" + cell.type);
						break;
					case Map.RESOURCE_CARBON:
						game.add.sprite(64 * n, 64 * m, Map.RESOURCE_CARBON);
						break;
				}				
			}

			target.cells.add(current);
			var str = "";
			if (cell.values.food) str += "🍎 " + cell.values.food + "\n";
			if (cell.values.production) str += "🔨 " + cell.values.production + "\n";
			if (cell.values.culture) str += "🕮 " + cell.values.culture + "\n";
			if (cell.values.gold) str += "○ " + cell.values.gold + "\n";
			if (cell.values.faith) str += "🐦 " + cell.values.faith + "\n";
			if (cell.values.science) str += "👓 " + cell.values.science + "\n";

			if (str) {
				game.add.text(64 * n, 64 * m, str, {
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