import Tile from "./Tile.js";

export default class TileBag {
  async init() {
    this.tiles = [];
    let data = await $.get('tiles.txt')
    data.split('\r').join('').split('\n').forEach(x => {
      x = x.split(' ');
      x[0] = x[0] === '_' ? ' ' : x[0];
      // add tiles to this.tiles
      while (x[2]--) {
        let char = x[0];
        let points = +x[1];
        let tile = new Tile(char, points);

        this.tiles.push(tile);
      }
    });
  }

  shuffleRandom() { this.tiles.sort(() => Math.random() - 0.5); }

  addTiles(tiles) { for (let tile of tiles) { this.addTile(tile); } }

  addTile(tile) { this.tiles.push(tile); }

  getTiles() { return this.tiles; }

  getRandomTiles(quantity) {
    if (quantity > 0 && quantity <= 7 && quantity < this.tiles.length) {
      let randomTiles = [];
      for (let i = 0; i < quantity; i++) {
        let randomNumber = Math.floor(Math.random() * this.tiles.length);
        let randomTile = this.tiles.splice(randomNumber, 1)[0];
        randomTiles.push(randomTile);
      }
      return randomTiles;
    } else {
      console.log("You have to grab min 1 and max 7 tiles ...");
    }
  }
}