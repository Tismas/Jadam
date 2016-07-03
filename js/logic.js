var scrollMap = function() {
	if(mouseX <= tileSize && offset > 0)
		offset-=scrollSpeed;
	else if(mouseX >= width - tileSize && offset < widthT*tileSize-width)
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
			if(spawningEnemy < 5)
				enemyUnits.push(new Knight(widthT*tileSize, tileSize*(spawningEnemy+1), true));
			movePlayers();
			moveEnemies();
			updateUI();
			delta -= interval;
		}
		before = now;
	}
	requestAnimationFrame(draw);
}

var draw = function () {
	ctx.fillStyle = '#000';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	// draw background
	var firstTile = Math.floor(offset/tileSize);
	var widthScreenTiles = Math.floor(width/tileSize);
	for(var i= firstTile; i <= firstTile + widthScreenTiles + 1; i++) {
		for(var j=0;j<heightT;j++) {
			ctx.drawImage(bg, i*tileSize-offset, j*tileSize, tileSize, tileSize);
		}
	}
	
	// draw foreground
	var selected = ctx.createLinearGradient(-offset-tileSize/8,0,tileSize,0);
		selected.addColorStop(0,"yellow");
		selected.addColorStop(0.5,"transparent");
	var highlighted = ctx.createLinearGradient(-offset-tileSize/8,0,tileSize,0);
		highlighted.addColorStop(0,"blue");
		highlighted.addColorStop(0.5,"transparent");

	ctx.fillStyle = selected;
	ctx.fillRect(-offset,tileSize*activeRow,tileSize,tileSize);
	if(mouseX<=tileSize && mouseY>=tileSize) {
		var hl = Math.floor(mouseY/tileSize);
		if(hl<heightT && hl!=activeRow) {
			ctx.fillStyle = highlighted;
			ctx.fillRect(-offset,hl*tileSize,tileSize,tileSize);
		}
	}

	for(var i=0, playerCount = playerUnits.length; i < playerCount; i++) {
		playerUnits[i].draw();
	}
	for(var i=0, enemiesCount=enemyUnits.length; i < enemiesCount; i++) {
		enemyUnits[i].draw();
	}

	drawUI();

	setTimeout(update,interval);
}