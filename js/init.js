var loadFiles = function() {
	// images
	var bg = new Image();
	bg.onload = fileLoadCallback;
	bg.src = "assets/background.png";
	var stevo = [];
	for(var i=0;i<3;i++){
		stevo.push(new Image());
		stevo[i].onload = fileLoadCallback;
		stevo[i].src = "assets/" + (i+1) + ".png";
	}
	units.knight.image = stevo;
	var hpBorder = new Image();
	hpBorder.onload = fileLoadCallback;
	hpBorder.src = "assets/hp.png";
	var coin = new Image();
	coin.onload = fileLoadCallback;
	coin.src = "assets/moneta1.png";

	// JSONs
	$.ajax({
	  dataType: "json",
	  url: "data/heroes.json",
	  data: units,
	  success: fileLoadCallback(),
	});
	console.log(units);
}

var init = function() {
	loadFiles();
	canvas.width  = width;
	canvas.height = height;
	game.appendChild(canvas);

	unitButtons.push(new UnitButton(tileSize*0,0,units.knight,Knight));

	window.onresize = resizeCallback;
	update();
	draw();
}

init();