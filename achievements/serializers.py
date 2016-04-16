from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from .models import *
from user.serializers import *

class NotificationSerializer(serializers.ModelSerializer):	
	icon = serializers.SerializerMethodField()

	def get_icon(self, obj):
		icons = ["standart", "gift", "achievement", "system", "levelup", "event", "beta"]
		return "/media/notifications/" + icons[obj.type - 1] + ".png"

	class Meta:
		model = Notification
		fields = (
			'title',	'text',	'icon', 'link',	'pub_date',
		)