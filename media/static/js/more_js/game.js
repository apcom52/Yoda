//Build 100 - 09.04.16
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'battles');

/* Состояния игры */
var bootState = {
	create: function() {
		// Здесь будут подгружаться плагины, если они будут
		game.state.start('load');
	}
};

var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(0, 0, 'Идет загрузка. Подождите...', {font: '30px Courier', fill: '#ffffff'});

		game.load.image('hamburger', '/media/game/hamburger.png');
		game.load.image('logo', '/media/game/logo.png');
		
		game.load.image('build_button', '/media/game/build_button.png');
		game.load.image('army_button', '/media/game/army_button.png');
		game.load.image('stats_button', '/media/game/stats_button.png');
	},

	create: function() {
		game.state.start('kingdom');
	}
}

var kingdomState = {
	create: function() {
		game.stage.backgroundColor = '#ffdacf'

		game.add.sprite(16, 16, 'hamburger');
		game.add.sprite(64, 6, 'logo');

		game.add.sprite(752, 458, 'stats_button');
		game.add.sprite(752, 504, 'army_button');
		game.add.sprite(752, 552, 'build_button');

		game.add.text(10, 576, 'Build 101', {font: '14px Courier', fill: '#ffffff'});
	}
}

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('kingdom', kingdomState);
game.state.start('boot');
/*function preload() {
    game.load.image('tilemap', '/media/game/tilemap.png');
}

var map;
var grass_tile,
    water_tile;

function create() {
    game.stage.backgroundColor = '#2d2d2d';
    /*map = game.add.tilemap();
    map.addTilesetImage('tilemap');

    grass_tile = map.create('grass', )*/
//}