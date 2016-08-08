const TEXTURE_SIZE = 32;

const TILE_AIR = 0;
const TILE_DIRT = 1;
const TILE_STONE = 2;
const TILE_GRASS = 3;
const TILE_GLASS = 4;
const TILE_WATER = 5;
const TILE_WATER_STAT = 6;
const TILE_LAVA = 7;
const TILE_LAVA_STAT = 8;
const TILE_LOG = 9;
const TILE_LEAVES = 10;
const TILE_SAND = 11;

var tileList = new TileList(TEXTURE_SIZE);

tileList.registerTile(new Tile("air", tileTextures["air"], false));
tileList.registerTile(new Tile("dirt", tileTextures["dirt"]));
tileList.registerTile(new Tile("stone", tileTextures["stone"]));
tileList.registerTile(new Tile("grass", tileTextures["grass"]));
tileList.registerTile(new Tile("glass", tileTextures["glass"]));
tileList.registerTile(new Tile("water", tileTextures["water"], false, true, true));
tileList.registerTile(new Tile("water_stat", tileTextures["water"], false, true, false));
tileList.registerTile(new Tile("lava", tileTextures["lava"], false, true, true));
tileList.registerTile(new Tile("lava_stat", tileTextures["lava"], false, true, false));
tileList.registerTile(new Tile("log", tileTextures["log"]));
tileList.registerTile(new Tile("leaves", tileTextures["leaves"]));
tileList.registerTile(new Tile("sand", tileTextures["sand"], true, false, false, true));
