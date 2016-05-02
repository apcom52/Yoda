$(function() {
	moment.locale('ru');

	var accent = $('body').data('accent');


	/* Модальные окна новых фич и рейтинга */
	var context = 'day';
	var updateModal = new Modal($('#newFeatures'));
	var rateModal = new Modal($('#rateApp'));
	var helpModal = new Modal($('#help'));
	//updateModal.show();

	$('#startRating').click(function() {
		updateModal.hide();
		rateModal.show();
	});

	$('#openRatingModal').click(function() {
		rateModal.show();
	});

	$('#showHelp').click(function() {
		helpModal.show();
	});

	var rateSelect1 = new Select($('#rate1'), ['Все отлично', 'Есть мелкие недочеты', 'Нормально', 'Плохо', 'Старый интерфейс был лучше'])
	var rateSelect2 = new Select($('#rate2'), ['Очень удобно', 'Стало удобнее чем ранее', 'Ничего не изменилось'])
	var rateSelect3 = new Select($('#rate3'), ['Удобно', '"Неделя" удобна, а "Месяц" нет', '"Месяц" удобен, а "Неделя" нет', 'Оба представления неудобны'])
	var rateSelect4 = new Select($('#rate4'), ['Все очень быстро', 'Скорость работы приемлима', 'Скорость работы очень медленная'])

	/* ---------------- */

	//var tabs = new Tabs($('#mobileSwitchTabs, #switchTabs'));

	var targetDay = new Date();
	var targetWeekDay = new Date();
	var targetMonthDay = new Date();

	Date.prototype.getWeekNumber = function(){
	    var d = new Date(+this);
	    d.setHours(0,0,0);
	    d.setDate(d.getDate()+4-(d.getDay()||7));
	    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
	};

	var dayTimetableCollection = null;
	var weekTimetableCollection = null;
	var monthTimetableCollection = null;

	var Router = Backbone.Router.extend({
		routes: {
			"day/:date": "getDay",
			"week/:date": "getWeek",
			"month/:date": "getMonth",
			"*actions": "default",
		}
	});

	var router = new Router();

	router.on('route:getDay', function(date) {
		context = 'day';
		$('.openDay, .openWeek, .openMonth').removeClass('tabs__item--active');
		$('.openDay').addClass('tabs__item--active');
		$('#weekView, #monthView').hide();
		$('#dayView').show();
		var string_date = date.split('.');
		var day = parseInt(string_date[0]);
		var month = parseInt(string_date[1]) - 1;
		targetDay = new Date(targetDay.getFullYear(), month, day);
		var weeknumber = targetDay.getWeekNumber();

		var week_type = 'НЕЧЕТНАЯ НЕДЕЛЯ';
		if (weeknumber % 2) {
			week_type = 'ЧЕТНАЯ НЕДЕЛЯ';
		}

		var targetDay_moment = moment([targetDay.getFullYear(), month, day]);

		var day_title = targetDay_moment.format('D MMMM');
		var day_meta = targetDay_moment.format('dddd') + ', ' + week_type;

		$('.timetable-view__label__title, #currentDayLabel').html(day_title);
		$('.timetable-view__label__meta').html(day_meta);
		uploadDay();
		console.log('show day');
	});

	router.on('route:getWeek', function(date) {
		context = 'week';
		$('.openDay, .openWeek, .openMonth').removeClass('tabs__item--active');
		$('.openWeek').addClass('tabs__item--active');
		if (date == undefined)
			date = getParseDate(targetWeekDay);
		$('#dayView, #monthView').hide();
		$('#weekView').show();
		var string_date = date.split('.');
		var day = parseInt(string_date[0]);
		var month = parseInt(string_date[1]) - 1;
		targetWeekDay = new Date(targetDay.getFullYear(), month, day);
		uploadWeek();
		console.log('show week');
	});

	router.on('route:getMonth', function(date) {		
		context = 'month';
		$('.openDay, .openWeek, .openMonth').removeClass('tabs__item--active');
		$('.openMonth').addClass('tabs__item--active');
		$('#dayView, #weekView').hide();
		$('#monthView').show();
		if (date == undefined)
			date = targetMonthDay.getMonth() + 1;
		uploadMonth();
		console.log('showMonth');
	});

	router.on('route:default', function() {
		window.location.hash = '#day/' + getParseDate(targetDay);
	});

	/* Навигация по вкладкам */
	$('.openDay').click(function() {
		window.location.hash = '#day/' + getParseDate(targetDay);
	});
	$('.openWeek').click(function() {
		window.location.hash = '#week/' + getParseDate(targetWeekDay);
	});
	$('.openMonth').click(function() {
		window.location.hash = '#month/' + (targetMonthDay.getMonth() + 1);
	});

	$('.refreshContent').click(function() {
		if (context == 'day') {
			uploadDay();
		} else if (context == 'week') {
			uploadWeek();
		} else if (context == 'month') {
			uploadMonth();
		}
	});

	$('body').on('dblclick', '#monthView .row .column', function() {
		var monthDate = new Date(targetMonthDay.getFullYear(), targetMonthDay.getMonth(), parseInt($(this).data('day')));
		window.location.hash = '#day/' + getParseDate(monthDate);
	});

	$('body').on('click', '.showNextDay', function() {
		if (context == 'day') {
			targetDay.setDate(targetDay.getDate() + 1);
			window.location.hash = '#day/' + getParseDate(targetDay);
		} else {
			targetWeekDay.setDate(targetWeekDay.getDate() + 7);
			window.location.hash = '#week/' + getParseDate(targetWeekDay);
		}		
	});

	$('body').on('click', '.showPrevDay', function() {
		if (context == 'day') {
			targetDay.setDate(targetDay.getDate() - 1);
			window.location.hash = '#day/' + getParseDate(targetDay);
		} else {
			targetWeekDay.setDate(targetWeekDay.getDate() - 7);
			window.location.hash = '#week/' + getParseDate(targetWeekDay);
		}
	});

	/* Модели */
	var DayModel = Backbone.Model.extend({
		url: function() {
			var current_day = (getParseDate(targetDay)).split('.');
			var url = '/api/timetable?day=' + current_day[0] + current_day[1];
			return url;
		}
	});

	var WeekModel = Backbone.Model.extend({
		default: {},
		url: function() {
			var currentDate = moment(targetWeekDay);
			var url = '/api/timetable?week=' + currentDate.format('DD/MM/YYYY');
			return url;
		}
	});

	var MonthModel = Backbone.Model.extend({
		url: function() {
			var currentDate = moment(targetMonthDay);
			var url = '/api/timetable?month=' + currentDate.format('MM');
			return url;
		}
	});


	/* Коллекции данных */
	var DayTimetableList = Backbone.Collection.extend({
		model: DayModel,
		url: function() {
			var current_day = (getParseDate(targetDay)).split('.');
			var url = '/api/timetable?day=' + current_day[0] + current_day[1];
			return url;
		}
	});

	var WeekCollection = Backbone.Collection.extend({
		model: WeekModel,
		url: function() {
			var currentDate = moment(targetWeekDay);
			var url = '/api/timetable?week=' + currentDate.format('DD/MM/YYYY');
			return url;
		}
	});

	var MonthCollection = Backbone.Collection.extend({
		model: MonthModel,
		url: function() {
			var currentDate = moment(targetMonthDay);
			var url = '/api/timetable?month=' + currentDate.format('MM');
			return url;
		}
	});

	/* Представления */
	var DayTimetableItemView = Backbone.View.extend({
		tagName: 'div',
		className: 'row',
		initialize: function(options) {
			this.render();
		},
		render: function() {
			$(this.el).empty();

			var source = $('#DayTimetableItemTemplate').html();
			var template = Handlebars.compile(source);
			var context = { 
				title: this.model.get('title'),
				teacher: this.model.get('teacher'),
				place: this.model.get('place'),
				time: this.model.get('time'),
				type: this.model.get('type'),
				type_css: this.model.get('type_css'),
				is_ended: this.model.get('is_ended'),
				homework: this.model.get('homework'),
				control: this.model.get('control'),
				is_canceled: this.model.get('is_canceled'),
				new_place: this.model.get('new_place'),
				double: this.model.get('double'),
				is_earlier: this.model.get('is_earlier'),
			};

			$(this.el).html(template(context));
			return this;
		}
	});

	var WeekTimetableItemView = Backbone.View.extend({
		tagName: 'div',
		className: 'row padding-vertical-1 size-fix',
		initialize: function(options) {
			this.render();
		},
		render: function() {
			$(this.el).empty();

			if (this.model.get('today') == true) {
				$(this.el).addClass('u-' + accent + '-bg');
			}

			var source = $('#WeekTimetableItemTemplate').html();
			var template = Handlebars.compile(source);
			var date = this.model.get('date').split(' ');
			var context = { 
				day: date[0],
				month: date[1],
				timetable: this.model.get('timetable'),
				today: this.model.get('today'),
				date_parsing: this.model.get('date_parsing'),
				accent: accent,
			};

			$(this.el).html(template(context));
			return this;
		}
	});

	// var MonthTimetableItemView = Backbone.View.extend({
	// 	tagName: 'div',
	// 	className: 'row',
	// 	initialize: function(options) {
	// 		this.render();
	// 	},
	// 	render: function() {
	// 		$(this.el).empty();

	// 		var source = $('#WeekTimetableItemTemplate').html();
	// 		var template = Handlebars.compile(source);
	// 		var date = this.model.get('date').split(' ');
	// 		var context = { 
	// 			date: this.model.get('date'),
	// 			start_time: this.model.get('today'),
	// 			end_time: this.model.get('today'),
	// 		};

	// 		$(this.el).html(template(context));
	// 		return this;
	// 	}
	// });

	var TimetableView = Backbone.View.extend({
		collection: null,
		el: '#dayView',
		initialize: function(options) {
			this.collection = options.collection;
			this.render();
		},
		render: function() {
			var element = $(this.el);
			element.html('');

			if (this.collection.length) {
				this.collection.forEach(function(item) {
					var itemView = new DayTimetableItemView({
						model: item
					});
					element.append(itemView.el);
				});
			} else {
				var source = $('#DayTimetableHoliday').html();
				element.html(source);
			}		

			return this;
		}
	});

	var TimetableWeekView = Backbone.View.extend({
		collection: null,
		el: '#weekView',
		className: 'vertical-layout vertical-layout--stripped',
		initialize: function(options) {
			this.collection = options.collection;
			this.render();
		},
		render: function() {
			var element = $(this.el);
			element.html('');

			this.collection.forEach(function(item) {
				var itemView = new WeekTimetableItemView({
					model: item
				});
				element.append(itemView.el);
			});

			return this;
		}
	});

	var TimetableMonthView = Backbone.View.extend({
		collection: null,
		el: '#monthView',
		initialize: function(options) {
			this.collection = options.collection;
			this.render();
		},
		render: function() {
			$(this.el).empty();

			var monthCollection = [];
			for (var i = 0; i < this.collection.length; i++) {
				console.log('week ' + i);
				monthCollection.push(new Object({days: []}));
				var currentModel = this.collection.at(i);
				
				for (var j = 0; j < 7; j++) {
					monthCollection[i].days.push(currentModel.get(j.toString()));
				}
			}

			var source = $('#MonthTimetableItemTemplate').html();
			var template = Handlebars.compile(source);
			var context = { 
				month: monthCollection,
				accent: accent,
			};

			console.log(context);

			$(this.el).html(template(context));

			return this;
		}
	});

	function uploadDay() {
		this.async = true;		
		$('.showPrevDay, .showNextDay').attr('disabled', true);
		$('#dayView').html('<div class="loading-layout"></div>');
		dayTimetableCollection = new DayTimetableList();
		dayTimetableCollection.fetch({
			success: function(data) {
				var dayView = new TimetableView({ collection: dayTimetableCollection});
				dayView.render();
				$('.showPrevDay, .showNextDay').attr('disabled', false);
			},
			error: function(data) {
				showToast('Возникла ошибка при загрузке данных');
				$('.showPrevDay, .showNextDay').attr('disabled', false);
			}
		});
	}

	function uploadWeek() {
		this.async = true;		
		$('#weekView').html('<div class="loading-layout"></div>');
		$('.showPrevDay, .showNextDay').attr('disabled', true);
		weekTimetableCollection = new WeekCollection();
		weekTimetableCollection.fetch({
			success: function(data) {
				var weekView = new TimetableWeekView({ collection: weekTimetableCollection});
				weekView.render();
				startDate = weekTimetableCollection.models[0].get('date');
				endDate = weekTimetableCollection.models[6].get('date');
				$('.timetable-view__label__title, #currentDayLabel').html(startDate + ' - ' + endDate);
				$('.timetable-view__label__meta').html("");
				$('.showPrevDay, .showNextDay').attr('disabled', false);
			},
			error: function(data) {
				showToast('Возникла ошибка при загрузке данных');
				$('.showPrevDay, .showNextDay').attr('disabled', false);
			}
		});
	}

	function uploadMonth() {
		this.async = true;		
		$('#monthView').html('<div class="loading-layout"></div>');
		$('.showPrevDay, .showNextDay').attr('disabled', true);
		monthTimetableCollection = new MonthCollection();
		monthTimetableCollection.fetch({
			success: function(data) {
				var monthView = new TimetableMonthView({ collection: monthTimetableCollection});
				$('.showPrevDay, .showNextDay').attr('disabled', false);
				$('.timetable-view__label__title, #currentDayLabel').html(moment(targetMonthDay).format('MMMM YYYY'));
				$('.timetable-view__label__meta').html("");
			},
			error: function(data) {
				showToast('Возникла ошибка при загрузке данных');
				$('.showPrevDay, .showNextDay').attr('disabled', false);
			}
		});
	}

	Backbone.history.start();

	function getParseDate(date) {
		var result = "";
		var day = date.getDate();
		var month = date.getMonth() + 1;

		if (day < 10) result += "0";
		result += day;

		result += '.';

		if (month < 10) result += "0";
		result += month;

		return result;
	}
});