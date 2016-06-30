var fileLoadCallback = function() {
	filesLoaded++;
	console.log("Files loaded: " + filesLoaded + "/" + totalFiles);
}

var resizeCallback = function() {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	var oldTileSize = tileSize;
	tileSize = Math.floor(height/heightT);
	for(var i=0;i<unitButtons.length;i++) {
		unitButtons[i].x = i*tileSize;
	}
	for(var i=0;i<playerUnits.length;i++){
		var tilePos = playerUnits[i].x/oldTileSize;
		playerUnits[i].x = tilePos * tileSize;
	}
	for(var i=0;i<enemyUnits.length;i++){
		var tilePos = enemyUnits[i].x/oldTileSize;
		enemyUnits[i].x = tilePos * tileSize;
	}
	update();
	draw();
}

canvas.onmousemove = function(e) {
	mouseX = e.x;
	mouseY = e.y;
}
canvas.onclick = function(e) {
	if(e.x<=tileSize && e.y>=tileSize) {
		activeRow = Math.floor(mouseY/tileSize);
		if(activeRow>=heightT) activeRow = heighT-1;
	}
	for(var i=0;i<unitButtons.length;i++){
		if(unitButtons[i].collide(e.x,e.y) && money >= unitButtons[i].cost)
			unitButtons[i].success();
		else if(unitButtons[i].collide(e.x,e.y))
			unitButtons[i].fail();
	}
}
