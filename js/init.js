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
	for(var i=0;i<3;i++) {
		stevo.push(new Image());
		stevo[i].onload = fileLoadCallback;
		stevo[i].src = "assets/" + (i+1) + ".png";
	}
	for(var i=3;i<6;i++) {
		stevo.push(new Image());
		stevo[i].onload = fileLoadCallback;
		stevo[i].src = "assets/fightstance" + (i-2) + ".png";
	}
	units.knight.image = stevo;
	for(var i=0;i<3;i++) {
		sword.push(new Image());
		sword[i].onload = fileLoadCallback;
		sword[i].src = "assets/sword_position" + (i+1) + ".png";
	}
	units.knight.weapon = sword;
	anvil[0].onload = fileLoadCallback;
	anvil[0].src = "assets/anvil.png";
	anvil[1].onload = fileLoadCallback;
	anvil[1].src = "assets/anvil2.png";
	hpBorder.onload = fileLoadCallback;
	hpBorder.src = "assets/hp.png";
	coin.onload = fileLoadCallback;
	coin.src = "assets/moneta1.png";
	
	for(var i=0;i<4;i++){
		boss.push(new Image());
		boss[i].onload = fileLoadCallback;
		boss[i].src = "assets/boss" + (i+1) + ".png";
	}
	
	init();
}

var init = function() {
	canvas.width  = width;
	canvas.height = height;
	game.appendChild(canvas);

	unitButtons.push(new UnitButton(tileSize*0,0,units.knight,Knight));

	window.onresize = resizeCallback;
	update();
	draw();
}

loadFiles();