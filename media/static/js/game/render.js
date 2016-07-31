var buildCastle = false;

Render = function(game, map = null) {
	this.game = game;
	this.map = map;
}

Render.prototype.draw = function(map = undefined) {
	if (map != undefined) this.map = map;
	target = this;
	console.log('start rendering');
	console.log(target);
	if (target.cells) {
		game.world.forEach(function(item) {
			item.destroy();
		});
	}	
	// map = map;
	cells = map.cells;
	game = target.game;
	target.cells = game.add.group();

	/* Ищем границы "видимого" мира */
	var visibleBounds = {
		y1: null,
		x1: null
	};
	for (var i = 0; i < 32; i++) {
		for (var j = 0; j < 32; j++)
			if (cells[i][j].visible) {
				visibleBounds.y1 = i;
				break;
			}		
		if (visibleBounds.y1) break;
	}

	for (var j = 0; j < 32; j++) {
		for (var i = visibleBounds.y1; i < 32; i++) {
			if (cells[i][j].visible) {
				visibleBounds.x1 = j;
				break;
			}
		}
		if (visibleBounds.x1) break;
	}
	/* Ищем ширину */
	visibleBounds.x2 = visibleBounds.x1;
	for (var i = visibleBounds.y1; i < 32; i++) {
		for (var j = visibleBounds.x1; j < 32; j++) {
			if (cells[i][j].visible) {
				if (j > visibleBounds.x2) 
					visibleBounds.x2 = j;				
			}
		}
	}
	visibleBounds.y2 = visibleBounds.y1;
	for (var i = visibleBounds.y1; i < 32; i++) {
		var hasCells = false;
		for (var j = visibleBounds.x1; j < 32; j++) {
			if (cells[i][j].visible) {
				hasCells = true;
				break;			
			}
		}
		if (hasCells && i > visibleBounds.y2) {
			visibleBounds.y2 = i;
		}
	}

	console.log(visibleBounds);

	for (var i = visibleBounds.y1, m = -(visibleBounds.y2 - visibleBounds.y1) / 2 + 1; i <= visibleBounds.y2; i++, m++) {
		for (var j = visibleBounds.x1, n = -(visibleBounds.x2 - visibleBounds.x1) / 2 + 1; j <= visibleBounds.x2; j++) {
			var cell = cells[i][j];

			if (cell.visible) {
				hasVisibleCells = true;
				var current = game.add.sprite(512 + 64 * n, 384 + 64 * m, cell.sprite);
				target.cells.add(current);
				current.inputEnabled = true;
				current.events.onInputOver.add(over, this);
				current.events.onInputOut.add(out, this);
				current.events.onInputDown.add(cellClick, this);
				current.cell = cell;

				/* Если есть ресурсы, то добавляем спрайт ресурсов */
				if (cell.building) {
					console.log('find building!');				
					var building_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, cell.building.sprite);
					building_sprite.anchor.setTo(0.5, 0.5);
					target.cells.add(building_sprite);
				} else if (cell.resource != "") {
					switch(cell.resource) {
						case Map.RESOURCE_STONE:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, "stone_" + cell.type);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_WOOD:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, Map.RESOURCE_WOOD);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_IRON:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, "iron_" + cell.type);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_CARBON:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, Map.RESOURCE_CARBON);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_OIL:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, Map.RESOURCE_OIL);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_URAN:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, "uran_" + cell.type);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_SANDS:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, Map.RESOURCE_SANDS);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_WHEAT:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, Map.RESOURCE_WHEAT);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_GRAPES:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, Map.RESOURCE_GRAPES);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
						case Map.RESOURCE_CITRUS:
							var res_sprite = game.add.sprite(512 + 64 * n + 32, 384 + 64 * m + 32, Map.RESOURCE_CITRUS);
							res_sprite.anchor.setTo(0.5, 0.5);
							target.cells.add(res_sprite);
							break;
					}				
				}				
				/*var cell_icons = [];
				var params = ["food", "production", "culture", "faith", "science"];
				for (param_id = 0; param_id < params.length; param_id++) {
					if (cell.values[params[param_id]]) {
						for (var i = 0; i < cell.values[params[param_id]]; i++) {
							cell_icons[i] = params[param_id];
						}
					}
				}*/

				// var icons_group = game.add.group();
				/*for (var i = 0; i < cell_icons.length; i++) {
					var icon_sprite = game.add.sprite(512 + 64*n + 20 * i + 2, 512 + 64*m + 20 * i + 2, cell_icons[i]);
				}*/

				/*if (cell.values.food) {
					str += "🍎 " + cell.values.food + "\n";
				}
				if (cell.values.production) str += "🔨 " + cell.values.production + "\n";
				if (cell.values.culture) str += "🕮 " + cell.values.culture + "\n";
				if (cell.values.gold) str += "$ " + cell.values.gold + "\n";
				if (cell.values.faith) str += "🐦 " + cell.values.faith + "\n";
				if (cell.values.science) str += "👓 " + cell.values.science + "\n";

				if (str) {
					var values_txt = game.add.text(512 + 64 * n + 32, 384 + 64 * m + 32, str, {
						font: "bold 14px Arial",
						fill: "#000",					
					});
					values_txt.anchor.setTo(0.5, 0.5);
					target.cells.add(values_txt);
				}*/
				n++;
			}
			
		}
	}
}

Render.prototype.setActiveBuilding = function(building) {
	this.activeBuilding = building;
}

function over(item) {
	item.alpha = 0.9;
	console.log(item.cell.position);
}

function out(item) {
	item.alpha = 1; 
}

function cellClick(item) {
	if (this.activeBuilding) {
		console.log('build activate');
		$.get('/api/game/buildings/', 
			{
				m: 'build',
				x: item.cell.position.x,
				y: item.cell.position.y,
				id: this.activeBuilding.id,
			},
			function(response) {
				console.log(response);				
			},
			function(response) {
				console.log('error');
				console.log(response);
			}
		)
		this.activeBuilding = null;
	}
}