var scrollMap = function() {
	if((mouseX <= gameOffsetX + scaledTileSize || keys.left) && offset > 0 && mouseX >= gameOffsetX)
		offset-=scrollSpeed;
	else if((mouseX >= width - scaledTileSize - gameOffsetX || keys.right) && offset < (widthT+heightT)*tileSize-frameWidth && mouseX <= width - gameOffsetX)
		offset+=scrollSpeed;
}
var movePlayers = function() {
	var playerAtI;
	for(var i=0, playerCount = playerUnits.length; i<playerCount; i++){
		playerAtI = playerUnits[i];
		if(playerAtI) playerAtI.update();
	}	
}
var moveEnemies = function() {
	var enemyAtI;
	for(var i=0, enemyCount = enemyUnits.length; i< enemyCount; i++) {
		enemyAtI = enemyUnits[i];
		if(enemyAtI) enemyAtI.update();
	}
}

var update = function() {
	now = new Date();
	var delta = now - before;
	if(delta > interval){
		scrollMap();
		while(delta>interval){
			var spawningEnemy = Math.floor(Math.random()*500);
			if(spawningEnemy < heightT - 1)
				enemyUnits.push(new Knight(widthT*tileSize, tileSize*(spawningEnemy+1), true));
			movePlayers();
			moveEnemies();
			boss.update();
			updateUI();
			delta -= interval;
		}
		before = now;
	}
	requestAnimationFrame(draw);
}

var draw = function () {
	c.fillStyle = '#000';
	c.fillRect(0,0,frame.width,frame.height);

	// draw background
	var firstTile = Math.floor(offset/tileSize),
		widthScreenTiles = Math.floor(frameWidth/tileSize);
	for(var i = firstTile; i <= firstTile + widthScreenTiles + 1; i++) {
		for(var j = 0;j<heightT;j++) {
			c.drawImage(bg, i*tileSize-offset, j*tileSize, tileSize, tileSize);
		}
	}
	
	// draw foreground
	var selected = c.createLinearGradient(-offset-tileSize/8,0,tileSize,0);
		selected.addColorStop(0,"yellow");
		selected.addColorStop(0.5,"transparent");
	var highlighted = c.createLinearGradient(-offset-tileSize/8,0,tileSize,0);
		highlighted.addColorStop(0,"blue");
		highlighted.addColorStop(0.5,"transparent");

	c.fillStyle = selected;
	c.fillRect(-offset,tileSize*activeRow,tileSize,tileSize);
	if(mouseX <= scaledTileSize + gameOffsetX && mouseY >= scaledTileSize && mouseX >= gameOffsetX) {
		var hl = Math.floor(mouseY/scaledTileSize);
		if(hl<heightT && hl!=activeRow) {
			c.fillStyle = highlighted;
			c.fillRect(-offset,hl*tileSize,tileSize,tileSize);
		}
	}

	for(var i=0, playerCount = playerUnits.length; i < playerCount; i++) {
		playerUnits[i].draw();
	}
	for(var i=0, enemiesCount=enemyUnits.length; i < enemiesCount; i++) {
		enemyUnits[i].draw();
	}
	boss.draw();

	drawUI();

	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,width,height);
	ctx.drawImage(frame,gameOffsetX,gameOffsetY,gameWidth,gameHeight);

	setTimeout(update,interval);
}