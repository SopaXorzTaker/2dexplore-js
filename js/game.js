const WORLD_X = 64; // tiles
const WORLD_Y = 64;

var world;
var worldRenderer;
var canvas;

var hasStorage = (window.localStorage !== null)

var currentTile = 0;

function newWorld() {
	world = new World(WORLD_X, WORLD_Y, tileList, populate);
	world.player.setTexture("player", 3);
	world.player.setX(0);
	world.player.setY(0);

	worldRenderer = new WorldRenderer(world, canvas, tileList, entityTextures, TEXTURE_SIZE);
}

function populate() {
	for (var x = 0; x < this.getTiles().width; x++) {
		for (var y = 0; y < this.getTiles().height; y++) {
			if (y == 7 && x % 9 == 0 && Math.floor(Math.random()*8) == 4) {
				for (var y2 = y; y2 > 4; y2--) {
					this.getTiles().setTile(x, y2, TILE_LOG);
				}

				for (; y2 < 6; y2++) {
					for (var x2 = x-2; x2 < x+3; x2++) {
						if (x2 != x) {
							this.getTiles().setTile(x2, y2, TILE_LEAVES);
						}
					}
				}

				this.getTiles().setTile(x, y2-2, TILE_LEAVES);
				this.getTiles().setTile(x, y2-4, TILE_LEAVES);

				for (x2 = x-1; x2 < x+2; x2++) {
					this.getTiles().setTile(x2, y2-3, TILE_LEAVES);
				}


			} else if (y == 8) {
				this.getTiles().setTile(x, y, Math.floor(Math.random()*64)==32?TILE_WATER:TILE_GRASS);
			} else if (y > 7) {
				if (Math.floor(Math.random()*128) == 64) {
					this.getTiles().setTile(x, y, Math.random()>0.5?TILE_WATER:TILE_LAVA);
				} else {
					this.getTiles().setTile(x, y, Math.random()>0.5?TILE_DIRT:TILE_STONE);
				}
			}
		}
	}
}

function initGame() {
	setInterval(function() {render();}, 1000.0/30.0); // 30 FPS
	setInterval(function() {tick();}, 1000.0/5.0); // ticks 5 times per second
}

function checkBounds(x, min, max) {
	return ((x >= min) && (x < max));
}

function move(direction) {
	var player = world.getPlayer();
	var x = player.getX();
	var y = player.getY();

	var checkTileX, checkTileY;

	var tileUnderX = Math.floor(x/TEXTURE_SIZE);
	var tileUnderY = Math.floor(y/TEXTURE_SIZE) + 1;
	var tileUnder = world.getTiles().checkBounds(tileUnderX, tileUnderY)?world.getTiles().getTile(tileUnderX, tileUnderY):null;

	player.setFacing(direction);

	checkTileX = Math.floor(x / TEXTURE_SIZE);
	checkTileY = Math.floor(y / TEXTURE_SIZE);

	switch(direction) {
		case 0:
			player.setTextureFrame(0);
			y -= TEXTURE_SIZE;
			break;
		case 1:
			player.setTexture("player_flipped", 3);
			player.nextTextureFrame();
			x -= TEXTURE_SIZE/8;
			break;
		case 2:
			playes.setTextureFrame(0);
			y += TEXTURE_SIZE;
			break;
		case 3:
			player.setTexture("player", 3);
			player.nextTextureFrame();
			x += TEXTURE_SIZE/8;
			checkTileX = Math.ceil(x / TEXTURE_SIZE);
			break;
	}


	if (world.getTiles().checkBounds(checkTileX, checkTileY)) {
		var tile = world.getTiles().getTile(checkTileX, checkTileY);
		if (!(tileList.getTile(tile).getOpaque())) {
			if ((direction == 0 && tileUnder != null && tileList.getTile(tileUnder).getOpaque()) || direction != 0) {
				player.setX(x);
				player.setY(y);
			}
		}
		scrollMap();
	}
}

function scrollMap() {
	var player = world.getPlayer();
	var x = player.getX();
	var y = player.getY();

	if (y <= worldRenderer.getViewportY()) {
		worldRenderer.setViewportY(y - (2 * TEXTURE_SIZE));
	} else if (y >= (worldRenderer.getViewportY() + canvas.height - TEXTURE_SIZE)) {
		worldRenderer.setViewportY((worldRenderer.getViewportY() + (y - worldRenderer.getViewportY())) - (2 * TEXTURE_SIZE));
	}

	if (x < worldRenderer.getViewportX()) {
		worldRenderer.setViewportX(x);
	} else if (x >= (worldRenderer.getViewportX() + canvas.width - TEXTURE_SIZE)) {
		worldRenderer.setViewportX(worldRenderer.getViewportX() + (x - worldRenderer.getViewportX()));
	}
}

function tick() {
	world.tick();
	scrollMap();
}

function save() {
	if (hasStorage) {
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

function load() {
	if (hasStorage) {
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

function hasSavedGame() {
	return hasStorage && (localStorage.getItem("save") != null);
}

function drawDebug() {
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, 24);
	ctx.fillStyle = "#ffffff";
	ctx.font = "14px Tahoma";
	ctx.fillText("Current Tile: " + tileList.getTile(currentTile).getName() + " Viewport: " +
		worldRenderer.getViewportX() + ", " + worldRenderer.getViewportY() + " Player position: " + world.player.getX() + ", " + world.player.getY(), 0, 16);
}

function render() {
	worldRenderer.redraw(); // draw the map
	drawDebug();
}

function keydown(evt) {
	switch(evt.which) {
		case 87: // W
			move(0);
			break;
		case 65: // A
			move(1);
			break;
		case 83: // S
			move(2);
			break;
		case 68: // D
			move(3);
			break;
		case 88:
			currentTile--;
			currentTile = currentTile>=0?currentTile:tileList.length()-1;
			break;
		case 90:
			currentTile = (currentTile + 1) % tileList.length();
			break;
		case 81:
			newWorld();
			break;

	}
}

function click(evt) {
	var rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;

	var tileX = Math.floor((worldRenderer.getViewportX() + x) / TEXTURE_SIZE);
	var tileY = Math.floor((worldRenderer.getViewportY() + y) / TEXTURE_SIZE);

	switch(evt.which) {
		case 1:
			if (world.getTiles().getTile(tileX, tileY) == 0) {
				world.getTiles().setTile(tileX, tileY, currentTile);
			}
			break;

		case 2:
			currentTile = world.getTiles().getTile(tileX, tileY);
			break;
		case 3:
			world.getTiles().setTile(tileX, tileY, 0);
			break;
	}
	evt.preventDefault(); // context-menu handler destroys the fun stuff
	//return false;
}

function onLoad() {
	canvas = document.getElementById("gameCanvas");
	document.body.addEventListener("keydown", keydown);
	canvas.addEventListener("mousedown", click);
	canvas.addEventListener("contextmenu", function(evt) {evt.preventDefault();});
	window.onbeforeunload = beforeUnload;
	initGame();
	if (!hasSavedGame()) {
		newWorld();
	} else {
		load();
	}
}

function beforeUnload() {
	save();
}
