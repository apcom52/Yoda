from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Event, EventAdmin)
admin.site.register(UserVisitEvent, UserVisitEventAdmin)
admin.site.register(EventComment, EventCommentAdmin)