var loadFiles = function() {
	// JSONs
	$.getJSON( "https://tismas.github.io/data/heroes.json", function( data ) {
		$.each( data, function( key, val ) {
			units[key] = val;
		});
		fileLoadCallback();
		loadImages();
	}).fail(function(){
		console.log("Failed to load json");
	});;
}
var loadImages = function() {
	// images
	bg.onload = fileLoadCallback;
	bg.src = "assets/bgTile1.png";
	for(var i=0;i<6;i++) {
		stevo.push(new Image());
		stevo[i].onload = fileLoadCallback;
		stevo[i].src = "assets/stevo" + (i+1) + ".png";
	}
	units.knight.image = stevo;
	for(var i=0;i<6;i++) {
		sword.push(new Image());
		sword[i].onload = fileLoadCallback;
		sword[i].src = "assets/sword_position" + (i+1) + ".png";
	}
	units.knight.weapon = sword;
	for(var i=0;i<2;i++){
		anvil.img.push(new Image());
		anvil.img[i].onload = fileLoadCallback;
		anvil.img[i].src = "assets/anvil" + (i+1) + ".png";
	}
	hpBorder.onload = fileLoadCallback;
	hpBorder.src = "assets/hp.png";
	coin.onload = fileLoadCallback;
	coin.src = "assets/moneta1.png";
	
	for(var i=0;i<5;i++){
		boss.img.push(new Image());
		boss.img[i].onload = fileLoadCallback;
		boss.img[i].src = "assets/boss" + (i+1) + ".png";
	}
	
	init();
}

var init = function() {
	canvas.width  = width;
	canvas.height = height;
	frame.width = frameWidth;
	frame.height = frameHeight;
	setGameSize();
	c.font = "20px Bangers";

	game.appendChild(canvas);

	unitButtons.push(new UnitButton(tileSize*0,0,units.knight,Knight));

	window.onresize = resizeCallback;
	update();
	draw();
}

loadFiles();