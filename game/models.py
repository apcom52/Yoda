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

	name = models.CharField('Название технологии', max_length = 128)
	sp = models.IntegerField('Количество очков науки', default = 50)
	icon = models.ImageField('Иконка технологии', upload_to='game/technologies/', blank = True)
	prev_technology = models.ForeignKey("self", blank = True, null = True)
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
	list_display = ('name', 'sp')
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