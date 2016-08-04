from django.core.exceptions import ObjectDoesNotExist
from .models import *
import random

class Empire():
	PLAIN = "plain"
	SAND = "sand"
	SEA = "sea"
	MOUNTAIN = "mountain"

	RESOURCE_STONE = "stone";
	RESOURCE_WOOD = "wood";
	RESOURCE_SANDS = "sands";
	RESOURCE_IRON = "iron";
	RESOURCE_CARBON = "carbon";
	RESOURCE_OIL = "oil";
	RESOURCE_URAN = "uran";

	RESOURCE_WHEAT = "wheat";
	RESOURCE_GRAPES = "grapes";
	RESOURCE_CITRUS = "citrus";

	BUILDING_CASTLE1 = "castle1";

	STONE_RESOURCE_CHANCE = {
		"from": 0,
		"to": 0.2
	}

	SAND_RESOURCE_CHANCE = {
		"from": 0.2,
		"to": 0.38
	}

	WOOD_RESOURCE_CHANCE = {
		"from": 0.38,
		"to": 0.54
	}

	IRON_RESOURCE_CHANCE = {
		"from": 0.54,
		"to": 0.67
	}

	CARBON_RESOURCE_CHANCE = {
		"from": 0.67,
		"to": 0.78
	}

	ALUMINIUM_RESOURCE_CHANCE = {
		"from": 0.78,
		"to": 0.87
	}

	OIL_RESOURCE_CHANCE = {
		"from": 0.87,
		"to": 0.95
	}

	URAN_RESOURCE_CHANCE = {
		"from": 0.95,
		"to": 1
	}

	GRAPES_RESOURCE_CHANCE = {
		"from": 0,
		"to": 0.15
	}

	CITRUS_RESOURCE_CHANCE = {
		"from": 0.15,
		"to": 0.31
	}

	BANANES_RESOURCE_CHANCE = {
		"from": 0.31,
		"to": 0.62
	}

	COTTON_RESOURCE_CHANCE = {
		"from": 0.62,
		"to": 0.8
	}

	WHEAT_RESOURCE_CHANCE = {
		"from": 0.8,
		"to": 1
	}

	RUSSIA = 1
	USA = 2
	CHINA = 3
	JAPAN = 4
	ITALY = 5
	FRANCE = 6
	UK = 7
	THAILAND = 8
	INDIA = 9
	BRAZIL = 10
	GERMANY = 11
	SWEDEN = 12
	SPAIN = 13
	ISRAEL = 14
	AUSTRALIA = 15

	#Спецспособности стран
	
	# Россия:
	# +25% к добыче всех ресурсов
	RUSSIA_POWER = 1.25

	# США:
	# +10% к науке
	# +1 к науке за ратушу, стоящую рядом с горой
	USA_POWER = 1.1
	USA_CASTLE_SC_BONUS = 1

	# Китай:
	# +10% к производству
	# Шанс в 50% после строительства здания получить 1-2 очка веры, производства или науки
	CHINA_POWER = 1.1
	CHINA_BONUS_CHANCE = 0.5

	# Франция
	# Шанс в 40%, что возместит 50% стоимости здания золотом
	FRANCE_POWER_CHANCE = 0.4
	FRANCE_POWER_BONUS = 0.5


class Map():
	cells = [[0 for x in range(32)] for y in range(32)]
	width = 32
	height = 32

	def __init__(self, nation):
		if nation:
			self.nation = nation

	def get(self, game):
		self.cells = eval(game.gmap)

	def generate(self):
		import random
		cells = self.cells

		for i in range(0, self.height):
			for j in range(0, self.width):
				type, sprite = "", ""

				if i == 0 and j == 0:
					type = self.getRandomCell()
				else:
					if i == 0:
						rnd = random.random()
						if (rnd <= 0.15): type = cells[i][j-1]["type"]
						else: type = self.getRandomCell()
					else:
						if (j == 0):
							if (cells[i-1][j]["type"] == cells[i-1][j+1]["type"]):
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i-1][j]["type"]
								else: type = self.getRandomCell();
							else:
								rnd = random.random();
								if (rnd <= 0.15): type = cells[i-1][j]["type"];
								elif (rnd > 0.15 and rnd <= 0.3): type = cells[i-1][j+1]["type"];
								else: type = self.getRandomCell();
						elif (j == self.width - 1):
							if (cells[i][j-1]["type"] == cells[i-1][j-1]["type"] == cells[i-1][j]["type"]):
								rnd = random.random()
								if (rnd <= 0.45): type = cells[i-1][j]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i][j-1]["type"] == cells[i-1][j-1]["type"]) != cells[i-1][j]["type"]):
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i][j-1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i-1][j]["type"]
								else: type = self.getRandomCell()
							elif (cells[i][j-1]["type"] != (cells[i-1][j-1]["type"] == cells[i-1][j]["type"])):
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i-1][j-1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i][j-1]["type"]
								else: type = self.getRandomCell()
							elif (cells[i-1][j-1]["type"] != (cells[i][j-1]["type"] == cells[i-1][j]["type"])):
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i-1][j]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i-1][j-1]["type"]
								else: type = self.getRandomCell()
							else:
								rnd = random.random();
								if (rnd <= 0.15): type = cells[i][j-1]["type"];
								elif (rnd > 0.15 and rnd <= 0.3): type = cells[i-1][j-1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i-1][j]["type"]
								else: type = self.getRandomCell()							
						else: 
							if (cells[i][j-1]["type"] == cells[i-1][j-1]["type"] == cells[i-1][j]["type"] == cells[i-1][j+1]["type"]): 
								rnd = random.random()
								if (rnd <= 0.6): type = cells[i-1][j]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i-1][j-1]["type"] == cells[i][j-1]["type"] == cells[i-1][j]["type"]) != cells[i-1][j+1]["type"]): 
								rnd = random.random()
								if (rnd <= 0.45): type = cells[i-1][j]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j+1]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i][j-1]["type"] == cells[i-1][j+1]["type"] == cells[i-1][j]["type"]) != cells[i-1][j-1]["type"]): 
								rnd = random.random()
								if (rnd <= 0.45): type = cells[i-1][j]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j-1]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i-1][j-1]["type"] == cells[i-1][j+1]["type"] == cells[i-1][j]["type"]) != cells[i][j-1]["type"]): 
								rnd = random.random()
								if (rnd <= 0.45): type = cells[i-1][j]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i][j-1]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i-1][j-1]["type"] == cells[i-1][j+1]["type"] == cells[i][j-1]["type"]) != cells[i-1][j]["type"]): 
								rnd = random.random()
								if (rnd <= 0.45): type = cells[i-1][j-1]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j]["type"]
								else: type = self.getRandomCell();
							elif ((cells[i-1][j]["type"] == cells[i-1][j+1]["type"]) != cells[i][j-1]["type"] != cells[i-1][j-1]["type"]): 
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i-1][j+1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i][j-1]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j-1]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i][j-1]["type"] == cells[i-1][j-1]["type"]) != cells[i-1][j]["type"] != cells[i-1][j+1]["type"]): 
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i-1][j-1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i-1][j]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j+1]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i-1][j-1]["type"] == cells[i-1][j]["type"]) != cells[i][j-1]["type"] != cells[i-1][j+1]["type"]): 
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i-1][j-1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i][j-1]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j+1]["type"]
								else: type = self.getRandomCell()
							elif ((cells[i][j-1]["type"] == cells[i-1][j+1]["type"]) != cells[i-1][j-1]["type"] != cells[i-1][j]["type"]): 
								rnd = random.random()
								if (rnd <= 0.3): type = cells[i-1][j+1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i-1][j-1]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j]["type"]
								else: type = self.getRandomCell()
							else: 
								rnd = random.random()
								if (rnd <= 0.15): type = cells[i][j-1]["type"]
								elif (rnd > 0.15 and rnd <= 0.3): type = cells[i-1][j-1]["type"]
								elif (rnd > 0.3 and rnd <= 0.45): type = cells[i-1][j]["type"]
								elif (rnd > 0.45 and rnd <= 0.6): type = cells[i-1][j+1]["type"]
								else: type = self.getRandomCell()	

				food = 0
				production = 0
				culture = 0
				faith = 0
				science = 0
				tourism = 0
				happiness = 0
				gold = 0

				sprite = type

				if type == Empire.PLAIN:
					food += 1

				if type == Empire.SAND:
					faith += 1

				if type == Empire.SEA:
					food += 1

				if type == Empire.MOUNTAIN:
					production += 1
					science += 1

				# Назначаем ресурсы
				# Вероятность стратегического ресурса - 17%
				# Редкого (рудник) - 8% и плантации - 9%
				hasResource = random.random()
				resource = ""
				if hasResource <= 0.25:
					# Шансы появления ресурсов:
					# Камень	20%
					# Песок		18%
					# Лес		16%
					# Железо 	13%
					# Уголь		11%
					# Алюминий 	9%
					# Нефть		8%
					# Уран		5%
					resourceRnd = random.random()
					if resourceRnd > Empire.STONE_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.STONE_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN, Empire.SAND):
							resource = Empire.RESOURCE_STONE
							production += 1
							faith = 0
							food = 0
					elif resourceRnd > Empire.WOOD_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.WOOD_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN,):
							resource = Empire.RESOURCE_WOOD
							production += 1
							faith = 0
							food = 1
					elif resourceRnd > Empire.IRON_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.IRON_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN, Empire.SAND):
							resource = Empire.RESOURCE_IRON
							production += 1
							faith = 0
							food = 0
					elif resourceRnd > Empire.CARBON_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.CARBON_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN,):
							resource = Empire.RESOURCE_CARBON
							production += 1
							faith = 0
							food = 0
					elif resourceRnd > Empire.OIL_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.OIL_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN, Empire.SEA):
							resource = Empire.RESOURCE_OIL
							production += 1
							faith = 0
							food = 0
					elif resourceRnd > Empire.URAN_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.URAN_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN, Empire.SAND):
							resource = Empire.RESOURCE_URAN
							production += 1
							faith = 0
							food = 0
					elif resourceRnd > Empire.SAND_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.SAND_RESOURCE_CHANCE["to"]:
						if type in (Empire.SAND,):
							resource = Empire.RESOURCE_SANDS
							production += 1
							faith = 0
							food = 0
				elif hasResource > 0.25 and hasResource <= 0.34:
					resourceRnd = random.random()
					if resourceRnd > Empire.WHEAT_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.WHEAT_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN,):
							resource = Empire.RESOURCE_WHEAT
							production = 0
							food = 2
					elif resourceRnd > Empire.GRAPES_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.GRAPES_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN,):
							resource = Empire.RESOURCE_GRAPES
							production = 0
							food = 2
					elif resourceRnd > Empire.CITRUS_RESOURCE_CHANCE["from"] and resourceRnd <= Empire.CITRUS_RESOURCE_CHANCE["to"]:
						if type in (Empire.PLAIN,):
							resource = Empire.RESOURCE_CITRUS
							production = 0
							food = 2

				
				cells[i][j] = {
					'type': type,
					'sprite': sprite,
					'resource': resource,
					'building': '',
					'visible': False,
					'values': {
						'food': food,
						'production': production,
						'culture': culture,
						'faith': faith,
						'science': science,
						'tourism': tourism,
						'happiness': happiness,
						'gold': gold,
					},
					'position': {
						'x': j,
						'y': i,
					}
				}

		# Определяем стартовую позицию (карта 5х5)
		start_x, start_y = (random.choice(range(5, 25)), random.choice(range(5, 25)))
		while cells[start_y][start_x]["type"] in (Empire.SEA, Empire.MOUNTAIN):
			start_x, start_y = (random.choice(range(5, 25)), random.choice(range(5, 25)))

		for i in range(start_y - 3, start_y + 2):
			for j in range(start_x - 3, start_x + 2):
				cells[i][j]["visible"] = True
		self.cells = cells
		return self.cells

	def getRandomCell(self):
		import random
		rnd = random.random()
		if rnd <= 0.5: return Empire.PLAIN
		elif rnd > 0.5 and rnd <= 0.7: return Empire.SAND
		elif rnd > 0.75 and rnd <= 0.93: return Empire.SEA
		else: return Empire.MOUNTAIN

	def getNeighbour(self, x, y):
		cells = self.cells
		nbs = []
		coords = []

		if x == 0 and y == 0:
			coords = [[0, 1], [1, 0], [1, 1]]
		elif x == 31 and y == 31:
			coords = [[30, 30], [30, 31], [31, 30]]
		elif x == 31 and y == 0:
			coords = [[0, 30], [1, 30], [1, 31]]
		elif x == 0 and y == 31:
			coords = [[30, 0], [30, 1], [31, 1]]
		else:
			if x == 0:
				coords = [[y-1, x], [y-1, x+1], [y, x+1], [y+1, x], [y+1, x+1]]
			elif x == 31:
				coords = [[y-1, x-1], [y-1, x], [y, x-1], [y+1, x-1], [y+1, x]]
			elif y == 0:
				coords = [[y, x-1], [y, x+1], [y+1, x-1], [y+1, x], [y+1, x+1]]
			elif y == 31:
				coords = [[y-1, x-1], [y-1, x], [y-1, x+1], [y, x-1], [y, x+1]]
			else:
				coords = [[y-1, x-1], [y-1, x], [y-1, x+1], [y, x-1], [y, x+1], [y+1, x-1], [y+1, x], [y+1, x+1]]

		for c in coords:
			if cells[c[0]][c[1]]['type'] in (Empire.MOUNTAIN, Empire.SEA):
				nbs.append(cells[c[0]][c[1]]['type'])
		return nbs

class GameManager():
	def __init__(self):
		pass

	def check(self):
		from datetime import datetime, timezone
		from django.utils import timezone
		from timetable.utils import utc_to_local
		now = timezone.now()

		actives_games = Game.objects.all().filter(is_completed = False)
		for game in actives_games:
			last_step = Step.objects.filter(game = game).latest('id')
			print(last_step)
			step_time = last_step.date
			time_delta = now - step_time
			print(time_delta)

			delta_hours = (time_delta.seconds) // 3600
			print(delta_hours)
			if (delta_hours >= 1):
				for i in range(0, delta_hours):
					print('шаг #', i)
					self.step(game)

	def get_stats(self, game):
		science_pt = 0
		production_pt = 0
		faith_pt = 0
		gold_pt = 0

		castle = UserBuild.objects.get(game = game, building__name = "Ратуша")
		mapManager = Map(game.nation)
		gmap = mapManager.get(game)
		castle_near = mapManager.getNeighbour(castle.x, castle.y)

		buildings_q = UserBuild.objects.filter(game = game, completed = True)
		buildings = [b.building for b in buildings_q]

		#Считаем очки производства
		prod_bonuses = BuildingBonus.objects.filter(type = 2, building__in = buildings)

		production_pt += 1 * (game.castle_level - 1) #Уровень ратуши
		for p in prod_bonuses:
			production_pt += p.value
		if game.nation.id == Empire.SPAIN:
			production_pt += game.castle_level

		# Если ратуша стоит рядом с горой
		if Empire.MOUNTAIN in castle_near:
			production_pt += 1
			if game.nation.id == Empire.SPAIN:
				production_pt += 1

		prod_mods = BuildingBonusModificator.objects.filter(type = 2, building__in = buildings)
		for p in prod_mods:
			production_pt *= 1 + p.value / 100
		if game.nation.id == Empire.CHINA:
			production_pt *= Empire.CHINA_POWER

		#Считаем очки веры
		faith_bonuses = BuildingBonus.objects.filter(type = 4, building__in = buildings)

		faith_pt += 1 * (game.castle_level - 1) #Уровень ратуши
		if game.nation.id == Empire.SPAIN:
			faith_pt += game.castle_level

		for f in faith_bonuses:
			faith_pt += f.value
		faith_mods = BuildingBonusModificator.objects.filter(type = 4, building__in = buildings)
		for f in faith_mods:
			faith_pt *= 1 + f.value / 100

		#Считаем очки золота
		gold_bonuses = BuildingBonus.objects.filter(type = 8, building__in = buildings)

		gold_pt += 5 * (game.castle_level - 1) #+5 золота за каждый уровень ратуши
		if game.nation.id == Empire.SPAIN:
			gold_pt += 5 * game.castle_level

		for g in gold_bonuses:
			gold_pt += g.value
		gold_mods = BuildingBonusModificator.objects.filter(type = 8, building__in = buildings)
		for g in gold_mods:
			gold_pt *= 1 + g.value / 100

		#Считаем очки науки
		science_bonuses = BuildingBonus.objects.filter(type = 5, building__in = buildings)

		science_pt += 1 * (game.castle_level - 1) #Уровень ратуши
		if game.nation.id == Empire.SPAIN:
			science_pt += game.castle_level

		for s in science_bonuses:
			science_pt += s.value
		if game.nation.id == Empire.USA:
			if Empire.MOUNTAIN in castle_near:
				science_pt += 1
		science_mods = BuildingBonusModificator.objects.filter(type = 5, building__in = buildings)
		for s in science_mods:
			science_pt *= 1 + s.value / 100
		if game.nation.id == Empire.USA:
			science_pt *= Empire.USA_POWER

		return {
			'production': production_pt,
			'faith': faith_pt,
			'gold': gold_pt,
			'science': science_pt,
		}

	def step(self, game):
		import datetime
		last_step = Step.objects.filter(game = game).latest('id')
		science_pt = 3
		faith_pt = 1
		
		stats = self.get_stats(game)
		production_pt = stats['production']
		faith_pt = stats['faith']
		gold_pt = stats['gold']
		science_pt = stats['science']

		step = Step()
		step.game = game
		step.date = datetime.datetime.today()
		step.step = last_step.step + 1

		step.science = science_pt
		step.faith = faith_pt
		step.production = production_pt

		game.faith += step.faith

		# Изучаем технологии
		try:
			current_tech = UserTeach.objects.all().filter(game = game, completed = False).latest('id')
		except ObjectDoesNotExist:
			current_tech = None

		if current_tech:
			current_sp = current_tech.progress + science_pt
			
			if current_sp >= current_tech.technology.sp:
				from timetable.utils import sendNotification

				current_tech.progress = current_tech.technology.sp
				current_sp -= current_tech.technology.sp
				game.science = current_sp
				current_tech.completed = True

				game.user.userprofile.exp += 1
				game.user.save()

				sendNotification({
					"user": game.user,
					"title": "Технология изучена",
					"type": 1,
					"text": "Вы изучили технологию \"" + current_tech.technology.name + "\""
				})

			else:
				current_tech.progress = current_sp
				game.science = current_sp
				step.science = science_pt
			current_tech.save()
			game.save()
		

		#Строительство
		try:
			current_build = UserBuild.objects.all().filter(game = game, completed = False).latest('id')
		except ObjectDoesNotExist:
			current_build = None

		if current_build:
			current_prod = current_build.progress + production_pt
			
			if current_prod >= current_build.building.pp:
				from timetable.utils import sendNotification

				current_build.progress = current_build.building.pp
				current_prod -= current_build.building.pp
				game.production = current_prod
				current_build.completed = True

				#Если игрок - Китай, то получает 1-2 ед веры, производства или науки
				if game.nation.id == Empire.CHINA:
					rnd = random.random()
					if rnd < Empire.CHINA_BONUS_CHANCE:
						value = random.choice([1, 2])
						param = random.choice(('prod', 'science', 'faith'))
						if param == 'prod':
							game.production += value
							step.production += value
						elif param == 'science':
							game.science += value
							step.science += value
						elif param == 'faith':
							game.faith += value
							step.faith += value

				if game.nation.id == Empire.FRANCE:
					rnd = random.random()
					if rnd <= Empire.FRANCE_POWER_CHANCE:
						bonus_gold = current_build.pp * Empire.FRANCE_POWER_BONUS
						game.gold += bonus_gold
						step.gold += bonus_gold

				game.user.userprofile.exp += 1
				game.user.save()

				sendNotification({
					"user": game.user,
					"title": "Здание построено",
					"type": 1,
					"text": "Завершено строительство здания \"" + current_build.building.name + "\""
				})

			else:
				current_build.progress = current_prod
				game.production = current_prod
				step.production = production_pt
			current_build.save()
			game.save()

		game.gold += gold_pt
		game.save()

		step.gold += gold_pt
		step.save()