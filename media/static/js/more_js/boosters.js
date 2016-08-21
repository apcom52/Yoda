var booster_game = new Phaser.Game(600, 400, Phaser.CANVAS, 'booster', {
	preload: preload,
	create: create,
});

var fullUploading = false;
var currentBooster = 0;

WebFontConfig = {

    google: {
      families: ['Ruslan Display::cyrillic']
    }

};

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




function preload() {
	booster_game.load.image('cyclop', '/media/img/cards/cyclop.png');
	
	booster_game.load.image('angel', '/media/img/cards/angel.png');
	booster_game.load.image('star', '/media/img/cards/boosters/star.png');
	booster_game.load.image('star3', '/media/img/cards/boosters/star3.png');

	booster_game.load.image('gold', '/media/img/cards/boosters/gold.png');
	booster_game.load.image('dust', '/media/img/cards/boosters/dust.png');
	
	booster_game.load.image('paladin_top', '/media/img/cards/boosters/paladin_top.png');
	booster_game.load.image('paladin_bottom', '/media/img/cards/boosters/paladin_bottom.png');
	booster_game.load.image('paladin_bg', '/media/img/cards/boosters/paladin_bg.jpg');

	booster_game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

function create() {
	fullUploading = true;
}

function openChest() {
	// var manager = booster_game.plugins.add(Phaser.ParticleStorm);

	currentBooster = "paladin";
	booster_game.world.children.forEach(function(item) {
		item.body = null;
		item.kill();
	});
	console.log(booster_game);

	switch (currentBooster) {
		case "paladin":
			var paladin_bg = booster_game.add.sprite(0, 0, 'paladin_bg');
			var paladin_bottom = booster_game.add.sprite(0, 600, 'paladin_bottom');
			var paladin_top = booster_game.add.sprite(0, -200, 'paladin_top');
			
			paladin_bg.alpha = 0;
			paladin_top.alpha = 0;
			paladin_bottom.alpha = 0;
			booster_game.add.tween(paladin_top).to({alpha: 1, y: 0}, 500, Phaser.Easing.Bounce.Out, true);
			booster_game.add.tween(paladin_bottom).to({alpha: 1, y: 200}, 500, Phaser.Easing.Bounce.Out, true);
			booster_game.add.tween(paladin_bg).to({alpha: 0.35}, 2000, Phaser.Easing.Bounce.Out, true);

			setTimeout(function() {
				booster_game.add.tween(paladin_top).to({alpha: 0, y: -200}, 1000, Phaser.Easing.Bounce.In, true);
				booster_game.add.tween(paladin_bottom).to({alpha: 0, y: 600}, 1000, Phaser.Easing.Bounce.In, true);

				setTimeout(function() {
					cards_sprites = [];
					cards_tips = [];
					for (var i = 0; i < 3; i++) {
						var legend = false;
						var emitter = null;
						var rnd = Math.random();
						if (rnd <= 0.33) {
							var current = booster_game.add.sprite(100 + 200 * i, 500, 'cyclop');
							var current_title = "Циклоп";
							var current_meta = "Стандартная карточка";	
						} else if (rnd > 0.33 && rnd <= 0.66) {
							var current = booster_game.add.sprite(100 + 200 * i, 500, 'gold');
							var current_title = "30";
							var current_meta = "золота";
						} else if (rnd > 0.66 && rnd <= 0.9) {
							var current = booster_game.add.sprite(100 + 200 * i, 500, 'dust');
							var current_title = "15";
							var current_meta = "пыль";
						} else if (rnd > 0.9) {
							var current = booster_game.add.sprite(100 + 200 * i, 500, 'angel');
							var current_title = "Ангел";
							var current_meta = "Легендарная карта";	

							// var data = {
							// 	lifespan: 3000,
							// 	image: ['star', 'star3'],
							// 	rotation: {delta: 1},
							// 	vx: { min: -2, max: 2 },
							// 	vy: { min: -2, max: 2 },
							// };

							// manager.addData('basic', data);
							// emitter = manager.createEmitter(Phaser.ParticleStorm.RENDERTEXTURE);
							// emitter.addToWorld();

							legend = true;
						}
						current.scale.setTo(-0.5, 0.5);
						current.anchor.setTo(0.5);
						current.alpha = 0;
						cards_sprites.push(current);						
						cards_tips.push({
							title: current_title,
							meta: current_meta,
						});

						booster_game.add.tween(current).to({alpha: 1, y: 150}, 1000 + 400 * i, Phaser.Easing.Bounce.Out, true);
						booster_game.add.tween(current.scale).to({x: 0.75, y: 0.75}, 1200  + 250 * i, Phaser.Easing.Back.InOut, true);						

						// if (legend) {
						// 	setTimeout(function() {
						// 		emitter.emit('basic', 200, 100 + 200 * i, { repeat: 1, frequency: 1});
						// 	}, 1000 + 100 * i);
						// }
					}

					setTimeout(function() {
						for (var j = 0; j < cards_tips.length; j++) {
							var values_header_txt = booster_game.add.text(100 + 200 * j, 300, cards_tips[j].title, {
								font: "bold 24px 'Ruslan Display'",
								fill: "#fff",					
							});
							values_header_txt.anchor.setTo(0.5, 0.5);
							values_header_txt.alpha = 1;

							var values_meta_txt = booster_game.add.text(100 + 200 * j, 330, cards_tips[j].meta, {
								font: "12px Arial",
								fill: "#fff",					
							});
							values_meta_txt.anchor.setTo(0.5, 0.5);
							values_meta_txt.alpha = 1;
						}						
					}, 2000);
				}, 1000);
			}, 1500);
			break;
	}
	// var sprites = [];
	// for (var i = 0; i < 3; i++) {
	// 	var current = booster_game.add.sprite(100 + 150 * i, 200, 'cyclop');
	// 	sprites.push(current);
	// 	current.alpha = 0;
	// 	current.scale = 3;
	// 	booster_game.add.tween(sprites[i]).to({alpha: 1}, 1000 * i, Phaser.Easing.Bounce.Out, true);
	// 	booster_game.add.tween(sprites[i].scale).to({x: 1, y: 1}, 1000 * i, Phaser.Easing.Bounce.Out, true);
	// }
}