import Rack from "./Rack.js";
import Tile from "./Tile.js";

export default class Player {
  rack = new Rack();
  hasChangedTiles = false;

  constructor(name) {
    this.name = name;
    this.points = 0;
    this.correctWordCounter = 0;
    this.attemptCounter = 0;
    this.tilePoints = 0;
    this.tilesPlaced = [];
  }

  async render() {
    $('player').remove();
    let player = $(`<player></player>`);
    let panel = $(`<panel></panel>`);

    player.append(panel);

    this.rack.render(player);

    panel.append(`
      <info>
        <name>Player: ${this.name}</name>
        <points>Points: ${this.points}</points>
      </info>
    `);
    $('game right').append(player);
  }

  getName() { return this.name; }

  addTiles(tiles) {
    this.rack.addTiles(tiles);
  }

  addTile(tile) { this.rack.addTile(tile); }
}