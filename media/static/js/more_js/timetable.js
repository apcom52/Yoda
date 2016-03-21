$(function() {
	var targetDay = new Date();
	var targetWeekDay = new Date();
	var targetMonthDay = new Date();

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
		console.log('showDay');
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

	Backbone.history.start();

	function getParseDate(date) {
		var result = "";
		var day = date.getDate();
		var month = date.getMonth() + 1;
		console.log(day);

		if (day < 10) result += "0";
		result += day;

		if (month < 10) result += "0";
		result += month;

		return result;
	}
});