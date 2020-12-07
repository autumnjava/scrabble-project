import Tile from "./Tile.js";

export default class Rack {
  tiles = [...new Array(9)].map(() => { null });
  maxTiles = 7;
  dragging = false;
  pickedUp = null;
  overID = null;

  async render(pointer) {
    $('rack').remove();

    let rack = $('<rack></rack>');
    await pointer.prepend(rack);
    this.createPlaceHolders(rack);
    await this.drawTiles();

    $('rack').children().each(function () {
      let parent = $(this);
      parent.height(parent.width());
    });
    this.addDragEvents();
  }

  createPlaceHolders(rack) { for (let i = 0; i < this.tiles.length; i++) { rack.append(`<div id="${i}"><tile id="${i}" class="empty"></tile></div>`); } }

  async drawTiles() {
    let that = this;
    let tiles = that.tiles;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i]) {
        let currentTile = tiles[i];
        let pointer = $(`rack div[id="${i}"] tile[id="${i}"]`);
        pointer.children().each(function () { $(this).remove(); });
        pointer.removeClass("empty");
        pointer.addClass("draggable");
        await pointer.append(`<char>${currentTile.char}</char><points>${currentTile.points}</points>`);
      }
    }
    that.adjustTiles();
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
    console.log(from + " : " + to);
    if (from != to) {
      let tiles = that.tiles;
      if (!tiles[to]) { console.log('moving to empty slot ...'); tiles[to] = tiles[from]; tiles[from] = null; } else {
        let temp = tiles[from];
        tiles[from] = tiles[to];
        tiles[to] = temp;
      }
    }
  }

  //DRAG EVENTS
  addDragEvents() {
    let that = this;

    $('.draggable').draggabilly({ containment: 'body' })
      .on('dragStart', (e) => that.dragStart(e))
      .on('dragMove', (e, pointer) => that.dragMove(e, pointer))
      .on('dragEnd', (e, pointer) => that.dragEnd(e, pointer));
  }

  dragStart(e) {
    console.log("Picked up ...");
    let me = e.currentTarget;
    let $me = $(e.currentTarget);
    let name = me.localName;
    this.pickedUp = parseInt($me.attr('id'));
    let currentTile = this.tiles[this.pickedUp];

    $(me).css('z-index', 100);

    console.log(name + ", " + this.pickedUp + ", " + "tile: " + currentTile.char + ":" + currentTile.points);
  }

  dragMove(e, pointer) {
    let that = this;
    let { pageX: mouseX, pageY: mouseY } = pointer;
    let placeHolders = $('rack > div');

    for (let placeHolder of placeHolders) {
      let me = $(placeHolder);
      let id = parseInt(me.attr('id'));
      let tile = $(`tile[id="${id}"]`);
      let offset = me.offset();
      if (mouseX > offset.left && mouseX < offset.left + me.width() && mouseY > offset.top && mouseY < offset.top + me.height()) {
        that.overID = parseInt(me.attr('id'));
        if (tile.hasClass('empty')) { tile.removeClass('empty'); tile.addClass('empty-over'); }
        if (!tile.hasClass('over')) { tile.addClass('over'); }
      } else {
        if (tile.hasClass('empty-over')) { tile.removeClass('empty-over'); tile.addClass('empty'); }
        if (tile.hasClass('over')) { tile.removeClass('over'); }
      }
    }
  }

  dragEnd(e, pointer) {
    let that = this;
    let me = e.currentTarget;
    let { pageX: mouseX, pageY: mouseY } = pointer;
    let over = that.overID ? $(`player rack div tile[id="${that.overID}"]`) : false;
    if (over) {
      let offset = over.offset();
      if (mouseX > offset.left && mouseX < offset.left + over.width() && mouseY > offset.top && mouseY < offset.top + over.height()) {
        that.switchTiles(that.pickedUp, that.overID);
      }
      that.pickedUp = false;
      that.overID = false;
    }
    that.render($('player'));
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
