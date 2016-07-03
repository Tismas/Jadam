(function(){
var units = {};	// JSON's
var stevo = [], sword = [], bg = new Image(), hpBorder = new Image(), coin = new Image(), anvil = [new Image(), new Image()], boss = [];
var totalFiles 	= 16;

var filesLoaded = 0;
var game 		=	document.getElementById('game');
var canvas 		= 	document.createElement('canvas');
var ctx 		= 	canvas.getContext('2d');
var imageCount	=	0;
var heightT 	= 	6;	// rows+1
var widthT		=	30;
var width 		= 	window.innerWidth;
var height 		= 	window.innerHeight;
var offset		=	0;
var interval    = 	1000/30;
var tileSize    =  	Math.floor(height/heightT);
var mouseX		=	0;
var mouseY		=	0;

var activeRow	=	1;
var scrollSpeed =	15;
var now			=	new Date();
var before		=	new Date();

var money		=	1000;
var isAnvilClicked	=	0;
var anvilX		=	0;
var playerUnits =	[];
var enemyUnits	=	[];
var unitButtons =	[];
var particles	=	[];
var bossHp		=	100;

var collide = function(x1,y1,x2,y2) {
	if(x2 < x1 + tileSize && x2 > x1 && y2 < y1 + tileSize && y2 >= y1)
		return true;
	return false;
}
var collideEntities = function(entity1, entity2) {
	if((entity1.x + tileSize >= entity2.x && entity2.x > entity1.x || entity1.x - tileSize <= entity2.x && entity1.x > entity2.x) && entity1.y == entity2.y)
		return true;
	return false;
}

var loadFiles = function() {
	// JSONs
	$.getJSON( "https://tismas.github.io/data/heroes.json", function( data ) {
		$.each( data, function( key, val ) {
			units[key] = val;
		});
		fileLoadCallback();
		loadImages();
	}).fail(function(){
		console.log("Failed to load json");
	});;
}
var loadImages = function() {
	// images
	bg.onload = fileLoadCallback;
	bg.src = "assets/bgTile1.png";
	for(var i=0;i<6;i++) {
		stevo.push(new Image());
		stevo[i].onload = fileLoadCallback;
		stevo[i].src = "assets/stevo" + (i+1) + ".png";
	}
	units.knight.image = stevo;
	for(var i=0;i<6;i++) {
		sword.push(new Image());
		sword[i].onload = fileLoadCallback;
		sword[i].src = "assets/sword_position" + (i+1) + ".png";
	}
	units.knight.weapon = sword;
	anvil[0].onload = fileLoadCallback;
	anvil[0].src = "assets/anvil.png";
	anvil[1].onload = fileLoadCallback;
	anvil[1].src = "assets/anvil2.png";
	hpBorder.onload = fileLoadCallback;
	hpBorder.src = "assets/hp.png";
	coin.onload = fileLoadCallback;
	coin.src = "assets/moneta1.png";
	
	for(var i=0;i<4;i++){
		boss.push(new Image());
		boss[i].onload = fileLoadCallback;
		boss[i].src = "assets/boss" + (i+1) + ".png";
	}
	
	init();
}

var init = function() {
	canvas.width  = width;
	canvas.height = height;
	game.appendChild(canvas);

	unitButtons.push(new UnitButton(tileSize*0,0,units.knight,Knight));

	window.onresize = resizeCallback;
	update();
	draw();
}

loadFiles();

var Knight = function(x, y, flipped) {
	this.x = x;
	this.y = y;
	this.hp = units.knight.hp;
	this.maxhp = units.knight.hp;
	this.dmg = units.knight.dmg;
	this.speed = units.knight.speed;
	this.reward = units.knight.reward;
	this.range = tileSize * 0.75;
	this.attackCooldown = 20;
	this.timeToAttack = 0;

	this.image = units.knight.image;
	this.weapon = units.knight.weapon;
	this.moving = true;
	this.attacking = false;
	this.frame = 0;
	this.frameTime = 5;
	this.frameCnt = 0;
	this.frames = 3;

	this.flipped = flipped || false;
}
Knight.prototype = {
	getTarget: function() {
		if(this.flipped) {
			for(var i=0, playerCount = playerUnits.length; i < playerCount; i++) {
				var playerAtI = playerUnits[i];
				if(!playerAtI) continue;
				if(playerAtI.x >= this.x - this.range && playerAtI.y == this.y) {
					return playerAtI;
				}
			}
		}
		else {
			for(var i=0, enemyCount = enemyUnits.length; i < enemyCount; i++) {
				var enemyAtI = enemyUnits[i];
				if(!enemyAtI) continue;
				if(enemyAtI.x <= this.x + this.range && enemyAtI.y == this.y) {
					return enemyAtI;
				}
			}
		}
		return null;
	},
	attack: function(target) {
		if(this.timeToAttack == 0 && this.hp > 0 && target.attacking == false) {
			this.timeToAttack = this.attackCooldown;
			this.prepareNextAttack();
			this.attacking = true;
			setTimeout(this.strike.bind(this, target), 200);
		}
	},
	strike: function(target) {
		if(this.hp > 0){
			this.swordFrame = 2;
			this.frame = 5;
			target.hp -= this.dmg;
			if(target.hp <= 0 && enemyUnits.indexOf(target) != -1)
				money += target.reward;
			setTimeout(this.prepareNextAttack.bind(this),125);
		}
	},
	prepareNextAttack: function() {
		this.frame = 4;
		this.swordFrame = 1;
		this.attacking = false;
	},
	die: function() {
		var index = playerUnits.indexOf(this);
		if(index != -1)
			playerUnits.splice(index,1);
		else {
			index = enemyUnits.indexOf(this);
			enemyUnits.splice(index,1);
		}
		delete this;
	},
	draw: function() {
		var hpGradient = ctx.createLinearGradient(this.x-offset,this.y,this.x-offset,this.y+20);
		hpGradient.addColorStop(0.01,"black");
		hpGradient.addColorStop(0.5,"rgb(" + (this.maxhp-this.hp)/this.maxhp*255 + "," + this.hp/this.maxhp*255 + ",50)");
		hpGradient.addColorStop(0.99,"black");
		ctx.fillStyle = hpGradient;
		if(this.hp<0) this.hp = 0;
		if(this.flipped){
			ctx.save();
			ctx.translate(this.x,this.y);
			ctx.scale(-1,1);
			ctx.translate(this.x - tileSize,-this.y);
			var drawX = -(this.x - offset);
			if(this.swordFrame == 6)
				ctx.drawImage(this.weapon[this.frame], drawX + tileSize/5, this.y, tileSize,tileSize);
			else
				ctx.drawImage(this.weapon[this.frame], drawX, this.y, tileSize,tileSize);
			ctx.drawImage(this.image[this.frame], drawX, this.y, tileSize, tileSize);
			ctx.restore();
		}
		else{
			if(this.swordFrame == 6)
				ctx.drawImage(this.weapon[this.frame], this.x - offset + tileSize/5, this.y, tileSize,tileSize);
			else
				ctx.drawImage(this.weapon[this.frame], this.x - offset, this.y, tileSize,tileSize);
			ctx.drawImage(this.image[this.frame], this.x-offset, this.y, tileSize, tileSize);
		}
		ctx.fillRect(this.x - offset + tileSize/8,this.y,this.hp/this.maxhp*(tileSize*0.75), tileSize/8);
		ctx.drawImage(hpBorder, this.x - offset + tileSize/8, this.y, tileSize*0.75, tileSize/8);
		ctx.fillStyle = "#0f0";
	},
	update: function() {
		if(this.timeToAttack != 0)
			this.timeToAttack--;
		if(this.hp<=0 || this.x >= widthT*tileSize || this.x < 0)
			this.die();
		if(!this.moving && (this.frame == 1 || this.frame == 2 ))
			this.frame = 0;
		else if(this.moving) {
			this.frameCnt++;
			if(this.frameCnt>=this.frameTime){
				this.frame++;
				this.frameCnt=0;
				if(this.frame>=this.frames) this.frame = 1;
			}
		}
	}
}

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



var One = function(x,y){
	this.x = x;
	this.y = y;
	this.draw = function() {
		ctx.fillStyle = "rgba(255,255,255," + this.y / y + ")";
		ctx.fillText("+1",this.x,this.y);
	}
	this.update = function() {
		this.y--;
		if(this.y <= 0){
			particles.splice(particles.indexOf(this),1);
			delete this;
		}
	}
}

var UnitButton = function (x,y,unitDesc,unitClass,background,hover) {
	this.x = x;
	this.y = y;
	this.color = unitDesc.color;
	this.cost = unitDesc.price;
	this.background = background || "#333";
	this.hover = hover || "#555";
	this.failed = false;
	this.succeed = false;
	this.statusCounter = 0;	// opoznianie zmiany statusu po probie zakupu

	this.fail = function() {
		this.failed = true;
		this.statusCounter = 5;
	}
	this.success = function() {
		this.succeed = true;
		money -= this.cost;
		this.statusCounter = 5;
		playerUnits.push(new unitClass(0,activeRow*tileSize));
	}
	this.collide = function(x,y) {
		return collide(this.x,this.y,x,y);
	}

	this.draw = function() {
		if(this.failed)
			ctx.fillStyle = "#500";
		else if(this.succeed)
			ctx.fillStyle = "#050";
		else if(collide(x,y,mouseX,mouseY))
			ctx.fillStyle = this.hover;
		else
			ctx.fillStyle = this.background;
		ctx.fillRect(this.x,this.y,tileSize,tileSize);
		var sizeOfImage = tileSize - 2*tileSize/5;
		ctx.drawImage(unitDesc.weapon[0], this.x + tileSize/5, this.y + tileSize/10, sizeOfImage, sizeOfImage);
		ctx.drawImage(unitDesc.image[0], this.x + tileSize/5, this.y + tileSize/10, sizeOfImage, sizeOfImage);
		ctx.fillStyle = "#fff";
		ctx.font = "20px Arial";
		var price = "$" + this.cost;
		ctx.fillText(price, this.x + tileSize - tileSize/2-ctx.measureText(price).width/2, this.y + tileSize-15);
		if(this.statusCounter > 0){
			this.statusCounter--;
		}
		else if(this.failed || this.succeed){
			this.failed = false;
			this.succeed = false;
		}
	}
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
var updateUI = function() {
	for(var i=0;i<particles.length;i++){
		particles[i].update();
	}
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

	//anvil
	anvilX = tileSize*(middle+1);
	ctx.drawImage(anvil[isAnvilClicked], anvilX, 0, tileSize, tileSize);

	for(var i=0;i<particles.length;i++){
		particles[i].draw();
	}

	drawBorder();
}

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
})();