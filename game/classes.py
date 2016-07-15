from .models import *

class Empire:
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


class Map:
	cells = [[0 for x in range(32)] for y in range(32)]
	width = 32
	height = 32

	def __init__(self, nation):
		if nation:
			self.nation = nation

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
					"type": type,
					"sprite": sprite,
					"resource": resource,
					"building": "",
					"visible": False,
					"values": {
						"food": food,
						"production": production,
						"culture": culture,
						"faith": faith,
						"science": science,
						"tourism": tourism,
						"happiness": happiness,
						"gold": gold,
					},
					"position": {
						"x": j,
						"y": i,
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

	def step(self, game):
		import datetime
		last_step = Step.objects.filter(game = game).latest('id')
		science_pt = 1
		faith_pt = 1
		step = Step()
		step.game = game
		step.date = datetime.datetime.today()
		step.step = last_step.step + 1

		step.science = science_pt
		step.faith = faith_pt

		game.faith += step.faith

		# Изучаем технологии
		current_tech = UserTeach.objects.all().filter(game = game, completed = False).latest('id')
		print(current_tech)
		if current_tech:
			current_sp = current_tech.progress + science_pt
			
			if current_sp >= current_tech.technology.sp:
				current_tech.progress = current_tech.technology.sp
				current_sp -= current_tech.technology.sp
				current_tech.completed = True
			else:
				current_tech.progress = current_sp
				game.science = current_sp
				step.science = science_pt
			current_tech.save()
			game.save()
		step.save()