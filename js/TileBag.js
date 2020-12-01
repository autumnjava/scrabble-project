export default class TileBag {
  tiles = [];

  constructor() {
    this.tiles = this.createTiles();
  }

  createTiles() {
    let tiles = [];
    $.get('tiles.txt', function (data) {
      let content = data.split('\r').join('').split('\n').forEach(x => {
        x = x.split(' ');
        x[0] = x[0] === '_' ? ' ' : x[0];
        // add tiles to this.tiles
        while (x[2]--) {
          tiles.push({ char: x[0], points: +x[1] })
        }
      });
    });
    return tiles;
  }

  shuffleRandom() { this.tiles.sort(() => Math.random() - 0.5); }

  getTiles() { return this.tiles; }
}