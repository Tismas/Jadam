
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
		ctx.drawImage(unitDesc.image[0], this.x + tileSize/5, this.y + tileSize/10, tileSize- 2*tileSize/5, tileSize - 2*tileSize/5);
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