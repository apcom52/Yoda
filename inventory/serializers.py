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

class CardSerializer(serializers.ModelSerializer):
	class Meta():
		model = Card
		fields = ('id', 'title', 'icon', 'quality')