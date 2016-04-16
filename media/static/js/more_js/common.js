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

	/* Центр уведомлений */
	var notificationCenterTabs = new Tabs($('#notificationCenterTabs'));
    var login = $('body').data('user');
    var notificationLength = 0;
    var notificationIsFirst = true;
    var alarmSong = new Audio('/media/audio/alarm.mp3');
   	var notificationCenter = new Sidebar($('#notificationCenter'));
    console.log(notificationCenter);
    checkNotification();

    $('#openNotifications').click(function() {
        notificationCenter.toggle();
        console.log(notificationCenter);
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
        console.log('Проверено уведомление');
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

	var sidebar = new Sidebar($('#sidebar'));
	$('#mainMenu').click(function() {
		sidebar.show();
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
});