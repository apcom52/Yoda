from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist 
from django.utils import dateformat
from django.conf import settings
from rest_framework import serializers
from .models import *
from user.serializers import UserSerializer
from timetable.utils import utc_to_local

import datetime
import pytz

class BuildingSerializer(serializers.ModelSerializer):
	bonus = serializers.SerializerMethodField()
	exclusive = serializers.SerializerMethodField()

	def get_icon(self, obj):
		if obj.icon:
			return obj.icon.url
		return ''

	def get_exclusive(self, obj):
		try: 
			if obj.nations:
				return True
		except ObjectDoesNotExist:
			return False

	def get_bonus(self, obj):
		bonuses = []
		for bonus in BuildingBonus.objects.filter(building = obj):
			bonuses.append({
				"value": bonus.value,
				"type": self.getBonusName(bonus.type)
			})
		for bonus in BuildingBonusModificator.objects.filter(building = obj):
			bonuses.append({
				"value": str(bonus.value) + "%",
				"type": self.getBonusName(bonus.type)
			})
		return bonuses

	def getBonusName(self, type):
		types = ["food", "production", "culture", "faith", "science", "happiness", "tourism", "gold"]
		return types[type - 1]


	class Meta:
		model = Building
		fields = (
			'id', 'name', 'pp', 'icon', 'wonder', 'bonus', 'sprite', 'exclusive'
		)

class TechnologySerializer(serializers.ModelSerializer):
	buildings = serializers.SerializerMethodField();

	def get_buildings(self, obj):
		buildings = []

		tech_buildings_list = obj.buildings.all()
		tech_upgrades_list = TechnologyBonus.objects.filter(technology = obj)

		for building in tech_buildings_list:
			serializer = BuildingSerializer(building, many = False)
			buildings.append(serializer.data)

		for bonus in tech_upgrades_list:
			buildings.append({
				"name": bonus.bonus,
				"is_bonus": True,
				"icon": "/media/game/icons/upgrade.png",
			})

		return buildings

	class Meta:
		model = Technology
		fields = (
			'id', 'name', 'sp', 'description', 'icon', 'branch', 'buildings'
		)
