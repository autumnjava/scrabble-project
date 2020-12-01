import Tile from "./Tile.js";

export default class Rack {
  tiles = [];

  render(pointer) {
    $('rack').remove();
    let rack = $(`
      <rack>
        <tile id="0">A</tile>
        <tile id="1">B</tile>
        <tile id="2">C</tile>
        <tile id="3">D</tile>
        <tile id="4">E</tile>
        <tile id="5">F</tile>
        <tile id="6">G</tile>
        <tile id="7" class="empty"></tile>
        <tile id="8" class="empty"></tile>
      </rack>
    `);
    pointer.append(rack);
  }

  addTile(tile) {
    let tiles = this.tiles;
    if (tiles.length <= 7) {
      tiles.push(tile);
    }
  }
}