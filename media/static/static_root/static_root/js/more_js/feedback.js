$(function() {
	var addNews = new Modal($('#AddNewsModal'));

	$('body').on('click', '#addNewsBtn', function() {
		addNews.show();
	});

	var tabs = new Tabs($('#feedbackTabs'));

	var blogCollection = null;

	var Router = Backbone.Router.extend({
		routes: {
			"blog/:id": "blog",
			"*actions": "default",
		}
	});

	var router = new Router();

	router.on('route:blog', function(id) {
		console.log('blog');		
		loadBlog(function(currentCollection) {
			console.log(currentCollection);
			var currentModel = currentCollection.models[id];
			$('#blogView-title').html(currentModel.get('title'));
			$('#blogView-content').html(currentModel.get('content'));
		});		
	});

	/* Models */
	var BlogModel = Backbone.Model.extend({
		default: {
			title: null,
			content: null,
		}, 
		urlRoot: "/api/blog/",
		url: function() {
			//var url = '/api/timetable?day=' + current_day[0] + current_day[1];
			return this.urlRoot;
		}
	});

	var BlogCollection = Backbone.Collection.extend({
		model: BlogModel,
		url: "/api/blog/",
	});

	var BlogListItemView = Backbone.View.extend({
		tagName: 'div',
		className: 'list__item',
		initialize: function(options) {
			this.render();
		},
		render: function() {
			$(this.el).html(this.model.get('title'));
			return this;
		}
	});

	var BlogListView = Backbone.View.extend({
		collection: null,
		el: '#blogListView',
		initialize: function(options) {
			this.collection = options.collection;
		},
		render: function() {
			var element = $(this.el);
			element.html('');

			this.collection.forEach(function(item) {
				var itemView = new BlogListItemView({ model: item });
				itemView.render();
				element.append(itemView.el);
			});

			return this;
		}
	});

	function loadBlog(scs) {
		blogCollection = new BlogCollection();
		//console.log(scs);
		$('#blogList').html('<div class="loading-layout"></div>');
		blogCollection.fetch({
			success: function(data) {
				var blogView = new BlogListView({ collection: blogCollection });
				blogView.render();
				scs(blogCollection);
			},
			error: function(data) {
				showToast('Возникла ошибка при загрузке данных');
			}
		});
	}

	Backbone.history.start();
	// loadBlog();	
});