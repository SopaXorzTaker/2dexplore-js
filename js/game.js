const WORLD_X = 64; // tiles
const WORLD_Y = 64;

var world;
var worldRenderer;
var canvas;

var hasStorage = (window.localStorage !== null)

var currentTile = 0;

function newWorld(){
	world = new World(WORLD_X, WORLD_Y, tileList, populate);
	world.player.setTexture("player");
	world.player.setX(0);
	world.player.setY(0);

	worldRenderer = new WorldRenderer(world, canvas, tileList, entityTextures, TEXTURE_SIZE);
}

function populate(){
	for (var x = 0; x < this.getTiles().width; x++){
		for (var y = 0; y < this.getTiles().height; y++){
			 if (y == 8){
				this.getTiles().setTile(x, y, TILE_GRASS);
			} else if (y > 7){
				this.getTiles().setTile(x, y, Math.random()>0.5?TILE_DIRT:TILE_STONE);
			}
		}
	}
}

function initGame(){
	setInterval(function(){render();}, 1000.0/30.0); // 30 FPS
	setInterval(function(){tick();}, 1000.0/5.0); // ticks 20 times per second
}

function checkBounds(x, min, max){
	return ((x >= min) && (x < max));
}

function isInZone(x, y, x1, y1, width, height) {
	return (x >= x1) && (x < (x1 + width)) && (y >= y1) && (y < (y1 + height));
}

function move(direction){
	console.log(direction);
	var player = world.getPlayer();
	var x = player.getX();
	var y = player.getY();
	
	var tileUnderX = Math.floor(x/TEXTURE_SIZE);
	var tileUnderY = Math.floor(y/TEXTURE_SIZE) + 1;
	var tileUnder = world.checkBounds(tileUnderX, tileUnderY)?world.getTiles().getTile(tileUnderX, tileUnderY):null;
	
	player.setFacing(direction);
	
	switch(direction){
		case 0:
			y -= TEXTURE_SIZE;
			break;
		case 1:
			x -= TEXTURE_SIZE;
			break;
		case 2:
			player.setTexture("player_flipped");
			x -= TEXTURE_SIZE;
			break;
		case 3:
			player.setTexture("player");
			x += TEXTURE_SIZE;
			break;
	}
	
	if (world.checkBounds(Math.floor(x/TEXTURE_SIZE), Math.floor(y/TEXTURE_SIZE))) {
		var tile = world.getTiles().getTile(Math.floor(x/TEXTURE_SIZE), Math.floor(y/TEXTURE_SIZE));
		if (!(tileList.getTile(tile).getOpaque())){
			if ((direction == 0 && tileUnder != null && tileList.getTile(tileUnder).getOpaque()) || direction != 0){
				player.setX(x);
				player.setY(y);
			}
		}
		scrollMap();
	}
}

function scrollMap(){
	var player = world.getPlayer();
	var x = player.getX();
	var y = player.getY();
	
	if (y <= worldRenderer.getViewportY()){
		worldRenderer.setViewportY(y - (2 * TEXTURE_SIZE));
	} else if (y >= (worldRenderer.getViewportY() + canvas.height - TEXTURE_SIZE)) {
		worldRenderer.setViewportY((worldRenderer.getViewportY() + (y - worldRenderer.getViewportY())) - (2 * TEXTURE_SIZE));
	}
	
	if (x < worldRenderer.getViewportX()){
		worldRenderer.setViewportX(x);
	} else if (x >= (worldRenderer.getViewportX() + canvas.width - TEXTURE_SIZE)) {
		worldRenderer.setViewportX(worldRenderer.getViewportX() + (x - worldRenderer.getViewportX()));
	}
}

function tick(){
	world.tick();
	scrollMap();
}

function save(){
	if (hasStorage){
		var player = world.getPlayer();
		var tiles = world.getTiles();
		
		var obj = {
			"playerPos": [player.x, player.y],
			"tiles": {
					"tiles": Array.from(tiles.getArray()),
					"width": tiles.getWidth(),
					"height": tiles.getHeight()
			}
		};
		
		localStorage.setItem("save", JSON.stringify(obj))
		
	}
	
}

function load(){
	if (hasStorage){
			var json = localStorage.getItem("save");
			if (json) {
				var obj = JSON.parse(json);
				var oldTiles = obj["tiles"];
				var tileMap = new TileMap(oldTiles["width"], oldTiles["height"], Int8Array.from(oldTiles["tiles"]));
				var playerX = obj["playerPos"][0];
				var playerY = obj["playerPos"][1];
				world = new World(WORLD_X, WORLD_Y, tileList, null, tileMap);
				world.player.setTexture("player");
				world.player.setX(playerX);
				world.player.setY(playerY);
				worldRenderer = new WorldRenderer(world, canvas, tileList, entityTextures, TEXTURE_SIZE);
			}
	}
}

function hasSavedGame(){
	return hasStorage && (localStorage.getItem("save") != null);
}

function drawDebug(){
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, 24);
	ctx.fillStyle = "#ffffff";
	ctx.font = "14px Tahoma";
	ctx.fillText("Current Tile: " + tileList.getTile(currentTile).getName() + " Viewport: " +
		worldRenderer.getViewportX() + ", " + worldRenderer.getViewportY() + " Player position: " + world.player.getX() + ", " + world.player.getY(), 0, 16);
}

function render(){
	worldRenderer.redraw(); // draw the map
	drawDebug();
}


function click(evt){
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	console.log(x, y);
	if (isInZone(x, y, 0, 0, 32, 32)){
		newWorld();
	} else if (isInZone(x, y, canvas.width-32, canvas.height-32, 32, 32)){
		currentTile = (currentTile + 1) % tileList.length();
	} else if (isInZone(x, y, canvas.width/2-50, 0, 50, 50)) {
		move(0);
	} else if (isInZone(x, y, canvas.width/2-50, canvas.height-50, 50, 50)) {
		move(1);
	} else if (isInZone(x, y, 0, canvas.height/2-150, 150, 150)) {
		move(2);
	} else if (isInZone(x, y, canvas.width-150, canvas.height/2-150, 150, 150)) {
		move(3);
	} else {
	
		var tileX = Math.floor((worldRenderer.getViewportX() + x) / TEXTURE_SIZE);
		var tileY = Math.floor((worldRenderer.getViewportY() + y) / TEXTURE_SIZE);
		if (world.getTiles().getTile(tileX, tileY) == 0){
			world.getTiles().setTile(tileX, tileY, currentTile);
		}
	}
	evt.preventDefault();
}

function doubleClick(){
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	var tileX = Math.floor((worldRenderer.getViewportX() + x) / TEXTURE_SIZE);
	var tileY = Math.floor((worldRenderer.getViewportY() + y) / TEXTURE_SIZE);
	if (world.getTiles().getTile(tileX, tileY) == 0){
		world.getTiles().setTile(tileX, tileY, currentTile);
	}
}

function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function onLoad(){
	canvas = document.getElementById("gameCanvas");
	resize();
	
	canvas.addEventListener("mousedown", click);
	canvas.addEventListener("contextmenu", function(evt){evt.preventDefault();});
	window.onbeforeunload = beforeUnload;
	window.onresize = resize;
	initGame();
	if (!hasSavedGame()){
		newWorld();
	} else {
		load();
	}
}

function beforeUnload(){
	save();
}