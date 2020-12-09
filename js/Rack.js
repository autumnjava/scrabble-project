import Tile from "./Tile.js";

export default class Rack {
  tiles = [...new Array(9)].map(() => { null });
  maxTiles = 7;
  pickedUp = null;
  overID = null;
  tilesToChange = [];

  async render(pointer) {
    $('rack').remove();
    let tiles = this.tiles;
    let rack = $('<rack></rack>');
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      rack.append(`
        <div id="${i}">
          <tile id="${i}" class="${tile ? 'draggable' : 'empty'}">
            <char>${tile ? tile.char : ''}</char>
            <points>${tile ? tile.points : ''}</points>
          </tile>
        </div>
      `);
    }
    await pointer.append(rack);
    this.adjustTiles();
  }

  adjustTiles() {
    $('rack').children().each(function () {
      let that = $(this);
      let width = that.width();
      that.height(width);
      that.children().each(function () {
        let that = $(this);
        let charSize = (parseInt(that.width(), 10) * 0.95) + 'px';
        let pointSize = (parseInt(that.width(), 10) * 0.25) + 'px';
        that.children('char').each(function () {
          $(this).css('font-size', charSize);
          $(this).css('line-height', charSize);
        });
        that.children('points').each(function () {
          $(this).css('font-size', pointSize);
          $(this).css('line-height', pointSize);
        });
      });
    });
  }

  addTiles(tiles) {
    let that = this;
    if (this.getNumberOfTiles() + tiles.length) {
      tiles.forEach(tile => {
        that.addTile(tile);
      });
    }
  }

  addTile(tile) { let tiles = this.tiles; if (this.getNumberOfTiles() < this.maxTiles) { tiles[this.getFirstEmpty()] = tile; } }

  getNumberOfTiles() {
    let count = 0;
    let tiles = this.tiles;
    for (let tile of tiles) {
      if (tile) {
        count++;
      }
    }
    return count;
  }

  getFirstEmpty() { let tiles = this.tiles; for (let i = 0; i < tiles.length; i++) { if (!tiles[i]) { return i; } } }

  switchTiles(from, to) {
    let that = this;
    if (from != to) {
      let tiles = that.tiles;
      //Check if moving to empty slot, else switch positions
      if (!tiles[to]) { tiles[to] = tiles[from]; tiles[from] = null; } else {
        let temp = tiles[from];
        tiles[from] = tiles[to];
        tiles[to] = temp;
      }
    }
  }
}

$(window).resize(function () {
  $('rack').children().each(function () {
    let that = $(this);
    let width = that.width();
    that.height(width);
    that.children().each(function () {
      let that = $(this);
      let charSize = (parseInt(that.width(), 10) * 0.95) + 'px';
      let pointSize = (parseInt(that.width(), 10) * 0.25) + 'px';
      that.children('char').each(function () {
        $(this).css('font-size', charSize);
        $(this).css('line-height', charSize);
      });
      that.children('points').each(function () {
        $(this).css('font-size', pointSize);
        $(this).css('line-height', pointSize);
      });
    });
  });
});
