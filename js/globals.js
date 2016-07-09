var units 	= {},
stevo = [], sword = [], bg = new Image(), hpBorder = new Image(), coin = new Image(),
totalFiles 	= 	23,
keys 		=	{
	left: false,
	right: false,
},

filesLoaded = 	0;
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
scrollSpeed =	25,
now			=	new Date(),
before		=	new Date(),

level		=	1,
money		=	1000,
playerUnits =	[],
enemyUnits	=	[],
unitButtons =	[],
particles	=	[],
anvil 		=	{
	x: tileSize*5,
	y: 0,
	frame: 0,
	img: [],

	onclick: function() {
		if(this.frame == 0)
			setTimeout(this.unclick.bind(this), 100);
		money++;
		particles.push(new One(this.x + tileSize/8 + Math.random()*(tileSize/2), tileSize/2));
		this.frame = 1;
	},
	unclick: function() {
		this.frame = 0;
	},
	draw: function() {
		c.drawImage(this.img[this.frame],this.x,this.y,tileSize,tileSize);
	},
},
boss		=	{
	x: widthT*tileSize,
	y: tileSize,
	width: (heightT-1) * tileSize,
	height: (heightT-1) * tileSize,
	hp: 100,
	maxhp: 100,
	img: [],
	frame: 0,
	reward: 1000,
	attacking: false,

	draw: function() {
		if(boss.frame > 4) boss.frame = 0;
		c.drawImage(this.img[this.frame], this.x - offset, this.y, this.width, this.height);
		drawHpBar(this, this.width);
	},
	update: function() {
		if(this.hp <= 0) {
			level++;
			widthT += 10;
			this.hp = this.maxhp = Math.round(this.maxhp * Math.pow(Math.log(level+1),0.75));
			this.reward = Math.round(this.reward * Math.pow(Math.log(level+1),0.75));
			console.log(this.maxhp,this.hp);
			this.x = widthT*tileSize;
		}
	}
};
setInterval(function(){boss.frame++;},200);

var drawHpBar = function(entity, w) {
	var hpGradient = c.createLinearGradient(entity.x-offset,entity.y,entity.x-offset,entity.y+20),
		barWidth = w || tileSize;
	hpGradient.addColorStop(0.01,"black");
	hpGradient.addColorStop(0.5,"rgb(" + Math.round((entity.maxhp-entity.hp)/entity.maxhp*255) + "," + Math.round(entity.hp/entity.maxhp*255) + ",50)");
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
	rect.width = rect.width || tileSize;
	rect.height = rect.height || tileSize;
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
		&& ((rect1.y + rect1.height > rect2.y && rect1.y + rect1.height <= rect2.y + rect2.height) || (rect2.y + rect2.height > rect1.y && rect2.y + rect2.height <= rect1.y + rect1.height)))
		return true;
	return false;
}