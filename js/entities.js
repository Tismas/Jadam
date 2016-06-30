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
	this.moving = true;
	this.frame = 0;
	this.frameTime = 5;
	this.frameCnt = 0;
	this.frames = 3;

	this.attack = function(target) {
		if(this.timeToAttack == 0 && this.hp > 0) {
			this.timeToAttack = this.attackCooldown;
			target.hp -= this.dmg;
			if(target.hp <= 0 && enemyUnits.indexOf(target) != -1)
				money += target.reward;
			// TODO odpalene animacji ataku
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
			ctx.translate(this.x,-this.y)
			ctx.drawImage(this.image[this.frame], -(this.x-offset + tileSize/4), this.y + tileSize/4,tileSize,tileSize);
			ctx.fillRect(-(this.x-offset)-tileSize/5,this.y,this.hp/this.maxhp*(tileSize*0.75), 20);
			ctx.drawImage(hpBorder, -(this.x-offset)-tileSize/5, this.y, tileSize*0.75, 20);
			ctx.restore();

		}
		else{
			ctx.drawImage(this.image[this.frame], this.x-offset + tileSize/4, this.y + tileSize/4,tileSize,tileSize);
			ctx.fillRect(-offset + this.x+tileSize/3,this.y,this.hp/this.maxhp*(tileSize*0.75), 20);
			ctx.drawImage(hpBorder, -offset + this.x + tileSize/3, this.y, tileSize*0.75, 20);
		}
		ctx.fillStyle = "#0f0";
	}
	this.update = function() {
		if(this.timeToAttack != 0)
			this.timeToAttack--;
		if(this.hp<=0 || this.x >= widthT*tileSize || this.x < 0)
			this.die();
		if(!this.moving)
			this.frame = 0;
		else {
			this.frameCnt++;
			if(this.frameCnt>=this.frameTime){
				this.frame++;
				this.frameCnt=0;
				if(this.frame==this.frames) this.frame = 1;
			}
		}
	}
}