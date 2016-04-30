import datetime
import pytz
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist 
from django.utils import dateformat
from django.conf import settings
from rest_framework import serializers
from .models import *
from user.serializers import UserSerializer
from timetable.utils import utc_to_local

class EventCommentSerializer(serializers.ModelSerializer):
	login = UserSerializer(many = False)
	class Meta:
		model = EventComment
		fields = (
			'login', 'comment', 'pub_date',
		)

class EventSerializer(serializers.ModelSerializer):	
	comments = serializers.SerializerMethodField();
	login = UserSerializer(many = False)
	date = serializers.SerializerMethodField();
	is_visit = serializers.SerializerMethodField();

	def get_comments(self, obj):
		comments_list = EventComment.objects.all().filter(event = obj).order_by('pub_date');
		serializer = EventCommentSerializer(comments_list, many = True)
		return serializer.data

	def get_date(self, obj):
		date = utc_to_local(obj.date)
		return date.strftime('%d.%m.%Y %H:%M')

	def get_is_visit(self, obj):
		login = self.context['login']
		user = User.objects.get(username = login)
		try:
			visit_status = UserVisitEvent.objects.get(login = user, event = obj)
			return visit_status.answer
		except ObjectDoesNotExist:
			return 0

	class Meta:
		model = Event
		fields = (
			'title', 'description', 'date', 'is_required', 'comments', 'login', 'is_visit',
		)

