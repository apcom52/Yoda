from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin

# Create your models here.
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