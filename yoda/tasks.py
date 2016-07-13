from celery.task import periodic_task
from datetime import timedelta

@periodic_task(run_every = timedelta(seconds = 5))
def test():
	print('CELERY: ' + datetime.datetime.today())
	from django.contrib.auth.models import User
	from achievements.models import Notification
	user = User.objects.get(username = 'apcom52')
	nt = Notification()
	nt.login = user
	nt.type = 1
	nt.title = 'Тестовое уведомление'
	nt.text = 'Это уведомление было отправлено ' + datetime.datetime.now()
	nt.save()