from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin

# Create your models here.
class Nation(models.Model):
	class Meta():
		verbose_name = 'Нация'
		verbose_name_plural = 'Нации'
	title = models.CharField('Название нации', max_length = 32)
	bonus = models.TextField('Бонус')

	def __str__(self):
		return self.title

class Game(models.Model):
	class Meta():
		verbose_name = 'Игра'
		verbose_name_plural = 'Игры'
	user = models.ForeignKey(User, verbose_name = u'Пользователь')
	nation = models.ForeignKey(Nation, verbose_name = u'Нация')
	is_completed = models.BooleanField('Игра завершилась', default = False)
	gmap = models.TextField('Карта игры', default = "[]")
	science = models.FloatField('Очки науки', default = 0)
	production = models.FloatField('Очки производства', default = 0)
	food = models.FloatField('Очки еды', default = 0)
	gold = models.FloatField('Очки золота', default = 0)
	culture = models.FloatField('Очки культуры', default = 0)
	faith = models.FloatField('Очки веры', default = 0)
	tourism = models.FloatField('Очки туризма', default = 0)
	happiness = models.FloatField('Очки настроения', default = 0)

	def __str__(self):
		return '%s (%s)' % (self.user.first_name + ' ' + self.user.last_name, self.nation)

class GameAdmin(admin.ModelAdmin):
	list_display = ('user', 'nation', 'is_completed')

class Step(models.Model):
	class Meta():
		verbose_name = 'Ход'
		verbose_name_plural = 'Ходы'
	step = models.IntegerField('Номер хода')
	game =  models.ForeignKey(Game, verbose_name = u'Номер игры')
	date = models.DateTimeField('Дата и время хода')
	science = models.FloatField('Очки науки за ход', default = 0)
	production = models.FloatField('Очки производства за ход', default = 0)
	food = models.FloatField('Очки еды за ход', default = 0)
	gold = models.FloatField('Очки золота за ход', default = 0)
	culture = models.FloatField('Очки культуры за ход', default = 0)
	faith = models.FloatField('Очки веры за ход', default = 0)
	tourism = models.FloatField('Очки туризма за ход', default = 0)
	happiness = models.FloatField('Очки настроения за ход', default = 0)

	def __str__(self):
		return '#%s %s' % (self.step, self.game)

class StepAdmin(admin.ModelAdmin):
	list_display = ('step', 'game', 'date')

class Map(models.Model):
	class Meta():
		verbose_name = 'Карта'
		verbose_name_plural = 'Карты'

	login = models.OneToOneField(User)
	map = models.TextField('Местность')
	resources = models.TextField('Карта ресурсов')
	visible_map = models.TextField('Карта видимости')
	buildings_map = models.TextField('Карта строений')
	last_update = models.DateTimeField('Дата последнего обновления информации', auto_now = True)

	def __str__(self):
		return self.login.username


class Building(models.Model):
	class Meta():
		verbose_name = 'Здание'
		verbose_name_plural = 'Здания'

	name = models.CharField('Название здания', max_length = 128)
	pp = models.IntegerField('Количество очков производства', default = 50)
	icon = models.ImageField('Иконка здания', upload_to='game/buildings/', blank = True)
	nations = models.ForeignKey(Nation, blank = True, null = True)
	sprite = models.CharField('Имя спрайта', max_length = 32, blank = True)
	wonder = models.BooleanField('Чудо света', default = False)

	def __str__(self):
		return self.name

class BuildingBonus(models.Model):
	bonus_types = (
		(1, 'Еда'),
		(2, 'Производство'),
		(3, 'Культура'),
		(4, 'Вера'),
		(5, 'Наука'),
		(6, 'Настроение'),
		(7, 'Туризм'),
		(8, 'Золото'),
	)

	type = models.IntegerField('Тип бонуса', choices = bonus_types)
	value = models.IntegerField('Значение', default = 0)
	building = models.ForeignKey(Building)

	def __str__(self):
		return self.bonus_types[self.type - 1][1] + " +" + str(self.value)

class BuildingBonusModificator(models.Model):
	bonus_types = (
		(1, 'Еда'),
		(2, 'Производство'),
		(3, 'Культура'),
		(4, 'Вера'),
		(5, 'Наука'),
		(6, 'Настроение'),
		(7, 'Туризм'),
		(8, 'Золото'),
	)

	type = models.IntegerField('Тип бонуса', choices = bonus_types)
	value = models.FloatField('Значение', default = 0)
	building = models.ForeignKey(Building)

	def __str__(self):
		return self.bonus_types[self.type - 1][1] + " +" + str(self.value) + "%"



class BuildingBonusInline(admin.StackedInline):
	model = BuildingBonus
	extra = 1

class BuildingBonusModInline(admin.StackedInline):
	model = BuildingBonusModificator
	extra = 1

class BuildingAdmin(admin.ModelAdmin):
	inlines = (BuildingBonusInline, BuildingBonusModInline)
	list_display = ('name', 'pp')


class Technology(models.Model):
	class Meta():
		verbose_name = 'Технология'
		verbose_name_plural = 'Технологии'

	branches = (
		(1, 'Ветка культуры'),
		(2, 'Ветка производства'),
		(3, 'Ветка веры'),
		(4, 'Ветка еды'),
		(5, 'Ветка золота'),
	)

	name = models.CharField('Название технологии', max_length = 128)
	sp = models.IntegerField('Количество очков науки', default = 50)
	description = models.TextField('Описание', blank = True, null = True)
	icon = models.ImageField('Иконка технологии', upload_to='game/technologies/', blank = True)
	branch = models.IntegerField('Ветвь исследования', choices = branches, blank = True, null = True)
	next_technology = models.ForeignKey("self", blank = True, null = True)
	buildings = models.ManyToManyField(Building, verbose_name = u'Здания', blank = True)

	def __str__(self):
		return self.name

class TechnologyBonus(models.Model):
	technology = models.ForeignKey(Technology)
	bonus = models.CharField("Бонус технологии", max_length = 128)

class TechnologyBonusInline(admin.StackedInline):
	model = TechnologyBonus
	extra = 1

class TechnologyAdmin(admin.ModelAdmin):
	inlines = (TechnologyBonusInline,)
	list_display = ('name', 'sp', 'branch')
	filter_horizontal = ('buildings',)

class Dogma(models.Model):
	class Meta():
		verbose_name = 'Догмат'
		verbose_name_plural = 'Догматы'

	levels = (
		(1, 'Первый уровень'),
		(2, 'Второй уровень'),
		(3, 'Третий уровень'),
	)

	content = models.TextField('Содержимое догмата')
	level = models.IntegerField('Уровень догмата', choices = levels, default = 1)

	def __str__(self):
		return self.content

class DogmaAdmin(admin.ModelAdmin):
	list_display = ('id', 'content', 'level')

class Tooltip(models.Model):
	class Meta():
		verbose_name = 'Подсказка'
		verbose_name_plural = 'Подсказки'

	tooltip = models.CharField('Подсказка', max_length = 256)

class TooltipAdmin(admin.ModelAdmin):
	list_display = ('id', 'tooltip')

class UserTeach(models.Model):
	class Meta():
		verbose_name = 'Исследование игрока'
		verbose_name_plural = 'Исследования игроков'

	login = models.ForeignKey(User, verbose_name = 'Пользователь')
	game = models.ForeignKey(Game, verbose_name = 'Игра')
	technology = models.ForeignKey(Technology, verbose_name = 'Технология')
	progress = models.FloatField('Прогресс исследования', default = 0, blank = True, null = True)
	date_start = models.DateTimeField('Дата начала изучения')
	date_end = models.DateTimeField('Дата окончания изучения', blank = True, null = True)
	completed = models.BooleanField('Технология изучена', default = False)

	def __str__(self):
		return '%s -> %s' % (self.login, self.technology)

class UserTeachAdmin(admin.ModelAdmin):
	list_display = ('login', 'technology', 'date_start', 'progress', 'completed')

class UserBuild(models.Model):
	class Meta():
		verbose_name = 'Постройка игрока'
		verbose_name_plural = 'Постройки игроков'

	login = models.ForeignKey(User, verbose_name = 'Пользователь')
	building = models.ForeignKey(Building, verbose_name = 'Постройка')
	progress = models.FloatField('Прогресс постройки', default = 0, blank = True, null = True)
	date_start = models.DateTimeField('Дата начала постройки')
	date_end = models.DateTimeField('Дата окончания постройки', blank = True, null = True)
	completed = models.BooleanField('Здание построено', default = False)
	x = models.IntegerField('Координата Х', default = 1)
	y = models.IntegerField('Координата Y', default = 1)

class UserBuildAdmin(admin.ModelAdmin):
	list_display = ('login', 'building', 'date_start', 'progress', 'completed')