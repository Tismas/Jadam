var fileLoadCallback = function() {
	filesLoaded++;
	console.log("Files loaded: " + filesLoaded + "/" + totalFiles);
}

var resizeCallback = function() {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	setGameSize();
}

canvas.onmousemove = function(e) {
	mouseX = e.x;
	mouseY = e.y;
}
canvas.onclick = function(e) {
	if(e.x <= gameOffsetX + scaledTileSize && e.y >= gameOffsetY + scaledTileSize) {
		activeRow = Math.floor(mouseY/scaledTileSize);
		if(activeRow>=heightT) activeRow = heighT-1;
	}
	for(var i=0;i<unitButtons.length;i++){
		if(unitButtons[i].collide(e.x, e.y) && money >= unitButtons[i].cost)
			unitButtons[i].success();
		else if(unitButtons[i].collide(e.x,e.y))
			unitButtons[i].fail();
	}
	if(collidePoint({x:e.x,y:e.y},anvil)){
		anvil.onclick();
	}
}
window.onkeydown = function(e) {
	if(e.keyCode == 37) {
		keys.left = true;
	}
	else if(e.keyCode == 39) {
		keys.right = true;
	}
}
window.onkeyup = function(e) {
	if(e.keyCode == 37) {
		keys.left = false;
	}
	else if(e.keyCode == 39) {
		keys.right = false;
	}
}