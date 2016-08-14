// Build 100 - 09.04.16

var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'game', {
	init: init,
	preload: preload,
	create: create,
	update: update,
	render: render,
});

function init() {
	game.kineticScrolling = game.plugins.add(Phaser.Plugin.KineticScrolling);
}

function preload() {
	game.stage.backgroundColor = '#000000';
	game.time.advancedTiming = true;

	game.load.image('food', '/media/game/icons/food.png');
	game.load.image('production', '/media/game/icons/production.png');
	game.load.image('culture', '/media/game/icons/culture.png');
	game.load.image('faith', '/media/game/icons/faith.png');
	game.load.image('science', '/media/game/icons/science.png');

	game.load.image('plain', '/media/game/grass.png');
	game.load.image('plain1', '/media/game/grass1.png');
	game.load.image('plain2', '/media/game/grass2.png');
	game.load.image('sand', '/media/game/sand.png');
	game.load.image('sand1', '/media/game/sand1.png');
	game.load.image('sand2', '/media/game/sand2.png');
	game.load.image('mountain', '/media/game/mountains.png');
	
	game.load.image('sea', '/media/game/water.png');
	game.load.image('seaE', '/media/game/waterE.png');
	game.load.image('seaW', '/media/game/waterW.png');
	game.load.image('seaS', '/media/game/waterS.png');
	game.load.image('seaN', '/media/game/waterN.png');
	game.load.image('seaEWNS', '/media/game/waterEWNS.png');
	game.load.image('seaE', '/media/game/waterE.png');
	game.load.image('seaW', '/media/game/waterW.png');
	game.load.image('seaN', '/media/game/waterN.png');
	game.load.image('seaS', '/media/game/waterS.png');
	game.load.image('seaEW', '/media/game/waterEW.png');
	game.load.image('seaNS', '/media/game/waterNS.png');
	game.load.image('sea_W', '/media/game/water_W.png');
	game.load.image('sea_E', '/media/game/water_E.png');
	game.load.image('sea_N', '/media/game/water_N.png');
	game.load.image('sea_S', '/media/game/water_S.png');

	// game.load.image('castle', '/media/game/castle.gif');
	
	game.load.image('stone_plain', '/media/game/stone_plain.png');
	game.load.image('stone_sand', '/media/game/stone_sand.png');
	game.load.image('wood', '/media/game/wood.png');
	game.load.image('sands', '/media/game/sands.png');
	game.load.image('iron_plain', '/media/game/iron_plain.png');
	game.load.image('iron_sand', '/media/game/iron_sand.png');
	game.load.image('carbon', '/media/game/carbon_plain.png');
	game.load.image('oil', '/media/game/oil.png');
	game.load.image('uran_plain', '/media/game/uran_plain.png');
	game.load.image('uran_sand', '/media/game/uran_sand.png');
	// game.load.image('uran', '/media/game/uran.png');
	// game.load.image('oil', '/media/game/oil.png');
	// game.load.image('aluminium', '/media/game/aluminium.png');

	game.load.image('wheat', '/media/game/wheat.png');
	game.load.image('grapes', '/media/game/grapes.png');
	game.load.image('citrus', '/media/game/citrus.png');
	
	// game.load.image('flower', '/media/game/flower.png');

	// game.load.tilemap('landscape', '/media/game/landscape_tilemap.png');

	game.load.image('castle1', '/media/game/castle1.png');
	game.load.image('market', '/media/game/market.png');
	game.load.image('chapel', '/media/game/chapel.png');
	game.load.image('forge', '/media/game/forge.png');
	game.load.image('arena', '/media/game/arena.png');
	game.load.image('circus', '/media/game/circus.png');
	game.load.image('library', '/media/game/library.png');
	game.load.image('progress', '/media/game/build.png');
}

//var map = new Map('RUS');
var render = new Render(game);
//map.generate();\

function refreshMap(renderObj) {
	$.get('/api/game/map?m=get', {},
		function(response) {
			renderObj.hasBuildingInProgress = false;
			console.log(response);
			var m = {}
			m.cells = response;
			renderObj.draw(m);
		}
	);
}

function create() {
	// console.log(map.cells);
	game.world.setBounds(-1024, -768, 4096, 3072);
	// game.world.setBounds(0, 0, 1024, 768);
	game.debug.text(game.time.fps, 8, 16, '#00FF00');
	// var loading_screen = game.add.sprite(0, 0, 'loading-screen');
	// var loading_tooltip = game.add.text(game.world.centerX, 100, "Ратуша - основное здание в игре");
	// loading_tooltip.anchor.setTo(0.5);
	// loading_tooltip.font = 'Neucha';
	// loading_tooltip.fontSize = 14;
	// loading_tooltip.fill = "#ffd700";
	// loading_tooltip.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
	refreshMap(render);
	// render.draw(map);

	game.kineticScrolling.configure({
		kineticMovement: false,
		verticalScroll: true,
		timeConstantScroll: 0,
		horizontalWheel: false,
		verticalWheel: false,
		deltaWheel: 0
	});
	game.kineticScrolling.start();
	console.log(game);
}

var mouseTrack = {
	last: null,
}

function update() {
	game.debug.text(game.time.fps, 8, 16, '#00FF00');
}

function render() {
	game.debug.cameraInfo(game.camera, 32, 16);
}

$(function() {
	var ec = new ExperienceScreen({level: 2, current: 13});
	ec.add(5);

	var scienceModal = new Modal($('#scienceModal'));
	var buildingModal = new Modal($('#buildingModal'));
	var dogmatsModal = new Modal($('#dogmatsModal'));
	var statsModal = new Modal($('#statsModal'));

	var loading_screen = "<div class='loading-layout loading-layout--transparent loading-layout--invert'></div>";

	var availableScience = {};
	var currentTech;
	$('#scienceBtn').click(function() {
		$('#startTeach').hide();
		$('[data-type="science_current"]').hide();
		scienceModal.show();
		var availableTechnologies = $('#availableTechnologies');
		var scienceSplash = $('#scienceSplash');
		availableTechnologies.html(loading_screen);

		$('#scienceInfo').html('');

		$.get('/api/game/technologies/', {
				m: 'available_list',
			},
			function(response) {
				console.log('success');
				console.log(response);

				availableScience = response; 

				var source = $('#ModalListItemTemplate').html();
				var template = Handlebars.compile(source);
				var html = template(response);
				availableTechnologies.html(html);

				var splash_source = $('#windowSplashTemplate').html();
				var splash_template = Handlebars.compile(splash_source);
				var splash_html = splash_template(response.current);
				scienceSplash.html(splash_html);

				if (response.current) {
					$('[data-type="science_current"]').show();
				}
			}
		);

		$('body').on('click', '[data-type="science"], [data-type="science_current"]', function(e) {
			var target = $(this);
			var id = parseInt(target.data('id'));
			if ($(this).data('type') == 'science_current') {
				currentTech = availableScience.current;				
			} else {
				currentTech = availableScience.available[id];
				if (!$('[data-type="science_current"]').is(':visible')) {
					$('#startTeach').show();					
				}
			}

			var source = $('#ModalTechnologyInfo').html();
			var template = Handlebars.compile(source);
			var html = template(currentTech);
			$('#scienceInfo').html(html);
		});



		// $.get('/api/game/technologies/', {}, 
		// 	function (response) {
		// 		console.log('success');
		// 		console.log(response);
		// 		// var source = $('#ModalListItemTemplate');
		// 		// var template = Handlebars.compile(source);
		// 		// var html = template(response);
		// 		// availableTechnologies.html(html);
		// 	}, function(response) {
		// 		console.log('error');
		// 		// availableTechnologies.html(response);
		// });
	});

	//окно строительства
	var availableBuildings = {};
	var currentBuilding = null;
	$('#buildingBtn').click(function() {
		buildingModal.show();

		if (render.hasBuildingInProgress) {
			$('#build_button').hide();
		}

		var availableBuildingsDOM = $('#availableBuildingsList');
		availableBuildingsDOM.html(loading_screen);

		$.get('/api/game/buildings/', {
				m: 'available_list',
			},
			function(response) {
				console.log('success');
				console.log(response);

				availableBuildings = response;

				var source = $('#BuildingsListTemplate').html();
				var template = Handlebars.compile(source);
				var html = template(response);
				availableBuildingsDOM.html(html);
			}
		);

		$('body').on('click', '.buildings-list .icon', function(e) {
			var target = $(this);
			var id = parseInt(target.data('id'));
			console.log(id);
			currentBuilding = availableBuildings[id];
			console.log(currentBuilding);

			var source = $('#BuildingInfoTemplate').html();
			var template = Handlebars.compile(source);
			var html = template(currentBuilding);
			$('#BuildingInfo').html(html);
		});

		// $('body').on('click', '.technology-list__item[data-type="science"]', function(e) {
		// 	var target = $(this);
		// 	var id = parseInt(target.data('id'));
		// 	currentTech = availableScience.available[id];

		// 	var source = $('#ModalTechnologyInfo').html();
		// 	var template = Handlebars.compile(source);
		// 	var html = template(currentTech);
		// 	$('#scienceInfo').html(html);
		// });
	});

	$('body').on('click', '#startTeach', function(e) {
		if (currentTech) {
			$.get('/api/game/technologies/', {
				m: 'start',
				id: currentTech.id,
			},
			function(response) {
				if (response == "ok") {
					showToast("Изучение технологии стартовало!", 5);
				} else {
					showToast("Что-то пошло не так. Попробуйте обновить страницу", 5);
				}
			});
		}
	});

	$('body').on('click', '#build_button', function(e) {
		if (buildingModal.visible && currentBuilding) {
			buildingModal.hide();
			render.setActiveBuilding(currentBuilding);
		}		
	});

	$('#dogmatsBtn').click(function() {
		dogmatsModal.show();
	});

	var statsState = '';
	var statsModalContent = $('.stats_content');
	$('#statsBtn').click(function() {
		statsModal.show();
		var context = $('#chart');
		statsData();
	});

	$('body').on('click', '#statsPopulation', function () {
		statsPopulation();
	});

	function statsData() {
		statsState = 'data';

		statsModalContent.append('<div class="loading-layout loading-layout--invert loading-layout--transparent"></div>');
		$.get('/api/game/stats/', {
			m: 'data',
		},
		function(response) {
			var chartConfig = {
				"type": "line",
				"legend": {

				},
				"plot": {
					"tooltip": {
				    	"text":"%t в ход<br>%v"
				    }
				},
				"series": response,
			}

			zingchart.render({ 
				id : 'stats-chart', 
				data : chartConfig, 
				height: "100%", 
				width: "100%" 
			});
			statsModalContent.find('.loading-layout').remove();
		});
	}

	function statsPopulation() {
		statsState = 'population';

		statsModalContent.append('<div class="loading-layout loading-layout--invert loading-layout--transparent"></div>');
		$.get('/api/game/stats/', {
			m: 'population',
		},
		function(response) {
			var chartConfig = {
				"type": "line",
				"legend": {

				},
				"plot": {
					"stacked": true,
					"tooltip": {
				    	"text":"%t<br>%v"
				    }
				},
				"series": response,
			}

			zingchart.render({ 
				id : 'stats-chart', 
				data : chartConfig, 
				height: "100%", 
				width: "100%" 
			});
			statsModalContent.find('.loading-layout').remove();
		});
	}

	$('body').on('click', '.dogmats_window .dogmat', function() {
		// console.log('click!');
		$.get('/api/game/dogmats/', {
			m: 'list',
			level: $(this).data('dogmatLevel'), 
		},
		function(response) {
			var source = $('#dogmatsChooseWindow').html();
			var template = Handlebars.compile(source);
			var html = template(response);
			$('body').append(html);
		});
	});

	$('body').on('click', '.choose-dogmats .dogmat', function() {
		$('body .choose-dogmats').remove();
	});

	$('#help_button').click(function() {
		buildCastle = !buildCastle;
	});
});