import Tile from "./Tile.js";

export default class TileBag {
  constructor() {
    this.tiles = this.createTiles();
    this.tiles.forEach(tile => {
      console.log(tile);
    });
  }

  createTiles() {
    let tiles = [];
    $.get('tiles.txt', function (data) {
      data.split('\r').join('').split('\n').forEach(x => {
        x = x.split(' ');
        x[0] = x[0] === '_' ? ' ' : x[0];
        // add tiles to this.tiles
        while (x[2]--) {
          let char = x[0];
          let points = +x[1];
          let tile = new Tile(char, points);

          tiles.push(tile);
        }
      });
    });
    return tiles;
  }

  shuffleRandom() { this.tiles.sort(() => Math.random() - 0.5); }

  getTiles() { return this.tiles; }
}