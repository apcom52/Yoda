from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter
from . import views
from . import game_api

'''router = DefaultRouter()
router.register(r'library/file', views.LibraryFilesAPI)
router.register(r'library/tag', views.LibraryTagAPI)
router.register(r'user', views.UserAPI)'''

urlpatterns = [
	#url(r'^library-file/$', LibraryFileList.as_view(), name='library-file-list'),	
	#url('^library/file', views.library_files, name='library_files'),
	url('^library/file', views.LibraryFilesAPI.as_view()),
	url('^library/tags', views.LibraryTagAPI.as_view()),
	url('^library/tag-category', views.library_tag_category, name='library_tag_category'),

	url('^users/$', views.UserAPI.as_view()),
	url('^users/attendances', views.AttendanceAPI.as_view()),

	url('^notes/', views.NoteAPI.as_view()),

	url('^favorite/$', views.FavoriteAPI.as_view()),

	url('^settings/$', views.SettingsAPI.as_view()),
	
	url('^notifications/$', views.NotificationAPI.as_view()),
	
	url('^timetable/$', views.TimetableAPI.as_view()),
	url('^change_timetable/$', views.TimetableManupulationsAPI.as_view()),

	url('^feed/$', views.FeedAPI.as_view()),

	url('^blog/$', views.BlogPostAPI.as_view()),
	
	url('^event/$', views.EventAPI.as_view()),

	url('^game/technologies/$', game_api.TechnologiesList.as_view()),
	url('^game/buildings/$', game_api.BuildingsList.as_view()),
	url('^game/dogmats/$', game_api.DogmatAPI.as_view()),
	url('^game/map/$', game_api.MapAPI.as_view()),

	#url('^', include(router.urls)),
]