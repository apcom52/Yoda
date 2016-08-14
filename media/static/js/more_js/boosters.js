var fullUploading = false;

$(function (){
	$('#boostOpen').click(function() {
		openChest();

		// cards = $('.open-chest .bonus_list .bonus img');		
		// cards.removeClass('hide-img');
		// cards.addClass('active');
		// setTimeout(function() {
		// 	cards.removeClass('active');
		// 	cards.css('opacity', '1');
		// }, 500)
	});
});


var booster_game = new Phaser.Game(600, 400, Phaser.CANVAS, 'booster', {
	preload: preload,
	create: create,
});

function preload() {
	booster_game.load.image('cyclop', '/media/img/cards/cyclop.png');
}

function create() {
	fullUploading = true;
}

function openChest() {
	var sprites = [];
	for (var i = 0; i < 3; i++) {
		var current = booster_game.add.sprite(100 + 150 * i, 200, 'cyclop');
		sprites.push(current);
		current.alpha = 0;
		current.scale = 3;
		booster_game.add.tween(sprites[i]).to({alpha: 1}, 1000 * i, Phaser.Easing.Bounce.Out, true);
		booster_game.add.tween(sprites[i].scale).to({x: 1, y: 1}, 1000 * i, Phaser.Easing.Bounce.Out, true);
	}
}