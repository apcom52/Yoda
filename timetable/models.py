from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.conf import settings
from .utils import DTControl

# Create your models here.
class Lesson_Item(models.Model):
	semesters = ((1, 'Первый семестр'), (2, 'Второй семестр'),
		(3, 'Третий семестр'), (4, 'Четвертый семестр'),
		(5, 'Пятый семестр'), (6, 'Шестой семестр'),
		(7, 'Седьмой семестр'), (8, 'Восьмой семестр')
	)
	title = models.CharField('Название предмета', max_length = 64, unique = False)
	semester = models.IntegerField('Семестр', choices = semesters, default = 1)

	

	def __str__(self):
		return '%s (%s)' % (self.title, self.semester)

class Lesson_ItemAdmin(admin.ModelAdmin):
	list_display = ('title', 'semester')

class Lesson(models.Model):
	semesters = ((1, 'Первый семестр'), (2, 'Второй семестр'),
		(3, 'Третий семестр'), (4, 'Четвертый семестр'),
		(5, 'Пятый семестр'), (6, 'Шестой семестр'),
		(7, 'Седьмой семестр'), (8, 'Восьмой семестр')
	)
	types = ((1, 'Лекция'),	(2, 'Практика'), (3, 'Лабораторная работа'))
	
	title = models.CharField('Название предмета', max_length = 64, unique = False)
	semester = models.IntegerField('Семестр', choices = semesters, default = 1)
	type = models.IntegerField('Тип занятия', choices = types, default = 1)

	def __str__(self):
		return self.title + ' (' + self.types[self.type - 1][1] + ') ' + str(self.semester) + ' семестр'

class LessonAdmin(admin.ModelAdmin):	
	list_display = ('title', 'type', 'semester')

class Teacher(models.Model):
	semesters = ((1, 'Первый семестр'), (2, 'Второй семестр'),
		(3, 'Третий семестр'), (4, 'Четвертый семестр'),
		(5, 'Пятый семестр'), (6, 'Шестой семестр'),
		(7, 'Седьмой семестр'), (8, 'Восьмой семестр')
	)
	name = models.CharField('ФИО преподавателя', max_length = 128, unique = False)
	semester = models.IntegerField('Семестр', choices = semesters)
	lessons = models.ManyToManyField(Lesson, verbose_name=u"Предметы, которые ведет этот преподаватель")
	avatar = models.ImageField(upload_to='img/%Y/%m/%d/', verbose_name='Фотография преподавателя', default='img/2015/08/04/ufo.jpg')

	def __str__(self):
		return self.name + ' (' + self.semesters[self.semester - 1][1] + ')'

class TeacherAdmin(admin.ModelAdmin):	
	list_display = ('name', 'semester')
	filter_horizontal = ('lessons', )

class Timetable(models.Model):
	weeks = ((1, 'Нечетная неделя'), (2, 'Четная неделя'))
	days = (
		(1, 'Понедельник'), (2, 'Вторник'), (3, 'Среда'), 
		(4, 'Четверг'), (5, 'Пятница'), (6, 'Суббота'), 
	) 
	lesson_nums = (
		(1, '1 пара'), (2, '2 пара'), (3, '3 пара'), 
		(4, '4 пара'), (5, '5 пара'), (6, '6 пара'), 
		(7, '7 пара'), 
	)
	semesters = ((1, 'Первый семестр'), (2, 'Второй семестр'),
		(3, 'Третий семестр'), (4, 'Четвертый семестр'),
		(5, 'Пятый семестр'), (6, 'Шестой семестр'),
		(7, 'Седьмой семестр'), (8, 'Восьмой семестр')
	)
	groups = ((1, 'Общая пара'), (2, 'Первая подгруппа'), (3, 'Вторая подгруппа'))
	_semester = settings.SEMESTER

	teacher = models.ForeignKey('Teacher', to_field = 'id')
	lesson = models.ForeignKey('Lesson', to_field = 'id')
	group = models.IntegerField('Подгруппа', choices = groups, default = 0)
	semester = models.IntegerField('Семестр', choices = semesters, default = _semester)
	week = models.IntegerField('Неделя', choices = weeks, default = 1)
	day = models.IntegerField('День', choices = days, default = 1)
	time = models.IntegerField('Номер пары', choices = lesson_nums, default = 1)
	place = models.CharField('Аудитория', max_length = 16)
	double = models.BooleanField('Сдвоенная пара', default = False)
	is_earlier = models.BooleanField('Начнется раньше', default = False)

	def __str__(self):
		return '%s (%s / %s = %s %s %s)' % (self.lesson, self.teacher, self.group, self.week, self.day, self.time)

class TimetableAdmin(admin.ModelAdmin):	
	list_display = ('lesson', 'teacher', 'semester', 'week', 'day', 'time', 'group', 'place', 'double')
	list_filter = ('semester', 'week', 'day')
	search_fields = ('lesson__title',)

	def get_form(self, request, obj=None, **kwargs):
		semester = settings.SEMESTER
		form = super(TimetableAdmin, self).get_form(request, obj, **kwargs)
		form.base_fields['teacher'].queryset = Teacher.objects.filter(semester = semester)
		form.base_fields['lesson'].queryset = Lesson.objects.filter(semester = semester)
		return form

class Homework(models.Model):
	lesson_nums = (
		(1, '1 пара'), (2, '2 пара'), (3, '3 пара'), 
		(4, '4 пара'), (5, '5 пара'), (6, '6 пара'), 
		(7, '7 пара'), 
	)
	today = DTControl()

	user = models.ForeignKey(User)
	date = models.DateField('Дата (YYYY-MM-DD)')
	time = models.IntegerField('Номер пары', choices = lesson_nums, default = 1)
	homework = models.CharField('Домашнее задание', max_length = 1024)

	def __str__(self):
		return str(self.homework)

class HomeworkAdmin(admin.ModelAdmin):	
	fields = ('user', 'date', 'time', 'homework')
	list_display = ('date', 'time', 'homework', 'user')

class Control(models.Model):
	lesson_nums = (
		(1, '1 пара'), (2, '2 пара'), (3, '3 пара'), 
		(4, '4 пара'), (5, '5 пара'), (6, '6 пара'), 
		(7, '7 пара'), 
	)
	user = models.ForeignKey(User)
	date = models.DateField('Дата (YYYY-MM-DD)')
	time = models.IntegerField('Номер пары', choices = lesson_nums, default = 1)
	info = models.CharField('Подробности', max_length = 1024)

	def __str__(self):
		return str(self.date) + ' ' + str(self.time)

class ControlAdmin(admin.ModelAdmin):
	list_display = ('date', 'time', 'user', 'info')

class NewPlace(models.Model):
	lesson_nums = (
		(1, '1 пара'), (2, '2 пара'), (3, '3 пара'), 
		(4, '4 пара'), (5, '5 пара'), (6, '6 пара'), 
		(7, '7 пара'), 
	)
	user = models.ForeignKey(User)
	date = models.DateField('Дата (YYYY-MM-DD)')
	time = models.IntegerField('Номер пары', choices = lesson_nums, default = 1)
	new_place = models.CharField('Подробности', max_length = 1024)

	def __str__(self):
		return str(self.date) + ' ' + str(self.time)

class NewPlaceAdmin(admin.ModelAdmin):
	list_display = ('date', 'time', 'user', 'new_place')

class TeacherTimetable(models.Model):
	weeks = ((1, 'Нечетная неделя'), (2, 'Четная неделя'))
	days = (
		(1, 'Понедельник'), (2, 'Вторник'), (3, 'Среда'), 
		(4, 'Четверг'), (5, 'Пятница'), (6, 'Суббота'), 
	) 
	lesson_nums = (
		(1, '1 пара'), (2, '2 пара'), (3, '3 пара'), 
		(4, '4 пара'), (5, '5 пара'), (6, '6 пара'), 
		(7, '7 пара'), 
	)
	semesters = ((1, 'Первый семестр'), (2, 'Второй семестр'),
		(3, 'Третий семестр'), (4, 'Четвертый семестр'),
		(5, 'Пятый семестр'), (6, 'Шестой семестр'),
		(7, 'Седьмой семестр'), (8, 'Восьмой семестр')
	)
	types = ((1, 'Лекция'),	(2, 'Практика'), (3, 'Лабораторная работа'))

	teacher = models.ForeignKey('Teacher', to_field = 'id')
	lesson = models.CharField('Предмет', max_length = 128)
	group = models.CharField('Группа', max_length = 10)
	semester = models.IntegerField('Семестр', choices = semesters, default = 1)
	week = models.IntegerField('Неделя', choices = weeks, default = 1)
	day = models.IntegerField('День', choices = days, default = 1)
	time = models.IntegerField('Номер пары', choices = lesson_nums, default = 1)
	type = models.IntegerField('Тип занятия', choices = types, default = 1)
	place = models.CharField('Аудитория', max_length = 16)
	double = models.BooleanField('Сдвоенная пара', default = False)	

	def __str__(self):
		return '%s - %s (%s)' % (self.teacher.name, self.lesson, self.group)

class TeacherTimetableAdmin(admin.ModelAdmin):
	list_display = ('teacher', 'group', 'lesson', 'week', 'day', 'time', 'type')

class NotStudyTime(models.Model):
	start_date = models.DateField('От', blank = False)
	end_date = models.DateField('До', blank = False)
	info = models.CharField('Подробности', blank = True, null = True, max_length = 256)

class NotStudyTimeAdmin(admin.ModelAdmin):
	list_display = ('info', 'start_date', 'end_date')

class TransferredLesson(models.Model):
	lesson_nums = (
		(1, '1 пара'), (2, '2 пара'), (3, '3 пара'), 
		(4, '4 пара'), (5, '5 пара'), (6, '6 пара'), 
		(7, '7 пара'), 
	)
	login = models.ForeignKey(User)
	lesson = models.ForeignKey(Timetable)
	last_date = models.DateField('Старая дата')
	last_time = models.IntegerField('Старый номер пары', choices = lesson_nums)
	new_date = models.DateField('Новая дата')
	new_time = models.IntegerField('Новый номер пары', choices = lesson_nums)
	new_place = models.CharField('Аудитория', max_length = 16)

	def __str__(self):
		return '%s -> %s (%s - %s)' % (self.last_date, self.new_date, self.new_time, self.new_place)

class TransferredLessonAdmin(admin.ModelAdmin):
	list_display = ('last_date', 'new_date', 'last_time', 'new_time', 'login')

class CanceledLesson(models.Model):
	lesson_nums = (
		(1, '1 пара'), (2, '2 пара'), (3, '3 пара'), 
		(4, '4 пара'), (5, '5 пара'), (6, '6 пара'), 
		(7, '7 пара'), 
	)
	login = models.ForeignKey(User)
	date = models.DateField('Дата')
	time = models.IntegerField('Номер пары', choices = lesson_nums)

class CanceledLessonAdmin(admin.ModelAdmin):
	list_display = ('date', 'time', 'login')