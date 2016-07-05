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