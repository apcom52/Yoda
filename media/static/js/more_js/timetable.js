$(function() {
	moment.locale('ru');
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
	});

	router.on('route:getWeek', function(date) {
		console.log('showWeek');
	});

	router.on('route:getMonth', function(date) {
		console.log('showMonth');
	});

	router.on('route:default', function() {
		window.location.hash = '#day/' + getParseDate(targetDay);
	});

	$('body').on('click', '.showNextDay', function() {
		targetDay.setDate(targetDay.getDate() + 1);
		window.location.hash = '#day/' + getParseDate(targetDay);
	});

	$('body').on('click', '.showPrevDay', function() {
		targetDay.setDate(targetDay.getDate() - 1);
		window.location.hash = '#day/' + getParseDate(targetDay);
	});

	/* Модели */
	var DayModel = Backbone.Model.extend({
		default: {
			title: null,
			time: null,
			place: null,
			teacher: null,
			type: null,
			type_css: null,
		},
		urlRoot: "/api/settings/",
		url: function() {
			var current_day = (getParseDate(targetDay)).split('.');
			var url = '/api/timetable?day=' + current_day[0] + current_day[1];
			return url;
		}
	});


	/* Коллекции данных */
	var DayTimetableList = Backbone.Collection.extend({
		model: DayModel,
		url: function() {
			var current_day = (getParseDate(targetDay)).split('.');
			var url = '/api/timetable?day=' + current_day[0] + current_day[1];
			console.log(url);
			return url;
		}
	})


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
				type_css: this.model.get('type_css')
			};

			$(this.el).html(template(context));

			return this;
		}
	});

	var DayTimetableView = Backbone.View.extend({
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
					itemView.render();
					element.append(itemView.el);
				});
			} else {
				var source = $('#DayTimetableHoliday').html();
				element.html(source);
			}		

			return this;
		}
	});

	function uploadDay() {
		this.async = true;
		dayTimetableCollection = new DayTimetableList();
		dayTimetableCollection.fetch({
			success: function(data) {
				var dayView = new DayTimetableView({ collection: dayTimetableCollection});
				dayView.render();
				
			},
			error: function(data) {
				showToast('Возникла ошибка при загрузке данных');
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