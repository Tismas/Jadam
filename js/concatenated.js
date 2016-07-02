(function(){
var units = {};	// JSON's
var stevo = [], sword = [], bg = new Image(), hpBorder = new Image(), coin = new Image(), anvil = [new Image(), new Image()];
var totalFiles 	= 15;

var filesLoaded = 0;
var game 		=	document.getElementById('game');
var canvas 		= 	document.createElement('canvas');
var ctx 		= 	canvas.getContext('2d');
var imageCount	=	0;
var heightT 	= 	7;	// rows+1
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

var money		=	100;
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
	bg.src = "assets/background.png";
	for(var i=0;i<3;i++) {
		stevo.push(new Image());
		stevo[i].onload = fileLoadCallback;
		stevo[i].src = "assets/" + (i+1) + ".png";
	}
	for(var i=3;i<6;i++) {
		stevo.push(new Image());
		stevo[i].onload = fileLoadCallback;
		stevo[i].src = "assets/fightstance" + (i-2) + ".png";
	}
	units.knight.image = stevo;
	for(var i=0;i<3;i++) {
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

var Knight = function(x,y) {
	this.x = x;
	this.y = y;
	this.hp = units.knight.hp;
	this.maxhp = units.knight.hp;
	this.dmg = units.knight.dmg;
	this.speed = units.knight.speed;
	this.reward = units.knight.reward;
	this.attackCooldown = 20;
	this.timeToAttack = 0;

	this.image = units.knight.image;
	this.weapon = units.knight.weapon;
	this.moving = true;
	this.swordFrame = 0;
	this.frame = 0;
	this.frameTime = 5;
	this.frameCnt = 0;
	this.frames = 3;

	this.attack = function(target) {
		if(this.timeToAttack == 0 && this.hp > 0) {
			this.timeToAttack = this.attackCooldown;
			this.prepareNextAttack();
			setTimeout(this.strike.bind(this, target), 200);
		}
	}
	this.prepareNextAttack = function() {
		this.frame = 4;
		this.swordFrame = 1;
	}
	this.strike = function(target) {
		if(this.hp > 0){
			this.swordFrame = 2;
			this.frame = 5;
			target.hp -= this.dmg;
			if(target.hp <= 0 && enemyUnits.indexOf(target) != -1)
				money += target.reward;
			setTimeout(this.prepareNextAttack.bind(this),100);
		}
	}
	this.die = function() {
		var index = playerUnits.indexOf(this);
		if(index != -1)
			playerUnits.splice(index,1);
		else {
			index = enemyUnits.indexOf(this);
			enemyUnits.splice(index,1);
		}
	}
	this.draw = function() {
		var hpGradient = ctx.createLinearGradient(this.x-offset,this.y,this.x-offset,this.y+20);
		hpGradient.addColorStop(0.01,"black");
		hpGradient.addColorStop(0.5,"rgb(" + (this.maxhp-this.hp)/this.maxhp*255 + "," + this.hp/this.maxhp*255 + ",50)");
		hpGradient.addColorStop(0.99,"black");
		ctx.fillStyle = hpGradient;
		if(enemyUnits.indexOf(this) != -1){
			ctx.save();
			ctx.translate(this.x,this.y);
			ctx.scale(-1,1);
			ctx.translate(this.x,-this.y);
			if(this.moving){
				if(this.frame>=3)
					this.frame = 1;
				ctx.drawImage(this.weapon[0], -(this.x - offset + tileSize/4 + (2-this.frame)*(tileSize/10)), this.y + tileSize/4, tileSize,tileSize);
			}
			else{
				if(this.swordFrame == 2)
					ctx.drawImage(this.weapon[this.swordFrame], -(this.x - offset + tileSize/3), this.y + tileSize/4, tileSize,tileSize);
				else
					ctx.drawImage(this.weapon[this.swordFrame], -(this.x - offset + tileSize/4), this.y + tileSize/4, tileSize,tileSize);
			}
			ctx.drawImage(this.image[this.frame], -(this.x-offset + tileSize/4), this.y + tileSize/4,tileSize,tileSize);
			ctx.fillRect(-(this.x-offset)-tileSize/5,this.y,this.hp/this.maxhp*(tileSize*0.75), tileSize/8);
			ctx.drawImage(hpBorder, -(this.x-offset)-tileSize/5, this.y, tileSize*0.75, tileSize/8);
			ctx.restore();

		}
		else{
			if(this.moving){
				if(this.frame>=3)
					this.frame = 1;
				ctx.drawImage(this.weapon[0], this.x - offset + tileSize/4 - (2-this.frame)*(tileSize/10), this.y + tileSize/4, tileSize,tileSize);
			}
			else{
				if(this.swordFrame == 2)
					ctx.drawImage(this.weapon[this.swordFrame], this.x - offset + tileSize/3, this.y + tileSize/4, tileSize,tileSize);
				else
					ctx.drawImage(this.weapon[this.swordFrame], this.x - offset + tileSize/4, this.y + tileSize/4, tileSize,tileSize);
			}
			ctx.drawImage(this.image[this.frame], this.x-offset + tileSize/4, this.y + tileSize/4,tileSize,tileSize);
			ctx.fillRect(-offset + this.x+tileSize/3,this.y,this.hp/this.maxhp*(tileSize*0.75), tileSize/8);
			ctx.drawImage(hpBorder, -offset + this.x + tileSize/3, this.y, tileSize*0.75, tileSize/8);
		}
		ctx.fillStyle = "#0f0";
	}
	this.update = function() {
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
})();