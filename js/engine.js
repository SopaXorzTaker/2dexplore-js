Entity = function(world){
	this.x = 0;
	this.y = 0;
	this.world = world;
};

Entity.prototype.textureName = null;
Entity.prototype.tick = function(){};
	
Entity.prototype.getX = function(){
	return this.x;
};
	
Entity.prototype.getY = function(){
	return this.y;
};
Entity.prototype.setX = function(x){
	this.x = x;
};
	
Entity.prototype.setY = function(y){
	this.y = y;
};
	
Entity.prototype.getWorld = function(){
	return this.world;
};


GenericEntity = function(world){
	Entity.call(this, world);
	this.facing = 0;
};

GenericEntity.prototype = new Entity();
GenericEntity.prototype.tick = function(){
	var x = this.x;
	var y = this.y;
	var textureSize = this.world.getTileList().getTextureSize();
	var tileX = Math.floor(x / textureSize);
	var tileY = Math.floor(y / textureSize);
	tileY++; // tile underneath 
	if (this.world.checkBounds(tileX, tileY)){
		var tileUnder = this.world.getTileList().getTile(this.world.getTiles().getTile(tileX, tileY));
		if (!tileUnder.getOpaque()){
			this.y += textureSize;
		}
	}
};

GenericEntity.prototype.getFacing = function(){
	return this.facing;
};

GenericEntity.prototype.setFacing = function(facing){
	this.facing = facing;
};

GenericEntity.prototype.setTexture = function (textureName){
	this.textureName = textureName;
};

PlayerEntity = function(world){
	GenericEntity.call(this, world);
	this.facing = 0;
	this.textureFlipped = false;
};

PlayerEntity.prototype = new GenericEntity();


TileMap = function(width, height, tiles){
	this.width = width;
	this.height = height;
	this.tiles = tiles != null?tiles:new Int8Array(width*height);
};

TileMap.prototype.getTile = function(x, y){
	return this.tiles[x + y*this.width];
};

TileMap.prototype.setTile = function(x, y, tile){
	this.tiles[x + y*this.width] = tile;
};

TileMap.prototype.getWidth = function(){
	return this.width;
};

TileMap.prototype.getHeight = function(){
	return this.height;
};

TileMap.prototype.getArray = function(){
	return this.tiles;
};

World = function(width, height, tileList, populate, tileMap, entities){
	this.player = entities?entities[0]:new PlayerEntity(this);
	this.tileMap = tileMap != null?tileMap:new TileMap(width, height);
	this.entities = entities || [];
	this.tileList = tileList;
	this.populate = populate;
	if (populate) populate.call(this);
	if (!entities){
		this.entities.push(this.player);
	};
};


World.prototype.tick = function(){
	this.entities.forEach(function(entity, i, array){
		entity.tick();
	});
};
	
World.prototype.getTiles = function(){
	return this.tileMap;
};
	
World.prototype.getEntities = function(){
	return this.entities;
};
	
World.prototype.getPlayer = function(){
	return this.player;
};
	
World.prototype.getTileList = function(){
	return this.tileList;
};
	
World.prototype.checkBounds = function(x, y){
	var tileMap = this.getTiles();
	return ((0 <= x) && (x < tileMap.getWidth()) && (0 <= y) && (y < tileMap.getHeight()));
};

World.prototype.repopulate = function(){
	this.populate.call(this);
};



WorldRenderer = function(world, canvas, tileList, entityTextures){
	this.world = world;
	this.canvas = canvas;
	this.tileList = tileList;
	this.viewportX = 0;
	this.viewportY = 0;
	this.entityTextures = entityTextures;
	this.textureSize = tileList.getTextureSize();
};

	
WorldRenderer.prototype.getViewportX = function(){
	return this.viewportX;
};
	
WorldRenderer.prototype.getViewportY = function(){
	return this.viewportY;
};
	
WorldRenderer.prototype.setViewportX = function(viewportX){
	this.viewportX = viewportX;
};
	
WorldRenderer.prototype.setViewportY = function(viewportY){
	this.viewportY = viewportY;
};
	
WorldRenderer.prototype.redraw = function(){
	var areaX = Math.floor(this.viewportX / this.textureSize);
	var areaY = Math.floor(this.viewportY / this.textureSize);
	var areaEndX = areaX + Math.floor(this.canvas.width / this.textureSize);
	var areaEndY = areaY + Math.floor(this.canvas.height / this.textureSize);
	
	var tileMap = this.world.getTiles();
	var entities = this.world.getEntities();
	
	var ctx = this.canvas.getContext("2d");
	
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	for (var x = areaX; x < areaEndX; x++){
		for (var y = areaY; y < areaEndY; y++){
			if ((0 <= x) && (x < tileMap.width) && (0 <= y) && (y < tileMap.width)){
				var tileId = tileMap.getTile(x, y);
				var texture = this.tileList.getTile(tileId).getTexture();
				ctx.drawImage(texture, x*this.textureSize - this.viewportX, y*this.textureSize - this.viewportY);
			}
		}
	}
			
	entities.forEach(function(entity, i, array){
		if ((this.viewportX <= entity.getX()) && (this.viewportY <= entity.getY())){
			ctx.drawImage(this.entityTextures[entity.textureName], entity.getX() - this.viewportX, entity.getY() - this.viewportY);
		}
	}, this);
};

Tile = function(name, texture, isOpaque){
	this.name = name;
	this.texture = texture;
	this.isOpaque = isOpaque == null?true:isOpaque;
};

Tile.prototype.getName = function(){
	return this.name;
};
	
Tile.prototype.getTexture = function(){
	return this.texture;
};
	
Tile.prototype.getOpaque = function(){
	return this.isOpaque;
};

TileList = function(textureSize){
	this.tiles = [];
	this.textureSize = textureSize;
};

TileList.prototype.registerTile = function(tile){
	this.tiles.push(tile);
	return (this.tiles.length - 1);
};
	
TileList.prototype.getTile = function(tileId){
	return this.tiles[tileId];
};
	
TileList.prototype.length = function(){
	return this.tiles.length;
};

TileList.prototype.getTextureSize = function(){
	return this.textureSize;
};