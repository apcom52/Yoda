Building = function(type = null) {
	if (type) {
		this.type = type;
	} else {
		throw new Error("NULL Building Type!");
	}

	this.setParams();
}

Building.CASTLE = "castle";
Building.GRANARY = "granary";

Building.prototype.setParams = function() {
	var target = this;
	switch(target.type) {
		case Building.CASTLE:
			target.params = {
				level: 1,
				sprite: 'castle1',
				values: {
					food: 1 * target.level,
					production: 1 * target.level,
					faith: 1 * target.level,
					science: 1 * target.level,
					gold: 5 * target.level,
					culture: 1 * target.level,
				}
			}
			break;
		default:
			throw new Error("Invalid Building Type!");
			break;
	}
}

Building.prototype.build = function(sprite) {
	var cell = sprite.cell;
	var target = this;
	cell.building = target;	
}