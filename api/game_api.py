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

from game.models import *
from game.classes import *
from game.serializers import *

class TechnologiesList(APIView):
	def get(self, request, format = None):
		data = request.GET
		method = data.get("m", False)

		if method == 'available_list':			
			available_techs = []
			completed_branches_list = UserTeach.objects.filter(login = request.user, completed = True)
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
				current_tech = UserTeach.objects.filter(login = request.user, completed = False).latest('id')
				current = TechnologySerializer(current_tech.technology, many = False)
				current = current.data
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

		if method == 'available_list':
			buildings = []
			completed_branches_list = UserTeach.objects.filter(login = request.user, completed = True)
			builded = UserBuild.objects.filter(login = request.user, completed = True)
			teached_buildings = []
			for branch in completed_branches_list:
				for build in branch.technology.buildings.all():
					# if not build in builded:
					buildings.append(
						self.getBuildingInfo(build)
					)
			return Response(buildings)
		elif method == 'build':
			building_id = data.get('id', False)
			if building_id:
				building = Building.objects.get(pk = int(building_id))
				x = data.get('x', False)
				y = data.get('y', False)
				userbuild = UserBuild()
				userbuild.login = request.user
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




		available_techs = []
		completed_branches_list = UserTeach.objects.filter(login = request.user, completed = True)
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

		available_response = []
		for tech in available_techs:
			available_response.append({
				'name': tech.name,
				'sp': tech.sp,
			})
		return Response({
			'available': available_response,
			})

class GenerateMap(APIView):
	def get(self, request, format = None):
		map = Map("RU")
		return Response(map.generate())