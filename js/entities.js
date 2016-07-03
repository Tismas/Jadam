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
	this.attacking = false;
	this.swordFrame = 0;
	this.frame = 0;
	this.frameTime = 5;
	this.frameCnt = 0;
	this.frames = 3;

	this.attack = function(target) {
		if(this.timeToAttack == 0 && this.hp > 0 && target.attacking == false) {
			this.timeToAttack = this.attackCooldown;
			this.prepareNextAttack();
			this.attacking = true;
			setTimeout(this.strike.bind(this, target), 200);
		}
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
	this.prepareNextAttack = function() {
		this.frame = 4;
		this.swordFrame = 1;
		this.attacking = false;
	}
	this.die = function() {
		var index = playerUnits.indexOf(this);
		if(index != -1)
			playerUnits.splice(index,1);
		else {
			index = enemyUnits.indexOf(this);
			enemyUnits.splice(index,1);
		}
		delete this;
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
				ctx.drawImage(this.weapon[0], -(this.x - offset), this.y, tileSize,tileSize);
			}
			else{
				if(this.swordFrame == 2)
					ctx.drawImage(this.weapon[this.swordFrame], -(this.x - offset - tileSize/5), this.y, tileSize,tileSize);
				else
					ctx.drawImage(this.weapon[this.swordFrame], -(this.x - offset), this.y, tileSize,tileSize);
			}
			ctx.drawImage(this.image[this.frame], -(this.x-offset), this.y, tileSize, tileSize);
			ctx.fillRect(-(this.x - offset - tileSize/8),this.y,this.hp/this.maxhp*(tileSize*0.75), tileSize/8);
			ctx.drawImage(hpBorder, -(this.x - offset - tileSize/8), this.y, tileSize*0.75, tileSize/8);
			ctx.restore();

		}
		else{
			if(this.moving){
				if(this.frame>=3)
					this.frame = 1;
				ctx.drawImage(this.weapon[0], this.x - offset, this.y, tileSize,tileSize);
			}
			else{
				if(this.swordFrame == 2)
					ctx.drawImage(this.weapon[this.swordFrame], this.x - offset + tileSize/5, this.y, tileSize,tileSize);
				else
					ctx.drawImage(this.weapon[this.swordFrame], this.x - offset, this.y, tileSize,tileSize);
			}
			ctx.drawImage(this.image[this.frame], this.x-offset, this.y, tileSize, tileSize);
			ctx.fillRect(-offset + this.x + tileSize/8,this.y,this.hp/this.maxhp*(tileSize*0.75), tileSize/8);
			ctx.drawImage(hpBorder, -offset + this.x + tileSize/8, this.y, tileSize*0.75, tileSize/8);
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