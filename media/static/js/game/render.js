Render = function(game, map = null) {
	this.game = game;
	this.map = map;
}

Render.prototype.draw = function(map = undefined) {
	if (map != undefined) this.map = map;
	target = this;
	map = target.map;
	cells = map.cells;
	game = target.game;
	target.cells = game.add.group();
	console.log(map.startPosition);

	/* Ищем границы "видимого" мира */
	var visibleBounds = {
		y1: null,
		x1: null
	};
	for (var i = 0; i < map.y_size; i++) {
		for (var j = 0; j < map.x_size; j++)
			if (cells[i][j].visible) {
				visibleBounds.y1 = i;
				break;
			}		
		if (visibleBounds.y1) break;
	}

	for (var j = 0; j < map.x_size; j++) {
		for (var i = visibleBounds.y1; i < map.y_size; i++) {
			if (cells[i][j].visible) {
				visibleBounds.x1 = j;
				break;
			}
		}
		if (visibleBounds.x1) break;
	}
	/* Ищем ширину */
	visibleBounds.x2 = visibleBounds.x1;
	for (var i = visibleBounds.y1; i < map.y_size; i++) {
		for (var j = visibleBounds.x1; j < map.x_size; j++) {
			if (cells[i][j].visible) {
				if (j > visibleBounds.x2) 
					visibleBounds.x2 = j;				
			}
		}
	}
	visibleBounds.y2 = visibleBounds.y1;
	for (var i = visibleBounds.y1; i < map.y_size; i++) {
		var hasCells = false;
		for (var j = visibleBounds.x1; j < map.x_size; j++) {
			if (cells[i][j].visible) {
				hasCells = true;
				break;			
			}
		}
		if (hasCells && i > visibleBounds.y2) {
			visibleBounds.y2 = i;
		}
	}

	for (var i = visibleBounds.y1, m = -(visibleBounds.y2 - visibleBounds.y1) / 2 + 1; i <= visibleBounds.y2; i++, m++) {
		for (var j = visibleBounds.x1, n = -(visibleBounds.x2 - visibleBounds.x1) / 2 + 1; j <= visibleBounds.x2; j++) {
			var cell = map.cells[i][j];
			if (cell.visible) {
				hasVisibleCells = true;
				var current = game.add.sprite(512 + 64 * n, 384 + 64 * m, cell.sprite);
				current.inputEnabled = true;
				current.events.onInputOver.add(over, this);
				current.events.onInputOut.add(out, this);
				current.cell = cell;

				/* Если есть ресурсы, то добавляем спрайт ресурсов */
				if (cell.building != "") {
					console.log('find building!');
					switch(cell.building) {
						case Map.BUILDING_CASTLE1:
							game.add.sprite(512 + 64 * n, 384 + 64 * m, Map.BUILDING_CASTLE1);
							break;
					}
				} else if (cell.resource != "") {
					switch(cell.resource) {
						case Map.RESOURCE_STONE:
							game.add.sprite(512 + 64 * n, 384 + 64 * m, "stone_" + cell.type);
							break;
						case Map.RESOURCE_WOOD:
							game.add.sprite(512 + 64 * n, 384 + 64 * m, Map.RESOURCE_WOOD);
							break;
						case Map.RESOURCE_IRON:
							game.add.sprite(512 + 64 * n, 384 + 64 * m, "iron_" + cell.type);
							break;
						case Map.RESOURCE_CARBON:
							game.add.sprite(512 + 64 * n, 384 + 64 * m, Map.RESOURCE_CARBON);
							break;
					}				
				}

				target.cells.add(current);
				var str = "";
				if (cell.values.food) str += "🍎 " + cell.values.food + "\n";
				if (cell.values.production) str += "🔨 " + cell.values.production + "\n";
				if (cell.values.culture) str += "🕮 " + cell.values.culture + "\n";
				if (cell.values.gold) str += "$ " + cell.values.gold + "\n";
				if (cell.values.faith) str += "🐦 " + cell.values.faith + "\n";
				if (cell.values.science) str += "👓 " + cell.values.science + "\n";

				if (str) {
					game.add.text(512 + 64 * n, 384 + 64 * m, str, {
						font: "bold 14px Arial",
						fill: "#000",					
					});
				}
				n++;
			}
			
		}
	}
}

function over(item) {
	item.alpha = 0.9;
	console.log(item.cell.position);
}

function out(item) {
	item.alpha = 1; 
}