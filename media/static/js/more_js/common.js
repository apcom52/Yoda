exp = null;

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

$(function() {
	var accent = $('body').data('accent');

	$.ajaxSetup({
		headers: {'X-CSRFToken': getCookie("csrftoken")}
	});

	/*$(window).scroll(function () {
		if ($(this).scrollTop() >= 44) {
			$('.y-sidebar').css('top', '0px');
			$('.y-friends-list').css('top', '0px');
			console.log('more 44');
		} else {
			$('.y-sidebar').css('top', (44 - $(window).scrollTop()) + 'px');
			$('.y-friends-list').css('top', (44 - $(window).scrollTop()) + 'px');
			console.log('less 44');
		}
	});

	$(document).on("touchstart", function(event) {
		console.log('touch');
		$(window).swipe({
		  	swipeRight:function(event, direction, distance, duration, fingerCount) {
		  		console.log('right');
		  		$('#sidebar').sidebar('show');
		  	}, 
		  	swipeLeft:function(event, direction, distance, duration, fingerCount) {
		  		console.log('left');
		  		$('#sidebar').sidebar('hide');
		  	}
		});
	});*/

	exp = new ExperienceScreen({
		level: 1,
		current: 2
	});

	var nc = new NotificationCenter();
	// nc.push('Hello, everybody!');
	// nc.push('Вы получили 1 новый предмет', { title: 'Новый предмет', icon: 'https://theamazingkarj.files.wordpress.com/2016/01/card_back-edited.jpg?w=50&h=50&crop=1'})

	/* Центр уведомлений */
	var notificationCenterTabs = new Tabs($('#notificationCenterTabs'));
    var login = $('body').data('user');
    var notificationLength = 0;
    var notificationIsFirst = true;
    var alarmSong = new Audio('/media/audio/alarm.mp3');
   	var notificationCenter = new Sidebar($('#notificationCenter'), true);
    checkNotification();   

    $('#openNotifications').click(function() {
        notificationCenter.toggle();
        if (notificationCenter.visible) {
        	$('#page-content').foggy();
        } else {
        	$('#page-content').foggy(false);
        }
        checkNotification(false);
    });

    $('#updateNotifications').click(function() {
        checkNotification(false);
    });

    function checkNotification(withSong = true) {
    	$('#notificationCenterContent').html('<div class="loading-layout"></div>');

        $.get("/api/notifications?login=" + login, 
            function (response) {  
                if (response.length) {
                    $('#openNotifications').addClass(accent + '-bg white-fg');
                    $('#openNotifications > i').removeClass('flaticon-alarm').addClass('flaticon-alarm-fill');
                    $('#notificationCenterContent').html("");
                } else {
                	$('#notificationCenterContent').html('<p class="padding-horizontal-1">Уведомлений нет</p>');
                }                

                if (withSong && !notificationIsFirst && notificationLength < response.length) {
                    alarmSong.play();
                }

                notificationLength = response.length;
                var source = $('#notificationItemTemplate').html();
                var template = Handlebars.compile(source);
                
                $('#notificationCenterContent').append("<div class='feed'>");
                $('#notificationCenterContent > .feed').addClass('feed--color-' + accent);
                for (var i = 0; i < response.length; i++) {
                    $('#notificationCenterContent > .feed').append(template(response[i]));                    
                }
                $('#notificationCenterContent').append("</div>");

                notificationIsFirst = false;
            }
        );
    };

    var notificationCheck = setInterval(function() {
        checkNotification();
    }, 30000);

    $('#clearNotifications').click(function() {
        $('#notificationCenterContent').html('<div class="loading-layout"></div>');
        $.get("/api/notifications?clear=true&login=" + login, 
            function (response) {  
                $('#openNotifications').removeClass(accent + '-bg white-fg');  
                $('#openNotifications > i').removeClass('flaticon-alarm-fill').addClass('flaticon-alarm');
                $('#notificationCenterContent').html('<p class="padding-horizontal-1">Уведомлений нет</p>');

                notificationLength = 0;
            }
        );
    });


    // ---------

	var sidebar = new Sidebar($('#sidebar'), true, {
		onShow: function() {
			$('#sidebar .sidebar__cover img').addClass('avatar-animation');
			console.log('onShow');
			$('#page-content').foggy();
		}, 
		onHide: function() {
			$('#sidebar .sidebar__cover img').removeClass('avatar-animation');
			console.log('onHide');
			$('#page-content').foggy(false);
		}
	});

	$('#mainMenu').click(function() {
		sidebar.show();
		console.log(sidebar);
	});

	$('#back_menu').click(function() {
		sidebar.hide();
	});

	$('#sidebar').on('sidebar-show', function() {
		$('#back_menu').show();
		$('#mainMenu').hide();
	});

	$('#sidebar').on('sidebar-hide', function() {
		$('#back_menu').hide();
		$('#mainMenu').show();
	});

	var Friend = Backbone.Model.extend({
		defaults: {
			id: 0,
			first_name: "",
			last_name: "",
			avatar: "",
			is_online: false,
		},
		urlRoot: "/api/users/",
		url: function() {
			var url = this.urlRoot + '?' + this.id;
			return url;
		}
	});

	var FriendList = Backbone.Collection.extend({
		model: Friend,
		url: '/api/users/',
	});

	var FriendListView = Backbone.View.extend({
		collection: null,
		el: '#friendsContent',

		initialize: function(opt) {
			this.collection = opt.collection;
			_.bindAll(this, 'render');
		},

		render: function() {
			var element = $(this.el);
			element.html('');

			this.collection.forEach(function(item) {
				var itemView = new FriendListItemView({
					model: item,
					attributes: {
						'data-friends-id': item.id
					}
				});
				itemView.render();
				element.append(itemView.el);
			});

			return this;
		}
	});

	var FriendListItemView = Backbone.View.extend({
		tagName: 'div',
		className: 'y-friends-list__item',
		attributes: {
			'data-user-id': null,
		},
		events: {
			'click': 'onClick'
		},
		initialize: function(opt) {			
			_.bindAll(this, 'render');
			this.model.bind('change', this.render);
			this.render();
		},
		render: function() {
			var _this = this;
			$(this.el).empty();

			var source = $('#friendListItemTemplate').html();
			var template = Handlebars.compile(source);
			var context = { 
				id: this.model.get('id'),
				username: this.model.get('first_name') + ' ' + this.model.get('last_name'),
				avatar: this.model.get('avatar'),
				accent: accent,
				online: this.model.get('is_online'),
			};
			$(this.el).html(template(context));

			return this;
		}
	});

	function updateFriendList() {
		var friendsCollection = new FriendList();
		friendsCollection.fetch({
			success: function(data) {
				var friendsList = new FriendListView({ collection: data});
				friendsList.render();
				console.log(friendsCollection);
			},
			error: function(data) {
				console.log('error');
			}
		});
	}

	var friends_visible = false;
	$('#showFriends').click(function() {
		if (!friends_visible) {
			$('.y-friends-list').animate({right: '0px'}, 500);
			updateFriendList();
			$('#showFriends').addClass(accent + '-bg');
			$('#showFriends').addClass('white-fg');
			friends_visible = true;
		} else {
			$('.y-friends-list').animate({right: '-300px'}, 300);
			$('#showFriends').removeClass(accent + '-bg');
			$('#showFriends').removeClass('white-fg');
			friends_visible = false;
		}
	});	

	Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
});

ExperienceScreen = function(params) {
	var target = this;
	target.visible = false;
	target.level = params.level || null;
	target.current = params.current || null;
	var el = $('.new-level-screen');
	target.el = el;
	if (target.level == 1) {
		target.start = 0;
		target.end = 10;
	} else {
		target.start = 10 + 15 * (target.level - 2);
		target.end = 10 + 15 * (target.level - 1);
	}
	target.percent = target.current / (target.end - target.start);
	target.el.find('#new-level-screen-label').hide();
	target.el.find('#new-level-screen-current').text(target.current);
	target.el.find('#new-level-screen-end').text(target.end);
	target.el.find('#new-level-screen-progress').css('width', (target.percent) * 100 + "%");

	return target;
}

ExperienceScreen.prototype.add = function(xp = 0) {
	var target = this;
	target.visible = true;
	var el = $('.new-level-screen');
	target.el = el;	
	target.current += xp;	

	if (target.current >= target.end) {
		target.level += 1;
		target.start = 10 + 15 * (target.level - 2);
		target.end = 10 + 15 * (target.level - 1);
		target.el.find('#new-level-screen-label').show();
	}
	target.percent = (target.current - target.start) / (target.end - target.start);
	target.show();
}

ExperienceScreen.prototype.show = function() {
	var target = this;
	target.el.addClass('new-level-screen--show');
	setTimeout(function() {
		target.el.find('#new-level-screen-current').text(target.current);
		target.el.find('#new-level-screen-end').text(target.end);
		target.el.find('#new-level-screen-progress').css('width', (target.percent) * 100 + "%");
	}, 1000);
	setTimeout(function() {
		target.visible = false;
		target.el.removeClass('new-level-screen--show');
	}, 2500);
}

NotificationCenter = function() {
	this.unreadNotification = 0;
	this.notifications = [];
	this.el = $('.notification-area');
	this.visible = false;
	this.alarm = new Audio('/media/audio/alarm.mp3');
	var target = this;
	this.el.find('#notification-area__hide').click(function() { target.hide(); });
	this.el.find('#notification-area__clear').click(function() { target.clear(); });
}

NotificationCenter.prototype.push = function(message = '', options = {}) {
	var target = this;
	var title = options.title ? options.title : null;
	var icon = options.icon ? options.icon : null;

	target.notifications.push({
		title: title,
		message: message,
		icon: icon
	});

	target.render();
	target.alarm.play();
}

NotificationCenter.prototype.render = function() {
	var target = this;
	target.el.find('.notification-area__content').html('');
	var notifications = target.notifications;
	notifications.forEach(function (item) {
		var html = '';
		if (item.icon) html += '<div class="notification-area__notification notification-area__notification--with-icon">';
		else html += '<div class="notification-area__notification">';
		if (item.icon) html += '<img src="' + item.icon + '" alt="">';
		html += '<div class="notification-area__notification__content">';
		if (item.title) html += '<div class="notification-area__notification__content__title">' + item.title + '</div>';
		html += '<div class="notification-area__notification__content__message">' + item.message + '</div></div></div>';
		target.el.find('.notification-area__content').append(html);
	});
	$('body').append('<div class="overflow"></div>');
	$('#page-content').foggy();
	target.el.show();
}

NotificationCenter.prototype.hide = function() {
	$('body .notification-area .notification-area__notification').slideUp(300, function() {
		$('#page-content').foggy(false);
		$('.notification-area').hide();
		$('.overflow').remove();
	});
}

NotificationCenter.prototype.clear = function() {
	this.notifications = [];
	this.hide();
}


$(function() {
	
});