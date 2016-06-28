from django.shortcuts import render

# Create your views here.
def index(request):
	return render(request, 'game.html', {
		'title': 'Ваше государство',
	})

def nations(request):
	return render(request, 'game_nations.html', {
		'title': 'Выбор государства',
	})