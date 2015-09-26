const TEXTURE_SIZE = 32;

const TILE_AIR = 0;
const TILE_DIRT = 1;
const TILE_STONE = 2;
const TILE_GRASS = 3;

var tileList = new TileList(TEXTURE_SIZE);

tileList.registerTile(new Tile("air", tileTextures["air"], false));
tileList.registerTile(new Tile("dirt", tileTextures["dirt"]));
tileList.registerTile(new Tile("stone", tileTextures["stone"]));
tileList.registerTile(new Tile("grass", tileTextures["grass"]));
tileList.registerTile(new Tile("glass", tileTextures["glass"]));