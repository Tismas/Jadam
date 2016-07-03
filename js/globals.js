var units = {};	// JSON's
var stevo = [], sword = [], bg = new Image(), hpBorder = new Image(), coin = new Image(), anvil = [new Image(), new Image()], boss = [];
var totalFiles 	= 16;

var filesLoaded = 0;
var game 		=	document.getElementById('game');
var canvas 		= 	document.createElement('canvas');
var ctx 		= 	canvas.getContext('2d');
var imageCount	=	0;
var heightT 	= 	6;	// rows+1
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

var money		=	1000;
var isAnvilClicked	=	0;
var anvilX		=	0;
var playerUnits =	[];
var enemyUnits	=	[];
var unitButtons =	[];
var particles	=	[];
var bossHp		=	100;

var collide = function(x1,y1,x2,y2) {
	if(x2 < x1 + tileSize && x2 > x1 && y2 < y1 + tileSize && y2 >= y1)
		return true;
	return false;
}