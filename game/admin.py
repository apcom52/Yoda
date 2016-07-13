from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Map)
admin.site.register(Nation)
admin.site.register(Building, BuildingAdmin)
admin.site.register(Technology, TechnologyAdmin)
admin.site.register(Dogma, DogmaAdmin)
admin.site.register(Tooltip, TooltipAdmin)
admin.site.register(UserTeach, UserTeachAdmin)
admin.site.register(UserBuild, UserBuildAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(Step, StepAdmin)