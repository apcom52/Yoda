import datetime
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist 
from django.utils import dateformat
from django.conf import settings
from rest_framework import serializers
from .models import *
from .utils import TimetableControl

class TimetableSerializer(serializers.ModelSerializer):	
	title = serializers.CharField(source = 'lesson.title', allow_blank = True)
	time = serializers.SerializerMethodField()
	teacher = serializers.CharField(source = 'teacher.name', allow_blank = True)
	type_css = serializers.SerializerMethodField()
	type = serializers.SerializerMethodField()
	is_ended = serializers.SerializerMethodField()
	homework = serializers.SerializerMethodField()
	control = serializers.SerializerMethodField()
	is_canceled = serializers.SerializerMethodField();
	new_place = serializers.SerializerMethodField();

	def get_time(self, obj):
		times = ['8:20','10:00','11:45','14:00','15:45','17:20','18:55']
		return times[obj.time - 1]

	def get_type_css(self, obj):
		types = ['lection', 'practice', 'lab']
		return types[obj.lesson.type - 1]

	def get_type(self, obj):
		types = ['Лекция', 'Практика', 'Лабораторная работа']
		return types[obj.lesson.type - 1]

	def get_is_ended(self, obj):				
		today = datetime.datetime.today()
		date = self.context['date']

		if date > today.date():
			return False

		subject_time = obj.time
		if obj.double: subject_time += 1

		ttcontrol = TimetableControl(date)

		if date < today.date() or ttcontrol.timesumm > ttcontrol.gettimesummend(subject_time):
			return True
		return False

	def get_new_place(self, obj):
		date = self.context['date']
		date = date.strftime("%Y-%m-%d")
		try:
			newplace = NewPlace.objects.all().filter(date = date, time = obj.time).latest('id')
			return newplace.new_place
		except ObjectDoesNotExist:
			return False

	def get_homework(self, obj):
		date = self.context['date']
		time = obj.time

		try:
			homework = Homework.objects.all().filter(date = date, time = time)
			for hw in homework:
				return hw.homework
		except ObjectDoesNotExist:
			return False

	def get_control(self, obj):
		date = self.context['date']
		time = obj.time

		try:
			control = Control.objects.all().filter(date = date, time = time)
			for ctrl in control:
				if ctrl.info:
					return ctrl.info
				return True
		except ObjectDoesNotExist:
			return False

	def get_is_canceled(self, obj):
		date = self.context['date']
		time = obj.time

		try:
			canceled_list = CanceledLesson.objects.all().filter(date = date, time = time)
			if len(canceled_list):
				return True
			return False
		except ObjectDoesNotExist:
			return False


	class Meta:
		model = Timetable
		fields = (
			'title', 'time', 'place', 'teacher', 'type', 'type_css', 
			'is_ended', 'homework', 'control', 'is_canceled', 'new_place',
			'double',	'is_earlier',
		)

class TimetableWeekSerializer():
	date = None
	timetable = None

	def __init__(self, date, group, semester):
		data_day = date
		dt = datetime.datetime.strptime(data_day, '%d/%m/%Y')
		self.start = dt - datetime.timedelta(days=dt.weekday())
		self.end = self.start + datetime.timedelta(days=6)
		self.week_num = self.start.day#self.start.isocalendar()[1]
		self.week_type = 1
		if self.week_num % 2 == 0: 
			self.week_type = 2
		self.group = group
		self.semester = semester

	def get_data(self):
		self.timetable = []
		for i in range(1, 8):
			current_date = datetime.datetime.date(self.start + datetime.timedelta(days = i-1))
			# date = datetime.datetime.strftime(self.start + datetime.timedelta(days = i-1), "%d %B")
			tt = Timetable.objects.all().filter(semester = self.semester, week = self.week_type, day = i).filter(Q(group = 1) | Q(group = (self.group + 1))).order_by('time')
			serializer = TimetableSerializer(tt, many = True, context = {'date': current_date})
			today = False
			
			if current_date.day == datetime.datetime.today().day and current_date.month == datetime.datetime.today().month:
				today = True
			is_weekend = False
			if len(tt) < 1: 
				is_weekend = True

			self.timetable.append({
				'timetable': serializer.data,
				'date': dateformat.format(current_date, settings.DATE_FORMAT),
				'weekend': is_weekend,
				'today': today,
				})
		return self.timetable

class TimetableMonthSerializer():
	date = None
	timetable = None

	def __init__(self, month, group, semester):
		import datetime
		now = datetime.datetime.today()
		self.start_date = datetime.datetime(now.year, month, 1)
		self.end_date = datetime.datetime(now.year, month+1, 1) - datetime.timedelta(days = 1)
		self.group = group
		self.semester = semester

	def get_shedule(self):
		self.timetable = []
		import calendar
		calendar = calendar.Calendar(firstweekday = 0)
		day = datetime.timedelta(days = 1)
		while self.start_date <= self.end_date:
			week = self.start_date.isocalendar()[1]
			week_type = 1
			if week % 2 == 0:
				week_type = 2
			weekday = self.start_date.weekday() + 1
			print(week, week_type, weekday)
			timetable = Timetable.objects.all().filter(semester = self.semester, week = week_type, day = weekday, group = self.group)
			last = 0
			if len(timetable):
				first_lesson = timetable[0]
				last_lesson = timetable[len(timetable) - 1]
				# if last_lesson.double:
				# 	end_index = last_lesson.time + 1
				# print('END INDEX:', end_index)
				# last = self.get_end_time(end_index)				
				self.timetable.append({
					'date': self.start_date,
					'first': str(first_lesson),
					'last': str(len(timetable)),
					'weekend': False,
				})
			else:
				self.timetable.append({
					'date': self.start_date,
					'weekend': True,
				})
			self.start_date = self.start_date + day
		return self.timetable

	def get_start_time(self, index):
		array = [
			'8:20',	'10:00',	'11:45',
			'14:00',	'15:45',	'17:20',
			'18:55'
		]
		return array[index - 1]

	def get_end_time(self, index):
		array = [
			'9:50',	'11:30',	'13:15',
			'15:30',	'17:15',	'18:50',
			'20:25'
		]
		return array[index - 1]