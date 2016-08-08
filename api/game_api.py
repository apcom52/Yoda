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
import datetime
import math
import json
import random

from game.models import *
from game.classes import *
from game.serializers import *

class TechnologiesList(APIView):
	def get(self, request, format = None):
		data = request.GET
		method = data.get("m", False)
		game = Game.objects.all().filter(user = request.user, is_completed = False).latest('id')

		if method == 'available_list':			
			available_techs = []
			completed_branches_list = UserTeach.objects.filter(game = game, completed = True)
			completed_branches = [t.technology for t in completed_branches_list]
			for branch in Technology.branches:
				branch_id = branch[0]
				current_tech = None
				for t in Technology.objects.all().filter(branch = branch_id):
					if not t in completed_branches:
						current_tech = t
						break
				if current_tech:
					available_techs.append(current_tech)		

			serializer = TechnologySerializer(available_techs, many = True)

			#Текущее исследование
			current = False
			try:
				current_tech = UserTeach.objects.filter(game = game, completed = False).latest('id')
				current = TechnologySerializer(current_tech.technology, many = False)
				current = current.data
				current["progress"] = 100 * game.science / current_tech.technology.sp
			except ObjectDoesNotExist:
				pass

			return Response({
				'available': serializer.data,
				'current': current,
			})
		elif method == 'start':
			id = data.get("id", False)
			if id:
				technology = Technology.objects.get(pk = int(id))
				game = Game.objects.filter(user = request.user, is_completed = False).latest('id')
				userteach = UserTeach()
				userteach.login = request.user
				userteach.game = game
				userteach.technology = technology
				userteach.date_start = datetime.datetime.now()
				userteach.save()
				return Response("ok");
		return Response("failed")


class BuildingsList(APIView):
	def get(self, request, format = None):
		data = request.GET
		method = data.get("m", False)
		game = Game.objects.all().filter(user = request.user, is_completed = False).latest('id')
		nation = game.nation
		print(nation)

		if method == 'available_list':
			buildings = []
			completed_branches_list = UserTeach.objects.filter(game = game, completed = True)
			builded = UserBuild.objects.filter(game = game, completed = True)
			completed_buildings = [b.building for b in builded]
			teached_buildings = []
			for branch in completed_branches_list:
				print(branch.technology.buildings.all())
				for build in branch.technology.buildings.all():
					if not build in completed_buildings:
						#Если здание является общим или эксклюзивным для данной страны, то добавляем его в список
						if build.nations_id:
							if build.nations_id == nation.id:
								buildings.append(build)
						else:
							buildings.append(build)	

			serializer = BuildingSerializer(buildings, many = True)
			return Response(serializer.data)
		elif method == 'build':
			building_id = data.get('id', False)
			game = Game.objects.all().filter(user = request.user, is_completed = False).latest('id')
			if building_id:
				building = Building.objects.get(pk = int(building_id))
				x = data.get('x', False)
				y = data.get('y', False)
				userbuild = UserBuild()
				userbuild.login = request.user
				userbuild.game = game
				userbuild.building = building
				userbuild.date_start = datetime.datetime.now()
				userbuild.x = x
				userbuild.y = y
				userbuild.save()

				return Response('ok')
			return Response('failed')
		return Response('failed')


	def getBuildingInfo(self, building):
		bonuses = []
		for bonus in BuildingBonus.objects.filter(building = building):
			bonuses.append({
				"value": bonus.value,
				"type": self.getBonusName(bonus.type)
			})
		for bonus in BuildingBonusModificator.objects.filter(building = building):
			bonuses.append({
				"value": bonus.value + "%",
				"type": self.getBonusName(bonus.type)
			})
		return {
			"title": building.name,
			"cost": building.pp,
			# "icon": building.icon,
			"bonus": bonuses,
		}

	def getBonusName(self, type):
		types = ["food", "production", "culture", "faith", "science", "happiness", "tourism", "gold"]
		return types[type - 1]

class DogmatAPI(APIView):
	def get(self, request, format = None):
		data = request.GET
		method = data.get("m", False)
		game = Game.objects.all().filter(user = request.user, is_completed = False).latest('id')
		my_dogmats = UserDogmat.objects.all().filter(game = game)
		if method == "list":
			level = int(data.get("level", 0))
			limit = 5 - level
			dogmats_list = Dogma.objects.all().filter(level = level).order_by('?')[:limit]
			serializer = DogmatSerializer(dogmats_list, many = True)
			return Response(serializer.data)
		return Response('failed')

class MapAPI(APIView):
	def get(self, request, format = None):
		from game.classes import Map

		data = request.GET
		method = data.get("m", False)

		if method == "generate":			
			gamemap = Map("RU")		
			game = Game.objects.get(user = request.user, is_completed = False)
			game.gmap = str(gamemap.generate())
			game.save()
			return Response(game.gmap)
		elif method == "get":
			game = Game.objects.get(user = request.user, is_completed = False)
			gmap = eval(game.gmap)

			#Получаем список всех зданий
			buildings = UserBuild.objects.filter(login = request.user, game = game)
			for b in buildings:
				progress = 1
				if b.completed == False:
					full_price = b.building.pp
					current_price = b.progress
					progress = 1.0 * current_price / full_price
				serializer = BuildingSerializer(b.building, many = False)
				(gmap[b.y][b.x])["building"] = serializer.data
				(gmap[b.y][b.x])["building"]["progress"] = progress
			return Response(gmap)
		elif method == "save":
			new_map = data.get("map", False)
			if new_map:
				game = Game.objects.get(user = request.user, is_completed = False)
			else:
				nation = data.get("nation", False)
				if nation:				
					country = Nation.objects.get(pk = int(nation))	
					print(country)
					gamemap = Map("RU")
					game = Game()
					game.nation = country
					mapobj = Map(country)
					gamemap = mapobj.generate()
					game.gmap = json.dumps(gamemap)
					game.save()
				return Response(gamemap.generate())
		else:
			return Response("failed")