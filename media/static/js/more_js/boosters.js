var boostOpening = new Phaser.Game(800, 400, Phaser.CANVAS, 'phaser-example', { preload: chestPreload, create: chestOpen });

function chestPreload() {
	boostOpening.load.image('card', '/media/img/cards/djinn.png');
	console.log('preload');
}

var bonuses = []

function chestOpen() {
	var card = boostOpening.add.sprite(323, 300, 'card');
	bonuses.push();
	console.log('open');
	tween();
}

function tween() {
	// for (var i = 0; i < bonuses.length; i++) {
	// 	var current = bonuses[i];
	// 	current.opacity = 0;
	// 	current.scale = 0.8;
	// 	var jumping = boostOpening.add.tween(current);
	// 	jumping.to({y: 100}, 2000 + 500 * i, Phaser.Easing.Bounce.In);
	// 	jumping.onComplete.add(startStarsExplode, this);
	// 	jumping.start();
	// }
}

function startStarsExplode() {
	console.log('explode');
}