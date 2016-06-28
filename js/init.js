(function(){

	// general functins
	var collide = function(x1,y1,x2,y2) {
		if(x2 <= x1 + tileSize && x2 >= x1 && y2 <= y1 + tileSize && y2 >= y1)
			return true;
		return false;
	}

	// units
	var units = {
		"knight": {
			"hp": 10,
			"dmg": 4,
			"speed": 5,
			"price": 20,
			"color": "#0f0"
		},
		"archer": {
			"hp": 8,
			"dmg": 6,
			"speed": 6,
			"price": 50,
			"color": "#f00",
		},
	}

	// classes
	var Knight = function(x,y) {
		this.x = x;
		this.y = y;
		this.hp = units.knight.hp;
		this.dmg = units.knight.dmg;
		this.speed = units.knight.speed;
		this.color = units.knight.color;

		this.image = units.knight.image;
		this.frame = 0;
		this.frameTime = 10;
		this.frameCnt = 0;
		this.frames = 3;

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
			if(enemyUnits.indexOf(this) != -1){
				ctx.save();
				ctx.translate(this.x,this.y);
				ctx.scale(-1,1);
				ctx.translate(this.x,-this.y)
				ctx.drawImage(this.image[this.frame], -(this.x-offset + tileSize/4), this.y + tileSize/4,tileSize,tileSize);
				ctx.restore();
			}
			else{
				ctx.drawImage(this.image[this.frame], this.x-offset + tileSize/4, this.y + tileSize/4,tileSize,tileSize);
			}
		}
		this.update = function() {
			if(this.hp<=0 || this.x >= widthT*tileSize)
				this.die();
			this.frameCnt++;
			if(this.frameCnt>=this.frameTime){
				this.frame++;
				this.frameCnt=0;
				if(this.frame==this.frames) this.frame = 0;
			}
		}
	}
	var Archer = function(x,y) {
		this.x = x;
		this.y = y;
		this.hp = units.archer.hp;
		this.dmg = units.archer.dmg;
		this.speed = units.archer.speed;
		this.color = units.archer.color;

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
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x-offset + tileSize/4,this.y + tileSize/4,tileSize/2,tileSize/2);
		}
		this.update = function() {
			if(this.hp<=0 || this.x >= widthT*tileSize)
				this.die();
		}
	}

	var UnitButton = function (x,y,unitDesc,unitClass,background = "#333", hover = "#555") {
		this.x = x;
		this.y = y;
		this.color = unitDesc.color;
		this.cost = unitDesc.price;
		this.background = background;
		this.hover = hover;
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
			ctx.drawImage(unitDesc.image[0], this.x + tileSize/5, this.y + tileSize/5, tileSize- 2*tileSize/5, tileSize - 2*tileSize/5);
			ctx.font = "20px Arial";
			var price = "$" + this.cost;
			ctx.fillText(price, this.x + tileSize - tileSize/2-ctx.measureText(price).width/2, this.y + tileSize-10);
			if(this.statusCounter > 0){
				this.statusCounter--;
			}
			else if(this.failed || this.succeed){
				this.failed = false;
				this.succeed = false;
			}
		}
	}

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
	var playerUnits =	[];
	var enemyUnits	=	[];
	var unitButtons =	[];
	var bossHp		=	100;

	canvas.width 	= 	width;
	canvas.height 	= 	height;

	var bg = new Image();
	bg.onload = imageLoadCallback;
	bg.src = "assets/background.png";
	var stevo = [];
	for(var i=0;i<3;i++){
		stevo.push(new Image());
		stevo[i].onload = imageLoadCallback;
		stevo[i].src = "assets/" + (i+1) + ".png";
	}
	units.knight.image = stevo;
	var totalImages = 4;

	var imageLoadCallback = function() {
		imageCount++;
		console.log("Images loaded: " + imageCount + "/" + totalImages);
	}

	var init = function() {
		game.appendChild(canvas);
		unitButtons.push(new UnitButton(tileSize*0,0,units.knight,Knight));
		// unitButtons.push(new UnitButton(tileSize*1,0,units.archer,Archer));
		enemyUnits.push(new Knight(2000,tileSize));
		console.log(units.knight.image);
	}

	var loop = function () {
		update();
		draw();
	}

	var update = function() {
		now = new Date();

		if(mouseX <= tileSize && offset > 0)
			offset-=scrollSpeed;
		else if(mouseX >= width - tileSize && offset < widthT*tileSize-width)
			offset+=scrollSpeed;

		var delta = now - before;
		if(delta > interval){
			while(delta>interval){
				for(var i=0;i<playerUnits.length;i++){
					var canMove = true;
					for(var j=0;j<playerUnits.length;j++){
						if(i!=j && collide(playerUnits[i].x,playerUnits[i].y,playerUnits[j].x,playerUnits[j].y) && playerUnits[i].x<playerUnits[j].x){
							canMove = false;
							break;
						}
					}
					for(var j=0;j<enemyUnits.length;j++){
						if(collide(playerUnits[i].x,playerUnits[i].y,enemyUnits[j].x-10,enemyUnits[j].y)){
							canMove = false;
							break;
						}
					}
					if(canMove)
						playerUnits[i].x += playerUnits[i].speed;
					playerUnits[i].update();
				}
				for(var i=0;i<enemyUnits.length;i++){
					var canMove = true;
					for(var j=0;j<enemyUnits.length;j++){
						if(i!=j && collide(enemyUnits[i].x,enemyUnits[i].y,enemyUnits[j].x,enemyUnits[j].y) && enemyUnits[i].x>enemyUnits[j].x){
							canMove = false;
							break;
						}
					}
					for(var j=0;j<playerUnits.length;j++){
						if(collide(enemyUnits[i].x,enemyUnits[i].y,playerUnits[j].x+10+tileSize,playerUnits[j].y)){
							canMove = false;
							break;
						}
					}
					if(canMove)
						enemyUnits[i].x -= enemyUnits[i].speed;
					enemyUnits[i].update();
				}
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

		// draw UI
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,tileSize*widthT,tileSize);
		for(var i=0;i<unitButtons.length;i++){
			unitButtons[i].draw();
		}
		ctx.font = "20px Arial";
		ctx.fillStyle = "#fff"
		ctx.fillText("$" + money,tileSize*7,tileSize/2);

		setTimeout(update,interval);
	}

	var resizeCallback = function() {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		tileSize = Math.floor(height/heightT);
		for(var i=0;i<unitButtons.length;i++) {
			unitButtons[i].x = i*tileSize;
		}
		update();
		draw();
	}

	canvas.onmousemove = function(e) {
		mouseX = e.x;
		mouseY = e.y;
	}
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
	}

 	window.onresize = resizeCallback;
	init();
	loop();
})();