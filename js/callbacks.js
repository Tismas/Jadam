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
var unclickAnvil = function() { isAnvilClicked = 0; }
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
	// if(e.x >= anvilX && e.x <= anvilX + tileSize && e.y >= 0 && e.y <= tileSize){
	// 	isAnvilClicked = 1;
	// 	money++;
	// 	particles.push(new One(anvilX + tileSize/3 + (-tileSize/8 + Math.random()*(tileSize/4)), tileSize/2));
	// 	setTimeout(unclickAnvil,125);
	// }
}
