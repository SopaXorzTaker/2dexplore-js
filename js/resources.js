function loadImage(url){
	var img = new Image();
	img.src = url;
	return img;
}

var tileTextures = {
	"air": loadImage("textures/air.png"),
	"dirt": loadImage("textures/dirt.png"),
	"stone": loadImage("textures/stone.png"),
	"grass": loadImage("textures/grass.png"),
	"glass": loadImage("textures/glass.png"),
	"water": loadImage("textures/water.png"),
	"lava": loadImage("textures/lava.png")
};

var entityTextures = {
	"player": [loadImage("textures/f1r.png"), loadImage("textures/f2r.png"), loadImage("textures/f3r.png")],
	"player_flipped": [loadImage("textures/f1l.png"), loadImage("textures/f2l.png"), loadImage("textures/f3l.png")]
};
