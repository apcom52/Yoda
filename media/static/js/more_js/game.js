var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {
    game.load.image('cup', '/media/potions/cup.jpg');
    game.load.image('smoke', '/media/potions/smoke.png');
    game.load.image('carrot', '/media/potions/carrot.png');

}

var cup, carrot;

function create() {
    cup = game.add.sprite(150, 200, 'cup');
    carrot = game.add.sprite(500, 300, 'carrot');

	game.physics.enable(carrot, Phaser.Physics.ARCADE);
    carrot.inputEnabled = true;
    carrot.input.enableDrag(true);
    carrot.events.onDragStart.add(startDrag, this);
    carrot.events.onDragStop.add(stopDrag, this);

    emitter = game.add.emitter(game.world.centerX, 250, 200);
    emitter.makeParticles('smoke');
    emitter.setRotation(0, 180);
    emitter.setAlpha(0, 0.3);
    emitter.setScale(0.5, 0.5);
    emitter.gravity = -200;
    emitter.start(false, 1500, 100);
}

function startDrag(sprite, pointer) {
    game.add.tween(sprite).to( { angle: -45 }, 2000, Phaser.Easing.Linear.None, true);
}

function stopDrag(sprite, pointer) {
	
    game.add.tween(sprite).to( { angle: 0 }, 2000, Phaser.Easing.Linear.None, true);
}