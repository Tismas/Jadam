var fileLoadCallback = function() {
	filesLoaded++;
	console.log("Files loaded: " + filesLoaded + "/" + totalFiles);
}

var resizeCallback = function() {
	var aspectRatioX = window.innerWidth/width;
	var aspectRatioY = window.innerHeight/height;
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	tileSize = Math.floor(height/heightT);
	for(var i=0;i<unitButtons.length;i++) {
		unitButtons[i].x = i*tileSize;
	}
	for(var i=0;i<playerUnits.length;i++){
		playerUnits[i].x *= aspectRatioX;
		playerUnits[i].y *= aspectRatioY;
	}
	for(var i=0;i<enemyUnits.length;i++){
		enemyUnits[i].x *= aspectRatioX;
		enemyUnits[i].y *= aspectRatioY;
	}
	offset *= aspectRatioX;
	if(offset>widthT*tileSize-width) offset = widthT*tileSize-width;
	update();
	draw();
}

canvas.onmousemove = function(e) {
	mouseX = e.x;
	mouseY = e.y;
}
var unclickAnvil = function() { isAnvilClicked = 0; }
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
	if(e.x >= anvilX && e.x <= anvilX + tileSize && e.y >= 0 && e.y <= tileSize){
		isAnvilClicked = 1;
		money++;
		particles.push(new One(anvilX + tileSize/3 + (-tileSize/8 + Math.random()*(tileSize/4)), tileSize/2));
		setTimeout(unclickAnvil,125);
	}
}
