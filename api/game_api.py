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

from game.models import *
from game.classes import *

class TechnologiesList(APIView):
	def get(self, request, format = None):
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