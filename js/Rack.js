import Tile from "./Tile.js";

export default class Rack {
  tiles = [];

  async render(pointer) {
    let tiles = this.tiles;
    let that = this;

    $('rack').remove();
    let rack = $(`
    <rack>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </rack>
    `);

    await pointer.prepend(rack);

    let pos = 0;
    rack.children('div').each(function () {
      let that = $(this);
      that.height(that.width());
      if (tiles[pos]) {
        let tile = tiles[pos];
        that.append(`<tile class="draggable"><char>${tile.char}</char><points>${tile.points}</points></tile>`);
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
      }
      pos++;
    });
    this.addDragEvents();
  }

  addTiles(tiles) {
    if (this.tiles.length + tiles.length <= 7) {
      tiles.forEach(tile => {
        this.addTile(tile);
      });
    }
  }

  addTile(tile) {
    if (this.tiles.length < 7) {
      this.tiles.push(tile);
    }
  }

  addDragEvents() {
    let that = this;

    $('.draggable').draggabilly({ containment: 'body' })
      .on('dragStart', (e) => that.dragStart(e))
      .on('dragMove', (pointer) => that.dragMove(pointer))
      .on('dragEnd', (e, pointer) => that.dragEnd(e, pointer));
  }

  dragStart(e) {
    console.log("Picked up ...");
  }

  dragMove(pointer) {
    let { pageX, pageY } = pointer;
    console.log(pageX + " : " + pageY);
  }

  dragEnd(e, pointer) {
    let that = this;

    console.log("Putted down ...");
    let me = e.currentTarget;
    me.remove();
    that.render($('panel'));
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
