(function(){
var units = {},
stevo = [], sword = [], bg = new Image(), hpBorder = new Image(), coin = new Image(), anvil = [new Image(), new Image()],
totalFiles 	= 22,

filesLoaded = 0;
game 		=	document.getElementById('game'),
canvas 		= 	document.createElement('canvas'),
frame		=	document.createElement('canvas'),
frameWidth	=	1920,
frameHeight =	1080,
gameWidth	=	0, 
gameHeight	=	0,
gameOffsetX	=	0,
gameOffsetY	=	0,
ctx 		= 	canvas.getContext('2d'),
c 			=	frame.getContext('2d'),
aspectRatio =	16/9;
imageCount	=	0,
heightT 	= 	6,	// rows+1
widthT		=	30,
width 		= 	window.innerWidth,
height 		= 	window.innerHeight,
offset		=	0,
interval    = 	1000/30,
tileSize    =  	Math.floor(frameHeight/heightT),
scaledTileSize = tileSize;
mouseX		=	0,
mouseY		=	0,

activeRow	=	1,
scrollSpeed =	15,
now			=	new Date(),
before		=	new Date(),

money		=	1000,
isAnvilClicked	=	0,
playerUnits =	[],
enemyUnits	=	[],
unitButtons =	[],
particles	=	[],
boss		=	{
	x: widthT*tileSize,
	y: tileSize,
	hp: 100,
	maxhp: 100,
	img: [],
	frame: 0,

	draw: function() {
		if(boss.frame > 4) boss.frame = 0;
		c.drawImage(this.img[this.frame], this.x - offset, this.y, (heightT-1) * tileSize, (heightT-1) * tileSize);
		drawHpBar(this, (heightT-1) * tileSize);
	},
};
setInterval(function(){boss.frame++;},200);

var drawHpBar = function(entity, w) {
	var hpGradient = c.createLinearGradient(entity.x-offset,entity.y,entity.x-offset,entity.y+20),
		barWidth = w || tileSize;
	hpGradient.addColorStop(0.01,"black");
	hpGradient.addColorStop(0.5,"rgb(" + (entity.maxhp-entity.hp)/entity.maxhp*255 + "," + entity.hp/entity.maxhp*255 + ",50)");
	hpGradient.addColorStop(0.99,"black");
	c.fillStyle = hpGradient;
	c.fillRect(entity.x - offset + barWidth/8, entity.y, entity.hp/entity.maxhp*(barWidth*0.75), tileSize/8);
	c.drawImage(hpBorder, entity.x - offset + barWidth/8, entity.y, barWidth*0.75, tileSize/8);
}

var setGameSize = function() {
	var w, h = width / aspectRatio;
	if(h > height) {
		w = height*aspectRatio;
		h = w / aspectRatio;
		gameOffsetX = (width - w)/2;
		gameOffsetY = 0;
	}
	else {
		w = width;
		gameOffsetX = 0;
		gameOffsetY = (height - h)/2;
	}
	gameWidth = w;
	gameHeight = h;

	scaledTileSize = gameHeight/heightT;
}

var collidePoint = function(point,rect) {
	if(point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y & point.y < rect.y + rect.height)
		return true;
	return false;
}
var collideEntities = function(rect1, rect2) {
	rect1.width = rect1.width || tileSize;
	rect1.height = rect1.height || tileSize;
	rect2.width = rect1.width || tileSize;
	rect2.height = rect1.height || tileSize;
	if(((rect1.x + rect1.width > rect2.x && rect1.x + rect1.width < rect2.x + rect2.width) || (rect2.x + rect2.width > rect1.x && rect2.x + rect2.width < rect1.x + rect1.width))
		&& ((rect1.y + rect1.height > rect2.y && rect1.y + rect1.height < rect2.y + rect2.height) || (rect2.y + rect2.height > rect1.y && rect2.y + rect2.height < rect1.y + rect1.height)))
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
	
	for(var i=0;i<5;i++){
		boss.img.push(new Image());
		boss.img[i].onload = fileLoadCallback;
		boss.img[i].src = "assets/boss" + (i+1) + ".png";
	}
	
	init();
}

var init = function() {
	canvas.width  = width;
	canvas.height = height;
	frame.width = frameWidth;
	frame.height = frameHeight;
	setGameSize();

	game.appendChild(canvas);

	unitButtons.push(new UnitButton(tileSize*0,0,units.knight,Knight));

	window.onresize = resizeCallback;
	update();
	draw();
}

loadFiles();

var Knight = function(x, y, isEnemy) {
	this.x = x;
	this.y = y;
	this.maxhp = units.knight.hp;
	this.hp = this.maxhp;
	this.dmg = units.knight.dmg;
	this.speed = units.knight.speed;
	this.reward = units.knight.reward;
	this.range = units.knight.range || 150;
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

	this.isEnemy = isEnemy || false;
}
Knight.prototype = {
	getTarget: function() {
		if(this.isEnemy) {
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
		if(this.hp<0) this.hp = 0;
		if(this.isEnemy){
			c.save();
			c.translate(this.x,this.y);
			c.scale(-1,1);
			c.translate(this.x - tileSize,-this.y);
			var drawX = -(this.x - offset);
			if(this.swordFrame == 6)
				c.drawImage(this.weapon[this.frame], drawX + tileSize/5, this.y, tileSize,tileSize);
			else
				c.drawImage(this.weapon[this.frame], drawX, this.y, tileSize,tileSize);
			c.drawImage(this.image[this.frame], drawX, this.y, tileSize, tileSize);
			c.restore();
		}
		else{
			if(this.swordFrame == 6)
				c.drawImage(this.weapon[this.frame], this.x - offset + tileSize/5, this.y, tileSize,tileSize);
			else
				c.drawImage(this.weapon[this.frame], this.x - offset, this.y, tileSize,tileSize);
			c.drawImage(this.image[this.frame], this.x - offset, this.y, tileSize, tileSize);
		}
		drawHpBar(this);
		c.fillStyle = "#0f0";
	},
	update: function() {
		var canMove = true;
		var target = this.getTarget();
		var entityAtJ;

		if(this.isEnemy){
			for(var j=0, enemyCount = enemyUnits.length; j < enemyCount; j++) {
				entityAtJ = enemyUnits[j];
				if(!entityAtJ) continue;
				if(this !== entityAtJ && collideEntities(entityAtJ,this) && this.x>entityAtJ.x){
					canMove = false;
					this.moving = false;
					break;
				}
			}
			if(target) {
				canMove = false;
				this.moving = false;
				if(this.frame <= 3)
					this.frame = 4;
				this.attack(target);
			}
			if(canMove) {
				this.x -= this.speed;
				this.moving = true;
			}
		}
		else{
			for(var j=0, playerCount = playerUnits.length; j<playerCount; j++) {
				entityAtJ = playerUnits[j];
				if(!entityAtJ) continue;
				if(this!==entityAtJ && collideEntities(this, entityAtJ) && this.x<entityAtJ.x){
					canMove = false;
					this.moving = false;
					break;
				}
			}
			if(target) {
				canMove = false;
				this.moving = false;
				if(this.frame <= 3)
					this.frame = 4;
				this.attack(target);
			}
			if(canMove) {
				this.x += this.speed;
				this.moving = true;
			}
		}
		this.updateAnimation();
		
		if(this.hp <= 0 || this.x > widthT*tileSize || this.x < 0)
			this.die();
	},
	updateAnimation: function() {
		if(this.timeToAttack != 0)
			this.timeToAttack--;
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



var One = function(x,y){
	this.x = x;
	this.y = y;
	this.draw = function() {
		c.fillStyle = "rgba(255,255,255," + this.y / y + ")";
		c.fillText("+1",this.x,this.y);
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
	this.unitDesc = unitDesc;
	this.unitClass = unitClass;
}
UnitButton.prototype = {
	fail: function() {
		this.failed = true;
		this.statusCounter = 10;
	},
	success: function() {
		this.succeed = true;
		money -= this.cost;
		this.statusCounter = 5;
		playerUnits.push(new this.unitClass(0,activeRow*tileSize));
	},
	collide: function(x,y) {
		return collidePoint(
			{
				x: x - gameOffsetX, 
				y: y - gameOffsetY
			},
			{
				x:this.x, 
				y:this.y, 
				width:scaledTileSize, 
				height:scaledTileSize}
			);
	},
	draw: function() {
		if(this.failed)
			c.fillStyle = "#500";
		else if(this.succeed)
			c.fillStyle = "#050";
		else if(this.collide(mouseX,mouseY))
			c.fillStyle = this.hover;
		else
			c.fillStyle = this.background;
		c.fillRect(this.x,this.y,tileSize,tileSize);
		var sizeOfImage = tileSize - 2*tileSize/5;
		c.drawImage(this.unitDesc.weapon[0], this.x + tileSize/5, this.y + tileSize/10, sizeOfImage, sizeOfImage);
		c.drawImage(this.unitDesc.image[0], this.x + tileSize/5, this.y + tileSize/10, sizeOfImage, sizeOfImage);
		c.fillStyle = "#fff";
		c.font = "20px Arial";
		var price = "$" + this.cost;
		c.fillText(price, this.x + tileSize - tileSize/2-c.measureText(price).width/2, this.y + tileSize-15);
		if(this.statusCounter > 0){
			this.statusCounter--;
		}
		else if(this.failed || this.succeed){
			this.failed = false;
			this.succeed = false;
		}
	},
}

var drawBorder = function() {
	c.fillStyle = "#fff";
	c.fillRect(0,0,frameWidth,1);
	c.fillRect(0,0,2,tileSize);
	c.fillRect(0,tileSize,frameWidth,1);
	c.fillRect(frameWidth-1,0,1,tileSize);

	var middle = Math.round((frameWidth/2)/tileSize) - 1;
	c.fillRect(tileSize*middle, 0, 1, tileSize);
	c.fillRect(tileSize*(middle+1), 0, 1, tileSize);
}
var updateUI = function() {
	for(var i=0;i<particles.length;i++){
		particles[i].update();
	}
}
var drawUI = function() {
	c.fillStyle = "#000";
	c.fillRect(0,0,tileSize*widthT,tileSize);
	for(var i=0;i<unitButtons.length;i++){
		unitButtons[i].draw();
	}
	c.font = "20px Arial";
	c.fillStyle = "#fff"
	var middle = Math.round((frameWidth/2)/tileSize) - 1;
	c.drawImage(coin, tileSize*middle + 10, tileSize/6, tileSize/5,tileSize/5);
	c.fillText(money, tileSize*middle + tileSize/5 + 10, tileSize/6+20);

	//anvil
	anvilX = tileSize*(middle+1);
	c.drawImage(anvil[isAnvilClicked], anvilX, 0, tileSize, tileSize);

	for(var i=0;i<particles.length;i++){
		particles[i].draw();
	}

	drawBorder();
}

var scrollMap = function() {
	if(mouseX <= gameOffsetX + scaledTileSize && offset > 0 && mouseX >= gameOffsetX)
		offset-=scrollSpeed;
	else if(mouseX >= width - scaledTileSize - gameOffsetX && offset < (widthT+heightT)*tileSize-frameWidth && mouseX <= width - gameOffsetX)
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
})();