
var One = function(x,y) {
	this.x = x;
	this.y = y;
	this.origin = y;
}
One.prototype = {
	draw: function() {
		c.fillStyle = "rgba(255,255,255," + this.y / this.origin + ")";
		c.fillText("+1",this.x,this.y);
	},
	update: function() {
		this.y--;
		if(this.y <= 0){
			particles.splice(particles.indexOf(this),1);
			delete this;
		}
	}
}

var DamageDisplay = function(x,y,value) {
	this.x = x;
	this.y = y;
	this.dist = 0;
	this.value = value;
}
DamageDisplay.prototype = {
	draw: function() {
		c.fillStyle = "rgba(255,50,50," + this.dist/1 + ")";
		c.fillText("-" + this.value,this.x-offset,this.y-this.dist);
	},
	update: function() {
		this.dist+=3;
		if(this.dist >= tileSize/4){
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
	for(var i=0;i<unitButtons.length;i++)
		unitButtons[i].draw();

	c.fillStyle = "#fff"
	c.drawImage(coin, tileSize*4 + 10, tileSize/6, tileSize/5,tileSize/5);
	c.fillText(money, tileSize*4 + tileSize/5 + 10, tileSize/6+20);
	c.fillText("Level: " + level, tileSize*4 + tileSize/5 + 10, tileSize/6+60);

	anvil.draw();

	for(var i=0;i<particles.length;i++)
		particles[i].draw();

	drawBorder();
}