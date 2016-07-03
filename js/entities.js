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