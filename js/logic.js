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
			var spawningEnemy = Math.floor(Math.random()*300);
			if(spawningEnemy == 1)
				enemyUnits.push(new Knight(widthT*tileSize,tileSize*(Math.floor(Math.random()*5)+1)));
			movePlayers();
			moveEnemies();
			delta -= interval;
		}
		before = now;
	}

	requestAnimationFrame(draw);
}

var drawBorder = function() {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0,0,width,1);
	ctx.fillRect(0,0,2,tileSize);
	ctx.fillRect(0,tileSize,width,1);
	ctx.fillRect(width-1,0,1,tileSize);

	var middle = Math.round((width/2)/tileSize) - 1;
	ctx.fillRect(tileSize*middle, 0, 1, tileSize);
	ctx.fillRect(tileSize*(middle+1), 0, 1, tileSize);
}
var drawUI = function() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,tileSize*widthT,tileSize);
	for(var i=0;i<unitButtons.length;i++){
		unitButtons[i].draw();
	}
	ctx.font = "20px Arial";
	ctx.fillStyle = "#fff"
	var middle = Math.round((width/2)/tileSize) - 1;
	ctx.drawImage(coin, tileSize*middle + 10, tileSize/6, tileSize/5,tileSize/5);
	ctx.fillText(money, tileSize*middle + tileSize/5 + 10, tileSize/6+20);

	drawBorder();
}

var draw = function () {
	ctx.fillStyle = '#000';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	// draw background
	ctx.drawImage(bg,-offset,tileSize,widthT*tileSize,height-tileSize);
	
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