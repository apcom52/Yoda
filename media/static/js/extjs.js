function chooseInRange(min = 0, max = 0) {
	return Math.round(Math.random()*(max - min) + min);
}