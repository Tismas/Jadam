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
			if(boss.x <= this.x + this.range)
				return boss;
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
			this.frame = 5;
			target.hp -= this.dmg;
			if(target.hp <= 0 && (enemyUnits.indexOf(target) != -1 || target == boss))
				money += target.reward;
			var halfOfWidth = target.width/2 || tileSize/2, halfOfHeight = target.height/2 || tileSize/2;
			particles.push(new DamageDisplay(target.x+halfOfWidth,target.y+halfOfHeight,this.dmg));
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
		
		if(this.hp <= 0 || this.x < 0)
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