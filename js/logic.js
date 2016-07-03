var scrollMap = function() {
	if(mouseX <= tileSize && offset > 0)
		offset-=scrollSpeed;
	else if(mouseX >= width - tileSize && offset < widthT*tileSize-width)
		offset+=scrollSpeed;
}
var movePlayers = function() {
	for(var i=0;i<playerUnits.length;i++){
		var canMove = true;
		var target = null;
		// kolizja ze swoimi
		for(var j=0;j<playerUnits.length;j++){
			if(i!=j && collide(playerUnits[i].x,playerUnits[i].y,playerUnits[j].x,playerUnits[j].y) && playerUnits[i].x<playerUnits[j].x){
				canMove = false;
				playerUnits[i].moving = false;
				break;
			}
		}
		// kolizja z przeciwnikami
		for(var j=0;j<enemyUnits.length;j++){
			if(collide(playerUnits[i].x,playerUnits[i].y,enemyUnits[j].x - tileSize,enemyUnits[j].y)){
				canMove = false;
				playerUnits[i].moving = false;
				target = enemyUnits[j];
				break;
			}
		}
		if(canMove) {
			playerUnits[i].x += playerUnits[i].speed;
			playerUnits[i].moving = true;
		}
		else if(target != null) {
			if(playerUnits[i].swordFrame == 0)
				playerUnits[i].swordFrame = 1;
			if(playerUnits[i].frame <= 3)
				playerUnits[i].frame = 4;
			playerUnits[i].attack(target);
		}
		playerUnits[i].update();
	}	
}
var moveEnemies = function() {
	for(var i=0;i<enemyUnits.length;i++) {
		var canMove = true;
		var target = null;
		// kolizja z sojusznikami
		for(var j=0;j<enemyUnits.length;j++) {
			if(i!=j && collide(enemyUnits[j].x,enemyUnits[j].y,enemyUnits[i].x,enemyUnits[i].y) && enemyUnits[i].x>enemyUnits[j].x){
				canMove = false;
				enemyUnits[i].moving = false;
				break;
			}
		}
		// kolizja z graczem
		for(var j=0;j<playerUnits.length;j++){
			if(collide(playerUnits[j].x,playerUnits[j].y,enemyUnits[i].x - tileSize,enemyUnits[i].y)){
				canMove = false;
				enemyUnits[i].moving = false;
				target = playerUnits[j];
				break;
			}
		}
		if(canMove) {
			enemyUnits[i].x -= enemyUnits[i].speed;
			enemyUnits[i].moving = true;
		}
		else if(target!=null) {
			if(enemyUnits[i].swordFrame == 0)
				enemyUnits[i].swordFrame = 1;
			if(enemyUnits[i].frame <= 3)
				enemyUnits[i].frame = 4;
			enemyUnits[i].attack(target);
		}
		enemyUnits[i].update();
	}
}

var update = function() {
	now = new Date();

	var delta = now - before;
	if(delta > interval){
		scrollMap();
		while(delta>interval){
			var spawningEnemy = Math.floor(Math.random()*100);
			if(spawningEnemy == 1)
				enemyUnits.push(new Knight(widthT*tileSize,tileSize*(Math.floor(Math.random()*5)+1)));
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

	for(var i=0;i<playerUnits.length;i++) {
		playerUnits[i].draw();
	}
	for(var i=0;i<enemyUnits.length;i++) {
		enemyUnits[i].draw();
	}

	drawUI();

	setTimeout(update,interval);
}