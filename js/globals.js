var units = {},
stevo = [], sword = [], bg = new Image(), hpBorder = new Image(), coin = new Image(), anvil = [new Image(), new Image()], boss = [],
totalFiles 	= 22,

filesLoaded = 0;
game 		=	document.getElementById('game'),
canvas 		= 	document.createElement('canvas'),
ctx 		= 	canvas.getContext('2d'),
imageCount	=	0,
heightT 	= 	6,	// rows+1
widthT		=	30,
width 		= 	window.innerWidth,
height 		= 	window.innerHeight,
offset		=	0,
interval    = 	1000/30,
tileSize    =  	Math.floor(height/heightT),
mouseX		=	0,
mouseY		=	0,

activeRow	=	1,
scrollSpeed =	15,
now			=	new Date(),
before		=	new Date(),

money		=	1000,
isAnvilClicked	=	0,
anvilX		=	0,
playerUnits =	[],
enemyUnits	=	[],
unitButtons =	[],
particles	=	[],
bossHp		=	100;

var collide = function(x1,y1,x2,y2) {
	if(x2 < x1 + tileSize && x2 > x1 && y2 < y1 + tileSize && y2 >= y1)
		return true;
	return false;
}
var collideEntities = function(entity1, entity2) {
	if((entity1.x + tileSize >= entity2.x && entity2.x > entity1.x || entity1.x - tileSize <= entity2.x && entity1.x > entity2.x) && entity1.y == entity2.y)
		return true;
	return false;
}