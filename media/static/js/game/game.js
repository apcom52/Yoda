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
	
	game.load.image('work-on', '/media/game/icons/work-on.png');
	game.load.image('work-off', '/media/game/icons/work-off.png');

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
	game.load.image('castle3', '/media/game/castle3.png');
	game.load.image('market', '/media/game/market.png');
	game.load.image('chapel', '/media/game/chapel.png');
	game.load.image('forge', '/media/game/forge.png');
	game.load.image('arena', '/media/game/arena.png');
	game.load.image('circus', '/media/game/circus.png');
	game.load.image('library', '/media/game/library.png');
	
	game.load.image('oil_company', '/media/game/oil_company.png');
	game.load.image('big_ben', '/media/game/big_ben.png');
	game.load.image('fly_gardens', '/media/game/fly_gardens.png');
	game.load.image('radio', '/media/game/radio.png');
	game.load.image('factory', '/media/game/factory.png');
	game.load.image('coloss', '/media/game/coloss.png');
	game.load.image('coin_house', '/media/game/coin_house.png');
	game.load.image('white_house', '/media/game/white_house.png');
	game.load.image('airport', '/media/game/airport.png');
	game.load.image('pizan', '/media/game/pizan.png');
	game.load.image('alexander_lighthouse', '/media/game/alexander_lighthouse.png');
	game.load.image('c-ica', '/media/game/c-ica.png');
	game.load.image('school', '/media/game/school.png');
	game.load.image('skyscaper', '/media/game/skyscaper.png');
	game.load.image('hospital', '/media/game/hospital.png');
	game.load.image('church', '/media/game/church.png');
	game.load.image('mill', '/media/game/mill.png');
	game.load.image('pyramids', '/media/game/pyramids.png');
	game.load.image('stonehendge', '/media/game/stonehendge.png');

	game.load.image('progress', '/media/game/build.png');
}

var startLoading = function() {
	$('body').append("<div class='spinner'></div>");
}

var endLoading = function() {
	$('body .spinner').remove();
}

var showLoadingScreen = function() {
	$('body').append($('#loadingTemplate').html());
	$('.overflow').foggy();
}

var hideLoadingScreen = function() {
	$('body .game-preload').remove();
}

var render = new Render(game);
render.startLoading = startLoading;
render.endLoading = endLoading;
render.endLoadingScreen = hideLoadingScreen;
var stats = 0;

function refreshMap(renderObj) {
	startLoading();
	$.get('/api/game/map?m=get', {},
		function(response) {
			endLoading();
			hideLoadingScreen();
			renderObj.hasBuildingInProgress = false;
			console.log(response);
			var m = {}
			m.cells = response;
			renderObj.draw(m);
		}
	);
}

function create() {
	game.world.setBounds(-1024, -768, 4096, 3072);
	game.debug.text(game.time.fps, 8, 16, '#00FF00');
	// refreshMap(render);

	game.kineticScrolling.configure({
		kineticMovement: false,
		verticalScroll: true,
		timeConstantScroll: 0,
		horizontalWheel: false,
		verticalWheel: false,
		deltaWheel: 0
	});
	game.kineticScrolling.start();
}

var mouseTrack = {
	last: null,
}

function update() {
	// game.debug.text(game.time.fps, 8, 16, '#00FF00');
}

function render() {
	// game.debug.cameraInfo(game.camera, 32, 16);
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

		startLoading();
		$.get('/api/game/technologies/', {
				m: 'available_list',
			},
			function(response) {
				endLoading();
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
	});

	//окно строительства
	var availableBuildings = {};
	var currentBuilding = null;
	$('#buildingBtn').click(function() {
		buildingModal.show();
		var scienceSplash = $('#buildingSplash');

		if (render.hasBuildingInProgress) {
			$('#build_button').hide();
		}

		var availableBuildingsDOM = $('#availableBuildingsList');
		availableBuildingsDOM.html(loading_screen);

		startLoading();
		$.get('/api/game/buildings/', {
				m: 'available_list',
			},
			function(response) {
				endLoading();
				console.log('success');
				console.log(response);

				availableBuildings = response;

				var source = $('#BuildingsListTemplate').html();
				var template = Handlebars.compile(source);
				var html = template(response.available);
				availableBuildingsDOM.html(html);

				if (response.current) {
					var splash_source = $('#windowSplashTemplate').html();
					var splash_template = Handlebars.compile(splash_source);
					var splash_html = splash_template(response.current);
					scienceSplash.html(splash_html);
				} else {
					scienceSplash.hide();
				}
			}
		);

		$('body').on('click', '.buildings-list .icon, [data-type="building_current"]', function(e) {
			var target = $(this);
			var id = parseInt(target.data('id'));

			if ($(this).data('type') == 'building_current') {
				currentBuilding = availableBuildings.current;				
			} else {
				currentBuilding = availableBuildings.available[id];
				if (!$('[data-type="building_current"]').is(':visible')) {
					$('#build_button').show();					
				}
			}

			var source = $('#BuildingInfoTemplate').html();
			var template = Handlebars.compile(source);
			var html = template(currentBuilding);
			$('#BuildingInfo').html(html);
		});
	});

	$('body').on('click', '#startTeach', function(e) {
		startLoading();
		if (currentTech) {
			endLoading();
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
		var dogmatsContent = $('#availableDogmatsList');
		dogmatsContent.html('<div class="loading-layout loading-layout--invert loading-layout--transparent></div>');

		startLoading();
		$.get('/api/game/dogmats/', {
			m: 'my_dogmats',
		},
		function(response) {
			endLoading();
			var source = $('#dogmatsWindowList').html();
			var template = Handlebars.compile(source);
			var html = template(response);
			dogmatsContent.html(html);
		});
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
		startLoading();
		$.get('/api/game/stats/', {
			m: 'data',
		},
		function(response) {
			endLoading();
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
		startLoading();
		$.get('/api/game/stats/', {
			m: 'population',
		},
		function(response) {
			endLoading();
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

	$('body').on('click', '.dogmats_window .dogmat.locked', function() {
		// console.log('click!');
		startLoading();
		$.get('/api/game/dogmats/', {
			m: 'list',
			level: $(this).data('dogmatLevel'), 
		},
		function(response) {
			endLoading();
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

	var updateCitizensStats = function() {		
		response = render.citizensStats;
		var source = $('#citizensWindowTemplate').html();
		var template = Handlebars.compile(source);
		var html = template(response);
		$('.free_citizens_window').html(html);
	}
	render.citizensStatsUpdate = updateCitizensStats;

	$('#citizensBtn').click(function() {
		render.citizensMap.visible = !render.citizensMap.visible;
		if (render.citizensMap.visible) {
			render.cells.alpha = 0.5;
			$('.free_citizens_window').show();
			startLoading();

			$.get('/api/game/map/', {
				m: 'free_citizens',
			},
			function(response) {
				endLoading();
				render.citizensStats = response;
				updateCitizensStats();
			});
		} else {
			render.cells.alpha = 1;			
			$('.free_citizens_window').hide();
		}
	});	

	function updateStats() {
		startLoading();
		$.get('/api/game/stats/', {
			m: 'stats',
		},
		function(response) {
			endLoading();
			var source = $('#statsPanelTemplate').html();
			var template = Handlebars.compile(source);
			var html = template(response);
			$('#stats_panel').html(html);
			stats = response;
		});
	}

	updateStats();

	var introLevel = 1;
	var nationsArray = [];

	function firstGame() {
		if (introLevel == 1) {
			var introModal = new Modal($('#intro1'), {}, {
				onDiscard: function() {
					introLevel += 1;
					firstGame();
					this.hide();
				}
			});
			introModal.show();
		} else if (introLevel == 2) {
			var introModal = new Modal($('#intro2'), {}, {
				onDiscard: function() {
					introLevel += 1;
					firstGame();
				}
			});
			introModal.show();
		} else if (introLevel == 3) {
			var introModal = new Modal($('#intro3'), {}, {
				onDiscard: function() {
					introLevel += 1;
					firstGame();
				}
			});
			introModal.show();

			startLoading();

			var nationsList = $('#nationsList');
		
			$.get('/api/game/stats/', {
				m: 'nations',
			},
			function(response) {
				endLoading();
				var source = $('#nationsListTemplate').html();
				var template = Handlebars.compile(source);
				var html = template(response);
				nationsList.html(html);
				nationsArray = response;
			});
		} else if (introLevel == 4) {
			showLoadingScreen();
			startLoading();
			refreshMap(render);
		}
	}

	$('body').on('click', '[data-nation-id]', function() {
		var nationsContent = $('#nationsContent');
		var id = parseInt($(this).data('nationId'));
		console.log(id);
		var content = nationsArray[id - 1];
		console.log(content);

		var source = $('#nationsContentTemplate').html();
		var template = Handlebars.compile(source);
		var html = template(content);
		nationsContent.html(html);
	});

	firstGame();	
});