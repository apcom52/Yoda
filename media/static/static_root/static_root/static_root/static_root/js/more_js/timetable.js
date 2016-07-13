$(function() {
	var dayMS = 86400000;
	var targetDay = new Date();
	moment.locale('ru');

	Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() - 1) / 7);
    }

	$('[data-lesson-title]').click(function() {
		$('.timetable-day__list__item').css({opacity: 0.1});
		var lesson_title = $(this).data('lessonTitle');
		$('.timetable-day__list__item[data-lesson-title="'+ lesson_title +'"]').css({opacity: 1});
	});

	$(document).click(function(e) {
		if ($(e.target).closest('[data-lesson-title]').length)
			return;
		$('.timetable-day__list__item').css({opacity: 1});
		e.stopPropagation();
	});


	var dayTimetableCollection = null;

	$.ajaxSetup({
		headers: {'X-CSRFToken': getCookie("csrftoken")}
	});

	var Router = Backbone.Router.extend({
		routes: {
			"*actions": "default",
		}
	});
	var router = new Router();

	var DayTimetable = Backbone.Model.extend({
		defaults: {
			title: "",
			teacher: "",
			time: "",
			place: "",
			type_css: "",
			type: "",
		},
		urlRoot: '/api/timetable/'
	});

	var DayTimetableList = Backbone.Collection.extend({
		model: DayTimetable,
		urlRoot: '/api/timetable/',
		url: function() {
			var url = this.urlRoot + '?day=';
			var date = targetDay;
			var day = date.getDate();
			var month = date.getMonth() + 1;

			if (day < 10) url += "0" + day;
			else url += day;

			if (month < 10) url += "0" + month;
			else url += month;

			console.log(url);

			return url;
		}
	});

	var DayTimetableItemView = Backbone.View.extend({
		tagName: 'div',
		className: 'day-timetable__item',
		initialize: function(opt) {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			this.render();
		},
		render: function() {
			var _this = this;
			$(this.el).empty();

			var source = $('#DayTimetableItemTemplate').html();
			var template = Handlebars.compile(source);
			var context = { 
				title: this.model.get('title'),
				teacher: this.model.get('teacher'),
				time: this.model.get('time'),
				place: this.model.get('place'),
				type_css: this.model.get('type_css'),
				type: this.model.get('type'),
			};

			$(this.el).html(template(context));

			return this;
		}
	});

	var DayTimetableView = Backbone.View.extend({
		collection: null,
		el: "#dayTimetableView",
		initialize: function(opt) {
			this.collection = opt.collection;
			_.bindAll(this, 'render');
		},
		render: function() {
			var element = $(this.el);
			element.html('');

			if (this.collection.length > 0) {
				this.collection.forEach(function(item) {
					var itemView = new DayTimetableItemView({
						model: item,
					});
					itemView.render();
					element.append(itemView.el);
				});
			} else {
				var source = $('#DayTimetableHoliday').html();
				var template = Handlebars.compile(source);
				$(this.el).html(template({}));
			}			

			return this;
		}
	});

	dayTimetableCollection = new DayTimetableList();
	changeDayLabel();
	updateDayTimetable();

	$('body').on('click', '.showPrevDay', function() {
		if ($('#dayTimetableLayout').hasClass('fade-in-right') || $('#dayTimetableLayout').hasClass('fade-in-left')) {
			$('#dayTimetableLayout').removeClass('fade-in-right');
			$('#dayTimetableLayout').removeClass('fade-in-left');
		}
		
		$('#dayTimetableLayout').addClass('fade-in-right');
		targetDay.setDate(targetDay.getDate() - 1);
		updateDayTimetable();


		changeDayLabel();

		setTimeout(function() {
			$('#dayTimetableLayout').removeClass('fade-in-right');
		}, 1000);
	});

	$('body').on('click', '.showNextDay', function() {
		if ($('#dayTimetableLayout').hasClass('fade-in-right') || $('#dayTimetableLayout').hasClass('fade-in-left')) {
			$('#dayTimetableLayout').removeClass('fade-in-right');
			$('#dayTimetableLayout').removeClass('fade-in-left');
		}
		
		$('#dayTimetableLayout').addClass('fade-in-left');
		targetDay.setDate(targetDay.getDate() + 1);
		updateDayTimetable();


		changeDayLabel();

		setTimeout(function() {
			$('#dayTimetableLayout').removeClass('fade-in-left');
		}, 1000);
	});

	function changeDayLabel() {
		var dateLabel = moment(targetDay).format('D MMMM');
		var currentDayNumber = moment(targetDay).format('D');
		var currentDayMonth = moment(targetDay).format('MMMM');
		var currentDayName = moment(targetDay).format('dddd');
		var weekNumber = targetDay.getWeek();
		var week = 'НЕЧЕТНАЯ НЕДЕЛЯ';
		if (weekNumber % 2 == 0) 
			week = 'ЧЕТНАЯ НЕДЕЛЯ';
		$('#currentDayLabel').html(dateLabel);
		$('#currentDayNumber').html(currentDayNumber);
		$('#currentDayMonth').html(currentDayMonth);
		$('#currentDayWeekType').html(currentDayName + ", " + week);
	}

	function updateDayTimetable() {
		dayTimetableCollection.fetch({
			success: function(data) {
				var dayTimetableView = new DayTimetableView({ collection: dayTimetableCollection});
				dayTimetableView.render();
				
				Backbone.history.start();				
			}, 
			error: function(data) {
				console.log(data);
				var error_template = $('#dayTimetableViewErrorTemplate').html();
				$('#dayTimetableView').html(error_template);
			}
		});
	}
});