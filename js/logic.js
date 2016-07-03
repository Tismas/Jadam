var scrollMap = function() {
	if(mouseX <= tileSize && offset > 0)
		offset-=scrollSpeed;
	else if(mouseX >= width - tileSize && offset < widthT*tileSize-width)
		offset+=scrollSpeed;
}
var movePlayers = function() {
	for(var i=0, playerCount = playerUnits.length, enemyCount = enemyUnits.length; i<playerCount; i++){
		var playerAtI = playerUnits[i];
		if(!playerAtI) continue;
		var canMove = true;
		var target = playerAtI.getTarget();
		// kolizja ze swoimi
		for(var j=0;j<playerCount;j++){
			if(!playerUnits[j]) continue;
			if(i!=j && collideEntities(playerAtI, playerUnits[j]) && playerAtI.x<playerUnits[j].x){
				canMove = false;
				playerAtI.moving = false;
				break;
			}
		}
		if(target) {
			canMove = false;
			playerAtI.moving = false;
			if(playerAtI.frame <= 3)
				playerAtI.frame = 4;
			playerAtI.attack(target);
		}
		if(canMove) {
			playerAtI.x += playerAtI.speed;
			playerAtI.moving = true;
		}
		playerAtI.update();
	}	
}
var moveEnemies = function() {
	for(var i=0, enemyCount = enemyUnits.length, playerCount = playerUnits.length; i< enemyCount; i++) {
		var enemyAtI = enemyUnits[i];
		if(!enemyAtI) continue;
		var canMove = true;
		var target = enemyAtI.getTarget();
		// kolizja z sojusznikami
		for(var j=0; j < enemyCount; j++) {
			var enemyAtJ = enemyUnits[j];
			if(!enemyAtJ) continue;
			if(i!=j && collideEntities(enemyAtJ,enemyAtI) && enemyAtI.x>enemyAtJ.x){
				canMove = false;
				enemyAtI.moving = false;
				break;
			}
		}
		if(target) {
			canMove = false;
			enemyAtI.moving = false;
			if(enemyAtI.frame <= 3)
				enemyAtI.frame = 4;
			enemyAtI.attack(target);
		}
		if(canMove) {
			enemyAtI.x -= enemyAtI.speed;
			enemyAtI.moving = true;
		}
		enemyAtI.update();
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