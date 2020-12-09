import Rack from "./Rack.js";
import TileChanger from "./TileChanger.js";

export default class Player {
  rack = new Rack();
  changer = new TileChanger();
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
    await $('game right').prepend(player);
    player.append(`<info><name>Player: ${this.name}</name><points>Points: ${this.points}</points></info>`);
    await this.changer.render();
    this.rack.render(player);
  }

  getName() { return this.name; }

  addTiles(tiles) {
    this.rack.addTiles(tiles);
  }

  addTile(tile) { this.rack.addTile(tile); }
}