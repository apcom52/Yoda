# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.db.models import Q
from django.conf import settings
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.views import APIView

from library.serializers import *
from user.serializers import *
from notes.serializers import *
from favorites.serializers import *
from timetable.serializers import *
from feedback.serializers import *
from achievements.serializers import *
from events.serializers import *

from library.models import *
from notes.models import Note
from timetable.models import Timetable
from feedback.models import *
from achievements.models import Notification, Feed

# Create your views here.
class LibraryFilesAPI(APIView):	
	def get(self, request, format = None):
		#file, serializer = None
		data = request.GET
		
		if data.get("id"):
			file = LibraryFile.objects.get(pk = int(data.get("id")))
			file.views += 1
			file.save()

			tags = file.tags.all()
			for tag in tags:
				tag.views += 1
				tag.save()
			serializer = LibraryFileSerializer(file, many = False)

		elif data.get("q"):
			query = (data.get('q')).lower()
			file = LibraryFile.objects.all().filter(Q(title__icontains = query.capitalize()) | Q(description__icontains = query.capitalize()) | Q(title__icontains = query.upper()) | Q(description__icontains = query.upper()) | Q(title__icontains = query.lower()) | Q(description__icontains = query.lower())).order_by('-id').distinct()	
			serializer = LibraryFileSerializer(file, many = True, read_only = True)

		else:
			file = LibraryFile.objects.all().order_by('-id')
			serializer = LibraryFileSerializer(file, many = True)
		return Response(serializer.data)

	def post(self, request, format = None):
		print(self.request)
		login = request.user
		print(request.data)
		file = request.data['file']
		title = request.data['title']
		description = request.data['description']

		libraryFile = LibraryFile()
		libraryFile.title = title
		libraryFile.description = description
		libraryFile.file = file
		libraryFile.login = login
		libraryFile.save()
		data = LibraryFileSerializer(libraryFile)
		return Response(data.data)


class LibraryTagAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		if (data.get("count")):
			tags = LibraryTag.objects.all().order_by('-views')[:int(data.get("count"))]						
		else:
			tags = LibraryTag.objects.all().order_by('-views')
		serializer = LibraryTagSerializer(tags, many = True)
		return Response(serializer.data)

class UserAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		if (data.get("id")):
			users = User.objects.filter(id__exact = int(data.get('id')))
		else:
			users = User.objects.all().order_by('-userprofile__last_visit').filter(is_active = True)
		serializer = UserSerializer(users, many = True)
		return Response(serializer.data)


class AttendanceAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		attendances = Attendance.objects.all()
		serializer = AttendanceSerializer(attendances, many = True)
		return Response(serializer.data)

@csrf_exempt
@api_view(['GET', 'POST', 'PUT'])
def library_tag_category(self, request):
	if request.method == 'GET':
		files = LibraryTagCategory.objects.all()
		serializer = LibraryTagCategorySerializer(files, many = True)
		return Response(serializer.data)
	elif request.method == 'POST' or request.method == 'PUT':
		serializer = LibraryTagCategorySerializer(data = request.data)
		print(request.data)
		if serializer.is_valid():
			serializer.save()
			print("true valid")
			return Response(serializer.data, status = status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)



		org = Organization.objects.all()
		serializer = OrganizationsSerializer(org, many = True)
		return Response(serializer.data)

	elif request.method == 'POST':
		serializer = OrganizationsSerializer(data = request.DATA)
		if 	serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)



class NoteAPI(APIView):	
	def get(self, request, format = None):
		#file, serializer = None
		data = request.GET
		
		if data.get("id"):
			note = Note.objects.get(pk = int(data.get("id")))
			note.views += 1
			note.save()

			serializer = NoteSerializer(note, many = False, context = { 'request': request})		
		else:
			note = Note.objects.all().order_by('-id')
			serializer = NoteSerializer(note, many = True, context = { 'request': request})
		return Response(serializer.data)
	def post(self, request, format = None):
		data = request.data

		note = Note()
		if data['title'] and data['content']:			
			note.title = data['title']
			note.content = data['content']
			note.pub_date = timezone.now() + timezone.timedelta(hours=3)
			note.login = request.user
			note.save()

		serializer = NoteSerializer(note, many = False, context = { 'request': request})
		return Response(serializer.data)
	def put(self, request, format = None):
		data = request.data
		print('==== PUT ======')
		print(data)
		note = Note()
		serializer = NoteSerializer(note, many = False, context = { 'request': request})
		try:
			note = Note.objects.get(pk = data['id'])
			note.views = data['views']
			note.save()
			serializer = NoteSerializer(note, many = False, context = { 'request': request})
			return Response(serializer.data)
		except ObjectDoesNotExist:
			return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class FavoriteAPI(APIView):
	def get(self, request, format = None):
		favorites = Favorite.objects.all().order_by('-id')
		serializer = FavoriteSerializer(favorites, many = True, context = { 'request': request})
		return Response(serializer.data)
	def post(self, request, format = None):
		data = request.data
		print('=====', data)
		login = request.user
		type = data['type']
		note = Note.objects.get(pk = data['note'])

		try:
			favorite = Favorite.objects.get(login = login, type = type, note = note)
			favorite.delete()
		except ObjectDoesNotExist:
			favorite = Favorite()
			favorite.login = login
			favorite.type = type
			favorite.note = note
			favorite.save()
		serializer = FavoriteSerializer(favorite, context = { 'request': request})
		return Response(serializer.data)

class SettingsAPI(APIView):
	def get(self, request, format = None):
		serializer = SettingsSerializer(request.user.userprofile, many = False)
		return Response(serializer.data)
	def post(self, request, format = None):
		data = request.data
		serializer = SettingsSerializer(request.user.userprofile, data = data, partial = True)
		#if serializer.is_valid():
		serializer.save()
		return Response(serializer.data)
		#else:
		#	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	def put(self, request, format = None):
		data = request.data
		print(data)
		request.user.userprofile.theme = data['theme']
		request.user.userprofile.save()
		serializer = SettingsSerializer(request.user.userprofile, data = data, partial = True)
		#if serializer.is_valid():
		#serializer.save()
		return Response(data)
		#else:
		#	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TimetableAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		
		if data.get("day"):
			import datetime
			data_day = str(data.get("day"))
			today = datetime.datetime.today()
			day = int(data_day[0:2])
			month = int(data_day[2:4])
			year = today.year
			date = datetime.date(year, month, day)
			weekday = date.weekday() + 1
			weeknumber = date.isocalendar()[1] + settings.WEEK_SHIFT
			week = 1
			if weeknumber % 2 == 0:
				week = 2

			#Проверка номера подгруппы
			if not data.get("group"):
				group = request.user.userprofile.group
			else:
				group = int(data.get("group"))
			semester = settings.SEMESTER

			#Проверка на выходной в этот день			
			dayoff = NotStudyTime.objects.all().filter(start_date__lte = date).filter(end_date__gte = date)
			is_dayoff = False
			if len(dayoff):
				is_dayoff = True

			if is_dayoff == False:
				timetable = Timetable.objects.all().filter(week = week, day = weekday, semester = semester).filter(Q(group = 1) | Q(group = (group + 1))).order_by('time')
				serializer = TimetableSerializer(timetable, many = True, context = {'date': date})		
				return Response(serializer.data)
			else:
				return Response([]);

		elif data.get("week"):
			serializer = TimetableWeekSerializer(str(data.get("week")), request.user.userprofile.group, settings.SEMESTER)
			return Response(serializer.get_data())
		elif data.get("month"):
			serializer = TimetableMonthSerializer(int(data.get("month")), request.user.userprofile.group, settings.SEMESTER)
			return Response(serializer.get_shedule())

class TimetableManupulationsAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		method = data.get("method")

		if method == "homework":
			import datetime
			homework = data.get("homework")
			params = {
				"login": data.get("login"),
				"date": data.get("date"),
				"time": int(data.get("time")),
				"homework": homework
			}
			
			date = datetime.datetime.strptime(params['date'], '%d.%m.%Y')
			print(date)
			try:
				user = User.objects.get(username = params['login'])
				print(user)
				
			except ObjectDoesNotExist:
				return Response("Wrong params", status = status.HTTP_400_BAD_REQUEST)

			homework = Homework()
			homework.user = user
			homework.date = date
			homework.time = params['time']
			homework.homework = params['homework']
			homework.save()
			return Response("OK");
		return Response("Empty params string", status = status.HTTP_400_BAD_REQUEST)

class BlogPostAPI(APIView):
	def get(self, request, format = None):
		blog = BlogPost.objects.all().order_by('-id')
		serializer = BlogPostSerializer(blog, many = True)
		return Response(serializer.data)

class NotificationAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		login = data.get("login", "")

		if (login == ""):
			return Response("Empty login parameter", status = status.HTTP_400_BAD_REQUEST)

		user = User.objects.get(username = login)
		notifications = Notification.objects.all().filter(login = user, view = False).order_by('-id')
		serializer = NotificationSerializer(notifications, many = True)

		if (data.get("clear", "false") == "true"):
			for n in notifications:
				n.view = True
				n.save()

		return Response(serializer.data)

class EventAPI(APIView):
	def get(self, request, format = None):
		data = request.GET

		if data.get('login', False):
			login = data.get('login')
		else:
			login = request.user.username

		if data.get('id', False):
			events = Event.objects.get(id = int(data.get('id', 0)))
			serializer = EventSerializer(events, many = False, context = {'login': login})
		else:
			events = Event.objects.all()			
			serializer = EventSerializer(events, many = True, context = {'login': login})
		return Response(serializer.data)

class FeedAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		if data.get('login', False):
			#Общая лента
			pass
		else:
			feed = Feed.objects.order_by('-id')
			serializer = FeedSerializer(feed, many = True, context = {'login': request.user})
		return Response(serializer.data)